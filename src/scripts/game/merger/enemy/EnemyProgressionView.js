import * as PIXI from 'pixi.js';
import Signals from 'signals';
import EnemyProgressionSlot from './EnemyProgressionSlot';
import BossCounter from './BossCounter';
export default class EnemyProgressionView extends PIXI.Container {
    constructor(enemySystem) {
        super()

        this.enemySystem = enemySystem;
        this.enemySystem.onNextEnemy.add(this.updateLevel.bind(this))
        this.prevLevelContainer = new EnemyProgressionSlot(20);
        this.addChild(this.prevLevelContainer)

        this.currentLevelContainer = new EnemyProgressionSlot(25);
        this.addChild(this.currentLevelContainer)
        this.currentLevelContainer.setFontSize(20)

        this.nextLevelContainer = new EnemyProgressionSlot(20);
        this.addChild(this.nextLevelContainer)

        this.prevLevelContainer.x = - 80
        this.nextLevelContainer.x = 80


        this.bossCounter = new BossCounter(30);
        this.addChild(this.bossCounter)

        this.bossCounter.x = 250

    }
    updateLevel() {
        let nextLevel = this.enemySystem.enemyLevel - 1
        let isBoss = this.enemySystem.nextBoss == nextLevel || nextLevel == this.enemySystem.nextBoss - this.enemySystem.bossGap;

        if (this.enemySystem.enemyLevel > 1) {
            this.prevLevelContainer.updateLevel(nextLevel, isBoss)
            this.prevLevelContainer.visible = true;
        } else {
            this.prevLevelContainer.visible = false;
        }
        nextLevel = this.enemySystem.enemyLevel
        isBoss = this.enemySystem.nextBoss == nextLevel || nextLevel == this.enemySystem.nextBoss - this.enemySystem.bossGap;        

        this.currentLevelContainer.updateLevel(nextLevel, isBoss)

        nextLevel = this.enemySystem.enemyLevel + 1
        isBoss = this.enemySystem.nextBoss == nextLevel || nextLevel == this.enemySystem.nextBoss - this.enemySystem.bossGap;
        this.nextLevelContainer.updateLevel(nextLevel, isBoss)
        this.bossCounter.updateLevel(this.enemySystem.nextBoss)
    }
}