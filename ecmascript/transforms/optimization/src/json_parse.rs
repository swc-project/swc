use serde_json::Value;
use std::usize;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::member_expr;
use swc_ecma_utils::{calc_literal_cost, ExprFactory};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

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
/// # COnditions
/// If any of the conditions below is matched, pure object literal is converter
/// to `JSON.parse`
///
///   - Object literal is deeply nested (threshold: )
///
/// See https://github.com/swc-project/swc/issues/409
pub fn json_parse(min_cost: usize) -> impl Fold {
    JsonParse { min_cost }
}

struct JsonParse {
    pub min_cost: usize,
}

impl Default for JsonParse {
    fn default() -> Self {
        JsonParse { min_cost: 1024 }
    }
}

impl Fold for JsonParse {
    noop_fold_type!();

    /// Handles parent expressions before child expressions.
    fn fold_expr(&mut self, e: Expr) -> Expr {
        if self.min_cost == usize::MAX {
            return e;
        }

        let e = match e {
            Expr::Array(..) | Expr::Object(..) => {
                let (is_lit, cost) = calc_literal_cost(&e, false);
                if is_lit && cost >= self.min_cost {
                    return Expr::Call(CallExpr {
                        span: e.span(),
                        callee: member_expr!(DUMMY_SP, JSON.parse).as_callee(),
                        args: vec![Lit::Str(Str {
                            span: DUMMY_SP,
                            value: serde_json::to_string(&jsonify(e))
                                .unwrap_or_else(|err| {
                                    unreachable!(
                                        "failed to serialize serde_json::Value as json: {}",
                                        err
                                    )
                                })
                                .into(),
                            has_escape: false,
                            kind: Default::default(),
                        })
                        .as_arg()],
                        type_args: Default::default(),
                    });
                }

                e
            }
            _ => e,
        };

        e.fold_children_with(self)
    }
}

fn jsonify(e: Expr) -> Value {
    match e {
        Expr::Object(obj) => Value::Object(
            obj.props
                .into_iter()
                .map(|v| match v {
                    PropOrSpread::Prop(p) if p.is_key_value() => p.key_value().unwrap(),
                    _ => unreachable!(),
                })
                .map(|p: KeyValueProp| {
                    let value = jsonify(*p.value);
                    let key = match p.key {
                        PropName::Str(s) => s.value.to_string(),
                        PropName::Ident(id) => id.sym.to_string(),
                        PropName::Num(n) => format!("{}", n.value),
                        _ => unreachable!(),
                    };
                    (key, value)
                })
                .collect(),
        ),
        Expr::Array(arr) => Value::Array(
            arr.elems
                .into_iter()
                .map(|v| jsonify(*v.unwrap().expr))
                .collect(),
        ),
        Expr::Lit(Lit::Str(Str { value, .. })) => Value::String(value.to_string()),
        Expr::Lit(Lit::Num(Number { value, .. })) => Value::Number((value as i64).into()),
        Expr::Lit(Lit::Null(..)) => Value::Null,
        Expr::Lit(Lit::Bool(v)) => Value::Bool(v.value),
        _ => unreachable!("jsonify: Expr {:?} cannot be converted to json", e),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;

    struct Normalizer;
    impl Fold for Normalizer {
        fn fold_str(&mut self, mut node: Str) -> Str {
            node.has_escape = false;
            node
        }
    }

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        simple_object,
        "let a = {b: 'foo'}",
        r#"let a = JSON.parse('{"b":"foo"}')"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        simple_arr,
        "let a = ['foo']",
        r#"let a = JSON.parse('["foo"]')"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        empty_object,
        "const a = {};",
        r#"const a = JSON.parse('{}');"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 15 },
        min_cost_15,
        "const a = { b: 1, c: 2 };",
        "const a = { b: 1, c: 2 };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        min_cost_0,
        "const a = { b: 1, c: 2 };",
        r#"const a = JSON.parse('{"b":1,"c":2}');"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        spread,
        "const a = { ...a, b: 1 };",
        "const a = { ...a, b: 1 };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        object_method,
        "const a = {
        method(arg) {
          return arg;
        },
        b: 1
      };",
        "const a = {
        method(arg) {
          return arg;
        },
        b: 1
      };"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        computed_property,
        r#"const a = { b : "b_val", ["c"]: "c_val" };"#,
        r#"const a = { b : "b_val", ["c"]: "c_val" };"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        invalid_numeric_key,
        r#"const a ={ 77777777777777777.1: "foo" };"#,
        r#"const a = JSON.parse('{"77777777777777780":"foo"}');"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        string,
        r#"const a = { b: "b_val" };"#,
        r#"const a = JSON.parse('{"b":"b_val"}');"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        string_single_quote_1,
        r#"const a = { b: "'abc'" };"#,
        r#"const a = JSON.parse('{"b":"\'abc\'"}');"#,
        ok_if_code_eq
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        string_single_quote_2,
        r#"const a = { b: "ab\'c" };"#,
        r#"const a = JSON.parse('{"b":"ab\'c"}');"#,
        ok_if_code_eq
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        number,
        "const a = { b: 1 };",
        r#"const a = JSON.parse('{"b":1}');"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        null,
        "const a = { b: null };",
        r#"const a = JSON.parse('{"b":null}');"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        boolean,
        "const a = { b: false };",
        r#"const a = JSON.parse('{"b":false}');"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        array,
        "const a = { b: [1, 'b_val', null] };",
        r#"const a = JSON.parse('{"b":[1,"b_val",null]}');"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        nested_array,
        "const a = { b: [1, ['b_val', { a: 1 }], null] };",
        r#"const a = JSON.parse('{"b":[1,["b_val",{"a":1}],null]}');"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        object,
        "const a = { b: { c: 1 } };",
        r#"const a = JSON.parse('{"b":{"c":1}}');"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_cost: 0 },
        object_numeric_keys,
        r#"const a = { 1: "123", 23: 45, b: "b_val" };"#,
        r#"const a = JSON.parse('{"1":"123","23":45,"b":"b_val"}');"#
    );
}
