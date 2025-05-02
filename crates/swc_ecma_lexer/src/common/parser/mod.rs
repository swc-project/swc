use either::Either;
use expr_ext::ExprExt;
use swc_atoms::atom;
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::{
    BindingIdent, EsReserved, Expr, Ident, IdentName, Lit, ModuleExportName, Null, PrivateName,
    TplElement, TsThisType,
};

use self::{
    buffer::{Buffer, NextTokenAndSpan},
    ctx::WithCtx,
    state::{State, WithState},
    token_and_span::TokenAndSpan,
};
use super::{context::Context, input::Tokens, lexer::token::TokenFactory};
use crate::{error::SyntaxError, Syntax};

pub type PResult<T> = Result<T, crate::error::Error>;

pub mod buffer;
pub mod ctx;
pub mod expr_ext;
pub mod is_directive;
pub mod is_invalid_class_name;
pub mod is_simple_param_list;
#[macro_use]
mod macros;
pub mod parse_object;
pub mod state;
pub mod token_and_span;
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
    fn state_mut(&mut self) -> &mut State;

    fn with_state<'w>(
        &'w mut self,
        state: State,
    ) -> WithState<'a, 'w, Self::TokenAndSpan, Self::I, Self> {
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
    fn with_ctx<'w>(
        &'w mut self,
        ctx: Context,
    ) -> WithCtx<'a, 'w, Self::TokenAndSpan, Self::I, Self> {
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
    fn strict_mode<'w>(&'w mut self) -> WithCtx<'a, 'w, Self::TokenAndSpan, Self::I, Self> {
        let ctx = self.ctx() | Context::Strict;
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn in_type<'w>(&'w mut self) -> WithCtx<'a, 'w, Self::TokenAndSpan, Self::I, Self> {
        let ctx = self.ctx() | Context::InType;
        self.with_ctx(ctx)
    }

    /// Original context is restored when returned guard is dropped.
    #[inline(always)]
    fn include_in_expr<'w>(
        &'w mut self,
        include_in_expr: bool,
    ) -> WithCtx<'a, 'w, Self::TokenAndSpan, Self::I, Self> {
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

    fn parse_lit(&mut self) -> PResult<Lit> {
        let start = self.cur_pos();
        let cur = cur!(self, true);
        let v = if cur.is_null() {
            self.bump();
            let span = self.span(start);
            Lit::Null(Null { span })
        } else if cur.is_true() || cur.is_false() {
            let value = cur.is_true();
            self.bump();
            let span = self.span(start);
            Lit::Bool(swc_ecma_ast::Bool { span, value })
        } else if cur.is_str() {
            let t = self.bump();
            let (value, raw) = t.take_str(self.input_mut());
            Lit::Str(swc_ecma_ast::Str {
                span: self.span(start),
                value,
                raw: Some(raw),
            })
        } else if cur.is_num() {
            let t = self.bump();
            let (value, raw) = t.take_num(self.input_mut());
            Lit::Num(swc_ecma_ast::Number {
                span: self.span(start),
                value,
                raw: Some(raw),
            })
        } else if cur.is_bigint() {
            let t = self.bump();
            let (value, raw) = t.take_bigint(self.input_mut());
            Lit::BigInt(swc_ecma_ast::BigInt {
                span: self.span(start),
                value,
                raw: Some(raw),
            })
        } else {
            unreachable!("parse_lit should not be called for {:?}", cur)
        };
        Ok(v)
    }

    // https://tc39.es/ecma262/#prod-ModuleExportName
    fn parse_module_export_name(&mut self) -> PResult<ModuleExportName> {
        let Ok(cur) = cur!(self, false) else {
            unexpected!(self, "identifier or string");
        };
        let module_export_name = if cur.is_str() {
            match self.parse_lit()? {
                Lit::Str(str_lit) => ModuleExportName::Str(str_lit),
                _ => unreachable!(),
            }
        } else if cur.is_word() {
            ModuleExportName::Ident(self.parse_ident_name()?.into())
        } else {
            unexpected!(self, "identifier or string");
        };
        Ok(module_export_name)
    }

    /// Use this when spec says "IdentifierName".
    /// This allows idents like `catch`.
    fn parse_ident_name(&mut self) -> PResult<IdentName> {
        let start = self.cur_pos();
        let cur = cur!(self, true);
        let w = if cur.is_word() {
            let t = self.bump();
            t.take_word(self.input_mut()).unwrap()
        } else if cur.is_jsx_name() && self.ctx().contains(Context::InType) {
            let t = self.bump();
            t.take_jsx_name(self.input_mut())
        } else {
            syntax_error!(self, SyntaxError::ExpectedIdent)
        };
        Ok(IdentName::new(w, self.span(start)))
    }

    fn parse_maybe_private_name(&mut self) -> PResult<Either<PrivateName, IdentName>> {
        let is_private = self.input_mut().is(&Self::Token::hash());
        if is_private {
            self.parse_private_name().map(Either::Left)
        } else {
            self.parse_ident_name().map(Either::Right)
        }
    }

    fn parse_private_name(&mut self) -> PResult<PrivateName> {
        let start = self.cur_pos();
        self.assert_and_bump(&Self::Token::hash())?;
        let hash_end = self.input().prev_span().hi;
        if self.input_mut().cur_pos() - hash_end != BytePos(0) {
            syntax_error!(
                self,
                self.span(start),
                SyntaxError::SpaceBetweenHashAndIdent
            );
        }
        let id = self.parse_ident_name()?;
        Ok(PrivateName {
            span: self.span(start),
            name: id.sym,
        })
    }

    #[inline(always)]
    fn assert_and_bump(&mut self, token: &Self::Token) -> PResult<Self::Token> {
        if cfg!(debug_assertions) && !self.input_mut().is(token) {
            unreachable!(
                "assertion failed: expected {:?}, got {:?}",
                token,
                self.input_mut().cur()
            );
        }
        let _ = cur!(self, true);
        Ok(self.input_mut().bump())
    }

    /// IdentifierReference
    #[inline]
    fn parse_ident_ref(&mut self) -> PResult<Ident> {
        let ctx = self.ctx();
        self.parse_ident(
            !ctx.contains(Context::InGenerator),
            !ctx.contains(Context::InAsync),
        )
    }

    /// LabelIdentifier
    #[inline]
    fn parse_label_ident(&mut self) -> PResult<Ident> {
        let ctx = self.ctx();
        self.parse_ident(
            !ctx.contains(Context::InGenerator),
            !ctx.contains(Context::InAsync),
        )
    }

    /// Identifier
    ///
    /// In strict mode, "yield" is SyntaxError if matched.
    fn parse_ident(&mut self, incl_yield: bool, incl_await: bool) -> PResult<Ident>;

    fn is_start_of_expr(&mut self) -> bool {
        is_start_of_left_hand_side_expr(self) || {
            let Some(cur) = self.input_mut().cur() else {
                return false;
            };
            cur.is_plus()
                || cur.is_minus()
                || cur.is_tilde()
                || cur.is_bang()
                || cur.is_delete()
                || cur.is_typeof()
                || cur.is_void()
                || cur.is_plus_plus()
                || cur.is_minus_minus()
                || cur.is_less()
                || cur.is_await()
                || cur.is_yield()
                || (cur.is_hash() && peek!(self).is_some_and(|peek| peek.is_word()))
        }
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

    /// babel: `parseBindingIdentifier`
    ///
    /// spec: `BindingIdentifier`
    fn parse_binding_ident(&mut self, disallow_let: bool) -> PResult<BindingIdent> {
        trace_cur!(self, parse_binding_ident);

        if disallow_let && self.input_mut().cur().is_some_and(|cur| cur.is_let()) {
            unexpected!(self, "let is reserved in const, let, class declaration")
        }

        // "yield" and "await" is **lexically** accepted.
        let ident = self.parse_ident(true, true)?;
        if ident.is_reserved_in_strict_bind() {
            self.emit_strict_mode_err(ident.span, SyntaxError::EvalAndArgumentsInStrict);
        }
        if (self.ctx().contains(Context::InAsync) || self.ctx().contains(Context::InStaticBlock))
            && ident.sym == "await"
        {
            self.emit_err(ident.span, SyntaxError::ExpectedIdent);
        }
        if self.ctx().contains(Context::InGenerator) && ident.sym == "yield" {
            self.emit_err(ident.span, SyntaxError::ExpectedIdent);
        }

        Ok(ident.into())
    }

    /// Parses a modifier matching one the given modifier names.
    ///
    /// `tsParseModifier`
    fn parse_ts_modifier(
        &mut self,
        allowed_modifiers: &[&'static str],
        stop_on_start_of_class_static_blocks: bool,
    ) -> PResult<Option<&'static str>> {
        if !self.input().syntax().typescript() {
            return Ok(None);
        }
        let pos = {
            let cur = cur!(self, true);
            let modifier = if cur.is_unknown_ident() {
                cur.clone().take_unknown_ident_ref(self.input_mut()).clone()
            } else if cur.is_known_ident() {
                cur.take_known_ident()
            } else if cur.is_in() {
                atom!("in")
            } else if cur.is_const() {
                atom!("const")
            } else {
                return Ok(None);
            };
            // TODO: compare atom rather than string.
            allowed_modifiers
                .iter()
                .position(|s| **s == *modifier.as_str())
        };
        if let Some(pos) = pos {
            if stop_on_start_of_class_static_blocks
                && self.input_mut().is(&Self::Token::r#static())
                && peek!(self).is_some_and(|peek| peek.is_lbrace())
            {
                return Ok(None);
            }
            if try_parse_ts_bool(self, |p| ts_next_token_can_follow_modifier(p).map(Some))? {
                return Ok(Some(allowed_modifiers[pos]));
            }
        }
        Ok(None)
    }

    fn parse_opt_binding_ident(&mut self, disallow_let: bool) -> PResult<Option<BindingIdent>> {
        trace_cur!(self, parse_opt_binding_ident);
        let ctx = self.ctx();
        let Some(cur) = self.input_mut().cur() else {
            return Ok(None);
        };
        let is_binding_ident = cur.is_word() && !cur.is_reserved(ctx);
        if is_binding_ident || (cur.is_this() && self.input().syntax().typescript()) {
            self.parse_binding_ident(disallow_let).map(Some)
        } else {
            Ok(None)
        }
    }

    /// `tsParseThisTypeNode`
    fn parse_ts_this_type_node(&mut self) -> PResult<TsThisType> {
        debug_assert!(self.input().syntax().typescript());
        expect!(self, &Self::Token::this());
        Ok(TsThisType {
            span: self.input().prev_span(),
        })
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
        let tail = self.input_mut().is(&Self::Token::backquote());
        Ok(TplElement {
            span: self.span(start),
            raw,
            tail,
            cooked,
        })
    }
}

fn is_start_of_left_hand_side_expr<'a>(p: &mut impl Parser<'a>) -> bool {
    let ctx = p.ctx();
    let Some(cur) = p.input_mut().cur() else {
        return false;
    };
    cur.is_this()
        || cur.is_null()
        || cur.is_super()
        || cur.is_true()
        || cur.is_false()
        || cur.is_num()
        || cur.is_bigint()
        || cur.is_str()
        || cur.is_backquote()
        || cur.is_lparen()
        || cur.is_lbrace()
        || cur.is_lbracket()
        || cur.is_function()
        || cur.is_class()
        || cur.is_new()
        || cur.is_regexp()
        || cur.is_ident_ref(ctx)
        || cur.is_import() && {
            peek!(p).is_some_and(|peek| peek.is_lparen() || peek.is_less() || peek.is_dot())
        }
}

/// `tsTryParse`
fn try_parse_ts_bool<'a, P: Parser<'a>, F>(p: &mut P, op: F) -> PResult<bool>
where
    F: FnOnce(&mut P) -> PResult<Option<bool>>,
{
    if !p.input().syntax().typescript() {
        return Ok(false);
    }
    let prev_ignore_error = p.input().get_ctx().contains(Context::IgnoreError);
    let mut cloned = p.clone();
    cloned.set_ctx(p.ctx() | Context::IgnoreError);
    let res = op(&mut cloned);
    match res {
        Ok(Some(res)) if res => {
            *p = cloned;
            let mut ctx = p.ctx();
            ctx.set(Context::IgnoreError, prev_ignore_error);
            p.input_mut().set_ctx(ctx);
            Ok(res)
        }
        Err(..) => Ok(false),
        _ => Ok(false),
    }
}

/// `tsNextTokenCanFollowModifier`
fn ts_next_token_can_follow_modifier<'a>(p: &mut impl Parser<'a>) -> PResult<bool> {
    debug_assert!(p.input().syntax().typescript());

    // Note: TypeScript's implementation is much more complicated because
    // more things are considered modifiers there.
    // This implementation only handles modifiers not handled by @babel/parser
    // itself. And "static". TODO: Would be nice to avoid lookahead. Want a
    // hasLineBreakUpNext() method...
    p.bump();
    Ok(!p.input_mut().had_line_break_before_cur()
        && p.input_mut().cur().is_some_and(|cur| {
            cur.is_lbracket()
                || cur.is_lbrace()
                || cur.is_star()
                || cur.is_dotdotdot()
                || cur.is_hash()
                || cur.is_word()
                || cur.is_str()
                || cur.is_num()
                || cur.is_bigint()
        }))
}
