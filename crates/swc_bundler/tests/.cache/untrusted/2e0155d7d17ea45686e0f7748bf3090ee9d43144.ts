// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/formatter.js


import QueryBuilder from './query/builder.js';
import Raw from './raw.js';
import _ from './deps/lodash@4.17.15/index.js';
const transform = _.transform;

// Valid values for the `order by` clause generation.
const orderBys = ['asc', 'desc'];

// Turn this into a lookup map
const operators = transform(
  [
    '=',
    '<',
    '>',
    '<=',
    '>=',
    '<>',
    '!=',
    'like',
    'not like',
    'between',
    'not between',
    'ilike',
    'not ilike',
    'exists',
    'not exist',
    'rlike',
    'not rlike',
    'regexp',
    'not regexp',
    '&',
    '|',
    '^',
    '<<',
    '>>',
    '~',
    '~*',
    '!~',
    '!~*',
    '#',
    '&&',
    '@>',
    '<@',
    '||',
    '&<',
    '&>',
    '-|-',
    '@@',
    '!!',
    ['?', '\\?'],
    ['?|', '\\?|'],
    ['?&', '\\?&'],
  ],
  (result, key) => {
    if (Array.isArray(key)) {
      result[key[0]] = key[1];
    } else {
      result[key] = key;
    }
  },
  {}
);

class Formatter {
  constructor(client, builder) {
    this.client = client;
    this.builder = builder;
    this.bindings = [];
  }

  // Accepts a string or array of columns to wrap as appropriate.
  columnize(target) {
    const columns = Array.isArray(target) ? target : [target];
    let str = '',
      i = -1;
    while (++i < columns.length) {
      if (i > 0) str += ', ';
      str += this.wrap(columns[i]);
    }
    return str;
  }

  // Turns a list of values into a list of ?'s, joining them with commas unless
  // a "joining" value is specified (e.g. ' and ')
  parameterize(values, notSetValue) {
    if (typeof values === 'function') return this.parameter(values);
    values = Array.isArray(values) ? values : [values];
    let str = '',
      i = -1;
    while (++i < values.length) {
      if (i > 0) str += ', ';
      str += this.parameter(values[i] === undefined ? notSetValue : values[i]);
    }
    return str;
  }

  // Formats `values` into a parenthesized list of parameters for a `VALUES`
  // clause.
  //
  // [1, 2]                  -> '(?, ?)'
  // [[1, 2], [3, 4]]        -> '((?, ?), (?, ?))'
  // knex('table')           -> '(select * from "table")'
  // knex.raw('select ?', 1) -> '(select ?)'
  //
  values(values) {
    if (Array.isArray(values)) {
      if (Array.isArray(values[0])) {
        return `(${values
          .map((value) => `(${this.parameterize(value)})`)
          .join(', ')})`;
      }
      return `(${this.parameterize(values)})`;
    }

    if (values instanceof Raw) {
      return `(${this.parameter(values)})`;
    }

    return this.parameter(values);
  }

  // Checks whether a value is a function... if it is, we compile it
  // otherwise we check whether it's a raw
  parameter(value) {
    if (typeof value === 'function') {
      return this.outputQuery(this.compileCallback(value), true);
    }
    return this.unwrapRaw(value, true) || '?';
  }

  unwrapRaw(value, isParameter) {
    let query;
    if (value instanceof QueryBuilder) {
      query = this.client.queryCompiler(value).toSQL();
      if (query.bindings) {
        this.bindings = this.bindings.concat(query.bindings);
      }
      return this.outputQuery(query, isParameter);
    }
    if (value instanceof Raw) {
      value.client = this.client;
      if (this.builder._queryContext) {
        value.queryContext = () => {
          return this.builder._queryContext;
        };
      }

      query = value.toSQL();
      if (query.bindings) {
        this.bindings = this.bindings.concat(query.bindings);
      }
      return query.sql;
    }
    if (isParameter) {
      this.bindings.push(value);
    }
  }

