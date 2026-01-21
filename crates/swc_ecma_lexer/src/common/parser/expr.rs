use either::Either;
use rustc_hash::FxHashMap;
use swc_atoms::atom;
use swc_common::{util::take::Take, BytePos, Span, Spanned};
use swc_ecma_ast::*;

use super::{
    assign_target_or_spread::AssignTargetOrSpread, buffer::Buffer, ident::parse_ident_name,
    PResult, Parser,
};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            class_and_fn::{
                parse_async_fn_expr, parse_class_expr, parse_decorators,
                parse_fn_block_or_expr_body, parse_fn_expr,
            },
            eof_error,
            expr_ext::ExprExt,
            ident::{parse_binding_ident, parse_ident, parse_maybe_private_name},
            is_simple_param_list::IsSimpleParameterList,
            jsx::{parse_jsx_element, parse_jsx_text},
            object::parse_object_expr,
            pat::{parse_paren_items_as_params, reparse_expr_as_pat},
            pat_type::PatType,
            token_and_span::TokenAndSpan,
            typescript::*,
            unwrap_ts_non_null,
        },
    },
    error::{Error, SyntaxError},
    TokenContext,
};

pub(super) fn is_start_of_left_hand_side_expr<'a>(p: &mut impl Parser<'a>) -> bool {
    let cur = p.input().cur();
    cur.is_this()
        || cur.is_null()
        || cur.is_super()
        || cur.is_true()
        || cur.is_false()
        || cur.is_num()
        || cur.is_bigint()
        || cur.is_str()
        || cur.is_no_substitution_template_literal()
        || cur.is_template_head()
        || cur.is_lparen()
        || cur.is_lbrace()
        || cur.is_lbracket()
        || cur.is_function()
        || cur.is_class()
        || cur.is_new()
        || cur.is_regexp()
        || cur.is_import()
        || cur.is_ident_ref(p.ctx())
        || cur.is_backquote() && {
            peek!(p).is_some_and(|peek| peek.is_lparen() || peek.is_less() || peek.is_dot())
        }
}

#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub fn parse_array_lit<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_array_lit);

    let start = p.input().cur_pos();

    p.assert_and_bump(&P::Token::LBRACKET);

    let mut elems = Vec::with_capacity(8);

    while !p.input().is(&P::Token::RBRACKET) {
        if p.input().is(&P::Token::COMMA) {
            expect!(p, &P::Token::COMMA);
            elems.push(None);
            continue;
        }

        elems.push(p.allow_in_expr(|p| p.parse_expr_or_spread()).map(Some)?);

        if !p.input().is(&P::Token::RBRACKET) {
            expect!(p, &P::Token::COMMA);
            if p.input().is(&P::Token::RBRACKET) {
                let prev_span = p.input().prev_span();
                p.state_mut().trailing_commas.insert(start, prev_span);
            }
        }
    }

    expect!(p, &P::Token::RBRACKET);

    let span = p.span(start);
    Ok(ArrayLit { span, elems }.into())
}

pub fn at_possible_async<'a, P: Parser<'a>>(p: &P, expr: &Expr) -> bool {
    // TODO(kdy1): !this.state.containsEsc &&
    p.state().potential_arrow_start == Some(expr.span_lo()) && expr.is_ident_ref_to("async")
}

fn parse_yield_expr<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    let start = p.input().cur_pos();
    p.assert_and_bump(&P::Token::YIELD);
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
        let cur = p.input().cur();
        !cur.is_less()
            && !cur.is_star()
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
        exprs.push(p.allow_in_expr(|p| p.parse_expr())?);
        expect!(p, &P::Token::RBRACE);
        let elem = p.parse_tpl_element(is_tagged_tpl)?;
        is_tail = elem.tail;
        quasis.push(elem);
    }

    Ok((exprs, quasis))
}

fn parse_tpl<'a, P: Parser<'a>>(p: &mut P, is_tagged_tpl: bool) -> PResult<Tpl> {
    trace_cur!(p, parse_tpl);
    let start = p.input().cur_pos();

    p.assert_and_bump(&P::Token::BACKQUOTE);

    let (exprs, quasis) = parse_tpl_elements(p, is_tagged_tpl)?;

    expect!(p, &P::Token::BACKQUOTE);

    let span = p.span(start);
    Ok(Tpl {
        span,
        exprs,
        quasis,
    })
}

pub(crate) fn parse_tagged_tpl<'a, P: Parser<'a>>(
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

pub fn parse_str_lit<'a>(p: &mut impl Parser<'a>) -> swc_ecma_ast::Str {
    debug_assert!(p.input().cur().is_str());
    let token_and_span = p.input().get_cur();
    let start = token_and_span.span().lo;
    let (value, raw) = p.input_mut().expect_string_token_and_bump();
    swc_ecma_ast::Str {
        span: p.span(start),
        value,
        raw: Some(raw),
    }
}

