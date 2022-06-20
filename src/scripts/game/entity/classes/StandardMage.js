import StandardHero from '../heroes/StandardHero';
import GambitHighestHP from '../gambits/GambitHighestHP';
import SpellsData from '../../data/SpellsData'
import StandardSpellAction from '../actions/StandardSpellAction';
import WeaponsData from '../../data/WeaponsData'

export default class StandardMage extends StandardHero {
    constructor(radius) {
        super(radius);
        this.weapon = WeaponsData.basicStaff;
    }
}