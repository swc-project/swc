use super::{PResult, Parser};
use crate::common::{context::Context, parser::buffer::Buffer};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ParsingContext {
    EnumMembers,
    HeritageClauseElement,
    TupleElementTypes,
    TypeMembers,
    TypeParametersOrArguments,
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
    while !p.is_ts_list_terminator(kind)? {
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
