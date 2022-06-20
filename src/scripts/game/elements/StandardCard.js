import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
export default class StandardCard extends PIXI.Container {
    constructor(game) {
        super();
        window.CARD_NUMBER++;
        this.isCard = true;
        this.game = game;
        this.zones = [];
        this.arrows = [];
        this.pos = {
            i: -1,
            j: -1
        };
        this.type = 0;
        this.MAX_COUNTER = 10;
        this.life = 2;
        this.cardNumber = CARD_NUMBER;
        this.container = new PIXI.Container();
        this.addChild(this.container);
        this.cardHeightFixed = 30;
        this.buildAssets();

        this.interactive = true;
        this.buttonMode = true;
        this.mouseup = () => {
            console.log(this);
        }
    }
    buildAssets(pieceSrc = 'new-piece.png') {

        this.counter = this.MAX_COUNTER;

        this.circleBackground = PIXI.Sprite.from('player.png'); //new PIXI.Graphics().beginFill(0xFFFFFF).drawCircle(0,0,CARD.width/2);
        this.circleBackground.anchor.set(0.5);
        this.circleBackground.alpha = 0;


        this.cardSprite = PIXI.Sprite.from(pieceSrc);
        this.cardSprite.anchor.set(0.5);
        this.cardHeightFixed = this.cardSprite.height;

        this.cardContainer = new PIXI.Container();
        this.cardActions = new PIXI.Container();
        this.container.addChild(this.cardContainer);
        this.cardContainer.addChild(this.circleBackground);
        this.cardContainer.addChild(this.cardSprite);
        this.cardContainer.addChild(this.cardActions);


        this.lifeContainer = new PIXI.Container();
        this.lifeLabel = new PIXI.Text(this.life, {
            fontFamily: 'blogger_sansregular',
            fontSize: '32px',
            fill: 0x1B1923,
            align: 'center'
        });
        this.lifeLabel.pivot.x = this.lifeLabel.width / 2
        this.lifeLabel.pivot.y = this.lifeLabel.height / 2
        this.lifeContainer.addChild(this.lifeLabel);
        this.cardSprite.addChild(this.lifeContainer);
        // this.addChild(this.lifeContainer);

        this.cardContainer.pivot.x = CARD.width / 2;
        this.cardContainer.x = CARD.width / 2;

        this.initGridAcc = Math.random();

        this.resize();

        this.starterScale = this.cardSprite.scale.x;

    }
    resize(scl = 1.1) {

        this.circleBackground.width = CARD.width;
        this.circleBackground.height = CARD.height;
        this.circleBackground.x = CARD.width / 2;
        this.circleBackground.y = CARD.height / 2;


        let tempscl = CARD.height / this.cardHeightFixed * scl
        this.cardSprite.scale.set(tempscl);
        this.cardSprite.x = CARD.width / 2;
        this.cardSprite.y = CARD.height / 2;

        this.starterScale = tempscl;

    }
    startCrazyMood() {
        // this.crazyMood = true;
        // this.circleBackground.alpha = 0.2
        // this.circleBackground.scale.set(0)
        // TweenLite.to(this.circleBackground.scale, 0.5, {
        //     x: 1,
        //     y: 1,
        //     ease: Elastic.easeOut
        // });
    }
    removeCrazyMood() {
        this.crazyMood = false;
        this.circleBackground.alpha = 0.0
    }
    resetCard() {
        this.inPool = false;
    	this.pos = {
            i: -1,
            j: -1
        };
        this.counter = 999999999;
        this.alpha = 1;
        this.dead = false;
        this.zones = [];
        this.arrows = [];
        this.type = 0;
        this.MAX_COUNTER = 10;
        this.cardContainer.scale.set(1);
        this.resize();
        this.circleBackground.alpha = 0;
        this.addActionZones();
        this.updateCard();

        // if(window.CARD_NUMBER == 10){
        //     this.counter = 1;
        // }

        // console.log(this.cardSprite.x);
        // this.resize();

    }
    attacked(hits = 1) {
        this.life -= hits;
        this.updateCard();
        if (this.life < 0) {
            return true;
        }

        return false;
    }
    hasZone(zone) {
        for (var i = 0; i < this.zones.length; i++) {
            if (this.zones[i].label == zone) {
                return this.zones[i];
            }
        }
        return false;
    }
    removeActionZones() {
        while (this.cardActions.children.length > 0) {
            this.cardActions.removeChildAt(0);
        }

        this.zones = [];
        this.arrows = [];
    }
    mainActionAnimation() {
    }
    updateCounter(value = 1) {
        this.counter -= value;
        // this.label.text = this.counter;
        if (this.counter <= 0) {
            this.counter = this.MAX_COUNTER;
            this.updateCard();
            return this;
        }
        this.updateCard();
        return null;
    }
    updateLabelPositionCard() {
        if (this.life < 0) {
            this.lifeContainer.alpha = 0;
        } else {
            this.lifeContainer.alpha = 1;
            this.lifeContainer.x = 0 //-CARD.width * 0.5;
            this.lifeContainer.y = 0 //-CARD.height * 0.5;
        }

        this.lifeLabel.pivot.x = this.lifeLabel.width / 2
        this.lifeLabel.pivot.y = this.lifeLabel.height / 2
        // console.log(this.lifeLabel.height, CARD.height);
        let scl = 1//this.lifeLabel.height / CARD.height * 0.5;
        this.lifeContainer.scale.set(scl)

        // this.lifeContainer.pivot.x = this.lifeContainer.width / 2
        // this.lifeContainer.pivot.y = this.lifeContainer.height / 2

        this.lifeContainer.x = 0 //CARD.width/2 - this.lifeContainer.width/2;
        this.lifeContainer.y = 0 //CARD.height/2 - this.lifeContainer.height/2;
    }
    updateCard() {
        // console.log(this.life);
        this.lifeLabel.text = this.life + 1;
        this.lifeLabel.style.fontSize = '32px';
        this.lifeLabel.style.fill = 0xFFFFFF

        // this.lifeLabel.style.fill = 0x1B1923
        for (var i = 0; i < ENEMIES.list.length; i++) {
            if (ENEMIES.list[i].life == this.life) {
                this.cardSprite.tint = ENEMIES.list[i].color;
            }
        }

        this.updateLabelPositionCard();
        this.update();

    }
    convertCard() {
        this.updateCard();
    }
    getArrow(label) {
        for (var i = 0; i < this.arrows.length; i++) {
            if (this.arrows[i].zone == label) {
                return this.arrows[i].arrow;
            }
        }
    }
    addActionZones(possiblesAreas = [0, 1, 2, 3, 4, 5, 6, 7], sides = -1) {
        this.zones = [];
        this.removeActionZones();
        let orderArray = possiblesAreas

        utils.shuffle(orderArray);
        let totalSides = sides >= 0 ? sides : Math.floor(Math.random() * ACTION_ZONES.length * 0.4) + 1;

        let lineW = CARD.width * 0.1
        for (var i = totalSides - 1; i >= 0; i--) {

            let arrowContainer = new PIXI.Container();


            let arrow = PIXI.Sprite.from('arrow.png'); //new PIXI.Graphics().beginFill(0xFFFFFF);

            arrow.anchor.set(0.5, 1);
            arrow.scale.set(CARD.width / arrow.width * 0.25);
            // arrow.moveTo(-lineW,0);
            // arrow.lineTo(lineW,0);
            // arrow.lineTo(0,-lineW);

            let arrowLine = new PIXI.Graphics().lineStyle(1, 0xFFFFFF);
            arrowLine.moveTo(0, 0);
            arrowLine.lineTo(0, 25);
            arrowLine.alpha = 0.5
            arrowContainer.addChild(arrow);
            // arrowContainer.addChild(arrowLine);
            // arrow.lineTo(0,-5);

            let zone = ACTION_ZONES[orderArray[i]];

            this.zones.push(zone);

            let tempX = (zone.pos.x / 2) * CARD.width;
            let tempY = (zone.pos.y / 2) * CARD.height;
            arrowContainer.x = tempX;
            arrowContainer.y = tempY;

            this.arrows.push({
                arrow: arrowContainer,
                zone: zone.label
            });

            let centerPos = {
                x: CARD.width / 2,
                y: CARD.height / 2
            };
            let angle = Math.atan2(tempY - centerPos.y, tempX - centerPos.x) + Math.PI / 2;

            angle = (Math.round((angle * 180 / Math.PI) / 45) * 45) / 180 * Math.PI;
            arrowContainer.rotation = angle;
            this.cardActions.addChild(arrowContainer);

            let radToAngle = angle * 180 / Math.PI;
            if ((radToAngle % 90) == 0) {
                arrowContainer.x -= Math.sin(angle) * CARD.width / 3.5;
                arrowContainer.y += Math.cos(angle) * CARD.width / 3.5;

                // arrowContainer.visible = false

                // console.log('WHAT', angle * 180 / Math.PI,   Math.PI/2 * 180 / Math.PI);

            } else {
                arrowContainer.x -= Math.sin(angle) * CARD.width / 2;
                arrowContainer.y += Math.cos(angle) * CARD.width / 2;
            }

            // arrowContainer.x -= Math.sin(angle) * CARD.width/1.75;
            // arrowContainer.y += Math.cos(angle) * CARD.width/1.75;
        }
        // console.log("ADD ACTION ZONES", this.zones, this.arrows);
    }
    move(pos, time = 0.3, delay = 0) {
    	// console.log(pos, 'why');
        TweenLite.to(this, time, {
            x: pos.x,
            y: pos.y,
            delay: delay
        });
    }
    moveX(pos, time = 0.3, delay = 0) {
        TweenLite.to(this, time, {
            x: pos,
            delay: delay
        });
    }
    forceDestroy() {
        this.scale.set(1);
        if(this.parent){
        	this.parent.removeChild(this);
        }
        this.removeActionZones();
        this.pos = {
            i: -1,
            j: -1
        };

        TweenLite.killTweensOf(this);
        for (var i = 0; i < CARD_POOL.length; i++) {
            if(CARD_POOL[i] == this){
                console.log('TRY TO PUT AGAIN');
                return;
            }
        }
        this.inPool = true;
        window.CARD_POOL.push(this);
    }
    update(delta) {
        this.cardSprite.y = CARD.height / 2 + Math.sin(this.initGridAcc) * 2;

        // this.cardActions.y = this.cardSprite.y - CARD.height / 2;

        // this.cardSprite.y =  CARD.height / 2 + Math.sin(this.initGridAcc) * 2;
        this.initGridAcc += 0.05
        this.cardSprite.scale.x = this.starterScale + Math.cos(this.initGridAcc) * 0.01
        this.cardSprite.scale.y = this.starterScale + Math.sin(this.initGridAcc) * 0.01

        this.updateLabelPositionCard();

    }
    destroy() {
        if (this.dead) {
            TweenLite.killTweensOf(this.circleBackground.scale);
            TweenLite.killTweensOf(this);
            this.forceDestroy();
            return false;
        }
        
        this.dead = true;
        // this.removeCrazyMood();
        this.shake(0.2, 6, 0.2);
        TweenLite.killTweensOf(this);

        if (this.crazyMood) {
            TweenLite.to(this.circleBackground.scale, 0.5, {
                x: 2,
                y: 2,
                ease: Elastic.easeOut
            });
        }
        TweenLite.to(this, 0.2, {
            delay: 0.2,
            alpha: 0.5,
            onComplete: function() {
                this.forceDestroy();
            }.bind(this)
        });
    }

    shake(force = 1, steps = 4, time = 0.5, content = null) {
        let container = content || this.position;

        
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(container, speed, {
                x: container.x + (Math.random() * positionForce - positionForce / 2),
                y: container.y + (Math.random() * positionForce - positionForce / 2),
                ease: "easeNoneLinear"
            }));
        };
        timelinePosition.append(TweenLite.to(container, speed, {
            x: container.x,
            y: container.y,
            ease: "easeeaseNoneLinear"
        }));
    }
}