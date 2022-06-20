import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import utils from '../../../utils';
import UIList from '../uiElements/UIList';
import UIBar from '../uiElements/UIBar';
import ShopButton from './ShopButton';
export default class ShopItem extends UIList
{
    constructor(rect = {
        w: 400,
        h: 80
    })
    {
        super();

        this.w = rect.w;
        this.h = rect.h;
        // this.container = new PIXI.Container();
        // this.addChild(this.container);
        this.elementsList = [];
        this.rect = rect;



        this.itemIcon = new PIXI.Sprite.from('results_arrow');
        // this.itemIcon.scaleContent = true;
        this.itemIcon.listScl = 0.15;
        // this.itemIcon.fitHeight = 0.7;
        this.itemIcon.scaleContentMax = true;
        this.itemIcon.fitWidth = 0.75;
        // this.itemIcon.scaleContent = false;
        this.elementsList.push(this.itemIcon);
        this.container.addChild(this.itemIcon);

        this.levelContainer = new PIXI.Container();


        this.levelLabel = new PIXI.Text('LV1\nlalala',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '18px',
            fill: 0xFFFFFF,
            align: 'right',
            fontWeight: '800'
        });
        this.levelContainer.addChild(this.levelLabel);


        this.levelBar = new UIBar();
        this.levelContainer.addChild(this.levelBar);
        // this.levelLabel.fitHeight = 0.7;
        this.levelContainer.scaleContentMax = true;
        this.levelContainer.listScl = 0.1;
        // this.levelLabel.scaleContent = false;
        this.elementsList.push(this.levelContainer);
        this.container.addChild(this.levelContainer);

        this.levelBar.y = this.levelLabel.y + this.levelLabel.height / 2;
        this.levelBar.scale.set(config.width / this.levelBar.width * 0.1)

        this.descriptionContainer = new PIXI.Container();

