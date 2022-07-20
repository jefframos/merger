import Signals from 'signals';

export default class GameEconomy {
    constructor() {
        this.economyData = COOKIE_MANAGER.getEconomy();
        console.log(this.economyData)
        this.currentResources = this.economyData.resources
        this.onMoneySpent = new Signals();
    }
    addResources(res) {
        this.currentResources += res;
        this.saveResources()
        this.onMoneySpent.dispatch(-res);

    }
    hasEnoughtResources(cost) {

        return Math.ceil(cost) <= Math.floor(this.currentResources)
    }

    useResources(cost) {
        this.currentResources -= cost
        this.currentResources = Math.max(this.currentResources, 0)
        this.saveResources()

        this.onMoneySpent.dispatch(cost);
    }

    saveResources() {
        COOKIE_MANAGER.updateResources(this.currentResources)
    }
}