//! Selection of the source text that a snippet shows.
//!
//! `miette`'s `GraphicalReportHandler` pads the underline of a single-line
//! label with `format!("{:width$}", ..)`, where `width` is the number of
//! columns between the label and the end of the previous label on the same
//! line (or the start of the line). Since Rust 1.87, a runtime width above
//! `u16::MAX` panics with `Formatting argument out of range`, and the panic
//! aborts the process when the binary uses `panic = "abort"` (for example the
//! Node.js bindings). See <https://github.com/swc-project/swc/issues/12828>.
//!
//! No other part of a snippet uses a runtime width: the text of a line and the
//! underline of a label are written character by character. So this module
//! selects the snippet so that miette never pads a label by more than
//! `u16::MAX` columns:
//!
//! - When the first or the last line of the span is wider than
//!   [MAX_LINE_WIDTH], the part of that line outside the span is cropped to
//!   about [CROPPED_CONTEXT_WIDTH] columns, and the context lines on that side
//!   are not shown (a snippet is one contiguous range of the source).
//! - A context line that is wider than [MAX_LINE_WIDTH] is cropped to about
//!   [CROPPED_CONTEXT_WIDTH] columns next to the span, and the context lines
//!   farther from the span are not shown.
//! - A line of the span that is still wider than [MAX_LINE_WIDTH] is shown if
//!   the labels of the diagnostic are known and miette pads no label on it by
//!   more than `u16::MAX` columns. Otherwise, no snippet is returned. miette
//!   then renders the labels in separate snippets when it tried to merge them,
//!   or prints a short "Failed to read contents for label" note.
//!
//! Columns are measured as miette 7 measures them with its default settings:
//! the width of `unicode-width` 0.1, tab stops every [TAB_WIDTH] columns, and
//! no width for ANSI escape sequences. The forked renderers in the bindings
//! measure some characters differently, so they pad without a runtime width.

use unicode_width::UnicodeWidthChar;

/// The width of the widest line that miette renders without a padding above
/// `u16::MAX`, whatever its labels are.
///
/// miette renders a label that extends past the end of a line one column past
/// the end of the line, so the widest padding on such a line is
/// `MAX_LINE_WIDTH + 1`.
pub(crate) const MAX_LINE_WIDTH: usize = u16::MAX as usize - 1;

/// The width of the text that is kept before and after the span when a line
/// of the span is cropped.
pub(crate) const CROPPED_CONTEXT_WIDTH: usize = 128;

/// The tab width of miette's `GraphicalReportHandler` by default.
pub(crate) const TAB_WIDTH: usize = 4;

/// Returns the column after each character of `text`, when `text` starts a
/// line, as miette's `line_visual_char_width` computes it.
fn columns(text: &str) -> impl Iterator<Item = usize> + '_ {
    let mut column = 0;
    let mut escaped = false;
    text.chars().map(move |c| {
        match (escaped, c) {
            (false, '\t') => column += TAB_WIDTH - column % TAB_WIDTH,
            // The start of an ANSI escape sequence.
            (false, '\x1b') => escaped = true,
            (false, c) => column += c.width().unwrap_or(0),
            // The end of an ANSI escape sequence.
            (true, 'm') => escaped = false,
            (true, _) => {}
        }
        column
    })
}

/// Returns the width of `text` when it starts a line.
fn visual_width(text: &str) -> usize {
    columns(text).last().unwrap_or(0)
}

/// Returns `true` if `line` is wider than [MAX_LINE_WIDTH].
///
/// This stops at the first character past the limit. A long line of
/// zero-width characters is read to its end.
fn is_too_wide(line: &str) -> bool {
    // A character is at most `TAB_WIDTH` columns wide per byte of its UTF-8
    // encoding, so a short line needs no scan.
    if line.len() <= MAX_LINE_WIDTH / TAB_WIDTH {
        return false;
    }

    columns(line).any(|column| column > MAX_LINE_WIDTH)
}

