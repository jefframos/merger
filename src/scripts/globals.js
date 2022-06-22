import config from './config';
import utils from './utils';


window.config = config;
window.utils = utils;

window.CATS_POOL = [];
window.LABEL_POOL = [];
window.COINS_POOL = [];
window.BLOOD_POOL = [];
window.SHADOW_POOL = [];
window.BULLET_POOL = [];

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
window.isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);