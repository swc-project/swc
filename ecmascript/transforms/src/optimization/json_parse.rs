use crate::util::ExprFactory;
use ast::*;
use serde_json::Value;
use swc_common::{Fold, FoldWith, Spanned, Visit, VisitWith, DUMMY_SP};

/// Trnasform to optimize performance of literals.
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
#[derive(Debug)]
pub struct JsonParse {
    pub min_cost: usize,
}

impl Default for JsonParse {
    fn default() -> Self {
        JsonParse { min_cost: 1024 }
    }
}

impl Fold<Expr> for JsonParse {
    /// Hnaldes parent expressions before child expressions.
    fn fold(&mut self, e: Expr) -> Expr {
        let e = match e {
            Expr::Array(..) | Expr::Object(..) => {
                let mut v = LiteralVisitor {
                    is_lit: true,
                    cost: 0,
                };
                e.visit_with(&mut v);
                if v.is_lit && v.cost >= self.min_cost {
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
                        })
                        .as_arg()],
                        type_args: Default::default(),
                    });
                }

                e
            }
            _ => e,
        };

        e.fold_children(self)
    }
}

fn jsonify(e: Expr) -> Value {
    match e {
        Expr::Object(obj) => Value::Object(
            obj.props
                .into_iter()
                .map(|v| match v {
                    PropOrSpread::Prop(box Prop::KeyValue(p)) => p,
                    _ => unreachable!(),
                })
                .map(|p| {
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

struct LiteralVisitor {
    is_lit: bool,
    cost: usize,
}

macro_rules! not_lit {
    ($T:ty) => {
        impl Visit<$T> for LiteralVisitor {
            fn visit(&mut self, _: &$T) {
                self.is_lit = false;
            }
        }
    };
}

not_lit!(ThisExpr);
not_lit!(FnExpr);
not_lit!(UnaryExpr);
not_lit!(UpdateExpr);
not_lit!(AssignExpr);
not_lit!(MemberExpr);
not_lit!(CondExpr);
not_lit!(CallExpr);
not_lit!(NewExpr);
not_lit!(SeqExpr);
not_lit!(TaggedTpl);
not_lit!(ArrowExpr);
not_lit!(ClassExpr);
not_lit!(YieldExpr);
not_lit!(MetaPropExpr);
not_lit!(AwaitExpr);

// TODO:
not_lit!(BinExpr);

not_lit!(JSXMemberExpr);
not_lit!(JSXNamespacedName);
not_lit!(JSXEmptyExpr);
not_lit!(JSXElement);
not_lit!(JSXFragment);

// TODO: TsTypeCastExpr,
// TODO: TsAsExpr,

// TODO: ?
not_lit!(TsNonNullExpr);
// TODO: ?
not_lit!(TsTypeAssertion);
// TODO: ?
not_lit!(TsConstAssertion);

not_lit!(PrivateName);
not_lit!(TsOptChain);

not_lit!(SpreadElement);
not_lit!(Invalid);

impl Visit<Expr> for LiteralVisitor {
    fn visit(&mut self, e: &Expr) {
        if !self.is_lit {
            return;
        }

        match *e {
            Expr::Ident(..) | Expr::Lit(Lit::Regex(..)) => self.is_lit = false,
            Expr::Tpl(ref tpl) if !tpl.exprs.is_empty() => self.is_lit = false,
            _ => e.visit_children(self),
        }
    }
}

impl Visit<Prop> for LiteralVisitor {
    fn visit(&mut self, p: &Prop) {
        if !self.is_lit {
            return;
        }

        p.visit_children(self);

        match p {
            Prop::KeyValue(..) => {
                self.cost += 1;
            }
            _ => self.is_lit = false,
        }
    }
}

impl Visit<PropName> for LiteralVisitor {
    fn visit(&mut self, node: &PropName) {
        if !self.is_lit {
            return;
        }

        node.visit_children(self);

        match node {
            PropName::Str(ref s) => self.cost += 2 + s.value.len(),
            PropName::Ident(ref id) => self.cost += 2 + id.sym.len(),
            PropName::Num(n) => {
                if n.value.fract() < 1e-10 {
                    // TODO: Count digits
                    self.cost += 5;
                } else {
                    self.is_lit = false
                }
            }
            PropName::Computed(..) => self.is_lit = false,
        }
    }
}

impl Visit<ArrayLit> for LiteralVisitor {
    fn visit(&mut self, e: &ArrayLit) {
        if !self.is_lit {
            return;
        }

        self.cost += 2 + e.elems.len();

        e.visit_children(self);

        for elem in &e.elems {
            if elem.is_none() {
                self.is_lit = false;
            }
        }
    }
}

impl Visit<Number> for LiteralVisitor {
    fn visit(&mut self, node: &Number) {
        if node.value.is_infinite() {
            self.is_lit = false;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    struct Normalizer;
    impl Fold<Str> for Normalizer {
        fn fold(&mut self, mut node: Str) -> Str {
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
