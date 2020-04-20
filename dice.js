const commands = ['roll'];

async function executeCommand(command, commandArgs) {
    const index = commands.indexOf(command);

    switch(index) {
        case 0:
            return await rollDice(commandArgs);
    }
}

async function rollDice(commandArgs) {
    const [numOfDice, sidesOfDice] = commandArgs.split('d');
    var output = commandArgs + ' =';
    var sum = 0;
    for (var i = 0; i < numOfDice; i++) {
        const roll = Math.round(Math.random()*(sidesOfDice-1))+1;
        sum += roll;
        output += roll;
        output += (i === numOfDice - 1) ? ' = ' : ' + ';
    }
    output += sum;
    return output;
}

module.exports = {
    commands,
    executeCommand
}