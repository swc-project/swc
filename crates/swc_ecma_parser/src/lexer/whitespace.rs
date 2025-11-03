use crate::{byte_search, lexer::search::SafeByteMatchTable, safe_byte_match_table, Lexer};

/// U+FEFF ZERO WIDTH NO-BREAK SPACE, abbreviated `<ZWNBSP>`.
/// Considered a whitespace character in JS.
pub const ZWNBSP: char = '\u{feff}';

/// U+000B VERTICAL TAB, abbreviated `<VT>`.
pub const VT: char = '\u{b}';

/// U+000C FORM FEED, abbreviated `<FF>`.
pub const FF: char = '\u{c}';

/// U+00A0 NON-BREAKING SPACE, abbreviated `<NBSP>`.
pub const NBSP: char = '\u{a0}';

// U+0085 NEXT LINE, abbreviated `<NEL>`.
const NEL: char = '\u{85}';

const OGHAM_SPACE_MARK: char = '\u{1680}';

const EN_QUAD: char = '\u{2000}';

// U+200B ZERO WIDTH SPACE, abbreviated `<ZWSP>`.
const ZWSP: char = '\u{200b}';

// Narrow NO-BREAK SPACE, abbreviated `<NNBSP>`.
const NNBSP: char = '\u{202f}';

// U+205F MEDIUM MATHEMATICAL SPACE, abbreviated `<MMSP>`.
const MMSP: char = '\u{205f}';

const IDEOGRAPHIC_SPACE: char = '\u{3000}';

#[inline]
pub fn is_irregular_whitespace(c: char) -> bool {
    matches!(
        c,
        VT | FF | NBSP | ZWNBSP | NEL | OGHAM_SPACE_MARK | EN_QUAD
            ..=ZWSP | NNBSP | MMSP | IDEOGRAPHIC_SPACE
    )
}

/// U+2028 LINE SEPARATOR, abbreviated `<LS>`.
pub const LS: char = '\u{2028}';

/// U+2029 PARAGRAPH SEPARATOR, abbreviated `<PS>`.
pub const PS: char = '\u{2029}';

pub fn is_irregular_line_terminator(c: char) -> bool {
    matches!(c, LS | PS)
}

/// Returns true if it's done
type ByteHandler = fn(&mut Lexer<'_>) -> bool;

/// Lookup table for whitespace
#[rustfmt::skip]
static BYTE_HANDLERS: [ByteHandler; 256] = [
//   0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F   //
    ___, ___, ___, ___, ___, ___, ___, ___, ___, SPC, NLN, SPC, SPC, NLN, ___, ___, // 0
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 1
    SPC, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, SLH, // 2
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 3
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 4
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 5
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 6
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 7
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // 8
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // 9
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // A
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // B
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // C
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // D
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // E
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // F
];

/// Stop
const ___: ByteHandler = |_| false;

/// Newline
const NLN: ByteHandler = |lexer| {
    static NOT_REGULAR_WHITESPACE_OR_LINE_BREAK_TABLE: SafeByteMatchTable =
        safe_byte_match_table!(|b| !matches!(b, b' ' | b'\t' | 0x0b | 0x0c | b'\r' | b'\n'));

    lexer.state.mark_had_line_break();
    byte_search! {
        lexer: lexer,
        table: NOT_REGULAR_WHITESPACE_OR_LINE_BREAK_TABLE,
        handle_eof: return false,
    };
    true
};

/// Space
const SPC: ByteHandler = |lexer| {
    static NOT_SPC: SafeByteMatchTable =
        safe_byte_match_table!(|b| !matches!(b, b' ' | b'\t' | 0x0b | 0x0c));

    byte_search! {
        lexer: lexer,
        table: NOT_SPC,
        handle_eof: return false,
    };
    true
};

const SLH: ByteHandler = |lexer| match lexer.peek() {
    Some('/') => {
        lexer.skip_line_comment(2);
        true
    }
    Some('*') => {
        lexer.skip_block_comment();
        true
    }
    _ => false,
};

/// Unicode
const UNI: ByteHandler = |lexer| {
    let c = lexer.cur().unwrap();
    match c {
        c if is_irregular_whitespace(c) => {
            lexer.bump();
            true
        }
        c if is_irregular_line_terminator(c) => {
            lexer.bump();
            lexer.state.mark_had_line_break();
            true
        }
        _ => false,
    }
};

impl<'a> Lexer<'a> {
    /// Skip comments or whitespaces.
    ///
    /// See https://tc39.github.io/ecma262/#sec-white-space
    #[inline(never)]
    pub fn skip_space(&mut self) {
        loop {
            let byte = match self.input.as_str().as_bytes().first() {
                Some(&v) => v,
                None => return,
            };

            let handler = unsafe { *(&BYTE_HANDLERS as *const ByteHandler).offset(byte as isize) };
            if !handler(self) {
                break;
            }
        }
    }
}
