import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { MessageEmbed, TextChannel } from 'discord.js';
import DB from '../../db.js';

const file = readFileSync('./config.yml', 'utf8');
const config: any = load(file)!;

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

  async run(message: CommandoMessage, { nick }:{ nick: string }): Promise<null> {
    if (message.guild == null) return null;
    if (nick.length > 32) {
      await message.reply('The nickname must be less than 32 characters');
      return null;
    }

    const re = /^[\\x00-\\x7F]/;
    const testx = re.test(nick);
    if (testx === true) {
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
      description: `I would like to set my nickname to: ${nick}`,
      color: config.color,
      author: {
        name: `${message.author.username}#${message.author.discriminator}`,
        iconURL: message.author.avatarURL() || undefined,
      },
      footer: { text: message.author.id },
    });
    const buttonEmbed = {
      type: 1,
      components: [
        {
          type: 2,
          style: 3,
          label: 'Accept',
          emoji: undefined,
          disabled: false,
          url: undefined,
          custom_id: 'Accepted'
        },
        {
          type: 2,
          style: 4,
          label: 'Reject',
          emoji: undefined,
          disabled: false,
          url: undefined,
          custom_id: 'Rejected'
        }
      ],
      embed: embed
    }
    await channel.send(buttonEmbed);
    await message.reply('Request sent.');
    return null;
  }
}
