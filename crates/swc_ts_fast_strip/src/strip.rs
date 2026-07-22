use std::ops::Range;

use swc_common::{BytePos, Span};

/// Edits produced while visiting the TypeScript AST.
///
/// Parser positions remain UTF-8 byte positions. The renderer is solely
/// responsible for translating them to the output coordinate system.
#[derive(Default)]
pub(crate) struct StripEditPlan {
    erasures: Vec<Span>,
    overwrites: Vec<Overwrite>,
}

#[derive(Clone, Copy)]
struct Overwrite {
    pos: BytePos,
    value: char,
}

impl StripEditPlan {
    pub(crate) fn erase(&mut self, span: Span) {
        self.erasures.push(span);
    }

    /// Replaces the source scalar at `pos` while preserving its UTF-16 width.
    pub(crate) fn overwrite(&mut self, pos: BytePos, value: char) {
        assert!(value.is_ascii(), "strip overwrites must be ASCII");
        self.overwrites.push(Overwrite { pos, value });
    }

    pub(crate) fn is_empty(&self) -> bool {
        self.erasures.is_empty() && self.overwrites.is_empty()
    }

    /// Applies all edits while preserving the source UTF-16 length.
    pub(crate) fn render(self, source_start: BytePos, source: &str) -> String {
        if self.is_empty() {
            return source.to_owned();
        }

        let plan = LocalEditPlan::new(self, source_start, source);
        if let Some(output) = plan.render_ascii_edits(source) {
            return output;
        }

        plan.render_unicode_edits(source)
    }
}

struct LocalEditPlan {
    erasures: Vec<Range<usize>>,
    overwrites: Vec<LocalOverwrite>,
}

#[derive(Clone, Copy)]
struct LocalOverwrite {
    byte_offset: usize,
    value: char,
}

impl LocalEditPlan {
    fn new(plan: StripEditPlan, source_start: BytePos, source: &str) -> Self {
        let source_len = source.len();
        let mut erasures: Vec<Range<usize>> = plan
            .erasures
            .into_iter()
            .map(|span| {
                let start = local_offset(span.lo, source_start, source_len);
                let end = local_offset(span.hi, source_start, source_len);
                assert!(start <= end, "invalid strip erasure range");
                start..end
            })
            .collect();
        erasures.sort_unstable_by_key(|range| range.start);
        let mut merged_erasures: Vec<Range<usize>> = Vec::with_capacity(erasures.len());
        for range in erasures {
            assert!(
                source.is_char_boundary(range.start) && source.is_char_boundary(range.end),
                "strip erasure is not on a UTF-8 character boundary"
            );
            if let Some(previous) = merged_erasures.last_mut() {
                if range.start <= previous.end {
                    previous.end = previous.end.max(range.end);
                    continue;
                }
            }
            merged_erasures.push(range);
        }

        let mut overwrites: Vec<LocalOverwrite> = plan
            .overwrites
            .into_iter()
            .map(|overwrite| LocalOverwrite {
                byte_offset: local_offset(overwrite.pos, source_start, source_len),
                value: overwrite.value,
            })
            .collect();
        // Stable sorting keeps the previous renderer's last-write-wins
        // behavior if the planner emits the same position more than once.
        overwrites.sort_by_key(|overwrite| overwrite.byte_offset);
        let mut deduplicated_overwrites: Vec<LocalOverwrite> = Vec::with_capacity(overwrites.len());
        for overwrite in overwrites {
            assert!(
                overwrite.byte_offset < source_len
                    && source.is_char_boundary(overwrite.byte_offset),
                "strip overwrite is not on a source character"
            );
            if let Some(previous) = deduplicated_overwrites.last_mut() {
                if previous.byte_offset == overwrite.byte_offset {
                    *previous = overwrite;
                    continue;
                }
            }
            deduplicated_overwrites.push(overwrite);
        }

        Self {
            erasures: merged_erasures,
            overwrites: deduplicated_overwrites,
        }
    }

