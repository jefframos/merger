const data = {}

data.thief = {
    primaryKey: 'thief',
    id: 0,

    classType: "thief",
    subClass: "thief",
    baseClass: "StandardHero",
    defaultWeapon: 'basicDagger',

    label: "Thief",
    gambits: {
        default: [{
            type: 'GambitCurrentHP',
            target: 'opposite',
            data: {
                condition: 'lowest'
            },
            action: {
                type: 'StandardAttackAction'
            }
        }],
        main: null,
        maxAllowed: 5,
        maxStart: 2
    },
    stats: {
        vigor: 37,
        speed: 40,
        movementSpeed: 60,
        stamina: 28,
        magicPower: 28,
        battlePower: 14,
        defense: 38,
        magicDefense: 23
    },
    modifiers: {
        baseHPModifier: 1.32,
        baseMPModifier: 10.2,
        vigorModifier: 0.005,
        speedModifier: 0.007,
        movementSpeedModifier: 0.007,
        staminaModifier: 0.007,
        magicPowerModifier: 0.004,
        battlePowerModifier: 0.005,
        defenseModifier: 0.004,
        magicDefenseModifier: 0.004
    },
    graphicsData: {
        baseWidth: 32,
        textures: {
            front: "assassin-front",
            back: "assassin-back",
            side: "assassin-side",
        }

    },
    config: {

    }
}

data.warrior = {
    primaryKey: 'warrior',
    id: 0,

    classType: "warrior",
    subClass: "warrior",
    baseClass: "StandardHero",
    defaultWeapon: 'basicSword',

    label: "Warrior",
    gambits: {
        default: [{
            type: 'GambitCurrentHP',
            target: 'opposite',
            data: {
                condition: 'highest'
            },
            action: {
                type: 'StandardAttackAction'
            }
        }],
        main: null,
        maxAllowed: 5,
        maxStart: 2
    },
    stats: {
        vigor: 42,
        speed: 20,
        movementSpeed: 30,
        stamina: 28,
        magicPower: 28,
        battlePower: 24,
        defense: 45,
        magicDefense: 23
    },
    modifiers: {
        baseHPModifier: 1.32,
        baseMPModifier: 10.2,
        vigorModifier: 0.005,
        speedModifier: 0.007,
        movementSpeedModifier: 0.007,
        staminaModifier: 0.007,
        magicPowerModifier: 0.004,
        battlePowerModifier: 0.005,
        defenseModifier: 0.004,
        magicDefenseModifier: 0.004
    },
    graphicsData: {
        baseWidth: 32,
        textures: {
            front: "warrior-front",
            back: "warrior-back",
            side: "warrior-side",
        }

    },
    config: {

    }
}

data.archer = {
    primaryKey: 'archer',
    id: 0,

    classType: "archer",
    subClass: "archer",
    baseClass: "StandardHero",
    defaultWeapon: 'basicBow',

    label: "archer",
    gambits: {
        default: [{
            type: 'GambitRandomEntity',
            target: 'opposite',
            data: {
                condition: 'closest'
            },
            action: {
                type: 'StandardAttackAction'
            }
        }],
        main: null,
        maxAllowed: 5,
        maxStart: 2
    },
    stats: {
        vigor: 37,
        speed: 60,
        movementSpeed: 60,
        stamina: 28,
        magicPower: 28,
        battlePower: 6,
        defense: 38,
        magicDefense: 23
    },
    modifiers: {
        baseHPModifier: 1.32,
        baseMPModifier: 10.2,
        vigorModifier: 0.005,
        speedModifier: 0.007,
        movementSpeedModifier: 0.007,
        staminaModifier: 0.007,
        magicPowerModifier: 0.004,
        battlePowerModifier: 0.005,
        defenseModifier: 0.004,
        magicDefenseModifier: 0.004
    },
    graphicsData: {
        baseWidth: 32,
        textures: {
            front: "archer-front",
            back: "archer-back",
            side: "archer-side",
        }

    },
    config: {

    }
}


data.mage = {
    primaryKey: 'mage',
    id: 0,

    classType: "mage",
    subClass: "mage",
    baseClass: "StandardHero",
    defaultWeapon: 'basicStaff',

    label: "mage",
    gambits: {
        default: [{
            type: 'GambitCurrentHP',
            target: 'opposite',
            data: {
                condition: 'less',
                value: 0.5
            },
            action: {
                type: 'StandardSpellAction',
                value: 'fireball',
                valueType: 'spell'
            }
        }, {
            type: 'GambitRandomEntity',
            target: 'opposite',
            data: {
                condition: 'farest',
            },
            action: {
                type: 'StandardAttackAction'
            }
        }
        ],
        main: null,
        maxAllowed: 5,
        maxStart: 2
    },
    stats: {
        vigor: 37,
        speed: 2,
        movementSpeed: 20,
        stamina: 28,
        magicPower: 20,
        battlePower: 6,
        defense: 38,
        magicDefense: 23
    },
    modifiers: {
        baseHPModifier: 1.32,
        baseMPModifier: 10.2,
        vigorModifier: 0.005,
        speedModifier: 0.007,
        movementSpeedModifier: 0.007,
        staminaModifier: 0.007,
        magicPowerModifier: 0.004,
        battlePowerModifier: 0.005,
        defenseModifier: 0.004,
        magicDefenseModifier: 0.004
    },
    graphicsData: {
        baseWidth: 32,
        textures: {
            front: "mage-front",
            back: "mage-back",
            side: "mage-side",
        }

    },
    config: {

    }
}

data.white_mage = {
    primaryKey: 'white_mage',
    id: 0,

    classType: "white_mage",
    subClass: "white_mage",
    baseClass: "StandardHero",
    defaultWeapon: 'basicWand',

    label: "white mage",
    gambits: {
        default: [{
            type: 'GambitCurrentHP',
            target: 'same',
            data: {
                condition: 'less',
                value: 0.5
            },
            action: {
                type: 'StandardSpellAction',
                value: 'heal',
                valueType: 'spell'
            }
        }],
        main: null,
        maxAllowed: 5,
        maxStart: 3
    },
    stats: {
        vigor: 37,
        speed: 20,
        movementSpeed: 20,
        stamina: 28,
        magicPower: 14,
        battlePower: 2,
        defense: 38,
        magicDefense: 23
    },
    modifiers: {
        baseHPModifier: 1.32,
        baseMPModifier: 10.2,
        vigorModifier: 0.005,
        speedModifier: 0.007,
        movementSpeedModifier: 0.007,
        staminaModifier: 0.007,
        magicPowerModifier: 0.004,
        battlePowerModifier: 0.005,
        defenseModifier: 0.004,
        magicDefenseModifier: 0.004
    },
    graphicsData: {
        baseWidth: 32,
        textures: {
            front: "paladin-front",
            back: "paladin-back",
            side: "paladin-side",
        }

    },
    config: {

    }
}

export default data;