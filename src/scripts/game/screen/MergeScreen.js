import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';
import Screen from '../../screenManager/Screen'
import Signals from 'signals';
import MergeTile from '../ui/merger/MergeTile';
import ChargerTile from '../ui/merger/ChargerTile';
import UIButton1 from '../ui/UIButton1';
import utils from '../../utils';
import ParticleSystem from '../effects/ParticleSystem';
export default class MergeScreen extends Screen {
    constructor(label) {
        super(label);

        window.baseConfigGame = PIXI.loader.resources['baseGameConfig'].data.baseGame;
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


        this.gridAreaView = new PIXI.Graphics().beginFill(0x132215).drawRect(0, 0, config.width * 0.8, config.height * 0.6);
        this.container.addChild(this.gridAreaView);
        this.gridAreaView.visible = true;
        this.tileContainer = new PIXI.Container()
        this.container.addChild(this.tileContainer);

        this.bottomContainer = new PIXI.Container()
        this.container.addChild(this.bottomContainer);

        let p = {
            w: 0.8,
            h: 0.6
        }

        //this.tileContainer.addChild(

        this.dataTiles = []

        window.pool = []
        for (let index = 1; index <= 35; index++) {
            let pow = Math.pow(2, index)
            let text = new PIXI.Text(pow, LABELS.LABEL1);
            text.style.fill = 0xFFFFFF
            text.style.fontSize = 64
            let tex = utils.generateTextureFromContainer('image-' + index, text, window.pool)
            this.dataTiles.push({
                id: index,
                value: pow,
                texture: tex
            })
            //console.log(utils.formatPointsLabel(pow))
        }


        console.log(this.dataTiles)

        
        this.slots = [];

        this.slotPadding = {
            x: config.width * 0.05,
            y: config.width * 0,
        }

        this.mapSize = {
            x: config.width * 0.8,
            y: config.width * 0.7,
        }

        let matrix = utils.cloneMatrix(window.baseConfigGame.gameMap)
        this.slotSize = {
            width: 200,
            height: 200
        }
        for (var i = 0; i < matrix.length; i++) {
            let temp = []
            for (var j = 0; j < matrix[i].length; j++) {
                temp.push(0)
            }
            this.slots.push(temp);
        }

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                let slotID = matrix[i][j];
                if (slotID == 0) {
                    this.addSlot(i, j);
                }
            }
        }

        this.adjustSlotsPosition();

        this.tileContainer.y = config.height / 2 - this.tileContainer.height / 2// - this.slotSize.width / 2
        this.entityDragSprite = new PIXI.Sprite.from('');
        this.addChild(this.entityDragSprite);
        this.entityDragSprite.visible = false;

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));


        this.pieceGenerators = new ChargerTile(0, 0, this.slotSize.width, 'l0_spader_1_1');

        this.pieceGenerators.isGenerator = true;

        let targetScale = config.height * 0.2 / this.pieceGenerators.height
        this.pieceGenerators.scale.set(Math.min(targetScale, 1))
        this.pieceGenerators.addEntity(this.dataTiles[0])
        this.bottomContainer.addChild(this.pieceGenerators);

        this.pieceGenerators.onHold.add((slot) => {
            this.startDrag(slot)
        });
        this.pieceGenerators.onEndHold.add((slot) => {
            this.endDrag(slot)


            //this is level up
            //this.levelUp();


        });
        this.latest = 0;

        let panelSize = {
            w: config.width * 0.7,
            h: config.height * 0.6
        }

        this.resources = 0;

        this.maxTilePlaced = 1;

        this.resourcesLabel = new PIXI.Text('', LABELS.LABEL1);
        this.container.addChild(this.resourcesLabel)

        this.particleSystem = new ParticleSystem();
        this.addChild(this.particleSystem)



    }
    levelUp() {
        for (let index = 0; index < window.baseConfigGame.gameMap.length; index++) {
            console.log(window.baseConfigGame.gameMap)
            for (let j = 0; j < window.baseConfigGame.gameMap[index].length; j++) {
                //console.log(window.baseConfigGame.gameMap[index][j])
                if (window.baseConfigGame.gameMap[index][j] == (this.latest + 1)) {
                    this.addSlot(index, j);
                    this.latest++;
                    this.resize();
                    return
                }
            }
        }

        //REACHED MAX


    }
    adjustSlotsPosition() {
        let lastLine = this.slots[this.slots.length - 1][0]
        let diff = 0//
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j])
                    this.slots[i][j].y += diff * 0.5
            }
        }
    }

    hideBlocker() {
        this.backBlocker.visible = false;
    }
    showBlocker() {
        //this.backBlocker.visible = true;
    }
    onClickBlocker() {
        this.hideBlocker();
    }

    onClickReset(e) {
        PARTY_DATA.RESET();
    }

    resizeSlot(slot) {

        slot.scale.set((this.slotSize.width - this.slotPadding.x) / slot.width)
    }
    addSlot(i, j, type) {
        let slot = new MergeTile(i, j, this.slotSize.width, 'l0_spader_1_1');
        this.slots[i][j] = slot;
        this.resizeSlot(slot)
        slot.x = this.slotSize.width * j
        slot.y = this.slotSize.height * i
        slot.onClick.add((slot) => {
        });
        slot.onHold.add((slot) => {
            this.startDrag(slot)
        });
        slot.onEndHold.add((slot) => {
            this.endDrag(slot)
        });
        slot.onUp.add((slot) => {
            this.releaseEntity(slot)
        });
        slot.onGenerateResource.add((slot, data) => {
            this.resources += data.value

            let customData = {}
            customData.texture = 'spark2'
            customData.scale = 0.01

            let targetPos = slot.tileSprite.getGlobalPosition()

            this.particleSystem.show(targetPos, 5, customData)
            this.particleSystem.popLabel(targetPos, "+" + data.value, 0, 1, 1, LABELS.LABEL1)
            // customData.gravity
            // customData.tint
            // customData.alphaDecress
            // customData.angSpeed
            // customData.delay
            // customData.scale
            // customData.target
            // customData.forceX
            // customData.forceY
            // customData.customContainer

        });

        this.tileContainer.addChild(slot);

        if (type) {
            slot.addEntity(PARTY_DATA.getCharData(type.type));
        }
    }
    addEntity(slot, itemData) {
        console.log('add', itemData, slot.id);
        PARTY_DATA.addNewEntity(itemData.classType, slot.id, 0);
        slot.addEntity(PARTY_DATA.getCharData(itemData.classType));
        this.updatePartyData();
        this.hideBlocker();
    }
    startDrag(slot) {
        this.draggingEntity = true;
        let tex = slot.hideSprite();
        this.currentDragSlot = slot;
        this.entityDragSprite.texture = tex;
        this.entityDragSprite.visible = true;
        this.entityDragSprite.scale.set(slot.tileSprite.scale.y);
        this.entityDragSprite.x = this.mousePosition.x;
        this.entityDragSprite.y = this.mousePosition.y;
        this.entityDragSprite.anchor.set(0.5, 1);
        this.entityDragSprite.alpha = 0.5
    }
    endDrag(slot) {
        this.draggingEntity = false;
        this.entityDragSprite.visible = false;
        slot.showSprite();
    }
    removeEntity(slot) {
        if (this.currentDragSlot) {
            //return
            this.currentDragSlot.removeEntity();
            slot = this.currentDragSlot
        } else {
            slot.removeEntity();
        }

        PARTY_DATA.removeEntity(slot.id);
        this.updatePartyData();


    }
    releaseEntity(slot) {
        if (!this.currentDragSlot) {
            return;
        }
        let copyData = this.currentDragSlot.tileData// PARTY_DATA.getStaticCharData(this.currentDragSlot.charData.classType);
        let copyDataTargetSlot = null;
        if (slot.tileData) {
            copyDataTargetSlot = slot.tileData;
        }

        this.currentDragSlot.removeEntity();
        // PARTY_DATA.removeEntity(this.currentDragSlot.id);
        if (copyDataTargetSlot) {
            let target = copyDataTargetSlot
            if (copyDataTargetSlot.value == copyData.value) {
                //only remove if they will merge
                target = this.dataTiles[copyDataTargetSlot.id]
                slot.removeEntity();
                slot.addEntity(target);
            } else {

                if (!this.currentDragSlot.isGenerator) {                    
                    //swap
                    this.currentDragSlot.removeEntity();
                    this.currentDragSlot.addEntity(copyDataTargetSlot);
                    slot.removeEntity();
                    slot.addEntity(copyData);
                } else {
                    //doesnt do anything coz is coming from the generator
                    //this.currentDragSlot.addEntity(copyDataTargetSlot);                    
                }
            }
        } else {
            this.currentDragSlot.removeEntity();
            slot.addEntity(copyData);
        }

        if (!this.pieceGenerators.tileData) {
            this.pieceGenerators.startChargin()
        }

        let tempMaxTiledPlaced = utils.findMax(this.slots);
        console.log(tempMaxTiledPlaced, this.maxTilePlaced)
        if (tempMaxTiledPlaced > this.maxTilePlaced) {
            this.maxTilePlaced = tempMaxTiledPlaced;
            if (this.maxTilePlaced > 4) {
                this.levelUp()
            }
        }

        this.draggingEntity = false;
        this.currentDragSlot = null;
        this.updatePartyData();

    }
    onMouseMove(e) {
        this.mousePosition = e.data.global;
        if (!this.draggingEntity) {
            return;
        }
        if (this.entityDragSprite.visible) {
            this.entityDragSprite.x = this.mousePosition.x;
            this.entityDragSprite.y = this.mousePosition.y;
        }
    }
    updatePartyData() {
        PARTY_DATA.updatePartyData(this.slots, 0)
    }
    onAdded() {


    }
    build(param) {
        super.build();
        this.addEvents();
    }
    update(delta) {
        this.particleSystem.update(delta)
        this.pieceGenerators.update(delta);
        this.resourcesLabel.text = utils.formatPointsLabel(this.resources);
        this.resourcesLabel.y = 90
        this.timestamp = (Date.now() / 1000 | 0);
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j]) {

                    this.slots[i][j].update(delta, this.timestamp);
                    this.slots[i][j].updateDir(this.mousePosition);
                }
            }
        }

        this.gridAreaView.x = utils.lerp(this.gridAreaView.x, config.width / 2 - this.tileContainer.width / 2, 0.2)
        this.gridAreaView.y = utils.lerp(this.gridAreaView.y, config.height / 2 - this.tileContainer.height / 2 - this.slotSize.height / 2, 0.2)

        this.tileContainer.x = this.gridAreaView.x
        this.tileContainer.y = this.gridAreaView.y
    }
    resize() {


        //this.mapSize

        utils.resizeToFitAR(this.gridAreaView, this.tileContainer)



        this.bottomContainer.x = config.width / 2 - this.bottomContainer.width / 2
        this.bottomContainer.y = config.height - this.bottomContainer.height * 1.5
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