pub fn parse_lit<'a, P: Parser<'a>>(p: &mut P) -> PResult<Lit> {
    let token_and_span = p.input().get_cur();
    let start = token_and_span.span().lo;
    let cur = token_and_span.token();
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
        Lit::Str(parse_str_lit(p))
    } else if cur.is_num() {
        let (value, raw) = p.input_mut().expect_number_token_and_bump();
        Lit::Num(swc_ecma_ast::Number {
            span: p.span(start),
            value,
            raw: Some(raw),
        })
    } else if cur.is_bigint() {
        let (value, raw) = p.input_mut().expect_bigint_token_and_bump();
        Lit::BigInt(swc_ecma_ast::BigInt {
            span: p.span(start),
            value,
            raw: Some(raw),
        })
    } else if cur.is_error() {
        let err = p.input_mut().expect_error_token_and_bump();
        return Err(err);
    } else if cur.is_eof() {
        return Err(eof_error(p));
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

    p.do_outside_of_context(Context::WillExpectColonForCond, |p| {
        let start = p.cur_pos();
        expect!(p, &P::Token::LPAREN);

        let mut first = true;
        let mut expr_or_spreads = Vec::with_capacity(2);

        while !p.input().is(&P::Token::RPAREN) {
            if first {
                first = false;
            } else {
                expect!(p, &P::Token::COMMA);
                // Handle trailing comma.
                if p.input().is(&P::Token::RPAREN) {
                    if is_dynamic_import && !p.input().syntax().import_attributes() {
                        syntax_error!(p, p.span(start), SyntaxError::TrailingCommaInsideImport)
                    }

                    break;
                }
            }

            expr_or_spreads.push(p.allow_in_expr(|p| p.parse_expr_or_spread())?);
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

    if p.input().syntax().typescript() && p.input().is(&P::Token::JSX_TAG_START) {
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
        && (p.input().cur().is_less() || p.input().cur().is_jsx_tag_start())
        && (peek!(p).is_some_and(|peek| peek.is_word() || peek.is_jsx_name()))
    {
        let res = p.do_outside_of_context(Context::WillExpectColonForCond, |p| {
            try_parse_ts(p, |p| {
                if p.input().cur().is_jsx_tag_start() {
                    if let Some(TokenContext::JSXOpeningTag) =
                        p.input_mut().token_context().current()
                    {
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
                        *span = Span::new_with_checked(type_parameters.span.lo, span.hi);
                        *type_params = Some(type_parameters);
                    }
                    _ => unexpected!(p, "("),
                }
                Ok(Some(arrow))
            })
        });
        if let Some(res) = res {
            if p.input().syntax().disallow_ambiguous_jsx_like() {
                p.emit_err(start, SyntaxError::ReservedArrowTypeParam);
            }
            return Ok(res);
        }
    }

    if p.ctx().contains(Context::InGenerator) && p.input().is(&P::Token::YIELD) {
        return parse_yield_expr(p);
    }

    let cur = p.input().cur();

    if cur.is_error() {
        let err = p.input_mut().expect_error_token_and_bump();
        return Err(err);
    }

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

    if let Some(op) = p.input().cur().as_assign_op() {
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

    let test = parse_bin_expr(p)?;
    return_if_arrow!(p, test);

    if p.input_mut().eat(&P::Token::QUESTION) {
        let cons = p.do_inside_of_context(
            Context::InCondExpr
                .union(Context::WillExpectColonForCond)
                .union(Context::IncludeInExpr),
            parse_assignment_expr,
        )?;

        expect!(p, &P::Token::COLON);

        let alt = p.do_inside_of_context(Context::InCondExpr, |p| {
            p.do_outside_of_context(Context::WillExpectColonForCond, parse_assignment_expr)
        })?;

        let span = Span::new_with_checked(start, alt.span_hi());
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

    if p.input().syntax().typescript() {
        if !p.input().had_line_break_before_cur() && p.input().is(&P::Token::BANG) {
            p.input_mut().set_expr_allowed(false);
            p.assert_and_bump(&P::Token::BANG);

            let expr = match obj {
                Callee::Super(..) => {
                    syntax_error!(
                        p,
                        p.input().cur_span(),
                        SyntaxError::TsNonNullAssertionNotAllowed(atom!("super"))
                    )
                }
                Callee::Import(..) => {
                    syntax_error!(
                        p,
                        p.input().cur_span(),
                        SyntaxError::TsNonNullAssertionNotAllowed(atom!("import"))
                    )
                }
                Callee::Expr(expr) => expr,
                #[cfg(swc_ast_unknown)]
                _ => unreachable!(),
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

        if matches!(obj, Callee::Expr(..)) && p.input().is(&P::Token::LESS) {
            let is_dynamic_import = obj.is_import();

            let mut obj_opt = Some(obj);
            // tsTryParseAndCatch is expensive, so avoid if not necessary.
            // There are number of things we are going to "maybe" parse, like type arguments
            // on tagged template expressions. If any of them fail, walk it back and
            // continue.

            let mut_obj_opt = &mut obj_opt;

            let result = p.do_inside_of_context(Context::ShouldNotLexLtOrGtAsType, |p| {
                try_parse_ts(p, |p| {
                    if !no_call
                        && at_possible_async(
                            p,
                            match &mut_obj_opt {
                                Some(Callee::Expr(ref expr)) => expr,
                                _ => unreachable!(),
                            },
                        )
                    {
                        // Almost certainly this is a generic async function `async <T>() => ...
                        // But it might be a call with a type argument `async<T>();`
                        let async_arrow_fn = try_parse_ts_generic_async_arrow_fn(p, start)?;
                        if let Some(async_arrow_fn) = async_arrow_fn {
                            return Ok(Some((async_arrow_fn.into(), true)));
                        }
                    }

                    let type_args = parse_ts_type_args(p)?;
                    p.assert_and_bump(&P::Token::GREATER);
                    let cur = p.input().cur();

                    if !no_call && cur.is_lparen() {
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
                    } else if cur.is_no_substitution_template_literal()
                        || cur.is_template_head()
                        || cur.is_backquote()
                    {
                        p.parse_tagged_tpl(
                            match mut_obj_opt {
                                Some(Callee::Expr(obj)) => obj.take(),
                                _ => unreachable!(),
                            },
                            Some(type_args),
                        )
                        .map(|expr| (expr.into(), true))
                        .map(Some)
                    } else if cur.is_equal() || cur.is_as() || cur.is_satisfies() {
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
                })
            });
            if let Some(result) = result {
                return Ok(result);
            }

            obj = obj_opt.unwrap();
        }
    }

    let type_args = if p.syntax().typescript() && p.input().is(&P::Token::LESS) {
        try_parse_ts_type_args(p)
    } else {
        None
    };

    let cur = p.input().cur();

    if obj.is_import() && !(cur.is_dot() || cur.is_lparen()) {
        unexpected!(p, "`.` or `(`")
    }

    let question_dot_token =
        if p.input().is(&P::Token::QUESTION) && peek!(p).is_some_and(|peek| peek.is_dot()) {
            let start = p.cur_pos();
            expect!(p, &P::Token::QUESTION);
            Some(p.span(start))
        } else {
            None
        };

    // $obj[name()]
    if !no_computed_member
        && ((question_dot_token.is_some()
            && p.input().is(&P::Token::DOT)
            && peek!(p).is_some_and(|peek| peek.is_lbracket())
            && p.input_mut().eat(&P::Token::DOT)
            && p.input_mut().eat(&P::Token::LBRACKET))
            || p.input_mut().eat(&P::Token::LBRACKET))
    {
        let bracket_lo = p.input().prev_span().lo;
        let prop = p.allow_in_expr(|p| p.parse_expr())?;
        expect!(p, &P::Token::RBRACKET);
        let span = Span::new_with_checked(obj.span_lo(), p.input().last_pos());
        debug_assert_eq!(obj.span_lo(), span.lo());
        let prop = ComputedPropName {
            span: Span::new_with_checked(bracket_lo, p.input().last_pos()),
            expr: prop,
        };

        let type_args = if p.syntax().typescript() && p.input().is(&P::Token::LESS) {
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
                        syntax_error!(p, obj.span, SyntaxError::InvalidSuper);
                    } else if question_dot_token.is_some() {
                        if no_call {
                            syntax_error!(p, obj.span, SyntaxError::InvalidSuperCall);
                        } else {
                            syntax_error!(p, obj.span, SyntaxError::InvalidSuper);
                        }
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
                #[cfg(swc_ast_unknown)]
                _ => unreachable!(),
            }),
            true,
        ));
    }

    if (question_dot_token.is_some()
        && p.input().is(&P::Token::DOT)
        && (peek!(p).is_some_and(|peek| peek.is_lparen())
            || (p.syntax().typescript() && peek!(p).is_some_and(|peek| peek.is_less())))
        && p.input_mut().eat(&P::Token::DOT))
        || (!no_call && p.input().is(&P::Token::LPAREN))
    {
        let type_args = if p.syntax().typescript() && p.input().is(&P::Token::LESS) {
            let ret = parse_ts_type_args(p)?;
            p.assert_and_bump(&P::Token::GREATER);
            Some(ret)
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
                #[cfg(swc_ast_unknown)]
                _ => unreachable!(),
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

        let type_args = if p.syntax().typescript() && p.input().is(&P::Token::LESS) {
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
                        syntax_error!(p, obj.span, SyntaxError::InvalidSuper);
                    } else if question_dot_token.is_some() {
                        if no_call {
                            syntax_error!(p, obj.span, SyntaxError::InvalidSuperCall);
                        } else {
                            syntax_error!(p, obj.span, SyntaxError::InvalidSuper);
                        }
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
                            #[cfg(swc_ast_unknown)]
                            _ => unreachable!(),
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
                #[cfg(swc_ast_unknown)]
                _ => unreachable!(),
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
            let cur = p.input().cur();
            if cur.is_template_head()
                || cur.is_no_substitution_template_literal()
                || cur.is_backquote()
            {
                let tpl = p.do_outside_of_context(Context::WillExpectColonForCond, |p| {
                    p.parse_tagged_tpl(expr, None)
                })?;
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
        #[cfg(swc_ast_unknown)]
        _ => unreachable!(),
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
            "defer" => parse_dynamic_import_call(p, start, no_call, ImportPhase::Defer),
            "source" => parse_dynamic_import_call(p, start, no_call, ImportPhase::Source),
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

/// `is_new_expr`: true iff we are parsing production 'NewExpression'.
#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub fn parse_member_expr_or_new_expr<'a>(
    p: &mut impl Parser<'a>,
    is_new_expr: bool,
) -> PResult<Box<Expr>> {
    p.do_inside_of_context(Context::ShouldNotLexLtOrGtAsType, |p| {
        parse_member_expr_or_new_expr_inner(p, is_new_expr)
    })
}

fn parse_member_expr_or_new_expr_inner<'a, P: Parser<'a>>(
    p: &mut P,
    is_new_expr: bool,
) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_member_expr_or_new_expr);

    let start = p.cur_pos();
    if p.input_mut().eat(&P::Token::NEW) {
        if p.input_mut().eat(&P::Token::DOT) {
            if p.input_mut().eat(&P::Token::TARGET) {
                let span = p.span(start);
                let expr = MetaPropExpr {
                    span,
                    kind: MetaPropKind::NewTarget,
                }
                .into();

                let ctx = p.ctx();
                if !ctx.contains(Context::InsideNonArrowFunctionScope)
                    && !ctx.contains(Context::InParameters)
                    && !ctx.contains(Context::InClass)
                {
                    p.emit_err(span, SyntaxError::InvalidNewTarget);
                }

                return parse_subscripts(p, Callee::Expr(expr), true, false);
            }

            unexpected!(p, "target")
        }

        // 'NewExpression' allows new call without paren.
        let callee = parse_member_expr_or_new_expr(p, is_new_expr)?;
        return_if_arrow!(p, callee);

        if is_new_expr {
            match *callee {
                Expr::OptChain(OptChainExpr {
                    span,
                    optional: true,
                    ..
                }) => {
                    syntax_error!(p, span, SyntaxError::OptChainCannotFollowConstructorCall)
                }
                Expr::Member(MemberExpr { ref obj, .. }) => {
                    if let Expr::OptChain(OptChainExpr {
                        span,
                        optional: true,
                        ..
                    }) = **obj
                    {
                        syntax_error!(p, span, SyntaxError::OptChainCannotFollowConstructorCall)
                    }
                }
                _ => {}
            }
        }

        let type_args = if p.input().syntax().typescript() && {
            let cur = p.input().cur();
            cur.is_less() || cur.is_lshift()
        } {
            try_parse_ts(p, |p| {
                let args =
                    p.do_outside_of_context(Context::ShouldNotLexLtOrGtAsType, parse_ts_type_args)?;
                p.assert_and_bump(&P::Token::GREATER);
                if !p.input().is(&P::Token::LPAREN) {
                    let span = p.input().cur_span();
                    let cur = p.input_mut().dump_cur();
                    syntax_error!(p, span, SyntaxError::Expected('('.to_string(), cur))
                }
                Ok(Some(args))
            })
        } else {
            None
        };

        if !is_new_expr || p.input().is(&P::Token::LPAREN) {
            // Parsed with 'MemberExpression' production.
            let args = parse_args(p, false).map(Some)?;

            let new_expr = Callee::Expr(
                NewExpr {
                    span: p.span(start),
                    callee,
                    args,
                    type_args,
                    ..Default::default()
                }
                .into(),
            );

            // We should parse subscripts for MemberExpression.
            // Because it's left recursive.
            return parse_subscripts(p, new_expr, true, false);
        }

        // Parsed with 'NewExpression' production.

        return Ok(NewExpr {
            span: p.span(start),
            callee,
            args: None,
            type_args,
            ..Default::default()
        }
        .into());
    }

    if p.input_mut().eat(&P::Token::SUPER) {
        let base = Callee::Super(Super {
            span: p.span(start),
        });
        return parse_subscripts(p, base, true, false);
    } else if p.input_mut().eat(&P::Token::IMPORT) {
        return parse_dynamic_import_or_import_meta(p, start, true);
    }
    let obj = p.parse_primary_expr()?;
    return_if_arrow!(p, obj);

    let type_args = if p.syntax().typescript() && p.input().is(&P::Token::LESS) {
        try_parse_ts_type_args(p)
    } else {
        None
    };
    let obj = if let Some(type_args) = type_args {
        trace_cur!(p, parse_member_expr_or_new_expr__with_type_args);
        TsInstantiation {
            expr: obj,
            type_args,
            span: p.span(start),
        }
        .into()
    } else {
        obj
    };

    parse_subscripts(p, Callee::Expr(obj), true, false)
}

/// Parse `NewExpression`.
/// This includes `MemberExpression`.
#[cfg_attr(feature = "tracing-spans", tracing::instrument(skip_all))]
pub fn parse_new_expr<'a>(p: &mut impl Parser<'a>) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_new_expr);
    parse_member_expr_or_new_expr(p, true)
}

/// Name from spec: 'LogicalORExpression'
pub fn parse_bin_expr<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_bin_expr);

    let left = match p.parse_unary_expr() {
        Ok(v) => v,
        Err(err) => {
            trace_cur!(p, parse_bin_expr__recovery_unary_err);

            let cur = p.input().cur();
            if cur.is_error() {
                let err = p.input_mut().expect_error_token_and_bump();
                return Err(err);
            } else if (cur.is_in() && p.ctx().contains(Context::IncludeInExpr))
                || cur.is_instanceof()
                || cur.is_bin_op()
            {
                p.emit_err(p.input().cur_span(), SyntaxError::TS1109);
                Invalid { span: err.span() }.into()
            } else {
                return Err(err);
            }
        }
    };

    return_if_arrow!(p, left);
    parse_bin_op_recursively(p, left, 0)
}

/// Parse binary operators with the operator precedence parsing
/// algorithm. `left` is the left-hand side of the operator.
/// `minPrec` provides context that allows the function to stop and
/// defer further parser to one of its callers when it encounters an
/// operator that has a lower precedence than the set it is parsing.
///
/// `parseExprOp`
pub fn parse_bin_op_recursively<'a>(
    p: &mut impl Parser<'a>,
    mut left: Box<Expr>,
    mut min_prec: u8,
) -> PResult<Box<Expr>> {
    loop {
        let (next_left, next_prec) = parse_bin_op_recursively_inner(p, left, min_prec)?;

        match &*next_left {
            Expr::Bin(BinExpr {
                span,
                left,
                op: op!("&&"),
                ..
            })
            | Expr::Bin(BinExpr {
                span,
                left,
                op: op!("||"),
                ..
            }) => {
                if let Expr::Bin(BinExpr { op: op!("??"), .. }) = &**left {
                    p.emit_err(*span, SyntaxError::NullishCoalescingWithLogicalOp);
                }
            }
            _ => {}
        }

        min_prec = match next_prec {
            Some(v) => v,
            None => return Ok(next_left),
        };

        left = next_left;
    }
}

/// Returns `(left, Some(next_prec))` or `(expr, None)`.
fn parse_bin_op_recursively_inner<'a, P: Parser<'a>>(
    p: &mut P,
    left: Box<Expr>,
    min_prec: u8,
) -> PResult<(Box<Expr>, Option<u8>)> {
    const PREC_OF_IN: u8 = 7;

    if p.input().syntax().typescript() && !p.input().had_line_break_before_cur() {
        if PREC_OF_IN > min_prec && p.input().is(&P::Token::AS) {
            let start = left.span_lo();
            let expr = left;
            let node = if peek!(p).is_some_and(|cur| cur.is_const()) {
                p.bump(); // as
                p.bump(); // const
                TsConstAssertion {
                    span: p.span(start),
                    expr,
                }
                .into()
            } else {
                let type_ann = next_then_parse_ts_type(p)?;
                TsAsExpr {
                    span: p.span(start),
                    expr,
                    type_ann,
                }
                .into()
            };

            return parse_bin_op_recursively_inner(p, node, min_prec);
        } else if p.input().is(&P::Token::SATISFIES) {
            let start = left.span_lo();
            let expr = left;
            let node = {
                let type_ann = next_then_parse_ts_type(p)?;
                TsSatisfiesExpr {
                    span: p.span(start),
                    expr,
                    type_ann,
                }
                .into()
            };

            return parse_bin_op_recursively_inner(p, node, min_prec);
        }
    }

    // Return left on eof
    let cur = p.input().cur();
    let op = if cur.is_in() && p.ctx().contains(Context::IncludeInExpr) {
        op!("in")
    } else if cur.is_instanceof() {
        op!("instanceof")
    } else if let Some(op) = cur.as_bin_op() {
        op
    } else {
        return Ok((left, None));
    };

    if op.precedence() <= min_prec {
        if cfg!(feature = "debug") {
            tracing::trace!(
                "returning {:?} without parsing {:?} because min_prec={}, prec={}",
                left,
                op,
                min_prec,
                op.precedence()
            );
        }

        return Ok((left, None));
    }
    p.bump();
    if cfg!(feature = "debug") {
        tracing::trace!(
            "parsing binary op {:?} min_prec={}, prec={}",
            op,
            min_prec,
            op.precedence()
        );
    }
    match *left {
        // This is invalid syntax.
        Expr::Unary { .. } | Expr::Await(..) if op == op!("**") => {
            // Correct implementation would be returning Ok(left) and
            // returning "unexpected token '**'" on next.
            // But it's not useful error message.

            syntax_error!(
                p,
                SyntaxError::UnaryInExp {
                    // FIXME: Use display
                    left: format!("{left:?}"),
                    left_span: left.span(),
                }
            )
        }
        _ => {}
    }

    let right = {
        let left_of_right = p.parse_unary_expr()?;
        parse_bin_op_recursively(
            p,
            left_of_right,
            if op == op!("**") {
                // exponential operator is right associative
                op.precedence() - 1
            } else {
                op.precedence()
            },
        )?
    };
    /* this check is for all ?? operators
     * a ?? b && c for this example
     * b && c => This is considered as a logical expression in the ast tree
     * a => Identifier
     * so for ?? operator we need to check in this case the right expression to
     * have parenthesis second case a && b ?? c
     * here a && b => This is considered as a logical expression in the ast tree
     * c => identifier
     * so now here for ?? operator we need to check the left expression to have
     * parenthesis if the parenthesis is missing we raise an error and
     * throw it
     */
    if op == op!("??") {
        match *left {
            Expr::Bin(BinExpr { span, op, .. }) if op == op!("&&") || op == op!("||") => {
                p.emit_err(span, SyntaxError::NullishCoalescingWithLogicalOp);
            }
            _ => {}
        }

        match *right {
            Expr::Bin(BinExpr { span, op, .. }) if op == op!("&&") || op == op!("||") => {
                p.emit_err(span, SyntaxError::NullishCoalescingWithLogicalOp);
            }
            _ => {}
        }
    }

    let node = BinExpr {
        span: Span::new_with_checked(left.span_lo(), right.span_hi()),
        op,
        left,
        right,
    }
    .into();

    Ok((node, Some(min_prec)))
}

/// Parse unary expression and update expression.
///
/// spec: 'UnaryExpression'
pub(crate) fn parse_unary_expr<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_unary_expr);

    let token_and_span = p.input().get_cur();
    let start = token_and_span.span().lo;
    let cur = token_and_span.token();

    if !p.input().syntax().jsx() && p.input().syntax().typescript() && cur.is_less() {
        p.bump(); // consume `<`
        if p.input_mut().eat(&P::Token::CONST) {
            expect!(p, &P::Token::GREATER);
            let expr = p.parse_unary_expr()?;
            return Ok(TsConstAssertion {
                span: p.span(start),
                expr,
            }
            .into());
        }

        return parse_ts_type_assertion(p, start)
            .map(Expr::from)
            .map(Box::new);
    } else if cur.is_plus_plus() || cur.is_minus_minus() {
        // Parse update expression
        let op = if cur.is_plus_plus() {
            op!("++")
        } else {
            op!("--")
        };
        p.bump();

        let arg = p.parse_unary_expr()?;
        let span = Span::new_with_checked(start, arg.span_hi());
        p.check_assign_target(&arg, false);

        return Ok(UpdateExpr {
            span,
            prefix: true,
            op,
            arg,
        }
        .into());
    } else if cur.is_delete()
        || cur.is_void()
        || cur.is_typeof()
        || cur.is_plus()
        || cur.is_minus()
        || cur.is_tilde()
        || cur.is_bang()
    {
        // Parse unary expression
        let op = if cur.is_delete() {
            op!("delete")
        } else if cur.is_void() {
            op!("void")
        } else if cur.is_typeof() {
            op!("typeof")
        } else if cur.is_plus() {
            op!(unary, "+")
        } else if cur.is_minus() {
            op!(unary, "-")
        } else if cur.is_tilde() {
            op!("~")
        } else {
            debug_assert!(cur.is_bang());
            op!("!")
        };
        p.bump();
        let arg_start = p.cur_pos() - BytePos(1);
        let arg = match p.parse_unary_expr() {
            Ok(expr) => expr,
            Err(err) => {
                p.emit_error(err);
                Invalid {
                    span: Span::new_with_checked(arg_start, arg_start),
                }
                .into()
            }
        };

        if op == op!("delete") {
            // Skip emitting TS1102 in TypeScript mode because it's a semantic error
            // that should be handled by the type checker, not the parser.
            // See: https://github.com/swc-project/swc/issues/10558
            if !p.input().syntax().typescript() {
                if let Expr::Ident(ref i) = *arg {
                    p.emit_strict_mode_err(i.span, SyntaxError::TS1102)
                }
            }
        }

        return Ok(UnaryExpr {
            span: Span::new_with_checked(start, arg.span_hi()),
            op,
            arg,
        }
        .into());
    } else if cur.is_await() {
        return parse_await_expr(p, None);
    }

    // UpdateExpression
    let expr = p.parse_lhs_expr()?;
    return_if_arrow!(p, expr);

    // Line terminator isn't allowed here.
    if p.input().had_line_break_before_cur() {
        return Ok(expr);
    }

    let cur = p.input().cur();
    if cur.is_plus_plus() || cur.is_minus_minus() {
        let op = if cur.is_plus_plus() {
            op!("++")
        } else {
            op!("--")
        };
        p.check_assign_target(&expr, false);
        p.bump();

        return Ok(UpdateExpr {
            span: p.span(expr.span_lo()),
            prefix: false,
            op,
            arg: expr,
        }
        .into());
    }
    Ok(expr)
}

