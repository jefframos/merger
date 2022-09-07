import * as PIXI from 'pixi.js';

import EnemySystem from '../systems/EnemySystem';
import EntityShop from '../shop/EntityShop';
import GameEconomy from '../GameEconomy';
import GameModifyers from '../GameModifyers';
import GeneralShop from '../shop/GeneralShop';
import MergeItemsShop from '../shop/MergeItemsShop';
import MergeSystem from '../systems/MergeSystem';
import MergerData from '../data/MergerData';
import ParticleSystem from '../../effects/ParticleSystem';
import ResourceSystem from '../systems/ResourceSystem';
import Screen from '../../../screenManager/Screen';
import SpaceBackground from '../effects/SpaceBackground';
import StandardPop from '../../popup/StandardPop';
import TweenMax from 'gsap';
import UIButton1 from '../../ui/UIButton1';
import utils from '../../../utils';
import UIList from '../../ui/uiElements/UIList';
import TimeBonusButton from '../../ui/TimeBonusButton';
import PrizeSystem from '../systems/PrizeSystem';

export default class MergeScreen extends Screen {
    constructor(label) {
        super(label);



        window.baseConfigGame = PIXI.loader.resources['baseGameConfig'].data.baseGame;
        window.baseEntities = PIXI.loader.resources[window.baseConfigGame.entitiesData].data;
        window.baseEnemies = PIXI.loader.resources[window.baseConfigGame.entitiesData].data.mergeEntities.enemies;
        window.baseResources = PIXI.loader.resources[window.baseConfigGame.resourcesData].data;
        window.baseModifyers = PIXI.loader.resources[window.baseConfigGame.modifyersData].data;
        window.gameEconomy = new GameEconomy()
        window.gameModifyers = new GameModifyers()

        this.systemsList = [];

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

        setTimeout(() => {
            this.spaceBackground = new SpaceBackground();
            this.addChildAt(this.spaceBackground, 0);
        }, 10);
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
        //this.gridWrapper.alpha = 0;

        this.resourcesWrapper = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * this.areaConfig.resourcesArea.w, config.height * this.areaConfig.resourcesArea.h);
        this.container.addChild(this.resourcesWrapper);
        this.resourcesWrapper.visible = false;
        //this.resourcesWrapper.alpha = 0;

        this.resourcesWrapperRight = new PIXI.Graphics().lineStyle(1, 0x132215).drawRect(0, 0, config.width * this.areaConfig.resourcesArea.w, config.height * this.areaConfig.resourcesArea.h);
        this.container.addChild(this.resourcesWrapperRight);
        this.resourcesWrapperRight.visible = false;
        //this.resourcesWrapperRight.alpha = 0;

        this.mergeSystemContainer = new PIXI.Container()
        this.container.addChild(this.mergeSystemContainer);

        this.prizeContainer = new PIXI.Container()
        this.container.addChild(this.prizeContainer);

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


        this.rawModifyers = []
        for (let index = 0; index < window.baseModifyers.modifyers.length; index++) {
            let mergeData = new MergerData(window.baseModifyers.modifyers[index], index)


            mergeData.currentLevel = window.gameModifyers.getLevel(mergeData);
            console.log(window.baseModifyers.modifyers[index].type)
            mergeData.type = window.baseModifyers.modifyers[index].type
            mergeData.modifyerIcon = window.baseModifyers.modifyers[index].modifyerIcon
            this.rawModifyers.push(mergeData)
        }


