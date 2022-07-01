import Signals from 'signals';
export default class GameModifyers {
    constructor() {
        this.modifyersData = COOKIE_MANAGER.getModifyers();   
        this.onUpdateModifyers = new Signals();
    }
    addResources(res) {
       
    }
    hasEnoughtResources(cost) {
    }

    saveModifyers(type, level, value) {
        this.modifyersData[type] = level;
        this.modifyersData[type+'Value'] = value;
        this.onUpdateModifyers.dispatch();
        COOKIE_MANAGER.updateModifyers(this.modifyersData)
    }
    getLevel(data){
        return this.modifyersData[data.rawData.modifyer] || 1
    }
}