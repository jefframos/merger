import * as PIXI from 'pixi.js';
import utils from '../../../utils';
import config from '../../../config';
import StarParticle from './StarParticle';
import TweenLite from 'gsap';

export default class SpaceBackground extends PIXI.Container {
	constructor() {

		super();
		this.stars = [];


		this.background = new PIXI.Container();
		this.addChild(this.background);

		this.backgroundShape = new PIXI.Graphics().beginFill(0x111a20).drawRect(-50, -50, 100, 100);
		this.addChild(this.backgroundShape);


		
		this.baseTopGradient = new PIXI.Sprite.fromFrame('base-gradient')
		this.addChild(this.baseTopGradient);
		this.baseTopGradient.anchor.x = 0.5
		this.baseTopGradient.anchor.y = 1
		this.baseTopGradient.rotation = Math.PI
		this.baseTopGradient.tint = 0x371f52
		
		
		this.middleGradient = new PIXI.Sprite.fromFrame('bigblur')
		this.addChild(this.middleGradient);
		this.middleGradient.anchor.x = 0.5
		this.middleGradient.anchor.y = 0.5
		this.middleGradient.rotation = Math.PI
		this.middleGradient.tint = 0x0d5956
		
		this.baseGradient = new PIXI.Sprite.fromFrame('base-gradient')
		this.addChild(this.baseGradient);
		this.baseGradient.anchor.x = 0.5
		this.baseGradient.anchor.y = 1

		this.baseGradient.tint = 0
		// this.backShape = new PIXI.Sprite.fromFrame('background_space')
		// this.addChild(this.backShape);
		// this.backShape.anchor.x = 0.5

		this.starsContainer = new PIXI.Container();
		this.addChild(this.starsContainer);


		this.innerResolution = { width: config.width, height: config.height }


		this.addStars();


		this.starsMoveTimer = 0;

		this.starsDeacc = 0.9;

		this.currentSpeed = {
			x: 0,
			y: 200
		}


		window.fxSpeed = 1;
	}

	resize(innerResolution, scale) {

		this.innerResolution = innerResolution;
		this.backgroundShape.width = innerResolution.width * 4 // scale.x
		this.backgroundShape.height = window.innerHeight * 4// scale.x

		//console.log(innerResolution.height / config.height)
		let globalScale = innerResolution.height / config.height
		this.baseGradient.y = innerResolution.height / 2 / globalScale
		this.baseTopGradient.y = -innerResolution.height / 2 / globalScale

		this.baseGradient.width = innerResolution.width * 4
		this.baseTopGradient.width = innerResolution.width * 4

		
		// this.starsContainer.x = innerResolution.width / 2
		// this.starsContainer.y = innerResolution.height / 2

	}

	update(delta) {

		//console.log(this.stars)
		if (window.fxSpeed > 1) {
			window.fxSpeed -= delta * 5;
			if (window.fxSpeed < 1) {
				window.fxSpeed = 1;
			}
		}
		this.currentSpeed.y = this.innerResolution.height * 0.02 * (window.fxSpeed * 2)

		//console.log(this.currentSpeed.y, delta)
		let spd = this.currentSpeed.y * delta;

		if (spd) {
			for (var i = 0; i < this.stars.length; i++) {
				this.stars[i].update(this.currentSpeed.y * delta, this.innerResolution);
			}
		}
	}
	addStars() {
		let totalStars = this.innerResolution.width * 0.1;

		totalStars = Math.min(60, totalStars);
		let l = this.innerResolution.width * 0.001
		l = Math.max(l, 1.5)
		this.stars = [];
		for (var i = 0; i < totalStars; i++) {
			let dist = Math.random() * (l * 2) + l;
			let tempStar = new StarParticle(dist);
			tempStar.alpha = (Math.min(dist, 3) / 3 * 0.5) + 0.2
			tempStar.tint = 0x7C8284
			let toClose = true;
			let acc = 5;
			while (toClose && acc > 0) {
				acc--;
				let angle = Math.random() * Math.PI * 2;
				let max = Math.max(this.innerResolution.width, this.innerResolution.height)
				let radius = Math.random() * max + 20;
				tempStar.x = + Math.cos(angle) * radius// - this.innerResolution.width/2;
				tempStar.y = + Math.sin(angle) * radius// - this.innerResolution.height/2;
				toClose = false;
				for (var j = 0; j < this.stars.length; j++) {
					let distance = utils.distance(this.stars[j].x, this.stars[j].y, tempStar.x, tempStar.y)
					if (distance > 15) { } else {
						toClose = true;
						break
					}
				}
			}
			this.starsContainer.addChild(tempStar);
			this.stars.push(tempStar)
		}
	}


}