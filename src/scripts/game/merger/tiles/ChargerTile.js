import * as PIXI from 'pixi.js';

import CircleCounter from '../../ui/hudElements/CircleCounter';
import MergeTile from './MergeTile';
import ProgressBar from '../ProgressBar';
import Signals from 'signals';
import UIBar from '../../ui/uiElements/UIBar';

export default class ChargerTile extends MergeTile {
    constructor(i, j, size, lockIcon, standardChargeTime = 2) {
        super(i, j, size, lockIcon);
        this.backShape.texture = PIXI.Texture.fromFrame('backTilesRound')

        this.defaultChargeTime = standardChargeTime;
        this.currentChargeTime = this.defaultChargeTime;

        this.onCompleteCharge = new Signals();


        this.levelBar = new UIBar();
        this.addChild(this.levelBar)
        this.levelBar.scale.set(0.3)
       
        this.levelBar.y = size - 20
        this.levelBar.x = size/2 - this.levelBar.width / 2 + 12


        this.circleCounter = new CircleCounter(size/2,size/2)
        this.container.addChildAt(this.circleCounter,0)
        this.circleCounter.alpha = 0.5
        this.circleCounter.build()

        this.circleCounter.x = size/2
        this.circleCounter.y = size/2

        this.container.removeChild(this.damageTimerView)

    }
    update(delta, timeStamp){
        super.update(delta, timeStamp);
        if(this.currentChargeTime > 0){
            this.currentChargeTime  -= delta;
            if(this.currentChargeTime <= 0){
                this.completeCharge();
            }else{
                this.tileSprite.visible = false;
            }
            this.levelBar.updatePowerBar(1-(this.currentChargeTime / this.defaultChargeTime))
            this.circleCounter.update(1-(this.currentChargeTime / this.defaultChargeTime))
            
        }
        this.levelBar.visible = false;

        this.label.visible = this.tileSprite.visible;
    }
    startCharging(){
        this.tileData = null;
        this.currentChargeTime = this.defaultChargeTime;
        this.levelBar.visible = false;
        this.levelBar.updatePowerBar(0, 0,true);
        this.circleCounter.update(0, true);
    }
    completeCharge(){
        this.tileSprite.visible = true;
        this.onCompleteCharge.dispatch();
    }
    lookAt(target) {
       
    }
}