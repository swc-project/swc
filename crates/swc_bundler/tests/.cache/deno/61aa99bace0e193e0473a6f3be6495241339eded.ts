// Loaded from https://deno.land/x/denodb@v1.0.18/lib/connectors/mongodb-connector.ts


import { MongoDBClient } from "../../deps.ts";
import type { MongoDBClientOptions, MongoDBDatabase } from "../../deps.ts";
import type { Connector, ConnectorOptions } from "./connector.ts";
import type { QueryDescription } from "../query-builder.ts";

type MongoDBOptionsBase = {
  database: string;
};

type MongoDBOptionsWithURI = {
  uri: string;
};

export type MongoDBOptions =
  & ConnectorOptions
  & (MongoDBOptionsWithURI | MongoDBClientOptions)
  & MongoDBOptionsBase;

export class MongoDBConnector implements Connector {
  _client: MongoDBClient;
  _database?: MongoDBDatabase;
  _options: MongoDBOptions;
  _connected = false;

  /** Create a MongoDB connection. */
  constructor(options: MongoDBOptions) {
    this._options = options;
    this._client = new MongoDBClient();
  }

  async _makeConnection() {
    if (this._connected) {
      return;
    }

    if (this._options.hasOwnProperty("uri")) {
      await this._client.connect((this._options as MongoDBOptionsWithURI).uri);
    } else {
      await this._client.connect(this._options as MongoDBClientOptions);
    }

    this._database = this._client.database(this._options.database);
    this._connected = true;
  }

  async ping() {
    await this._makeConnection();

    try {
      const databases = await this._client.listDatabases();
      return databases.map((database) => database.name).includes(
        this._options.database,
      );
    } catch (error) {
      return false;
    }
  }

  async query(queryDescription: QueryDescription): Promise<any | any[]> {
    await this._makeConnection();

    if (queryDescription.type === "create") {
      // There is no need to initialize collections in MongoDB
      return [];
    }

    const collection = this._database!.collection(queryDescription.table!);

    let wheres: { [k: string]: any } = {};
    if (queryDescription.wheres) {
      wheres = queryDescription.wheres.reduce((prev, curr) => {
        let mongoOperator = "$eq";

        switch (curr.operator) {
          case "<":
            mongoOperator = "$lt";
            break;

          case "<=":
            mongoOperator = "$lte";
            break;

          case ">":
            mongoOperator = "$gt";
            break;

          case ">=":
            mongoOperator = "$gte";
            break;
        }

        return {
          ...prev,
          [curr.field]: {
            [mongoOperator]: curr.value,
          },
        };
      }, {});
    }

    let results: any[] = [];

    switch (queryDescription.type) {
      case "drop":
        await collection.deleteMany({});
        break;

      case "insert":
        const defaultedValues = queryDescription.schema.defaults;
        let values = Array.isArray(queryDescription.values)
          ? queryDescription.values!
          : [queryDescription.values!];

        values = values.map((record) => {
          let timestamps = {};

          if (queryDescription.schema.timestamps) {
            timestamps = {
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }

          return { ...defaultedValues, ...record, ...timestamps };
        });

        const insertedRecords = await collection.insertMany(
          values,
        );

        const recordIds = insertedRecords.insertedIds as unknown as string[];
        return await queryDescription.schema.find(recordIds);

      case "select":
        const selectFields: Object[] = [];

        if (queryDescription.whereIn) {
          wheres[queryDescription.whereIn.field] = {
            $in: queryDescription.whereIn.possibleValues,
          };
        }

        selectFields.push({
          $match: wheres,
        });

        if (queryDescription.select) {
          selectFields.push({
            $project: queryDescription.select.reduce((prev: Object, curr) => {
              if (typeof curr === "string") {
                return {
                  ...prev,
                  [curr]: 1,
                };
              } else {
                const [field, alias] = Object.entries(curr)[0];
                return {
                  ...prev,
                  [alias]: field,
                };
              }
            }, {}),
          });
        }

        if (queryDescription.joins) {
          const join = queryDescription.joins[0];
          selectFields.push({
            $lookup: {
              from: join.joinTable,
              localField: join.originField,
              foreignField: "_id",
              as: join.targetField,
            },
          });
        }

        if (queryDescription.orderBy) {
          selectFields.push({
            $sort: Object.entries(queryDescription.orderBy).reduce(
              (prev: any, [field, orderDirection]) => {
                prev[field] = orderDirection === "asc" ? 1 : -1;
                return prev;
              },
              {},
            ),
          });
        }

        if (queryDescription.groupBy) {
          selectFields.push({
            $group: {
              _id: `$${queryDescription.groupBy}`,
            },
          });
        }

        if (queryDescription.limit) {
          selectFields.push({ $limit: queryDescription.limit });
        }

        if (queryDescription.offset) {
          selectFields.push({ $skip: queryDescription.offset });
        }

        results = await collection.aggregate(selectFields).toArray();
        break;

      case "update":
        await collection.updateMany(wheres, { $set: queryDescription.values! });
        break;

      case "delete":
        await collection.deleteMany(wheres);
        break;

      case "count":
        return [{ count: await collection.count(wheres) }];

      case "avg":
        return await collection.aggregate([
          { $match: wheres },
          {
            $group: {
              _id: null,
              avg: { $avg: `$${queryDescription.aggregatorField}` },
            },
          },
        ]).toArray();

      case "max":
        return await collection.aggregate([
          { $match: wheres },
          {
            $group: {
              _id: null,
              max: { $max: `$${queryDescription.aggregatorField}` },
            },
          },
        ]).toArray();

      case "min":
        return await collection.aggregate([
          { $match: wheres },
          {
            $group: {
              _id: null,
              min: { $min: `$${queryDescription.aggregatorField}` },
            },
          },
        ]).toArray();

      case "sum":
        return await collection.aggregate([
          { $match: wheres },
          {
            $group: {
              _id: null,
              sum: { $sum: `$${queryDescription.aggregatorField}` },
            },
          },
        ]).toArray();

      default:
        throw new Error(`Unknown query type: ${queryDescription.type}.`);
    }

    results = results.map((result) => {
      const formattedResult: { [k: string]: any } = {};

      for (const [field, value] of Object.entries(result)) {
        if (field === "_id") {
          formattedResult._id = (value as { $oid?: string })?.$oid || value;
        } else if ((value as { $date?: { $numberLong: number } }).$date) {
          formattedResult[field] = new Date((value as any).$date.$numberLong);
        } else {
          formattedResult[field] = value;
        }
      }

      return formattedResult;
    });

    return results;
  }

  async close() {
    if (!this._connected) {
      return;
    }

    this._connected = false;
  }
}
