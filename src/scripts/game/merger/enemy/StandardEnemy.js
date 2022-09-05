import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class StandardEnemy extends PIXI.Container {
    constructor() {
        super();

        this.bossSpriteSrc = 'capital_ship_01'
        this.enemySpriteSrc = 'capital_ship_05'
        this.enemySprite = new PIXI.Sprite.from(this.enemySpriteSrc);
        this.addChild(this.enemySprite);
        this.enemySprite.anchor.set(0.5)

        this.positionOffset = { x: 0, y: 0 }
        this.sin = Math.random();

        this.isBoss = false;
        
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
    setAsBoss(){
        this.enemySprite.texture = PIXI.Texture.fromFrame(this.bossSpriteSrc);
        this.isBoss = true;
    }
    setAsEnemy(){
        this.enemySprite.texture = PIXI.Texture.fromFrame(this.enemySpriteSrc);
        this.isBoss = false;
    }
}