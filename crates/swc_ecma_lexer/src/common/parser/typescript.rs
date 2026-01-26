use std::{fmt::Write, mem};

use either::Either;
use swc_atoms::{atom, Atom, Wtf8Atom};
use swc_common::{BytePos, Span, Spanned};
use swc_ecma_ast::*;

use super::{
    class_and_fn::{parse_class_decl, parse_fn_block_or_expr_body, parse_fn_decl},
    eof_error,
    expr::{is_start_of_left_hand_side_expr, parse_new_expr},
    ident::parse_maybe_private_name,
    is_simple_param_list::IsSimpleParameterList,
    make_decl_declare,
    stmt::parse_var_stmt,
    PResult, Parser,
};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{
            buffer::Buffer,
            expr::{parse_assignment_expr, parse_lit, parse_str_lit, parse_subscripts},
            ident::{parse_ident, parse_ident_name},
            module_item::parse_module_item_block_body,
            object::parse_object_expr,
            pat::{parse_binding_pat_or_ident, parse_formal_params},
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
enum UnionOrIntersection {
    Union,
    Intersection,
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum SignatureParsingMode {
    TSCallSignatureDeclaration,
    TSConstructSignatureDeclaration,
}

/// `tsParseList`
fn parse_ts_list<'a, P: Parser<'a>, T, F>(
    p: &mut P,
    kind: ParsingContext,
    mut parse_element: F,
) -> PResult<Vec<T>>
where
    F: FnMut(&mut P) -> PResult<T>,
{
    debug_assert!(p.input().syntax().typescript());
    let mut buf = Vec::with_capacity(8);
    while !is_ts_list_terminator(p, kind) {
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
    let checkpoint = p.checkpoint_save();
    p.set_ctx(p.ctx() | Context::IgnoreError);
    let res = op(p);
    match res {
        Ok(Some(res)) if res => {
            let mut ctx = p.ctx();
            ctx.set(Context::IgnoreError, prev_ignore_error);
            p.input_mut().set_ctx(ctx);
            Ok(res)
        }
        _ => {
            p.checkpoint_load(checkpoint);
            Ok(false)
        }
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

        if is_ts_list_terminator(p, kind) {
            break;
        }

        let (_, element) = parse_element(p)?;
        buf.push(element);

        if p.input_mut().eat(&P::Token::COMMA) {
            continue;
        }

        if is_ts_list_terminator(p, kind) {
            break;
        }

        if kind == ParsingContext::EnumMembers {
            let expect = P::Token::COMMA;
            let cur = p.input().cur();
            let cur = cur.clone().to_string(p.input());
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
pub(crate) fn ts_in_no_context<'a, P: Parser<'a>, T, F>(p: &mut P, op: F) -> PResult<T>
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
fn is_ts_list_terminator<'a>(p: &mut impl Parser<'a>, kind: ParsingContext) -> bool {
    debug_assert!(p.input().syntax().typescript());
    let cur = p.input().cur();
    match kind {
        ParsingContext::EnumMembers | ParsingContext::TypeMembers => cur.is_rbrace(),
        ParsingContext::HeritageClauseElement => {
            cur.is_lbrace() || cur.is_implements() || cur.is_extends()
        }
        ParsingContext::TupleElementTypes => cur.is_rbracket(),
        ParsingContext::TypeParametersOrArguments => cur.is_greater(),
    }
}

/// `tsNextTokenCanFollowModifier`
pub(super) fn ts_next_token_can_follow_modifier<'a>(p: &mut impl Parser<'a>) -> bool {
    debug_assert!(p.input().syntax().typescript());
    // Note: TypeScript's implementation is much more complicated because
    // more things are considered modifiers there.
    // This implementation only handles modifiers not handled by @babel/parser
    // itself. And "static". TODO: Would be nice to avoid lookahead. Want a
    // hasLineBreakUpNext() method...
    p.bump();

    let cur = p.input().cur();
    !p.input().had_line_break_before_cur() && cur.is_lbracket()
        || cur.is_lbrace()
        || cur.is_star()
        || cur.is_dotdotdot()
        || cur.is_hash()
        || cur.is_word()
        || cur.is_str()
        || cur.is_num()
        || cur.is_bigint()
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
    let checkpoint = p.checkpoint_save();
    p.set_ctx(p.ctx() | Context::IgnoreError);
    let res = op(p);
    match res {
        Ok(Some(res)) => {
            trace_cur!(p, try_parse_ts__success_value);
            let mut ctx = p.ctx();
            ctx.set(Context::IgnoreError, prev_ignore_error);
            p.input_mut().set_ctx(ctx);
            Some(res)
        }
        Ok(None) => {
            trace_cur!(p, try_parse_ts__success_no_value);
            p.checkpoint_load(checkpoint);
            None
        }
        Err(..) => {
            trace_cur!(p, try_parse_ts__fail);
            p.checkpoint_load(checkpoint);
            None
        }
    }
}

/// `tsParseTypeMemberSemicolon`
fn parse_ts_type_member_semicolon<'a, P: Parser<'a>>(p: &mut P) -> PResult<()> {
    debug_assert!(p.input().syntax().typescript());

    if !p.input_mut().eat(&P::Token::COMMA) {
        p.expect_general_semi()
    } else {
        Ok(())
    }
}

/// `tsIsStartOfConstructSignature`
fn is_ts_start_of_construct_signature<'a, P: Parser<'a>>(p: &mut P) -> bool {
    debug_assert!(p.input().syntax().typescript());

    p.bump();
    let cur = p.input().cur();
    cur.is_lparen() || cur.is_less()
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
        let start = p.input().cur_pos();
        Ok((start, parse_element(p)?))
    })
}

/// `tsParseUnionOrIntersectionType`
fn parse_ts_union_or_intersection_type<'a, P: Parser<'a>, F>(
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

    let start = p.input().cur_pos(); // include the leading operator in the start
    p.input_mut().eat(operator);
    trace_cur!(p, parse_ts_union_or_intersection_type__first_type);

    let ty = parse_constituent_type(p)?;
    trace_cur!(p, parse_ts_union_or_intersection_type__after_first);

    if p.input().is(operator) {
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
            let cur = p.input().cur();
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
    debug_assert!(p.input().syntax().typescript());
    let pos = {
        let cur = p.input().cur();
        let modifier = if cur.is_unknown_ident() {
            cur.clone().take_unknown_ident_ref(p.input()).clone()
        } else if cur.is_known_ident() {
            cur.take_known_ident()
        } else if cur.is_in() {
            atom!("in")
        } else if cur.is_const() {
            atom!("const")
        } else if cur.is_error() {
            let err = p.input_mut().expect_error_token_and_bump();
            return Err(err);
        } else if cur.is_eof() {
            return Err(eof_error(p));
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
            && p.input().is(&P::Token::STATIC)
            && peek!(p).is_some_and(|peek| peek.is_lbrace())
        {
            return Ok(None);
        }
        if try_parse_ts_bool(p, |p| Ok(Some(ts_next_token_can_follow_modifier(p))))? {
            return Ok(Some(allowed_modifiers[pos]));
        }
    }
    Ok(None)
}

fn parse_ts_bracketed_list<'a, P: Parser<'a>, T, F>(
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
    let start = p.input().cur_pos();
    let init = parse_ident_name(p)?;
    if &*init.sym == "void" {
        let dot_start = p.input().cur_pos();
        let dot_span = p.span(dot_start);
        p.emit_err(dot_span, SyntaxError::TS1005)
    }
    let mut entity = TsEntityName::Ident(init.into());
    while p.input_mut().eat(&P::Token::DOT) {
        let dot_start = p.input().cur_pos();
        let cur = p.input().cur();
        if !cur.is_hash() && !cur.is_word() {
            p.emit_err(
                Span::new_with_checked(dot_start, dot_start),
                SyntaxError::TS1003,
            );
            return Ok(entity);
        }
        let left = entity;
        let right = if allow_reserved_words {
            parse_ident_name(p)?
        } else {
            parse_ident(p, false, false)?.into()
        };
        let span = p.span(start);
        entity = TsEntityName::TsQualifiedName(Box::new(TsQualifiedName { span, left, right }));
    }
    Ok(entity)
}

pub fn ts_look_ahead<'a, P: Parser<'a>, T, F>(p: &mut P, op: F) -> T
where
    F: FnOnce(&mut P) -> T,
{
    debug_assert!(p.input().syntax().typescript());
    let checkpoint = p.checkpoint_save();
    p.set_ctx(p.ctx() | Context::IgnoreError);
    let ret = op(p);
    p.checkpoint_load(checkpoint);
    ret
}

/// `tsParseTypeArguments`
pub fn parse_ts_type_args<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<TsTypeParamInstantiation>> {
    trace_cur!(p, parse_ts_type_args);
    debug_assert!(p.input().syntax().typescript());

    let start = p.input().cur_pos();
    let params = p.in_type(|p| {
        // Temporarily remove a JSX parsing context, which makes us scan different
        // tokens.
        p.ts_in_no_context(|p| {
            if p.input().is(&P::Token::LSHIFT) {
                p.input_mut().cut_lshift();
            } else {
                expect!(p, &P::Token::LESS);
            }
            parse_ts_delimited_list(p, ParsingContext::TypeParametersOrArguments, |p| {
                trace_cur!(p, parse_ts_type_args__arg);

                parse_ts_type(p)
            })
        })
    })?;
    // This reads the next token after the `>` too, so do this in the enclosing
    // context. But be sure not to parse a regex in the jsx expression
    // `<C<number> />`, so set exprAllowed = false
    p.input_mut().set_expr_allowed(false);
    p.expect_without_advance(&P::Token::GREATER)?;
    let span = Span::new_with_checked(start, p.input().cur_span().hi);

    // Report grammar error for empty type argument list like `I<>`.
    if params.is_empty() {
        p.emit_err(span, SyntaxError::EmptyTypeArgumentList);
    }

    Ok(Box::new(TsTypeParamInstantiation { span, params }))
}

/// `tsParseTypeReference`
pub fn parse_ts_type_ref<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsTypeRef> {
    trace_cur!(p, parse_ts_type_ref);
    debug_assert!(p.input().syntax().typescript());

    let start = p.input().cur_pos();

    let has_modifier = eat_any_ts_modifier(p)?;

    let type_name = parse_ts_entity_name(p, /* allow_reserved_words */ true)?;
    trace_cur!(p, parse_ts_type_ref__type_args);
    let type_params = if !p.input().had_line_break_before_cur()
        && (p.input().is(&P::Token::LESS) || p.input().is(&P::Token::LSHIFT))
    {
        let ret = p.do_outside_of_context(Context::ShouldNotLexLtOrGtAsType, parse_ts_type_args)?;
        p.assert_and_bump(&P::Token::GREATER);
        Some(ret)
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

    p.in_type(|p| {
        if eat_colon {
            p.assert_and_bump(&P::Token::COLON);
        }

        trace_cur!(p, parse_ts_type_ann__after_colon);

        let type_ann = parse_ts_type(p)?;

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
        let cur_pos = p.input().cur_pos();
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

    p.in_type(|p| {
        if !p.input_mut().eat(token_to_eat) {
            return Ok(None);
        }

        parse_ts_type(p).map(Some)
    })
}

/// `tsExpectThenParseType`
fn expect_then_parse_ts_type<'a, P: Parser<'a>>(
    p: &mut P,
    token: &P::Token,
    token_str: &'static str,
) -> PResult<Box<TsType>> {
    debug_assert!(p.input().syntax().typescript());

    p.in_type(|p| {
        if !p.input_mut().eat(token) {
            let got = format!("{:?}", p.input().cur());
            syntax_error!(
                p,
                p.input().cur_span(),
                SyntaxError::Unexpected {
                    got,
                    expected: token_str
                }
            );
        }

        parse_ts_type(p)
    })
}

/// `tsParseMappedTypeParameter`
fn parse_ts_mapped_type_param<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsTypeParam> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.input().cur_pos();
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

    let start = p.input().cur_pos();

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
                    p.emit_err(p.input().prev_span(), SyntaxError::TS1277(atom!("const")));
                }
            }
            "in" => {
                if !permit_in_out {
                    p.emit_err(p.input().prev_span(), SyntaxError::TS1274(atom!("in")));
                } else if is_in {
                    p.emit_err(p.input().prev_span(), SyntaxError::TS1030(atom!("in")));
                } else if is_out {
                    p.emit_err(
                        p.input().prev_span(),
                        SyntaxError::TS1029(atom!("in"), atom!("out")),
                    );
                }
                is_in = true;
            }
            "out" => {
                if !permit_in_out {
                    p.emit_err(p.input().prev_span(), SyntaxError::TS1274(atom!("out")));
                } else if is_out {
                    p.emit_err(p.input().prev_span(), SyntaxError::TS1030(atom!("out")));
                }
                is_out = true;
            }
            other => p.emit_err(p.input().prev_span(), SyntaxError::TS1273(other.into())),
        };
    }

    let name = p.in_type(parse_ident_name)?.into();
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
    p.in_type(|p| {
        p.ts_in_no_context(|p| {
            let start = p.input().cur_pos();
            let cur = p.input().cur();
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

    if p.input().cur().is_less() {
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

    p.in_type(|p| {
        let return_token_start = p.input().cur_pos();
        if !p.input_mut().eat(return_token) {
            let cur = format!("{:?}", p.input().cur());
            let span = p.input().cur_span();
            syntax_error!(
                p,
                span,
                SyntaxError::Expected(format!("{return_token:?}"), cur)
            )
        }

        let type_pred_start = p.input().cur_pos();
        let has_type_pred_asserts = p.input().cur().is_asserts() && {
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
            p.assert_and_bump(&P::Token::ASSERTS);
        }

        let has_type_pred_is = p.is_ident_ref()
            && peek!(p).is_some_and(|peek| peek.is_is())
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
            p.assert_and_bump(&P::Token::IS);
            let pos = p.input().cur_pos();
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

fn is_start_of_expr<'a>(p: &mut impl Parser<'a>) -> bool {
    is_start_of_left_hand_side_expr(p) || {
        let cur = p.input().cur();
        cur.is_plus()
            || cur.is_minus()
            || cur.is_tilde()
            || cur.is_bang()
            || cur.is_delete()
            || cur.is_typeof()
            || cur.is_void()
            || cur.is_plus_plus()
            || cur.is_minus_minus()
            || cur.is_less()
            || cur.is_await()
            || cur.is_yield()
            || (cur.is_hash() && peek!(p).is_some_and(|peek| peek.is_word()))
    }
}

#[cfg_attr(
    feature = "tracing-spans",
    tracing::instrument(level = "debug", skip_all)
)]
pub(super) fn try_parse_ts_type_args<'a, P: Parser<'a>>(
    p: &mut P,
) -> Option<Box<TsTypeParamInstantiation>> {
    trace_cur!(p, try_parse_ts_type_args);
    debug_assert!(p.input().syntax().typescript());

    try_parse_ts(p, |p| {
        let type_args = parse_ts_type_args(p)?;
        p.assert_and_bump(&P::Token::GREATER);
        let cur = p.input().cur();
        if cur.is_less() // invalid syntax
            || cur.is_greater() || cur.is_equal() || cur.is_rshift() || cur.is_greater_eq() || cur.is_plus() || cur.is_minus() // becomes relational expression
            || cur.is_lparen() || cur.is_no_substitution_template_literal() || cur.is_template_head() || cur.is_backquote()
        // these should be type
        // arguments in function
        // call or template, not
        // instantiation
        // expression
        {
            Ok(None)
        } else if p.input().had_line_break_before_cur()
            || p.input().cur().is_bin_op()
            || !is_start_of_expr(p)
        {
            Ok(Some(type_args))
        } else {
            Ok(None)
        }
    })
}

/// `tsTryParseType`
fn try_parse_ts_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<Option<Box<TsType>>> {
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

    if p.input().is(&P::Token::COLON) {
        let pos = p.cur_pos();
        return parse_ts_type_ann(p, /* eat_colon */ true, pos).map(Some);
    }

    Ok(None)
}

/// `tsNextThenParseType`
pub(super) fn next_then_parse_ts_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<TsType>> {
    debug_assert!(p.input().syntax().typescript());

    let result = p.in_type(|p| {
        p.bump();
        parse_ts_type(p)
    });

    if !p.ctx().contains(Context::InType) && {
        let cur = p.input().cur();
        cur.is_less() || cur.is_greater()
    } {
        p.input_mut().merge_lt_gt();
    }

    result
}

/// `tsParseEnumMember`
fn parse_ts_enum_member<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsEnumMember> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    // TypeScript allows computed property names with literal expressions in enums.
    // Non-literal computed properties (like ["a" + "b"]) are rejected.
    // We normalize literal computed properties (["\t"] → "\t") to keep AST simple.
    // See https://github.com/swc-project/swc/issues/11160
    let cur = p.input().cur();
    let id = if cur.is_str() {
        TsEnumMemberId::Str(parse_str_lit(p))
    } else if cur.is_num() {
        let (value, raw) = p.input_mut().expect_number_token_and_bump();
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
        p.assert_and_bump(&P::Token::LBRACKET);
        let expr = p.parse_expr()?;
        p.assert_and_bump(&P::Token::RBRACKET);
        let bracket_span = p.span(start);

        match *expr {
            Expr::Lit(Lit::Str(str_lit)) => {
                // String literal: ["\t"] → "\t"
                TsEnumMemberId::Str(str_lit)
            }
            Expr::Tpl(mut tpl) if tpl.exprs.is_empty() => {
                // Template literal without substitution: [`hello`] → "hello"

                let tpl = mem::take(tpl.quasis.first_mut().unwrap());

                let span = tpl.span;
                let value = tpl.cooked.unwrap();

                TsEnumMemberId::Str(Str {
                    span,
                    value,
                    raw: None,
                })
            }
            _ => {
                // Non-literal expression: report error
                p.emit_err(bracket_span, SyntaxError::TS1164);
                TsEnumMemberId::Ident(Ident::new_no_ctxt(atom!(""), bracket_span))
            }
        }
    } else if cur.is_error() {
        let err = p.input_mut().expect_error_token_and_bump();
        return Err(err);
    } else {
        parse_ident_name(p)
            .map(Ident::from)
            .map(TsEnumMemberId::from)?
    };

    let init = if p.input_mut().eat(&P::Token::EQUAL) {
        Some(parse_assignment_expr(p)?)
    } else if p.input().cur().is_comma() || p.input().cur().is_rbrace() {
        None
    } else {
        let start = p.cur_pos();
        p.bump();
        p.input_mut().store(P::Token::COMMA);
        p.emit_err(Span::new_with_checked(start, start), SyntaxError::TS1005);
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

    if p.input().is(&P::Token::COLON) {
        parse_ts_type_or_type_predicate_ann(p, &P::Token::COLON).map(Some)
    } else {
        Ok(None)
    }
}

/// `tsParseTemplateLiteralType`
fn parse_ts_tpl_lit_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsTplLitType> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();

    p.assert_and_bump(&P::Token::BACKQUOTE);

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
        types.push(parse_ts_type(p)?);
        expect!(p, &P::Token::RBRACE);
        let elem = p.parse_tpl_element(false)?;
        is_tail = elem.tail;
        quasis.push(elem);
    }

    Ok((types, quasis))
}

/// `tsParseLiteralTypeNode`
fn parse_ts_lit_type_node<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsLitType> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();

    let lit = if p.input().is(&P::Token::BACKQUOTE) {
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
            let type_args = if p.input().is(&P::Token::LESS) {
                let ret = parse_ts_type_args(p)?;
                p.assert_and_bump(&P::Token::GREATER);
                Some(ret)
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

/// `tsSkipParameterStart`
fn skip_ts_parameter_start<'a, P: Parser<'a>>(p: &mut P) -> PResult<bool> {
    debug_assert!(p.input().syntax().typescript());

    let _ = eat_any_ts_modifier(p)?;

    let cur = p.input().cur();

    if cur.is_void() {
        Ok(false)
    } else if cur.is_word() || cur.is_this() {
        p.bump();
        Ok(true)
    } else if (cur.is_lbrace() || cur.is_lbracket()) && parse_binding_pat_or_ident(p, false).is_ok()
    {
        Ok(true)
    } else {
        Ok(false)
    }
}

/// `tsIsUnambiguouslyStartOfFunctionType`
fn is_ts_unambiguously_start_of_fn_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<bool> {
    debug_assert!(p.input().syntax().typescript());

    p.assert_and_bump(&P::Token::LPAREN);

    let cur = p.input().cur();
    if cur.is_rparen() || cur.is_dotdotdot() {
        // ( )
        // ( ...
        return Ok(true);
    }
    if skip_ts_parameter_start(p)? {
        let cur = p.input().cur();
        if cur.is_colon() || cur.is_comma() || cur.is_equal() || cur.is_question() {
            // ( xxx :
            // ( xxx ,
            // ( xxx ?
            // ( xxx =
            return Ok(true);
        }
        if p.input_mut().eat(&P::Token::RPAREN) && p.input().cur().is_arrow() {
            // ( xxx ) =>
            return Ok(true);
        }
    }
    Ok(false)
}

fn is_ts_start_of_fn_type<'a, P: Parser<'a>>(p: &mut P) -> bool {
    debug_assert!(p.input().syntax().typescript());

    if p.input().cur().is_less() {
        return true;
    }

    p.input().cur().is_lparen()
        && ts_look_ahead(p, is_ts_unambiguously_start_of_fn_type).unwrap_or_default()
}

/// `tsIsUnambiguouslyIndexSignature`
fn is_ts_unambiguously_index_signature<'a, P: Parser<'a>>(p: &mut P) -> bool {
    debug_assert!(p.input().syntax().typescript());

    // Note: babel's comment is wrong
    p.assert_and_bump(&P::Token::LBRACKET); // Skip '['

    // ',' is for error recovery
    p.eat_ident_ref() && {
        let cur = p.input().cur();
        cur.is_comma() || cur.is_colon()
    }
}

/// `tsTryParseIndexSignature`
pub fn try_parse_ts_index_signature<'a, P: Parser<'a>>(
    p: &mut P,
    index_signature_start: BytePos,
    readonly: bool,
    is_static: bool,
) -> PResult<Option<TsIndexSignature>> {
    if !cfg!(feature = "typescript") {
        return Ok(Default::default());
    }

    if !(p.input().cur().is_lbracket() && ts_look_ahead(p, is_ts_unambiguously_index_signature)) {
        return Ok(None);
    }

    expect!(p, &P::Token::LBRACKET);

    let ident_start = p.cur_pos();
    let mut id = parse_ident_name(p).map(BindingIdent::from)?;
    let type_ann_start = p.cur_pos();

    if p.input_mut().eat(&P::Token::COMMA) {
        p.emit_err(id.span, SyntaxError::TS1096);
    } else {
        expect!(p, &P::Token::COLON);
    }

    let type_ann = parse_ts_type_ann(p, /* eat_colon */ false, type_ann_start)?;
    id.span = p.span(ident_start);
    id.type_ann = Some(type_ann);

    expect!(p, &P::Token::RBRACKET);

    let params = vec![TsFnParam::Ident(id)];

    let ty = try_parse_ts_type_ann(p)?;
    let type_ann = ty;

    parse_ts_type_member_semicolon(p)?;

    Ok(Some(TsIndexSignature {
        span: p.span(index_signature_start),
        readonly,
        is_static,
        params,
        type_ann,
    }))
}

/// `tsIsExternalModuleReference`
fn is_ts_external_module_ref<'a, P: Parser<'a>>(p: &mut P) -> bool {
    debug_assert!(p.input().syntax().typescript());
    p.input().is(&P::Token::REQUIRE) && peek!(p).is_some_and(|t| t.is_lparen())
}

/// `tsParseModuleReference`
fn parse_ts_module_ref<'a>(p: &mut impl Parser<'a>) -> PResult<TsModuleRef> {
    debug_assert!(p.input().syntax().typescript());

    if is_ts_external_module_ref(p) {
        parse_ts_external_module_ref(p).map(From::from)
    } else {
        parse_ts_entity_name(p, /* allow_reserved_words */ false).map(From::from)
    }
}

/// `tsParseExternalModuleReference`
fn parse_ts_external_module_ref<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsExternalModuleRef> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    expect!(p, &P::Token::REQUIRE);
    expect!(p, &P::Token::LPAREN);
    let cur = p.input().cur();
    if cur.is_error() {
        let err = p.input_mut().expect_error_token_and_bump();
        return Err(err);
    } else if !cur.is_str() {
        unexpected!(p, "a string literal")
    }
    let expr = parse_str_lit(p);
    expect!(p, &P::Token::RPAREN);
    Ok(TsExternalModuleRef {
        span: p.span(start),
        expr,
    })
}

/// `tsParseImportEqualsDeclaration`
pub fn parse_ts_import_equals_decl<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    id: Ident,
    is_export: bool,
    is_type_only: bool,
) -> PResult<Box<TsImportEqualsDecl>> {
    debug_assert!(p.input().syntax().typescript());

    expect!(p, &P::Token::EQUAL);
    let module_ref = parse_ts_module_ref(p)?;
    p.expect_general_semi()?;

    Ok(Box::new(TsImportEqualsDecl {
        span: p.span(start),
        id,
        is_export,
        is_type_only,
        module_ref,
    }))
}

/// `tsParseBindingListForSignature`
///
/// Eats ')` at the end but does not eat `(` at start.
fn parse_ts_binding_list_for_signature<'a, P: Parser<'a>>(p: &mut P) -> PResult<Vec<TsFnParam>> {
    if !cfg!(feature = "typescript") {
        return Ok(Default::default());
    }

    debug_assert!(p.input().syntax().typescript());

    let params = parse_formal_params(p)?;
    let mut list = Vec::with_capacity(4);

    for param in params {
        let item = match param.pat {
            Pat::Ident(pat) => TsFnParam::Ident(pat),
            Pat::Array(pat) => TsFnParam::Array(pat),
            Pat::Object(pat) => TsFnParam::Object(pat),
            Pat::Rest(pat) => TsFnParam::Rest(pat),
            _ => unexpected!(
                p,
                "an identifier, [ for an array pattern, { for an object patter or ... for a rest \
                 pattern"
            ),
        };
        list.push(item);
    }
    expect!(p, &P::Token::RPAREN);
    Ok(list)
}

/// `tsIsStartOfMappedType`
pub fn is_ts_start_of_mapped_type<'a, P: Parser<'a>>(p: &mut P) -> bool {
    debug_assert!(p.input().syntax().typescript());

    p.bump();
    if p.input_mut().eat(&P::Token::PLUS) || p.input_mut().eat(&P::Token::MINUS) {
        return p.input().is(&P::Token::READONLY);
    }

    p.input_mut().eat(&P::Token::READONLY);

    if !p.input().is(&P::Token::LBRACKET) {
        return false;
    }
    p.bump();
    if !p.is_ident_ref() {
        return false;
    }
    p.bump();

    p.input().is(&P::Token::IN)
}

/// `tsParseSignatureMember`
fn parse_ts_signature_member<'a, P: Parser<'a>>(
    p: &mut P,
    kind: SignatureParsingMode,
) -> PResult<Either<TsCallSignatureDecl, TsConstructSignatureDecl>> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();

    if kind == SignatureParsingMode::TSConstructSignatureDeclaration {
        expect!(p, &P::Token::NEW);
    }

    // ----- inlined p.tsFillSignature(tt.colon, node);
    let type_params = try_parse_ts_type_params(p, false, true)?;
    expect!(p, &P::Token::LPAREN);
    let params = parse_ts_binding_list_for_signature(p)?;
    let type_ann = if p.input().is(&P::Token::COLON) {
        Some(parse_ts_type_or_type_predicate_ann(p, &P::Token::COLON)?)
    } else {
        None
    };
    // -----

    parse_ts_type_member_semicolon(p)?;

    match kind {
        SignatureParsingMode::TSCallSignatureDeclaration => Ok(Either::Left(TsCallSignatureDecl {
            span: p.span(start),
            params,
            type_ann,
            type_params,
        })),
        SignatureParsingMode::TSConstructSignatureDeclaration => {
            Ok(Either::Right(TsConstructSignatureDecl {
                span: p.span(start),
                params,
                type_ann,
                type_params,
            }))
        }
    }
}

fn try_parse_ts_tuple_element_name<'a, P: Parser<'a>>(p: &mut P) -> Option<Pat> {
    if !cfg!(feature = "typescript") {
        return Default::default();
    }

    try_parse_ts(p, |p| {
        let start = p.cur_pos();

        let rest = if p.input_mut().eat(&P::Token::DOTDOTDOT) {
            Some(p.input().prev_span())
        } else {
            None
        };

        let mut ident = parse_ident_name(p).map(Ident::from)?;
        if p.input_mut().eat(&P::Token::QUESTION) {
            ident.optional = true;
            ident.span = ident.span.with_hi(p.input().prev_span().hi);
        }
        expect!(p, &P::Token::COLON);

        Ok(Some(if let Some(dot3_token) = rest {
            RestPat {
                span: p.span(start),
                dot3_token,
                arg: ident.into(),
                type_ann: None,
            }
            .into()
        } else {
            ident.into()
        }))
    })
}

/// `tsParseTupleElementType`
fn parse_ts_tuple_element_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsTupleElement> {
    debug_assert!(p.input().syntax().typescript());

    // parses `...TsType[]`
    let start = p.cur_pos();

    let label = try_parse_ts_tuple_element_name(p);

    if p.input_mut().eat(&P::Token::DOTDOTDOT) {
        let type_ann = parse_ts_type(p)?;
        return Ok(TsTupleElement {
            span: p.span(start),
            label,
            ty: Box::new(TsType::TsRestType(TsRestType {
                span: p.span(start),
                type_ann,
            })),
        });
    }

    let ty = parse_ts_type(p)?;
    // parses `TsType?`
    if p.input_mut().eat(&P::Token::QUESTION) {
        let type_ann = ty;
        return Ok(TsTupleElement {
            span: p.span(start),
            label,
            ty: Box::new(TsType::TsOptionalType(TsOptionalType {
                span: p.span(start),
                type_ann,
            })),
        });
    }

    Ok(TsTupleElement {
        span: p.span(start),
        label,
        ty,
    })
}

/// `tsParseTupleType`
pub fn parse_ts_tuple_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsTupleType> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    let elems = parse_ts_bracketed_list(
        p,
        ParsingContext::TupleElementTypes,
        parse_ts_tuple_element_type,
        /* bracket */ true,
        /* skipFirstToken */ false,
    )?;

    // Validate the elementTypes to ensure:
    //   No mandatory elements may follow optional elements
    //   If there's a rest element, it must be at the end of the tuple

    let mut seen_optional_element = false;

    for elem in elems.iter() {
        match *elem.ty {
            TsType::TsRestType(..) => {}
            TsType::TsOptionalType(..) => {
                seen_optional_element = true;
            }
            _ if seen_optional_element => {
                syntax_error!(p, p.span(start), SyntaxError::TsRequiredAfterOptional)
            }
            _ => {}
        }
    }

    Ok(TsTupleType {
        span: p.span(start),
        elem_types: elems,
    })
}

/// `tsParseMappedType`
pub fn parse_ts_mapped_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsMappedType> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    expect!(p, &P::Token::LBRACE);
    let mut readonly = None;
    let cur = p.input().cur();
    if cur.is_plus() || cur.is_minus() {
        readonly = Some(if cur.is_plus() {
            TruePlusMinus::Plus
        } else {
            TruePlusMinus::Minus
        });
        p.bump();
        expect!(p, &P::Token::READONLY)
    } else if p.input_mut().eat(&P::Token::READONLY) {
        readonly = Some(TruePlusMinus::True);
    }

    expect!(p, &P::Token::LBRACKET);
    let type_param = parse_ts_mapped_type_param(p)?;
    let name_type = if p.input_mut().eat(&P::Token::AS) {
        Some(parse_ts_type(p)?)
    } else {
        None
    };
    expect!(p, &P::Token::RBRACKET);

    let mut optional = None;
    let cur = p.input().cur();
    if cur.is_plus() || cur.is_minus() {
        optional = Some(if cur.is_plus() {
            TruePlusMinus::Plus
        } else {
            TruePlusMinus::Minus
        });
        p.bump(); // +, -
        expect!(p, &P::Token::QUESTION);
    } else if p.input_mut().eat(&P::Token::QUESTION) {
        optional = Some(TruePlusMinus::True);
    }

    let type_ann = try_parse_ts_type(p)?;
    p.expect_general_semi()?;
    expect!(p, &P::Token::RBRACE);

    Ok(TsMappedType {
        span: p.span(start),
        readonly,
        optional,
        type_param,
        name_type,
        type_ann,
    })
}

/// `tsParseParenthesizedType`
pub fn parse_ts_parenthesized_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsParenthesizedType> {
    debug_assert!(p.input().syntax().typescript());
    trace_cur!(p, parse_ts_parenthesized_type);

    let start = p.cur_pos();
    expect!(p, &P::Token::LPAREN);
    let type_ann = parse_ts_type(p)?;
    expect!(p, &P::Token::RPAREN);
    Ok(TsParenthesizedType {
        span: p.span(start),
        type_ann,
    })
}

/// `tsParseTypeAliasDeclaration`
pub fn parse_ts_type_alias_decl<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
) -> PResult<Box<TsTypeAliasDecl>> {
    debug_assert!(p.input().syntax().typescript());

    let id = parse_ident_name(p)?;
    let type_params = try_parse_ts_type_params(p, true, false)?;
    let type_ann = expect_then_parse_ts_type(p, &P::Token::EQUAL, "=")?;
    p.expect_general_semi()?;
    Ok(Box::new(TsTypeAliasDecl {
        declare: false,
        span: p.span(start),
        id: id.into(),
        type_params,
        type_ann,
    }))
}

