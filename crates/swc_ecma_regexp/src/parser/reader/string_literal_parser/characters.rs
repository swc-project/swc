pub const LF: char = '\n';
pub const CR: char = '\r';
pub const LS: char = '\u{2028}';
pub const PS: char = '\u{2029}';

// ```
// LineTerminator ::
//   <LF>
//   <CR>
//   <LS>
//   <PS>
// ```
pub fn is_line_terminator(ch: char) -> bool {
    matches!(ch, LF | CR | LS | PS)
}

// ```
// SingleEscapeCharacter :: one of
//   ' " \ b f n r t v
// ```
pub fn is_single_escape_character(ch: char) -> bool {
    matches!(ch, '\'' | '"' | '\\' | 'b' | 'f' | 'n' | 'r' | 't' | 'v')
}

// ```
// NonEscapeCharacter ::
//   SourceCharacter but not one of EscapeCharacter or LineTerminator
//
// EscapeCharacter ::
//   SingleEscapeCharacter
//   DecimalDigit
//   x
//   u
// ```
pub fn is_non_escape_character(ch: char) -> bool {
    let is_escape_character =
        |ch| is_single_escape_character(ch) || ch.is_ascii_digit() || matches!(ch, 'x' | 'u');

    if is_escape_character(ch) || is_line_terminator(ch) {
        return false;
    }
    true
}
