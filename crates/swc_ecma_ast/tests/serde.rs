#![cfg(feature = "serde-impl")]

use serde_json::{Map, Value};
use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{parse_file_as_program, parse_file_as_script, Syntax, TsSyntax};

fn serialize_program(program: &Program) -> Value {
    serde_json::to_value(program).expect("failed to serialize program")
}

fn parse_program(src: &str, syntax: Syntax) -> Program {
    let cm: Lrc<SourceMap> = Default::default();
    let fm = cm.new_source_file(
        FileName::Custom("serde-normalization.ts".into()).into(),
        src.to_string(),
    );
    let mut errors = Vec::new();
    let program = parse_file_as_program(&fm, syntax, EsVersion::EsNext, None, &mut errors)
        .expect("failed to parse program");

    assert!(
        errors.is_empty(),
        "unexpected recovered parser errors: {errors:#?}"
    );

    program
}

fn parse_script(src: &str) -> Program {
    let cm: Lrc<SourceMap> = Default::default();
    let fm = cm.new_source_file(
        FileName::Custom("serde-normalization.js".into()).into(),
        src.to_string(),
    );
    let mut errors = Vec::new();
    let script = parse_file_as_script(
        &fm,
        Syntax::Es(Default::default()),
        EsVersion::EsNext,
        None,
        &mut errors,
    )
    .expect("failed to parse script");

    assert!(
        errors.is_empty(),
        "unexpected recovered parser errors: {errors:#?}"
    );

    Program::Script(script)
}

fn ts_syntax() -> Syntax {
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    })
}

fn visit_objects<'a>(value: &'a Value, visitor: &mut impl FnMut(&'a Map<String, Value>)) {
    match value {
        Value::Object(object) => {
            visitor(object);

            for child in object.values() {
                visit_objects(child, visitor);
            }
        }
        Value::Array(values) => {
            for value in values {
                visit_objects(value, visitor);
            }
        }
        _ => {}
    }
}

fn nodes_of_type<'a>(value: &'a Value, ty: &str) -> Vec<&'a Map<String, Value>> {
    let mut nodes = Vec::new();

    visit_objects(value, &mut |object| {
        if object.get("type").and_then(Value::as_str) == Some(ty) {
            nodes.push(object);
        }
    });

    nodes
}

fn assert_no_internal_fields(value: &Value) {
    visit_objects(value, &mut |object| {
        assert!(
            !object.contains_key("span"),
            "unexpected `span` in node: {object:#?}"
        );
        assert!(
            !object.contains_key("ctxt"),
            "unexpected `ctxt` in node: {object:#?}"
        );
    });
}

fn assert_normalized_type_names(value: &Value) {
    visit_objects(value, &mut |object| {
        if let Some(ty) = object.get("type").and_then(Value::as_str) {
            assert!(
                !ty.starts_with("Ts"),
                "found non-normalized type name `{ty}` in node: {object:#?}"
            );
        }
    });
}

fn node_key_name(node: &Map<String, Value>) -> Option<&str> {
    match node.get("key") {
        Some(Value::Object(key)) => key
            .get("name")
            .or_else(|| key.get("value"))
            .and_then(Value::as_str),
        _ => None,
    }
}

fn property_definition_named<'a>(value: &'a Value, name: &str) -> &'a Map<String, Value> {
    nodes_of_type(value, "PropertyDefinition")
        .into_iter()
        .find(|node| node_key_name(node) == Some(name))
        .unwrap_or_else(|| panic!("failed to find PropertyDefinition for `{name}`"))
}

fn property_definition_with<'a>(
    value: &'a Value,
    name: &str,
    key: &str,
    expected: bool,
) -> &'a Map<String, Value> {
    nodes_of_type(value, "PropertyDefinition")
        .into_iter()
        .find(|node| {
            node_key_name(node) == Some(name)
                && node.get(key).and_then(Value::as_bool) == Some(expected)
        })
        .unwrap_or_else(|| panic!("failed to find PropertyDefinition `{name}` with `{key}`"))
}

