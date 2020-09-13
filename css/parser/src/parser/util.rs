use crate::{token::Token, Error, PResult, Parser, SyntaxError};
use swc_common::Span;
use swc_css_ast::*;

impl<'i> Parser<'i> {
    pub(super) fn parse_str(&mut self) -> PResult<Str> {
        match self.i.cur() {
            Some(t) => match t {
                Token::Str => {
                    let span = self.i.span();
                    let s = self.i.slice();
                    self.i.bump();

                    Ok(Str {
                        span,
                        sym: s.into(),
                    })
                }
                _ => self.err(SyntaxError::ExpectedStr { got: t }),
            },
            None => self.err(SyntaxError::Eof),
        }
    }

    /// Eat one word, but not punctuntions or spaces.
    pub(super) fn parse_word(&mut self) -> PResult<Text> {
        match self.i.cur() {
            Some(t) => match t {
                Token::Error
                | Token::Semi
                | Token::Color
                | Token::Comma
                | Token::At
                | Token::Str
                | Token::LParen
                | Token::RParen
                | Token::LBrace
                | Token::RBrace
                | Token::Hash
                | Token::Plus
                | Token::Minus
                | Token::Dot => self.err(SyntaxError::ExpectedWord { got: t }),

                // TODO: Optimize using js_word
                Token::Ident | Token::Important | Token::Px => {
                    let span = self.i.span();
                    let s = self.i.slice();
                    self.i.bump();

                    return Ok(Text {
                        span,
                        sym: s.into(),
                    });
                }
            },
            None => self.err(SyntaxError::Eof),
        }
    }

    #[cold]
    #[inline(never)]
    pub(super) fn err<T>(&mut self, err: SyntaxError) -> PResult<T> {
        let span = self.i.span();
        self.err_span(span, err)
    }

    #[cold]
    #[inline(never)]
    pub(super) fn err_span<T>(&mut self, span: Span, err: SyntaxError) -> PResult<T> {
        Err(Error {
            inner: Box::new((span, err)),
        })
    }
}
