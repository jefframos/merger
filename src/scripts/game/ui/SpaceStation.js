import * as PIXI from 'pixi.js';
import Signals from 'signals';
import StandardEnemy from '../merger/enemy/StandardEnemy';
export default class SpaceStation extends PIXI.Container {
    constructor(game) {
        super();

        this.onParticles = new Signals();

        this.shine = new PIXI.Sprite.fromFrame('shine')
        this.shine.anchor.set(0.5)
        this.spaceStation = new StandardEnemy()
        this.addChild(this.shine);
        this.addChild(this.spaceStation);
        this.shine.scale.set(2.2)
        this.shine.tint = 0xffff00
        this.shine.y = 50
        this.spaceStation.setAsEnemy('spaceStation')
        
        this.shards = new PIXI.Sprite.fromFrame('shards-large')
        this.shards.anchor.set(0.5)
        this.addChild(this.shards);
        this.shards.x = 60
        this.shards.y = 50
        
        this.increase = new PIXI.Sprite.fromFrame('icon_increase')
        this.increase.anchor.set(0.5)
        this.increase.position.set(80)
        this.addChild(this.increase);

        this.helpLabel = new PIXI.Text(window.localizationManager.getLabel('sell', true), LABELS.LABEL_SPACESHIP);
        this.helpLabel.style.fontSize = 56
        this.helpLabel.style.fill = 0xFFFFFF
        this.helpLabel.style.strokeThickness = 6
        this.helpLabel.style.stroke = 0

        
        this.helpLabel.x = 8
        this.helpLabel.y = - 45
        this.addChild(this.helpLabel)

        this.timer = 0.1
        this.on('mousedown', this.click.bind(this)).on('touchstart', this.click.bind(this));
        this.interactive = true;
        this.buttonMode = true;
    }
    click(){
        if(this.callback){
            this.callback();
        }
    }
    addCallback(callback){
        this.callback = callback
    }
    update(delta) {
        this.spaceStation.update(delta);

        if (this.timer <= 0) {
            this.timer = 0.3;
            this.posShootingParticles(this.spaceStation.getGlobalPosition())
        } else {
            this.timer -= delta;
        }

        this.shine.rotation += delta * 5;

        this.shine.rotation %= Math.PI * 2
    }
    posShootingParticles(targetPos) {
        let customData = {}
        customData.texture = 'spark2'
        customData.scale = 0.005
        customData.alphaDecress = 0.5
        customData.gravity = 0
        customData.tint = 0xffff00
        targetPos.y += 50

        for (let index = 0; index < 3; index++) {
            let particleAng = Math.random() * 3.14 * -1;
            customData.forceX = Math.cos(particleAng) * 30
            customData.forceY = Math.sin(particleAng) * 30
            this.onParticles.dispatch(targetPos, customData, 1)
        }
    }
}