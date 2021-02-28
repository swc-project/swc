import { G, OpenAPIV3, R } from "../../deps.ts";
import {
  InterfaceExtension,
  interfaceExtensionFactory,
} from "../graphql/interfaceExtension.ts";
import { mergeObjects } from "../graphql/mergeObjects.ts";
import {
  isValidGraphQLName,
  toValidGraphQLName,
} from "../graphql/validName.ts";
import { stringify } from "../log.ts";
import {
  BodyArg,
  DistilledOperationParameter,
  HttpMethod,
  OpenAPIV3Enum,
} from "../types.d.ts";
import {
  createOneOf,
  emptySchemaObject,
  graphqlCompliantMediaType,
  httpMethods,
  isAlgebraic,
  isEnum,
  isList,
  isObject,
  isReference,
  isScalar,
  isSuccessStatusCode,
  isValidGqlEnumValue,
  lastJsonPointerPathSegment,
  resolveRef,
} from "./utils.ts";

export type DistillationHooks = {
  onEnumDistilled?(
    name: string,
    source: OpenAPIV3Enum,
  ): void;
  onOperationDistilled?(
    path: string,
    httpMethod: HttpMethod,
    operationId: string,
    // deno-lint-ignore no-explicit-any
    fieldConfig: G.GraphQLFieldConfig<any, any, any>,
    distilledArguments?: DistilledOperationParameter[],
  ): void;
  onPropertyRenamed?(
    objectName: string,
    originalName: string,
    changedName: string,
  ): void;
};

type JSONPointer = string;

const BODY: BodyArg = `body`;

const toValidTypeName = (
  title: string | undefined,
  ref: string | undefined,
  parentName: string,
): string =>
  toValidGraphQLName(
    title || (ref && lastJsonPointerPathSegment(ref)) ||
      parentName,
  );
export class GraphQLFurnace {
  readonly cache: {
    enum: Map<string, G.GraphQLEnumType | G.GraphQLScalarType>;
    input: Map<JSONPointer, G.GraphQLInputType>;
    output: Map<JSONPointer, G.GraphQLOutputType>;
    parameter: Map<JSONPointer, DistilledOperationParameter>;
  } = {
    enum: new Map(),
    input: new Map(),
    output: new Map(),
    parameter: new Map(),
  };

  readonly interfaceExtension: InterfaceExtension = interfaceExtensionFactory();

  constructor(
    public readonly document: OpenAPIV3.Document,
    private readonly hooks: DistillationHooks,
  ) {
  }

  /**
  * Consumes arbitrary OpenAPI object. When the object is ReferenceObject,
  * dereferences it (even transitively). Returns tuple of
  * - [SchemaObject] - when the passed object was not reference
  * - [ShcemaObject, JSONPointer] - when the passed object was ReferenceObject,
  *  the JSONPointer is the $ref pointing to the SchemaObject.
  */
  dereference<OASType>(
    input: OASType | OpenAPIV3.ReferenceObject,
  ): [OASType, JSONPointer] | [OASType] {
    return this.dereferenceImpl(input);
  }
  private dereferenceImpl<OASType>(
    input: OASType | OpenAPIV3.ReferenceObject,
    ref?: JSONPointer,
  ): [OASType, JSONPointer] | [OASType] {
    return isReference(input)
      ? this.dereferenceImpl(
        resolveRef<OASType>(this.document, input.$ref),
        input.$ref,
      )
      : ref
      ? [input, ref]
      : [input];
  }

  resolvePropertyName(objectName: string, propName: string): string {
    if (isValidGraphQLName(propName)) return propName;
    const validName = toValidGraphQLName(propName);
    this.hooks.onPropertyRenamed?.(objectName, propName, validName);
    return validName;
  }

  toEnum(
    name: string,
    schema: OpenAPIV3Enum,
  ): G.GraphQLEnumType | G.GraphQLScalarType {
    const cached = this.cache.enum.get(name);
    if (cached) return cached;
    const result = schema.enum.every(isValidGqlEnumValue)
      ? new G.GraphQLEnumType({
        name,
        values: schema.enum.reduce((acc, value) => {
          acc[value] = { value };
          return acc;
        }, {} as G.GraphQLEnumValueConfigMap),
      })
      : // TODO: fallback to other primitive types, e.g. GraphQLFloat when all enum members are numbers
        G.GraphQLString;
    this.hooks.onEnumDistilled?.(name, schema);
    this.cache.enum.set(name, result);
    return result;
  }

