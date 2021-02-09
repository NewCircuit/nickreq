import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import dotenv from 'dotenv';
import { MessageEmbed } from 'discord.js';

dotenv.config();

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


 

client.login(process.env.DISCORD_TOKEN);
