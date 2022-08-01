import Signals from 'signals';
export default class GameModifyers {
    constructor() {
        this.modifyersData = COOKIE_MANAGER.getModifyers();
        this.onUpdateModifyers = new Signals();

        let defaultModifyers = {
            drillSpeed: 1,
            resourcesMultiplier: 1,
            damageMultiplier: 1,
            attackSpeed: 1,
            attackSpeedValue: 1,
            autoMerge: false,
            autoCollectResource: false
        }

        this.bonusData = {
            damageBonus: 1,
            resourceBonus: 1,
            damageSpeed: 1,
            resourceSpeed: 1
        }

        this.permanentBonusData = {
            damageBonus: 1,
            resourceBonus: 1,
            damageSpeed: 1,
            resourceSpeed: 1
        }
    }
    addResources(res) {

    }
    hasEnoughtResources(cost) {
    }

    saveModifyers(type, level, value) {
        this.modifyersData[type] = level;
        this.modifyersData[type + 'Value'] = value;
        this.onUpdateModifyers.dispatch();
        COOKIE_MANAGER.updateModifyers(this.modifyersData)
    }
    saveBoolModifyers(type, value) {
        this.modifyersData[type] = value;
        this.onUpdateModifyers.dispatch();
        COOKIE_MANAGER.updateModifyers(this.modifyersData)
    }
    getLevel(data) {
        return (this.modifyersData[data.rawData.modifyer] || 1)
    }
    getDamageMultiplier() {
        return (this.modifyersData.damageMultiplierValue || 1) * this.bonusData.damageBonus * this.permanentBonusData.damageBonus
    }
    getResourcesMultiplier() {
        return (this.modifyersData.resourcesMultiplierValue || 1) * this.bonusData.resourceBonus * this.permanentBonusData.resourceBonus
    }
    getDrillSpeed() {
        return (this.modifyersData.drillSpeedValue || 1) * this.bonusData.damageSpeed * this.permanentBonusData.damageSpeed
    }
    getAttackSpeed() {
        return (this.modifyersData.attackSpeedValue || 1) * this.bonusData.resourceSpeed * this.permanentBonusData.resourceSpeed
    }
}