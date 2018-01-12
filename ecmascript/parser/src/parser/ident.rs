//! 12.1 Identifiers

use super::*;

#[parser]
impl<I: Input> Parser<I> {
    /// IdentifierReference
    pub(super) fn parse_ident_ref(&mut self) -> PResult<Ident> {
        let ctx = self.ctx;

        self.parse_ident(!ctx.in_generator, !ctx.in_async)
    }

    /// LabelIdentifier
    pub(super) fn parse_label_ident(&mut self) -> PResult<Ident> {
        let ctx = self.ctx;

        self.parse_ident(!ctx.in_generator, !ctx.in_async)
    }

    /// Use this when spec says "IdentiferName".
    /// This allows idents like `catch`.
    pub(super) fn parse_ident_name(&mut self) -> PResult<Ident> {
        spanned!({
            let w = match cur!() {
                Some(&Word(..)) => match bump!() {
                    Word(w) => w,
                    _ => unreachable!(),
                },
                _ => syntax_error!(SyntaxError::ExpectedIdent),
            };

            Ok(w.into())
        })
    }

    /// Identifier
    ///
    /// In strict mode, "yield" is SyntaxError if matched.
    pub(super) fn parse_ident(&mut self, incl_yield: bool, incl_await: bool) -> PResult<Ident> {
        spanned!({
            let strict = self.ctx.strict;
            let w = match cur!() {
                Some(&Word(..)) => match bump!() {
                    Word(w) => w,
                    _ => unreachable!(),
                },
                _ => syntax_error!(SyntaxError::ExpectedIdent),
            };

            // Spec:
            // It is a Syntax Error if this phrase is contained in strict mode code and the
            // StringValue of IdentifierName is: "implements", "interface", "let",
            // "package", "private", "protected",  "public", "static", or "yield".
            if strict {
                match w {
                    Keyword(Yield)
                    | Ident(js_word!("static"))
                    | Ident(js_word!("implements"))
                    | Ident(js_word!("interface"))
                    | Ident(js_word!("let"))
                    | Ident(js_word!("package"))
                    | Ident(js_word!("private"))
                    | Ident(js_word!("protected"))
                    | Ident(js_word!("public")) => syntax_error!(SyntaxError::InvalidIdentInStrict),
                    _ => {}
                }
            }

            //TODO
            // Spec:
            // It is a Syntax Error if the goal symbol of the syntactic grammar is Module
            // and the StringValue of IdentifierName is "await".

            //TODO
            // Spec:
            // It is a Syntax Error if StringValue of IdentifierName is the same String
            // value as the StringValue of any ReservedWord except for yield or await.

            match w {
                Keyword(Let) => Ok(w.into()),
                Ident(ident) => Ok(ident),
                Keyword(Yield) if incl_yield => Ok(js_word!("yield")),
                Keyword(Await) if incl_await => Ok(js_word!("await")),
                Keyword(..) | Null | True | False => {
                    println!("Word: {:?}", w);
                    syntax_error!(SyntaxError::ExpectedIdent)
                }
            }
        })
    }
}

pub(super) trait MaybeOptionalIdentParser<Ident> {
    fn parse_maybe_opt_binding_ident(&mut self) -> PResult<Ident>;
}
impl<I: Input> MaybeOptionalIdentParser<Ident> for Parser<I> {
    fn parse_maybe_opt_binding_ident(&mut self) -> PResult<Ident> {
        self.parse_binding_ident()
    }
}
impl<I: Input> MaybeOptionalIdentParser<Option<Ident>> for Parser<I> {
    fn parse_maybe_opt_binding_ident(&mut self) -> PResult<Option<Ident>> {
        self.parse_opt_binding_ident()
    }
}
