import * as PIXI from 'pixi.js';
import Signals from 'signals';
import MergeTile from './MergeTile';
export default class ChargerTile extends MergeTile {
    constructor(i, j, size, lockIcon) {
        super(i, j, size, lockIcon);
    }
    update(delta){
        super.update(delta);
    }
}