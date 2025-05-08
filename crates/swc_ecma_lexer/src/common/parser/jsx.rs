use std::ops::DerefMut;

use either::Either;
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::*;

use super::{PResult, Parser};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            buffer::Buffer,
            expr::parse_lit,
            get_qualified_jsx_name,
            ident::parse_ident_ref,
            typescript::{parse_ts_type_args, try_parse_ts},
        },
    },
    error::SyntaxError,
};

/// Parses JSX closing tag starting after "</".
fn parse_jsx_closing_element_at<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
) -> PResult<Either<JSXClosingFragment, JSXClosingElement>> {
    debug_assert!(p.input().syntax().jsx());

    if p.input_mut().eat(&P::Token::JSX_TAG_END) {
        return Ok(Either::Left(JSXClosingFragment {
            span: p.span(start),
        }));
    }

    let name = parse_jsx_element_name(p)?;
    expect!(p, &P::Token::JSX_TAG_END);
    Ok(Either::Right(JSXClosingElement {
        span: p.span(start),
        name,
    }))
}

/// Parses JSX expression enclosed into curly brackets.
fn parse_jsx_expr_container<'a, P: Parser<'a>>(p: &mut P, _: BytePos) -> PResult<JSXExprContainer> {
    debug_assert!(p.input().syntax().jsx());

    let start = p.input_mut().cur_pos();
    p.bump();
    let expr = if p.input_mut().is(&P::Token::RBRACE) {
        parse_jsx_empty_expr(p).map(JSXExpr::JSXEmptyExpr)?
    } else {
        if p.input_mut().is(&P::Token::DOTDOTDOT) {
            p.bump();
        }
        p.parse_expr().map(JSXExpr::Expr)?
    };
    expect!(p, &P::Token::RBRACE);
    Ok(JSXExprContainer {
        span: p.span(start),
        expr,
    })
}

/// Parse next token as JSX identifier
fn parse_jsx_ident<'a, P: Parser<'a>>(p: &mut P) -> PResult<Ident> {
    debug_assert!(p.input().syntax().jsx());
    trace_cur!(p, parse_jsx_ident);
    if cur!(p, true).is_jsx_name() {
        let t = p.bump();
        let name = t.take_jsx_name(p.input_mut());
        let span = p.input().prev_span();
        Ok(Ident::new_no_ctxt(name, span))
    } else if p.ctx().contains(Context::InForcedJsxContext) {
        parse_ident_ref(p)
    } else {
        unexpected!(p, "jsx identifier")
    }
}

/// Parse namespaced identifier.
fn parse_jsx_namespaced_name<'a, P: Parser<'a>>(p: &mut P) -> PResult<JSXAttrName> {
    debug_assert!(p.input().syntax().jsx());
    trace_cur!(p, parse_jsx_namespaced_name);
    let start = p.input_mut().cur_pos();
    let ns = parse_jsx_ident(p)?.into();
    if !p.input_mut().eat(&P::Token::COLON) {
        return Ok(JSXAttrName::Ident(ns));
    }
    let name = parse_jsx_ident(p).map(IdentName::from)?;
    Ok(JSXAttrName::JSXNamespacedName(JSXNamespacedName {
        span: Span::new(start, name.span.hi),
        ns,
        name,
    }))
}

