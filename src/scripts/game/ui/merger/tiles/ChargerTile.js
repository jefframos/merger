import * as PIXI from 'pixi.js';
import Signals from 'signals';
import MergeTile from './MergeTile';
import ProgressBar from '../ProgressBar';
export default class ChargerTile extends MergeTile {
    constructor(i, j, size, lockIcon, standardChargeTime = 2) {
        super(i, j, size, lockIcon);

        this.defaultChargeTime = standardChargeTime;
        this.currentChargeTime = this.defaultChargeTime;

        this.onCompleteCharge = new Signals();

        this.progressBar = new ProgressBar({width: size, height:20});
        this.addChild(this.progressBar)
        this.progressBar.visible = false;

        this.progressBar.y = size

    }
    update(delta, timeStamp){
        super.update(delta, timeStamp);
        if(this.currentChargeTime > 0){
            this.currentChargeTime  -= delta;
            if(this.currentChargeTime <= 0){
                this.completeCharge();
                this.progressBar.visible = false;
            }
            this.progressBar.setProgressBar(1-(this.currentChargeTime / this.defaultChargeTime), 0x04ff09);
            
            
        }
    }
    startCharging(){
        this.tileData = null;
        this.currentChargeTime = this.defaultChargeTime;
        this.progressBar.visible = true;
        this.progressBar.setProgressBar(0, 0xFF00ff);
    }
    completeCharge(){
        this.onCompleteCharge.dispatch();
    }
    lookAt(target) {
       
    }
}