pub fn parse_await_expr<'a, P: Parser<'a>>(
    p: &mut P,
    start_of_await_token: Option<BytePos>,
) -> PResult<Box<Expr>> {
    let start = start_of_await_token.unwrap_or_else(|| p.cur_pos());

    if start_of_await_token.is_none() {
        p.assert_and_bump(&P::Token::AWAIT);
    }

    let await_token = p.span(start);

    if p.input().is(&P::Token::MUL) {
        syntax_error!(p, SyntaxError::AwaitStar);
    }

    let ctx = p.ctx();

    let span = p.span(start);

    if !ctx.contains(Context::InAsync)
        && (p.is_general_semi() || {
            let cur = p.input().cur();
            cur.is_rparen() || cur.is_rbracket() || cur.is_comma()
        })
    {
        if ctx.contains(Context::Module) {
            p.emit_err(span, SyntaxError::InvalidIdentInAsync);
        }

        return Ok(Ident::new_no_ctxt(atom!("await"), span).into());
    }

    // This has been checked if start_of_await_token == true,
    if start_of_await_token.is_none() && ctx.contains(Context::TopLevel) {
        p.mark_found_module_item();
        if !ctx.contains(Context::CanBeModule) {
            p.emit_err(await_token, SyntaxError::TopLevelAwaitInScript);
        }
    }

    if ctx.contains(Context::InFunction) && !ctx.contains(Context::InAsync) {
        p.emit_err(await_token, SyntaxError::AwaitInFunction);
    }

    if ctx.contains(Context::InParameters) && !ctx.contains(Context::InFunction) {
        p.emit_err(span, SyntaxError::AwaitParamInAsync);
    }

    let arg = p.parse_unary_expr()?;
    Ok(AwaitExpr {
        span: p.span(start),
        arg,
    }
    .into())
}