/// `tsParseFunctionOrConstructorType`
fn parse_ts_fn_or_constructor_type<'a, P: Parser<'a>>(
    p: &mut P,
    is_fn_type: bool,
) -> PResult<TsFnOrConstructorType> {
    trace_cur!(p, parse_ts_fn_or_constructor_type);

    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    let is_abstract = if !is_fn_type {
        p.input_mut().eat(&P::Token::ABSTRACT)
    } else {
        false
    };
    if !is_fn_type {
        expect!(p, &P::Token::NEW);
    }

    // ----- inlined `p.tsFillSignature(tt.arrow, node)`
    let type_params = try_parse_ts_type_params(p, false, true)?;
    expect!(p, &P::Token::LPAREN);
    let params = parse_ts_binding_list_for_signature(p)?;
    let type_ann = parse_ts_type_or_type_predicate_ann(p, &P::Token::ARROW)?;
    // ----- end

    Ok(if is_fn_type {
        TsFnOrConstructorType::TsFnType(TsFnType {
            span: p.span(start),
            type_params,
            params,
            type_ann,
        })
    } else {
        TsFnOrConstructorType::TsConstructorType(TsConstructorType {
            span: p.span(start),
            type_params,
            params,
            type_ann,
            is_abstract,
        })
    })
}

