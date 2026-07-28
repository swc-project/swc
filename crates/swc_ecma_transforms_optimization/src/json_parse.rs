use std::{collections::BTreeMap, fmt::Write};

use serde::{
    ser::{SerializeMap, SerializeSeq},
    Serialize, Serializer,
};
use serde_json::value::RawValue;
use swc_atoms::Wtf8Atom;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_utils::{calc_literal_cost, member_expr, number::ToJsString, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

/// Transform to optimize performance of literals.
///
///
/// This transform converts pure object literals like
///
/// ```js
/// {a: 1, b: 2}
/// ```
///
/// to
///
/// ```js
/// JSON.parse('{"a":1, "b"}')
/// ```
///
/// # Conditions
/// If any of the conditions below is matched, pure object literal is converter
/// to `JSON.parse`
///
///   - Object literal is deeply nested (threshold: )
///
/// See https://github.com/swc-project/swc/issues/409
pub fn json_parse(min_cost: usize) -> impl Pass {
    visit_mut_pass(JsonParse { min_cost })
}

struct JsonParse {
    pub min_cost: usize,
}

impl Parallel for JsonParse {
    fn create(&self) -> Self {
        JsonParse {
            min_cost: self.min_cost,
        }
    }

    fn merge(&mut self, _: Self) {}
}

impl Default for JsonParse {
    fn default() -> Self {
        JsonParse { min_cost: 1024 }
    }
}

impl VisitMut for JsonParse {
    noop_visit_mut_type!(fail);

    /// Handles parent expressions before child expressions.
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        if self.min_cost == usize::MAX {
            return;
        }

        let e = match expr {
            Expr::Array(..) | Expr::Object(..) => {
                let (is_lit, cost) = calc_literal_cost(&*expr, false);
                if is_lit && cost >= self.min_cost {
                    let span = expr.span();
                    let value = jsonify(expr);

                    *expr = CallExpr {
                        span,
                        callee: member_expr!(Default::default(), DUMMY_SP, JSON.parse).as_callee(),
                        args: vec![Lit::Str(Str {
                            span: DUMMY_SP,
                            raw: None,
                            value: value.into(),
                        })
                        .as_arg()],
                        ..Default::default()
                    }
                    .into();
                    return;
                }

                expr
            }
            _ => expr,
        };

        e.visit_mut_children_with(self)
    }
}

/// Converts a Wtf8Atom to a JSON-safe string, escaping lone surrogates
fn wtf8_to_json_string(value: &Wtf8Atom) -> String {
    if let Some(s) = value.as_str() {
        // Fast path: valid UTF-8
        return s.to_string();
    }

    // Slow path: contains lone surrogates, need to escape them
    let mut result = String::with_capacity(value.len());
    for cp in value.as_wtf8().code_points() {
        if let Some(ch) = cp.to_char() {
            // Valid Rust char, push directly
            result.push(ch);
        } else {
            // Lone surrogate - escape as \uXXXX
            write!(&mut result, "\\u{:04X}", cp.to_u32()).unwrap();
        }
    }
    result
}

/// Converts a finite ECMAScript number without using a saturating integer cast.
fn json_number(value: f64) -> serde_json::Number {
    let is_i64 = value.fract() == 0.0 && value >= i64::MIN as f64 && value < i64::MAX as f64;
    let preserves_zero_sign = value != 0.0 || value.is_sign_positive();

    if is_i64 && preserves_zero_sign {
        return (value as i64).into();
    }

    serde_json::Number::from_f64(value)
        .unwrap_or_else(|| unreachable!("non-finite numbers require raw JSON serialization"))
}

/// Converts a property name to the string key created by an object literal.
fn json_key(key: &PropName) -> String {
    match key {
        PropName::Str(s) => wtf8_to_json_string(&s.value),
        PropName::Ident(id) => id.sym.to_string(),
        PropName::Num(n) => n.value.to_js_string(),
        _ => unreachable!(),
    }
}

