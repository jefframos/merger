import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import UIButton1 from '../UIButton1';
import EnemyProgressionView from './enemy/EnemyProgressionView';
import ProgressBar from './ProgressBar';
import StandardEnemy from './StandardEnemy';

export default class EnemySystem {
    constructor(containers) {
        this.container = containers.mainContainer;
        this.onPopLabel = new Signals();
        this.onNextEnemy = new Signals();
        this.onParticles = new Signals();
        this.onGetResources = new Signals();

        this.mainEnemy = new StandardEnemy();
        this.container.addChild(this.mainEnemy);

        this.enemyProgressionView = new EnemyProgressionView(this);
        this.container.addChild(this.enemyProgressionView);

        //color, icon, iconColor =0xFFFFFF, width = 40, height = 40

        this.invokeBossBattle = new UIButton1(0xff2299, 'capital_ship_01', 0xFFFFFF, 80, 50)
        this.container.addChild(this.invokeBossBattle)
        this.invokeBossBattle.x = config.width / 2 - 70
        this.invokeBossBattle.y = 50
        this.invokeBossBattle.onClick.add(() => {
            this.invokeBoss()
        })

        this.enemyProgressionView.y = - 35

        this.enemyStartLife = 10;
        this.enemyLife = 10;
        this.enemyCurrentLife = 10;
        this.lifeCoefficient = 1.13
        this.enemyLevel = 1;
        this.nextBoss = 10;
        this.bossGap = 10;

        this.enemyLifeBar = new ProgressBar({ width: 200, height: 18 });
        this.container.addChild(this.enemyLifeBar)
        this.enemyLifeBar.pivot.x = this.enemyLifeBar.width / 2
        this.enemyLifeBar.y = -5


        this.bossBattleTimer = new ProgressBar({ width: 200, height: 10 });
        this.container.addChild(this.bossBattleTimer)
        this.bossBattleTimer.pivot.x = this.bossBattleTimer.width / 2
        this.bossBattleTimer.y = 15

        this.bossTimerLabel = new PIXI.Text('', LABELS.LABEL1);
        this.bossTimerLabel.style.fontSize = 12
        this.container.addChild(this.bossTimerLabel)

        this.bossTimerLabel.x = this.bossBattleTimer.x + this.bossBattleTimer.width / 2 + 5
        this.bossTimerLabel.y = this.bossBattleTimer.y - 3


        this.label = new PIXI.Text('', LABELS.LABEL1);
        this.label.style.fontSize = 14
        this.container.addChild(this.label)


        this.mainEnemy.y =80
        this.lockOnLevel = false;
        this.loadData();
        this.updateEnemyLife();
        this.updateLevelView();

        this.damageColors = [0xec3e3e, 0xff9000, 0xffd200]

        this.enemyDeathTimer = 0;
        this.bossTimer = 0;
        this.bossDefaultTimer = 60;

    }

