import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import config from '../../../../config';
import UIButton1 from '../../UIButton1';
import ShopItem from './ShopItem';
import ShopList from './ShopList';
import UpgradesToggles from './UpgradesToggles';

export default class EntityShop extends PIXI.Container {
    constructor(mainSystem, size, border = 0) {
        super()
        this.mainSystem = mainSystem;
        this.size = {
            w: config.width * 0.8,
            h: config.height * 0.8
        }

        this.backContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('button-1'), 10, 10, 10, 10)
        this.backContainer.width = this.size.w
        this.backContainer.height = this.size.h
        this.backContainer.tint = 0x529898
        this.addChild(this.backContainer);


        this.toggles = new UpgradesToggles({ w: this.size.w * 0.8, h: this.size.h * 0.1 })
        this.addChild(this.toggles);
        this.shopList = new ShopList({ w: this.size.w, h: this.size.h * 0.8 })
        this.shopList.y = 100
        this.addChild(this.shopList);

        this.toggles.onUpdateValue.add(this.updateToggleValue.bind(this))

        this.shopList.onItemShop.add(this.confirmItemShop.bind(this))

        this.openShop = new UIButton1(0, 'icon-close', 0xFFffff)
        this.addChild(this.openShop)
        this.openShop.x = this.size.w - this.openShop.width
        this.openShop.y = this.openShop.height
        this.openShop.onClick.add(() => {
            this.hide()
        })

    }
    hideCallback() {
        this.hide();
    }
    hide() {
        this.visible = false;
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
            console.log(element.nameID)
            if (currentEntities.indexOf(element.nameID) > -1) {
                element.unlockItem();
            } else {
                element.lockItem();
            }
        });

    }
    confirmItemShop(item,button,totalUpgrades) {

        console.log(totalUpgrades)
        this.mainSystem.forEach(resourceSystem => {
            resourceSystem.findUpgrade(item)
        });

        COOKIE_MANAGER.addResourceUpgrade(item);

    }
    addItems(items) {

        this.currentItens = []
        for (let index = 0; index < items.length; index++) {
            let shopItem = new ShopItem({ w: this.size.w * 0.9, h: 80 })
            shopItem.setData(items[index])
            shopItem.nameID = items[index].rawData.nameID;
            this.currentItens.push(shopItem)
        }

        this.shopList.addItens(this.currentItens)
        this.shopList.x = this.size.w * 0.05
    }
}