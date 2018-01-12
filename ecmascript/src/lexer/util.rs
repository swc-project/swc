//! Ported from [babylon/util/identifier.js][]
//!
//!
//! [babylon/util/identifier.js]:\
//! https://github.com/babel/babel/blob/master/packages/babylon/src/util/identifier.js
//!
//!
//! Note: Currently this use xid instead of id. (because unicode_xid crate
//! exists)

use lexer::input::OptChar;
use unicode_xid::UnicodeXID;

pub const BACKSPACE: char = 8 as char;
pub const SHIFT_OUT: char = 14 as char;
pub const OGHAM_SPACE_MARK: char = '\u{1680}'; // ' '
pub const LINE_FEED: char = '\n';
pub const LINE_SEPARATOR: char = '\u{2028}';
pub const PARAGRAPH_SEPARATOR: char = '\u{2029}';

/// Implemented for `char` and `OptChar`.
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

impl CharExt for OptChar {
    #[inline]
    fn to_char(self) -> Option<char> {
        self.into_inner().map(|v| v.1)
    }
}
