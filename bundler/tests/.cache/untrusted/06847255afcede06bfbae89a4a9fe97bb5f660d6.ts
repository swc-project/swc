// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/migrate/MigrationGenerator.js


import * as path from "../deps/path/mod.ts";
import { writeJsFileUsingTemplate } from '../util/template.js';
import { getMergedConfig } from './configuration-merger.js';
import { ensureDirectoryExists } from '../util/fs.js';

class MigrationGenerator {
  constructor(migrationConfig) {
    this.config = getMergedConfig(migrationConfig);
  }

  // Creates a new migration, with a given name.
  async make(name, config) {
    this.config = getMergedConfig(config, this.config);
    if (!name) {
      return Promise.reject(
        new Error('A name must be specified for the generated migration')
      );
    }
    await this._ensureFolder();
    const createdMigrationFilePath = await this._writeNewMigration(name);
    return createdMigrationFilePath;
  }

  // Ensures a folder for the migrations exist, dependent on the migration
  // config settings.
  _ensureFolder() {
    const dirs = this._absoluteConfigDirs();

    const promises = dirs.map(ensureDirectoryExists);

    return Promise.all(promises);
  }

  _getStubPath() {
    return (
      this.config.stub ||
      path.join(__dirname, 'stub', this.config.extension + '.stub')
    );
  }

  _getNewMigrationName(name) {
    if (name[0] === '-') name = name.slice(1);
    return yyyymmddhhmmss() + '_' + name + '.' + this.config.extension;
  }

  _getNewMigrationPath(name) {
    const fileName = this._getNewMigrationName(name);
    const dirs = this._absoluteConfigDirs();
    const dir = dirs.slice(-1)[0]; // Get last specified directory
    return path.join(dir, fileName);
  }

  // Write a new migration to disk, using the config and generated filename,
  // passing any `variables` given in the config to the template.
  async _writeNewMigration(name) {
    const migrationPath = this._getNewMigrationPath(name);
    await writeJsFileUsingTemplate(
      migrationPath,
      this._getStubPath(),
      { variable: 'd' },
      this.config.variables || {}
    );
    return migrationPath;
  }

  _absoluteConfigDirs() {
    const directories = Array.isArray(this.config.directory)
      ? this.config.directory
      : [this.config.directory];
    return directories.map((directory) => {
      if (!directory) {
        // eslint-disable-next-line no-console
        console.warn(
          'Failed to resolve config file, knex cannot determine where to generate migrations'
        );
      }
      return path.resolve(process.cwd(), directory);
    });
  }
}

// Ensure that we have 2 places for each of the date segments.
function padDate(segment) {
  segment = segment.toString();
  return segment[1] ? segment : `0${segment}`;
}

// Get a date object in the correct format, without requiring a full out library
// like "moment.js".
function yyyymmddhhmmss() {
  const d = new Date();
  return (
    d.getFullYear().toString() +
    padDate(d.getMonth() + 1) +
    padDate(d.getDate()) +
    padDate(d.getHours()) +
    padDate(d.getMinutes()) +
    padDate(d.getSeconds())
  );
}

export default MigrationGenerator;
