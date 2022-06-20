import utils from '../../utils';
import shopDataStatic from './ShopDataStatic';
import actionDataStatic from './ActionDataStatic';
import catDataStatic from './CatDataStatic';
import shopDataList from './shopDataList';
import catDataList from './CatDataList';
import actionDataList from './actionDataList';
export default class GameData
{
    constructor()
    {

        this.catsData = [];


        this.catDataStatic = catDataStatic;

        this.shopDataStatic = shopDataStatic;

        this.actionsDataStatic = actionDataStatic;

        this.actionsData = actionDataList;

        this.shopData = shopDataList;

        this.trophyData = {
            collected: 0,
            collectedMultiplier: 0,
            maxCollectedMultiplier: 100,
            multplierPerCollected: 0.0125,
            limitToMultiply: 1750,
            icon: 'trophy',
        }

        this.totalCatsAllowed = 1;
        this.catsAllowed = [true, false, false, false];
        this.maxLife = 3;
        this.maxPoints = 0;

        this.gameTokens = {
            quant: 1,
            icon: 'trophy',
        }
        this.chestData = {
            lastChestTime: new Date(),
            timeToNext: -1,
            chestAvailable: false,
            // chestTime: 90 * 1000
            chestTime: 15 * 1000 * 60
        }

        this.moneyData = {
            currentCoins: 0,
            softIcon: 'cat_coin_02',
            videoIcon: 'icon_play_video',
        }

        this.sessionData = {
            tokens: 1,
        }

        this.version = '1.0.0.0';
        this.catsVersion = '1.0.0';
        this.actionsVersion = '1.0.0';
        this.shopVersion = '1.0.0';
        this.forceReset = '1.0.0';

        this.mute = false;

        this.resetCatData();

        this.minimumAmountOfCatsToReset = 3;
    }
    resetShop()
    {
        for (var i = this.actionsData.length - 1; i >= 0; i--)
        {
            this.actionsData[i].level = 1;
        }
        for (var i = this.shopData.length - 1; i >= 0; i--)
        {
            this.shopData[i].level = 0;
        }
        // this.SAVE();
    }
    resetCatData()
    {
        this.catsData = [];
        for (var i = 0; i < catDataList.length; i++)
        {
            let cat = {};
            let catData = catDataList[i];
            for (let type in catData)
            {
                cat[type] = catData[type];
            }
            this.catsData.push(cat)
        }
    }
    getStaticCatData(id)
    {
        for (var i = 0; i < this.catDataStatic.length; i++)
        {
            if (this.catDataStatic[i].catID == id)
            {
                return this.catDataStatic[i];
            }
        }
    }
    canBuyIt(data)
    {
        let currType = this[data.staticData][data.id].shopType
        let staticData = this[data.staticData][data.id]
        let cost = this.getShopValues(data).cost;
        if (currType == 'hard')
        {
            return this.trophyData.collected >= cost;
        }
        else if (currType == 'soft')
        {
            return this.moneyData.currentCoins >= cost;
        }
        else if (currType == 'video')
        {
            return true;
        }
    }
    getUpdatedItem(type, id)
    {
        return this[type][id];
    }
    buyUpgrade(data, realCost)
    {
        let currType = this[data.staticData][data.id].shopType
        if (currType == 'hard')
        {
            this.trophyData.collected -= realCost;
        }
        else if (currType == 'soft')
        {
            this.moneyData.currentCoins -= realCost;
        }
        this.updateCatsAllowed(0);
        this[data.dataType][data.id].level++;

        if (this[data.dataType][data.id].level %= 50)
        {

            FBInstant.logEvent(
                'item_upgrade',
                1,
                {
                    type: this[data.staticData].type,
                    level: this[data.dataType][data.id].level
                },
            );


        }
        this.SAVE();
    }
    getActionStats(data, isStatic = false)
    {
        let shopData = data;
        if (data.staticData)
        {
            for (var i = 0; i < this[data.staticData].length; i++)
            {
                if (this[data.staticData][i].id == data.id)
                {
                    shopData = this[data.staticData][i];
                }
            }
        }
        let level = data.level;
        let stats = shopData.stats;
        let levelPercent = level / shopData.levelMax
        let leveledStats = {};
        let easeCost = 0;
        leveledStats.type = shopData.type;
        for (let type in stats)
        {
            let tempData = stats[type];
            easeCost = tempData.zero;

            levelPercent = level / shopData.levelMax

            if (levelPercent > 0)
            {

                if (tempData.min > tempData.max)
                {
                    // easeCost = tempData.min - easeCost;
                    easeCost = tempData.min - utils[tempData.typeCurve](levelPercent, tempData.max, tempData.min, 1) + tempData.max

                }
                else
                {

                    easeCost = utils[tempData.typeCurve](levelPercent, tempData.min, tempData.max, 1)
                }

            }



            leveledStats[type] = easeCost;
        }
        return leveledStats;
    }
    getShopValues(data)
    {
        let shopData;

        let discountData = GAME_DATA.shopDataStatic.find(function(element)
        {
            return element.type == 'discount';
        });
        let discountShopData = this.shopData[discountData.id];
        let discountStats = this.getActionStats(discountShopData, true);

        for (var i = 0; i < this.shopDataStatic.length; i++)
        {
            if (this[data.staticData][i].id == data.id)
            {
                shopData = this[data.staticData][i];
            }
        }
        let level = data.level;




        // console.log(data, shopData);
        let costData = shopData.stats.cost;
        let levelPercent = level / shopData.levelMax
        let easeCost = costData.min;
        if (levelPercent > 0)
        {
            easeCost = utils[costData.typeCurve](levelPercent, costData.min, costData.max, 1)
        }
        let shopCoast = Math.floor(easeCost / discountStats.value);
        return {
            cost: shopCoast
        }

    }
    getItemValues(data)
    {
        let actionData;
        for (var i = 0; i < this.actionsDataStatic.length; i++)
        {
            if (this.actionsDataStatic[i].id == data.id)
            {
                actionData = this.actionsDataStatic[i];
            }
        }
        let level = data.level;
        let shopCoast = actionData.costMax / actionData.levelMax * level * actionData.cost;
        let actionTime = actionData.timeMax / actionData.levelMax * level * actionData.time;

        // console.log(shopCoast);
        return {
            cost: shopCoast
        }

    }
    applyPrizes(list)
    {
        // console.log('apply list', list);
        let cats = []
        for (var i = 0; i < this.catsData.length; i++)
        {
            cats.push(0);
        }
        for (var i = 0; i < list.length; i++)
        {
            let item = list[i];
            if (item.type == 'cat')
            {
                // console.log('add cat', item.quant);
                // this.catsData[item.id].quant += item.quant
                cats[item.id] += item.quant;
            }
            if (item.type == 'trophy')
            {
                this.updateTrophy(item.quant)
                    // this.trophyData.collected += item.quant;
            }
            if (item.type == 'coins')
            {
                this.addCoins(item.quant)
                    // this.trophyData.collected += item.quant;
            }
        }
        this.addCats(cats)
        this.SAVE();
    }
    isPossibleBuyAuto(id)
    {
        let cat = this.getStaticCatData(this.catsData[id].catID);
        if (cat.autoCollectPrice <= this.trophyData.collected)
        {
            return true
        }
        return false
    }
    getChestPrize(tot = 2)
    {
        let prizesList = [];
        let availableIds = [];
        for (var i = 0; i < this.catsData.length; i++)
        {
            if (this.catsData[i].active)
            {
                availableIds.push(this.catsData[i].catID);
            }
        }

        for (var i = 0; i < tot; i++)
        {
            let rnd1 = Math.random();
            let obj = {
                type: 'cat',
                id: 0,
                quant: 0,
                icon: 0,
            }
            if (rnd1 < 0.33)
            {
                obj.type = 'trophy';
                obj.quant = this.getTrophyAmount();
                obj.icon = this.trophyData.icon
            }
            else if (rnd1 < 0.66)
            {
                obj.type = 'coins';
                obj.quant = this.getCoinAmount();
                obj.icon = this.moneyData.softIcon
            }
            else
            {
                let id = Math.floor(availableIds.length * Math.random())
                let cat = this.getStaticCatData(this.catsData[id].catID)
                obj.id = cat.catID
                obj.icon = cat.catSrc
                obj.quant = Math.ceil(cat.collected * Math.random() * 0.5 + 15 * Math.random() + 10)
            }

            prizesList.push(obj);
        }
        return prizesList
    }
    loadData(data)
    {
        if (!data.chestData || !data.forceReset || data.forceReset != this.forceReset && this.forceReset != '1.0.0')
        {
            STORAGE.reset();
            location.reload();
        }
        this.trophyData = data.trophy;
        this.chestData = data.chestData;
        this.maxPoints = data.highscore;
        this.moneyData = data.money;
        this.actionsData = data.actionsData;
        this.shopData = data.shopData;
        this.mute = data.mute;
        this.catsVersion = data.catsVersion;
        this.actionsVersion = data.actionsVersion;
        this.shopVersion = data.shopVersion;
        this.forceReset = data.forceReset;
        // this.version = data.version;
        for (var name in data)
        {
            let n = name.indexOf("cat");
            if (n >= 0)
            {
                let id = parseInt(name.substring(3))
                this.catsData[id] = data[name];
            }
        }

        this.chestData.lastChestTime = new Date(this.chestData.lastChestTime);

    }
    getObjectData()
    {
        let obj = {
            trophy: this.trophyData,
            chestData: this.chestData,
            highscore: this.maxPoints,
            money: this.moneyData,
            version: this.version,
            shopData: this.shopData,
            actionsData: this.actionsData,
            mute: this.mute,
            catsVersion: this.catsVersion,
            actionsVersion: this.actionsVersion,
            shopVersion: this.shopVersion,
            forceReset: this.forceReset,
        }
        for (var i = 0; i < this.catsData.length; i++)
        {
            obj['cat' + this.catsData[i].catID] = this.catsData[i];
        }

        return obj
    }
    getNumberTrophyToSend()
    {
        let trophys = 0;
        let catsAcc = 0;
        let catsPercentageAcc = 0;
        for (var i = 0; i < this.catsData.length; i++)
        {
            catsAcc += this.catsData[i].collected;
            catsPercentageAcc += this.catsData[i].collectedMultiplier;
        }

        trophys = catsAcc * (this.trophyData.multplierPerCollected * this.trophyData.collected * 0.05) + Math.ceil(catsAcc * 0.2) // + Math.ceil(catsAcc * 0.1) * catsPercentageAcc//Math.ceil(catsAcc * 0.15) + 2
        return Math.ceil(trophys);
    }
    sendCatsToEarth()
    {
        FBInstant.logEvent(
            'reset_cats',
            1,
            {
                trophys: this.trophyData.collected,
                coins: this.moneyData.currentCoins,
                total_cats: this.countActiveCats()
            },
        );
        this.updateTrophy(this.getNumberTrophyToSend());
        this.resetCatData();
        this.moneyData.currentCoins = 0;
        this.resetShop();



        this.SAVE();
    }
    getCoinAmount()
    {
        let tempCoins = Math.floor(this.moneyData.currentCoins * (Math.random() * 0.1 + 0.1))
        if (tempCoins <= 0)
        {
            tempCoins += 100 // MAX_NUMBER
        }
        return tempCoins;
    }
    getTrophyAmount()
    {
        let tempTrophy = Math.floor(this.trophyData.collected * (Math.random() * 0.05 + 0.05))
        if (tempTrophy <= 0)
        {
            tempTrophy = 1 // MAX_NUMBER
        }
        return tempTrophy;
    }
    updateTrophy(collected)
    {
        this.trophyData.collected += collected
        let mult = this.trophyData.collected * this.trophyData.multplierPerCollected // this.trophyData.maxCollectedMultiplier * this.trophyData.maxCollectedMultiplier;
        this.trophyData.collectedMultiplier = mult //* 0.01;

        //console.log(this.trophyData);
        this.SAVE();
    }
    addCoins(points)
    {
        this.moneyData.currentCoins += points;
        this.SAVE();
    }
    countActiveCats()
    {
        let cats = 0
        for (var i = 0; i < this.catsData.length; i++)
        {
            if (this.catsData[i].active)
            {
                cats++
            }
        }
        return cats;
    }
    updateCatsAllowed(points)
    {
        this.addCoins(points);
        if (points > this.maxPoints)
        {
            this.maxPoints = points;
            FBInstant.logEvent(
                'max_points',
                1,
                {
                    points: this.maxPoints,
                },
            );
        }
        this.totalCatsAllowed = 1;
        let temp = [true]
        let hasNew = false;
        for (var i = 1; i < this.catDataStatic.length; i++)
        {
            let require = this.catDataStatic[i].cost;
            // let prevCat = this.catsData[require.catID]
            // console.log('this car require ', require.quant, points);
            if (require <= this.moneyData.currentCoins) //prevCat.collected)
            {
                this.catsData[i].canBeActive = true;
                // if (!this.catsAllowed[i]) {
                //     hasNew = i;
                // }
                temp.push(true);
                this.totalCatsAllowed++;
            }
            else
            {
                this.catsData[i].canBeActive = false;
                temp.push(false);
            }
        }
        this.catsAllowed = temp;
        this.SAVE();
        return hasNew;
    }
    activeCat(data)
    {
        this.catsData[data.catID].active = true;
        this.SAVE();
    }
    startNewRound()
    {
        this.allowedList = [];
        this.totalCatsAllowed = 0;
        for (var i = 0; i < this.catsData.length; i++)
        {
            if (this.catsData[i].active)
            {
                this.totalCatsAllowed++
                    this.allowedList.push(this.catsData[i].catID)
            }
        }
        this.sessionData.tokens = this.gameTokens.quant;
        // console.log('cats', this.totalCatsAllowed);
    }
    enableAutoCollect(id)
    {
        let data = this.catsData[id];
        let staticData = this.getStaticCatData(data.catID);

        FBInstant.logEvent(
            'auto_collect',
            1,
            {
                catID: data.catID,
                catName: staticData.catName,
            },
        );
        // console.log(data);
        if (this.trophyData.collected < staticData.autoCollectPrice)
        {
            console.log('something wrong');
            return
        }
        this.updateTrophy(-staticData.autoCollectPrice)
            // this.trophyData.collected -= data.autoCollectPrice
        this.catsData[id].isAuto = true;
        this.SAVE();
    }
    addCats(list)
    {
        for (var i = 0; i < list.length; i++)
        {
            this.catsData[i].collected += list[i];
            let staticData = this.getStaticCatData(this.catsData[i].catID);

            let mult = this.catsData[i].collected / staticData.limitCatsToMultiply * staticData.maxCollectedMultiplier;
            this.catsData[i].collectedMultiplier = mult;
            // console.log(mult);

        }
        this.SAVE();
    }
    getAllowedCatsData()
    {
        return this.catsData[this.allowedList[Math.floor(Math.random() * this.allowedList.length)]]
    }
    SAVE()
    {
        STORAGE.storeObject('space-cats-game-data', this.getObjectData());
    }
}