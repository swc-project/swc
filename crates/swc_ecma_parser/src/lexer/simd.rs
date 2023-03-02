//! Lexer methods using portable-SIMD
//! See:
//!   * <https://github.com/rust-lang/portable-simd/blob/master/beginners-guide.md>
//!   * <https://rapidjson.org/md_doc_internals.html#SkipwhitespaceWithSIMD>
//!   * <https://lemire.me/blog/2017/01/20/how-quickly-can-you-remove-spaces-from-a-string>

use std::simd::{Simd, SimdPartialEq, ToBitMask};

const ELEMENTS: usize = 16;
type SimdVec = Simd<u8, ELEMENTS>;

#[derive(Debug)]
pub struct SkipWhitespace {
    /// Total offset
    pub offset: usize,

    /// Found multiline comment end '*/'?
    pub found: bool,

    /// Found newline inside the comment?
    pub newline: bool,

    lf: SimdVec,
    cr: SimdVec,
    space: SimdVec,
    tab: SimdVec,
}

impl SkipWhitespace {
    pub fn new(newline: bool) -> Self {
        Self {
            offset: 0,
            found: false,
            newline,
            lf: SimdVec::splat(b'\n'),
            cr: SimdVec::splat(b'\r'),
            space: SimdVec::splat(b' '),
            tab: SimdVec::splat(b'\t'),
        }
    }

    pub fn simd(mut self, bytes: &[u8]) -> Self {
        let (chunks, remainder) = bytes.as_chunks::<ELEMENTS>();

        for chunk in chunks {
            self.check_chunk(chunk);
            if self.found {
                return self;
            }
        }

        if !remainder.is_empty() {
            // Align the last chunk for avoiding the use of a scalar version
            let mut chunk = [0; ELEMENTS];
            let len = remainder.len();
            chunk[..len].copy_from_slice(remainder);
            self.check_chunk(&chunk);
        }

        self
    }

    fn check_chunk(&mut self, chunk: &[u8]) {
        let s = SimdVec::from_slice(chunk);

        let any_newline = s.simd_eq(self.lf) | s.simd_eq(self.cr);
        let any_white = s.simd_eq(self.space) | s.simd_eq(self.tab) | any_newline;

        let advance_by = (!any_white.to_bitmask()).trailing_zeros();

        // If the advanced offset contains a newline
        if !self.newline
            && advance_by > 0
            && any_newline.to_bitmask() & (1u16.checked_shl(advance_by).map_or(u16::MAX, |c| c - 1))
                > 0
        {
            self.newline = true;
        }

        if (advance_by as usize) < ELEMENTS {
            self.found = true;
        }

        self.offset += advance_by as usize;
    }
}
