use std::ops::DerefMut;

use expr::parse_assignment_expr;
use expr_ext::ExprExt;
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::*;

use self::{
    buffer::{Buffer, NextTokenAndSpan},
    ctx::WithCtx,
    state::{State, WithState},
    token_and_span::TokenAndSpan,
};
use super::{context::Context, input::Tokens, lexer::token::TokenFactory};
use crate::{
    error::{Error, SyntaxError},
    Syntax,
};

pub type PResult<T> = Result<T, crate::error::Error>;

pub mod buffer;
pub mod ctx;
pub mod expr_ext;
pub mod is_directive;
pub mod is_invalid_class_name;
pub mod is_simple_param_list;
#[macro_use]
mod macros;
pub mod assign_target_or_spread;
pub mod class_and_fn;
pub mod expr;
pub mod ident;
pub mod jsx;
pub mod module_item;
pub mod object;
pub mod output_type;
pub mod parse_object;
pub mod pat;
pub mod pat_type;
pub mod state;
pub mod stmt;
pub mod token_and_span;
pub mod typescript;
mod util;
#[cfg(feature = "verify")]
pub mod verifier;

pub use util::{
    get_qualified_jsx_name, has_use_strict, is_constructor, is_not_this, make_decl_declare,
    unwrap_ts_non_null,
};

