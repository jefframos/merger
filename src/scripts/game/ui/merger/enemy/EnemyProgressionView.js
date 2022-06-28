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
        //console.log(this.enemySystem.enemyLevel)

        if(this.enemySystem.enemyLevel > 1){
            this.prevLevelContainer.updateLevel(this.enemySystem.enemyLevel-1)
            this.prevLevelContainer.visible = true;
        }else{
            this.prevLevelContainer.visible = false;
        }

        this.currentLevelContainer.updateLevel(this.enemySystem.enemyLevel)
        this.nextLevelContainer.updateLevel(this.enemySystem.enemyLevel + 1)
        this.bossCounter.updateLevel(this.enemySystem.nextBoss)
    }
}