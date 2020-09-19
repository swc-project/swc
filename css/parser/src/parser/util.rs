use crate::{token::Token, Error, PResult, Parser, SyntaxError};
use swc_atoms::JsWord;
use swc_common::Span;
use swc_css_ast::*;

impl<'i> Parser<'i> {
    pub(super) fn parse_str(&mut self) -> PResult<Str> {
        trace_cur!(self, parse_str);

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
                _ => self.err(SyntaxError::ExpectedStr {
                    got: format!("{:?}", t),
                }),
            },
            None => self.err(SyntaxError::Eof),
        }
    }

    pub(super) fn parse_word(&mut self) -> PResult<Text> {
        trace_cur!(self, parse_word);

        let token = self.i.cur();
        let word = self.parse_opt_word()?;

        match word {
            Some(v) => Ok(v),
            None => self.err(SyntaxError::ExpectedWord {
                got: format!("{:?}", token),
            }),
        }
    }

    /// Eat one word, but not punctuntions or spaces.
    pub(super) fn parse_opt_word(&mut self) -> PResult<Option<Text>> {
        trace_cur!(self, parse_opt_word);

        match self.i.cur() {
            Some(t) => {
                if let Some(sym) = as_word(t, self.i.slice()) {
                    let span = self.i.span();
                    self.i.bump();

                    return Ok(Some(Text { span, sym }));
                } else {
                    Ok(None)
                }
            }
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

    pub fn is_word(&mut self) -> bool {
        match self.i.cur() {
            Some(t) => as_word(t, self.i.slice()).is_some(),
            None => false,
        }
    }
}

// TODO: Optimize using js_word
fn as_word(t: Token, s: &str) -> Option<JsWord> {
    match t {
        Token::Tilde
        | Token::Mul
        | Token::LBracket
        | Token::RBracket
        | Token::Lt
        | Token::Gt
        | Token::Error
        | Token::Semi
        | Token::Colon
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
        | Token::Dot
        | Token::Eq
        | Token::DollarEq
        | Token::MulEq
        | Token::XorEq
        | Token::OrEq
        | Token::TildeEq
        | Token::BangImportant => None,

        // TODO: Optimize using js_word
        Token::Ident | Token::Px => Some(s.into()),
    }
}
