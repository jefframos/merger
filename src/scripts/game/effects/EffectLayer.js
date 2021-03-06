import * as PIXI from 'pixi.js';
import config from '../../config';
import TweenLite from 'gsap';
import * as FILTERS from 'pixi-filters';

export default class EffectLayer extends PIXI.Container {
    constructor(container) {
        super();

        this.container = container;

        this.blackShape = new PIXI.Graphics();
        this.blackShape.beginFill(0);
        this.blackShape.drawRect(0, 0, config.width, config.height);
        this.blackShape.alpha = 0;
        // this.addChild(this.blackShape);

        this.grey = new PIXI.Graphics();
        this.grey.beginFill(0X555555);
        this.grey.drawRect(0, 0, config.width, config.height);
        this.grey.alpha = 0;
        // this.addChild(this.grey);

        // this.tvLines = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('./assets/images/tvlines.png', config.width, config.height))
        // // this.addChild(this.tvLines)
        // this.tvLines.width = config.width;
        // this.tvLines.height = config.height;
        // this.tvLines.blendMode = PIXI.BLEND_MODES.ADD;


        // this.tvShape = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/frontTVsoft.png'))
        // this.addChild(this.tvShape)
        // this.tvShape.width = config.width;
        // this.tvShape.height = config.height;

        // this.tvShape.blendMode = PIXI.BLEND_MODES.OVERLAY;


        //RGB SPLITTER
        this.rgpSplit = new FILTERS.RGBSplitFilter();
        this.rgpSplit.red = new PIXI.Point(1.5, 1.5);
        this.rgpSplit.green = new PIXI.Point(-1.5, -1.5);
        this.rgpSplit.blue = new PIXI.Point(1.5, -1.5);


        //crosshatch
        this.crossHatch = new FILTERS.CrossHatchFilter();

        //blur
        this.blur = new PIXI.filters.BlurFilter();

        //gray
        // this.gray = new FILTERS.GrayFilter();

        //invert
        this.invertFilter = new PIXI.filters.ColorMatrixFilter();

        //ascii
        this.ascii = new FILTERS.AsciiFilter();


        //GLITCH 1
        // this.glitch1 = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('./assets/images/glitch1.jpg', config.width, config.height))
        // this.addChild(this.glitch1)
        // this.glitch1.width = config.width;
        // this.glitch1.height = config.width;
        // this.displacementFilterGlitch1 = new PIXI.filters.DisplacementFilter(this.glitch1);

        //PIXELATE
        this.pixelate = new FILTERS.PixelateFilter()
        this.pixelate.size.x = 2;
        this.pixelate.size.y = 2;

        //DISPLACEMENT FILTER
        // let displacementTexture2 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/glitch1.jpg'))
        // this.addChild(displacementTexture2);

        //GLITCH 1
        // this.glitch2 = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('./assets/images/glitch2.jpg', config.width, config.height))
        // this.addChild(this.glitch2)
        // this.glitch2.width = config.width;
        // this.glitch2.height = config.width;
        // this.displacementFilterGlitch2 = new PIXI.filters.DisplacementFilter(this.glitch2);

        //GLITCH 1
        // this.screenDisplacement = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/images/screen_displacement.jpg'))
        // this.addChild(this.screenDisplacement)
        // this.screenDisplacement.width = config.width;
        // this.screenDisplacement.height = config.height;
        // this.displacementFilterscreenDisplacement = new PIXI.filters.DisplacementFilter(this.screenDisplacement);

        //BLOOM
        this.bloom = new FILTERS.AdvancedBloomFilter();
        this.bloom.blur = 10;

        //SHOCKWAVE
        this.shockwave = new FILTERS.ShockwaveFilter();
        this.shockwave.time = 0;
        // this.shockwave.center.x = 0.5;
        // this.shockwave.center.y = 0.5;

        this.filtersList =
            [this.rgpSplit,
                this.pixelate,
                this.displacementFilterGlitch1,
                this.shockwave,
                this.bloom,
                this.crossHatch,
                this.invertFilter,
                this.ascii,
                this.gray,
                this.displacementFilterscreenDisplacement,
                this.blur
            ];

        this.filtersActives = [false, false, false, false, false, false, false, false, false, false, false];
        // this.filtersActives = [false, true,false,false, false, false, false, false, false, true, false];

        this.updateFilters();

        this.ID_RGBSPLIT = 0;
        this.ID_PIXELATE = 1;
        this.ID_GLITCH2 = 2;
        // this.ID_GLITCH1 = 3;
        this.ID_BLOOM = 4;
        this.ID_SHOCKWAVE = 3;
        this.ID_CROSSHATCH = 6;
        this.ID_INVERT = 7;
        this.ID_ASCII = 8;
        this.ID_GRAY = 9;
        this.ID_BLUR = 10;

        //this.updatePixelate(config.pixelSize,config.pixelSize);

    }
    hideGreyShape(time, delay) {
        TweenLite.to(this.grey, time, {
            alpha: 0,
            delay: delay
        });
    }
    removeAllFilters() {
        for (var i = this.filtersActives.length - 1; i >= 0; i--) {
            this.filtersActives[i] = false;
        }
        this.updateFilters();
    }
    updateRGBSplitter(value) {
        this.rgpSplit.red = new PIXI.Point(value, value);
        this.rgpSplit.green = new PIXI.Point(-value, -value);
        this.rgpSplit.blue = new PIXI.Point(value, -value);
    }
    updateFilters() {
        var filtersToApply = [];
        for (var i = 0; i < this.filtersList.length; i++) {

            if (this.filtersActives[i]) {
                filtersToApply.push(this.filtersList[i]);
            }
        };
        this.container.filters = filtersToApply.length > 0 ? filtersToApply : null;
        // console.log(this.container.filters);
    }
    removeBlur() {
        this.filtersActives[this.ID_BLUR] = false;
        this.updateFilters();
    }
    addBlur() {
        this.filtersActives[this.ID_BLUR] = true;
        this.updateFilters();
    }
    removeGlitch2() {
        this.filtersActives[this.ID_GLITCH2] = false;
        this.updateFilters();
    }
    addGlitch2() {
        this.filtersActives[this.ID_GLITCH2] = true;
        this.updateFilters();
    }

