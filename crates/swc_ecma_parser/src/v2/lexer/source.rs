#![allow(clippy::unnecessary_safety_comment)]

use std::{marker::PhantomData, slice, str};

use swc_common::BytePos;

use super::search::SEARCH_BATCH_SIZE;
use crate::{UniquePromise, MAX_LEN};

/// `Source` holds the source text for the lexer, and provides APIs to read it.
///
/// It provides a cursor which allows consuming source text either as `char`s,
/// or as bytes. It replaces `std::str::Chars` iterator which performed the same
/// function previously, but was less flexible as only allowed consuming source
/// char by char.
///
/// Consuming source text byte-by-byte is often more performant than
/// char-by-char.
///
/// `Source` provides:
///
/// * Safe API for consuming source char-by-char (`Source::next_char`,
///   `Source::peek_char`).
/// * Safe API for peeking next source byte (`Source::peek_byte`).
/// * Unsafe API for consuming source byte-by-byte (`Source::next_byte`).
/// * Mostly-safe API for rewinding to a previous position in source
///   (`Source::position`, `Source::set_position`).
///
/// # Composition of `Source`
///
/// * `start` is pointer to start of source text.
/// * `end` is pointer to end of source text.
/// * `ptr` is cursor for current position in source text.
///
/// # Invariants of `Source`
///
/// 1. `start` <= `end`
/// 2. The region of memory bounded between `start` and `end` must be
///    initialized, a single allocation, and contain the bytes of a valid UTF-8
///    string.
/// 3. `ptr` must always be >= `start` and <= `end`. i.e. cursor always within
///    bounds of source text `&str`, or 1 byte after last byte of source text
///    (positioned on EOF).
/// 4. `ptr` must always point to a UTF-8 character boundary, or EOF. i.e.
///    pointing to *1st* byte of a UTF-8 character.
///
/// These invariants are the same as `std::str::Chars`, except `Source` allows
/// temporarily breaking invariant (4) to step through source text byte-by-byte.
///
/// Invariants (1), (2) and (3) must be upheld at all times.
/// Invariant (4) can be temporarily broken, as long as caller ensures it's
/// satisfied again.
///
/// Invariants (1) and (2) are enforced by initializing `start` and `end` from a
/// valid `&str`, and they are never modified after initialization.
///
/// Safe methods of `Source` enforce invariant (3) i.e. they do not allow
/// reading past EOF. Unsafe methods e.g. `Source::next_byte_unchecked` and
/// `Source::peek_byte_unchecked` require caller to uphold this invariant.
///
/// Invariant (4) is the most difficult to satisfy.
/// `Source::next_char` relies on source text being valid UTF-8 to provide a
/// safe API which upholds this invariant.
/// `Source::next_byte` requires very careful use as it may violate invariant
/// (4). That is fine temporarily, but caller *must* ensure the safety
/// conditions of `Source::next_byte` are satisfied, to restore this invariant
/// before passing control back to other code. It will often be preferable to
/// instead use `Source::peek_byte`, followed by `Source::next_char`,
/// which are safe methods, and compiler will often reduce to equally efficient
/// code.
#[derive(Clone)]
pub(super) struct Source<'a> {
    /// Pointer to start of source string. Never altered after initialization.
    start: *const u8,
    /// Pointer to end of source string. Never altered after initialization.
    end: *const u8,
    /// Pointer to current position in source string
    ptr: *const u8,
    /// Memory address past which not enough bytes remaining in source to
    /// process a batch of `SEARCH_BATCH_SIZE` bytes in one go.
    /// Must be `usize`, not a pointer, as if source is very short, a pointer
    /// could be out of bounds.
    end_for_batch_search_addr: usize,
    /// Marker for immutable borrow of source string
    _marker: PhantomData<&'a str>,
}

