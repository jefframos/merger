import * as PIXI from 'pixi.js';
import utils from './utils';

export default class Game {
    constructor(config, screenManager) {
        this.screenManager = screenManager;

        const Renderer = (config.webgl) ? PIXI.autoDetectRenderer : PIXI.CanvasRenderer;

        this.desktopResolution = {
            width: config.width,
            height: config.height,
        };


        this.ratio = config.width / config.height;
        window.renderer = new PIXI.Application({
            width: config.width,
            height: config.height,
            resolution: Math.max(window.devicePixelRatio, 2),
            antialias: false
        });
        document.body.appendChild(window.renderer.view);

        this.stage = new PIXI.Container();
        window.renderer.stage.addChild(this.stage)

        this.resize();

        this.frameskip = 1;
        this.lastUpdate = Date.now();

        PIXI.ticker.shared.add(this._onTickEvent, this);


        setTimeout(() => {
            this.resize()
        }, 10);


    }
    _onTickEvent(deltaTime) {
        this.dt = deltaTime / 60;
        this.update();
    }
    // resize2() {
    //     if (window.innerWidth / window.innerHeight >= this.ratio) {
    //         var w = window.innerHeight * this.ratio;
    //     } else {
    //         var h = window.innerWidth / this.ratio;
    //     }
    //     var w = window.innerWidth;
    //     var h = window.innerHeight;
    //     window.renderer.view.style.position = 'absolute';
    //     this.innerResolution = { width: window.innerWidth, height: window.innerHeight };

    //     const sclX = window.innerWidth < this.desktopResolution.width ? window.innerWidth / this.desktopResolution.width : 10;
    //     const sclY = window.innerHeight / this.desktopResolution.height// window.innerHeight < this.desktopResolution.height ? window.innerHeight / this.desktopResolution.height : 1;

    //     const scl = Math.min(sclX, sclY);

    //     window.renderer.view.style.position = 'absolute';

    //     const newSize = {
    //         width: window.innerWidth,//* scl,
    //         height: window.innerHeight//this.desktopResolution.height * scl,
    //     };


    //     window.renderer.view.style.width = `${newSize.width}px`;
    //     window.renderer.view.style.height = `${newSize.height}px`;

    //     if (newSize.height < window.innerHeight) {
    //         window.renderer.view.style.top = `${window.innerHeight / 2 - (newSize.height) / 2}px`;
    //     }
    //     if (newSize.width < window.innerWidth) {
    //     }
    //     window.renderer.view.style.left = `${window.innerWidth / 2 - (newSize.width) / 2}px`;

    //     if (this.screenManager) {
    //         this.screenManager.resize(newSize);

    //         this.screenManager.scale.x = (config.width / newSize.width) / (config.height / window.innerHeight)
    //         this.screenManager.pivot.x = config.width / 2
    //         let s = (newSize.width / config.width)
    //         //this.screenManager.x = window.innerWidth / 2 / s
    //     }
    //     // if (window.innerWidth / window.innerHeight >= this.ratio) {
    //     //     var w = window.innerHeight * this.ratio;
    //     //     var h = window.innerHeight;
    //     // } else {
    //     //     var w = window.innerWidth;
    //     //     var h = window.innerWidth / this.ratio;
    //     // }
    //     // window.renderer.view.style.width = w + 'px';
    //     // window.renderer.view.style.height = h + 'px';
    // }


