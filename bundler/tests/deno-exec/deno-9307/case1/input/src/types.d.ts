import { G, OpenAPIV3 } from "../deps.ts";

type ParentObjectName = string;
type FieldName = string;
type ChildObjectName = string;
type GraphQLInvalidFieldName = string;

export type BodyArg = `body`;
export type NonBodyArg = `cookie` | `header` | `path` | `query`;

export type Enums = Map<string, string[]>;

export type PossibleType = {
  name: string;
  uniqProperties: string[];
};

export type ApiArtifacts = {
  objectsRelation: Record<ParentObjectName, Record<FieldName, ChildObjectName>>;
  objectsRename: Record<
    ParentObjectName,
    Record<GraphQLInvalidFieldName, FieldName>
  >;
  operations: Array<{
    httpMethod: HttpMethod;
    operationId: string;
    path: string;
    responseType?: string;
    parameters?: Array<{
      in: NonBodyArg;
      name: string;
    }>;
  }>;
  possibleTypes: Record<
    string,
    {
      kind: `INTERFACE` | `UNION`;
      possibleTypes: PossibleType[];
    }
  >;
};

export type DistilledOperationParameter = {
  description?: string;
  in: BodyArg | NonBodyArg;
  /**
   * Response body uses reserved name `body`
   */
  name: BodyArg | string;
  originalName?: string;
  required: boolean;
  type: G.GraphQLInputType;
};

export type GQLFieldConfig =
  // deno-lint-ignore no-explicit-any
  | G.GraphQLFieldConfig<any, any>
  | G.GraphQLInputFieldConfig;

// deno-lint-ignore no-explicit-any
export type GQLFieldMap = G.GraphQLFieldMap<any, any> | G.GraphQLInputFieldMap;

export type GQLObject =
  // deno-lint-ignore no-explicit-any
  | G.GraphQLObjectType<any, any>
  | G.GraphQLInputObjectType;

// currently don't care about "head" and "options"
export type HttpMethod = "delete" | "get" | "patch" | "post" | "put";

export type OpenAPIV3Algebraic =
  & OpenAPIV3.NonArraySchemaObject
  & (
    | Required<Pick<OpenAPIV3.NonArraySchemaObject, `allOf`>>
    | Required<Pick<OpenAPIV3.NonArraySchemaObject, `anyOf`>>
    | Required<Pick<OpenAPIV3.NonArraySchemaObject, `oneOf`>>
  );

export type OpenAPIV3Enum =
  & OpenAPIV3.NonArraySchemaObject
  & Required<Pick<OpenAPIV3.NonArraySchemaObject, `enum`>>;

export type OpenAPIV3Object = OpenAPIV3.NonArraySchemaObject & {
  type: `object`;
} & Required<Pick<OpenAPIV3.NonArraySchemaObject, `properties`>>;

export type OpenAPIV3Scalar = OpenAPIV3.NonArraySchemaObject & {
  type: `boolean` | `integer` | `number` | `string`;
};
