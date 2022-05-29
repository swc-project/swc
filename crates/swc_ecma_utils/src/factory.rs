use std::iter;

use swc_atoms::js_word;
use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

/// Extension methods for [Expr].
///
/// Note that many types implements `Into<Expr>` and you can do like
///
/// ```rust
/// use swc_ecma_utils::ExprFactory;
///
/// let _args = vec![0f64.as_arg()];
/// ```
///
/// to create literals. Almost all rust core types implements `Into<Expr>`.
#[allow(clippy::wrong_self_convention)]
pub trait ExprFactory: Into<Expr> {
    /// Creates an [ExprOrSpread] using the given [Expr].
    ///
    /// This is recommended way to create [ExprOrSpread].
    ///
    /// # Example
    ///
    /// ```rust
    /// use swc_common::DUMMY_SP;
    /// use swc_ecma_ast::*;
    /// use swc_ecma_utils::ExprFactory;
    ///
    /// let first = Lit::Num(Number {
    ///     span: DUMMY_SP,
    ///     value: 0.0,
    ///     raw: None,
    /// });
    /// let _args = vec![first.as_arg()];
    /// ```
    #[cfg_attr(not(debug_assertions), inline(always))]
    fn as_arg(self) -> ExprOrSpread {
        ExprOrSpread {
            expr: Box::new(self.into()),
            spread: None,
        }
    }

    /// Creates an expression statement with `self`.
    #[cfg_attr(not(debug_assertions), inline(always))]
    fn into_stmt(self) -> Stmt {
        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(self.into()),
        })
    }

    #[cfg_attr(not(debug_assertions), inline(always))]
    fn as_callee(self) -> Callee {
        Callee::Expr(Box::new(self.into()))
    }

    #[cfg_attr(not(debug_assertions), inline(always))]
    fn as_iife(self) -> CallExpr {
        CallExpr {
            span: DUMMY_SP,
            callee: self.as_callee(),
            args: Default::default(),
            type_args: Default::default(),
        }
    }

    /// create a ArrowExpr which return self
    /// - `() => $self`
    #[cfg_attr(not(debug_assertions), inline(always))]
    fn as_lazy_arrow(self) -> ArrowExpr {
        ArrowExpr {
            span: DUMMY_SP,
            params: Default::default(),
            body: BlockStmtOrExpr::from(self),
            is_async: false,
            is_generator: false,
            type_params: None,
            return_type: None,
        }
    }

    /// create a FnExpr which return self
    /// - `function() { return $self; }`
    #[cfg_attr(not(debug_assertions), inline(always))]
    fn as_lazy_fn(self) -> FnExpr {
        let return_stmt = ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(self.into())),
        };

        FnExpr {
            ident: None,
            function: Function {
                params: Default::default(),
                decorators: Default::default(),
                span: DUMMY_SP,
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![return_stmt.into()],
                }),
                is_generator: Default::default(),
                is_async: Default::default(),
                type_params: Default::default(),
                return_type: Default::default(),
            },
        }
    }

    #[cfg_attr(not(debug_assertions), inline(always))]
    fn apply(self, span: Span, this: Box<Expr>, args: Vec<ExprOrSpread>) -> Expr {
        let apply = self.make_member(Ident::new(js_word!("apply"), span));

        Expr::Call(CallExpr {
            span,
            callee: apply.as_callee(),
            args: iter::once(this.as_arg()).chain(args).collect(),
            type_args: None,
        })
    }

    #[cfg_attr(not(debug_assertions), inline(always))]
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

    #[cfg_attr(not(debug_assertions), inline(always))]
    fn as_call(self, span: Span, args: Vec<ExprOrSpread>) -> Expr {
        Expr::Call(CallExpr {
            span,
            args,
            callee: self.as_callee(),
            type_args: None,
        })
    }

    #[cfg_attr(not(debug_assertions), inline(always))]
    fn wrap_with_paren(self) -> Expr {
        let expr = Box::new(self.into());
        let span = expr.span();
        Expr::Paren(ParenExpr { expr, span })
    }

    /// Creates a binary expr `$self === `
    #[cfg_attr(not(debug_assertions), inline(always))]
    fn make_eq<T>(self, right: T) -> Expr
    where
        T: Into<Expr>,
    {
        self.make_bin(op!("==="), right)
    }

    /// Creates a binary expr `$self $op $rhs`
    #[cfg_attr(not(debug_assertions), inline(always))]
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

    /// Creates a assign expr `$lhs $op $self`
    #[cfg_attr(not(debug_assertions), inline(always))]
    fn make_assign_to<T>(self, op: AssignOp, left: T) -> Expr
    where
        T: Into<PatOrExpr>,
    {
        let left = left.into();
        let right = Box::new(self.into());

        Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            left,
            op,
            right,
        })
    }

    #[cfg_attr(not(debug_assertions), inline(always))]
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

    #[cfg_attr(not(debug_assertions), inline(always))]
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

pub trait IntoIndirectCall
where
    Self: std::marker::Sized,
{
    type Item;
    fn into_indirect(self) -> Self::Item;
}

impl IntoIndirectCall for CallExpr {
    type Item = CallExpr;

    #[cfg_attr(not(debug_assertions), inline(always))]
    fn into_indirect(self) -> CallExpr {
        let callee = self.callee.into_indirect();

        CallExpr { callee, ..self }
    }
}

impl IntoIndirectCall for Callee {
    type Item = Callee;

    #[cfg_attr(not(debug_assertions), inline(always))]
    fn into_indirect(self) -> Callee {
        SeqExpr {
            span: DUMMY_SP,
            exprs: vec![0f64.into(), self.expect_expr()],
        }
        .as_callee()
    }
}
