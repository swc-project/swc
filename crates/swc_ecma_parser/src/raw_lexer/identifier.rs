use super::{string, unicode::is_id_start, RawLexResult, RawLexer};

impl RawLexer<'_> {
    /// identifier_name
    /// https://tc39.es/ecma262/#sec-names-and-keywords
    pub(super) fn read_identifier_name(&mut self) -> RawLexResult<String> {
        let mut builder = String::new();

        self.identifier_start(&mut builder)?;
        self.identifier_part(&mut builder)?;

        Ok(builder)
    }

    /// identifier start - https://tc39.es/ecma262/#prod-IdentifierStart
    /// ```text
    /// IdentifierStart ::
    ///     IdentifierStartChar
    ///     \ UnicodeEscapeSequence
    /// ```
    fn identifier_start(&mut self, text: &mut String) -> RawLexResult<()> {
        let start = self.offset();

        let ch = match self.next_char() {
            Some(ch) => match c {
                '\\' => {
                    if self.next_char() != Some('u') {
                        return self.error(start, self.offset(), SyntaxError::InvalidUnicodeEscape);
                    };

                    let ch = self.unicode_escape_sequence_without_u()?;
                    if is_identifier_start(ch) {
                        Ok(ch)
                    } else {
                        self.error(start, self.offset(), SyntaxError::InvalidUnicodeEscape)
                    }
                }
                other if is_identifier_start(c) => Ok(other),
                _ => self.error(start, self.offset(), SyntaxError::InvalidUnicodeEscape),
            },
            None => unreachable!(),
        }?;

        text.push(ch);

        Ok(())
    }

    /// identifier part
    /// https://tc39.es/ecma262/#prod-IdentifierPart
    /// ```text
    /// IdentifierPart ::
    ///     IdentifierPartChar
    ///     \ UnicodeEscapeSequence
    /// ```
    pub(super) fn identifier_part(&mut self, text: &mut String) -> RawLexResult<()> {
        let start = self.offset();
        while let Some(ch) = self.next_char() {
            match ch {
                '\\' => {
                    if self.next_char() != Some('u') {
                        return self.error(start, self.offset(), SyntaxError::InvalidUnicodeEscape);
                    };

                    let ch = self.unicode_escape_sequence_without_u()?;

                    if is_identifier_part(ch) {
                        text.push(ch);
                    } else {
                        return self.error(start, self.offset(), SyntaxError::InvalidUnicodeEscape);
                    }
                }
                other if is_identifier_part(other) => text.push(other),
                _ => break,
            }
        }

        Ok(())
    }
}

/// True if `c` is a one-character *IdentifierStart*.
///
/// ```text
/// IdentifierStart ::
///     UnicodeIDStart
///     `$`
///     `_`
///     `\` UnicodeEscapeSequence
///
/// UnicodeIDStart ::
///     > any Unicode code point with the Unicode property "ID_Start"
/// ```
/// fork from jsparagus
fn is_identifier_start(ch: char) -> bool {
    // Escaped case is handled separately.
    if ch.is_ascii() {
        ch == '$' || ch == '_' || ch.is_ascii_alphabetic()
    } else {
        is_id_start(ch)
    }
}

/// True if `c` is a one-character *IdentifierPart*.
///
/// ```text
/// IdentifierPart ::
///     UnicodeIDContinue
///     `$`
///     `\` UnicodeEscapeSequence
///     <ZWNJ>
///     <ZWJ>
///
/// UnicodeIDContinue ::
///     > any Unicode code point with the Unicode property "ID_Continue"
/// ```
///
/// fork from japaragus
fn is_identifier_part(ch: char) -> bool {
    // Escaped case is handled separately.
    if ch.is_ascii() {
        ch == '$' || ch == '_' || ch.is_ascii_alphanumeric()
    } else {
        is_id_continue(ch) || ch == ZWNJ || ch == ZWJ
    }
}
