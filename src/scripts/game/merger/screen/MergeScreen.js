import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';
import Signals from 'signals';
import UIButton1 from '../ui/UIButton1';
import utils from '../../../utils';

import ParticleSystem from '../effects/ParticleSystem';
import MergeSystem from '../systems/MergeSystem';
import EnemySystem from '../systems/EnemySystem';
import ResourceSystem from '../systems/ResourceSystem';

import SpaceBackground from '../effects/SpaceBackground';
import Screen from '../../../screenManager/Screen';
import TweenMax from 'gsap';
import MergerData from '../data/MergerData';
import EntityShop from '../shop/EntityShop';
import GameEconomy from '../GameEconomy';
import MergeItemsShop from '../shop/MergeItemsShop';
import StartPopUp from '../popup/StartPopUp';
import StandardPop from '../popup/StandardPop';
import GeneralShop from '../shop/GeneralShop';
import GameModifyers from '../GameModifyers';
export default class MergeScreen extends Screen {
    constructor(label) {
        super(label);



        window.baseConfigGame = PIXI.loader.resources['baseGameConfig'].data.baseGame;
        window.baseEntities = PIXI.loader.resources[window.baseConfigGame.entitiesData].data;
        window.baseResources = PIXI.loader.resources[window.baseConfigGame.resourcesData].data;
        window.baseModifyers = PIXI.loader.resources[window.baseConfigGame.modifyersData].data;
        window.gameEconomy = new GameEconomy()
        window.gameModifyers = new GameModifyers()

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
        this.uiLayer = new PIXI.Container()
        this.addChild(this.uiLayer);

        this.backBlocker = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height);
        this.backBlocker.alpha = 0.5;
        this.backBlocker.interactive = true;
        this.backBlocker.buttonMode = true;
        this.backBlocker.visible = false;

