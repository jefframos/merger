import * as PIXI from 'pixi.js';

import ListScroller from '../../ui/uiElements/ListScroller';
import Signals from 'signals';

export default class ShopList extends ListScroller
{
    constructor(rect = {
        w: 500,
        h: 500
    }, itensPerPage = 5)
    {
        super(rect, itensPerPage, true);
        this.onItemShop = new Signals();
        this.onShowInfo = new Signals();
        this.onVideoItemShop = new Signals();
        // this.onShopItem = new Signals();
        this.container = new PIXI.Container();



        this.itens = [];

    }

    addItens(itens)
    {
        for (var i = 0; i < itens.length; i++)
        {
            let tempItem = itens[i];
            this.listContainer.addChild(tempItem)
            tempItem.y = this.itemHeight * this.itens.length - 1;
            if (tempItem.onConfirmShop)
            {
                tempItem.onConfirmShop.add(this.onShopItemCallback.bind(this));
                tempItem.onShowInfo.add(this.onShowInfoCallback.bind(this));
            }
            this.itens.push(tempItem);

        }
        this.lastItemClicked = this.itens[0]
    }
    onShowInfoCallback(itemData, button)
    {
        this.onShowInfo.dispatch(itemData, button);
    }
    onShopItemCallback(itemData, realCost, button, totalUpgrades)
    {
        // let staticData = GAME_DATA[itemData.staticData][itemData.id];
        // if (staticData.shopType == 'video')
        // {
        //     this.onVideoItemShop.dispatch(itemData);
        //     return
        // }
        // GAME_DATA.buyUpgrade(itemData, realCost);

        itemData.upgrade(totalUpgrades)
        this.onItemShop.dispatch(itemData, button, totalUpgrades);
        this.updateItems();
    }
    hide()
    {
        console.log('HIDDDDDDEEEEE');
        for (var i = 0; i < this.itens.length; i++)
        {
            this.itens[i].hide()
        }
    }
    show()
    {
        for (var i = 0; i < this.itens.length; i++)
        {
            this.itens[i].show()
        }
    }
    updateItems()
    {
        for (var i = 0; i < this.itens.length; i++)
        {
            this.itens[i].updateData()
        }
    }
    update(delta)
    {


    }
    updateAllItens()
    {
        for (var i = 0; i < this.catsItemList.length; i++)
        {
            this.catsItemList[i].updateItem(GAME_DATA.catsData[i])
        }
    }

}