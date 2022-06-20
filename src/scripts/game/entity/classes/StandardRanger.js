import StandardHero from '../heroes/StandardHero';
import WeaponsData from '../../data/WeaponsData'
export default class StandardRanger extends StandardHero {
    constructor(radius) {
        super(radius);

        this.weapon = WeaponsData.basicBow;


    }
}