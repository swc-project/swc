//! Parser-directed regular expression re-lexing.

use swc_common::Span;

use super::{config::Config, core::Lexer, PackedToken};
use crate::next::lexer::TokenKind as Kind;

impl<C: Config> Lexer<'_, C> {
    /// Reinterpret the current slash token as a regular expression literal.
    pub(crate) fn re_lex_regex(&mut self) -> PackedToken {
        let current = self.token();
        let start = current.start();
        // SAFETY: The current token start was produced by this source cursor.
        unsafe { self.source.reset_to(start) };
        debug_assert_eq!(self.source.cur(), Some(b'/'));
        // SAFETY: The opening slash is ASCII.
        unsafe { self.source.bump_bytes(1) };

        let mut in_character_class = false;
        while let Some(byte) = self.source.cur() {
            match byte {
                b'\\' => {
                    // SAFETY: The escape marker is ASCII.
                    unsafe { self.source.bump_bytes(1) };
                    if let Some(character) = self.source.cur_as_char() {
                        // SAFETY: Consume one complete escaped character.
                        unsafe { self.source.bump_bytes(character.len_utf8()) };
                    }
                }
                b'[' => {
                    in_character_class = true;
                    // SAFETY: `[` is ASCII.
                    unsafe { self.source.bump_bytes(1) };
                }
                b']' => {
                    in_character_class = false;
                    // SAFETY: `]` is ASCII.
                    unsafe { self.source.bump_bytes(1) };
                }
                b'/' if !in_character_class => {
                    // SAFETY: The closing slash is ASCII.
                    unsafe { self.source.bump_bytes(1) };
                    break;
                }
                b'\r' | b'\n' => break,
                _ => {
                    let width = self.source.cur_as_char().map_or(1, char::len_utf8);
                    // SAFETY: Consume one complete pattern character.
                    unsafe { self.source.bump_bytes(width) };
                }
            }
        }

        self.source
            .uncons_while(|character| character.is_ascii_alphabetic());
        self.replace_current(
            Kind::Regex,
            Span::new_with_checked(start, self.source.cur_pos()),
            current.had_line_break(),
            false,
        )
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;

    use crate::next::lexer::{config::WithTokens, core::Lexer, TokenKind as Kind};

    #[test]
    fn replaces_slash_with_regex_without_duplicate_token() {
        let mut lexer = Lexer::new("/a[b/]c/gi + 1", BytePos(1), WithTokens::default()).unwrap();
        assert_eq!(lexer.next_token().kind(), Kind::Slash);
        let regex = lexer.re_lex_regex();
        assert_eq!(regex.kind(), Kind::Regex);
        assert_eq!(lexer.next_token().kind(), Kind::Plus);

        let tokens = lexer.into_tokens();
        assert_eq!(tokens[0].kind(), Kind::Regex);
        assert_eq!(tokens[1].kind(), Kind::Plus);
    }
}
