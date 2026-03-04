//! Utilities for fast byte-wise scanning.

/// Number of bytes scanned per batch.
pub(crate) const SEARCH_BATCH_SIZE: usize = 32;

/// Compile-time lookup table for safe byte matching.
#[repr(C, align(64))]
pub(crate) struct SafeByteMatchTable([bool; 256]);

impl SafeByteMatchTable {
    pub(crate) const fn new(bytes: [bool; 256]) -> Self {
        // UTF-8 safety guarantee:
        // - Either all UTF-8 leading bytes match, OR
        // - No UTF-8 continuation byte matches.
        // This ensures `byte_search!` never stops in the middle of a code point.
        let mut unicode_start_all_match = true;
        let mut unicode_cont_all_no_match = true;

        let mut i = 0;
        while i < 256 {
            let matched = bytes[i];
            if matched {
                if i >= 0x80 && i < 0xc0 {
                    unicode_cont_all_no_match = false;
                }
            } else if i >= 0xc0 && i < 0xf8 {
                unicode_start_all_match = false;
            }
            i += 1;
        }

        assert!(
            unicode_start_all_match || unicode_cont_all_no_match,
            "Cannot create SafeByteMatchTable with an unsafe pattern"
        );

        Self(bytes)
    }

    #[inline]
    pub(crate) const fn use_table(&self) {}

    #[inline]
    pub(crate) const fn matches(&self, b: u8) -> bool {
        self.0[b as usize]
    }
}

macro_rules! safe_byte_match_table {
    (|$byte:ident| $body:expr) => {{
        use $crate::lexer::search::SafeByteMatchTable;
        #[allow(clippy::eq_op, clippy::allow_attributes)]
        const TABLE: SafeByteMatchTable = seq_macro::seq!($byte in 0u8..=255 {
            SafeByteMatchTable::new([#($body,)*])
        });
        TABLE
    }};
}

pub(crate) use safe_byte_match_table;

macro_rules! byte_search {
    // Simple version
    (
        lexer: $lexer:ident,
        table: $table:ident,
        handle_eof: $eof_handler:expr $(,)?
    ) => {
        byte_search! {
            lexer: $lexer,
            table: $table,
            continue_if: (_matched, _pos_offset) false,
            handle_eof: $eof_handler,
        }
    };

    // Full version
    (
        lexer: $lexer:ident,
        table: $table:ident,
        continue_if: ($matched:ident, $pos_offset:ident) $should_continue:expr,
        handle_eof: $eof_handler:expr $(,)?
    ) => {{
        $table.use_table();

        let mut $pos_offset = 0usize;
        let bytes = $lexer.input().as_str().as_bytes();
        let len = bytes.len();
        let bytes = bytes.as_ptr();

        let $matched = 'outer: loop {
            let batch_end = $pos_offset + $crate::lexer::search::SEARCH_BATCH_SIZE;
            let $matched = if batch_end < len {
                let batch = unsafe {
                    std::slice::from_raw_parts(
                        bytes.add($pos_offset),
                        $crate::lexer::search::SEARCH_BATCH_SIZE,
                    )
                };

                'inner: loop {
                    for (i, &byte) in batch.iter().enumerate() {
                        if $table.matches(byte) {
                            $pos_offset += i;
                            break 'inner byte;
                        }
                    }

                    $pos_offset = batch_end;
                    continue 'outer;
                }
            } else {
                'inner: loop {
                    let remaining = unsafe {
                        std::slice::from_raw_parts(bytes.add($pos_offset), len - $pos_offset)
                    };
                    for (i, &byte) in remaining.iter().enumerate() {
                        if $table.matches(byte) {
                            $pos_offset += i;
                            break 'inner byte;
                        }
                    }

                    unsafe {
                        $lexer.input_mut().bump_bytes(len);
                    }
                    $eof_handler
                }
            };

            if $should_continue {
                $pos_offset += 1;
                continue;
            }

            break $matched;
        };

        unsafe {
            $lexer.input_mut().bump_bytes($pos_offset);
        }
        $matched
    }};
}

pub(crate) use byte_search;
