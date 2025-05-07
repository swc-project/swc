use either::Either;
use swc_common::BytePos;
use swc_ecma_ast::{JSXClosingElement, JSXClosingFragment, JSXExpr, JSXExprContainer};

use super::{PResult, Parser};
use crate::{
    common::{lexer::token::TokenFactory, parser::buffer::Buffer},
    error::SyntaxError,
};

/// Parses JSX closing tag starting after "</".
pub fn parse_jsx_closing_element_at<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
) -> PResult<Either<JSXClosingFragment, JSXClosingElement>> {
    debug_assert!(p.input().syntax().jsx());

    if p.input_mut().eat(&P::Token::jsx_tag_end()) {
        return Ok(Either::Left(JSXClosingFragment {
            span: p.span(start),
        }));
    }

    let name = p.parse_jsx_element_name()?;
    expect!(p, &P::Token::jsx_tag_end());
    Ok(Either::Right(JSXClosingElement {
        span: p.span(start),
        name,
    }))
}

/// Parses JSX expression enclosed into curly brackets.
pub fn parse_jsx_expr_container<'a, P: Parser<'a>>(
    p: &mut P,
    _: BytePos,
) -> PResult<JSXExprContainer> {
    debug_assert!(p.input().syntax().jsx());

    let start = p.input_mut().cur_pos();
    p.bump();
    let expr = if p.input_mut().is(&P::Token::rbrace()) {
        p.parse_jsx_empty_expr().map(JSXExpr::JSXEmptyExpr)?
    } else {
        if p.input_mut().is(&P::Token::dotdotdot()) {
            p.bump();
        }
        p.parse_expr().map(JSXExpr::Expr)?
    };
    expect!(p, &P::Token::rbrace());
    Ok(JSXExprContainer {
        span: p.span(start),
        expr,
    })
}
