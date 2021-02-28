// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/oracle/query/compiler.js


/* eslint max-len:0 */

// Oracle Query Builder & Compiler
// ------
import _ from '../../../deps/lodash@4.17.15/index.js';
const compact = _.compact;
const identity = _.identity;
const isEmpty = _.isEmpty;
const isPlainObject = _.isPlainObject;
const isString = _.isString;
const reduce = _.reduce;
import QueryCompiler from '../../../query/compiler.js';
import { ReturningHelper } from '../utils.js';

const components = [
  'columns',
  'join',
  'where',
  'union',
  'group',
  'having',
  'order',
  'lock',
];

// Query Compiler
// -------

// Set the "Formatter" to use for the queries,
// ensuring that all parameterized values (even across sub-queries)
// are properly built into the same query.
class QueryCompiler_Oracle extends QueryCompiler {
  constructor(client, builder) {
    super(client, builder);

    // Compiles the `select` statement, or nested sub-selects
    // by calling each of the component compilers, trimming out
    // the empties, and returning a generated query string.
    this.first = this.select;
  }

  // Compiles an "insert" query, allowing for multiple
  // inserts using a single query statement.
  insert() {
    let insertValues = this.single.insert || [];
    let { returning } = this.single;

    if (!Array.isArray(insertValues) && isPlainObject(this.single.insert)) {
      insertValues = [this.single.insert];
    }

    // always wrap returning argument in array
    if (returning && !Array.isArray(returning)) {
      returning = [returning];
    }

    if (
      Array.isArray(insertValues) &&
      insertValues.length === 1 &&
      isEmpty(insertValues[0])
    ) {
      return this._addReturningToSqlAndConvert(
        `insert into ${this.tableName} (${this.formatter.wrap(
          this.single.returning
        )}) values (default)`,
        returning,
        this.tableName
      );
    }

    if (
      isEmpty(this.single.insert) &&
      typeof this.single.insert !== 'function'
    ) {
      return '';
    }

    const insertData = this._prepInsert(insertValues);

    const sql = {};

    if (isString(insertData)) {
      return this._addReturningToSqlAndConvert(
        `insert into ${this.tableName} ${insertData}`,
        returning
      );
    }

    if (insertData.values.length === 1) {
      return this._addReturningToSqlAndConvert(
        `insert into ${this.tableName} (${this.formatter.columnize(
          insertData.columns
        )}) values (${this.formatter.parameterize(insertData.values[0])})`,
        returning,
        this.tableName
      );
    }

    const insertDefaultsOnly = insertData.columns.length === 0;

    sql.sql =
      'begin ' +
      insertData.values
        .map((value) => {
          let returningHelper;
          const parameterizedValues = !insertDefaultsOnly
            ? this.formatter.parameterize(value, this.client.valueForUndefined)
            : '';
          const returningValues = Array.isArray(returning)
            ? returning
            : [returning];
          let subSql = `insert into ${this.tableName} `;

          if (returning) {
            returningHelper = new ReturningHelper(returningValues.join(':'));
            sql.outParams = (sql.outParams || []).concat(returningHelper);
          }

          if (insertDefaultsOnly) {
            // no columns given so only the default value
            subSql += `(${this.formatter.wrap(
              this.single.returning
            )}) values (default)`;
          } else {
            subSql += `(${this.formatter.columnize(
              insertData.columns
            )}) values (${parameterizedValues})`;
          }
          subSql += returning
            ? ` returning ROWID into ${this.formatter.parameter(
                returningHelper
              )}`
            : '';

          // pre bind position because subSql is an execute immediate parameter
          // later position binding will only convert the ? params

          subSql = this.formatter.client.positionBindings(subSql);

          const parameterizedValuesWithoutDefault = parameterizedValues
            .replace('DEFAULT, ', '')
            .replace(', DEFAULT', '');
          return (
            `execute immediate '${subSql.replace(/'/g, "''")}` +
            (parameterizedValuesWithoutDefault || returning ? "' using " : '') +
            parameterizedValuesWithoutDefault +
            (parameterizedValuesWithoutDefault && returning ? ', ' : '') +
            (returning ? 'out ?' : '') +
            ';'
          );
        })
        .join(' ') +
      'end;';

    if (returning) {
      sql.returning = returning;
      // generate select statement with special order by to keep the order because 'in (..)' may change the order
      sql.returningSql =
        `select ${this.formatter.columnize(returning)}` +
        ' from ' +
        this.tableName +
        ' where ROWID in (' +
        sql.outParams.map((v, i) => `:${i + 1}`).join(', ') +
        ')' +
        ' order by case ROWID ' +
        sql.outParams
          .map((v, i) => `when CHARTOROWID(:${i + 1}) then ${i}`)
          .join(' ') +
        ' end';
    }

    return sql;
  }