    removeGray() {
        this.filtersActives[this.ID_GRAY] = false;
        this.updateFilters();
    }
    addGray() {
        this.filtersActives[this.ID_GRAY] = true;
        this.updateFilters();
    }

    removeCrossHatch() {
        this.filtersActives[this.ID_CROSSHATCH] = false;
        this.updateFilters();
    }
    addCrossHatch() {
        this.filtersActives[this.ID_CROSSHATCH] = true;
        this.updateFilters();
    }

    removeInvert() {
        this.filtersActives[this.ID_INVERT] = false;
        this.updateFilters();
    }
    addInvert() {
        this.filtersActives[this.ID_INVERT] = true;
        this.updateFilters();
    }

    removeAscii() {
        this.filtersActives[this.ID_ASCII] = false;
        this.updateFilters();
    }
    addAscii() {
        this.filtersActives[this.ID_ASCII] = true;
        this.updateFilters();
    }

    removeBloom() {
    	console.log('REMOVE BLOOM');
        this.filtersActives[this.ID_BLOOM] = false;
        this.updateFilters();
    }
    addBloom() {
        this.filtersActives[this.ID_BLOOM] = true;
        this.updateFilters();
    }

    removePixelate() {
        console.log(removePixelate);
        this.filtersActives[this.ID_PIXELATE] = false;
        this.updateFilters();
    }
    addPixelate() {
        this.filtersActives[this.ID_PIXELATE] = true;
        this.updateFilters();
    }
    removeRGBSplitter() {
        this.filtersActives[this.ID_RGBSPLIT] = false;
        this.updateFilters();
    }
    addRGBSplitter() {
        this.filtersActives[this.ID_RGBSPLIT] = true;
        this.updateFilters();
    }
    updatePixelate(x, y) {
        this.pixelate.size.x = x;
        this.pixelate.size.y = y;
    }
    removeShockwave() {
        this.filtersActives[this.ID_SHOCKWAVE] = false;
        this.updateFilters();
    }
    addShockwave(x, y, time = 1, delay = 0) {
        this.filtersActives[this.ID_SHOCKWAVE] = true;
        this.updateFilters();
        // this.shockwave.wavelength = 0.5;
        this.shockwave.amplitude = 10;
        this.shockwave.time = 0;
        this.shockwave.radius = 50;
        this.shockwave.center = [x * config.width, y * config.height]
        console.log(this.shockwave.center, this.width, this.height);
        // [0] = x;
        // this.shockwave.center[1] = y;
        // this.shockwave.center.x = x;
        // this.shockwave.center.y = y;
        // console.log('shockcenter', this.shockwave, this.width);
        TweenLite.killTweensOf(this.shockwave);
        TweenLite.to(this.shockwave, time, {
            delay: delay,
            time: 1,
            onComplete: this.removeShockwave,
            onCompleteScope: this
        });
    }

