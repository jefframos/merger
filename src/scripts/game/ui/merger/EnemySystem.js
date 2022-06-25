import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import ProgressBar from './ProgressBar';
import StandardEnemy from './StandardEnemy';

export default class EnemySystem {
    constructor(containers) {
        this.container = containers.mainContainer;
        this.onPopLabel = new Signals();

        this.mainEnemy = new StandardEnemy();
        this.container.addChild(this.mainEnemy);

        this.enemyLife = 10;
        this.enemyCurrentLife = 10;
        this.lifeCoefficient = 1.03
        this.enemyLevel = 1;

        this.progressBar = new ProgressBar({ width: 200, height: 20 });
        this.label = new PIXI.Text('', LABELS.LABEL1);
        this.container.addChild(this.progressBar)
        this.container.addChild(this.label)
        this.progressBar.pivot.x = this.progressBar.width/2
        this.progressBar.y = 70
    }

    getEnemy(){
        return this.mainEnemy;
    }
    update(delta) {
        this.mainEnemy.update(delta)
        this.progressBar.setProgressBar(this.enemyCurrentLife / this.enemyLife, 0xFF0000)

        
        this.label.text = "Level "+this.enemyLevel+ "   "+utils.formatPointsLabel(this.enemyCurrentLife)+"/"+utils.formatPointsLabel(this.enemyLife)
        this.label.x = -this.label.width / 2
        this.label.y = this.progressBar.y + 22


    }
    updateMouse(e){

    }
    nextEnemy(){
        this.enemyLevel++;
        this.enemyLife = this.enemyLife * Math.pow(this.lifeCoefficient, this.enemyLevel)
        this.enemyCurrentLife = this.enemyLife;
    }

    damageEnemy(damage){

        let ang = Math.random() * Math.PI * 2;
        let targetPosition = this.mainEnemy.getGlobalPosition()
        targetPosition.x += Math.cos(ang) * 20
        targetPosition.y += Math.sin(ang) * 10
        this.onPopLabel.dispatch(targetPosition, utils.formatPointsLabel(damage));

        this.enemyCurrentLife -= damage;

        if(this.enemyCurrentLife < 0){
            this.nextEnemy();
        }

    }
}