/// `tsParseUnionTypeOrHigher`
fn parse_ts_union_type_or_higher<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<TsType>> {
    trace_cur!(p, parse_ts_union_type_or_higher);
    debug_assert!(p.input().syntax().typescript());

    parse_ts_union_or_intersection_type(
        p,
        UnionOrIntersection::Union,
        parse_ts_intersection_type_or_higher,
        &P::Token::BIT_OR,
    )
}

/// `tsParseIntersectionTypeOrHigher`
fn parse_ts_intersection_type_or_higher<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<TsType>> {
    trace_cur!(p, parse_ts_intersection_type_or_higher);

    debug_assert!(p.input().syntax().typescript());

    parse_ts_union_or_intersection_type(
        p,
        UnionOrIntersection::Intersection,
        parse_ts_type_operator_or_higher,
        &P::Token::BIT_AND,
    )
}

/// `tsParseTypeOperatorOrHigher`
fn parse_ts_type_operator_or_higher<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<TsType>> {
    trace_cur!(p, parse_ts_type_operator_or_higher);
    debug_assert!(p.input().syntax().typescript());

    let operator = if p.input().is(&P::Token::KEYOF) {
        Some(TsTypeOperatorOp::KeyOf)
    } else if p.input().is(&P::Token::UNIQUE) {
        Some(TsTypeOperatorOp::Unique)
    } else if p.input().is(&P::Token::READONLY) {
        Some(TsTypeOperatorOp::ReadOnly)
    } else {
        None
    };

    match operator {
        Some(operator) => parse_ts_type_operator(p, operator)
            .map(TsType::from)
            .map(Box::new),
        None => {
            trace_cur!(p, parse_ts_type_operator_or_higher__not_operator);

            if p.input().is(&P::Token::INFER) {
                parse_ts_infer_type(p).map(TsType::from).map(Box::new)
            } else {
                let readonly = parse_ts_modifier(p, &["readonly"], false)?.is_some();
                parse_ts_array_type_or_higher(p, readonly)
            }
        }
    }
}

