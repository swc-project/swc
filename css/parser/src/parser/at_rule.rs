use crate::{token::Token, PResult, Parser};
use swc_atoms::js_word;
use swc_css_ast::*;

impl<'i> Parser<'i> {
    pub(super) fn parse_at_rule(&mut self) -> PResult<AtRule> {
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
}
