//! 12.1 Identifiers
use super::*;
use crate::{make_span, token::Keyword};
use either::Either;
use swc_atoms::js_word;
use swc_ecma_parser_macros::parser;

#[parser]
impl<'a, I: Tokens> Parser<I> {
    pub(super) fn parse_maybe_private_name(&mut self) -> PResult<Either<PrivateName, Ident>> {
        let start = cur_pos!();
        let is_private = is!('#');

        if is_private {
            self.parse_private_name().map(Either::Left)
        } else {
            self.parse_ident_name().map(Either::Right)
        }
    }

    pub(super) fn parse_private_name(&mut self) -> PResult<PrivateName> {
        let start = cur_pos!();
        assert_and_bump!('#');

        let hash_end = self.input.prev_span().hi;
        if self.input.cur_pos() - hash_end != BytePos(0) {
            syntax_error!(span!(start), SyntaxError::SpaceBetweenHashAndIdent);
        }

        let id = self.parse_ident_name()?;
        Ok(PrivateName {
            span: span!(start),
            id,
        })
    }

    /// IdentifierReference
    pub(super) fn parse_ident_ref(&mut self) -> PResult<Ident> {
        let ctx = self.ctx();

        self.parse_ident(!ctx.in_generator, !ctx.in_async)
    }

    /// LabelIdentifier
    pub(super) fn parse_label_ident(&mut self) -> PResult<Ident> {
        let ctx = self.ctx();

        self.parse_ident(!ctx.in_generator, !ctx.in_async)
    }

    /// Use this when spec says "IdentifierName".
    /// This allows idents like `catch`.
    pub(super) fn parse_ident_name(&mut self) -> PResult<Ident> {
        let start = cur_pos!();

        let w = match cur!(true) {
            Ok(&Word(..)) => match bump!() {
                Word(w) => w,
                _ => unreachable!(),
            },
            _ => syntax_error!(SyntaxError::ExpectedIdent),
        };

        Ok(Ident::new(w.into(), span!(start)))
    }

    /// Identifier
    ///
    /// In strict mode, "yield" is SyntaxError if matched.
    pub(super) fn parse_ident(&mut self, incl_yield: bool, incl_await: bool) -> PResult<Ident> {
        trace_cur!(parse_ident);

        let start = cur_pos!();

        let word = self.parse_with(|p| {
            let strict = p.ctx().strict;
            let w = match cur!(true) {
                Ok(&Word(..)) => match bump!() {
                    Word(w) => w,
                    _ => unreachable!(),
                },
                _ => syntax_error!(SyntaxError::ExpectedIdent),
            };

            // Spec:
            // It is a Syntax Error if this phrase is contained in strict mode code and the
            // StringValue of IdentifierName is: "implements", "interface", "let",
            // "package", "private", "protected",  "public", "static", or "yield".
            match w {
                Word::Ident(js_word!("enum")) => {
                    p.emit_err(
                        make_span(p.input.prev_span()),
                        SyntaxError::InvalidIdentInStrict,
                    );
                }
                Word::Keyword(Keyword::Yield)
                | Word::Ident(js_word!("static"))
                | Word::Ident(js_word!("implements"))
                | Word::Ident(js_word!("interface"))
                | Word::Ident(js_word!("let"))
                | Word::Ident(js_word!("package"))
                | Word::Ident(js_word!("private"))
                | Word::Ident(js_word!("protected"))
                | Word::Ident(js_word!("public"))
                    if strict =>
                {
                    p.emit_err(
                        make_span(p.input.prev_span()),
                        SyntaxError::InvalidIdentInStrict,
                    );
                }
                _ => {}
            }

            //TODO
            // Spec:
            // It is a Syntax Error if StringValue of IdentifierName is the same String
            // value as the StringValue of any ReservedWord except for yield or await.

            match w {
                Word::Keyword(Keyword::Await) if p.input.syntax().typescript() => {
                    Ok(js_word!("this"))
                }

                // It is a Syntax Error if the goal symbol of the syntactic grammar is Module
                // and the StringValue of IdentifierName is "await".
                Word::Keyword(Keyword::Await) if p.ctx().module => {
                    syntax_error!(make_span(p.input.prev_span()), SyntaxError::ExpectedIdent)
                }
                Word::Keyword(Keyword::This) if p.input.syntax().typescript() => {
                    Ok(js_word!("this"))
                }
                Word::Keyword(Keyword::Let) => Ok(js_word!("let")),
                Word::Ident(ident) => Ok(ident),
                Word::Keyword(Keyword::Yield) if incl_yield => Ok(js_word!("yield")),
                Word::Keyword(Keyword::Await) if incl_await => Ok(js_word!("await")),
                Word::Keyword(..) | Word::Null | Word::True | Word::False => {
                    syntax_error!(make_span(p.input.prev_span()), SyntaxError::ExpectedIdent)
                }
            }
        })?;

        Ok(Ident::new(word, span!(start)))
    }
}

pub(super) trait MaybeOptionalIdentParser<Ident> {
    fn parse_maybe_opt_binding_ident(&mut self) -> PResult<Ident>;
}
impl<I: Tokens> MaybeOptionalIdentParser<Ident> for Parser<I> {
    fn parse_maybe_opt_binding_ident(&mut self) -> PResult<Ident> {
        self.parse_binding_ident()
    }
}
impl<I: Tokens> MaybeOptionalIdentParser<Option<Ident>> for Parser<I> {
    fn parse_maybe_opt_binding_ident(&mut self) -> PResult<Option<Ident>> {
        self.parse_opt_binding_ident()
    }
}
