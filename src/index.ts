const commando = require('discord.js-commando');
import { join } from 'path';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import DB from './db.js';


const file = readFileSync('./config.yml', 'utf8');
const config: any = load(file)!;

const client = new commando.CommandoClient({
  commandPrefix: '.nick ',
  owner: config.ownerid,
});


require('discord-buttons')(client);

client.on('ready', () => {
  for (const item in config) {
    if (config[item] === null) {
      throw Error(`${item} Has not been set in config!`);
    }
    if (item === 'postgres') {
      for (const item2 in config[item]) {
        if (config[item][item2] === null) {
          throw Error(`${item2} Has not been set in config!`);
        }
      }
    }
  }
  console.log('Started.');
});

client.on('clickButton', async (button: any) => {
  await button.reply.defer();
  if (button.message.author.id != config.botId) {
    return;
  }
  await button.message.edit({
    type: 1,
    embed: {
      title: 'Nickname request',
      description: button.message.embeds[0].description,
      fields: [
        { name: button.id, value: `By ${button.clicker.user.username}#${button.clicker.user.discriminator} (<@${button.clicker.user.id}>)` },
      ],
      color: 0x20d84e,
      author: { name: button.message.embeds[0].author.name, iconURL: button.message.embeds[0].author.iconURL },
      footer: button.message.embeds[0].footer,
    },
    components: [
            {
              type: 2,
              style: 3,
              label: 'Accept',
              emoji: undefined,
              disabled: true,
              url: undefined,
              custom_id: 'Accepted'
            },
            {
              type: 2,
              style: 4,
              label: 'Reject',
              emoji: undefined,
              disabled: true,
              url: undefined,
              custom_id: 'Rejected'
            }
          ],
  });
  const user = await button.guild.members.fetch(button.message.embeds[0].footer.text);
  const arrnickname = [...button.message.embeds[0].description.split(': ')];
  arrnickname.shift();
  const nickname = arrnickname.join(': ');
  if (button.id == 'Accepted') {
    try {
      await user.setNickname(nickname);
    } catch (err) {
      await button.message.channel.send(`I am missing permissions to change this users nickname. (${button.message.embeds[0].author.name})`);
    }
    await DB.accept(user.id);
  } else {
    await DB.reject(user.id);
  }
  try {
    await user.send(`<@${user.id}>, your nickname ${nickname} has been ${button.id}.`);
  } catch {}
});

client.registry.registerGroup('nickreq', 'nickreq commands')
.registerDefaults()
.registerCommandsIn(join(__dirname, 'commands'));

client.login(config.token);
