//! 12.1 Identifiers
use swc_atoms::atom;

use super::*;
use crate::{
    token::{IdentLike, Keyword},
    *,
};

impl<I: Tokens<TokenAndSpan>> Parser<I> {
    /// Identifier
    ///
    /// In strict mode, "yield" is SyntaxError if matched.
    pub(super) fn parse_ident(&mut self, incl_yield: bool, incl_await: bool) -> PResult<Ident> {
        trace_cur!(self, parse_ident);

        let start = cur_pos!(self);

        let word = self.parse_with(|p| {
            let w = match cur!(p, true) {
                &Token::Word(..) => match bump!(p) {
                    Token::Word(w) => w,
                    _ => unreachable!(),
                },
                _ => syntax_error!(p, SyntaxError::ExpectedIdent),
            };

            // Spec:
            // It is a Syntax Error if this phrase is contained in strict mode code and the
            // StringValue of IdentifierName is: "implements", "interface", "let",
            // "package", "private", "protected", "public", "static", or "yield".
            match w {
                Word::Ident(ref name @ ident_like!("enum")) => {
                    p.emit_err(
                        p.input.prev_span(),
                        SyntaxError::InvalidIdentInStrict(name.clone().into()),
                    );
                }
                Word::Keyword(name @ Keyword::Yield) | Word::Keyword(name @ Keyword::Let) => {
                    p.emit_strict_mode_err(
                        p.input.prev_span(),
                        SyntaxError::InvalidIdentInStrict(name.into_atom()),
                    );
                }

                Word::Ident(
                    ref name @ ident_like!("static")
                    | ref name @ ident_like!("implements")
                    | ref name @ ident_like!("interface")
                    | ref name @ ident_like!("package")
                    | ref name @ ident_like!("private")
                    | ref name @ ident_like!("protected")
                    | ref name @ ident_like!("public"),
                ) => {
                    p.emit_strict_mode_err(
                        p.input.prev_span(),
                        SyntaxError::InvalidIdentInStrict(name.clone().into()),
                    );
                }
                _ => {}
            }

            // Spec:
            // It is a Syntax Error if StringValue of IdentifierName is the same String
            // value as the StringValue of any ReservedWord except for yield or await.
            match w {
                Word::Keyword(Keyword::Await) if p.ctx().contains(Context::InDeclare) => Ok(atom!("await")),

                Word::Keyword(Keyword::Await) if p.ctx().contains(Context::InStaticBlock) => {
                    syntax_error!(p, p.input.prev_span(), SyntaxError::ExpectedIdent)
                }

                // It is a Syntax Error if the goal symbol of the syntactic grammar is Module
                // and the StringValue of IdentifierName is "await".
                Word::Keyword(Keyword::Await) if p.ctx().contains(Context::Module) | p.ctx().contains(Context::InAsync) => {
                    syntax_error!(p, p.input.prev_span(), SyntaxError::InvalidIdentInAsync)
                }
                Word::Keyword(Keyword::This) if p.input.syntax().typescript() => Ok(atom!("this")),
                Word::Keyword(Keyword::Let) => Ok(atom!("let")),
                Word::Ident(ident) => {
                    if p.ctx().contains(Context::InClassField)
                        && matches!(&ident, IdentLike::Other(arguments) if atom!("arguments").eq(arguments))
                    {
                        p.emit_err(p.input.prev_span(), SyntaxError::ArgumentsInClassField)
                    }
                    Ok(ident.into())
                }
                Word::Keyword(Keyword::Yield) if incl_yield => Ok(atom!("yield")),
                Word::Keyword(Keyword::Await) if incl_await => Ok(atom!("await")),
                Word::Keyword(..) | Word::Null | Word::True | Word::False => {
                    syntax_error!(p, p.input.prev_span(), SyntaxError::ExpectedIdent)
                }
            }
        })?;

        Ok(Ident::new_no_ctxt(word, span!(self, start)))
    }
}
