import * as PIXI from 'pixi.js';

import Signals from 'signals';
import UIButton1 from '../ui/UIButton1';
import config from '../../config';

export default class StandardPop extends PIXI.Container
{
    constructor(label, screenManager)
    {
        super();
        this.screenManager = screenManager;
        this.label = label;
        this.onShow = new Signals();
        this.onHide = new Signals();
        this.onConfirm = new Signals();
        this.onClose = new Signals();

        this.container = new PIXI.Container();

        this.w = config.width * 0.5;
        this.h = config.width * 0.5;

        this.background = new PIXI.Graphics().beginFill(0).drawRect(-config.width * 5, -config.height * 5,config.width*10, config.height * 10) 
        this.addChild(this.background)
        this.background.alpha = 0.5;

        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));
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

     

        this.readyLabel = new PIXI.Text('!', LABELS.LABEL2);
        this.readyLabel.style.fontSize = 14
        this.readyLabel.style.fill = 0xffffff
        this.readyLabel.pivot.x = this.readyLabel.width / 2;
        this.readyLabel.pivot.y = this.readyLabel.height  / 2 + 45
        this.container.addChild(this.readyLabel)
        this.confirmButton = new UIButton1(null,'video-icon', 0xffffff, 85, 65, 'small-no-pattern-green')
        this.container.addChild(this.confirmButton)
        this.confirmButton.x = 75
        this.confirmButton.y = this.h / 2 - 60
        this.confirmButton.onClick.add(()=>{
            if(this.confirmCallback){
                this.confirmCallback()
                this.confirm()
            }
        })
        this.cancelButton = new UIButton1(null,'icon-close', 0xffffff, 85, 65, 'small-no-pattern-grey')
        this.container.addChild(this.cancelButton)
        this.cancelButton.x = -75
        this.cancelButton.y = this.h / 2 - 60

        this.cancelButton.updateIconScale(0.4)
        this.cancelButton.onClick.add(()=>{
            if(this.cancelCallback){
                this.cancelCallback()
                this.cancelButton()

            }
        })

        this.container.visible = false;

        this.readySin = 0;

    }
    update(delta){
        this.readySin += delta * 8
        this.confirmButton.scale.set(Math.sin(this.readySin) * 0.05 + 0.95)
    }
    show(param)
    {
        this.visible = true;

        this.isShowing = true;
        this.container.visible = true;
        this.background.visible = true;
        this.toRemove = false;
        this.onShow.dispatch(this);
        
        if(param){
            this.confirmCallback = param.onConfirm;
            this.cancelCallback = param.onCancel;            
        }else{
            this.confirmCallback = null;
            this.cancelCallback = null;
        }
        this.readyLabel.text = param?param.label:''
        this.readyLabel.pivot.x = this.readyLabel.width / 2;
        this.readyLabel.pivot.y = this.readyLabel.height  / 2 + 45

    }
    afterHide(){

    }
    hide(dispatch = true, callback = null)
    {
        if(!this.isShowing){
            return;
        }
        this.isShowing = false;

        TweenLite.to(this.background, 0.25, {alpha:0});
        TweenLite.to(this.container, 0.25, {alpha:0});
        TweenLite.to(this.popUp.scale, 0.25,
        {
            x: 0,
            y: 1.5,
            ease: Back.easeIn,
            onComplete: () =>
            {
                if(dispatch){
        		  this.onHide.dispatch(this);
                }
                if(callback){
                    callback();
                }
                this.afterHide();
                this.toRemove = true

                this.visible = false;
            }
        })
    }
    confirm()
    {
        this.onConfirm.dispatch(this);
        this.hide();
    }
    close()
    {
        this.onClose.dispatch(this);
        this.hide();
    }
}