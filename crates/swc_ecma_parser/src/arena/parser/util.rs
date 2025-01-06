use std::ops::{Deref, DerefMut};

use swc_allocator::arena::Box;
use swc_ecma_ast::arena::{EsReserved, Expr};

use super::{PResult, Parser, State};
use crate::{Context, Syntax, Tokens};

impl<'w, 'a: 'w, I: Tokens> Parser<'a, I> {
    /// Original context is restored when returned guard is dropped.
    pub(super) fn with_ctx(&'w mut self, ctx: Context) -> WithCtx<'w, 'a, I> {
        let orig_ctx = self.ctx();
        self.set_ctx(ctx);
        WithCtx {
            orig_ctx,
            inner: self,
        }
    }

    /// Original state is restored when returned guard is dropped.
    pub(super) fn with_state(&'w mut self, state: State) -> WithState<'w, 'a, I> {
        let orig_state = std::mem::replace(&mut self.state, state);
        WithState {
            orig_state,
            inner: self,
        }
    }

    pub(super) fn set_ctx(&mut self, ctx: Context) {
        self.input.set_ctx(ctx);
    }

    pub(super) fn strict_mode(&'w mut self) -> WithCtx<'w, 'a, I> {
        let ctx = Context {
            strict: true,
            ..self.ctx()
        };
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    pub(super) fn in_type(&'w mut self) -> WithCtx<'w, 'a, I> {
        let ctx = Context {
            in_type: true,
            ..self.ctx()
        };
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    pub(super) fn include_in_expr(&'w mut self, include_in_expr: bool) -> WithCtx<'w, 'a, I> {
        let ctx = Context {
            include_in_expr,
            ..self.ctx()
        };
        self.with_ctx(ctx)
    }

    /// Parse with given closure
    #[inline(always)]
    pub(super) fn parse_with<F, Ret>(&mut self, f: F) -> PResult<Ret>
    where
        F: FnOnce(&mut Self) -> PResult<Ret>,
    {
        f(self)
    }

    pub(super) fn syntax(&self) -> Syntax {
        self.input.syntax()
    }
}

pub struct WithState<'w, 'a: 'w, I: Tokens> {
    inner: &'w mut Parser<'a, I>,
    orig_state: State,
}
impl<'w, 'a: 'w, I: Tokens> Deref for WithState<'w, 'a, I> {
    type Target = Parser<'a, I>;

    fn deref(&self) -> &Parser<'a, I> {
        self.inner
    }
}
impl<'w, 'a: 'w, I: Tokens> DerefMut for WithState<'w, 'a, I> {
    fn deref_mut(&mut self) -> &mut Parser<'a, I> {
        self.inner
    }
}
impl<I: Tokens> Drop for WithState<'_, '_, I> {
    fn drop(&mut self) {
        std::mem::swap(&mut self.inner.state, &mut self.orig_state);
    }
}

pub struct WithCtx<'w, 'a: 'w, I: Tokens> {
    inner: &'w mut Parser<'a, I>,
    orig_ctx: Context,
}
impl<'w, 'a: 'w, I: Tokens> Deref for WithCtx<'w, 'a, I> {
    type Target = Parser<'a, I>;

    fn deref(&self) -> &Parser<'a, I> {
        self.inner
    }
}
impl<'w, 'a: 'w, I: Tokens> DerefMut for WithCtx<'w, 'a, I> {
    fn deref_mut(&mut self) -> &mut Parser<'a, I> {
        self.inner
    }
}

impl<I: Tokens> Drop for WithCtx<'_, '_, I> {
    fn drop(&mut self) {
        self.inner.set_ctx(self.orig_ctx);
    }
}

pub(super) trait ExprExt<'a> {
    fn as_expr(&self) -> &Expr<'a>;

    /// "IsValidSimpleAssignmentTarget" from spec.
    fn is_valid_simple_assignment_target(&self, strict: bool) -> bool {
        match self.as_expr() {
            Expr::Ident(ident) => {
                if strict && ident.is_reserved_in_strict_bind() {
                    return false;
                }
                true
            }

            Expr::This(..)
            | Expr::Lit(..)
            | Expr::Array(..)
            | Expr::Object(..)
            | Expr::Fn(..)
            | Expr::Class(..)
            | Expr::Tpl(..)
            | Expr::TaggedTpl(..) => false,
            Expr::Paren(paren_expr) => paren_expr.expr.is_valid_simple_assignment_target(strict),

            Expr::Member(member_expr) => match &member_expr.obj {
                Expr::Member(..) => member_expr.obj.is_valid_simple_assignment_target(strict),
                Expr::OptChain(..) => false,
                _ => true,
            },

            Expr::SuperProp(..) => true,

            Expr::New(..) | Expr::Call(..) => false,
            // TODO: Spec only mentions `new.target`
            Expr::MetaProp(..) => false,

            Expr::Update(..) => false,

            Expr::Unary(..) | Expr::Await(..) => false,

            Expr::Bin(..) => false,

            Expr::Cond(..) => false,

            Expr::Yield(..) | Expr::Arrow(..) | Expr::Assign(..) => false,

            Expr::Seq(..) => false,

            Expr::OptChain(..) => false,

            // MemberExpression is valid assignment target
            Expr::PrivateName(..) => false,

            // jsx
            Expr::JSXMember(..)
            | Expr::JSXNamespacedName(..)
            | Expr::JSXEmpty(..)
            | Expr::JSXElement(..)
            | Expr::JSXFragment(..) => false,

            // typescript
            Expr::TsNonNull(e) => e.expr.is_valid_simple_assignment_target(strict),
            Expr::TsTypeAssertion(e) => e.expr.is_valid_simple_assignment_target(strict),
            Expr::TsAs(e) => e.expr.is_valid_simple_assignment_target(strict),
            Expr::TsInstantiation(e) => e.expr.is_valid_simple_assignment_target(strict),
            Expr::TsSatisfies(e) => e.expr.is_valid_simple_assignment_target(strict),

            Expr::TsConstAssertion(..) => false,

            Expr::Invalid(..) => false,
        }
    }
}

impl<'a> ExprExt<'a> for Box<'a, Expr<'a>> {
    fn as_expr(&self) -> &Expr<'a> {
        self
    }
}
impl<'a> ExprExt<'a> for Expr<'a> {
    fn as_expr(&self) -> &Expr<'a> {
        self
    }
}
