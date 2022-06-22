import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';
import Screen from '../../screenManager/Screen'
import Signals from 'signals';
import UIButton1 from '../ui/UIButton1';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
import MergeSystem from '../ui/merger/MergeSystem';
import SpaceBackground from '../effects/SpaceBackground';
export default class MergeScreen extends Screen {
    constructor(label) {
        super(label);

        window.baseConfigGame = PIXI.loader.resources['baseGameConfig'].data.baseGame;
        this.areaConfig = window.baseConfigGame.area;


        this.spaceBackground = new SpaceBackground();
        this.addChild(this.spaceBackground);
        this.container = new PIXI.Container()
        this.addChild(this.container);
        this.frontLayer = new PIXI.Container()
        this.addChild(this.frontLayer);

        this.backBlocker = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height);
        this.backBlocker.alpha = 0.5;
        this.backBlocker.interactive = true;
        this.backBlocker.buttonMode = true;
        this.backBlocker.visible = false;

        this.frontLayer.addChild(this.backBlocker);

        this.gridWrapper = new PIXI.Graphics().lineStyle(1,0x132215).drawRect(0, 0, config.width * 0.8, config.height * 0.6);
        this.container.addChild(this.gridWrapper);
        this.gridWrapper.visible = true;


        this.mergeSystemContainer = new PIXI.Container()
        this.container.addChild(this.mergeSystemContainer);

        this.uiContainer = new PIXI.Container()
        this.container.addChild(this.uiContainer);

        this.bottomContainer = new PIXI.Container()
        this.container.addChild(this.bottomContainer);


        this.dataTiles = []

        console.log(window.baseConfigGame)

        window.TILE_ASSSETS_POOL = []
        for (let index = 1; index <= window.baseConfigGame.entities.list.length - 1; index++) {
            let pow = Math.pow(2, index)
            let text = new PIXI.Text(pow, LABELS.LABEL1);
            text.style.fill = 0xFFFFFF
            text.style.fontSize = 64
            console.log(window.baseConfigGame.entities.list[index].imageSrc)
            let tex = new PIXI.Texture.from(window.baseConfigGame.entities.list[index].imageSrc)//utils.generateTextureFromContainer('image-' + index, text, window.TILE_ASSSETS_POOL)
            this.dataTiles.push({
                id: index,
                value: pow,
                texture: tex,
                generateTime: 3
            })
        }

        this.mergeSystem1 = new MergeSystem({
            mainContainer: this.mergeSystemContainer,
            uiContainer: this.uiContainer,
            wrapper: this.gridWrapper
        }, window.baseConfigGame, this.dataTiles);

        this.mergeSystem1.onGetResources.add(this.addParticles.bind(this));

        this.entityDragSprite = new PIXI.Sprite.from('');
        this.addChild(this.entityDragSprite);
        this.entityDragSprite.visible = false;

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));


        this.resourcesLabel = new PIXI.Text('', LABELS.LABEL1);
        this.container.addChild(this.resourcesLabel)

        this.dpsLabel = new PIXI.Text('', LABELS.LABEL1);
        this.container.addChild(this.dpsLabel)

        this.particleSystem = new ParticleSystem();
        this.addChild(this.particleSystem)



    }

    addParticles(targetPosition, customData, label) {
        this.particleSystem.show(targetPosition, 5, customData)
        this.particleSystem.popLabel(targetPosition, "+" + label, 0, 1, 1, LABELS.LABEL1)
    }
    onMouseMove(e) {
        this.mergeSystem1.updateMouse(e)
        this.mousePosition = e.data.global;
        if (!this.draggingEntity) {
            return;
        }
        if (this.entityDragSprite.visible) {
            this.entityDragSprite.x = this.mousePosition.x;
            this.entityDragSprite.y = this.mousePosition.y;
        }
    }


    onAdded() {


    }
    build(param) {
        super.build();
        this.addEvents();
    }
    update(delta) {
        this.mergeSystem1.update(delta);
        this.particleSystem.update(delta)

        this.resourcesLabel.text = utils.formatPointsLabel(this.mergeSystem1.resources);
        this.resourcesLabel.y = 10
        this.dpsLabel.text = utils.formatPointsLabel(this.mergeSystem1.dps) + "/ps";
        this.dpsLabel.y = 30
        this.timestamp = (Date.now() / 1000 | 0);

        this.spaceBackground.update(delta)

    }
    resize(resolution) {
        this.mergeSystem1.resize(resolution);
        this.spaceBackground.resize(resolution, resolution);
        this.gridWrapper.x = config.width / 2 - this.gridWrapper.width / 2
        this.gridWrapper.y = config.height * (1-this.areaConfig.bottomArea) - this.gridWrapper.height 
        
    }
    transitionOut(nextScreen) {
        this.removeEvents();
        this.nextScreen = nextScreen;
        setTimeout(function () {
            this.endTransitionOut();
        }.bind(this), 0);
    }
    transitionIn() {
        super.transitionIn();
    }
    destroy() {

    }
    removeEvents() {
    }
    addEvents() {
        this.removeEvents();

    }
}