  // Update method, including joins, wheres, order & limits.
  update() {
    const updates = this._prepUpdate(this.single.update);
    const where = this.where();
    let { returning } = this.single;
    const sql =
      `update ${this.tableName}` +
      ' set ' +
      updates.join(', ') +
      (where ? ` ${where}` : '');

    if (!returning) {
      return sql;
    }

    // always wrap returning argument in array
    if (!Array.isArray(returning)) {
      returning = [returning];
    }

    return this._addReturningToSqlAndConvert(sql, returning, this.tableName);
  }

  // Compiles a `truncate` query.
  truncate() {
    return `truncate table ${this.tableName}`;
  }

  forUpdate() {
    return 'for update';
  }

  forShare() {
    // lock for share is not directly supported by oracle
    // use LOCK TABLE .. IN SHARE MODE; instead
    this.client.logger.warn(
      'lock for share is not supported by oracle dialect'
    );
    return '';
  }

  // Compiles a `columnInfo` query.
  columnInfo() {
    const column = this.single.columnInfo;

    // The user may have specified a custom wrapIdentifier function in the config. We
    // need to run the identifiers through that function, but not format them as
    // identifiers otherwise.
    const table = this.client.customWrapIdentifier(this.single.table, identity);

    // Node oracle drivers doesn't support LONG type (which is data_default type)
    const sql = `select * from xmltable( '/ROWSET/ROW'
      passing dbms_xmlgen.getXMLType('
      select char_col_decl_length, column_name, data_type, data_default, nullable
      from user_tab_columns where table_name = ''${table}'' ')
      columns
      CHAR_COL_DECL_LENGTH number, COLUMN_NAME varchar2(200), DATA_TYPE varchar2(106),
      DATA_DEFAULT clob, NULLABLE varchar2(1))`;

    return {
      sql: sql,
      output(resp) {
        const out = reduce(
          resp,
          function (columns, val) {
            columns[val.COLUMN_NAME] = {
              type: val.DATA_TYPE,
              defaultValue: val.DATA_DEFAULT,
              maxLength: val.CHAR_COL_DECL_LENGTH,
              nullable: val.NULLABLE === 'Y',
            };
            return columns;
          },
          {}
        );
        return (column && out[column]) || out;
      },
    };
  }

  select() {
    let query = this.with();
    const statements = components.map((component) => {
      return this[component]();
    });
    query += compact(statements).join(' ');
    return this._surroundQueryWithLimitAndOffset(query);
  }

  aggregate(stmt) {
    return this._aggregate(stmt, { aliasSeparator: ' ' });
  }

  // for single commands only
  _addReturningToSqlAndConvert(sql, returning, tableName) {
    const res = {
      sql,
    };

    if (!returning) {
      return res;
    }

    const returningValues = Array.isArray(returning) ? returning : [returning];
    const returningHelper = new ReturningHelper(returningValues.join(':'));
    res.sql =
      sql +
      ' returning ROWID into ' +
      this.formatter.parameter(returningHelper);
    res.returningSql = `select ${this.formatter.columnize(
      returning
    )} from ${tableName} where ROWID = :1`;
    res.outParams = [returningHelper];
    res.returning = returning;
    return res;
  }

  _surroundQueryWithLimitAndOffset(query) {
    let { limit } = this.single;
    const { offset } = this.single;
    const hasLimit = limit || limit === 0 || limit === '0';
    limit = +limit;

    if (!hasLimit && !offset) return query;
    query = query || '';

    if (hasLimit && !offset) {
      return `select * from (${query}) where rownum <= ${this.formatter.parameter(
        limit
      )}`;
    }

    const endRow = +offset + (hasLimit ? limit : 10000000000000);

    return (
      'select * from ' +
      '(select row_.*, ROWNUM rownum_ from (' +
      query +
      ') row_ ' +
      'where rownum <= ' +
      this.formatter.parameter(endRow) +
      ') ' +
      'where rownum_ > ' +
      this.formatter.parameter(offset)
    );
  }
}

export default QueryCompiler_Oracle;
