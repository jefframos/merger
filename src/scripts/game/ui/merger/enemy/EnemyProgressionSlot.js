import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class EnemyProgressionSlot extends PIXI.Container {
    constructor(size) {
        super()

        this.size = size;
        this.shape = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, this.size);
        this.addChild(this.shape)

        this.levelLabel = new PIXI.Text('0',window.LABELS.LABEL2)
        this.levelLabel.style.stroke = 0xFFFF45
        this.levelLabel.style.strokeThickness = 4
        this.levelLabel.style.fontSize = 14
            this.addChild(this.levelLabel)

    }

    updateLevel(level){
        this.levelLabel.text = level
        this.levelLabel.pivot.x = this.levelLabel.width / 2
    }
    setFontSize(size){
        this.levelLabel.style.fontSize = size
    }
}