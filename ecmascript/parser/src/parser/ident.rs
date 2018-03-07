//! 12.1 Identifiers

use super::*;

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    /// IdentifierReference
    pub(super) fn parse_ident_ref(&mut self) -> PResult<'a, Ident> {
        let ctx = self.ctx();

        self.parse_ident(!ctx.in_generator, !ctx.in_async)
    }

    /// LabelIdentifier
    pub(super) fn parse_label_ident(&mut self) -> PResult<'a, Ident> {
        let ctx = self.ctx();

        self.parse_ident(!ctx.in_generator, !ctx.in_async)
    }

    /// Use this when spec says "IdentiferName".
    /// This allows idents like `catch`.
    pub(super) fn parse_ident_name(&mut self) -> PResult<'a, Ident> {
        let start = cur_pos!();

        let w = match cur!() {
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
    pub(super) fn parse_ident(&mut self, incl_yield: bool, incl_await: bool) -> PResult<'a, Ident> {
        let start = cur_pos!();

        let word = self.parse_with(|p| {
            let strict = p.ctx().strict;
            let w = match cur!() {
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
                Ident(js_word!("enum")) => {
                    syntax_error!(p.input.prev_span(), SyntaxError::InvalidIdentInStrict)
                }
                Keyword(Yield)
                | Ident(js_word!("static"))
                | Ident(js_word!("implements"))
                | Ident(js_word!("interface"))
                | Ident(js_word!("let"))
                | Ident(js_word!("package"))
                | Ident(js_word!("private"))
                | Ident(js_word!("protected"))
                | Ident(js_word!("public")) if strict =>
                {
                    syntax_error!(p.input.prev_span(), SyntaxError::InvalidIdentInStrict)
                }
                _ => {}
            }

            //TODO
            // Spec:
            // It is a Syntax Error if StringValue of IdentifierName is the same String
            // value as the StringValue of any ReservedWord except for yield or await.

            match w {
                // It is a Syntax Error if the goal symbol of the syntactic grammar is Module
                // and the StringValue of IdentifierName is "await".
                Keyword(Await) if p.ctx().module => {
                    syntax_error!(p.input.prev_span(), SyntaxError::ExpectedIdent)
                }
                Keyword(Let) => Ok(w.into()),
                Ident(ident) => Ok(ident),
                Keyword(Yield) if incl_yield => Ok(js_word!("yield")),
                Keyword(Await) if incl_await => Ok(js_word!("await")),
                Keyword(..) | Null | True | False => {
                    syntax_error!(p.input.prev_span(), SyntaxError::ExpectedIdent)
                }
            }
        })?;

        Ok(Ident::new(word, span!(start)))
    }
}

pub(super) trait MaybeOptionalIdentParser<'a, Ident> {
    fn parse_maybe_opt_binding_ident(&mut self) -> PResult<'a, Ident>;
}
impl<'a, I: Input> MaybeOptionalIdentParser<'a, Ident> for Parser<'a, I> {
    fn parse_maybe_opt_binding_ident(&mut self) -> PResult<'a, Ident> {
        self.parse_binding_ident()
    }
}
impl<'a, I: Input> MaybeOptionalIdentParser<'a, Option<Ident>> for Parser<'a, I> {
    fn parse_maybe_opt_binding_ident(&mut self) -> PResult<'a, Option<Ident>> {
        self.parse_opt_binding_ident()
    }
}
