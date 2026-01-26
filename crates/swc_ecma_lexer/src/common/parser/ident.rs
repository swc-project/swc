use either::Either;
use swc_atoms::atom;
use swc_common::BytePos;
use swc_ecma_ast::*;

use super::{buffer::Buffer, expr::parse_str_lit, PResult, Parser};
use crate::{
    common::{context::Context, lexer::token::TokenFactory, parser::token_and_span::TokenAndSpan},
    error::SyntaxError,
};

// https://tc39.es/ecma262/#prod-ModuleExportName
pub fn parse_module_export_name<'a, P: Parser<'a>>(p: &mut P) -> PResult<ModuleExportName> {
    let cur = p.input().cur();
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
    let token_and_span = p.input().get_cur();
    let start = token_and_span.span().lo;
    let cur = token_and_span.token();
    let w = if cur.is_word() {
        p.input_mut().expect_word_token_and_bump()
    } else if cur.is_jsx_name() && p.ctx().contains(Context::InType) {
        p.input_mut().expect_jsx_name_token_and_bump()
    } else {
        syntax_error!(p, SyntaxError::ExpectedIdent)
    };
    Ok(IdentName::new(w, p.span(start)))
}

pub fn parse_maybe_private_name<'a, P: Parser<'a>>(
    p: &mut P,
) -> PResult<Either<PrivateName, IdentName>> {
    let is_private = p.input().is(&P::Token::HASH);
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
    if p.input().cur_pos() - hash_end != BytePos(0) {
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
    parse_ident_ref(p)
}

/// babel: `parseBindingIdentifier`
///
/// spec: `BindingIdentifier`
pub fn parse_binding_ident<'a>(
    p: &mut impl Parser<'a>,
    disallow_let: bool,
) -> PResult<BindingIdent> {
    trace_cur!(p, parse_binding_ident);

    let cur = p.input().cur();
    if disallow_let && cur.is_let() {
        unexpected!(p, "let is reserved in const, let, class declaration")
    } else if cur.is_unknown_ident() {
        let span = p.input().cur_span();
        let word = p.input_mut().expect_word_token_and_bump();
        if atom!("arguments") == word || atom!("eval") == word {
            p.emit_strict_mode_err(span, SyntaxError::EvalAndArgumentsInStrict);
        }
        return Ok(Ident::new_no_ctxt(word, span).into());
    }

    // "yield" and "await" is **lexically** accepted.
    let ident = parse_ident(p, true, true)?;
    let ctx = p.ctx();
    if (ctx.intersects(Context::InAsync.union(Context::InStaticBlock)) && ident.sym == "await")
        || (ctx.contains(Context::InGenerator) && ident.sym == "yield")
    {
        p.emit_err(ident.span, SyntaxError::ExpectedIdent);
    }

    Ok(ident.into())
}

pub fn parse_opt_binding_ident<'a>(
    p: &mut impl Parser<'a>,
    disallow_let: bool,
) -> PResult<Option<BindingIdent>> {
    trace_cur!(p, parse_opt_binding_ident);
    let token_and_span = p.input().get_cur();
    let cur = token_and_span.token();
    if cur.is_this() && p.input().syntax().typescript() {
        let start = token_and_span.span().lo;
        Ok(Some(
            Ident::new_no_ctxt(atom!("this"), p.span(start)).into(),
        ))
    } else if cur.is_word() && !cur.is_reserved(p.ctx()) {
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

    let token_and_span = p.input().get_cur();
    if !token_and_span.token().is_word() {
        syntax_error!(p, SyntaxError::ExpectedIdent)
    }
    let span = token_and_span.span();
    let start = span.lo;
    let t = token_and_span.token();

    // Spec:
    // It is a Syntax Error if this phrase is contained in strict mode code and the
    // StringValue of IdentifierName is: "implements", "interface", "let",
    // "package", "private", "protected", "public", "static", or "yield".
    if t.is_enum() {
        let word = p.input_mut().expect_word_token_and_bump();
        p.emit_err(span, SyntaxError::InvalidIdentInStrict(word.clone()));
        return Ok(Ident::new_no_ctxt(word, p.span(start)));
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
        let word = p.input_mut().expect_word_token_and_bump();
        p.emit_strict_mode_err(span, SyntaxError::InvalidIdentInStrict(word.clone()));
        return Ok(Ident::new_no_ctxt(word, p.span(start)));
    };

    let word;

    // Spec:
    // It is a Syntax Error if StringValue of IdentifierName is the same String
    // value as the StringValue of any ReservedWord except for yield or await.
    if t.is_await() {
        let ctx = p.ctx();
        if ctx.contains(Context::InDeclare) {
            word = atom!("await");
        } else if ctx.contains(Context::InStaticBlock) {
            syntax_error!(p, span, SyntaxError::ExpectedIdent)
        } else if ctx.contains(Context::Module) | ctx.contains(Context::InAsync) {
            syntax_error!(p, span, SyntaxError::InvalidIdentInAsync)
        } else if incl_await {
            word = atom!("await")
        } else {
            syntax_error!(p, span, SyntaxError::ExpectedIdent)
        }
    } else if t.is_this() && p.input().syntax().typescript() {
        word = atom!("this")
    } else if t.is_let() {
        word = atom!("let")
    } else if t.is_known_ident() {
        let ident = t.take_known_ident();
        word = ident
    } else if t.is_unknown_ident() {
        let word = p.input_mut().expect_word_token_and_bump();
        if p.ctx().contains(Context::InClassField) && word == atom!("arguments") {
            p.emit_err(span, SyntaxError::ArgumentsInClassField)
        }
        return Ok(Ident::new_no_ctxt(word, p.span(start)));
    } else if t.is_yield() && incl_yield {
        word = atom!("yield")
    } else if t.is_null() || t.is_true() || t.is_false() || t.is_keyword() {
        syntax_error!(p, span, SyntaxError::ExpectedIdent)
    } else {
        unreachable!()
    }
    p.bump();

    Ok(Ident::new_no_ctxt(word, p.span(start)))
}