  toLeafType(
    ref: JSONPointer | undefined,
    schema: OpenAPIV3.SchemaObject,
    parentName: string,
  ): G.GraphQLLeafType {
    if (isEnum(schema)) {
      return this.toEnum(
        toValidTypeName(schema.title, ref, parentName),
        schema,
      );
    }
    if (isScalar(schema)) {
      switch (schema.type) {
        case `boolean`:
          return G.GraphQLBoolean;
        case `integer`:
          return G.GraphQLInt;
        case `number`:
          return G.GraphQLFloat;
        case `string`:
          return G.GraphQLString;
      }
    }
    throw new Error(`Unsupported schema in "distillLeafType" function:
      ${stringify(schema, { maxDepth: 1 })}`);
  }

  toInputType(
    schemaOrRef: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
    parentName: string,
  ): G.GraphQLInputType {
    const [schema, ref] = this.dereference(schemaOrRef);
    const cached = ref && this.cache.input.get(ref);
    if (cached) return cached;
    const result = this.toInputTypeDereferencedCached(ref, schema, parentName);
    if (ref) this.cache.input.set(ref, result);
    return result;
  }
  private toInputTypeDereferencedCached(
    ref: JSONPointer | undefined,
    schema: OpenAPIV3.SchemaObject,
    parentName: string,
  ): G.GraphQLInputType {
    if (isAlgebraic(schema)) {
      const name = `${toValidTypeName(schema.title, ref, parentName)}Input`;
      const types = (schema.allOf || schema.anyOf || schema.oneOf)!.map((
        component,
        idx,
      ) => this.toInputType(component, `${name}_${idx}`));
      if (!types.every(G.isInputObjectType)) {
        throw new Error(
          [
            `Sorry, algebraic types could be composed only from object types.`,
            stringify(schema, { maxDepth: 2 }),
            `Above schema is composed from non-object types.`,
          ].join(`\n`),
        );
      }
      return mergeObjects(types, name);
    }
    if (isList(schema)) {
      return new G.GraphQLList(
        this.toInputType(schema.items, parentName),
      );
    }
    if (isObject(schema)) {
      const name = `${toValidTypeName(schema.title, ref, parentName)}Input`;
      const { required } = schema;
      return new G.GraphQLInputObjectType({
        description: schema.description,
        fields: Object.fromEntries(
          Object.entries(schema.properties).map(([propName, propSchema]) => {
            const derefSchema = this.dereference<OpenAPIV3.SchemaObject>(
              propSchema,
            )[0];
            const type = this.toInputType(propSchema, `${name}_${propName}`);
            return [
              this.resolvePropertyName(name, propName),
              {
                description: derefSchema.description,
                type: required?.includes(propName)
                  ? G.GraphQLNonNull(type)
                  : type,
              },
            ];
          }),
        ),
        name,
      });
    }
    return this.toLeafType(ref, schema, parentName);
  }

