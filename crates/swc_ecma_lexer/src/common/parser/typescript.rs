use std::ops::DerefMut;

use swc_atoms::atom;
use swc_common::{BytePos, Span};
use swc_ecma_ast::{
    Callee, Expr, Ident, Lit, Str, TplElement, TsEntityName, TsEnumDecl, TsEnumMember,
    TsEnumMemberId, TsExprWithTypeArgs, TsIntersectionType, TsLit, TsLitType, TsQualifiedName,
    TsThisType, TsThisTypeOrIdent, TsTplLitType, TsType, TsTypeAnn, TsTypeParam, TsTypeParamDecl,
    TsTypeParamInstantiation, TsTypePredicate, TsTypeRef, TsUnionOrIntersectionType, TsUnionType,
};

use super::{PResult, Parser};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            buffer::Buffer,
            expr::{parse_lit, parse_subscripts},
            ident::parse_ident_name,
        },
    },
    error::SyntaxError,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ParsingContext {
    EnumMembers,
    HeritageClauseElement,
    TupleElementTypes,
    TypeMembers,
    TypeParametersOrArguments,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum UnionOrIntersection {
    Union,
    Intersection,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum SignatureParsingMode {
    TSCallSignatureDeclaration,
    TSConstructSignatureDeclaration,
}

/// `tsParseList`
pub fn parse_ts_list<'a, P: Parser<'a>, T, F>(
    p: &mut P,
    kind: ParsingContext,
    mut parse_element: F,
) -> PResult<Vec<T>>
where
    F: FnMut(&mut P) -> PResult<T>,
{
    debug_assert!(p.input().syntax().typescript());
    let mut buf = Vec::with_capacity(8);
    while !is_ts_list_terminator(p, kind)? {
        // Skipping "parseListElement" from the TS source since that's just for error
        // handling.
        buf.push(parse_element(p)?);
    }
    Ok(buf)
}

/// `tsTryParse`
pub(super) fn try_parse_ts_bool<'a, P: Parser<'a>, F>(p: &mut P, op: F) -> PResult<bool>
where
    F: FnOnce(&mut P) -> PResult<Option<bool>>,
{
    if !p.input().syntax().typescript() {
        return Ok(false);
    }
    let prev_ignore_error = p.input().get_ctx().contains(Context::IgnoreError);
    let mut cloned = p.clone();
    cloned.set_ctx(p.ctx() | Context::IgnoreError);
    let res = op(&mut cloned);
    match res {
        Ok(Some(res)) if res => {
            *p = cloned;
            let mut ctx = p.ctx();
            ctx.set(Context::IgnoreError, prev_ignore_error);
            p.input_mut().set_ctx(ctx);
            Ok(res)
        }
        Err(..) => Ok(false),
        _ => Ok(false),
    }
}

/// `tsParseDelimitedList`
fn parse_ts_delimited_list_inner<'a, P: Parser<'a>, T, F>(
    p: &mut P,
    kind: ParsingContext,
    mut parse_element: F,
) -> PResult<Vec<T>>
where
    F: FnMut(&mut P) -> PResult<(BytePos, T)>,
{
    debug_assert!(p.input().syntax().typescript());
    let mut buf = Vec::new();
    loop {
        trace_cur!(p, parse_ts_delimited_list_inner__element);

        if is_ts_list_terminator(p, kind)? {
            break;
        }

        let (_, element) = parse_element(p)?;
        buf.push(element);

        if p.input_mut().eat(&P::Token::COMMA) {
            continue;
        }

        if is_ts_list_terminator(p, kind)? {
            break;
        }

        if kind == ParsingContext::EnumMembers {
            let expect = P::Token::COMMA;
            let cur = cur!(p, false);
            let cur = match cur.ok() {
                Some(tok) => tok.clone().to_string(p.input()),
                None => "EOF".to_string(),
            };
            p.emit_err(
                p.input().cur_span(),
                SyntaxError::Expected(format!("{expect:?}"), cur),
            );
            continue;
        }
        // This will fail with an error about a missing comma
        expect!(p, &P::Token::COMMA);
    }

    Ok(buf)
}

/// In no lexer context
fn ts_in_no_context<'a, P: Parser<'a>, T, F>(p: &mut P, op: F) -> PResult<T>
where
    F: FnOnce(&mut P) -> PResult<T>,
{
    debug_assert!(p.input().syntax().typescript());
    trace_cur!(p, ts_in_no_context__before);
    let saved = std::mem::take(p.input_mut().token_context_mut());
    p.input_mut().token_context_mut().push(saved.0[0]);
    debug_assert_eq!(p.input().token_context().len(), 1);
    let res = op(p);
    p.input_mut().set_token_context(saved);
    trace_cur!(p, ts_in_no_context__after);
    res
}

/// `tsIsListTerminator`
pub fn is_ts_list_terminator<'a>(p: &mut impl Parser<'a>, kind: ParsingContext) -> PResult<bool> {
    debug_assert!(p.input().syntax().typescript());
    let Some(cur) = p.input_mut().cur() else {
        return Ok(false);
    };
    Ok(match kind {
        ParsingContext::EnumMembers | ParsingContext::TypeMembers => cur.is_rbrace(),
        ParsingContext::HeritageClauseElement => {
            cur.is_lbrace() || cur.is_implements() || cur.is_extends()
        }
        ParsingContext::TupleElementTypes => cur.is_rbracket(),
        ParsingContext::TypeParametersOrArguments => cur.is_greater(),
    })
}

/// `tsNextTokenCanFollowModifier`
pub(super) fn ts_next_token_can_follow_modifier<'a>(p: &mut impl Parser<'a>) -> PResult<bool> {
    debug_assert!(p.input().syntax().typescript());
    // Note: TypeScript's implementation is much more complicated because
    // more things are considered modifiers there.
    // This implementation only handles modifiers not handled by @babel/parser
    // itself. And "static". TODO: Would be nice to avoid lookahead. Want a
    // hasLineBreakUpNext() method...
    p.bump();
    Ok(!p.input_mut().had_line_break_before_cur()
        && p.input_mut().cur().is_some_and(|cur| {
            cur.is_lbracket()
                || cur.is_lbrace()
                || cur.is_star()
                || cur.is_dotdotdot()
                || cur.is_hash()
                || cur.is_word()
                || cur.is_str()
                || cur.is_num()
                || cur.is_bigint()
        }))
}

