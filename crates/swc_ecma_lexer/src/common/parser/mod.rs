use assign_target_or_spread::AssignTargetOrSpread;
use either::Either;
use expr::is_start_of_left_hand_side_expr;
use expr_ext::ExprExt;
use pat::pat_is_valid_argument_in_strict;
use pat_type::PatType;
use swc_atoms::atom;
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::{
    ArrayLit, ArrayPat, AssignExpr, AssignOp, AssignPat, AssignPatProp, AssignTarget, BigInt,
    BindingIdent, ComputedPropName, EsReserved, Expr, ExprOrSpread, Ident, IdentName, Invalid,
    JSXAttrName, JSXElementName, JSXEmptyExpr, JSXMemberExpr, JSXNamespacedName, JSXObject,
    JSXText, Key, KeyValuePatProp, Lit, ModuleExportName, Null, Number, ObjectLit, ObjectPat,
    ObjectPatProp, Pat, PrivateName, Prop, PropName, PropOrSpread, RestPat, SeqExpr, SpreadElement,
    Str, TplElement, TsEntityName, TsIntersectionType, TsQualifiedName, TsThisType, TsType,
    TsUnionOrIntersectionType, TsUnionType,
};
use typescript::{
    parse_ts_delimited_list_inner, try_parse_ts_bool, ts_next_token_can_follow_modifier,
    ParsingContext, UnionOrIntersection,
};

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
pub mod expr;
pub mod output_type;
pub mod parse_object;
mod pat;
pub mod pat_type;
pub mod state;
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
    fn assert_and_bump(&mut self, token: &Self::Token) -> PResult<()> {
        if cfg!(debug_assertions) && !self.input_mut().is(token) {
            unreachable!(
                "assertion failed: expected {:?}, got {:?}",
                token,
                self.input_mut().cur()
            );
        }
        let _ = cur!(self, true);
        self.input_mut().bump();
        Ok(())
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

    /// Parse next token as JSX identifier
    fn parse_jsx_ident(&mut self) -> PResult<Ident> {
        debug_assert!(self.input().syntax().jsx());
        trace_cur!(self, parse_jsx_ident);
        if cur!(self, true).is_jsx_name() {
            let t = self.bump();
            let name = t.take_jsx_name(self.input_mut());
            let span = self.input().prev_span();
            Ok(Ident::new_no_ctxt(name, span))
        } else if self.ctx().contains(Context::InForcedJsxContext) {
            self.parse_ident_ref()
        } else {
            unexpected!(self, "jsx identifier")
        }
    }

    /// Parse namespaced identifier.
    fn parse_jsx_namespaced_name(&mut self) -> PResult<JSXAttrName> {
        debug_assert!(self.input().syntax().jsx());
        trace_cur!(self, parse_jsx_namespaced_name);
        let start = self.input_mut().cur_pos();
        let ns = self.parse_jsx_ident()?.into();
        if !self.input_mut().eat(&Self::Token::colon()) {
            return Ok(JSXAttrName::Ident(ns));
        }
        let name = self.parse_jsx_ident().map(IdentName::from)?;
        Ok(JSXAttrName::JSXNamespacedName(JSXNamespacedName {
            span: Span::new(start, name.span.hi),
            ns,
            name,
        }))
    }

    /// Parses element name in any form - namespaced, member or single
    /// identifier.
    fn parse_jsx_element_name(&mut self) -> PResult<JSXElementName> {
        debug_assert!(self.input().syntax().jsx());
        trace_cur!(self, parse_jsx_element_name);
        let start = self.input_mut().cur_pos();
        let mut node = match self.parse_jsx_namespaced_name()? {
            JSXAttrName::Ident(i) => JSXElementName::Ident(i.into()),
            JSXAttrName::JSXNamespacedName(i) => JSXElementName::JSXNamespacedName(i),
        };
        while self.input_mut().eat(&Self::Token::dot()) {
            let prop = self.parse_jsx_ident().map(IdentName::from)?;
            let new_node = JSXElementName::JSXMemberExpr(JSXMemberExpr {
                span: self.span(start),
                obj: match node {
                    JSXElementName::Ident(i) => JSXObject::Ident(i),
                    JSXElementName::JSXMemberExpr(i) => JSXObject::JSXMemberExpr(Box::new(i)),
                    _ => unimplemented!("JSXNamespacedName -> JSXObject"),
                },
                prop,
            });
            node = new_node;
        }
        Ok(node)
    }

    /// JSXEmptyExpression is unique type since it doesn't actually parse
    /// anything, and so it should start at the end of last read token (left
    /// brace) and finish at the beginning of the next one (right brace).
    fn parse_jsx_empty_expr(&mut self) -> PResult<JSXEmptyExpr> {
        debug_assert!(self.input().syntax().jsx());
        let start = self.input_mut().cur_pos();
        Ok(JSXEmptyExpr {
            span: Span::new(start, start),
        })
    }

    fn parse_jsx_text(&mut self) -> PResult<JSXText> {
        debug_assert!(self.input().syntax().jsx());
        debug_assert!(cur!(self, false).is_ok_and(|t| t.is_jsx_text()));
        let token = self.bump();
        let span = self.input().prev_span();
        let (value, raw) = token.take_jsx_text(self.input_mut());
        Ok(JSXText { span, value, raw })
    }

    fn eat_any_ts_modifier(&mut self) -> PResult<bool> {
        if self.syntax().typescript()
            && {
                let cur = cur!(self, false)?;
                cur.is_public() || cur.is_protected() || cur.is_private() || cur.is_readonly()
            }
            && peek!(self).is_some_and(|t| t.is_word() || t.is_lbrace() || t.is_lbracket())
        {
            let _ = self.parse_ts_modifier(&["public", "protected", "private", "readonly"], false);
            Ok(true)
        } else {
            Ok(false)
        }
    }

    /// This does not return 'rest' pattern because non-last parameter cannot be
    /// rest.
    fn reparse_expr_as_pat(&mut self, pat_ty: PatType, expr: Box<Expr>) -> PResult<Pat> {
        if let Expr::Invalid(i) = *expr {
            return Ok(i.into());
        }
        if pat_ty == PatType::AssignPat {
            match *expr {
                Expr::Object(..) | Expr::Array(..) => {
                    // It is a Syntax Error if LeftHandSideExpression is either
                    // an ObjectLiteral or an ArrayLiteral
                    // and LeftHandSideExpression cannot
                    // be reparsed as an AssignmentPattern.
                }
                _ => {
                    self.check_assign_target(&expr, true);
                }
            }
        }
        reparse_expr_as_pat_inner(self, pat_ty, expr)
    }

    fn parse_paren_items_as_params(
        &mut self,
        mut exprs: Vec<AssignTargetOrSpread>,
        trailing_comma: Option<Span>,
    ) -> PResult<Vec<Pat>> {
        let pat_ty = PatType::BindingPat;

        let len = exprs.len();
        if len == 0 {
            return Ok(Vec::new());
        }

        let mut params = Vec::with_capacity(len);

        for expr in exprs.drain(..len - 1) {
            match expr {
                AssignTargetOrSpread::ExprOrSpread(ExprOrSpread {
                    spread: Some(..), ..
                })
                | AssignTargetOrSpread::Pat(Pat::Rest(..)) => {
                    self.emit_err(expr.span(), SyntaxError::TS1014)
                }
                AssignTargetOrSpread::ExprOrSpread(ExprOrSpread {
                    spread: None, expr, ..
                }) => params.push(self.reparse_expr_as_pat(pat_ty, expr)?),
                AssignTargetOrSpread::Pat(pat) => params.push(pat),
            }
        }

        debug_assert_eq!(exprs.len(), 1);
        let expr = exprs.into_iter().next().unwrap();
        let outer_expr_span = expr.span();
        let last = match expr {
            // Rest
            AssignTargetOrSpread::ExprOrSpread(ExprOrSpread {
                spread: Some(dot3_token),
                expr,
            }) => {
                if let Expr::Assign(_) = *expr {
                    self.emit_err(outer_expr_span, SyntaxError::TS1048)
                };
                if let Some(trailing_comma) = trailing_comma {
                    self.emit_err(trailing_comma, SyntaxError::CommaAfterRestElement);
                }
                let expr_span = expr.span();
                self.reparse_expr_as_pat(pat_ty, expr).map(|pat| {
                    RestPat {
                        span: expr_span,
                        dot3_token,
                        arg: Box::new(pat),
                        type_ann: None,
                    }
                    .into()
                })?
            }
            AssignTargetOrSpread::ExprOrSpread(ExprOrSpread { expr, .. }) => {
                self.reparse_expr_as_pat(pat_ty, expr)?
            }
            AssignTargetOrSpread::Pat(pat) => {
                if let Some(trailing_comma) = trailing_comma {
                    if let Pat::Rest(..) = pat {
                        self.emit_err(trailing_comma, SyntaxError::CommaAfterRestElement);
                    }
                }
                pat
            }
        };
        params.push(last);

        if self.ctx().contains(Context::Strict) {
            for param in params.iter() {
                pat_is_valid_argument_in_strict(self, param)
            }
        }
        Ok(params)
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
                let mut expr = p.include_in_expr(true).parse_assignment_expr()?;
                if p.syntax().typescript() && p.input_mut().is(&Self::Token::comma()) {
                    let mut exprs = vec![expr];
                    while p.input_mut().eat(&Self::Token::comma()) {
                        //
                        exprs.push(p.include_in_expr(true).parse_assignment_expr()?);
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
                expect!(p, &Self::Token::rbracket());
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
        if self.input_mut().eat(&Self::Token::dotdotdot()) {
            let spread_span = self.span(start);
            let spread = Some(spread_span);
            self.include_in_expr(true)
                .parse_assignment_expr()
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
            self.parse_assignment_expr()
                .map(|expr| ExprOrSpread { spread: None, expr })
        }
    }

    fn parse_class_prop_name(&mut self) -> PResult<Key> {
        if self.input_mut().is(&Self::Token::hash()) {
            let name = self.parse_private_name()?;
            if name.name == "constructor" {
                self.emit_err(name.span, SyntaxError::PrivateConstructor);
            }
            Ok(Key::Private(name))
        } else {
            self.parse_prop_name().map(Key::Public)
        }
    }

    fn parse_assignment_expr(&mut self) -> PResult<Box<Expr>>;

    /// `tsParseEntityName`
    fn parse_ts_entity_name(&mut self, allow_reserved_words: bool) -> PResult<TsEntityName> {
        debug_assert!(self.input().syntax().typescript());
        trace_cur!(self, parse_ts_entity_name);
        let start = self.input_mut().cur_pos();
        let init = self.parse_ident_name()?;
        if &*init.sym == "void" {
            let dot_start = self.input_mut().cur_pos();
            let dot_span = self.span(dot_start);
            self.emit_err(dot_span, SyntaxError::TS1005)
        }
        let mut entity = TsEntityName::Ident(init.into());
        while self.input_mut().eat(&Self::Token::dot()) {
            let dot_start = self.input_mut().cur_pos();
            let Some(cur) = self.input_mut().cur() else {
                self.emit_err(Span::new(dot_start, dot_start), SyntaxError::TS1003);
                return Ok(entity);
            };
            if !cur.is_hash() && !cur.is_word() {
                self.emit_err(Span::new(dot_start, dot_start), SyntaxError::TS1003);
                return Ok(entity);
            }
            let left = entity;
            let right = if allow_reserved_words {
                self.parse_ident_name()?
            } else {
                self.parse_ident(false, false)?.into()
            };
            let span = self.span(start);
            entity = TsEntityName::TsQualifiedName(Box::new(TsQualifiedName { span, left, right }));
        }
        Ok(entity)
    }

    /// `tsParseDelimitedList`
    fn parse_ts_delimited_list<T, F>(
        &mut self,
        kind: ParsingContext,
        mut parse_element: F,
    ) -> PResult<Vec<T>>
    where
        F: FnMut(&mut Self) -> PResult<T>,
    {
        parse_ts_delimited_list_inner(self, kind, |p| {
            let start = p.input_mut().cur_pos();
            Ok((start, parse_element(p)?))
        })
    }

    fn parse_ts_bracketed_list<T, F>(
        &mut self,
        kind: ParsingContext,
        parse_element: F,
        bracket: bool,
        skip_first_token: bool,
    ) -> PResult<Vec<T>>
    where
        F: FnMut(&mut Self) -> PResult<T>,
    {
        debug_assert!(self.input().syntax().typescript());
        if !skip_first_token {
            if bracket {
                expect!(self, &Self::Token::lbracket());
            } else {
                expect!(self, &Self::Token::less());
            }
        }
        let result = self.parse_ts_delimited_list(kind, parse_element)?;
        if bracket {
            expect!(self, &Self::Token::rbracket());
        } else {
            expect!(self, &Self::Token::greater());
        }
        Ok(result)
    }

    /// `tsParseUnionOrIntersectionType`
    fn parse_ts_union_or_intersection_type<F>(
        &mut self,
        kind: UnionOrIntersection,
        mut parse_constituent_type: F,
        operator: &Self::Token,
    ) -> PResult<Box<TsType>>
    where
        F: FnMut(&mut Self) -> PResult<Box<TsType>>,
    {
        trace_cur!(self, parse_ts_union_or_intersection_type);
        debug_assert!(self.input().syntax().typescript());
        let start = self.input_mut().cur_pos(); // include the leading operator in the start
        self.input_mut().eat(operator);
        trace_cur!(self, parse_ts_union_or_intersection_type__first_type);
        let ty = parse_constituent_type(self)?;
        trace_cur!(self, parse_ts_union_or_intersection_type__after_first);
        if self.input_mut().is(operator) {
            let mut types = vec![ty];
            while self.input_mut().eat(operator) {
                trace_cur!(self, parse_ts_union_or_intersection_type__constituent);
                types.push(parse_constituent_type(self)?);
            }
            return Ok(Box::new(TsType::TsUnionOrIntersectionType(match kind {
                UnionOrIntersection::Union => TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                    span: self.span(start),
                    types,
                }),
                UnionOrIntersection::Intersection => {
                    TsUnionOrIntersectionType::TsIntersectionType(TsIntersectionType {
                        span: self.span(start),
                        types,
                    })
                }
            })));
        }
        Ok(ty)
    }

    fn parse_expr(&mut self) -> PResult<Box<Expr>> {
        trace_cur!(self, parse_expr);
        debug_tracing!(self, "parse_expr");
        let expr = self.parse_assignment_expr()?;
        let start = expr.span_lo();

        if self.input_mut().is(&Self::Token::comma()) {
            let mut exprs = vec![expr];

            while self.input_mut().eat(&Self::Token::comma()) {
                exprs.push(self.parse_assignment_expr()?);
            }

            return Ok(SeqExpr {
                span: self.span(start),
                exprs,
            }
            .into());
        }

        Ok(expr)
    }
}