fn node_with_key_name<'a>(value: &'a Value, ty: &str, name: &str) -> &'a Map<String, Value> {
    nodes_of_type(value, ty)
        .into_iter()
        .find(|node| node_key_name(node) == Some(name))
        .unwrap_or_else(|| panic!("failed to find `{ty}` node with key `{name}`"))
}

fn find_super_member<'a>(
    value: &'a Value,
    property_name: &str,
    computed: bool,
) -> &'a Map<String, Value> {
    nodes_of_type(value, "MemberExpression")
        .into_iter()
        .find(|node| {
            node.get("object")
                .and_then(Value::as_object)
                .and_then(|object| object.get("type"))
                .and_then(Value::as_str)
                == Some("Super")
                && node.get("computed").and_then(Value::as_bool) == Some(computed)
                && node
                    .get("property")
                    .and_then(Value::as_object)
                    .and_then(|property| property.get("name").or_else(|| property.get("value")))
                    .and_then(Value::as_str)
                    == Some(property_name)
        })
        .unwrap_or_else(|| {
            panic!("failed to find super member expression `{property_name}` (computed={computed})")
        })
}

fn assert_has_type(value: &Value, ty: &str) {
    assert!(
        !nodes_of_type(value, ty).is_empty(),
        "failed to find node of type `{ty}`"
    );
}

fn has_optional_chain_element(value: &Value) -> bool {
    match value {
        Value::Object(object) => {
            if object.get("optional").and_then(Value::as_bool) == Some(true) {
                return true;
            }

            object.values().any(has_optional_chain_element)
        }
        Value::Array(values) => values.iter().any(has_optional_chain_element),
        _ => false,
    }
}

#[test]
fn program_root_is_typescript_estree_like() {
    let script = serialize_program(&parse_script("const value = 1;"));
    assert_eq!(script["type"], "Program");
    assert_eq!(script["sourceType"], "script");
    assert!(script.get("interpreter").is_none());
    assert_no_internal_fields(&script);
    assert_normalized_type_names(&script);

    let module = serialize_program(&parse_program(
        "export const value = 1;",
        Syntax::Es(Default::default()),
    ));
    assert_eq!(module["type"], "Program");
    assert_eq!(module["sourceType"], "module");
    assert!(module.get("interpreter").is_none());
    assert_no_internal_fields(&module);
    assert_normalized_type_names(&module);
}

