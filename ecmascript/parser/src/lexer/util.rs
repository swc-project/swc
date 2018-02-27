//! Ported from [babylon/util/identifier.js][]
//!
//!
//! [babylon/util/identifier.js]:\
//! https://github.com/babel/babel/blob/master/packages/babylon/src/util/identifier.js
//!
//!
//! Note: Currently this use xid instead of id. (because unicode_xid crate
//! exists)
use super::{LexResult, Lexer};
use super::input::Input;
use error::SyntaxError;
use parser_macros::parser;
use unicode_xid::UnicodeXID;

// pub const BACKSPACE: char = 8 as char;
// pub const SHIFT_OUT: char = 14 as char;
// pub const OGHAM_SPACE_MARK: char = '\u{1680}'; // ' '
// pub const LINE_FEED: char = '\n';
// pub const LINE_SEPARATOR: char = '\u{2028}';
// pub const PARAGRAPH_SEPARATOR: char = '\u{2029}';

#[parser]
impl<'a, I: Input> Lexer<'a, I> {
    /// Skip comments or whitespaces.
    ///
    /// See https://tc39.github.io/ecma262/#sec-white-space
    pub(super) fn skip_space(&mut self) -> LexResult<()> {
        let mut line_break = false;

        while let Some(c) = cur!() {
            match c {
                // white spaces
                _ if c.is_ws() => {}

                // line breaks
                _ if c.is_line_break() => {
                    self.state.had_line_break = true;
                }
                '/' => {
                    if peek!() == Some('/') {
                        self.skip_line_comment(2);
                        continue;
                    } else if peek!() == Some('*') {
                        self.skip_block_comment()?;
                        continue;
                    }
                    break;
                }

                _ => break,
            }

            bump!();
        }

        Ok(())
    }

    pub(super) fn skip_line_comment(&mut self, start_skip: usize) {
        let start = cur_pos!();
        for _ in 0..start_skip {
            bump!();
        }

        while let Some(c) = cur!() {
            bump!();
            if c.is_line_break() {
                self.state.had_line_break = true;
            }
            match c {
                '\n' | '\r' | '\u{2028}' | '\u{2029}' => {
                    break;
                }
                _ => {}
            }
        }
        // TODO: push comment
    }

    /// Expects current char to be '/' and next char to be '*'.
    pub(super) fn skip_block_comment(&mut self) -> LexResult<()> {
        let start = cur_pos!();

        debug_assert_eq!(cur!(), Some('/'));
        debug_assert_eq!(peek!(), Some('*'));

        bump!();
        bump!();

        let mut was_star = false;

        while let Some(c) = cur!() {
            if was_star && is!('/') {
                bump!();
                // TODO: push comment
                return Ok(());
            }
            if c.is_line_break() {
                self.state.had_line_break = true;
            }

            was_star = is!('*');
            bump!();
        }

        syntax_error!(span!(start), SyntaxError::UnterminatedBlockComment)
    }
}

/// Implemented for `char`.
pub trait CharExt: Copy {
    fn to_char(self) -> Option<char>;

    /// Test whether a given character code starts an identifier.
    ///
    /// https://tc39.github.io/ecma262/#prod-IdentifierStart
    fn is_ident_start(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        // TODO: Use Unicode ID instead of XID.
        c == '$' || c == '_' || UnicodeXID::is_xid_start(c)
    }

    /// Test whether a given character is part of an identifier.
    fn is_ident_part(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        // TODO: Use Unicode ID instead of XID.
        c == '$' || c == '_' || c == '\u{200c}' || c == '\u{200d}' || UnicodeXID::is_xid_continue(c)
    }

    /// See https://tc39.github.io/ecma262/#sec-line-terminators
    fn is_line_break(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        match c {
            '\r' | '\n' | '\u{2028}' | '\u{2029}' => true,
            _ => false,
        }
    }

    /// See https://tc39.github.io/ecma262/#sec-white-space
    fn is_ws(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        match c {
            '\u{0009}' | '\u{000b}' | '\u{000c}' | '\u{0020}' | '\u{00a0}' | '\u{feff}' => true,

            '\u{1680}'
            | '\u{180e}'
            | '\u{2000}'...'\u{200a}'
            | '\u{202f}'
            | '\u{205f}'
            | '\u{3000}' => {
                // Any other Unicode “Space_Separator” code point
                true
            }
            _ => false,
        }
    }
}

impl CharExt for char {
    #[inline(always)]
    fn to_char(self) -> Option<char> {
        Some(self)
    }
}
