use super::search::SafeByteMatchTable;
use crate::lexer::search::safe_byte_match_table;

pub(crate) const LS_OR_PS_FIRST: u8 = 0xe2;
pub(crate) const LS_BYTES_2_AND_3: [u8; 2] = [0x80, 0xa8];
pub(crate) const PS_BYTES_2_AND_3: [u8; 2] = [0x80, 0xa9];

pub(crate) static LINE_BREAK_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| matches!(b, b'\n' | b'\r' | LS_OR_PS_FIRST));

pub(crate) static BLOCK_COMMENT_SCAN_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| matches!(b, b'*' | b'\n' | b'\r' | LS_OR_PS_FIRST));

pub(crate) static DOUBLE_QUOTE_STRING_END_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| matches!(b, b'"' | b'\n' | b'\\' | b'\r'));

pub(crate) static SINGLE_QUOTE_STRING_END_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| matches!(b, b'\'' | b'\n' | b'\\' | b'\r'));

pub(crate) static NOT_ASCII_ID_CONTINUE_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| !matches!(b, b'0'..=b'9' | b'a'..=b'z' | b'A'..=b'Z' | b'_' | b'$'));

pub(crate) static TEMPLATE_LITERAL_SCAN_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| matches!(b, b'$' | b'`' | b'\\' | b'{' | b'}'));
