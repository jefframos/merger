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
import ResourceSystem from '../ui/merger/ResourceSystem';
import MergerData from '../ui/merger/data/MergerData';
import EntityShop from '../ui/merger/shop/EntityShop';
import GameEconomy from '../ui/merger/GameEconomy';
export default class MergeScreen extends Screen {
    constructor(label) {
        super(label);

        window.baseConfigGame = PIXI.loader.resources['baseGameConfig'].data.baseGame;
        window.baseEntities = PIXI.loader.resources[window.baseConfigGame.entitiesData].data;
        window.baseResources = PIXI.loader.resources[window.baseConfigGame.resourcesData].data;
        console.log(window.baseResources)
        this.areaConfig = window.baseConfigGame.area;
        if (!this.areaConfig.bottomArea) {
            this.areaConfig.bottomArea = 0.2
        }
        if (!this.areaConfig.topArea) {
            this.areaConfig.topArea = 0.2
        }
        if (!this.areaConfig.gameArea) {
            this.areaConfig.gameArea = { w: 0.5, h: 0.5 }
        }
        if (!this.areaConfig.resourcesArea) {
            this.areaConfig.resourcesArea = { w: 0.5, h: 0.5 }
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
        this.gridWrapper = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * this.areaConfig.gameArea.w, config.height * this.areaConfig.gameArea.h);
        this.container.addChild(this.gridWrapper);
        //this.gridWrapper.visible = false;
        this.resourcesWrapper = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * this.areaConfig.resourcesArea.w, config.height * this.areaConfig.resourcesArea.h);
        this.container.addChild(this.resourcesWrapper);

