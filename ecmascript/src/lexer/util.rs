//! Ported from [babylon/util/identifier.js][]
//!
//!
//! [babylon/util/identifier.js]:\
//! https://github.com/babel/babel/blob/master/packages/babylon/src/util/identifier.js
//!
//!
//! Note: Currently this use xid instead of id. (because unicode_xid crate
//! exists)

use unicode_xid::UnicodeXID;

pub const BACKSPACE: char = 8 as char;
pub const SHIFT_OUT: char = 14 as char;
pub const OGHAM_SPACE_MARK: char = '\u{1680}'; // ' '

// Test whether a given character code starts an identifier.
pub fn is_ident_start(c: char) -> bool {
    UnicodeXID::is_xid_start(c)
}

// Test whether a given character is part of an identifier.

pub fn is_ident_char(c: char) -> bool {
    UnicodeXID::is_xid_continue(c)
}

pub fn is_non_ascii_ws(c: char) -> bool {
    match c {
        '\u{1680}'
        | '\u{180e}'
        | '\u{2000}'...'\u{200a}'
        | '\u{202f}'
        | '\u{205f}'
        | '\u{3000}'
        | '\u{feff}' => true,
        _ => false,
    }
}
