import * as PIXI from 'pixi.js';
import StandardCard  from './StandardCard';
import config  from '../../config';
import utils  from '../../utils';
import ParticleSystem  from '../effects/ParticleSystem';
import CircleCounter from '../ui/hud/CircleCounter';
export default class TimerEnemy extends StandardCard{
	constructor(game){
		super();		
		this.isTimerEnemy = true;


	}
	buildAssets(){
		super.buildAssets();

		this.counterRadius = {
            inner: 25,
            outer: 30
        }

		this.roundsCounter = new CircleCounter(this.counterRadius.outer, this.counterRadius.inner);
        this.lifeContainer.addChildAt(this.roundsCounter, 0);

        // this.roundsCounter.addChild(this.roundsLabel)
        this.roundsCounter.build(0xFFFFFF, 0x999999);

	}
	startCrazyMood(){
		this.crazyMood = true;
		this.circleBackground.alpha = 0
		this.circleBackground.scale.set(0)
		TweenLite.to(this.circleBackground.scale, 0.5, {x:1,y:1, ease:Elastic.easeOut});
	}
	removeCrazyMood(){
		this.crazyMood = false;
		this.circleBackground.alpha = 0.0
	}
	resetCard(){
		this.alpha = 1;
		this.dead = false;
		this.zones = [];
		this.arrows = [];
		this.type = 0;
		this.MAX_COUNTER = this.life;
		this.counter = this.MAX_COUNTER;
		this.cardContainer.scale.set(1);
		this.circleBackground.alpha = 0;
		this.resize(1.5);
		this.updateCard();
		this.startCrazyMood();

		this.life = 0;

	}
	resize(size = 1.1){
		super.resize(size);
		if(!this.roundsCounter){
			return
		}
		this.roundsCounter.scale.set(this.counterRadius.outer / CARD.width); 
		// this.roundsCounter.pivot.set(this.roundsCounter.width/2)
	}
	updateCard(){
		// console.log(this.life);
		this.cardSprite.tint = 0x999999;
		this.lifeLabel.style.fill = 0xFFFFFF;
		this.lifeLabel.style.fontWeight = 800
		this.lifeLabel.text = this.counter;
		this.lifeLabel.style.fontSize = '20px';

		this.roundsCounter.update(1 - this.counter / this.MAX_COUNTER)

		this.updateLabelPositionCard();
	}
	mainActionAnimation(){
		this.shake(0.3, 8, 0.4, this.cardSprite);
	}
	update(delta){
		if(this.crazyMood){
			this.cardSprite.y =  CARD.height / 2 + Math.sin(this.initGridAcc) * 2;			
			this.initGridAcc += 0.05
			// this.enemySprite.y =  CARD.height / 2 + Math.sin(this.initGridAcc) * 5;
			this.cardSprite.scale.x = this.starterScale + Math.cos(this.initGridAcc) * 0.01
			this.cardSprite.scale.y = this.starterScale + Math.sin(this.initGridAcc) * 0.01
			// this.cardSprite.rotation += 0.05;
			// this.lifeLabel.rotation = -this.cardSprite.rotation;
			// this.circleBackground.alpha = 0.2 + 0.1 *  Math.cos(this.initGridAcc);

		

			this.updateLabelPositionCard();

			if(!this.roundsCounter){
				return
			}
			this.roundsCounter.rotation += 0.05;

			//this.roundsCounter.pivot.x = CARD.width/2//this.roundsCounter.width / 2
        	//this.roundsCounter.pivot.y = CARD.width/2//this.roundsCounter.height / 2


			this.roundsCounter.x = 0//.pivot.x = (this.counterRadius.outer/2)
			this.roundsCounter.y = 0//this.roundsCounter.height/2//.pivot.y = (this.counterRadius.outer/2)
			// this.roundsCounter.x = this.cardSprite.x;
			// this.roundsCounter.y = this.cardSprite.y;
		}
	}
	// forceDestroy(){
	// 	this.scale.set(1);
	// 	this.parent.removeChild(this);
	// }
	destroy(){
		super.destroy();
		return;
		if(this.dead)
		{
			TweenLite.killTweensOf(this);
			return false;
			this.forceDestroy();
		}
		// this.removeCrazyMood();
		this.shake(0.2, 6, 0.2);
		TweenLite.killTweensOf(this);
		this.dead = true;

		if(this.crazyMood){
			TweenLite.to(this.circleBackground.scale, 0.5, {x:2, y:2, ease:Elastic.easeOut});
		}			
		TweenLite.to(this, 0.2, {delay:0.2, alpha:0.5, onComplete:function(){			
			this.forceDestroy();
		}.bind(this)});
	}
}