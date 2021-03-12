// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/query/joinclause.js


import assert from '../deps/@jspm/core@1.1.0/nodelibs/assert.js';

// JoinClause
// -------

// The "JoinClause" is an object holding any necessary info about a join,
// including the type, and any associated tables & columns being joined.
function JoinClause(table, type, schema) {
  this.schema = schema;
  this.table = table;
  this.joinType = type;
  this.and = this;
  this.clauses = [];
}

function getClauseFromArguments(compilerType, bool, first, operator, second) {
  let data = null;

  if (typeof first === 'function') {
    data = {
      type: 'onWrapped',
      value: first,
      bool: bool,
    };
  } else {
    switch (arguments.length) {
      case 3: {
        data = { type: 'onRaw', value: first, bool };
        break;
      }
      case 4:
        data = {
          type: compilerType,
          column: first,
          operator: '=',
          value: operator,
          bool,
        };
        break;
      default:
        data = {
          type: compilerType,
          column: first,
          operator,
          value: second,
          bool,
        };
    }
  }

  return data;
}

Object.assign(JoinClause.prototype, {
  grouping: 'join',

  // Adds an "on" clause to the current join object.
  on(first) {
    if (typeof first === 'object' && typeof first.toSQL !== 'function') {
      const keys = Object.keys(first);
      let i = -1;
      const method = this._bool() === 'or' ? 'orOn' : 'on';
      while (++i < keys.length) {
        this[method](keys[i], first[keys[i]]);
      }
      return this;
    }

    const data = getClauseFromArguments('onBasic', this._bool(), ...arguments);

    if (data) {
      this.clauses.push(data);
    }

    return this;
  },

  // Adds a "using" clause to the current join.
  using(column) {
    return this.clauses.push({ type: 'onUsing', column, bool: this._bool() });
  },

  /*// Adds an "and on" clause to the current join object.
  andOn() {
    return this.on.apply(this, arguments);
  },*/

  // Adds an "or on" clause to the current join object.
  orOn(first, operator, second) {
    return this._bool('or').on.apply(this, arguments);
  },

  onVal(first) {
    if (typeof first === 'object' && typeof first.toSQL !== 'function') {
      const keys = Object.keys(first);
      let i = -1;
      const method = this._bool() === 'or' ? 'orOnVal' : 'onVal';
      while (++i < keys.length) {
        this[method](keys[i], first[keys[i]]);
      }
      return this;
    }

    const data = getClauseFromArguments('onVal', this._bool(), ...arguments);

    if (data) {
      this.clauses.push(data);
    }

    return this;
  },

  andOnVal() {
    return this.onVal(...arguments);
  },

  orOnVal() {
    return this._bool('or').onVal(...arguments);
  },

  onBetween(column, values) {
    assert(
      Array.isArray(values),
      'The second argument to onBetween must be an array.'
    );
    assert(
      values.length === 2,
      'You must specify 2 values for the onBetween clause'
    );
    this.clauses.push({
      type: 'onBetween',
      column,
      value: values,
      bool: this._bool(),
      not: this._not(),
    });
    return this;
  },

  onNotBetween(column, values) {
    return this._not(true).onBetween(column, values);
  },

  orOnBetween(column, values) {
    return this._bool('or').onBetween(column, values);
  },

  orOnNotBetween(column, values) {
    return this._bool('or')._not(true).onBetween(column, values);
  },

  onIn(column, values) {
    if (Array.isArray(values) && values.length === 0) return this.on(1, '=', 0);
    this.clauses.push({
      type: 'onIn',
      column,
      value: values,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  onNotIn(column, values) {
    return this._not(true).onIn(column, values);
  },

  orOnIn(column, values) {
    return this._bool('or').onIn(column, values);
  },

  orOnNotIn(column, values) {
    return this._bool('or')._not(true).onIn(column, values);
  },

  onNull(column) {
    this.clauses.push({
      type: 'onNull',
      column,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orOnNull(callback) {
    return this._bool('or').onNull(callback);
  },

  onNotNull(callback) {
    return this._not(true).onNull(callback);
  },

  orOnNotNull(callback) {
    return this._not(true)._bool('or').onNull(callback);
  },

  onExists(callback) {
    this.clauses.push({
      type: 'onExists',
      value: callback,
      not: this._not(),
      bool: this._bool(),
    });
    return this;
  },

  orOnExists(callback) {
    return this._bool('or').onExists(callback);
  },

  onNotExists(callback) {
    return this._not(true).onExists(callback);
  },

  orOnNotExists(callback) {
    return this._not(true)._bool('or').onExists(callback);
  },

  // Explicitly set the type of join, useful within a function when creating a grouped join.
  type(type) {
    this.joinType = type;
    return this;
  },

  _bool(bool) {
    if (arguments.length === 1) {
      this._boolFlag = bool;
      return this;
    }
    const ret = this._boolFlag || 'and';
    this._boolFlag = 'and';
    return ret;
  },

  _not(val) {
    if (arguments.length === 1) {
      this._notFlag = val;
      return this;
    }
    const ret = this._notFlag;
    this._notFlag = false;
    return ret;
  },
});

Object.defineProperty(JoinClause.prototype, 'or', {
  get() {
    return this._bool('or');
  },
});

JoinClause.prototype.andOn = JoinClause.prototype.on;
JoinClause.prototype.andOnIn = JoinClause.prototype.onIn;
JoinClause.prototype.andOnNotIn = JoinClause.prototype.onNotIn;
JoinClause.prototype.andOnNull = JoinClause.prototype.onNull;
JoinClause.prototype.andOnNotNull = JoinClause.prototype.onNotNull;
JoinClause.prototype.andOnExists = JoinClause.prototype.onExists;
JoinClause.prototype.andOnNotExists = JoinClause.prototype.onNotExists;
JoinClause.prototype.andOnBetween = JoinClause.prototype.onBetween;
JoinClause.prototype.andOnNotBetween = JoinClause.prototype.onNotBetween;

export default JoinClause;
