use serde::{Serialize, Serializer};
use serde_json::{Map, Value};

use crate::Program;

/// Serialize `swc_ecma_ast::Program` as a typescript-eslint-oriented AST.
///
/// This intentionally only changes serialization. Deserialization continues to
/// use the existing SWC-facing representation.
#[derive(Serialize)]
#[serde(transparent)]
pub(crate) struct ProgramSerde(Value);

impl Serialize for Program {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        ProgramSerde::from(self.clone()).serialize(serializer)
    }
}

impl From<Program> for ProgramSerde {
    fn from(program: Program) -> Self {
        let normalized = match program {
            Program::Module(module) => normalize_program(
                serde_json::to_value(module).expect("failed to serialize module"),
                "module",
            ),
            Program::Script(script) => normalize_program(
                serde_json::to_value(script).expect("failed to serialize script"),
                "script",
            ),
            #[cfg(all(swc_ast_unknown, feature = "encoding-impl"))]
            Program::Unknown(..) => unreachable!("unknown program nodes cannot be serialized"),
        };

        ProgramSerde(normalized)
    }
}

fn normalize_program(value: Value, source_type: &'static str) -> Value {
    let mut program = as_object(normalize_value(value));
    program.insert("type".into(), string("Program"));
    program.insert("sourceType".into(), string(source_type));

    if matches!(program.get("interpreter"), Some(Value::Null)) {
        program.remove("interpreter");
    }

    Value::Object(program)
}

fn normalize_value(value: Value) -> Value {
    match value {
        Value::Array(values) => Value::Array(values.into_iter().map(normalize_value).collect()),
        Value::Object(object) => normalize_object(object),
        other => other,
    }
}

fn normalize_object(mut object: Map<String, Value>) -> Value {
    object.remove("span");
    object.remove("ctxt");

    let ty = object
        .get("type")
        .and_then(Value::as_str)
        .map(ToOwned::to_owned);

    for value in object.values_mut() {
        *value = normalize_value(std::mem::take(value));
    }

    apply_common_field_renames(&mut object);

    if let Some(ty) = ty {
        object.insert("type".into(), string(&normalize_type_name(&ty)));

        return match ty.as_str() {
            "PrivateName" => normalize_private_identifier(object),
            "MemberExpression" => normalize_member_expression(object),
            "SuperPropExpression" => normalize_super_prop_expression(object),
            "OptionalChainingExpression" => normalize_opt_chain(object),
            "ClassProperty" | "PrivateProperty" => normalize_property_definition(object),
            "ClassMethod" | "PrivateMethod" | "Constructor" => normalize_method_definition(object),
            "Parameter" => normalize_param(object),
            "TsParameterProperty" => normalize_ts_parameter_property(object),
            "TsPropertySignature" | "TsMethodSignature" => normalize_ts_type_keyed_member(object),
            "TsNamespaceDeclaration" => normalize_ts_namespace_decl(object),
            _ => Value::Object(object),
        };
    }

    Value::Object(object)
}

fn apply_common_field_renames(object: &mut Map<String, Value>) {
    rename_key(object, "identifier", "id");
    rename_key(object, "typeParams", "typeParameters");
    rename_key(object, "superTypeParams", "superTypeArguments");
    rename_key(object, "isAbstract", "abstract");
    rename_key(object, "isStatic", "static");
    rename_key(object, "isOptional", "optional");
    rename_key(object, "isOverride", "override");
}

fn normalize_type_name(ty: &str) -> String {
    match ty {
        "ParenthesisExpression" => "ParenthesizedExpression".into(),
        "TsNamespaceDeclaration" => "TSModuleDeclaration".into(),
        _ if ty.starts_with("Ts") => format!("TS{}", &ty[2..]),
        _ => ty.into(),
    }
}

fn normalize_private_identifier(mut object: Map<String, Value>) -> Value {
    let name = object
        .remove("value")
        .or_else(|| object.remove("id"))
        .or_else(|| object.remove("name"))
        .and_then(extract_identifier_name)
        .unwrap_or_default();

    let mut private_identifier = Map::new();
    private_identifier.insert("type".into(), string("PrivateIdentifier"));
    private_identifier.insert("name".into(), Value::String(name));

    Value::Object(private_identifier)
}

fn normalize_member_expression(mut object: Map<String, Value>) -> Value {
    let property = object.remove("property").unwrap_or(Value::Null);
    let (property, computed) = unpack_computed_key(property);

    object.insert("property".into(), property);
    object.insert("computed".into(), Value::Bool(computed));

    Value::Object(object)
}

fn normalize_super_prop_expression(mut object: Map<String, Value>) -> Value {
    let property = object
        .remove("property")
        .unwrap_or_else(|| object.remove("prop").unwrap_or(Value::Null));
    let (property, computed) = unpack_computed_key(property);

    let mut member_expr = Map::new();
    member_expr.insert("type".into(), string("MemberExpression"));
    member_expr.insert(
        "object".into(),
        object
            .remove("obj")
            .unwrap_or(Value::Object(Map::from_iter([(
                "type".into(),
                string("Super"),
            )]))),
    );
    member_expr.insert("property".into(), property);
    member_expr.insert("computed".into(), Value::Bool(computed));

    Value::Object(member_expr)
}

