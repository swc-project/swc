// Loaded from https://deno.land/x/denodb@v1.0.18/lib/relationships.ts


import type { ModelSchema } from "./model.ts";
import { DataTypes, FieldTypeString, RelationshipType } from "./data-types.ts";
import { PivotModel } from "./model-pivot.ts";

type RelationshipOptions = {
  primaryKey?: string;
  foreignKey?: string;
};

export const Relationships = {
  /** Define a one-to-one or one-to-many relationship for a given model. */
  belongsTo(model: ModelSchema): RelationshipType {
    return {
      type: DataTypes.INTEGER,
      relationship: {
        kind: "single",
        model,
      },
    };
  },

  /** Add corresponding fields to each model for a one-to-one relationship. */
  oneToOne(
    modelA: ModelSchema,
    modelB: ModelSchema,
    options?: RelationshipOptions,
  ) {
    let primaryKey = options?.primaryKey;
    let foreignKey = options?.foreignKey;

    modelA.fields[primaryKey || `${modelB.name.toLowerCase()}Id`] = this
      .belongsTo(modelB);
    modelB.fields[foreignKey || `${modelA.name.toLowerCase()}Id`] = this
      .belongsTo(modelA);
  },

  /** Generate a many-to-many pivot model for two given models.
   * 
   *     const AirportFlight = Relationships.manyToMany(Airport, Flight);
   */
  manyToMany(
    modelA: ModelSchema,
    modelB: ModelSchema,
    options?: RelationshipOptions,
  ): ModelSchema {
    let primaryKey = options?.primaryKey;
    let foreignKey = options?.foreignKey;

    const pivotClassName = `${modelA.table}_${modelB.table}`;
    const modelAFieldName = primaryKey || `${modelA.name.toLowerCase()}Id`;
    const modelBFieldName = foreignKey || `${modelB.name.toLowerCase()}Id`;

    class PivotClass extends PivotModel {
      static table = pivotClassName;

      static fields = {
        id: {
          primaryKey: true,
          autoIncrement: true,
        },
        [modelAFieldName]: Relationships.belongsTo(modelA),
        [modelBFieldName]: Relationships.belongsTo(modelB),
      };

      static _pivotsModels = {
        [modelA.name]: modelA,
        [modelB.name]: modelB,
      };

      static _pivotsFields = {
        [modelA.name]: modelAFieldName,
        [modelB.name]: modelBFieldName,
      };
    }

    modelA.pivot[modelB.name] = PivotClass;
    modelB.pivot[modelA.name] = PivotClass;

    return PivotClass;
  },
};
