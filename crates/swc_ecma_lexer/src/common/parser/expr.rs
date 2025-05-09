use std::ops::DerefMut;

use either::Either;
use swc_common::{util::take::Take, BytePos, Span, Spanned};
use swc_ecma_ast::*;

use super::{buffer::Buffer, ident::parse_ident_name, PResult, Parser};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            expr_ext::ExprExt,
            ident::parse_maybe_private_name,
            pat::reparse_expr_as_pat,
            pat_type::PatType,
            typescript::{
                parse_ts_type_args, parse_ts_type_params, try_parse_ts, try_parse_ts_type_args,
            },
            unwrap_ts_non_null,
        },
    },
    error::{Error, SyntaxError},
    TokenContext,
};

pub(super) fn is_start_of_left_hand_side_expr<'a>(p: &mut impl Parser<'a>) -> bool {
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

#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub fn parse_array_lit<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_array_lit);

    let start = p.input_mut().cur_pos();

    p.assert_and_bump(&P::Token::LBRACKET)?;

    let mut elems = Vec::with_capacity(8);

    while !eof!(p) && !p.input_mut().is(&P::Token::RBRACKET) {
        if p.input_mut().is(&P::Token::COMMA) {
            expect!(p, &P::Token::COMMA);
            elems.push(None);
            continue;
        }

        elems.push(p.include_in_expr(true).parse_expr_or_spread().map(Some)?);

        if !p.input_mut().is(&P::Token::RBRACKET) {
            expect!(p, &P::Token::COMMA);
            if p.input_mut().is(&P::Token::RBRACKET) {
                let prev_span = p.input().prev_span();
                p.state_mut().trailing_commas.insert(start, prev_span);
            }
        }
    }

    expect!(p, &P::Token::RBRACKET);

    let span = p.span(start);
    Ok(ArrayLit { span, elems }.into())
}

pub fn at_possible_async<'a, P: Parser<'a>>(p: &P, expr: &Expr) -> PResult<bool> {
    // TODO(kdy1): !this.state.containsEsc &&
    Ok(p.state().potential_arrow_start == Some(expr.span_lo()) && expr.is_ident_ref_to("async"))
}

fn parse_yield_expr<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    let start = p.input_mut().cur_pos();
    p.assert_and_bump(&P::Token::YIELD)?;
    debug_assert!(p.ctx().contains(Context::InGenerator));

    // Spec says
    // YieldExpression cannot be used within the FormalParameters of a generator
    // function because any expressions that are part of FormalParameters are
    // evaluated before the resulting generator object is in a resumable state.
    if p.ctx().contains(Context::InParameters) && !p.ctx().contains(Context::InFunction) {
        syntax_error!(p, p.input().prev_span(), SyntaxError::YieldParamInGen)
    }

    let parse_with_arg = |p: &mut P| {
        let has_star = p.input_mut().eat(&P::Token::MUL);
        let err_span = p.span(start);
        let arg = parse_assignment_expr(p).map_err(|err| {
            Error::new(
                err.span(),
                SyntaxError::WithLabel {
                    inner: Box::new(err),
                    span: err_span,
                    note: "Tried to parse an argument of yield",
                },
            )
        })?;
        Ok(YieldExpr {
            span: p.span(start),
            arg: Some(arg),
            delegate: has_star,
        }
        .into())
    };

    if p.is_general_semi() || {
        let Some(cur) = p.input_mut().cur() else {
            return parse_with_arg(p);
        };
        !cur.is_less()
            && !cur.is_mul()
            && !cur.is_slash()
            && !cur.is_slash_eq()
            && !cur.starts_expr()
    } {
        Ok(YieldExpr {
            span: p.span(start),
            arg: None,
            delegate: false,
        }
        .into())
    } else {
        parse_with_arg(p)
    }
}

fn parse_tpl_elements<'a, P: Parser<'a>>(
    p: &mut P,
    is_tagged_tpl: bool,
) -> PResult<(Vec<Box<Expr>>, Vec<TplElement>)> {
    trace_cur!(p, parse_tpl_elements);

    let mut exprs = Vec::new();

    let cur_elem = p.parse_tpl_element(is_tagged_tpl)?;
    let mut is_tail = cur_elem.tail;
    let mut quasis = vec![cur_elem];

    while !is_tail {
        expect!(p, &P::Token::DOLLAR_LBRACE);
        exprs.push(p.include_in_expr(true).parse_expr()?);
        expect!(p, &P::Token::RBRACE);
        let elem = p.parse_tpl_element(is_tagged_tpl)?;
        is_tail = elem.tail;
        quasis.push(elem);
    }

    Ok((exprs, quasis))
}