    resize() {
        var w = window.innerHeight
        var h = window.innerWidth;
        if (window.innerWidth / window.innerHeight >= this.ratio) {
            var w = window.innerHeight * this.ratio;
        } else {
            var h = window.innerWidth / this.ratio;
        }

        const width = window.innerWidth || document.documentElement.clientWidth ||
            document.body.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight ||
            document.body.clientHeight;

        var w = width;
        var h = height;
        //this.resolution = { width: window.outerWidth, height: window.outerHeight };
        this.resolution = { width: window.outerWidth, height: window.outerHeight };
        this.innerResolution = { width: w, height: h };

        window.renderer.view.style.position = 'absolute';

        window.renderer.view.style.width = `${this.innerResolution.width}px`;
        window.renderer.view.style.height = `${this.innerResolution.height}px`;




        let sclX = this.innerResolution.width / config.width
        let sclY = this.innerResolution.height / config.height


        let scl = Math.min(sclX, sclY)
        const newSize = {
            width: this.desktopResolution.width * scl,
            height: this.desktopResolution.height * scl,
        };

        window.renderer.view.style.width = `${this.innerResolution.width}px`;
        window.renderer.view.style.height = `${this.innerResolution.height}px`;

  
        window.renderer.view.style.left = '0px'//`${this.innerResolution.width / 2 - (newSize.width) / 2}px`;
        window.renderer.view.style.top = '0px'//`${this.innerResolution.height / 2 - (newSize.height) / 2}px`;
        // window.renderer.view.style.width = `${this.innerResolution.width}px`;
        // window.renderer.view.style.height = `${this.innerResolution.height}px`;
        //window.renderer.view.style.left = `${window.innerWidth / 2 - (this.innerResolution.width) / 2}px`;


        // let sclX = this.innerResolution.width /this.desktopResolution.width //* this.ratio
        // let sclY =  this.innerResolution.height /this.desktopResolution.height //* this.ratio


        // console.log(sclX, sclY)

        // utils.resizeToFitAR
        // let scaleMin = 1//Math.min(sclX, sclY) * this.ratio;
        // if(sclX < sclY){
        //     scaleMin = sclX* this.ratio
        // }else{

        //     scaleMin = sclY* this.ratio
        // }


        //element.scale.set(min)

        if (this.screenManager) {
            //  let sclX = (this.innerResolution.width)/(this.desktopResolution.width) ;
            //  let sclY = (this.innerResolution.height)/(this.desktopResolution.height) ;
            //  let min = Math.min(sclX, sclY);
            // this.screenManager.scale.set(min)
            let newScaleX = newSize.width/this.innerResolution.width
            this.screenManager.scale.x = newScaleX//this.ratio
            let newScaleY = newSize.height/this.innerResolution.height
            this.screenManager.scale.y = newScaleY//this.ratio

//console.log(newScaleX)
            // 	// this.screenManager.pivot.x = this.innerResolution.width / 2 // this.screenManager.scale.x
            this.screenManager.x = this.desktopResolution.width / 2- (this.desktopResolution.width / 2 *newScaleX)///- (this.innerResolution.width / 2 *newScaleX) // this.screenManager.scale.y
            this.screenManager.pivot.y = this.innerResolution.height / 2 - (this.innerResolution.height / 2 /newScaleY) // this.screenManager.scale.y

            // 	this.screenManager.x = 0//window.innerWidth/2 * sclX - this.desktopResolution.width/2* sclX//this.innerResolution.width / 2 // this.screenManager.scale.x
            // 	this.screenManager.y = 0// window.innerHeight/2 * sclY - this.desktopResolution.height/2* sclY // this.screenManager.scale.y

            // 	//console.log(window.appScale)

            // 	this.screenManager.resize(this.resolution, this.innerResolution);
        }
    }


    /**
     * 
     *  let sclX = this.innerResolution.width / config.width
        let sclY = this.innerResolution.height / config.height


        let scl = Math.min(sclX, sclY)
        const newSize = {
            width: this.desktopResolution.width * scl,
            height: this.desktopResolution.height * scl,
        };

        window.renderer.view.style.width = `${newSize.width}px`;
        window.renderer.view.style.height = `${newSize.height}px`;

  
        window.renderer.view.style.left = `${this.innerResolution.width / 2 - (newSize.width) / 2}px`;
        window.renderer.view.style.top = `${this.innerResolution.height / 2 - (newSize.height) / 2}px`;
     * 
     * 
     * 
     */
    update() {
        this.screenManager.update(this.dt)
        window.renderer.render(this.stage);
    }

    start() {
        //	this.animationLoop.start();
    }

    stop() {
        //	this.animationLoop.stop();
    }
}