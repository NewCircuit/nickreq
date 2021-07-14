import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { MessageButton, MessageActionRow } from 'discord-buttons';
import DB from '../../db.js';

const fileContents = readFileSync('./config.yml', 'utf8');
const config = load(fileContents);

export default class NickReq extends Command {
  constructor(client: CommandoClient) {
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

  async run(message: CommandoMessage, { nick }: { nick: string }): Promise<null> {
    if (message.guild == null) return null;
    if (nick.length > 32) {
      await message.reply('The nickname must be less than 32 characters');
      return null;
    }

    const re = /^[\\x00-\\x7F]/;
    const testx = re.test(nick);
    if (testx) {
      await message.reply('Illegal charecters in nickname!');
      return null;
    }

    const check = await DB.check(message.author.id);
    if (check.length !== 0) {
      await message.reply('You already have an ongoing request!');
      return null;
    }
    await DB.insert(message.author.id, nick);

    const channel = await this.client.channels.fetch(config.channelid);
    if (channel === undefined || !(channel instanceof TextChannel)) {
      console.error('Unable to fetch channel!');
      return null;
    }

    const embed = new MessageEmbed({
      title: 'Nickname Request',
      description: `I would like to set my nickname to: \`${nick}\``,
      color: config.color,
      author: {
        name: `${message.author.username}#${message.author.discriminator}`,
        iconURL: message.author.avatarURL() || undefined,
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

    return null;
  }
}
