// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/schema/builder.js


import inherits from '../deps/inherits@2.0.4/inherits.js';
import { EventEmitter } from '../deps/@jspm/core@1.1.0/nodelibs/events.js';
import _ from '../deps/lodash@4.17.15/index.js';
const toArray = _.toArray;
import { addQueryContext } from '../helpers.js';
import saveAsyncStack from '../util/save-async-stack.js';

// Constructor for the builder instance, typically called from
// `knex.builder`, accepting the current `knex` instance,
// and pulling out the `client` and `grammar` from the current
// knex instance.
function SchemaBuilder(client) {
  this.client = client;
  this._sequence = [];

  if (client.config) {
    this._debug = client.config.debug;
    saveAsyncStack(this, 4);
  }
}

inherits(SchemaBuilder, EventEmitter);

// Each of the schema builder methods just add to the
// "_sequence" array for consistency.
[
  'createTable',
  'createTableIfNotExists',
  'createSchema',
  'createSchemaIfNotExists',
  'dropSchema',
  'dropSchemaIfExists',
  'createExtension',
  'createExtensionIfNotExists',
  'dropExtension',
  'dropExtensionIfExists',
  'table',
  'alterTable',
  'hasTable',
  'hasColumn',
  'dropTable',
  'renameTable',
  'dropTableIfExists',
  'raw',
].forEach(function (method) {
  SchemaBuilder.prototype[method] = function () {
    if (method === 'createTableIfNotExists') {
      this.client.logger.warn(
        [
          'Use async .hasTable to check if table exists and then use plain .createTable. Since ',
          '.createTableIfNotExists actually just generates plain "CREATE TABLE IF NOT EXIST..." ',
          'query it will not work correctly if there are any alter table queries generated for ',
          'columns afterwards. To not break old migrations this function is left untouched for now',
          ', but it should not be used when writing new code and it is removed from documentation.',
        ].join('')
      );
    }
    if (method === 'table') method = 'alterTable';
    this._sequence.push({
      method,
      args: toArray(arguments),
    });
    return this;
  };
});

import interfacelib from '../interface.js';
interfacelib(SchemaBuilder);
addQueryContext(SchemaBuilder);

SchemaBuilder.prototype.withSchema = function (schemaName) {
  this._schema = schemaName;
  return this;
};

SchemaBuilder.prototype.toString = function () {
  return this.toQuery();
};

SchemaBuilder.prototype.toSQL = function () {
  return this.client.schemaCompiler(this).toSQL();
};

export default SchemaBuilder;
