import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class StandardAttackAction {
	constructor(entity) {
		this.entity = entity;
		this.targetRequired = 'opposite'
		this.isRange = false;
		this.ignoreDead = false;
		this.requireMovement = true;
		this.isEffect = false;

		// this.entity.onActing.add((entity, target) => {
        //     this.doAction();
        // })

	}
	getSpeedMultiplier(){
        return this.entity.weapon.speedMultiplier ? this.entity.weapon.speedMultiplier : 1
    }
	doAction(entity, target) {
		if(this.entity.weapon.range){
			this.game.shootBullet(this.entity, this.entity.currentTarget, this.entity.weapon.range.bullet)
		}
	}
	startAction(game) {
		this.game = game
		if(this.entity.weapon.range){
			this.requireMovement = false;
		}else{
			this.requireMovement = true;
		}
		this.entity.setActionMultiplier(this.entity.weapon.speedMultiplier ? this.entity.weapon.speedMultiplier : 1)
	}
	applyActionEffects(target) {

		return 
		//usar weapon
		let demage = Math.ceil(target.entityModel.getHurt(this.entity.entityModel.getDemage('physical', this.entity.weapon.weaponPower)))

		target.attacked(demage, this.entity.position, this.entity.weapon.kickback);
		return {
			demage: demage,
			target: target,
			bloodColor: target.bloodColor,
			demageColor: target.demageColor,
			sign: '-',
			actionType: 'standard'
		}
	}
	applyWeaponEffects(target) {

		if(!this.entity.weapon.range){

			let distance = utils.distance(target.y, target.x, this.entity.y, this.entity.x)
			let onRadius = distance < (target.radius  + this.entity.radius );
			if(!onRadius){
				return {
					demage: 0,
					target: target,
					bloodColor: target.bloodColor,
					demageColor:  target.demageColor,
					sign: '',
					actionType: 'miss'
				}
			}
		}
		//usar weapon
		let demage = Math.ceil(target.entityModel.getHurt(this.entity.entityModel.getDemage('physical', this.entity.weapon.weaponPower)))
		let isCritical = Math.random() < this.entity.weapon.criticalChance;
		if(isCritical){
			demage *= this.entity.weapon.critical;
			demage = Math.ceil(demage);
		}
		
		target.attacked(demage, this.entity.position, this.entity.weapon.kickback);
		return {
			demage: demage,
			target: target,
			bloodColor: target.bloodColor,
			demageColor: isCritical ? ['0xFF0000', '0x7F1B1B'] : target.demageColor,
			sign: '-',
			actionType: 'standard'
		}
	}
}