/// `tsTryParse`
pub fn try_parse_ts<'a, P: Parser<'a>, T, F>(p: &mut P, op: F) -> Option<T>
where
    F: FnOnce(&mut P) -> PResult<Option<T>>,
{
    if !p.input().syntax().typescript() {
        return None;
    }
    debug_tracing!(p, "try_parse_ts");

    trace_cur!(p, try_parse_ts);

    let prev_ignore_error = p.input().get_ctx().contains(Context::IgnoreError);
    let mut cloned = p.clone();
    cloned.set_ctx(p.ctx() | Context::IgnoreError);
    let res = op(&mut cloned);
    match res {
        Ok(Some(res)) => {
            *p = cloned;
            trace_cur!(p, try_parse_ts__success_value);
            let mut ctx = p.ctx();
            ctx.set(Context::IgnoreError, prev_ignore_error);
            p.input_mut().set_ctx(ctx);
            Some(res)
        }
        Ok(None) => {
            trace_cur!(p, try_parse_ts__success_no_value);
            None
        }
        Err(..) => {
            trace_cur!(p, try_parse_ts__fail);
            None
        }
    }
}

/// `tsParseTypeMemberSemicolon`
pub fn parse_ts_type_member_semicolon<'a, P: Parser<'a>>(p: &mut P) -> PResult<()> {
    debug_assert!(p.input().syntax().typescript());

    if !p.input_mut().eat(&P::Token::COMMA) {
        p.expect_general_semi()
    } else {
        Ok(())
    }
}

/// `tsIsStartOfConstructSignature`
pub fn is_ts_start_of_construct_signature<'a, P: Parser<'a>>(p: &mut P) -> PResult<bool> {
    debug_assert!(p.input().syntax().typescript());

    p.bump();
    let Some(cur) = p.input_mut().cur() else {
        return Ok(false);
    };
    Ok(cur.is_lparen() || cur.is_less())
}

/// `tsParseDelimitedList`
fn parse_ts_delimited_list<'a, P: Parser<'a>, T, F>(
    p: &mut P,
    kind: ParsingContext,
    mut parse_element: F,
) -> PResult<Vec<T>>
where
    F: FnMut(&mut P) -> PResult<T>,
{
    parse_ts_delimited_list_inner(p, kind, |p| {
        let start = p.input_mut().cur_pos();
        Ok((start, parse_element(p)?))
    })
}

