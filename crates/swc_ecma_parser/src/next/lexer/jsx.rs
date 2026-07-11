//! JSX child tokenization controlled by the parser.

use swc_common::Span;

use super::{config::Config, core::Lexer, PackedToken};
use crate::lexer::Token as Kind;

impl<C: Config> Lexer<'_, C> {
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
