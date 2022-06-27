export default class GameEconomy{
    constructor() {
        this.economyData  = COOKIE_MANAGER.getEconomy();
        console.log(this.economyData)
        this.currentResources = this.economyData.resources
    }
    addResources(res){
        this.currentResources += res;
        this.saveResources()
        
    }
    hasEnoughtResources(cost){
        
        return cost <= this.currentResources
    }
    
    useResources(cost){
        this.currentResources -= cost
        this.saveResources()
    }

    saveResources(){
        COOKIE_MANAGER.updateResources(this.currentResources)
    }
}