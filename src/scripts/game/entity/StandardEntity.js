import * as PIXI from 'pixi.js';
import config from '../../config';
import utils from '../../utils';
import Signals from 'signals';
import EntityStandardBar from './ui/EntityStandardBar';
import EntityModel from './model/EntityModel';
import StandardAttackAction from './actions/StandardAttackAction';
import GambitRandomOpposite from './gambits/GambitRandomOpposite';
import WeaponsData from '../data/WeaponsData';
import TweenMax from 'gsap';
export default class StandardEntity extends PIXI.Container {
    constructor(radius) {
        super();

        this.onActing = new Signals();
        this.onStartAction = new Signals();
        this.onShoot = new Signals();
        this.onDie = new Signals();
        this.onDestroy = new Signals();

        this.entityModel = new EntityModel();

        this.gambitList = [];

        this.defaultGamibt = new GambitRandomOpposite(this)
        this.defaultGamibt.addAction(new StandardAttackAction(this));

        this.weapon = WeaponsData.basicSword

        StandardEntity.ACTIONS = {
            WAIT: 1,
            START_ACT: 2,
            ACTING: 3,
            RETURNING: 4,
            DEAD: 5,
            START_ACT_STILL: 6
        }

        this.radius = radius;

        this.container = new PIXI.Container();
        this.addChild(this.container);

        this.uiContainer = new PIXI.Container();
        this.addChild(this.uiContainer);

        this.entitySpriteContainer = new PIXI.Container();
        this.container.addChild(this.entitySpriteContainer)

        this.entitySprite = PIXI.Sprite.from('human-ranger');
        this.entitySprite.anchor.set(0.5, 1)
        this.entitySpriteContainer.addChild(this.entitySprite)

        this.noScalable = false;

        this.killed = true;

        this.atbBar = new EntityStandardBar();
        this.uiContainer.addChild(this.atbBar)

        this.fitOnRadius(this.atbBar)

        this.lifeBar = new EntityStandardBar();
        this.uiContainer.addChild(this.lifeBar)

        this.fitOnRadius(this.lifeBar, 1)
        this.atbBar.y = this.radius / 2;
        this.lifeBar.y = this.atbBar.y + this.lifeBar.height
        this.frontLifeBarColor = 0x00FF00
        this.atbBar.updatePowerBar(1, 0xFFFF00, true)
        this.atbBar.updatePowerBaBGr(0)
        this.lifeBar.updatePowerBar(1, this.frontLifeBarColor, true)
        this.lifeBar.updatePowerBaBGr(0xFF0000)

        this.readyLabel = new PIXI.Text('READY!', {
            fontFamily: 'retro_computerregular',
            fontSize: '32px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.readyLabel.pivot.x = this.readyLabel.width / 2;
        this.readyLabel.pivot.y = this.readyLabel.height;
        this.uiContainer.addChild(this.readyLabel)
        this.readyLabelScale = this.fitOnRadius(this.readyLabel)

        this.readyLabel.y = this.atbBar.y - this.atbBar.height / 2;


        this.dir = 1;


        this.gridPosition = {i:0, j:0};

        this.bloodColor = ['0x7F1B1B', '0xFF0000']
        this.demageColor = ['0xFF0000', '0x7F1B1B']

        this.graphicsData = {
            baseWidth: 32
        };


    }
    applyWeaponStats() {
        if (this.weapon) {
            this.entityModel.addWeapon(this.weapon);
        }
        let scaledSpeed = 1 - (this.entityModel.getSpeed() / 255)
        scaledSpeed *= scaledSpeed
        scaledSpeed *= scaledSpeed
        this.atbSpeed = Math.max(scaledSpeed, 0.05) * 10 + 1;

    }
    addGambit(gambit, action) {
        gambit.addAction(action);

        this.gambitList.push(gambit);
    }
    fitOnRadius(element, custom = 1) {
        element.scale.set(1)
        let scl = Math.abs(this.radius * 2 / (element.width) * custom)
        element.scale.set(scl)
        return scl;
    }
    setGridStartPosition(gridPosition){
        this.gridPosition = gridPosition;
    }
    reset(scale = 1, spriteOffset = {
        x: 0,
        y: 0
    }) {

        this.actionType = StandardEntity.ACTIONS.WAIT;
        this.applyWeaponStats();

        this.jumpSpeed = 80;

        this.actionSpeedMultiplier = this.weapon.speedMultiplier;
        
        this.actingTime = 0.3;

        this.hp = this.entityModel.hp;

        this.attackPower = 35;

        this.gravity = 300;

        this.accuary = 1;

        this.currentActingTime = this.actingTime;

        this.spriteOffset = spriteOffset;

        this.readyLabel.text = 'READY!'

        this.gameOver = false;

        this.activeGambit = null;

        this.timer = 0;
        this.atb = Math.random();
        this.sin = Math.random();;
        // this.onDie.removeAll();
        this.finishTimer = -1;
        this.noScalable = false;
        this.isFinished = false;
        this.dying = false;
        this.killed = false;
        this.readyToAct = false;
        this._scale = 1;

        this.readyLabel.alpha = 0;

        if (this.isHero) {
            this.entitySprite.scale.set(1)
            //console.log(this.graphicsData.baseWidth, scale);
            let scl = Math.abs(this.radius * 2 / (this.graphicsData.baseWidth) * scale)
            this.entitySprite.scale.set(scl)

            this.entityScale = scl
        } else {
            this.entityScale = this.fitOnRadius(this.entitySprite, scale)
        } // console.log(this.entityScale);
        this.entitySprite.x = this.spriteOffset.x;
        this.entitySprite.y = this.spriteOffset.y;
        this.entitySprite.rotation = 0;

        this.resetVelocity();

        this.updateGravity(Math.random());

        this.uiContainer.visible = true;

        if (this.starterPosition) {
            this.x = this.starterPosition.x
            this.y = this.starterPosition.y
        }


        this.acceleration = {
            x: 20,
            y: 20
        }

        this.virtualVelocity = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.angularSpeed = 0;


        this.lifeBar.updatePowerBar(this.hp / this.entityModel.hp, this.frontLifeBarColor, true)
        this.atbBar.updatePowerBar(this.atb, 0xFFFF00, true)

        this.blinkTimer = 0;

    }
    getHpPercent() {
        return this.hp / this.entityModel.hp;
    }
    getSpriteHigh() {
        return this.entitySprite.y;
    }
    applyScale() {
        this.realScale = {
            x: this.scale.x,
            y: this.scale.y
        }
        this.starterPosition = {
            x: this.x,
            y: this.y
        }
    }
    killEntity() {
        if(this.killed){
            return;
        }
        this.killed = true;
        this.actionType = StandardEntity.ACTIONS.DEAD;
        this.readyLabel.text = 'DEAD!'
        this.readyLabel.visible = true
        this.readyLabel.alpha = 1
        this.entitySprite.rotation = Math.PI / 2
        this.entitySprite.x = -this.entitySprite.height / 2
        this.entitySprite.y = -this.entitySprite.width / 4
        this.uiContainer.visible = false;
        this.onDie.dispatch(this);
    }
    revive(hp) {
        this.killed = false;
        this.readyToAct = false;
        this.hp = hp;
        this.readyLabel.text = ''
        this.actionType = StandardEntity.ACTIONS.WAIT;
        this.atb = Math.random();
        this.entitySprite.x = this.spriteOffset.x;
        this.entitySprite.y = this.spriteOffset.y;
        this.entitySprite.rotation = 0;
        this.uiContainer.visible = true;
        this.lifeBar.updatePowerBar(this.hp / this.entityModel.hp, this.frontLifeBarColor, true)
    }
    attacked(demage, from, kickback = 0) {
        this.hp -= demage;

        //if action started doesnt kickback
        if (kickback && this.actionType != StandardEntity.ACTIONS.ACTING) {
            let kickbackAngle = -Math.atan2(this.y - from.y, this.x - from.x);

            this.kickbackVelocity.x = (kickback) * Math.cos(kickbackAngle);
            this.kickbackVelocity.y = (-kickback) * Math.sin(kickbackAngle);
            this.kickbackVelocity.kickbackTimer = 1;
        }

        if (this.hp <= 0) {
            this.hp = 0;
            this.lifeBar.updatePowerBar(0, this.frontLifeBarColor, true)
            this.killEntity();
            return true;
        }
        if (this.hp > this.entityModel.hp) {
            this.hp = this.entityModel.hp;
        }

        this.lifeBar.updatePowerBar(this.hp / this.entityModel.hp, this.frontLifeBarColor, true)
    }

    whileGoingToActionStill(delta) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.distanceSpeed = 0;
        this.attackAngle = 0;

        // if(this.isHero){
        //     console.log(this.currentActingTime)
        // }

        // if(this.currentActingTime > 0){
        //     this.currentActingTime -= delta;
        //     if(this.currentActingTime <= 0){
        //         this.finishAttack();
                
        //     }
        // }
    }
    whileGoingToAction(delta) {


        this.updateRealTargetPosition();
        this.attackAngle = -Math.atan2(this.y - this.realTarget.y, this.x - this.realTarget.x);
        this.distanceSpeed = utils.distance(this.y, this.x, this.realTarget.y, this.realTarget.x)

        let distance = 0;
        let targetScale = 1;

        distance = utils.distance(this.y, this.x, this.realTarget.y, this.realTarget.x)

        let pass = false

        if (this.kickbackVelocity.kickbackTimer > 0) {
            return
        }
        if (distance < this.radius || pass) {
            this.doAction();
            return;
        }

    }
    isOnSlot(){
        return utils.distance(this.y, this.x, this.starterPosition.y, this.starterPosition.x) < this.radius / 3
    }
    whileReturningFromAction(delta) {

        let targetScale = 1;
        
        let pass = false
        // (this.velocity.y < 0 && this.y < this.starterPosition.y ||
        //          this.velocity.y > 0 && this.y > this.starterPosition.y)
        // (this.velocity.y < 0 && this.y < this.starterPosition.y ||
        //     this.velocity.y > 0 && this.y > this.starterPosition.y)
        this.attackAngle = -Math.atan2(this.y - this.starterPosition.y, this.x - this.starterPosition.x);
        // if(this.isHero){
        //     console.log(this.kickbackVelocity.kickbackTimer,'whileReturningFromAction')
        // }
        
        if (this.kickbackVelocity.kickbackTimer > 0) {
            return
        }

        let distance = 0;
        distance = utils.distance(this.y, this.x, this.starterPosition.y, this.starterPosition.x)
        if (distance < this.radius / 3 || pass) {
            // if (distance < this.radius / 2 || pass) {

               
            this.finishAttack();
            return;
        }

    }
    whileActing(delta) {

        // if(this.isHero){
        //     console.log("ACTING")
        // }
        this.currentActingTime -= delta;
        if (this.currentActingTime <= 0) {

            this.onActing.dispatch(this, this.currentTarget);

            this.activeGambit.resultAction.doAction();

            this.startReturnFromAction();            

            this.jump(delta)
            this.attackAngle = -Math.atan2(this.y - this.starterPosition.y, this.x - this.starterPosition.x);
        }
    }

    setActionMultiplier(value = 1){
        this.actionSpeedMultiplier = value;
    }
    gameOverState() {
        this.uiContainer.visible = false;
        this.gameOver = true;
    }


    updateGravity(delta) {
        if (this.entitySprite.y >= this.spriteOffset.y) {
            this.entitySprite.y = this.spriteOffset.y

            if (this.actionType == StandardEntity.ACTIONS.RETURNING ||
                this.actionType == StandardEntity.ACTIONS.START_ACT) {

                this.jump(delta)
            }
            // this.jumpForce = 0;
        } else {
            this.entitySprite.y -= this.jumpForce * delta;
            this.jumpForce -= this.gravity * delta;
            // this.jumpForce = Math.max(this.jumpForce, 0);
        }
    }
    updateForces(delta, debug) {


        let speed = this.entityModel.getMovementSpeed();


        if (this.activeGambit && !this.activeGambit.resultAction.requireMovement) {
            //speed = 0;
        }

        if (this.actionType == StandardEntity.ACTIONS.ACTING && this.currentActingTime > 0){
            this.velocity.x = 0;
            this.velocity.y = 0;
        }else{

            let extraAngle = this.attackAngle;
            this.velocity.x = -(speed) * Math.cos(extraAngle);
            this.velocity.y = (speed) * Math.sin(extraAngle);
        }
            
        if (this.velocity.x < 0) {
            this.dir = -1
            this.entitySprite.scale.x = -Math.abs(this.entitySprite.scale.x)
        } else if (this.velocity.x > 0) {
            this.dir = 1
            this.entitySprite.scale.x = Math.abs(this.entitySprite.scale.x)
        }

        if (this.kickbackVelocity.kickbackTimer > 0) {
            this.kickbackVelocity.kickbackTimer -= delta;
            this.velocity.x += this.kickbackVelocity.x
            this.velocity.y += this.kickbackVelocity.y
        }

        this.x += this.velocity.x * this._scale * delta;
        this.y += this.velocity.y * this._scale * delta;
    }



    finishAttack() {

        this.endReturnFromAction();

    
        
        //this.x = this.starterPosition.x;
        //this.y = this.starterPosition.y;

        TweenMax.to(this, 0.2, {x:this.starterPosition.x,y:this.starterPosition.y})
        
        this.entitySpriteContainer.x = 0;
        this.entitySpriteContainer.y = 0;
        this.entitySpriteContainer.scale.set(1)
        // this.entitySprite.y = 0
        this.resetVelocity();

        if (!this.gameOver) {
            this.uiContainer.visible = true;
        }
        this.atbBar.visible = true;
        // this.readyLabel.visible = false;

    }

    update(delta) {
        if (this.killed) {
            return;
        }

        this.applyStatus();


        if (this.actionType != StandardEntity.ACTIONS.WAIT) {
            this.updateGravity(delta);
            this.updateForces(delta);
            switch (this.actionType) {
                case StandardEntity.ACTIONS.START_ACT:
                    {
                        this.whileGoingToAction(delta);
                        break;
                    }
                case StandardEntity.ACTIONS.START_ACT_STILL:
                    {
                        //this.whileGoingToActionStill(delta);
                        //this.whileGoingToActionStill(delta);
                        break;
                    }
                case StandardEntity.ACTIONS.ACTING:
                    {
                        this.whileActing(delta);
                        break;
                    }
                case StandardEntity.ACTIONS.RETURNING:
                    {
                        this.whileReturningFromAction(delta);
                        break;
                    }
            }
            return
        }else{
            if(!this.isOnSlot() || this.kickbackVelocity.kickbackTimer > 0){
                
                this.whileReturningFromAction(delta);
                this.updateForces(delta, true);
            }
        }

        

        this.updateGravity(delta);
        this.sin += delta * 5;
        this.sin %= Math.PI * 2;
        this.entitySprite.scale.x = (this.entityScale * this.dir) + Math.sin(this.sin) * 0.02
        this.entitySprite.scale.y = this.entityScale + Math.cos(this.sin) * 0.02

        if (this.gameOver) {
            return;
        }
        if (this.atb >= 1) {
            this.blinkTimer += delta;
            if (this.blinkTimer > 0.5) {
                this.blinkTimer = 0;
            }
            this.readyToAction()
        } else {

            this.atb += (delta* this.actionSpeedMultiplier / this.atbSpeed) ;
            this.atbBar.visible = true;
            this.atbBar.updatePowerBar(this.atb, 0xFFFF00, true)
        }



    }

    applyStatus() { }

    startReturnFromAction() {
        this.actionType = StandardEntity.ACTIONS.RETURNING;
    }
    endReturnFromAction() {
        this.actionType = StandardEntity.ACTIONS.WAIT;
    }

    startAction(gambit) {

        //if(this.isHero) console.log("startAction")
        this.activeGambit = gambit;
        this.onStartAction.dispatch(this, gambit, this.currentTarget);

     
        if (gambit.resultAction.requireMovement) {
            this.actionType = StandardEntity.ACTIONS.START_ACT;
        } else {
            this.actionType = StandardEntity.ACTIONS.START_ACT_STILL;
            this.doAction();
        }
    }

    doAction() {
        this.actionType = StandardEntity.ACTIONS.ACTING;
    }

    jump(delta) {
        this.jumpForce = this.jumpSpeed;
        this.entitySprite.y -= this.jumpForce * delta;
    }
    act(gambit, target, targetPosition) {
        if (!this.readyToAct || !this.actionType == StandardEntity.ACTIONS.WAIT) {
            return;
        }

        if (this.isHero) {
            this.uiContainer.visible = false;
        }
        this.currentActingTime = this.weapon.actingTime

        this.currentTarget = target;
        this.targetPosition = targetPosition;
        if (this.targetPosition) {
            this.realTarget = this.targetPosition;
        } else {
            this.realTarget = {
                x: this.currentTarget.starterPosition.x, // - this.x, // * this.realScale.x,
                y: this.currentTarget.starterPosition.y //- this.y // * this.realScale.x
            }
        }
        this.distanceSpeed = utils.distance(this.y, this.x, this.realTarget.y, this.realTarget.x)
        this.attackAngle = -Math.atan2(this.y - this.realTarget.y, this.x - this.realTarget.x);

        this.jump(1 / 60)

        this.readyToAct = false;

        TweenLite.killTweensOf(this.readyLabel)
        TweenLite.killTweensOf(this.readyLabel.scale)
        this.readyLabel.alpha = 0;
        this.atb = 0;
        this.atbBar.updatePowerBar(this.atb, 0xFFFF00, true);

        this.startAction(gambit);
    }

    updateRealTargetPosition() {
        if (this.targetPosition) {
            this.realTarget = this.targetPosition;
        } else {
            this.realTarget = {
                x: this.currentTarget.x, // - this.x, // * this.realScale.x,
                y: this.currentTarget.y //- this.y // * this.realScale.x
            }
        }
    }
    readyToAction() {
        if (this.readyToAct) {
            return;
        }
        this.readyToAct = true;

        this.atbBar.updatePowerBar(this.atb, 0xFFFF00, true)

        TweenLite.to(this.readyLabel, 0.5, {
            alpha: 1
        })
        this.atbBar.visible = false;
        this.readyLabel.visible = true;
        this.readyLabel.text = 'READY!'

        this.readyLabel.scale.set(this.readyLabelScale * 1.3, this.readyLabelScale * 0.7)
        TweenLite.to(this.readyLabel.scale, 0.5, {
            x: this.readyLabelScale,
            y: this.readyLabelScale,
            ease: Elastic.easeOut

        })
        // this.readyLabel
    }
    speedScale(scale) {
        this._scale = scale;
    }

    udpateVelocity() {
        let axis = ['x', 'y']
        for (var i = 0; i < axis.length; i++) {
            if (this.velocity[axis[i]] < this.virtualVelocity[axis[i]]) {
                this.velocity[axis[i]] += this.acceleration[axis[i]];
                if (this.velocity[axis[i]] > this.virtualVelocity[axis[i]]) {
                    this.velocity[axis[i]] = this.virtualVelocity[axis[i]];
                }
            } else if (this.velocity[axis[i]] > this.virtualVelocity[axis[i]]) {
                this.velocity[axis[i]] -= this.acceleration[axis[i]];
                if (this.velocity[axis[i]] < this.virtualVelocity[axis[i]]) {
                    this.velocity[axis[i]] = this.virtualVelocity[axis[i]];
                }
            }
        }

    }
    resetVelocity() {
        this.jumpForce = 0;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.virtualVelocity = {
            x: 0,
            y: 0
        }
        this.targetPosition = null;
        this.kickbackVelocity = {
            x: 0,
            y: 0,
            kickbackTimer: 0
        }
    }


    destroy(forced = false, dispatchSound = true) {
        this.noScalable = true;
        this.dying = true;
        this.onDestroy.dispatch(this, forced);
        this.onDestroy.removeAll();

    }
    resetCard() { }
    updateCard() { }
    forceDestroy() {
        this.parent.removeChild(this);
    }

}