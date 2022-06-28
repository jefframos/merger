import * as PIXI from 'pixi.js';
import Signals from 'signals';
import utils from '../../../../utils';
import UIList from '../../uiElements/UIList';
import UIBar from '../../uiElements/UIBar';
import ShopButton from './ShopButton';
import config from '../../../../config';
export default class ShopItem extends UIList {
    constructor(rect = {
        w: 500,
        h: 80
    }) {
        super();
console.log(rect)
        this.w = rect.w;
        this.h = rect.h;
        // this.container = new PIXI.Container();
        // this.addChild(this.container);
        this.elementsList = [];
        this.rect = rect;


        this.itemIcon = new PIXI.Sprite.from('starship_31');
        // this.itemIcon.scaleContent = true;
        this.itemIcon.listScl = 0.15;
        // this.itemIcon.fitHeight = 0.7;
        this.itemIcon.scaleContentMax = true;
        this.itemIcon.fitWidth = 0.75;
        // this.itemIcon.scaleContent = false;
        this.elementsList.push(this.itemIcon);
        this.container.addChild(this.itemIcon);

        this.levelContainer = new PIXI.Container();


        this.levelLabel = new PIXI.Text('LV1\n9999',
            {
                fontFamily: 'blogger_sansregular',
                fontSize: '18px',
                fill: 0xFFFFFF,
                align: 'center',
                fontWeight: '800'
            });
        this.levelContainer.addChild(this.levelLabel);


        this.levelBar = new UIBar();
        this.levelContainer.addChild(this.levelBar);

        this.levelBar.updatePowerBar(0.5)
        this.levelContainer.scaleContentMax = true;
        this.levelContainer.listScl = 0.15;
        this.elementsList.push(this.levelContainer);
        this.container.addChild(this.levelContainer);

        this.levelBar.y = this.levelLabel.y + this.levelLabel.height;
        this.levelBar.scale.set(0.2)

        this.descriptionContainer = new PIXI.Container();

        this.descriptionLabel = new PIXI.Text('this is a description of the item',
            {
                fontFamily: 'blogger_sansregular',
                fontSize: '18px',
                fill: 0xFFFFFF,
                align: 'right',
                fontWeight: '800'
            });

        this.descriptionContainer.scaleContentMax = true;
        this.descriptionContainer.listScl = 0.45;
        // this.descriptionContainer.align = 0.5;
        this.descriptionContainer.addChild(this.descriptionLabel)

        this.elementsList.push(this.descriptionContainer);
        this.container.addChild(this.descriptionContainer);

        this.shopButton = new ShopButton();
        this.shopButton.onClickItem.add(this.onShopItem.bind(this));

        // this.totalLabel2.fitHeight = 0.7;
        this.shopButton.scaleContentMax = true;
        this.shopButton.listScl = 0.2;
        this.shopButton.align = 1;
        this.elementsList.push(this.shopButton);
        this.container.addChild(this.shopButton);

        this.onConfirmShop = new Signals();
        this.onShowInfo = new Signals();
        this.icons = {
            value: 'icon_increase',
            cooldown: 'icon_duration_orange',
            activeTime: 'icon_duration_blue',
        }

        this.infoButton = new PIXI.Sprite.from('info');
        // this.itemIcon.scaleContent = true;
        this.infoButton.listScl = 0.1;
        this.infoButton.align = 0.5;
        this.infoButton.fitWidth = 0.75;
        // this.infoButton.scaleContentMax = true;
        this.elementsList.push(this.infoButton);
        this.container.addChild(this.infoButton);
        this.infoButton.interactive = true;
        this.infoButton.buttonMode = true;
        this.infoButton.on('mousedown', this.onInfoCallback.bind(this)).on('touchstart', this.onInfoCallback.bind(this));

        // this.itemIcon.scaleContent = false;
        this.currentColor = 0;
        this.realCost = 0
        window.GAME_DATA = {
            getShopValues() {
                return 200
            },
            getActionStats() {
                return 200
            },
            canBuyIt() {
                return true
            }
        }

    }
    onInfoCallback() {
        this.onShowInfo.dispatch(this.itemData, this.infoButton);
    }
    onShopItem(itemData) {

        if(window.gameEconomy.hasEnoughtResources(this.realCost)){

            window.gameEconomy.useResources(this.realCost)
            this.onConfirmShop.dispatch(this.itemData, this.realCost, this.shopButton);

            this.updateData();
        }

    }
    updateValues() {
        let currentLevel = 1;
        let levelPercent = currentLevel / this.staticData.levelMax;
        let shopItemValues = GAME_DATA.getShopValues(this.itemData);
        let leveldValues = GAME_DATA.getActionStats(this.itemData);
        this.realCost = shopItemValues.cost;
        let cost = utils.formatPointsLabel(shopItemValues.cost / MAX_NUMBER);
        // let levelPercent = this.staticData.levelMax / ((this.staticData.levelMax + 1)  - currentLevel);
        this.shopButton.updateCoast(cost)


        if (!GAME_DATA.canBuyIt(this.itemData)) {
            this.shopButton.deactive();
        }
        else {
            this.shopButton.enable();
        }
        this.itemIcon.texture = PIXI.Texture.from(this.staticData.icon)

        this.levelLabel.text = 'Level ' + this.itemData.level

        if (this.itemData.level <= 0) {
            this.attributesList.visible = false;
            this.levelContainer.visible = false;
        }
        else {
            this.attributesList.visible = true;
            this.levelContainer.visible = true;
        }

        if (this.staticData.shopType == 'video') {
            this.attributesList.visible = true;
            this.levelContainer.visible = true;
            this.isVideo = true;
        }
        if (this.attributesList) {
            for (let type in leveldValues) {
                if (this.staticData.stats[type]) {
                    if (!this.staticData.stats[type].hideOnShop) {
                        if (leveldValues[type]) {
                            if (leveldValues[type] < 100) {
                                this.attributesList[type].text = leveldValues[type].toFixed(2)
                            }
                            else {
                                this.attributesList[type].text = utils.formatPointsLabel(leveldValues[type] / MAX_NUMBER);
                            }
                        }
                    }
                }
            }

            // this.descriptionLabel.pivot.x = this.descriptionLabel.width / 2
            // this.totalLabel.text = 'cooldown ' + leveldValues.cooldown+ '\nactive time' + leveldValues.activeTime + '\nvalue' + leveldValues.value;
        }
        this.updateHorizontalList();
        this.descriptionContainer.y = 0;
        this.descriptionLabel.text = this.staticData.shopDesc.toUpperCase()
        // this.descriptionLabel.x = this.attributesList.x + this.attributesList.width / 2

    }
    changeBgColor() {
        this.currentColor++;
        this.currentColor %= COLORS.length - 1;
        let time = 0.5;
        this.currentColorTween = utils.addColorTween(this.backGraphic, this.backGraphic.tint, COLORS[this.currentColor], time).tween;
        this.specialTimeout = setTimeout(() => {
            this.changeBgColor();
        }, time * 1000);
    }