impl<'a> Source<'a> {
    /// Create `Source` from `&str`.
    ///
    /// Requiring a `UniquePromise` to be provided guarantees only 1 `Source`
    /// can exist on a single thread at one time.
    #[allow(clippy::needless_pass_by_value)]
    pub(super) fn new(mut source_text: &'a str, _unique: UniquePromise) -> Self {
        // If source text exceeds size limit, substitute a short source text which will
        // fail to parse. `Parser::parse` will convert error to
        // `diagnostics::overlong_source()`.
        if source_text.len() > MAX_LEN {
            source_text = "\0";
        }

        let start = source_text.as_ptr();
        // SAFETY: Adding `source_text.len()` to the starting pointer gives a pointer
        // at the end of `source_text`. `end` will never be dereferenced, only checked
        // for direct pointer equality with `ptr` to check if at end of file.
        let end = unsafe { start.add(source_text.len()) };

        // `saturating_sub` not `wrapping_sub` so that value doesn't wrap around if
        // source is very short, and has very low memory address (e.g. 16). If
        // that's the case, `end_for_batch_search_addr` will be 0, so a test
        // whether any non-null pointer is past end will always test positive,
        // and disable batch search.
        let end_for_batch_search_addr = (end as usize).saturating_sub(SEARCH_BATCH_SIZE);

        Self {
            start,
            end,
            ptr: start,
            end_for_batch_search_addr,
            _marker: PhantomData,
        }
    }