pub trait Parser<'a>: Sized + Clone {
    type Token: std::fmt::Debug
        + Clone
        + TokenFactory<'a, Self::TokenAndSpan, Self::I, Buffer = Self::Buffer>;
    type Lexer: super::lexer::Lexer<'a, Self::TokenAndSpan>;
    type Next: NextTokenAndSpan<Token = Self::Token>;
    type TokenAndSpan: TokenAndSpan<Token = Self::Token>;
    type I: Tokens<Self::TokenAndSpan>;
    type Buffer: self::buffer::Buffer<
        'a,
        Lexer = Self::Lexer,
        Token = Self::Token,
        TokenAndSpan = Self::TokenAndSpan,
        I = Self::I,
    >;

    fn input(&self) -> &Self::Buffer;
    fn input_mut(&mut self) -> &mut Self::Buffer;
    fn state(&self) -> &State;
    fn state_mut(&mut self) -> &mut State;

    #[inline(always)]
    fn with_state<'w>(&'w mut self, state: State) -> WithState<'a, 'w, Self> {
        let orig_state = std::mem::replace(self.state_mut(), state);
        WithState {
            orig_state,
            inner: self,
            marker: std::marker::PhantomData,
        }
    }

    #[inline(always)]
    fn ctx(&self) -> Context {
        self.input().get_ctx()
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn with_ctx<'w>(&'w mut self, ctx: Context) -> WithCtx<'a, 'w, Self> {
        let orig_ctx = self.ctx();
        self.set_ctx(ctx);
        WithCtx {
            orig_ctx,
            inner: self,
            marker: std::marker::PhantomData,
        }
    }

    #[inline(always)]
    fn set_ctx(&mut self, ctx: Context) {
        self.input_mut().set_ctx(ctx);
    }

    #[inline(always)]
    fn strict_mode<'w>(&'w mut self) -> WithCtx<'a, 'w, Self> {
        let ctx = self.ctx() | Context::Strict;
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn in_type<'w>(&'w mut self) -> WithCtx<'a, 'w, Self> {
        let ctx = self.ctx() | Context::InType;
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn include_in_expr<'w>(&'w mut self, include_in_expr: bool) -> WithCtx<'a, 'w, Self> {
        let mut ctx = self.ctx();
        ctx.set(Context::IncludeInExpr, include_in_expr);
        self.with_ctx(ctx)
    }

    #[inline(always)]
    fn syntax(&self) -> Syntax {
        self.input().syntax()
    }

    /// Parse with given closure
    #[inline(always)]
    fn parse_with<F, Ret>(&mut self, f: F) -> PResult<Ret>
    where
        F: FnOnce(&mut Self) -> PResult<Ret>,
    {
        f(self)
    }

    #[cold]
    fn emit_err(&mut self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) || !self.syntax().early_errors() {
            return;
        }
        self.emit_error(crate::error::Error::new(span, error))
    }

    #[cold]
    fn emit_error(&mut self, error: crate::error::Error) {
        if self.ctx().contains(Context::IgnoreError) || !self.syntax().early_errors() {
            return;
        }
        let cur = self.input_mut().cur();
        if cur.is_some_and(|cur| cur.is_error()) {
            let err = self.input_mut().bump();
            let err = err.take_error(self.input_mut());
            self.input().iter().add_error(err);
        }
        self.input().iter().add_error(error);
    }

    #[cold]
    fn emit_strict_mode_err(&self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) {
            return;
        }
        let error = crate::error::Error::new(span, error);
        self.input().iter().add_module_mode_error(error);
    }

    fn verify_expr(&mut self, expr: Box<Expr>) -> PResult<Box<Expr>> {
        #[cfg(feature = "verify")]
        {
            use swc_ecma_visit::Visit;
            let mut v = self::verifier::Verifier { errors: Vec::new() };
            v.visit_expr(&expr);
            for (span, error) in v.errors {
                self.emit_err(span, error);
            }
        }
        Ok(expr)
    }

    #[inline(always)]
    fn cur_pos(&mut self) -> BytePos {
        self.input_mut().cur_pos()
    }

    #[inline(always)]
    fn last_pos(&self) -> BytePos {
        self.input().prev_span().hi
    }

    #[inline]
    fn is_general_semi(&mut self) -> bool {
        let Some(cur) = self.input_mut().cur() else {
            return true;
        };
        cur.is_semi() || cur.is_rbrace() || self.input_mut().had_line_break_before_cur()
    }

    fn eat_general_semi(&mut self) -> bool {
        if cfg!(feature = "debug") {
            tracing::trace!("eat(';'): cur={:?}", cur!(self, false));
        }
        let Some(cur) = self.input_mut().cur() else {
            return true;
        };
        if cur.is_semi() {
            self.bump();
            true
        } else {
            cur.is_rbrace() || self.input_mut().had_line_break_before_cur()
        }
    }

    #[inline]
    fn expect_general_semi(&mut self) -> PResult<()> {
        if !self.eat_general_semi() {
            let span = self.input().cur_span();
            let cur = self.input_mut().dump_cur();
            syntax_error!(self, span, SyntaxError::Expected(";".to_string(), cur))
        }
        Ok(())
    }

    #[inline(always)]
    fn bump(&mut self) -> Self::Token {
        debug_assert!(
            self.input().knows_cur(),
            "parser should not call bump() without knowing current token"
        );
        self.input_mut().bump()
    }

    #[inline]
    fn span(&self, start: BytePos) -> Span {
        let end = self.last_pos();
        if cfg!(debug_assertions) && start > end {
            unreachable!(
                "assertion failed: (span.start <= span.end).
 start = {}, end = {}",
                start.0, end.0
            )
        }
        Span::new(start, end)
    }

    #[inline(always)]
    fn assert_and_bump(&mut self, token: &Self::Token) -> PResult<()> {
        if cfg!(debug_assertions) && !self.input_mut().is(token) {
            unreachable!(
                "assertion failed: expected {:?}, got {:?}",
                token,
                self.input_mut().cur()
            );
        }
        let _ = cur!(self, true);
        self.bump();
        Ok(())
    }

    fn check_assign_target(&mut self, expr: &Expr, deny_call: bool) {
        if !expr.is_valid_simple_assignment_target(self.ctx().contains(Context::Strict)) {
            self.emit_err(expr.span(), SyntaxError::TS2406);
        }

        // We follow behavior of tsc
        if self.input().syntax().typescript() && self.syntax().early_errors() {
            let is_eval_or_arguments = match expr {
                Expr::Ident(i) => i.is_reserved_in_strict_bind(),
                _ => false,
            };

            if is_eval_or_arguments {
                self.emit_strict_mode_err(expr.span(), SyntaxError::TS1100);
            }

            fn should_deny(e: &Expr, deny_call: bool) -> bool {
                match e {
                    Expr::Lit(..) => false,
                    Expr::Call(..) => deny_call,
                    Expr::Bin(..) => false,
                    Expr::Paren(ref p) => should_deny(&p.expr, deny_call),

                    _ => true,
                }
            }

            // It is an early Reference Error if LeftHandSideExpression is neither
            // an ObjectLiteral nor an ArrayLiteral and
            // IsValidSimpleAssignmentTarget of LeftHandSideExpression is false.
            if !is_eval_or_arguments
                && !expr.is_valid_simple_assignment_target(self.ctx().contains(Context::Strict))
                && should_deny(expr, deny_call)
            {
                self.emit_err(expr.span(), SyntaxError::TS2406);
            }
        }
    }

    fn parse_tpl_element(&mut self, is_tagged_tpl: bool) -> PResult<TplElement> {
        let start = self.cur_pos();
        let cur = cur!(self, true);
        let (raw, cooked) = if cur.is_template() {
            let cur = self.bump();
            let (cooked, raw) = cur.take_template(self.input_mut());
            match cooked {
                Ok(cooked) => (raw, Some(cooked)),
                Err(err) => {
                    if is_tagged_tpl {
                        (raw, None)
                    } else {
                        return Err(err);
                    }
                }
            }
        } else {
            unexpected!(self, "template token")
        };
        let tail = self.input_mut().is(&Self::Token::BACKQUOTE);
        Ok(TplElement {
            span: self.span(start),
            raw,
            tail,
            cooked,
        })
    }

    /// spec: 'PropertyName'
    fn parse_prop_name(&mut self) -> PResult<PropName> {
        trace_cur!(self, parse_prop_name);
        let ctx = self.ctx() | Context::InPropertyName;
        self.with_ctx(ctx).parse_with(|p| {
            let start = p.input_mut().cur_pos();
            let cur = cur!(p, true);
            let v = if cur.is_str() {
                let t = p.bump();
                let (value, raw) = t.take_str(p.input_mut());
                PropName::Str(Str {
                    span: p.span(start),
                    value,
                    raw: Some(raw),
                })
            } else if cur.is_num() {
                let t = p.bump();
                let (value, raw) = t.take_num(p.input_mut());
                PropName::Num(Number {
                    span: p.span(start),
                    value,
                    raw: Some(raw),
                })
            } else if cur.is_bigint() {
                let t = p.bump();
                let (value, raw) = t.take_bigint(p.input_mut());
                PropName::BigInt(BigInt {
                    span: p.span(start),
                    value,
                    raw: Some(raw),
                })
            } else if cur.is_word() {
                let t = p.bump();
                let w = t.take_word(p.input_mut()).unwrap();
                PropName::Ident(IdentName::new(w, p.span(start)))
            } else if cur.is_lbracket() {
                p.bump();
                let inner_start = p.input_mut().cur_pos();
                let mut expr = parse_assignment_expr(p.include_in_expr(true).deref_mut())?;
                if p.syntax().typescript() && p.input_mut().is(&Self::Token::COMMA) {
                    let mut exprs = vec![expr];
                    while p.input_mut().eat(&Self::Token::COMMA) {
                        //
                        exprs.push(parse_assignment_expr(p.include_in_expr(true).deref_mut())?);
                    }
                    p.emit_err(p.span(inner_start), SyntaxError::TS1171);
                    expr = Box::new(
                        SeqExpr {
                            span: p.span(inner_start),
                            exprs,
                        }
                        .into(),
                    );
                }
                expect!(p, &Self::Token::RBRACKET);
                PropName::Computed(ComputedPropName {
                    span: p.span(start),
                    expr,
                })
            } else {
                unexpected!(
                    p,
                    "identifier, string literal, numeric literal or [ for the computed key"
                )
            };
            Ok(v)
        })
    }

    /// AssignmentExpression[+In, ?Yield, ?Await]
    /// ...AssignmentExpression[+In, ?Yield, ?Await]
    fn parse_expr_or_spread(&mut self) -> PResult<ExprOrSpread> {
        trace_cur!(self, parse_expr_or_spread);
        let start = self.input_mut().cur_pos();
        if self.input_mut().eat(&Self::Token::DOTDOTDOT) {
            let spread_span = self.span(start);
            let spread = Some(spread_span);
            parse_assignment_expr(self.include_in_expr(true).deref_mut())
                .map_err(|err| {
                    Error::new(
                        err.span(),
                        SyntaxError::WithLabel {
                            inner: Box::new(err),
                            span: spread_span,
                            note: "An expression should follow '...'",
                        },
                    )
                })
                .map(|expr| ExprOrSpread { spread, expr })
        } else {
            parse_assignment_expr(self).map(|expr| ExprOrSpread { spread: None, expr })
        }
    }

    fn parse_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_expr);
        debug_tracing!(self, "parse_expr");
        let expr = parse_assignment_expr(self)?;
        let start = expr.span_lo();

        if self.input_mut().is(&Self::Token::COMMA) {
            let mut exprs = vec![expr];

            while self.input_mut().eat(&Self::Token::COMMA) {
                exprs.push(parse_assignment_expr(self)?);
            }

            return Ok(SeqExpr {
                span: self.span(start),
                exprs,
            }
            .into());
        }

        Ok(expr)
    }

    fn mark_found_module_item(&mut self);

    #[inline]
    fn is_ident_ref(&mut self) -> bool {
        let ctx = self.ctx();
        self.input_mut()
            .cur()
            .is_some_and(|cur| cur.is_word() && !cur.is_reserved(ctx))
    }

    #[inline]
    fn peek_is_ident_ref(&mut self) -> bool {
        let ctx = self.ctx();
        peek!(self).is_some_and(|peek| peek.is_word() && !peek.is_reserved(ctx))
    }

    #[inline(always)]
    fn eat_ident_ref(&mut self) -> bool {
        if self.is_ident_ref() {
            self.bump();
            true
        } else {
            false
        }
    }
}
