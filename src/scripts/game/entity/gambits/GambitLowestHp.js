
import StandardGambit from './StandardGambit';
export default class GambitLowestHp extends StandardGambit {
    constructor(entity, requireOpposite, min) {
        super(entity, requireOpposite)
        this.type = 'LOWEST'
        this.secType = 'HP'
        this.minHP = min;
    }
    findEntity(list) {
        let min = 9999999999999
        let id = 0

        for (var i = 0; i < list.length; i++) {
            if (!list[i].killed && list[i].getHpPercent() < min) {
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