pub fn parse_tpl<'a, P: Parser<'a>>(p: &mut P, is_tagged_tpl: bool) -> PResult<Tpl> {
    trace_cur!(p, parse_tpl);
    let start = p.input_mut().cur_pos();

    p.assert_and_bump(&P::Token::BACKQUOTE)?;

    let (exprs, quasis) = parse_tpl_elements(p, is_tagged_tpl)?;

    expect!(p, &P::Token::BACKQUOTE);

    let span = p.span(start);
    Ok(Tpl {
        span,
        exprs,
        quasis,
    })
}

pub fn parse_tagged_tpl<'a, P: Parser<'a>>(
    p: &mut P,
    tag: Box<Expr>,
    type_params: Option<Box<TsTypeParamInstantiation>>,
) -> PResult<TaggedTpl> {
    let tagged_tpl_start = tag.span_lo();
    trace_cur!(p, parse_tagged_tpl);

    let tpl = Box::new(parse_tpl(p, true)?);

    let span = p.span(tagged_tpl_start);

    if tag.is_opt_chain() {
        p.emit_err(span, SyntaxError::TaggedTplInOptChain);
    }

    Ok(TaggedTpl {
        span,
        tag,
        type_params,
        tpl,
        ..Default::default()
    })
}

pub fn parse_lit<'a, P: Parser<'a>>(p: &mut P) -> PResult<Lit> {
    let start = p.cur_pos();
    let cur = cur!(p, true);
    let v = if cur.is_null() {
        p.bump();
        let span = p.span(start);
        Lit::Null(swc_ecma_ast::Null { span })
    } else if cur.is_true() || cur.is_false() {
        let value = cur.is_true();
        p.bump();
        let span = p.span(start);
        Lit::Bool(swc_ecma_ast::Bool { span, value })
    } else if cur.is_str() {
        let t = p.bump();
        let (value, raw) = t.take_str(p.input_mut());
        Lit::Str(swc_ecma_ast::Str {
            span: p.span(start),
            value,
            raw: Some(raw),
        })
    } else if cur.is_num() {
        let t = p.bump();
        let (value, raw) = t.take_num(p.input_mut());
        Lit::Num(swc_ecma_ast::Number {
            span: p.span(start),
            value,
            raw: Some(raw),
        })
    } else if cur.is_bigint() {
        let t = p.bump();
        let (value, raw) = t.take_bigint(p.input_mut());
        Lit::BigInt(swc_ecma_ast::BigInt {
            span: p.span(start),
            value,
            raw: Some(raw),
        })
    } else {
        unreachable!("parse_lit should not be called for {:?}", cur)
    };
    Ok(v)
}

/// Parse `Arguments[Yield, Await]`
#[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
pub fn parse_args<'a, P: Parser<'a>>(
    p: &mut P,
    is_dynamic_import: bool,
) -> PResult<Vec<ExprOrSpread>> {
    trace_cur!(p, parse_args);

    let ctx = p.ctx() & !Context::WillExpectColonForCond;

    p.with_ctx(ctx).parse_with(|p| {
        let start = p.cur_pos();
        expect!(p, &P::Token::LPAREN);

        let mut first = true;
        let mut expr_or_spreads = Vec::with_capacity(2);

        while !eof!(p) && !p.input_mut().is(&P::Token::RPAREN) {
            if first {
                first = false;
            } else {
                expect!(p, &P::Token::COMMA);
                // Handle trailing comma.
                if p.input_mut().is(&P::Token::RPAREN) {
                    if is_dynamic_import && !p.input().syntax().import_attributes() {
                        syntax_error!(p, p.span(start), SyntaxError::TrailingCommaInsideImport)
                    }

                    break;
                }
            }

            expr_or_spreads.push(p.include_in_expr(true).parse_expr_or_spread()?);
        }

        expect!(p, &P::Token::RPAREN);
        Ok(expr_or_spreads)
    })
}

