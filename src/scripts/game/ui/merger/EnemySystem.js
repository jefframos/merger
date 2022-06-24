import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import StandardEnemy from './StandardEnemy';

export default class EnemySystem {
    constructor(containers) {
        this.container = containers.mainContainer;

        this.mainEnemy = new StandardEnemy();
        this.container.addChild(this.mainEnemy);


    }
    getEnemy(){
        return this.mainEnemy;
    }
    update(delta) {
        this.mainEnemy.update(delta)
    }
}