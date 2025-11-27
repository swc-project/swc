//! Utilities inspired by OXC lexer for fast byte-wise searching over source
//! text.

/// How many bytes we process per batch when scanning.
pub const SEARCH_BATCH_SIZE: usize = 32;

/// Compile-time lookup table guaranteeing UTF-8 boundary safety.
#[repr(C, align(64))]
pub struct SafeByteMatchTable([bool; 256]);

impl SafeByteMatchTable {
    pub const fn new(bytes: [bool; 256]) -> Self {
        // Safety guarantee: either all leading bytes (0xC0..0xF7) match, or all
        // continuation bytes (0x80..0xBF) *do not* match. This ensures that if
        // we stop on a match the input cursor is on a UTF-8 char boundary.
        let mut unicode_start_all_match = true;
        let mut unicode_cont_all_no_match = true;
        let mut i = 0;
        while i < 256 {
            let m = bytes[i];
            if m {
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
    pub const fn use_table(&self) {}

    #[inline]
    pub const fn matches(&self, b: u8) -> bool {
        self.0[b as usize]
    }
}

// ------------------------- Macros -------------------------

#[macro_export]
macro_rules! safe_byte_match_table {
    (|$byte:ident| $body:expr) => {{
        use $crate::common::lexer::search::SafeByteMatchTable;
        #[allow(clippy::eq_op, clippy::allow_attributes)]
        const TABLE: SafeByteMatchTable = seq_macro::seq!($byte in 0u8..=255 {
            SafeByteMatchTable::new([#($body,)*])
        });
        TABLE
    }};
}

#[macro_export]
macro_rules! byte_search {
    // Simple version without continue_if
    (
        lexer: $lexer:ident,
        table: $table:ident,
        handle_eof: $eof_handler:expr $(,)?
    ) => {
        byte_search! {
            lexer: $lexer,
            table: $table,
            continue_if: (_byte, _pos) false,
            handle_eof: $eof_handler,
        }
    };

    // Full version with continue_if support
    (
        lexer: $lexer:ident,
        table: $table:ident,
        continue_if: ($byte:ident, $pos:ident) $should_continue:expr,
        handle_eof: $eof_handler:expr $(,)?
    ) => {{
        $table.use_table();
        loop {
            // Open a new scope so the immutable borrow (slice/bytes) ends before we
            // call `bump_bytes`, which requires `&mut`.
            let (found_idx, $byte) = {
                let slice = $lexer.input().as_str();
                if slice.is_empty() {
                    $eof_handler
                }
                let bytes = slice.as_bytes();
                let mut idx = 0usize;
                let len = bytes.len();
                let mut found: Option<(usize, u8)> = None;
                while idx < len {
                    let end = (idx + $crate::common::lexer::search::SEARCH_BATCH_SIZE).min(len);
                    let mut i = idx;
                    while i < end {
                        let b = bytes[i];
                        if $table.matches(b) {
                            found = Some((i, b));
                            break;
                        }
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
            }; // immutable borrow ends here

            match found_idx {
                Some(i) => {
                    // Check if we should continue searching
                    let $pos = i; // Index within current slice
                    if $should_continue {
                        // Continue searching from next position
                        unsafe {
                            $lexer.input_mut().bump_bytes(i + 1);
                        }
                        continue;
                    } else {
                        unsafe {
                            $lexer.input_mut().bump_bytes(i);
                        }
                        break $byte;
                    }
                }
                None => {
                    // Consume remainder then run handler.
                    let len = $lexer.input().as_str().len();
                    unsafe {
                        $lexer.input_mut().bump_bytes(len);
                    }
                    $eof_handler
                }
            }
        }
    }};
}