fn normalize_opt_chain(mut object: Map<String, Value>) -> Value {
    let optional = take_bool(&mut object, "optional");
    let mut expression = object.remove("base").unwrap_or(Value::Null);

    if let Value::Object(ref mut base) = expression {
        base.insert("optional".into(), Value::Bool(optional));
    }

    let mut chain_expr = Map::new();
    chain_expr.insert("type".into(), string("ChainExpression"));
    chain_expr.insert("expression".into(), expression);

    Value::Object(chain_expr)
}

fn normalize_property_definition(mut object: Map<String, Value>) -> Value {
    let key = object.remove("key").unwrap_or(Value::Null);
    let (key, computed) = unpack_computed_key(key);

    let mut property_definition = Map::new();
    property_definition.insert("type".into(), string("PropertyDefinition"));
    property_definition.insert("key".into(), key);
    property_definition.insert("computed".into(), Value::Bool(computed));
    property_definition.insert(
        "static".into(),
        Value::Bool(take_bool(&mut object, "static")),
    );

    move_value(&mut object, &mut property_definition, "value");
    move_value(&mut object, &mut property_definition, "typeAnnotation");
    move_non_empty_array(&mut object, &mut property_definition, "decorators");
    move_optional_value(&mut object, &mut property_definition, "accessibility");
    move_true_bool(&mut object, &mut property_definition, "abstract");
    move_true_bool(&mut object, &mut property_definition, "optional");
    move_true_bool(&mut object, &mut property_definition, "override");
    move_true_bool(&mut object, &mut property_definition, "readonly");
    move_true_bool(&mut object, &mut property_definition, "declare");
    move_true_bool(&mut object, &mut property_definition, "definite");

    Value::Object(property_definition)
}

fn normalize_method_definition(mut object: Map<String, Value>) -> Value {
    let original_type = take_type(&mut object);

    let key = object.remove("key").unwrap_or(Value::Null);
    let (key, computed) = unpack_computed_key(key);

    let kind = match original_type.as_deref() {
        Some("Constructor") => "constructor".to_string(),
        _ => match object.get("kind").and_then(Value::as_str) {
            Some("getter") => "get".to_string(),
            Some("setter") => "set".to_string(),
            Some("method") | None => "method".to_string(),
            Some(other) => other.to_string(),
        },
    };

    let value = if let Some(function) = object.remove("function") {
        into_function_expression(function)
    } else {
        into_function_expression(Value::Object(Map::from_iter([
            (
                "params".into(),
                object.remove("params").unwrap_or_else(empty_array),
            ),
            ("body".into(), object.remove("body").unwrap_or(Value::Null)),
            ("generator".into(), Value::Bool(false)),
            ("async".into(), Value::Bool(false)),
        ])))
    };

    let mut method_definition = Map::new();
    method_definition.insert("type".into(), string("MethodDefinition"));
    method_definition.insert("key".into(), key);
    method_definition.insert("computed".into(), Value::Bool(computed));
    method_definition.insert("kind".into(), string(&kind));
    method_definition.insert(
        "static".into(),
        Value::Bool(take_bool(&mut object, "static")),
    );
    method_definition.insert("value".into(), value);

    move_non_empty_array(&mut object, &mut method_definition, "decorators");
    move_optional_value(&mut object, &mut method_definition, "accessibility");
    move_true_bool(&mut object, &mut method_definition, "abstract");
    move_true_bool(&mut object, &mut method_definition, "optional");
    move_true_bool(&mut object, &mut method_definition, "override");

    Value::Object(method_definition)
}

fn into_function_expression(value: Value) -> Value {
    let mut function = as_object(value);
    let decorators = function.remove("decorators");

    let mut function_expr = Map::new();
    function_expr.insert("type".into(), string("FunctionExpression"));
    function_expr.insert("id".into(), Value::Null);
    function_expr.insert(
        "params".into(),
        normalize_params(function.remove("params").unwrap_or_else(empty_array)),
    );
    function_expr.insert(
        "body".into(),
        function.remove("body").unwrap_or(Value::Null),
    );
    function_expr.insert(
        "generator".into(),
        Value::Bool(take_bool(&mut function, "generator")),
    );
    function_expr.insert(
        "async".into(),
        Value::Bool(take_bool(&mut function, "async")),
    );

    move_optional_value(&mut function, &mut function_expr, "typeParameters");
    move_optional_value(&mut function, &mut function_expr, "returnType");

    if let Some(Value::Array(decorators)) = decorators {
        if !decorators.is_empty() {
            function_expr.insert("decorators".into(), Value::Array(decorators));
        }
    }

    Value::Object(function_expr)
}

