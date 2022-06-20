const data = {}
data.noWeapon = {
    weaponPower: 15,
    hands: 1,
    critical: 1.2,
    criticalChance: 0.1,
    kickback: 100,
    speedMultiplier: 1,
    actingTime: 0.3,
    range: null
}
data.basicSword = {
    weaponPower: 40,
    hands: 1,
    kickback: 100,
    critical: 1.5,
    criticalChance: 0.1,
    speedMultiplier: 1,
    actingTime: 1.5,
    range: null
}

data.basicDagger = {
    weaponPower: 25,
    hands: 1,
    critical: 1.95,
    kickback: 20,
    criticalChance: 0.2,
    speedMultiplier: 1.2,
    actingTime: 0.1,
    range: null
}

data.basicBow = {
    weaponPower: 5,
    hands: 1,
    critical: 1.75,
    criticalChance: 0.2,
    speedMultiplier: 1,
    actingTime: 0.2,
    kickback: 10,
    range: {
        bullet: {
            speed: 400,
            baseBullet: "StandardBullet",
            texture: "arrow"
        }
    }
}

data.basicWand = {
    weaponPower: 20,
    hands: 1,
    critical: 1.5,
    criticalChance: 0.05,
    speedMultiplier: 1,
    actingTime: 1,
    range: {
        bullet: {
            speed: 150,
            baseBullet: "StandardSpell",
            texture: "fire"
        }
    }
}

data.basicStaff = {
    weaponPower: 18,
    hands: 1,
    critical: 1.5,
    criticalChance: 0.05,
    speedMultiplier: 2,
    actingTime: 1,
    range: {
        bullet: {
            speed: 150,
            baseBullet: "StandardSpell",
            texture: "fire"
        }
    }
}

export default data;