    /// Get entire source text as `&str`.
    #[inline]
    pub(super) fn whole(&self) -> &'a str {
        // SAFETY:
        // `start` and `end` are created from a `&str` in `Source::new`, so `start`
        // cannot be after `end`. `start` and `end` are by definition on UTF-8
        // char boundaries.
        unsafe {
            self.str_between_positions_unchecked(
                SourcePosition::new(self.start),
                SourcePosition::new(self.end),
            )
        }
    }

    /// Get remaining source text as `&str`.
    #[inline]
    pub(super) fn remaining(&self) -> &'a str {
        // SAFETY:
        // Invariant of `Source` is that `ptr` is always <= `end`, and is on a UTF-8
        // char boundary. `end` is pointer to end of original `&str`, so be
        // definition a UTF-8 char boundary.
        unsafe {
            self.str_between_positions_unchecked(
                SourcePosition::new(self.ptr),
                SourcePosition::new(self.end),
            )
        }
    }

    /// Return whether at end of source.
    #[inline]
    pub(super) fn is_eof(&self) -> bool {
        self.ptr == self.end
    }

    /// Get end address.
    #[inline]
    pub(super) fn end_addr(&self) -> usize {
        self.end as usize
    }

    /// Get last memory address at which a batch of
    /// `Lexer::search::SEARCH_BATCH_SIZE` bytes can be read without going
    /// out of bounds.
    #[inline]
    pub(super) fn end_for_batch_search_addr(&self) -> usize {
        self.end_for_batch_search_addr
    }

    /// Get current position.
    ///
    /// The `SourcePosition` returned is guaranteed to be within bounds of
    /// `&str` that `Source` was created from, and on a UTF-8 character
    /// boundary, so can be used by caller to later move current position of
    /// this `Source` using `Source::set_position`.
    ///
    /// `SourcePosition` lives as long as the source text `&str` that `Source`
    /// was created from.
    #[inline]
    pub(super) fn position(&self) -> SourcePosition<'a> {
        // SAFETY: Creating a `SourcePosition` from current position of `Source` is
        // always valid, if caller has upheld safety conditions of other unsafe
        // methods of this type.
        unsafe { SourcePosition::new(self.ptr) }
    }

    /// Move current position.
    #[inline]
    pub(super) fn set_position(&mut self, pos: SourcePosition) {
        // `SourcePosition` always upholds the invariants of `Source`, as long as it's
        // created from this `Source`. `SourcePosition`s can only be created
        // from a `Source`. `Source::new` takes a `UniquePromise`, which
        // guarantees that it's the only `Source` in existence on this thread.
        // `Source` is not `Sync` or `Send`, so no possibility another
        // `Source` originated on another thread can "jump" onto this one.
        // This is sufficient to guarantee that any `SourcePosition` that parser/lexer
        // holds must be from this `Source`.
        // This guarantee is what allows this function to be safe.

        // SAFETY: `SourcePosition::read`'s contract is upheld by:
        // * The preceding checks that `pos.ptr` >= `self.start` and < `self.end`.
        // * `Source`'s invariants guarantee that `self.start` - `self.end` contains
        //   allocated memory.
        // * `Source::new` takes an immutable ref `&str`, guaranteeing that the memory
        //   `pos.ptr` addresses cannot be aliased by a `&mut` ref as long as `Source`
        //   exists.
        // * `SourcePosition` can only live as long as the `&str` underlying `Source`.
        debug_assert!(
            pos.ptr >= self.start
                && pos.ptr <= self.end
                // SAFETY: See above
                && (pos.ptr == self.end || !is_utf8_cont_byte(unsafe { pos.read() }))
        );
        self.ptr = pos.ptr;
    }

    /// Advance `Source`'s cursor to end.
    #[inline]
    pub(super) fn advance_to_end(&mut self) {
        self.ptr = self.end;
    }

    /// Get string slice from a `SourcePosition` up to the current position of
    /// `Source`.
    pub(super) fn str_from_pos_to_current(&self, pos: SourcePosition) -> &'a str {
        assert!(pos.ptr <= self.ptr);
        // SAFETY: The above assertion satisfies `str_from_pos_to_current_unchecked`'s
        // requirements
        unsafe { self.str_from_pos_to_current_unchecked(pos) }
    }

    /// Get string slice from a `SourcePosition` up to current position of
    /// `Source`, without checks.
    ///
    /// # SAFETY
    /// `pos` must not be after current position of `Source`.
    /// This is always the case if both:
    /// 1. `Source::set_position` has not been called since `pos` was created.
    /// 2. `pos` has not been advanced with `SourcePosition::add`.
    #[inline]
    pub(super) unsafe fn str_from_pos_to_current_unchecked(&self, pos: SourcePosition) -> &'a str {
        // SAFETY: Caller guarantees `pos` is not after current position of `Source`.
        // `self.ptr` is always a valid `SourcePosition` due to invariants of `Source`.
        self.str_between_positions_unchecked(pos, SourcePosition::new(self.ptr))
    }

    /// Get string slice from current position of `Source` up to a
    /// `SourcePosition`, without checks.
    ///
    /// # SAFETY
    /// `pos` must not be before current position of `Source`.
    /// This is always the case if both:
    /// 1. `Source::set_position` has not been called since `pos` was created.
    /// 2. `pos` has not been moved backwards with `SourcePosition::sub`.
    #[inline]
    pub(super) unsafe fn str_from_current_to_pos_unchecked(&self, pos: SourcePosition) -> &'a str {
        // SAFETY: Caller guarantees `pos` is not before current position of `Source`.
        // `self.ptr` is always a valid `SourcePosition` due to invariants of `Source`.
        self.str_between_positions_unchecked(SourcePosition::new(self.ptr), pos)
    }

    /// Get string slice from a `SourcePosition` up to the end of `Source`.
    #[inline]
    pub(super) fn str_from_pos_to_end(&self, pos: SourcePosition) -> &'a str {
        // SAFETY: Invariants of `SourcePosition` is that it cannot be after end of
        // `Source`, and always on a UTF-8 character boundary.
        // `self.end` is always a valid `SourcePosition` due to invariants of `Source`.
        unsafe { self.str_between_positions_unchecked(pos, SourcePosition::new(self.end)) }
    }

    /// Get string slice of source between 2 `SourcePosition`s, without checks.
    ///
    /// # SAFETY
    /// `start` must not be after `end`.
    #[inline]
    pub(super) unsafe fn str_between_positions_unchecked(
        &self,
        start: SourcePosition,
        end: SourcePosition,
    ) -> &'a str {
        // Check `start` is not after `end`
        debug_assert!(start.ptr <= end.ptr);
        // Check `start` and `end` are within bounds of `Source`
        debug_assert!(start.ptr >= self.start);
        debug_assert!(end.ptr <= self.end);
        // Check `start` and `end` are on UTF-8 character boundaries.
        // SAFETY: Above assertions ensure `start` and `end` are valid to read from if
        // not at EOF.
        debug_assert!(start.ptr == self.end || !is_utf8_cont_byte(start.read()));
        debug_assert!(end.ptr == self.end || !is_utf8_cont_byte(end.read()));

        // SAFETY: Caller guarantees `start` is not after `end`.
        // `SourcePosition`s can only be created from a `Source`.
        // `Source::new` takes a `UniquePromise`, which guarantees that it's the only
        // `Source` in existence on this thread. `Source` is not `Sync` or
        // `Send`, so no possibility another `Source` originated on another
        // thread can "jump" onto this one. This is sufficient to guarantee that
        // any `SourcePosition` that parser/lexer holds must be
        // from this `Source`, therefore `start.ptr` and `end.ptr` must both be within
        // the same allocation, and derived from the same original pointer.
        // Invariants of `Source` and `SourcePosition` types guarantee that both are
        // positioned on UTF-8 character boundaries. So slicing source text
        // between these 2 points will always yield a valid UTF-8 string.
        let len = end.addr() - start.addr();
        let slice = slice::from_raw_parts(start.ptr, len);
        std::str::from_utf8_unchecked(slice)
    }

    /// Get current position in source, relative to start of source.
    #[allow(clippy::cast_possible_truncation)]
    #[inline]
    pub(super) fn offset(&self) -> BytePos {
        self.offset_of(self.position())
    }

    /// Get offset of `pos`.
    #[allow(clippy::cast_possible_truncation)]
    #[inline]
    pub(super) fn offset_of(&self, pos: SourcePosition) -> BytePos {
        // Cannot overflow `u32` because of `MAX_LEN` check in `Source::new`
        BytePos((pos.addr() - self.start as usize) as u32)
    }

    /// Move current position back by `n` bytes.
    ///
    /// # Panic
    /// Panics if:
    /// * `n` is 0.
    /// * `n` is greater than current offset in source.
    /// * Moving back `n` bytes would not place current position on a UTF-8
    ///   character boundary.
    #[inline]
    pub(super) fn back(&mut self, n: usize) {
        // This assertion is essential to ensure safety of `new_pos.read()` call below.
        // Without this check, calling `back(0)` on an empty `Source` would cause
        // reading out of bounds.
        // Compiler should remove this assertion when inlining this function,
        // as long as it can deduce from calling code that `n` is non-zero.
        assert!(n > 0, "Cannot call `Source::back` with 0");

        // Ensure not attempting to go back to before start of source
        let offset = self.ptr as usize - self.start as usize;
        assert!(
            n <= offset,
            "Cannot go back {n} bytes - only {offset} bytes consumed"
        );

        // SAFETY: We have checked that `n` is less than distance between `start` and
        // `ptr`, so `new_ptr` cannot be outside of allocation of original
        // `&str`
        let new_pos = unsafe { self.position().sub(n) };

        // Enforce invariant that `ptr` must be positioned on a UTF-8 character
        // boundary. SAFETY: `new_ptr` is in bounds of original `&str`, and `n >
        // 0` assertion ensures not at the end, so valid to read a byte.
        // `Source`'s invariants guarantee that `self.start` - `self.end` contains
        // allocated memory. `Source::new` takes an immutable ref `&str`,
        // guaranteeing that the memory `new_ptr` addresses cannot be aliased by
        // a `&mut` ref as long as `Source` exists.
        let byte = unsafe { new_pos.read() };
        assert!(
            !is_utf8_cont_byte(byte),
            "Offset is not on a UTF-8 character boundary"
        );

        // Move current position. The checks above satisfy `Source`'s invariants.
        self.ptr = new_pos.ptr;
    }

    /// Get next char of source, and advance position to after it.
    #[inline]
    pub(super) fn next_char(&mut self) -> Option<char> {
        // Check not at EOF and handle ASCII bytes
        let byte = self.peek_byte()?;
        if byte.is_ascii() {
            // SAFETY: We already exited if at EOF, so `ptr < end`.
            // So incrementing `ptr` cannot result in `ptr > end`.
            // Current byte is ASCII, so incremented `ptr` must be on a UTF-8 character
            // boundary.
            unsafe { self.ptr = self.ptr.add(1) };
            return Some(byte as char);
        }

        // Multi-byte Unicode character.
        // Check invariant that `ptr` is on a UTF-8 character boundary.
        debug_assert!(!is_utf8_cont_byte(byte));

        // Create a `Chars` iterator, get next char from it, and then update `self.ptr`
        // to match `Chars` iterator's updated pointer afterwards.
        // `Chars` iterator upholds same invariants as `Source`, so its pointer is
        // guaranteed to be valid as `self.ptr`.
        let mut chars = self.remaining().chars();
        // SAFETY: We know that there's a byte to be consumed, so `chars.next()` must
        // return `Some(_)`
        let c = unsafe { chars.next().unwrap_unchecked() };
        self.ptr = chars.as_str().as_ptr();
        Some(c)
    }

    /// Get next byte of source, and advance position to after it.
    ///
    /// # SAFETY
    /// This function may leave `Source` positioned in middle of a UTF-8
    /// character sequence, which would violate one of `Source`'s
    /// invariants.
    ///
    /// This is OK temporarily, but caller *must* ensure the invariant is
    /// restored again.
    ///
    /// Caller must ensure one of:
    ///
    /// 1. No byte is returned (end of file).
    /// 2. The byte returned is ASCII.
    /// 3. Further calls to `Source::next_byte` or `Source::next_byte_unchecked`
    ///    are made to consume the rest of the multi-byte UTF-8 character,
    ///    before calling any other methods of `Source` (even safe methods)
    ///    which rely on `Source` being positioned on a UTF-8 character
    ///    boundary, or before passing control back to other safe code which may
    ///    call them.
    ///
    /// In particular, safe methods `Source::next_char`, `Source::peek_char`,
    /// and `Source::remaining` are *not* safe to call until one of above
    /// conditions is satisfied.
    ///
    /// It will often be preferable to instead use `Source::peek_byte`, followed
    /// by `Source::next_char`, which are safe methods, and compiler will
    /// often reduce to equally efficient code, if calling code tests the
    /// byte returned. e.g.:
    ///
    /// ```
    /// // Consume a space
    /// let byte = source.peek_byte();
    /// if byte == Some(b' ') {
    ///   source.next_char().unwrap();
    /// }
    /// ```
    #[allow(dead_code)]
    #[inline]
    unsafe fn next_byte(&mut self) -> Option<u8> {
        if self.is_eof() {
            None
        } else {
            // SAFETY: Safe to read from `ptr` as we just checked it's not out of bounds
            Some(self.next_byte_unchecked())
        }
    }

    /// Get next bytes of source, and advance position to after it, without EOF
    /// bounds-check.
    ///
    /// # SAFETY
    /// Caller must ensure `Source` is not at end of file.
    ///
    /// This function may leave `Source` positioned in middle of a UTF-8
    /// character sequence, which would violate one of `Source`'s
    /// invariants.
    ///
    /// This is OK temporarily, but caller *must* ensure the invariant is
    /// restored again.
    ///
    /// Caller must ensure one of:
    ///
    /// 1. The byte returned is ASCII.
    /// 2. Further calls to `Source::next_byte` or `Source::next_byte_unchecked`
    ///    are made to consume the rest of the multi-byte UTF-8 character,
    ///    before calling any other methods of `Source` (even safe methods)
    ///    which rely on `Source` being positioned on a UTF-8 character
    ///    boundary, or before passing control back to other safe code which may
    ///    call them.
    ///
    /// In particular, safe methods `Source::next_char`, `Source::peek_char`,
    /// and `Source::remaining` are *not* safe to call until one of above
    /// conditions is satisfied.
    #[inline]
    pub(super) unsafe fn next_byte_unchecked(&mut self) -> u8 {
        // SAFETY: Caller guarantees not at end of file i.e. `ptr != end`.
        // Methods of this type provide no way for `ptr` to be before `start` or after
        // `end`. Therefore always valid to read a byte from `ptr`, and
        // incrementing `ptr` cannot result in `ptr > end`.
        let byte = self.peek_byte_unchecked();
        self.ptr = self.ptr.add(1);
        byte
    }

    /// Peek next char of source, without consuming it.
    #[inline]
    pub(super) fn peek_char(&self) -> Option<char> {
        // Check not at EOF and handle ASCII bytes
        let byte = self.peek_byte()?;
        if byte.is_ascii() {
            return Some(byte as char);
        }

        // Multi-byte Unicode character.
        // Check invariant that `ptr` is on a UTF-8 character boundary.
        debug_assert!(!is_utf8_cont_byte(byte));

        // Create a `Chars` iterator, and get next char from it
        let mut chars = self.remaining().chars();
        // SAFETY: We know that there's a byte to be consumed, so `chars.next()` must
        // return `Some(_)`. Could just return `chars.next()` here, but making
        // it clear to compiler that this branch always returns `Some(_)` may
        // help it optimize the caller. Compiler seems to have difficulty
        // "seeing into" `Chars` iterator and making deductions.
        let c = unsafe { chars.next().unwrap_unchecked() };
        Some(c)
    }

    /// Peek next next char of source, without consuming it.
    #[inline]
    pub(super) fn peek_char2(&self) -> Option<char> {
        // Handle EOF
        if self.is_eof() {
            return None;
        }

        // Check invariant that `ptr` is on a UTF-8 character boundary.
        debug_assert!(!is_utf8_cont_byte(self.peek_byte().unwrap()));

        let mut chars = self.remaining().chars();
        // SAFETY: We already checked not at EOF, so `chars.next()` must return
        // `Some(_)`
        unsafe { chars.next().unwrap_unchecked() };
        chars.next()
    }

    /// Peek next byte of source without consuming it.
    #[inline]
    pub(super) fn peek_byte(&self) -> Option<u8> {
        if self.is_eof() {
            None
        } else {
            // SAFETY: Safe to read from `ptr` as we just checked it's not out of bounds
            Some(unsafe { self.peek_byte_unchecked() })
        }
    }

    /// Peek next byte of source without consuming it, without EOF bounds-check.
    ///
    /// # SAFETY
    /// Caller must ensure `Source` is not at end of file.
    #[inline]
    pub(super) unsafe fn peek_byte_unchecked(&self) -> u8 {
        // SAFETY: Caller guarantees `ptr` is before `end` (i.e. not at end of file).
        // Methods of this type provide no way to allow `ptr` to be before `start`.
        // `Source`'s invariants guarantee that `self.start` - `self.end` contains
        // allocated memory. `Source::new` takes an immutable ref `&str`,
        // guaranteeing that the memory `self.ptr` addresses cannot be aliased
        // by a `&mut` ref as long as `Source` exists.
        debug_assert!(self.ptr >= self.start && self.ptr < self.end);
        self.position().read()
    }
}

