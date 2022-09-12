import TweenMax from "gsap";
import config from "../../../config";
import utils from "../../../utils";
import StandardEnemy from "../enemy/StandardEnemy";
import Signals from 'signals';

export default class PrizeSystem {
    constructor(containers, data, dataTiles) {
        this.container = containers.mainContainer;
        this.entity = new StandardEnemy()
        this.container.addChild(this.entity);

        this.entity.setAsEnemy('Ship1_chest')
        this.entity.y = 100

        this.entity.interactive = true;
        this.entity.buttonMode = true;

        this.helpIcon = new PIXI.Sprite.from('icon-help');
        this.helpIcon.anchor.set(0.5)
        this.helpIcon.scale.set(0.5)
        this.helpIcon.y = -30
        this.entity.enemySprite.addChild(this.helpIcon)

        this.helpLabel = new PIXI.Text('HELP', LABELS.LABEL_CHEST);
        this.helpLabel.style.fontSize = 24
        this.helpLabel.style.fill = 0xffffff
        this.helpLabel.x = 30
        this.helpLabel.y = - 10
        this.helpIcon.addChild(this.helpLabel)

        this.entity.on('mouseup', this.click.bind(this)).on('touchend', this.click.bind(this));

        this.currentTimer = 5;
        this.timer = 5;

        this.velocity = {
            x: 0,
            y: 0
        }

        this.inMovement = false;

        this.targets = [{
            x: -200,
            y: 0
        },
        {
            x: 0,
            y: 240
        },
        {
            x: config.width / 2,
            y: 235
        },
        {
            x: config.width,
            y: 240
        },
        {
            x: config.width + 200,
            y: -100
        }]

        this.currentTargetId = 0;
        this.currentAngle = 0;

        this.currentTarget = this.targets[this.currentTargetId];
        this.speed = 20

        this.spawn()

        this.onCollect = new Signals();

    }
    spawn() {

        this.entity.setAsEnemy('Ship' + Math.ceil(Math.random() * 6) + '_chest')

        this.currentTargetId = 0;
        this.currentTarget = this.targets[this.currentTargetId];
        this.entity.x = this.currentTarget.x
        this.entity.y = this.currentTarget.y
        this.entity.visible = true;
        this.entity.alpha = 1;
        this.inMovement = true;
        this.nextTarget();
    }
    nextTarget() {
        this.currentTargetId++;
        if (this.currentTargetId >= this.targets.length) {
            this.remove();
            this.currentTimer = this.timer;
        } else {
            this.currentTarget = this.targets[this.currentTargetId];
        }
    }
    remove() {
        TweenMax.to(this.entity, 1, {
            alpha: 0, onComplete: () => {
                this.entity.visible = false;
            }
        })
        this.inMovement = false;
    }
    click() {
        this.onCollect.dispatch(this);
        this.remove();
        this.currentTimer = this.timer;

    }
    resize() {

    }
    update(delta) {
        if (this.inMovement) {
            //console.log(utils.distance(this.entity.x,this.entity.y, this.currentTarget.x,this.currentTarget.y), this.speed * 2)
            //this.currentAngle = Math.atan2(this.entity.y - this.currentTarget.y, this.entity.x - this.currentTarget.x) //- Math.PI/2 // 180 * 3.14;
            this.currentAngle = utils.lerp(this.currentAngle,Math.atan2(this.currentTarget.y - this.entity.y, this.currentTarget.x - this.entity.x), 0.01);

            this.entity.rotation = utils.lerp(this.entity.rotation, this.currentAngle, 0.002)
            this.helpIcon.rotation = - this.entity.rotation - this.entity.enemySprite.rotation
            this.velocity.x = utils.lerp(this.velocity.x, Math.cos(this.currentAngle) * this.speed, 0.05)
            this.velocity.y = utils.lerp(this.velocity.y, Math.sin(this.currentAngle) * this.speed, 0.05)
            this.entity.update(delta)
            this.entity.x += this.velocity.x * delta;
            this.entity.y += this.velocity.y * delta;
            //console.log(utils.distance(this.entity.x,this.entity.y, this.currentTarget.x,this.currentTarget.y), this.speed * 2)
            if (utils.distance(this.entity.x, this.entity.y, this.currentTarget.x, this.currentTarget.y) < this.speed * 2) {
                this.nextTarget();
            }
        } else if (this.currentTimer > 0) {
            this.currentTimer -= delta;
            if (this.currentTimer <= 0) {
                this.spawn();
            }
        }
    }
    updateMouse(e) {

    }
}