/// Serializes a literal expression to JSON text while preserving ECMAScript
/// numeric values that are not representable by `serde_json::Value`.
fn jsonify(e: &Expr) -> String {
    serde_json::to_string(&JsonLiteral(e))
        .unwrap_or_else(|err| unreachable!("failed to serialize literal as JSON: {err}"))
}

/// Adapts an ECMAScript literal expression to Serde's data model.
struct JsonLiteral<'a>(&'a Expr);

impl Serialize for JsonLiteral<'_> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match self.0 {
            Expr::Object(obj) => {
                let mut values = BTreeMap::new();
                for prop in &obj.props {
                    let PropOrSpread::Prop(prop) = prop else {
                        unreachable!()
                    };
                    let Prop::KeyValue(prop) = &**prop else {
                        unreachable!()
                    };
                    values.insert(json_key(&prop.key), &*prop.value);
                }

                let mut map = serializer.serialize_map(Some(values.len()))?;
                for (key, value) in values {
                    map.serialize_entry(&key, &JsonLiteral(value))?;
                }
                map.end()
            }
            Expr::Array(arr) => {
                let mut seq = serializer.serialize_seq(Some(arr.elems.len()))?;
                for value in &arr.elems {
                    let value = value.as_ref().unwrap();
                    seq.serialize_element(&JsonLiteral(value.expr.as_ref()))?;
                }
                seq.end()
            }
            Expr::Lit(Lit::Str(Str { value, .. })) => {
                wtf8_to_json_string(value).serialize(serializer)
            }
            Expr::Lit(Lit::Num(Number { value, .. })) if value.is_infinite() => {
                let value = if value.is_sign_positive() {
                    "2e308"
                } else {
                    "-2e308"
                };
                RawValue::from_string(value.into())
                    .unwrap()
                    .serialize(serializer)
            }
            Expr::Lit(Lit::Num(Number { value, .. })) => json_number(*value).serialize(serializer),
            Expr::Lit(Lit::Null(..)) => serializer.serialize_none(),
            Expr::Lit(Lit::Bool(v)) => serializer.serialize_bool(v.value),
            Expr::Tpl(Tpl { quasis, .. }) => {
                let value = match quasis.first() {
                    Some(TplElement {
                        cooked: Some(value),
                        ..
                    }) => wtf8_to_json_string(value),
                    _ => String::new(),
                };
                value.serialize(serializer)
            }
            _ => unreachable!("jsonify: Expr {:?} cannot be converted to json", self.0),
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        simple_object,
        "let a = {b: 'foo'}"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        simple_arr,
        "let a = ['foo']"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        empty_object,
        "const a = {};"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(15),
        min_cost_15,
        "const a = { b: 1, c: 2 };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        min_cost_0,
        "const a = { b: 1, c: 2 };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        spread,
        "const a = { ...a, b: 1 };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        object_method,
        "const a = {
        method(arg) {
          return arg;
        },
        b: 1
      };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        computed_property,
        r#"const a = { b : "b_val", ["c"]: "c_val" };"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        invalid_numeric_key,
        r#"const a ={ 77777777777777777.1: "foo" };"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        string,
        r#"const a = { b: "b_val" };"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        string_single_quote_1,
        r#"const a = { b: "'abc'" };"#,
        ok_if_code_eq
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        string_single_quote_2,
        r#"const a = { b: "ab\'c" };"#,
        ok_if_code_eq
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        number,
        "const a = { b: 1 };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        decimal_number,
        "const a = { b: 24.0197, c: 0.0, d: 1.0 };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        null,
        "const a = { b: null };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        boolean,
        "const a = { b: false };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        array,
        "const a = { b: [1, 'b_val', null] };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        nested_array,
        "const a = { b: [1, ['b_val', { a: 1 }], null] };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        object,
        "const a = { b: { c: 1 } };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        object_numeric_keys,
        r#"const a = { 1: "123", 23: 45, b: "b_val" };"#
    );
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        tpl,
        r"const a = [`\x22\x21\x224`];"
    );
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        tpl2,
        r#"const a = [`1${b}2`];"#
    );
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(0),
        tpl3,
        r#"const a = [`1${0}2`];"#
    );
}