/// Returns the smallest index `i` in `line_start..=pos` such that
/// `src[i..pos]` is at most about [CROPPED_CONTEXT_WIDTH] columns wide. `i` is
/// a character boundary.
///
/// A tab is counted as [TAB_WIDTH] columns here, because its width depends on
/// the text before it.
fn crop_start(src: &str, line_start: usize, pos: usize) -> usize {
    let mut width = 0;
    let mut start = pos;
    for (i, c) in src[line_start..pos].char_indices().rev() {
        width += if c == '\t' {
            TAB_WIDTH
        } else {
            c.width().unwrap_or(0)
        };
        if width > CROPPED_CONTEXT_WIDTH {
            break;
        }
        start = line_start + i;
    }
    start
}

/// Returns the largest index `i` in `pos..=line_end` such that `src[pos..i]`
/// is at most about [CROPPED_CONTEXT_WIDTH] columns wide. `i` is a character
/// boundary.
fn crop_end(src: &str, pos: usize, line_end: usize) -> usize {
    let mut end = pos;
    for ((i, c), width) in src[pos..line_end]
        .char_indices()
        .zip(columns(&src[pos..line_end]))
    {
        if width > CROPPED_CONTEXT_WIDTH {
            break;
        }
        end = pos + i + c.len_utf8();
    }
    end
}

/// Returns the index of the first byte of the line that contains `pos`.
#[inline]
fn line_start(src: &str, pos: usize) -> usize {
    src[..pos].rfind('\n').map_or(0, |i| i + 1)
}

/// Returns the index of the `\n` that ends the line that contains `pos`, or
/// `src.len()` for the last line.
#[inline]
fn line_end(src: &str, pos: usize) -> usize {
    src[pos..].find('\n').map_or(src.len(), |i| pos + i)
}

/// The labels of a diagnostic, computed when they are first needed.
///
/// Most snippets have no line that is too wide, so they never need the
/// labels.
struct LazyLabels<F> {
    init: Option<F>,
    ranges: Option<Option<Vec<(usize, usize)>>>,
}

impl<F> LazyLabels<F>
where
    F: FnOnce() -> Option<Vec<(usize, usize)>>,
{
    /// Returns the byte ranges of the labels, sorted by their start, or `None`
    /// if the labels are not known.
    fn get(&mut self) -> Option<&[(usize, usize)]> {
        let init = &mut self.init;
        self.ranges
            .get_or_insert_with(|| {
                let mut ranges = init.take().and_then(|init| init())?;
                // miette sorts the labels by their start only.
                ranges.sort_unstable_by_key(|&(lo, _)| lo);
                Some(ranges)
            })
            .as_deref()
    }
}

/// Returns `true` if miette pads no single-line label on the line
/// `src[start..end]` of a snippet by more than `u16::MAX` columns.
///
/// `has_newline` is `true` if the snippet includes the `\n` after the line.
/// `labels` are the byte ranges of all labels of the diagnostic, sorted by
/// their start.
///
/// This follows `get_lines`, `render_context`, `visual_offset`, and
/// `render_single_line_highlights` of miette 7:
///
/// - The line includes the `\n` (and a `\r` before it) when the snippet goes on
///   after it, but its text does not.
/// - A label is a single-line label of the line if it starts before the end of
///   the line and ends at or before it.
/// - A position past the end of the text is one column past the end of the
///   text.
/// - The labels are drawn in the order of their start. Each label is padded
///   from the end of the farthest label before it, or from the start of the
///   line, and ends at least one column after its start.
fn paddings_fit(
    src: &str,
    start: usize,
    end: usize,
    has_newline: bool,
    labels: &[(usize, usize)],
) -> bool {
    let line_limit = if has_newline { end + 1 } else { end };
    let text_end = if has_newline && src[..end].ends_with('\r') {
        end - 1
    } else {
        end
    };

    let column = |pos: usize| {
        if pos > text_end {
            visual_width(&src[start..text_end]) + 1
        } else {
            visual_width(&src[start..pos])
        }
    };

    let mut highest = 0;
    for &(lo, hi) in labels {
        if lo >= line_limit {
            break;
        }
        if lo < start || hi > line_limit {
            continue;
        }

        let label_start = column(lo).max(highest);
        if label_start - highest > u16::MAX as usize {
            return false;
        }
        let label_end = if lo == hi {
            label_start + 1
        } else {
            column(hi).max(label_start + 1)
        };
        highest = highest.max(label_end);
    }
    true
}

