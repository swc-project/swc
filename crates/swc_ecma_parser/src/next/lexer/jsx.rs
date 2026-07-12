//! JSX child tokenization controlled by the parser.

use swc_common::Span;

use super::{config::Config, core::Lexer, PackedToken};
use crate::lexer::Token as Kind;

impl<C: Config> Lexer<'_, C> {
    /// Reinterpret a quoted JSX attribute value, where raw line terminators
    /// are permitted unlike in ECMAScript string literals.
    pub(crate) fn re_lex_jsx_attribute_string(&mut self) -> PackedToken {
        let current = self.token();
        let start = current.start();
        // SAFETY: The token start was produced by this source cursor.
        unsafe { self.source.reset_to(start) };
        let quote = self.source.cur().unwrap_or(b'\0');
        debug_assert!(matches!(quote, b'\'' | b'"'));
        // SAFETY: The opening quote is ASCII.
        unsafe { self.source.bump_bytes(1) };
        let mut had_line_break = current.had_line_break();
        while let Some(byte) = self.source.cur() {
            if byte == quote {
                // SAFETY: The closing quote is ASCII.
                unsafe { self.source.bump_bytes(1) };
                break;
            }
            had_line_break |= matches!(byte, b'\r' | b'\n');
            let width = self.source.cur_as_char().map_or(1, char::len_utf8);
            // SAFETY: Consume one complete UTF-8 character.
            unsafe { self.source.bump_bytes(width) };
        }
        self.replace_current(
            Kind::Str,
            Span::new_with_checked(start, self.source.cur_pos()),
            had_line_break,
            false,
        )
    }

    /// Read a JSX child without treating whitespace as trivia.
    pub(crate) fn next_jsx_child(&mut self) -> PackedToken {
        let start = self.source.cur_pos();
        let kind = match self.source.cur() {
            Some(b'<') => {
                // SAFETY: `<` is ASCII.
                unsafe { self.source.bump_bytes(1) };
                Kind::JSXTagStart
            }
            Some(b'{') => {
                // SAFETY: `{` is ASCII.
                unsafe { self.source.bump_bytes(1) };
                Kind::LBrace
            }
            Some(_) => {
                self.source
                    .uncons_while(|character| !matches!(character, '<' | '{'));
                Kind::JSXText
            }
            None => Kind::Eof,
        };
        let token = PackedToken::new(
            kind,
            Span::new_with_checked(start, self.source.cur_pos()),
            false,
            false,
        );
        self.finish_external(token)
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;

    use crate::{
        lexer::Token as Kind,
        next::lexer::{config::NoTokens, core::Lexer},
    };

    #[test]
    fn keeps_jsx_child_whitespace_in_text() {
        let mut lexer = Lexer::new("hello world{value}", BytePos(1), NoTokens).unwrap();
        assert_eq!(lexer.next_jsx_child().kind(), Kind::JSXText);
        assert_eq!(lexer.next_jsx_child().kind(), Kind::LBrace);
        assert_eq!(lexer.next_token().kind(), Kind::Ident);
    }
}
