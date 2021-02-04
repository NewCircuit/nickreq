import { CommandoClient } from 'discord.js-commando';
import path from 'path';

const client = new CommandoClient({
  commandPrefix: '.nick',
});

client.on('ready', () => {
  console.log(`Ready as ${client.user?.tag}`);
});

client.registry
  .registerGroups([
    ['general'],
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login('');
