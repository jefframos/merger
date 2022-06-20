import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import utils from '../../utils';
import Trail from '../effects/Trail';
export default class Environment extends PIXI.Container
{
    constructor(game)
    {
        super();
        //console.log(game);

        this.backgroundGraphics = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, config.width, config.height);
        this.addChild(this.backgroundGraphics);
        this.backgroundGraphics.tint = 0x04001e;

        this.backgroundGraphics.pivot.x = this.backgroundGraphics.width / 2;
        this.backgroundGraphics.pivot.y = this.backgroundGraphics.height / 2;
        this.backgroundGraphics.x = config.width / 2;
        this.backgroundGraphics.y = config.height / 2;
        this.backgroundGraphics.scale.set(1.2);

        this.baseGradient = new PIXI.Sprite.from('base-gradient');
        this.baseGradient.anchor.set(0.5, 1);
        this.baseGradient.width = config.width * 1.2;
        this.baseGradient.height = config.height * 0.65;
        this.baseGradient.x = config.width / 2
        this.baseGradient.y = config.height * 1.2
        this.baseGradient.tint = 0x820b81

        this.blur = new PIXI.Sprite.from('bigblur');
        this.blur.anchor.set(0.5, 0.5);
        this.blur.width = config.width * 1.2;
        this.blur.height = config.height * 1.2;
        this.blur.x = config.width // 2
        this.blur.y = 0 //config.height /2
        this.blur.tint = 0x3300CC;
        this.blur.blendMode = PIXI.BLEND_MODES.ADD
        this.blur.alpha = 0.3

        this.addChild(this.blur);




        this.starsContainer = new PIXI.Container();
        this.addChild(this.starsContainer);

        this.addStars();


        this.lines = [];
        this.planets = [];



        let planet1 = new PIXI.Sprite.from('planet');
        planet1.anchor.set(0.5);
        planet1.x = config.width
        planet1.scale.set(config.height / planet1.width * 0.4);
        planet1.y = planet1.height / 2.5
        this.addChild(planet1)
        this.planets.push(
        {
            scale:
            {
                x: planet1.scale.x,
                y: planet1.scale.y
            },
            sprite: planet1
        })

        let planet2 = new PIXI.Sprite.from('planet');
        planet2.anchor.set(0.5);
        let tempScale = config.height / planet2.width * 0.4
        planet2.scale.set(-tempScale, tempScale);
        planet2.x = config.width
        planet2.y = config.height
        this.addChild(planet2)

        this.planets.push(
        {
            scale:
            {
                x: planet2.scale.x,
                y: planet2.scale.y
            },
            sprite: planet2
        })

        let planet3 = new PIXI.Sprite.from('planet');
        planet3.anchor.set(0.5);
        tempScale = config.height / planet3.width * 0.25
        planet3.scale.set(-tempScale, tempScale);
        planet3.alpha = 0.5
        planet3.x = config.width * 0.1
        planet3.y = config.height * 0.35
        this.addChild(planet3)

        this.planets.push(
        {
            scale:
            {
                x: planet3.scale.x,
                y: planet3.scale.y
            },
            sprite: planet3
        })

        this.addChild(this.baseGradient);

        this.game = game;

