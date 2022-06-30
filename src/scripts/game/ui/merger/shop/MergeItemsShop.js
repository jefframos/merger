import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import config from '../../../../config';
import UIButton1 from '../../UIButton1';
import EntityShop from './EntityShop';
import ShopItem from './ShopItem';
import ShopList from './ShopList';

export default class MergeItemsShop extends EntityShop {
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
        let currentResources = COOKIE_MANAGER.getBoard();
        let currentEntities = []
        for (const key in currentResources.entities) {
            const element = currentResources.entities[key];
            if (element && element.nameID) {
                currentEntities.push(element.nameID);
            }
        }

        let found = false;
        for (let index = this.currentItens.length-1; index >=0 ; index--) {
            const element = this.currentItens[index];

            if (found || currentEntities.indexOf(element.nameID) > -1) {
                element.unlockItem();
                found = true;
            }else {
                element.lockItem();
            }
            
        }
        
    }
}