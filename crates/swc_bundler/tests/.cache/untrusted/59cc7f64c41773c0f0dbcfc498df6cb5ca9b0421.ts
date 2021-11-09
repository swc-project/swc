// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/migrate/table-creator.js


import {
  getTable,
  getLockTableName,
  getLockTableNameWithSchema,
  getTableName,
} from './table-resolver.js';

export function ensureTable(tableName, schemaName, trxOrKnex) {
  const lockTable = getLockTableName(tableName);
  const lockTableWithSchema = getLockTableNameWithSchema(tableName, schemaName);
  return getSchemaBuilder(trxOrKnex, schemaName)
    .hasTable(tableName)
    .then((exists) => {
      return !exists && _createMigrationTable(tableName, schemaName, trxOrKnex);
    })
    .then(() => {
      return getSchemaBuilder(trxOrKnex, schemaName).hasTable(lockTable);
    })
    .then((exists) => {
      return (
        !exists && _createMigrationLockTable(lockTable, schemaName, trxOrKnex)
      );
    })
    .then(() => {
      return getTable(trxOrKnex, lockTable, schemaName).select('*');
    })
    .then((data) => {
      return (
        !data.length &&
        trxOrKnex.into(lockTableWithSchema).insert({ is_locked: 0 })
      );
    });
}

function _createMigrationTable(tableName, schemaName, trxOrKnex) {
  return getSchemaBuilder(trxOrKnex, schemaName).createTable(
    getTableName(tableName),
    function (t) {
      t.increments();
      t.string('name');
      t.integer('batch');
      t.timestamp('migration_time');
    }
  );
}

function _createMigrationLockTable(tableName, schemaName, trxOrKnex) {
  return getSchemaBuilder(trxOrKnex, schemaName).createTable(
    tableName,
    function (t) {
      t.increments('index').primary();
      t.integer('is_locked');
    }
  );
}

//Get schema-aware schema builder for a given schema nam
export function getSchemaBuilder(trxOrKnex, schemaName) {
  return schemaName
    ? trxOrKnex.schema.withSchema(schemaName)
    : trxOrKnex.schema;
}

export default {
  ensureTable,
  getSchemaBuilder,
};