        this.descriptionLabel = new PIXI.Text('',
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

    }
    onInfoCallback()
    {
        this.onShowInfo.dispatch(this.itemData, this.infoButton);
    }
    onShopItem(itemData)
    {
        this.onConfirmShop.dispatch(this.itemData, this.realCost, this.shopButton);
    }
    updateValues()
    {
        let currentLevel = this.itemData.level;
        let levelPercent = currentLevel / this.staticData.levelMax;
        let shopItemValues = GAME_DATA.getShopValues(this.itemData);
        let leveldValues = GAME_DATA.getActionStats(this.itemData);
        this.realCost = shopItemValues.cost;
        let cost = utils.formatPointsLabel(shopItemValues.cost / MAX_NUMBER);
        // let levelPercent = this.staticData.levelMax / ((this.staticData.levelMax + 1)  - currentLevel);
        this.shopButton.updateCoast(cost)


        if (!GAME_DATA.canBuyIt(this.itemData))
        {
            this.shopButton.deactive();
        }
        else
        {
            this.shopButton.enable();
        }
        this.itemIcon.texture = PIXI.Texture.from(this.staticData.icon)

        this.levelLabel.text = 'Level ' + this.itemData.level

        if (this.itemData.level <= 0)
        {
            this.attributesList.visible = false;
            this.levelContainer.visible = false;
        }
        else
        {
            this.attributesList.visible = true;
            this.levelContainer.visible = true;
        }

        if (this.staticData.shopType == 'video')
        {
            this.attributesList.visible = true;
            this.levelContainer.visible = true;
            this.isVideo = true;
        }
        if (this.attributesList)
        {
            for (let type in leveldValues)
            {
                if (this.staticData.stats[type])
                {
                    if (!this.staticData.stats[type].hideOnShop)
                    {
                        if (leveldValues[type])
                        {
                            if (leveldValues[type] < 100)
                            {
                                this.attributesList[type].text = leveldValues[type].toFixed(2)
                            }
                            else
                            {
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
    changeBgColor()
    {
        this.currentColor++;
        this.currentColor %= COLORS.length - 1;
        let time = 0.5;
        this.currentColorTween = utils.addColorTween(this.backGraphic, this.backGraphic.tint, COLORS[this.currentColor], time).tween;
        this.specialTimeout = setTimeout(() =>
        {
            this.changeBgColor();
        }, time * 1000);
    }

    hide()
    {
        if (this.isVideo)
        {
            TweenLite.killTweensOf(this.currentColorTween);
            clearTimeout(this.specialTimeout);
            this.backGraphic.tint = 0xFF00FF;
        }
    }
    show()
    {
        if (this.isVideo)
        {
            this.changeBgColor()
        }
    }

    updateData()
    {
        this.itemData = GAME_DATA.getUpdatedItem(this.itemData.dataType, this.itemData.id)
        if (this.itemData.level >= this.staticData.levelMax)
        {
            this.levelLabel.text = 'Level ' + this.staticData.levelMax;
            this.levelBar.updatePowerBar(1)
            this.shopButton.deactiveMax()
        }
        else
        {
            this.updateValues();
            this.levelBar.updatePowerBar(this.itemData.level / this.staticData.levelMax)
        }
    }
    setData(itemData, type)
    {
        this.itemData = itemData;
        this.dataType = type;
        this.staticData = GAME_DATA[type][this.itemData.id]
        this.shopButton.setType(this.staticData.shopType)


        if (!this.attributesList)
        {
            this.attributesList = new UIList();
            this.attributesList.w = this.descriptionContainer.listScl * this.w * 0.75;
            this.attributesList.h = this.h

            this.descriptionContainer.addChild(this.attributesList);
            if (this.staticData.shopType == 'video')
            {

                while (this.levelContainer.children.length)
                {
                    this.levelContainer.removeChildAt(0)
                }

                if (!this.backGraphic)
                {
                    this.backGraphic = new PIXI.Graphics().beginFill(0xFF00FF).drawRect(-200, 0, this.w + 400, this.h)
                    this.container.addChildAt(this.backGraphic, 0)
                    this.backGraphic.alpha = 0.5;
                }

                // let attIcon = new PIXI.Sprite.from('results_newcat_star');
                // attIcon.anchor.set(0.5)

                // // this.attributesList.elementsList.push(attIcon);
                // this.levelContainer.addChild(attIcon);

                let attValue = new PIXI.Text(this.staticData.videoDesc.toUpperCase(),
                {
                    fontFamily: 'blogger_sansregular',
                    fontSize: '16px',
                    fill: 0xFFFFFF,
                    align: 'center',
                    fontWeight: '800'
                });

                let attContainer = new PIXI.Container();
                attContainer.addChild(attValue);

                attValue.scale.set(this.attributesList.h / attValue.height * 0.2)
                    // attValue.x = attValue.width / 2;
                attValue.y = attValue.height / 2 - attValue.height / 2;

                attContainer.fitWidth = 0.95
                attContainer.align = 0

                this.attributesList.elementsList.push(attContainer);
                this.attributesList.container.addChild(attContainer);
                // this.attributesList[type] = attValue;
            }
            else
            {
                let leveldValues = GAME_DATA.getActionStats(this.itemData);
                for (let type in leveldValues)
                {

                    if (this.staticData.stats[type])
                    {
                        if (!this.staticData.stats[type].hideOnShop)
                        {

                            let attContainer = new PIXI.Container();

                            let attIcon = new PIXI.Sprite.from(this.icons[type]);
                            attIcon.scale.set(this.attributesList.w / attIcon.width * 0.1)
                            let attValue = new PIXI.Text('000',
                            {
                                fontFamily: 'blogger_sansregular',
                                fontSize: '18px',
                                fill: 0xFFFFFF,
                                align: 'right',
                                fontWeight: '800'
                            });

                            attContainer.addChild(attIcon);
                            attContainer.addChild(attValue);

                            attValue.scale.set(this.attributesList.h / attValue.height * 0.2)
                            attValue.x = attIcon.x + attIcon.width + 5;
                            attValue.y = attIcon.y + attIcon.height / 2 - attValue.height / 2;

                            attContainer.align = 0
                                // attContainer.fitHeight = 0
                            this.attributesList.elementsList.push(attContainer);
                            this.attributesList.container.addChild(attContainer);
                            this.attributesList[type] = attValue;
                        }
                    }
                }

            }

            this.attributesList.updateHorizontalList();

            // console.log(this.h, this.attributesList.elementsList, this.descriptionContainer);
            this.descriptionContainer.y = 0;
        }
        this.updateValues();

    }
}