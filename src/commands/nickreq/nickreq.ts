const commando = require('discord.js-commando');
const { MessageButton, MessageActionRow } = require('discord-buttons');
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import Db from '../../db.js';
import { MessageEmbed } from 'discord.js';


const fileContents = readFileSync('./config.yml', 'utf8');
const config = load(fileContents);

export default class NickReq extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'request',
      group: 'nickreq',
      memberName: 'request',
      description: 'Main Nickname Request commands',
      args: [
        {
          key: 'nick',
          prompt: 'No nickname provided, please enter a nickname.',
          type: 'string',
        },
      ],
    });
  }

  async run(message, { nick }) {
    if (message.guild == null) return;
    if (nick.length > 32) {
      await message.reply('The nickname must be less than 32 characters');
      return;
    }

    const re = /^[\\x00-\\x7F]/;
    const testx = re.test(nick);
    if (testx === true) {
      await message.send('Illegal charecters in nickname!');
      return;
    }

    const check = await Db.check(message.author.id);
    if (check.length !== 0) {
      await message.reply('You already have an ongoing request!');
      return;
    }
    await Db.insert(message.author.id, nick);

    const channel = await message.guild.channels.cache.get(config.channelid);

    const embed = new MessageEmbed({
      title: 'Nickname Request',
      description: `I would like to set my nickname to: \`${nick}\``,
      color: config.color,
      author: {
        name: `${message.author.username}#${message.author.discriminator}`,
        iconURL: message.author.avatarURL(),
      },
      footer: { text: message.author.id },
    });
    const button1 = new MessageButton()
    .setLabel('Accept')
    .setStyle('green')
    .setID('Accepted');
    const button2 = new MessageButton()
    .setLabel('Reject')
    .setStyle('red')
    .setID('Rejected');
    const row = new MessageActionRow()
    .addComponent(button1)
    .addComponent(button2);
    await channel.send({
      embed,
      component: row,
    });
    await message.reply('Request sent.');
  }
}
