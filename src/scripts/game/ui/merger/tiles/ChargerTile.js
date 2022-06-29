import * as PIXI from 'pixi.js';
import Signals from 'signals';
import MergeTile from './MergeTile';
import ProgressBar from '../ProgressBar';
import UIBar from '../../uiElements/UIBar';
export default class ChargerTile extends MergeTile {
    constructor(i, j, size, lockIcon, standardChargeTime = 2) {
        super(i, j, size, lockIcon);

        this.defaultChargeTime = standardChargeTime;
        this.currentChargeTime = this.defaultChargeTime;

        this.onCompleteCharge = new Signals();


        this.levelBar = new UIBar();
        this.addChild(this.levelBar)
        this.levelBar.scale.set(0.3)
       
        this.levelBar.y = size - 20
        this.levelBar.x = size/2 - this.levelBar.width / 2 + 12

    }
    update(delta, timeStamp){
        super.update(delta, timeStamp);
        if(this.currentChargeTime > 0){
            this.currentChargeTime  -= delta;
            if(this.currentChargeTime <= 0){
                this.completeCharge();
                this.levelBar.visible = false;
            }
            this.levelBar.updatePowerBar(1-(this.currentChargeTime / this.defaultChargeTime))
            
        }
    }
    startCharging(){
        this.tileData = null;
        this.currentChargeTime = this.defaultChargeTime;
        this.levelBar.visible = true;
        this.levelBar.updatePowerBar(0, 0,true);
    }
    completeCharge(){
        this.onCompleteCharge.dispatch();
    }
    lookAt(target) {
       
    }
}