///`parseMaybeAssign` (overridden)
#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub fn parse_assignment_expr<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_assignment_expr);

    if p.input().syntax().typescript() && p.input_mut().is(&P::Token::JSX_TAG_START) {
        // Note: When the JSX plugin is on, type assertions (`<T> x`) aren't valid
        // syntax.

        let cur_context = p.input().token_context().current();
        debug_assert_eq!(cur_context, Some(TokenContext::JSXOpeningTag));
        // Only time j_oTag is pushed is right after j_expr.
        debug_assert_eq!(
            p.input().token_context().0[p.input().token_context().len() - 2],
            TokenContext::JSXExpr
        );

        let res = try_parse_ts(p, |p| parse_assignment_expr_base(p).map(Some));
        if let Some(res) = res {
            return Ok(res);
        } else {
            debug_assert_eq!(
                p.input_mut().token_context().current(),
                Some(TokenContext::JSXOpeningTag)
            );
            p.input_mut().token_context_mut().pop();
            debug_assert_eq!(
                p.input_mut().token_context().current(),
                Some(TokenContext::JSXExpr)
            );
            p.input_mut().token_context_mut().pop();
        }
    }

    parse_assignment_expr_base(p)
}

/// Parse an assignment expression. This includes applications of
/// operators like `+=`.
///
/// `parseMaybeAssign`
#[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
fn parse_assignment_expr_base<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_assignment_expr_base);
    let start = p.input().cur_span();

    if p.input().syntax().typescript()
        && (p
            .input_mut()
            .cur()
            .is_some_and(|cur| cur.is_less() || cur.is_jsx_tag_start()))
        && (peek!(p).is_some_and(|peek| peek.is_word() || peek.is_jsx_name()))
    {
        let ctx = p.ctx() & !Context::WillExpectColonForCond;
        let res = try_parse_ts(p.with_ctx(ctx).deref_mut(), |p| {
            if p.input_mut()
                .cur()
                .is_some_and(|cur| cur.is_jsx_tag_start())
            {
                if let Some(TokenContext::JSXOpeningTag) = p.input_mut().token_context().current() {
                    p.input_mut().token_context_mut().pop();

                    debug_assert_eq!(
                        p.input_mut().token_context().current(),
                        Some(TokenContext::JSXExpr)
                    );
                    p.input_mut().token_context_mut().pop();
                }
            }

            let type_parameters = parse_ts_type_params(p, false, true)?;
            let mut arrow = parse_assignment_expr_base(p)?;
            match *arrow {
                Expr::Arrow(ArrowExpr {
                    ref mut span,
                    ref mut type_params,
                    ..
                }) => {
                    *span = Span::new(type_parameters.span.lo, span.hi);
                    *type_params = Some(type_parameters);
                }
                _ => unexpected!(p, "("),
            }
            Ok(Some(arrow))
        });
        if let Some(res) = res {
            if p.input().syntax().disallow_ambiguous_jsx_like() {
                p.emit_err(start, SyntaxError::ReservedArrowTypeParam);
            }
            return Ok(res);
        }
    }

    if p.ctx().contains(Context::InGenerator) && p.input_mut().is(&P::Token::YIELD) {
        return parse_yield_expr(p);
    }

    let cur = cur!(p, true);
    p.state_mut().potential_arrow_start =
        if cur.is_known_ident() || cur.is_unknown_ident() || cur.is_yield() || cur.is_lparen() {
            Some(p.cur_pos())
        } else {
            None
        };

    let start = p.cur_pos();

    // Try to parse conditional expression.
    let cond = parse_cond_expr(p)?;

    return_if_arrow!(p, cond);

    match *cond {
        // if cond is conditional expression but not left-hand-side expression,
        // just return it.
        Expr::Cond(..) | Expr::Bin(..) | Expr::Unary(..) | Expr::Update(..) => return Ok(cond),
        _ => {}
    }

    finish_assignment_expr(p, start, cond)
}

