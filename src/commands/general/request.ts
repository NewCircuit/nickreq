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
    
  const UserRes = new MessageEmbed();
  UserRes.title = "Nickname Request";
  UserRes.description = nickname;
  UserRes.footer = {
    text: 'Request sent!',
    iconURL: 'https://brianmunoz.co/pewdiepie/images/pew-thumbsup.png',
  };
  UserRes.color = 0x62bd0d;
  UserRes.author = {
    name: 'Success!',
    iconURL: '',
  };

    const channelMsg = await msg.channel.send({embed: UserRes});
  await channelMsg.react('👍');


   
   if  (process.env.CHANNEL_ID === undefined) {
    return null
    
  }

  const channel = (await this.client.channels.fetch(process.env.CHANNEL_ID)) as TextChannel;
  

  const reqEmbed = new MessageEmbed();
  reqEmbed.setTitle("Nickname Request")
  reqEmbed.setDescription(`Is this ${nickname} appropiate for ${msg.author.username}? `)
  reqEmbed.setColor('0x62bd0d')
  reqEmbed.footer = {
    text: "React Thumbs up if the nickname should be accepted and thumbs down for the nickname not to be accepted.",
    iconURL: "https://emoji.gg/assets/emoji/1779_check.png",
  };
  


if  (process.env.CHANNEL_ID === undefined) {
return null

}
  const ChannelMsg = await channel.send({embed: reqEmbed});  
  await ChannelMsg.react('👍');  

  


return null;

}
}
