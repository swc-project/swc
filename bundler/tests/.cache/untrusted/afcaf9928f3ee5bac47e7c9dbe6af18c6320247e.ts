// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/query/compiler.js


// Query Compiler
// -------
import helpers from '../helpers.js';
import Raw from '../raw.js';
import QueryBuilder from './builder.js';
import JoinClause from './joinclause.js';
import debug from '../deps/debug@4.1.1/src/index.js';

import _ from '../deps/lodash@4.17.15/index.js';
const assign = _.assign;
const bind = _.bind;
const compact = _.compact;
const groupBy = _.groupBy;
const has = _.has;
const isEmpty = _.isEmpty;
const isString = _.isString;
const isUndefined = _.isUndefined;
const map = _.map;
const omitBy = _.omitBy;
const reduce = _.reduce;
import * as uuidlib from "../deps/uuid/mod.ts";
const uuid = {
	v1: uuidlib.v1.generate
}

const debugBindings = debug('knex:bindings');

const components = [
  'columns',
  'join',
  'where',
  'union',
  'group',
  'having',
  'order',
  'limit',
  'offset',
  'lock',
  'waitMode',
];

// The "QueryCompiler" takes all of the query statements which
// have been gathered in the "QueryBuilder" and turns them into a
// properly formatted / bound query string.
class QueryCompiler {
  constructor(client, builder) {
    this.client = client;
    this.method = builder._method || 'select';
    this.options = builder._options;
    this.single = builder._single;
    this.timeout = builder._timeout || false;
    this.cancelOnTimeout = builder._cancelOnTimeout || false;
    this.grouped = groupBy(builder._statements, 'grouping');
    this.formatter = client.formatter(builder);
    // Used when the insert call is empty.
    this._emptyInsertValue = 'default values';
    this.first = this.select;
  }

  // Collapse the builder into a single object
  toSQL(method, tz) {
    this._undefinedInWhereClause = false;
    this.undefinedBindingsInfo = [];

    method = method || this.method;
    const val = this[method]() || '';

    const query = {
      method,
      options: reduce(this.options, assign, {}),
      timeout: this.timeout,
      cancelOnTimeout: this.cancelOnTimeout,
      bindings: this.formatter.bindings || [],
      __knexQueryUid: uuid.v1(),
    };

    Object.defineProperties(query, {
      toNative: {
        value: () => {
          return {
            sql: this.client.positionBindings(query.sql),
            bindings: this.client.prepBindings(query.bindings),
          };
        },
        enumerable: false,
      },
    });

    if (isString(val)) {
      query.sql = val;
    } else {
      assign(query, val);
    }

    if (method === 'select' || method === 'first') {
      if (this.single.as) {
        query.as = this.single.as;
      }
    }

    if (this._undefinedInWhereClause) {
      debugBindings(query.bindings);
      throw new Error(
        `Undefined binding(s) detected when compiling ` +
          `${method.toUpperCase()}. Undefined column(s): [${this.undefinedBindingsInfo.join(
            ', '
          )}] query: ${query.sql}`
      );
    }

    return query;
  }

  // Compiles the `select` statement, or nested sub-selects by calling each of
  // the component compilers, trimming out the empties, and returning a
  // generated query string.
  select() {
    let sql = this.with();

    const statements = components.map((component) => this[component](this));
    sql += compact(statements).join(' ');
    return sql;
  }

  pluck() {
    let toPluck = this.single.pluck;
    if (toPluck.indexOf('.') !== -1) {
      toPluck = toPluck.split('.').slice(-1)[0];
    }
    return {
      sql: this.select(),
      pluck: toPluck,
    };
  }

  // Compiles an "insert" query, allowing for multiple
  // inserts using a single query statement.
  insert() {
    const insertValues = this.single.insert || [];
    let sql = this.with() + `insert into ${this.tableName} `;
    if (Array.isArray(insertValues)) {
      if (insertValues.length === 0) {
        return '';
      }
    } else if (typeof insertValues === 'object' && isEmpty(insertValues)) {
      return sql + this._emptyInsertValue;
    }

    const insertData = this._prepInsert(insertValues);
    if (typeof insertData === 'string') {
      sql += insertData;
    } else {
      if (insertData.columns.length) {
        sql += `(${this.formatter.columnize(insertData.columns)}`;
        sql += ') values (';
        let i = -1;
        while (++i < insertData.values.length) {
          if (i !== 0) sql += '), (';
          sql += this.formatter.parameterize(
            insertData.values[i],
            this.client.valueForUndefined
          );
        }
        sql += ')';
      } else if (insertValues.length === 1 && insertValues[0]) {
        sql += this._emptyInsertValue;
      } else {
        sql = '';
      }
    }
    return sql;
  }

