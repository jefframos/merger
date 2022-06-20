import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
export default class Countdown extends PIXI.Container
{
    constructor()
    {
        super();


        this.playButton = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, this.width * 0.25, this.width * 0.25) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.playButton.pivot.x = this.playButton.width / 2
        this.playButton.pivot.y = this.playButton.height / 2
            // this.playButton.scale.set((this.size / this.playButton.width));
        this.playButton.alpha = 1;
        this.playButton.rotation = Math.PI / 4;
        this.playButton.tint = 0x555555;

        this.playButton.y = this.height * 0.5 - this.playButton.height

        this.container.addChild(this.playButton)

        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        this.playButton.on('mouseup', this.confirm.bind(this)).on('touchend', this.confirm.bind(this));
    }
}