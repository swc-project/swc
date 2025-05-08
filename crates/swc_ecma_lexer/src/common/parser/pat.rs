use swc_common::{Span, Spanned};
use swc_ecma_ast::*;

use super::{pat_type::PatType, PResult, Parser};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            buffer::Buffer, expr_ext::ExprExt, ident::parse_binding_ident, object::parse_object_pat,
        },
    },
    error::SyntaxError,
};

/// argument of arrow is pattern, although idents in pattern is already
/// checked if is a keyword, it should also be checked if is arguments or
/// eval
pub(super) fn pat_is_valid_argument_in_strict<'a>(p: &mut impl Parser<'a>, pat: &Pat) {
    match pat {
        Pat::Ident(i) => {
            if i.is_reserved_in_strict_bind() {
                p.emit_strict_mode_err(i.span, SyntaxError::EvalAndArgumentsInStrict)
            }
        }
        Pat::Array(arr) => {
            for pat in arr.elems.iter().flatten() {
                pat_is_valid_argument_in_strict(p, pat)
            }
        }
        Pat::Rest(r) => pat_is_valid_argument_in_strict(p, &r.arg),
        Pat::Object(obj) => {
            for prop in obj.props.iter() {
                match prop {
                    ObjectPatProp::KeyValue(KeyValuePatProp { value, .. })
                    | ObjectPatProp::Rest(RestPat { arg: value, .. }) => {
                        pat_is_valid_argument_in_strict(p, value)
                    }
                    ObjectPatProp::Assign(AssignPatProp { key, .. }) => {
                        if key.is_reserved_in_strict_bind() {
                            p.emit_strict_mode_err(key.span, SyntaxError::EvalAndArgumentsInStrict)
                        }
                    }
                }
            }
        }
        Pat::Assign(a) => pat_is_valid_argument_in_strict(p, &a.left),
        Pat::Invalid(_) | Pat::Expr(_) => (),
    }
}

/// This does not return 'rest' pattern because non-last parameter cannot be
/// rest.
pub fn reparse_expr_as_pat<'a>(
    p: &mut impl Parser<'a>,
    pat_ty: PatType,
    expr: Box<Expr>,
) -> PResult<Pat> {
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
                p.check_assign_target(&expr, true);
            }
        }
    }
    reparse_expr_as_pat_inner(p, pat_ty, expr)
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
                        Box::new(reparse_expr_as_pat(p, pat_ty, left.into())?)
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
                                        value: Box::new(reparse_expr_as_pat(
                                            p,
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
                                    reparse_expr_as_pat(p, element_pat_ty, expr)?
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
                        params.push(reparse_expr_as_pat(p, pat_ty.element(), expr).map(Some)?)
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
                        reparse_expr_as_pat(p, pat_ty.element(), expr)
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
                        reparse_expr_as_pat(p, pat_ty.element(), expr).map(Some)?
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

pub fn parse_binding_element<'a, P: Parser<'a>>(p: &mut P) -> PResult<Pat> {
    trace_cur!(p, parse_binding_element);

    let start = p.cur_pos();
    let left = parse_binding_pat_or_ident(p, false)?;

    if p.input_mut().eat(&P::Token::EQUAL) {
        let right = p.include_in_expr(true).parse_assignment_expr()?;

        if p.ctx().contains(Context::InDeclare) {
            p.emit_err(p.span(start), SyntaxError::TS2371);
        }

        return Ok(AssignPat {
            span: p.span(start),
            left: Box::new(left),
            right,
        }
        .into());
    }

    Ok(left)
}

pub fn parse_binding_pat_or_ident<'a, P: Parser<'a>>(
    p: &mut P,
    disallow_let: bool,
) -> PResult<Pat> {
    trace_cur!(p, parse_binding_pat_or_ident);

    let cur = cur!(p, true);
    if cur.is_yield() || cur.is_word() {
        parse_binding_ident(p, disallow_let).map(Pat::from)
    } else if cur.is_lbracket() {
        parse_array_binding_pat(p)
    } else if cur.is_lbrace() {
        parse_object_pat(p)
    } else {
        unexpected!(p, "yield, an identifier, [ or {")
    }
}

pub fn parse_array_binding_pat<'a, P: Parser<'a>>(p: &mut P) -> PResult<Pat> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::LBRACKET)?;

    let mut elems = Vec::new();

    let mut rest_span = Span::default();

    while !eof!(p) && !p.input_mut().is(&P::Token::RBRACKET) {
        if p.input_mut().eat(&P::Token::COMMA) {
            elems.push(None);
            continue;
        }

        if !rest_span.is_dummy() {
            p.emit_err(rest_span, SyntaxError::NonLastRestParam);
        }

        let start = p.cur_pos();

        let mut is_rest = false;
        if p.input_mut().eat(&P::Token::DOTDOTDOT) {
            is_rest = true;
            let dot3_token = p.span(start);

            let pat = parse_binding_pat_or_ident(p, false)?;
            rest_span = p.span(start);
            let pat = RestPat {
                span: rest_span,
                dot3_token,
                arg: Box::new(pat),
                type_ann: None,
            }
            .into();
            elems.push(Some(pat));
        } else {
            elems.push(parse_binding_element(p).map(Some)?);
        }

        if !p.input_mut().is(&P::Token::RBRACKET) {
            expect!(p, &P::Token::COMMA);
            if is_rest && p.input_mut().is(&P::Token::RBRACKET) {
                p.emit_err(p.input().prev_span(), SyntaxError::CommaAfterRestElement);
            }
        }
    }

    expect!(p, &P::Token::RBRACKET);
    let optional = (p.input().syntax().dts() || p.ctx().contains(Context::InDeclare))
        && p.input_mut().eat(&P::Token::QUESTION);

    Ok(ArrayPat {
        span: p.span(start),
        elems,
        optional,
        type_ann: None,
    }
    .into())
}
