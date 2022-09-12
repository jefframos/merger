import * as PIXI from 'pixi.js';

import Signals from 'signals';
import UIButton1 from '../ui/UIButton1';
import config from '../../config';

export default class OpenChestPopUp extends PIXI.Container {
    constructor(label, screenManager) {
        super();
        this.screenManager = screenManager;
        this.label = label;
        this.onShow = new Signals();
        this.onHide = new Signals();
        this.onConfirm = new Signals();
        this.onClose = new Signals();

        this.container = new PIXI.Container();
        this.chestContainer = new PIXI.Container();
        this.openChestContainer = new PIXI.Container();

        this.w = config.width * 0.75;
        this.h = config.width * 0.65;

        this.background = new PIXI.Graphics().beginFill(0).drawRect(-config.width * 5, -config.height * 5, config.width * 10, config.height * 10)
        this.addChild(this.background)
        this.background.alpha = 0.5;

        this.background.interactive = true;
        this.background.buttonMode = true;
        //this.background.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));
        this.background.visible = false

        this.popUp = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('small-no-pattern'), 15, 15, 15, 15)
        this.popUp.width = this.w
        this.popUp.height = this.h

        this.popUp.pivot.x = this.popUp.width / 2
        this.popUp.pivot.y = this.popUp.height / 2
        // this.popUp.scale.set((this.size / this.popUp.width));
        this.popUp.alpha = 1;
        this.popUp.tint = 0xFFFFFF;
        // this.popUp.blendMode = PIXI.BLEND_MODES.ADD;

        this.container.interactive = true;
        this.container.addChild(this.popUp)
        this.container.x = 0//-this.container.width / 2;
        this.container.y = 0//-this.container.height / 2;
        this.addChild(this.container)
        this.container.addChild(this.chestContainer)
        this.container.addChild(this.openChestContainer)



        this.readyLabel = new PIXI.Text('Choose your prize', LABELS.LABEL_CHEST);
        this.readyLabel.style.fontSize = 18
        this.readyLabel.style.fill = 0xffffff
        this.readyLabel.pivot.x = this.readyLabel.width / 2;
        this.readyLabel.y = -40
        
        this.chestContainer.addChild(this.readyLabel)

        this.portrait = new PIXI.Sprite.fromFrame('portraitChest2')
        this.chestContainer.addChild(this.portrait)
        this.portrait.anchor.set(0.5,1)
        this.portrait.y = -40

        this.chest1 = new PIXI.Sprite.fromFrame('chest1')
        this.chestContainer.addChild(this.chest1)
        this.chest1.anchor.set(0.5)
        this.chest1.scale.set(0.6)
        this.chest1.x = -75
        this.chest1.y = this.h / 2 - 120
        
        this.chest1.on('mouseup', this.openNormalChest.bind(this));
        this.chest1.on('touchend', this.openNormalChest.bind(this));
        this.chest1.interactive = true;
        this.chest1.buttonMode = true;

        this.openLabel = new PIXI.Text('Open', LABELS.LABEL2);
        this.openLabel.style.fontSize = 22
        this.openLabel.style.fill = 0xffffff
        this.openLabel.pivot.x = this.openLabel.width / 2;
        this.openLabel.pivot.y = this.openLabel.height / 2;
        this.openLabel.y = 65
        this.chest1.addChild(this.openLabel)
        
        
        this.chest2 = new PIXI.Sprite.fromFrame('chest3')
        this.chest2.anchor.set(0.5)
        this.chestContainer.addChild(this.chest2)
        this.chest2.x = 75
        this.chest2.y = this.h / 2 - 120
        
        this.chest2.on('mouseup', this.openVideoChest.bind(this));
        this.chest2.on('touchend', this.openVideoChest.bind(this));
        this.chest2.interactive = true;
        this.chest2.buttonMode = true;
        
        this.watchToOpen = new PIXI.Text('Open', LABELS.LABEL_CHEST);
        this.watchToOpen.style.fontSize = 14
        this.watchToOpen.style.stroke = 0x0090ff
        this.watchToOpen.style.fill = 0xffffff
        this.watchToOpen.pivot.x = this.watchToOpen.width / 2- 30;
        this.watchToOpen.pivot.y = this.watchToOpen.height / 2;
        this.watchToOpen.y = 60
        this.chest2.addChild(this.watchToOpen)
        this.video = new PIXI.Sprite.fromFrame('video-trim')
        this.video.anchor.set(0.5)
        this.video.x = -this.video.width / 2 - 5;
        this.video.y = this.watchToOpen.height / 2;
        this.watchToOpen.addChild(this.video)
        
        this.container.visible = false;

        this.readySin = 0;

    }
    openNormalChest() {
        this.close()
    }
    openVideoChest() {
        this.close()
    }
    update(delta) {
        this.readySin += delta * 8
        this.chest2.scale.set(Math.sin(this.readySin) * 0.05 + 0.95)
    }
    show(param) {
        this.visible = true;

        this.isShowing = true;
        this.container.visible = true;
        this.chestContainer.visible = true;
        this.background.visible = true;
        this.openChestContainer.visible = false;
        this.toRemove = false;
        this.onShow.dispatch(this);
        this.portrait.texture = new PIXI.Texture.fromFrame('portraitChest' + Math.ceil(Math.random()*3))
        if (param) {
            this.confirmCallback = param.onConfirm;
            this.cancelCallback = param.onCancel;
        } else {
            this.confirmCallback = null;
            this.cancelCallback = null;
        }
        //this.readyLabel.text = param ? param.label : ''
        this.readyLabel.pivot.x = this.readyLabel.width / 2;
        
        this.background.alpha = 0.5
        this.container.alpha = 1
        this.popUp.scale.x = 1
        this.popUp.scale.y = 1
    }
    afterHide() {

    }
    hide(dispatch = true, callback = null) {
        if (!this.isShowing) {
            return;
        }
        this.isShowing = false;

        TweenLite.to(this.background, 0.25, { alpha: 0 });
        TweenLite.to(this.container, 0.25, { alpha: 0 });
        TweenLite.to(this.popUp.scale, 0.25,
            {
                x: 0,
                y: 1.5,
                ease: Back.easeIn,
                onComplete: () => {
                    if (dispatch) {
                        this.onHide.dispatch(this);
                    }
                    if (callback) {
                        callback();
                    }
                    this.afterHide();
                    this.toRemove = true

                    this.visible = false;
                }
            })
    }
    confirm() {
        this.onConfirm.dispatch(this);
        this.hide();
    }
    close() {
        this.onClose.dispatch(this);
        this.hide();
    }
}