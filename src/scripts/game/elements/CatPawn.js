import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';

export default class CatPawn extends PIXI.Container
{
    constructor(line)
    {
        super();

        let card = new PIXI.Container();

        this.w = PAWN.width;
        if (line)
        {
            this.sprite = new PIXI.Graphics().lineStyle(1, 0xff00ff).drawCircle(0, 0, this.w); //PIXI.Sprite.from('slot.png');
        }
        else
        {
            this.sprite = new PIXI.Graphics().beginFill(0xff00ff).drawCircle(0, 0, this.w); //PIXI.Sprite.from('slot.png');
            // this.sprite = new PIXI.Graphics().lineStyle(1,0xff00ff).drawCircle(0, 0, this.w); //PIXI.Sprite.from('slot.png');

        }

        // this.sprite.tint = 0x555555;
        this.sprite.pivot.set(-this.w, -this.w);
        this.sprite.position.set(-this.w, -this.w);
        // this.sprite.scale.set(  PAWN.height/ this.sprite.height * 0.6)

        this.container = new PIXI.Container();
        this.container.addChild(this.sprite);

        this.addChild(this.container);
        this.lane = 0;
        this.noDepth = true;
    }
    hold()
    {
        TweenLite.killTweensOf(this.container);
        TweenLite.to(this.container.scale, 0.15,
        {
            x: 1.2,
            y: 0.8
        })
    }
    release()
    {
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