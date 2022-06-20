import * as PIXI from 'pixi.js';
import config from '../../../config';
import utils from '../../../utils';
import Signals from 'signals';
import EntityStandardBar from '../ui/EntityStandardBar';
import StandardEntity from '../StandardEntity';
import PlayerModel from '../model/PlayerModel';
import GambitRandomOpposite from '../gambits/GambitRandomOpposite';
import SpellsData from '../../data/SpellsData'
import WeaponsData from '../../data/WeaponsData'
export default class StandardHero extends StandardEntity {
    constructor(radius) {
        super(radius);
        this.entityModel = new PlayerModel()
        this.isHero = true;
        this.defaultGamibt = new GambitRandomOpposite(this)
        //console.log(this.entityModel)
    }
    reset(data) {


        if (!data) {
            super.reset(1)
            return;
        }


        this.weapon = WeaponsData[data.defaultWeapon];

        if (data.gambits) {
            if(data.gambits.main){
                let mainGambit = data.gambits.main
                let actionValue = mainGambit.action.value
                if (mainGambit.action.valueType == 'spell') {
                    actionValue = SpellsData[mainGambit.action.value]
                }
                this.defaultGamibt = new GAMBITS[mainGambit.type](this, mainGambit.target == 'opposite', mainGambit.data)
                this.defaultGamibt.resultAction = new ACTIONS[mainGambit.action.type](this, actionValue);          
                
                console.log(this.defaultGamibt)
            }

            data.gambits.default.forEach(mainGambit => {
                let actionValue = mainGambit.action.value
                if (mainGambit.action.valueType == 'spell') {
                    actionValue = SpellsData[mainGambit.action.value]
                }
                this.addGambit(
                    new GAMBITS[mainGambit.type](this, mainGambit.target == 'opposite', mainGambit.data),
                    new ACTIONS[mainGambit.action.type](this, actionValue));
            });

        }

        //console.log(data)
        this.entityData = data;
        this.entityModel.build('Jonny', this.entityData.stats.classType, this.entityData.stats, this.entityData.modifiers, this.entityData.graphicsData, this.entityData.config)

        this.graphicsData = this.entityData.graphicsData;
        this.entitySprite.texture = PIXI.Texture.from(this.graphicsData.textures.back)

        this.entityModel.speed *= 1.5

        super.reset(1);

    }

    update(delta) {
        super.update(delta);
    }

    act(gambit, target, targetPosition) {

        //console.log(target)
        super.act(gambit, target, targetPosition);

    }

    startReturnFromAction() {
        super.startReturnFromAction()
        this.entitySprite.texture = PIXI.Texture.from(this.graphicsData.textures.front)
    }
    endReturnFromAction() {
        super.endReturnFromAction()
        this.entitySprite.texture = PIXI.Texture.from(this.graphicsData.textures.back)
    }


}