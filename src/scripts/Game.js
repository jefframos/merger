import * as PIXI from 'pixi.js';

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
    resize() {
        if (window.innerWidth / window.innerHeight >= this.ratio) {
            var w = window.innerHeight * this.ratio;
        } else {
            var h = window.innerWidth / this.ratio;
        }
        var w = window.innerWidth;
        var h = window.innerHeight;
        window.renderer.view.style.position = 'absolute';
        this.innerResolution = { width: window.innerWidth, height: window.innerHeight };

        const sclX = window.innerWidth < this.desktopResolution.width ? window.innerWidth / this.desktopResolution.width : 10;
        const sclY = window.innerHeight / this.desktopResolution.height// window.innerHeight < this.desktopResolution.height ? window.innerHeight / this.desktopResolution.height : 1;

        const scl = Math.min(sclX, sclY);

        window.renderer.view.style.position = 'absolute';

        const newSize = {
            width: window.innerWidth,//* scl,
            height: this.desktopResolution.height * scl,
        };


        window.renderer.view.style.width = `${newSize.width}px`;
        window.renderer.view.style.height = `${newSize.height}px`;

        if (newSize.height < window.innerHeight) {
            window.renderer.view.style.top = `${window.innerHeight / 2 - (newSize.height) / 2}px`;
        }
        if (newSize.width < window.innerWidth) {
        }
        window.renderer.view.style.left = `${window.innerWidth / 2 - (newSize.width) / 2}px`;

        if (this.screenManager) {
            this.screenManager.resize(newSize);

            this.screenManager.scale.x = (config.width / newSize.width) / (config.height / window.innerHeight)
            this.screenManager.pivot.x = config.width / 2
            let s = (newSize.width / config.width)
            this.screenManager.x = window.innerWidth / 2 / s
        }
        // if (window.innerWidth / window.innerHeight >= this.ratio) {
        //     var w = window.innerHeight * this.ratio;
        //     var h = window.innerHeight;
        // } else {
        //     var w = window.innerWidth;
        //     var h = window.innerWidth / this.ratio;
        // }
        // window.renderer.view.style.width = w + 'px';
        // window.renderer.view.style.height = h + 'px';
    }

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