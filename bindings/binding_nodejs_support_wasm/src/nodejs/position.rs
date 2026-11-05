/// Converts monotonically increasing byte positions into JavaScript locations.
/// Walking only the intervening text keeps batches of locations linear in the
/// source length, including when many tokens share the same line.
pub(super) struct SourcePosition<'a> {
    source: &'a str,
    byte: usize,
    pub offset: usize,
    pub line: usize,
    pub column: usize,
    previous_cr: bool,
}

impl<'a> SourcePosition<'a> {
    pub fn new(source: &'a str) -> Self {
        Self {
            source,
            byte: 0,
            offset: 0,
            line: 1,
            column: 0,
            previous_cr: false,
        }
    }

    pub fn advance_to(&mut self, byte: usize) {
        for ch in self.source[self.byte..byte].chars() {
            self.offset += ch.len_utf16();
            match ch {
                '\n' if self.previous_cr => {}
                '\r' | '\n' | '\u{2028}' | '\u{2029}' => {
                    self.line += 1;
                    self.column = 0;
                }
                _ => self.column += ch.len_utf16(),
            }
            self.previous_cr = ch == '\r';
        }
        self.byte = byte;
    }
}