fn reparse_expr_as_pat_inner<'a>(
    p: &mut impl Parser<'a>,
    pat_ty: PatType,
    expr: Box<Expr>,
) -> PResult<Pat> {
    // In dts, we do not reparse.
    debug_assert!(!p.input().syntax().dts());
    let span = expr.span();
    if pat_ty == PatType::AssignPat {
        match *expr {
            Expr::Object(..) | Expr::Array(..) => {
                // It is a Syntax Error if LeftHandSideExpression is either
                // an ObjectLiteral or an ArrayLiteral
                // and LeftHandSideExpression cannot
                // be reparsed as an AssignmentPattern.
            }

            _ => match *expr {
                // It is a Syntax Error if the LeftHandSideExpression is
                // CoverParenthesizedExpressionAndArrowParameterList:(Expression) and
                // Expression derives a phrase that would produce a Syntax Error according
                // to these rules if that phrase were substituted for
                // LeftHandSideExpression. This rule is recursively applied.
                Expr::Paren(..) => {
                    return Ok(expr.into());
                }
                Expr::Ident(i) => return Ok(i.into()),
                _ => {
                    return Ok(expr.into());
                }
            },
        }
    }

    // AssignmentElement:
    //      DestructuringAssignmentTarget Initializer[+In]?
    //
    // DestructuringAssignmentTarget:
    //      LeftHandSideExpression
    if pat_ty == PatType::AssignElement {
        match *expr {
            Expr::Array(..) | Expr::Object(..) => {}
            Expr::Member(..)
            | Expr::SuperProp(..)
            | Expr::Call(..)
            | Expr::New(..)
            | Expr::Lit(..)
            | Expr::Ident(..)
            | Expr::Fn(..)
            | Expr::Class(..)
            | Expr::Paren(..)
            | Expr::Tpl(..)
            | Expr::TsAs(..) => {
                if !expr.is_valid_simple_assignment_target(p.ctx().contains(Context::Strict)) {
                    p.emit_err(span, SyntaxError::NotSimpleAssign)
                }
                match *expr {
                    Expr::Ident(i) => return Ok(i.into()),
                    _ => {
                        return Ok(expr.into());
                    }
                }
            }
            // It's special because of optional initializer
            Expr::Assign(..) => {}
            _ => p.emit_err(span, SyntaxError::InvalidPat),
        }
    }

    match *expr {
        Expr::Paren(..) => {
            p.emit_err(span, SyntaxError::InvalidPat);
            Ok(Invalid { span }.into())
        }
        Expr::Assign(
            assign_expr @ AssignExpr {
                op: AssignOp::Assign,
                ..
            },
        ) => {
            let AssignExpr {
                span, left, right, ..
            } = assign_expr;
            Ok(AssignPat {
                span,
                left: match left {
                    AssignTarget::Simple(left) => {
                        Box::new(p.reparse_expr_as_pat(pat_ty, left.into())?)
                    }
                    AssignTarget::Pat(pat) => pat.into(),
                },
                right,
            }
            .into())
        }
        Expr::Object(ObjectLit {
            span: object_span,
            props,
        }) => {
            // {}
            let len = props.len();
            Ok(ObjectPat {
                span: object_span,
                props: props
                    .into_iter()
                    .enumerate()
                    .map(|(idx, prop)| {
                        let span = prop.span();
                        match prop {
                            PropOrSpread::Prop(prop) => match *prop {
                                Prop::Shorthand(id) => Ok(ObjectPatProp::Assign(AssignPatProp {
                                    span: id.span(),
                                    key: id.into(),
                                    value: None,
                                })),
                                Prop::KeyValue(kv_prop) => {
                                    Ok(ObjectPatProp::KeyValue(KeyValuePatProp {
                                        key: kv_prop.key,
                                        value: Box::new(p.reparse_expr_as_pat(
                                            pat_ty.element(),
                                            kv_prop.value,
                                        )?),
                                    }))
                                }
                                Prop::Assign(assign_prop) => {
                                    Ok(ObjectPatProp::Assign(AssignPatProp {
                                        span,
                                        key: assign_prop.key.into(),
                                        value: Some(assign_prop.value),
                                    }))
                                }
                                _ => syntax_error!(p, prop.span(), SyntaxError::InvalidPat),
                            },

                            PropOrSpread::Spread(SpreadElement { dot3_token, expr }) => {
                                if idx != len - 1 {
                                    p.emit_err(span, SyntaxError::NonLastRestParam)
                                } else if let Some(trailing_comma) =
                                    p.state().trailing_commas.get(&object_span.lo)
                                {
                                    p.emit_err(*trailing_comma, SyntaxError::CommaAfterRestElement);
                                };

                                let element_pat_ty = pat_ty.element();
                                let pat = if let PatType::BindingElement = element_pat_ty {
                                    if let Expr::Ident(i) = *expr {
                                        i.into()
                                    } else {
                                        p.emit_err(span, SyntaxError::DotsWithoutIdentifier);
                                        Pat::Invalid(Invalid { span })
                                    }
                                } else {
                                    p.reparse_expr_as_pat(element_pat_ty, expr)?
                                };
                                if let Pat::Assign(_) = pat {
                                    p.emit_err(span, SyntaxError::TS1048)
                                };
                                Ok(ObjectPatProp::Rest(RestPat {
                                    span,
                                    dot3_token,
                                    arg: Box::new(pat),
                                    type_ann: None,
                                }))
                            }
                        }
                    })
                    .collect::<PResult<_>>()?,
                optional: false,
                type_ann: None,
            }
            .into())
        }
        Expr::Ident(ident) => Ok(ident.into()),
        Expr::Array(ArrayLit {
            elems: mut exprs, ..
        }) => {
            if exprs.is_empty() {
                return Ok(ArrayPat {
                    span,
                    elems: Vec::new(),
                    optional: false,
                    type_ann: None,
                }
                .into());
            }
            // Trailing comma may exist. We should remove those commas.
            let count_of_trailing_comma = exprs.iter().rev().take_while(|e| e.is_none()).count();
            let len = exprs.len();
            let mut params = Vec::with_capacity(exprs.len() - count_of_trailing_comma);
            // Comma or other pattern cannot follow a rest pattern.
            let idx_of_rest_not_allowed = if count_of_trailing_comma == 0 {
                len - 1
            } else {
                // last element is comma, so rest is not allowed for every pattern element.
                len - count_of_trailing_comma
            };
            for expr in exprs.drain(..idx_of_rest_not_allowed) {
                match expr {
                    Some(
                        expr @ ExprOrSpread {
                            spread: Some(..), ..
                        },
                    ) => p.emit_err(expr.span(), SyntaxError::NonLastRestParam),
                    Some(ExprOrSpread { expr, .. }) => {
                        params.push(p.reparse_expr_as_pat(pat_ty.element(), expr).map(Some)?)
                    }
                    None => params.push(None),
                }
            }
            if count_of_trailing_comma == 0 {
                let expr = exprs.into_iter().next().unwrap();
                let outer_expr_span = expr.span();
                let last = match expr {
                    // Rest
                    Some(ExprOrSpread {
                        spread: Some(dot3_token),
                        expr,
                    }) => {
                        // TODO: is BindingPat correct?
                        if let Expr::Assign(_) = *expr {
                            p.emit_err(outer_expr_span, SyntaxError::TS1048);
                        };
                        if let Some(trailing_comma) = p.state().trailing_commas.get(&span.lo) {
                            p.emit_err(*trailing_comma, SyntaxError::CommaAfterRestElement);
                        }
                        let expr_span = expr.span();
                        p.reparse_expr_as_pat(pat_ty.element(), expr)
                            .map(|pat| {
                                RestPat {
                                    span: expr_span,
                                    dot3_token,
                                    arg: Box::new(pat),
                                    type_ann: None,
                                }
                                .into()
                            })
                            .map(Some)?
                    }
                    Some(ExprOrSpread { expr, .. }) => {
                        // TODO: is BindingPat correct?
                        p.reparse_expr_as_pat(pat_ty.element(), expr).map(Some)?
                    }
                    // TODO: syntax error if last element is ellison and ...rest exists.
                    None => None,
                };
                params.push(last);
            }
            Ok(ArrayPat {
                span,
                elems: params,
                optional: false,
                type_ann: None,
            }
            .into())
        }

        // Invalid patterns.
        // Note that assignment expression with '=' is valid, and handled above.
        Expr::Lit(..) | Expr::Assign(..) => {
            p.emit_err(span, SyntaxError::InvalidPat);
            Ok(Invalid { span }.into())
        }

        Expr::Yield(..) if p.ctx().contains(Context::InGenerator) => {
            p.emit_err(span, SyntaxError::InvalidPat);
            Ok(Invalid { span }.into())
        }

        _ => {
            p.emit_err(span, SyntaxError::InvalidPat);

            Ok(Invalid { span }.into())
        }
    }
}
