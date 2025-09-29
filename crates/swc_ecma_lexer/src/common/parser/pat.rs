use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::*;

use super::{
    assign_target_or_spread::AssignTargetOrSpread,
    class_and_fn::{parse_access_modifier, parse_decorators},
    pat_type::PatType,
    typescript::{
        eat_any_ts_modifier, parse_ts_modifier, parse_ts_type_ann, try_parse_ts_type_ann,
    },
    PResult, Parser,
};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            buffer::Buffer, expr::parse_assignment_expr, expr_ext::ExprExt,
            ident::parse_binding_ident, object::parse_object_pat,
        },
    },
    error::SyntaxError,
};

/// argument of arrow is pattern, although idents in pattern is already
/// checked if is a keyword, it should also be checked if is arguments or
/// eval
fn pat_is_valid_argument_in_strict<'a>(p: &mut impl Parser<'a>, pat: &Pat) {
    debug_assert!(p.ctx().contains(Context::Strict));
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
                    #[cfg(swc_ast_unknown)]
                    _ => (),
                }
            }
        }
        Pat::Assign(a) => pat_is_valid_argument_in_strict(p, &a.left),
        Pat::Invalid(_) | Pat::Expr(_) => (),
        #[cfg(swc_ast_unknown)]
        _ => (),
    }
}

/// This does not return 'rest' pattern because non-last parameter cannot be
/// rest.
pub(super) fn reparse_expr_as_pat<'a>(
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
                    #[cfg(swc_ast_unknown)]
                    _ => unreachable!(),
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

                            #[cfg(swc_ast_unknown)]
                            _ => unreachable!(),
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

