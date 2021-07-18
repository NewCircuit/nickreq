import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

interface Database {
  readonly username: string;
  readonly password: string;
  readonly host: string;
  readonly port: number;
  readonly dbname: string;
}

export default class Config {
  public readonly token: string;

  public readonly channelid: string;

  public readonly color: number;

  public readonly ownerid: string;

  public readonly database: Database;

  private static LOCATION = './config.yml';

  constructor() {
    this.token = '';
    this.channelid = '';
    this.color = 0;
    this.ownerid = '';
    this.database = {
      username: '',
      password: '',
      host: '',
      port: 0,
      dbname: '',
    };
  }

  public static getConfig(): Config {
    if (!existsSync(Config.LOCATION)) {
      throw new Error('Please create a config.yml');
    }

    const fileContents = readFileSync(
      Config.LOCATION,
      'utf-8',
    );
    return load(fileContents) as Config;
  }
}