    fadeBloom(initValue = 0, endValue = 10, time = 0.5, delay = 0, removeAfter = true) {
        this.addBloom();
        this.bloom.blur = initValue;
        TweenLite.killTweensOf(this.bloom);
        if (removeAfter) {
            TweenLite.to(this.bloom, time, {
                delay: delay,
                blur: endValue,
                onComplete: this.removeBloom,
                onCompleteScope: this
            });
        } else {
            TweenLite.to(this.bloom, time, {
                delay: delay,
                blur: endValue
            });
        }
    }
    fadeSplitter(endValue, time, delay) {
        // this.addRGBSplitter();
        TweenLite.killTweensOf(this.rgpSplit.red);
        TweenLite.killTweensOf(this.rgpSplit.green);
        TweenLite.killTweensOf(this.rgpSplit.blue);
        TweenLite.to(this.rgpSplit.red, time, {
            delay: delay,
            x: endValue,
            y: endValue,
            onStart: this.addRGBSplitter,
            onStartScope: this
        });
        TweenLite.to(this.rgpSplit.green, time, {
            delay: delay,
            x: -endValue,
            y: -endValue
        });
        TweenLite.to(this.rgpSplit.blue, time, {
            delay: delay,
            x: endValue,
            y: -endValue
        });
    }
    shakeSplitter(force = 1, steps = 4, time = 1, removeAfter = true) {
        this.filtersActives[this.ID_RGBSPLIT] = true;
        this.updateFilters();
        if (config.isJuicy == 0) {
            return;
        }
        let timelineSplitRed = new TimelineLite();
        let timelineSplitGreen = new TimelineLite();
        let timelineSplitBlue = new TimelineLite();
        let spliterForce = (force * 20);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--) {
            timelineSplitRed.append(TweenLite.to(this.rgpSplit.red, speed, {
                x: Math.random() * spliterForce - spliterForce / 2,
                y: Math.random() * spliterForce - spliterForce / 2,
                ease: "easeNoneLinear"
            }));
            timelineSplitGreen.append(TweenLite.to(this.rgpSplit.green, speed, {
                x: Math.random() * spliterForce - spliterForce / 2,
                y: Math.random() * spliterForce - spliterForce / 2,
                ease: "easeNoneLinear"
            }));
            timelineSplitBlue.append(TweenLite.to(this.rgpSplit.blue, speed, {
                x: Math.random() * spliterForce - spliterForce / 2,
                y: Math.random() * spliterForce - spliterForce / 2,
                ease: "easeNoneLinear"
            }));
        };
        timelineSplitRed.append(TweenLite.to(this.rgpSplit.red, speed, {
            x: 1,
            y: 1,
            ease: "easeNoneLinear"
        }));
        timelineSplitGreen.append(TweenLite.to(this.rgpSplit.green, speed, {
            x: -1,
            y: -1,
            ease: "easeNoneLinear"
        }));
        if (removeAfter) {
            timelineSplitBlue.append(TweenLite.to(this.rgpSplit.blue, speed, {
                x: 1,
                y: -1,
                ease: "easeNoneLinear",
                onComplete: this.removeRGBSplitter,
                onCompleteScope: this
            }));
        } else {
            timelineSplitBlue.append(TweenLite.to(this.rgpSplit.blue, speed, {
                x: 1,
                y: -1,
                ease: "easeNoneLinear"
            }));
        }
    }
    shake(force, steps, time) {
        if (config.isJuicy == 0) {
            return;
        }
        if (!force) {
            force = 1;
        }
        if (!steps) {
            steps = 4;
        }
        if (!time) {
            time = 1;
        }
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(this.container.position, speed, {
                x: Math.random() * positionForce - positionForce / 2,
                y: Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.container.position, speed, {
            x: 0,
            y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }

    shakeX(force, steps, time) {
        if (config.isJuicy == 0) {
            return;
        }
        if (!force) {
            force = 1;
        }
        if (!steps) {
            steps = 4;
        }
        if (!time) {
            time = 1;
        }
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(this.container.position, speed, {
                x: Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.container.position, speed, {
            x: 0,
            y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }

    shakeY(force, steps, time) {
        if (config.isJuicy == 0) {
            return;
        }
        if (!force) {
            force = 1;
        }
        if (!steps) {
            steps = 4;
        }
        if (!time) {
            time = 1;
        }
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(this.container.position, speed, {
                y: Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.container.position, speed, {
            x: 0,
            y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }

    shakeRotation(force, steps, time) {
        if (config.isJuicy == 0) {
            return;
        }
        if (!force) {
            force = 1;
        }
        if (!steps) {
            steps = 4;
        }
        if (!time) {
            time = 1;
        }
        let timelinePosition = new TimelineLite();
        let rotationForce = (force * 180 / Math.PI);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(this.container, speed, {
                rotation: Math.random() * rotationForce - rotationForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.container, speed, {
            rotation: 0,
            ease: "easeeaseNoneLinear"
        }));
    }

    update(delta) {
        return
        this.blackShape.alpha = Math.random() * 0.1;
        this.tvLines.tilePosition.y += 1;
        if (this.tvLines.tilePosition.y > 40) {
            this.tvLines.tilePosition.y = 0;
        }
        //this.glitch1.tilePosition.y += 1;
    }
}