import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

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

  public async run(msg: CommandoMessage): Promise<null> {
    return null;
  }
}
