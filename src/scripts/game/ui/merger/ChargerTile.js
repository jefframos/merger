import * as PIXI from 'pixi.js';
import Signals from 'signals';
import MergeTile from './MergeTile';
export default class ChargerTile extends MergeTile {
    constructor(i, j, size, lockIcon, standardChargeTime = 2) {
        super(i, j, size, lockIcon);

        this.defaultChargeTime = standardChargeTime;
        this.currentChargeTime = this.defaultChargeTime;

        this.onCompleteCharge = new Signals();

    }
    update(delta){
        super.update(delta);
        if(this.currentChargeTime > 0){
            this.currentChargeTime  -= delta;
            if(this.currentChargeTime <= 0){
                this.completeCharge();
            }
        }
    }
    startCharging(){
        this.currentChargeTime = this.defaultChargeTime;
    }
    completeCharge(){
        this.onCompleteCharge.dispatch();
    }
}