/// `tsParseUnionOrIntersectionType`
pub fn parse_ts_union_or_intersection_type<'a, P: Parser<'a>, F>(
    p: &mut P,
    kind: UnionOrIntersection,
    mut parse_constituent_type: F,
    operator: &P::Token,
) -> PResult<Box<TsType>>
where
    F: FnMut(&mut P) -> PResult<Box<TsType>>,
{
    trace_cur!(p, parse_ts_union_or_intersection_type);

    debug_assert!(p.input().syntax().typescript());

    let start = p.input_mut().cur_pos(); // include the leading operator in the start
    p.input_mut().eat(operator);
    trace_cur!(p, parse_ts_union_or_intersection_type__first_type);

    let ty = parse_constituent_type(p)?;
    trace_cur!(p, parse_ts_union_or_intersection_type__after_first);

    if p.input_mut().is(operator) {
        let mut types = vec![ty];

        while p.input_mut().eat(operator) {
            trace_cur!(p, parse_ts_union_or_intersection_type__constituent);

            types.push(parse_constituent_type(p)?);
        }

        return Ok(Box::new(TsType::TsUnionOrIntersectionType(match kind {
            UnionOrIntersection::Union => TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                span: p.span(start),
                types,
            }),
            UnionOrIntersection::Intersection => {
                TsUnionOrIntersectionType::TsIntersectionType(TsIntersectionType {
                    span: p.span(start),
                    types,
                })
            }
        })));
    }
    Ok(ty)
}

pub fn eat_any_ts_modifier<'a>(p: &mut impl Parser<'a>) -> PResult<bool> {
    if p.syntax().typescript()
        && {
            let cur = cur!(p, false)?;
            cur.is_public() || cur.is_protected() || cur.is_private() || cur.is_readonly()
        }
        && peek!(p).is_some_and(|t| t.is_word() || t.is_lbrace() || t.is_lbracket())
    {
        let _ = parse_ts_modifier(p, &["public", "protected", "private", "readonly"], false);
        Ok(true)
    } else {
        Ok(false)
    }
}

/// Parses a modifier matching one the given modifier names.
///
/// `tsParseModifier`
pub fn parse_ts_modifier<'a, P: Parser<'a>>(
    p: &mut P,
    allowed_modifiers: &[&'static str],
    stop_on_start_of_class_static_blocks: bool,
) -> PResult<Option<&'static str>> {
    if !p.input().syntax().typescript() {
        return Ok(None);
    }
    let pos = {
        let cur = cur!(p, true);
        let modifier = if cur.is_unknown_ident() {
            cur.clone().take_unknown_ident_ref(p.input_mut()).clone()
        } else if cur.is_known_ident() {
            cur.take_known_ident()
        } else if cur.is_in() {
            atom!("in")
        } else if cur.is_const() {
            atom!("const")
        } else {
            return Ok(None);
        };
        // TODO: compare atom rather than string.
        allowed_modifiers
            .iter()
            .position(|s| **s == *modifier.as_str())
    };
    if let Some(pos) = pos {
        if stop_on_start_of_class_static_blocks
            && p.input_mut().is(&P::Token::STATIC)
            && peek!(p).is_some_and(|peek| peek.is_lbrace())
        {
            return Ok(None);
        }
        if try_parse_ts_bool(p, |p| ts_next_token_can_follow_modifier(p).map(Some))? {
            return Ok(Some(allowed_modifiers[pos]));
        }
    }
    Ok(None)
}

pub fn parse_ts_bracketed_list<'a, P: Parser<'a>, T, F>(
    p: &mut P,
    kind: ParsingContext,
    parse_element: F,
    bracket: bool,
    skip_first_token: bool,
) -> PResult<Vec<T>>
where
    F: FnMut(&mut P) -> PResult<T>,
{
    debug_assert!(p.input().syntax().typescript());
    if !skip_first_token {
        if bracket {
            expect!(p, &P::Token::LBRACKET);
        } else {
            expect!(p, &P::Token::LESS);
        }
    }
    let result = parse_ts_delimited_list(p, kind, parse_element)?;
    if bracket {
        expect!(p, &P::Token::RBRACKET);
    } else {
        expect!(p, &P::Token::GREATER);
    }
    Ok(result)
}

/// `tsParseThisTypeNode`
pub fn parse_ts_this_type_node<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsThisType> {
    debug_assert!(p.input().syntax().typescript());
    expect!(p, &P::Token::THIS);
    Ok(TsThisType {
        span: p.input().prev_span(),
    })
}

