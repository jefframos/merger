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

        this.label = new PIXI.Text('', LABELS.LABEL1);
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
        this.onGenerateDamage = new Signals();

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



        this.generateResource = 0;
        this.generateResourceTime = -1;
        this.isGenerator = false;


        this.generateDamage = 0;
        this.generateDamageTime = -1;

        this.positionOffset = { x: 0, y: 0 }
        this.sin = Math.random();

    }

    updatePosition() {
        this.positionOffset.y = this.entityScale + Math.cos(this.sin) * 4

        this.tileSprite.x = this.backSlot.width / 2;
        this.tileSprite.y = this.backSlot.height / 2 + this.positionOffset.y;
    }
    update(delta, dateTimeStamp) {
        if (this.animSprite) {
            this.sin += delta;
            this.sin %= Math.PI * 2;
            this.updatePosition();


        }
//console.log(this.generateResourceTime)
        if (this.generateResourceTime > 0) {

            if (this.updatedResourceTimestamp) {
                this.generateResource = dateTimeStamp - this.updatedResourceTimestamp
                if (this.generateResource >= this.generateResourceTime / window.TIME_SCALE) {
                    this.updatedResourceTimestamp = (Date.now() / 1000 | 0);
                    this.resourceReady();
                }
            }
        }
        if (this.generateDamageTime > 0) {

            if (this.updatedDamageTimestamp) {
                this.generateDamage = dateTimeStamp - this.updatedDamageTimestamp
                if (this.generateDamage >= this.generateDamageTime / window.TIME_SCALE) {
                    this.updatedDamageTimestamp = (Date.now() / 1000 | 0);
                    this.damageReady();
                }
            }
        }
    }
    lookAt(target) {
        if(!this.tileSprite || !this.tileSprite.visible || !this.tileData){
            return;
        }
        let enemyGlobal = target.getGlobalPosition();
        let thisGlobal = this.tileSprite.getGlobalPosition();
        let angle = Math.atan2(thisGlobal.y - enemyGlobal.y, thisGlobal.x - enemyGlobal.x) - 3.14/2
        this.tileSprite.rotation = angle
    }
    resourceReady() {
        this.onGenerateResource.dispatch(this, this.tileData);
    }
    damageReady() {
        this.onGenerateDamage.dispatch(this, this.tileData);
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
        this.updatedResourceTimestamp = null;
        this.updatedDamageTimestamp = null;
        this.generateResourceTimeStamp = null;
        this.generateResourceTimeStamp = null;
        this.generateDamageTimeStamp = null;
        this.label.text = ''
    }
    isEmpty() {
        if (!this.tileData) {
            return true;
        }
    }
    hideSprite() {
        if (!this.tileData) {
            return;
        }
        this.tileSprite.alpha = 0//.5
        this.tileSprite.visible = false;
        return this.tileSprite.texture;
    }
    addEntity(tileData) {
        //console.log(tileData);
        if (this.tileData) {
            return;
        } else {
            this.tileData = tileData;
        }
        this.generateDamageTime = tileData.generateDamageTime | 0;
        this.generateResourceTime = tileData.generateResourceTime | 0;
        this.generateDamageTimeStamp = (Date.now() / 1000 | 0);
        this.generateResourceTimeStamp = (Date.now() / 1000 | 0);
        this.updatedResourceTimestamp = (Date.now() / 1000 | 0);
        this.updatedDamageTimestamp = (Date.now() / 1000 | 0);
        this.tileSprite.texture = PIXI.Texture.from(this.tileData.texture);
        this.updatePosition()
        this.entityScale = 1.5//Math.abs(this.backSlot.width / this.tileData.graphicsData.baseWidth * 0.75)
        this.tileSprite.scale.set(0, 2);
        this.tileSprite.anchor.set(0.5)
        this.sin = Math.random();
        this.label.text = this.tileData.value
        this.showSprite()
        TweenLite.to(this.tileSprite.scale, 0.5, {
            x: this.entityScale,
            y: this.entityScale,
            ease: Elastic.easeOut,
            onComplete: () => {
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
        if (this.lockIcon.visible) {
            this.lockIcon.visible = false;
        } else {
            this.hold();
        }
        // this.holdTimeout = setTimeout(() => {
        // }, 200);
    }

    addLocker() {
        this.lockIcon.visible = true;
    }

    endHold() {
        this.holding = false;
        this.onEndHold.dispatch(this);
        this.backSlot.tint = 0xFFFFFF
        this.label.visible = true
    }

    hold() {
        if (!this.tileData) {
            return;
        }
        this.label.visible = false
        this.holding = true;
        this.onHold.dispatch(this);
        this.backSlot.tint = 0xFF0000

        // this.tileSprite.alpha = 0.5
    }

}