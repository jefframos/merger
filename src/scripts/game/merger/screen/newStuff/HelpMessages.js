import * as PIXI from 'pixi.js';

export default class HelpMessages extends PIXI.Container {
    constructor() {
        super()

        this.timer = 0
        this.damageLabel = new PIXI.Text('SHOOT', LABELS.LABEL1);
        this.addChild(this.damageLabel)
        this.damageLabel.style.fontSize = 64
        this.damageLabel.style.stroke = 0//0xff9c00
        this.damageLabel.style.strokeThickness = 10
        this.damageLabel.anchor.set(0.5)
    }
    lerp(start, end, t) {
        return start + (end - start) * t;
    }
    showMessage(message, stroke = 0xff0000) {
        this.damageLabel.alpha = 0;
        this.damageLabel.style.stroke = stroke
        this.timer = 3
        this.damageLabel.text = message
    }
    mouseDown() {
        if (this.progress > 0) {
            return
        }

    }
    update(delta) {
        if (this.timer > 0) {
            this.timer -= delta
            this.damageLabel.alpha = this.lerp(this.damageLabel.alpha, 1, 0.1)

        } else {
            this.damageLabel.alpha = this.lerp(this.damageLabel.alpha, 0, 0.1)
        }

        this.damageLabel.scale.set(Math.sin(window.timeTotal * 20) * 0.05 + 0.95, Math.cos(window.timeTotal * 20) * 0.05 + 0.95)
    }
}