    loadData() {
        this.savedProgression = COOKIE_MANAGER.getProgression();
        this.enemyLevel = this.savedProgression.currentEnemyLevel;
        this.calcNextBoss();

        if (this.enemyLevel % this.bossGap == 0) {
            this.bankBoss()
        } else {
            this.enemyCurrentLife = this.savedProgression.currentEnemyLife
        }
    }
    calcNextBoss() {

        this.nextBoss = this.enemyLevel + this.bossGap - this.enemyLevel % this.bossGap;
    }
    getEnemy() {
        return this.mainEnemy;
    }
    update(delta) {

        this.invokeBossBattle.visible = this.lockOnLevel && !this.inABossBattle;


        if (this.enemyDeathTimer > 0) {
            this.enemyDeathTimer -= delta;
            this.mainEnemy.alpha = 0;
            this.updateVisibleUI();
            return;
        } else if (this.enemyDeathTimer < 0.5) {
            this.mainEnemy.alpha = utils.lerp(this.mainEnemy.alpha, 1, delta * 2);
        }

        if (this.inABossBattle && this.bossTimer > 0) {
            this.bossTimer -= delta;
            this.bossBattleTimer.setProgressBar(this.bossTimer / this.bossDefaultTimer, 0xFF00FF)

            this.bossTimerLabel.text = this.bossTimer.toFixed(1)

            if (this.bossTimer <= 0) {
                this.bankBoss();
            }
        }
        this.updateVisibleUI();


        this.mainEnemy.update(delta)
        this.enemyLifeBar.setProgressBar(this.enemyCurrentLife / this.enemyLife, 0xFF0000)



        this.updateLifeLabel();


    }
    updateMouse(e) {

    }
    updateLevelView() {
        this.enemyProgressionView.updateLevel();
    }
    isAlive() {
        return this.enemyDeathTimer <= 0;
    }
    invokeBoss() {
        this.setAsBos();
    }
    bankBoss() {
        this.lockOnLevel = true;
        this.inABossBattle = false;

        this.nextEnemy(true);
    }
    setAsBos() {

        this.updateEnemyLife(true);
        this.inABossBattle = true;
        this.mainEnemy.setAsBoss();
        this.mainEnemy.alpha = 0;
        this.bossTimer = this.bossDefaultTimer;
        this.enemyDeathTimer = 2;
        this.updateLevelView();
        this.calcNextBoss();


    }
    nextEnemy(bossWin = false) {
        if (!this.lockOnLevel) {
            this.enemyLevel++;
            this.inABossBattle = false;
        }
        this.enemyDeathTimer = 1;
        COOKIE_MANAGER.saveEnemyLevel(this.enemyLevel);
        this.updateEnemyLife();
        this.updateLevelView();

        if (bossWin) {
            this.mainEnemy.setAsEnemy();
            return
        }

        this.addResources();
        if (this.inABossBattle || this.enemyLevel == this.nextBoss) {
            this.setAsBos();
        } else {
            this.mainEnemy.setAsEnemy();
        }
        this.calcNextBoss();

        COOKIE_MANAGER.saveEnemyLife(this.enemyCurrentLife)
        this.onNextEnemy.dispatch();
    }
    addResources() {
        let customData = {}
        customData.texture = 'coin'
        customData.scale = 0.02
        customData.alphaDecress = 0.1
        let targetPos = this.mainEnemy.getGlobalPosition()
        let reward = (window.gameEconomy.currentResources * (0.005 + Math.random() * 0.001));
        reward = Math.max(10, reward);
        this.onGetResources.dispatch(targetPos, customData, reward, 5)
    }

    updateEnemyLife(isBoss = false) {
        this.enemyLife = this.enemyStartLife *
            Math.pow(this.lifeCoefficient * this.lifeCoefficient, this.enemyLevel) *
            (isBoss ? (this.lifeCoefficient * this.lifeCoefficient) : 1)

        this.enemyCurrentLife = this.enemyLife;
    }
    damageEnemy(damage) {
        if (this.enemyDeathTimer > 0) {
            return
        }
        let ang = Math.random() * Math.PI * 2;
        let targetPosition = this.mainEnemy.getGlobalPosition()
        targetPosition.x += Math.cos(ang) * 20
        targetPosition.y += Math.sin(ang) * 10
        this.onPopLabel.dispatch(targetPosition, utils.formatPointsLabel(damage));

        this.enemyCurrentLife -= damage;


        let customData = {}
        customData.texture = 'spark2'
        customData.scale = 0.005
        customData.alphaDecress = 0.5
        customData.gravity = 0
        customData.tint = this.getDamageColor()

        for (let index = 0; index < 5; index++) {
            let particleAng = Math.random() * 3.14 * 2;
            customData.forceX = Math.cos(particleAng) * 20
            customData.forceY = Math.sin(particleAng) * 20
            this.onParticles.dispatch(targetPosition, customData, 1)
        }

        if (this.enemyCurrentLife < 0) {
            this.enemyCurrentLife = 0;
            this.updateLifeLabel();
            if (this.inABossBattle) {
                this.lockOnLevel = false;
            }
            this.nextEnemy();
        } else {
            COOKIE_MANAGER.saveEnemyLife(this.enemyCurrentLife)
        }
    }
    getDamageColor() {
        return this.damageColors[Math.floor(Math.random() * this.damageColors.length)]
    }

    updateLifeLabel() {
        this.label.text = utils.formatPointsLabel(Math.ceil(this.enemyCurrentLife)) + "/" + utils.formatPointsLabel(Math.ceil(this.enemyLife))
        this.label.x = -this.label.width / 2
        this.label.y = this.enemyLifeBar.y + 1
    }
    updateVisibleUI() {
        this.label.alpha = this.mainEnemy.alpha
        this.enemyLifeBar.alpha = this.mainEnemy.alpha
        this.bossBattleTimer.alpha = this.mainEnemy.alpha
        this.bossBattleTimer.visible = this.inABossBattle;
        this.bossTimerLabel.visible = this.bossBattleTimer.visible;
    }
}