/// `tsParseEntityName`
pub fn parse_ts_entity_name<'a, P: Parser<'a>>(
    p: &mut P,
    allow_reserved_words: bool,
) -> PResult<TsEntityName> {
    debug_assert!(p.input().syntax().typescript());
    trace_cur!(p, parse_ts_entity_name);
    let start = p.input_mut().cur_pos();
    let init = parse_ident_name(p)?;
    if &*init.sym == "void" {
        let dot_start = p.input_mut().cur_pos();
        let dot_span = p.span(dot_start);
        p.emit_err(dot_span, SyntaxError::TS1005)
    }
    let mut entity = TsEntityName::Ident(init.into());
    while p.input_mut().eat(&P::Token::DOT) {
        let dot_start = p.input_mut().cur_pos();
        let Some(cur) = p.input_mut().cur() else {
            p.emit_err(Span::new(dot_start, dot_start), SyntaxError::TS1003);
            return Ok(entity);
        };
        if !cur.is_hash() && !cur.is_word() {
            p.emit_err(Span::new(dot_start, dot_start), SyntaxError::TS1003);
            return Ok(entity);
        }
        let left = entity;
        let right = if allow_reserved_words {
            parse_ident_name(p)?
        } else {
            p.parse_ident(false, false)?.into()
        };
        let span = p.span(start);
        entity = TsEntityName::TsQualifiedName(Box::new(TsQualifiedName { span, left, right }));
    }
    Ok(entity)
}

pub fn ts_look_ahead<'a, P: Parser<'a>, T, F>(p: &mut P, op: F) -> PResult<T>
where
    F: FnOnce(&mut P) -> PResult<T>,
{
    debug_assert!(p.input().syntax().typescript());
    let mut cloned = p.clone();
    cloned.set_ctx(p.ctx() | Context::IgnoreError);
    op(&mut cloned)
}

/// `tsParseTypeArguments`
pub fn parse_ts_type_args<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<TsTypeParamInstantiation>> {
    trace_cur!(p, parse_ts_type_args);
    debug_assert!(p.input().syntax().typescript());

    let start = p.input_mut().cur_pos();
    let params = p.in_type().parse_with(|p| {
        // Temporarily remove a JSX parsing context, which makes us scan different
        // tokens.
        ts_in_no_context(p, |p| {
            if p.input_mut().is(&P::Token::LSHIFT) {
                p.input_mut().cut_lshift();
            } else {
                expect!(p, &P::Token::LESS);
            }
            parse_ts_delimited_list(p, ParsingContext::TypeParametersOrArguments, |p| {
                trace_cur!(p, parse_ts_type_args__arg);

                p.parse_ts_type()
            })
        })
    })?;
    // This reads the next token after the `>` too, so do this in the enclosing
    // context. But be sure not to parse a regex in the jsx expression
    // `<C<number> />`, so set exprAllowed = false
    p.input_mut().set_expr_allowed(false);
    expect!(p, &P::Token::GREATER);
    Ok(Box::new(TsTypeParamInstantiation {
        span: p.span(start),
        params,
    }))
}

/// `tsParseTypeReference`
pub fn parse_ts_type_ref<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsTypeRef> {
    trace_cur!(p, parse_ts_type_ref);
    debug_assert!(p.input().syntax().typescript());

    let start = p.input_mut().cur_pos();

    let has_modifier = eat_any_ts_modifier(p)?;

    let type_name = parse_ts_entity_name(p, /* allow_reserved_words */ true)?;
    trace_cur!(p, parse_ts_type_ref__type_args);
    let type_params =
        if !p.input_mut().had_line_break_before_cur() && p.input_mut().is(&P::Token::LESS) {
            Some(parse_ts_type_args(
                p.with_ctx(p.ctx() & !Context::ShouldNotLexLtOrGtAsType)
                    .deref_mut(),
            )?)
        } else {
            None
        };

    if has_modifier {
        p.emit_err(p.span(start), SyntaxError::TS2369);
    }

    Ok(TsTypeRef {
        span: p.span(start),
        type_name,
        type_params,
    })
}

#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub fn parse_ts_type_ann<'a, P: Parser<'a>>(
    p: &mut P,
    eat_colon: bool,
    start: BytePos,
) -> PResult<Box<TsTypeAnn>> {
    trace_cur!(p, parse_ts_type_ann);

    debug_assert!(p.input().syntax().typescript());

    p.in_type().parse_with(|p| {
        if eat_colon {
            p.assert_and_bump(&P::Token::COLON)?;
        }

        trace_cur!(p, parse_ts_type_ann__after_colon);

        let type_ann = p.parse_ts_type()?;

        Ok(Box::new(TsTypeAnn {
            span: p.span(start),
            type_ann,
        }))
    })
}

