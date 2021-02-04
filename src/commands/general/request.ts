import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class Request extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      description: '',
      group: '',
      memberName: '',
      name: '',
    });
  }

  public async run(msg: CommandoMessage): Promise<null> {
    return null;
  }
}
