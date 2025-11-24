use swc_atoms::atom;
use swc_common::BytePos;
use swc_ecma_ast::*;

use crate::{error::SyntaxError, input::Tokens, lexer::Token, Context, PResult, Parser};

impl<I: Tokens> Parser<I> {
    // https://tc39.es/ecma262/#prod-ModuleExportName
    pub(crate) fn parse_module_export_name(&mut self) -> PResult<ModuleExportName> {
        let cur = self.input().cur();
        let module_export_name = if cur == Token::Str {
            ModuleExportName::Str(self.parse_str_lit())
        } else if cur.is_word() {
            ModuleExportName::Ident(self.parse_ident_name()?.into())
        } else {
            unexpected!(self, "identifier or string");
        };
        Ok(module_export_name)
    }

    /// Use this when spec says "IdentifierName".
    /// This allows idents like `catch`.
    pub(crate) fn parse_ident_name(&mut self) -> PResult<IdentName> {
        let token_and_span = self.input().get_cur();
        let start = token_and_span.span.lo;
        let cur = token_and_span.token;
        let w = if cur.is_word() {
            self.input_mut().expect_word_token_and_bump()
        } else if cur == Token::JSXName && self.ctx().contains(Context::InType) {
            self.input_mut().expect_jsx_name_token_and_bump()
        } else {
            syntax_error!(self, SyntaxError::ExpectedIdent)
        };
        Ok(IdentName::new(w, self.span(start)))
    }

    pub(crate) fn parse_private_name(&mut self) -> PResult<PrivateName> {
        let start = self.cur_pos();
        self.assert_and_bump(Token::Hash);
        let hash_end = self.input().prev_span().hi;
        if self.input().cur_pos() - hash_end != BytePos(0) {
            syntax_error!(
                self,
                self.span(start),
                SyntaxError::SpaceBetweenHashAndIdent
            );
        }
        let id = self.parse_ident_name()?;
        Ok(PrivateName {
            span: self.span(start),
            name: id.sym,
        })
    }

    /// IdentifierReference
    #[inline]
    fn parse_ident_ref(&mut self) -> PResult<Ident> {
        let ctx = self.ctx();
        self.parse_ident(
            !ctx.contains(Context::InGenerator),
            !ctx.contains(Context::InAsync),
        )
    }

    /// LabelIdentifier
    #[inline]
    pub(crate) fn parse_label_ident(&mut self) -> PResult<Ident> {
        self.parse_ident_ref()
    }

    /// babel: `parseBindingIdentifier`
    ///
    /// spec: `BindingIdentifier`
    pub(crate) fn parse_binding_ident(&mut self, disallow_let: bool) -> PResult<BindingIdent> {
        trace_cur!(self, parse_binding_ident);

        let cur = self.input().cur();
        if disallow_let && cur == Token::Let {
            unexpected!(self, "let is reserved in const, let, class declaration")
        } else if cur == Token::Ident {
            let span = self.input().cur_span();
            let word = self.input_mut().expect_word_token_and_bump();
            if atom!("arguments") == word || atom!("eval") == word {
                self.emit_strict_mode_err(span, SyntaxError::EvalAndArgumentsInStrict);
            }
            return Ok(Ident::new_no_ctxt(word, span).into());
        }

        // "yield" and "await" is **lexically** accepted.
        let ident = self.parse_ident(true, true)?;
        let ctx = self.ctx();
        if (ctx.intersects(Context::InAsync.union(Context::InStaticBlock)) && ident.sym == "await")
            || (ctx.contains(Context::InGenerator) && ident.sym == "yield")
        {
            self.emit_err(ident.span, SyntaxError::ExpectedIdent);
        }

        Ok(ident.into())
    }

    pub(crate) fn parse_opt_binding_ident(
        &mut self,
        disallow_let: bool,
    ) -> PResult<Option<BindingIdent>> {
        trace_cur!(self, parse_opt_binding_ident);
        let token_and_span = self.input().get_cur();
        let cur = token_and_span.token;
        if cur == Token::This && self.input().syntax().typescript() {
            let start = token_and_span.span.lo;
            Ok(Some(
                Ident::new_no_ctxt(atom!("this"), self.span(start)).into(),
            ))
        } else if cur.is_word() && !cur.is_reserved(self.ctx()) {
            self.parse_binding_ident(disallow_let).map(Some)
        } else {
            Ok(None)
        }
    }

    /// Identifier
    ///
    /// In strict mode, "yield" is SyntaxError if matched.
    pub(crate) fn parse_ident(&mut self, incl_yield: bool, incl_await: bool) -> PResult<Ident> {
        trace_cur!(self, parse_ident);

        let token_and_span = self.input().get_cur();
        let span = token_and_span.span;
        let t = token_and_span.token;

        // https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-keywords-and-reserved-words
        let word = match t {
            Token::Let
            | Token::Static
            | Token::Enum
            | Token::Implements
            | Token::Interface
            | Token::Package
            | Token::Private
            | Token::Protected
            | Token::Public => {
                let word = t.take_word(self.input_mut()).unwrap();
                self.emit_strict_mode_err(span, SyntaxError::InvalidIdentInStrict(word.clone()));
                word
            }
            Token::Yield if incl_yield => {
                atom!("yield")
            }
            Token::Await => {
                let ctx = self.ctx();
                if ctx.contains(Context::InDeclare) {
                    atom!("await")
                } else if ctx.contains(Context::InStaticBlock) {
                    syntax_error!(self, span, SyntaxError::ExpectedIdent)
                } else if ctx.contains(Context::Module) | ctx.contains(Context::InAsync) {
                    syntax_error!(self, span, SyntaxError::InvalidIdentInAsync)
                } else if incl_await {
                    atom!("await")
                } else {
                    syntax_error!(self, span, SyntaxError::ExpectedIdent)
                }
            }
            Token::This if self.syntax().typescript() => atom!("this"),
            Token::Ident => {
                let word = t.take_word(self.input_mut()).unwrap();
                if self.ctx().contains(Context::InClassField) && word == atom!("arguments") {
                    self.emit_err(span, SyntaxError::ArgumentsInClassField)
                }
                word
            }
            t if t.is_known_ident() => t.take_known_ident(),
            _ => syntax_error!(self, SyntaxError::ExpectedIdent),
        };

        self.bump();
        Ok(Ident::new_no_ctxt(word, span))
    }
}