/// `tsParseThisTypePredicate`
pub fn parse_ts_this_type_predicate<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    has_asserts_keyword: bool,
    lhs: TsThisType,
) -> PResult<TsTypePredicate> {
    debug_assert!(p.input().syntax().typescript());

    let param_name = TsThisTypeOrIdent::TsThisType(lhs);
    let type_ann = if p.input_mut().eat(&P::Token::IS) {
        let cur_pos = p.input_mut().cur_pos();
        Some(parse_ts_type_ann(
            p, // eat_colon
            false, cur_pos,
        )?)
    } else {
        None
    };

    Ok(TsTypePredicate {
        span: p.span(start),
        asserts: has_asserts_keyword,
        param_name,
        type_ann,
    })
}

/// `tsEatThenParseType`
fn eat_then_parse_ts_type<'a, P: Parser<'a>>(
    p: &mut P,
    token_to_eat: &P::Token,
) -> PResult<Option<Box<TsType>>> {
    if !cfg!(feature = "typescript") {
        return Ok(Default::default());
    }

    p.in_type().parse_with(|p| {
        if !p.input_mut().eat(token_to_eat) {
            return Ok(None);
        }

        p.parse_ts_type().map(Some)
    })
}

/// `tsExpectThenParseType`
pub fn expect_then_parse_ts_type<'a, P: Parser<'a>>(
    p: &mut P,
    token: &P::Token,
    token_str: &'static str,
) -> PResult<Box<TsType>> {
    debug_assert!(p.input().syntax().typescript());

    p.in_type().parse_with(|p| {
        if !p.input_mut().eat(token) {
            let got = format!("{:?}", cur!(p, false).ok());
            syntax_error!(
                p,
                p.input().cur_span(),
                SyntaxError::Unexpected {
                    got,
                    expected: token_str
                }
            );
        }

        p.parse_ts_type()
    })
}

/// `tsParseMappedTypeParameter`
pub fn parse_ts_mapped_type_param<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsTypeParam> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.input_mut().cur_pos();
    let name = parse_ident_name(p)?;
    let constraint = Some(expect_then_parse_ts_type(p, &P::Token::IN, "in")?);

    Ok(TsTypeParam {
        span: p.span(start),
        name: name.into(),
        is_in: false,
        is_out: false,
        is_const: false,
        constraint,
        default: None,
    })
}

/// `tsParseTypeParameter`
fn parse_ts_type_param<'a, P: Parser<'a>>(
    p: &mut P,
    permit_in_out: bool,
    permit_const: bool,
) -> PResult<TsTypeParam> {
    debug_assert!(p.input().syntax().typescript());

    let mut is_in = false;
    let mut is_out = false;
    let mut is_const = false;

    let start = p.input_mut().cur_pos();

    while let Some(modifer) = parse_ts_modifier(
        p,
        &[
            "public",
            "private",
            "protected",
            "readonly",
            "abstract",
            "const",
            "override",
            "in",
            "out",
        ],
        false,
    )? {
        match modifer {
            "const" => {
                is_const = true;
                if !permit_const {
                    p.emit_err(p.input().prev_span(), SyntaxError::TS1277("const".into()));
                }
            }
            "in" => {
                if !permit_in_out {
                    p.emit_err(p.input().prev_span(), SyntaxError::TS1274("in".into()));
                } else if is_in {
                    p.emit_err(p.input().prev_span(), SyntaxError::TS1030("in".into()));
                } else if is_out {
                    p.emit_err(
                        p.input().prev_span(),
                        SyntaxError::TS1029("in".into(), "out".into()),
                    );
                }
                is_in = true;
            }
            "out" => {
                if !permit_in_out {
                    p.emit_err(p.input().prev_span(), SyntaxError::TS1274("out".into()));
                } else if is_out {
                    p.emit_err(p.input().prev_span(), SyntaxError::TS1030("out".into()));
                }
                is_out = true;
            }
            other => p.emit_err(p.input().prev_span(), SyntaxError::TS1273(other.into())),
        };
    }

    let name = p.in_type().parse_with(parse_ident_name)?.into();
    let constraint = eat_then_parse_ts_type(p, &P::Token::EXTENDS)?;
    let default = eat_then_parse_ts_type(p, &P::Token::EQUAL)?;

    Ok(TsTypeParam {
        span: p.span(start),
        name,
        is_in,
        is_out,
        is_const,
        constraint,
        default,
    })
}

