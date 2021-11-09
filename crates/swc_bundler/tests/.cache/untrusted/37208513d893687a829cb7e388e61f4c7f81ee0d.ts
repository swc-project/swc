// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/migrate/migration-list-resolver.js


import { getTableName } from './table-resolver.js';
import { ensureTable } from './table-creator.js';

// Lists all available migration versions, as a sorted array.
function listAll(migrationSource, loadExtensions) {
  return migrationSource.getMigrations(loadExtensions);
}

// Lists all migrations that have been completed for the current db, as an
// array.
function listCompleted(tableName, schemaName, trxOrKnex) {
  return ensureTable(tableName, schemaName, trxOrKnex)
    .then(() =>
      trxOrKnex
        .from(getTableName(tableName, schemaName))
        .orderBy('id')
        .select('name')
    )
    .then((migrations) =>
      migrations.map((migration) => {
        return migration.name;
      })
    );
}

// Gets the migration list from the migration directory specified in config, as well as
// the list of completed migrations to check what should be run.
function listAllAndCompleted(config, trxOrKnex) {
  return Promise.all([
    listAll(config.migrationSource, config.loadExtensions),
    listCompleted(config.tableName, config.schemaName, trxOrKnex),
  ]);
}

export default {
  listAll,
  listAllAndCompleted,
  listCompleted,
};
