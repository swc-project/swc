use swc_common::{input::Input, Span};

use super::{
    search::{byte_search, safe_byte_match_table, SafeByteMatchTable},
    tables::{
        BLOCK_COMMENT_SCAN_TABLE, LINE_BREAK_TABLE, LS_BYTES_2_AND_3, LS_OR_PS_FIRST,
        PS_BYTES_2_AND_3,
    },
    Lexer,
};
use crate::error::{Error, ErrorCode, Severity};

const B_VT: u8 = 0x0b;
const B_FF: u8 = 0x0c;

type ByteHandler = fn(&mut Lexer<'_>) -> bool;

static NOT_REGULAR_WHITESPACE_OR_LINE_BREAK_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| !matches!(b, b' ' | b'\t' | B_VT | B_FF | b'\r' | b'\n'));
static NOT_SPACE_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| !matches!(b, b' ' | b'\t' | B_VT | B_FF));

const fn build_byte_handlers() -> [ByteHandler; 256] {
    let mut table = [stop as ByteHandler; 256];

    table[b' ' as usize] = spc;
    table[b'\t' as usize] = spc;
    table[B_VT as usize] = spc;
    table[B_FF as usize] = spc;
    table[b'\n' as usize] = nln;
    table[b'\r' as usize] = nln;
    table[b'/' as usize] = slh;
    table[b'<' as usize] = lss;
    table[b'-' as usize] = min;

    let mut i = 0x80usize;
    while i < 256 {
        table[i] = uni;
        i += 1;
    }

    table
}

static BYTE_HANDLERS: [ByteHandler; 256] = build_byte_handlers();

fn stop(_: &mut Lexer<'_>) -> bool {
    false
}

fn nln(lexer: &mut Lexer<'_>) -> bool {
    lexer.had_line_break_before = true;
    byte_search! {
        lexer: lexer,
        table: NOT_REGULAR_WHITESPACE_OR_LINE_BREAK_TABLE,
        handle_eof: return false,
    };
    true
}

fn spc(lexer: &mut Lexer<'_>) -> bool {
    byte_search! {
        lexer: lexer,
        table: NOT_SPACE_TABLE,
        handle_eof: return false,
    };
    true
}

fn slh(lexer: &mut Lexer<'_>) -> bool {
    match lexer.input.peek() {
        Some(b'/') => {
            lexer.bump_ascii();
            lexer.bump_ascii();
            lexer.skip_line_comment_content();
            true
        }
        Some(b'*') => {
            lexer.skip_block_comment();
            true
        }
        _ => false,
    }
}

fn lss(lexer: &mut Lexer<'_>) -> bool {
    if lexer.input.is_str("<!--") {
        lexer.bump_ascii();
        lexer.bump_ascii();
        lexer.bump_ascii();
        lexer.bump_ascii();
        lexer.skip_line_comment_content();
        true
    } else {
        false
    }
}

fn min(lexer: &mut Lexer<'_>) -> bool {
    if lexer.input.is_str("-->") && (lexer.had_line_break_before || lexer.is_first_token) {
        lexer.bump_ascii();
        lexer.bump_ascii();
        lexer.bump_ascii();
        lexer.skip_line_comment_content();
        true
    } else {
        false
    }
}

fn uni(lexer: &mut Lexer<'_>) -> bool {
    let Some(ch) = lexer.input.cur_as_char() else {
        return false;
    };

    if ch.is_whitespace() || ch == '\u{feff}' {
        if matches!(ch, '\n' | '\r' | '\u{2028}' | '\u{2029}') {
            lexer.had_line_break_before = true;
        }
        lexer.bump_char();
        true
    } else {
        false
    }
}

impl<'a> Lexer<'a> {
    pub(super) fn skip_space_and_comments(&mut self) {
        while let Some(byte) = self.input.cur() {
            let handler = unsafe { *(&BYTE_HANDLERS as *const ByteHandler).add(byte as usize) };
            if !handler(self) {
                break;
            }
        }

        if self.comments.is_some() {
            // Comments are intentionally not persisted yet.
            // This branch exists to keep constructor contracts explicit.
        }
    }

    fn skip_line_comment_content(&mut self) {
        byte_search! {
            lexer: self,
            table: LINE_BREAK_TABLE,
            continue_if: (matched_byte, pos_offset) {
                if matched_byte != LS_OR_PS_FIRST {
                    false
                } else {
                    let bytes = self.input.as_str().as_bytes();
                    if pos_offset + 2 < bytes.len() {
                        let next2 = [bytes[pos_offset + 1], bytes[pos_offset + 2]];
                        !(next2 == LS_BYTES_2_AND_3 || next2 == PS_BYTES_2_AND_3)
                    } else {
                        true
                    }
                }
            },
            handle_eof: return,
        };
    }

    fn skip_block_comment(&mut self) {
        let start = self.input.cur_pos();
        self.bump_ascii();
        self.bump_ascii();

        let mut terminated = false;
        byte_search! {
            lexer: self,
            table: BLOCK_COMMENT_SCAN_TABLE,
            continue_if: (matched_byte, pos_offset) {
                match matched_byte {
                    b'\n' | b'\r' => {
                        self.had_line_break_before = true;
                        true
                    }
                    LS_OR_PS_FIRST => {
                        let bytes = self.input.as_str().as_bytes();
                        if pos_offset + 2 < bytes.len() {
                            let next2 = [bytes[pos_offset + 1], bytes[pos_offset + 2]];
                            if next2 == LS_BYTES_2_AND_3 || next2 == PS_BYTES_2_AND_3 {
                                self.had_line_break_before = true;
                            }
                        }
                        true
                    }
                    b'*' => {
                        let bytes = self.input.as_str().as_bytes();
                        if bytes.get(pos_offset + 1) == Some(&b'/') {
                            pos_offset += 2;
                            terminated = true;
                            false
                        } else {
                            true
                        }
                    }
                    _ => true,
                }
            },
            handle_eof: {
                self.errors.push(Error::new(
                    Span::new_with_checked(start, self.input.cur_pos()),
                    Severity::Error,
                    ErrorCode::UnterminatedBlockComment,
                    "unterminated block comment",
                ));
                return;
            },
        };
        debug_assert!(terminated || self.input.cur().is_none());
    }
}
