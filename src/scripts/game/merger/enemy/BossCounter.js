import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class BossCounter extends PIXI.Container {
    constructor(size) {
        super()

        this.size = size;

        this.backShape = new PIXI.Sprite.fromFrame('backTilesSmall')
        this.backShape.width = size * 2
        this.backShape.height = size * 2
        this.backShape.alpha = 0.5
        this.backShape.anchor.set(0.5)
        //this.addChild(this.backShape)

        this.bossSprite = new PIXI.Sprite.fromFrame('backTilesSmall')
        this.bossSprite.width = size * 2
        this.bossSprite.height = size * 2
        this.bossSprite.anchor.set(0.5)
        this.addChild(this.bossSprite)

        this.levelLabel = new PIXI.Text('0',window.LABELS.LABEL2)
        this.levelLabel.style.stroke = 0xFF0045
        this.levelLabel.style.strokeThickness = 3
        this.levelLabel.style.fontSize = 12
            this.addChild(this.levelLabel)

    }
    addSprite(sprite){
        this.bossSprite.texture = new PIXI.Texture.fromFrame(sprite)
    }
    updateLevel(level){
        this.levelLabel.text = 'Level '+level
        this.levelLabel.pivot.x = this.levelLabel.width / 2
        this.levelLabel.y = 20
    }
    setFontSize(size){
        this.levelLabel.style.fontSize = size
    }
}