/// `tsParseTypeParameter`
pub fn parse_ts_type_params<'a, P: Parser<'a>>(
    p: &mut P,
    permit_in_out: bool,
    permit_const: bool,
) -> PResult<Box<TsTypeParamDecl>> {
    p.in_type().parse_with(|p| {
        ts_in_no_context(p, |p| {
            let start = p.input_mut().cur_pos();

            let Some(cur) = p.input_mut().cur() else {
                unexpected!(p, "< (jsx tag start)")
            };
            if !cur.is_less() && !cur.is_jsx_tag_start() {
                unexpected!(p, "< (jsx tag start)")
            }
            p.bump();

            let params = parse_ts_bracketed_list(
                p,
                ParsingContext::TypeParametersOrArguments,
                |p| parse_ts_type_param(p, permit_in_out, permit_const), // bracket
                false,
                // skip_first_token
                true,
            )?;

            Ok(Box::new(TsTypeParamDecl {
                span: p.span(start),
                params,
            }))
        })
    })
}

/// `tsTryParseTypeParameters`
pub fn try_parse_ts_type_params<'a, P: Parser<'a>>(
    p: &mut P,
    permit_in_out: bool,
    permit_const: bool,
) -> PResult<Option<Box<TsTypeParamDecl>>> {
    if !cfg!(feature = "typescript") {
        return Ok(None);
    }

    if p.input_mut().cur().is_some_and(|cur| cur.is_less()) {
        return parse_ts_type_params(p, permit_in_out, permit_const).map(Some);
    }

    Ok(None)
}

/// `tsParseTypeOrTypePredicateAnnotation`
pub fn parse_ts_type_or_type_predicate_ann<'a, P: Parser<'a>>(
    p: &mut P,
    return_token: &P::Token,
) -> PResult<Box<TsTypeAnn>> {
    debug_assert!(p.input().syntax().typescript());

    dbg!(123);
    p.in_type().parse_with(|p| {
        let return_token_start = p.input_mut().cur_pos();
        if !p.input_mut().eat(return_token) {
            let cur = format!("{:?}", cur!(p, false).ok());
            let span = p.input_mut().cur_span();
            syntax_error!(
                p,
                span,
                SyntaxError::Expected(format!("{return_token:?}"), cur)
            )
        }

        let type_pred_start = p.input_mut().cur_pos();
        let has_type_pred_asserts = p.input_mut().cur().is_some_and(|cur| cur.is_asserts()) && {
            let ctx = p.ctx();
            peek!(p).is_some_and(|peek| {
                if peek.is_word() {
                    !peek.is_reserved(ctx)
                } else {
                    false
                }
            })
        };
        if has_type_pred_asserts {
            p.assert_and_bump(&P::Token::ASSERTS)?;
            cur!(p, false)?;
        }

        let has_type_pred_is = {
            let ctx = p.ctx();
            p.input_mut().cur().is_some_and(|cur| {
                if cur.is_word() {
                    !cur.is_reserved(ctx)
                } else {
                    false
                }
            })
        } && peek!(p).is_some_and(|peek| peek.is_is())
            && !p.input_mut().has_linebreak_between_cur_and_peeked();
        let is_type_predicate = has_type_pred_asserts || has_type_pred_is;
        if !is_type_predicate {
            return parse_ts_type_ann(
                p,
                // eat_colon
                false,
                return_token_start,
            );
        }

        let type_pred_var = parse_ident_name(p)?;
        let type_ann = if has_type_pred_is {
            p.assert_and_bump(&P::Token::IS)?;
            let pos = p.input_mut().cur_pos();
            Some(parse_ts_type_ann(
                p, // eat_colon
                false, pos,
            )?)
        } else {
            None
        };

        let node = Box::new(TsType::TsTypePredicate(TsTypePredicate {
            span: p.span(type_pred_start),
            asserts: has_type_pred_asserts,
            param_name: TsThisTypeOrIdent::Ident(type_pred_var.into()),
            type_ann,
        }));

        Ok(Box::new(TsTypeAnn {
            span: p.span(return_token_start),
            type_ann: node,
        }))
    })
}