/// Parses element name in any form - namespaced, member or single
/// identifier.
fn parse_jsx_element_name<'a, P: Parser<'a>>(p: &mut P) -> PResult<JSXElementName> {
    debug_assert!(p.input().syntax().jsx());
    trace_cur!(p, parse_jsx_element_name);
    let start = p.input_mut().cur_pos();
    let mut node = match parse_jsx_namespaced_name(p)? {
        JSXAttrName::Ident(i) => JSXElementName::Ident(i.into()),
        JSXAttrName::JSXNamespacedName(i) => JSXElementName::JSXNamespacedName(i),
    };
    while p.input_mut().eat(&P::Token::DOT) {
        let prop = parse_jsx_ident(p).map(IdentName::from)?;
        let new_node = JSXElementName::JSXMemberExpr(JSXMemberExpr {
            span: p.span(start),
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
fn parse_jsx_empty_expr<'a>(p: &mut impl Parser<'a>) -> PResult<JSXEmptyExpr> {
    debug_assert!(p.input().syntax().jsx());
    let start = p.input_mut().cur_pos();
    Ok(JSXEmptyExpr {
        span: Span::new(start, start),
    })
}

pub fn parse_jsx_text<'a>(p: &mut impl Parser<'a>) -> PResult<JSXText> {
    debug_assert!(p.input().syntax().jsx());
    debug_assert!(cur!(p, false).is_ok_and(|t| t.is_jsx_text()));
    let token = p.bump();
    let span = p.input().prev_span();
    let (value, raw) = token.take_jsx_text(p.input_mut());
    Ok(JSXText { span, value, raw })
}

/// Parses any type of JSX attribute value.
///
/// TODO(kdy1): Change return type to JSXAttrValue
fn parse_jsx_attr_value<'a, P: Parser<'a>>(p: &mut P) -> PResult<JSXAttrValue> {
    debug_assert!(p.input().syntax().jsx());
    trace_cur!(p, parse_jsx_attr_value);

    let start = p.cur_pos();

    let cur = cur!(p, true);
    if cur.is_lbrace() {
        let node = parse_jsx_expr_container(p, start)?;
        match node.expr {
            JSXExpr::JSXEmptyExpr(..) => {
                syntax_error!(p, p.span(start), SyntaxError::EmptyJSXAttr)
            }
            JSXExpr::Expr(..) => Ok(node.into()),
        }
    } else if cur.is_str() {
        let lit = parse_lit(p)?;
        Ok(JSXAttrValue::Lit(lit))
    } else if cur.is_jsx_tag_start() {
        let expr = parse_jsx_element(p)?;
        match expr {
            Either::Left(n) => Ok(JSXAttrValue::JSXFragment(n)),
            Either::Right(n) => Ok(JSXAttrValue::JSXElement(Box::new(n))),
        }
    } else {
        let span = p.input().cur_span();
        syntax_error!(p, span, SyntaxError::InvalidJSXValue)
    }
}

/// Parse JSX spread child
fn parse_jsx_spread_child<'a, P: Parser<'a>>(p: &mut P) -> PResult<JSXSpreadChild> {
    debug_assert!(p.input().syntax().jsx());
    let start = p.cur_pos();

    expect!(p, &P::Token::LBRACE);
    expect!(p, &P::Token::DOTDOTDOT);
    let expr = p.parse_expr()?;
    expect!(p, &P::Token::RBRACE);

    Ok(JSXSpreadChild {
        span: p.span(start),
        expr,
    })
}

/// Parses following JSX attribute name-value pair.
fn parse_jsx_attr<'a, P: Parser<'a>>(p: &mut P) -> PResult<JSXAttrOrSpread> {
    debug_assert!(p.input().syntax().jsx());
    let start = p.cur_pos();

    debug_tracing!(p, "parse_jsx_attr");

    if p.input_mut().eat(&P::Token::LBRACE) {
        let dot3_start = p.cur_pos();
        expect!(p, &P::Token::DOTDOTDOT);
        let dot3_token = p.span(dot3_start);
        let expr = p.parse_assignment_expr()?;
        expect!(p, &P::Token::RBRACE);
        return Ok(SpreadElement { dot3_token, expr }.into());
    }

    let name = parse_jsx_namespaced_name(p)?;
    let value = if p.input_mut().eat(&P::Token::EQUAL) {
        parse_jsx_attr_value(
            p.with_ctx(p.ctx() & !Context::InCondExpr & !Context::WillExpectColonForCond)
                .deref_mut(),
        )
        .map(Some)?
    } else {
        None
    };

    Ok(JSXAttr {
        span: p.span(start),
        name,
        value,
    }
    .into())
}

/// Parses JSX opening tag starting after "<".
fn parse_jsx_opening_element_at<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
) -> PResult<Either<JSXOpeningFragment, JSXOpeningElement>> {
    debug_assert!(p.input().syntax().jsx());

    if p.input_mut().eat(&P::Token::JSX_TAG_END) {
        return Ok(Either::Left(JSXOpeningFragment {
            span: p.span(start),
        }));
    }

    let name = parse_jsx_element_name(
        p.with_ctx(p.ctx() & !Context::ShouldNotLexLtOrGtAsType)
            .deref_mut(),
    )?;
    parse_jsx_opening_element_after_name(p, start, name).map(Either::Right)
}

/// `jsxParseOpeningElementAfterName`
fn parse_jsx_opening_element_after_name<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    name: JSXElementName,
) -> PResult<JSXOpeningElement> {
    debug_assert!(p.input().syntax().jsx());

    let type_args = if p.input().syntax().typescript() && p.input_mut().is(&P::Token::LESS) {
        try_parse_ts(p, |p| parse_ts_type_args(p).map(Some))
    } else {
        None
    };

    let mut attrs = Vec::new();
    while cur!(p, false).is_ok() {
        trace_cur!(p, parse_jsx_opening__attrs_loop);

        if p.input_mut()
            .cur()
            .is_some_and(|cur| cur.is_slash() || cur.is_jsx_tag_end())
        {
            break;
        }

        let attr = parse_jsx_attr(p)?;
        attrs.push(attr);
    }
    let self_closing = p.input_mut().eat(&P::Token::DIV);
    if !p.input_mut().eat(&P::Token::JSX_TAG_END)
        & !(p.ctx().contains(Context::InForcedJsxContext) && p.input_mut().eat(&P::Token::GREATER))
    {
        unexpected!(p, "> (jsx closing tag)");
    }
    Ok(JSXOpeningElement {
        span: p.span(start),
        name,
        attrs,
        self_closing,
        type_args,
    })
}

