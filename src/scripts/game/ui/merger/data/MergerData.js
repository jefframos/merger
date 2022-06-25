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
    shouldAccumulateResources(){
        return this.resourceAccum;
    }
    getID(){
        return this.rawData.id
    }
    getValue(){
        return this.rawData.value;
    }
    getDamage(){
        return this.rawData.initialDamage
    }
    getTexture(){
        return this.rawData.texture
    }
    getGenerateDamageTime(){
        return this.rawData.initialTime
    }
    getGenerateResourceTime(){
        return this.rawData.initialTime
    }
    getResources(){
        return this.rawData.initialRevenue * Math.pow(this.rawData.coefficientProductivity, this.currentLevel)
    }
    getCoast(){
        return this.rawData.initialCost
    }
    getUpgradeCost(totalUpgrades){
        return this.rawData.initialCost * Math.pow(this.rawData.costCoefficient, this.currentLevel + totalUpgrades)
    }
    upgrade(quant){
        this.currentLevel += quant;
    }
}