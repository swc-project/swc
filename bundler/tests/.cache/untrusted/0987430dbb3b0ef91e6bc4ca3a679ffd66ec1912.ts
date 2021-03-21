// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/knex.js


import Raw from './raw.js';
import Client from './client.js';
import QueryBuilder from './query/builder.js';
import QueryInterface from './query/methods.js';

import makeKnex from './util/make-knex.js';
import parseConnection from './util/parse-connection.js';
import { KnexTimeoutError } from './util/timeout.js';
import fakeClient from './util/fake-client.js';
import { SUPPORTED_CLIENTS } from './constants.js';
import { resolveClientNameWithAliases } from './helpers.js';

// Importing all dialects as there are no sync imports in ESM. Whenever a new
// dialect is completed, add its import here
import mssqlDialect from './dialects/mssql/index.js';
import mysqlDialect from './dialects/mysql/index.js';
import mysql2Dialect from './dialects/mysql2/index.js';
import oracledbDialect from './dialects/oracledb/index.js';
import postgresDialect from './dialects/postgres/index.js';
import redshiftDialect from './dialects/redshift/index.js';
import sqlite3Dialect from './dialects/sqlite3/index.js';

function Knex(config) {
  // If config is a string, try to parse it
  if (typeof config === 'string') {
    const parsedConfig = Object.assign(parseConnection(config), arguments[2]);
    return new Knex(parsedConfig);
  }

  let Dialect;
  // If user provided no relevant parameters, use generic client
  if (arguments.length === 0 || (!config.client && !config.dialect)) {
    Dialect = Client;
  }

  // If user provided Client constructor as a parameter, use it
  else if (
    typeof config.client === 'function' &&
    config.client.prototype instanceof Client
  ) {
    Dialect = config.client;
  }

  // If neither applies, let's assume user specified name of a client or dialect as a string
  else {
    const clientName = config.client || config.dialect;
    if (!SUPPORTED_CLIENTS.includes(clientName)) {
      throw new Error(
        `knex: Unknown configuration option 'client' value ${clientName}. Note that it is case-sensitive, check documentation for supported values.`
      );
    }

    const resolvedClientName = resolveClientNameWithAliases(clientName);

    // As more dialects are added, add them here.
    switch (resolvedClientName) {
      case 'mssql': 
        Dialect = mssqlDialect;
        break;

      case 'mysql': 
        Dialect = mysqlDialect;
        break;

      case 'mysql2': 
        Dialect = mysql2Dialect;
        break;

      case 'oracledb': 
        Dialect = oracledbDialect;
        break;

      case 'postgres': 
        Dialect = postgresDialect;
        break;

      case 'redshift': 
        Dialect = redshiftDialect;
        break;

      case 'sqlite3': 
        Dialect = sqlite3Dialect;
        break;
    }
  }

  // If config connection parameter is passed as string, try to parse it
  if (typeof config.connection === 'string') {
    config = Object.assign({}, config, {
      connection: parseConnection(config.connection).connection,
    });
  }
  const newKnex = makeKnex(new Dialect(config));
  if (config.userParams) {
    newKnex.userParams = config.userParams;
  }
  return newKnex;
}

// Expose Client on the main Knex namespace.
Knex.Client = Client;

Knex.KnexTimeoutError = KnexTimeoutError;

Knex.QueryBuilder = {
  extend: function (methodName, fn) {
    QueryBuilder.extend(methodName, fn);
    QueryInterface.push(methodName);
  },
};

/* eslint no-console:0 */

// Run a "raw" query, though we can't do anything with it other than put
// it in a query statement.
Knex.raw = (sql, bindings) => {
  console.warn(
    'global Knex.raw is deprecated, use knex.raw (chain off an initialized knex object)'
  );
  return new Raw(fakeClient).set(sql, bindings);
};

export default Knex;
