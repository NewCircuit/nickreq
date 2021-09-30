import { Pool } from 'pg';

import Config from './config';

const config = Config.getConfig();

const pool = new Pool({
  user: config.database.username,
  password: config.database.password,
  host: config.database.host,
  port: config.database.port,
  database: config.database.dbname,
});

export default class DB {
  static async check(userid: string): Promise<Array<Record<string, unknown>>> {
    const results = await pool.query('SELECT * FROM nickreq.requests WHERE user_id = $1 AND state IS NULL', [userid]);
    return results.rows;
  }

  static async insert(userid: string, nickname: string): Promise<Array<Record<string, unknown>>> {
    const results = await pool.query('INSERT INTO nickreq.requests(user_id,nick) VALUES ($1 , $2)', [userid, nickname]);
    return results.rows;
  }

  static async accept(userid: string): Promise<Array<Record<string, unknown>>> {
    const results = await pool.query('UPDATE nickreq.requests SET state = $1 WHERE user_id = $2 AND state IS NULL', [1, userid]);
    return results.rows;
  }

  static async reject(userid: string): Promise<Array<Record<string, unknown>>> {
    const results = await pool.query('UPDATE nickreq.requests SET state = $1 WHERE user_id = $2 AND state IS NULL', [0, userid]);
    return results.rows;
  }
}