        this.rawMergeDataList = []
        for (let index = 0; index < window.baseEntities.mergeEntities.list.length; index++) {
            let mergeData = new MergerData(window.baseEntities.mergeEntities.list[index], index)
            mergeData.type = window.baseEntities.mergeEntities.list[index].type
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

        this.prizeSystem = new PrizeSystem({
            mainContainer: this.prizeContainer
        })

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
        }, window.baseEnemies);

        this.addSystem(this.mergeSystem1)
        this.addSystem(this.prizeSystem)
        this.addSystem(this.resourceSystem)
        this.addSystem(this.resourceSystemRight)
        this.addSystem(this.enemiesSystem)

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
        this.enemiesSystem.onPopLabel.add(this.popLabelDamage.bind(this));
        this.enemiesSystem.onGetResources.add(this.addResourceParticles.bind(this));
        this.enemiesSystem.onChangeEnemySet.add((set) => {
            this.spaceBackground.setTopColor(set.color)
        });

        this.mergeSystem1.addSystem(this.enemiesSystem);
        this.mergeSystem1.addSystem(this.resourceSystem);
        this.mergeSystem1.addSystem(this.resourceSystemRight);
        this.mergeSystem1.addSystem(this.prizeSystem);

        this.entityDragSprite = new PIXI.Sprite.from('');
        this.addChild(this.entityDragSprite);
        this.entityDragSprite.visible = false;

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));

        this.statsList = new UIList()
        this.statsList.w = 120
        this.statsList.h = 140
        this.container.addChild(this.statsList)


        this.resourcesContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('grid1'), 20, 20, 20, 5)
        this.resourcesContainer.width = this.statsList.w
        this.resourcesContainer.height = 40

        this.resourcesLabel = new PIXI.Text('', LABELS.LABEL1);
        this.resourcesLabel.style.fontSize = 10
        utils.centerObject(this.resourcesLabel, this.resourcesContainer)
        this.resourcesLabel.x -= 10
        this.resourcesContainer.addChild(this.resourcesLabel)
        this.statsList.addElement(this.resourcesContainer)

        this.coinTexture = new PIXI.Sprite.from('coin')
        this.resourcesLabel.addChild(this.coinTexture)
        this.coinTexture.scale.set(this.resourcesContainer.height / this.coinTexture.height * 0.5)
        this.coinTexture.x = -30
        this.coinTexture.y = -3



        this.rpsContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('grid1'), 20, 20, 20, 5)
        this.rpsContainer.width = this.statsList.w
        this.rpsContainer.height = 40
        this.rpsLabel = new PIXI.Text('', LABELS.LABEL1);
        this.rpsLabel.style.fontSize = 10
        this.rpsContainer.addChild(this.rpsLabel)
        this.statsList.addElement(this.rpsContainer)

        this.resourcesTexture = new PIXI.Sprite.from('drill-small')
        this.resourcesTexture.scale.set(this.rpsContainer.height / this.resourcesTexture.height * 0.5)
        this.resourcesTexture.x = -30
        this.resourcesTexture.y = -3
        this.rpsLabel.addChild(this.resourcesTexture)


        this.dpsContainer = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('grid1'), 20, 20, 20, 5)
        this.dpsContainer.width = this.statsList.w
        this.dpsContainer.height = 40

        this.dpsLabel = new PIXI.Text('', LABELS.LABEL1);
        this.dpsLabel.style.fontSize = 10
        this.dpsContainer.addChild(this.dpsLabel)
        this.statsList.addElement(this.dpsContainer)

        this.damageTexture = new PIXI.Sprite.from('bullets')
        this.dpsLabel.addChild(this.damageTexture)
        this.damageTexture.scale.set(this.dpsContainer.height / this.damageTexture.height * 0.5)
        this.damageTexture.x = -30
        this.damageTexture.y = -3


        this.shardsCounter = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('grid1'), 20, 20, 20, 5)
        this.shardsCounter.width = this.statsList.w
        this.shardsCounter.height = 40

        this.shardsLabel = new PIXI.Text('0', LABELS.LABEL1);
        this.shardsLabel.style.fontSize = 10
        this.shardsCounter.addChild(this.shardsLabel)
        this.statsList.addElement(this.shardsCounter)

        this.shardsTexture = new PIXI.Sprite.from('shards')
        this.shardsLabel.addChild(this.shardsTexture)
        this.shardsTexture.scale.set(this.shardsCounter.height / this.shardsTexture.height * 0.5)
        this.shardsTexture.x = -30
        this.shardsTexture.y = -3


        this.statsList.updateVerticalList();

        this.particleSystem = new ParticleSystem();
        this.frontLayer.addChild(this.particleSystem)

        this.helperButtonList = new UIList();
        this.helperButtonList.h = 60;
        this.helperButtonList.w = 320;
        this.speedUpToggle = new UIButton1(0x002299, 'fast_forward_icon')
        this.helperButtonList.addElement(this.speedUpToggle)
        this.speedUpToggle.onClick.add(() => {
            if (window.TIME_SCALE > 1) {
                window.TIME_SCALE = 1
            } else {
                window.TIME_SCALE = 30
            }

            TweenMax.globalTimeScale(window.TIME_SCALE)
        })

        this.clearData = new UIButton1(0x002299, 'icon_reset')
        this.helperButtonList.addElement(this.clearData)
        this.clearData.onClick.add(() => {
            COOKIE_MANAGER.wipeData()
        })

        this.addCash = new UIButton1(0x002299, 'coin')
        this.helperButtonList.addElement(this.addCash)
        this.addCash.onClick.add(() => {
            window.gameEconomy.addResources(80000000000000000000000000000000000000000000000000000000000000)
        })

        this.autoMergeToggle = new UIButton1(0x002299, 'auto-merge')
        this.helperButtonList.addElement(this.autoMergeToggle)
        this.autoMergeToggle.onClick.add(() => {
            let toggleValue = window.gameModifyers.modifyersData.autoMerge + 1
            toggleValue %= 2
            window.gameModifyers.saveBoolModifyers('autoMerge', toggleValue)
            this.refreshToggles();
        })


        this.autoCollectToggle = new UIButton1(0x002299, 'shards')
        this.helperButtonList.addElement(this.autoCollectToggle)
        this.autoCollectToggle.onClick.add(() => {            
            window.gameModifyers.addShards(Math.max(10, window.gameModifyers.permanentBonusData.shards * 0.2));
            this.refreshToggles();

        })
        this.refreshToggles();

        this.helperButtonList.updateHorizontalList();
        this.container.addChild(this.helperButtonList)

        this.helperButtonList.visible = false
        this.helperButtonList.scale.set(0.5)
        let buttonSize = 80
        this.shopButtonsList = new UIList();
        this.shopButtonsList.w = buttonSize * 6 + 15;
        this.shopButtonsList.h = buttonSize;
        this.container.addChild(this.shopButtonsList)

        this.currentOpenPopUp = null;



        this.openSettingsShop = new UIButton1(0x002299, 'shop', 0xFFFFFF, buttonSize, buttonSize)
        this.openSettingsShop.updateIconScale(0.5)
        this.openSettingsShop.newItem = new PIXI.Sprite.fromFrame('new_item')
        this.openSettingsShop.newItem.scale.set(0.7)
        this.openSettingsShop.newItem.anchor.set(0)
        this.openSettingsShop.newItem.position.set(-buttonSize / 2)
        this.openSettingsShop.newItem.visible = false;
        this.openSettingsShop.addChild(this.openSettingsShop.newItem)
        this.shopButtonsList.addElement(this.openSettingsShop)
        this.openSettingsShop.onClick.add(() => {
            this.openPopUp(this.generalShop)
        })

        this.openShop = new UIButton1(0x002299, 'drill-icon', 0xFFFFFF, buttonSize, buttonSize)
        this.openShop.updateIconScale(0.5)
        this.openShop.newItem = new PIXI.Sprite.fromFrame('new_item')
        this.openShop.newItem.scale.set(0.7)
        this.openShop.newItem.anchor.set(0)
        this.openShop.newItem.position.set(-buttonSize / 2)
        this.openShop.newItem.visible = false;
        this.openShop.addChild(this.openShop.newItem)
        this.shopButtonsList.addElement(this.openShop)
        this.openShop.onClick.add(() => {
            this.openPopUp(this.entityShop)
        })

        this.openMergeShop = new UIButton1(0x002299, 'spiky-field', 0xFFFFFF, buttonSize, buttonSize)
        this.openMergeShop.updateIconScale(0.5)
        this.openMergeShop.newItem = new PIXI.Sprite.fromFrame('new_item')
        this.openMergeShop.newItem.scale.set(0.7)
        this.openMergeShop.newItem.anchor.set(0)
        this.openMergeShop.newItem.position.set(-buttonSize / 2)
        this.openMergeShop.newItem.visible = false;
        this.openMergeShop.addChild(this.openMergeShop.newItem)
        this.shopButtonsList.addElement(this.openMergeShop)
        this.openMergeShop.onClick.add(() => {
            this.openPopUp(this.mergeItemsShop)
        })


        this.sellEverything = new TimeBonusButton('portraitFemale', buttonSize)
        this.sellEverything.updateIconScale(0.9)
        this.sellEverything.setDescription("")
        this.sellEverything.newItem = new PIXI.Sprite.fromFrame('new_item')
        this.sellEverything.newItem.scale.set(0.7)
        this.sellEverything.newItem.anchor.set(0)
        this.sellEverything.newItem.position.set(-buttonSize / 2)
        this.sellEverything.newItem.visible = true;
        this.sellEverything.addChild(this.sellEverything.newItem)
        // this.sellEverything.onClick.add(() => {
        //     this.resetAll();
        //     //this.openPopUp(this.mergeItemsShop)
        // })
        this.container.addChild(this.sellEverything)

        this.shopButtonsList.updateHorizontalList();

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
        this.generalShop.onPurchase.add(() => {
            this.mergeSystem1.findAllAutomerges();
            this.mergeSystem1.updateAllData();
        });

        this.standardPopUp = new StandardPop('any', this.screenManager)
        this.uiLayer.addChild(this.standardPopUp)

        this.uiPanels.push(this.entityShop)
        this.uiPanels.push(this.mergeItemsShop)
        this.uiPanels.push(this.generalShop)
        this.uiPanels.push(this.standardPopUp)

        this.entityShop.onPossiblePurchase.add((canBuy) => {
            this.openShop.newItem.visible = canBuy;
        })
        this.mergeItemsShop.onPossiblePurchase.add((canBuy) => {
            this.openMergeShop.newItem.visible = canBuy;
        })
        this.generalShop.onPossiblePurchase.add((canBuy) => {
            this.openSettingsShop.newItem.visible = canBuy;
        })
        //this.openPopUp(this.generalShop)

        this.sumStart = 0;
        this.savedResources = COOKIE_MANAGER.getResources();
        this.allRawResources.forEach(element => {
            if (this.savedResources.entities[element.rawData.nameID]) {
                let saved = this.savedResources.entities[element.rawData.nameID];
                let time = saved.latestResourceAdd - saved.latestResourceCollect
                this.sumStart += time * element.getRPS();

                //console.log(this.sumStart, element.getRPS(), time)
            }
        });

        let timeBonus = new TimeBonusButton()
        this.container.addChild(timeBonus)
        timeBonus.x = 40
        timeBonus.y = 100
        timeBonus.setParams(window.gameModifyers.bonusData, 'generateTimerBonus', 1, 5)
        timeBonus.setDescription('+ships')

        let damageBonus = new TimeBonusButton('bullets-large')
        this.container.addChild(damageBonus)
        damageBonus.x = 120
        damageBonus.y = 100
        damageBonus.setParams(window.gameModifyers.bonusData, 'damageBonus', 1, 10, 30)
        damageBonus.setDescription('+damage')

        let speedBonus = new TimeBonusButton('fast-arrow')
        this.container.addChild(speedBonus)
        speedBonus.x = 40
        speedBonus.y = 180
        speedBonus.setParams(window.gameModifyers.bonusData, 'damageSpeed', 1, 10, 30)
        speedBonus.setDescription('+speed')

        this.bonusTimers = [];
        this.bonusTimers.push(timeBonus);
        this.bonusTimers.push(damageBonus);
        this.bonusTimers.push(speedBonus);

        this.shopButtonsList.addElement(timeBonus)
        this.shopButtonsList.addElement(damageBonus)
        this.shopButtonsList.addElement(speedBonus)
        this.shopButtonsList.updateHorizontalList();

        this.savedEconomy = COOKIE_MANAGER.getEconomy();

        let now = Date.now() / 1000 | 0
        let diff = now - this.savedEconomy.lastChanged

        //console.log(diff, this.sumStart)
        if (diff > 60 && this.sumStart > 10) {
            let params = {
                label: 'your ships\ncollected\n' + utils.formatPointsLabel(this.sumStart) + '\n\nWould you like to watch\na video and double?',
                onConfirm: this.collectStartAmountDouble.bind(this),
                onCancel: this.collectStartAmount.bind(this)
            }
            this.standardPopUpShow(params)
        }

        //this.mergeItemsShop.show()
    }
    resetAll() {
        window.gameModifyers.addShards(10);
        window.gameEconomy.resetAll();
        COOKIE_MANAGER.resetProgression();

        this.systemsList.forEach(element => {
            if (element.resetSystem) {
                element.resetSystem()
            }
        });

        window.gameEconomy.resetAll();
        window.gameEconomy.addResources(4)

    }
    refreshToggles() {
        let toggleValue = window.gameModifyers.modifyersData.autoCollectResource

        if (toggleValue) {
            this.autoCollectToggle.enableState();
        } else {
            this.autoCollectToggle.disableState();
        }

        toggleValue = window.gameModifyers.modifyersData.autoMerge == 1
        if (toggleValue) {
            this.autoMergeToggle.enableState();
        } else {
            this.autoMergeToggle.disableState();
        }
    }

    addSystem(system) {
        if (!this.systemsList.includes(system)) {
            this.systemsList.push(system)
        }
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

        this.currentOpenPopUp = target;
        target.show(params)
    }
    popLabel(targetPosition, label) {
        let toLocal = this.particleSystem.toLocal(targetPosition)


        this.particleSystem.popLabel(toLocal, "+" + label, 0, 1, 1, LABELS.LABEL1)
    }
    popLabelDamage(targetPosition, label) {
        let toLocal = this.particleSystem.toLocal(targetPosition)


        this.particleSystem.popLabel(toLocal, "+" + label, 0, 1, 1, LABELS.LABEL_DAMAGE)
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

        if (quantParticles <= 0) {
            return;
        }
        let toLocal = this.particleSystem.toLocal(targetPosition)
        if (!showParticles) {
            quantParticles = 1
        }

        let coinPosition = this.coinTexture.getGlobalPosition();
        for (let index = 0; index < quantParticles; index++) {
            customData.target = { x: coinPosition.x + 80, y: coinPosition.y, timer: 0.2 + Math.random() * 0.75 }
            this.particleSystem.show(toLocal, 1, customData)
        }

        if (showParticles) {
            //this.particleSystem.popLabel(toLocal, "+" + utils.formatPointsLabel(totalResources), 0, 1, 1, LABELS.LABEL1)
        }
    }
    onMouseMove(e) {

        if (this.currentOpenPopUp && this.currentOpenPopUp.visible) {
            return;
        }

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

        this.bonusTimers.forEach(element => {
            if (element.update) {
                element.update(delta)
            }
        });
        delta *= window.TIME_SCALE;

        this.mergeSystem1.updateSystems(delta)
        // this.mergeSystem1.update(delta);
        this.particleSystem.update(delta)

        this.uiPanels.forEach(element => {
            if (element.update) {
                element.update(delta)
            }
        });

        this.resourcesLabel.text = utils.formatPointsLabel(window.gameEconomy.currentResources);
        utils.centerObject(this.resourcesLabel, this.resourcesContainer)
        this.resourcesLabel.x = 40

        this.rpsLabel.text = utils.formatPointsLabel(this.resourceSystem.rps + this.resourceSystemRight.rps) + '/s';
        utils.centerObject(this.rpsLabel, this.rpsContainer)
        this.rpsLabel.x = 40

        this.dpsLabel.text = utils.formatPointsLabel(this.mergeSystem1.dps) + '/s';
        utils.centerObject(this.dpsLabel, this.dpsContainer)
        this.dpsLabel.x = 40

        this.shardsLabel.text = utils.formatPointsLabel(window.gameModifyers.permanentBonusData.shards);
        utils.centerObject(this.shardsLabel, this.shardsCounter)
        this.shardsLabel.x = 40

        this.timestamp = (Date.now() / 1000 | 0);

        if (this.spaceBackground) {

            this.spaceBackground.update(delta)
        }

    }
    resize(resolution) {
        if (!resolution || !resolution.width || !resolution.height) {
            return;
        }
        if (this.spaceBackground) {

            this.spaceBackground.resize(resolution, this.screenManager.scale);

            this.spaceBackground.x = config.width / 2
            this.spaceBackground.y = config.height / 2
        }

        this.gridWrapper.x = config.width / 2 - this.gridWrapper.width / 2
        this.gridWrapper.y = config.height * (1 - this.areaConfig.bottomArea) - this.gridWrapper.height


        this.resourcesWrapper.y = this.gridWrapper.y;
        this.resourcesWrapperRight.x = this.gridWrapper.x + this.gridWrapper.width;
        this.resourcesWrapperRight.y = this.gridWrapper.y;

        this.sellEverything.x = this.resourcesWrapperRight.x + this.resourcesWrapperRight.width / 2
        this.sellEverything.y = this.resourcesWrapperRight.y + this.resourcesWrapperRight.height + 50
        // if (this.helperButtonList.visible) {

        //     this.statsList.y = config.height - 240
        // } else {
        //     this.statsList.y = config.height - this.statsList.h - 20

        // }
        // this.statsList.x = config.width - this.statsList.w
        // this.statsList.y = 150
        this.statsList.y = config.height - this.statsList.h - 120
        this.shopButtonsList.x = config.width / 2 - this.shopButtonsList.w / 2 + 40
        this.shopButtonsList.y = config.height - this.shopButtonsList.h + 20
        this.helperButtonList.x = 0
        this.helperButtonList.y = config.height - this.shopButtonsList.h - 30


        this.enemiesContainer.x = config.width / 2;
        this.enemiesContainer.y = config.height * this.areaConfig.topArea * 0.5;

        this.uiPanels.forEach(element => {
            element.x = config.width / 2
            element.y = config.height / 2
        });

        this.systemsList.forEach(element => {
            element.resize(resolution);
        });
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