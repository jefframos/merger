import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';
import TweenLite from 'gsap';
import config from '../../config';
import utils from '../../utils';
import Screen from '../../screenManager/Screen'
import StandardEntity from '../entity/StandardEntity'
import Signals from 'signals';
import DungeonGenerator from '../../dungeonGenerator/DungeonGenerator'
import Minimap from '../ui/hudElements/Minimap'
import GameplayView from '../view/GameplayView'

import charData from '../data/StaticCharData'
import monsterData from '../data/StaticMonsterData'
import UIButton1 from '../ui/UIButton1';

export default class GameScreen extends Screen {
    constructor(label) {
        super(label);


        this.gameContainer = new PIXI.Container();

        this.gameplayView = new GameplayView();
        this.gameContainer.addChild(this.gameplayView)
        this.UIContainer = new PIXI.Container();
        this.fxLayer1 = new PIXI.Container();



        this.vignette = new PIXI.Sprite.from('vignette'); //new PIXI.Sprite(PIXI.Texture.from('vignette.png'));       
        this.UIContainer.addChild(this.vignette);


        this.vignette.anchor.set(0.5);
        this.vignette.x = config.width / 2;
        this.vignette.y = config.height / 2;
        this.vignette.scale.set(config.width / this.vignette.width * 1.1);
        this.vignette.alpha = 4


        this.addChild(this.gameContainer);
        this.addChild(this.UIContainer);
        this.addChild(this.fxLayer1);

        this.particlesList = [];
        this.scaleableElements = [];
        this.updateable = false;
        this.interactive = true;

        this.gameTimer = 0;
        this.gameTimeScale = 1;


        this.monstersDataGrid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 1, 0]
        ]


        // this.bloodColor = ['0x7F1B1B', '0xFF0000']
        // this.bloodColorMonster = ['0x267613', '0x23920a']
        // this.bloodColorMonsterDemage = [0xcc6600, 0xbb4400]
        this.bloodList = [];
        this.entityList = [];
        this.monsterList = [];
        this.heroList = [];
        this.bulletList = [];

        this.currentLabels = [];

        this.scaleFactor = {
            min: 0.5,
            max: 1.2
        }

        this.xFactor = {
            min: 0.75,
            max: 1
        }




        this.gameStarted = false;
        // this.resetGame();


        this.onGameOver = new Signals()

        this.dungeonGenerator = new DungeonGenerator();
        //seed = 0, precision = 1, minMax = [30, 45], bounds = [32,32], maxLenght = 20
        // this.dungeonGenerator.log()

        this.heroesDataGrid = PARTY_DATA.currentParty




        this.buildUI();
        this.hideHUD();


    }
    buildGrids() {
        for (var i = 0; i < this.heroesDataGrid.length; i++) {
            for (var j = 0; j < this.heroesDataGrid[i].length; j++) {
                let heroData = this.heroesDataGrid[i][j]
                if (heroData) {
                    this.addHero(j, i, PARTY_DATA.getStaticCharData(heroData.type))
                }
            }
        }

        for (var i = 0; i < this.monstersDataGrid.length; i++) {
            for (var j = 0; j < this.monstersDataGrid[i].length; j++) {
                if (this.monstersDataGrid[i][j]) {
                    this.addMonster(j, i)
                }
            }
        }

    }
    /////////////UI
    onBack() {
        this.screenManager.change('PartyScreen');
        this.gameStarted = false;
    }
    buildUI() {

        this.speedUp = new UIButton1(0, 'smallButton')
        //this.speedUp.addLabelRight("PARTY")
        this.speedUp.onClick.add(()=>{
            window.SPEED_UP ++;
            window.SPEED_UP %= 5;
            window.SPEED_UP = Math.max(window.SPEED_UP,1);
            this.updateLabels();
        })       
        this.speedUp.scale.set(config.height / this.speedUp.height * 0.08)
        this.speedUp.x = config.width - this.speedUp.width / 2
        this.speedUp.y =  this.speedUp.height / 2
        
        this.UIContainer.addChild(this.speedUp)

        this.resetDataButton = new PIXI.Sprite.from('button-1');
        this.UIContainer.addChild(this.resetDataButton)
        this.resetDataButton.interactive = true;
        this.resetDataButton.buttonMode = true;
        this.resetDataButton.on('mousedown', this.onBack.bind(this)).on('touchstart', this.onBack.bind(this));
        this.resetDataButton.scale.set(config.width / this.resetDataButton.width * 0.1)

        this.resetDataButton.x = this.resetDataButton.width * 0.5
        this.resetDataButton.y = this.resetDataButton.height * 0.5

        this.heroesLabel = new PIXI.Text('', {
            fontFamily: 'retro_computerregular',
            fontSize: '18px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        this.heroesLabel.y = this.resetDataButton.y //this.gameplayView.heroesArea.y
        this.heroesLabel.x = config.width * 0.25
        // this.heroesLabel.y = this.gameplayView.heroesArea.y
        this.UIContainer.addChild(this.heroesLabel)

        this.monstersLabel = new PIXI.Text('', {
            fontFamily: 'retro_computerregular',
            fontSize: '18px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        // this.monstersLabel.y = this.gameplayView.monstersArea.y
        this.monstersLabel.y = this.resetDataButton.y //this.gameplayView.monstersArea.y
        this.monstersLabel.x = config.width * 0.5
        this.UIContainer.addChild(this.monstersLabel)

        this.minimap = new Minimap();
        this.minimap.setArea(200, 200);

        this.minimap.pivot.x = this.minimap.width / 2 //* this.miniMapScale//200 * this.miniMapScale / 2;
        this.minimap.pivot.y = this.minimap.height / 2 //* this.miniMapScale//200 * this.miniMapScale / 2;
        // this.dungeonGenerator.generate(Math.random() * 0xFFFFFF,1, [10, 12], [8,8]);
        // this.minimap.build(this.dungeonGenerator);
        // this.minimap.centerMap(this.dungeonGenerator.firstNode);

        let mapMargin = config.width * 0.02
        this.miniMapScale = config.width / 200 * 0.2
        this.minimap.scale.set(this.miniMapScale)


        this.minimap.x = config.width - mapMargin - this.minimap.width / 2
        this.minimap.y = mapMargin + this.minimap.height / 2;
        //this.UIContainer.addChild(this.minimap)
    }
    hideHUD() {
        this.minimap.visible = false;
    }
    showHUD() {
        this.minimap.scale.set(0);
        this.minimap.alpha = 0;
        TweenLite.to(this.minimap, 0.75, {
            alpha: 0.5
        })
        TweenLite.to(this.minimap.scale, 1, {
            x: this.miniMapScale,
            y: this.miniMapScale,
            ease: Elastic.easeOut
        })
        this.minimap.visible = true;
    }
    updateLabels() {
        this.monstersLabel.text = this.totalMonstersKilled + '/' + this.totalMonsters
        this.heroesLabel.text = this.totalHeroesKilled + '/' + this.totalHeroes + '  -  '+window.SPEED_UP+'X'
    }

    popLabel(pos, label, delay = 0, dir = 3, scale = 1, randonRotation = true, colorData = {
        fill: 0xFF0000,
        stroke: 0x7F1B1B
    }) {
        // return
        let tempLabel = null;
        if (LABEL_POOL.length) {
            tempLabel = LABEL_POOL[0];
            tempLabel.text = label;
            LABEL_POOL.shift();
        } else {
            tempLabel = new PIXI.Text(label, {
                fontFamily: 'retro_computerregular',
                fontSize: '24px',
                fill: 0xFF0000,
                // fill: 0xFFFFFF,
                align: 'center',
                stroke: 0x7F1B1B,
                strokeThickness: 1,
                fontWeight: '800'
            });
        }
        // console.log(colorData);
        this.fxLayer1.addChild(tempLabel);
        tempLabel.style.fill = colorData.fill;
        tempLabel.style.stroke = colorData.stroke;
        tempLabel.x = pos.x;
        tempLabel.y = pos.y;
        tempLabel.pivot.x = tempLabel.width / 2;
        tempLabel.pivot.y = tempLabel.height / 2;
        tempLabel.alpha = 0;
        tempLabel.scale.set(0);
        tempLabel.rotation = randonRotation ? Math.random() - 0.5 : 0;
        this.currentLabels.push(tempLabel);
        TweenLite.to(tempLabel.scale, 0.3, {
            x: scale,
            y: scale,
            ease: Back.easeOut
        })
        TweenLite.to(tempLabel, 1, {
            delay: delay,
            y: tempLabel.y - 50 * dir,
            rotation: 0,
            onStartParams: [tempLabel],
            onStart: function (temp) {
                temp.alpha = 1;
            }
        })
        TweenLite.to(tempLabel, 0.5, {
            delay: 0.5 + delay,
            alpha: 0,
            onCompleteParams: [tempLabel],
            onComplete: (temp) => {
                temp.parent.removeChild(temp);
                LABEL_POOL.push(temp);

                for (var i = 0; i < this.currentLabels.length; i++) {
                    if (this.currentLabels[i] == temp) {
                        this.currentLabels.splice(i, 1);
                        break
                    }
                }
            }
        })
    }
    shootBullet(entity, target, bulletData) {

        //console.log(entity, target)
        let bullet = this.gameplayView.addBullet(entity, bulletData);
        let targetList = this.heroList;
        if (entity.isHero) {
            if(entity.activeGambit.requireOpposite){
                targetList = this.monsterList;
            }
        }
        bullet.onCollide.add((entity, target, type) => {
            this.rangeAct(entity, target, type);
        })

        bullet.onDestroy.add((bullet) => {
            for (var i = this.bulletList.length - 1; i >= 0; i--) {
                if (bullet == this.bulletList[i]) {
                    this.bulletList.splice(i, 1)
                    break;
                }
            }
            this.gameplayView.destroyBullet(bullet);
        })
        bullet.shoot(entity, target, targetList, bulletData)
        this.bulletList.push(bullet);
        // hero.reset(charData.thief);
    }

    destroyEntity(entity) {
        if (entity.isHero) {
            for (var i = 0; i < this.heroList.length; i++) {
                if (this.heroList[i] == entity) {
                    this.heroList.splice(i, 1)
                }
            }
        } else {
            for (var i = 0; i < this.monsterList.length; i++) {
                if (this.monsterList[i] == entity) {
                    this.monsterList.splice(i, 1)
                }
            }
        }

        this.gameplayView.destroyEntity(entity);
        // console.log('destroy', entity);
        if (entity.parent) {
            entity.parent.removeChild(entity);
        }
    }
    addMonster(i, j) {
        //POOL
        let monster = this.gameplayView.addMonster(i, j); //new StandardMonster(this.monsterRadius);
        monster.reset(monsterData.fly)
        monster.setGridStartPosition({i,j})

        this.scaleableElements.push(monster)
        monster.onDestroy.add((hero) => {
            this.destroyEntity(hero);
        })
        monster.onReadyToAttack.add((monster) => {
            let target = null;
                    let targetGambit = monster.defaultGamibt;
                    monster.gambitList.forEach(element => {
                        if(!target){
                            target = element.getEntity(this.heroList, this.monsterList)
                            if(target){
                                targetGambit = element;
                            }
                        }
                    });

                    if(!target){
                        target = monster.defaultGamibt.getEntity(this.heroList, this.monsterList)
                    }
            monster.act(targetGambit, target);
        })
        monster.onDie.add((monster) => {
            this.monsterDie(monster);
        })
        monster.onActing.add((monster, target) => {
            // console.log('MONSTA ACT');
            this.entityAct(monster, target);
        })
        monster.onShoot.add((monster, target) => {
            // this.shootBullet(monster, target);
        })

        monster.onStartAction.add((hero, gambit, target) => {
            gambit.resultAction.startAction(this);
            // this.shootBullet(hero, target)
        })
        this.monsterList.push(monster)
        this.entityList.push(monster)
        this.updateScales();
    }
    addHero(i, j, heroData) {
        let hero = this.gameplayView.addHero(i, j, heroData);
        hero.reset(heroData);
        hero.setGridStartPosition({i,j})
        this.scaleableElements.push(hero)

        hero.onDestroy.add((hero) => {
            this.destroyEntity(hero);
        })
        hero.onDie.add((hero) => {
            this.heroDie(hero);
        })
        hero.onActing.add((hero, target) => {
            this.entityAct(hero, target);
        })
        hero.onStartAction.add((hero, gambit, target) => {
            gambit.resultAction.startAction(this);
            // this.shootBullet(hero, target)
        })
        this.heroList.push(hero)
        this.entityList.push(hero)
        this.updateScales();
    }
    monsterDie(monster) {
        this.totalMonstersKilled++;
        if (this.totalMonstersKilled >= this.totalMonsters) {
            this.youWin();
            return
        }
        this.updateLabels();
    }

    heroDie(hero) {
        this.totalHeroesKilled++;


        for (var i = 0; i < Math.random() * 3 + 2; i++) {

            this.addBlood(hero, 0.02);
        }

        if (this.totalHeroesKilled >= this.totalHeroes) {
            this.youLoose();
            return
        }
        this.updateLabels();
    }

    //ACTIONSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
    rangeAct(entity, target, type = 'physical') {
        // console.log(entity.mainAction.ignoreDead);
        if (!entity.activeGambit.resultAction.ignoreDead && (
            entity.actionType == StandardEntity.ACTIONS.DEAD ||
            target.actionType == StandardEntity.ACTIONS.DEAD)) {
            this.popLabel(entity, 'MISS', 0, Math.random() * 0.5 * 1.5 + 0.5, 0.5, false);
            return;
        }

        let demageData = null;
        /////////////////////////////////////////////
        ////////////////////////////////////////////
        /////////////////////////////////////////// SE EH INIMIGO TEM QUE DAR DANO
        //console.trace()
        if (entity.activeGambit.resultAction.isEffect) {
            demageData = entity.activeGambit.resultAction.applyActionEffects(target)
        } else {
            demageData = entity.activeGambit.resultAction.applyWeaponEffects(target)
        }

        this.shake(this.gameContainer, 0.1, 3, 0.2)

        this.showAction(demageData)
    }
    entityAct(entity, target, type = 'physical') {
        if (entity.weapon.range) {
            return;
        }
        if (!entity.activeGambit.resultAction.ignoreDead && (
            entity.actionType == StandardEntity.ACTIONS.DEAD ||
            target.actionType == StandardEntity.ACTIONS.DEAD)) {
            this.popLabel(entity, 'MISS', 0, Math.random() * 0.5 * 1.5 + 0.5, 0.5, false);
            return;
        }
        let demageData = entity.activeGambit.resultAction.applyWeaponEffects(target)
        this.shake(this.gameContainer, 0.1, 3, 0.2)

        this.showAction(demageData)

    }

    addBlood(target, scl = 0.012) {
        this.gameplayView.addBlood(target, scl);
    }

    showAction(demageData) {
        let pos = {
            x: demageData.target.x,
            y: demageData.target.y
        };
        pos.y = demageData.target.y + demageData.target.getSpriteHigh();
        let tint = 0;
        tint = demageData.bloodColor[Math.floor(Math.random() * demageData.bloodColor.length)]

        let target = demageData.target
       
        if (demageData.actionType == 'miss') {
            this.popLabel(pos, "MISS", 0, Math.random() * 0.5 * 1.5 + 0.5, 0.5, false, {
                fill: demageData.demageColor[0],
                stroke: demageData.demageColor[1]
            })
            return
        }else if (demageData.actionType == 'standard') {
            this.screenManager.addCoinsParticles(target, 5, {
                scale: 0.008,
                tint: tint,
                texture: 'spark2',
                forceX: 100,
                forceY: 200,
                gravity: 300
            })

            for (var i = 0; i < Math.random() * 3; i++) {

                this.addBlood(target);
            }
        } else if (demageData.actionType == 'heal') {
            for (var i = 0; i < 8; i++) {
                pos = {
                    x: target.x - target.radius + Math.random() * target.radius * 2,
                    y: target.y - target.radius + Math.random() * target.radius
                };

                this.screenManager.addCoinsParticles(pos, 1, {
                    scale: 0.008,
                    tint: tint,
                    texture: 'spark2',
                    forceX: 0,
                    forceY: 20,
                    gravity: 0,
                    delay: i * 0.02
                })
            }
        }
        this.popLabel(pos, demageData.sign + demageData.demage, 0, Math.random() * 0.5 * 1.5 + 0.5, 0.5, false, {
            fill: demageData.demageColor[0],
            stroke: demageData.demageColor[1]
        })
    }
    resetEntities() {
        for (var i = 0; i < this.entityList.length; i++) {
            this.entityList[i].reset();
        }
    }

    destroyEntities() {
        for (var i = 0; i < this.entityList.length; i++) {
            this.entityList[i].destroy();
        }
    }

    youWin() {
        this.gameOver();
    }
    youLoose() {
        this.gameOver();
    }
    onAdded() {

    }
    build(param) {
        super.build();
        this.addEvents();
    }

    gameOver() {
        this.isGameOver = true;

        for (var i = 0; i < this.entityList.length; i++) {
            this.entityList[i].gameOverState();
        }
        this.onGameOver.dispatch();
        this.minimap.destroy();
        //this.destroyEntities();

        for (var i = 0; i < this.bulletList.length; i++) {
            this.gameplayView.destroyBullet(this.bulletList[i]);
        }
        
        // this.gameStarted = false;
        this.heroesLabel.text = ''
        this.monstersLabel.text = ''

        this.hideHUD();
    }


    resetGame(startWithBonus = false) {
        this.gameplayView.reset();
        this.destroyEntities();
        this.entityList = [];
        this.start();


        this.monstersDataGrid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 1, 0]
        ]

        for (var i = 0; i < this.monstersDataGrid.length; i++) {
            for (var j = 0; j < this.monstersDataGrid[i].length; j++) {
                if (Math.random() < 0.6) {
                    if(window.HARDER){

                        this.monstersDataGrid[i][j] = 1;
                    }
                }
            }
        }

        this.buildGrids();

        this.totalMonsters = this.monsterList.length;
        this.totalHeroes = this.heroList.length;


        this.dungeonGenerator.generate(Math.random() * 0xFFFFFF, 1, [10, 12], [8, 8]);
        this.minimap.destroy();
        this.minimap.build(this.dungeonGenerator);
        this.minimap.centerMap(this.dungeonGenerator.firstNode);

        this.showHUD();

        this.isGameOver = false;

        this.totalMonstersKilled = 0;
        this.totalHeroesKilled = 0;

        this.updateLabels();

        this.resetEntities();
    }
    scaleY(_y) {
        return _y / config.height * (this.scaleFactor.max - this.scaleFactor.min) + this.scaleFactor.min
    }
    scaleX(_x) {
        // this.xFactor
        let dist = utils.distance(_x, 0, config.width / 2, 0)
        let percentage = dist / config.width / 2;
        return _x * percentage
    }
    updateScales() {
        // return
        for (var i = 0; i < this.scaleableElements.length; i++) {
            if (!this.scaleableElements[i].noScalable) {
                let percentage = this.scaleY(this.scaleableElements[i].y)
                // if (this.scaleableElements[i].speedScale) {
                //     this.scaleableElements[i].speedScale(percentage);
                // }
                this.scaleableElements[i].scale.set(percentage)
            }
        }
    }


    start() {
        this.gameStarted = true;
    }
    update(delta) {
        delta *= window.SPEED_UP
        if (!this.gameStarted) {
            return
        }
        super.update(delta);

        for (var i = 0; i < this.entityList.length; i++) {
            this.entityList[i].update(delta);
        }

        for (var i = this.bulletList.length - 1; i >= 0; i--) {
            this.bulletList[i].update(delta);
        }
        this.updateScales();

        for (var i = this.bloodList.length - 1; i >= 0; i--) {
            let blood = this.bloodList[i]
            blood.alpha -= delta / blood.alphaSpeed;
            if (blood.alpha <= 0) {
                if (blood.parent) {
                    blood.parent.removeChild(blood.parent);
                    BLOOD_POOL.push(blood);
                    this.bloodList.splice(i, 1);
                }
            }
        }
        this.gameplayView.update(delta);
        this.findHero();
    }

    findHero() {
        if (this.isGameOver) {
            return;
        }
        for (var i = 0; i < this.entityList.length; i++) {
            if (this.entityList[i].isHero) {
                let hero = this.entityList[i];
                if ((hero.readyToAct || !hero.activeGambit) && !hero.killed) {

                    let target = null;
                    let targetGambit = hero.defaultGamibt;
                    hero.gambitList.forEach(element => {
                        if(!target){
                            target = element.getEntity(this.heroList, this.monsterList)
                            if(target){
                                targetGambit = element;
                            }
                        }
                    });
                    
                    if(!target){
                        target = hero.defaultGamibt.getEntity(this.heroList, this.monsterList)
                    }
                    
                    
                    if(!hero.activeGambit){
                        hero.setActionMultiplier(targetGambit.resultAction.getSpeedMultiplier())
                        hero.activeGambit = targetGambit
                    }else{

                        hero.act(targetGambit, target);
                    }
                    //look for the gambits until find a match
                }
            }
        }
    }
    onMouseMove(e) {
        this.mousePosition = e.data.global;
    }
    onTapUp(e) {
        this.mouseDown = false;
    }

    onTapDown(e) {
        this.mouseDown = true;
    }

    destroyLabels() {
        for (var i = 0; i < this.currentLabels.length; i++) {
            let label = this.currentLabels[i]
            if (label && label.parent) {
                TweenLite.killTweensOf(label)
                TweenLite.killTweensOf(label.scale)
                label.parent.removeChild(label);
                LABEL_POOL.push(label);
            }
        }
    }

    transitionOut(nextScreen) {
        this.removeEvents();
        this.nextScreen = nextScreen;
        setTimeout(function () {
            this.endTransitionOut();
            this.destroyEntities();
            this.destroyLabels();
        }.bind(this), 0);
    }
    transitionIn() {
        super.transitionIn();
    }
    destroy() {

    }
    removeEvents() {
        this.gameplayView.interactive = false;
        // this.screenManager.topMenu.onBackClick.removeAll();
        this.gameplayView.off('mousemove', this.onMouseMove.bind(this)).off('touchmove', this.onMouseMove.bind(this));
        this.gameplayView.off('mousedown', this.onTapDown.bind(this)).off('touchstart', this.onTapDown.bind(this));
        this.gameplayView.off('mouseup', this.onTapUp.bind(this)).off('touchend', this.onTapUp.bind(this)).off('mouseupoutside', this.onTapUp.bind(this));
    }
    addEvents() {
        // console.log(this);
        this.removeEvents();
        // this.screenManager.topMenu.onBackClick.add(this.redirectToInit.bind(this));
        this.gameplayView.interactive = true;
        this.gameplayView.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));
        this.gameplayView.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this));
        this.gameplayView.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this)).on('mouseupoutside', this.onTapUp.bind(this));

    }

    shake(target, force = 3, steps = 12, time = 1) {
        TweenLite.killTweensOf(target)
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        let startPos = {
            x: 0, //target.x,
            y: 0 //target.y
        }
        for (var i = steps; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(target, speed, {
                x: startPos.x + Math.random() * positionForce - positionForce / 2,
                y: startPos.y + Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(target, speed, {
            x: startPos.x,
            y: startPos.y,
            ease: Elastic.easeOut
        }));
    }

    // addCoinParticles(pos, quant = 1, custom = {}, playSound = true)
    // {
    //     window.screenManager.addCoinsParticles(pos, quant, custom);
    //     if(playSound){
    //         SOUND_MANAGER.play(getCoinSound(), 0.3);
    //     }
    // }




}