use crate::{token::Token, PResult, Parser, SyntaxError};
use swc_atoms::js_word;
use swc_common::BytePos;
use swc_css_ast::*;

impl Parser<'_> {
    pub(super) fn parse_at_rule(&mut self) -> PResult<AtRule> {
        assert_eq!(self.i.cur(), Some(Token::At));
        let start = self.i.cur_pos();
        self.i.bump(); // '@'

        let name = self.parse_word()?;

        match name.sym {
            js_word!("charset") => self.parse_charset_rule(start).map(From::from),
            js_word!("media") => self.parse_media_rule(start).map(From::from),
            js_word!("import") => self.parse_import_rule(start).map(From::from),
            js_word!("supports") => self.parse_import_rule(start).map(From::from),
            js_word!("keyframes") => self.parse_keyframes_rule(start).map(From::from),
            js_word!("font-face") => self.parse_font_face_rule(start).map(From::from),

            _ => self.parse_unknown_at_rule(start).map(From::from),
        }
    }

    fn parse_charset_rule(&mut self, start: BytePos) -> PResult<CharsetRule> {
        let charset = self.parse_str()?;

        Ok(CharsetRule {
            span: self.i.make_span(start),
            charset,
        })
    }

    fn parse_media_rule(&mut self, start: BytePos) -> PResult<MediaRule> {
        let query = self.parse_media_query().map(Box::new)?;

        Ok(MediaRule {
            span: self.i.make_span(start),
            query,
        })
    }

    fn parse_media_query(&mut self) -> PResult<MediaQuery> {
        let start = self.i.cur_pos();
        let mut query = self.parse_one_media_query_element()?;

        loop {
            if is!(self, "{") {
                break;
            }

            let and_or = self.parse_word()?;

            match and_or.sym {
                js_word!("and") => {
                    let q = self.parse_one_media_query_element()?;
                    query = Box::new(MediaQuery::And(AndMediaQuery {
                        span: self.i.make_span(start),
                        first: query,
                        second: q,
                    }))
                }
                js_word!("or") => {
                    let q = self.parse_one_media_query_element()?;
                    query = Box::new(MediaQuery::Or(OrMediaQuery {
                        span: self.i.make_span(start),
                        first: query,
                        second: q,
                    }))
                }
                _ => self.err(SyntaxError::ExpectedOneOf {
                    expected: "'and' or 'or'".into(),
                    got: and_or.sym,
                }),
            }
        }

        Ok(query)
    }

    fn parse_one_media_query_element(&mut self) -> PResult<Box<MediaQuery>> {}

    fn parse_import_rule(&mut self, start: BytePos) -> PResult<ImportRule> {
        let src = self.parse_str()?;

        Ok(ImportRule {
            span: self.i.make_span(start),
            src,
        })
    }

    fn parse_keyframes_rule(&mut self, start: BytePos) -> PResult<KeyframesRule> {
        let name = self.parse_word()?;

        expect!(self, "{");

        let mut keyframes = vec![];

        while let Some(t) = self.i.cur() {
            if is!(self, "}") {
                break;
            }
            let el = self.parse_keyframe_element()?;

            keyframes.push(el);
        }

        expect!(self, "}");

        Ok(KeyframesRule {
            span: self.i.make_span(start),
            keyframes,
        })
    }

    fn parse_keyframe_element(&mut self) -> PResult<KeyframeElement> {
        let start = self.i.cur_pos();

        let selector = self.parse_keyframe_selector()?;
        let block = self.parse_decl_block()?;

        Ok(KeyframeElement {
            span: self.i.make_span(start),
            selector,
            block,
        })
    }

    fn parse_keyframe_selector(&mut self) -> PResult<KeyframeSelector> {
        let start = self.i.cur_pos();

        let word = self.parse_opt_word()?;

        Ok(match word {
            Some(v) => KeyframeSelector::Extra(v),
            None => {
                let percent = self.parse_percent_selector()?;

                KeyframeSelector::Percent(percent)
            }
        })
    }

    fn parse_percent_selector(&mut self) -> PResult<KeyframePercentSelector> {}

    fn parse_font_face_rule(&mut self, start: BytePos) -> PResult<FontFaceRule> {}

    fn parse_unknown_at_rule(&mut self, start: BytePos) -> PResult<UnknownAtRule> {}
}
