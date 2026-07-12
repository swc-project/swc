//! TypeScript angle token re-lexing.

use swc_common::{BytePos, Span};

use super::{config::Config, core::Lexer, PackedToken};
use crate::next::lexer::TokenKind as Kind;

impl<C: Config> Lexer<'_, C> {
    /// Split the current shift token into a single TypeScript right angle.
    pub(crate) fn re_lex_ts_right_angle(&mut self) -> PackedToken {
        self.re_lex_single_angle(Kind::Gt)
    }

    /// Split the current shift token into a single TypeScript left angle.
    pub(crate) fn re_lex_ts_left_angle(&mut self) -> PackedToken {
        self.re_lex_single_angle(Kind::Lt)
    }

    fn re_lex_single_angle(&mut self, kind: Kind) -> PackedToken {
        let current = self.token();
        let start = current.start();
        let end = BytePos(start.0 + 1);
        // SAFETY: A shift/angle token starts with one ASCII angle byte, so the
        // position immediately after it is an in-bounds UTF-8 boundary.
        unsafe { self.source.reset_to(end) };
        self.replace_current(
            kind,
            Span::new_with_checked(start, end),
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
    fn splits_right_shift_for_nested_type_arguments() {
        let mut lexer = Lexer::new(">> value", BytePos(1), WithTokens::default()).unwrap();
        assert_eq!(lexer.next_token().kind(), Kind::RShift);
        assert_eq!(lexer.re_lex_ts_right_angle().kind(), Kind::Gt);
        assert_eq!(lexer.next_token().kind(), Kind::Gt);
        assert_eq!(lexer.next_token().kind(), Kind::Ident);
    }
}
