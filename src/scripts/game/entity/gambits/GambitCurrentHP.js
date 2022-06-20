
import StandardGambit from './StandardGambit';
export default class GambitCurrentHP extends StandardGambit {
    constructor(entity, requireOpposite, data = { condition: 'less', value: 1 }) {
        super(entity, requireOpposite, data)
        this.type = 'LOWEST'
        this.secType = 'HP'
    }
    findEntity(list) {
        let target = null;
        if (this.data.condition == 'less') {
            target = this.getLowerHP(list);
            if (target.getHpPercent() > this.data.value) {
                return null;
            }
        }
        if (this.data.condition == 'more') {
            target = this.getHighestHP(list);
            if (target.getHpPercent() < this.data.value) {
                return null;
            }
        }
        if (this.data.condition == 'lowest') {
            target = this.getLowerHP(list);            
        }
        if (this.data.condition == 'highest') {
            target = this.getHighestHP(list);           
        }
        return target;
    }    
}