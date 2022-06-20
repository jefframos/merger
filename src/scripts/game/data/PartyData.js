import StaticCharData from './StaticCharData'
import CharData from './CharData'
export default class PartyData {
    constructor() {
        this.staticCharData = StaticCharData;
        this.storageID = 'dantes-party'

        let sotrageData = STORAGE.getObject(this.storageID)
        this.forceReset = '1.0.2'

        if (!sotrageData) {
            this.currentParty = [];
            for (var i = 0; i < HEROES_GRID.length; i++) {
                let temp = []
                for (var j = 0; j < HEROES_GRID[i].length; j++) {
                    temp.push(0)
                }
                this.currentParty.push(temp);
            }
            this.SAVE();
        } else {
            this.loadData(sotrageData);
        }



    }

    hasParty() {
        for (var i = 0; i < this.currentParty.length; i++) {
            for (var j = 0; j < this.currentParty[i].length; j++) {
                if (this.currentParty[i][j]) {
                    return true;
                    break;
                }
            }
        }
        return false;
    }
    addNewEntity(itemType, slotId, currentParty = 0) {
        let char = new CharData();
        char.type = itemType;
        char.level = 1;
        char.staticData = this.getCharData(itemType)
        this.currentParty[slotId.i][slotId.j] = char;
        console.log(char);
    }
    removeEntity(slotId, currentParty = 0) {
        this.currentParty[slotId.i][slotId.j] = null;
    }
    getCharData(id = 'thief') {
        return this.staticCharData[id];
    }

    getStaticCharData(id = 'thief') {
        return this.staticCharData[id];
    }

    getStaticCharsList() {
        let names = [];

        for (var name in this.staticCharData) {
            names.push(name);
        }
        return names
    }


    addCharOnParty(i, j, char = 'thief') {

    }
    updatePartyData(slots, id = 0) {

        // for (var i = 0; i < slots.length; i++) {
        //     for (var j = 0; j < slots[i].length; j++) {
        //         let data = slots[i][j].charData
        //         if (data) {
        //             this.currentParty[i][j] = data.primaryKey
        //         } else {
        //             this.currentParty[i][j] = 0;
        //         }
        //     }
        // }

        this.SAVE();
    }

    loadData(data) {
        console.log(this.forceReset);
        if (this.forceReset != data.forceReset) {
            STORAGE.reset();
            location.reload();
        }
        this.currentParty = data.currentParty;
        // this.forceReset = data.forceReset;

        // this.version = data.version;
        // for (var name in data) {
        //     let n = name.indexOf("cat");
        //     if (n >= 0) {
        //         let id = parseInt(name.substring(3))
        //         this.catsData[id] = data[name];
        //     }
        // }

        // this.chestData.lastChestTime = new Date(this.chestData.lastChestTime);

    }
    getObjectData() {
        let obj = {
                currentParty: this.currentParty,
                forceReset: this.forceReset,

            }
            // for (var i = 0; i < this.catsData.length; i++) {
            //     obj['cat' + this.catsData[i].catID] = this.catsData[i];
            // }

        return obj
    }

    SAVE() {
        STORAGE.storeObject('dantes-party', this.getObjectData());
    }

    RESET() {
        STORAGE.reset();
        location.reload();;
    }

    saveParty() {

    }
}