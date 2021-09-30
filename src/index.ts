import { join } from 'path';
import DB from './db';
import Config from './config';

const commando = require('discord.js-commando');

const config = Config.getConfig();
const client = new commando.CommandoClient({
  commandPrefix: '.nick ',
  owner: config.ownerid,
});

require('discord-buttons')(client);

client.on('ready', () => {
  // eslint-disable-next-line no-console
  console.log('Started.');
});

// eslint-disable-next-line
client.on('clickButton', async (button: any) => {
  await button.reply.defer();
  if (button.message.author.id !== client.user.id) return;
  await button.message.edit({
    type: 1,
    embed: {
      title: 'Nickname request',
      description: button.message.embeds[0].description,
      fields: [
        {
          name: button.id,
          value: `By ${button.clicker.user.username}#${button.clicker.user.discriminator} (<@${button.clicker.user.id}>)`,
        },
      ],
      color: (button.id === 'Accepted') ? 0x00FF00 : 0xFF0000,
      author: {
        name: button.message.embeds[0].author.name,
        iconURL: button.message.embeds[0].author.iconURL,
      },
      footer: button.message.embeds[0].footer,
      timestamp: button.message.embeds[0].timestamp,
    },
    components: [
      {
        type: 2,
        style: 3,
        label: 'Accept',
        emoji: undefined,
        disabled: true,
        url: undefined,
        custom_id: 'Accepted',
      },
      {
        type: 2,
        style: 4,
        label: 'Reject',
        emoji: undefined,
        disabled: true,
        url: undefined,
        custom_id: 'Rejected',
      },
    ],
  });
  const user = await button.guild.members.fetch(button.message.embeds[0].footer.text);
  const arrnickname = [...button.message.embeds[0].description.split(': ')];
  arrnickname.shift();
  const nickname = arrnickname.join(': ');
  if (button.id === 'Accepted') {
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
  } catch {
    console.log(`Unable to dm user: ${user.id}`);
  }
});

client.registry.registerGroup('nickreq', 'nickreq commands')
  .registerDefaults()
  .registerCommandsIn(join(__dirname, 'commands'));

client.login(config.token).catch(console.error);
