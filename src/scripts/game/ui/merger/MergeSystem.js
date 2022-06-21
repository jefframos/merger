import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import ChargerTile from './ChargerTile';
import MergeTile from './MergeTile';

export default class MergeSystem {
    constructor(containers, data, dataTiles) {
        this.container = containers.mainContainer;
        this.uiContainer = containers.uiContainer;
        this.wrapper = containers.wrapper;

        this.slotSize = data.slotSize;
        this.area = data.area;
        this.onGetResources = new Signals();

        this.slotsContainer = new PIXI.Container();
        this.container.addChild(this.slotsContainer)

        this.topContainer = new PIXI.Container();
        this.container.addChild(this.topContainer)
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
        this.slots = [];

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
                if (slotID >= 0) {
                    this.addSlot(i, j);
                }
            }
        }
        
        this.addPieceGenerator();
        this.addPieceGenerator();
        
        this.adjustSlotsPosition()


        this.entityDragSprite = new PIXI.Sprite.from('');
        this.uiContainer.addChild(this.entityDragSprite);
        this.entityDragSprite.visible = false;

        //force to resize
        setTimeout(() => {            
            this.resize(config, true)
        }, 1);
    }
    addPieceGenerator() {
        let piece = new ChargerTile(0, 0, this.slotSize.width, 'l0_spader_1_1', 1);
        piece.isGenerator = true;

        let targetScale = config.height * 0.2 / piece.height
        piece.scale.set(Math.min(targetScale, 1))
        piece.addEntity(this.dataTiles[0])
        this.uiContainer.addChild(piece);

        piece.onHold.add((slot) => {
            this.startDrag(slot)
        });
        piece.onEndHold.add((slot) => {
            this.endDrag(slot)

            setTimeout(() => {

                if (!slot.tileData) {
                    slot.startCharging()
                }
            }, 10);

        });
        piece.onCompleteCharge.add((slot) => {
            piece.addEntity(this.dataTiles[0])
        });
        this.pieceGeneratorsList.push(piece);
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
        let lastLine = this.slots[this.slots.length - 1][0]
        let diff = 0//
        // for (var i = 0; i < this.slots.length; i++) {
        //     for (var j = 0; j < this.slots[i].length; j++) {
        //         if (this.slots[i][j])
        //             this.slots[i][j].y += diff * 0.5
        //     }
        // }
        this.updateAllData()
    }
    levelUp() {
        for (let index = 0; index < window.baseConfigGame.gameMap.length; index++) {
            for (let j = 0; j < window.baseConfigGame.gameMap[index].length; j++) {
                if (window.baseConfigGame.gameMap[index][j] == (this.latest + 1)) {
                    this.addSlot(index, j);
                    this.latest++;
                    return
                }
            }
        }

        
    }
    update(delta) {
        this.pieceGeneratorsList.forEach(piece => {
            piece.update(delta);
        });

        this.timestamp = (Date.now() / 1000 | 0);
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if (this.slots[i][j]) {

                    let slot = this.slots[i][j];
                    slot.update(delta, this.timestamp);
                    slot.updateDir(this.mousePosition);
                }
            }
        }

        this.updateBottomPosition();
    }
    addSlot(i, j, type) {
        let slot = new MergeTile(i, j, this.slotSize.width, 'l0_spader_1_1');
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
            this.resources += data.value

            let customData = {}
            customData.texture = 'spark2'
            customData.scale = 0.01
            let targetPos = slot.tileSprite.getGlobalPosition()
            this.onGetResources.dispatch(targetPos, customData, data.value)

        });

        this.slotsContainer.addChild(slot);

        this.adjustSlotsPosition()
    }
    startDrag(slot) {
        this.draggingEntity = true;
        let tex = slot.hideSprite();
        this.currentDragSlot = slot;
        this.entityDragSprite.texture = tex;
        this.entityDragSprite.visible = true;
        this.entityDragSprite.scale.set(slot.tileSprite.scale.y);
        this.entityDragSprite.anchor.set(0.5, 0.5);
        this.entityDragSprite.alpha = 0.5
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
            if (copyDataTargetSlot.value == copyData.value) {
                //only remove if they will merge
                this.currentDragSlot.removeEntity();
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



        let tempMaxTiledPlaced = utils.findMax(this.slots);
        if (tempMaxTiledPlaced > this.maxTilePlaced) {
            this.maxTilePlaced = tempMaxTiledPlaced;
            if (this.maxTilePlaced > 4) {
                this.levelUp()
            }
        }
        //this.levelUp()

        this.draggingEntity = false;
        this.currentDragSlot = null;
        this.updateAllData();

    }
    updateAllData() {
        this.dps = utils.findDPS(this.slots);

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

                    let scale = ((slot.y + this.slotSize.distance)  / this.fixedSize.height) * 0.3 + 0.7
                    slot.scale.set(scale)
                    slot.x = ((this.slotSize.width + this.slotSize.distance)* scale) * j + (horizontal * this.slotSize.width*( 1 -scale)) / 2 - this.slotSize.distance
                    slot.y = ((this.slotSize.height + this.slotSize.distance) * scale) * i + (this.slotSize.distance * scale)*vertical +  this.slotSize.distance
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