pub(super) fn parse_binding_element<'a, P: Parser<'a>>(p: &mut P) -> PResult<Pat> {
    trace_cur!(p, parse_binding_element);

    let start = p.cur_pos();
    let left = parse_binding_pat_or_ident(p, false)?;

    if p.input_mut().eat(&P::Token::EQUAL) {
        let right = p.allow_in_expr(parse_assignment_expr)?;

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

    let cur = p.input().cur();
    if cur.is_word() {
        parse_binding_ident(p, disallow_let).map(Pat::from)
    } else if cur.is_lbracket() {
        parse_array_binding_pat(p)
    } else if cur.is_lbrace() {
        parse_object_pat(p)
    } else if cur.is_error() {
        let err = p.input_mut().expect_error_token_and_bump();
        Err(err)
    } else {
        unexpected!(p, "yield, an identifier, [ or {")
    }
}

pub fn parse_array_binding_pat<'a, P: Parser<'a>>(p: &mut P) -> PResult<Pat> {
    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::LBRACKET);

    let mut elems = Vec::new();

    let mut rest_span = Span::default();

    while !p.input().is(&P::Token::RBRACKET) {
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

        if !p.input().is(&P::Token::RBRACKET) {
            expect!(p, &P::Token::COMMA);
            if is_rest && p.input().is(&P::Token::RBRACKET) {
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

/// spec: 'FormalParameter'
///
/// babel: `parseAssignableListItem`
fn parse_formal_param_pat<'a, P: Parser<'a>>(p: &mut P) -> PResult<Pat> {
    let start = p.cur_pos();

    let has_modifier = eat_any_ts_modifier(p)?;

    let pat_start = p.cur_pos();
    let mut pat = parse_binding_element(p)?;
    let mut opt = false;

    if p.input().syntax().typescript() {
        if p.input_mut().eat(&P::Token::QUESTION) {
            match pat {
                Pat::Ident(BindingIdent {
                    id: Ident {
                        ref mut optional, ..
                    },
                    ..
                })
                | Pat::Array(ArrayPat {
                    ref mut optional, ..
                })
                | Pat::Object(ObjectPat {
                    ref mut optional, ..
                }) => {
                    *optional = true;
                    opt = true;
                }
                _ if p.input().syntax().dts() || p.ctx().contains(Context::InDeclare) => {}
                _ => {
                    syntax_error!(
                        p,
                        p.input().prev_span(),
                        SyntaxError::TsBindingPatCannotBeOptional
                    );
                }
            }
        }

        match pat {
            Pat::Array(ArrayPat {
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

            Pat::Ident(BindingIdent {
                ref mut type_ann, ..
            }) => {
                let new_type_ann = try_parse_ts_type_ann(p)?;
                *type_ann = new_type_ann;
            }

            Pat::Assign(AssignPat { ref mut span, .. }) => {
                if (try_parse_ts_type_ann(p)?).is_some() {
                    *span = Span::new_with_checked(pat_start, p.input().prev_span().hi);
                    p.emit_err(*span, SyntaxError::TSTypeAnnotationAfterAssign);
                }
            }
            Pat::Invalid(..) => {}
            _ => unreachable!("invalid syntax: Pat: {:?}", pat),
        }
    }

    let pat = if p.input_mut().eat(&P::Token::EQUAL) {
        // `=` cannot follow optional parameter.
        if opt {
            p.emit_err(pat.span(), SyntaxError::TS1015);
        }

        let right = parse_assignment_expr(p)?;
        if p.ctx().contains(Context::InDeclare) {
            p.emit_err(p.span(start), SyntaxError::TS2371);
        }

        AssignPat {
            span: p.span(start),
            left: Box::new(pat),
            right,
        }
        .into()
    } else {
        pat
    };

    if has_modifier {
        p.emit_err(p.span(start), SyntaxError::TS2369);
        return Ok(pat);
    }

    Ok(pat)
}

fn parse_constructor_param<'a, P: Parser<'a>>(
    p: &mut P,
    param_start: BytePos,
    decorators: Vec<Decorator>,
) -> PResult<ParamOrTsParamProp> {
    let (accessibility, is_override, readonly) = if p.input().syntax().typescript() {
        let accessibility = parse_access_modifier(p)?;
        (
            accessibility,
            parse_ts_modifier(p, &["override"], false)?.is_some(),
            parse_ts_modifier(p, &["readonly"], false)?.is_some(),
        )
    } else {
        (None, false, false)
    };
    if accessibility.is_none() && !is_override && !readonly {
        let pat = parse_formal_param_pat(p)?;
        Ok(ParamOrTsParamProp::Param(Param {
            span: p.span(param_start),
            decorators,
            pat,
        }))
    } else {
        let param = match parse_formal_param_pat(p)? {
            Pat::Ident(i) => TsParamPropParam::Ident(i),
            Pat::Assign(a) => TsParamPropParam::Assign(a),
            node => syntax_error!(p, node.span(), SyntaxError::TsInvalidParamPropPat),
        };
        Ok(ParamOrTsParamProp::TsParamProp(TsParamProp {
            span: p.span(param_start),
            accessibility,
            is_override,
            readonly,
            decorators,
            param,
        }))
    }
}

pub fn parse_constructor_params<'a, P: Parser<'a>>(p: &mut P) -> PResult<Vec<ParamOrTsParamProp>> {
    let mut params = Vec::new();
    let mut rest_span = Span::default();

    while !p.input().is(&P::Token::RPAREN) {
        if !rest_span.is_dummy() {
            p.emit_err(rest_span, SyntaxError::TS1014);
        }

        let param_start = p.cur_pos();
        let decorators = parse_decorators(p, false)?;
        let pat_start = p.cur_pos();

        let mut is_rest = false;
        if p.input_mut().eat(&P::Token::DOTDOTDOT) {
            is_rest = true;
            let dot3_token = p.span(pat_start);

            let pat = parse_binding_pat_or_ident(p, false)?;
            let type_ann = if p.input().syntax().typescript() && p.input().is(&P::Token::COLON) {
                let cur_pos = p.cur_pos();
                Some(parse_ts_type_ann(p, /* eat_colon */ true, cur_pos)?)
            } else {
                None
            };

            rest_span = p.span(pat_start);
            let pat = RestPat {
                span: rest_span,
                dot3_token,
                arg: Box::new(pat),
                type_ann,
            }
            .into();
            params.push(ParamOrTsParamProp::Param(Param {
                span: p.span(param_start),
                decorators,
                pat,
            }));
        } else {
            params.push(parse_constructor_param(p, param_start, decorators)?);
        }

        if !p.input().is(&P::Token::RPAREN) {
            expect!(p, &P::Token::COMMA);
            if p.input().is(&P::Token::RPAREN) && is_rest {
                p.emit_err(p.input().prev_span(), SyntaxError::CommaAfterRestElement);
            }
        }
    }

    Ok(params)
}

pub fn parse_formal_params<'a, P: Parser<'a>>(p: &mut P) -> PResult<Vec<Param>> {
    let mut params = Vec::new();
    let mut rest_span = Span::default();

    while !p.input().is(&P::Token::RPAREN) {
        if !rest_span.is_dummy() {
            p.emit_err(rest_span, SyntaxError::TS1014);
        }

        let param_start = p.cur_pos();
        let decorators = parse_decorators(p, false)?;
        let pat_start = p.cur_pos();

        let pat = if p.input_mut().eat(&P::Token::DOTDOTDOT) {
            let dot3_token = p.span(pat_start);

            let mut pat = parse_binding_pat_or_ident(p, false)?;

            if p.input_mut().eat(&P::Token::EQUAL) {
                let right = parse_assignment_expr(p)?;
                p.emit_err(pat.span(), SyntaxError::TS1048);
                pat = AssignPat {
                    span: p.span(pat_start),
                    left: Box::new(pat),
                    right,
                }
                .into();
            }

            let type_ann = if p.input().syntax().typescript() && p.input().is(&P::Token::COLON) {
                let cur_pos = p.cur_pos();
                let ty = parse_ts_type_ann(p, /* eat_colon */ true, cur_pos)?;
                Some(ty)
            } else {
                None
            };

            rest_span = p.span(pat_start);
            let pat = RestPat {
                span: rest_span,
                dot3_token,
                arg: Box::new(pat),
                type_ann,
            }
            .into();

            if p.syntax().typescript() && p.input_mut().eat(&P::Token::QUESTION) {
                p.emit_err(p.input().prev_span(), SyntaxError::TS1047);
                //
            }

            pat
        } else {
            parse_formal_param_pat(p)?
        };
        let is_rest = matches!(pat, Pat::Rest(_));

        params.push(Param {
            span: p.span(param_start),
            decorators,
            pat,
        });

        if !p.input().is(&P::Token::RPAREN) {
            expect!(p, &P::Token::COMMA);
            if is_rest && p.input().is(&P::Token::RPAREN) {
                p.emit_err(p.input().prev_span(), SyntaxError::CommaAfterRestElement);
            }
        }
    }

    Ok(params)
}

pub fn parse_unique_formal_params<'a>(p: &mut impl Parser<'a>) -> PResult<Vec<Param>> {
    // FIXME: This is wrong
    parse_formal_params(p)
}

pub(super) fn parse_paren_items_as_params<'a, P: Parser<'a>>(
    p: &mut P,
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
                p.emit_err(expr.span(), SyntaxError::TS1014)
            }
            AssignTargetOrSpread::ExprOrSpread(ExprOrSpread {
                spread: None, expr, ..
            }) => params.push(reparse_expr_as_pat(p, pat_ty, expr)?),
            AssignTargetOrSpread::Pat(pat) => params.push(pat),
        }
    }

    debug_assert_eq!(exprs.len(), 1);
    let expr = exprs.pop().unwrap();
    let outer_expr_span = expr.span();
    let last = match expr {
        // Rest
        AssignTargetOrSpread::ExprOrSpread(ExprOrSpread {
            spread: Some(dot3_token),
            expr,
        }) => {
            if let Expr::Assign(_) = *expr {
                p.emit_err(outer_expr_span, SyntaxError::TS1048)
            };
            if let Some(trailing_comma) = trailing_comma {
                p.emit_err(trailing_comma, SyntaxError::CommaAfterRestElement);
            }
            let expr_span = expr.span();
            reparse_expr_as_pat(p, pat_ty, expr).map(|pat| {
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
            reparse_expr_as_pat(p, pat_ty, expr)?
        }
        AssignTargetOrSpread::Pat(pat) => {
            if let Some(trailing_comma) = trailing_comma {
                if let Pat::Rest(..) = pat {
                    p.emit_err(trailing_comma, SyntaxError::CommaAfterRestElement);
                }
            }
            pat
        }
    };
    params.push(last);

    if p.ctx().contains(Context::Strict) {
        for param in params.iter() {
            pat_is_valid_argument_in_strict(p, param)
        }
    }
    Ok(params)
}
