import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { readFileSync, writeFileSync } from 'fs';

export default class NickReq extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'remove',
      group: 'nickreq',
      memberName: 'remove',
      description: 'Remove some banned words from the filter.',
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES'],
      examples: ['remove word', 'remove word1\nword2\nword3'],
      args: [
        {
          key: 'words',
          prompt: 'No words provided, please provide words to add.',
          type: 'string',
        },
      ],
    });
  }

  async run(message: CommandoMessage, { words }: { words: string }): Promise<null> {
    const wordArray = words.split('\n').filter((e) => e !== '');
    const bannedWords = readFileSync('./bannedwords.txt', 'utf-8').split('\n').filter((e) => e !== '');
    const finalStr = bannedWords.filter((x) => !wordArray.includes(x)).join('\n');
    writeFileSync('bannedwords.txt', finalStr, 'utf8');
    await message.reply('Removed words.');
    return null;
  }
}
