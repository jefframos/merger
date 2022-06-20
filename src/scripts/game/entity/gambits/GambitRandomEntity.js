import * as PIXI from 'pixi.js';
import Signals from 'signals';
import utils from '../../../utils';
import StandardGambit from './StandardGambit';
export default class GambitRandomEntity extends StandardGambit {
    constructor(entity, requireOpposite, data) {
        super(entity, requireOpposite, data);
        this.type = 'RANDOM'
        this.secType = 'HP'
    }
    findEntity(list) {
        let target = null;
        if (this.data && this.data.condition == 'closest') {

            target= this.getClosets(list);

        } else if (this.data && this.data.condition == 'farest') {
  
            target= this.getFarests(list);
        }
        else {
            utils.shuffle(list)
            for (var i = 0; i < list.length; i++) {
                if (!list[i].killed) {
                    return list[i];
                }
            }
            target = list[0];
        }
        return target;
    }
}