  toOutputType(
    schemaOrRef: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
    parentName: string,
  ): G.GraphQLOutputType {
    const [schema, ref] = this.dereference(schemaOrRef);
    const cached = ref && this.cache.output.get(ref);
    if (cached) return cached;
    const result = this.toOutputTypeDereferencedCached(ref, schema, parentName);
    if (ref) this.cache.output.set(ref, result);
    return result;
  }
  private toOutputTypeDereferencedCached(
    ref: string | undefined,
    schema: OpenAPIV3.SchemaObject,
    parentName: string,
  ): G.GraphQLOutputType {
    if (isAlgebraic(schema)) {
      const name = toValidTypeName(schema.title, ref, parentName);
      const union = !schema.allOf;
      const types = (schema.allOf || schema.anyOf || schema.oneOf)!.map((
        component,
        idx,
      ) => this.toOutputType(component, `${name}_${idx}`));
      if (!types.every(G.isObjectType)) {
        throw new Error(
          [
            `Sorry, algebraic types could be composed only from object types.`,
            stringify(schema, { maxDepth: 2 }),
            `Above schema is composed from non-object types.`,
          ].join(`\n`),
        );
      }
      if (union) {
        return new G.GraphQLUnionType({
          description: schema.description,
          name,
          types,
        });
      }
      const intersection = mergeObjects(types, name);
      (schema.allOf || schema.anyOf)!.forEach(
        (component, idx) => {
          if (isReference(component)) {
            const interfaceObject = types[idx];
            this.interfaceExtension.addInterfaceConnection(
              interfaceObject,
              intersection,
            );
          }
        },
      );
      return intersection;
    }
    if (isList(schema)) {
      return new G.GraphQLList(
        this.toOutputType(schema.items, parentName),
      );
    }
    if (isObject(schema)) {
      const name = toValidTypeName(schema.title, ref, parentName);
      const { required } = schema;
      const objectType = new G.GraphQLObjectType({
        description: schema.description,
        fields: Object.fromEntries(
          Object.entries(schema.properties).map(([propName, propSchema]) => {
            const derefSchema =
              this.dereference<OpenAPIV3.SchemaObject>(propSchema)[0];
            const type = propName === `id` && isScalar(derefSchema)
              ? G.GraphQLID
              : this.toOutputType(propSchema, `${name}_${propName}`);
            return [
              this.resolvePropertyName(name, propName),
              {
                description: derefSchema.description,
                type: required?.includes(propName)
                  ? G.GraphQLNonNull(type)
                  : type,
              },
            ];
          }),
        ),
        name,
      });
      return objectType;
    }
    return this.toLeafType(ref, schema, parentName);
  }

  toArguments(
    operationId: string,
    requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject,
    parameters?: Array<OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject>,
  ): DistilledOperationParameter[] | undefined {
    const dereferencedBody = requestBody &&
      (this.dereference<OpenAPIV3.RequestBodyObject>(requestBody)[0]);
    return !dereferencedBody && R.isEmpty(parameters) ? undefined : ([
      dereferencedBody && this.toArgument(
        {
          in: BODY,
          name: BODY,
          schema: graphqlCompliantMediaType(dereferencedBody),
          required: dereferencedBody?.required,
        },
        operationId,
      ),
    ]
      .concat(
        parameters?.map((parameter) => this.toArgument(parameter, operationId)),
      )
      .filter(Boolean) as DistilledOperationParameter[]);
  }
  toArgument(
    parameterOrRef: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject,
    parentName: string,
  ): DistilledOperationParameter {
    const [parameter, ref] = this.dereference(parameterOrRef);
    const cached = ref && this.cache.parameter.get(ref);
    if (cached) return cached;
    const result = this.toArgumentDereferencedAndCached(
      ref,
      parameter,
      parentName,
    );
    if (ref) this.cache.parameter.set(ref, result);
    return result;
  }
  private toArgumentDereferencedAndCached(
    _ref: JSONPointer | undefined,
    parameter: OpenAPIV3.ParameterObject,
    parentName: string,
  ): DistilledOperationParameter {
    const { name, required = false } = parameter;
    if (parameter.in !== BODY && name === BODY) {
      throw new Error(
        `Invalid parameter ${stringify(parameter, { maxDepth: 1 })},
        \nOperation parameter MUST NOT have reserved name "${BODY}".`,
      );
    }
    const type = this.toInputType(
      parameter.schema as OpenAPIV3.SchemaObject,
      `${parentName}_${name}`,
    );
    return {
      description: parameter.description,
      in: parameter.in,
      required: Boolean(parameter.required),
      type: required ? G.GraphQLNonNull(type) : type,
      ...(isValidGraphQLName(name)
        ? { name }
        : { name: toValidGraphQLName(name), originalName: name }),
    } as DistilledOperationParameter;
  }

