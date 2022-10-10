export default class LocalizationManager {
    constructor(language) {
        this.defaultLanguage = PIXI.loader.resources['localization_EN'].data.labels
    }
    getLabel(id, caps){
        if(this.defaultLanguage[id]){
            return caps?this.defaultLanguage[id].toUpperCase() : this.defaultLanguage[id]
        }else{
            return "_NOT FOUND"
        }
    }
}