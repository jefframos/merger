import * as PIXI from 'pixi.js';
import * as signals from 'signals';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';

export default class UILabelButton1 extends PIXI.Container {
    constructor(width = 60, height = 40) {
        super();

        this.mainContainer = new PIXI.Container();
        //this.backShape = PIXI.Sprite.fromImage('./assets/images/rect.png');



        // this.backShape = new PIXI.Graphics();






        this.padding = 8;
        this.backShapeBorder = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('small-no-pattern-green'), 10, 10, 10, 10)
        this.backShapeBorder.width = width + this.padding
        this.backShapeBorder.height = height + this.padding




        this.mainContainer.addChild(this.backShapeBorder);

        this.addChild(this.mainContainer);



        this.onClick = new signals.Signal()

        this.on('touchstart', this.click.bind(this));
        this.interactive = true;
        this.buttonMode = true;
    }
    addFrontShape() {

        this.backShapeBorder.y = 5
    }
    resize(width, height) {
        if (!width || !height) {
            return
        }
        this.backShapeBorder.width = width + this.padding
        this.backShapeBorder.height = height + this.padding
        this.backShapeBorder.pivot.set((width + this.padding) / 2)

    }
    updateRotation(rot, invertIcon = false) {
        this.backShapeBorder.rotation = rot


        if (invertIcon) {
            this.icon.rotation = -rot
        }
    }
    setIconColor(color) {
        this.icon.tint = color;
    }
    setColor(color) {

    }
    click() {
        this.onClick.dispatch();
        //window.SOUND_MANAGER.play('tap2', { volume: 0.5 })
    }
    updateTextColor(color) {
        if (this.buttonLabel) {
            this.buttonLabel.style.fill = color;
        }
    }
    replaceIcon(icon) {
        if (this.icon && this.icon.parent) {
            this.icon.parent.removeChild(this.icon);
        }
        this.icon = icon;
        this.mainContainer.addChild(this.icon);

    }
    updateMenuColors(textColor, backgroundColor) {
        this.backShapeBorder.tint = backgroundColor;
        this.icon.tint = backgroundColor;

        if (this.backLabelLeft) {
            this.backLabelLeft.tint = backgroundColor;
        }

        if (this.buttonLabel) {
            this.buttonLabel.style.fill = textColor;
        }


    }
    addLabelRight(label, color = 0xFFFFFF) {
        this.buttonLabel = new PIXI.Text(label, { font: '18px', fill: color, align: 'left', fontWeight: '300', fontFamily: MAIN_FONT });
        this.buttonLabel.pivot.x = 0//this.buttonLabel.width;
        this.buttonLabel.pivot.y = this.buttonLabel.height / 2;
        this.buttonLabel.x = this.mainContainer.width * 0.5 + 5;
        this.addChild(this.buttonLabel);
    }
    addLabelLeft(label, color = 0xFFFFFF) {
        this.buttonLabel = new PIXI.Text(label, { font: '18px', fill: color, align: 'right', fontWeight: '300', fontFamily: MAIN_FONT });
        this.buttonLabel.pivot.x = this.buttonLabel.width;
        this.buttonLabel.pivot.y = this.buttonLabel.height / 2;
        this.buttonLabel.x = -this.mainContainer.width * 0.5 - 5;
        this.addChild(this.buttonLabel);
    }
    addCenterLabel(label, color = 0xFFFFFF, fit = 0) {
        this.buttonLabel = new PIXI.Text(label, { font: '18px', fill: color, align: 'center', fontWeight: '300', fontFamily: MAIN_FONT });
        if(fit){
            this.buttonLabel.scale.set(this.backShapeBorder.width / this.buttonLabel.width * fit)
        }
        this.buttonLabel.pivot.x = this.buttonLabel.width / 2 * this.buttonLabel.scale.x;
        this.buttonLabel.pivot.y = this.buttonLabel.height / 2 * this.buttonLabel.scale.y;
        this.buttonLabel.x = this.backShapeBorder.width / 2 * this.buttonLabel.scale.x;
        this.buttonLabel.y = this.backShapeBorder.height / 2 * this.buttonLabel.scale.y;
        this.addChild(this.buttonLabel);
    }
    updateTexture(texture) {
        this.icon.texture = PIXI.Texture.fromFrame(texture);

    }
}
