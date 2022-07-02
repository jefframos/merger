import * as PIXI from 'pixi.js';
import * as signals from 'signals';

export default class LetterSlot extends PIXI.Container {
	constructor(width = 50, height = 50, color = 0xaaaaaa) {
		super();

        this.backShapeBorder = new PIXI.mesh.NineSlicePlane(
			PIXI.Texture.fromFrame('button-1'), 15, 15, 15, 15)
		this.backShapeBorder.width = width
		this.backShapeBorder.height = height
		//this.backShapeBorder.pivot.set((width) / 2, (height) / 2)
        this.backShapeBorder.tint = color;
        this.addChild(this.backShapeBorder)
    }
}