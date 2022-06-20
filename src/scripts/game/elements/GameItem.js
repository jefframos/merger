import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import Signals from 'signals';
export default class GameItem extends PIXI.Container
{
    constructor()
    {

        super();


        this.w = PAWN.width * 3;
        this.sin = 0;
        this.animationSpeed = 0.01;
        this.animationTimer = 0;

        this.sprite = new PIXI.Sprite.from('results_newcat_rays_01');
        this.sprite.anchor.set(0.5, 0.5);

        this.container = new PIXI.Container();

        this.standardScale = this.w / this.sprite.width;
        this.container.scale.set(this.standardScale);

        // this.sprite.alpha = 0;
        this.noScalable = false;

        this.pickupsSprites = [GAME_DATA.trophyData.icon, 'automate', GAME_DATA.moneyData.softIcon, 'treasure_chest_01', 'giftbox2']
        this.spriteItem = new PIXI.Sprite.from(GAME_DATA.trophyData.icon);
        this.spriteItem.anchor.set(0.5, 0.5);

        this.generalSpeed = 5;

        // this.sprite.alpha = 0;
        this.container.addChild(this.sprite);
        this.container.addChild(this.spriteItem);
        this.addChild(this.container);
        this.interactive = true;
        this.buttonMode = true;
        this.on('mousedown', this.collect.bind(this)).on('touchstart', this.collect.bind(this));

        this.dist = config.width * 0.025 // - this.w / 2;

        this.onCollect = new Signals();
    }
    collect()
    {
        if (this.collecting)
        {
            return
        }

        this.onCollect.dispatch(this);
        this.collected();
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    reset(pos, type = 0)
    {
        this.itemType = type;
        this.currentTexture = this.pickupsSprites[type];
        this.spriteItem.texture = PIXI.Texture.from(this.pickupsSprites[type]);
        this.startPos = pos;
        this.x = pos.x;
        this.y = pos.y;
        this.sprite.scale.set(1);

        if (this.itemType == 4)
        {
            this.standardScale = this.w / this.sprite.width * 1.5;
            this.container.scale.set(this.standardScale);
        }
        else
        {
            this.standardScale = this.w / this.sprite.width;
            this.container.scale.set(this.standardScale);
        }
        this.velocity = {
            x: config.width * 0.1,
            y: -config.height * 0.25
        }
        this.kill = false;
        this.collecting = false;
        if (this.spriteItem.width > this.spriteItem.height)
        {
            this.spriteItem.scale.set(this.sprite.width / (this.spriteItem.width / this.spriteItem.scale.x) * 0.65);
        }
        else
        {
            this.spriteItem.scale.set(this.sprite.height / (this.spriteItem.height / this.spriteItem.scale.y) * 0.65);
        }
        this.container.alpha = 1;
        this.tempX = 0;
        this.sprite.rotation = 0;
    }
    collected()
    {
        this.collecting = true;
        this.sprite.scale.set(0.5);
        TweenLite.to(this.sprite.scale, 0.5,
        {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        })

        let tempScale = this.spriteItem.scale
            // this.spriteItem.scale.set(tempScale.x * 0.5);
        TweenLite.to(this.spriteItem.scale, 0.75,
        {
            x: tempScale.x * 1.5,
            y: tempScale.y * 1.5,
            ease: Elastic.easeOut
        })

        TweenLite.to(this.container, 0.25,
        {
            alpha: 0,
            delay: 0.75
        })
    }
    update(delta)
    {
        if (this.collecting)
        {
            return;
        }
        this.sprite.rotation += delta * Math.PI;
        //gambiarra aqui
        if (this.itemType != 4)
        {
            this.y += this.velocity.y * delta;
            this.tempX += (this.velocity.x * delta);
            this.x = this.startPos.x + Math.sin(this.sin) * this.dist + this.tempX;
        }
        else
        {
            this.y += Math.sin(this.sin) * this.height * delta * 0.5;
            this.x += this.velocity.x * delta
        }
        // console.log(this.x);
        this.rotation = Math.sin(this.sin) * 0.2
        this.spriteItem.rotation = -this.rotation - Math.cos(this.sin) * 0.2
        this.sin += 0.1;
        if (this.y < -PAWN.height || this.y > config.height * 1.05)
        {
            this.kill = true;
        }
    }


}