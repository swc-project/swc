use std::iter;
use swc_atoms::js_word;
use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

/// Extension methods for [Expr].
pub trait ExprFactory: Into<Expr> {
    #[inline]
    fn as_arg(self) -> ExprOrSpread {
        ExprOrSpread {
            expr: Box::new(self.into()),
            spread: None,
        }
    }

    /// Creates an expression statement with `self`.
    #[inline]
    fn into_stmt(self) -> Stmt {
        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(self.into()),
        })
    }

    #[inline]
    fn as_callee(self) -> ExprOrSuper {
        ExprOrSuper::Expr(Box::new(self.into()))
    }

    #[inline]
    fn as_obj(self) -> ExprOrSuper {
        ExprOrSuper::Expr(Box::new(self.into()))
    }

    fn apply(self, span: Span, this: Box<Expr>, args: Vec<ExprOrSpread>) -> Expr {
        let apply = self.make_member(Ident::new(js_word!("apply"), span));

        Expr::Call(CallExpr {
            span,
            callee: apply.as_callee(),
            args: iter::once(this.as_arg()).chain(args).collect(),
            type_args: None,
        })
    }

    #[inline]
    fn wrap_with_paren(self) -> Expr {
        let expr = Box::new(self.into());
        let span = expr.span();
        Expr::Paren(ParenExpr { expr, span })
    }

    /// Creates a binary expr `$self === `
    #[inline]
    fn make_eq<T>(self, right: T) -> Expr
    where
        T: Into<Expr>,
    {
        self.make_bin(op!("==="), right)
    }

    /// Creates a binary expr `$self $op $rhs`
    #[inline]
    fn make_bin<T>(self, op: BinaryOp, right: T) -> Expr
    where
        T: Into<Expr>,
    {
        let right = Box::new(right.into());

        Expr::Bin(BinExpr {
            span: DUMMY_SP,
            left: Box::new(self.into()),
            op,
            right,
        })
    }

    #[inline]
    fn make_member<T>(self, prop: T) -> Expr
    where
        T: Into<Expr>,
    {
        Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(Box::new(self.into())),
            span: DUMMY_SP,
            computed: false,
            prop: Box::new(prop.into()),
        })
    }

    #[inline]
    fn computed_member<T>(self, prop: T) -> Expr
    where
        T: Into<Expr>,
    {
        Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(Box::new(self.into())),
            span: DUMMY_SP,
            computed: true,
            prop: Box::new(prop.into()),
        })
    }
}

impl<T: Into<Expr>> ExprFactory for T {}