fn normalize_params(value: Value) -> Value {
    match value {
        Value::Array(params) => {
            Value::Array(params.into_iter().map(normalize_param_value).collect())
        }
        other => other,
    }
}

fn normalize_param_value(value: Value) -> Value {
    match value {
        Value::Object(object)
            if matches!(
                object.get("type").and_then(Value::as_str),
                Some("Parameter")
            ) =>
        {
            normalize_param(object)
        }
        other => other,
    }
}

fn normalize_param(mut object: Map<String, Value>) -> Value {
    let decorators = object.remove("decorators");
    let mut pattern = object.remove("pat").unwrap_or(Value::Null);

    if let Some(Value::Array(decorators)) = decorators {
        if !decorators.is_empty() {
            if let Value::Object(ref mut pattern_object) = pattern {
                pattern_object.insert("decorators".into(), Value::Array(decorators));
            }
        }
    }

    pattern
}

fn normalize_ts_parameter_property(mut object: Map<String, Value>) -> Value {
    let mut ts_param_prop = Map::new();
    ts_param_prop.insert("type".into(), string("TSParameterProperty"));
    ts_param_prop.insert(
        "parameter".into(),
        object.remove("param").unwrap_or(Value::Null),
    );

    move_non_empty_array(&mut object, &mut ts_param_prop, "decorators");
    move_optional_value(&mut object, &mut ts_param_prop, "accessibility");
    move_true_bool(&mut object, &mut ts_param_prop, "readonly");
    move_true_bool(&mut object, &mut ts_param_prop, "override");

    Value::Object(ts_param_prop)
}

fn normalize_ts_type_keyed_member(mut object: Map<String, Value>) -> Value {
    let key = object.remove("key").unwrap_or(Value::Null);
    let (key, computed) = unpack_computed_key(key);
    object.insert("key".into(), key);
    object.insert(
        "computed".into(),
        Value::Bool(
            if matches!(object.get("computed"), Some(Value::Bool(true))) {
                true
            } else {
                computed
            },
        ),
    );

    Value::Object(object)
}

fn normalize_ts_namespace_decl(mut object: Map<String, Value>) -> Value {
    let mut module_decl = Map::new();
    module_decl.insert("type".into(), string("TSModuleDeclaration"));
    move_value(&mut object, &mut module_decl, "id");
    move_value(&mut object, &mut module_decl, "body");
    move_true_bool(&mut object, &mut module_decl, "declare");
    move_true_bool(&mut object, &mut module_decl, "global");

    Value::Object(module_decl)
}

fn unpack_computed_key(value: Value) -> (Value, bool) {
    match value {
        Value::Object(mut object)
            if matches!(object.get("type").and_then(Value::as_str), Some("Computed")) =>
        {
            (object.remove("expression").unwrap_or(Value::Null), true)
        }
        other => (other, false),
    }
}

fn extract_identifier_name(value: Value) -> Option<String> {
    match value {
        Value::Object(mut object) => object
            .remove("value")
            .or_else(|| object.remove("name"))
            .and_then(|value| value.as_str().map(ToOwned::to_owned)),
        Value::String(value) => Some(value),
        _ => None,
    }
}

fn rename_key(object: &mut Map<String, Value>, from: &str, to: &str) {
    if let Some(value) = object.remove(from) {
        object.insert(to.into(), value);
    }
}

fn move_value(from: &mut Map<String, Value>, to: &mut Map<String, Value>, key: &str) {
    if let Some(value) = from.remove(key) {
        to.insert(key.into(), value);
    }
}

fn move_optional_value(from: &mut Map<String, Value>, to: &mut Map<String, Value>, key: &str) {
    if let Some(value) = from.remove(key) {
        if !value.is_null() {
            to.insert(key.into(), value);
        }
    }
}

fn move_non_empty_array(from: &mut Map<String, Value>, to: &mut Map<String, Value>, key: &str) {
    if let Some(Value::Array(values)) = from.remove(key) {
        if !values.is_empty() {
            to.insert(key.into(), Value::Array(values));
        }
    }
}

fn move_true_bool(from: &mut Map<String, Value>, to: &mut Map<String, Value>, key: &str) {
    if take_bool(from, key) {
        to.insert(key.into(), Value::Bool(true));
    }
}

fn take_bool(object: &mut Map<String, Value>, key: &str) -> bool {
    object
        .remove(key)
        .and_then(|value| value.as_bool())
        .unwrap_or(false)
}

fn take_type(object: &mut Map<String, Value>) -> Option<String> {
    object
        .remove("type")
        .and_then(|value| value.as_str().map(ToOwned::to_owned))
}

fn as_object(value: Value) -> Map<String, Value> {
    match value {
        Value::Object(object) => object,
        _ => Map::new(),
    }
}

fn string(value: &str) -> Value {
    Value::String(value.into())
}

fn empty_array() -> Value {
    Value::Array(Vec::new())
}
