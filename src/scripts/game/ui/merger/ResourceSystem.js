import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import ResourceTile from './tiles/ResourceTile';

export default class ResourceSystem {
    constructor(containers, data, dataTiles) {

        this.dataTiles = dataTiles;
        this.gameplayData = data.general;

        this.slotSize = data.slotSize;
        this.area = data.area;

        this.container = containers.mainContainer;
        this.wrapper = containers.wrapper;

        this.onGetResources = new Signals();
        this.onPopLabel = new Signals();

        this.slotsContainer = new PIXI.Container();
        this.container.addChild(this.slotsContainer)

        this.currentResolution = {
            width: 0,
            height: 0
        }

        this.fixedSize = {
            width: 0,
            height: 0,
            scale: { x: 1, y: 1 }
        }
        this.mousePosition = { x: 0, y: 0 }
        this.resourceSlots = []
        this.addResourceSlot();
        this.addResourceSlot();
        this.addResourceSlot();
        this.addResourceSlot();
        this.addResourceSlot();
        this.addResourceSlot();
        this.timestamp = (Date.now() / 1000 | 0);


        this.resourceSlots[0].addEntity(this.dataTiles[0])
        this.resourceSlots[1].addEntity(this.dataTiles[2])
        this.resourceSlots[2].addEntity(this.dataTiles[4])
        this.resourceSlots[3].addEntity(this.dataTiles[9])
        this.resourceSlots[4].addEntity(this.dataTiles[11])
        this.resourceSlots[5].addEntity(this.dataTiles[29])

        setTimeout(() => {
            this.resize(config, true)
        }, 1);

        this.rps = 0;
    }

    update(delta) {
        this.timestamp = (Date.now() / 1000 | 0);

        this.resourceSlots.forEach(element => {
            element.update(delta, this.timestamp)
        });

        this.rps = utils.findRPS2(this.resourceSlots)
    }

    addResourceSlot() {
        let piece = new ResourceTile(0, 0, this.slotSize.width, 'coin', this.gameplayData.entityGeneratorBaseTime);
        let targetScale = config.height * 0.2 / piece.height
        piece.scale.set(Math.min(targetScale, 1))

        piece.onHold.add((slot) => {
            if (!slot.tileData) {
                return;
            }
        });
        piece.onEndHold.add((slot) => {
            if (!slot.tileData) {
                return;
            }
        });
        piece.onUp.add((slot) => {
            if (!slot.tileData) {
                console.log("open shop menu")
                return;
            }
            console.log("open upgrade menu")
        });
        piece.onGenerateResource.add((slot, data, totalResources) => {
            let customData = {}
            customData.texture = 'coin'
            customData.scale = 0.01
            customData.alphaDecress = 0.1

            let targetPos = slot.tileSprite.getGlobalPosition()
            this.onGetResources.dispatch(targetPos, customData, totalResources, 5)

        });
        this.container.addChild(piece);

        this.resourceSlots.push(piece)


        let vertical = this.resourceSlots.length
        let horizontal = 1
        this.fixedSize.width = this.slotSize.width
        this.fixedSize.height = vertical * this.slotSize.height + (this.slotSize.distance * (vertical - 1))

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

        this.container.x = 0//this.wrapper.x + this.wrapper.width / 2 - (this.fixedSize.width * this.container.scale.x) / 2 + this.slotSize.distance * this.container.scale.x;;
        this.container.y = this.wrapper.y + this.wrapper.height / 2 - (this.fixedSize.height * this.container.scale.x) / 2 + this.slotSize.distance * this.container.scale.y;

        for (let index = this.resourceSlots.length - 1; index >= 0; index--) {
            const element = this.resourceSlots[this.resourceSlots.length - 1 - index];
            element.y = (this.slotSize.height + this.slotSize.distance) * index
        }

    }

    updateMouse(e) {
        if (e) {
            this.mousePosition = e.data.global;

            //if (window.isMobile) {

                this.resourceSlots.forEach(element => {
                    let globalPosition = element.getCenterPosition();
                    if (element.tileData) {
                        let dist = utils.distance(globalPosition.x, globalPosition.y, this.mousePosition.x, this.mousePosition.y)
                        let scaled = (this.slotSize.height * this.container.scale.x) / 2
                        if (dist < scaled) {
                            element.onMouseMoveOver(true);
                        }else{
                            element.outState()
                        }
                    }
                });
            }
        //}

    }
}