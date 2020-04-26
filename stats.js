const Sequelize = require('sequelize');												// Get the sequelize module for databases
const Table = require('table');														// Get the table module for pretty print



const commands = ['display']

async function executeCommand(commandArgs) {
    const commandArray = commandArgs.split(' ');
    const command = commandArray.shift();
    const index = commands.indexOf(command);
    
    switch(index) {
        case 0:
            return await displayStats(commandArray.join(' '));
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
 * CREATE TABLE stats (
 *      name STRING PRIMARY KEY
 *           UNIQUE
 *           NOT NULL,
 *      strength INTEGER NOT NULL
 *           DEFAULT (0),
 *      finesse INTEGER NOT NULL
 *           DEFAULT (0),
 *      magic INTEGER NOT NULL
 *           DEFAULT (0),
 *      endurance INTEGER NOT NULL
 *           DEFAULT (0),
 *      will INTEGER NOT NULL
 *           DEFAULT (0),
 *      charisma INTEGER NOT NULL
 *           DEFAULT (0) 
 *   );
 */
const Stats = sequelize.define('stats', {
       name: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		primaryKey: true,
	},
	strength: {
		type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
	},
	finesse: {
		type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    magic: {
		type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    endurance: {
		type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    will: {
		type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    charisma: {
		type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
	},
});

async function displayStats(argArray) {
    var statsData;
    if(!argArray[0]) {
        // SELECT * FROM stats;
        statsData = await Stats.findAll();
    }
    else {
        // SELECT * FROM stats WHERE name = argArray[0];
        statsData = await Stats.findAll({ where: { name: argArray[0] } });
        if (!statsData) {
            return `Could not find character: ${argArray[0]}`;
        }
    }
    const statsList = statsData.map(t => 
        [t.name, t.strength, t.finesse, t.magic, t.endurance, t.will, t.charisma]);
    statsList.unshift(['Name', 'Strength', 'Finesse', 'Magic', 'Endurance', 'Will', 'Charisma']);

    const config = {
        drawHorizontalLine: (index, size) => {
          return index === 0 || index === 1 || index === size;
        }
      }; 

    const output = Table.table(statsList, config);

    return '```' + output + '```';
}



module.exports = {
    commands,
    executeCommand,
    Stats
}
