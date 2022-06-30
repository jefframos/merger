import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import config from '../../../../config';
import UIButton1 from '../../UIButton1';
import ShopItem from './ShopItem';
import ShopList from './ShopList';

export default class EntityShop extends PIXI.Container {
    constructor(mainSystem, size, border = 0) {
        super()
        this.mainSystem = mainSystem;
        this.size = {
            w: config.width * 0.8,
            h: config.height * 0.8
        }

        this.backContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('button-2'), 10, 10, 10, 10)
        this.backContainer.width = this.size.w
        this.backContainer.height = this.size.h
        this.addChild(this.backContainer);

        this.shopList = new ShopList({ w: this.size.w, h: this.size.h * 0.8 })
        this.shopList.y = 100
        this.addChild(this.shopList);

        this.shopList.onItemShop.add(this.confirmItemShop.bind(this))

        this.openShop = new UIButton1(0xFFFFFF, 'icon-close', 0)
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
    confirmItemShop(item) {


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