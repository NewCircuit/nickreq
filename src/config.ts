import { readFileSync, existsSync } from 'fs';
import { load } from 'js-yaml';

export default class Config {
    public readonly token: string;
    public readonly channelid: string;
    public readonly color: number;
    public readonly ownerid: string;
    public readonly pgusername: string;
    public readonly pgpassword: string;
    public readonly pghost: string;
    public readonly pgport: number;
    public readonly pgdbname: string;
    private static LOCATION = './config.yml';

    constructor() {
      this.token = '';
      this.channelid = '';
      this.color = 0;
      this.ownerid = '';
      this.pgusername = '';
      this.pgpassword = '';
      this.pghost = '';
      this.pgport = 0;
      this.pgdbname = '';
    }


    public static getConfig(): Config {
      if (!existsSync(Config.LOCATION)) {
        throw new Error('Please create a config.yml');
      }

      const fileContents = readFileSync(
        Config.LOCATION,
        'utf-8',
      );
      const casted = load(fileContents) as Config;
      return casted;
    }

}