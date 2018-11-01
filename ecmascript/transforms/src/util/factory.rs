use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

pub(crate) trait ExprFactory: Into<Expr> {
    fn as_arg(self) -> ExprOrSpread {
        ExprOrSpread {
            expr: box self.into(),
            spread: None,
        }
    }

    fn apply(self, span: Span, this: Box<Expr>, args: Vec<ExprOrSpread>) -> Expr {
        let apply = Expr::Member(MemberExpr {
            // TODO
            span,

            obj: ExprOrSuper::Expr(box self.into()),
            prop: box Expr::Ident(Ident::new(js_word!("apply"), span)),
            computed: false,
        });

        Expr::Call(CallExpr {
            span,
            callee: ExprOrSuper::Expr(box apply),
            args: vec![ExprOrSpread {
                expr: this,
                spread: None,
            }]
            .into_iter()
            .chain(args)
            .collect(),
        })
    }

    fn wrap_with_paren(self) -> Expr {
        let expr = box self.into();
        let span = expr.span();
        Expr::Paren(ParenExpr { expr, span })
    }
}

impl<T: Into<Expr>> ExprFactory for T {}