pub fn finish_assignment_expr<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    cond: Box<Expr>,
) -> PResult<Box<Expr>> {
    trace_cur!(p, finish_assignment_expr);

    if let Some(op) = p.input_mut().cur().and_then(|t| t.as_assign_op()) {
        let left = if op == AssignOp::Assign {
            match AssignTarget::try_from(reparse_expr_as_pat(p, PatType::AssignPat, cond)?) {
                Ok(pat) => pat,
                Err(expr) => {
                    syntax_error!(p, expr.span(), SyntaxError::InvalidAssignTarget)
                }
            }
        } else {
            // It is an early Reference Error if IsValidSimpleAssignmentTarget of
            // LeftHandSideExpression is false.
            if !cond.is_valid_simple_assignment_target(p.ctx().contains(Context::Strict)) {
                if p.input().syntax().typescript() {
                    p.emit_err(cond.span(), SyntaxError::TS2406);
                } else {
                    p.emit_err(cond.span(), SyntaxError::NotSimpleAssign)
                }
            }
            if p.input().syntax().typescript()
                && cond
                    .as_ident()
                    .map(|i| i.is_reserved_in_strict_bind())
                    .unwrap_or(false)
            {
                p.emit_strict_mode_err(cond.span(), SyntaxError::TS1100);
            }

            // TODO
            match AssignTarget::try_from(cond) {
                Ok(v) => v,
                Err(v) => {
                    syntax_error!(p, v.span(), SyntaxError::InvalidAssignTarget);
                }
            }
        };

        p.bump();
        let right = parse_assignment_expr(p)?;
        Ok(AssignExpr {
            span: p.span(start),
            op,
            // TODO:
            left,
            right,
        }
        .into())
    } else {
        Ok(cond)
    }
}

/// Spec: 'ConditionalExpression'
#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
fn parse_cond_expr<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_cond_expr);

    let start = p.cur_pos();

    let test = p.parse_bin_expr()?;
    return_if_arrow!(p, test);

    if p.input_mut().eat(&P::Token::QUESTION) {
        let ctx = p.ctx()
            | Context::InCondExpr
            | Context::WillExpectColonForCond
            | Context::IncludeInExpr;
        let cons = parse_assignment_expr(p.with_ctx(ctx).deref_mut())?;
        expect!(p, &P::Token::COLON);
        let ctx = (p.ctx() | Context::InCondExpr) & !Context::WillExpectColonForCond;
        let alt = parse_assignment_expr(p.with_ctx(ctx).deref_mut())?;
        let span = Span::new(start, alt.span_hi());
        Ok(CondExpr {
            span,
            test,
            cons,
            alt,
        }
        .into())
    } else {
        Ok(test)
    }
}

#[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
pub fn parse_subscripts<'a>(
    p: &mut impl Parser<'a>,
    mut obj: Callee,
    no_call: bool,
    no_computed_member: bool,
) -> PResult<Box<Expr>> {
    let start = obj.span().lo;
    loop {
        obj = match parse_subscript(p, start, obj, no_call, no_computed_member)? {
            (expr, false) => return Ok(expr),
            (expr, true) => Callee::Expr(expr),
        }
    }
}

