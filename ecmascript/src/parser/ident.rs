//! 12.1 Identifiers

use super::*;

impl<I: Input> Parser<I> {
    /// IdentifierReference
    pub(super) fn parse_ident_ref(&mut self) -> PResult<Ident> {
        let ctx = self.ctx;

        self.parse_ident(ctx.in_generator.is_none(), ctx.in_async.is_none())
    }

    /// BindingIdentifier
    pub(super) fn parse_binding_ident(&mut self) -> PResult<Ident> {
        // "yield" and "await" is **lexically** accepted.
        self.parse_ident(true, true).and_then(|ident| {
            if self.ctx.strict {
                if &*ident.sym == "arguments" || &*ident.sym == "eval" {
                    syntax_error!(self, SyntaxError::EvalAndArgumentsInStrict)
                }
            }

            Ok(ident)
        })
    }

    /// LabelIdentifier
    pub(super) fn parse_label_ident(&mut self) -> PResult<Ident> {
        let ctx = self.ctx;

        self.parse_ident(ctx.in_generator.is_none(), ctx.in_async.is_none())
    }

    /// Use this when spec says "IdentiferName".
    /// This allows idents like `catch`.
    pub(super) fn parse_ident_name(&mut self) -> PResult<Ident> {
        spanned!(self, {
            let w = match cur!(self) {
                Some(&Word(..)) => match bump!(self) {
                    Word(w) => w,
                    _ => unreachable!(),
                },
                _ => return Err(Error::ExpectedIdent),
            };

            Ok(w.into())
        })
    }

    /// Identifier
    ///
    /// In strict mode, "yield" is SyntaxError if matched.
    fn parse_ident(&mut self, incl_yield: bool, incl_await: bool) -> PResult<Ident> {
        spanned!(self, {
            let strict = self.ctx.strict;
            let w = match cur!(self) {
                Some(&Word(..)) => match bump!(self) {
                    Word(w) => w,
                    _ => unreachable!(),
                },
                _ => return Err(Error::ExpectedIdent),
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
                    | Ident(js_word!("public")) => {
                        syntax_error!(self, SyntaxError::InvalidIdentInStrict)
                    }
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
                Ident(ident) => Ok(ident),
                Keyword(Yield) if incl_yield => Ok(js_word!("yield")),
                Keyword(Await) if incl_await => Ok(js_word!("await")),
                Keyword(..) | Null | True | False => Err(Error::ExpectedIdent),
            }
        })
    }
}
