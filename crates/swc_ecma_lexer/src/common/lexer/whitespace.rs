use crate::common::lexer::{Lexer, NEW_LINE_WHITESPACE_TABLE, NON_WHITESPACE_IN_ASCII_TABLE};

/// API is taked from oxc by Boshen (https://github.com/Boshen/oxc/pull/26)
pub(super) struct SkipWhitespace {
    /// Found newline
    pub newline: bool,
}

impl SkipWhitespace {
    fn unicode_whitespace_handler<'a, TokenAndSpan, L: Lexer<'a, TokenAndSpan>>(
        &mut self,
        lexer: &mut L,
    ) -> usize {
        // Check byte patterns directly for more efficient Unicode character processing
        let s = lexer.input().as_str();
        let bytes = s.as_bytes();

        let remaining_bytes_len = bytes.len();

        if remaining_bytes_len < 1 {
            return 0;
        }

        // Predict UTF-8 character length from the first byte
        let first_byte = unsafe { *bytes.get_unchecked(0) };
        let char_len = if first_byte < 128 {
            1
        } else if first_byte < 224 {
            if remaining_bytes_len < 2 {
                return 0;
            }
            2
        } else if first_byte < 240 {
            if remaining_bytes_len < 3 {
                return 0;
            }
            3
        } else {
            if remaining_bytes_len < 4 {
                return 0;
            }
            4
        };

        // Fast path for common Unicode whitespace characters
        // Check UTF-8 byte patterns directly
        if char_len == 3 {
            // LSEP (U+2028) - Line Separator: E2 80 A8
            if first_byte == 0xe2
                && unsafe { *bytes.get_unchecked(1) } == 0x80
                && unsafe { *bytes.get_unchecked(2) } == 0xa8
            {
                self.newline = true;
                return 3;
            }

            // PSEP (U+2029) - Paragraph Separator: E2 80 A9
            if first_byte == 0xe2
                && unsafe { *bytes.get_unchecked(1) } == 0x80
                && unsafe { *bytes.get_unchecked(2) } == 0xa9
            {
                self.newline = true;
                return 3;
            }
        }

        let c = unsafe {
            // Safety: byte handlers are only called when `skip.input` is not empty
            s.chars().next().unwrap_unchecked()
        };

        match c {
            // Byte Order Mark (BOM)
            '\u{feff}' => {}
            // Line break characters already handled above
            '\u{2028}' | '\u{2029}' => {
                self.newline = true;
            }
            // Other whitespace characters
            _ if c.is_whitespace() => {}
            // Not a whitespace character
            _ => return 0,
        }

        c.len_utf8()
    }

    #[inline(always)]
    pub fn scan<'a, TokenAndSpan, L: Lexer<'a, TokenAndSpan>>(&mut self, lexer: &mut L) {
        // expanded `byte_search` macro:
        NON_WHITESPACE_IN_ASCII_TABLE.use_table();
        NEW_LINE_WHITESPACE_TABLE.use_table();
        loop {
            let (found_idx, matched_byte) = {
                let slice = lexer.input().as_str();
                if slice.is_empty() {
                    return;
                }
                let bytes = slice.as_bytes();
                let mut idx = 0usize;
                let len = bytes.len();
                let mut found: Option<(usize, u8)> = None;
                while idx < len {
                    let end = (idx + crate::common::lexer::search::SEARCH_BATCH_SIZE).min(len);
                    let mut i = idx;
                    while i < end {
                        let b = bytes[i];
                        if NON_WHITESPACE_IN_ASCII_TABLE.matches(b) {
                            found = Some((i, b));
                            break;
                        }
                        // ==== difference between `byte_search`
                        if NEW_LINE_WHITESPACE_TABLE.matches(b) {
                            self.newline = true;
                        }
                        // ====
                        i += 1;
                    }
                    if found.is_some() {
                        break;
                    }
                    idx = end;
                }
                match found {
                    Some((i, b)) => (Some(i), b),
                    None => (None, 0),
                }
            };

            match found_idx {
                Some(i) => {
                    lexer.input_mut().bump_bytes(i);
                }
                None => {
                    let len = lexer.input().as_str().len();
                    lexer.input_mut().bump_bytes(len);
                    return;
                }
            }

            if matched_byte.is_ascii() {
                break;
            }
            let delta = self.unicode_whitespace_handler(lexer);
            if delta == 0 {
                // Non-whitespace character found
                // offset is already updated
                break;
            }
            lexer.input_mut().bump_bytes(delta);
        }
    }
}
