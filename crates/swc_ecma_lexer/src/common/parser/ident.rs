use either::Either;
use swc_common::{BytePos, Span};
use swc_ecma_ast::{IdentName, Lit, ModuleExportName, PrivateName};

use super::{buffer::Buffer, expr::parse_lit, PResult, Parser};
use crate::{
    common::{context::Context, lexer::token::TokenFactory},
    error::SyntaxError,
};

// https://tc39.es/ecma262/#prod-ModuleExportName
pub fn parse_module_export_name<'a, P: Parser<'a>>(p: &mut P) -> PResult<ModuleExportName> {
    let Ok(cur) = cur!(p, false) else {
        unexpected!(p, "identifier or string");
    };
    let module_export_name = if cur.is_str() {
        match parse_lit(p)? {
            Lit::Str(str_lit) => ModuleExportName::Str(str_lit),
            _ => unreachable!(),
        }
    } else if cur.is_word() {
        ModuleExportName::Ident(parse_ident_name(p)?.into())
    } else {
        unexpected!(p, "identifier or string");
    };
    Ok(module_export_name)
}

/// Use this when spec says "IdentifierName".
/// This allows idents like `catch`.
pub fn parse_ident_name<'a, P: Parser<'a>>(p: &mut P) -> PResult<IdentName> {
    let start = p.cur_pos();
    let cur = cur!(p, true);
    let w = if cur.is_word() {
        let t = p.bump();
        t.take_word(p.input_mut()).unwrap()
    } else if cur.is_jsx_name() && p.ctx().contains(Context::InType) {
        let t = p.bump();
        t.take_jsx_name(p.input_mut())
    } else {
        syntax_error!(p, SyntaxError::ExpectedIdent)
    };
    Ok(IdentName::new(w, p.span(start)))
}

pub fn parse_maybe_private_name<'a, P: Parser<'a>>(
    p: &mut P,
) -> PResult<Either<PrivateName, IdentName>> {
    let is_private = p.input_mut().is(&P::Token::HASH);
    if is_private {
        parse_private_name(p).map(Either::Left)
    } else {
        parse_ident_name(p).map(Either::Right)
    }
}

pub fn parse_private_name<'a, P: Parser<'a>>(p: &mut P) -> PResult<PrivateName> {
    let start = p.cur_pos();
    p.assert_and_bump(&P::Token::HASH)?;
    let hash_end = p.input().prev_span().hi;
    if p.input_mut().cur_pos() - hash_end != BytePos(0) {
        syntax_error!(p, p.span(start), SyntaxError::SpaceBetweenHashAndIdent);
    }
    let id = parse_ident_name(p)?;
    Ok(PrivateName {
        span: p.span(start),
        name: id.sym,
    })
}
