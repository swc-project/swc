use super::{
    search::{byte_search, safe_byte_match_table, SafeByteMatchTable},
    Kind, Lexer,
};

static NOT_REGULAR_WHITESPACE_OR_LINE_BREAK_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| !matches!(b, b' ' | b'\t' | b'\r' | b'\n'));

impl<'a> Lexer<'a> {
    pub(super) fn line_break_handler(&mut self) -> Kind {
        self.token.is_on_new_line = true;

        // Indentation is common after a line break.
        // Consume it, along with any further line breaks.
        // Irregular line breaks and whitespace are not consumed.
        // They're uncommon, so leave them for the next call to `handle_byte` to take
        // care of.
        byte_search! {
            lexer: self,
            table: NOT_REGULAR_WHITESPACE_OR_LINE_BREAK_TABLE,
            handle_eof: 0, // Fall through to below
        };

        Kind::Skip
    }
}