/// `tsParseTypeOperator`
fn parse_ts_type_operator<'a, P: Parser<'a>>(
    p: &mut P,
    op: TsTypeOperatorOp,
) -> PResult<TsTypeOperator> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    match op {
        TsTypeOperatorOp::Unique => expect!(p, &P::Token::UNIQUE),
        TsTypeOperatorOp::KeyOf => expect!(p, &P::Token::KEYOF),
        TsTypeOperatorOp::ReadOnly => expect!(p, &P::Token::READONLY),
        #[cfg(swc_ast_unknown)]
        _ => unreachable!(),
    }

    let type_ann = parse_ts_type_operator_or_higher(p)?;
    Ok(TsTypeOperator {
        span: p.span(start),
        op,
        type_ann,
    })
}

/// `tsParseInferType`
fn parse_ts_infer_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsInferType> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    expect!(p, &P::Token::INFER);
    let type_param_name = parse_ident_name(p)?;
    let constraint = try_parse_ts(p, |p| {
        expect!(p, &P::Token::EXTENDS);
        let constraint = parse_ts_non_conditional_type(p);
        if p.ctx().contains(Context::DisallowConditionalTypes) || !p.input().is(&P::Token::QUESTION)
        {
            constraint.map(Some)
        } else {
            Ok(None)
        }
    });
    let type_param = TsTypeParam {
        span: type_param_name.span(),
        name: type_param_name.into(),
        is_in: false,
        is_out: false,
        is_const: false,
        constraint,
        default: None,
    };
    Ok(TsInferType {
        span: p.span(start),
        type_param,
    })
}

