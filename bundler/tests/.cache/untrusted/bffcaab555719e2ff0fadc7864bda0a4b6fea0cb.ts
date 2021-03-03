// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/util/make-knex.js


import { EventEmitter } from '../deps/@jspm/core@1.1.0/nodelibs/events.js';

import { Migrator } from '../migrate/Migrator.js';
import Seeder from '../seed/Seeder.js';
import FunctionHelper from '../functionhelper.js';
import QueryInterface from '../query/methods.js';
import _ from '../deps/lodash@4.17.15/index.js';
const merge = _.merge;
import batchInsert from './batchInsert.js';

// Javascript does not officially support "callable objects".  Instead,
// you must create a regular Function and inject properties/methods
// into it.  In other words: you can't leverage Prototype Inheritance
// to share the property/method definitions.
//
// To work around this, we're creating an Object Property Definition.
// This allow us to quickly inject everything into the `knex` function
// via the `Object.defineProperties(..)` function.  More importantly,
// it allows the same definitions to be shared across `knex` instances.
const KNEX_PROPERTY_DEFINITIONS = {
  client: {
    get() {
      return this.context.client;
    },
    set(client) {
      this.context.client = client;
    },
    configurable: true,
  },

  userParams: {
    get() {
      return this.context.userParams;
    },
    set(userParams) {
      this.context.userParams = userParams;
    },
    configurable: true,
  },

  schema: {
    get() {
      return this.client.schemaBuilder();
    },
    configurable: true,
  },

  migrate: {
    get() {
      return new Migrator(this);
    },
    configurable: true,
  },

  seed: {
    get() {
      return new Seeder(this);
    },
    configurable: true,
  },

  fn: {
    get() {
      return new FunctionHelper(this.client);
    },
    configurable: true,
  },
};

// `knex` instances serve as proxies around `context` objects.  So, calling
// any of these methods on the `knex` instance will forward the call to
// the `knex.context` object. This ensures that `this` will correctly refer
// to `context` within each of these methods.
const CONTEXT_METHODS = [
  'raw',
  'batchInsert',
  'transaction',
  'transactionProvider',
  'initialize',
  'destroy',
  'ref',
  'withUserParams',
  'queryBuilder',
  'disableProcessing',
  'enableProcessing',
];

for (const m of CONTEXT_METHODS) {
  KNEX_PROPERTY_DEFINITIONS[m] = {
    value: function (...args) {
      return this.context[m](...args);
    },
    configurable: true,
  };
}

function makeKnex(client) {
  // The object we're potentially using to kick off an initial chain.
  function knex(tableName, options) {
    return createQueryBuilder(knex.context, tableName, options);
  }

  redefineProperties(knex, client);
  return knex;
}

function initContext(knexFn) {
  const knexContext = knexFn.context || {};
  Object.assign(knexContext, {
    queryBuilder() {
      return this.client.queryBuilder();
    },

    raw() {
      return this.client.raw.apply(this.client, arguments);
    },

    batchInsert(table, batch, chunkSize = 1000) {
      return batchInsert(this, table, batch, chunkSize);
    },

    // Creates a new transaction.
    // If container is provided, returns a promise for when the transaction is resolved.
    // If container is not provided, returns a promise with a transaction that is resolved
    // when transaction is ready to be used.
    transaction(container, _config) {
      const config = Object.assign({}, _config);
      config.userParams = this.userParams || {};
      if (config.doNotRejectOnRollback === undefined) {
        // Backwards-compatibility: default value changes depending upon
        // whether or not a `container` was provided.
        config.doNotRejectOnRollback = !container;
      }

      return this._transaction(container, config);
    },

    // Internal method that actually establishes the Transaction.  It makes no assumptions
    // about the `config` or `outerTx`, and expects the caller to handle these details.
    _transaction(container, config, outerTx = null) {
      if (container) {
        const trx = this.client.transaction(container, config, outerTx);
        return trx;
      } else {
        return new Promise((resolve, reject) => {
          const trx = this.client.transaction(resolve, config, outerTx);
          trx.catch(reject);
        });
      }
    },

    transactionProvider(config) {
      let trx;
      return () => {
        if (!trx) {
          trx = this.transaction(undefined, config);
        }
        return trx;
      };
    },

    // Typically never needed, initializes the pool for a knex client.
    initialize(config) {
      return this.client.initializePool(config);
    },

    // Convenience method for tearing down the pool.
    destroy(callback) {
      return this.client.destroy(callback);
    },

    ref(ref) {
      return this.client.ref(ref);
    },

    // Do not document this as public API until naming and API is improved for general consumption
    // This method exists to disable processing of internal queries in migrations
    disableProcessing() {
      if (this.userParams.isProcessingDisabled) {
        return;
      }
      this.userParams.wrapIdentifier = this.client.config.wrapIdentifier;
      this.userParams.postProcessResponse = this.client.config.postProcessResponse;
      this.client.config.wrapIdentifier = null;
      this.client.config.postProcessResponse = null;
      this.userParams.isProcessingDisabled = true;
    },

    // Do not document this as public API until naming and API is improved for general consumption
    // This method exists to enable execution of non-internal queries with consistent identifier naming in migrations
    enableProcessing() {
      if (!this.userParams.isProcessingDisabled) {
        return;
      }
      this.client.config.wrapIdentifier = this.userParams.wrapIdentifier;
      this.client.config.postProcessResponse = this.userParams.postProcessResponse;
      this.userParams.isProcessingDisabled = false;
    },

    withUserParams(params) {
      const knexClone = shallowCloneFunction(knexFn); // We need to include getters in our clone
      if (this.client) {
        knexClone.client = Object.create(this.client.constructor.prototype); // Clone client to avoid leaking listeners that are set on it
        merge(knexClone.client, this.client);
        knexClone.client.config = Object.assign({}, this.client.config); // Clone client config to make sure they can be modified independently
      }

      redefineProperties(knexClone, knexClone.client);
      _copyEventListeners('query', knexFn, knexClone);
      _copyEventListeners('query-error', knexFn, knexClone);
      _copyEventListeners('query-response', knexFn, knexClone);
      _copyEventListeners('start', knexFn, knexClone);
      knexClone.userParams = params;
      return knexClone;
    },
  });

  if (!knexFn.context) {
    knexFn.context = knexContext;
  }
}

