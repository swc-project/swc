use crate::{pass::Pass, util::ExprFactory};
use ast::*;
use serde_json::Value;
use swc_common::{Fold, FoldWith, Spanned, Visit, VisitWith, DUMMY_SP};

/// Converts pure object literals like `{a: 1, b: 2}` to
/// `JSON.parse('{"a":1, "b"}')` as it's faster.
///
/// See https://github.com/swc-project/swc/issues/409
pub fn json_parse() -> impl Pass {
    JsonParse
}

struct JsonParse;

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
                            has_escape: false,
                        })
                        .as_arg()],
                        type_args: Default::default(),
                    });
                }
            }
            _ => e,
        };

        e.fold_children(self)
    }
}

fn jsonify(e: Expr) -> Value {
    match e {
        Expr::Object(o) => Value::Object(o.props.into_iter().map(|p| match p {
            PropOrSpread::Prop(p) => (p),
            _ => unreachable!(),
        })),
        Expr::Array(..) => Value::Array(),
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

#[cfg(test)]
mod tests {
    use super::json_parse;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| json_parse(),
        simple_string,
        "let a = {b: 'foo'}",
        r#"let a = JSON.parse('{"b": "foo"}')"#
    );
}