    /// Uses byte offsets only when every edited source scalar is ASCII.
    fn render_ascii_edits(&self, source: &str) -> Option<String> {
        let source = source.as_bytes();
        let mut output = source.to_vec();

        for range in &self.erasures {
            for (source, output) in source[range.clone()].iter().zip(&mut output[range.clone()]) {
                if !source.is_ascii() {
                    return None;
                }
                if !is_preserved_ascii_whitespace(*source) {
                    *output = b' ';
                }
            }
        }

        for overwrite in &self.overwrites {
            if !source[overwrite.byte_offset].is_ascii() {
                return None;
            }
            output[overwrite.byte_offset] = overwrite.value as u8;
        }

        // SAFETY: `source` was valid UTF-8. Every modified source byte was
        // checked to be ASCII and every replacement is ASCII, so the edits
        // cannot change any multi-byte UTF-8 sequence.
        Some(unsafe { String::from_utf8_unchecked(output) })
    }

    /// Renders Unicode edits directly to UTF-8 while preserving each source
    /// scalar's UTF-16 width.
    ///
    /// Unedited segments are copied as whole UTF-8 slices. Only erased source
    /// segments and overwritten scalars need Unicode decoding.
    fn render_unicode_edits(&self, source: &str) -> String {
        let mut output = String::with_capacity(source.len());
        let mut source_offset = 0;
        let mut overwrite_index = 0;

        for erasure in &self.erasures {
            while overwrite_index < self.overwrites.len()
                && self.overwrites[overwrite_index].byte_offset < erasure.start
            {
                let overwrite = self.overwrites[overwrite_index];
                output.push_str(&source[source_offset..overwrite.byte_offset]);
                source_offset = render_overwrite(&mut output, source, overwrite);
                overwrite_index += 1;
            }

            output.push_str(&source[source_offset..erasure.start]);
            source_offset = erasure.start;

            while overwrite_index < self.overwrites.len()
                && self.overwrites[overwrite_index].byte_offset < erasure.end
            {
                let overwrite = self.overwrites[overwrite_index];
                render_erasure(&mut output, &source[source_offset..overwrite.byte_offset]);
                source_offset = render_overwrite(&mut output, source, overwrite);
                overwrite_index += 1;
            }

            render_erasure(&mut output, &source[source_offset..erasure.end]);
            source_offset = erasure.end;
        }

        for &overwrite in &self.overwrites[overwrite_index..] {
            output.push_str(&source[source_offset..overwrite.byte_offset]);
            source_offset = render_overwrite(&mut output, source, overwrite);
        }
        output.push_str(&source[source_offset..]);

        output
    }
}

fn local_offset(pos: BytePos, source_start: BytePos, source_len: usize) -> usize {
    let offset = pos
        .0
        .checked_sub(source_start.0)
        .expect("strip edit precedes its source file") as usize;
    assert!(offset <= source_len, "strip edit exceeds its source file");
    offset
}

fn push_spaces(output: &mut String, count: usize) {
    for _ in 0..count {
        output.push(' ');
    }
}

fn render_erasure(output: &mut String, source: &str) {
    for c in source.chars() {
        if is_preserved_whitespace(c) {
            output.push(c);
        } else {
            push_spaces(output, c.len_utf16());
        }
    }
}

fn render_overwrite(output: &mut String, source: &str, overwrite: LocalOverwrite) -> usize {
    let original = source[overwrite.byte_offset..]
        .chars()
        .next()
        .expect("strip overwrite points to the end of the source");

    output.push(overwrite.value);
    push_spaces(output, original.len_utf16() - 1);

    overwrite.byte_offset + original.len_utf8()
}

fn is_preserved_whitespace(c: char) -> bool {
    matches!(
        c,
        // ECMAScript whitespace.
        '\u{0009}'
            | '\u{000B}'
            | '\u{000C}'
            | '\u{FEFF}'
            | '\u{0020}'
            | '\u{00A0}'
            | '\u{1680}'
            | '\u{2000}'
            | '\u{2001}'
            | '\u{2002}'
            | '\u{2003}'
            | '\u{2004}'
            | '\u{2005}'
            | '\u{2006}'
            | '\u{2007}'
            | '\u{2008}'
            | '\u{2009}'
            | '\u{200A}'
            | '\u{202F}'
            | '\u{205F}'
            | '\u{3000}'
            // ECMAScript line terminators.
            | '\u{000A}'
            | '\u{000D}'
            | '\u{2028}'
            | '\u{2029}'
    )
}

fn is_preserved_ascii_whitespace(byte: u8) -> bool {
    matches!(byte, b'\t' | 0x0b | 0x0c | b' ' | b'\n' | b'\r')
}
