// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/query/builder.js


// Builder
// -------
import assert from '../deps/@jspm/core@1.1.0/nodelibs/assert.js';
import inherits from '../deps/inherits@2.0.4/inherits.js';
import { EventEmitter } from '../deps/@jspm/core@1.1.0/nodelibs/events.js';

import Raw from '../raw.js';
import helpers from '../helpers.js';
import JoinClause from './joinclause.js';
import _ from '../deps/lodash@4.17.15/index.js';
const assign = _.assign;
const clone = _.clone;
const each = _.each;
const isBoolean = _.isBoolean;
const isEmpty = _.isEmpty;
const isFunction = _.isFunction;
const isNumber = _.isNumber;
const isObject = _.isObject;
const isPlainObject = _.isPlainObject;
const isString = _.isString;
const last = _.last;
const reject = _.reject;
const tail = _.tail;
const toArray = _.toArray;
import saveAsyncStack from '../util/save-async-stack.js';

import { lockMode, waitMode } from './constants.js';

// Typically called from `knex.builder`,
// start a new query building chain.
function Builder(client) {
  this.client = client;
  this.and = this;
  this._single = {};
  this._statements = [];
  this._method = 'select';
  if (client.config) {
    saveAsyncStack(this, 5);
    this._debug = client.config.debug;
  }
  // Internal flags used in the builder.
  this._joinFlag = 'inner';
  this._boolFlag = 'and';
  this._notFlag = false;
  this._asColumnFlag = false;
}

inherits(Builder, EventEmitter);

const validateWithArgs = function (alias, statement, method) {
  if (typeof alias !== 'string') {
    throw new Error(`${method}() first argument must be a string`);
  }
  if (
    typeof statement === 'function' ||
    statement instanceof Builder ||
    statement instanceof Raw
  ) {
    return;
  }
  throw new Error(
    `${method}() second argument must be a function / QueryBuilder or a raw`
  );
};

