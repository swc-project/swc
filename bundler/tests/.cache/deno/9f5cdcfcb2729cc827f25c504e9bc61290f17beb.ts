// Loaded from https://deno.land/x/denodb@v1.0.18/lib/model.ts


import type {
  Operator,
  OrderByClauses,
  OrderDirection,
  QueryBuilder,
  QueryDescription,
  QueryType,
} from "./query-builder.ts";
import type { Database } from "./database.ts";
import type { PivotModelSchema } from "./model-pivot.ts";
import { camelCase } from "../deps.ts";
import {
  DataTypes,
  FieldAlias,
  FieldOptions,
  FieldProps,
  FieldType,
  FieldTypeString,
  FieldValue,
  Values,
} from "./data-types.ts";

/** Represents a Model class, not an instance. */
export type ModelSchema = typeof Model;

export type ModelFields = { [key: string]: FieldType };
export type ModelDefaults = {
  [field: string]: FieldValue | (() => FieldValue);
};
export type ModelPivotModels = { [modelName: string]: PivotModelSchema };
export type FieldMatchingTable = { [clientField: string]: string };

export type ModelOptions = {
  queryBuilder: QueryBuilder;
  database: Database;
};

export type AggregationResult = Model & {
  avg?: number;
  count?: number;
  max?: number;
  min?: number;
  sum?: number;
};

export type ModelEventType =
  | "creating"
  | "created"
  | "updating"
  | "updated"
  | "deleting"
  | "deleted";

export type ModelEventListenerWithModel = (model: Model) => void;
export type ModelEventListenerWithoutModel = (model?: Model) => void;
export type ModelEventListener =
  | ModelEventListenerWithoutModel
  | ModelEventListenerWithModel;

export type ModelEventListeners = {
  [eventType in ModelEventType]?: ModelEventListener[];
};

/** Model that can be used with a `Database`. */
export class Model {
  [attribute: string]: FieldValue | Function

  /** Table name as it should be saved in the database. */
  static table = "";

  /** Should this model have `created_at` and `updated_at` fields by default. */
  static timestamps = false;

  /** Model fields. */
  static fields: ModelFields = {};

  /** Default values for the model fields. */
  static defaults: ModelDefaults = {};

  /** Pivot table to use for a given model. */
  static pivot: ModelPivotModels = {};

  /** If the model has been created in the database. */
  private static _isCreatedInDatabase: boolean = false;

  /** Query builder instance. */
  private static _queryBuilder: QueryBuilder;

  /** Database which this model will be attached to. */
  private static _database: Database;

  /** Model primary key. Manually found through `_findPrimaryKey()`. */
  private static _primaryKey: string;

  /** Model field matching, from database to client and vice versa. */
  private static _fieldMatching: {
    toDatabase: FieldMatchingTable;
    toClient: FieldMatchingTable;
  } = {
    toDatabase: {},
    toClient: {},
  };

  /** Model current query being built. */
  private static _currentQuery: QueryBuilder;

  /** Options this model was initialized with. */
  private static _options: ModelOptions;

  /** Attached event listeners. */
  private static _listeners: ModelEventListeners = {};

  /** Link a model to a database. Should not be called from a child model. */
  static _link(options: ModelOptions) {
    this._options = options;
    this._database = options.database;
    this._queryBuilder = options.queryBuilder;

    this._fieldMatching = this._database._computeModelFieldMatchings(
      this.name,
      this.fields,
      this.timestamps,
    );

    this._currentQuery = this._queryBuilder.queryForSchema(this);
    this._primaryKey = this._findPrimaryKey();
  }

  /** Drop a model in the database. */
  static async drop() {
    const dropQuery = this._options.queryBuilder
      .queryForSchema(this)
      .table(this.table)
      .dropIfExists()
      .toDescription();

    await this._options.database.query(dropQuery);

    this._isCreatedInDatabase = false;
  }

  /** Create a model in the database. Should not be called from a child model. */
  static async createTable() {
    if (this._isCreatedInDatabase) {
      throw new Error("This model has already been initialized.");
    }

    const createQuery = this._options.queryBuilder
      .queryForSchema(this)
      .table(this.table)
      .createTable(
        this.formatFieldToDatabase(this.fields) as ModelFields,
        this.formatFieldToDatabase(this.defaults) as ModelDefaults,
        {
          withTimestamps: this.timestamps,
          ifNotExists: true,
        },
      )
      .toDescription();

    await this._options.database.query(createQuery);

    this._isCreatedInDatabase = true;
  }

