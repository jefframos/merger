import * as PIXI from 'pixi.js';
import StaticCat from '../ui/StaticCat';
export default class CatAnimation extends StaticCat
{
    constructor()
    {
        super();
    }
    
    update(delta)
    {
        this.bodySin += delta * 15;

        this.rleg.scale.y = 1 + Math.sin(this.bodySin) * 0.15

        this.lleg.scale.y = 1 + Math.cos(this.bodySin) * 0.15

        this.rarm.rotation = this.armsRot + Math.cos(this.bodySin) * 0.1
        this.rarm.scale.x = -1 + Math.sin(this.bodySin) * 0.1
        this.rarm.scale.y = 1 + Math.cos(this.bodySin) * 0.1

        this.larm.rotation = -this.armsRot - Math.sin(this.bodySin) * 0.1
        this.larm.scale.x = 1 + Math.cos(this.bodySin) * 0.1
        this.larm.scale.y = 1 + Math.sin(this.bodySin) * 0.1

        this.body.scale.x = 1 + Math.sin(this.bodySin) * 0.025
        this.body.scale.y = 1 + Math.cos(this.bodySin) * 0.025

        this.head.scale.x = 1 + Math.cos(this.bodySin) * 0.05
        this.head.scale.y = 1 + Math.sin(this.bodySin) * 0.05
            // this.larm.rotation += delta
    }
}