import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';
import Screen from '../../screenManager/Screen'
import Signals from 'signals';
import UIButton1 from '../ui/UIButton1';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
import MergeSystem from '../ui/merger/MergeSystem';
import SpaceBackground from '../effects/SpaceBackground';
import TweenMax from 'gsap';
import EnemySystem from '../ui/merger/EnemySystem';
export default class MergeScreen extends Screen {
    constructor(label) {
        super(label);

        window.baseConfigGame = PIXI.loader.resources['baseGameConfig'].data.baseGame;
        this.areaConfig = window.baseConfigGame.area;
        if (!this.areaConfig.bottomArea) {
            this.areaConfig.bottomArea = 0.2
        }
        if (!this.areaConfig.topArea) {
            this.areaConfig.topArea = 0.2
        }

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

        this.gridWrapper = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * 0.89, config.height * (1 - this.areaConfig.bottomArea - this.areaConfig.topArea));
        this.container.addChild(this.gridWrapper);
        this.gridWrapper.visible = false;


        this.mergeSystemContainer = new PIXI.Container()
        this.container.addChild(this.mergeSystemContainer);

        this.enemiesContainer = new PIXI.Container()
        this.container.addChild(this.enemiesContainer);

        this.uiContainer = new PIXI.Container()
        this.container.addChild(this.uiContainer);

        this.bottomContainer = new PIXI.Container()
        this.container.addChild(this.bottomContainer);

        this.topContainer = new PIXI.Container()
        this.container.addChild(this.topContainer);

        this.dataTiles = []

        console.log(window.baseConfigGame)

        window.TILE_ASSSETS_POOL = []
        for (let index = 1; index <= window.baseConfigGame.entities.list.length - 1; index++) {
            let pow = Math.pow(2, index)
            let text = new PIXI.Text(pow, LABELS.LABEL1);
            text.style.fill = 0xFFFFFF
            text.style.fontSize = 64
            let tex = new PIXI.Texture.from(window.baseConfigGame.entities.list[index].imageSrc)//utils.generateTextureFromContainer('image-' + index, text, window.TILE_ASSSETS_POOL)
            this.dataTiles.push({
                id: index,
                texture: tex,
                value: pow,
                resources: pow * 1.5,
                generateResourceTime: 3,
                damage: pow * 1.5 * index,
                generateDamageTime: 5
            })
        }
       
        //console.log(utils.formatPointsLabel(acc2), utils.formatPointsLabel(acc1))

        //if own 10 nextCost=initial * (Math.pow(coefficient, 10)
        console.log(this.dataTiles)
        this.mergeSystem1 = new MergeSystem({
            mainContainer: this.mergeSystemContainer,
            uiContainer: this.uiContainer,
            wrapper: this.gridWrapper,
            topContainer: this.topContainer,
        }, window.baseConfigGame, this.dataTiles);

        this.enemiesSystem = new EnemySystem({
            mainContainer:this.enemiesContainer
        });
        this.mergeSystem1.enemySystem = this.enemiesSystem;

        this.mergeSystem1.onGetResources.add(this.addResourceParticles.bind(this));
        this.mergeSystem1.onDealDamage.add(this.addDamageParticles.bind(this));
        this.mergeSystem1.onPopLabel.add(this.popLabel.bind(this));

        this.mergeSystem1.addSystem(this.enemiesSystem);

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

        this.rpsLabel = new PIXI.Text('', LABELS.LABEL1);
        this.container.addChild(this.rpsLabel)

        this.dpsLabel = new PIXI.Text('', LABELS.LABEL1);
        this.container.addChild(this.dpsLabel)
        
        this.particleSystem = new ParticleSystem();
        this.addChild(this.particleSystem)
        
        
        this.speedUpToggle = new UIButton1(0xFFFFFF,'smallButton')
        this.container.addChild(this.speedUpToggle)
        this.speedUpToggle.y = 30
        this.speedUpToggle.onClick.add(()=>{
            if(window.TIME_SCALE > 1){
                window.TIME_SCALE = 1
            }else{
                window.TIME_SCALE = 10
            }

            TweenMax.globalTimeScale( window.TIME_SCALE ) 
        })

        window.TIME_SCALE = 1
    }
    popLabel(targetPosition, label) {
        let toLocal = this.particleSystem.toLocal(targetPosition)

        this.particleSystem.popLabel(toLocal, "+" + label, 0, 1, 1, LABELS.LABEL1)
    }
    addDamageParticles(targetPosition, customData, label, quant) {
        let toLocal = this.particleSystem.toLocal(targetPosition)

        this.particleSystem.show(toLocal, quant, customData)
        //this.particleSystem.popLabel(targetPosition, "+" + label, 0, 1, 1, LABELS.LABEL1)
    }
    addResourceParticles(targetPosition, customData, label, quant) {
        let toLocal = this.particleSystem.toLocal(targetPosition)
        for (let index = 0; index < quant; index++) {

            customData.target = { x: this.resourcesLabel.x, y: this.resourcesLabel.y, timer: 0.2 + Math.random() * 0.75 }
            this.particleSystem.show(toLocal, 1, customData)
        }
        this.particleSystem.popLabel(toLocal, "+" + label, 0, 1, 1, LABELS.LABEL1)
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

        delta *= window.TIME_SCALE;
        this.mergeSystem1.update(delta);
        this.particleSystem.update(delta)

        this.resourcesLabel.text = utils.formatPointsLabel(this.mergeSystem1.resources);

        this.rpsLabel.text = utils.formatPointsLabel(this.mergeSystem1.rps) + "/rps";

        this.dpsLabel.text = utils.formatPointsLabel(this.mergeSystem1.dps) + "/dps";

        this.timestamp = (Date.now() / 1000 | 0);

        this.spaceBackground.update(delta)

    }
    resize(resolution) {
        this.mergeSystem1.resize(resolution);
        this.spaceBackground.resize(resolution, resolution);
        this.gridWrapper.x = config.width / 2 - this.gridWrapper.width / 2
        this.gridWrapper.y = config.height * (1 - this.areaConfig.bottomArea) - this.gridWrapper.height

        this.dpsLabel.y = config.height - 70
        this.rpsLabel.y = config.height - 50
        this.resourcesLabel.x = config.width - this.resourcesLabel.width;
        this.resourcesLabel.y = config.height - 50

        this.enemiesContainer.x = config.width / 2;
        this.enemiesContainer.y = config.height * this.areaConfig.topArea*0.5;
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