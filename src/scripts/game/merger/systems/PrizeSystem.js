import StandardEnemy from "../enemy/StandardEnemy";

export default class PrizeSystem {
    constructor(containers, data, dataTiles) {
        this.container = containers.mainContainer;
        this.entity = new StandardEnemy()
        this.container.addChild(this.entity);

        this.entity.setAsEnemy('Ship1_chest')
        this.entity.y = 100

		this.entity.interactive = true;
		this.entity.buttonMode = true;

        this.entity.on('mouseup', this.click.bind(this)).on('touchend', this.click.bind(this));
    }
    click() {
        console.log("Collect2")		
	}
    resize(){

    }
    update(delta){
        
        this.entity.update(delta)
    }
    updateMouse(e) {

    }
}