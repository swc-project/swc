use std::ops::DerefMut;

use swc_atoms::atom;
use swc_common::{BytePos, Span};
use swc_ecma_ast::{
    TsEntityName, TsIntersectionType, TsQualifiedName, TsThisType, TsThisTypeOrIdent, TsType,
    TsTypeAnn, TsTypeParam, TsTypeParamInstantiation, TsTypePredicate, TsTypeRef,
    TsUnionOrIntersectionType, TsUnionType,
};

use super::{PResult, Parser};
use crate::{
    common::{context::Context, lexer::token::TokenFactory, parser::buffer::Buffer},
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
pub fn ts_in_no_context<'a, P: Parser<'a>, T, F>(p: &mut P, op: F) -> PResult<T>
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
        ParsingContext::HeritageClauseElement { .. } => {
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

    if !p.input_mut().eat(&P::Token::COMMA) && !p.eat_general_semi() {
        let span = p.input().cur_span();
        let cur = p.input_mut().dump_cur();
        syntax_error!(
            p,
            span,
            SyntaxError::Expected(format!("{:?}", P::Token::SEMI), cur)
        )
    }

    Ok(())
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
pub fn parse_ts_delimited_list<'a, P: Parser<'a>, T, F>(
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
    let init = p.parse_ident_name()?;
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
            p.parse_ident_name()?
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
pub fn eat_then_parse_ts_type<'a, P: Parser<'a>>(
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
    let name = p.parse_ident_name()?;
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
