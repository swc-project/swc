//! 12.1 Identifiers
use swc_atoms::atom;

use super::*;
use crate::{lexer::Token, parser::Parser};

impl<I: Tokens> Parser<I> {
    /// IdentifierReference
    pub(super) fn parse_ident_ref(&mut self) -> PResult<Ident> {
        let ctx = self.ctx();

        self.parse_ident(
            !ctx.contains(Context::InGenerator),
            !ctx.contains(Context::InAsync),
        )
    }

    /// LabelIdentifier
    pub(super) fn parse_label_ident(&mut self) -> PResult<Ident> {
        let ctx = self.ctx();

        self.parse_ident(
            !ctx.contains(Context::InGenerator),
            !ctx.contains(Context::InAsync),
        )
    }

    /// Identifier
    ///
    /// In strict mode, "yield" is SyntaxError if matched.
    pub(super) fn parse_ident(&mut self, incl_yield: bool, incl_await: bool) -> PResult<Ident> {
        trace_cur!(self, parse_ident);

        let start = cur_pos!(self);

        let word = self.parse_with(|p| {
            let t = *cur!(p, true);
            if !t.is_word() {
                syntax_error!(p, SyntaxError::ExpectedIdent)
            }
            bump!(p);
            // Spec:
            // It is a Syntax Error if this phrase is contained in strict mode code and the
            // StringValue of IdentifierName is: "implements", "interface", "let",
            // "package", "private", "protected", "public", "static", or "yield".
            match t {
                Token::Enum => {
                    p.emit_err(
                        p.input.prev_span(),
                        SyntaxError::InvalidIdentInStrict(
                            t.as_word_atom(p.input.get_token_value()).unwrap(),
                        ),
                    );
                }
                Token::Yield
                | Token::Let
                | Token::Static
                | Token::Implements
                | Token::Interface
                | Token::Package
                | Token::Private
                | Token::Protected
                | Token::Public => {
                    p.emit_strict_mode_err(
                        p.input.prev_span(),
                        SyntaxError::InvalidIdentInStrict(
                            t.as_word_atom(p.input.get_token_value()).unwrap(),
                        ),
                    );
                }
                _ => {}
            }

            // Spec:
            // It is a Syntax Error if StringValue of IdentifierName is the same String
            // value as the StringValue of any ReservedWord except for yield or await.
            match t {
                Token::Await if p.ctx().contains(Context::InDeclare) => Ok(atom!("await")),

                Token::Await if p.ctx().contains(Context::InStaticBlock) => {
                    syntax_error!(p, p.input.prev_span(), SyntaxError::ExpectedIdent)
                }

                // It is a Syntax Error if the goal symbol of the syntactic grammar is Module
                // and the StringValue of IdentifierName is "await".
                Token::Await
                    if p.ctx().contains(Context::Module) | p.ctx().contains(Context::InAsync) =>
                {
                    syntax_error!(p, p.input.prev_span(), SyntaxError::InvalidIdentInAsync)
                }
                Token::This if p.input.syntax().typescript() => Ok(atom!("this")),
                Token::Let => Ok(atom!("let")),
                Token::Ident => {
                    let ident = p.input.expect_word_token_value();
                    if p.ctx().contains(Context::InClassField) && ident == atom!("arguments") {
                        p.emit_err(p.input.prev_span(), SyntaxError::ArgumentsInClassField)
                    }
                    Ok(ident)
                }
                Token::Yield if incl_yield => Ok(atom!("yield")),
                Token::Await if incl_await => Ok(atom!("await")),
                Token::Null | Token::True | Token::False => {
                    syntax_error!(p, p.input.prev_span(), SyntaxError::ExpectedIdent)
                }
                _ => {
                    if t.is_keyword() {
                        syntax_error!(p, p.input.prev_span(), SyntaxError::ExpectedIdent)
                    } else if let Some(ident) = t.as_known_ident_atom() {
                        return Ok(ident);
                    }
                    unreachable!()
                }
            }
        })?;

        Ok(Ident::new_no_ctxt(word, span!(self, start)))
    }
}
