/* eslint-disable no-unused-vars */
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { clean } = require('../../functions');

module.exports = {
	name: 'eval',
	category: 'Owner',
	aliases: ['ev'],
	description: 'Evaluate a specified JavaScript code.',
	usage: 'eval <code>',
	userperms: ['BOT_OWNER'],
	botperms: ['USE_EXTERNAL_EMOJIS'],
	run: async (client, message, args) => {
		const url = 'https://hastebin.com/documents';
		const embed = new MessageEmbed()
			.addField('Input', '```js\n' + args.join(' ') + '```');


		const code = args.join(' ');
		if (!code) {
			return message.channel.send(
				'<:vError:725270799124004934> Please provide a valid code.',
			);
		}

		const words = ['secret', 'token', 'process.env', 'config.json'];
		for(const word of words) {
			if (code.replace('\\', '').toLowerCase().includes(word)) {
				embed.setTitle('Error!');
				embed.addField('Output', '```Nice try buddy! What you gonna do with it?```').setColor('GREEN');
				return message.channel.send(embed);
			}
		}

		try {
			const evaled = eval(code);
			const output = clean(evaled);
			if (output.length >= 1024) {
				let response;
				try {
					response = await fetch(url, { method: 'POST', body: output, headers: { 'Content-Type': 'text/plain' } });
				}
				catch (e) {
					return message.channel.send('<:vError:725270799124004934> An error occurred, please try again!');
				}

				const { key } = await response.json();
				embed.addField('Output', `https://hastebin.com/${key}.js`).setColor('GREEN');
			}
			else {
				embed.addField('Output', `\`\`\`js\n${output}\`\`\``).setColor('GREEN');
			}

			embed.setTitle('Success!');
			return message.channel.send(embed);

		}
		catch (error) {
			const err = clean(error);
			if (err.length >= 1024) {
				let response;
				try {
					response = await fetch(url, { method: 'POST', body: err, headers: { 'Content-Type': 'text/plain' } });
				}
				catch (e) {
					return message.channel.send('<:vError:725270799124004934> An error occurred, please try again!');
				}

				const { key } = await response.json();
				embed.addField('Output', `https://hastebin.com/${key}.js`).setColor('RED');
			}
			else {
				embed.addField('Output', `\`\`\`js\n${err}\`\`\``).setColor('RED');
			}

			embed.setTitle('Error!');
			return message.channel.send(embed);
		}
	},
};