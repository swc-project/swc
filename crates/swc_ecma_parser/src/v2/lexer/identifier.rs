use std::cmp::max;

use oxc_allocator::String;
use swc_common::Span;

use super::{
    cold_branch,
    search::{byte_search, safe_byte_match_table, SafeByteMatchTable},
    Kind, Lexer, SourcePosition,
};
use crate::syntax::identifier::{
    is_identifier_part, is_identifier_part_unicode, is_identifier_start_unicode,
};

const MIN_ESCAPED_STR_LEN: usize = 16;

static ASCII_ID_START_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| b.is_ascii_alphabetic() || b == b'_' || b == b'$');

static NOT_ASCII_ID_CONTINUE_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| !(b.is_ascii_alphanumeric() || b == b'_' || b == b'$'));

#[inline]
fn is_identifier_start_ascii_byte(byte: u8) -> bool {
    ASCII_ID_START_TABLE.matches(byte)
}

impl<'a> Lexer<'a> {
    /// Handle identifier with ASCII start character.
    /// Returns text of the identifier, minus its first char.
    ///
    /// Start character should not be consumed from `self.source` prior to
    /// calling this.
    ///
    /// This function is the "fast path" for the most common identifiers in JS
    /// code - purely consisting of ASCII characters: `a`-`z`, `A`-`Z`,
    /// `0`-`9`, `_`, `$`. JS syntax also allows Unicode identifiers and
    /// escapes (e.g. `\u{FF}`) in identifiers, but they are very rare in
    /// practice. So this fast path will handle 99% of JS code.
    ///
    /// When Unicode or an escape is encountered, this function de-opts to paths
    /// which handle those cases, but those paths are marked `#[cold]` to
    /// keep the ASCII fast path as fast as possible.
    ///
    /// The fast path uses pointers and unsafe code to minimize bounds checks
    /// etc. The functions it delegates to for uncommon cases are both more
    /// complex, and less critical, so they stick to safe code only.
    ///
    /// # SAFETY
    /// * `self.source` must not be exhausted (at least 1 char remaining).
    /// * Next char must be ASCII.
    #[allow(clippy::missing_safety_doc)] // Clippy is wrong!
    pub(super) unsafe fn identifier_name_handler(&mut self) -> &'a str {
        // Advance past 1st byte.
        // SAFETY: Caller guarantees not at EOF, and next byte is ASCII.
        let after_first = self.source.position().add(1);

        // Consume bytes which are part of identifier
        let next_byte = byte_search! {
            lexer: self,
            table: NOT_ASCII_ID_CONTINUE_TABLE,
            start: after_first,
            handle_eof: {
                // Return identifier minus its first char.
                // SAFETY: `lexer.source` is positioned at EOF, so there is no valid value
                // of `after_first` which could be after current position.
                return unsafe { self.source.str_from_pos_to_current_unchecked(after_first) };
            },
        };

        // Found a matching byte.
        // Either end of identifier found, or a Unicode char, or `\` escape.
        // Handle uncommon cases in cold branches to keep the common ASCII path
        // as fast as possible.
        if !next_byte.is_ascii() {
            return cold_branch(|| {
                // SAFETY: `after_first` is position after consuming 1 byte, so subtracting 1
                // makes `start_pos` `source`'s position as it was at start of this function
                let start_pos = unsafe { after_first.sub(1) };
                &self.identifier_tail_unicode(start_pos)[1..]
            });
        }
        if next_byte == b'\\' {
            return cold_branch(|| {
                // SAFETY: `after_first` is position after consuming 1 byte, so subtracting 1
                // makes `start_pos` `source`'s position as it was at start of this function
                let start_pos = unsafe { after_first.sub(1) };
                &self.identifier_backslash(start_pos, false)[1..]
            });
        }

