use std::iter;

use swc_atoms::js_word;
use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

/// Extension methods for [Expr].
#[allow(clippy::wrong_self_convention)]
pub trait ExprFactory: Into<Expr> {
    /// ```rust
    /// use swc_common::DUMMY_SP;
    /// use swc_ecma_ast::*;
    /// use swc_ecma_utils::ExprFactory;
    ///
    /// let first = Lit::Num(Number {
    ///     span: DUMMY_SP,
    ///     value: 0.0
    /// });
    /// let _args = vec![first.as_arg()];
    /// ```
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

    #[inline(always)]
    fn as_callee(self) -> Callee {
        Callee::Expr(Box::new(self.into()))
    }

    #[inline]
    fn as_iife(self) -> CallExpr {
        CallExpr {
            span: DUMMY_SP,
            callee: self.as_callee(),
            args: Default::default(),
            type_args: Default::default(),
        }
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
    fn call_fn(self, span: Span, args: Vec<ExprOrSpread>) -> Expr {
        Expr::Call(CallExpr {
            span,
            args,
            callee: self
                .make_member(Ident::new(js_word!("call"), span))
                .as_callee(),
            type_args: None,
        })
    }

    #[inline]
    fn as_call(self, span: Span, args: Vec<ExprOrSpread>) -> Expr {
        Expr::Call(CallExpr {
            span,
            args,
            callee: self.as_callee(),
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
        T: Into<Ident>,
    {
        Expr::Member(MemberExpr {
            obj: Box::new(self.into()),
            span: DUMMY_SP,
            prop: MemberProp::Ident(prop.into()),
        })
    }

    #[inline]
    fn computed_member<T>(self, prop: T) -> Expr
    where
        T: Into<Expr>,
    {
        Expr::Member(MemberExpr {
            obj: Box::new(self.into()),
            span: DUMMY_SP,
            prop: MemberProp::Computed(ComputedPropName {
                span: DUMMY_SP,
                expr: Box::new(prop.into()),
            }),
        })
    }
}

impl<T: Into<Expr>> ExprFactory for T {}

pub trait IntoIndirectCall: Into<CallExpr> {
    fn into_indirect(self) -> CallExpr {
        let s = self.into();

        let callee = Callee::Expr(Box::new(Expr::Seq(SeqExpr {
            span: DUMMY_SP,
            exprs: vec![Box::new(0_f64.into()), s.callee.expect_expr()],
        })));

        CallExpr { callee, ..s }
    }
}

impl<T: Into<CallExpr>> IntoIndirectCall for T {}
