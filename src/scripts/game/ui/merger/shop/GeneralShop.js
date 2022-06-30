import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import config from '../../../../config';
import UIButton1 from '../../UIButton1';
import EntityShop from './EntityShop';
import ShopItem from './ShopItem';
import ShopList from './ShopList';

export default class GeneralShop extends EntityShop {
    constructor(mainSystem, size, border = 0) {
        super(mainSystem, size, border = 0)
    }

    confirmItemShop(item) {

        this.mainSystem.forEach(resourceSystem => {
            resourceSystem.findUpgrade(item)
        });

        COOKIE_MANAGER.addMergePieceUpgrade(item);

    }
    show() {
        this.visible = true;      
    }
}