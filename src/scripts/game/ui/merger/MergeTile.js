import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class MergeTile extends PIXI.Container {
    constructor(i, j, size, lockIcon) {
        super();

        this.id = {
            i: i,
            j: j
        }
        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.size = size;


        this.backSlot = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('party-slot'), 10, 10, 10, 10)
        this.backSlot.width = size
        this.backSlot.height = size

        this.container.addChild(this.backSlot)

        this.label = new PIXI.Text(i + '-' + j, LABELS.LABEL1);
        this.container.addChild(this.label)
        this.label.x = this.backSlot.width / 2 - this.label.width / 2;

        this.tileSprite = new PIXI.Sprite.from('');
        this.container.addChild(this.tileSprite)
        this.tileSprite.anchor.set(0.5, 1)
        this.tileSprite.visible = false;

        this.onClick = new Signals();
        this.onHold = new Signals();
        this.onUp = new Signals();
        this.onEndHold = new Signals();
        this.onGenerateResource = new Signals();

        this.backSlot.buttonMode = true;
        this.backSlot.interactive = true;
        this.backSlot.on('mousedown', this.onMouseDown.bind(this)).on('touchstart', this.onMouseDown.bind(this));
        this.backSlot.on('mouseover', this.onMouseMove.bind(this)).on('pointerover', this.onMouseMove.bind(this));
        this.backSlot.on('mouseout', this.onMouseCancel.bind(this)).on('touchout', this.onMouseCancel.bind(this));
        this.backSlot.on('mouseup', this.onMouseUp.bind(this))
            .on('touchend', this.onMouseUp.bind(this))
            .on('mouseupoutside', this.onMouseUp.bind(this))
            .on('touchendoutside', this.onMouseUp.bind(this));
        this.holdTimeout = 0;

        this.dir = 1;
        this.entityScale = 1;
        this.animSprite = false;

        this.lockIcon = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame(lockIcon), 10, 10, 10, 10)
        this.lockIcon.width = size
        this.lockIcon.height = size

        this.container.addChild(this.lockIcon)
        this.lockIcon.visible = false;

        this.generate = 0;
        this.isGenerator = false;


    }
    update(delta, dateTimeStamp) {
        if (this.animSprite) {
            this.sin += delta * 5;
            this.sin %= Math.PI * 2;
            this.tileSprite.scale.x = (this.entityScale * this.dir) + Math.sin(this.sin) * 0.02
            this.tileSprite.scale.y = this.entityScale + Math.cos(this.sin) * 0.02
        }

        if(this.updatedTimestamp){
            //console.log(dateTimeStamp - this.updatedTimestamp);

            this.generate = dateTimeStamp - this.updatedTimestamp
            if(this.generate >= 2){
                this.updatedTimestamp = (Date.now() / 1000 | 0);
                this.generateResource();
            }
        }
    }
    updateDir(mousePos) {
    	// let local = this.toLocal(mousePos)
    	// if(local.x < this.backSlot.width / 2){
    	// 	this.dir = -1;
    	// }else{
    	// 	this.dir = 1;
    	// }
    }
    generateResource() {
        this.onGenerateResource.dispatch(this, this.tileData);
    }
    showSprite() {
        if (!this.tileData) {
            return;
        }
        this.tileSprite.alpha = 1;
        this.tileSprite.visible = true;
        return this.tileSprite.texture;
    }
    removeEntity() {
        this.tileData = null;
        this.tileSprite.visible = false;
        this.animSprite = false;
        this.updatedTimestamp = null;
        this.generatedTimeStamp = null;
    }
    isEmpty(){
        if (!this.tileData) {
            return true;
        }
    }
    hideSprite() {
        if (!this.tileData) {
            return;
        }
        this.tileSprite.alpha = 0//.5

        return this.tileSprite.texture;
    }
    addEntity(tileData) {
    	//console.log(tileData);
        if (this.tileData) {
            return;
        } else {
            this.tileData = tileData;
        }
        this.generatedTimeStamp = (Date.now() / 1000 | 0);
        this.updatedTimestamp = (Date.now() / 1000 | 0);
        this.tileSprite.texture = PIXI.Texture.from(this.tileData.texture);
        this.tileSprite.x = this.backSlot.width / 2;
        this.tileSprite.y = this.backSlot.height / 2;
        this.entityScale = 1//Math.abs(this.backSlot.width / this.tileData.graphicsData.baseWidth * 0.75)
        this.tileSprite.scale.set(0, 2);
        this.sin = Math.random();
        this.showSprite()
        TweenLite.to(this.tileSprite.scale, 0.5, {
            x: this.entityScale * this.dir,
            y: this.entityScale,
            ease: Elastic.easeOut,
            onComplete:()=>{
            	this.animSprite = true;
            }
        })

    }
    onMouseMove(e) {
        if (this.holding) {
            return;
        }
        if (!this.mouseDown) {
            this.backSlot.tint = 0x00FFFF
        }
    }

    onMouseCancel(e) {
        if (this.holding) {
            return;
        }
        this.backSlot.tint = 0xFFFFFF
        if (!this.mouseDown) {
            return;
        }
        clearTimeout(this.holdTimeout)
        this.cancel = true;
        this.endHold();
    }
    onMouseUp(e) {
        if (!this.mouseDown) {
            this.onUp.dispatch(this);
            return;
        }
        this.mouseDown = false;
        if (this.cancel) {
            this.cancel = false;
            this.holding = false;
            return;
        }
        if (this.holding) {

            this.endHold();
            // console.log('onEndHold');
        } else {
            clearTimeout(this.holdTimeout)
            this.onClick.dispatch(this);
        }
    }
    onMouseDown(e) {
        this.mouseDown = true;
        if(this.lockIcon.visible){
            this.lockIcon.visible = false;
        }else{
            this.hold();
        }
        // this.holdTimeout = setTimeout(() => {
        // }, 200);
    }

    addLocker(){
        this.lockIcon.visible = true;
    }

    endHold() {
        this.holding = false;
        this.onEndHold.dispatch(this);
        this.backSlot.tint = 0xFFFFFF
    }

    hold() {
    	if(!this.tileData){
    		return;
    	}
        this.holding = true;
        this.onHold.dispatch(this);
        this.backSlot.tint = 0xFF0000

        // this.tileSprite.alpha = 0.5
    }

}