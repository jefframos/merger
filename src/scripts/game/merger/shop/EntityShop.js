import * as PIXI from 'pixi.js';

import ShopItem from './ShopItem';
import ShopList from './ShopList';
import TweenMax from 'gsap';
import UIButton1 from '../../ui/UIButton1';
import UpgradesToggles from './UpgradesToggles';
import config from '../../../config';

export default class EntityShop extends PIXI.Container {
    constructor(mainSystem, size, border = 0) {
        super()
        this.mainSystem = mainSystem;
        this.size = {
            w: config.width * 0.8,
            h: config.height * 0.8
        }

        this.currentItens = [];
        this.background = new PIXI.Graphics().beginFill(0).drawRect(-config.width * 5, -config.height * 5, config.width * 10, config.height * 10)
        this.addChild(this.background)
        this.background.alpha = 0.5;

        this.background.interactive = true;
        this.background.buttonMode = true;
        //this.background.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));

        this.container = new PIXI.Container();
        this.addChild(this.container)
        this.container.pivot.x = this.size.w / 2
        this.container.pivot.y = this.size.h / 2
        this.backContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('button-1'), 10, 10, 10, 10)
        this.backContainer.width = this.size.w
        this.backContainer.height = this.size.h
        this.backContainer.tint = 0x529898
        this.container.addChild(this.backContainer);



        this.shopList = new ShopList({ w: this.size.w, h: this.size.h * 0.8 }, 6)
        this.shopList.y = 100
        this.container.addChild(this.shopList);


        this.shopList.onItemShop.add(this.confirmItemShop.bind(this))

        this.openShop = new UIButton1(0xFFffff, window.TILE_ASSSETS_POOL['image-X'], 0xFFffff, 40, 40)
        this.openShop.updateIconScale(0.5)
        this.container.addChild(this.openShop)
        this.openShop.x = this.size.w - this.openShop.width
        this.openShop.y = this.openShop.height
        this.openShop.onClick.add(() => {
            this.hide()
        })

        this.toggles = new UpgradesToggles({ w: this.size.w * 0.7, h: this.size.h * 0.05 })
        this.container.addChild(this.toggles);
        this.toggles.x = this.size.w / 2 - this.size.w * 0.35
        this.toggles.y = this.openShop.y - this.size.h * 0.025
        this.toggles.onUpdateValue.add(this.updateToggleValue.bind(this))

        window.gameEconomy.onMoneySpent.add(this.moneySpent.bind(this))


    }
    confirm() {
        this.hide();
    }
    hideCallback() {
        this.hide();
    }
    hide() {
        this.visible = false;
        this.currentItens.forEach(element => {
            element.hide();
        });
    }
    moneySpent() {
        this.updateToggleValue();
    }
    updateToggleValue() {
        this.currentItens.forEach(element => {
            element.updatePreviewValue(this.toggles.currentActiveValue)
        });
    }
    show() {
        this.visible = true;

        let currentResources = COOKIE_MANAGER.getResources();

        let currentEntities = []
        for (const key in currentResources.entities) {
            const element = currentResources.entities[key];
            if (element.currentLevel) {
                currentEntities.push(key);
            }
        }
        this.currentItens.forEach(element => {
            if (currentEntities.indexOf(element.nameID) > -1) {
                element.unlockItem();
            } else {
                element.lockItem();
            }
            element.show();
            element.updatePreviewValue(this.toggles.currentActiveValue)
        });



    }
    confirmItemShop(item, button, totalUpgrades) {

        console.log(totalUpgrades)
        this.mainSystem.forEach(resourceSystem => {
            resourceSystem.findUpgrade(item)
        });

        COOKIE_MANAGER.addResourceUpgrade(item);

    }
    addItems(items) {

        this.currentItens = []
        for (let index = 0; index < items.length; index++) {
            let shopItem = new ShopItem({ w: this.size.w * 0.9, h: 70 })
            shopItem.setData(items[index])
            shopItem.nameID = items[index].rawData.nameID;
            this.currentItens.push(shopItem)
        }

        this.shopList.addItens(this.currentItens)
        this.shopList.x = this.size.w * 0.05
    }
}