import { G, R } from "../deps.ts";
import { stringify } from "./log.ts";
import { GraphQLFurnace } from "./openApiToGraphQL/index.ts";
import { isOpenAPIV3Document } from "./openApiToGraphQL/utils.ts";
import { ApiArtifacts, Enums, NonBodyArg, PossibleType } from "./types.d.ts";
import {
  oasPathParamsToColonParams,
} from "./utils/oasPathParamsToColonParams.ts";

const getGraphQLTypeName = (
  outputType: G.GraphQLOutputType,
): string | undefined =>
  // deno-lint-ignore no-explicit-any
  (outputType as any).ofType
    ? // deno-lint-ignore no-explicit-any
      getGraphQLTypeName((outputType as any).ofType)
    : G.isScalarType(outputType)
    ? undefined
    : // deno-lint-ignore no-explicit-any
      (outputType as any).name;

type TypeIntrospection = {
  kind: string;
  name: string;
  ofType?: TypeIntrospection;
};
type IntrospectionResult = {
  data: {
    __schema: {
      types: {
        fields?: Array<{
          name: string;
          type: TypeIntrospection;
        }>;
        kind: string;
        name: string;
        possibleTypes?: { name: string; fields: { name: string }[] }[];
      }[];
    };
  };
};

const getIntrospectionQueryResult = (
  schema: G.GraphQLSchema,
): Promise<IntrospectionResult> => {
  const document = G.parse(`
  {
    __schema {
      types {
        fields {
          name
          type {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
        kind
        name
        possibleTypes {
          name
          fields(includeDeprecated: true) {
            name
          }
        }
      }
    }
  }
`);
  // deno-lint-ignore no-explicit-any
  return (G as any).execute({ document, schema });
};

const getPossibleTypes = (
  { data: { __schema: { types } } }: IntrospectionResult,
): ApiArtifacts["possibleTypes"] => {
  const byUniqPropetiesLengthDesc = (a: PossibleType, b: PossibleType) =>
    b.uniqProperties.length - a.uniqProperties.length;
  const toName = ({ name }: { name: string }) => name;
  return types.reduce(
    (acc, { kind, name, possibleTypes: possTypes }) => {
      if (possTypes) {
        const withUniqProps = possTypes.map((
          { fields, name },
        ) => [name, fields.map(toName)] as [string, string[]]).map(
          ([name, properties], idx, arr) => {
            const otherTypesProperties =
              (R.remove(idx, 1, arr) as [string, string[]][])
                .reduce(
                  (acc, [, pNames]) => acc.concat(pNames),
                  [] as string[],
                );
            const uniqProperties = R.difference(
              properties,
              otherTypesProperties,
            );
            return { name, uniqProperties };
          },
        );
        acc[name] = {
          kind: kind as `INTERFACE` | `UNION`,
          possibleTypes: withUniqProps.sort(byUniqPropetiesLengthDesc),
        };
      }
      return acc;
    },
    {} as ApiArtifacts["possibleTypes"],
  );
};

const unwrapOutputType = (
  type: TypeIntrospection,
): { kind: `OBJECT` | `UNION`; name: string } | undefined =>
  type.kind === `OBJECT` || type.kind === `UNION`
    ? // deno-lint-ignore no-explicit-any
      type as any
    : type.ofType
    ? unwrapOutputType(type.ofType)
    : undefined;
const getObjectsRelation = (
  { data: { __schema: { types } } }: IntrospectionResult,
): ApiArtifacts["objectsRelation"] => {
  const ignoreObjectNameRe = /^(?:Mutation|Query|Subscription|__.+)$/;
  return types.reduce((objectsRelation, type) => {
    if (type.kind === `OBJECT` && !ignoreObjectNameRe.test(type.name)) {
      const fieldsToTypenameMap = type.fields!.reduce((acc, child) => {
        const childObjectType = unwrapOutputType(child.type);
        if (childObjectType) {
          acc[child.name] = childObjectType.name;
        }
        return acc;
      }, {} as Record<string, string>);
      if (!R.isEmpty(fieldsToTypenameMap)) {
        objectsRelation[type.name] = fieldsToTypenameMap;
      }
    }
    return objectsRelation;
  }, {} as ApiArtifacts["objectsRelation"]);
};

export const refine = async (openApi: Record<string, unknown>) => {
  if (!isOpenAPIV3Document(openApi)) {
    throw new Error(
      `File does not contain a valid OpenAPIV3 document:

      ${stringify(openApi, { maxDepth: 1 })}`,
    );
  }

  const enums: Enums = new Map();
  const objectsRename: ApiArtifacts["objectsRename"] = {};
  const operations: ApiArtifacts["operations"] = [];

  const gqlSchema = new GraphQLFurnace(
    openApi,
    {
      onEnumDistilled(name, source) {
        enums.set(name, source.enum);
      },
      onPropertyRenamed(objectName, originalName, changedName) {
        (objectsRename[objectName] || (objectsRename[objectName] = {}))[
          originalName
        ] = changedName;
      },
      onOperationDistilled(
        url,
        httpMethod,
        operationId,
        fieldConfig,
        parameters,
      ) {
        const nonBodyParameters = parameters?.reduce(
          (acc, param) => {
            if (param.in !== "body") {
              acc.push(
                {
                  in: param.in,
                  name: param.name,
                  originalName: param.originalName,
                },
              );
            }
            return acc;
          },
          [] as Array<{ in: NonBodyArg; name: string; originalName?: string }>,
        );
        operations.push({
          httpMethod,
          operationId,
          path: oasPathParamsToColonParams(url),
          responseType: getGraphQLTypeName(fieldConfig.type),
          parameters: R.isEmpty(nonBodyParameters)
            ? undefined
            : nonBodyParameters,
        });
      },
    },
  ).toGqlSchema();
  const introspectionResult = await getIntrospectionQueryResult(gqlSchema);
  return {
    apiArtifacts: {
      objectsRelation: getObjectsRelation(introspectionResult),
      objectsRename,
      operations,
      possibleTypes: getPossibleTypes(introspectionResult),
    } as ApiArtifacts,
    enums,
    openApi,
    gqlSchema,
  };
};
