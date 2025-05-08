use swc_common::Spanned;
use swc_ecma_ast::{CallExpr, Callee, Decorator, Expr, Ident};

use super::{
    buffer::Buffer,
    expr::parse_args,
    ident::{parse_binding_ident, parse_opt_binding_ident},
    typescript::parse_ts_type_args,
    PResult, Parser,
};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{expr::parse_subscripts, ident::parse_ident},
    },
    error::SyntaxError,
};

/// If `required` is `true`, this never returns `None`.
pub fn parse_maybe_opt_binding_ident<'a>(
    p: &mut impl Parser<'a>,
    required: bool,
    disallow_let: bool,
) -> PResult<Option<Ident>> {
    if required {
        parse_binding_ident(p, disallow_let).map(|v| v.id).map(Some)
    } else {
        parse_opt_binding_ident(p, disallow_let).map(|v| v.map(|v| v.id))
    }
}

fn parse_maybe_decorator_args<'a, P: Parser<'a>>(p: &mut P, expr: Box<Expr>) -> PResult<Box<Expr>> {
    let type_args = if p.input().syntax().typescript() && p.input_mut().is(&P::Token::LESS) {
        Some(parse_ts_type_args(p)?)
    } else {
        None
    };

    if type_args.is_none() && !p.input_mut().is(&P::Token::LPAREN) {
        return Ok(expr);
    }

    let args = parse_args(p, false)?;
    Ok(CallExpr {
        span: p.span(expr.span_lo()),
        callee: Callee::Expr(expr),
        args,
        ..Default::default()
    }
    .into())
}

pub fn parse_decorators<'a, P: Parser<'a>>(
    p: &mut P,
    allow_export: bool,
) -> PResult<Vec<Decorator>> {
    if !p.syntax().decorators() {
        return Ok(Vec::new());
    }
    trace_cur!(p, parse_decorators);

    let mut decorators = Vec::new();
    let start = p.cur_pos();

    while p.input_mut().is(&P::Token::AT) {
        decorators.push(parse_decorator(p)?);
    }
    if decorators.is_empty() {
        return Ok(decorators);
    }

    if p.input_mut().is(&P::Token::EXPORT) {
        if !p.ctx().contains(Context::InClass)
            && !p.ctx().contains(Context::InFunction)
            && !allow_export
        {
            syntax_error!(p, p.input().cur_span(), SyntaxError::ExportNotAllowed);
        }

        if !p.ctx().contains(Context::InClass)
            && !p.ctx().contains(Context::InFunction)
            && !p.syntax().decorators_before_export()
        {
            syntax_error!(p, p.span(start), SyntaxError::DecoratorOnExport);
        }
    } else if !p.input_mut().is(&P::Token::CLASS) {
        // syntax_error!(p, p.span(start),
        // SyntaxError::InvalidLeadingDecorator)
    }

    Ok(decorators)
}

fn parse_decorator<'a, P: Parser<'a>>(p: &mut P) -> PResult<Decorator> {
    let start = p.cur_pos();
    trace_cur!(p, parse_decorator);

    p.assert_and_bump(&P::Token::AT)?;

    let expr = if p.input_mut().eat(&P::Token::LPAREN) {
        let expr = p.parse_expr()?;
        expect!(p, &P::Token::RPAREN);
        expr
    } else {
        let expr = parse_ident(p, false, false).map(Expr::from).map(Box::new)?;

        parse_subscripts(p, Callee::Expr(expr), false, true)?
    };

    let expr = parse_maybe_decorator_args(p, expr)?;

    Ok(Decorator {
        span: p.span(start),
        expr,
    })
}
