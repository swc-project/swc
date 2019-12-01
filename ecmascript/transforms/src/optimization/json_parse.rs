use crate::{pass::Pass, util::ExprFactory};
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
    pub min_json_size: usize,
}

impl Default for JsonParse {
    fn default() -> Self {
        JsonParse {
            min_json_size: 1024,
        }
    }
}

impl Fold<Expr> for JsonParse {
    /// Hnaldes parent expressions before child expressions.
    fn fold(&mut self, e: Expr) -> Expr {
        let e = match e {
            Expr::Array(..) | Expr::Object(..) => {
                let mut v = LiteralVisitor { is_lit: true };
                e.visit_with(&mut v);
                if v.is_lit {
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
        Expr::Lit(Lit::Num(Number { value, .. })) => Value::Number(
            serde_json::Number::from_f64(value)
                .unwrap_or_else(|| unreachable!("invalid number: {}", value)),
        ),
        _ => unreachable!("Expr: {:?}", e),
    }
}

struct LiteralVisitor {
    is_lit: bool,
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
        match *e {
            Expr::Ident(..) | Expr::Lit(Lit::Regex(..)) => self.is_lit = false,
            Expr::Tpl(ref tpl) if !tpl.exprs.is_empty() => self.is_lit = false,
            _ => e.visit_children(self),
        }
    }
}

impl Visit<Prop> for LiteralVisitor {
    fn visit(&mut self, p: &Prop) {
        p.visit_children(self);

        match p {
            Prop::KeyValue(..) => {}
            _ => self.is_lit = false,
        }
    }
}

impl Visit<ArrayLit> for LiteralVisitor {
    fn visit(&mut self, e: &ArrayLit) {
        e.visit_children(self);

        for elem in &e.elems {
            if elem.is_none() {
                self.is_lit = false;
            }
        }
    }
}

impl Visit<PropName> for LiteralVisitor {
    fn visit(&mut self, p: &PropName) {
        p.visit_children(self);

        match *p {
            PropName::Num(..) | PropName::Computed(..) => self.is_lit = false,
            _ => {}
        }
    }
}

#[cfg(test)]
mod tests {
    use super::JsonParse;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_json_size: 0 },
        simple_object,
        "let a = {b: 'foo'}",
        r#"let a = JSON.parse('{"b":"foo"}')"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_json_size: 0 },
        simple_arr,
        "let a = ['foo']",
        r#"let a = JSON.parse('["foo"]')"#
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| JsonParse { min_json_size: 0 },
        empty_object,
        "const a = {};",
        r#"const a = JSON.parse('{}');"#
    );
}
