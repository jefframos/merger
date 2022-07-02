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

        
        this.backContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('button-1'), 10, 10, 10, 10)
        this.backContainer.width = this.size.w
        this.backContainer.height = this.size.h
        this.backContainer.tint = 0x529898
        this.addChild(this.backContainer);


      
        this.shopList = new ShopList({ w: this.size.w, h: this.size.h * 0.8 }, 6)
        this.shopList.y = 100
        this.addChild(this.shopList);


        this.shopList.onItemShop.add(this.confirmItemShop.bind(this))

        this.openShop = new UIButton1(0, 'icon-close', 0xFFffff)
        this.addChild(this.openShop)
        this.openShop.x = this.size.w - this.openShop.width
        this.openShop.y = this.openShop.height
        this.openShop.onClick.add(() => {
            this.hide()
        })

        this.toggles = new UpgradesToggles({ w: this.size.w * 0.3, h: this.size.h * 0.05 })
        this.addChild(this.toggles);
        this.toggles.x = this.size.w / 2 - this.size.w * 0.15
        this.toggles.y = this.openShop.y - this.size.h * 0.025
        this.toggles.onUpdateValue.add(this.updateToggleValue.bind(this))

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
            if (currentEntities.indexOf(element.nameID) > -1) {
                element.unlockItem();
            } else {
                element.lockItem();
            }
            element.updatePreviewValue(this.toggles.currentActiveValue)
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
            let shopItem = new ShopItem({ w: this.size.w * 0.9, h: 70 })
            shopItem.setData(items[index])
            shopItem.nameID = items[index].rawData.nameID;
            this.currentItens.push(shopItem)
        }

        this.shopList.addItens(this.currentItens)
        this.shopList.x = this.size.w * 0.05
    }
}