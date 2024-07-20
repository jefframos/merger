import * as PIXI from 'pixi.js';
import Signals from 'signals';
import ProgressBar from '../../ProgressBar';

export default class EntityShop extends PIXI.Container {
    constructor() {
        super()

        this.guySprite = PIXI.Sprite.from('helper')
        this.shipSprite = PIXI.Sprite.from('helpership')



        this.shine = new PIXI.Sprite.fromFrame('shine')
        this.shine.anchor.set(0.5)
        this.addChild(this.shine);
        this.shine.scale.set(5)
        this.shine.tint = 0xff9c00
        this.shine.x = 180
        this.shine.y = 130



        this.chargeTime = 60
        this.progress = this.chargeTime
        this.addChild(this.shipSprite)
        this.addChild(this.guySprite)
        this.guySprite.scale.set(1.5)
        this.guySprite.x = 50
        this.guySprite.y = 60

        this.buttonMode = true
        this.interactive = true
        this.on('mousedown', this.mouseDown.bind(this)).on('touchstart', this.mouseDown.bind(this));

        this.progressBar = new ProgressBar({ width: 200, height: 30 }, 10, 10)
        this.progressBar.updateBackgroundFront(0xff9c00)
        this.progressBar.updateBackgroundColor(0x383416)
        this.progressBar.x = 200
        this.progressBar.y = 100
        this.addChild(this.progressBar)


        this.videoSprite = PIXI.Sprite.from('video-icon2');
        this.addChild(this.videoSprite)
        this.videoSprite.scale.set(2)
        this.videoSprite.x = 190
        this.videoSprite.y = -50

        this.gamageIcon = PIXI.Sprite.from('bullets');
        this.addChild(this.gamageIcon)
        this.gamageIcon.scale.set(2)
        this.gamageIcon.x = 20
        this.gamageIcon.y = 220

        this.damageLabel = new PIXI.Text('SHOOT', LABELS.LABEL1);
        this.addChild(this.damageLabel)
        this.damageLabel.style.fontSize = 48
        this.damageLabel.style.stroke = 0//0xff9c00
        this.damageLabel.style.strokeThickness = 15
        this.damageLabel.x = 100
        this.damageLabel.y = 220

        this.onConfirm = new Signals();

        this.shootLabel = new PIXI.Text('SHOOT', LABELS.LABEL1);
        this.addChild(this.shootLabel)
        this.shootLabel.style.fill = 0xff9c00
        this.shootLabel.style.fontSize = 52
        this.shootLabel.style.stroke = 0
        this.shootLabel.style.strokeThickness = 15
        this.shootLabel.anchor.set(0.5)
        this.shootLabel.x = 300
        this.shootLabel.y = 180
    }
    updateDamage(value) {
        this.damageLabel.text = value + ' ' + window.localizationManager.getLabel('damage')
    }
    mouseDown() {
        if (this.progress > 0) {
            return
        }
        window.DO_REWARD(() => {
            setTimeout(() => {
                this.onConfirm.dispatch(this)
                this.progress = this.chargeTime
            }, 500);
        })
    }
    update(delta) {
        if (this.progress > 0) {
            this.progress -= delta
            this.progressBar.setProgressBar(1 - this.progress / this.chargeTime)
        }
        this.shootLabel.scale.set(Math.sin(window.timeTotal * 10) * 0.1 + 0.9, Math.cos(window.timeTotal * 10) * 0.1 + 0.9)

        this.videoSprite.visible = this.progress <= 0
        this.shootLabel.visible = this.progress <= 0
        this.shine.visible = this.progress <= 0

        this.shine.rotation = window.timeTotal % Math.PI * 2
    }
}