export default class MergerData {
    constructor(rawData, index) {

        let tex = new PIXI.Texture.from(rawData.imageSrc)
        let pow = Math.pow(2, index + 1)
        rawData.id = index;
        rawData.value = pow;
        rawData.texture = tex;
        rawData.initialDamage = 2 * Math.pow(1.1, index * 16)
        this.rawData = rawData;

        this.currentLevel = 1;
        this.resourceAccum = true;
      
    }
    shouldAccumulateResources() {
        return this.resourceAccum;
    }
    getID() {
        return this.rawData.id
    }
    getValue() {
        return this.rawData.value;
    }
    getRawDamage(simulate = 0) {
        return (this.rawData.initialDamage * this.rawData.initialTime) * Math.pow(this.rawData.damageCoeficient, this.currentLevel + simulate)
    }
    getDamage(simulate = 0) {
        return (this.rawData.initialDamage * this.rawData.initialTime) * Math.pow(this.rawData.damageCoeficient, this.currentLevel + simulate)  * window.gameModifyers.modifyersData.damageMultiplier
    }
    getTexture() {
        return this.rawData.texture
    }
    getGenerateDamageTime(simulate = 0) {
        return this.rawData.initialTime
    }
    getGenerateResourceTime(simulate = 0) {
        return this.rawData.initialTime / gameModifyers.modifyersData.drillSpeedValue || 1;
    }
    getRawResources(simulate = 0) {
        return (this.rawData.initialRevenue / this.getGenerateResourceTime()) * Math.pow(this.rawData.coefficientProductivity, this.currentLevel + simulate) 
    }
    getResources(simulate = 0) {
        return (this.rawData.initialRevenue / this.getGenerateResourceTime()) * Math.pow(this.rawData.coefficientProductivity, this.currentLevel + simulate) * window.gameModifyers.modifyersData.resourcesMultiplier
    }
    getCoast() {
        return this.rawData.initialCost
    }
    getUpgradeCost(totalUpgrades) {
        return this.rawData.initialCost * Math.pow(this.rawData.costCoefficient, this.currentLevel + totalUpgrades)
    }
    upgrade(quant) {
        this.currentLevel += quant;
    }
    setLevel(next) {
        this.currentLevel = next;
    }
    getRPS(simulate = 0) {
        let res = this.getResources(simulate);
        let time = this.getGenerateResourceTime(simulate);

        return res / time;
    }
    getDPS(simulate = 0) {
        let res = this.getDamage(simulate);
        let time = this.getGenerateDamageTime(simulate);

        return res / time;
    }
}