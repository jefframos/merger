import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class StandardEnemy extends PIXI.Container {
    constructor() {
        super();

        this.enemySprite = new PIXI.Sprite.from('capital_ship_05');
        this.addChild(this.enemySprite);
        this.enemySprite.anchor.set(0.5)

        this.positionOffset = { x: 0, y: 0 }
        this.sin = Math.random();

    }
    updatePosition() {
        this.positionOffset.y = Math.cos(this.sin) * 4

        this.enemySprite.x = 0;
        this.enemySprite.y = this.positionOffset.y;
    }
    update(delta){
        this.sin += delta;
        this.sin %= Math.PI * 2;
        this.updatePosition();
    }
}