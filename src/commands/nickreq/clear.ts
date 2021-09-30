import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { User } from 'discord.js';
import DB from '../../db';

export default class NickReq extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'clear',
      group: 'nickreq',
      memberName: 'clear',
      description: 'Clear a user\'s nickname request.',
      guildOnly: true,
      examples: ['clear <user>'],
      args: [
        {
          key: 'user',
          prompt: 'No user provided, please provide a user.',
          type: 'user',
        },
      ],
    });
  }

  async run(message: CommandoMessage, { user }: { user: User }): Promise<null> {
    await DB.reject(user.id);
    await message.reply(`Cleared ${user.tag}'s current nickname requests.`);
    return null;
  }
}