/// `tsParseNonConditionalType`
fn parse_ts_non_conditional_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<TsType>> {
    trace_cur!(p, parse_ts_non_conditional_type);

    debug_assert!(p.input().syntax().typescript());

    if is_ts_start_of_fn_type(p) {
        return parse_ts_fn_or_constructor_type(p, true)
            .map(TsType::from)
            .map(Box::new);
    }
    if (p.input().is(&P::Token::ABSTRACT) && peek!(p).is_some_and(|cur| cur.is_new()))
        || p.input().is(&P::Token::NEW)
    {
        // As in `new () => Date`
        return parse_ts_fn_or_constructor_type(p, false)
            .map(TsType::from)
            .map(Box::new);
    }

    parse_ts_union_type_or_higher(p)
}

/// `tsParseArrayTypeOrHigher`
fn parse_ts_array_type_or_higher<'a, P: Parser<'a>>(
    p: &mut P,
    readonly: bool,
) -> PResult<Box<TsType>> {
    trace_cur!(p, parse_ts_array_type_or_higher);
    debug_assert!(p.input().syntax().typescript());

    let mut ty = parse_ts_non_array_type(p)?;

    while !p.input().had_line_break_before_cur() && p.input_mut().eat(&P::Token::LBRACKET) {
        if p.input_mut().eat(&P::Token::RBRACKET) {
            ty = Box::new(TsType::TsArrayType(TsArrayType {
                span: p.span(ty.span_lo()),
                elem_type: ty,
            }));
        } else {
            let index_type = parse_ts_type(p)?;
            expect!(p, &P::Token::RBRACKET);
            ty = Box::new(TsType::TsIndexedAccessType(TsIndexedAccessType {
                span: p.span(ty.span_lo()),
                readonly,
                obj_type: ty,
                index_type,
            }))
        }
    }

    Ok(ty)
}

/// Be sure to be in a type context before calling p.
///
/// `tsParseType`
pub fn parse_ts_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<TsType>> {
    trace_cur!(p, parse_ts_type);

    debug_assert!(p.input().syntax().typescript());

    // Need to set `state.inType` so that we don't parse JSX in a type context.
    debug_assert!(p.ctx().contains(Context::InType));

    let start = p.cur_pos();

    p.do_outside_of_context(Context::DisallowConditionalTypes, |p| {
        let ty = parse_ts_non_conditional_type(p)?;
        if p.input().had_line_break_before_cur() || !p.input_mut().eat(&P::Token::EXTENDS) {
            return Ok(ty);
        }

        let check_type = ty;
        let extends_type = p.do_inside_of_context(
            Context::DisallowConditionalTypes,
            parse_ts_non_conditional_type,
        )?;

        expect!(p, &P::Token::QUESTION);

        let true_type = parse_ts_type(p)?;

        expect!(p, &P::Token::COLON);

        let false_type = parse_ts_type(p)?;

        Ok(Box::new(TsType::TsConditionalType(TsConditionalType {
            span: p.span(start),
            check_type,
            extends_type,
            true_type,
            false_type,
        })))
    })
}

/// `parsePropertyName` in babel.
///
/// Returns `(computed, key)`.
fn parse_ts_property_name<'a, P: Parser<'a>>(p: &mut P) -> PResult<(bool, Box<Expr>)> {
    let (computed, key) = if p.input_mut().eat(&P::Token::LBRACKET) {
        let key = parse_assignment_expr(p)?;
        expect!(p, &P::Token::RBRACKET);
        (true, key)
    } else {
        p.do_inside_of_context(Context::InPropertyName, |p| {
            // We check if it's valid for it to be a private name when we push it.
            let cur = p.input().cur();

            let key = if cur.is_num() || cur.is_str() {
                parse_new_expr(p)
            } else if cur.is_error() {
                let err = p.input_mut().expect_error_token_and_bump();
                return Err(err);
            } else {
                parse_maybe_private_name(p).map(|e| match e {
                    Either::Left(e) => {
                        p.emit_err(e.span(), SyntaxError::PrivateNameInInterface);

                        e.into()
                    }
                    Either::Right(e) => e.into(),
                })
            };
            key.map(|key| (false, key))
        })?
    };

    Ok((computed, key))
}

/// `tsParsePropertyOrMethodSignature`
fn parse_ts_property_or_method_signature<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    readonly: bool,
) -> PResult<Either<TsPropertySignature, TsMethodSignature>> {
    debug_assert!(p.input().syntax().typescript());

    let (computed, key) = parse_ts_property_name(p)?;

    let optional = p.input_mut().eat(&P::Token::QUESTION);

    let cur = p.input().cur();
    if cur.is_lparen() || cur.is_less() {
        if readonly {
            syntax_error!(p, SyntaxError::ReadOnlyMethod)
        }

        let type_params = try_parse_ts_type_params(p, false, true)?;
        expect!(p, &P::Token::LPAREN);
        let params = parse_ts_binding_list_for_signature(p)?;
        let type_ann = if p.input().is(&P::Token::COLON) {
            parse_ts_type_or_type_predicate_ann(p, &P::Token::COLON).map(Some)?
        } else {
            None
        };
        // -----

        parse_ts_type_member_semicolon(p)?;
        Ok(Either::Right(TsMethodSignature {
            span: p.span(start),
            computed,
            key,
            optional,
            type_params,
            params,
            type_ann,
        }))
    } else {
        let type_ann = try_parse_ts_type_ann(p)?;

        parse_ts_type_member_semicolon(p)?;
        Ok(Either::Left(TsPropertySignature {
            span: p.span(start),
            computed,
            readonly,
            key,
            optional,
            type_ann,
        }))
    }
}

