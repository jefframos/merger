import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class StandardSpellAction {
    constructor(entity, spell) {
        this.entity = entity;
        this.spell = spell;
        this.targetRequired = spell.targetRequired
        this.isRange = true;
        this.ignoreDead = true;
        this.requireMovement = false;
        this.isEffect = true;
    }
    getSpeedMultiplier(){
        return this.spell.speedMultiplier ? this.spell.speedMultiplier : 1
    }
    doAction(entity, target) {
        this.game.shootBullet(this.entity, this.entity.currentTarget, this.spell.bullet)
    }
    startAction(game) {
        this.game = game;
        this.entity.setActionMultiplier(this.spell.speedMultiplier ? this.spell.speedMultiplier : 1)
    }
    applyActionEffects(target) {
         //usar weapon
         if(this.spell.spellPower < 0){
             let demage = Math.ceil(this.spell.spellPower)

             if (target.killed) {
                 target.revive(demage)
             } else {
                 target.attacked(demage)
             }
             return {
                 demage: demage,
                 target: target,
                 bloodColor: [0x00BB33],
                 demageColor: [0x00BB33, 0],
                 sign: '+',
                 actionType: 'heal'
             }
         }else{
            let targetDamage = this.entity.entityModel.getDemage('magical', this.entity.weapon.weaponPower, this.spell.spellPower)
            let demage = Math.ceil(target.entityModel.getHurt(targetDamage, 'magical'))
            target.attacked(demage);
            return {
                demage:demage,
                target:target,
                bloodColor:target.bloodColor,
                demageColor:target.demageColor,
                sign:'-',
                actionType:'standard'
            }
         }
    }
    applyWeaponEffects(target) {
        let demage = Math.ceil(target.entityModel.getHurt(this.entity.entityModel.getDemage()))

        target.attacked(demage);
        return {
            demage:demage,
            target:target,
            bloodColor:target.bloodColor,
            demageColor:target.demageColor,
            sign:'-',
            actionType:'standard'
        }
    }
}