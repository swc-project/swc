use crate::{pass::Pass, util::ExprFactory};
use ast::*;
use swc_common::{Fold, FoldWith, Visit, VisitWith, DUMMY_SP};

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
            Expr::Object(o) => {
                let mut v = LiteralVisitor { is_lit: true };
                o.visit_with(&mut v);
                if v.is_lit {
                    Expr::Call(CallExpr {
                        span: o.span,
                        callee: member_expr!(DUMMY_SP, JSON.parse).as_callee(),
                        args: vec![],
                        type_args: Default::default(),
                    })
                } else {
                    Expr::Object(o)
                }
            }
            _ => e,
        };

        e.fold_children(self)
    }
}

struct LiteralVisitor {
    is_lit: bool,
}

macro_rules! not_lit {
    ($T:ty) => {
        impl Visit<$T> for LiteralVisitor {
            fn visit(&mut self, node: &$T) {
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
        "let a = JSON.parse(\"{\"b\": \"foo\"}\")"
    );
}
