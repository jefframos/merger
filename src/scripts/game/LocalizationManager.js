export default class LocalizationManager {
    constructor() {
        this.defaultLanguage = PIXI.loader.resources['localization_EN'].data.labels
        this.currentLanguage = PIXI.loader.resources['localization_EN'].data.labels


        let lang = navigator.language
        if (lang) {
            let lang2 = lang[0] + lang[1]
            lang2 = lang2.toUpperCase();
            if (PIXI.loader.resources['localization_' + lang2]) {
                let newLang = PIXI.loader.resources['localization_' + lang2];
                if (newLang.data && newLang.data.labels) {
                    this.currentLanguage = newLang.data.labels;
                    console.log(this.currentLanguage)
                }
            }

        }
    }
    getLabel(id, caps) {
        if (this.currentLanguage[id]) {
            return caps ? this.currentLanguage[id].toUpperCase() : this.currentLanguage[id]
        } else {
            return "_NOT FOUND"
        }
    }
}