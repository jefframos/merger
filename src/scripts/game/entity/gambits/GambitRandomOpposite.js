import * as PIXI from 'pixi.js';
import Signals from 'signals';
import StandardGambit from './StandardGambit';
export default class GambitRandomOpposite extends StandardGambit {
    constructor(entity, requireOpposite) {
    	super(entity, requireOpposite)
        this.type = 'RANDOM'
        this.secType = 'OPPOSITE'

    }
    sortOutList(heroes, monsters) {
        let opposite = true
        if (this.entity.isHero) {
            if (opposite) {
                return monsters
            } else {
                return heroes
            }
        } else if (this.entity.isMonster) {
            if (opposite) {
                return heroes
            } else {
                return monsters
            }
        }
    }
    findEntity(list) {
    	for (var i = 0; i < list.length; i++) {
            if(!list[i].killed){
                return list[i];
            }
        }
        return list[0];
    }
}