  processOperation(
    path: string,
    httpMethod: HttpMethod,
    operation: OpenAPIV3.OperationObject,
    parameters?: Array<OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject>,
  ): {
    // deno-lint-ignore no-explicit-any
    fieldConfig: G.GraphQLFieldConfig<any, any, any>;
    fieldName: string;
  } {
    const { operationId, responses } = operation;
    if (!operationId) {
      throw new Error(`OpenApi operation MUST contain "operationId".
      ${
        stringify(operation, { maxDepth: 1 })
      }\n\nAbove operation miss "operationId" property.`);
    }
    if (!isValidGraphQLName(operationId)) {
      throw new Error(`OpenApi operationId MUST be a valid GraphQL name.
      ${
        stringify(operation, { maxDepth: 1 })
      }\n\nAbove operation has invalid "operationId".`);
    }
    const groupedResponses = responses &&
      Object.entries(responses).reduce(
        (acc, [httpStatusCode, operation]) => {
          const key = isSuccessStatusCode(httpStatusCode) ? `success` : `error`;
          acc[key] = (acc[key] || []).concat(operation);
          return acc;
        },
        {} as {
          error?: Array<OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject>;
          success?: Array<OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject>;
        },
      );
    if (R.isEmpty(groupedResponses?.success)) {
      throw new Error(`OpenApi operation MUST contain success response.
      ${
        stringify(operation, { maxDepth: 1 })
      }\n\nAbove operation does not contain definition of success response.`);
    }
    const distilledArguments = this.toArguments(
      operationId,
      operation.requestBody,
      ([] as Array<
        OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject | undefined
      >).concat(parameters, operation.parameters).filter(Boolean) as Array<
        OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject
      >,
    );
    const successResponses = groupedResponses!.success!.map(
      // deno-lint-ignore no-explicit-any
      (R.compose as any)(
        graphqlCompliantMediaType,
        R.head,
        this.dereference.bind(this),
      ),
    ) as Array<OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject>;
    // deno-lint-ignore no-explicit-any
    const fieldConfig: G.GraphQLFieldConfig<any, any, any> = {
      args: distilledArguments &&
        distilledArguments.reduce((acc, { description, name, type }) => {
          acc[name] = { description, type };
          return acc;
        }, {} as G.GraphQLFieldConfigArgumentMap),
      description: [operation.summary, operation.description].filter(Boolean)
        .join(`\n\n`),
      extensions: { distilledArguments },
      type: this.toOutputType(
        successResponses.length === 1
          ? successResponses[0]
          : createOneOf(successResponses),
        operationId,
      ),
    };

    // TODO: Do not generate types from error responses!
    // just to extract enums from the error responses,
    // groupedResponses!.error?.forEach((response) => {
    //   boundDistillOutputType(
    //     graphqlCompliantMediaType(
    //       boundDereference<OpenAPIV3.ResponseObject>(response)[0],
    //     ),
    //     operationId,
    //   );
    // });

    this.hooks.onOperationDistilled?.(
      path,
      httpMethod,
      operationId,
      fieldConfig,
      distilledArguments,
    );
    return {
      fieldConfig,
      fieldName: operationId,
    };
  }

  toGqlSchema(): G.GraphQLSchema {
    const { Mutation, Query } = Object.entries(this.document.paths).reduce(
      ((acc, [urlPath, pathItemObject]) => {
        if (pathItemObject) {
          const { parameters } = pathItemObject;
          httpMethods.forEach((httpMethod) => {
            if (httpMethod in pathItemObject) {
              const { fieldConfig, fieldName } = this.processOperation(
                urlPath,
                httpMethod,
                pathItemObject[httpMethod] as OpenAPIV3.OperationObject,
                parameters,
              );
              acc[httpMethod === `get` ? `Query` : `Mutation`][fieldName] =
                fieldConfig;
            }
          });
        }
        return acc;
      }),
      { Mutation: {}, Query: {} } as {
        Mutation: Record<string, G.GraphQLFieldConfig<unknown, unknown>>;
        Query: Record<string, G.GraphQLFieldConfig<unknown, unknown>>;
      },
    );
    const schema = new G.GraphQLSchema({
      query: R.isEmpty(Query)
        ? this.toOutputType(
          emptySchemaObject,
          `Query`,
        ) as G.GraphQLObjectType
        : new G.GraphQLObjectType({
          name: `Query`,
          fields: Query,
        }),
      mutation: R.isEmpty(Mutation) ? null : new G.GraphQLObjectType({
        name: `Mutation`,
        fields: Mutation,
      }),
    });
    return this.interfaceExtension.extendSchema(schema);
  }
}
