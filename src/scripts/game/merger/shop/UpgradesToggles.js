import TweenMax from 'gsap';
import * as PIXI from 'pixi.js';
import Signals from 'signals';
import UIButton1 from '../ui/UIButton1';
import UIList from '../ui/uiElements/UIList';

export default class UpgradesToggles extends PIXI.Container {
    constructor(rect) {
        super()
        let width = rect.w
        let height = rect.h
        this.backShape = new PIXI.mesh.NineSlicePlane(
            PIXI.Texture.fromFrame('progressBarSmall'), 10, 10, 10, 10)
        this.backShape.width = width
        this.backShape.height = height
        this.addChild(this.backShape)


        this.lockList = new UIList()
        this.lockList.w = width;
        this.lockList.h = height;

        this.onUpdateValue = new Signals();

        this.addChild(this.lockList);

        this.values = [1, 10, 100, 500]
        this.toggles = []
        for (let index = 0; index < this.values.length; index++) {
            let toggle = new UIButton1(0, this.values[index]+'toggle', 0xFFffff)
            toggle.changePivot(0, 0)
            toggle.disableState(0x555555)
            toggle.value = this.values[index]
            toggle.fitHeight = 0.8
            this.lockList.addElement(toggle)
            toggle.onClick.add(() => {

                this.toggles.forEach(element => {
                    element.disableState(0x555555)
                });
                toggle.enableState(0)
                this.currentActiveValue = toggle.value;

                this.onUpdateValue.dispatch()
            })

            this.toggles.push(toggle)
        }
        this.toggles[0].enableState(0)

        this.currentActiveValue = this.toggles[0].value;

        this.lockList.updateHorizontalList()

    }
}