pub(super) fn parse_for_head_prefix<'a>(p: &mut impl Parser<'a>) -> PResult<Box<Expr>> {
    p.parse_expr()
}

/// Parse call, dot, and `[]`-subscript expressions.
#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub fn parse_lhs_expr<'a, P: Parser<'a>, const PARSE_JSX: bool>(p: &mut P) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_lhs_expr);

    // parse jsx
    if PARSE_JSX && p.input().syntax().jsx() {
        fn into_expr(e: Either<JSXFragment, JSXElement>) -> Box<Expr> {
            match e {
                Either::Left(l) => l.into(),
                Either::Right(r) => r.into(),
            }
        }
        let token_and_span = p.input().get_cur();
        let cur = token_and_span.token();
        if cur.is_jsx_text() {
            return Ok(Box::new(Expr::Lit(Lit::JSXText(parse_jsx_text(p)))));
        } else if cur.is_jsx_tag_start() {
            return parse_jsx_element(p).map(into_expr);
        } else if cur.is_error() {
            let err = p.input_mut().expect_error_token_and_bump();
            return Err(err);
        }

        if p.input().is(&P::Token::LESS) && !peek!(p).is_some_and(|peek| peek.is_bang()) {
            // In case we encounter an lt token here it will always be the start of
            // jsx as the lt sign is not allowed in places that expect an expression

            // FIXME:
            // p.finishToken(tt.jsxTagStart);

            return parse_jsx_element(p).map(into_expr);
        }
    }

    let token_and_span = p.input().get_cur();
    let start = token_and_span.span().lo;
    let cur = token_and_span.token();

    // `super()` can't be handled from parse_new_expr()
    if cur.is_super() {
        p.bump(); // eat `super`
        let obj = Callee::Super(Super {
            span: p.span(start),
        });
        return parse_subscripts(p, obj, false, false);
    } else if cur.is_import() {
        p.bump(); // eat `import`
        return parse_dynamic_import_or_import_meta(p, start, false);
    }

    let callee = parse_new_expr(p)?;
    return_if_arrow!(p, callee);

    let type_args = if p.input().syntax().typescript() && {
        let cur = p.input().cur();
        cur.is_less() || cur.is_lshift()
    } {
        try_parse_ts(p, |p| {
            let type_args = parse_ts_type_args(p)?;
            p.assert_and_bump(&P::Token::GREATER);
            if p.input().is(&P::Token::LPAREN) {
                Ok(Some(type_args))
            } else {
                Ok(None)
            }
        })
    } else {
        None
    };

    if let Expr::New(ne @ NewExpr { args: None, .. }) = *callee {
        // If this is parsed using 'NewExpression' rule, just return it.
        // Because it's not left-recursive.
        if type_args.is_some() {
            // This fails with `expected (`
            expect!(p, &P::Token::LPAREN);
        }
        debug_assert!(
            !p.input().cur().is_lparen(),
            "parse_new_expr() should eat paren if it exists"
        );
        return Ok(NewExpr { type_args, ..ne }.into());
    }
    // 'CallExpr' rule contains 'MemberExpr (...)',
    // and 'MemberExpr' rule contains 'new MemberExpr (...)'

    if p.input().is(&P::Token::LPAREN) {
        // This is parsed using production MemberExpression,
        // which is left-recursive.
        let (callee, is_import) = match callee {
            _ if callee.is_ident_ref_to("import") => (
                Callee::Import(Import {
                    span: callee.span(),
                    phase: Default::default(),
                }),
                true,
            ),
            _ => (Callee::Expr(callee), false),
        };
        let args = parse_args(p, is_import)?;

        let call_expr = match callee {
            Callee::Expr(e) if unwrap_ts_non_null(&e).is_opt_chain() => OptChainExpr {
                span: p.span(start),
                base: Box::new(OptChainBase::Call(OptCall {
                    span: p.span(start),
                    callee: e,
                    args,
                    type_args,
                    ..Default::default()
                })),
                optional: false,
            }
            .into(),
            _ => CallExpr {
                span: p.span(start),

                callee,
                args,
                type_args,
                ..Default::default()
            }
            .into(),
        };

        return parse_subscripts(p, Callee::Expr(call_expr), false, false);
    }
    if type_args.is_some() {
        // This fails
        expect!(p, &P::Token::LPAREN);
    }

    // This is parsed using production 'NewExpression', which contains
    // 'MemberExpression'
    Ok(callee)
}

