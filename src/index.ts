const commando = require('discord.js-commando');
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const fileContents = fs.readFileSync('./config.yml', 'utf8');
const config = yaml.load(fileContents);

const client = new commando.CommandoClient({
  commandPrefix: '.nick ',
  owner: config.ownerid,
});
require('discord-buttons')(client);
const db = require('./db.js').default;

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

client.on('clickButton', async (button) => {
  if (button.message.author.id != config.botId) {
    await button.defer();
    return;
  }
  await button.message.edit({
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
    await db.accept(user.id);
  } else {
    await db.reject(user.id);
  }
  try {
    await user.send(`<@${user.id}>, your nickname ${nickname} has been ${button.id}.`);
  } catch {}
});

client.registry.registerGroup('nickreq', 'nickreq commands')
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token);
