use swc_common::{Span, Spanned};
use swc_ecma_ast::{ArrayLit, Expr, YieldExpr};

use super::{buffer::Buffer, PResult, Parser};
use crate::{
    common::{context::Context, lexer::token::TokenFactory},
    error::{Error, SyntaxError},
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

    p.assert_and_bump(&P::Token::lbracket())?;

    let mut elems = Vec::with_capacity(8);

    while !eof!(p) && !p.input_mut().is(&P::Token::rbracket()) {
        if p.input_mut().is(&P::Token::comma()) {
            expect!(p, &P::Token::comma());
            elems.push(None);
            continue;
        }

        elems.push(p.include_in_expr(true).parse_expr_or_spread().map(Some)?);

        if !p.input_mut().is(&P::Token::rbracket()) {
            expect!(p, &P::Token::comma());
            if p.input_mut().is(&P::Token::rbracket()) {
                let prev_span = p.input().prev_span();
                p.state_mut().trailing_commas.insert(start, prev_span);
            }
        }
    }

    expect!(p, &P::Token::rbracket());

    let span = p.span(start);
    Ok(ArrayLit { span, elems }.into())
}

pub fn at_possible_async<'a, P: Parser<'a>>(p: &P, expr: &Expr) -> PResult<bool> {
    // TODO(kdy1): !this.state.containsEsc &&
    Ok(p.state().potential_arrow_start == Some(expr.span_lo()) && expr.is_ident_ref_to("async"))
}

pub fn parse_yield_expr<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<Expr>> {
    let start = p.input_mut().cur_pos();
    p.assert_and_bump(&P::Token::r#yield())?;
    debug_assert!(p.ctx().contains(Context::InGenerator));

    // Spec says
    // YieldExpression cannot be used within the FormalParameters of a generator
    // function because any expressions that are part of FormalParameters are
    // evaluated before the resulting generator object is in a resumable state.
    if p.ctx().contains(Context::InParameters) && !p.ctx().contains(Context::InFunction) {
        syntax_error!(p, p.input().prev_span(), SyntaxError::YieldParamInGen)
    }

    let parse_with_arg = |p: &mut P| {
        let has_star = p.input_mut().eat(&P::Token::mul());
        let err_span = p.span(start);
        let arg = p.parse_assignment_expr().map_err(|err| {
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