/// Wrapper around a pointer to a position in `Source`.
///
/// # SAFETY
/// `SourcePosition` must always be on a UTF-8 character boundary,
/// and within bounds of the `Source` that created it.
#[derive(Debug, Clone, Copy)]
pub struct SourcePosition<'a> {
    ptr: *const u8,
    _marker: PhantomData<&'a u8>,
}

impl<'a> SourcePosition<'a> {
    /// Create a new `SourcePosition` from a pointer.
    ///
    /// # SAFETY
    /// * Pointer must obey all the same invariants as `Source::ptr`.
    /// * It must be created from a `Source`.
    /// * It must be in bounds of the source text `&str` the `Source` is created
    ///   from, or 1 byte after the end of the source text (i.e. positioned at
    ///   EOF).
    /// * It must be positioned on a UTF-8 character boundary (or EOF).
    #[inline]
    pub(super) unsafe fn new(ptr: *const u8) -> Self {
        Self {
            ptr,
            _marker: PhantomData,
        }
    }

    /// Get memory address of `SourcePosition` as a `usize`.
    #[inline]
    pub(super) fn addr(self) -> usize {
        self.ptr as usize
    }

    /// Create new `SourcePosition` which is `n` bytes after this one.
    /// The provenance of the pointer `SourcePosition` contains is maintained.
    ///
    /// # SAFETY
    /// Caller must ensure that advancing `SourcePosition` by `n` bytes does not
    /// make it past the end of `Source` this `SourcePosition` was created
    /// from. NB: It is legal to use `add` to create a `SourcePosition`
    /// which is *on* the end of `Source`, just not past it.
    #[inline]
    pub(super) unsafe fn add(self, n: usize) -> Self {
        Self::new(self.ptr.add(n))
    }