// Returns (args_or_pats, trailing_comma)
#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub fn parse_args_or_pats<'a, P: Parser<'a>>(
    p: &mut P,
) -> PResult<(Vec<AssignTargetOrSpread>, Option<Span>)> {
    p.do_outside_of_context(Context::WillExpectColonForCond, parse_args_or_pats_inner)
}

fn parse_args_or_pats_inner<'a, P: Parser<'a>>(
    p: &mut P,
) -> PResult<(Vec<AssignTargetOrSpread>, Option<Span>)> {
    trace_cur!(p, parse_args_or_pats);

    expect!(p, &P::Token::LPAREN);

    let mut items = Vec::new();
    let mut trailing_comma = None;

    // TODO(kdy1): optimize (once we parsed a pattern, we can parse everything else
    // as a pattern instead of reparsing)
    while !p.input().is(&P::Token::RPAREN) {
        // https://github.com/swc-project/swc/issues/410
        let is_async = p.input().is(&P::Token::ASYNC)
            && peek!(p).is_some_and(|t| t.is_lparen() || t.is_word() || t.is_function());

        let start = p.cur_pos();
        p.state_mut().potential_arrow_start = Some(start);
        let modifier_start = start;

        let has_modifier = eat_any_ts_modifier(p)?;
        let pat_start = p.cur_pos();

        let mut arg = {
            if p.input().syntax().typescript()
                && (p.is_ident_ref()
                    || (p.input().is(&P::Token::DOTDOTDOT) && p.peek_is_ident_ref()))
            {
                let spread = if p.input_mut().eat(&P::Token::DOTDOTDOT) {
                    Some(p.input().prev_span())
                } else {
                    None
                };

                // At here, we use parse_bin_expr() instead of parse_assignment_expr()
                // because `x?: number` should not be parsed as a conditional expression
                let expr = if spread.is_some() {
                    parse_bin_expr(p)?
                } else {
                    let mut expr = parse_bin_expr(p)?;

                    if p.input().cur().is_assign_op() {
                        expr = finish_assignment_expr(p, start, expr)?
                    }

                    expr
                };

                ExprOrSpread { spread, expr }
            } else {
                p.allow_in_expr(|p| p.parse_expr_or_spread())?
            }
        };

        let optional = if p.input().syntax().typescript() {
            if p.input().is(&P::Token::QUESTION) {
                if peek!(p).is_some_and(|peek| {
                    peek.is_comma() || peek.is_equal() || peek.is_rparen() || peek.is_colon()
                }) {
                    p.assert_and_bump(&P::Token::QUESTION);
                    if arg.spread.is_some() {
                        p.emit_err(p.input().prev_span(), SyntaxError::TS1047);
                    }
                    match *arg.expr {
                        Expr::Ident(..) => {}
                        _ => {
                            syntax_error!(p, arg.span(), SyntaxError::TsBindingPatCannotBeOptional)
                        }
                    }
                    true
                } else if matches!(arg, ExprOrSpread { spread: None, .. }) {
                    expect!(p, &P::Token::QUESTION);
                    let test = arg.expr;

                    let cons = p.do_inside_of_context(
                        Context::InCondExpr
                            .union(Context::WillExpectColonForCond)
                            .union(Context::IncludeInExpr),
                        parse_assignment_expr,
                    )?;
                    expect!(p, &P::Token::COLON);

                    let alt = p.do_inside_of_context(Context::InCondExpr, |p| {
                        p.do_outside_of_context(
                            Context::WillExpectColonForCond,
                            parse_assignment_expr,
                        )
                    })?;

                    arg = ExprOrSpread {
                        spread: None,
                        expr: CondExpr {
                            span: Span::new_with_checked(start, alt.span_hi()),
                            test,
                            cons,
                            alt,
                        }
                        .into(),
                    };

                    false
                } else {
                    false
                }
            } else {
                false
            }
        } else {
            false
        };

        if optional || (p.input().syntax().typescript() && p.input().is(&P::Token::COLON)) {
            // TODO: `async(...args?: any[]) : any => {}`
            //
            // if p.input().syntax().typescript() && optional && arg.spread.is_some() {
            //     p.emit_err(p.input().prev_span(), SyntaxError::TS1047)
            // }

            let mut pat = reparse_expr_as_pat(p, PatType::BindingPat, arg.expr)?;
            if optional {
                match pat {
                    Pat::Ident(ref mut i) => i.optional = true,
                    _ => unreachable!(),
                }
            }
            if let Some(span) = arg.spread {
                pat = RestPat {
                    span: p.span(pat_start),
                    dot3_token: span,
                    arg: Box::new(pat),
                    type_ann: None,
                }
                .into();
            }
            match pat {
                Pat::Ident(BindingIdent {
                    id: Ident { ref mut span, .. },
                    ref mut type_ann,
                    ..
                })
                | Pat::Array(ArrayPat {
                    ref mut type_ann,
                    ref mut span,
                    ..
                })
                | Pat::Object(ObjectPat {
                    ref mut type_ann,
                    ref mut span,
                    ..
                })
                | Pat::Rest(RestPat {
                    ref mut type_ann,
                    ref mut span,
                    ..
                }) => {
                    let new_type_ann = try_parse_ts_type_ann(p)?;
                    if new_type_ann.is_some() {
                        *span = Span::new_with_checked(pat_start, p.input().prev_span().hi);
                    }
                    *type_ann = new_type_ann;
                }
                Pat::Expr(ref expr) => unreachable!("invalid pattern: Expr({:?})", expr),
                Pat::Assign(..) | Pat::Invalid(..) => {
                    // We don't have to panic here.
                    // See: https://github.com/swc-project/swc/issues/1170
                    //
                    // Also, as an exact error is added to the errors while
                    // creating `Invalid`, we don't have to emit a new
                    // error.
                }
                #[cfg(swc_ast_unknown)]
                _ => (),
            }

            if p.input_mut().eat(&P::Token::EQUAL) {
                let right = parse_assignment_expr(p)?;
                pat = AssignPat {
                    span: p.span(pat_start),
                    left: Box::new(pat),
                    right,
                }
                .into();
            }

            if has_modifier {
                p.emit_err(p.span(modifier_start), SyntaxError::TS2369);
            }

            items.push(AssignTargetOrSpread::Pat(pat))
        } else {
            if has_modifier {
                p.emit_err(p.span(modifier_start), SyntaxError::TS2369);
            }

            items.push(AssignTargetOrSpread::ExprOrSpread(arg));
        }

        // https://github.com/swc-project/swc/issues/433
        if p.input_mut().eat(&P::Token::ARROW) && {
            debug_assert_eq!(items.len(), 1);
            match items[0] {
                AssignTargetOrSpread::ExprOrSpread(ExprOrSpread { ref expr, .. })
                | AssignTargetOrSpread::Pat(Pat::Expr(ref expr)) => {
                    matches!(**expr, Expr::Ident(..))
                }
                AssignTargetOrSpread::Pat(Pat::Ident(..)) => true,
                _ => false,
            }
        } {
            let params: Vec<Pat> = parse_paren_items_as_params(p, items.clone(), None)?;

            let body: Box<BlockStmtOrExpr> = parse_fn_block_or_expr_body(
                p,
                false,
                false,
                true,
                params.is_simple_parameter_list(),
            )?;
            let span = p.span(start);

            items.push(AssignTargetOrSpread::ExprOrSpread(ExprOrSpread {
                expr: Box::new(
                    ArrowExpr {
                        span,
                        body,
                        is_async,
                        is_generator: false,
                        params,
                        ..Default::default()
                    }
                    .into(),
                ),
                spread: None,
            }));
        }

        if !p.input().is(&P::Token::RPAREN) {
            expect!(p, &P::Token::COMMA);
            if p.input().is(&P::Token::RPAREN) {
                trailing_comma = Some(p.input().prev_span());
            }
        }
    }

    expect!(p, &P::Token::RPAREN);
    Ok((items, trailing_comma))
}

