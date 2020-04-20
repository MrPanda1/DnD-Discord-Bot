const Discord = require('discord.js');												// Get the discord.js module
const config = require('./config.json');											// Get the config data
const Characters = require('./characters.js');
const Dice = require('./dice.js');

const client = new Discord.Client();												// create a new Discord client

client.login(config.token);															// login to Discord with your app's token

client.once('ready', () => {														// when the client is ready, run this code
	console.log('Bot Started.');													// Print that we have started

	Characters.Characters.sync();
});


client.on('message', async message => {
	if (!message.content.startsWith(config.prefix)) {
		return;
	}

	const args = message.content.slice(config.prefix.length).split(/ +/);			// All the arguments passed in
	const command = args.shift().toLowerCase();										// First argument is the command
	const commandArgs = args.join(' ')												// Rejoin all the arguments for the command to be parsed inside statements

	if (command === 'test') {														// Make sure bot is up and running
		message.channel.send('The bot is alive.');
	}
	else if (Characters.commands.indexOf(command) > -1) {						// All character commands
		const output = await Characters.executeCommand(command, commandArgs)
		return message.channel.send(output)
	}
	else if (Dice.commands.indexOf(command) > -1) {
		const output = await Dice.executeCommand(command, commandArgs);
		return message.channel.send(output)
	}
	
});