#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub fn try_parse_ts_type_args<'a, P: Parser<'a>>(
    p: &mut P,
) -> Option<Box<TsTypeParamInstantiation>> {
    trace_cur!(p, try_parse_ts_type_args);
    debug_assert!(p.input().syntax().typescript());

    try_parse_ts(p, |p| {
        let type_args = parse_ts_type_args(p)?;
        let cur = p.input_mut().cur();
        if cur.is_some_and(|cur| {
            cur.is_less() // invalid syntax
            || cur.is_greater() || cur.is_equal() || cur.is_rshift() || cur.is_greater_eq() || cur.is_plus() || cur.is_minus() // becomes relational expression
            || cur.is_lparen() || cur.is_backquote() // these should be type
                                                     // arguments in function
                                                     // call or template, not
                                                     // instantiation
                                                     // expression
        }) {
            Ok(None)
        } else if p.input_mut().had_line_break_before_cur()
            || cur!(p, false).is_ok_and(|t| t.is_bin_op())
            || !p.is_start_of_expr()
        {
            Ok(Some(type_args))
        } else {
            Ok(None)
        }
    })
}

/// `tsTryParseType`
pub fn try_parse_ts_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<Option<Box<TsType>>> {
    if !cfg!(feature = "typescript") {
        return Ok(None);
    }

    eat_then_parse_ts_type(p, &P::Token::COLON)
}

/// `tsTryParseTypeAnnotation`
#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub fn try_parse_ts_type_ann<'a, P: Parser<'a>>(p: &mut P) -> PResult<Option<Box<TsTypeAnn>>> {
    if !cfg!(feature = "typescript") {
        return Ok(None);
    }

    if p.input_mut().is(&P::Token::COLON) {
        let pos = p.cur_pos();
        return parse_ts_type_ann(p, /* eat_colon */ true, pos).map(Some);
    }

    Ok(None)
}

/// `tsNextThenParseType`
pub fn next_then_parse_ts_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<TsType>> {
    debug_assert!(p.input().syntax().typescript());

    let result = p.in_type().parse_with(|p| {
        p.bump();
        p.parse_ts_type()
    });

    if !p.ctx().contains(Context::InType)
        && p.input_mut()
            .cur()
            .is_some_and(|cur| cur.is_less() || cur.is_greater())
    {
        p.input_mut().merge_lt_gt();
    }

    result
}

/// `tsParseEnumMember`
fn parse_ts_enum_member<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsEnumMember> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    // Computed property names are grammar errors in an enum, so accept just string
    // literal or identifier.
    let cur = cur!(p, true);
    let id = if cur.is_str() {
        parse_lit(p).map(|lit| match lit {
            Lit::Str(s) => TsEnumMemberId::Str(s),
            _ => unreachable!(),
        })?
    } else if cur.is_num() {
        let cur = p.bump();
        let (value, raw) = cur.take_num(p.input_mut());
        let mut new_raw = String::new();

        new_raw.push('"');
        new_raw.push_str(raw.as_str());
        new_raw.push('"');

        let span = p.span(start);

        // Recover from error
        p.emit_err(span, SyntaxError::TS2452);

        TsEnumMemberId::Str(Str {
            span,
            value: value.to_string().into(),
            raw: Some(new_raw.into()),
        })
    } else if cur.is_lbracket() {
        p.assert_and_bump(&P::Token::LBRACKET)?;
        let _ = p.parse_expr()?;
        p.emit_err(p.span(start), SyntaxError::TS1164);
        p.assert_and_bump(&P::Token::RBRACKET)?;
        TsEnumMemberId::Ident(Ident::new_no_ctxt(atom!(""), p.span(start)))
    } else {
        parse_ident_name(p)
            .map(Ident::from)
            .map(TsEnumMemberId::from)?
    };

    let init = if p.input_mut().eat(&P::Token::EQUAL) {
        Some(p.parse_assignment_expr()?)
    } else if p.input_mut().is(&P::Token::COMMA) || p.input_mut().is(&P::Token::RBRACE) {
        None
    } else {
        let start = p.cur_pos();
        p.bump();
        p.input_mut().store(P::Token::COMMA);
        p.emit_err(Span::new(start, start), SyntaxError::TS1005);
        None
    };

    Ok(TsEnumMember {
        span: p.span(start),
        id,
        init,
    })
}