/// `tsParseTypeMember`
fn parse_ts_type_member<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsTypeElement> {
    debug_assert!(p.input().syntax().typescript());

    fn into_type_elem(e: Either<TsCallSignatureDecl, TsConstructSignatureDecl>) -> TsTypeElement {
        match e {
            Either::Left(e) => e.into(),
            Either::Right(e) => e.into(),
        }
    }
    let cur = p.input().cur();
    if cur.is_lparen() || cur.is_less() {
        return parse_ts_signature_member(p, SignatureParsingMode::TSCallSignatureDeclaration)
            .map(into_type_elem);
    }
    if p.input().is(&P::Token::NEW) && ts_look_ahead(p, is_ts_start_of_construct_signature) {
        return parse_ts_signature_member(p, SignatureParsingMode::TSConstructSignatureDeclaration)
            .map(into_type_elem);
    }
    // Instead of fullStart, we create a node here.
    let start = p.cur_pos();
    let readonly = parse_ts_modifier(p, &["readonly"], false)?.is_some();

    let idx = try_parse_ts_index_signature(p, start, readonly, false)?;
    if let Some(idx) = idx {
        return Ok(idx.into());
    }

    if let Some(v) = try_parse_ts(p, |p| {
        let start = p.input().cur_pos();

        if readonly {
            syntax_error!(p, SyntaxError::GetterSetterCannotBeReadonly)
        }

        let is_get = if p.input_mut().eat(&P::Token::GET) {
            true
        } else {
            expect!(p, &P::Token::SET);
            false
        };

        let (computed, key) = parse_ts_property_name(p)?;

        if is_get {
            expect!(p, &P::Token::LPAREN);
            expect!(p, &P::Token::RPAREN);
            let type_ann = try_parse_ts_type_ann(p)?;

            parse_ts_type_member_semicolon(p)?;

            Ok(Some(TsTypeElement::TsGetterSignature(TsGetterSignature {
                span: p.span(start),
                key,
                computed,
                type_ann,
            })))
        } else {
            expect!(p, &P::Token::LPAREN);
            let params = parse_ts_binding_list_for_signature(p)?;
            if params.is_empty() {
                syntax_error!(p, SyntaxError::SetterParamRequired)
            }
            let param = params.into_iter().next().unwrap();

            parse_ts_type_member_semicolon(p)?;

            Ok(Some(TsTypeElement::TsSetterSignature(TsSetterSignature {
                span: p.span(start),
                key,
                computed,
                param,
            })))
        }
    }) {
        return Ok(v);
    }

    parse_ts_property_or_method_signature(p, start, readonly).map(|e| match e {
        Either::Left(e) => e.into(),
        Either::Right(e) => e.into(),
    })
}

/// `tsParseObjectTypeMembers`
fn parse_ts_object_type_members<'a, P: Parser<'a>>(p: &mut P) -> PResult<Vec<TsTypeElement>> {
    debug_assert!(p.input().syntax().typescript());

    expect!(p, &P::Token::LBRACE);
    let members = parse_ts_list(p, ParsingContext::TypeMembers, |p| parse_ts_type_member(p))?;
    expect!(p, &P::Token::RBRACE);
    Ok(members)
}

/// `tsParseTypeLiteral`
pub fn parse_ts_type_lit<'a>(p: &mut impl Parser<'a>) -> PResult<TsTypeLit> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    let members = parse_ts_object_type_members(p)?;
    Ok(TsTypeLit {
        span: p.span(start),
        members,
    })
}

/// `tsParseInterfaceDeclaration`
pub fn parse_ts_interface_decl<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
) -> PResult<Box<TsInterfaceDecl>> {
    debug_assert!(p.input().syntax().typescript());

    let id = parse_ident_name(p)?;
    match &*id.sym {
        "string" | "null" | "number" | "object" | "any" | "unknown" | "boolean" | "bigint"
        | "symbol" | "void" | "never" | "intrinsic" => {
            p.emit_err(id.span, SyntaxError::TS2427);
        }
        _ => {}
    }

    let type_params = try_parse_ts_type_params(p, true, false)?;

    let extends = if p.input_mut().eat(&P::Token::EXTENDS) {
        parse_ts_heritage_clause(p)?
    } else {
        Vec::new()
    };

    // Recover from
    //
    //     interface I extends A extends B {}
    if p.input().is(&P::Token::EXTENDS) {
        p.emit_err(p.input().cur_span(), SyntaxError::TS1172);

        while !p.input().cur().is_eof() && !p.input().is(&P::Token::LBRACE) {
            p.bump();
        }
    }

    let body_start = p.cur_pos();
    let body = p.in_type(parse_ts_object_type_members)?;
    let body = TsInterfaceBody {
        span: p.span(body_start),
        body,
    };
    Ok(Box::new(TsInterfaceDecl {
        span: p.span(start),
        declare: false,
        id: id.into(),
        type_params,
        extends,
        body,
    }))
}

/// `tsParseTypeAssertion`
pub fn parse_ts_type_assertion<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
) -> PResult<TsTypeAssertion> {
    debug_assert!(p.input().syntax().typescript());

    if p.input().syntax().disallow_ambiguous_jsx_like() {
        p.emit_err(p.span(start), SyntaxError::ReservedTypeAssertion);
    }

    // Not actually necessary to set state.inType because we never reach here if JSX
    // plugin is enabled, but need `tsInType` to satisfy the assertion in
    // `tsParseType`.
    let type_ann = p.in_type(parse_ts_type)?;
    expect!(p, &P::Token::GREATER);
    let expr = p.parse_unary_expr()?;
    Ok(TsTypeAssertion {
        span: p.span(start),
        type_ann,
        expr,
    })
}

/// `tsParseImportType`
fn parse_ts_import_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsImportType> {
    let start = p.cur_pos();
    p.assert_and_bump(&P::Token::IMPORT);

    expect!(p, &P::Token::LPAREN);

    let cur = p.input().cur();

    let arg = if cur.is_str() {
        parse_str_lit(p)
    } else if cur.is_error() {
        let err = p.input_mut().expect_error_token_and_bump();
        return Err(err);
    } else {
        let arg_span = p.input().cur_span();
        p.bump();
        p.emit_err(arg_span, SyntaxError::TS1141);
        Str {
            span: arg_span,
            value: Wtf8Atom::default(),
            raw: Some(atom!("\"\"")),
        }
    };

    // the "assert" keyword is deprecated and this syntax is niche, so
    // don't support it
    let attributes = if p.input_mut().eat(&P::Token::COMMA)
        && p.input().syntax().import_attributes()
        && p.input().is(&P::Token::LBRACE)
    {
        Some(parse_ts_call_options(p)?)
    } else {
        None
    };

    expect!(p, &P::Token::RPAREN);

    let qualifier = if p.input_mut().eat(&P::Token::DOT) {
        parse_ts_entity_name(p, false).map(Some)?
    } else {
        None
    };

    let type_args = if p.input().is(&P::Token::LESS) {
        let ret = p.do_outside_of_context(Context::ShouldNotLexLtOrGtAsType, parse_ts_type_args)?;
        p.assert_and_bump(&P::Token::GREATER);
        Some(ret)
    } else {
        None
    };

    Ok(TsImportType {
        span: p.span(start),
        arg,
        qualifier,
        type_args,
        attributes,
    })
}

fn parse_ts_call_options<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsImportCallOptions> {
    debug_assert!(p.input().syntax().typescript());
    let start = p.cur_pos();
    p.assert_and_bump(&P::Token::LBRACE);

    expect!(p, &P::Token::WITH);
    expect!(p, &P::Token::COLON);

    let value = match parse_object_expr(p)? {
        Expr::Object(v) => v,
        _ => unreachable!(),
    };
    p.input_mut().eat(&P::Token::COMMA);
    expect!(p, &P::Token::RBRACE);
    Ok(TsImportCallOptions {
        span: p.span(start),
        with: Box::new(value),
    })
}

/// `tsParseTypeQuery`
fn parse_ts_type_query<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsTypeQuery> {
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    expect!(p, &P::Token::TYPEOF);
    let expr_name = if p.input().is(&P::Token::IMPORT) {
        parse_ts_import_type(p).map(From::from)?
    } else {
        parse_ts_entity_name(
            p, // allow_reserved_word
            true,
        )
        .map(From::from)?
    };

    let type_args = if !p.input().had_line_break_before_cur() && p.input().is(&P::Token::LESS) {
        let ret = p.do_outside_of_context(Context::ShouldNotLexLtOrGtAsType, parse_ts_type_args)?;
        p.assert_and_bump(&P::Token::GREATER);
        Some(ret)
    } else {
        None
    };

    Ok(TsTypeQuery {
        span: p.span(start),
        expr_name,
        type_args,
    })
}

