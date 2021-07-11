import { Pool } from 'pg';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';

const fileContents = readFileSync('./config.yml', 'utf8');
const config = load(fileContents);

const pool = new Pool({
  user: config.postgres.username,
  password: config.postgres.password,
  host: config.postgres.host,
  port: config.postgres.port,
  database: config.postgres.dbname,
});


export default class DB {
  static async check(userid: String) {
    const results = await pool.query('SELECT * FROM nickreq WHERE user_id = $1 AND state IS NULL', [userid]);
    return results.rows;
  }

  static async insert(userid: String, nickname: String) {
    const results = await pool.query('INSERT INTO nickreq(user_id,nick) VALUES ($1 , $2)', [userid, nickname]);
    return results.rows;
  }

  static async accept(userid: String) {
    const results = await pool.query('UPDATE nickreq SET state=$1 WHERE user_id = $2 AND state IS NULL', [1, userid]);
    return results.rows;
  }

  static async reject(userid: String) {
    const results = await pool.query('UPDATE nickreq SET state=$1 WHERE user_id = $2 AND state IS NULL', [0, userid]);
    return results.rows;
  }
}
