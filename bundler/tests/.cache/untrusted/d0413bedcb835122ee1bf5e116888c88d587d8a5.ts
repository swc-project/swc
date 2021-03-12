// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/seed/Seeder.js


// Seeder
// -------

import * as path from "../deps/path/mod.ts";
import _ from '../deps/lodash@4.17.15/index.js';
const extend = _.extend;
const includes = _.includes;
import { readdir, ensureDirectoryExists } from '../util/fs.js';
import { writeJsFileUsingTemplate } from '../util/template.js';

// The new seeds we're performing, typically called from the `knex.seed`
// interface on the main `knex` object. Passes the `knex` instance performing
// the seeds.
class Seeder {
  constructor(knex) {
    this.knex = knex;
    this.config = this.setConfig(knex.client.config.seeds);
  }

  // Runs seed files for the given environment.
  async run(config) {
    this.config = this.setConfig(config);
    const all = await this._listAll();
    const files =
      config && config.specific
        ? all.filter((file) => file === config.specific)
        : all;
    return this._runSeeds(files);
  }

  // Creates a new seed file, with a given name.
  async make(name, config) {
    this.config = this.setConfig(config);
    if (!name)
      throw new Error('A name must be specified for the generated seed');
    await this._ensureFolder(config);
    const seedPath = await this._writeNewSeed(name);
    return seedPath;
  }

  // Lists all available seed files as a sorted array.
  async _listAll(config) {
    this.config = this.setConfig(config);
    const loadExtensions = this.config.loadExtensions;
    return readdir(this._absoluteConfigDir()).then((seeds) =>
      seeds
        .filter((value) => {
          const extension = path.extname(value);
          return includes(loadExtensions, extension);
        })
        .sort()
    );
  }

  // Ensures a folder for the seeds exist, dependent on the
  // seed config settings.
  async _ensureFolder() {
    const dir = this._absoluteConfigDir();

    await ensureDirectoryExists(dir);
  }

  // Run seed files, in sequence.
  _runSeeds(seeds) {
    seeds.forEach((seed) => this._validateSeedStructure(seed));
    return this._waterfallBatch(seeds);
  }

  // Validates seed files by requiring and checking for a `seed` function.
  _validateSeedStructure(name) {
    const seed = require(path.join(this._absoluteConfigDir(), name));
    if (typeof seed.seed !== 'function') {
      throw new Error(`Invalid seed file: ${name} must have a seed function`);
    }
    return name;
  }

  _getStubPath() {
    return (
      this.config.stub ||
      path.join(__dirname, 'stub', this.config.extension + '.stub')
    );
  }

  _getNewStubFileName(name) {
    if (name[0] === '-') name = name.slice(1);
    return name + '.' + this.config.extension;
  }

  _getNewStubFilePath(name) {
    return path.join(this._absoluteConfigDir(), this._getNewStubFileName(name));
  }

  // Write a new seed to disk, using the config and generated filename,
  // passing any `variables` given in the config to the template.
  async _writeNewSeed(name) {
    const seedPath = this._getNewStubFilePath(name);
    await writeJsFileUsingTemplate(
      seedPath,
      this._getStubPath(),
      { variable: 'd' },
      this.config.variables || {}
    );
    return seedPath;
  }

  // Runs a batch of seed files.
  async _waterfallBatch(seeds) {
    const { knex } = this;
    const seedDirectory = this._absoluteConfigDir();
    const log = [];
    for (const seedName of seeds) {
      const seedPath = path.join(seedDirectory, seedName);
      const seed = require(seedPath);
      try {
        await seed.seed(knex);
        log.push(seedPath);
      } catch (originalError) {
        const error = new Error(
          `Error while executing "${seedPath}" seed: ${originalError.message}`
        );
        error.original = originalError;
        error.stack =
          error.stack.split('\n').slice(0, 2).join('\n') +
          '\n' +
          originalError.stack;
        throw error;
      }
    }
    return [log];
  }

  _absoluteConfigDir() {
    return path.resolve(process.cwd(), this.config.directory);
  }

  setConfig(config) {
    return extend(
      {
        extension: 'js',
        directory: './seeds',
        loadExtensions: [
          '.co',
          '.coffee',
          '.eg',
          '.iced',
          '.js',
          '.litcoffee',
          '.ls',
          '.ts',
        ],
      },
      this.config || {},
      config
    );
  }
}

export default Seeder;