assign(Builder.prototype, {
  toString() {
    return this.toQuery();
  },

  // Convert the current query "toSQL"
  toSQL(method, tz) {
    return this.client.queryCompiler(this).toSQL(method || this._method, tz);
  },

  // Create a shallow clone of the current query builder.
  clone() {
    const cloned = new this.constructor(this.client);
    cloned._method = this._method;
    cloned._single = clone(this._single);
    cloned._statements = clone(this._statements);
    cloned._debug = this._debug;

    // `_option` is assigned by the `Interface` mixin.
    if (this._options !== undefined) {
      cloned._options = clone(this._options);
    }
    if (this._queryContext !== undefined) {
      cloned._queryContext = clone(this._queryContext);
    }
    if (this._connection !== undefined) {
      cloned._connection = this._connection;
    }

    return cloned;
  },

  timeout(ms, { cancel } = {}) {
    if (isNumber(ms) && ms > 0) {
      this._timeout = ms;
      if (cancel) {
        this.client.assertCanCancelQuery();
        this._cancelOnTimeout = true;
      }
    }
    return this;
  },

  // With
  // ------

  with(alias, statement) {
    validateWithArgs(alias, statement, 'with');
    return this.withWrapped(alias, statement);
  },

  // Helper for compiling any advanced `with` queries.
  withWrapped(alias, query) {
    this._statements.push({
      grouping: 'with',
      type: 'withWrapped',
      alias: alias,
      value: query,
    });
    return this;
  },

  // With Recursive
  // ------

  withRecursive(alias, statement) {
    validateWithArgs(alias, statement, 'withRecursive');
    return this.withRecursiveWrapped(alias, statement);
  },

  // Helper for compiling any advanced `withRecursive` queries.
  withRecursiveWrapped(alias, query) {
    this.withWrapped(alias, query);
    this._statements[this._statements.length - 1].recursive = true;
    return this;
  },

  // Select
  // ------

  // Adds a column or columns to the list of "columns"
  // being selected on the query.
  columns(column) {
    if (!column && column !== 0) return this;
    this._statements.push({
      grouping: 'columns',
      value: helpers.normalizeArr.apply(null, arguments),
    });
    return this;
  },

  // Allow for a sub-select to be explicitly aliased as a column,
  // without needing to compile the query in a where.
  as(column) {
    this._single.as = column;
    return this;
  },

  // Prepends the `schemaName` on `tableName` defined by `.table` and `.join`.
  withSchema(schemaName) {
    this._single.schema = schemaName;
    return this;
  },

  // Sets the `tableName` on the query.
  // Alias to "from" for select and "into" for insert statements
  // e.g. builder.insert({a: value}).into('tableName')
  // `options`: options object containing keys:
  //   - `only`: whether the query should use SQL's ONLY to not return
  //           inheriting table data. Defaults to false.
  table(tableName, options = {}) {
    this._single.table = tableName;
    this._single.only = options.only === true;
    return this;
  },

  // Adds a `distinct` clause to the query.
  distinct() {
    this._statements.push({
      grouping: 'columns',
      value: helpers.normalizeArr.apply(null, arguments),
      distinct: true,
    });
    return this;
  },

  distinctOn() {
    const value = helpers.normalizeArr.apply(null, arguments);
    if (isEmpty(value)) {
      throw new Error('distinctOn requires atleast on argument');
    }
    this._statements.push({
      grouping: 'columns',
      value,
      distinctOn: true,
    });
    return this;
  },

  // Adds a join clause to the query, allowing for advanced joins
  // with an anonymous function as the second argument.
  // function(table, first, operator, second)
  join(table, first) {
    let join;
    const { schema } = this._single;
    const joinType = this._joinType();
    if (typeof first === 'function') {
      join = new JoinClause(table, joinType, schema);
      first.call(join, join);
    } else if (joinType === 'raw') {
      join = new JoinClause(this.client.raw(table, first), 'raw');
    } else {
      join = new JoinClause(
        table,
        joinType,
        table instanceof Builder ? undefined : schema
      );
      if (arguments.length > 1) {
        join.on.apply(join, toArray(arguments).slice(1));
      }
    }
    this._statements.push(join);
    return this;
  },

  // JOIN blocks:
  innerJoin() {
    return this._joinType('inner').join.apply(this, arguments);
  },
  leftJoin() {
    return this._joinType('left').join.apply(this, arguments);
  },
  leftOuterJoin() {
    return this._joinType('left outer').join.apply(this, arguments);
  },
  rightJoin() {
    return this._joinType('right').join.apply(this, arguments);
  },
  rightOuterJoin() {
    return this._joinType('right outer').join.apply(this, arguments);
  },
  outerJoin() {
    return this._joinType('outer').join.apply(this, arguments);
  },
  fullOuterJoin() {
    return this._joinType('full outer').join.apply(this, arguments);
  },
  crossJoin() {
    return this._joinType('cross').join.apply(this, arguments);
  },
  joinRaw() {
    return this._joinType('raw').join.apply(this, arguments);
  },

  // The where function can be used in several ways:
  // The most basic is `where(key, value)`, which expands to
  // where key = value.
  where(column, operator, value) {
    // Support "where true || where false"
    if (column === false || column === true) {
      return this.where(1, '=', column ? 1 : 0);
    }

    // Check if the column is a function, in which case it's
    // a where statement wrapped in parens.
    if (typeof column === 'function') {
      return this.whereWrapped(column);
    }

    // Allow a raw statement to be passed along to the query.
    if (column instanceof Raw && arguments.length === 1)
      return this.whereRaw(column);

    // Allows `where({id: 2})` syntax.
    if (isObject(column) && !(column instanceof Raw))
      return this._objectWhere(column);

    // Enable the where('key', value) syntax, only when there
    // are explicitly two arguments passed, so it's not possible to
    // do where('key', '!=') and have that turn into where key != null
    if (arguments.length === 2) {
      value = operator;
      operator = '=';

      // If the value is null, and it's a two argument query,
      // we assume we're going for a `whereNull`.
      if (value === null) {
        return this.whereNull(column);
      }
    }

    // lower case the operator for comparison purposes
    const checkOperator = `${operator}`.toLowerCase().trim();

    // If there are 3 arguments, check whether 'in' is one of them.
    if (arguments.length === 3) {
      if (checkOperator === 'in' || checkOperator === 'not in') {
        return this._not(checkOperator === 'not in').whereIn(
          arguments[0],
          arguments[2]
        );
      }
      if (checkOperator === 'between' || checkOperator === 'not between') {
        return this._not(checkOperator === 'not between').whereBetween(
          arguments[0],
          arguments[2]
        );
      }
    }

    // If the value is still null, check whether they're meaning
    // where value is null
    if (value === null) {
      // Check for .where(key, 'is', null) or .where(key, 'is not', 'null');
      if (checkOperator === 'is' || checkOperator === 'is not') {
        return this._not(checkOperator === 'is not').whereNull(column);
      }
    }

    // Push onto the where statement stack.
    this._statements.push({
      grouping: 'where',
      type: 'whereBasic',
      column,
      operator,
      value,
      not: this._not(),
      bool: this._bool(),
      asColumn: this._asColumnFlag,
    });
    return this;
  },

  whereColumn(column, operator, rightColumn) {
    this._asColumnFlag = true;
    this.where.apply(this, arguments);
    this._asColumnFlag = false;
    return this;
  },

  // Adds an `or where` clause to the query.
  orWhere() {
    this._bool('or');
    const obj = arguments[0];
    if (isObject(obj) && !isFunction(obj) && !(obj instanceof Raw)) {
      return this.whereWrapped(function () {
        for (const key in obj) {
          this.andWhere(key, obj[key]);
        }
      });
    }
    return this.where.apply(this, arguments);
  },

  orWhereColumn() {
    this._bool('or');
    const obj = arguments[0];
    if (isObject(obj) && !isFunction(obj) && !(obj instanceof Raw)) {
      return this.whereWrapped(function () {
        for (const key in obj) {
          this.andWhereColumn(key, '=', obj[key]);
        }
      });
    }
    return this.whereColumn.apply(this, arguments);
  },

  // Adds an `not where` clause to the query.
  whereNot() {
    return this._not(true).where.apply(this, arguments);
  },

  whereNotColumn() {
    return this._not(true).whereColumn.apply(this, arguments);
  },

  // Adds an `or not where` clause to the query.
  orWhereNot() {
    return this._bool('or').whereNot.apply(this, arguments);
  },

  orWhereNotColumn() {
    return this._bool('or').whereNotColumn.apply(this, arguments);
  },

  // Processes an object literal provided in a "where" clause.
  _objectWhere(obj) {
    const boolVal = this._bool();
    const notVal = this._not() ? 'Not' : '';
    for (const key in obj) {
      this[boolVal + 'Where' + notVal](key, obj[key]);
    }
    return this;
  },

  // Adds a raw `where` clause to the query.
  whereRaw(sql, bindings) {
    const raw = sql instanceof Raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'where',
      type: 'whereRaw',
      value: raw,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orWhereRaw(sql, bindings) {
    return this._bool('or').whereRaw(sql, bindings);
  },

  // Helper for compiling any advanced `where` queries.
  whereWrapped(callback) {
    this._statements.push({
      grouping: 'where',
      type: 'whereWrapped',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `where exists` clause to the query.
  whereExists(callback) {
    this._statements.push({
      grouping: 'where',
      type: 'whereExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds an `or where exists` clause to the query.
  orWhereExists(callback) {
    return this._bool('or').whereExists(callback);
  },

  // Adds a `where not exists` clause to the query.
  whereNotExists(callback) {
    return this._not(true).whereExists(callback);
  },

  // Adds a `or where not exists` clause to the query.
  orWhereNotExists(callback) {
    return this._bool('or').whereNotExists(callback);
  },

  // Adds a `where in` clause to the query.
  whereIn(column, values) {
    if (Array.isArray(values) && isEmpty(values))
      return this.where(this._not());
    this._statements.push({
      grouping: 'where',
      type: 'whereIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `or where in` clause to the query.
  orWhereIn(column, values) {
    return this._bool('or').whereIn(column, values);
  },

  // Adds a `where not in` clause to the query.
  whereNotIn(column, values) {
    return this._not(true).whereIn(column, values);
  },

  // Adds a `or where not in` clause to the query.
  orWhereNotIn(column, values) {
    return this._bool('or')._not(true).whereIn(column, values);
  },

  // Adds a `where null` clause to the query.
  whereNull(column) {
    this._statements.push({
      grouping: 'where',
      type: 'whereNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `or where null` clause to the query.
  orWhereNull(column) {
    return this._bool('or').whereNull(column);
  },

  // Adds a `where not null` clause to the query.
  whereNotNull(column) {
    return this._not(true).whereNull(column);
  },

  // Adds a `or where not null` clause to the query.
  orWhereNotNull(column) {
    return this._bool('or').whereNotNull(column);
  },

  // Adds a `where between` clause to the query.
  whereBetween(column, values) {
    assert(
      Array.isArray(values),
      'The second argument to whereBetween must be an array.'
    );
    assert(
      values.length === 2,
      'You must specify 2 values for the whereBetween clause'
    );
    this._statements.push({
      grouping: 'where',
      type: 'whereBetween',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `where not between` clause to the query.
  whereNotBetween(column, values) {
    return this._not(true).whereBetween(column, values);
  },

  // Adds a `or where between` clause to the query.
  orWhereBetween(column, values) {
    return this._bool('or').whereBetween(column, values);
  },

  // Adds a `or where not between` clause to the query.
  orWhereNotBetween(column, values) {
    return this._bool('or').whereNotBetween(column, values);
  },

  // Adds a `group by` clause to the query.
  groupBy(item) {
    if (item instanceof Raw) {
      return this.groupByRaw.apply(this, arguments);
    }
    this._statements.push({
      grouping: 'group',
      type: 'groupByBasic',
      value: helpers.normalizeArr.apply(null, arguments),
    });
    return this;
  },

  // Adds a raw `group by` clause to the query.
  groupByRaw(sql, bindings) {
    const raw = sql instanceof Raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'group',
      type: 'groupByRaw',
      value: raw,
    });
    return this;
  },

  // Adds a `order by` clause to the query.
  orderBy(column, direction) {
    if (Array.isArray(column)) {
      return this._orderByArray(column);
    }
    this._statements.push({
      grouping: 'order',
      type: 'orderByBasic',
      value: column,
      direction,
    });
    return this;
  },

  // Adds a `order by` with multiple columns to the query.
  _orderByArray(columnDefs) {
    for (let i = 0; i < columnDefs.length; i++) {
      const columnInfo = columnDefs[i];
      if (isObject(columnInfo)) {
        this._statements.push({
          grouping: 'order',
          type: 'orderByBasic',
          value: columnInfo['column'],
          direction: columnInfo['order'],
        });
      } else if (isString(columnInfo)) {
        this._statements.push({
          grouping: 'order',
          type: 'orderByBasic',
          value: columnInfo,
        });
      }
    }
    return this;
  },

  // Add a raw `order by` clause to the query.
  orderByRaw(sql, bindings) {
    const raw = sql instanceof Raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'order',
      type: 'orderByRaw',
      value: raw,
    });
    return this;
  },

  _union(clause, args) {
    let callbacks = args[0];
    let wrap = args[1];
    if (args.length === 1 || (args.length === 2 && isBoolean(wrap))) {
      if (!Array.isArray(callbacks)) {
        callbacks = [callbacks];
      }
      for (let i = 0, l = callbacks.length; i < l; i++) {
        this._statements.push({
          grouping: 'union',
          clause: clause,
          value: callbacks[i],
          wrap: wrap || false,
        });
      }
    } else {
      callbacks = toArray(args).slice(0, args.length - 1);
      wrap = args[args.length - 1];
      if (!isBoolean(wrap)) {
        callbacks.push(wrap);
        wrap = false;
      }
      this._union(clause, [callbacks, wrap]);
    }
    return this;
  },

  // Add a union statement to the query.
  union(...args) {
    return this._union('union', args);
  },

  // Adds a union all statement to the query.
  unionAll(...args) {
    return this._union('union all', args);
  },

  // Adds an intersect statement to the query
  intersect(callbacks, wrap) {
    if (arguments.length === 1 || (arguments.length === 2 && isBoolean(wrap))) {
      if (!Array.isArray(callbacks)) {
        callbacks = [callbacks];
      }
      for (let i = 0, l = callbacks.length; i < l; i++) {
        this._statements.push({
          grouping: 'union',
          clause: 'intersect',
          value: callbacks[i],
          wrap: wrap || false,
        });
      }
    } else {
      callbacks = toArray(arguments).slice(0, arguments.length - 1);
      wrap = arguments[arguments.length - 1];
      if (!isBoolean(wrap)) {
        callbacks.push(wrap);
        wrap = false;
      }
      this.intersect(callbacks, wrap);
    }
    return this;
  },

  // Adds a `having` clause to the query.
  having(column, operator, value) {
    if (column instanceof Raw && arguments.length === 1) {
      return this.havingRaw(column);
    }

    // Check if the column is a function, in which case it's
    // a having statement wrapped in parens.
    if (typeof column === 'function') {
      return this.havingWrapped(column);
    }

    this._statements.push({
      grouping: 'having',
      type: 'havingBasic',
      column,
      operator,
      value,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  orHaving: function orHaving() {
    this._bool('or');
    const obj = arguments[0];
    if (isObject(obj) && !isFunction(obj) && !(obj instanceof Raw)) {
      return this.havingWrapped(function () {
        for (const key in obj) {
          this.andHaving(key, obj[key]);
        }
      });
    }
    return this.having.apply(this, arguments);
  },

  // Helper for compiling any advanced `having` queries.
  havingWrapped(callback) {
    this._statements.push({
      grouping: 'having',
      type: 'havingWrapped',
      value: callback,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  havingNull(column) {
    this._statements.push({
      grouping: 'having',
      type: 'havingNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orHavingNull(callback) {
    return this._bool('or').havingNull(callback);
  },

  havingNotNull(callback) {
    return this._not(true).havingNull(callback);
  },

  orHavingNotNull(callback) {
    return this._not(true)._bool('or').havingNull(callback);
  },

  havingExists(callback) {
    this._statements.push({
      grouping: 'having',
      type: 'havingExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orHavingExists(callback) {
    return this._bool('or').havingExists(callback);
  },

  havingNotExists(callback) {
    return this._not(true).havingExists(callback);
  },

  orHavingNotExists(callback) {
    return this._not(true)._bool('or').havingExists(callback);
  },

  havingBetween(column, values) {
    assert(
      Array.isArray(values),
      'The second argument to havingBetween must be an array.'
    );
    assert(
      values.length === 2,
      'You must specify 2 values for the havingBetween clause'
    );
    this._statements.push({
      grouping: 'having',
      type: 'havingBetween',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orHavingBetween(column, values) {
    return this._bool('or').havingBetween(column, values);
  },

  havingNotBetween(column, values) {
    return this._not(true).havingBetween(column, values);
  },

  orHavingNotBetween(column, values) {
    return this._not(true)._bool('or').havingBetween(column, values);
  },

  havingIn(column, values) {
    if (Array.isArray(values) && isEmpty(values))
      return this.where(this._not());
    this._statements.push({
      grouping: 'having',
      type: 'havingIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  // Adds a `or where in` clause to the query.
  orHavingIn(column, values) {
    return this._bool('or').havingIn(column, values);
  },

  // Adds a `where not in` clause to the query.
  havingNotIn(column, values) {
    return this._not(true).havingIn(column, values);
  },

  // Adds a `or where not in` clause to the query.
  orHavingNotIn(column, values) {
    return this._bool('or')._not(true).havingIn(column, values);
  },

  // Adds a raw `having` clause to the query.
  havingRaw(sql, bindings) {
    const raw = sql instanceof Raw ? sql : this.client.raw(sql, bindings);
    this._statements.push({
      grouping: 'having',
      type: 'havingRaw',
      value: raw,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  orHavingRaw(sql, bindings) {
    return this._bool('or').havingRaw(sql, bindings);
  },

  // Only allow a single "offset" to be set for the current query.
  offset(value) {
    if (value == null || value instanceof Raw || value instanceof Builder) {
      // Builder for backward compatibility
      this._single.offset = value;
    } else {
      const val = parseInt(value, 10);
      if (isNaN(val)) {
        this.client.logger.warn('A valid integer must be provided to offset');
      } else {
        this._single.offset = val;
      }
    }
    return this;
  },

  // Only allow a single "limit" to be set for the current query.
  limit(value) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      this.client.logger.warn('A valid integer must be provided to limit');
    } else {
      this._single.limit = val;
    }
    return this;
  },

  // Retrieve the "count" result of the query.
  count(column, options) {
    return this._aggregate('count', column || '*', options);
  },

  // Retrieve the minimum value of a given column.
  min(column, options) {
    return this._aggregate('min', column, options);
  },

  // Retrieve the maximum value of a given column.
  max(column, options) {
    return this._aggregate('max', column, options);
  },

  // Retrieve the sum of the values of a given column.
  sum(column, options) {
    return this._aggregate('sum', column, options);
  },

  // Retrieve the average of the values of a given column.
  avg(column, options) {
    return this._aggregate('avg', column, options);
  },

  // Retrieve the "count" of the distinct results of the query.
  countDistinct() {
    let columns = helpers.normalizeArr.apply(null, arguments);
    let options;
    if (columns.length > 1 && isPlainObject(last(columns))) {
      [options] = columns.splice(columns.length - 1, 1);
    }

    if (!columns.length) {
      columns = '*';
    } else if (columns.length === 1) {
      columns = columns[0];
    }

    return this._aggregate('count', columns, { ...options, distinct: true });
  },

  // Retrieve the sum of the distinct values of a given column.
  sumDistinct(column, options) {
    return this._aggregate('sum', column, { ...options, distinct: true });
  },

  // Retrieve the vg of the distinct results of the query.
  avgDistinct(column, options) {
    return this._aggregate('avg', column, { ...options, distinct: true });
  },

  // Increments a column's value by the specified amount.
  increment(column, amount = 1) {
    if (isObject(column)) {
      for (const key in column) {
        this._counter(key, column[key]);
      }

      return this;
    }

    return this._counter(column, amount);
  },

  // Decrements a column's value by the specified amount.
  decrement(column, amount = 1) {
    if (isObject(column)) {
      for (const key in column) {
        this._counter(key, -column[key]);
      }

      return this;
    }

    return this._counter(column, -amount);
  },

  // Clears increments/decrements
  clearCounters() {
    this._single.counter = {};

    return this;
  },

  // Sets the values for a `select` query, informing that only the first
  // row should be returned (limit 1).
  first() {
    if (!this._isSelectQuery()) {
      throw new Error(`Cannot chain .first() on "${this._method}" query!`);
    }

    const args = new Array(arguments.length);
    for (let i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    this.select.apply(this, args);
    this._method = 'first';
    this.limit(1);
    return this;
  },

  // Use existing connection to execute the query
  // Same value that client.acquireConnection() for an according client returns should be passed
  connection(_connection) {
    this._connection = _connection;
    return this;
  },

  // Pluck a column from a query.
  pluck(column) {
    this._method = 'pluck';
    this._single.pluck = column;
    this._statements.push({
      grouping: 'columns',
      type: 'pluck',
      value: column,
    });
    return this;
  },

  // Remove everything from select clause
  clearSelect() {
    this._clearGrouping('columns');
    return this;
  },

  // Remove everything from where clause
  clearWhere() {
    this._clearGrouping('where');
    return this;
  },

  // Remove everything from group clause
  clearGroup() {
    this._clearGrouping('group');
    return this;
  },

  // Remove everything from order clause
  clearOrder() {
    this._clearGrouping('order');
    return this;
  },

  // Remove everything from having clause
  clearHaving() {
    this._clearGrouping('having');
    return this;
  },

  // Insert & Update
  // ------

  // Sets the values for an `insert` query.
  insert(values, returning) {
    this._method = 'insert';
    if (!isEmpty(returning)) this.returning(returning);
    this._single.insert = values;
    return this;
  },

  // Sets the values for an `update`, allowing for both
  // `.update(key, value, [returning])` and `.update(obj, [returning])` syntaxes.
  update(values, returning) {
    let ret;
    const obj = this._single.update || {};
    this._method = 'update';
    if (isString(values)) {
      obj[values] = returning;
      if (arguments.length > 2) {
        ret = arguments[2];
      }
    } else {
      const keys = Object.keys(values);
      if (this._single.update) {
        this.client.logger.warn('Update called multiple times with objects.');
      }
      let i = -1;
      while (++i < keys.length) {
        obj[keys[i]] = values[keys[i]];
      }
      ret = arguments[1];
    }
    if (!isEmpty(ret)) this.returning(ret);
    this._single.update = obj;
    return this;
  },

  // Sets the returning value for the query.
  returning(returning) {
    this._single.returning = returning;
    return this;
  },

  // Delete
  // ------

  // Executes a delete statement on the query;
  delete(ret) {
    this._method = 'del';
    if (!isEmpty(ret)) this.returning(ret);
    return this;
  },

  // Truncates a table, ends the query chain.
  truncate(tableName) {
    this._method = 'truncate';
    if (tableName) {
      this._single.table = tableName;
    }
    return this;
  },

  // Retrieves columns for the table specified by `knex(tableName)`
  columnInfo(column) {
    this._method = 'columnInfo';
    this._single.columnInfo = column;
    return this;
  },

  // Set a lock for update constraint.
  forUpdate() {
    this._single.lock = lockMode.forUpdate;
    this._single.lockTables = helpers.normalizeArr.apply(null, arguments);
    return this;
  },

  // Set a lock for share constraint.
  forShare() {
    this._single.lock = lockMode.forShare;
    this._single.lockTables = helpers.normalizeArr.apply(null, arguments);
    return this;
  },

  // Skips locked rows when using a lock constraint.
  skipLocked() {
    if (!this._isSelectQuery()) {
      throw new Error(`Cannot chain .skipLocked() on "${this._method}" query!`);
    }
    if (!this._hasLockMode()) {
      throw new Error(
        '.skipLocked() can only be used after a call to .forShare() or .forUpdate()!'
      );
    }
    if (this._single.waitMode === waitMode.noWait) {
      throw new Error('.skipLocked() cannot be used together with .noWait()!');
    }
    this._single.waitMode = waitMode.skipLocked;
    return this;
  },

  // Causes error when acessing a locked row instead of waiting for it to be released.
  noWait() {
    if (!this._isSelectQuery()) {
      throw new Error(`Cannot chain .noWait() on "${this._method}" query!`);
    }
    if (!this._hasLockMode()) {
      throw new Error(
        '.noWait() can only be used after a call to .forShare() or .forUpdate()!'
      );
    }
    if (this._single.waitMode === waitMode.skipLocked) {
      throw new Error('.noWait() cannot be used together with .skipLocked()!');
    }
    this._single.waitMode = waitMode.noWait;
    return this;
  },

  // Takes a JS object of methods to call and calls them
  fromJS(obj) {
    each(obj, (val, key) => {
      if (typeof this[key] !== 'function') {
        this.client.logger.warn(`Knex Error: unknown key ${key}`);
      }
      if (Array.isArray(val)) {
        this[key].apply(this, val);
      } else {
        this[key](val);
      }
    });
    return this;
  },

  // Passes query to provided callback function, useful for e.g. composing
  // domain-specific helpers
  modify(callback) {
    callback.apply(this, [this].concat(tail(arguments)));
    return this;
  },

  // ----------------------------------------------------------------------

  // Helper for the incrementing/decrementing queries.
  _counter(column, amount) {
    amount = parseFloat(amount);

    this._method = 'update';

    this._single.counter = this._single.counter || {};

    this._single.counter[column] = amount;

    return this;
  },

  // Helper to get or set the "boolFlag" value.
  _bool(val) {
    if (arguments.length === 1) {
      this._boolFlag = val;
      return this;
    }
    const ret = this._boolFlag;
    this._boolFlag = 'and';
    return ret;
  },

  // Helper to get or set the "notFlag" value.
  _not(val) {
    if (arguments.length === 1) {
      this._notFlag = val;
      return this;
    }
    const ret = this._notFlag;
    this._notFlag = false;
    return ret;
  },

  // Helper to get or set the "joinFlag" value.
  _joinType(val) {
    if (arguments.length === 1) {
      this._joinFlag = val;
      return this;
    }
    const ret = this._joinFlag || 'inner';
    this._joinFlag = 'inner';
    return ret;
  },

  // Helper for compiling any aggregate queries.
  _aggregate(method, column, options = {}) {
    this._statements.push({
      grouping: 'columns',
      type: column instanceof Raw ? 'aggregateRaw' : 'aggregate',
      method,
      value: column,
      aggregateDistinct: options.distinct || false,
      alias: options.as,
    });
    return this;
  },

  // Helper function for clearing or reseting a grouping type from the builder
  _clearGrouping(grouping) {
    this._statements = reject(this._statements, { grouping });
  },

  // Helper function that checks if the builder will emit a select query
  _isSelectQuery() {
    return ['pluck', 'first', 'select'].includes(this._method);
  },

  // Helper function that checks if the query has a lock mode set
  _hasLockMode() {
    return [lockMode.forShare, lockMode.forUpdate].includes(this._single.lock);
  },
});

Object.defineProperty(Builder.prototype, 'or', {
  get() {
    return this._bool('or');
  },
});

Object.defineProperty(Builder.prototype, 'not', {
  get() {
    return this._not(true);
  },
});

Builder.prototype.select = Builder.prototype.columns;
Builder.prototype.column = Builder.prototype.columns;
Builder.prototype.andWhereNot = Builder.prototype.whereNot;
Builder.prototype.andWhereNotColumn = Builder.prototype.whereNotColumn;
Builder.prototype.andWhere = Builder.prototype.where;
Builder.prototype.andWhereColumn = Builder.prototype.whereColumn;
Builder.prototype.andWhereRaw = Builder.prototype.whereRaw;
Builder.prototype.andWhereBetween = Builder.prototype.whereBetween;
Builder.prototype.andWhereNotBetween = Builder.prototype.whereNotBetween;
Builder.prototype.andHaving = Builder.prototype.having;
Builder.prototype.andHavingIn = Builder.prototype.havingIn;
Builder.prototype.andHavingNotIn = Builder.prototype.havingNotIn;
Builder.prototype.andHavingNull = Builder.prototype.havingNull;
Builder.prototype.andHavingNotNull = Builder.prototype.havingNotNull;
Builder.prototype.andHavingExists = Builder.prototype.havingExists;
Builder.prototype.andHavingNotExists = Builder.prototype.havingNotExists;
Builder.prototype.andHavingBetween = Builder.prototype.havingBetween;
Builder.prototype.andHavingNotBetween = Builder.prototype.havingNotBetween;
Builder.prototype.from = Builder.prototype.table;
Builder.prototype.into = Builder.prototype.table;
Builder.prototype.del = Builder.prototype.delete;

// Attach all of the top level promise methods that should be chainable.
import interfacelib from '../interface.js';
interfacelib(Builder);
helpers.addQueryContext(Builder);

Builder.extend = (methodName, fn) => {
  if (Object.prototype.hasOwnProperty.call(Builder.prototype, methodName)) {
    throw new Error(
      `Can't extend QueryBuilder with existing method ('${methodName}').`
    );
  }

  assign(Builder.prototype, { [methodName]: fn });
};

export default Builder;
