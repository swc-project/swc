// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/migrate/configuration-merger.js


import { FsMigrations, DEFAULT_LOAD_EXTENSIONS } from './sources/fs-migrations.js';

const CONFIG_DEFAULT = Object.freeze({
  extension: 'js',
  loadExtensions: DEFAULT_LOAD_EXTENSIONS,
  tableName: 'knex_migrations',
  schemaName: null,
  directory: './migrations',
  disableTransactions: false,
  disableMigrationsListValidation: false,
  sortDirsSeparately: false,
});

export function getMergedConfig(config, currentConfig) {
  // config is the user specified config, mergedConfig has defaults and current config
  // applied to it.
  const mergedConfig = Object.assign(
    {},
    CONFIG_DEFAULT,
    currentConfig || {},
    config
  );

  if (
    config &&
    // If user specifies any FS related config,
    // clear existing FsMigrations migrationSource
    (config.directory ||
      config.sortDirsSeparately !== undefined ||
      config.loadExtensions)
  ) {
    mergedConfig.migrationSource = null;
  }

  // If the user has not specified any configs, we need to
  // default to fs migrations to maintain compatibility
  if (!mergedConfig.migrationSource) {
    mergedConfig.migrationSource = new FsMigrations(
      mergedConfig.directory,
      mergedConfig.sortDirsSeparately,
      mergedConfig.loadExtensions
    );
  }

  return mergedConfig;
}

export default {
  getMergedConfig,
};
