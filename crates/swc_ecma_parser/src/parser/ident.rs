//! 12.1 Identifiers
use either::Either;
use swc_atoms::atom;

use super::*;
use crate::{lexer::Token, parser::Parser};

impl<I: Tokens> Parser<I> {
    pub(super) fn parse_maybe_private_name(&mut self) -> PResult<Either<PrivateName, IdentName>> {
        let is_private = is!(self, '#');

        if is_private {
            self.parse_private_name().map(Either::Left)
        } else {
            self.parse_ident_name().map(Either::Right)
        }
    }

    pub(super) fn parse_private_name(&mut self) -> PResult<PrivateName> {
        let start = cur_pos!(self);
        assert_and_bump!(self, '#');

        let hash_end = self.input.prev_span().hi;
        if self.input.cur_pos() - hash_end != BytePos(0) {
            syntax_error!(
                self,
                span!(self, start),
                SyntaxError::SpaceBetweenHashAndIdent
            );
        }

        let id = self.parse_ident_name()?;
        Ok(PrivateName {
            span: span!(self, start),
            name: id.sym,
        })
    }

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

    /// Use this when spec says "IdentifierName".
    /// This allows idents like `catch`.
    pub(super) fn parse_ident_name(&mut self) -> PResult<IdentName> {
        let in_type = self.ctx().contains(Context::InType);

        let start = cur_pos!(self);

        let t = *cur!(self, true);
        let w = if t.is_word() {
            bump!(self);
            t.as_word_atom(self.input.get_token_value()).unwrap()
        } else if matches!(t, Token::JSXName) && in_type {
            bump!(self);
            self.input.expect_word_token_value()
        } else {
            syntax_error!(self, SyntaxError::ExpectedIdent)
        };

        Ok(IdentName::new(w, span!(self, start)))
    }

    // https://tc39.es/ecma262/#prod-ModuleExportName
    pub(super) fn parse_module_export_name(&mut self) -> PResult<ModuleExportName> {
        let t = cur!(self, false).unwrap();
        let module_export_name = match t {
            Token::Str => match self.parse_lit()? {
                Lit::Str(str_lit) => ModuleExportName::Str(str_lit),
                _ => unreachable!(),
            },
            _ if t.is_word() => ModuleExportName::Ident(self.parse_ident_name()?.into()),
            _ => {
                unexpected!(self, "identifier or string");
            }
        };
        Ok(module_export_name)
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
