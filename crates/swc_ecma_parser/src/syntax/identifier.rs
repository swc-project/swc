use unicode_id_start::{is_id_continue_unicode, is_id_start_unicode};

pub const EOF: char = '\0';

// 11.1 Unicode Format-Control Characters

/// U+200C ZERO WIDTH NON-JOINER, abbreviated in the spec as `<ZWNJ>`.
/// Specially permitted in identifiers.
pub const ZWNJ: char = '\u{200c}';

/// U+200D ZERO WIDTH JOINER, abbreviated as `<ZWJ>`.
/// Specially permitted in identifiers.
pub const ZWJ: char = '\u{200d}';

/// U+FEFF ZERO WIDTH NO-BREAK SPACE, abbreviated `<ZWNBSP>`.
/// Considered a whitespace character in JS.
pub const ZWNBSP: char = '\u{feff}';

// 11.2 White Space
/// U+0009 CHARACTER TABULATION, abbreviated `<TAB>`.
pub const TAB: char = '\u{9}';

/// U+000B VERTICAL TAB, abbreviated `<VT>`.
pub const VT: char = '\u{b}';

/// U+000C FORM FEED, abbreviated `<FF>`.
pub const FF: char = '\u{c}';

/// U+00A0 NON-BREAKING SPACE, abbreviated `<NBSP>`.
pub const NBSP: char = '\u{a0}';

pub fn is_irregular_whitespace(c: char) -> bool {
    matches!(
        c,
        VT | FF | NBSP | ZWNBSP | '\u{85}' | '\u{1680}' | '\u{2000}'
            ..='\u{200a}' | '\u{202f}' | '\u{205f}' | '\u{3000}'
    )
}

// 11.3 Line Terminators

///  U+000A LINE FEED, abbreviated in the spec as `<LF>`.
pub const LF: char = '\u{a}';

/// U+000D CARRIAGE RETURN, abbreviated in the spec as `<CR>`.
pub const CR: char = '\u{d}';

/// U+2028 LINE SEPARATOR, abbreviated `<LS>`.
pub const LS: char = '\u{2028}';

/// U+2029 PARAGRAPH SEPARATOR, abbreviated `<PS>`.
pub const PS: char = '\u{2029}';

pub fn is_regular_line_terminator(c: char) -> bool {
    matches!(c, LF | CR)
}

pub fn is_irregular_line_terminator(c: char) -> bool {
    matches!(c, LS | PS)
}

pub fn is_line_terminator(c: char) -> bool {
    is_regular_line_terminator(c) || is_irregular_line_terminator(c)
}

const XX: bool = true;
const __: bool = false;

#[repr(C, align(64))]
pub struct Align64<T>(pub(crate) T);

// `a`-`z`, `A`-`Z`, `$` (0x24), `_` (0x5F)
#[rustfmt::skip]
pub static ASCII_START: Align64<[bool; 128]> = Align64([
//  0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F   //
    __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, // 0
    __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, // 1
    __, __, __, __, XX, __, __, __, __, __, __, __, __, __, __, __, // 2
    __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, // 3
    __, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, // 4
    XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, __, __, __, __, XX, // 5
    __, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, // 6
    XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, __, __, __, __, __, // 7
]);

// `ASCII_START` + `0`-`9`
#[rustfmt::skip]
pub static ASCII_CONTINUE: Align64<[bool; 128]> = Align64([
//  0   1   2   3   4   5   6   7   8   9   A   B   C   D   E   F   //
    __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, // 0
    __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, // 1
    __, __, __, __, XX, __, __, __, __, __, __, __, __, __, __, __, // 2
    XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, __, __, __, __, __, __, // 3
    __, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, // 4
    XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, __, __, __, __, XX, // 5
    __, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, // 6
    XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, XX, __, __, __, __, __, // 7
]);

/// Section 12.7 Detect `IdentifierStartChar`
#[inline]
pub fn is_identifier_start(c: char) -> bool {
    if c.is_ascii() {
        return is_identifier_start_ascii(c);
    }
    is_identifier_start_unicode(c)
}

#[inline]
pub fn is_identifier_start_ascii(c: char) -> bool {
    ASCII_START.0[c as usize]
}

#[inline]
pub fn is_identifier_start_unicode(c: char) -> bool {
    is_id_start_unicode(c)
}

/// Section 12.7 Detect `IdentifierPartChar`
/// NOTE 2: The nonterminal `IdentifierPart` derives _ via `UnicodeIDContinue`.
#[inline]
pub fn is_identifier_part(c: char) -> bool {
    if c.is_ascii() {
        return is_identifier_part_ascii(c);
    }
    is_identifier_part_unicode(c)
}

#[inline]
pub fn is_identifier_part_ascii(c: char) -> bool {
    ASCII_CONTINUE.0[c as usize]
}

#[inline]
pub fn is_identifier_part_unicode(c: char) -> bool {
    is_id_continue_unicode(c) || c == ZWNJ || c == ZWJ
}

pub fn is_identifier_name(name: &str) -> bool {
    let mut chars = name.chars();
    chars.next().is_some_and(is_identifier_start) && chars.all(is_identifier_part)
}
