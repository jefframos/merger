import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';

export default class InGameCatPawn extends PIXI.Container
{
    constructor(line)
    {
        super();

        let card = new PIXI.Container();

        this.w = PAWN.width * 2.3;
        
        this.sprite = PIXI.Sprite.from('game_button_off');

        this.upTexture = PIXI.Texture.from('game_button_off');
        this.downTexture = PIXI.Texture.from('game_button_on');

        // this.sprite.tint = 0x555555;
        this.sprite.anchor.set(0.5);
        // this.sprite.position.set(-this.w, -this.w);
        this.sprite.scale.set(this.w/ this.sprite.height)

        this.container = new PIXI.Container();
        this.container.addChild(this.sprite);

        this.addChild(this.container);
        this.lane = 0;
        this.noDepth = true;
    }
    hold()
    {
        this.sprite.texture = this.downTexture;
        TweenLite.killTweensOf(this.container);
        TweenLite.to(this.container.scale, 0.15,
        {
            x: 1.2,
            y: 0.8
        })
    }
    release()
    {
        this.sprite.texture = this.upTexture;
        TweenLite.killTweensOf(this.container);
        this.container.scale.set(1.2, 0.8);
        TweenLite.to(this.container.scale, 0.75,
        {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        })
    }
    resetCard()
    {}
    updateCard()
    {}
    forceDestroy()
    {
        this.parent.removeChild(this);
        // window.CARD_POOL.push(this);
    }

}