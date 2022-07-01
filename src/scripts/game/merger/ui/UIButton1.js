import * as PIXI from 'pixi.js';
import * as signals from 'signals';
import TweenLite from 'gsap';
import utils from '../../../utils';

export default class UIButton1 extends PIXI.Container {
	constructor(color, icon, iconColor = 0xFFFFFF, width = 50, height = 50) {
		super();

		this.w = width;
		this.h = height;

		this.mainContainer = new PIXI.Container();
		//this.backShape = PIXI.Sprite.fromImage('./assets/images/rect.png');
		if (!icon) {
			this.icon = new PIXI.Sprite();

		} else {

			this.icon = PIXI.Sprite.fromFrame(icon);
		}
		this.icon.tint = iconColor;

		// this.backShape = new PIXI.Graphics();
		// //this.backShape.lineStyle(3, color, 1);
		// this.backShape.beginFill(color);
		// this.backShape.drawRect(-width/2,-width/2,width,width);
		// this.backShape.endFill();
		// this.backShape.alpha = 1

		this.padding = 8;
		this.backShapeBorder = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('button-1'), 15, 15, 15, 15)
		this.backShapeBorder.width = width + this.padding
		this.backShapeBorder.height = height + this.padding
		this.backShapeBorder.pivot.set((width + this.padding) / 2, (height + this.padding) / 2)
		this.backShapeBorder.tint = iconColor;

		//this.backShape = PIXI.Sprite.fromFrame('largeCard.png')
		this.backShape = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('button-1'), 15, 15, 15, 15)
		this.backShape.width = width
		this.backShape.height = height
		this.backShape.pivot.set(width / 2, height / 2)
		//this.backShape.scale.set(width / this.backShape.width);
		//this.backShape.anchor.set(0.5)
		this.backShape.tint = color;

		//this.updateRotation(Math.PI * 0.25)

		this.icon.anchor.set(0.5);

		this.updateIconScale();
		this.mainContainer.addChild(this.backShapeBorder);
		this.mainContainer.addChild(this.backShape);
		this.mainContainer.addChild(this.icon);
		this.addChild(this.mainContainer);

		this.onClick = new signals.Signal()

		this.on('touchstart', this.click.bind(this));
		this.interactive = true;
		this.buttonMode = true;
	}
	changePivot(x, y) {
		this.backShapeBorder.pivot.set((this.w * x + this.padding) / 2, (this.h * y + this.padding) / 2)
		this.backShape.pivot.set(this.w * x / 2, this.h * y / 2)

		this.icon.x = this.w * x + this.w / 2
		this.icon.y = this.h * y + this.h / 2
	}
	disableState(color) {
		this.icon.alpha = 0.5
		this.backShape.tint = color;
	}
	enableState(color) {
		this.icon.alpha = 1
		this.backShape.tint = color;
	}
	addFrontShape() {
		this.backShape.y = -10
		this.backShapeBorder.y = 5
	}
	resize(width, height) {
		if (!width || !height) {
			return
		}
		this.backShapeBorder.width = width + this.padding
		this.backShapeBorder.height = height + this.padding
		this.backShapeBorder.pivot.set((width + this.padding) / 2)

		this.backShape.width = width
		this.backShape.height = height
		this.backShape.pivot.set(width / 2)


		this.updateIconScale();
	}
	updateIconScale(scale = 0.7) {

		utils.resizeToFitAR({
			width: this.backShape.width * scale,
			height: this.backShape.height * scale
		}, this.icon)

	}
	updateRotation(rot, invertIcon = false) {
		this.backShapeBorder.rotation = rot
		this.backShape.rotation = rot

		if (invertIcon) {
			this.icon.rotation = -rot
		}
	}
	setIconColor(color) {
		this.icon.tint = color;
	}
	setColor(color) {
		this.backShape.tint = color;
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

		this.backShape.tint = textColor;
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
	addLabelLeftMenu(label) {
		this.buttonLabel = new PIXI.Text(label, {
			font: '32px', fill: this.backShape.tint, align: 'right', fontWeight: '800', fontFamily: MAIN_FONT
		});
		this.buttonLabel.pivot.x = this.buttonLabel.width;
		this.buttonLabel.pivot.y = this.buttonLabel.height / 2;
		this.buttonLabel.x = -this.mainContainer.width * 0.55;

		if (!this.backLabelLeft) {
			this.backLabelLeft = new PIXI.mesh.NineSlicePlane(
				PIXI.Texture.fromFrame('smallButton.png'), 10, 10, 10, 10)
			this.backLabelLeft.tint = this.icon.tint;
		}

		this.backLabelLeft.width = this.buttonLabel.width - this.buttonLabel.x;
		this.backLabelLeft.height = this.backShape.height;
		this.backLabelLeft.x = - this.backLabelLeft.width - this.backShape.width / 2
		this.backLabelLeft.y = -this.backLabelLeft.height / 2// - this.backShape.height / 2
		this.addChildAt(this.backLabelLeft, 0);
		this.addChild(this.buttonLabel);
	}
	updateTexture(texture) {
		this.icon.texture = PIXI.Texture.fromFrame(texture);
		this.updateIconScale();
	}
}