#[test]
fn representative_nodes_serialize_with_typescript_estree_shapes() {
    let json = serialize_program(&parse_program(
        r#"
        export class Base {
            other!: number;
            foo() {}
        }

        export class Example extends Base {
            declare declared: string;
            readonly definite!: number;
            override other?: number;
            #secret?: string;

            constructor(public readonly value: string, protected override member: number) {
                super();
                super.foo;
                super["bar"];

                const chain = this.#secret?.toString();
                const parenthesized = (this.value);
                const asExpr = this.value as string;
                const assertion = <string>this.value;
                const nonNull = this.#secret!;
                const satisfiesExpr = this.value satisfies string;
            }
        }

        export function takes(optional?: string) {
            return optional;
        }

        interface Contract {
            readonly field?: string;
            method?<T>(arg: T): T;
            readonly [key: string]: number;
        }

        type Alias = string;

        declare namespace Outer.Inner {
            export type Nested = number;
        }
        "#,
        ts_syntax(),
    ));

    assert_no_internal_fields(&json);
    assert_normalized_type_names(&json);

    assert_has_type(&json, "ParenthesizedExpression");
    assert_has_type(&json, "ChainExpression");
    assert_has_type(&json, "TSAsExpression");
    assert_has_type(&json, "TSTypeAssertion");
    assert_has_type(&json, "TSNonNullExpression");
    assert_has_type(&json, "TSSatisfiesExpression");
    assert_has_type(&json, "TSPropertySignature");
    assert_has_type(&json, "TSMethodSignature");
    assert_has_type(&json, "TSIndexSignature");
    assert_has_type(&json, "TSInterfaceDeclaration");
    assert_has_type(&json, "TSTypeAliasDeclaration");
    assert_has_type(&json, "TSModuleDeclaration");
    assert_has_type(&json, "PrivateIdentifier");

    let chain = nodes_of_type(&json, "ChainExpression")
        .into_iter()
        .next()
        .expect("failed to find ChainExpression");
    let chain_expression = chain["expression"]
        .as_object()
        .expect("chain expression should be an object");
    assert_eq!(
        chain_expression.get("type").and_then(Value::as_str),
        Some("CallExpression")
    );
    assert!(
        has_optional_chain_element(&chain["expression"]),
        "expected a chain element with `optional: true`: {chain:#?}"
    );

    let super_dot = find_super_member(&json, "foo", false);
    assert_eq!(super_dot["object"]["type"], "Super");
    assert_eq!(super_dot["property"]["type"], "Identifier");
    assert_eq!(super_dot["property"]["value"], "foo");

    let super_computed = find_super_member(&json, "bar", true);
    assert_eq!(super_computed["object"]["type"], "Super");
    assert_eq!(super_computed["property"]["type"], "StringLiteral");
    assert_eq!(super_computed["property"]["value"], "bar");

    let declared = property_definition_named(&json, "declared");
    assert_eq!(declared["declare"], true);

    let definite = property_definition_named(&json, "definite");
    assert_eq!(definite["readonly"], true);
    assert_eq!(definite["definite"], true);

    let override_prop = property_definition_with(&json, "other", "override", true);
    assert_eq!(override_prop["optional"], true);

    let private_prop = property_definition_named(&json, "secret");
    assert_eq!(private_prop["key"]["type"], "PrivateIdentifier");
    assert_eq!(private_prop["key"]["name"], "secret");

    let constructor = nodes_of_type(&json, "MethodDefinition")
        .into_iter()
        .find(|node| node.get("kind").and_then(Value::as_str) == Some("constructor"))
        .expect("failed to find constructor MethodDefinition");
    let constructor_value = constructor["value"]
        .as_object()
        .expect("constructor value should be a function expression");
    let params = constructor_value["params"]
        .as_array()
        .expect("constructor params should be an array");

    assert!(
        params
            .iter()
            .all(|param| param.get("type").and_then(Value::as_str) != Some("Parameter")),
        "constructor params should not expose `Parameter` wrappers"
    );
    assert!(
        params
            .iter()
            .any(|param| param.get("type").and_then(Value::as_str) == Some("TSParameterProperty")),
        "constructor params should include TSParameterProperty nodes"
    );
    assert!(
        params.iter().any(|param| {
            param.get("type").and_then(Value::as_str) == Some("TSParameterProperty")
                && param.get("readonly").and_then(Value::as_bool) == Some(true)
        }),
        "expected a readonly TSParameterProperty"
    );
    assert!(
        params.iter().any(|param| {
            param.get("type").and_then(Value::as_str) == Some("TSParameterProperty")
                && param.get("override").and_then(Value::as_bool) == Some(true)
        }),
        "expected an override TSParameterProperty"
    );

    let ts_property_signature = node_with_key_name(&json, "TSPropertySignature", "field");
    assert_eq!(ts_property_signature["readonly"], true);
    assert_eq!(ts_property_signature["optional"], true);

    let ts_method_signature = node_with_key_name(&json, "TSMethodSignature", "method");
    assert_eq!(ts_method_signature["optional"], true);
    assert!(ts_method_signature.get("typeParameters").is_some());

    let ts_index_signature = nodes_of_type(&json, "TSIndexSignature")
        .into_iter()
        .next()
        .expect("failed to find TSIndexSignature");
    assert_eq!(ts_index_signature["readonly"], true);

    let optional_identifier = nodes_of_type(&json, "Identifier")
        .into_iter()
        .find(|node| {
            node.get("value").and_then(Value::as_str) == Some("optional")
                && node.get("optional").and_then(Value::as_bool) == Some(true)
        })
        .expect("failed to find optional Identifier");
    assert_eq!(optional_identifier["value"], "optional");
    assert!(optional_identifier.get("ctxt").is_none());
}
