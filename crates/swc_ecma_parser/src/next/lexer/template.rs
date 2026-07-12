//! Template substitution tail re-lexing.

use swc_common::Span;

use super::{config::Config, core::Lexer, PackedToken};
use crate::next::lexer::TokenKind as Kind;

impl<C: Config> Lexer<'_, C> {
    /// Reinterpret the current `}` as a template middle or tail.
    pub(crate) fn re_lex_template_substitution_tail(&mut self) -> PackedToken {
        let current = self.token();
        let start = current.start();
        // SAFETY: The token start was produced by this source cursor.
        unsafe { self.source.reset_to(start) };
        debug_assert_eq!(self.source.cur(), Some(b'}'));
        // SAFETY: The closing brace is ASCII.
        unsafe { self.source.bump_bytes(1) };
        let mut escaped = false;

        let kind = loop {
            match self.source.cur() {
                Some(b'`') => {
                    // SAFETY: The backtick is ASCII.
                    unsafe { self.source.bump_bytes(1) };
                    break Kind::TemplateTail;
                }
                Some(b'$') if self.source.peek() == Some(b'{') => {
                    // SAFETY: `${` consists of two ASCII bytes.
                    unsafe { self.source.bump_bytes(2) };
                    break Kind::TemplateMiddle;
                }
                Some(b'\\') => {
                    escaped = true;
                    // SAFETY: The escape marker is ASCII.
                    unsafe { self.source.bump_bytes(1) };
                    if let Some(character) = self.source.cur_as_char() {
                        // SAFETY: Consume one complete escaped character.
                        unsafe { self.source.bump_bytes(character.len_utf8()) };
                    }
                }
                Some(_) => {
                    let width = self.source.cur_as_char().map_or(1, char::len_utf8);
                    // SAFETY: Consume one complete template character.
                    unsafe { self.source.bump_bytes(width) };
                }
                None => break Kind::Error,
            }
        };

        self.replace_current(
            kind,
            Span::new_with_checked(start, self.source.cur_pos()),
            current.had_line_break(),
            escaped,
        )
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;

    use crate::{
        next::lexer::TokenKind as Kind,
        next::lexer::{config::WithTokens, core::Lexer},
    };

    #[test]
    fn re_lexes_template_middle_and_tail() {
        let mut lexer =
            Lexer::new("} middle ${value} tail`", BytePos(1), WithTokens::default()).unwrap();
        assert_eq!(lexer.next_token().kind(), Kind::RBrace);
        assert_eq!(
            lexer.re_lex_template_substitution_tail().kind(),
            Kind::TemplateMiddle
        );
        assert_eq!(lexer.token_source(lexer.token()), "} middle ${");
        assert_eq!(lexer.next_token().kind(), Kind::Ident);
        assert_eq!(lexer.next_token().kind(), Kind::RBrace);
        assert_eq!(
            lexer.re_lex_template_substitution_tail().kind(),
            Kind::TemplateTail
        );
    }
}
