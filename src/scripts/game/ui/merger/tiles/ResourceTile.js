import * as PIXI from 'pixi.js';
import Signals from 'signals';
import MergeTile from './MergeTile';
import utils from '../../../../utils';
import UIBar from '../../uiElements/UIBar';
export default class ResourceTile extends MergeTile {
    constructor(i, j, size, lockIcon) {
        super(i, j, size, lockIcon);

        this.onCompleteCharge = new Signals();

        this.resourceSource = new PIXI.Sprite.fromFrame('backTiles')
        this.container.addChildAt(this.resourceSource, 0)
        this.resourceSource.anchor.set(0.5)
        this.resourceSource.x = size / 2
        this.resourceSource.y = size / 2
        this.resourceSource.visible = false;

        this.readyLabel = new PIXI.Text('Ready', LABELS.LABEL1);
        this.container.addChild(this.readyLabel)
        this.readyLabel.x = this.backSlot.width / 2 - this.label.width / 2;
        this.readyLabel.visible = false;


        this.priceLabel = new PIXI.Text('Ready', LABELS.LABEL1);
        this.container.addChild(this.priceLabel)
        this.priceLabel.x = this.backSlot.width / 2 - this.label.width / 2;
        this.priceLabel.visible = false;


        this.initialCostLabel = new PIXI.Text('Ready', LABELS.LABEL1);
        this.container.addChild(this.initialCostLabel)
        this.initialCostLabel.style.stroke = 0
        this.initialCostLabel.style.strokeThickness = 6
        this.initialCostLabel.x = this.backSlot.width / 2 - this.initialCostLabel.width / 2;
        this.initialCostLabel.y = this.backSlot.height / 2 - this.initialCostLabel.height / 2;
        //this.initialCostLabel.visible = false;

        this.label.visible = false
        this.currentCollect = 0;


        this.levelBar = new UIBar();
        this.addChild(this.levelBar)
        this.levelBar.scale.set(0.3)

        this.levelBar.y = size - 20
        this.levelBar.x = size / 2 - this.levelBar.width / 2 + 12

        this.particleCounter = 0

    }

    update(delta, timestamp) {
        //console.log(timestamp)
        super.update(delta, timestamp);
        
        //console.log(this.generateResource ,this.generateResourceTime)
        this.readyLabel.visible = this.readyToCollect
        if (this.tileData) {
            this.sin += delta * 20
            this.levelBar.visible = true;
            this.levelBar.updatePowerBar(this.generateResourceNormal, 0, true);
            this.initialCostLabel.visible = false;
            if (this.particleCounter <= 0) {
                this.onShowParticles.dispatch(this)
                this.particleCounter = 1
            } else {
                this.particleCounter -= delta;
            }
        } else {
            this.levelBar.visible = false;
            this.initialCostLabel.visible = true;
            this.sin += delta
            this.updateResourcePosition();
        }

    }
    forcePriceToZero() {
        this.updatePriceLabel(utils.formatPointsLabel(0))
        this.initialCost = 0;
    }
    setTargetData(data) {
        this.targetData = data;

        if (this.targetData.rawData.tileImageSrc) {
            this.resourceSource.texture = PIXI.Texture.fromFrame(this.targetData.rawData.tileImageSrc)
            this.resourceSource.visible = true;
            this.resourceSource.scale.set(this.size / this.resourceSource.width)
        }
        this.updatePriceLabel(utils.formatPointsLabel(this.targetData.rawData.initialCost))
        this.initialCost = this.targetData.rawData.initialCost
    }
    updatePriceLabel(value) {
        this.initialCostLabel.text = value
        this.initialCostLabel.x = this.backSlot.width / 2 - this.initialCostLabel.width / 2;
        this.initialCostLabel.y = this.backSlot.height - this.initialCostLabel.height * 2;
    }
    addEntity(tile) {
        super.addEntity(tile);
    }
    updatePosition() {

        if(this.tileData){
            if(this.tileData.isRight){

                this.positionOffset.x = 60 + this.entityScale + Math.cos(this.sin) * 4
            }else{
                
                this.positionOffset.x = -60 - this.entityScale + Math.cos(this.sin) * 4

                this.tileSprite.scale.x = Math.abs(this.tileSprite.scale.x) * -1
            }
        }

        this.resourceSource.x = this.backSlot.height / 2 + Math.sin(this.sin) 

        this.tileSprite.x = this.backSlot.width / 2 + this.positionOffset.x;
        this.tileSprite.y = this.backSlot.height / 2 + this.positionOffset.y;
    }
    updateResourcePosition(){
        this.resourceSource.y = this.backSlot.height / 2 + Math.sin(this.sin) *5
    }
    enterAnimation() {
        this.entityScale = this.size / this.tileSprite.width * 0.4
        TweenLite.to(this.tileSprite.scale, 0.5, {
            x: this.tileData.isRight ? this.entityScale: -this.entityScale,
            y: this.entityScale,
            ease: Elastic.easeOut,
            onComplete: () => {
                this.animSprite = true;
            }
        })
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
        this.levelBar.visible = true;
        this.levelBar.updatePowerBar(0, 0, true);
    }
    completeCharge() {
        this.onCompleteCharge.dispatch();
    }
    lookAt(target) {

    }
    updateSavedStats(stats) {
        this.tileData.setLevel(stats.currentLevel)


        // let timePassed = (Date.now() / 1000 | 0) - stats.latestResourceCollect


        // let rps = this.tileData.getRPS();
        // this.updatedDamageTimestamp = stats.latestResourceCollect

        // //console.log(timePassed,  rps)
        // let timeToCollect = this.tileData.getGenerateResourceTime()

        // //console.log(Math.floor(timePassed / timeToCollect) - timePassed % timeToCollect)
        // if (timePassed > timeToCollect) {
        //     this.currentCollect = Math.floor(rps) * timePassed
        //     this.resourceReady();
        // }
    }
    resourceReady() {
        this.readyToCollect = true;

        this.currentCollect += this.tileData.getResources();

        if (this.tileData.getGenerateResourceTime() > 0.1) {
            COOKIE_MANAGER.addPendingResource(this.tileData, this.currentCollect)
        }

        this.readyLabel.text = utils.formatPointsLabel(this.currentCollect)
        this.readyLabel.x = this.backSlot.width - this.readyLabel.width;
        //this.onGenerateResource.dispatch(this, this.tileData);
    }
    collectResources() {
        this.readyToCollect = false;
        this.generateResourceNormal = 0
        this.levelBar.updatePowerBar(this.generateResourceNormal, 0);
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