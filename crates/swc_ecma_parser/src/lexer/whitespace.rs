/// Returns true if it's done
pub(super) type ByteHandler = Option<for<'aa> fn(&mut SkipWhitespace<'aa>) -> u32>;

/// Lookup table for whitespace
static BYTE_HANDLERS: [ByteHandler; 256] = [
    //   0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F   //
    ___, ___, ___, ___, ___, ___, ___, ___, ___, SPC, NLN, SPC, SPC, NLN, ___, ___, // 0
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 1
    SPC, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 2
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
const ___: ByteHandler = None;

/// Newline
const NLN: ByteHandler = Some(|skip| {
    skip.newline = true;

    1
});

/// Space
const SPC: ByteHandler = Some(|_| 1);

/// Unicode
const UNI: ByteHandler = Some(|skip| {
    // Check byte patterns directly for more efficient Unicode character processing
    let bytes = skip.input.as_bytes();
    let i = skip.offset as usize;

    // Check available bytes
    let remaining_bytes = bytes.len() - i;
    if remaining_bytes < 1 {
        return 0;
    }

    // Predict UTF-8 character length from the first byte
    let first_byte = unsafe { *bytes.get_unchecked(i) };
    let char_len = if first_byte < 128 {
        1
    } else if first_byte < 224 {
        if remaining_bytes < 2 {
            return 0;
        }
        2
    } else if first_byte < 240 {
        if remaining_bytes < 3 {
            return 0;
        }
        3
    } else {
        if remaining_bytes < 4 {
            return 0;
        }
        4
    };

    // Fast path for common Unicode whitespace characters
    // Check UTF-8 byte patterns directly
    if char_len == 3 {
        // LSEP (U+2028) - Line Separator: E2 80 A8
        if first_byte == 0xe2
            && unsafe { *bytes.get_unchecked(i + 1) } == 0x80
            && unsafe { *bytes.get_unchecked(i + 2) } == 0xa8
        {
            skip.newline = true;
            return 3;
        }

        // PSEP (U+2029) - Paragraph Separator: E2 80 A9
        if first_byte == 0xe2
            && unsafe { *bytes.get_unchecked(i + 1) } == 0x80
            && unsafe { *bytes.get_unchecked(i + 2) } == 0xa9
        {
            skip.newline = true;
            return 3;
        }
    }

    // Process with general method if not handled by fast path
    let s = unsafe {
        // Safety: `skip.offset` is always valid
        skip.input.get_unchecked(skip.offset as usize..)
    };

    let c = unsafe {
        // Safety: byte handlers are only called when `skip.input` is not empty
        s.chars().next().unwrap_unchecked()
    };

    match c {
        // Byte Order Mark (BOM)
        '\u{feff}' => {}
        // Line break characters already handled above
        '\u{2028}' | '\u{2029}' => {
            skip.newline = true;
        }
        // Other whitespace characters
        _ if c.is_whitespace() => {}
        // Not a whitespace character
        _ => return 0,
    }

    c.len_utf8() as u32
});

/// API is taked from oxc by Boshen (https://github.com/Boshen/oxc/pull/26)
pub(super) struct SkipWhitespace<'a> {
    pub input: &'a str,

    /// Total offset
    pub offset: u32,

    /// Found newline
    pub newline: bool,
}

impl SkipWhitespace<'_> {
    #[inline(always)]
    pub fn scan(&mut self) {
        let bytes = self.input.as_bytes();
        let len = bytes.len();
        let mut pos = self.offset as usize;

        // Optimization: return immediately if input is empty
        if pos >= len {
            return;
        }

        loop {
            // Optimization 1: Process consecutive spaces (most common case) at once
            let mut byte = unsafe { *bytes.get_unchecked(pos) };

            // Handle consecutive space characters (very common case)
            if byte == b' ' {
                pos += 1;
                // Skip spaces repeatedly (process multiple spaces at once)
                while pos < len && unsafe { *bytes.get_unchecked(pos) } == b' ' {
                    pos += 1;
                }

                // Check if we've reached the end of input
                if pos >= len {
                    break;
                }

                // Get current byte again
                byte = unsafe { *bytes.get_unchecked(pos) };
            }

            // Optimization 2: Handle other common whitespace characters
            match byte {
                b'\n' => {
                    pos += 1;
                    self.newline = true;

                    if pos >= len {
                        break;
                    }
                    continue;
                }
                b'\t' => {
                    pos += 1;

                    if pos >= len {
                        break;
                    }
                    continue;
                }
                b'\r' => {
                    pos += 1;

                    // Handle CR+LF sequence (Windows line break)
                    if pos < len && unsafe { *bytes.get_unchecked(pos) } == b'\n' {
                        pos += 1;
                        self.newline = true;
                    } else {
                        self.newline = true; // Treat standalone CR as line
                                             // break too
                    }

                    if pos >= len {
                        break;
                    }
                    continue;
                }
                // Case where handler is needed
                _ => {
                    // Temporarily update offset
                    self.offset = pos as u32;

                    // Use handler table
                    let handler = unsafe { BYTE_HANDLERS.get_unchecked(byte as usize) };

                    match handler {
                        Some(handler) => {
                            let delta = handler(self);
                            if delta == 0 {
                                // Non-whitespace character found
                                // offset is already updated
                                return;
                            }
                            pos = self.offset as usize + delta as usize;

                            if pos >= len {
                                break;
                            }
                        }
                        None => {
                            // Non-whitespace character found
                            // offset is already updated
                            return;
                        }
                    }
                }
            }
        }

        // Update offset to final position
        self.offset = pos as u32;
    }
}
