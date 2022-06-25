import * as PIXI from 'pixi.js';
import Signals from 'signals';
import MergeTile from './MergeTile';
import ProgressBar from '../ProgressBar';
import utils from '../../../../utils';
export default class ResourceTile extends MergeTile {
    constructor(i, j, size, lockIcon) {
        super(i, j, size, lockIcon);

        this.onCompleteCharge = new Signals();

        this.progressBar = new ProgressBar({ width: size, height: 20 });
        this.addChild(this.progressBar)
        this.progressBar.visible = false;

        this.progressBar.y = size

        this.readyLabel = new PIXI.Text('Ready', LABELS.LABEL1);
        this.container.addChild(this.readyLabel)
        this.readyLabel.x = this.backSlot.width / 2 - this.label.width / 2;
        this.readyLabel.visible = false;


        this.priceLabel = new PIXI.Text('Ready', LABELS.LABEL1);
        this.container.addChild(this.priceLabel)
        this.priceLabel.x = this.backSlot.width / 2 - this.label.width / 2;
        this.priceLabel.visible = false;

        this.label.visible = false
        this.currentCollect = 0;

        this.progressBar = new ProgressBar({width: size, height:20});
        this.addChild(this.progressBar)
        this.progressBar.visible = false;

        this.progressBar.y = size - this.progressBar.height
    }
    update(delta, timestamp) {
        //console.log(timestamp)
        super.update(delta, timestamp);

        //console.log(this.generateResource ,this.generateResourceTime)
        this.readyLabel.visible = this.readyToCollect
        if(this.tileData){
            this.progressBar.visible = true;
            this.progressBar.setProgressBar(this.generateResourceNormal, 0xFF00ff);
        }else{
            this.progressBar.visible = false;
        }
    }
    updateResource(delta, dateTimeStamp) {
        if (this.readyToCollect && !this.tileData.shouldAccumulateResources()) {
            return;
        }
        super.updateResource(delta, dateTimeStamp)
    }
    startCharging() {
        this.tileData = null;
        this.currentChargeTime = this.defaultChargeTime;
        this.progressBar.visible = true;
        this.progressBar.setProgressBar(0, 0xFF00ff);
    }
    completeCharge() {
        this.onCompleteCharge.dispatch();
    }
    lookAt(target) {

    }
    resourceReady() {
        this.readyToCollect = true;

        this.currentCollect += this.tileData.getResources();

        this.readyLabel.text = utils.formatPointsLabel(this.currentCollect)
        this.readyLabel.x = this.backSlot.width - this.readyLabel.width ;
        //this.onGenerateResource.dispatch(this, this.tileData);
    }
    collectResources() {
        this.readyToCollect = false;
        this.generateResourceNormal = 0
        this.progressBar.setProgressBar(this.generateResourceNormal, 0xFF00ff);
    }
    onMouseMoveOver(forced = false) {
        this.overState()
        if ((this.isOver || forced) && this.readyToCollect) {
            this.onGenerateResource.dispatch(this, this.tileData, this.currentCollect);
            this.readyToCollect = false;
            this.currentCollect = 0;
        }
    }
    onMouseUp(e) {
        this.onMouseMoveOver(true)
        this.isOver = false;
        this.mouseDown = false;
        this.onUp.dispatch(this);
        
    }
    hold() {
        if (!this.tileData) {
            return;
        }
        this.label.visible = false
        this.holding = true;
        this.onHold.dispatch(this);
    }
    onMouseCancel(e) {
        this.isOver = false;    
        this.outState();
        if (!this.mouseDown) {
            return;
        }
    }
}