    /// Create new `SourcePosition` which is `n` bytes before this one.
    /// The provenance of the pointer `SourcePosition` contains is maintained.
    ///
    /// # SAFETY
    /// Caller must ensure that reversing `SourcePosition` by `n` bytes does not
    /// make it before the start of `Source` this `SourcePosition` was
    /// created from.
    #[inline]
    pub(super) unsafe fn sub(self, n: usize) -> Self {
        Self::new(self.ptr.sub(n))
    }

    /// Read byte from this `SourcePosition`.
    ///
    /// # SAFETY
    /// Caller must ensure `SourcePosition` is not at end of source text.
    ///
    /// # Implementation details
    ///
    /// Using `as_ref()` for reading is copied from `core::slice::iter::next`.
    /// https://doc.rust-lang.org/src/core/slice/iter.rs.html#132
    /// https://doc.rust-lang.org/src/core/slice/iter/macros.rs.html#156-168
    ///
    /// Using `ptr.as_ref().unwrap_unchecked()` instead of `*ptr` or
    /// `ptr.read()` produces a 7% speed-up on Lexer benchmarks.
    /// Presumably this is because it tells the compiler it can rely on the
    /// memory being immutable, because if a `&mut` reference existed, that
    /// would violate Rust's aliasing rules.
    #[inline]
    pub(super) unsafe fn read(self) -> u8 {
        // SAFETY:
        // Caller guarantees `self` is not at end of source text.
        // `Source` is created from a valid `&str`, so points to allocated, initialized
        // memory. `Source` conceptually holds the source text `&str`, which
        // guarantees no mutable references to the same memory can exist, as
        // that would violate Rust's aliasing rules. Pointer is
        // "dereferenceable" by definition as a `u8` is 1 byte and cannot span multiple
        // objects. Alignment is not relevant as `u8` is aligned on 1 (i.e. no
        // alignment requirements).
        debug_assert!(!self.ptr.is_null());
        *self.ptr.as_ref().unwrap_unchecked()
    }