        this.currentColor = 0;

    }

    showLines()
    {
        for (var i = 0; i < this.trails.length; i++)
        {
            TweenLite.to(this.trails[i].mesh, 1,
            {
                alpha: 0.5
            })
            utils.addColorTween(this.trails[i].mesh, this.trails[i].mesh.tint, COLORS[i], 1);
        }

    }

    hideLines(force)
    {
        for (var i = 0; i < this.trails.length; i++)
        {
            TweenLite.to(this.trails[i].mesh, force ? 0 : 0.5,
            {
                alpha: 0
            })
            utils.addColorTween(this.trails[i].mesh, this.trails[i].mesh.tint, 0x00FFFF, force ? 0 : 1);
        }

    }
    addStars()
    {
        let totalStars = 80;
        this.stars = [];
        for (var i = 0; i < totalStars; i++)
        {
            let dist = Math.random() * 2 + 1;
            let tempStar = new PIXI.Sprite.from('spark2');
            tempStar.alpha = (dist / 3 * 0.6) + 0.1
            let toClose = true;
            let acc = 5;

            tempStar.scale.set(config.height * 0.008 / tempStar.height * tempStar.alpha)

            while (toClose || acc > 0)
            {
                acc--;
                let angle = Math.random() * Math.PI * 2;
                let radius = Math.random() * config.height * 0.5 + 20;
                tempStar.x = Math.cos(angle) * radius + config.width / 2;
                tempStar.y = Math.sin(angle) * radius + config.height / 2;
                tempStar.velocity = {
                    y: config.height * 0.01 * tempStar.alpha,
                    x: 0
                }
                toClose = false;
                for (var j = 0; j < this.stars.length; j++)
                {
                    let distance = utils.distance(this.stars[j].x, this.stars[j].y, tempStar.x, tempStar.y)
                    if (distance > 15)
                    {}
                    else
                    {
                        toClose = true;
                        break
                    }
                }
            }
            this.starsContainer.addChild(tempStar);
            this.stars.push(tempStar)
        }
    }

    removeSpecialBackground()
    {
        for (var i = 0; i < this.trails.length; i++)
        {
            utils.addColorTween(this.trails[i].mesh, this.trails[i].mesh.tint, COLORS[i], 1);
        }
        let time = 0.5;
        TweenLite.killTweensOf(this.currentColorTween);
        clearTimeout(this.specialTimeout);
        this.currentColorTween = utils.addColorTween(this.backgroundGraphics, this.backgroundGraphics.tint, 0x04001e, time).tween;
    }
    specialBackground()
    {
        if(!this.game.gameStarted){
            this.currentColorTween = utils.addColorTween(this.backgroundGraphics, this.backgroundGraphics.tint, 0x04001e, time).tween;
            return;
        }
        TweenLite.killTweensOf(this.currentColorTween);
        clearTimeout(this.specialTimeout);

        
        for (var i = 0; i < this.trails.length; i++)
        {
            utils.addColorTween(this.trails[i].mesh, this.trails[i].mesh.tint, 0x00FFFF, 1);
        }

        for (var i = 0; i < this.planets.length; i++)
        {
            let plData = this.planets[i];
            plData.sprite.scale.set(plData.scale.x * 0.9, plData.scale.y * 0.9);
            TweenLite.to(plData.sprite.scale, 0.3,
            {
                x: plData.scale.x,
                y: plData.scale.y,
                ease: Back.easeOut
            })
        }
        this.currentColor++;
        this.currentColor %= COLORS.length - 1;
        let time = 0.5;
        this.currentColorTween = utils.addColorTween(this.backgroundGraphics, this.backgroundGraphics.tint, COLORS[this.currentColor], time).tween;
        this.specialTimeout = setTimeout(() =>
        {
            this.specialBackground();
        }, time * 1000);
    }
    addWaypoints(waypoints, area)
    {
        // this.lanesWaypoints = waypoints;
        area.width *= 0.8;
        area.height *= 0.8;
        let waypointsTot = waypoints[0].length;
        //console.log(this.game);

        this.lanesWaypoints = [];

        let tempWays = []
        for (var i = 0; i < this.game.catPawns.length; i++)
        {
            tempWays = []


            let point = waypoints[i][0];
            let catPawn = new PIXI.Graphics().beginFill(0x555555).drawCircle(0, 0, PAWN.width);
            // this.game.catsContainer.addChild(catPawn)
            // catPawn.alpha = 0.2;
            catPawn.x = config.width * point.x
            catPawn.y = config.height * point.y
            this.game.spawnPoints.push(catPawn);
            this.game.scaleableElements.push(catPawn);
            tempWays.push(catPawn);
            this.lanesWaypoints.push(tempWays);


        }
        let min = {
            x: area.width, //config.width / 2,
            y: config.height * 0.2
        }
        let max = {
            x: config.width * 0.7,
            y: config.height * 0.8
        }
        let waypointsLayer = [];
        for (var i = 0; i < this.game.catPawns.length; i++)
        {
            waypointsLayer = [];
            for (var j = 1; j < waypoints[i].length; j++)
            {
                let point = waypoints[i][j];
                let catPawn = new PIXI.Graphics().beginFill(0x555555).drawCircle(0, 0, PAWN.width);
                // this.game.catsContainer.addChild(catPawn)
                // catPawn.alpha = 0.2;
                catPawn.x = config.width * point.x
                catPawn.y = config.height * point.y
                waypointsLayer.push(catPawn);
                this.game.scaleableElements.push(catPawn);

                this.lanesWaypoints[i].push(catPawn);

            }
            this.game.spawnPointsMiddle.push(waypointsLayer);

            this.lanesWaypoints[i].push(this.game.catPawns[i]);
        }



        //console.log(this.lanesWaypoints);

    }
    addBall(pos)
    {
        let ball = new PIXI.Graphics().linesStyle(1, 0xff0000).drawCircle(0, 0, 20);
        this.addChild(ball)
        ball.position = pos;
    }
    drawLines()
    {
        this.trails = [];

        for (var i = 0; i < this.lanesWaypoints.length; i++)
        {
            let points = this.lanesWaypoints[i]
            let trail = new Trail(this, points.length * 2 + 5, 'lane_texture')
            trail.trailTick = config.width * 0.02;
            trail.speed = 0.0;
            trail.frequency = 0.000
            for (var j = 0; j < points.length - 1; j++)
            {
                let node = points[j];
                trail.update(
                {
                    x: node.x,
                    y: node.y
                }, node.scale.x * 3);
            }
            let last = this.game.catPawns[i]


            trail.update(
            {
                x: last.x,
                y: last.y
            }, last.scale.x * 3);

            trail.update(
            {
                x: last.x,
                y: last.y
            }, last.scale.x * 3);

            //last nodes
            let node2 = points[points.length - 3];
            let node3 = points[points.length - 2];

            let ang = Math.atan2(node3.y - node2.y, node3.x - node2.x)


            // trail.update(
            // {
            //     x: last.x + Math.cos(ang) * 400,
            //     y: last.y + Math.sin(ang) * 400
            // }, last.scale.x * 4);

            // trail.update(
            // {
            //     x: last.x + Math.cos(ang) * 400,
            //     y: last.y + Math.sin(ang) * 400
            // }, last.scale.x * 4);

            this.trails.push(trail);
        }
    }
    update(delta)
    {
        for (var i = 0; i < this.stars.length; i++)
        {
            this.stars[i].x += this.stars[i].velocity.x* delta;
            this.stars[i].y += this.stars[i].velocity.y* delta;

            if (this.stars[i].x > config.width)
            {
                this.stars[i].x = -20
            }
            if (this.stars[i].y > config.height)
            {
                this.stars[i].y = 0
            }
            if (this.stars[i].x < 0)
            {
                this.stars[i].x = config.width
            }
            if (this.stars[i].y < 0)
            {
                this.stars[i].y = config.height
            }
        }
        for (var i = 0; i < this.trails.length; i++)
        {

            // this.trails[i].update({x:0, y:0}, 10)
            // this.trails[i].mesh.texture.position.y += delta;
            // //console.log(this);
        }
    }

}