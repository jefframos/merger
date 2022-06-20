import * as PIXI from 'pixi.js';
import Signals from 'signals';
import StandardAttackAction from '../actions/StandardAttackAction';
export default class StandardGambit {
    constructor(entity, requireOpposite = true, data = null) {
        this.requireOpposite = requireOpposite;
        this.entity = entity;
        this.type = 'RANDOM'
        this.secType = 'HP'
        this.resultAction = new StandardAttackAction(this.entity);
        this.data = data;
        return this
    }
    addAction(action) {
        this.resultAction = action;
    }
    sortOutList(heroes, monsters) {
        let opposite = this.requireOpposite
        if (this.entity.isHero) {
            if (opposite) {
                return monsters
            } else {
                return heroes
            }
        } else if (this.entity.isMonster) {
            if (opposite) {
                return heroes
            } else {
                return monsters
            }
        }
    }
    getEntity(heroes, monsters) {
        let list = this.sortOutList(heroes, monsters);
        let copy = [];
        for (var i = list.length - 1; i >= 0; i--) {
            copy.push(list[i])
        }
        utils.shuffle(copy)

        return this.findEntity(copy);
    }
    findEntity(list) {
        for (var i = 0; i < list.length; i++) {
            if (!list[i].killed) {
                list[i];
            }
        }
        return list[0];
    }
    getLowerHP(list) {
        let min = 9999999999999
        let id = 0

        for (var i = 0; i < list.length; i++) {
            if (!this.data.getKilled && list[i].killed) {

            }
            else if (!list[i].killed && list[i].getHpPercent() < min) {
                id = i
                min = list[i].getHpPercent()
            }
        }

        return list[id];
    }

    getHighestHP(list) {
        let max = -9999999999999
        let id = 0

        for (var i = 0; i < list.length; i++) {
            if (!this.data.getKilled && list[i].killed) {

            }
            else if (!list[i].killed && list[i].getHpPercent() > max) {
                id = i
                max = list[i].getHpPercent()
            }
        }

        return list[id];
    }
    getClosets(list){
        let closets = this.sortByDistance(list)
        if(closets.length){
            return closets[closets.length - 1];
        }
        return null
    }
    getFarests(list){
        let farests = this.sortByDistance(list)
        if(farests.length){
            return farests[0]
        }
        return null
    }
    sortByDistance(list){
        let closets = list.sort((a,b) => a.y - b.y)
        if(closets.length){
        //    return closets.sort((a,b) => a.gridPosition.j - b.gridPosition.j);
        }
        return closets
    }    
}