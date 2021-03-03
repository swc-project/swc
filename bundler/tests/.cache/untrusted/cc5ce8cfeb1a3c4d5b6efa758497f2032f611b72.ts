// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/oracledb/query/compiler.js


import _ from '../../../deps/lodash@4.17.15/index.js';
const clone = _.clone;
const each = _.each;
const isEmpty = _.isEmpty;
const isPlainObject = _.isPlainObject;
const isString = _.isString;
import Oracle_Compiler from '../../oracle/query/compiler.js';
import utils from '../utils.js';
const ReturningHelper = utils.ReturningHelper;
const BlobHelper = utils.BlobHelper;

class Oracledb_Compiler extends Oracle_Compiler {
  constructor(client, builder) {
    super(client, builder);
  }

  // Compiles an "insert" query, allowing for multiple
  // inserts using a single query statement.
  insert() {
    const self = this;
    const outBindPrep = this._prepOutbindings(
      this.single.insert,
      this.single.returning
    );
    const outBinding = outBindPrep.outBinding;
    const returning = outBindPrep.returning;
    const insertValues = outBindPrep.values;

    if (
      Array.isArray(insertValues) &&
      insertValues.length === 1 &&
      isEmpty(insertValues[0])
    ) {
      return this._addReturningToSqlAndConvert(
        'insert into ' +
          this.tableName +
          ' (' +
          this.formatter.wrap(this.single.returning) +
          ') values (default)',
        outBinding[0],
        this.tableName,
        returning
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
        'insert into ' + this.tableName + ' ' + insertData,
        outBinding[0],
        this.tableName,
        returning
      );
    }

    if (insertData.values.length === 1) {
      return this._addReturningToSqlAndConvert(
        'insert into ' +
          this.tableName +
          ' (' +
          this.formatter.columnize(insertData.columns) +
          ') values (' +
          this.formatter.parameterize(insertData.values[0]) +
          ')',
        outBinding[0],
        this.tableName,
        returning
      );
    }

    const insertDefaultsOnly = insertData.columns.length === 0;
    sql.returning = returning;
    sql.sql =
      'begin ' +
      insertData.values
        .map(function (value, index) {
          const parameterizedValues = !insertDefaultsOnly
            ? self.formatter.parameterize(value, self.client.valueForUndefined)
            : '';
          let subSql = 'insert into ' + self.tableName;

          if (insertDefaultsOnly) {
            // No columns given so only the default value
            subSql +=
              ' (' +
              self.formatter.wrap(self.single.returning) +
              ') values (default)';
          } else {
            subSql +=
              ' (' +
              self.formatter.columnize(insertData.columns) +
              ') values (' +
              parameterizedValues +
              ')';
          }

          let returningClause = '';
          let intoClause = '';
          // ToDo review if this code is still needed or could be dropped
          // eslint-disable-next-line no-unused-vars
          let usingClause = '';
          let outClause = '';

          each(value, function (val) {
            if (!(val instanceof BlobHelper)) {
              usingClause += ' ?,';
            }
          });
          usingClause = usingClause.slice(0, -1);

          // Build returning and into clauses
          outBinding[index].forEach(function (ret) {
            const columnName = ret.columnName || ret;
            returningClause += self.formatter.wrap(columnName) + ',';
            intoClause += ' ?,';
            outClause += ' out ?,';

            // Add Helpers to bindings
            if (ret instanceof BlobHelper) {
              return self.formatter.bindings.push(ret);
            }
            self.formatter.bindings.push(new ReturningHelper(columnName));
          });

          // Strip last comma
          returningClause = returningClause.slice(0, -1);
          intoClause = intoClause.slice(0, -1);
          outClause = outClause.slice(0, -1);

          if (returningClause && intoClause) {
            subSql += ' returning ' + returningClause + ' into' + intoClause;
          }

          // Pre bind position because subSql is an execute immediate parameter
          // later position binding will only convert the ? params
          subSql = self.formatter.client.positionBindings(subSql);
          const parameterizedValuesWithoutDefaultAndBlob = parameterizedValues
            .replace('DEFAULT, ', '')
            .replace(', DEFAULT', '')
            .replace('EMPTY_BLOB(), ', '')
            .replace(', EMPTY_BLOB()', '');
          return (
            "execute immediate '" +
            subSql.replace(/'/g, "''") +
            (parameterizedValuesWithoutDefaultAndBlob || value
              ? "' using "
              : '') +
            parameterizedValuesWithoutDefaultAndBlob +
            (parameterizedValuesWithoutDefaultAndBlob && outClause ? ',' : '') +
            outClause +
            ';'
          );
        })
        .join(' ') +
      'end;';

    sql.outBinding = outBinding;
    if (returning[0] === '*') {
      // Generate select statement with special order by
      // to keep the order because 'in (..)' may change the order
      sql.returningSql = function () {
        return (
          'select * from ' +
          self.tableName +
          ' where ROWID in (' +
          this.outBinding
            .map(function (v, i) {
              return ':' + (i + 1);
            })
            .join(', ') +
          ')' +
          ' order by case ROWID ' +
          this.outBinding
            .map(function (v, i) {
              return 'when CHARTOROWID(:' + (i + 1) + ') then ' + i;
            })
            .join(' ') +
          ' end'
        );
      };
    }

    return sql;
  }

  _addReturningToSqlAndConvert(sql, outBinding, tableName, returning) {
    const self = this;
    const res = {
      sql: sql,
    };

    if (!outBinding) {
      return res;
    }
    const returningValues = Array.isArray(outBinding)
      ? outBinding
      : [outBinding];
    let returningClause = '';
    let intoClause = '';
    // Build returning and into clauses
    returningValues.forEach(function (ret) {
      const columnName = ret.columnName || ret;
      returningClause += self.formatter.wrap(columnName) + ',';
      intoClause += '?,';

      // Add Helpers to bindings
      if (ret instanceof BlobHelper) {
        return self.formatter.bindings.push(ret);
      }
      self.formatter.bindings.push(new ReturningHelper(columnName));
    });
    res.sql = sql;

    // Strip last comma
    returningClause = returningClause.slice(0, -1);
    intoClause = intoClause.slice(0, -1);
    if (returningClause && intoClause) {
      res.sql += ' returning ' + returningClause + ' into ' + intoClause;
    }
    res.outBinding = [outBinding];
    if (returning[0] === '*') {
      res.returningSql = function () {
        return 'select * from ' + self.tableName + ' where ROWID = :1';
      };
    }
    res.returning = returning;

    return res;
  }

  _prepOutbindings(paramValues, paramReturning) {
    const result = {};
    let params = paramValues || [];
    let returning = paramReturning || [];
    if (!Array.isArray(params) && isPlainObject(paramValues)) {
      params = [params];
    }
    // Always wrap returning argument in array
    if (returning && !Array.isArray(returning)) {
      returning = [returning];
    }

    const outBinding = [];
    // Handle Buffer value as Blob
    each(params, function (values, index) {
      if (returning[0] === '*') {
        outBinding[index] = ['ROWID'];
      } else {
        outBinding[index] = clone(returning);
      }
      each(values, function (value, key) {
        if (value instanceof Buffer) {
          values[key] = new BlobHelper(key, value);

          // Delete blob duplicate in returning
          const blobIndex = outBinding[index].indexOf(key);
          if (blobIndex >= 0) {
            outBinding[index].splice(blobIndex, 1);
            values[key].returning = true;
          }
          outBinding[index].push(values[key]);
        }
        if (value === undefined) {
          delete params[index][key];
        }
      });
    });
    result.returning = returning;
    result.outBinding = outBinding;
    result.values = params;
    return result;
  }

  update() {
    const self = this;
    const sql = {};
    const outBindPrep = this._prepOutbindings(
      this.single.update || this.single.counter,
      this.single.returning
    );
    const outBinding = outBindPrep.outBinding;
    const returning = outBindPrep.returning;

    const updates = this._prepUpdate(this.single.update);
    const where = this.where();

    let returningClause = '';
    let intoClause = '';

    if (isEmpty(updates) && typeof this.single.update !== 'function') {
      return '';
    }

    // Build returning and into clauses
    outBinding.forEach(function (out) {
      out.forEach(function (ret) {
        const columnName = ret.columnName || ret;
        returningClause += self.formatter.wrap(columnName) + ',';
        intoClause += ' ?,';

        // Add Helpers to bindings
        if (ret instanceof BlobHelper) {
          return self.formatter.bindings.push(ret);
        }
        self.formatter.bindings.push(new ReturningHelper(columnName));
      });
    });
    // Strip last comma
    returningClause = returningClause.slice(0, -1);
    intoClause = intoClause.slice(0, -1);

    sql.outBinding = outBinding;
    sql.returning = returning;
    sql.sql =
      'update ' +
      this.tableName +
      ' set ' +
      updates.join(', ') +
      (where ? ' ' + where : '');
    if (outBinding.length && !isEmpty(outBinding[0])) {
      sql.sql += ' returning ' + returningClause + ' into' + intoClause;
    }
    if (returning[0] === '*') {
      sql.returningSql = function () {
        let sql = 'select * from ' + self.tableName;
        const modifiedRowsCount = this.rowsAffected.length || this.rowsAffected;
        let returningSqlIn = ' where ROWID in (';
        let returningSqlOrderBy = ') order by case ROWID ';

        // Needs special order by because in(...) change result order
        for (let i = 0; i < modifiedRowsCount; i++) {
          if (this.returning[0] === '*') {
            returningSqlIn += ':' + (i + 1) + ', ';
            returningSqlOrderBy +=
              'when CHARTOROWID(:' + (i + 1) + ') then ' + i + ' ';
          }
        }
        if (this.returning[0] === '*') {
          this.returning = this.returning.slice(0, -1);
          returningSqlIn = returningSqlIn.slice(0, -2);
          returningSqlOrderBy = returningSqlOrderBy.slice(0, -1);
        }
        return (sql += returningSqlIn + returningSqlOrderBy + ' end');
      };
    }

    return sql;
  }
}

export default Oracledb_Compiler;
