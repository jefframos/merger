import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import config from '../../../../config';
import UIButton1 from '../../UIButton1';
import ShopItem from './ShopItem';
import ShopList from './ShopList';

export default class EntityShop extends PIXI.Container {
    constructor(resourceSystem, size, border = 0) {
        super()
        this.resourceSystem = resourceSystem;
        this.size = {
            w: config.width * 0.8,
            h: config.height * 0.8
        }
        // this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, this.size.w, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        // this.prizeDark.alpha = 0.5;
        // this.prizeDark.interactive = true;
        // this.prizeDark.buttonMode = true;
        // this.prizeDark.on('mousedown', this.hideCallback.bind(this)).on('touchstart', this.hideCallback.bind(this));
        // this.addChild(this.prizeDark);

        this.backContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('button-2'), 10, 10, 10, 10)
        this.backContainer.width = this.size.w
        this.backContainer.height = this.size.h
        this.addChild(this.backContainer);

        this.shopList = new ShopList({ w: this.size.w, h: this.size.h * 0.8 })
        this.shopList.y = 100
        this.addChild(this.shopList);


        this.shopList.onItemShop.add(this.confirmItemShop.bind(this))
        //this.shopList.onShowInfo = new Signals();
        //this.shopList.onVideoItemShop = new Signals();


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
    }
    confirmItemShop(item) {
        this.resourceSystem.findUpgrade(item)
    }
    addItems(items) {

        this.currentItens = []
        for (let index = 0; index < items.length; index++) {
            let shopItem = new ShopItem({ w: this.size.w, h: 80 })
            shopItem.setData(items[index])
            this.currentItens.push(shopItem)
        }

        this.shopList.addItens(this.currentItens)
    }
}