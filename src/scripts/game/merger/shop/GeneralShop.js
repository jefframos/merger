import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import EntityShop from './EntityShop';

export default class GeneralShop extends EntityShop {
    constructor(mainSystem, size, border = 0) {
        super(mainSystem, size, border = 0)
    }

    confirmItemShop(item) {

        if(item.rawData.modifyer){
            console.log(item.rawData.modifyer, item.getResources())
        }


        window.gameModifyers.saveModifyers(item.rawData.modifyer, item.currentLevel, item.getResources())
        // this.mainSystem.forEach(resourceSystem => {
        //     resourceSystem.findUpgrade(item)
        // });

        // COOKIE_MANAGER.addMergePieceUpgrade(item);

    }
    show() {
        this.visible = true;
        this.currentItens.forEach(element => { 
            element.updatePreviewValue(this.toggles.currentActiveValue)
        });
    }
}