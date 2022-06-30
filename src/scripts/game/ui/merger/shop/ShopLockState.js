

import * as PIXI from 'pixi.js';
import Signals from 'signals';
import UIList from '../../uiElements/UIList';
export default class ShopLockState extends PIXI.Container {
    constructor(width, height) {
        super()
        this.backShape = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('progressBarSmall'), 10, 10, 10, 10)
        this.backShape.width = width
        this.backShape.height = height 
        this.addChild(this.backShape)


            this.lockList = new UIList()
            this.lockList.w = width;
            this.lockList.h = height;

            this.addChild(this.lockList);

            this.lockIcon = new PIXI.Sprite.fromFrame('results_lock')
            this.lockList.addElement(this.lockIcon)
            
            this.labelContainer = new PIXI.Container();
            this.infoLabel = new PIXI.Text('Unlock this upgrade at level XXXX', LABELS.LABEL2);
            this.labelContainer.addChild(this.infoLabel);
            this.infoLabel.style.fontSize = 12
            this.labelContainer.listScl = 0.75;
            this.lockList.addElement(this.labelContainer)

            this.lockList.updateHorizontalList()
    }
}