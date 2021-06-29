const commando = require("discord.js-commando");
const discord = require("discord.js");
const { MessageButton, MessageActionRow } = require('discord-buttons');
let config = require('../../../config.json');
let db = require("../../db.js");

module.exports = class nickReq extends commando.Command {

	constructor(client) {
		super(client , {
			name: 'request',
			group: 'nickreq',
			memberName: 'request',
			description: 'Main Nickname Request commands',
			argstype: 'single'
		})
	}
	async run(message, args) {
		if (message.guild == null) return
		if (args.length > 32) {
			return await message.reply("The nickname must be less than 32 characters");
		}
		if (args.length < 1) {
			return await message.reply("No nickname provided.");
		}


		let re = /^[\\x00-\\x7F]/
		let testx = re.test(args)
		if (testx===true) {
			return await message.send("Illegal charecters in nickname!");
		}

		const check = await db.check(message.author.id);
		if (check.length != 0) {
			return await message.reply("You already have an ongoing request!")
		} else {
			await db.insert(message.author.id,args)
		}

		const channel = await message.guild.channels.cache.get(config.channelid);

		let embed = new discord.MessageEmbed({
			title: "Nickname Request",
			description: `I would like to set my nickname to: ${args}`,
			color: config.color,
			author: {
				name: `${message.author.username}#${message.author.discriminator}`,
				iconURL: message.author.avatarURL()
			},
			footer: {text: message.author.id}
		})
		let button1 = new MessageButton()
				.setLabel("Accept")
		    .setStyle("green")
		    .setID("Accepted");
		let button2 = new MessageButton()
				.setLabel("Reject")
		    .setStyle("red")
		    .setID("Rejected");
		let row = new MessageActionRow()
		  .addComponent(button1)
		  .addComponent(button2);
		await channel.send({
			embed: embed,
			component: row
		});
		await message.reply("Request sent.")

	}
}