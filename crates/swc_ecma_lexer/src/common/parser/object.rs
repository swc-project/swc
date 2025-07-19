use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

use super::{
    expr::parse_assignment_expr,
    pat::{parse_binding_element, parse_binding_pat_or_ident},
    PResult, Parser,
};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            buffer::Buffer,
            class_and_fn::parse_fn_args_body,
            is_not_this,
            pat::{parse_formal_params, parse_unique_formal_params},
            typescript::eat_any_ts_modifier,
        },
    },
    error::SyntaxError,
};

fn parse_object<'a, P: Parser<'a>, Object, ObjectProp>(
    p: &mut P,
    parse_prop: impl Fn(&mut P) -> PResult<ObjectProp>,
    make_object: impl Fn(&mut P, Span, Vec<ObjectProp>, Option<Span>) -> PResult<Object>,
) -> PResult<Object> {
    p.do_outside_of_context(Context::WillExpectColonForCond, |p| {
        trace_cur!(p, parse_object);

        let start = p.cur_pos();
        let mut trailing_comma = None;
        p.assert_and_bump(&P::Token::LBRACE);

        let mut props = Vec::with_capacity(8);

        while !p.input_mut().eat(&P::Token::RBRACE) {
            props.push(parse_prop(p)?);

            if !p.input().is(&P::Token::RBRACE) {
                expect!(p, &P::Token::COMMA);
                if p.input().is(&P::Token::RBRACE) {
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
        p.allow_in_expr(parse_assignment_expr).map(Some)?
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

fn make_expr_object<'a, P: Parser<'a>>(
    p: &mut P,
    span: Span,
    props: Vec<PropOrSpread>,
    trailing_comma: Option<Span>,
) -> PResult<Expr> {
    if let Some(trailing_comma) = trailing_comma {
        p.state_mut()
            .trailing_commas
            .insert(span.lo, trailing_comma);
    }
    Ok(ObjectLit { span, props }.into())
}

fn parse_expr_object_prop<'a, P: Parser<'a>>(p: &mut P) -> PResult<PropOrSpread> {
    trace_cur!(p, parse_object_prop);

    let start = p.cur_pos();
    // Parse as 'MethodDefinition'

    if p.input_mut().eat(&P::Token::DOTDOTDOT) {
        // spread element
        let dot3_token = p.span(start);

        let expr = p.allow_in_expr(parse_assignment_expr)?;

        return Ok(PropOrSpread::Spread(SpreadElement { dot3_token, expr }));
    }

    if p.input_mut().eat(&P::Token::MUL) {
        let name = p.parse_prop_name()?;
        return p
            .do_inside_of_context(Context::AllowDirectSuper, |p| {
                p.do_outside_of_context(Context::InClassField, |p| {
                    parse_fn_args_body(
                        p,
                        // no decorator in an object literal
                        Vec::new(),
                        start,
                        parse_unique_formal_params,
                        false,
                        true,
                    )
                })
            })
            .map(|function| {
                PropOrSpread::Prop(Box::new(Prop::Method(MethodProp {
                    key: name,
                    function,
                })))
            });
    }

    let has_modifiers = eat_any_ts_modifier(p)?;
    let modifiers_span = p.input().prev_span();

    let key = p.parse_prop_name()?;

    let cur = p.input().cur();
    if p.input().syntax().typescript()
        && !(cur.is_lparen()
            || cur.is_lbracket()
            || cur.is_colon()
            || cur.is_comma()
            || cur.is_question()
            || cur.is_equal()
            || cur.is_star()
            || cur.is_str()
            || cur.is_num()
            || cur.is_word())
        && !(p.input().syntax().typescript() && p.input().is(&P::Token::LESS))
        && !(p.input().is(&P::Token::RBRACE) && matches!(key, PropName::Ident(..)))
    {
        trace_cur!(p, parse_object_prop_error);

        p.emit_err(p.input().cur_span(), SyntaxError::TS1005);
        return Ok(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
            key,
            value: Invalid {
                span: p.span(start),
            }
            .into(),
        }))));
    }
    //
    // {[computed()]: a,}
    // { 'a': a, }
    // { 0: 1, }
    // { a: expr, }
    if p.input_mut().eat(&P::Token::COLON) {
        let value = p.allow_in_expr(parse_assignment_expr)?;
        return Ok(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
            key,
            value,
        }))));
    }

    // Handle `a(){}` (and async(){} / get(){} / set(){})
    if (p.input().syntax().typescript() && p.input().is(&P::Token::LESS))
        || p.input().is(&P::Token::LPAREN)
    {
        return p
            .do_inside_of_context(Context::AllowDirectSuper, |p| {
                p.do_outside_of_context(Context::InClassField, |p| {
                    parse_fn_args_body(
                        p,
                        // no decorator in an object literal
                        Vec::new(),
                        start,
                        parse_unique_formal_params,
                        false,
                        false,
                    )
                })
            })
            .map(|function| Box::new(Prop::Method(MethodProp { key, function })))
            .map(PropOrSpread::Prop);
    }

    let ident = match key {
        PropName::Ident(ident) => ident,
        // TODO
        _ => unexpected!(p, "identifier"),
    };

    if p.input_mut().eat(&P::Token::QUESTION) {
        p.emit_err(p.input().prev_span(), SyntaxError::TS1162);
    }

    // `ident` from parse_prop_name is parsed as 'IdentifierName'
    // It means we should check for invalid expressions like { for, }
    let cur = p.input().cur();
    if cur.is_equal() || cur.is_comma() || cur.is_rbrace() {
        if p.ctx().is_reserved_word(&ident.sym) {
            p.emit_err(ident.span, SyntaxError::ReservedWordInObjShorthandOrPat);
        }

        if p.input_mut().eat(&P::Token::EQUAL) {
            let value = p.allow_in_expr(parse_assignment_expr)?;
            let span = p.span(start);
            return Ok(PropOrSpread::Prop(Box::new(Prop::Assign(AssignProp {
                span,
                key: ident.into(),
                value,
            }))));
        }

        return Ok(PropOrSpread::Prop(Box::new(Prop::from(ident))));
    }

    // get a(){}
    // set a(v){}
    // async a(){}

    match &*ident.sym {
        "get" | "set" | "async" => {
            trace_cur!(p, parse_object_prop__after_accessor);

            if has_modifiers {
                p.emit_err(modifiers_span, SyntaxError::TS1042);
            }

            let is_generator = ident.sym == "async" && p.input_mut().eat(&P::Token::MUL);
            let key = p.parse_prop_name()?;
            let key_span = key.span();
            p.do_inside_of_context(Context::AllowDirectSuper, |p| {
                p.do_outside_of_context(Context::InClassField, |parser| {
                    match &*ident.sym {
                        "get" => parse_fn_args_body(
                            parser,
                            // no decorator in an object literal
                            Vec::new(),
                            start,
                            |p| {
                                let params = parse_formal_params(p)?;

                                if params.iter().any(is_not_this) {
                                    p.emit_err(key_span, SyntaxError::GetterParam);
                                }

                                Ok(params)
                            },
                            false,
                            false,
                        )
                        .map(|v| *v)
                        .map(
                            |Function {
                                 body, return_type, ..
                             }| {
                                if parser.input().syntax().typescript()
                                    && parser.input().target() == EsVersion::Es3
                                {
                                    parser.emit_err(key_span, SyntaxError::TS1056);
                                }

                                PropOrSpread::Prop(Box::new(Prop::Getter(GetterProp {
                                    span: parser.span(start),
                                    key,
                                    type_ann: return_type,
                                    body,
                                })))
                            },
                        ),
                        "set" => {
                            parse_fn_args_body(
                                parser,
                                // no decorator in an object literal
                                Vec::new(),
                                start,
                                |p| {
                                    let params = parse_formal_params(p)?;

                                    if params.iter().filter(|p| is_not_this(p)).count() != 1 {
                                        p.emit_err(key_span, SyntaxError::SetterParam);
                                    }

                                    if !params.is_empty() {
                                        if let Pat::Rest(..) = params[0].pat {
                                            p.emit_err(
                                                params[0].span(),
                                                SyntaxError::RestPatInSetter,
                                            );
                                        }
                                    }

                                    if p.input().syntax().typescript()
                                        && p.input().target() == EsVersion::Es3
                                    {
                                        p.emit_err(key_span, SyntaxError::TS1056);
                                    }

                                    Ok(params)
                                },
                                false,
                                false,
                            )
                            .map(|v| *v)
                            .map(
                                |Function {
                                     mut params, body, ..
                                 }| {
                                    let mut this = None;
                                    if params.len() >= 2 {
                                        this = Some(params.remove(0).pat);
                                    }

                                    let param = Box::new(
                                        params.into_iter().next().map(|v| v.pat).unwrap_or_else(
                                            || {
                                                parser.emit_err(key_span, SyntaxError::SetterParam);

                                                Invalid { span: DUMMY_SP }.into()
                                            },
                                        ),
                                    );

                                    // debug_assert_eq!(params.len(), 1);
                                    PropOrSpread::Prop(Box::new(Prop::Setter(SetterProp {
                                        span: parser.span(start),
                                        key,
                                        body,
                                        param,
                                        this_param: this,
                                    })))
                                },
                            )
                        }
                        "async" => parse_fn_args_body(
                            parser,
                            // no decorator in an object literal
                            Vec::new(),
                            start,
                            parse_unique_formal_params,
                            true,
                            is_generator,
                        )
                        .map(|function| {
                            PropOrSpread::Prop(Box::new(Prop::Method(MethodProp { key, function })))
                        }),
                        _ => unreachable!(),
                    }
                })
            })
        }
        _ => {
            if p.input().syntax().typescript() {
                unexpected!(
                    p,
                    "... , *,  (, [, :, , ?, =, an identifier, public, protected, private, \
                     readonly, <."
                )
            } else {
                unexpected!(p, "... , *,  (, [, :, , ?, = or an identifier")
            }
        }
    }
}

pub fn parse_object_expr<'a, P: Parser<'a>>(p: &mut P) -> PResult<Expr> {
    parse_object(p, parse_expr_object_prop, make_expr_object)
}
