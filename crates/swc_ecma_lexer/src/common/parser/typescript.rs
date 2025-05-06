use swc_common::{BytePos, Span};

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
pub(super) fn parse_ts_delimited_list_inner<'a, P: Parser<'a>, T, F>(
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

        if p.input_mut().eat(&P::Token::comma()) {
            continue;
        }

        if is_ts_list_terminator(p, kind)? {
            break;
        }

        if kind == ParsingContext::EnumMembers {
            let expect = P::Token::comma();
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
        expect!(p, &P::Token::comma());
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
