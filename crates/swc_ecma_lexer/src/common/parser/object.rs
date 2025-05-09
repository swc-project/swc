use std::ops::DerefMut;

use swc_common::{Span, Spanned};
use swc_ecma_ast::*;

use super::{
    expr::parse_assignment_expr,
    pat::{parse_binding_element, parse_binding_pat_or_ident},
    Parser,
};
use crate::{
    common::{context::Context, lexer::token::TokenFactory, parser::buffer::Buffer},
    error::SyntaxError,
};

pub type PResult<T> = Result<T, crate::error::Error>;

fn parse_object<'a, P: Parser<'a>, Object, ObjectProp>(
    p: &mut P,
    parse_prop: impl Fn(&mut P) -> PResult<ObjectProp>,
    make_object: impl Fn(&mut P, Span, Vec<ObjectProp>, Option<Span>) -> PResult<Object>,
) -> PResult<Object> {
    let ctx = p.ctx() & !Context::WillExpectColonForCond;
    p.with_ctx(ctx).parse_with(|p| {
        trace_cur!(p, parse_object);

        let start = p.cur_pos();
        let mut trailing_comma = None;
        p.assert_and_bump(&P::Token::LBRACE)?;

        let mut props = Vec::with_capacity(8);

        while !p.input_mut().eat(&P::Token::RBRACE) {
            props.push(parse_prop(p)?);

            if !p.input_mut().is(&P::Token::RBRACE) {
                expect!(p, &P::Token::COMMA);
                if p.input_mut().is(&P::Token::RBRACE) {
                    trailing_comma = Some(p.input().prev_span());
                }
            }
        }

        let span = p.span(start);
        make_object(p, span, props, trailing_comma)
    })
}

/// Production 'BindingProperty'
fn parse_binding_object_prop<'a, P: Parser<'a>>(p: &mut P) -> PResult<ObjectPatProp> {
    let start = p.cur_pos();

    if p.input_mut().eat(&P::Token::DOTDOTDOT) {
        // spread element
        let dot3_token = p.span(start);

        let arg = Box::new(parse_binding_pat_or_ident(p, false)?);

        return Ok(ObjectPatProp::Rest(RestPat {
            span: p.span(start),
            dot3_token,
            arg,
            type_ann: None,
        }));
    }

    let key = p.parse_prop_name()?;
    if p.input_mut().eat(&P::Token::COLON) {
        let value = Box::new(parse_binding_element(p)?);

        return Ok(ObjectPatProp::KeyValue(KeyValuePatProp { key, value }));
    }
    let key = match key {
        PropName::Ident(ident) => ident,
        _ => unexpected!(p, "an identifier"),
    };

    let value = if p.input_mut().eat(&P::Token::EQUAL) {
        parse_assignment_expr(p.include_in_expr(true).deref_mut()).map(Some)?
    } else {
        if p.ctx().is_reserved_word(&key.sym) {
            p.emit_err(key.span, SyntaxError::ReservedWordInObjShorthandOrPat);
        }

        None
    };

    Ok(ObjectPatProp::Assign(AssignPatProp {
        span: p.span(start),
        key: key.into(),
        value,
    }))
}

fn make_binding_object<'a, P: Parser<'a>>(
    p: &mut P,
    span: Span,
    props: Vec<ObjectPatProp>,
    trailing_comma: Option<Span>,
) -> PResult<Pat> {
    let len = props.len();
    for (i, prop) in props.iter().enumerate() {
        if i == len - 1 {
            if let ObjectPatProp::Rest(ref rest) = prop {
                match *rest.arg {
                    Pat::Ident(..) => {
                        if let Some(trailing_comma) = trailing_comma {
                            p.emit_err(trailing_comma, SyntaxError::CommaAfterRestElement);
                        }
                    }
                    _ => syntax_error!(p, prop.span(), SyntaxError::DotsWithoutIdentifier),
                }
            }
            continue;
        }

        if let ObjectPatProp::Rest(..) = prop {
            p.emit_err(prop.span(), SyntaxError::NonLastRestParam)
        }
    }

    let optional = (p.input().syntax().dts() || p.ctx().contains(Context::InDeclare))
        && p.input_mut().eat(&P::Token::QUESTION);

    Ok(ObjectPat {
        span,
        props,
        optional,
        type_ann: None,
    }
    .into())
}

pub(super) fn parse_object_pat<'a, P: Parser<'a>>(p: &mut P) -> PResult<Pat> {
    parse_object(p, parse_binding_object_prop, make_binding_object)
}
