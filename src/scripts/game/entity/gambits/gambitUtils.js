export default
    {
        getGambitVerbose(gambitData) {
            console.log(gambitData)
            let gambits = []
            gambitData.forEach(element => {
                gambits.push(this.extractGambit(element));
            });

            return gambits;
        },
        extractGambit(gambit) {

            let target = (gambit.target == 'opposite'?'enemy' : 'ally') + '';
            let condition = 'any '
            let action = ' standard weapon attack '

            if (gambit.data) {
                if (gambit.data.condition) {
                    condition = gambit.data.condition

                    if (condition == 'less' || condition == 'more') {
                        condition += ' than ' + gambit.data.value + ' hp ';
                    }
                    
                    if (condition == 'highest' || condition == 'lowest') {
                        condition += ' hp ';
                    }
                    
                    if (condition == 'closest' || condition == 'farest') {
                        condition += ' distance ';
                    }
                }
                if (gambit.action) {
                    
                    //console.log(gambit)
                    if (gambit.action.valueType) {
                        action = ' '+ gambit.action.valueType + ' ' + gambit.action.value
                    } else {
                        action = ' standard weapon attack'
                    }
                }
            }

            return [target, condition, action]
        }
    }