    /// Read 2 bytes from this `SourcePosition`.
    ///
    /// # SAFETY
    /// Caller must ensure `SourcePosition` is no later than 2 bytes before end
    /// of source text. i.e. if source length is 10, `self` must be on
    /// position 8 max.
    #[inline]
    pub(super) unsafe fn read2(self) -> [u8; 2] {
        // SAFETY:
        // Caller guarantees `self` is not at no later than 2 bytes before end of source
        // text. `Source` is created from a valid `&str`, so points to
        // allocated, initialized memory. `Source` conceptually holds the source
        // text `&str`, which guarantees no mutable references to the same
        // memory can exist, as that would violate Rust's aliasing rules.
        // Pointer is "dereferenceable" by definition as a `u8` is 1 byte and cannot
        // span multiple objects. Alignment is not relevant as `u8` is aligned
        // on 1 (i.e. no alignment requirements).
        debug_assert!(!self.ptr.is_null());
        #[allow(clippy::ptr_as_ptr)]
        let p = self.ptr as *const [u8; 2];
        *p.as_ref().unwrap_unchecked()
    }
}

/// Return if byte is a UTF-8 continuation byte.
#[inline]
const fn is_utf8_cont_byte(byte: u8) -> bool {
    // 0x80 - 0xBF are continuation bytes i.e. not 1st byte of a UTF-8 character
    // sequence
    byte >= 0x80 && byte < 0xc0
}
