import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { readFileSync, writeFileSync } from 'fs';

export default class NickReq extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'add',
      group: 'nickreq',
      memberName: 'add',
      description: 'Add banned words to the filter.',
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES'],
      examples: ['add word', 'add word1\nword2\nword3'],
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
    const finalStr = wordArray.concat(bannedWords.filter((item) => wordArray.indexOf(item) < 0)).join('\n');
    writeFileSync('bannedwords.txt', finalStr, 'utf8');
    await message.reply('Added words.');
    return null;
  }
}
