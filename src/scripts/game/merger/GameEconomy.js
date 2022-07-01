export default class GameEconomy {
    constructor() {
        this.economyData = COOKIE_MANAGER.getEconomy();
        console.log(this.economyData)
        this.currentResources = this.economyData.resources
    }
    addResources(res) {
        this.currentResources += res;
        this.saveResources()

    }
    hasEnoughtResources(cost) {

        return Math.ceil(cost) <= Math.floor(this.currentResources)
    }

    useResources(cost) {
        this.currentResources -= cost
        this.currentResources = Math.max(this.currentResources, 0)
        this.saveResources()
    }

    saveResources() {
        COOKIE_MANAGER.updateResources(this.currentResources)
    }
}