/// Parses entire JSX element, including it"s opening tag
/// (starting after "<"), attributes, contents and closing tag.
///
/// babel: `jsxParseElementAt`
fn parse_jsx_element_at<'a, P: Parser<'a>>(
    p: &mut P,
    start_pos: BytePos,
) -> PResult<Either<JSXFragment, JSXElement>> {
    debug_assert!(p.input().syntax().jsx());

    let _ = cur!(p, true);
    let start = p.cur_pos();
    let cur = p.bump();
    let forced_jsx_context = if cur.is_less() {
        true
    } else {
        debug_assert!(cur.is_jsx_tag_start());
        false
    };

    let mut ctx = p.ctx() & !Context::ShouldNotLexLtOrGtAsType;
    ctx.set(Context::InForcedJsxContext, forced_jsx_context);
    p.with_ctx(ctx).parse_with(|p| {
        debug_tracing!(p, "parse_jsx_element");

        let opening_element = parse_jsx_opening_element_at(p, start_pos)?;

        trace_cur!(p, parse_jsx_element__after_opening_element);

        let mut children = Vec::new();
        let mut closing_element = None;

        let self_closing = match opening_element {
            Either::Right(ref el) => el.self_closing,
            _ => false,
        };

        if !self_closing {
            'contents: loop {
                let cur = cur!(p, true);
                if cur.is_jsx_tag_start() {
                    let start = p.cur_pos();
                    if peek!(p).is_some_and(|peek| peek.is_slash()) {
                        p.bump(); // JSXTagStart
                        let _ = cur!(p, true);
                        p.assert_and_bump(&P::Token::DIV)?;
                        closing_element = parse_jsx_closing_element_at(p, start).map(Some)?;
                        break 'contents;
                    }
                    children.push(parse_jsx_element_at(p, start).map(|e| match e {
                        Either::Left(e) => JSXElementChild::from(e),
                        Either::Right(e) => JSXElementChild::from(Box::new(e)),
                    })?);
                } else if cur.is_jsx_text() {
                    children.push(parse_jsx_text(p).map(JSXElementChild::from)?)
                } else if cur.is_lbrace() {
                    let start = p.cur_pos();
                    if peek!(p).is_some_and(|peek| peek.is_dotdotdot()) {
                        children.push(parse_jsx_spread_child(p).map(JSXElementChild::from)?);
                    } else {
                        children
                            .push(parse_jsx_expr_container(p, start).map(JSXElementChild::from)?);
                    }
                } else {
                    unexpected!(p, "< (jsx tag start), jsx text or {")
                }
            }
        }
        let span = p.span(start);

        Ok(match (opening_element, closing_element) {
            (Either::Left(..), Some(Either::Right(closing))) => {
                syntax_error!(p, closing.span(), SyntaxError::JSXExpectedClosingTagForLtGt);
            }
            (Either::Right(opening), Some(Either::Left(closing))) => {
                syntax_error!(
                    p,
                    closing.span(),
                    SyntaxError::JSXExpectedClosingTag {
                        tag: get_qualified_jsx_name(&opening.name)
                    }
                );
            }
            (Either::Left(opening), Some(Either::Left(closing))) => Either::Left(JSXFragment {
                span,
                opening,
                children,
                closing,
            }),
            (Either::Right(opening), None) => Either::Right(JSXElement {
                span,
                opening,
                children,
                closing: None,
            }),
            (Either::Right(opening), Some(Either::Right(closing))) => {
                if get_qualified_jsx_name(&closing.name) != get_qualified_jsx_name(&opening.name) {
                    syntax_error!(
                        p,
                        closing.span(),
                        SyntaxError::JSXExpectedClosingTag {
                            tag: get_qualified_jsx_name(&opening.name)
                        }
                    );
                }
                Either::Right(JSXElement {
                    span,
                    opening,
                    children,
                    closing: Some(closing),
                })
            }
            _ => unreachable!(),
        })
    })
}

/// Parses entire JSX element from current position.
///
/// babel: `jsxParseElement`
pub fn parse_jsx_element<'a, P: Parser<'a>>(p: &mut P) -> PResult<Either<JSXFragment, JSXElement>> {
    trace_cur!(p, parse_jsx_element);

    debug_assert!(p.input().syntax().jsx());
    debug_assert!({
        let cur = cur!(p, true);
        cur.is_jsx_tag_start() || cur.is_less()
    });

    let start_pos = p.cur_pos();

    parse_jsx_element_at(
        p.with_ctx(p.ctx() & !Context::InCondExpr & !Context::WillExpectColonForCond)
            .deref_mut(),
        start_pos,
    )
}
