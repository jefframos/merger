
import StandardGambit from './StandardGambit';
export default class GambitHighestHP extends StandardGambit {
    constructor(entity, requireOpposite) {
        super(entity, requireOpposite)
        this.type = 'HIGHEST'
        this.secType = 'HP'
    }
    findEntity(list) {
        let max = -9999999999999
        let id = 0
        for (var i = 0; i < list.length; i++) {
            if (!list[i].killed && list[i].getHpPercent() > max) {
                id = i
                max = list[i].getHpPercent()
            }
        }
        return list[id];
    }
}