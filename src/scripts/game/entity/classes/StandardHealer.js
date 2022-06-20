
import StandardHero from '../heroes/StandardHero';
import PlayerModel from '../model/PlayerModel';
import GambitCurrentHP from '../gambits/GambitCurrentHP';
import GambitLowestHPOrDead from '../gambits/GambitLowestHPOrDead';
import StandardSpellAction from '../actions/StandardSpellAction';
import SpellsData from '../../data/SpellsData'
import WeaponsData from '../../data/WeaponsData'
export default class StandardHealer extends StandardHero {
    constructor(radius) {
        super(radius);
        this.isHealer = true;

        this.weapon = WeaponsData.basicWand;
        //this.addGambit(new GambitLowestHPOrDead(this, false, 0.5), new StandardSpellAction(this, SpellsData.heal));
        // this.addGambit(new GambitCurrentHP(this, false, {
        //     condition: 'less',
        //     value: 0.8
        // }), new StandardSpellAction(this, SpellsData.heal));
    }
    reset(data) {        
        super.reset(data)
    }
}