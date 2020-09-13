use crate::{token::Token, PResult, Parser};
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

    fn parse_media_rule(&mut self, start: BytePos) -> PResult<MediaRule> {}

    fn parse_media_query(&mut self, start: BytePos) -> PResult<MediaQuery> {}

    fn parse_import_rule(&mut self, start: BytePos) -> PResult<ImportRule> {
        let src = self.parse_str()?;

        Ok(ImportRule {
            span: self.i.make_span(start),
            src,
        })
    }

    fn parse_keyframes_rule(&mut self, start: BytePos) -> PResult<KeyframesRule> {}

    fn parse_font_face_rule(&mut self, start: BytePos) -> PResult<FontFaceRule> {}

    fn parse_unknown_at_rule(&mut self, start: BytePos) -> PResult<UnknownAtRule> {}
}
