use crate::{error::Error, lexer::Lexer, token::Token, SyntaxError};
use swc_atoms::js_word;
use swc_common::Span;
use swc_css_ast::*;

pub type PResult<T> = Result<T, Error>;

pub struct Parser<'i> {
    i: Lexer<'i>,
}

impl Parser<'_> {
    pub fn parse(&mut self) -> PResult<Stylesheet> {
        let start = self.i.cur_pos();
        let mut rules = vec![];

        while let Some(..) = self.i.cur() {
            let rule = self.parse_rule()?;

            rules.push(rule);
        }

        Ok(Stylesheet {
            span: Span::new(start, self.i.prev_hi(), Default::default()),
            rules,
        })
    }

    fn parse_rule(&mut self) -> PResult<Rule> {
        assert_ne!(self.i.cur(), None);

        match self.i.cur().unwrap() {
            Token::At => self.parse_at_rule().map(Rule::from),
            _ => self.parse_style_rule().map(From::from),
        }
    }

    fn parse_at_rule(&mut self) -> PResult<AtRule> {
        assert_eq!(self.i.cur(), Some(Token::At));
        self.i.bump(); // '@'

        let name = self.pares_word()?;

        match name.sym {
            js_word!("charset") => self.parse_at_rule().map(From::from),
            js_word!("media") => self.parse_media_rule().map(From::from),
            js_word!("import") => self.parse_import_rule().map(From::from),
            js_word!("supports") => self.parse_import_rule().map(From::from),
            js_word!("keyframes") => self.parse_keyframes_rule().map(From::from),
            js_word!("font-face") => self.parse_font_face_rule().map(From::from),

            _ => self.parse_unknown_at_rule().map(From::from),
        }
    }

    fn parse_charset_rule(&mut self) -> PResult<CharsetRule> {}

    fn parse_media_rule(&mut self) -> PResult<MediaRule> {}

    fn parse_media_query(&mut self) -> PResult<MediaQuery> {}

    fn parse_import_rule(&mut self) -> PResult<ImportRule> {}

    fn parse_keyframes_rule(&mut self) -> PResult<KeyframesRule> {}

    fn parse_font_face_rule(&mut self) -> PResult<FontFaceRule> {}

    fn parse_unknown_at_rule(&mut self) -> PResult<UnknownAtRule> {}

    fn parse_style_rule(&mut self) -> PResult<StyleRule> {}

    fn parse_property(&mut self) -> PResult<Property> {}

    /// Eat one word, but not punctuntions or spaces.
    fn pares_word(&mut self) -> PResult<Text> {
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
    fn err<T>(&mut self, err: SyntaxError) -> PResult<T> {
        let span = self.i.span();
        self.err_span(span, err)
    }

    #[cold]
    #[inline(never)]
    fn err_span<T>(&mut self, span: Span, err: SyntaxError) -> PResult<T> {
        Err(Error {
            inner: Box::new((span, err)),
        })
    }
}