/// returned bool is true if this method should be called again.
#[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
fn parse_subscript<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    mut obj: Callee,
    no_call: bool,
    no_computed_member: bool,
) -> PResult<(Box<Expr>, bool)> {
    trace_cur!(p, parse_subscript);
    let _ = cur!(p, false);

    if p.input().syntax().typescript() {
        if !p.input_mut().had_line_break_before_cur() && p.input_mut().is(&P::Token::BANG) {
            p.input_mut().set_expr_allowed(false);
            p.assert_and_bump(&P::Token::BANG)?;

            let expr = match obj {
                Callee::Super(..) => {
                    syntax_error!(
                        p,
                        p.input().cur_span(),
                        SyntaxError::TsNonNullAssertionNotAllowed("super".into())
                    )
                }
                Callee::Import(..) => {
                    syntax_error!(
                        p,
                        p.input().cur_span(),
                        SyntaxError::TsNonNullAssertionNotAllowed("import".into())
                    )
                }
                Callee::Expr(expr) => expr,
            };
            return Ok((
                TsNonNullExpr {
                    span: p.span(start),
                    expr,
                }
                .into(),
                true,
            ));
        }

        if matches!(obj, Callee::Expr(..)) && p.input_mut().is(&P::Token::LESS) {
            let is_dynamic_import = obj.is_import();

            let mut obj_opt = Some(obj);
            // tsTryParseAndCatch is expensive, so avoid if not necessary.
            // There are number of things we are going to "maybe" parse, like type arguments
            // on tagged template expressions. If any of them fail, walk it back and
            // continue.

            let mut_obj_opt = &mut obj_opt;

            let ctx = p.ctx() | Context::ShouldNotLexLtOrGtAsType;
            let result = try_parse_ts(p.with_ctx(ctx).deref_mut(), |p| {
                if !no_call
                    && at_possible_async(
                        p,
                        match &mut_obj_opt {
                            Some(Callee::Expr(ref expr)) => expr,
                            _ => unreachable!(),
                        },
                    )?
                {
                    // Almost certainly this is a generic async function `async <T>() => ...
                    // But it might be a call with a type argument `async<T>();`
                    let async_arrow_fn = p.try_parse_ts_generic_async_arrow_fn(start)?;
                    if let Some(async_arrow_fn) = async_arrow_fn {
                        return Ok(Some((async_arrow_fn.into(), true)));
                    }
                }

                let type_args = parse_ts_type_args(p)?;

                if !no_call && p.input_mut().is(&P::Token::LPAREN) {
                    // possibleAsync always false here, because we would have handled it
                    // above. (won't be any undefined arguments)
                    let args = parse_args(p, is_dynamic_import)?;

                    let obj = mut_obj_opt.take().unwrap();

                    if let Callee::Expr(callee) = &obj {
                        if let Expr::OptChain(..) = &**callee {
                            return Ok(Some((
                                OptChainExpr {
                                    span: p.span(start),
                                    base: Box::new(OptChainBase::Call(OptCall {
                                        span: p.span(start),
                                        callee: obj.expect_expr(),
                                        type_args: Some(type_args),
                                        args,
                                        ..Default::default()
                                    })),
                                    optional: false,
                                }
                                .into(),
                                true,
                            )));
                        }
                    }

                    Ok(Some((
                        CallExpr {
                            span: p.span(start),
                            callee: obj,
                            type_args: Some(type_args),
                            args,
                            ..Default::default()
                        }
                        .into(),
                        true,
                    )))
                } else if p.input_mut().is(&P::Token::BACKQUOTE) {
                    parse_tagged_tpl(
                        p,
                        match mut_obj_opt {
                            Some(Callee::Expr(obj)) => obj.take(),
                            _ => unreachable!(),
                        },
                        Some(type_args),
                    )
                    .map(|expr| (expr.into(), true))
                    .map(Some)
                } else if p
                    .input_mut()
                    .cur()
                    .is_some_and(|cur| cur.is_equal() || cur.is_as() || cur.is_satisfies())
                {
                    Ok(Some((
                        TsInstantiation {
                            span: p.span(start),
                            expr: match mut_obj_opt {
                                Some(Callee::Expr(obj)) => obj.take(),
                                _ => unreachable!(),
                            },
                            type_args,
                        }
                        .into(),
                        false,
                    )))
                } else if no_call {
                    unexpected!(p, "`")
                } else {
                    unexpected!(p, "( or `")
                }
            });
            if let Some(result) = result {
                return Ok(result);
            }

            obj = obj_opt.unwrap();
        }
    }

    let type_args = if p.syntax().typescript() && p.input_mut().is(&P::Token::LESS) {
        try_parse_ts_type_args(p)
    } else {
        None
    };

    if obj.is_import()
        && !p
            .input_mut()
            .cur()
            .is_some_and(|cur| cur.is_dot() || cur.is_lparen())
    {
        unexpected!(p, "`.` or `(`")
    }

    let question_dot_token =
        if p.input_mut().is(&P::Token::QUESTION) && peek!(p).is_some_and(|peek| peek.is_dot()) {
            let start = p.cur_pos();
            p.input_mut().eat(&P::Token::QUESTION);
            Some(p.span(start))
        } else {
            None
        };

    // $obj[name()]
    if !no_computed_member
        && ((question_dot_token.is_some()
            && p.input_mut().is(&P::Token::DOT)
            && peek!(p).is_some_and(|peek| peek.is_lbracket())
            && p.input_mut().eat(&P::Token::DOT)
            && p.input_mut().eat(&P::Token::LBRACKET))
            || p.input_mut().eat(&P::Token::LBRACKET))
    {
        let bracket_lo = p.input().prev_span().lo;
        let prop = p.include_in_expr(true).parse_expr()?;
        expect!(p, &P::Token::RBRACKET);
        let span = Span::new(obj.span_lo(), p.input().last_pos());
        debug_assert_eq!(obj.span_lo(), span.lo());
        let prop = ComputedPropName {
            span: Span::new(bracket_lo, p.input().last_pos()),
            expr: prop,
        };

        let type_args = if p.syntax().typescript() && p.input_mut().is(&P::Token::LESS) {
            try_parse_ts_type_args(p)
        } else {
            None
        };

        return Ok((
            Box::new(match obj {
                Callee::Import(..) => unreachable!(),
                Callee::Super(obj) => {
                    if !p.ctx().contains(Context::AllowDirectSuper)
                        && !p.input().syntax().allow_super_outside_method()
                    {
                        syntax_error!(p, p.input().cur_span(), SyntaxError::InvalidSuper);
                    } else if question_dot_token.is_some() {
                        if no_call {
                            syntax_error!(p, p.input().cur_span(), SyntaxError::InvalidSuperCall);
                        }
                        syntax_error!(p, p.input().cur_span(), SyntaxError::InvalidSuper);
                    } else {
                        SuperPropExpr {
                            span,
                            obj,
                            prop: SuperProp::Computed(prop),
                        }
                        .into()
                    }
                }
                Callee::Expr(obj) => {
                    let is_opt_chain = unwrap_ts_non_null(&obj).is_opt_chain();
                    let expr = MemberExpr {
                        span,
                        obj,
                        prop: MemberProp::Computed(prop),
                    };
                    let expr = if is_opt_chain || question_dot_token.is_some() {
                        OptChainExpr {
                            span,
                            optional: question_dot_token.is_some(),
                            base: Box::new(OptChainBase::Member(expr)),
                        }
                        .into()
                    } else {
                        expr.into()
                    };

                    if let Some(type_args) = type_args {
                        TsInstantiation {
                            expr: Box::new(expr),
                            type_args,
                            span: p.span(start),
                        }
                        .into()
                    } else {
                        expr
                    }
                }
            }),
            true,
        ));
    }

    if (question_dot_token.is_some()
        && p.input_mut().is(&P::Token::DOT)
        && (peek!(p).is_some_and(|peek| peek.is_lparen())
            || (p.syntax().typescript() && peek!(p).is_some_and(|peek| peek.is_less())))
        && p.input_mut().eat(&P::Token::DOT))
        || (!no_call && p.input_mut().is(&P::Token::LPAREN))
    {
        let type_args = if p.syntax().typescript() && p.input_mut().is(&P::Token::LESS) {
            parse_ts_type_args(p).map(Some)?
        } else {
            None
        };
        let args = parse_args(p, obj.is_import())?;
        let span = p.span(start);
        return if question_dot_token.is_some()
            || match &obj {
                Callee::Expr(obj) => unwrap_ts_non_null(obj).is_opt_chain(),
                _ => false,
            } {
            match obj {
                Callee::Super(_) | Callee::Import(_) => {
                    syntax_error!(p, p.input().cur_span(), SyntaxError::SuperCallOptional)
                }
                Callee::Expr(callee) => Ok((
                    OptChainExpr {
                        span,
                        optional: question_dot_token.is_some(),
                        base: Box::new(OptChainBase::Call(OptCall {
                            span: p.span(start),
                            callee,
                            args,
                            type_args,
                            ..Default::default()
                        })),
                    }
                    .into(),
                    true,
                )),
            }
        } else {
            Ok((
                CallExpr {
                    span: p.span(start),
                    callee: obj,
                    args,
                    ..Default::default()
                }
                .into(),
                true,
            ))
        };
    }

    // member expression
    // $obj.name
    if p.input_mut().eat(&P::Token::DOT) {
        let prop = parse_maybe_private_name(p).map(|e| match e {
            Either::Left(p) => MemberProp::PrivateName(p),
            Either::Right(i) => MemberProp::Ident(i),
        })?;
        let span = p.span(obj.span_lo());
        debug_assert_eq!(obj.span_lo(), span.lo());
        debug_assert_eq!(prop.span_hi(), span.hi());

        let type_args = if p.syntax().typescript() && p.input_mut().is(&P::Token::LESS) {
            try_parse_ts_type_args(p)
        } else {
            None
        };

        return Ok((
            Box::new(match obj {
                callee @ Callee::Import(_) => match prop {
                    MemberProp::Ident(IdentName { sym, .. }) => {
                        if !p.ctx().contains(Context::CanBeModule) {
                            let span = p.span(start);
                            p.emit_err(span, SyntaxError::ImportMetaInScript);
                        }
                        match &*sym {
                            "meta" => MetaPropExpr {
                                span,
                                kind: MetaPropKind::ImportMeta,
                            }
                            .into(),
                            _ => {
                                let args = parse_args(p, true)?;

                                CallExpr {
                                    span,
                                    callee,
                                    args,
                                    type_args: None,
                                    ..Default::default()
                                }
                                .into()
                            }
                        }
                    }
                    _ => {
                        unexpected!(p, "meta");
                    }
                },
                Callee::Super(obj) => {
                    if !p.ctx().contains(Context::AllowDirectSuper)
                        && !p.input().syntax().allow_super_outside_method()
                    {
                        syntax_error!(p, p.input().cur_span(), SyntaxError::InvalidSuper);
                    } else if question_dot_token.is_some() {
                        if no_call {
                            syntax_error!(p, p.input().cur_span(), SyntaxError::InvalidSuperCall);
                        }
                        syntax_error!(p, p.input().cur_span(), SyntaxError::InvalidSuper);
                    } else {
                        match prop {
                            MemberProp::Ident(ident) => SuperPropExpr {
                                span,
                                obj,
                                prop: SuperProp::Ident(ident),
                            }
                            .into(),
                            MemberProp::PrivateName(..) => {
                                syntax_error!(
                                    p,
                                    p.input().cur_span(),
                                    SyntaxError::InvalidSuperCall
                                )
                            }
                            MemberProp::Computed(..) => unreachable!(),
                        }
                    }
                }
                Callee::Expr(obj) => {
                    let expr = MemberExpr { span, obj, prop };
                    let expr = if unwrap_ts_non_null(&expr.obj).is_opt_chain()
                        || question_dot_token.is_some()
                    {
                        OptChainExpr {
                            span: p.span(start),
                            optional: question_dot_token.is_some(),
                            base: Box::new(OptChainBase::Member(expr)),
                        }
                        .into()
                    } else {
                        expr.into()
                    };
                    if let Some(type_args) = type_args {
                        TsInstantiation {
                            expr: Box::new(expr),
                            type_args,
                            span: p.span(start),
                        }
                        .into()
                    } else {
                        expr
                    }
                }
            }),
            true,
        ));
    }

    match obj {
        Callee::Expr(expr) => {
            let expr = if let Some(type_args) = type_args {
                TsInstantiation {
                    expr,
                    type_args,
                    span: p.span(start),
                }
                .into()
            } else {
                expr
            };

            // MemberExpression[?Yield, ?Await] TemplateLiteral[?Yield, ?Await, +Tagged]
            if p.input_mut().is(&P::Token::BACKQUOTE) {
                let ctx = p.ctx() & !Context::WillExpectColonForCond;
                let tpl = parse_tagged_tpl(p.with_ctx(ctx).deref_mut(), expr, None)?;
                return Ok((tpl.into(), true));
            }

            Ok((expr, false))
        }
        Callee::Super(..) => {
            if no_call {
                syntax_error!(p, p.input().cur_span(), SyntaxError::InvalidSuperCall);
            }
            syntax_error!(p, p.input().cur_span(), SyntaxError::InvalidSuper);
        }
        Callee::Import(..) => {
            syntax_error!(p, p.input().cur_span(), SyntaxError::InvalidImport);
        }
    }
}

