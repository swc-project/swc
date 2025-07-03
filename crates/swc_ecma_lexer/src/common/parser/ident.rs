use either::Either;
use swc_atoms::atom;
use swc_common::BytePos;
use swc_ecma_ast::*;

use super::{buffer::Buffer, expr::parse_str_lit, PResult, Parser};
use crate::{
    common::{
        context::Context,
        lexer::token::TokenFactory,
        parser::{eof_error, token_and_span::TokenAndSpan},
    },
    error::SyntaxError,
};

// https://tc39.es/ecma262/#prod-ModuleExportName
pub fn parse_module_export_name<'a, P: Parser<'a>>(p: &mut P) -> PResult<ModuleExportName> {
    let Some(cur) = p.input_mut().cur() else {
        unexpected!(p, "identifier or string");
    };
    let module_export_name = if cur.is_str() {
        ModuleExportName::Str(parse_str_lit(p))
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
    p.input_mut().cur();
    let Some(token_and_span) = p.input().get_cur() else {
        return Err(eof_error(p));
    };
    let start = token_and_span.span().lo;
    let cur = token_and_span.token();
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
    p.assert_and_bump(&P::Token::HASH);
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

/// IdentifierReference
#[inline]
pub fn parse_ident_ref<'a>(p: &mut impl Parser<'a>) -> PResult<Ident> {
    let ctx = p.ctx();
    parse_ident(
        p,
        !ctx.contains(Context::InGenerator),
        !ctx.contains(Context::InAsync),
    )
}

/// LabelIdentifier
#[inline]
pub fn parse_label_ident<'a>(p: &mut impl Parser<'a>) -> PResult<Ident> {
    let ctx = p.ctx();
    parse_ident(
        p,
        !ctx.contains(Context::InGenerator),
        !ctx.contains(Context::InAsync),
    )
}

/// babel: `parseBindingIdentifier`
///
/// spec: `BindingIdentifier`
pub fn parse_binding_ident<'a>(
    p: &mut impl Parser<'a>,
    disallow_let: bool,
) -> PResult<BindingIdent> {
    trace_cur!(p, parse_binding_ident);

    if disallow_let && p.input_mut().cur().is_some_and(|cur| cur.is_let()) {
        unexpected!(p, "let is reserved in const, let, class declaration")
    }

    // "yield" and "await" is **lexically** accepted.
    let ident = parse_ident(p, true, true)?;
    if ident.is_reserved_in_strict_bind() {
        p.emit_strict_mode_err(ident.span, SyntaxError::EvalAndArgumentsInStrict);
    }
    if (p.ctx().contains(Context::InAsync) || p.ctx().contains(Context::InStaticBlock))
        && ident.sym == "await"
    {
        p.emit_err(ident.span, SyntaxError::ExpectedIdent);
    }
    if p.ctx().contains(Context::InGenerator) && ident.sym == "yield" {
        p.emit_err(ident.span, SyntaxError::ExpectedIdent);
    }

    Ok(ident.into())
}

pub fn parse_opt_binding_ident<'a>(
    p: &mut impl Parser<'a>,
    disallow_let: bool,
) -> PResult<Option<BindingIdent>> {
    trace_cur!(p, parse_opt_binding_ident);
    let ctx = p.ctx();
    let Some(cur) = p.input_mut().cur() else {
        return Ok(None);
    };
    let is_binding_ident = cur.is_word() && !cur.is_reserved(ctx);
    if is_binding_ident || (cur.is_this() && p.input().syntax().typescript()) {
        parse_binding_ident(p, disallow_let).map(Some)
    } else {
        Ok(None)
    }
}

/// Identifier
///
/// In strict mode, "yield" is SyntaxError if matched.
pub fn parse_ident<'a>(
    p: &mut impl Parser<'a>,
    incl_yield: bool,
    incl_await: bool,
) -> PResult<Ident> {
    trace_cur!(p, parse_ident);

    p.input_mut().cur();
    let Some(token_and_span) = p.input().get_cur() else {
        return Err(eof_error(p));
    };
    let t = token_and_span.token();
    if !t.is_word() {
        syntax_error!(p, SyntaxError::ExpectedIdent)
    }
    let start = token_and_span.span().lo;
    let t = p.bump();

    let word;
    // Spec:
    // It is a Syntax Error if StringValue of IdentifierName is the same String
    // value as the StringValue of any ReservedWord except for yield or await.
    if t.is_await() {
        let ctx = p.ctx();
        if ctx.contains(Context::InDeclare) {
            word = atom!("await");
        } else if ctx.contains(Context::InStaticBlock) {
            syntax_error!(p, p.input().prev_span(), SyntaxError::ExpectedIdent)
        } else if ctx.contains(Context::Module) | ctx.contains(Context::InAsync) {
            syntax_error!(p, p.input().prev_span(), SyntaxError::InvalidIdentInAsync)
        } else if incl_await {
            word = atom!("await");
        } else {
            syntax_error!(p, p.input().prev_span(), SyntaxError::ExpectedIdent)
        }
    } else if t.is_this() && p.input().syntax().typescript() {
        word = atom!("this");
    } else if t.is_let() {
        word = atom!("let");
    } else if t.is_known_ident() {
        // Spec:
        // It is a Syntax Error if this phrase is contained in strict mode code and the
        // StringValue of IdentifierName is: "implements", "interface", "let",
        // "package", "private", "protected", "public", "static", or "yield".
        if t.is_enum() {
            p.emit_err(
                p.input().prev_span(),
                SyntaxError::InvalidIdentInStrict(t.clone().take_word(p.input()).unwrap()),
            );
        } else if t.is_yield()
            || t.is_let()
            || t.is_static()
            || t.is_implements()
            || t.is_interface()
            || t.is_package()
            || t.is_private()
            || t.is_protected()
            || t.is_public()
        {
            p.emit_strict_mode_err(
                p.input().prev_span(),
                SyntaxError::InvalidIdentInStrict(t.clone().take_word(p.input()).unwrap()),
            );
        };

        word = t.take_known_ident();
    } else if t.is_unknown_ident() {
        word = t.take_unknown_ident(p.input_mut());
        if p.ctx().contains(Context::InClassField) && word == atom!("arguments") {
            p.emit_err(p.input().prev_span(), SyntaxError::ArgumentsInClassField)
        }
    } else if t.is_yield() && incl_yield {
        word = atom!("yield");
    } else if t.is_null() || t.is_true() || t.is_false() {
        syntax_error!(p, p.input().prev_span(), SyntaxError::ExpectedIdent)
    } else if t.is_keyword() {
        syntax_error!(p, p.input().prev_span(), SyntaxError::ExpectedIdent)
    } else {
        unreachable!()
    }

    Ok(Ident::new_no_ctxt(word, p.span(start)))
}