        this.frontLayer.addChild(this.backBlocker);
        this.gridWrapper = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * this.areaConfig.gameArea.w, config.height * this.areaConfig.gameArea.h);
        this.container.addChild(this.gridWrapper);
        this.gridWrapper.visible = false;

        this.resourcesWrapper = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * this.areaConfig.resourcesArea.w, config.height * this.areaConfig.resourcesArea.h);
        this.container.addChild(this.resourcesWrapper);
        this.resourcesWrapper.visible = false;

        this.resourcesWrapperRight = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * this.areaConfig.resourcesArea.w, config.height * this.areaConfig.resourcesArea.h);
        this.container.addChild(this.resourcesWrapperRight);
        this.resourcesWrapperRight.visible = false;

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

        this.rawModifyers = []
        for (let index = 0; index < window.baseModifyers.modifyers.length; index++) {
            let mergeData = new MergerData(window.baseModifyers.modifyers[index], index)


            mergeData.currentLevel = window.gameModifyers.getLevel(mergeData);

            this.rawModifyers.push(mergeData)
        }


        this.rawMergeDataList = []
        for (let index = 0; index < window.baseEntities.mergeEntities.list.length; index++) {
            let mergeData = new MergerData(window.baseEntities.mergeEntities.list[index], index)
            mergeData.type = 'damage'
            this.rawMergeDataList.push(mergeData)
        }

        this.rawMergeResourceList = []
        this.allRawResources = []
        this.rawMergeResourceListRight = []
        for (let index = 0; index < window.baseResources.generators.length; index++) {
            let mergeData = new MergerData(window.baseResources.generators[index][0], index)
            if (index % 2 == 0) {
                mergeData.isRight = true;
                this.rawMergeResourceListRight.push(mergeData)
            } else {
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

        this.resourceSystem.onParticles.add(this.addParticles.bind(this));
        this.resourceSystem.onGetResources.add(this.addResourceParticles.bind(this));
        this.resourceSystem.onPopLabel.add(this.popLabel.bind(this));
        this.resourceSystem.onStandardPopUp.add(this.standardPopUpShow.bind(this));

        this.resourceSystemRight.onParticles.add(this.addParticles.bind(this));
        this.resourceSystemRight.onGetResources.add(this.addResourceParticles.bind(this));
        this.resourceSystemRight.onPopLabel.add(this.popLabel.bind(this));
        this.resourceSystemRight.onStandardPopUp.add(this.standardPopUpShow.bind(this));

        this.mergeSystem1.onParticles.add(this.addParticles.bind(this));
        this.mergeSystem1.onDealDamage.add(this.addDamageParticles.bind(this));
        this.mergeSystem1.onPopLabel.add(this.popLabel.bind(this));

        this.enemiesSystem.onParticles.add(this.addParticles.bind(this));
        this.enemiesSystem.onPopLabel.add(this.popLabel.bind(this));
        this.enemiesSystem.onGetResources.add(this.addResourceParticles.bind(this));

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
        this.frontLayer.addChild(this.particleSystem)


        this.speedUpToggle = new UIButton1(0x002299, 'fast_forward_icon')
        this.container.addChild(this.speedUpToggle)
        this.speedUpToggle.x = 50
        this.speedUpToggle.y = 50
        this.speedUpToggle.onClick.add(() => {
            if (window.TIME_SCALE > 1) {
                window.TIME_SCALE = 1
            } else {
                window.TIME_SCALE = 30
            }

            TweenMax.globalTimeScale(window.TIME_SCALE)
        })

        this.clearData = new UIButton1(0x002299, 'icon_reset')
        this.container.addChild(this.clearData)
        this.clearData.x = 130
        this.clearData.y = 50
        this.clearData.onClick.add(() => {
            COOKIE_MANAGER.wipeData()
        })


        this.openSettingsShop = new UIButton1(0x002299, 'icon_shop')
        this.container.addChild(this.openSettingsShop)
        this.openSettingsShop.x = config.width - 45
        this.openSettingsShop.y = config.height - 80
        this.openSettingsShop.onClick.add(() => {
            this.openPopUp(this.generalShop)
        })

        this.openShop = new UIButton1(0x002299, 'drill')
        this.container.addChild(this.openShop)
        this.openShop.x = config.width - 45
        this.openShop.y = config.height - 150
        this.openShop.onClick.add(() => {
            this.openPopUp(this.entityShop)
        })

        this.openMergeShop = new UIButton1(0x002299, 'starship_01')
        this.container.addChild(this.openMergeShop)
        this.openMergeShop.x = config.width - 45
        this.openMergeShop.y = config.height - 220
        this.openMergeShop.onClick.add(() => {
            this.openPopUp(this.mergeItemsShop)
        })



        window.TIME_SCALE = 1

        this.uiPanels = []

        this.entityShop = new EntityShop([this.resourceSystem, this.resourceSystemRight]);
        this.uiLayer.addChild(this.entityShop);
        this.entityShop.hide();


        this.entityShop.addItems(this.allRawResources)

        this.mergeItemsShop = new MergeItemsShop([this.mergeSystem1])
        this.uiLayer.addChild(this.mergeItemsShop);
        this.mergeItemsShop.addItems(this.rawMergeDataList)
        this.mergeItemsShop.hide();

        this.generalShop = new GeneralShop()
        this.uiLayer.addChild(this.generalShop);
        this.generalShop.addItems(this.rawModifyers)
        this.generalShop.hide();

        this.standardPopUp = new StandardPop('any', this.screenManager)
        this.uiLayer.addChild(this.standardPopUp)

        this.uiPanels.push(this.entityShop)
        this.uiPanels.push(this.mergeItemsShop)
        this.uiPanels.push(this.generalShop)
        this.uiPanels.push(this.standardPopUp)

        this.openPopUp(this.generalShop)

        this.sumStart = 0;
        this.savedResources = COOKIE_MANAGER.getResources();
        this.allRawResources.forEach(element => {
            if (this.savedResources.entities[element.rawData.nameID]) {
                let saved = this.savedResources.entities[element.rawData.nameID];
                let time = saved.latestResourceAdd - saved.latestResourceCollect
                this.sumStart += time * element.getRPS();
            }
        });


        this.savedEconomy = COOKIE_MANAGER.getEconomy();

        let now = Date.now() / 1000 | 0
        let diff = now - this.savedEconomy.lastChanged
        if (diff > 10 && this.sumStart > 10) {
            let params = {
                label: 'your ships\ncollected\n' + utils.formatPointsLabel(this.sumStart) + '\n\nWould you like to watch\na video and double?',
                onConfirm: this.collectStartAmountDouble.bind(this),
                onCancel: this.collectStartAmount.bind(this)
            }
            this.standardPopUpShow(params)
        }

        //this.mergeItemsShop.show()
    }
    collectStartAmountDouble() {
        this.resourceSystem.collectStartAmount(2)
        this.resourceSystemRight.collectStartAmount(2)
    }
    collectStartAmount() {
        this.resourceSystem.collectStartAmount()
        this.resourceSystemRight.collectStartAmount()
    }
    standardPopUpShow(params) {
        //this.standardPopUp.show(params)
        this.openPopUp(this.standardPopUp, params)
    }
    openPopUp(target, params) {
        this.uiPanels.forEach(element => {
            if (element.visible) {
                element.hide();
            }
        });

        console.log('show', params)
        target.show(params)
    }
    popLabel(targetPosition, label) {
        let toLocal = this.particleSystem.toLocal(targetPosition)

        this.particleSystem.popLabel(toLocal, "+" + label, 0, 1, 1, LABELS.LABEL1)
    }

    addParticles(targetPosition, customData, quant) {
        let toLocal = this.particleSystem.toLocal(targetPosition)
        this.particleSystem.show(toLocal, quant, customData)
    }

    addDamageParticles(targetPosition, customData, label, quant) {
        let toLocal = this.particleSystem.toLocal(targetPosition)
        this.particleSystem.show(toLocal, quant, customData)
        //this.particleSystem.popLabel(targetPosition, "+" + label, 0, 1, 1, LABELS.LABEL1)
    }
    addResourceParticles(targetPosition, customData, totalResources, quantParticles, showParticles = true) {
        window.gameEconomy.addResources(totalResources)
        let toLocal = this.particleSystem.toLocal(targetPosition)
        
        if(!showParticles){
            quantParticles = 1
        }
        for (let index = 0; index < quantParticles; index++) {
            customData.target = { x: this.resourcesLabel.x, y: this.resourcesLabel.y, timer: 0.2 + Math.random() * 0.75 }
            this.particleSystem.show(toLocal, 1, customData)
        }

        if (showParticles) {
            this.particleSystem.popLabel(toLocal, "+" + utils.formatPointsLabel(totalResources), 0, 1, 1, LABELS.LABEL1)
        }
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
        this.spaceBackground.resize(resolution, this.screenManager.scale);

        this.spaceBackground.x = config.width / 2
        this.spaceBackground.y = config.height / 2

        this.gridWrapper.x = config.width / 2 - this.gridWrapper.width / 2
        this.gridWrapper.y = config.height * (1 - this.areaConfig.bottomArea) - this.gridWrapper.height

        this.resourcesWrapper.y = this.gridWrapper.y;
        this.resourcesWrapperRight.x = this.gridWrapper.x + this.gridWrapper.width;
        this.resourcesWrapperRight.y = this.gridWrapper.y;

        this.dpsLabel.y = config.height - 80
        this.rpsLabel.y = config.height - 50
        this.resourcesLabel.x = 25;
        this.resourcesLabel.y = config.height - 110

        this.enemiesContainer.x = config.width / 2;
        this.enemiesContainer.y = config.height * this.areaConfig.topArea * 0.5;

        this.uiPanels.forEach(element => {
            element.x = config.width / 2 - element.width / 2
            element.y = config.height / 2 - element.height / 2
        });
        // this.entityShop.x = config.width / 2 - this.entityShop.width / 2
        // this.entityShop.y = config.height / 2 - this.entityShop.height / 2

        // this.mergeItemsShop.x = config.width / 2 - this.mergeItemsShop.width / 2
        // this.mergeItemsShop.y = config.height / 2 - this.mergeItemsShop.height / 2
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