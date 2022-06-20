const data = {}
data.fly = {
    primaryKey: 0,
    id: 0,

    name: "---",
    stats: {
        level: 2,
        hp: 200,
        //hp: 220,
        stamina: 41,
        speed: 5,
        //speed: 25,
        movementSpeed:20,
        magicPower: 13,
        battlePower: 1,//30,
        defense: 120,
        magicDefense: 120,
        xp: 20
    },
    fire: {
        srcImg: "dist/img/enemies/bullets/RedFire.PNG",
        quant: 5,
        type: "physical",
        mode: "arround",
        lifeTime: 50,
        speed: 5,
        fireFreq: 100
    },
    graphicsData: {
        texture: "fly1",
        icoImg: "dist/img/weapons/Sumo Master.png",
        srcImg: "dist/img/enemies/Sumo Master.png",
        srcJson: "",
        sourceLabel: "STATIC",
        bkp: {
            srcJson: "dist/img/enemies/sockets.JSON",
            sourceLabel: "sockets10"
        },
        frames: {
            idleInit: 0,
            idleEnd: 14
        }
    },
}

export default data;