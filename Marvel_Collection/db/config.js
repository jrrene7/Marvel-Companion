const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const sqlite = new DatabaseSync(path.join(__dirname, 'marvel_companion.db'));

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
sqlite.exec(schema);

function params(p) {
  if (p === undefined || p === null) return [];
  return Array.isArray(p) ? p : [p];
}

const db = {
  one: (sql, p) => {
    const row = sqlite.prepare(sql).get(...params(p));
    if (!row) return Promise.reject(new Error('No data returned from query'));
    return Promise.resolve(row);
  },
  oneOrNone: (sql, p) => {
    const row = sqlite.prepare(sql).get(...params(p));
    return Promise.resolve(row || null);
  },
  any: (sql, p) => {
    const rows = sqlite.prepare(sql).all(...params(p));
    return Promise.resolve(rows);
  },
  none: (sql, p) => {
    sqlite.prepare(sql).run(...params(p));
    return Promise.resolve();
  }
};

module.exports = db;
