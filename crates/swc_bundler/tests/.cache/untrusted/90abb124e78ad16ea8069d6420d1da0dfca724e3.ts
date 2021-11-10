// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/migrate/sources/fs-migrations.js


import * as path from "../../deps/path/mod.ts";
import _ from '../../deps/lodash@4.17.15/index.js';
const sortBy = _.sortBy;

import { readdir } from '../../util/fs.js';

export const DEFAULT_LOAD_EXTENSIONS = Object.freeze([
  '.co',
  '.coffee',
  '.eg',
  '.iced',
  '.js',
  '.litcoffee',
  '.ls',
  '.ts',
]);

export class FsMigrations {
  constructor(migrationDirectories, sortDirsSeparately, loadExtensions) {
    this.sortDirsSeparately = sortDirsSeparately;

    if (!Array.isArray(migrationDirectories)) {
      migrationDirectories = [migrationDirectories];
    }
    this.migrationsPaths = migrationDirectories;
    this.loadExtensions = loadExtensions || DEFAULT_LOAD_EXTENSIONS;
  }

  /**
   * Gets the migration names
   * @returns Promise<string[]>
   */
  getMigrations(loadExtensions) {
    // Get a list of files in all specified migration directories
    const readMigrationsPromises = this.migrationsPaths.map((configDir) => {
      const absoluteDir = path.resolve(process.cwd(), configDir);
      return readdir(absoluteDir).then((files) => ({
        files,
        configDir,
        absoluteDir,
      }));
    });

    return Promise.all(readMigrationsPromises).then((allMigrations) => {
      const migrations = allMigrations.reduce((acc, migrationDirectory) => {
        // When true, files inside the folder should be sorted
        if (this.sortDirsSeparately) {
          migrationDirectory.files = migrationDirectory.files.sort();
        }

        migrationDirectory.files.forEach((file) =>
          acc.push({ file, directory: migrationDirectory.configDir })
        );

        return acc;
      }, []);

      // If true we have already sorted the migrations inside the folders
      // return the migrations fully qualified
      if (this.sortDirsSeparately) {
        return filterMigrations(
          this,
          migrations,
          loadExtensions || this.loadExtensions
        );
      }

      return filterMigrations(
        this,
        sortBy(migrations, 'file'),
        loadExtensions || this.loadExtensions
      );
    });
  }

  getMigrationName(migration) {
    return migration.file;
  }

  getMigration(migration) {
    const absoluteDir = path.resolve(process.cwd(), migration.directory);
    return require(path.join(absoluteDir, migration.file));
  }
}

function filterMigrations(migrationSource, migrations, loadExtensions) {
  return migrations.filter((migration) => {
    const migrationName = migrationSource.getMigrationName(migration);
    const extension = path.extname(migrationName);
    return loadExtensions.includes(extension);
  });
}

export default {
  DEFAULT_LOAD_EXTENSIONS,
  FsMigrations,
};
