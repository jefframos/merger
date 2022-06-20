import config from './config';
import utils from './utils';
import StandardHero from './game/entity/heroes/StandardHero';
import StandardHealer from './game/entity/classes/StandardHealer';
import StandardMage from './game/entity/classes/StandardMage';
import StandardThief from './game/entity/classes/StandardThief';
import StandardWarrior from './game/entity/classes/StandardWarrior';
import StandardRanger from './game/entity/classes/StandardRanger';
import StandardBullet from './game/entity/bullets/StandardBullet';
import StandardSpell from './game/entity/bullets/StandardSpell';

import GambitCurrentHP from './game/entity/gambits/GambitCurrentHP';
import GambitRandomEntity from './game/entity/gambits/GambitRandomEntity';

import StandardAttackAction from './game/entity/actions/StandardAttackAction';
import StandardSpellAction from './game/entity/actions/StandardSpellAction';


window.config = config;
window.utils = utils;

window.CATS_POOL = [];
window.LABEL_POOL = [];
window.COINS_POOL = [];
window.BLOOD_POOL = [];
window.SHADOW_POOL = [];
window.BULLET_POOL = [];

window.GAMBITS = {
    GambitCurrentHP,
    GambitRandomEntity
}
window.ACTIONS = {
    StandardAttackAction,
    StandardSpellAction
}
window.CLASSES = {
    StandardHero,
    StandardRanger,
    StandardHealer,
    StandardBullet,
    StandardSpell,
    StandardWarrior,
    StandardMage,
    StandardThief
}


window.HEROES_GRID = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]

window.MONSTERS_GRID = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
]

window.console.warn = function () { }
window.console.groupCollapsed = function (teste) {
    return teste
} //('hided warnings')

window.MAX_NUMBER = 1000000;

window.MAIN_FONT = 'retro_computerregular'



window.LABELS = {};
window.LABELS.LABEL1 = {
    fontFamily: 'retro_computerregular',
    fontSize: '18px',
    fill: 0xFFFFFF,
    align: 'center',
    fontWeight: '800'
}
window.LABELS.LABEL_STATS = {
    fontFamily: 'retro_computerregular',
    fontSize: '14px',
    fill: 0xFFFFFF,
    align: 'center',
    fontWeight: '800'
}

window.LABELS.LABEL2 = {
    fontFamily: 'retro_computerregular',
    fontSize: '24px',
    fill: 0x000000,
    align: 'center',
    fontWeight: '800'
}

window.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);