function _copyEventListeners(eventName, sourceKnex, targetKnex) {
  const listeners = sourceKnex.listeners(eventName);
  listeners.forEach((listener) => {
    targetKnex.on(eventName, listener);
  });
}

function redefineProperties(knex, client) {
  // Allow chaining methods from the root object, before
  // any other information is specified.
  //
  // TODO: `QueryBuilder.extend(..)` allows new QueryBuilder
  //       methods to be introduced via external components.
  //       As a side-effect, it also pushes the new method names
  //       into the `QueryInterface` array.
  //
  //       The Problem: due to the way the code is currently
  //       structured, these new methods cannot be retroactively
  //       injected into existing `knex` instances!  As a result,
  //       some `knex` instances will support the methods, and
  //       others will not.
  //
  //       We should revisit this once we figure out the desired
  //       behavior / usage.  For instance: do we really want to
  //       allow external components to directly manipulate `knex`
  //       data structures?  Or, should we come up w/ a different
  //       approach that avoids side-effects / mutation?
  //
  //      (FYI: I noticed this issue because I attempted to integrate
  //       this logic directly into the `KNEX_PROPERTY_DEFINITIONS`
  //       construction.  However, `KNEX_PROPERTY_DEFINITIONS` is
  //       constructed before any `knex` instances are created.
  //       As a result, the method extensions were missing from all
  //       `knex` instances.)
  QueryInterface.forEach(function (method) {
    knex[method] = function () {
      const builder = this.queryBuilder();
      return builder[method].apply(builder, arguments);
    };
  });

  Object.defineProperties(knex, KNEX_PROPERTY_DEFINITIONS);

  initContext(knex);
  knex.client = client;

  // TODO: It looks like this field is never actually used.
  //       It should probably be removed in a future PR.
  knex.client.makeKnex = makeKnex;

  knex.userParams = {};

  // Hook up the "knex" object as an EventEmitter.
  const ee = new EventEmitter();
  for (const key in ee) {
    knex[key] = ee[key];
  }

  // Unfortunately, something seems to be broken in Node 6 and removing events from a clone also mutates original Knex,
  // which is highly undesirable
  if (knex._internalListeners) {
    knex._internalListeners.forEach(({ eventName, listener }) => {
      knex.client.removeListener(eventName, listener); // Remove duplicates for copies
    });
  }
  knex._internalListeners = [];

  // Passthrough all "start" and "query" events to the knex object.
  _addInternalListener(knex, 'start', (obj) => {
    knex.emit('start', obj);
  });
  _addInternalListener(knex, 'query', (obj) => {
    knex.emit('query', obj);
  });
  _addInternalListener(knex, 'query-error', (err, obj) => {
    knex.emit('query-error', err, obj);
  });
  _addInternalListener(knex, 'query-response', (response, obj, builder) => {
    knex.emit('query-response', response, obj, builder);
  });
}

function _addInternalListener(knex, eventName, listener) {
  knex.client.on(eventName, listener);
  knex._internalListeners.push({
    eventName,
    listener,
  });
}

function createQueryBuilder(knexContext, tableName, options) {
  const qb = knexContext.queryBuilder();
  if (!tableName)
    knexContext.client.logger.warn(
      'calling knex without a tableName is deprecated. Use knex.queryBuilder() instead.'
    );
  return tableName ? qb.table(tableName, options) : qb;
}

function shallowCloneFunction(originalFunction) {
  const fnContext = Object.create(
    Object.getPrototypeOf(originalFunction),
    Object.getOwnPropertyDescriptors(originalFunction)
  );

  const knexContext = {};
  const knexFnWrapper = (tableName, options) => {
    return createQueryBuilder(knexContext, tableName, options);
  };

  const clonedFunction = knexFnWrapper.bind(fnContext);
  Object.assign(clonedFunction, originalFunction);
  clonedFunction.context = knexContext;
  return clonedFunction;
}

export default makeKnex;
