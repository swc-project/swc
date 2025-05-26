// ```
// SyntaxCharacter :: one of
//   ^ $ \ . * + ? ( ) [ ] { } |
// ```
pub fn is_syntax_character(cp: u32) -> bool {
    char::from_u32(cp).is_some_and(|ch| {
        matches!(
            ch,
            '^' | '$' | '\\' | '.' | '*' | '+' | '?' | '(' | ')' | '[' | ']' | '{' | '}' | '|'
        )
    })
}

// ```
// ClassSetSyntaxCharacter :: one of
//   ( ) [ ] { } / - \ |
// ```
pub fn is_class_set_syntax_character(cp: u32) -> bool {
    char::from_u32(cp)
        .is_some_and(|ch| matches!(ch, '(' | ')' | '[' | ']' | '{' | '}' | '/' | '-' | '\\' | '|'))
}

// ```
// ClassSetReservedDoublePunctuator :: one of
//   && !! ## $$ %% ** ++ ,, .. :: ;; << == >> ?? @@ ^^ `` ~~
// ```
pub fn is_class_set_reserved_double_punctuator(cp1: u32, cp2: u32) -> bool {
    char::from_u32(cp1).is_some_and(|ch1| {
        char::from_u32(cp2).is_some_and(|ch2| {
            matches!(
                (ch1, ch2),
                ('&', '&')
                    | ('!', '!')
                    | ('#', '#')
                    | ('$', '$')
                    | ('%', '%')
                    | ('*', '*')
                    | ('+', '+')
                    | (',', ',')
                    | ('.', '.')
                    | (':', ':')
                    | (';', ';')
                    | ('<', '<')
                    | ('=', '=')
                    | ('>', '>')
                    | ('?', '?')
                    | ('@', '@')
                    | ('^', '^')
                    | ('`', '`')
                    | ('~', '~')
            )
        })
    })
}

// ```
// ClassSetReservedPunctuator :: one of
//   & - ! # % , : ; < = > @ ` ~
// ```
pub fn is_class_set_reserved_punctuator(cp: u32) -> bool {
    char::from_u32(cp).is_some_and(|ch| {
        matches!(
            ch,
            '&' | '-' | '!' | '#' | '%' | ',' | ':' | ';' | '<' | '=' | '>' | '@' | '`' | '~'
        )
    })
}

pub fn is_decimal_digit(cp: u32) -> bool {
    char::from_u32(cp).is_some_and(|ch| ch.is_ascii_digit())
}

pub fn is_octal_digit(cp: u32) -> bool {
    char::from_u32(cp).is_some_and(|ch| ch.is_ascii_digit() && ch < '8')
}

pub fn is_valid_unicode(cp: u32) -> bool {
    (0..=0x0010_ffff).contains(&cp)
}

// ```
// UnicodePropertyNameCharacter ::
//   AsciiLetter
//   _
// ```
pub fn is_unicode_property_name_character(cp: u32) -> bool {
    char::from_u32(cp).is_some_and(|ch| ch.is_ascii_alphabetic() || ch == '_')
}

// ```
// UnicodePropertyValueCharacter ::
//   UnicodePropertyNameCharacter
//   DecimalDigit
// ```
pub fn is_unicode_property_value_character(cp: u32) -> bool {
    char::from_u32(cp).is_some_and(|ch| ch.is_ascii_alphanumeric() || ch == '_')
}

pub fn is_unicode_id_start(cp: u32) -> bool {
    char::from_u32(cp).is_some_and(unicode_id_start::is_id_start)
}

pub fn is_unicode_id_continue(cp: u32) -> bool {
    char::from_u32(cp).is_some_and(unicode_id_start::is_id_continue)
}

pub fn is_identifier_start_char(cp: u32) -> bool {
    char::from_u32(cp).is_some_and(|ch| unicode_id_start::is_id_start(ch) || ch == '$' || ch == '_')
}

pub fn is_identifier_part_char(cp: u32) -> bool {
    char::from_u32(cp).is_some_and(|ch| unicode_id_start::is_id_continue(ch) || ch == '$')
}

pub fn map_control_escape(cp: u32) -> Option<u32> {
    match char::from_u32(cp) {
        Some('f') => Some(0x0c),
        Some('n') => Some(0x0a),
        Some('r') => Some(0x0d),
        Some('t') => Some(0x09),
        Some('v') => Some(0x0b),
        _ => None,
    }
}

pub fn map_c_ascii_letter(cp: u32) -> Option<u32> {
    char::from_u32(cp).filter(char::is_ascii_alphabetic).map(|_| cp % 0x20)
}

pub fn map_hex_digit(cp: u32) -> Option<u32> {
    char::from_u32(cp).filter(char::is_ascii_hexdigit).and_then(|c| c.to_digit(16))
}