    hide() {
        if (this.isVideo) {
            TweenLite.killTweensOf(this.currentColorTween);
            clearTimeout(this.specialTimeout);
            this.backGraphic.tint = 0xFF00FF;
        }
    }
    show() {
        if (this.isVideo) {
            this.changeBgColor()
        }
    }

    updateData() {
        let next = 1
        //this.attributesList['cost'].text = utils.formatPointsLabel(this.itemData.getRPS())+'/s'
this.realCost = this.itemData.getUpgradeCost(next);
        this.attributesList['cost'].text = utils.formatPointsLabel(this.itemData.getRPS()) + '/s'
        this.attributesList['value'].text = utils.formatPointsLabel(this.itemData.getRPS(next)) + '/s'

        this.shopButton.updateCoast(utils.formatPointsLabel(this.itemData.getUpgradeCost(next)))

        this.levelLabel.text = 'Level\n' + this.itemData.currentLevel
        // this.itemData = GAME_DATA.getUpdatedItem(this.itemData.dataType, this.itemData.id)
        if (this.itemData.currentLevel >= this.itemData.rawData.levelMax) {
            this.levelLabel.text = 'Level ' + this.itemData.rawData.levelMax;
            this.levelBar.updatePowerBar(1)
            this.shopButton.deactiveMax()
        }
        else {
            //this.updateValues();
            this.levelBar.updatePowerBar(Math.max(0.05, this.itemData.currentLevel / this.itemData.rawData.levelMax))
        }
        this.updateHorizontalList();
    }
    setData(itemData) {
        this.itemData = itemData;
        console.log(this.itemData)
        this.itemIcon.texture = new PIXI.Texture.from(this.itemData.rawData.imageSrc);

        let types = ['cost', 'value']
        if (!this.attributesList) {
            this.attributesList = new UIList();
            this.attributesList.w = this.descriptionContainer.listScl * this.w * 0.85;
            this.attributesList.h = this.h

            this.descriptionContainer.addChild(this.attributesList);


            types.forEach(element => {
                let attContainer = new PIXI.Container();

                let attIcon = new PIXI.Sprite.from('icon-close');
                attIcon.scale.set(this.attributesList.w / attIcon.width * 0.1)
                let attValue = new PIXI.Text(element,
                    {
                        fontFamily: 'blogger_sansregular',
                        fontSize: '18px',
                        fill: 0xFF0055,
                        align: 'right',
                        fontWeight: '800'
                    });

                attContainer.addChild(attIcon);
                attContainer.addChild(attValue);

                attValue.scale.set(this.attributesList.h / attValue.height * 0.2)
                attValue.x = attIcon.x + attIcon.width + 5;
                attValue.y = attIcon.y + attIcon.height / 2 - attValue.height / 2;

                attContainer.align = 0

                this.attributesList.elementsList.push(attContainer);
                this.attributesList.container.addChild(attContainer);

                this.attributesList[element] = attValue;


            });


            this.attributesList.updateHorizontalList();
            this.descriptionContainer.y = 0;
        }
        this.updateHorizontalList();

        this.updateData();

    }
}