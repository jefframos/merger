import * as PIXI from 'pixi.js';

export default class Game {
    constructor(config, screenManager) {
        //config.width = window.screen.width;
        this.screenManager = screenManager;
        //  width: 414,
        // height: 736,

        const Renderer = (config.webgl) ? PIXI.autoDetectRenderer : PIXI.CanvasRenderer;
        let ratio = config.width / config.height;
        if (ratio > 0.7) {
            config.width = config.height * 0.7
        } else if (ratio < 0.56) {
            config.width = config.height * 0.5
        }

        //config.height = window.screen.height;
        this.ratio = config.width / config.height;
        window.renderer = new PIXI.Application({
        	width:config.width,
        	height:config.height,
        	resolution:Math.min(window.devicePixelRatio, 1.5),
        	antialias:false
        	// config.width || 800, config.height || 600, config.rendererOptions
        });//new Renderer(config.width || 800, config.height || 600, config.rendererOptions);
        document.body.appendChild(window.renderer.view);

        this.stage = new PIXI.Container();
        renderer.stage.addChild(this.stage)
        //this.animationLoop = new PIXI.AnimationLoop(window.renderer);
        //this.animationLoop.on('prerender', this.update.bind(this));
        this.resize();

        this.frameskip = 1;
        this.lastUpdate = Date.now();

        PIXI.ticker.shared.add(this._onTickEvent, this);




    }
    _onTickEvent(deltaTime) {
        this.dt = deltaTime / 60;
        this.update();
    }
    resize() {
        if (window.innerWidth / window.innerHeight >= this.ratio) {
            var w = window.innerHeight * this.ratio;
            var h = window.innerHeight;
        } else {
            var w = window.innerWidth;
            var h = window.innerWidth / this.ratio;
        }
        window.renderer.view.style.width = w + 'px';
        window.renderer.view.style.height = h + 'px';
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