import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class NickReq extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'list',
      group: 'nickreq',
      memberName: 'list',
      description: 'List all banned words.',
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES'],
    });
  }

  async run(message: CommandoMessage): Promise<null> {
    await message.reply('Here is a file with all the banned words in nicknames.', {
      files: ['./bannedwords.txt'],
    });
    return null;
  }
}
