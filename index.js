const Discord = require('discord.js');												// Get the discord.js module
const config = require('./config.json');											// Get the config data
const Characters = require('./characters.js');
const Stats = require('./stats.js');
const Dice = require('./dice.js');
const Minesweeper = require('./minesweeper.js')

const client = new Discord.Client();												// create a new Discord client

client.login(config.token);															// login to Discord with your app's token

client.once('ready', () => {														// when the client is ready, run this code
	console.log('Bot Started.');													// Print that we have started

	Characters.Characters.sync();
	Stats.Stats.sync();
});


client.on('message', async message => {
	if (!message.content.startsWith(config.prefix)) {
		return;
	}

	const args = message.content.slice(config.prefix.length).split(/ +/);			// All the arguments passed in
	const command = args.shift().toLowerCase();										// First argument is the command
	const commandArgs = args.join(' ')												// Rejoin all the arguments for the command to be parsed inside statements

	let output;

	switch(command) {
		case 'test':
			return message.channel.send('The bot is alive.');
			break;
		case 'minesweeper':
			let commands = commandArgs.split(' ')
			let size = parseInt(commands[0])
			if (isNaN(size) || size < 2 || size > 8) {
				return message.reply("You must provide a valid number between 2 and 8.");
			}
			else if (commands.length > 1) {
				return message.reply("Too many arguments passed in.");
			}
			else {
				let Board = Minesweeper.CreateBoard(size);
				return message.channel.send(`${Board.String}(${Board.Count} bombs)`);
			}
			break;
		case 'characters':
			output = await Characters.executeCommand(commandArgs, message);
			return message.channel.send(output);
			break;
		case 'stats':
			output = await Stats.executeCommand(commandArgs);
			return message.channel.send(output);
			break;
		case 'roll':
			output = await Dice.executeCommand(command, commandArgs);
			return message.channel.send(output);
			break;
	}
});