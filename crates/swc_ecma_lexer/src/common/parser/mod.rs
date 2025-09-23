use either::Either;
use expr::{parse_assignment_expr, parse_str_lit};
use expr_ext::ExprExt;
use swc_atoms::Atom;
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::*;

use self::{
    buffer::{Buffer, NextTokenAndSpan},
    state::{State, WithState},
    token_and_span::TokenAndSpan,
};
use super::{context::Context, input::Tokens, lexer::token::TokenFactory};
use crate::{
    common::syntax::SyntaxFlags,
    error::{Error, SyntaxError},
};

pub type PResult<T> = Result<T, crate::error::Error>;

pub mod buffer;
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
    type Next: NextTokenAndSpan<Token = Self::Token>;
    type TokenAndSpan: TokenAndSpan<Token = Self::Token>;
    type I: Tokens<Self::TokenAndSpan>;
    type Buffer: self::buffer::Buffer<
        'a,
        Token = Self::Token,
        TokenAndSpan = Self::TokenAndSpan,
        I = Self::I,
    >;
    type Checkpoint;

    fn input(&self) -> &Self::Buffer;
    fn input_mut(&mut self) -> &mut Self::Buffer;
    fn state(&self) -> &State;
    fn state_mut(&mut self) -> &mut State;
    fn checkpoint_save(&self) -> Self::Checkpoint;
    fn checkpoint_load(&mut self, checkpoint: Self::Checkpoint);

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

    #[inline(always)]
    fn set_ctx(&mut self, ctx: Context) {
        self.input_mut().set_ctx(ctx);
    }

    #[inline]
    fn do_inside_of_context<T>(&mut self, context: Context, f: impl FnOnce(&mut Self) -> T) -> T {
        let ctx = self.ctx();
        let inserted = ctx.complement().intersection(context);
        if inserted.is_empty() {
            f(self)
        } else {
            self.input_mut().update_ctx(|ctx| ctx.insert(inserted));
            let result = f(self);
            self.input_mut().update_ctx(|ctx| ctx.remove(inserted));
            result
        }
    }

    fn do_outside_of_context<T>(&mut self, context: Context, f: impl FnOnce(&mut Self) -> T) -> T {
        let ctx = self.ctx();
        let removed = ctx.intersection(context);
        if !removed.is_empty() {
            self.input_mut().update_ctx(|ctx| ctx.remove(removed));
            let result = f(self);
            self.input_mut().update_ctx(|ctx| ctx.insert(removed));
            result
        } else {
            f(self)
        }
    }

    #[inline(always)]
    fn strict_mode<T>(&mut self, f: impl FnOnce(&mut Self) -> T) -> T {
        self.do_inside_of_context(Context::Strict, f)
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn in_type<T>(&mut self, f: impl FnOnce(&mut Self) -> T) -> T {
        self.do_inside_of_context(Context::InType, f)
    }

    #[inline(always)]
    fn allow_in_expr<T>(&mut self, f: impl FnOnce(&mut Self) -> T) -> T {
        self.do_inside_of_context(Context::IncludeInExpr, f)
    }

    #[inline(always)]
    fn disallow_in_expr<T>(&mut self, f: impl FnOnce(&mut Self) -> T) -> T {
        self.do_outside_of_context(Context::IncludeInExpr, f)
    }

    #[inline(always)]
    fn syntax(&self) -> SyntaxFlags {
        self.input().syntax()
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
        let cur = self.input().cur();
        if cur.is_error() {
            let err = self.input_mut().expect_error_token_and_bump();
            self.input_mut().iter_mut().add_error(err);
        }
        self.input_mut().iter_mut().add_error(error);
    }

    #[cold]
    fn emit_strict_mode_err(&mut self, span: Span, error: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) {
            return;
        }
        let error = crate::error::Error::new(span, error);
        if self.ctx().contains(Context::Strict) {
            self.input_mut().iter_mut().add_error(error);
        } else {
            self.input_mut().iter_mut().add_module_mode_error(error);
        }
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
    fn cur_pos(&self) -> BytePos {
        self.input().cur_pos()
    }

    #[inline(always)]
    fn last_pos(&self) -> BytePos {
        self.input().prev_span().hi
    }

    #[inline]
    fn is_general_semi(&mut self) -> bool {
        let cur = self.input().cur();
        cur.is_semi() || cur.is_rbrace() || cur.is_eof() || self.input().had_line_break_before_cur()
    }

    fn eat_general_semi(&mut self) -> bool {
        if cfg!(feature = "debug") {
            tracing::trace!("eat(';'): cur={:?}", self.input().cur());
        }
        let cur = self.input().cur();
        if cur.is_semi() {
            self.bump();
            true
        } else {
            cur.is_rbrace() || self.input().had_line_break_before_cur() || cur.is_eof()
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

    #[inline]
    fn expect(&mut self, t: &Self::Token) -> PResult<()> {
        if !self.input_mut().eat(t) {
            let span = self.input().cur_span();
            let cur = self.input_mut().dump_cur();
            syntax_error!(self, span, SyntaxError::Expected(format!("{t:?}"), cur))
        } else {
            Ok(())
        }
    }

    #[inline(always)]
    fn expect_without_advance(&mut self, t: &Self::Token) -> PResult<()> {
        if !self.input_mut().is(t) {
            let span = self.input().cur_span();
            let cur = self.input_mut().dump_cur();
            syntax_error!(self, span, SyntaxError::Expected(format!("{t:?}"), cur))
        } else {
            Ok(())
        }
    }

    #[inline(always)]
    fn bump(&mut self) {
        debug_assert!(
            !self.input().cur().is_eof(),
            "parser should not call bump() without knowing current token"
        );
        self.input_mut().bump()
    }

    #[inline]
    fn span(&self, start: BytePos) -> Span {
        let end = self.last_pos();
        debug_assert!(
            start <= end,
            "assertion failed: (span.start <= span.end). start = {start:?}, end = {end:?}",
        );
        Span::new_with_checked(start, end)
    }

    #[inline(always)]
    fn assert_and_bump(&mut self, token: &Self::Token) {
        debug_assert!(
            self.input().is(token),
            "assertion failed: expected {token:?}, got {:?}",
            self.input().cur()
        );
        self.bump();
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
        let cur = self.input().cur();
        let (raw, cooked) = if cur.is_template() {
            let (cooked, raw) = self.input_mut().expect_template_token_and_bump();
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
        self.do_inside_of_context(Context::InPropertyName, |p| {
            let start = p.input().cur_pos();
            let cur = p.input().cur();
            let v = if cur.is_str() {
                PropName::Str(parse_str_lit(p))
            } else if cur.is_num() {
                let (value, raw) = p.input_mut().expect_number_token_and_bump();
                PropName::Num(Number {
                    span: p.span(start),
                    value,
                    raw: Some(raw),
                })
            } else if cur.is_bigint() {
                let (value, raw) = p.input_mut().expect_bigint_token_and_bump();
                PropName::BigInt(BigInt {
                    span: p.span(start),
                    value,
                    raw: Some(raw),
                })
            } else if cur.is_word() {
                let w = p.input_mut().expect_word_token_and_bump();
                PropName::Ident(IdentName::new(w, p.span(start)))
            } else if cur.is_lbracket() {
                p.bump();
                let inner_start = p.input().cur_pos();
                let mut expr = p.allow_in_expr(parse_assignment_expr)?;
                if p.syntax().typescript() && p.input().is(&Self::Token::COMMA) {
                    let mut exprs = vec![expr];
                    while p.input_mut().eat(&Self::Token::COMMA) {
                        //
                        exprs.push(p.allow_in_expr(parse_assignment_expr)?);
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
        let start = self.input().cur_pos();
        if self.input_mut().eat(&Self::Token::DOTDOTDOT) {
            let spread_span = self.span(start);
            let spread = Some(spread_span);
            self.allow_in_expr(parse_assignment_expr)
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
        let cur = self.input().cur();
        cur.is_word() && !cur.is_reserved(self.ctx())
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

    fn ts_in_no_context<T>(&mut self, op: impl FnOnce(&mut Self) -> PResult<T>) -> PResult<T>;

    fn parse_jsx_element(
        &mut self,
        in_expr_context: bool,
    ) -> PResult<Either<JSXFragment, JSXElement>>;
    fn parse_primary_expr(&mut self) -> PResult<Box<Expr>>;
    fn parse_unary_expr(&mut self) -> PResult<Box<Expr>>;
    fn parse_tagged_tpl(
        &mut self,
        tag: Box<Expr>,
        type_params: Option<Box<TsTypeParamInstantiation>>,
    ) -> PResult<TaggedTpl>;
    fn parse_tagged_tpl_ty(&mut self) -> PResult<TsLitType>;
    fn parse_lhs_expr(&mut self) -> PResult<Box<Expr>>;
}

pub fn parse_shebang<'a>(p: &mut impl Parser<'a>) -> PResult<Option<Atom>> {
    let cur = p.input().cur();
    Ok(if cur.is_shebang() {
        let ret = p.input_mut().expect_shebang_token_and_bump();
        Some(ret)
    } else {
        None
    })
}

#[cold]
#[inline(never)]
pub fn eof_error<'a, P: Parser<'a>>(p: &mut P) -> crate::error::Error {
    debug_assert!(
        p.input().cur().is_eof(),
        "Parser should not call throw_eof_error() without knowing current token"
    );
    let pos = p.input().end_pos();
    let last = Span { lo: pos, hi: pos };
    crate::error::Error::new(last, crate::error::SyntaxError::Eof)
}