        this.resourcesWrapperRight = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * this.areaConfig.resourcesArea.w, config.height * this.areaConfig.resourcesArea.h);
        this.container.addChild(this.resourcesWrapperRight);

        this.mergeSystemContainer = new PIXI.Container()
        this.container.addChild(this.mergeSystemContainer);

        this.resourcesContainer = new PIXI.Container()
        this.container.addChild(this.resourcesContainer);

        this.resourcesContainerRight = new PIXI.Container()
        this.container.addChild(this.resourcesContainerRight);


        this.enemiesContainer = new PIXI.Container()
        this.container.addChild(this.enemiesContainer);

        this.uiContainer = new PIXI.Container()
        this.container.addChild(this.uiContainer);

        this.bottomContainer = new PIXI.Container()
        this.container.addChild(this.bottomContainer);

        this.topContainer = new PIXI.Container()
        this.container.addChild(this.topContainer);

        this.dataTiles = []
        this.dataResourcesTiles = []

        window.TILE_ASSSETS_POOL = []
        this.rawMergeDataList = []
        for (let index = 0; index < window.baseEntities.mergeEntities.list.length; index++) {
            let mergeData = new MergerData(window.baseEntities.mergeEntities.list[index], index)
            this.rawMergeDataList.push(mergeData)
        }

        this.rawMergeResourceList = []
        this.allRawResources = []
        this.rawMergeResourceListRight = []
        for (let index = 0; index < window.baseResources.generators.length; index++) {
            let mergeData = new MergerData(window.baseResources.generators[index][0], index)
            if(index % 2 == 0){
                this.rawMergeResourceListRight.push(mergeData)
            }else{
                this.rawMergeResourceList.push(mergeData)
            }
            this.allRawResources.push(mergeData)
        }

        this.mergeSystem1 = new MergeSystem({
            mainContainer: this.mergeSystemContainer,
            uiContainer: this.uiContainer,
            wrapper: this.gridWrapper,
            topContainer: this.topContainer,
        }, window.baseConfigGame, this.rawMergeDataList);

        this.resourceSystem = new ResourceSystem({
            mainContainer: this.resourcesContainer,
            wrapper: this.resourcesWrapper,
        }, window.baseConfigGame, this.rawMergeResourceList)

        this.resourceSystemRight = new ResourceSystem({
            mainContainer: this.resourcesContainerRight,
            wrapper: this.resourcesWrapperRight,
        }, window.baseConfigGame, this.rawMergeResourceListRight)

        this.enemiesSystem = new EnemySystem({
            mainContainer: this.enemiesContainer
        });
        this.mergeSystem1.enemySystem = this.enemiesSystem;

        this.resourceSystem.onGetResources.add(this.addResourceParticles.bind(this));
        this.resourceSystem.onPopLabel.add(this.popLabel.bind(this));

        this.resourceSystemRight.onGetResources.add(this.addResourceParticles.bind(this));
        this.resourceSystemRight.onPopLabel.add(this.popLabel.bind(this));

        this.mergeSystem1.onDealDamage.add(this.addDamageParticles.bind(this));
        this.mergeSystem1.onPopLabel.add(this.popLabel.bind(this));

        this.enemiesSystem.onPopLabel.add(this.popLabel.bind(this));

        this.mergeSystem1.addSystem(this.enemiesSystem);
        this.mergeSystem1.addSystem(this.resourceSystem);
        this.mergeSystem1.addSystem(this.resourceSystemRight);

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

        this.coinTexture = new PIXI.Sprite.from('coin')
        this.resourcesLabel.addChild(this.coinTexture)
        this.coinTexture.scale.set(1.8)
        this.coinTexture.x = -25

        this.rpsLabel = new PIXI.Text('', LABELS.LABEL1);
        this.container.addChild(this.rpsLabel)

        this.dpsLabel = new PIXI.Text('', LABELS.LABEL1);
        this.container.addChild(this.dpsLabel)

        this.particleSystem = new ParticleSystem();
        this.addChild(this.particleSystem)


        this.speedUpToggle = new UIButton1(0xFFFFFF, 'smallButton')
        this.container.addChild(this.speedUpToggle)
        this.speedUpToggle.y = 30
        this.speedUpToggle.onClick.add(() => {
            if (window.TIME_SCALE > 1) {
                window.TIME_SCALE = 1
            } else {
                window.TIME_SCALE = 30
            }

            TweenMax.globalTimeScale(window.TIME_SCALE)
        })

        this.clearData = new UIButton1(0xFFFFFF, 'icon-trash',0)
        this.container.addChild(this.clearData)
        this.clearData.x = 80
        this.clearData.y = 30
        this.clearData.onClick.add(() => {
            COOKIE_MANAGER.wipeData()
        })

        this.openShop = new UIButton1(0xFFFFFF, 'smallButton')
        this.container.addChild(this.openShop)
        this.openShop.y = config.height - 120
        this.openShop.onClick.add(() => {
            this.entityShop.show()
        })

        window.TIME_SCALE = 1

        this.entityShop = new EntityShop([this.resourceSystem, this.resourceSystemRight]);
        this.addChild(this.entityShop);
        this.entityShop.hide();

        this.entityShop.addItems(this.allRawResources)

        window.gameEconomy = new GameEconomy()

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
    addResourceParticles(targetPosition, customData, totalResources, quantParticles) {

        window.gameEconomy.addResources(totalResources)
        let toLocal = this.particleSystem.toLocal(targetPosition)
        for (let index = 0; index < quantParticles; index++) {

            customData.target = { x: this.resourcesLabel.x, y: this.resourcesLabel.y, timer: 0.2 + Math.random() * 0.75 }
            this.particleSystem.show(toLocal, 1, customData)
        }
        this.particleSystem.popLabel(toLocal, "+" + utils.formatPointsLabel(totalResources), 0, 1, 1, LABELS.LABEL1)
    }
    onMouseMove(e) {
        this.mergeSystem1.updateMouseSystems(e)
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

        this.mergeSystem1.updateSystems(delta)
        // this.mergeSystem1.update(delta);
        this.particleSystem.update(delta)



        this.resourcesLabel.text = utils.formatPointsLabel(window.gameEconomy.currentResources);

        this.rpsLabel.text = utils.formatPointsLabel(this.resourceSystem.rps + this.resourceSystemRight.rps) + "/rps";

        this.dpsLabel.text = utils.formatPointsLabel(this.mergeSystem1.dps) + "/dps";

        this.timestamp = (Date.now() / 1000 | 0);

        this.spaceBackground.update(delta)

    }
    resize(resolution) {
        this.mergeSystem1.resize(resolution);
        this.spaceBackground.resize(resolution);
        this.gridWrapper.x = config.width / 2 - this.gridWrapper.width / 2
        this.gridWrapper.y = config.height * (1 - this.areaConfig.bottomArea) - this.gridWrapper.height

        this.resourcesWrapper.y = this.gridWrapper.y;
        this.resourcesWrapperRight.x = this.gridWrapper.x + this.gridWrapper.width;
        this.resourcesWrapperRight.y = this.gridWrapper.y;

        this.dpsLabel.y = config.height - 70
        this.rpsLabel.y = config.height - 50
        this.resourcesLabel.x = config.width - this.resourcesLabel.width;
        this.resourcesLabel.y = config.height - 50

        this.enemiesContainer.x = config.width / 2;
        this.enemiesContainer.y = config.height * this.areaConfig.topArea * 0.5;

        this.entityShop.x = config.width / 2 - this.entityShop.width / 2
        this.entityShop.y = config.height / 2 - this.entityShop.height / 2
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