  /** Manually find the primary field by going through the schema fields. */
  private static _findPrimaryField(): FieldOptions {
    const field = Object.entries(this.fields).find(
      ([_, fieldType]) => typeof fieldType === "object" && fieldType.primaryKey,
    );

    return {
      name: field ? (this.formatFieldToDatabase(field[0]) as string) : "",
      type: field ? field[1] : DataTypes.INTEGER,
      defaultValue: 0,
    };
  }

  /** Manually find the primary key by going through the schema fields. */
  private static _findPrimaryKey(): string {
    return this._findPrimaryField().name;
  }

  /** Return the model computed primary key. */
  static getComputedPrimaryKey(): string {
    if (!this._primaryKey) {
      this._primaryKey = this._findPrimaryKey();
    }

    return this._primaryKey;
  }

  /** Return the field type of the primary key. */
  static getComputedPrimaryType(): FieldTypeString {
    const field = this._findPrimaryField();

    return typeof field.type === "object"
      ? (field.type as any).type
      : field.type;
  }

  /** Return the field properties of the primary key */
  static getComputedPrimaryProps(): FieldProps {
    const field = this._findPrimaryField();

    return typeof field === "object" ? field.type : {};
  }

  /** Build the current query and run it on the associated database. */
  private static async _runQuery(query: QueryDescription) {
    this._currentQuery = this._queryBuilder.queryForSchema(this);

    if (query.type) {
      this._runEventListeners(query.type);
    }

    const results = await this._database.query(query);

    if (query.type) {
      this._runEventListeners(query.type, results);
    }

    return results;
  }

  /** Format a field or an object of fields, following a field matching table.
   * Defaulting to `defaultCase` or `field` otherwise. */
  private static _formatField(
    fieldMatching: FieldMatchingTable,
    field: string | { [fieldName: string]: any },
    defaultCase?: (field: string) => string,
  ): string | { [fieldName: string]: any } {
    if (typeof field !== "string") {
      return Object.entries(field).reduce((prev: any, [fieldName, value]) => {
        prev[this._formatField(fieldMatching, fieldName) as string] = value;
        return prev;
      }, {}) as { [fieldName: string]: any };
    }

    if (field in fieldMatching) {
      return fieldMatching[field];
    }

    return defaultCase ? defaultCase(field) : field;
  }

  /** Format field or an object of fields from client to database.  */
  static formatFieldToDatabase(field: string | Object) {
    return this._formatField(this._fieldMatching.toDatabase, field);
  }

  /** Format field or an object of fields from database to client. */
  static formatFieldToClient(field: string | Object) {
    return this._formatField(this._fieldMatching.toClient, field, camelCase);
  }

  /** Add an event listener for a specific operation/hook.
   * 
   *     Flight.on('created', (model) => console.log('New model:', model));
   */
  static on<T extends ModelSchema>(
    this: T,
    eventType: ModelEventType,
    callback: ModelEventListener,
  ) {
    if (!(eventType in this._listeners)) {
      this._listeners[eventType] = [];
    }

    this._listeners[eventType]!.push(callback);

    return this;
  }

  /** Alias for `Model.on`, add an event listener for a specific operation/hook.
   * 
   *     Flight.addEventListener('created', (model) => console.log('New model:', model));
   */
  static addEventListener<T extends ModelSchema>(
    this: T,
    eventType: ModelEventType,
    callback: ModelEventListener,
  ) {
    return this.on(eventType, callback);
  }

  static removeEventListener(
    eventType: ModelEventType,
    callback: ModelEventListener,
  ) {
    if (!(eventType in this._listeners)) {
      throw new Error(
        `There is no event listener for ${eventType}. You might be trying to remove a listener that you haven't added with Model.on('${eventType}', ...).`,
      );
    }

    this._listeners[eventType] = this._listeners[eventType]!.filter((
      listener,
    ) => listener !== callback);

    return this;
  }