  // Compiles the "update" query.
  update() {
    // Make sure tableName is processed by the formatter first.
    const withSQL = this.with();
    const { tableName } = this;
    const updateData = this._prepUpdate(this.single.update);
    const wheres = this.where();
    return (
      withSQL +
      `update ${this.single.only ? 'only ' : ''}${tableName}` +
      ' set ' +
      updateData.join(', ') +
      (wheres ? ` ${wheres}` : '')
    );
  }

  // Compiles the columns in the query, specifying if an item was distinct.
  columns() {
    let distinctClause = '';
    if (this.onlyUnions()) return '';
    const columns = this.grouped.columns || [];
    let i = -1,
      sql = [];
    if (columns) {
      while (++i < columns.length) {
        const stmt = columns[i];
        if (stmt.distinct) distinctClause = 'distinct ';
        if (stmt.distinctOn) {
          distinctClause = this.distinctOn(stmt.value);
          continue;
        }
        if (stmt.type === 'aggregate') {
          sql.push(...this.aggregate(stmt));
        } else if (stmt.type === 'aggregateRaw') {
          sql.push(this.aggregateRaw(stmt));
        } else if (stmt.value && stmt.value.length > 0) {
          sql.push(this.formatter.columnize(stmt.value));
        }
      }
    }
    if (sql.length === 0) sql = ['*'];
    return (
      `select ${distinctClause}` +
      sql.join(', ') +
      (this.tableName
        ? ` from ${this.single.only ? 'only ' : ''}${this.tableName}`
        : '')
    );
  }

  _aggregate(stmt, { aliasSeparator = ' as ', distinctParentheses } = {}) {
    const value = stmt.value;
    const method = stmt.method;
    const distinct = stmt.aggregateDistinct ? 'distinct ' : '';
    const wrap = (identifier) => this.formatter.wrap(identifier);
    const addAlias = (value, alias) => {
      if (alias) {
        return value + aliasSeparator + wrap(alias);
      }
      return value;
    };
    const aggregateArray = (value, alias) => {
      let columns = value.map(wrap).join(', ');
      if (distinct) {
        const openParen = distinctParentheses ? '(' : ' ';
        const closeParen = distinctParentheses ? ')' : '';
        columns = distinct.trim() + openParen + columns + closeParen;
      }
      const aggregated = `${method}(${columns})`;
      return addAlias(aggregated, alias);
    };
    const aggregateString = (value, alias) => {
      const aggregated = `${method}(${distinct + wrap(value)})`;
      return addAlias(aggregated, alias);
    };

    if (Array.isArray(value)) {
      return [aggregateArray(value)];
    }

    if (typeof value === 'object') {
      if (stmt.alias) {
        throw new Error('When using an object explicit alias can not be used');
      }
      return Object.entries(value).map(([alias, column]) => {
        if (Array.isArray(column)) {
          return aggregateArray(column, alias);
        }
        return aggregateString(column, alias);
      });
    }

    // Allows us to speciy an alias for the aggregate types.
    const splitOn = value.toLowerCase().indexOf(' as ');
    let column = value;
    let { alias } = stmt;
    if (splitOn !== -1) {
      column = value.slice(0, splitOn);
      if (alias) {
        throw new Error(`Found multiple aliases for same column: ${column}`);
      }
      alias = value.slice(splitOn + 4);
    }
    return [aggregateString(column, alias)];
  }

  aggregate(stmt) {
    return this._aggregate(stmt);
  }

  aggregateRaw(stmt) {
    const distinct = stmt.aggregateDistinct ? 'distinct ' : '';
    return `${stmt.method}(${distinct + this.formatter.unwrapRaw(stmt.value)})`;
  }

  // Compiles all each of the `join` clauses on the query,
  // including any nested join queries.
  join() {
    let sql = '';
    let i = -1;
    const joins = this.grouped.join;
    if (!joins) return '';
    while (++i < joins.length) {
      const join = joins[i];
      const table = join.schema ? `${join.schema}.${join.table}` : join.table;
      if (i > 0) sql += ' ';
      if (join.joinType === 'raw') {
        sql += this.formatter.unwrapRaw(join.table);
      } else {
        sql += join.joinType + ' join ' + this.formatter.wrap(table);
        let ii = -1;
        while (++ii < join.clauses.length) {
          const clause = join.clauses[ii];
          if (ii > 0) {
            sql += ` ${clause.bool} `;
          } else {
            sql += ` ${clause.type === 'onUsing' ? 'using' : 'on'} `;
          }
          const val = this[clause.type].call(this, clause);
          if (val) {
            sql += val;
          }
        }
      }
    }
    return sql;
  }

