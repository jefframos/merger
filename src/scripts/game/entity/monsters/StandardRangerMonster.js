import * as PIXI from 'pixi.js';
import config from '../../../config';
import utils from '../../../utils';
import Signals from 'signals';
import EntityStandardBar from '../ui/EntityStandardBar';
import StandardRanger from '../classes/StandardRanger';
import MonsterModel from '../model/MonsterModel';
export default class StandardRangerMonster extends StandardRanger {
    constructor(radius) {
        super(radius);

        this.isMonster = true;
        this.onReadyToAttack = new Signals();
        this.entityModel = new MonsterModel();
    }
    readyToAction() {
        if (this.readyToAct) {
            return;
        }
        this.readyToAct = true;
        this.onReadyToAttack.dispatch(this)
    }
    reset(data) {


        if (!data) {
            // super.reset(0.5)
            return;
        }
        this.entityData = data;

        this.entityModel.build('Jonny', this.entityData.stats, this.entityData.fire, this.entityData.graphicsData, this.entityData.config)


        this.entitySprite.texture = PIXI.Texture.from(this.entityData.graphicsData.texture)
        super.reset(1, {
            x: 0,
            y: -config.height * 0.05
        });


        this.jumpSpeed = 20
        this.gravity = 50;
        this.fitOnRadius(this.lifeBar)
        this.lifeBar.rotation = 0
        this.lifeBar.x = 0;


        this.atbBar.visible = false;
        this.atbBar.y = -this.entitySprite.height - this.atbBar.height * 2
        this.lifeBar.y = this.atbBar.y + this.atbBar.height + this.spriteOffset.y;

        this.readyLabel.visible = false;

        this.frontLifeBarColor = 0xcc6600


        // this.lifeBar.updatePowerBar(this.maxHP / this.hp, 0x00FF00, true)


        this.lifeBar.updatePowerBar(this.hp / this.maxHP, this.frontLifeBarColor, true)
        this.lifeBar.updatePowerBaBGr(0)

    }

}