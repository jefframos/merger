import * as PIXI from 'pixi.js';
import config from '../../../config';
import utils from '../../../utils';
import Signals from 'signals';
import EntityStandardBar from '../ui/EntityStandardBar';
import StandardEntity from '../StandardEntity';
// import GambitLowestHp from '../gambits/GambitLowestHp';
import SpriteSheetAnimation from '../SpriteSheetAnimation';
import MonsterModel from '../model/MonsterModel';
import GambitHighestHP from '../gambits/GambitHighestHP';
import StandardAttackAction from '../actions/StandardAttackAction';
import WeaponsData from '../../data/WeaponsData';

export default class StandardMonster extends StandardEntity {
    constructor(radius) {
        super(radius);

        this.bloodColor = ['0x267613', '0x23920a']
        this.demageColor = [0xcc6600, 0xbb4400]

        this.isMonster = true;
        this.onReadyToAttack = new Signals();
        this.entityModel = new MonsterModel();

        this.weapon = WeaponsData.noWeapon
        let sp = new SpriteSheetAnimation();

        this.defaultGamibt = new GambitHighestHP(this)
        this.defaultGamibt.addAction(new StandardAttackAction(this));
    }
    reset(data) {

        if (!data) {
            // super.reset(0.5)
            return;
        }
        this.entityData = data;

        this.entityModel.build('Jonny', this.entityData.stats, this.entityData.fire, this.entityData.graphicsData, this.entityData.config)

        let f = ['l0_spader_1_1', 'l0_spader_2_1', 'l0_spader_3_1', 'l0_spader_4_1', ]
        this.entitySprite.texture = PIXI.Texture.from(f[Math.floor(Math.random() * f.length)])
            // this.entitySprite.texture = PIXI.Texture.from(this.entityData.graphicsData.texture)
        super.reset(1, {
            x: 0,
            y: 0//-config.height * 0.05
        });

        this.jumpSpeed = 20
        this.gravity = 20;
        this.fitOnRadius(this.lifeBar)
        this.lifeBar.rotation = 0
        this.lifeBar.x = 0;


        this.atbBar.visible = false;
        this.atbBar.y = -this.entitySprite.height - this.atbBar.height * 2
        this.lifeBar.y = this.atbBar.y + this.atbBar.height + this.spriteOffset.y;

        this.readyLabel.visible = false;

        this.frontLifeBarColor = 0xcc6600

        this.lifeBar.updatePowerBar(this.hp / this.maxHP, this.frontLifeBarColor, true)
        this.lifeBar.updatePowerBaBGr(0)
    }

    update(delta) {
        if(this.entityData.stats.speed <= 0){
            this.atb = 0
        }
        super.update(delta);
        this.atbBar.visible = false;
        if (this.atb >= 1 && this.entityData.stats.speed > 0) {
            this.readyToAction()
        }
    }
    readyToAction() {
        if (this.readyToAct) {
            return;
        }
        this.readyToAct = true;
        this.onReadyToAttack.dispatch(this)
    }
    act(gambit,target, targetPosition) {

        super.act(gambit,target, targetPosition);

    }

}