/// `tsParseModuleBlock`
fn parse_ts_module_block<'a, P: Parser<'a>>(p: &mut P) -> PResult<TsModuleBlock> {
    trace_cur!(p, parse_ts_module_block);

    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();
    expect!(p, &P::Token::LBRACE);
    let body = p.do_inside_of_context(Context::TsModuleBlock, |p| {
        p.do_outside_of_context(Context::TopLevel, |p| {
            parse_module_item_block_body(p, false, Some(&P::Token::RBRACE))
        })
    })?;

    Ok(TsModuleBlock {
        span: p.span(start),
        body,
    })
}

/// `tsParseModuleOrNamespaceDeclaration`
fn parse_ts_module_or_ns_decl<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    namespace: bool,
) -> PResult<Box<TsModuleDecl>> {
    debug_assert!(p.input().syntax().typescript());

    let id = parse_ident_name(p)?;
    let body: TsNamespaceBody = if p.input_mut().eat(&P::Token::DOT) {
        let inner_start = p.cur_pos();
        let inner = parse_ts_module_or_ns_decl(p, inner_start, namespace)?;
        let inner = TsNamespaceDecl {
            span: inner.span,
            id: match inner.id {
                TsModuleName::Ident(i) => i,
                _ => unreachable!(),
            },
            body: Box::new(inner.body.unwrap()),
            declare: inner.declare,
            global: inner.global,
        };
        inner.into()
    } else {
        parse_ts_module_block(p).map(From::from)?
    };

    Ok(Box::new(TsModuleDecl {
        span: p.span(start),
        declare: false,
        id: TsModuleName::Ident(id.into()),
        body: Some(body),
        global: false,
        namespace,
    }))
}

/// `tsParseAmbientExternalModuleDeclaration`
fn parse_ts_ambient_external_module_decl<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
) -> PResult<Box<TsModuleDecl>> {
    debug_assert!(p.input().syntax().typescript());

    let (global, id) = if p.input().is(&P::Token::GLOBAL) {
        let id = parse_ident_name(p)?;
        (true, TsModuleName::Ident(id.into()))
    } else if p.input().cur().is_str() {
        let id = TsModuleName::Str(parse_str_lit(p));
        (false, id)
    } else {
        unexpected!(p, "global or a string literal");
    };

    let body = if p.input().is(&P::Token::LBRACE) {
        Some(parse_ts_module_block(p).map(TsNamespaceBody::from)?)
    } else {
        p.expect_general_semi()?;
        None
    };

    Ok(Box::new(TsModuleDecl {
        span: p.span(start),
        declare: false,
        id,
        global,
        body,
        namespace: false,
    }))
}

/// `tsParseNonArrayType`
fn parse_ts_non_array_type<'a, P: Parser<'a>>(p: &mut P) -> PResult<Box<TsType>> {
    if !cfg!(feature = "typescript") {
        unreachable!()
    }
    trace_cur!(p, parse_ts_non_array_type);
    debug_assert!(p.input().syntax().typescript());

    let start = p.cur_pos();

    let cur = p.input().cur();
    if cur.is_known_ident()
        || cur.is_unknown_ident()
        || cur.is_void()
        || cur.is_yield()
        || cur.is_null()
        || cur.is_await()
        || cur.is_break()
    {
        if p.input().is(&P::Token::ASSERTS) && peek!(p).is_some_and(|peek| peek.is_this()) {
            p.bump();
            let this_keyword = parse_ts_this_type_node(p)?;
            return parse_ts_this_type_predicate(p, start, true, this_keyword)
                .map(TsType::from)
                .map(Box::new);
        }
        let kind = if p.input().is(&P::Token::VOID) {
            Some(TsKeywordTypeKind::TsVoidKeyword)
        } else if p.input().is(&P::Token::NULL) {
            Some(TsKeywordTypeKind::TsNullKeyword)
        } else if p.input().is(&P::Token::ANY) {
            Some(TsKeywordTypeKind::TsAnyKeyword)
        } else if p.input().is(&P::Token::BOOLEAN) {
            Some(TsKeywordTypeKind::TsBooleanKeyword)
        } else if p.input().is(&P::Token::BIGINT) {
            Some(TsKeywordTypeKind::TsBigIntKeyword)
        } else if p.input().is(&P::Token::NEVER) {
            Some(TsKeywordTypeKind::TsNeverKeyword)
        } else if p.input().is(&P::Token::NUMBER) {
            Some(TsKeywordTypeKind::TsNumberKeyword)
        } else if p.input().is(&P::Token::OBJECT) {
            Some(TsKeywordTypeKind::TsObjectKeyword)
        } else if p.input().is(&P::Token::STRING) {
            Some(TsKeywordTypeKind::TsStringKeyword)
        } else if p.input().is(&P::Token::SYMBOL) {
            Some(TsKeywordTypeKind::TsSymbolKeyword)
        } else if p.input().is(&P::Token::UNKNOWN) {
            Some(TsKeywordTypeKind::TsUnknownKeyword)
        } else if p.input().is(&P::Token::UNDEFINED) {
            Some(TsKeywordTypeKind::TsUndefinedKeyword)
        } else if p.input().is(&P::Token::INTRINSIC) {
            Some(TsKeywordTypeKind::TsIntrinsicKeyword)
        } else {
            None
        };

        let peeked_is_dot = peek!(p).is_some_and(|cur| cur.is_dot());

        match kind {
            Some(kind) if !peeked_is_dot => {
                p.bump();
                return Ok(Box::new(TsType::TsKeywordType(TsKeywordType {
                    span: p.span(start),
                    kind,
                })));
            }
            _ => {
                return parse_ts_type_ref(p).map(TsType::from).map(Box::new);
            }
        }
    } else if cur.is_bigint()
        || cur.is_str()
        || cur.is_num()
        || cur.is_true()
        || cur.is_false()
        || cur.is_backquote()
    {
        return parse_ts_lit_type_node(p).map(TsType::from).map(Box::new);
    } else if cur.is_no_substitution_template_literal() || cur.is_template_head() {
        return p.parse_tagged_tpl_ty().map(TsType::from).map(Box::new);
    } else if cur.is_minus() {
        let start = p.cur_pos();

        p.bump();

        let cur = p.input().cur();
        if !(cur.is_num() || cur.is_bigint()) {
            unexpected!(p, "numeric literal or bigint literal")
        }

        let lit = parse_lit(p)?;
        let lit = match lit {
            Lit::Num(Number { span, value, raw }) => {
                let mut new_raw = String::from("-");

                match raw {
                    Some(raw) => {
                        new_raw.push_str(&raw);
                    }
                    _ => {
                        write!(new_raw, "{value}").unwrap();
                    }
                };

                TsLit::Number(Number {
                    span,
                    value: -value,
                    raw: Some(new_raw.into()),
                })
            }
            Lit::BigInt(BigInt { span, value, raw }) => {
                let mut new_raw = String::from("-");

                match raw {
                    Some(raw) => {
                        new_raw.push_str(&raw);
                    }
                    _ => {
                        write!(new_raw, "{value}").unwrap();
                    }
                };

                TsLit::BigInt(BigInt {
                    span,
                    value: Box::new(-*value),
                    raw: Some(new_raw.into()),
                })
            }
            _ => unreachable!(),
        };

        return Ok(Box::new(TsType::TsLitType(TsLitType {
            span: p.span(start),
            lit,
        })));
    } else if cur.is_import() {
        return parse_ts_import_type(p).map(TsType::from).map(Box::new);
    } else if cur.is_this() {
        let start = p.cur_pos();
        let this_keyword = parse_ts_this_type_node(p)?;
        return if !p.input().had_line_break_before_cur() && p.input().is(&P::Token::IS) {
            parse_ts_this_type_predicate(p, start, false, this_keyword)
                .map(TsType::from)
                .map(Box::new)
        } else {
            Ok(Box::new(TsType::TsThisType(this_keyword)))
        };
    } else if cur.is_typeof() {
        return parse_ts_type_query(p).map(TsType::from).map(Box::new);
    } else if cur.is_lbrace() {
        return if ts_look_ahead(p, is_ts_start_of_mapped_type) {
            parse_ts_mapped_type(p).map(TsType::from).map(Box::new)
        } else {
            parse_ts_type_lit(p).map(TsType::from).map(Box::new)
        };
    } else if cur.is_lbracket() {
        return parse_ts_tuple_type(p).map(TsType::from).map(Box::new);
    } else if cur.is_lparen() {
        return parse_ts_parenthesized_type(p)
            .map(TsType::from)
            .map(Box::new);
    }

    //   switch (p.state.type) {
    //   }

    unexpected!(
        p,
        "an identifier, void, yield, null, await, break, a string literal, a numeric literal, \
         true, false, `, -, import, this, typeof, {, [, ("
    )
}

