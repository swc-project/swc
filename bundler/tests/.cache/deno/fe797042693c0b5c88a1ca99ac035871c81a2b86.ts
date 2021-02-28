// Loaded from https://deno.land/x/denodb@v1.0.18/lib/query-builder.ts


import type { SQLQueryBuilder } from "../deps.ts";
import type { FieldAlias, FieldValue, Values } from "./data-types.ts";
import { Model, ModelDefaults, ModelFields, ModelSchema } from "./model.ts";

export type Query = string;
export type Operator = ">" | ">=" | "<" | "<=" | "=";
export type OrderDirection = "desc" | "asc";
export type QueryType =
  | "create"
  | "drop"
  | "select"
  | "insert"
  | "update"
  | "delete"
  | "count"
  | "min"
  | "max"
  | "avg"
  | "sum";

export type JoinClause = {
  joinTable: string;
  originField: string;
  targetField: string;
};

export type WhereClause = {
  field: string;
  operator: Operator;
  value: FieldValue;
};

export type WhereInClause = {
  field: string;
  possibleValues: FieldValue[];
};

export type OrderByClauses = {
  [field: string]: OrderDirection;
};

export type QueryDescription = {
  schema: ModelSchema;
  type?: QueryType;
  table?: string;
  select?: (string | FieldAlias)[];
  orderBy?: OrderByClauses;
  groupBy?: string;
  wheres?: WhereClause[];
  whereIn?: WhereInClause;
  joins?: JoinClause[];
  leftOuterJoins?: JoinClause[];
  leftJoins?: JoinClause[];
  aggregatorField?: string;
  limit?: number;
  offset?: number;
  ifExists?: boolean;
  fields?: ModelFields;
  fieldsDefaults?: ModelDefaults;
  timestamps?: boolean;
  values?: Values | Values[];
};

export type QueryResult = {};

export type Builder = typeof SQLQueryBuilder;

/** Create queries descriptions. */
export class QueryBuilder {
  _query: QueryDescription = { schema: Model };

  /** Create a fresh new query. */
  queryForSchema(schema: ModelSchema): QueryBuilder {
    return new QueryBuilder().schema(schema);
  }

  schema(schema: ModelSchema) {
    this._query.schema = schema;
    return this;
  }

  toDescription(): QueryDescription {
    return this._query;
  }

  table(table: string) {
    this._query.table = table;
    return this;
  }

  get() {
    this._query.type = "select";
    return this;
  }

  all() {
    return this.get();
  }

  createTable(
    fields: ModelFields,
    fieldsDefaults: ModelDefaults,
    {
      withTimestamps,
      ifNotExists,
    }: {
      withTimestamps: boolean;
      ifNotExists: boolean;
    },
  ) {
    this._query.type = "create";
    this._query.ifExists = ifNotExists ? false : true;
    this._query.fields = fields;
    this._query.fieldsDefaults = fieldsDefaults;
    this._query.timestamps = withTimestamps;
    return this;
  }

  dropIfExists() {
    this._query.type = "drop";
    this._query.ifExists = true;
    return this;
  }

  select(...fields: (string | FieldAlias)[]) {
    this._query.select = fields;
    return this;
  }

  create(values: Values[]) {
    this._query.type = "insert";
    this._query.values = values;
    return this;
  }

  find(field: string, possibleValues: FieldValue[]) {
    this._query.type = "select";
    this._query.whereIn = {
      field,
      possibleValues,
    };
    return this;
  }

  orderBy(
    field: string,
    orderDirection: OrderDirection,
  ) {
    if (!this._query.orderBy) {
      this._query.orderBy = {};
    }
    this._query.orderBy[field] = orderDirection;
    return this;
  }

  groupBy(field: string) {
    this._query.groupBy = field;
    return this;
  }

  limit(limit: number) {
    this._query.limit = limit;
    return this;
  }

  offset(offset: number) {
    this._query.offset = offset;
    return this;
  }

  where(
    field: string,
    operator: Operator,
    value: FieldValue,
  ) {
    if (!this._query.wheres) {
      this._query.wheres = [];
    }

    const whereClause = {
      field,
      operator,
      value,
    };

    const existingWhereForFieldIndex = this._query.wheres.findIndex((where) =>
      where.field === field
    );

    if (existingWhereForFieldIndex === -1) {
      this._query.wheres.push(whereClause);
    } else {
      this._query.wheres[existingWhereForFieldIndex] = whereClause;
    }

    return this;
  }

  update(values: Values) {
    this._query.type = "update";
    this._query.values = values;
    return this;
  }

  delete() {
    this._query.type = "delete";
    return this;
  }

  join(
    joinTable: string,
    originField: string,
    targetField: string,
  ) {
    if (!this._query.joins) {
      this._query.joins = [];
    }

    this._query.joins.push({
      joinTable,
      originField,
      targetField,
    });

    return this;
  }

  leftOuterJoin(
    joinTable: string,
    originField: string,
    targetField: string,
  ) {
    if (!this._query.leftOuterJoins) {
      this._query.leftOuterJoins = [];
    }

    this._query.leftOuterJoins.push({
      joinTable,
      originField,
      targetField,
    });

    return this;
  }

  leftJoin(
    joinTable: string,
    originField: string,
    targetField: string,
  ) {
    if (!this._query.leftJoins) {
      this._query.leftJoins = [];
    }

    this._query.leftJoins.push({
      joinTable,
      originField,
      targetField,
    });

    return this;
  }

  count(field: string) {
    this._query.type = "count";
    this._query.aggregatorField = field;
    return this;
  }

  min(field: string) {
    this._query.type = "min";
    this._query.aggregatorField = field;
    return this;
  }

  max(field: string) {
    this._query.type = "max";
    this._query.aggregatorField = field;
    return this;
  }

  sum(field: string) {
    this._query.type = "sum";
    this._query.aggregatorField = field;
    return this;
  }

  avg(field: string) {
    this._query.type = "avg";
    this._query.aggregatorField = field;
    return this;
  }
}