  onBetween(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      map(statement.value, bind(this.formatter.parameter, this.formatter)).join(
        ' and '
      )
    );
  }

  onNull(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  onExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      this.formatter.rawOrFn(statement.value) +
      ')'
    );
  }

  onIn(statement) {
    if (Array.isArray(statement.column)) return this.multiOnIn(statement);
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'in ') +
      this.wrap(this.formatter.parameterize(statement.value))
    );
  }

  multiOnIn(statement) {
    let i = -1,
      sql = `(${this.formatter.columnize(statement.column)}) `;
    sql += this._not(statement, 'in ') + '((';
    while (++i < statement.value.length) {
      if (i !== 0) sql += '),(';
      sql += this.formatter.parameterize(statement.value[i]);
    }
    return sql + '))';
  }

  // Compiles all `where` statements on the query.
  where() {
    const wheres = this.grouped.where;
    if (!wheres) return;
    const sql = [];
    let i = -1;
    while (++i < wheres.length) {
      const stmt = wheres[i];
      if (
        Object.prototype.hasOwnProperty.call(stmt, 'value') &&
        helpers.containsUndefined(stmt.value)
      ) {
        this.undefinedBindingsInfo.push(stmt.column);
        this._undefinedInWhereClause = true;
      }
      const val = this[stmt.type](stmt);
      if (val) {
        if (sql.length === 0) {
          sql[0] = 'where';
        } else {
          sql.push(stmt.bool);
        }
        sql.push(val);
      }
    }
    return sql.length > 1 ? sql.join(' ') : '';
  }

  group() {
    return this._groupsOrders('group');
  }

  order() {
    return this._groupsOrders('order');
  }

  // Compiles the `having` statements.
  having() {
    const havings = this.grouped.having;
    if (!havings) return '';
    const sql = ['having'];
    for (let i = 0, l = havings.length; i < l; i++) {
      const s = havings[i];
      const val = this[s.type](s);
      if (val) {
        if (sql.length === 0) {
          sql[0] = 'where';
        }
        if (sql.length > 1 || (sql.length === 1 && sql[0] !== 'having')) {
          sql.push(s.bool);
        }
        sql.push(val);
      }
    }
    return sql.length > 1 ? sql.join(' ') : '';
  }

  havingRaw(statement) {
    return this._not(statement, '') + this.formatter.unwrapRaw(statement.value);
  }

  havingWrapped(statement) {
    const val = this.formatter.rawOrFn(statement.value, 'where');
    return (val && this._not(statement, '') + '(' + val.slice(6) + ')') || '';
  }

  havingBasic(statement) {
    return (
      this._not(statement, '') +
      this.formatter.wrap(statement.column) +
      ' ' +
      this.formatter.operator(statement.operator) +
      ' ' +
      this.formatter.parameter(statement.value)
    );
  }

  havingNull(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  havingExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      this.formatter.rawOrFn(statement.value) +
      ')'
    );
  }

  havingBetween(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      map(statement.value, bind(this.formatter.parameter, this.formatter)).join(
        ' and '
      )
    );
  }

  havingIn(statement) {
    if (Array.isArray(statement.column)) return this.multiHavingIn(statement);
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'in ') +
      this.wrap(this.formatter.parameterize(statement.value))
    );
  }

  multiHavingIn(statement) {
    let i = -1,
      sql = `(${this.formatter.columnize(statement.column)}) `;
    sql += this._not(statement, 'in ') + '((';
    while (++i < statement.value.length) {
      if (i !== 0) sql += '),(';
      sql += this.formatter.parameterize(statement.value[i]);
    }
    return sql + '))';
  }

  // Compile the "union" queries attached to the main query.
  union() {
    const onlyUnions = this.onlyUnions();
    const unions = this.grouped.union;
    if (!unions) return '';
    let sql = '';
    for (let i = 0, l = unions.length; i < l; i++) {
      const union = unions[i];
      if (i > 0) sql += ' ';
      if (i > 0 || !onlyUnions) sql += union.clause + ' ';
      const statement = this.formatter.rawOrFn(union.value);
      if (statement) {
        if (union.wrap) sql += '(';
        sql += statement;
        if (union.wrap) sql += ')';
      }
    }
    return sql;
  }

  // If we haven't specified any columns or a `tableName`, we're assuming this
  // is only being used for unions.
  onlyUnions() {
    return !this.grouped.columns && this.grouped.union && !this.tableName;
  }

  limit() {
    const noLimit = !this.single.limit && this.single.limit !== 0;
    if (noLimit) return '';
    return `limit ${this.formatter.parameter(this.single.limit)}`;
  }

  offset() {
    if (!this.single.offset) return '';
    return `offset ${this.formatter.parameter(this.single.offset)}`;
  }

  // Compiles a `delete` query.
  del() {
    // Make sure tableName is processed by the formatter first.
    const { tableName } = this;
    const withSQL = this.with();
    const wheres = this.where();
    return (
      withSQL +
      `delete from ${this.single.only ? 'only ' : ''}${tableName}` +
      (wheres ? ` ${wheres}` : '')
    );
  }

  // Compiles a `truncate` query.
  truncate() {
    return `truncate ${this.tableName}`;
  }

  // Compiles the "locks".
  lock() {
    if (this.single.lock) {
      return this[this.single.lock]();
    }
  }

  // Compiles the wait mode on the locks.
  waitMode() {
    if (this.single.waitMode) {
      return this[this.single.waitMode]();
    }
  }

  // Fail on unsupported databases
  skipLocked() {
    throw new Error(
      '.skipLocked() is currently only supported on MySQL 8.0+ and PostgreSQL 9.5+'
    );
  }

  // Fail on unsupported databases
  noWait() {
    throw new Error(
      '.noWait() is currently only supported on MySQL 8.0+, MariaDB 10.3.0+ and PostgreSQL 9.5+'
    );
  }

  distinctOn(value) {
    throw new Error('.distinctOn() is currently only supported on PostgreSQL');
  }

  // On Clause
  // ------

  onWrapped(clause) {
    const self = this;

    const wrapJoin = new JoinClause();
    clause.value.call(wrapJoin, wrapJoin);

    let sql = '';
    wrapJoin.clauses.forEach(function (wrapClause, ii) {
      if (ii > 0) {
        sql += ` ${wrapClause.bool} `;
      }
      const val = self[wrapClause.type](wrapClause);
      if (val) {
        sql += val;
      }
    });

    if (sql.length) {
      return `(${sql})`;
    }
    return '';
  }

  onBasic(clause) {
    return (
      this.formatter.wrap(clause.column) +
      ' ' +
      this.formatter.operator(clause.operator) +
      ' ' +
      this.formatter.wrap(clause.value)
    );
  }

  onVal(clause) {
    return (
      this.formatter.wrap(clause.column) +
      ' ' +
      this.formatter.operator(clause.operator) +
      ' ' +
      this.formatter.parameter(clause.value)
    );
  }

  onRaw(clause) {
    return this.formatter.unwrapRaw(clause.value);
  }

  onUsing(clause) {
    return '(' + this.formatter.columnize(clause.column) + ')';
  }

  // Where Clause
  // ------

  whereIn(statement) {
    let columns = null;
    if (Array.isArray(statement.column)) {
      columns = `(${this.formatter.columnize(statement.column)})`;
    } else {
      columns = this.formatter.wrap(statement.column);
    }

    const values = this.formatter.values(statement.value);
    return `${columns} ${this._not(statement, 'in ')}${values}`;
  }

  whereNull(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' is ' +
      this._not(statement, 'null')
    );
  }

  // Compiles a basic "where" clause.
  whereBasic(statement) {
    return (
      this._not(statement, '') +
      this.formatter.wrap(statement.column) +
      ' ' +
      this.formatter.operator(statement.operator) +
      ' ' +
      (statement.asColumn
        ? this.formatter.wrap(statement.value)
        : this.formatter.parameter(statement.value))
    );
  }

  whereExists(statement) {
    return (
      this._not(statement, 'exists') +
      ' (' +
      this.formatter.rawOrFn(statement.value) +
      ')'
    );
  }

  whereWrapped(statement) {
    const val = this.formatter.rawOrFn(statement.value, 'where');
    return (val && this._not(statement, '') + '(' + val.slice(6) + ')') || '';
  }

  whereBetween(statement) {
    return (
      this.formatter.wrap(statement.column) +
      ' ' +
      this._not(statement, 'between') +
      ' ' +
      map(statement.value, bind(this.formatter.parameter, this.formatter)).join(
        ' and '
      )
    );
  }

  // Compiles a "whereRaw" query.
  whereRaw(statement) {
    return this._not(statement, '') + this.formatter.unwrapRaw(statement.value);
  }

  wrap(str) {
    if (str.charAt(0) !== '(') return `(${str})`;
    return str;
  }

  // Compiles all `with` statements on the query.
  with() {
    if (!this.grouped.with || !this.grouped.with.length) {
      return '';
    }
    const withs = this.grouped.with;
    if (!withs) return;
    const sql = [];
    let i = -1;
    let isRecursive = false;
    while (++i < withs.length) {
      const stmt = withs[i];
      if (stmt.recursive) {
        isRecursive = true;
      }
      const val = this[stmt.type](stmt);
      sql.push(val);
    }
    return `with ${isRecursive ? 'recursive ' : ''}${sql.join(', ')} `;
  }

  withWrapped(statement) {
    const val = this.formatter.rawOrFn(statement.value);
    return (
      (val &&
        this.formatter.columnize(statement.alias) + ' as (' + val + ')') ||
      ''
    );
  }

  // Determines whether to add a "not" prefix to the where clause.
  _not(statement, str) {
    if (statement.not) return `not ${str}`;
    return str;
  }

  _prepInsert(data) {
    const isRaw = this.formatter.rawOrFn(data);
    if (isRaw) return isRaw;
    let columns = [];
    const values = [];
    if (!Array.isArray(data)) data = data ? [data] : [];
    let i = -1;
    while (++i < data.length) {
      if (data[i] == null) break;
      if (i === 0) columns = Object.keys(data[i]).sort();
      const row = new Array(columns.length);
      const keys = Object.keys(data[i]);
      let j = -1;
      while (++j < keys.length) {
        const key = keys[j];
        let idx = columns.indexOf(key);
        if (idx === -1) {
          columns = columns.concat(key).sort();
          idx = columns.indexOf(key);
          let k = -1;
          while (++k < values.length) {
            values[k].splice(idx, 0, undefined);
          }
          row.splice(idx, 0, undefined);
        }
        row[idx] = data[i][key];
      }
      values.push(row);
    }
    return {
      columns,
      values,
    };
  }

  // "Preps" the update.
  _prepUpdate(data = {}) {
    const { counter = {} } = this.single;

    for (const column of Object.keys(counter)) {
      //Skip?
      if (has(data, column)) {
        //Needed?
        this.client.logger.warn(
          `increment/decrement called for a column that has already been specified in main .update() call. Ignoring increment/decrement and using value from .update() call.`
        );
        continue;
      }

      let value = counter[column];

      const symbol = value < 0 ? '-' : '+';

      if (symbol === '-') {
        value = -value;
      }

      data[column] = this.client.raw(`?? ${symbol} ?`, [column, value]);
    }

    data = omitBy(data, isUndefined);

    const vals = [];
    const columns = Object.keys(data);
    let i = -1;

    while (++i < columns.length) {
      vals.push(
        this.formatter.wrap(columns[i]) +
          ' = ' +
          this.formatter.parameter(data[columns[i]])
      );
    }

    if (isEmpty(vals)) {
      throw new Error(
        [
          'Empty .update() call detected!',
          'Update data does not contain any values to update.',
          'This will result in a faulty query.',
          this.single.table ? `Table: ${this.single.table}.` : '',
          this.single.update
            ? `Columns: ${Object.keys(this.single.update)}.`
            : '',
        ].join(' ')
      );
    }

    return vals;
  }

  _formatGroupsItemValue(value) {
    const { formatter } = this;
    if (value instanceof Raw) {
      return formatter.unwrapRaw(value);
    } else if (value instanceof QueryBuilder) {
      return '(' + formatter.columnize(value) + ')';
    } else {
      return formatter.columnize(value);
    }
  }

  // Compiles the `order by` statements.
  _groupsOrders(type) {
    const items = this.grouped[type];
    if (!items) return '';
    const { formatter } = this;
    const sql = items.map((item) => {
      const column = this._formatGroupsItemValue(item.value);
      const direction =
        type === 'order' && item.type !== 'orderByRaw'
          ? ` ${formatter.direction(item.direction)}`
          : '';
      return column + direction;
    });
    return sql.length ? type + ' by ' + sql.join(', ') : '';
  }

  // Get the table name, wrapping it if necessary.
  // Implemented as a property to prevent ordering issues as described in #704.
  get tableName() {
    if (!this._tableName) {
      // Only call this.formatter.wrap() the first time this property is accessed.
      let tableName = this.single.table;
      const schemaName = this.single.schema;

      if (tableName && schemaName) tableName = `${schemaName}.${tableName}`;

      this._tableName = tableName
        ? // Wrap subQuery with parenthesis, #3485
          this.formatter.wrap(tableName, tableName instanceof QueryBuilder)
        : '';
    }
    return this._tableName;
  }
}

export default QueryCompiler;
