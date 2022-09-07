import * as PIXI from 'pixi.js';
import * as signals from 'signals';

import TweenLite from 'gsap';
import utils from '../../utils';
import UIButton1 from './UIButton1';
import ProgressBar from '../merger/ProgressBar';

export default class TimeBonusButton extends PIXI.Container {
    constructor(texture = 'spiky-field', buttonSize = 65) {
        super();
        this.buttonSize = buttonSize;
        this.mainButton = new UIButton1(0x002299, texture, 0xFFFFFF, buttonSize, buttonSize, 'square-pattern1-bonus')
        this.mainButton.updateIconScale(0.5)
        this.mainButton.icon.x -=3
        this.mainButton.icon.y -=3
        this.mainButton.newItem = new PIXI.Sprite.fromFrame('new_item')
        this.mainButton.newItem.scale.set(0.7)
        this.mainButton.newItem.anchor.set(0)
        this.mainButton.newItem.position.set(-buttonSize / 2)
        this.mainButton.newItem.visible = false;
        this.mainButton.addChild(this.mainButton.newItem)
        this.addChild(this.mainButton)
        
        this.videoSprite = new PIXI.Sprite.fromFrame('video-trim')
        this.videoSprite.scale.set(0.5)
        this.videoSprite.y = 8
        this.addChild(this.videoSprite)
        //this.shopButtonsList.addElement(this.mainButton)
        this.mainButton.onClick.add(() => {
            this.activeTimer = this.bonusTime

            console.log(this.targetObject)
        })


        this.bonusTimer = new ProgressBar({ width: 64, height: 12 }, 3, 3)
        this.bonusTimer.updateBackgroundColor(0xffad0a)
        this.bonusTimer.x = 30 + 12
        this.bonusTimer.y = 32 - 65
        //this.bonusTimer = new CircleCounter(10,10)
        this.addChild(this.bonusTimer)
        this.bonusTimer.rotation = Math.PI * 0.5
        this.bonusTimer.visible = false;
        this.activeTimer = 0;
        this.bonusTime = 120;

        this.bonusLabel = new PIXI.Text('desc', LABELS.LABEL1);
        this.bonusLabel.style.fill = 0xffffff
        this.bonusLabel.style.aligh = 'right'
        this.bonusLabel.style.fontSize = 11
        this.bonusLabel.x = buttonSize / 2 - this.bonusLabel.width
        this.bonusLabel.y = -buttonSize / 2 - this.bonusLabel.height - 2
        this.addChild(this.bonusLabel);
    }
    updateIconScale(scale){
        this.mainButton.updateIconScale(scale)
        this.mainButton.icon.x = 0
        this.mainButton.icon.y = 0
        this.videoSprite.x = 8
        this.videoSprite.y = 15
    }
    update(delta) {
        if (this.activeTimer > 0) {
            this.bonusTimer.visible = true;
            this.activeTimer -= delta;
            this.bonusTimer.setProgressBar(this.activeTimer / this.bonusTime);
            if (this.activeTimer <= 0) {
                this.targetObject[this.param] = this.defaultValue;
            } else {
                this.targetObject[this.param] = this.targetValue;
            }
        } else {
            this.bonusTimer.visible = false;
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
