const Sequelize = require('sequelize');												// Get the sequelize module for databases
const Table = require('table');														// Get the table module for pretty print

const commands = ['create', 'edit', 'display']

async function executeCommand(commandArgs, message) {
    const commandArray = commandArgs.split(' ');
    const command = commandArray.shift();
    const index = commands.indexOf(command);
    
    switch(index) {
        case 0:
            return await createCharacter(commandArray.join(' '), message);
        case 1:
            return await editCharacter(commandArray.join(' '));
        case 2:
            return await displayCharacters(commandArray.join(' '));
    }
}

const sequelize = new Sequelize({													// Connect to DB
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
	define: {
        timestamps: false
    },
});

/* 
 * CREATE TABLE characters(
 * name STRING,
 * race STRING,
 * subrace STRING
 * );
 */
const Characters = sequelize.define('characters', {
	name: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		primaryKey: true,
	},
	race: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	subrace: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	player: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

async function createCharacter(commandArgs, message) {
    const splitArgs = commandArgs.split(' ');
    const charName = splitArgs.shift();
    const charRace = splitArgs.shift();
    const charSubrace = splitArgs.shift();

    try {
        // INSERT INTO characters (name, race, subrace) values (?, ?, ?);
        const char = await Characters.create({
            name: charName,
            race: charRace,
            subrace: charSubrace,
            player: message.author.username,
        });
        return `Character ${char.name} added.`;
    }
    catch (e) {
        return 'ERROR: Adding a character. (' + e + ')';
    }
}

async function editCharacter(commandArgs) {
    const splitArgs = commandArgs.split(' ');
    const charName = splitArgs.shift();
    const charRace = splitArgs.shift();
    const charSubrace = splitArgs.shift();

    // UPDATE characters (race, subrace) values (?, ?) WHERE name='?';
    const affectedRows = await Characters.update(
        { 
            race: charRace,
            subrace: charSubrace, 
        }, 
        { 
            where: { 
                name: charName,
            } 
        });
    if (affectedRows > 0) {
        return `Character ${charName} was edited.`;
    }
    return `No character with name ${charName}.`;
}

async function displayCharacters(commandArgs) {
    if(commandArgs) {
        const charName = commandArgs;
        // SELECT * FROM characters WHERE name = 'charName' LIMIT 1;
        const char = await Characters.findOne({ where: { name: charName } });
        if (char) {
            const charData = [
                ['Name', 'Race', 'Subrace', 'Player'],
                [charName, char.race, char.subrace, char.player]
            ];
            const config = {
                drawHorizontalLine: (index, size) => {
                  return index === 0 || index === 1 || index === size;
                }
              }; 
            const output = Table.table(charData, config);

            return '```' + output + '```';
        }
        return `Could not find character: ${charName}`;
    }
    else {
        // SELECT * FROM characters;
        const charList = await Characters.findAll();
        const charData = charList.map(t => 
            [t.name, t.race, t.subrace, t.player]);
        charData.unshift(['Name', 'Race', 'Subrace', 'Player']);
        
        const config = {
            drawHorizontalLine: (index, size) => {
              return index === 0 || index === 1 || index === size;
            }
          }; 

        const output = Table.table(charData, config);

        return '```' + output + '```';
    }
}

module.exports = {
    commands,
    executeCommand,
    Characters
}