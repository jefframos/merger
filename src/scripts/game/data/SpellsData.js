const data = {}

data.heal = {
    spellPower : -20,
    speedMultiplier : 1,
    targetRequired:'same',
    bullet: {
        speed: 150,
        baseBullet: "StandardSpell",
        texture: "cure",
    },
}

data.fireball = {
    spellPower : 30,
    speedMultiplier : 5,
    targetRequired:'opposite',
    bullet: {
        speed: 150,
        baseBullet: "StandardSpell",
        texture: "fire",
    },
}

export default data;