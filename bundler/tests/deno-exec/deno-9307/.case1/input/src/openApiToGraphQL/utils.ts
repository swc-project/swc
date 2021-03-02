import { JsonPointer, OpenAPIV3, R } from "../../deps.ts";
import {
  isValidGraphQLName,
} from "../graphql/validName.ts";
import {
  HttpMethod,
  OpenAPIV3Algebraic,
  OpenAPIV3Enum,
  OpenAPIV3Object,
  OpenAPIV3Scalar,
} from "../types.d.ts";

export const httpMethods: HttpMethod[] = [
  `delete`,
  `get`,
  `patch`,
  `post`,
  `put`,
];

export const createOneOf = (
  objects: Array<OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject>,
): OpenAPIV3Algebraic => ({
  oneOf: objects,
});

export const isSuccessStatusCode = (statusCode: string): boolean =>
  statusCode.startsWith(`2`);

/**
 * GraphQL does not support empty object, every object type must have at least one property.
 * This declaration with boolean `_` attribute thus represents virtually empty object.
 */
export const emptySchemaObject: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: { _: { type: "boolean" } },
};

const mediaJSON = /application\/json/i;
export const graphqlCompliantMediaType = (
  obj: OpenAPIV3.RequestBodyObject | OpenAPIV3.ResponseObject,
): OpenAPIV3.ArraySchemaObject | OpenAPIV3.SchemaObject => {
  if (!obj.content) {
    // Empty response
    return { type: "boolean" };
  }
  const jsonResponse = Object.entries(obj.content).find(([mediaType]) =>
    mediaJSON.test(mediaType)
  );
  if (!jsonResponse) {
    // response exists but is not JSON
    return { type: "string" };
  }

  const jsonResponseSchema = jsonResponse[1].schema as OpenAPIV3.SchemaObject;
  return !jsonResponseSchema ||
      (jsonResponseSchema.type === "object" &&
        R.isEmpty(jsonResponseSchema.properties))
    ? emptySchemaObject
    : jsonResponseSchema;
};

export const isOpenAPIV3Document = (
  // deno-lint-ignore no-explicit-any
  fileContent: any,
): fileContent is OpenAPIV3.Document => fileContent?.openapi?.startsWith?.(`3`);

export const isAlgebraic = (
  schema: OpenAPIV3.SchemaObject,
): schema is OpenAPIV3Algebraic =>
  Boolean(schema.allOf || schema.anyOf || schema.oneOf);

export const isEnum = (
  schema: OpenAPIV3.SchemaObject,
): schema is OpenAPIV3Enum => Boolean(schema.enum);

export const isList = (
  schema: OpenAPIV3.SchemaObject,
): schema is OpenAPIV3.ArraySchemaObject => schema.type === `array`;

export const isNonArray = (
  obj: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
): obj is OpenAPIV3.NonArraySchemaObject =>
  !(`$ref` in obj) && obj.type !== `array`;

export const isObject = (
  schema: OpenAPIV3.SchemaObject,
): schema is OpenAPIV3Object => schema.type === `object`;

export const isReference = (
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
): schema is OpenAPIV3.ReferenceObject => `$ref` in schema;

export const isScalar = (
  schema: OpenAPIV3.SchemaObject,
): schema is OpenAPIV3Scalar => {
  const { type } = schema;
  return type === `boolean` || type === `integer` || type === `number` ||
    type === `string`;
};

export const lastJsonPointerPathSegment = (ref: string): string =>
  R.last(JsonPointer.decode(ref));

/**
 * Returns target of the JSON pointer in the document. Currently supports only
 * local pointers.
 */
export const resolveRef = <Dereferenced>(
  document: OpenAPIV3.Document,
  $ref: string,
): Dereferenced => {
  const dereferenced = JsonPointer.get(document, $ref);
  if (!dereferenced) {
    throw new Error(
      `Failed to dereference JSON pointer: "${$ref}"`,
    );
  }
  return dereferenced;
};

// deno-lint-ignore no-explicit-any
export const isValidGqlEnumValue = (value: any): value is string =>
  typeof value === "string" && isValidGraphQLName(value);
