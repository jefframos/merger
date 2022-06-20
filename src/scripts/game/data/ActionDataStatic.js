const data = []
data.push(
{
    id: 0,
    shopType: 'soft',
    type: 'double_points',
    var: 'actionMultiplier',
    shopDesc: 'Multiplies coins earned\nfor rescuing cats for a\nshort period of time',
    default: 1,
    value: 2,    
    icon: 'coin_pig',
    time: 15,
    timeMax: 60,
    level: 1,
    levelMax: 1000,
    active: true,
    waitTime: 300,
    waitTimeMin: 30,
    stats:
    {
        cost:
        {
            typeCurve: 'easeInCirc',
            zero: 50,
            min: 50,
            max: 100000000,
            hideOnShop:true
        },
        value:
        {
            typeCurve: 'linearTween',
            zero: 1.5,
            min: 1.5,
            max: 10,
        },
        cooldown:
        {
            typeCurve: 'linearTween',
            zero: 330,
            min: 330,
            max: 20,
        },
        activeTime:
        {
            typeCurve: 'linearTween',
            zero: 10,
            min: 10,
            max: 60,
        },

    }
});
data.push(
{
    id: 1,
    shopType: 'soft',
    type: 'double_speed',
    var: 'actionSpeed',
    shopDesc: 'Increases the speed of\nthe game for a short\nperiod of time',
    default: 1,
    value: 2,    
    icon: 'rollerskate',
    time: 15,
    timeMax: 60,
    level: 1,
    levelMax: 1000,
    active: true,
    waitTime: 200,
    waitTimeMin: 20,
    stats:
    {
        cost:
        {
            typeCurve: 'easeInCirc',
            zero: 50,
            min: 50,
            max: 100000000,
            hideOnShop:true
        },
        value:
        {
            typeCurve: 'linearTween',
            zero: 1.6,
            min: 1.6,
            max: 3.2,
        },
        cooldown:
        {
            typeCurve: 'linearTween',
            zero: 330,
            min: 330,
            max: 20,
        },
        activeTime:
        {
            typeCurve: 'linearTween',
            zero: 7.5,
            min: 7.5,
            max: 60,
        },


    }
});
data.push(
{
    id: 2,
    shopType: 'soft',
    type: 'auto_collect',
    var: 'actionAutoCollect',
    shopDesc: 'Cats are collected\nautomatically for a short\nperiod of time',
    default: false,
    value: true,    
    icon: 'automate',
    time: 15,
    timeMax: 60,
    level: 1,
    levelMax: 1000,
    active: true,
    waitTime: 100,
    waitTimeMin: 10,
    stats:
    {
        cost:
        {
            typeCurve: 'easeInCirc',
            zero: 50,
            min: 50,
            max: 100000000,
            hideOnShop:true
        },
        value:
        {
            typeCurve: 'linearTween',
            zero: 1,
            min: 1,
            max: 1,
            hideOnShop:true
        },
        cooldown:
        {
            typeCurve: 'linearTween',
            zero: 330,
            min: 330,
            max: 20,
        },
        activeTime:
        {
            typeCurve: 'linearTween',
            zero: 10,
            min: 10,
            max: 45,
        },



    }
});

export default data;