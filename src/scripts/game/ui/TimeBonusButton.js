import * as PIXI from 'pixi.js';
import * as signals from 'signals';

import TweenLite from 'gsap';
import utils from '../../utils';
import UIButton2 from './UIButton2';
import ProgressBar from '../merger/ProgressBar';

export default class TimeBonusButton extends PIXI.Container {
    constructor(texture = 'spiky-field', buttonSize = 70, mainTexture = 'oct-pattern1-bonus-yellow') {
        super();
        this.mainTexture = mainTexture;
        this.buttonSize = buttonSize;
        this.mainButton = new UIButton2(0x002299, texture, 0xFFFFFF, buttonSize, buttonSize, this.mainTexture)
        this.mainButton.updateIconScale(0.7)


        this.shine = new PIXI.Sprite.fromFrame('shine')
        this.shine.anchor.set(0.5)
        this.addChild(this.shine);
        this.shine.scale.set(1.3)
        this.shine.tint = 0xffff00

        this.addChild(this.mainButton)

        this.videoSprite = new PIXI.Sprite.fromFrame('video-trim')
        this.videoSprite.anchor.set(0.5)
        this.videoSprite.scale.set(0.5)
        this.videoSprite.x = 0
        this.videoSprite.y = 30
        this.addChild(this.videoSprite)
        //this.shopButtonsList.addElement(this.mainButton)
        this.mainButton.onClick.add(() => {
            if (this.activeTimer > 0) return;
            this.activeTimer = this.bonusTime
            if (this.callback) {
                this.callback();
            }
            //console.log(this.targetObject)
        })

        this.mainButton.x = 0
        this.mainButton.y = 0
        this.bonusTimer = new ProgressBar({ width: 50, height: 10 }, 3, 3)
        this.bonusTimer.updateBackgroundFront(0x44550a)
        this.bonusTimer.updateBackgroundColor(0xffff0a)
        this.bonusTimer.x = -25 + 50
        this.bonusTimer.y = buttonSize * 0.5 + 5 + 10
        //this.bonusTimer = new CircleCounter(10,10)
        this.addChild(this.bonusTimer)
        this.bonusTimer.rotation = Math.PI
        this.bonusTimer.visible = false;
        this.activeTimer = 0;
        this.bonusTime = 120;

        this.bonusLabel = new PIXI.Text('', LABELS.LABEL1);
        this.bonusLabel.style.fill = 0xffffff
        this.bonusLabel.style.aligh = 'right'
        this.bonusLabel.style.fontSize = 11
        this.bonusLabel.x = buttonSize / 2 - this.bonusLabel.width
        this.bonusLabel.y = -buttonSize / 2 - this.bonusLabel.height - 2
        this.addChild(this.bonusLabel);
    }
    addCallback(callback) {
        this.callback = callback
    }
    updateIconScale(scale) {
        this.mainButton.updateIconScale(scale)
        this.mainButton.icon.x = 0
        this.mainButton.icon.y = 0
    }
    stop() {
        this.activeTimer = 0;
        this.targetObject[this.param] = this.defaultValue;
    }
    update(delta) {
        if (this.activeTimer > 0) {
            this.bonusTimer.visible = true;
            this.shine.visible = true;
            this.shine.rotation += delta * 50
            this.shine.rotation %= Math.PI * 2
            this.activeTimer -= delta;
            this.bonusTimer.setProgressBar(this.activeTimer / this.bonusTime);
            if (this.activeTimer <= 0) {
                this.targetObject[this.param] = this.defaultValue;
            } else {
                this.targetObject[this.param] = this.targetValue;
            }
            this.mainButton.backShape.texture = PIXI.Texture.fromFrame('oct-pattern1-bonus-yellow')
        } else {
            this.mainButton.backShape.texture = PIXI.Texture.fromFrame(this.mainTexture)
            this.bonusTimer.visible = false;
            this.shine.visible = false;
        }
    }
    setDescription(text) {
        this.bonusLabel.text = text;
        this.bonusLabel.x = this.buttonSize / 2 - this.bonusLabel.width
        this.bonusLabel.y = -this.buttonSize / 2 - this.bonusLabel.height - 2
    }
    setParams(object, param, defaultValue, targetValue, bonusTime = 120) {
        this.bonusTime = bonusTime;
        this.targetObject = object;
        this.param = param;
        this.defaultValue = defaultValue;
        this.targetValue = targetValue;
    }
}
