import * as PIXI from 'pixi.js';

import ShopItem from './ShopItem';
import ShopList from './ShopList';
import TweenMax from 'gsap';
import UIButton1 from '../../ui/UIButton1';
import UpgradesToggles from './UpgradesToggles';
import config from '../../../config';
import utils from '../../../utils';
import Signals from 'signals';

export default class EntityShop extends PIXI.Container {
    constructor(mainSystem, size, border = 0) {
        super()
        this.mainSystem = mainSystem;
        this.size = {
            w: config.width - 20,
            h: config.height - 80
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
            PIXI.Texture.fromFrame('small-no-pattern'), 10, 10, 10, 10)
        this.backContainer.width = this.size.w
        this.backContainer.height = this.size.h
        this.container.addChild(this.backContainer);

        this.tiledBackground2 = new PIXI.TilingSprite(PIXI.Texture.fromFrame('patter-square', 64, 64))
        this.container.addChild(this.tiledBackground2);
        this.tiledBackground2.width = this.size.w
        this.tiledBackground2.height = this.size.h
        // this.tiledBackground2.anchor.set(0.5)
        this.tiledBackground2.tileScale.set(0.2)
        this.tiledBackground2.alpha = 0.1

        this.title = new PIXI.Text('Resources Upgrades', LABELS.LABEL1);
        this.title.style.fontSize = 24

        this.portrait = new PIXI.Sprite.fromFrame('portraitMale');
        this.container.addChild(this.portrait);
        this.portrait.scale.set(0.65)
        this.portrait.anchor.set(0, 1)
        this.portrait.x = 20
        this.portrait.y = 102

        this.container.addChild(this.title);

        this.shopList = new ShopList({ w: this.size.w, h: this.size.h * 0.8 }, 6)
        this.shopList.y = 100
        this.container.addChild(this.shopList);


        this.shopList.onItemShop.add(this.confirmItemShop.bind(this))

        this.openShop = new UIButton1(0xFFffff, window.TILE_ASSSETS_POOL['image-X'], 0xFFffff, 60, 60, 'boss-button')
        this.openShop.updateIconScale(0.5)
        this.container.addChild(this.openShop)
        this.openShop.x = this.size.w - this.openShop.width
        this.openShop.y = this.size.h - this.openShop.height / 2 - 30
        this.openShop.onClick.add(() => {
            this.hide()
        })

        this.toggles = new UpgradesToggles({ w: this.size.w * 0.7, h: 60 })
        this.container.addChild(this.toggles);
        this.toggles.x = this.size.w / 2 - this.size.w * 0.35 - 30
        this.toggles.y = this.size.h - this.toggles.height - 30
        this.toggles.onUpdateValue.add(this.updateToggleValue.bind(this))

        window.gameEconomy.onMoneySpent.add(this.moneySpent.bind(this))

        this.onPurchase = new Signals();
        this.onPossiblePurchase = new Signals();


        this.isPossibleBuy = false;

        setTimeout(() => {

            this.updateToggleValue();
        }, 500);
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
        this.isPossibleBuy = false;
        this.currentItens.forEach(element => {
            element.updatePreviewValue(this.toggles.currentActiveValue)

            if (!this.isPossibleBuy && !element.isLocked) {
                this.isPossibleBuy = element.canBuyOne();
            }
        });

        //console.log(this.isPossibleBuy)
        this.onPossiblePurchase.dispatch(this.isPossibleBuy);
    }
    posShow() {
        utils.centerObject(this.title, this.container)
        //this.title.x = 140
        this.title.y = 40
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
            //element.unlockItem();
            element.show();
            element.updatePreviewValue(this.toggles.currentActiveValue)
        });

        this.posShow();


    }
    confirmItemShop(item, button, totalUpgrades) {

        //console.log(totalUpgrades)

        this.onPurchase.dispatch(item, button, totalUpgrades);
        this.mainSystem.forEach(resourceSystem => {
            resourceSystem.findUpgrade(item)
        });

        COOKIE_MANAGER.addResourceUpgrade(item);

    }
    addItems(items, skipCheck = false) {

        this.currentItens = []
        for (let index = 0; index < items.length; index++) {
            let shopItem = new ShopItem({ w: this.size.w * 0.95, h: 90 })
            shopItem.setData(items[index])
            shopItem.nameID = items[index].rawData.nameID;
            this.currentItens.push(shopItem)
        }

        this.shopList.addItens(this.currentItens)
        this.shopList.x = this.size.w * 0.025


        if (skipCheck) {
            return;
        }
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
        });

    }
}