#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub fn parse_paren_expr_or_arrow_fn<'a, P: Parser<'a>>(
    p: &mut P,
    can_be_arrow: bool,
    async_span: Option<Span>,
) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_paren_expr_or_arrow_fn);

    let expr_start = async_span.map(|x| x.lo()).unwrap_or_else(|| p.cur_pos());

    // At this point, we can't know if it's parenthesized
    // expression or head of arrow function.
    // But as all patterns of javascript is subset of
    // expressions, we can parse both as expression.

    let (paren_items, trailing_comma) = p
        .do_outside_of_context(Context::WillExpectColonForCond, |p| {
            p.allow_in_expr(parse_args_or_pats)
        })?;

    let has_pattern = paren_items
        .iter()
        .any(|item| matches!(item, AssignTargetOrSpread::Pat(..)));

    let will_expect_colon_for_cond = p.ctx().contains(Context::WillExpectColonForCond);
    // This is slow path. We handle arrow in conditional expression.
    if p.syntax().typescript()
        && p.ctx().contains(Context::InCondExpr)
        && p.input().is(&P::Token::COLON)
    {
        // TODO: Remove clone
        let items_ref = &paren_items;
        if let Some(expr) = try_parse_ts(p, |p| {
            let return_type = parse_ts_type_or_type_predicate_ann(p, &P::Token::COLON)?;

            expect!(p, &P::Token::ARROW);

            let params: Vec<Pat> =
                parse_paren_items_as_params(p, items_ref.clone(), trailing_comma)?;

            let body: Box<BlockStmtOrExpr> = parse_fn_block_or_expr_body(
                p,
                async_span.is_some(),
                false,
                true,
                params.is_simple_parameter_list(),
            )?;

            if will_expect_colon_for_cond && !p.input().is(&P::Token::COLON) {
                trace_cur!(p, parse_arrow_in_cond__fail);
                unexpected!(p, "fail")
            }

            Ok(Some(
                ArrowExpr {
                    span: p.span(expr_start),
                    is_async: async_span.is_some(),
                    is_generator: false,
                    params,
                    body,
                    return_type: Some(return_type),
                    ..Default::default()
                }
                .into(),
            ))
        }) {
            return Ok(expr);
        }
    }

    let return_type = if !p.ctx().contains(Context::WillExpectColonForCond)
        && p.input().syntax().typescript()
        && p.input().is(&P::Token::COLON)
    {
        try_parse_ts(p, |p| {
            let return_type = parse_ts_type_or_type_predicate_ann(p, &P::Token::COLON)?;

            if !p.input().is(&P::Token::ARROW) {
                unexpected!(p, "fail")
            }

            Ok(Some(return_type))
        })
    } else {
        None
    };

    // we parse arrow function at here, to handle it efficiently.
    if has_pattern || return_type.is_some() || p.input().is(&P::Token::ARROW) {
        if p.input().had_line_break_before_cur() {
            syntax_error!(p, p.span(expr_start), SyntaxError::LineBreakBeforeArrow);
        }

        if !can_be_arrow {
            syntax_error!(p, p.span(expr_start), SyntaxError::ArrowNotAllowed);
        }
        expect!(p, &P::Token::ARROW);

        let params: Vec<Pat> = parse_paren_items_as_params(p, paren_items, trailing_comma)?;

        let body: Box<BlockStmtOrExpr> = parse_fn_block_or_expr_body(
            p,
            async_span.is_some(),
            false,
            true,
            params.is_simple_parameter_list(),
        )?;
        let arrow_expr = ArrowExpr {
            span: p.span(expr_start),
            is_async: async_span.is_some(),
            is_generator: false,
            params,
            body,
            return_type,
            ..Default::default()
        };
        if let BlockStmtOrExpr::BlockStmt(..) = &*arrow_expr.body {
            if p.input().cur().is_bin_op() {
                // ) is required
                p.emit_err(p.input().cur_span(), SyntaxError::TS1005);
                let errorred_expr = parse_bin_op_recursively(p, Box::new(arrow_expr.into()), 0)?;

                if !p.is_general_semi() {
                    // ; is required
                    p.emit_err(p.input().cur_span(), SyntaxError::TS1005);
                }

                return Ok(errorred_expr);
            }
        }
        return Ok(arrow_expr.into());
    } else {
        // If there's no arrow function, we have to check there's no
        // AssignProp in lhs to check against assignment in object literals
        // like (a, {b = 1});
        for expr_or_spread in paren_items.iter() {
            if let AssignTargetOrSpread::ExprOrSpread(e) = expr_or_spread {
                if let Expr::Object(o) = &*e.expr {
                    for prop in o.props.iter() {
                        if let PropOrSpread::Prop(prop) = prop {
                            if let Prop::Assign(..) = **prop {
                                p.emit_err(prop.span(), SyntaxError::AssignProperty);
                            }
                        }
                    }
                }
            }
        }
    }

    let expr_or_spreads = paren_items
        .into_iter()
        .map(|item| -> PResult<_> {
            match item {
                AssignTargetOrSpread::ExprOrSpread(e) => Ok(e),
                _ => syntax_error!(p, item.span(), SyntaxError::InvalidExpr),
            }
        })
        .collect::<Result<Vec<_>, _>>()?;
    if let Some(async_span) = async_span {
        // It's a call expression
        return Ok(CallExpr {
            span: p.span(async_span.lo()),
            callee: Callee::Expr(Box::new(
                Ident::new_no_ctxt(atom!("async"), async_span).into(),
            )),
            args: expr_or_spreads,
            ..Default::default()
        }
        .into());
    }

    // It was not head of arrow function.

    if expr_or_spreads.is_empty() {
        syntax_error!(
            p,
            Span::new_with_checked(expr_start, p.last_pos()),
            SyntaxError::EmptyParenExpr
        );
    }

    // TODO: Verify that invalid expression like {a = 1} does not exists.

    // ParenthesizedExpression cannot contain spread.
    if expr_or_spreads.len() == 1 {
        let expr = match expr_or_spreads.into_iter().next().unwrap() {
            ExprOrSpread {
                spread: Some(..),
                ref expr,
            } => syntax_error!(p, expr.span(), SyntaxError::SpreadInParenExpr),
            ExprOrSpread { expr, .. } => expr,
        };
        Ok(ParenExpr {
            span: p.span(expr_start),
            expr,
        }
        .into())
    } else {
        debug_assert!(expr_or_spreads.len() >= 2);

        let mut exprs = Vec::with_capacity(expr_or_spreads.len());
        for expr in expr_or_spreads {
            match expr {
                ExprOrSpread {
                    spread: Some(..),
                    ref expr,
                } => syntax_error!(p, expr.span(), SyntaxError::SpreadInParenExpr),
                ExprOrSpread { expr, .. } => exprs.push(expr),
            }
        }
        debug_assert!(exprs.len() >= 2);

        // span of sequence expression should not include '(', ')'
        let seq_expr = SeqExpr {
            span: Span::new_with_checked(
                exprs.first().unwrap().span_lo(),
                exprs.last().unwrap().span_hi(),
            ),
            exprs,
        }
        .into();
        Ok(ParenExpr {
            span: p.span(expr_start),
            expr: seq_expr,
        }
        .into())
    }
}

