import globals from './globals';
import plugins from './plugins';

import Game from './Game';
import GameData from './game/data/GameData';
import LocalStorage from './game/data/LocalStorage';
import PartyData from './game/data/PartyData';
import CookieManager from './game/CookieManager';
import HellScreenManager from './game/screen/HellScreenManager';
import MergerScreenManager from './game/screen/MergerScreenManager';
import GameScreen from './game/screen/GameScreen';

import SoundManager from './soundManager/SoundManager'
import SoundManagerCordova from './soundManager/SoundManagerCordova'
import imageManifest from './manifests/manifest-image'
import audioManifest from './manifests/manifest-audio'
import spritesheetManifest from './manifests/manifest'
import FbManager from './fb/FbManager'



window.STORAGE = new LocalStorage();
window.PARTY_DATA = new PartyData();

window.GAME_ID = 572860816402905

let audioToLoad = [] //['assets/audio/dream1.mp3', 'assets/audio/dream2.mp3']
window.SOUND_MANAGER = new SoundManager();


window.getCoinSound = function() {
    return 'coins_0' + Math.ceil(Math.random() * 4)
}




// console.log(spritesheetManifest['default'][0]);
//startLoader();
const jsons = [];
loadManifests();

function loadManifests() {
    for (var i = spritesheetManifest['default'].length - 1; i >= 0; i--) {
        let dest = 'assets/' + spritesheetManifest['default'][i]

        jsons.push(dest);
        PIXI.loader.add(dest)
    }
    PIXI.loader.load(afterLoadManifests);
}

function afterLoadManifests(evt) {

    for (var key in PIXI.utils.TextureCache) {
        var copyKey = key;
        copyKey = copyKey.substr(0, copyKey.length - 4)
        copyKey = copyKey.split('/')
        copyKey = copyKey[copyKey.length - 1]
        var temp = PIXI.utils.TextureCache[key];
        delete PIXI.utils.TextureCache[key];
        PIXI.utils.TextureCache[copyKey] = temp;
    }

    startLoader();

}

function startLoader() {

    for (var i = 0; i < audioManifest.length; i++) {
        audioManifest[i].url = audioManifest[i].url.replace(/\\/, "/")
        let url = audioManifest[i].url.substr(0, audioManifest[i].url.length - 4);

        if (iOS) {
            url += '.mp3'
        } else {
            url += '.ogg'
        }

        PIXI.loader.add(audioManifest[i].id, url)
    }
    PIXI.loader
        .add('./assets/fonts/stylesheet.css')
        .load(configGame);

    // FbManager.connect().then(() =>
    //     {
    //         FbManager.trackLoader(PIXI.loader);

    //     })
    //     .catch(e =>
    //     {
    //         console.log(e);
    //     })
}


function configGame(evt) {
    SOUND_MANAGER.load(audioManifest);
    // FbManager.start()
    // console.log(CAT_LIST);
    window.GAME_DATA = new GameData();
    let sotrageData = STORAGE.getObject('space-cats-game-data')
    // if (!sotrageData) {
    //     STORAGE.storeObject('space-cats-game-data', GAME_DATA.getObjectData());
    // } else {
    //     GAME_DATA.loadData(sotrageData);
    // }
    window.RESOURCES = evt.resources;
    window.game = new Game(config);
    window.screenManager = new MergerScreenManager();
    //window.screenManager = new HellScreenManager();
    game.screenManager = screenManager;
    // // screenManager.timeScale = 0;
    // //create screen manager
    // //add screens
    // let gameScreen = new GameScreen('GameScreen');
    game.stage.addChild(screenManager);
    // screenManager.addScreen(gameScreen);
    // screenManager.forceChange('GameScreen');
    game.start();


    window.addEventListener("focus", myFocusFunction, true);
    window.addEventListener("blur", myBlurFunction, true);

}

window.onresize = function(event) {
    window.game.resize();
};
function myFocusFunction() {
    TweenLite.killTweensOf(screenManager);
    TweenLite.to(screenManager, 0.5, {
        timeScale: 1
    })
    if (GAME_DATA.mute) {
        return
    }
    // SOUND_MANAGER.unmute();
}

function myBlurFunction() {
    TweenLite.killTweensOf(screenManager);
    TweenLite.to(screenManager, 0.5, {
        timeScale: 0
    })

    // SOUND_MANAGER.mute();
}