        // Return identifier minus its first char.
        // SAFETY: `after_first` was position of `lexer.source` at start of this search.
        // Searching only proceeds in forwards direction, so `lexer.source.position()`
        // cannot be before `after_first`.
        unsafe { self.source.str_from_pos_to_current_unchecked(after_first) }
    }

    /// Handle rest of identifier after first byte of a multi-byte Unicode char
    /// found. Any number of characters can have already been consumed from
    /// `self.source` prior to it. `self.source` should be positioned at
    /// start of Unicode character.
    fn identifier_tail_unicode(&mut self, start_pos: SourcePosition) -> &'a str {
        let c = self.peek().unwrap();
        if is_identifier_part_unicode(c) {
            self.consume_char();
            self.identifier_tail_after_unicode(start_pos)
        } else {
            // Reached end of identifier. Return identifier.
            self.source.str_from_pos_to_current(start_pos)
        }
    }

    /// Handle identifier after first char (which was Unicode) is dealt with.
    ///
    /// First char should have been consumed from `self.source` prior to calling
    /// this. `start_pos` should be position of the start of the identifier
    /// (before first char was consumed).
    pub(super) fn identifier_tail_after_unicode(&mut self, start_pos: SourcePosition) -> &'a str {
        // Identifier contains a Unicode chars, so probably contains more.
        // So just iterate over chars now, instead of bytes.
        while let Some(c) = self.peek() {
            if is_identifier_part(c) {
                self.consume_char();
            } else if c == '\\' {
                // This branch marked cold as escapes are uncommon
                return cold_branch(|| self.identifier_backslash(start_pos, false));
            } else {
                break;
            }
        }

        // Return identifier
        self.source.str_from_pos_to_current(start_pos)
    }

    /// Handle identifier starting with `\` escape.
    pub fn identifier_backslash_handler(&mut self) -> Kind {
        // Create arena string to hold unescaped identifier.
        // We don't know how long identifier will end up being, so guess.
        let str = String::with_capacity_in(MIN_ESCAPED_STR_LEN, self.allocator);

        // Process escape and get rest of identifier
        let id = self.identifier_on_backslash(str, true);
        Kind::match_keyword(id)
    }

    /// Consume rest of identifier after a `\` escape is found.
    ///
    /// The `\` must not have be consumed from `lexer.source`.
    /// `start_pos` must be position of start of identifier.
    fn identifier_backslash(&mut self, start_pos: SourcePosition, is_start: bool) -> &'a str {
        // Create arena string to hold unescaped identifier.
        // We don't know how long identifier will end up being. Take a guess that total
        // length will be double what we've seen so far, or
        // `MIN_ESCAPED_STR_LEN` minimum.
        let so_far = self.source.str_from_pos_to_current(start_pos);
        let capacity = max(so_far.len() * 2, MIN_ESCAPED_STR_LEN);
        let mut str = String::with_capacity_in(capacity, self.allocator);

        // Push identifier up this point into `str`
        str.push_str(so_far);

        // Process escape and get rest of identifier
        self.identifier_on_backslash(str, is_start)
    }

    /// Process rest of identifier after a `\` found.
    ///
    /// `self.source` should be positioned *on* the `\` (i.e. `\` has not been
    /// consumed yet). `str` should contain the identifier up to before the
    /// escape. `is_start` should be `true` if this is first char in the
    /// identifier, `false` otherwise.
    fn identifier_on_backslash(&mut self, mut str: String<'a>, mut is_start: bool) -> &'a str {
        'outer: loop {
            // Consume `\`
            self.consume_char();

            // Consume escape sequence and add char to `str`
            self.identifier_unicode_escape_sequence(&mut str, is_start);
            is_start = false;

            // Consume chars until reach end of identifier or another escape
            let chunk_start = self.source.position();
            loop {
                let maybe_char = self.peek();
                if maybe_char.is_some_and(is_identifier_part) {
                    self.consume_char();
                    continue;
                }

                // End of identifier, EOF, or another `\` escape.
                // Push chunk since last escape to `str`.
                let chunk = self.source.str_from_pos_to_current(chunk_start);
                str.push_str(chunk);

                if maybe_char != Some('\\') {
                    // End of identifier or EOF
                    break 'outer;
                }

                // Found another escape. Go back to start of outer loop.
                break;
            }
        }

        // Convert `str` to arena slice and save to `escaped_strings`
        let id = str.into_bump_str();
        self.save_string(true, id);
        id
    }

    /// Entry point for a private identifier. i.e. after `#`.
    /// `#` must be consumed before calling this.
    ///
    /// Like `identifier_name_handler`, this contains a fast path for
    /// identifiers which are pure ASCII. Unicode characters and escapes are
    /// handled on paths marked `#[cold]` to keep the common ASCII fast path
    /// as fast as possible.
    pub fn private_identifier(&mut self) -> Kind {
        // Handle EOF directly after `#`
        let start_pos = self.source.position();
        if start_pos.addr() == self.source.end_addr() {
            return cold_branch(|| {
                let start = self.offset();
                self.error(diagnostics::unexpected_end(Span::new(start, start)));
                Kind::Undetermined
            });
        }

        // Handle if not an ASCII identifier byte.
        // SAFETY: Not at EOF, so safe to read a byte.
        let b = unsafe { start_pos.read() };
        if !is_identifier_start_ascii_byte(b) {
            return self.private_identifier_not_ascii_id();
        }

        // SAFETY: Not at EOF, so can advance 1 byte without going out of bounds
        let after_first = unsafe { start_pos.add(1) };

        // Consume bytes which are part of identifier
        let next_byte = byte_search! {
            lexer: self,
            table: NOT_ASCII_ID_CONTINUE_TABLE,
            start: after_first,
            handle_eof: {
                return Kind::PrivateIdentifier;
            },
        };

        // Found a matching byte.
        // Either end of identifier found, or a Unicode char, or `\` escape.
        // Handle uncommon cases in cold branches to keep the common ASCII path
        // as fast as possible.
        if !next_byte.is_ascii() {
            return cold_branch(|| {
                // SAFETY: `after_first` is position after consuming 1 byte, so subtracting 1
                // makes `start_pos` `source`'s position as it was at start of this function
                let start_pos = unsafe { after_first.sub(1) };
                self.identifier_tail_unicode(start_pos);
                Kind::PrivateIdentifier
            });
        }
        if next_byte == b'\\' {
            return cold_branch(|| {
                // SAFETY: `after_first` is position after consuming 1 byte, so subtracting 1
                // makes `start_pos` `source`'s position as it was at start of this function
                let start_pos = unsafe { after_first.sub(1) };
                self.identifier_backslash(start_pos, false);
                Kind::PrivateIdentifier
            });
        }

        Kind::PrivateIdentifier
    }

    /// Handle private identifier whose first byte is not an ASCII identifier
    /// start byte.
    #[cold]
    fn private_identifier_not_ascii_id(&mut self) -> Kind {
        let b = self.source.peek_byte().unwrap();
        if !b.is_ascii() {
            let c = self.peek().unwrap();
            if is_identifier_start_unicode(c) {
                let start_pos = self.source.position();
                self.consume_char();
                self.identifier_tail_after_unicode(start_pos);
                return Kind::PrivateIdentifier;
            }
        } else if b == b'\\' {
            // Assume Unicode characters are more common than `\` escapes, so this branch as
            // cold
            return cold_branch(|| {
                self.identifier_backslash_handler();
                Kind::PrivateIdentifier
            });
        }

        // No identifier found
        let start = self.offset();
        let c = self.consume_char();
        self.error(diagnostics::invalid_character(
            c,
            Span::new(start, self.offset()),
        ));
        Kind::Undetermined
    }
}
