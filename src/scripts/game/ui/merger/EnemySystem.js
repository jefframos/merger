import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import EnemyProgressionView from './enemy/EnemyProgressionView';
import ProgressBar from './ProgressBar';
import StandardEnemy from './StandardEnemy';

export default class EnemySystem {
    constructor(containers) {
        this.container = containers.mainContainer;
        this.onPopLabel = new Signals();
        this.onNextEnemy = new Signals();
        this.onParticles = new Signals();

        this.mainEnemy = new StandardEnemy();
        this.container.addChild(this.mainEnemy);

        this.enemyProgressionView = new EnemyProgressionView(this);
        this.container.addChild(this.enemyProgressionView);

        this.enemyProgressionView.y = - 70

        this.enemyStartLife = 10;
        this.enemyLife = 10;
        this.enemyCurrentLife = 10;
        this.lifeCoefficient = 1.13
        this.enemyLevel = 1;
        this.nextBoss = 10;

        this.progressBar = new ProgressBar({ width: 200, height: 18 });
        this.label = new PIXI.Text('', LABELS.LABEL1);
        this.label.style.fontSize = 14
        this.container.addChild(this.progressBar)
        this.container.addChild(this.label)
        this.progressBar.pivot.x = this.progressBar.width / 2
        this.progressBar.y = -35
        this.mainEnemy.y = 50
        this.loadData();
        this.updateEnemyLife();
        this.updateLevelView();
        this.enemyCurrentLife = this.savedProgression.currentEnemyLife

        this.damageColors = [0xec3e3e, 0xff9000, 0xffd200]
    }

    loadData() {
        this.savedProgression = COOKIE_MANAGER.getProgression();
        this.enemyLevel = this.savedProgression.currentEnemyLevel;
        this.calcNextBoss();
    }
    calcNextBoss() {

        this.nextBoss = this.enemyLevel + 10 - this.enemyLevel % 10;
    }
    getEnemy() {
        return this.mainEnemy;
    }
    update(delta) {
        this.mainEnemy.update(delta)
        this.progressBar.setProgressBar(this.enemyCurrentLife / this.enemyLife, 0xFF0000)

        this.label.text = utils.formatPointsLabel(this.enemyCurrentLife) + "/" + utils.formatPointsLabel(this.enemyLife)
        this.label.x = -this.label.width / 2
        this.label.y = this.progressBar.y + 1

    }
    updateMouse(e) {

    }
    updateLevelView() {
        this.enemyProgressionView.updateLevel();
    }
    nextEnemy() {
        this.enemyLevel++;
        COOKIE_MANAGER.saveEnemyLevel(this.enemyLevel);
        this.updateEnemyLife();
        this.updateLevelView();
        if (this.enemyLevel == this.nextBoss) {
            //console.log("THIS SHOULD BE A BOSS")
            this.inABossBattle = true;
        }
        this.calcNextBoss();

        COOKIE_MANAGER.saveEnemyLife(this.enemyCurrentLife)
        this.onNextEnemy.dispatch();
    }
    updateEnemyLife() {
        this.enemyLife = this.enemyStartLife * Math.pow(this.lifeCoefficient * this.lifeCoefficient, this.enemyLevel)
        this.enemyCurrentLife = this.enemyLife;
    }
    damageEnemy(damage) {

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
            this.nextEnemy();
        } else {
            COOKIE_MANAGER.saveEnemyLife(this.enemyCurrentLife)
        }
    }
    getDamageColor() {
        return this.damageColors[Math.floor(Math.random() * this.damageColors.length)]
    }
}