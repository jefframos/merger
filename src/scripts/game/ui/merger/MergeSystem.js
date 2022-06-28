import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import ChargerTile from './tiles/ChargerTile';
import MergeTile from './tiles/MergeTile';

export default class MergeSystem {
    constructor(containers, data, dataTiles) {

        console.log('DATA', dataTiles)
        this.gameplayData = data.general;

        this.container = containers.mainContainer;
        this.uiContainer = containers.uiContainer;
        this.wrapper = containers.wrapper;
        this.topContainer = containers.topContainer;

        this.slotSize = data.slotSize;
        this.area = data.area;
        this.onGetResources = new Signals();
        this.onDealDamage = new Signals();
        this.onPopLabel = new Signals();

        this.slotsContainer = new PIXI.Container();
        this.container.addChild(this.slotsContainer)

        this.dataTiles = dataTiles;
        let matrix = utils.cloneMatrix(data.gameMap)

        this.pieceGeneratorsList = [];


        this.maxTilePlaced = 0
        this.latest = 0;

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.fixedSize = {
            width: 0,
            height: 0,
            scale: { x: 1, y: 1 }
        }

        this.fixedBottomSize = {
            width: this.wrapper.width,
            height: this.slotSize.height,
            scale: { x: 1, y: 1 }
        }

        this.currentResolution = {
            width: 0,
            height: 0
        }
        this.resources = 0;
        this.dps = 0;
        this.rps = 0;
        this.virtualSlots = [];
        this.slots = [];

        for (var i = 0; i < matrix.length; i++) {
            let temp = []
            let temp2 = []
            for (var j = 0; j < matrix[i].length; j++) {
                temp.push(0)
                temp2.push(0)
            }
            this.slots.push(temp);
            this.virtualSlots.push(temp2);
        }

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                let slotID = matrix[i][j];
                if (slotID == 0) {
                    this.addSlot(i, j);
                }
            }
        }

        this.addPieceGenerator();
        this.addPieceGenerator();
        this.adjustSlotsPosition();

        this.entityDragSprite = new PIXI.Sprite.from('');
        this.uiContainer.addChild(this.entityDragSprite);
        this.entityDragSprite.visible = false;

        //force to resize
        setTimeout(() => {
            this.resize(config, true)
        }, 1);

        this.enemySystem = null;
        this.systems = [];

        this.loadData();
    }
    
    loadData() {
        this.savedProgression = COOKIE_MANAGER.getBoard();
        this.boardLevel = -1
        this.levelUp(this.savedProgression.currentBoardLevel, true)

        for (const key in this.savedProgression.entities) {
            if (Object.hasOwnProperty.call(this.savedProgression.entities, key)) {
                const element = this.savedProgression.entities[key];
                if (element) {
                    let split = key.split(";")
                    console.log(element, split[0], split[1])

                    let found = this.findEntityByID(element.nameID)
                    if (found) {

                        this.virtualSlots[split[0]][split[1]].addEntity(found)
                    }
                }
            }
        }
        this.updateAllData();
    }

    findEntityByID(id) {
        for (let index = 0; index < this.dataTiles.length; index++) {
            const element = this.dataTiles[index];
            if (element.rawData.nameID == id) {
                return element
            }
        }
    }
    addSystem(system) {
        this.systems.push(system);
    }
    addPieceGenerator() {
        let piece = new ChargerTile(0, 0, this.slotSize.width, 'coin', this.gameplayData.entityGeneratorBaseTime);
        piece.isGenerator = true;

        let targetScale = config.height * 0.2 / piece.height
        piece.scale.set(Math.min(targetScale, 1))
        piece.addEntity(this.dataTiles[0])
        this.uiContainer.addChild(piece);

        piece.onHold.add((slot) => {
            if (!slot.tileData) {
                return;
            }
            this.startDrag(slot)
        });
        piece.onEndHold.add((slot) => {
            if (!slot.tileData) {
                return;
            }
            this.endDrag(slot)
            setTimeout(() => {
                if (!slot.tileData) {
                    slot.startCharging()
                }
            }, 10);

        });
        piece.onCompleteCharge.add((slot) => {
            piece.addEntity(this.dataTiles[0]);
        });
        this.pieceGeneratorsList.push(piece);
    }
    updateMouseSystems(e) {
        this.updateMouse(e);

        this.systems.forEach(element => {
            element.updateMouse(e);
        });
    }
    updateMouse(e) {
        if (e) {
            this.mousePosition = e.data.global;
        }
        if (!this.draggingEntity) {
            return;
        }
        if (this.entityDragSprite.visible) {
            let toLocal = this.entityDragSprite.parent.toLocal(this.mousePosition)
            this.entityDragSprite.x = toLocal.x;
            this.entityDragSprite.y = toLocal.y;
        }
    }
    adjustSlotsPosition() {
        this.updateAllData()
    }
    levelUp(nextLevel, ignoreSave = false) {


        if (this.boardLevel != nextLevel) {
            this.boardLevel = nextLevel;
            if (!ignoreSave) {
                COOKIE_MANAGER.saveBoardLevel(this.boardLevel);
            }
        } else {
            return;
        }

        for (let index = 0; index < window.baseConfigGame.gameMap.length; index++) {
            for (let j = 0; j < window.baseConfigGame.gameMap[index].length; j++) {
                console.log(window.baseConfigGame.gameMap[index][j], this.boardLevel)
                if (window.baseConfigGame.gameMap[index][j] <= this.boardLevel) {
                    if (this.virtualSlots[index][j] == 0) {
                        this.addSlot(index, j);
                        this.latest++;
                    }
                }
            }
        }


    }
    updateSystems(delta) {
        this.update(delta);

        this.systems.forEach(element => {
            element.update(delta);
        });
    }
    update(delta) {
        this.pieceGeneratorsList.forEach(piece => {
            piece.update(delta);
        });

        this.systems.forEach(element => {
            element.update(delta);
        });
        this.timestamp = (Date.now() / 1000 | 0);
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j]) {

                    let slot = this.slots[i][j];

                    if (this.enemySystem) {
                        slot.lookAt(this.enemySystem.getEnemy());
                    }
                    slot.update(delta, this.timestamp);
                }
            }
        }

        this.updateBottomPosition();
    }
    addSlot(i, j, type) {
        let slot = new MergeTile(i, j, this.slotSize.width, 'coin');
        this.slots[i][j] = slot;

        slot.x = (this.slotSize.width + this.slotSize.distance) * j - this.slotSize.distance
        slot.y = (this.slotSize.height + this.slotSize.distance) * i - this.slotSize.distance
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

            this.resources += data.resources

            let customData = {}
            customData.texture = 'coin'
            customData.scale = 0.01
            customData.alphaDecress = 0.1
            let targetPos = slot.tileSprite.getGlobalPosition()
            this.onGetResources.dispatch(targetPos, customData, data.resources, 5)

        });
        slot.onGenerateDamage.add((slot, data) => {
            let customData = {}
            customData.texture = 'coin'
            customData.scale = 0.01

            customData.gravity = 0
            customData.alphaDecress = 0
            if (this.enemySystem) {
                let globalEnemy = this.enemySystem.getEnemy().getGlobalPosition()
                customData.target = { x: globalEnemy.x, y: globalEnemy.y, timer: 0 }
            }
            customData.forceX = 0
            customData.forceY = 200
            customData.tint = 0x5588FF
            customData.callback = this.finishDamage.bind(this, data)
            let targetPos = slot.tileSprite.getGlobalPosition()
            this.onDealDamage.dispatch(targetPos, customData, data.getDamage(), 1)

        });

        this.slotsContainer.addChild(slot);

        this.virtualSlots[i][j] = slot;

        this.adjustSlotsPosition()
    }
    finishDamage(data) {
        if (this.enemySystem) {

            this.enemySystem.damageEnemy(data.getDamage())
        }
    }
    startDrag(slot) {
        this.draggingEntity = true;
        let tex = slot.hideSprite();
        this.currentDragSlot = slot;
        this.entityDragSprite.texture = tex;
        this.entityDragSprite.visible = true;
        this.entityDragSprite.scale.set(slot.tileSprite.scale.y * 2);
        if (window.isMobile) {
            this.entityDragSprite.anchor.set(0.5, 1);
        } else {
            this.entityDragSprite.anchor.set(0.5, 0.5);
        }
        this.entityDragSprite.alpha = 0.85
        this.updateMouse();
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

        this.updateAllData();


    }
    releaseEntity(slot) {
        if (!this.currentDragSlot) {
            return;
        }
        let copyData = this.currentDragSlot.tileData
        let copyDataTargetSlot = null;
        if (slot.tileData) {
            copyDataTargetSlot = slot.tileData;
        }

        if (copyDataTargetSlot) {
            let target = copyDataTargetSlot
            if (copyDataTargetSlot.getValue() == copyData.getValue()) {
                //only remove if they will merge
                this.currentDragSlot.removeEntity();
                COOKIE_MANAGER.addMergePiece(null, this.currentDragSlot.id.i, this.currentDragSlot.id.j)
                target = this.dataTiles[copyDataTargetSlot.getID() + 1]
                slot.removeEntity();
                //console.log(target)
                slot.addEntity(target);
                COOKIE_MANAGER.addMergePiece(target, slot.id.i, slot.id.j)
            } else {

                if (!this.currentDragSlot.isGenerator) {
                    //swap
                    this.currentDragSlot.removeEntity();
                    this.currentDragSlot.addEntity(copyDataTargetSlot);
                    slot.removeEntity();
                    slot.addEntity(copyData);
                    COOKIE_MANAGER.addMergePiece(copyData, slot.id.i, slot.id.j)
                } else {
                    //doesnt do anything coz is coming from the generator
                    //this.currentDragSlot.addEntity(copyDataTargetSlot);                    
                }
            }
        } else {
            this.currentDragSlot.removeEntity();
            COOKIE_MANAGER.addMergePiece(null, this.currentDragSlot.id.i, this.currentDragSlot.id.j)
            slot.addEntity(copyData);
            COOKIE_MANAGER.addMergePiece(copyData, slot.id.i, slot.id.j)
        }



        let tempMaxTiledPlaced = utils.findMax(this.slots);
        if (tempMaxTiledPlaced > this.maxTilePlaced) {
            this.maxTilePlaced = tempMaxTiledPlaced;
            let nextLevel = Math.max(0, this.maxTilePlaced - 3);
            this.levelUp(nextLevel)
        }
        //this.levelUp()

        this.draggingEntity = false;
        this.currentDragSlot = null;
        this.updateAllData();

    }
    updateAllData() {
        this.dps = utils.findDPS(this.slots);
        this.rps = utils.findRPS(this.slots);

        let clone = utils.cloneMatrix(this.slots)

        let trimmed = utils.trimMatrix(clone);
        let sides = trimmed.left + trimmed.right
        let ups = trimmed.top + trimmed.bottom;

        let horizontal = (this.slots[0].length - sides)
        let vertical = (this.slots.length - ups)

        this.fixedSize.width = horizontal * this.slotSize.width + (this.slotSize.distance * (horizontal - 1))
        this.fixedSize.height = vertical * this.slotSize.height + (this.slotSize.distance * (vertical - 1))

        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j]) {
                    let slot = this.slots[i][j];

                    slot.y = ((this.slotSize.height + this.slotSize.distance)) * i

                    let scale = ((slot.y + this.slotSize.distance) / this.fixedSize.height) * this.area.perspective + (1 - this.area.perspective)
                    slot.scale.set(scale)
                    slot.x = ((this.slotSize.width + this.slotSize.distance) * scale) * j + (horizontal * this.slotSize.width * (1 - scale)) / 2 - this.slotSize.distance
                    slot.y = ((this.slotSize.height + this.slotSize.distance) * scale) * i + (this.slotSize.distance * scale) * vertical - this.slotSize.distance * 2
                }
            }
        }

        if (this.wrapper) {
            this.updateGridPosition();
        }

    }
    resize(resolution, force) {

        if (!force && this.currentResolution.width == resolution.width && this.currentResolution.height == resolution.height) {
            return;
        }
        this.currentResolution.width = resolution.width;
        this.currentResolution.height = resolution.height;

        this.updateGridPosition();

    }
    updateGridPosition() {


        utils.resizeToFitARCap(this.wrapper, this.container, this.fixedSize)

        this.container.x = this.wrapper.x + this.wrapper.width / 2 - (this.fixedSize.width * this.container.scale.x) / 2 + this.slotSize.distance * this.container.scale.x;;
        this.container.y = this.wrapper.y + this.wrapper.height / 2 - (this.fixedSize.height * this.container.scale.x) / 2 + this.slotSize.distance * this.container.scale.y;

    }
    updateBottomPosition() {
        let accumPiece = 0;
        let maxPos = 0
        this.pieceGeneratorsList.forEach(piece => {
            if (piece.visible) {
                piece.x = (this.slotSize.width + this.slotSize.distance) * accumPiece
                accumPiece++
                maxPos = piece.x + this.slotSize.width
            }
        });
        this.uiContainer.x = this.wrapper.x + this.wrapper.width / 2 - (maxPos * this.uiContainer.scale.x) / 2
        let bottomWrapperDiff = this.wrapper.y + this.wrapper.height
        let bottomDiff = config.height - bottomWrapperDiff
        let targetScale = bottomDiff / this.slotSize.height * 0.55
        targetScale = Math.min(1, targetScale)
        this.uiContainer.scale.set(targetScale)
        this.uiContainer.y = bottomWrapperDiff + (bottomDiff) / 2 - (this.slotSize.height * this.uiContainer.scale.y) / 2// - this.wrapper.y + this.wrapper.height //- (this.slotSize.height * this.uiContainer.scale.y) - config.height * 0.05

    }

}
