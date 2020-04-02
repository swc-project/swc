// Spans are encoded using 1-bit tag and 2 different encoding formats (one for
// each tag value). One format is used for keeping span data inline,
// another contains index into an out-of-line span interner.
// The encoding format for inline spans were obtained by optimizing over crates
// in rustc/libstd. See https://internals.rust-lang.org/t/rfc-compiler-refactoring-spans/1357/28

use crate::{hygiene::SyntaxContext, BytePos, SpanData, GLOBALS};
use serde::{
    de::Deserializer,
    ser::{SerializeStruct, Serializer},
    Deserialize, Serialize,
};
use std::collections::HashMap;
/// A compressed span.
///
/// `SpanData` is 12 bytes, which is a bit too big to stick everywhere. `Span`
/// is a form that only takes up 8 bytes, with less space for the length and
/// context. The vast majority (99.9%+) of `SpanData` instances will fit within
/// those 8 bytes; any `SpanData` whose fields don't fit into a `Span` are
/// stored in a separate interner table, and the `Span` will index into that
/// table. Interning is rare enough that the cost is low, but common enough
/// that the code is exercised regularly.
///
/// An earlier version of this code used only 4 bytes for `Span`, but that was
/// slower because only 80--90% of spans could be stored inline (even less in
/// very large crates) and so the interner was used a lot more.
///
/// Inline (compressed) format:
/// - `span.base_or_index == span_data.lo`
/// - `span.len_or_tag == len == span_data.hi - span_data.lo` (must be `<=
///   MAX_LEN`)
/// - `span.ctxt == span_data.ctxt` (must be `<= MAX_CTXT`)
///
/// Interned format:
/// - `span.base_or_index == index` (indexes into the interner table)
/// - `span.len_or_tag == LEN_TAG` (high bit set, all other bits are zero)
/// - `span.ctxt == 0`
///
/// The inline form uses 0 for the tag value (rather than 1) so that we don't
/// need to mask out the tag bit when getting the length, and so that the
/// dummy span can be all zeroes.
///
/// Notes about the choice of field sizes:
/// - `base` is 32 bits in both `Span` and `SpanData`, which means that `base`
///   values never cause interning. The number of bits needed for `base` depends
///   on the crate size. 32 bits allows up to 4 GiB of code in a crate.
///   `script-servo` is the largest crate in `rustc-perf`, requiring 26 bits for
///   some spans.
/// - `len` is 15 bits in `Span` (a u16, minus 1 bit for the tag) and 32 bits in
///   `SpanData`, which means that large `len` values will cause interning. The
///   number of bits needed for `len` does not depend on the crate size. The
///   most common number of bits for `len` are 0--7, with a peak usually at 3 or
///   4, and then it drops off quickly from 8 onwards. 15 bits is enough for
///   99.99%+ of cases, but larger values (sometimes 20+ bits) might occur
///   dozens of times in a typical crate.
/// - `ctxt` is 16 bits in `Span` and 32 bits in `SpanData`, which means that
///   large `ctxt` values will cause interning. The number of bits needed for
///   `ctxt` values depend partly on the crate size and partly on the form of
///   the code. No crates in `rustc-perf` need more than 15 bits for `ctxt`, but
///   larger crates might need more than 16 bits.
#[derive(Clone, Copy, Eq, PartialEq, Hash)]
pub struct Span {
    base_or_index: u32,
    len_or_tag: u16,
    ctxt_or_zero: u16,
}

const LEN_TAG: u16 = 0b1000_0000_0000_0000;
const MAX_LEN: u32 = 0b0111_1111_1111_1111;
const MAX_CTXT: u32 = 0b1111_1111_1111_1111;

/// Dummy span, both position and length are zero, syntax context is zero as
/// well.
pub const DUMMY_SP: Span = Span {
    base_or_index: 0,
    len_or_tag: 0,
    ctxt_or_zero: 0,
};

impl Span {
    #[inline]
    pub fn new(mut lo: BytePos, mut hi: BytePos, ctxt: SyntaxContext) -> Self {
        if lo > hi {
            std::mem::swap(&mut lo, &mut hi);
        }

        let (base, len, ctxt2) = (lo.0, hi.0 - lo.0, ctxt.as_u32());

        if len <= MAX_LEN && ctxt2 <= MAX_CTXT {
            // Inline format.
            Span {
                base_or_index: base,
                len_or_tag: len as u16,
                ctxt_or_zero: ctxt2 as u16,
            }
        } else {
            // Interned format.
            let index = with_span_interner(|interner| interner.intern(&SpanData { lo, hi, ctxt }));
            Span {
                base_or_index: index,
                len_or_tag: LEN_TAG,
                ctxt_or_zero: 0,
            }
        }
    }

    #[inline]
    pub fn data(self) -> SpanData {
        if self.len_or_tag != LEN_TAG {
            // Inline format.
            debug_assert!(self.len_or_tag as u32 <= MAX_LEN);
            SpanData {
                lo: BytePos(self.base_or_index),
                hi: BytePos(self.base_or_index + self.len_or_tag as u32),
                ctxt: SyntaxContext::from_u32(self.ctxt_or_zero as u32),
            }
        } else {
            // Interned format.
            debug_assert!(self.ctxt_or_zero == 0);
            let index = self.base_or_index;
            with_span_interner(|interner| *interner.get(index))
        }
    }
}

#[derive(Default)]
pub struct SpanInterner {
    spans: HashMap<SpanData, u32>,
    span_data: Vec<SpanData>,
}

impl SpanInterner {
    fn intern(&mut self, span_data: &SpanData) -> u32 {
        if let Some(index) = self.spans.get(span_data) {
            return *index;
        }

        let index = self.spans.len() as u32;
        self.span_data.push(*span_data);
        self.spans.insert(*span_data, index);
        index
    }

    #[inline]
    fn get(&self, index: u32) -> &SpanData {
        &self.span_data[index as usize]
    }
}

// If an interner exists, return it. Otherwise, prepare a fresh one.
#[inline]
fn with_span_interner<T, F: FnOnce(&mut SpanInterner) -> T>(f: F) -> T {
    GLOBALS.with(|globals| f(&mut *globals.span_interner.lock()))
}

#[derive(Serialize)]
struct Loc {
    pub start: LineCol,
    pub end: LineCol,
}

#[derive(Serialize)]
struct LineCol {
    pub line: usize,
    pub column: usize,
}

impl Serialize for Span {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let data = self.data();
        let mut s = serializer.serialize_struct("Span", 3)?;
        s.serialize_field("start", &data.lo)?;
        s.serialize_field("end", &data.hi)?;
        s.serialize_field("ctxt", &data.ctxt)?;

        //        CM.with(|cm| {
        //            macro_rules! ser {
        //                ($bp:expr) => {{
        //                    if $bp == BytePos(0) {
        //                        LineCol { line: 0, column: 0 }
        //                    } else {
        //                        let loc = cm.lookup_char_pos($bp);
        //
        //                        LineCol {
        //                            line: loc.line,
        //                            column: loc.col_display,
        //                        }
        //                    }
        //                }};
        //            }
        //
        //            s.serialize_field(
        //                "loc",
        //                &Loc {
        //                    start: ser!(data.lo),
        //                    end: ser!(data.hi),
        //                },
        //            )
        //        })?;

        s.end()
    }
}
impl<'de> Deserialize<'de> for Span {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let data = SpanData::deserialize(deserializer)?;
        Ok(Span::new(data.lo, data.hi, data.ctxt))
    }
}