/// Returns the byte range of `src` that the snippet of `src[lo..hi]` shows.
///
/// The range starts at the start of a line and ends at the end of a line
/// (without the `\n`, unless the line is a wide last line of the span), with up
/// to
/// `context_lines_before` and `context_lines_after` more lines, unless a line
/// is cropped as the [module documentation](self) describes. Returns `None` if
/// a line of the span itself cannot be shown.
///
/// `labels` returns the byte ranges of all labels of the diagnostic, relative
/// to `src`, or `None` if they are not known. It is called only if a line of
/// the span is too wide.
///
/// `lo` and `hi` must be character boundaries of `src`, and `lo <= hi`.
pub(crate) fn snippet_window(
    src: &str,
    lo: usize,
    hi: usize,
    context_lines_before: usize,
    context_lines_after: usize,
    labels: impl FnOnce() -> Option<Vec<(usize, usize)>>,
) -> Option<(usize, usize)> {
    let first_line_start = line_start(src, lo);
    let last_line_end = line_end(src, hi);

    let mut start = first_line_start;
    let mut end = last_line_end;

    let (first_line_end, last_line_start) = match src[lo..hi].find('\n') {
        None => (last_line_end, first_line_start),
        // `hi > lo + i`, so `src[..hi]` contains a `\n`.
        Some(i) => (lo + i, line_start(src, hi)),
    };

    // Crop the parts of the first and the last line outside the span.
    if is_too_wide(&src[first_line_start..first_line_end]) {
        start = crop_start(src, first_line_start, lo);
    }
    if is_too_wide(&src[last_line_start..last_line_end]) {
        end = crop_end(src, hi, last_line_end);
    }

    // Context lines can be shown only next to an uncropped line. A context
    // line that is too wide is cropped next to the span, so its labels never
    // need a padding above `CROPPED_CONTEXT_WIDTH + 1` columns.
    if start == first_line_start {
        for _ in 0..context_lines_before {
            if start == 0 {
                break;
            }
            // `src[start - 1]` is the `\n` that ends the previous line.
            let prev_start = line_start(src, start - 1);
            if is_too_wide(&src[prev_start..start - 1]) {
                start = crop_start(src, prev_start, start - 1);
                break;
            }
            start = prev_start;
        }
    }
    if end == last_line_end {
        for _ in 0..context_lines_after {
            if end == src.len() {
                break;
            }
            // `src[end]` is the `\n` that ends the current line.
            let next_end = line_end(src, end + 1);
            if is_too_wide(&src[end + 1..next_end]) {
                end = crop_end(src, end + 1, next_end);
                break;
            }
            end = next_end;
        }
    }

    // Keep the `\n` after a wide last line of the span even without context
    // after it. miette reads the primary label again without context to find
    // the location for the header, and fails the whole report if that read
    // fails, so both reads must see the same labels on this line.
    if end == last_line_end && end < src.len() && is_too_wide(&src[start.max(last_line_start)..end])
    {
        end += 1;
    }

    // Check the lines of the span, which can still be too wide because the
    // span covers a wide part of them.
    let mut labels = LazyLabels {
        init: Some(labels),
        ranges: None,
    };
    let mut line = start.max(first_line_start);
    let span_end = end.min(last_line_end);
    loop {
        let text_end = line_end(src, line).min(end);
        if is_too_wide(&src[line..text_end]) {
            let fits = labels
                .get()
                .is_some_and(|labels| paddings_fit(src, line, text_end, text_end < end, labels));
            if !fits {
                return None;
            }
        }

        if text_end >= span_end {
            break;
        }
        line = text_end + 1;
    }

    Some((start, end))
}