/// `tsParseExpressionStatement`
pub fn parse_ts_expr_stmt<'a, P: Parser<'a>>(
    p: &mut P,
    decorators: Vec<Decorator>,
    expr: Ident,
) -> PResult<Option<Decl>> {
    if !cfg!(feature = "typescript") {
        return Ok(Default::default());
    }

    let start = expr.span_lo();

    match &*expr.sym {
        "declare" => {
            let decl = try_parse_ts_declare(p, start, decorators)?;
            if let Some(decl) = decl {
                Ok(Some(make_decl_declare(decl)))
            } else {
                Ok(None)
            }
        }
        "global" => {
            // `global { }` (with no `declare`) may appear inside an ambient module
            // declaration.
            // Would like to use tsParseAmbientExternalModuleDeclaration here, but already
            // ran past "global".
            if p.input().is(&P::Token::LBRACE) {
                let global = true;
                let id = TsModuleName::Ident(expr);
                let body = parse_ts_module_block(p)
                    .map(TsNamespaceBody::from)
                    .map(Some)?;
                Ok(Some(
                    TsModuleDecl {
                        span: p.span(start),
                        global,
                        declare: false,
                        namespace: false,
                        id,
                        body,
                    }
                    .into(),
                ))
            } else {
                Ok(None)
            }
        }
        _ => parse_ts_decl(p, start, decorators, expr.sym, /* next */ false),
    }
}

/// `tsTryParseDeclare`
pub fn try_parse_ts_declare<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    decorators: Vec<Decorator>,
) -> PResult<Option<Decl>> {
    if !p.syntax().typescript() {
        return Ok(None);
    }

    if p.ctx()
        .contains(Context::InDeclare | Context::TsModuleBlock)
    {
        let span_of_declare = p.span(start);
        p.emit_err(span_of_declare, SyntaxError::TS1038);
    }

    let declare_start = start;
    p.do_inside_of_context(Context::InDeclare, |p| {
        if p.input().is(&P::Token::FUNCTION) {
            return parse_fn_decl(p, decorators)
                .map(|decl| match decl {
                    Decl::Fn(f) => FnDecl {
                        declare: true,
                        function: Box::new(Function {
                            span: Span {
                                lo: declare_start,
                                ..f.function.span
                            },
                            ..*f.function
                        }),
                        ..f
                    }
                    .into(),
                    _ => decl,
                })
                .map(Some);
        }

        if p.input().is(&P::Token::CLASS) {
            return parse_class_decl(p, start, start, decorators, false)
                .map(|decl| match decl {
                    Decl::Class(c) => ClassDecl {
                        declare: true,
                        class: Box::new(Class {
                            span: Span {
                                lo: declare_start,
                                ..c.class.span
                            },
                            ..*c.class
                        }),
                        ..c
                    }
                    .into(),
                    _ => decl,
                })
                .map(Some);
        }

        if p.input().is(&P::Token::CONST) && peek!(p).is_some_and(|peek| peek.is_enum()) {
            p.assert_and_bump(&P::Token::CONST);
            p.assert_and_bump(&P::Token::ENUM);

            return parse_ts_enum_decl(p, start, /* is_const */ true)
                .map(|decl| TsEnumDecl {
                    declare: true,
                    span: Span {
                        lo: declare_start,
                        ..decl.span
                    },
                    ..*decl
                })
                .map(Box::new)
                .map(From::from)
                .map(Some);
        }

        let cur = p.input().cur();
        if cur.is_const() || cur.is_var() || cur.is_let() {
            return parse_var_stmt(p, false)
                .map(|decl| VarDecl {
                    declare: true,
                    span: Span {
                        lo: declare_start,
                        ..decl.span
                    },
                    ..*decl
                })
                .map(Box::new)
                .map(From::from)
                .map(Some);
        }

        if p.input().is(&P::Token::GLOBAL) {
            return parse_ts_ambient_external_module_decl(p, start)
                .map(Decl::from)
                .map(make_decl_declare)
                .map(Some);
        } else if p.input().cur().is_word() {
            let value = p
                .input_mut()
                .cur()
                .clone()
                .take_word(p.input_mut())
                .unwrap();
            return parse_ts_decl(p, start, decorators, value, /* next */ true)
                .map(|v| v.map(make_decl_declare));
        }

        Ok(None)
    })
}

/// `tsTryParseExportDeclaration`
///
/// Note: this won't be called unless the keyword is allowed in
/// `shouldParseExportDeclaration`.
pub fn try_parse_ts_export_decl<'a, P: Parser<'a>>(
    p: &mut P,
    decorators: Vec<Decorator>,
    value: Atom,
) -> Option<Decl> {
    if !cfg!(feature = "typescript") {
        return None;
    }

    try_parse_ts(p, |p| {
        let start = p.cur_pos();
        let opt = parse_ts_decl(p, start, decorators, value, true)?;
        Ok(opt)
    })
}

/// Common to tsTryParseDeclare, tsTryParseExportDeclaration, and
/// tsParseExpressionStatement.
///
/// `tsParseDeclaration`
fn parse_ts_decl<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
    decorators: Vec<Decorator>,
    value: Atom,
    next: bool,
) -> PResult<Option<Decl>> {
    if !cfg!(feature = "typescript") {
        return Ok(Default::default());
    }

    match &*value {
        "abstract" => {
            if next || (p.input().is(&P::Token::CLASS) && !p.input().had_line_break_before_cur()) {
                if next {
                    p.bump();
                }
                return Ok(Some(parse_class_decl(p, start, start, decorators, true)?));
            }
        }

        "enum" => {
            if next || p.is_ident_ref() {
                if next {
                    p.bump();
                }
                return parse_ts_enum_decl(p, start, /* is_const */ false)
                    .map(From::from)
                    .map(Some);
            }
        }

        "interface" => {
            if next || (p.is_ident_ref()) {
                if next {
                    p.bump();
                }

                return parse_ts_interface_decl(p, start).map(From::from).map(Some);
            }
        }

        "module" if !p.input().had_line_break_before_cur() => {
            if next {
                p.bump();
            }

            let cur = p.input().cur();
            if cur.is_str() {
                return parse_ts_ambient_external_module_decl(p, start)
                    .map(From::from)
                    .map(Some);
            } else if cur.is_error() {
                let err = p.input_mut().expect_error_token_and_bump();
                return Err(err);
            } else if cur.is_eof() {
                return Err(eof_error(p));
            } else if next || p.is_ident_ref() {
                return parse_ts_module_or_ns_decl(p, start, false)
                    .map(From::from)
                    .map(Some);
            }
        }

        "namespace" => {
            if next || p.is_ident_ref() {
                if next {
                    p.bump();
                }
                return parse_ts_module_or_ns_decl(p, start, true)
                    .map(From::from)
                    .map(Some);
            }
        }

        "type" => {
            if next || (!p.input().had_line_break_before_cur() && p.is_ident_ref()) {
                if next {
                    p.bump();
                }
                return parse_ts_type_alias_decl(p, start).map(From::from).map(Some);
            }
        }

        _ => {}
    }

    Ok(None)
}

/// `tsTryParseGenericAsyncArrowFunction`
pub fn try_parse_ts_generic_async_arrow_fn<'a, P: Parser<'a>>(
    p: &mut P,
    start: BytePos,
) -> PResult<Option<ArrowExpr>> {
    if !cfg!(feature = "typescript") {
        return Ok(Default::default());
    }

    let cur = p.input().cur();
    let res = if cur.is_less() || cur.is_jsx_tag_start() {
        try_parse_ts(p, |p| {
            let type_params = parse_ts_type_params(p, false, false)?;

            // In TSX mode, type parameters that could be mistaken for JSX
            // (single param without constraint and no trailing comma) are not
            // allowed.
            if p.input().syntax().jsx() && type_params.params.len() == 1 {
                let single_param = &type_params.params[0];
                let has_trailing_comma = type_params.span.hi.0 - single_param.span.hi.0 > 1;
                let dominated_by_jsx = single_param.constraint.is_none() && !has_trailing_comma;

                if dominated_by_jsx {
                    return Ok(None);
                }
            }

            // Don't use overloaded parseFunctionParams which would look for "<" again.
            expect!(p, &P::Token::LPAREN);
            let params: Vec<Pat> = parse_formal_params(p)?.into_iter().map(|p| p.pat).collect();
            expect!(p, &P::Token::RPAREN);
            let return_type = try_parse_ts_type_or_type_predicate_ann(p)?;
            expect!(p, &P::Token::ARROW);

            Ok(Some((type_params, params, return_type)))
        })
    } else {
        None
    };

    let (type_params, params, return_type) = match res {
        Some(v) => v,
        None => return Ok(None),
    };

    p.do_inside_of_context(Context::InAsync, |p| {
        p.do_outside_of_context(Context::InGenerator, |p| {
            let is_generator = false;
            let is_async = true;
            let body = parse_fn_block_or_expr_body(
                p,
                true,
                false,
                true,
                params.is_simple_parameter_list(),
            )?;
            Ok(Some(ArrowExpr {
                span: p.span(start),
                body,
                is_async,
                is_generator,
                type_params: Some(type_params),
                params,
                return_type,
                ..Default::default()
            }))
        })
    })
}
