import * as PIXI from 'pixi.js';
import * as Filters from 'pixi-filters';
import Screen from '../../screenManager/Screen'
import Signals from 'signals';
import MergeTile from '../ui/merger/MergeTile';
import UIButton1 from '../ui/UIButton1';
export default class MergeScreen extends Screen {
    constructor(label) {
        super(label);

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

        this.tileContainer = new PIXI.Container()
        this.container.addChild(this.tileContainer);

        this.bottomContainer = new PIXI.Container()
        this.container.addChild(this.bottomContainer);

        let p = {
            w: 0.8,
            h: 0.6
        }
        
        //this.tileContainer.addChild(

        this.slots = [];

        this.slotPadding = {
            x: config.width * 0.05,
            y: config.width * 0,
        }
        let matrix = [
            [1, 1, 1, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]]
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
                if(slotID){
                    this.addSlot(i, j, slotID);
                }
            }
        }

        this.adjustSlotsPosition();

        this.tileContainer.y = config.height/2 - this.tileContainer.height/2// - this.slotSize.width / 2
        this.entityDragSprite = new PIXI.Sprite.from('');
        this.addChild(this.entityDragSprite);
        this.entityDragSprite.visible = false;

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this)).on('touchmove', this.onMouseMove.bind(this));


        this.playButton = new UIButton1(0x5599ff, 'smallButton')
        this.container.addChild(this.playButton)
        //this.playButton.scale.set(config.height / this.playButton.height * 0.1)

        this.playButton.x = config.width - this.playButton.width * 1.5
        this.playButton.y = config.height - this.playButton.height * 1.5

        this.playButton.visible = false;



        this.resetDataButton = new UIButton1(0, 'icon-trash')
        this.resetDataButton.onClick.add(() => {
            //this.onClickReset()
        })

        this.container.addChild(this.resetDataButton)
        //this.resetDataButton.scale.set(config.height / this.resetDataButton.height * 0.1)

        this.resetDataButton.x = this.resetDataButton.width * 0.5
        this.resetDataButton.y = this.resetDataButton.height * 0.5


        this.backButton = new UIButton1(0, 'icon-home')
        this.backButton.onClick.add(() => {
            //this.onClickBack()
        })
        this.container.addChild(this.backButton)
        //this.backButton.scale.set(config.height / this.backButton.height * 0.1)

        this.backButton.x = this.backButton.width * 0.5
        this.backButton.y = config.height - this.backButton.height * 1.5

        this.verifyEntities();

        this.pieceGenerators = new MergeTile(0,0, this.slotSize.width);
        this.resizeSlot(this.pieceGenerators)
        this.bottomContainer.addChild(this.pieceGenerators);

        let panelSize = {
            w: config.width * 0.7,
            h: config.height * 0.6
        }


    }

    adjustSlotsPosition() {
        let lastLine = this.slots[this.slots.length - 1][0]
        let diff = 0//
        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if(this.slots[i][j])
                this.slots[i][j].y += diff * 0.5
            }
        }
    }
    verifyEntities() {
        this.playButton.visible = PARTY_DATA.hasParty();
    }
    hideBlocker() {
        this.backBlocker.visible = false;
    }
    showBlocker() {
        //this.backBlocker.visible = true;
    }
    onClickBlocker() {
        this.hideRecruitList();
        this.hideBlocker();
    }

    onClickReset(e) {
        PARTY_DATA.RESET();
    }
    resizeSlot(slot) {

        slot.scale.set((this.slotSize.width - this.slotPadding.x) / slot.width)
    }
    addSlot(i, j, type) {
        let slot = new MergeTile(i, j, this.slotSize.width);
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
        this.verifyEntities();
        this.hideRecruitList();
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

        this.verifyEntities()

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

        slot.removeEntity();
        //PARTY_DATA.removeEntity(slot.id);
        slot.addEntity(copyData);
        //PARTY_DATA.addNewEntity(copyData.classType, slot.id, 0);

        this.currentDragSlot.removeEntity();
        // PARTY_DATA.removeEntity(this.currentDragSlot.id);
        if (copyDataTargetSlot) {
            this.currentDragSlot.addEntity(copyDataTargetSlot);
            //PARTY_DATA.addNewEntity(copyDataTargetSlot.classType, this.currentDragSlot.id, 0);
        } else {

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

        for (var i = 0; i < this.slots.length; i++) {
            for (var j = 0; j < this.slots[i].length; j++) {
                if(this.slots[i][j]){

                    this.slots[i][j].update(delta);
                    this.slots[i][j].updateDir(this.mousePosition);
                }
            }
        }

    }
    resize(){        
        this.tileContainer.x = config.width/2 - this.tileContainer.width/2 
        this.tileContainer.y = config.height/2 - this.tileContainer.height/2

        this.bottomContainer.x = config.width/2 - this.bottomContainer.width/2 
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