import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { MessageEmbed, TextChannel } from 'discord.js';


export default class Request extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      description: 'Request a nickname',
      group: 'general',
      memberName: 'request',
      name: 'request',
      args: [
        {
          prompt: 'The nickname to be requested',
          key: 'nickname',
          type: 'string',
        },
      ],
    });
  }

  public async run(msg: CommandoMessage, { nickname }: { nickname: string }): Promise<null> {
    
  const embed = new MessageEmbed();
  embed.title = "Nickname Request";
  embed.description = nickname;
  embed.footer = {
    text: 'Request sent!',
    iconURL: 'https://brianmunoz.co/pewdiepie/images/pew-thumbsup.png',
  };
  embed.color = 0x62bd0d;
  embed.author = {
    name: 'Success!',
    iconURL: '',
  };

    const channelMsg = await msg.channel.send({embed: embed});
  await channelMsg.react('807829322919706624');

  await msg.channel.send(embed);
   console.log("what");
   if  (process.env.CHANNEL_ID === undefined) {
    return null
    
  }

  const channel = await this.client.channels.fetch(process.env.CHANNEL_ID) as TextChannel;


  channel.send ("Request")






    return null;
    
  }
}
