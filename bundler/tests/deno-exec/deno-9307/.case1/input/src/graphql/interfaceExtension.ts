import { G } from "../../deps.ts";

const nameKind = (value: string): G.NameNode => ({
  kind: G.Kind.NAME,
  value,
});

const namedTypeKind = (value: string): G.NamedTypeNode => ({
  kind: G.Kind.NAMED_TYPE,
  name: nameKind(value),
});

const fieldToAST = (
  // deno-lint-ignore no-explicit-any
  field: G.GraphQLField<any, any>,
): G.FieldDefinitionNode => ({
  kind: G.Kind.FIELD_DEFINITION,
  name: nameKind(field.name),
  type: G.parseType(field.type.toString()),
});

const interfaceToAST = (
  iface: G.GraphQLInterfaceType,
): G.InterfaceTypeDefinitionNode => ({
  kind: G.Kind.INTERFACE_TYPE_DEFINITION,
  name: nameKind(iface.name),
  fields: Object.values(iface.getFields()).map(fieldToAST),
});

/**
 * We treat `anyOf` or `allOf` JsonSchema compositions as a _object extension_
 * mechanism.
 * 
 * Example:
 *   
 *   title: FooBar
 *   allOf:
 *     - $ref: "#/components/schemas/Foo"
 *     - $ref: "#/components/schemas/Bar"
 * 
 * You could read the example as the object "FooBar" extends "Foo" and "Bar".
 * 
 * We use GraphQL _interface_ to improve query definitions, the "FooBar" object
 * type will implement "Foo" and "Bar" interfaces and if "Foo" exists somewhere
 * else, programmer can create single "FooInterface" GraphQL Fragment and use
 * it for all occurences of "Foo" as well as for all types, which implements
 * "FooInterface".
 * 
 * We must use schema extension for this task. During GraphQL distillation, if
 * "Foo" is distilled sooner than we reach "FooBar", the "Foo" object type is
 * already created, but we need the "Foo" object to self-extend "FooInterface".
 * Via schema extension, we can modify already created GraphQL types.
 */
export const interfaceExtensionFactory = () => {
  type InterfaceName = string;
  type ExtendingName = string;
  const interfaceRelations = new Map<ExtendingName, Set<InterfaceName>>();
  const interfaces = new Map<InterfaceName, G.GraphQLInterfaceType>();
  const addInterfaceRelation = (extendsName: string, ifaceName: string) => {
    let relation = interfaceRelations.get(extendsName);
    if (!relation) {
      relation = new Set();
      interfaceRelations.set(extendsName, relation);
    }
    relation.add(ifaceName);
  };
  const getInterface = (
    source: G.GraphQLObjectType,
  ): G.GraphQLInterfaceType => {
    const interfaceName = `${source.name}Interface`;
    let iface = interfaces.get(interfaceName);
    if (!iface) {
      iface = new G.GraphQLInterfaceType({
        name: interfaceName,
        fields: source.toConfig().fields,
      });
      interfaces.set(interfaceName, iface);
      // self extends
      addInterfaceRelation(source.name, iface.name);
    }
    return iface;
  };
  const addInterfaceConnection = (
    // deno-lint-ignore no-explicit-any
    interfaceObject: G.GraphQLObjectType<any, any>,
    // deno-lint-ignore no-explicit-any
    extendingObject: G.GraphQLObjectType<any, any>,
  ) => {
    const iface = getInterface(interfaceObject);
    addInterfaceRelation(extendingObject.name, iface.name);
  };
  const extendSchema = (schema: G.GraphQLSchema): G.GraphQLSchema => {
    const ifaces = Array.from(interfaces.values());
    if (ifaces.length === 0) {
      return schema;
    }
    const interfaceDefinitions = ifaces.map(interfaceToAST);
    const objectExtendsDefinitions = Array.from(
      interfaceRelations.entries(),
    ).map((
      [typeName, interfaces],
    ) => ({
      kind: G.Kind.OBJECT_TYPE_EXTENSION,
      name: nameKind(typeName),
      interfaces: Array.from(interfaces).map(namedTypeKind),
    } as G.ObjectTypeExtensionNode));
    const document = {
      kind: G.Kind.DOCUMENT,
      definitions: [
        ...interfaceDefinitions,
        ...objectExtendsDefinitions,
      ],
    };
    return G.extendSchema(schema, document, { assumeValidSDL: true });
  };
  return { addInterfaceConnection, extendSchema };
};

export type InterfaceExtension = ReturnType<typeof interfaceExtensionFactory>;
