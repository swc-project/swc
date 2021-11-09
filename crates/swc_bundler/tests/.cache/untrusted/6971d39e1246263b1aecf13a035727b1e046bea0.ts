// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/util/parse-connection.js


import url from '../deps/@jspm/core@1.1.0/nodelibs/url.js';
import parse from '../deps/pg-connection-string@2.2.0/index.js';
const parsePG = parse;
const isWindows = Deno.build.os === 'win';

export default function parseConnectionString(str) {
  const parsed = url.parse(str, true);
  let { protocol } = parsed;
  const isDriveLetter = isWindows && protocol && protocol.length === 2;
  if (protocol === null || isDriveLetter) {
    return {
      client: 'sqlite3',
      connection: {
        filename: str,
      },
    };
  }
  if (protocol.slice(-1) === ':') {
    protocol = protocol.slice(0, -1);
  }

  const isPG = ['postgresql', 'postgres'].includes(protocol);

  return {
    client: protocol,
    connection: isPG ? parsePG(str) : connectionObject(parsed),
  };
};

function connectionObject(parsed) {
  const connection = {};
  let db = parsed.pathname;
  if (db[0] === '/') {
    db = db.slice(1);
  }

  connection.database = db;

  if (parsed.hostname) {
    if (parsed.protocol.indexOf('mssql') === 0) {
      connection.server = parsed.hostname;
    } else {
      connection.host = parsed.hostname;
    }
  }
  if (parsed.port) {
    connection.port = parsed.port;
  }
  if (parsed.auth) {
    const idx = parsed.auth.indexOf(':');
    if (idx !== -1) {
      connection.user = parsed.auth.slice(0, idx);
      if (idx < parsed.auth.length - 1) {
        connection.password = parsed.auth.slice(idx + 1);
      }
    } else {
      connection.user = parsed.auth;
    }
  }
  if (parsed.query) {
    for (const key in parsed.query) {
      connection[key] = parsed.query[key];
    }
  }
  return connection;
}
