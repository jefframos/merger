import * as PIXI from 'pixi.js';
import Signals from 'signals';
import StandardGambit from './StandardGambit';
import StandardEntity from '../StandardEntity';
export default class GambitLowestHPOrDead extends StandardGambit {
    constructor(entity, requireOpposite, min = 0.5) {
        super(entity, requireOpposite)
        this.type = 'LOWEST'
        this.secType = 'HP'
        this.minHP = min;
    }
    findEntity(list) {
        let min = 9999999999999
        let id = 0

        for (var i = 0; i < list.length; i++) {
            if(list[i].killed){
                return list[i]
            }else if (list[i].getHpPercent() < min) {
                id = i
                min = list[i].getHpPercent()
            }
        }
        if(list[id].getHpPercent() >= this.minHP){
            return null;
        }
        return list[id];
    }
}