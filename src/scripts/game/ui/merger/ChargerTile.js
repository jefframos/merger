import * as PIXI from 'pixi.js';
import Signals from 'signals';
import MergeTile from './MergeTile';
export default class ChargerTile extends MergeTile {
    constructor(i, j, size, lockIcon) {
        super(i, j, size, lockIcon);

        this.defaultChargeTime = 2;
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