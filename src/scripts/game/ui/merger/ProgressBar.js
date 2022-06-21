import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';

export default class ProgressBar extends PIXI.Container {
    constructor(size, border = 0) {
        super();

        this.barContainer = new PIXI.Container();

        this.addChild(this.barContainer);
        this.infoLabel = new PIXI.Text('COMPLETE', { font: '16px', fill: 0xFF0000});
        this.infoLabel.pivot.x = this.infoLabel.width / 2
        this.infoLabel.pivot.y = this.infoLabel.height / 2
        this.barContainer.addChild(this.infoLabel)

        this.infoLabel.x = 125
        this.infoLabel.y = 19

        this.round = border?border:size.height / 2
        this.sizeHeight = size.height
        this.sizeWidth = size.width

        
        this.loadingBar = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('progressBarSmall'), 10, 10, 10, 10)
        this.loadingBar.width = this.sizeWidth
        this.loadingBar.height = this.sizeHeight
        
        this.loadingBarFillBack = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('progressBarSmall'), 10, 10, 10, 10)
        this.loadingBarFillBack.width = this.sizeWidth- this.round / 2
        this.loadingBarFillBack.height = this.sizeHeight- this.round / 2
        this.loadingBarFillBack.tint = 0;
        
        this.loadingBarFillBack.x = this.round / 4
        this.loadingBarFillBack.y = this.round / 4
        this.loadingBarFillBack.cacheAsBitmap = true;

        this.loadingBarFill = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('progressBarSmall'), 10, 10, 10, 10)
        this.loadingBarFill.width = 0
        this.loadingBarFill.height = this.sizeHeight- this.round / 2
        this.loadingBarFill.tint = 0xFF0011;
        this.loadingBarFill.x = this.round / 4
        this.loadingBarFill.y = this.round / 4

        this.loadingBarFill.visible = false;
        //this.loadingBarFill.scale.x = 0;

        this.infoLabel.visible = false;

        this.barContainer.addChild(this.loadingBar)
        this.barContainer.addChild(this.loadingBarFillBack)
        this.barContainer.addChild(this.loadingBarFill)

        this.currentValue = 0;
        this.state = 0;


    }

    updateBackgroundColor(color, alpha = 1){
        this.loadingBarFillBack.tint = color;
        this.loadingBarFillBack.alpha = alpha;
    }
    updateBackgroundFront(color){
        this.currentColor = color;
        this.loadingBarFill.tint = color;
    }

    resizeBar(width, height = 30, hideBorder = false){
        if(width == this.sizeWidth){
            return;
        }
        this.sizeHeight = height;
        this.sizeWidth = width;
        this.loadingBar.width = this.sizeWidth
        this.loadingBar.height = this.sizeHeight

        let add = this.round / 2
        if(hideBorder){
            add = 0;
            this.loadingBarFillBack.position.set(0)
            this.loadingBarFill.position.set(0)
        }
        this.loadingBarFillBack.width = this.sizeWidth- add
        this.loadingBarFillBack.height = this.sizeHeight- add
        this.loadingBarFill.width = this.sizeWidth- add
        this.loadingBarFill.height = this.sizeHeight- add

        this.loadingBar.visible = !hideBorder
        this.setProgressBar(this.currentValue);
    }
  
    setProgressBar(value = 0, color = null) {
        if (value <= 0) {
            return;
        }
       
        this.loadingBarFill.visible = true;
        value = Math.max(value, 0.1);
        this.currentValue = value;
        this.loadingBarFill.tint = color;
        this.loadingBarFill.width =  (this.sizeWidth - this.round / 2) * value;

    }
}