  /**
   * Creates SQL for a parameter, which might be passed to where() or .with() or
   * pretty much anywhere in API.
   *
   * @param query Callback (for where or complete builder), Raw or QueryBuilder
   * @param method Optional at least 'select' or 'update' are valid
   */
  rawOrFn(value, method) {
    if (typeof value === 'function') {
      return this.outputQuery(this.compileCallback(value, method));
    }
    return this.unwrapRaw(value) || '';
  }

  // Puts the appropriate wrapper around a value depending on the database
  // engine, unless it's a knex.raw value, in which case it's left alone.
  wrap(value, isParameter) {
    const raw = this.unwrapRaw(value, isParameter);
    if (raw) return raw;
    switch (typeof value) {
      case 'function':
        return this.outputQuery(this.compileCallback(value), true);
      case 'object':
        return this.parseObject(value);
      case 'number':
        return value;
      default:
        return this.wrapString(value + '');
    }
  }

  wrapAsIdentifier(value) {
    const queryContext = this.builder.queryContext();
    return this.client.wrapIdentifier((value || '').trim(), queryContext);
  }

  alias(first, second) {
    return first + ' as ' + second;
  }

  operator(value) {
    const raw = this.unwrapRaw(value);
    if (raw) return raw;
    const operator = operators[(value || '').toLowerCase()];
    if (!operator) {
      throw new TypeError(`The operator "${value}" is not permitted`);
    }
    return operator;
  }

  // Specify the direction of the ordering.
  direction(value) {
    const raw = this.unwrapRaw(value);
    if (raw) return raw;
    return orderBys.indexOf((value || '').toLowerCase()) !== -1 ? value : 'asc';
  }

  // Compiles a callback using the query builder.
  compileCallback(callback, method) {
    const { client } = this;

    // Build the callback
    const builder = client.queryBuilder();
    callback.call(builder, builder);

    // Compile the callback, using the current formatter (to track all bindings).
    const compiler = client.queryCompiler(builder);
    compiler.formatter = this;

    // Return the compiled & parameterized sql.
    return compiler.toSQL(method || builder._method || 'select');
  }

  // Ensures the query is aliased if necessary.
  outputQuery(compiled, isParameter) {
    let sql = compiled.sql || '';
    if (sql) {
      if (
        (compiled.method === 'select' || compiled.method === 'first') &&
        (isParameter || compiled.as)
      ) {
        sql = `(${sql})`;
        if (compiled.as) return this.alias(sql, this.wrap(compiled.as));
      }
    }
    return sql;
  }

  // Key-value notation for alias
  parseObject(obj) {
    const ret = [];
    for (const alias in obj) {
      const queryOrIdentifier = obj[alias];
      // Avoids double aliasing for subqueries
      if (typeof queryOrIdentifier === 'function') {
        const compiled = this.compileCallback(queryOrIdentifier);
        compiled.as = alias; // enforces the object's alias
        ret.push(this.outputQuery(compiled, true));
      } else if (queryOrIdentifier instanceof QueryBuilder) {
        ret.push(
          this.alias(
            `(${this.wrap(queryOrIdentifier)})`,
            this.wrapAsIdentifier(alias)
          )
        );
      } else {
        ret.push(
          this.alias(this.wrap(queryOrIdentifier), this.wrapAsIdentifier(alias))
        );
      }
    }
    return ret.join(', ');
  }

  // Coerce to string to prevent strange errors when it's not a string.
  wrapString(value) {
    const asIndex = value.toLowerCase().indexOf(' as ');
    if (asIndex !== -1) {
      const first = value.slice(0, asIndex);
      const second = value.slice(asIndex + 4);
      return this.alias(this.wrap(first), this.wrapAsIdentifier(second));
    }
    const wrapped = [];
    let i = -1;
    const segments = value.split('.');
    while (++i < segments.length) {
      value = segments[i];
      if (i === 0 && segments.length > 1) {
        wrapped.push(this.wrap((value || '').trim()));
      } else {
        wrapped.push(this.wrapAsIdentifier(value));
      }
    }
    return wrapped.join('.');
  }
}

export default Formatter;