pub fn parse_primary_expr_rest<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    can_be_arrow: bool,
) -> PResult<Box<Expr>> {
    let decorators = if p.input().is(&P::Token::AT) {
        Some(parse_decorators(p, false)?)
    } else {
        None
    };

    let token_and_span = p.input().get_cur();
    let cur = token_and_span.token();

    if cur.is_class() {
        return parse_class_expr(p, start, decorators.unwrap_or_default());
    }

    let try_parse_arrow_expr = |p: &mut P, id: Ident, id_is_async| -> PResult<Box<Expr>> {
        if can_be_arrow && !p.input().had_line_break_before_cur() {
            if id_is_async && p.is_ident_ref() {
                // see https://github.com/tc39/ecma262/issues/2034
                // ```js
                // for(async of
                // for(async of x);
                // for(async of =>{};;);
                // ```
                let ctx = p.ctx();
                if ctx.contains(Context::ForLoopInit)
                    && p.input().is(&P::Token::OF)
                    && !peek!(p).is_some_and(|peek| peek.is_arrow())
                {
                    // ```spec https://tc39.es/ecma262/#prod-ForInOfStatement
                    // for ( [lookahead ∉ { let, async of }] LeftHandSideExpression[?Yield, ?Await] of AssignmentExpression[+In, ?Yield, ?Await] ) Statement[?Yield, ?Await, ?Return]
                    // [+Await] for await ( [lookahead ≠ let] LeftHandSideExpression[?Yield, ?Await] of AssignmentExpression[+In, ?Yield, ?Await] ) Statement[?Yield, ?Await, ?Return]
                    // ```

                    if !ctx.contains(Context::ForAwaitLoopInit) {
                        p.emit_err(p.input().prev_span(), SyntaxError::TS1106);
                    }

                    return Ok(id.into());
                }

                let ident = parse_binding_ident(p, false)?;
                if p.input().syntax().typescript()
                    && ident.sym == "as"
                    && !p.input().is(&P::Token::ARROW)
                {
                    // async as type
                    let type_ann = p.in_type(parse_ts_type)?;
                    return Ok(TsAsExpr {
                        span: p.span(start),
                        expr: Box::new(id.into()),
                        type_ann,
                    }
                    .into());
                }

                // async a => body
                let arg = ident.into();
                let params = vec![arg];
                expect!(p, &P::Token::ARROW);
                let body = parse_fn_block_or_expr_body(
                    p,
                    true,
                    false,
                    true,
                    params.is_simple_parameter_list(),
                )?;

                return Ok(ArrowExpr {
                    span: p.span(start),
                    body,
                    params,
                    is_async: true,
                    is_generator: false,
                    ..Default::default()
                }
                .into());
            } else if p.input_mut().eat(&P::Token::ARROW) {
                if p.ctx().contains(Context::Strict) && id.is_reserved_in_strict_bind() {
                    p.emit_strict_mode_err(id.span, SyntaxError::EvalAndArgumentsInStrict)
                }
                let params = vec![id.into()];
                let body = parse_fn_block_or_expr_body(
                    p,
                    false,
                    false,
                    true,
                    params.is_simple_parameter_list(),
                )?;

                return Ok(ArrowExpr {
                    span: p.span(start),
                    body,
                    params,
                    is_async: false,
                    is_generator: false,
                    ..Default::default()
                }
                .into());
            }
        }

        Ok(id.into())
    };

    let token_start = token_and_span.span().lo;
    if cur.is_let() || (p.input().syntax().typescript() && cur.is_await()) {
        let ctx = p.ctx();
        let id = parse_ident(
            p,
            !ctx.contains(Context::InGenerator),
            !ctx.contains(Context::InAsync),
        )?;
        try_parse_arrow_expr(p, id, false)
    } else if cur.is_hash() {
        p.bump(); // consume `#`
        let id = parse_ident_name(p)?;
        Ok(PrivateName {
            span: p.span(start),
            name: id.sym,
        }
        .into())
    } else if cur.is_unknown_ident() {
        let word = p.input_mut().expect_word_token_and_bump();
        if p.ctx().contains(Context::InClassField) && word == atom!("arguments") {
            p.emit_err(p.input().prev_span(), SyntaxError::ArgumentsInClassField)
        };
        let id = Ident::new_no_ctxt(word, p.span(token_start));
        try_parse_arrow_expr(p, id, false)
    } else if p.is_ident_ref() {
        let id_is_async = p.input().cur().is_async();
        let word = p.input_mut().expect_word_token_and_bump();
        let id = Ident::new_no_ctxt(word, p.span(token_start));
        try_parse_arrow_expr(p, id, id_is_async)
    } else {
        syntax_error!(p, p.input().cur_span(), SyntaxError::TS1109)
    }
}

