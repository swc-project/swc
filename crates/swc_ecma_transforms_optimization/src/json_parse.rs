use serde_json::Value;
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_utils::{calc_literal_cost, member_expr, ExprFactory};
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
                    let value =
                        serde_json::to_string(&jsonify(expr.take())).unwrap_or_else(|err| {
                            unreachable!("failed to serialize serde_json::Value as json: {}", err)
                        });

                    *expr = CallExpr {
                        span: expr.span(),
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
        Expr::Tpl(Tpl { quasis, .. }) => Value::String(match quasis.first() {
            Some(TplElement {
                cooked: Some(value),
                ..
            }) => value.to_string(),
            _ => String::new(),
        }),
        _ => unreachable!("jsonify: Expr {:?} cannot be converted to json", e),
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