/// `tsParseEnumDeclaration`
pub fn parse_ts_enum_decl<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    is_const: bool,
) -> PResult<Box<TsEnumDecl>> {
    debug_assert!(p.input().syntax().typescript());

    let id = parse_ident_name(p)?;
    expect!(p, &P::Token::LBRACE);
    let members = parse_ts_delimited_list(p, ParsingContext::EnumMembers, parse_ts_enum_member)?;
    expect!(p, &P::Token::RBRACE);

    Ok(Box::new(TsEnumDecl {
        span: p.span(start),
        declare: false,
        is_const,
        id: id.into(),
        members,
    }))
}

/// `tsTryParseTypeOrTypePredicateAnnotation`
///
/// Used for parsing return types.
pub fn try_parse_ts_type_or_type_predicate_ann<'a, P: Parser<'a>>(
    p: &mut P,
) -> PResult<Option<Box<TsTypeAnn>>> {
    if !cfg!(feature = "typescript") {
        return Ok(None);
    }

    if p.input_mut().is(&P::Token::COLON) {
        parse_ts_type_or_type_predicate_ann(p, &P::Token::COLON).map(Some)
    } else {
        Ok(None)
    }
}

/// `tsParseTemplateLiteralType`
fn parse_ts_tpl_lit_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsTplLitType> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::BACKQUOTE)?;

    let (types, quasis) = parse_ts_tpl_type_elements(p)?;

    expect!(p, &P::Token::BACKQUOTE);

    Ok(TsTplLitType {
        span: p.span(start),
        types,
        quasis,
    })
}

fn parse_ts_tpl_type_elements<'a, P: Parser<'a>>(
    p: &mut P,
) -> PResult<(Vec<Box<TsType>>, Vec<TplElement>)> {
    if !cfg!(feature = "typescript") {
        return Ok(Default::default());
    }

    trace_cur!(p, parse_tpl_elements);

    let mut types = Vec::new();

    let cur_elem = p.parse_tpl_element(false)?;
    let mut is_tail = cur_elem.tail;
    let mut quasis = vec![cur_elem];

    while !is_tail {
        expect!(p, &P::Token::DOLLAR_LBRACE);
        types.push(p.parse_ts_type()?);
        expect!(p, &P::Token::RBRACE);
        let elem = p.parse_tpl_element(false)?;
        is_tail = elem.tail;
        quasis.push(elem);
    }

    Ok((types, quasis))
}

/// `tsParseLiteralTypeNode`
pub fn parse_ts_lit_type_node<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsLitType> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();

    let lit = if p.input_mut().is(&P::Token::BACKQUOTE) {
        let tpl = parse_ts_tpl_lit_type(p)?;
        TsLit::Tpl(tpl)
    } else {
        match parse_lit(p)? {
            Lit::BigInt(n) => TsLit::BigInt(n),
            Lit::Bool(n) => TsLit::Bool(n),
            Lit::Num(n) => TsLit::Number(n),
            Lit::Str(n) => TsLit::Str(n),
            _ => unreachable!(),
        }
    };

    Ok(TsLitType {
        span: p.span(start),
        lit,
    })
}

/// `tsParseHeritageClause`
pub fn parse_ts_heritage_clause<'a>(p: &mut impl Parser<'a>) -> PResult<Vec<TsExprWithTypeArgs>> {
    debug_assert!(p.input().syntax().typescript());

    parse_ts_delimited_list(
        p,
        ParsingContext::HeritageClauseElement,
        parse_ts_heritage_clause_element,
    )
}

fn parse_ts_heritage_clause_element<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsExprWithTypeArgs> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    // Note: TS uses parseLeftHandSideExpressionOrHigher,
    // then has grammar errors later if it's not an EntityName.

    let ident = parse_ident_name(p)?.into();
    let expr = parse_subscripts(p, Callee::Expr(ident), true, true)?;
    if !matches!(
        &*expr,
        Expr::Ident(..) | Expr::Member(..) | Expr::TsInstantiation(..)
    ) {
        p.emit_err(p.span(start), SyntaxError::TS2499);
    }

    match *expr {
        Expr::TsInstantiation(v) => Ok(TsExprWithTypeArgs {
            span: v.span,
            expr: v.expr,
            type_args: Some(v.type_args),
        }),
        _ => {
            let type_args = if p.input_mut().is(&P::Token::LESS) {
                Some(parse_ts_type_args(p)?)
            } else {
                None
            };

            Ok(TsExprWithTypeArgs {
                span: p.span(start),
                expr,
                type_args,
            })
        }
    }
}