  /** Run event listeners given a query type and results. */
  private static _runEventListeners(
    queryType: QueryType,
    instances?: Model | Model[],
  ) {
    // -ing => present, -ed => past
    const isPastEvent = !!instances;

    let eventType: ModelEventType;
    switch (queryType) {
      case "insert":
        eventType = isPastEvent ? "created" : "creating";
        break;

      case "update":
        eventType = isPastEvent ? "updated" : "updating";
        break;

      case "delete":
        eventType = isPastEvent ? "deleted" : "deleting";
        break;

      default:
        return;
    }

    const listeners = this._listeners[eventType];

    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      if (instances) {
        if (Array.isArray(instances)) {
          if (instances.length > 0) {
            instances.forEach(listener);
          } else {
            (listener as ModelEventListenerWithoutModel)();
          }
        } else {
          listener(instances);
        }
      } else {
        (listener as ModelEventListenerWithoutModel)();
      }
    }
  }

  /** Return the table name followed by a field name. Can also rename a field using `nameAs`.
   *
   *     Flight.field("departure") => "flights.departure"
   *
   *     Flight.field("id", "flight_id") => { flight_id: "flights.id" }
   */
  static field(field: string): string;
  static field(field: string, nameAs: string): FieldAlias;
  static field(field: string, nameAs?: string): string | FieldAlias {
    const fullField = this.formatFieldToDatabase(
      `${this.table}.${field}`,
    ) as string;

    if (nameAs) {
      return { [nameAs]: fullField };
    }

    return fullField;
  }

  /** Run the current query. */
  static async get() {
    return this._runQuery(
      this._currentQuery.table(this.table).get().toDescription(),
    );
  }

  /** Fetch all the model records.
   *
   *     await Flight.all();
   *
   *     await Flight.select("id").all();
   */
  static async all() {
    return this.get() as Promise<Model[]>;
  }

  /** Indicate which fields should be returned/selected from the query.
   *
   *     await Flight.select("id").get();
   *
   *     await Flight.select("id", "destination").get();
   */
  static select<T extends ModelSchema>(
    this: T,
    ...fields: (string | FieldAlias)[]
  ) {
    this._currentQuery.select(
      ...fields.map((field) => this.formatFieldToDatabase(field)),
    );
    return this;
  }

  /** Create one or multiple records in the current model.
   *
   *     await Flight.create({ departure: "Paris", destination: "Tokyo" });
   *
   *     await Flight.create([{ ... }, { ... }]);
   */
  static async create(values: Values): Promise<Model>;
  static async create(values: Values[]): Promise<Model[]>;
  static async create(values: Values | Values[]) {
    const insertions = Array.isArray(values) ? values : [values];

    const results = await this._runQuery(
      this._currentQuery.table(this.table).create(
        insertions.map((field) =>
          this.formatFieldToDatabase(field)
        ) as Values[],
      ).toDescription(),
    );

    if (!Array.isArray(values) && Array.isArray(results)) {
      return results[0];
    }

    return results;
  }

  /** Find one or multiple records based on the model primary key.
   *
   *     await Flight.find("1");
   */
  static async find(idOrIds: FieldValue): Promise<Model>;
  static async find(idOrIds: FieldValue[]): Promise<Model[]>;
  static async find(idOrIds: FieldValue | FieldValue[]) {
    const results = await this._runQuery(
      this._currentQuery
        .table(this.table)
        .find(
          this.getComputedPrimaryKey(),
          Array.isArray(idOrIds) ? idOrIds : [idOrIds],
        )
        .toDescription(),
    );

    return Array.isArray(idOrIds) ? results : (results as Model[])[0];
  }

  /** Order query results based on a field name and an optional direction.
   *
   *     await Flight.orderBy("departure").all();
   *
   *     await Flight.orderBy("departure", "desc").all();
   *
   *     await Flight.orderBy({ departure: "desc", destination: "asc" }).all();
   */
  static orderBy<T extends ModelSchema>(
    this: T,
    fieldOrFields: string | OrderByClauses,
    orderDirection: OrderDirection = "asc",
  ) {
    if (typeof fieldOrFields === "string") {
      this._currentQuery.orderBy(
        this.formatFieldToDatabase(fieldOrFields) as string,
        orderDirection,
      );
    } else {
      for (
        const [field, orderDirectionField] of Object.entries(
          fieldOrFields,
        )
      ) {
        this._currentQuery.orderBy(
          this.formatFieldToDatabase(field) as string,
          orderDirectionField,
        );
      }
    }

    return this;
  }

  /** Group rows by a given field.
   *
   *     await Flight.groupBy('departure').all();
   */
  static groupBy<T extends ModelSchema>(this: T, field: string) {
    this._currentQuery.groupBy(this.formatFieldToDatabase(field) as string);
    return this;
  }

  /** Similar to `limit`, limit the number of results returned from the query.
   *
   *     await Flight.take(10).get();
   */
  static take<T extends ModelSchema>(this: T, limit: number) {
    return this.limit(limit);
  }

  /** Limit the number of results returned from the query.
   *
   *     await Flight.limit(10).get();
   */
  static limit<T extends ModelSchema>(this: T, limit: number) {
    this._currentQuery.limit(limit);
    return this;
  }

  /** Return the first record that matches the current query.
   *
   *     await Flight.where("id", ">", "1").first();
   */
  static async first() {
    this.take(1);
    const results = await this.get();
    return (results as Model[])[0];
  }

  /** Skip n values in the results.
   *
   *     await Flight.offset(10).get();
   *
   *     await Flight.offset(10).limit(2).get();
   */
  static offset<T extends ModelSchema>(this: T, offset: number) {
    this._currentQuery.offset(offset);
    return this;
  }

  /** Similar to `offset`, skip n values in the results.
   *
   *     await Flight.skip(10).get();
   *
   *     await Flight.skip(10).take(2).get();
   */
  static skip<T extends ModelSchema>(this: T, offset: number) {
    return this.offset(offset);
  }

  /** Add a `where` clause to your query.
   *
   *     await Flight.where("id", "1").get();
   *
   *     await Flight.where("id", ">", "1").get();
   *
   *     await Flight.where({ id: "1", departure: "Paris" }).get();
   */
  static where<T extends ModelSchema>(
    this: T,
    fieldOrFields: string | Values,
    operatorOrFieldValue?: Operator | FieldValue,
    fieldValue?: FieldValue,
  ) {
    if (typeof fieldOrFields === "string") {
      const whereOperator: Operator = typeof fieldValue !== "undefined"
        ? (operatorOrFieldValue as Operator)
        : "=";

      const whereValue: FieldValue = typeof fieldValue !== "undefined"
        ? fieldValue
        : (operatorOrFieldValue as FieldValue);

      if (whereValue !== undefined) {
        this._currentQuery.where(
          this.formatFieldToDatabase(fieldOrFields) as string,
          whereOperator,
          whereValue,
        );
      }
    } else {
      // TODO(eveningkid): cannot do multiple where with different operators
      // Need to find a great API for multiple where potentially with operators
      // .where({ name: 'John', age: { moreThan: 19 } })
      // and then format it using Knex .andWhere(...)

      for (const [field, value] of Object.entries(fieldOrFields)) {
        if (value === undefined) {
          continue;
        }

        this._currentQuery.where(
          this.formatFieldToDatabase(field) as string,
          "=",
          value,
        );
      }
    }

    return this;
  }

  /** Update one or multiple records. Also update `updated_at` if `timestamps` is `true`.
   *
   *     await Flight.where("departure", "Dublin").update("departure", "Tokyo");
   *
   *     await Flight.where("departure", "Dublin").update({ destination: "Tokyo" });
   */
  static async update(fieldOrFields: string | Values, fieldValue?: FieldValue) {
    let fieldsToUpdate: Values = {};

    if (this.timestamps) {
      fieldsToUpdate[
        this.formatFieldToDatabase("updated_at") as string
      ] = new Date();
    }

    if (typeof fieldOrFields === "string") {
      fieldsToUpdate[
        this.formatFieldToDatabase(fieldOrFields) as string
      ] = fieldValue!;
    } else {
      fieldsToUpdate = {
        ...fieldsToUpdate,
        ...(this.formatFieldToDatabase(fieldOrFields) as {
          [fieldName: string]: any;
        }),
      };
    }

    return this._runQuery(
      this._currentQuery
        .table(this.table)
        .update(fieldsToUpdate)
        .toDescription(),
    ) as Promise<Model[]>;
  }

  /** Delete a record by a primary key value.
   *
   *     await Flight.deleteById("1");
   */
  static async deleteById(id: FieldValue) {
    return this._runQuery(
      this._currentQuery
        .table(this.table)
        .where(this.getComputedPrimaryKey(), "=", id)
        .delete()
        .toDescription(),
    );
  }

  /** Delete selected records.
   *
   *     await Flight.where("destination", "Paris").delete();
   */
  static async delete() {
    return this._runQuery(
      this._currentQuery.table(this.table).delete().toDescription(),
    );
  }

  /** Join a table to the current query.
   *
   *     await Flight.where(
   *       Flight.field("departure"),
   *       "Paris",
   *     ).join(
   *       Airport,
   *       Airport.field("id"),
   *       Flight.field("airportId"),
   *     ).get()
   */
  static join<T extends ModelSchema>(
    this: T,
    joinTable: ModelSchema,
    originField: string,
    targetField: string,
  ) {
    this._currentQuery.join(
      joinTable.table,
      joinTable.formatFieldToDatabase(originField) as string,
      this.formatFieldToDatabase(targetField) as string,
    );
    return this;
  }

  /** Join a table with left outer statement to the current query.
   *
   *     await Flight.where(
   *       Flight.field("departure"),
   *       "Paris",
   *     ).leftOuterJoin(
   *       Airport,
   *       Airport.field("id"),
   *       Flight.field("airportId"),
   *     ).get()
   */
  static leftOuterJoin<T extends ModelSchema>(
    this: T,
    joinTable: ModelSchema,
    originField: string,
    targetField: string,
  ) {
    this._currentQuery.leftOuterJoin(
      joinTable.table,
      joinTable.formatFieldToDatabase(originField) as string,
      this.formatFieldToDatabase(targetField) as string,
    );
    return this;
  }

  /** Join a table with left statement to the current query.
   *
   *     await Flight.where(
   *       Flight.field("departure"),
   *       "Paris",
   *     ).leftJoin(
   *       Airport,
   *       Airport.field("id"),
   *       Flight.field("airportId"),
   *     ).get()
   */
  static leftJoin<T extends ModelSchema>(
    this: T,
    joinTable: ModelSchema,
    originField: string,
    targetField: string,
  ) {
    this._currentQuery.leftJoin(
      joinTable.table,
      joinTable.formatFieldToDatabase(originField) as string,
      this.formatFieldToDatabase(targetField) as string,
    );
    return this;
  }

  /** Count the number of records of a model or filtered by a field name.
   *
   *     await Flight.count();
   *
   *     await Flight.where("destination", "Dublin").count();
   */
  static async count(field: string = "*") {
    const value = await this._runQuery(
      this._currentQuery
        .table(this.table)
        .count(this.formatFieldToDatabase(field) as string)
        .toDescription(),
    );

    return (value as AggregationResult[])[0].count;
  }

  /** Find the minimum value of a field from all the selected records.
   *
   *     await Flight.min("flightDuration");
   */
  static async min(field: string) {
    const value = await this._runQuery(
      this._currentQuery
        .table(this.table)
        .min(this.formatFieldToDatabase(field) as string)
        .toDescription(),
    );

    return (value as AggregationResult[])[0].min;
  }

  /** Find the maximum value of a field from all the selected records.
   *
   *     await Flight.max("flightDuration");
   */
  static async max(field: string) {
    const value = await this._runQuery(
      this._currentQuery
        .table(this.table)
        .max(this.formatFieldToDatabase(field) as string)
        .toDescription(),
    );

    return (value as AggregationResult[])[0].max;
  }

  /** Compute the sum of a field's values from all the selected records.
   *
   *     await Flight.sum("flightDuration");
   */
  static async sum(field: string) {
    const value = await this._runQuery(
      this._currentQuery
        .table(this.table)
        .sum(this.formatFieldToDatabase(field) as string)
        .toDescription(),
    );

    return (value as AggregationResult[])[0].sum;
  }

  /** Compute the average value of a field's values from all the selected records.
   *
   *     await Flight.avg("flightDuration");
   *
   *     await Flight.where("destination", "San Francisco").avg("flightDuration");
   */
  static async avg(field: string) {
    const value = await this._runQuery(
      this._currentQuery
        .table(this.table)
        .avg(this.formatFieldToDatabase(field) as string)
        .toDescription(),
    );

    return (value as AggregationResult[])[0].avg;
  }

  /** Find associated values for the given model for one-to-many and many-to-many relationships.
   *
   *     class Airport {
   *       static flights() {
   *         return this.hasMany(Flight);
   *       }
   *     }
   *
   *     Airport.where("id", "1").flights();
   */
  static hasMany<T extends ModelSchema>(
    this: T,
    model: ModelSchema,
  ): Promise<Model | Model[]> {
    const currentWhereValue = this._findCurrentQueryWhereClause();

    if (model.name in this.pivot) {
      const pivot = this.pivot[model.name];
      const pivotField = this.formatFieldToDatabase(
        pivot._pivotsFields[this.name],
      ) as string;
      const pivotOtherModel = pivot._pivotsModels[model.name];
      const pivotOtherModelField = pivotOtherModel.formatFieldToDatabase(
        pivot._pivotsFields[model.name],
      ) as string;

      return pivot
        .where(pivot.field(pivotField), currentWhereValue)
        .join(
          pivotOtherModel,
          pivotOtherModel.field(pivotOtherModel.getComputedPrimaryKey()),
          pivot.field(pivotOtherModelField),
        )
        .get();
    }

    const foreignKeyName = this._findModelForeignKeyField(model);
    this._currentQuery = this._queryBuilder.queryForSchema(this);
    return model.where(foreignKeyName, currentWhereValue).all();
  }

  /** Find associated values for the given model for one-to-one and one-to-many relationships. */
  static async hasOne<T extends ModelSchema>(this: T, model: ModelSchema) {
    const currentWhereValue = this._findCurrentQueryWhereClause();
    const FKName = this._findModelForeignKeyField(model);

    if (!FKName) {
      const currentModelFKName = this._findModelForeignKeyField(this, model);
      const currentModelValue = await this.where(
        this.getComputedPrimaryKey(),
        currentWhereValue,
      ).first();
      const currentModelFKValue =
        currentModelValue[currentModelFKName] as FieldValue;
      return model.where(model.getComputedPrimaryKey(), currentModelFKValue)
        .first();
    }

    return model.where(FKName, currentWhereValue).first();
  }

  /** Look for the current query's where clause for this model's primary key. */
  private static _findCurrentQueryWhereClause() {
    if (!this._currentQuery._query.wheres) {
      throw new Error("The current query does not have any where clause.");
    }

    const where = this._currentQuery._query.wheres.find((where) => {
      return where.field === this.getComputedPrimaryKey();
    });

    if (!where) {
      throw new Error(
        "The current query does not have any where clause for this model primary key.",
      );
    }

    return where.value;
  }

  /** Look for a `fieldName: Relationships.belongsTo(forModel)` field for a given `model`. */
  private static _findModelForeignKeyField(
    model: ModelSchema,
    forModel: ModelSchema = this,
  ): string {
    const modelFK: [string, FieldType] | undefined = Object.entries(
      model.fields,
    ).find(([, type]) => {
      return typeof type === "object"
        ? type.relationship?.model === forModel
        : false;
    });

    if (!modelFK) {
      return "";
    }

    return modelFK[0];
  }

  /** Return the instance current value for its primary key. */
  private _getCurrentPrimaryKey() {
    const model = this.constructor as ModelSchema;
    return (this as any)[model.getComputedPrimaryKey()] as string;
  }

  /** Create a new record for the model.
   *
   *     const flight = new Flight();
   *     flight.departure = "Toronto";
   *     flight.destination = "Paris";
   *     await flight.save();
   */
  async save() {
    const model = this.constructor as ModelSchema;

    const values: Values = {};
    for (const field of Object.keys(model.fields)) {
      if (this.hasOwnProperty(field)) {
        values[field] = (this as any)[field];
      } else if (model.defaults.hasOwnProperty(field)) {
        const defaultValue = model.defaults[field];

        if (typeof defaultValue === "function") {
          values[field] = defaultValue();
        } else {
          values[field] = defaultValue;
        }
      }
    }

    const createdInstance = await model.create(values);

    for (const field in createdInstance) {
      (this as any)[field] = (createdInstance as any)[field];
    }

    return this;
  }

  /** Update this record using its current field values.
   *
   *     flight.destination = "London";
   *     await flight.update();
   */
  async update() {
    const model = this.constructor as ModelSchema;
    const modelPK = model.getComputedPrimaryKey();

    const values: Values = {};
    for (const field of Object.keys(model.fields)) {
      if (this.hasOwnProperty(field) && field !== modelPK) {
        values[field] = (this as any)[field];
      }
    }

    await model.where(modelPK, this._getCurrentPrimaryKey()).update(
      values,
    );

    return this;
  }

  /** Delete this record from the database.
   *
   *     await flight.delete();
   */
  async delete() {
    const model = this.constructor as ModelSchema;
    const PKCurrentValue = this._getCurrentPrimaryKey();

    if (PKCurrentValue === undefined) {
      throw new Error(
        "This instance does not have a value for its primary key. It cannot be deleted.",
      );
    }

    return model.deleteById(PKCurrentValue);
  }
}
