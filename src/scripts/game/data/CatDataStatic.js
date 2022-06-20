const images = [
    'cat_orange_',
    'cat_turquoise_',
    'cat_pink_',
    'cat_yellow_',

    'cat_jeff_',
    'cat_punk_',
    'cat_super_',
    'cat_business_',

    'cat_surf_',
    'cat_bowie_',
    'cat_alien_',
    'cat_lucha_',

    'cat_snake_',
    'cat_chef_',

    // 'cat_chef_',
    'cat_robot_',
    'cat_ufo_',
]
const names = [
    'pancakes',
    'puffy',
    'cake',
    'puddy\ntat',

    'cloud',
    'purry\nvicious',
    'clark\ncat',
    'the\nboss',

    'mr.\npuffington',
    'catvid\nbowie',
    'wigglebutt',
    'el\ngato',

    'fuzzinator',
    'the\nchef',

    // 'fuzzinator',
    'C4TN1P',
    'galacticat',
]
const data = []

data.push(
{
    catID: 0,
    collected: 0,
    active: true,
    canBeActive: true,
    isAuto: false,
    autoCollectPrice: 5,
    amountToAutoCollect: 100,
    pointsMultiplier: 1,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 10,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_jeff_',
    catThumb: 'results_orange_cat',
    catName:names[data.length],
    cost: 0
})

data.push(
{
    catID: 1,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 100,
    amountToAutoCollect: 200,
    pointsMultiplier: 3,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 15,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_punk_',
    catThumb: 'results_pink_cat',
    catName:names[data.length],
    cost: 100
})

data.push(
{
    catID: 2,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 2500,
    amountToAutoCollect: 300,
    pointsMultiplier: 5,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 20,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_super_',
    catThumb: 'results_turquoise_cat',
    catName:names[data.length],
    cost: 5000
})

data.push(
{
    catID: 3,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 5000,
    amountToAutoCollect: 400,
    pointsMultiplier: 7,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_business_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 500000
})
data.push(
{
    catID: 4,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 12500,
    amountToAutoCollect: 400,
    pointsMultiplier: 9,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_bowie_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 5000000
})
data.push(
{
    catID: 5,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 20000,
    amountToAutoCollect: 400,
    pointsMultiplier: 11,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_ufo_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 50000000
})
data.push(
{
    catID: 6,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 50000,
    amountToAutoCollect: 400,
    pointsMultiplier: 15,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_pink_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 500000000
})
data.push(
{
    catID: 7,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 75000,
    amountToAutoCollect: 400,
    pointsMultiplier: 20,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_pink_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 750000000
})
data.push(
{
    catID: 8,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 100000,
    amountToAutoCollect: 400,
    pointsMultiplier: 30,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_pink_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 1000000000
})
data.push(
{
    catID: 9,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 130000,
    amountToAutoCollect: 400,
    pointsMultiplier: 40,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_pink_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 300000000000
})

data.push(
{
    catID: 10,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 180000,
    amountToAutoCollect: 400,
    pointsMultiplier: 55,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_pink_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 8000000000000
})

data.push(
{
    catID: 11,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 500000,
    amountToAutoCollect: 400,
    pointsMultiplier: 70,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_pink_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 25000000000000
})

data.push(
{
    catID: 12,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 700000,
    amountToAutoCollect: 400,
    pointsMultiplier: 90,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_pink_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 550000000000000
})

data.push(
{
    catID: 13,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 1000000,
    amountToAutoCollect: 400,
    pointsMultiplier: 100,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_pink_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 7500000000000000
})

data.push(
{
    catID: 14,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 2000000,
    amountToAutoCollect: 400,
    pointsMultiplier: 150,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_pink_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 850000000000000000
})

data.push(
{
    catID: 15,
    collected: 0,
    active: false,
    canBeActive: false,
    isAuto: false,
    autoCollectPrice: 1000000,
    amountToAutoCollect: 400,
    pointsMultiplier: 1750,
    collectedMultiplier: 0,
    maxCollectedMultiplier: 30,
    limitCatsToMultiply: 1500,
    catSrc:images[data.length],// 'cat_pink_',
    catThumb: 'results_yellow_cat',
    catName:names[data.length],
    cost: 1500000000000000000
})

// data.push(
// {
//     catID: 16,
//     collected: 0,
//     active: false,
//     canBeActive: false,
//     isAuto: false,
//     autoCollectPrice: 2000000,
//     amountToAutoCollect: 400,
//     pointsMultiplier: 200,
//     collectedMultiplier: 0,
//     maxCollectedMultiplier: 30,
//     limitCatsToMultiply: 1500,
//     catSrc:images[data.length],// 'cat_pink_',
//     catThumb: 'results_yellow_cat',
//     catName:names[data.length],
//     cost: 150000000000000000000
// })

export default data;