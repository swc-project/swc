use ast::*;
use std::iter;
use swc_common::{Span, Spanned, DUMMY_SP};

/// Extension methods for [Expr].
pub trait ExprFactory: Into<Expr> {
    fn as_arg(self) -> ExprOrSpread {
        ExprOrSpread {
            expr: box self.into(),
            spread: None,
        }
    }

    #[inline]
    fn as_callee(self) -> ExprOrSuper {
        ExprOrSuper::Expr(box self.into())
    }

    #[inline]
    fn as_obj(self) -> ExprOrSuper {
        ExprOrSuper::Expr(box self.into())
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
            callee: apply.as_callee(),
            args: iter::once(this.as_arg()).chain(args).collect(),
            type_args: None,
        })
    }

    fn wrap_with_paren(self) -> Expr {
        let expr = box self.into();
        let span = expr.span();
        Expr::Paren(ParenExpr { expr, span })
    }

    /// Creates a binrary expr `$self === `
    fn make_eq<T>(self, right: T) -> Expr
    where
        T: Into<Expr>,
    {
        self.make_bin(op!("==="), right)
    }

    /// Creates a binrary expr `$self $op $rhs`
    fn make_bin<T>(self, op: BinaryOp, right: T) -> Expr
    where
        T: Into<Expr>,
    {
        let right = box right.into();

        Expr::Bin(BinExpr {
            span: DUMMY_SP,
            left: box self.into(),
            op,
            right,
        })
    }
}

impl<T: Into<Expr>> ExprFactory for T {}