pub fn try_parse_regexp<'a, P: Parser<'a>>(p: &mut P, start: BytePos) -> Option<Box<Expr>> {
    // Regexp
    debug_assert!(p.input().cur().is_slash() || p.input().cur().is_slash_eq());

    p.input_mut().set_next_regexp(Some(start));

    p.bump(); // `/` or `/=`

    let cur = p.input().cur();
    if cur.is_regexp() {
        p.input_mut().set_next_regexp(None);
        let (exp, flags) = p.input_mut().expect_regex_token_and_bump();
        let span = p.span(start);

        let mut flags_count =
            flags
                .chars()
                .fold(FxHashMap::<char, usize>::default(), |mut map, flag| {
                    let key = match flag {
                        // https://tc39.es/ecma262/#sec-isvalidregularexpressionliteral
                        'd' | 'g' | 'i' | 'm' | 's' | 'u' | 'v' | 'y' => flag,
                        _ => '\u{0000}', // special marker for unknown flags
                    };
                    map.entry(key).and_modify(|count| *count += 1).or_insert(1);
                    map
                });

        if flags_count.remove(&'\u{0000}').is_some() {
            p.emit_err(span, SyntaxError::UnknownRegExpFlags);
        }

        if let Some((flag, _)) = flags_count.iter().find(|(_, count)| **count > 1) {
            p.emit_err(span, SyntaxError::DuplicatedRegExpFlags(*flag));
        }

        Some(Lit::Regex(Regex { span, exp, flags }).into())
    } else {
        None
    }
}

pub fn try_parse_async_start<'a, P: Parser<'a>>(
    p: &mut P,
    can_be_arrow: bool,
) -> Option<PResult<Box<Expr>>> {
    if peek!(p).is_some_and(|peek| peek.is_function())
        && !p.input_mut().has_linebreak_between_cur_and_peeked()
    {
        // handle `async function` expression
        return Some(parse_async_fn_expr(p));
    }

    if can_be_arrow
        && p.input().syntax().typescript()
        && peek!(p).is_some_and(|peek| peek.is_less())
    {
        // try parsing `async<T>() => {}`
        if let Some(res) = try_parse_ts(p, |p| {
            let start = p.cur_pos();
            p.assert_and_bump(&P::Token::ASYNC);
            try_parse_ts_generic_async_arrow_fn(p, start)
        }) {
            return Some(Ok(res.into()));
        }
    }

    if can_be_arrow
        && peek!(p).is_some_and(|peek| peek.is_lparen())
        && !p.input_mut().has_linebreak_between_cur_and_peeked()
    {
        if let Err(e) = p.expect(&P::Token::ASYNC) {
            return Some(Err(e));
        }
        let async_span = p.input().prev_span();
        return Some(parse_paren_expr_or_arrow_fn(
            p,
            can_be_arrow,
            Some(async_span),
        ));
    }

    None
}

pub fn parse_this_expr<'a>(p: &mut impl Parser<'a>, start: BytePos) -> PResult<Box<Expr>> {
    debug_assert!(p.input().cur().is_this());
    p.input_mut().bump();
    Ok(ThisExpr {
        span: p.span(start),
    }
    .into())
}

/// Parse a primary expression or arrow function
#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub(crate) fn parse_primary_expr<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    trace_cur!(p, parse_primary_expr);

    let start = p.cur_pos();

    let can_be_arrow = p
        .state_mut()
        .potential_arrow_start
        .map(|s| s == start)
        .unwrap_or(false);

    let token = p.input().cur();
    if token.is_this() {
        return parse_this_expr(p, start);
    } else if token.is_async() {
        if let Some(res) = try_parse_async_start(p, can_be_arrow) {
            return res;
        }
    } else if token.is_lbracket() {
        return p.do_outside_of_context(Context::WillExpectColonForCond, parse_array_lit);
    } else if token.is_lbrace() {
        return parse_object_expr(p).map(Box::new);
    } else if token.is_function() {
        return parse_fn_expr(p);
    } else if token.is_null()
        || token.is_true()
        || token.is_false()
        || token.is_num()
        || token.is_bigint()
        || token.is_str()
    {
        // Literals
        return Ok(parse_lit(p)?.into());
    } else if token.is_slash() || token.is_slash_eq() {
        if let Some(res) = try_parse_regexp(p, start) {
            return Ok(res);
        }
    } else if token.is_lparen() {
        return parse_paren_expr_or_arrow_fn(p, can_be_arrow, None);
    } else if token.is_backquote() {
        // parse template literal
        return Ok((p
            .do_outside_of_context(Context::WillExpectColonForCond, |p| parse_tpl(p, false)))?
        .into());
    }

    parse_primary_expr_rest(p, start, can_be_arrow)
}