pub fn parse_dynamic_import_or_import_meta<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    no_call: bool,
) -> PResult<Box<Expr>> {
    if p.input_mut().eat(&P::Token::DOT) {
        p.mark_found_module_item();

        let ident = parse_ident_name(p)?;

        match &*ident.sym {
            "meta" => {
                let span = p.span(start);
                if !p.ctx().contains(Context::CanBeModule) {
                    p.emit_err(span, SyntaxError::ImportMetaInScript);
                }
                let expr = MetaPropExpr {
                    span,
                    kind: MetaPropKind::ImportMeta,
                };
                parse_subscripts(p, Callee::Expr(expr.into()), no_call, false)
            }
            "source" => parse_dynamic_import_call(p, start, no_call, ImportPhase::Source),
            // TODO: The proposal doesn't mention import.defer yet because it was
            // pending on a decision for import.source. Wait to enable it until it's
            // included in the proposal.
            _ => unexpected!(p, "meta"),
        }
    } else {
        parse_dynamic_import_call(p, start, no_call, ImportPhase::Evaluation)
    }
}

fn parse_dynamic_import_call<'a>(
    p: &mut impl Parser<'a>,
    start: BytePos,
    no_call: bool,
    phase: ImportPhase,
) -> PResult<Box<Expr>> {
    let import = Callee::Import(Import {
        span: p.span(start),
        phase,
    });

    parse_subscripts(p, import, no_call, false)
}
