export default class EntityModel {
    constructor() {
        this.vigor = 0
        this.speed = 0
        this.movementSpeed = 0
        this.stamina = 0
        this.magicPower = 0
        this.battlePower = 0
        this.defense = 0
        this.magicDefense = 0
        this.stamina = 0
        this.critialChance = 0.0;
    }
    addWeapon(weapon){
        this.weapon = weapon;
    }
    getSpeed(){
        // if(this.weapon){
        //     return Math.min(255, this.speed * this.weapon.speedMultiplier);
        // }else{
        // }
        return this.speed
    }
    getMovementSpeed(){
        //should use equipament to boost
        // if(this.weapon){
        //     return this.movementSpeed * this.weapon.speedMultiplier;
        // }else{
        // }
        return this.movementSpeed
    }
}