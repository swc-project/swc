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
//! makes sure that every such padding in a snippet is at most
//! [MAX_LINE_WIDTH] columns wide:
//!
//! - When the first or the last line of the span is wider than
//!   [MAX_LINE_WIDTH], the part of that line outside the span is cropped to
//!   [CROPPED_CONTEXT_WIDTH] columns, and the context lines on that side are
//!   not shown (a snippet is one contiguous range of the source).
//! - A context line that is too wide is not shown, together with the context
//!   lines farther from the span.
//! - A line that is still too wide (because the span itself covers a wide part
//!   of it) is shown only if the labels of the diagnostic are known and no
//!   padding before a label on that line is too wide. Otherwise, no snippet is
//!   returned. miette then renders the labels in separate snippets when it
//!   tried to merge them, or prints a short "Failed to read contents for label"
//!   note.
//!
//! Known limitation: widths are estimated with a tab width of at most
//! [MAX_TAB_WIDTH] columns. A handler that is configured with a larger tab
//! width can still pad more than `u16::MAX` columns.

/// The largest estimated width of a padding in a snippet, and of a line that
/// is shown without a check of its labels.
///
/// miette renders a label that extends past the end of a line one column past
/// the end of the line, so the widest padding is `MAX_LINE_WIDTH + 1`, which
/// must not be above `u16::MAX`.
pub(crate) const MAX_LINE_WIDTH: usize = u16::MAX as usize - 1;

/// The width of the text that is kept before and after the span when a line
/// of the span is cropped.
pub(crate) const CROPPED_CONTEXT_WIDTH: usize = 128;

/// The largest tab width that the width estimate supports. miette uses 4 by
/// default.
pub(crate) const MAX_TAB_WIDTH: usize = 8;

/// Returns an upper bound of the number of columns that a renderer uses for
/// `c`.
///
/// miette 7 uses the width of `unicode-width` 0.1, and the forked renderers in
/// the TypeScript bindings use the width of `unicode-width` 0.2, so this
/// returns the larger one. A tab moves to the next tab stop, which is at most
/// [MAX_TAB_WIDTH] columns away.
#[inline]
fn char_width(c: char) -> usize {
    if c == '\t' {
        return MAX_TAB_WIDTH;
    }
    if c.is_ascii() {
        return 1;
    }

    let miette = unicode_width_miette::UnicodeWidthChar::width(c).unwrap_or(0);
    let workspace = unicode_width::UnicodeWidthChar::width(c).unwrap_or(0);
    miette.max(workspace)
}

/// Returns `true` if the estimated width of `text` is above
/// [MAX_LINE_WIDTH].
///
/// This stops at the first character past the limit, so its cost is bounded
/// by the limit and not by the length of the text.
fn is_too_wide(text: &str) -> bool {
    // A character is never wider than `MAX_TAB_WIDTH` columns per byte of its
    // UTF-8 encoding, so short text needs no scan.
    if text.len() <= MAX_LINE_WIDTH / MAX_TAB_WIDTH {
        return false;
    }

    let mut width = 0;
    for c in text.chars() {
        width += char_width(c);
        if width > MAX_LINE_WIDTH {
            return true;
        }
    }
    false
}

/// Returns the smallest index `i` in `line_start..=pos` such that
/// `src[i..pos]` is at most `max_width` columns wide. `i` is a character
/// boundary.
fn crop_start(src: &str, line_start: usize, pos: usize, max_width: usize) -> usize {
    let mut width = 0;
    let mut start = pos;
    for (i, c) in src[line_start..pos].char_indices().rev() {
        width += char_width(c);
        if width > max_width {
            break;
        }
        start = line_start + i;
    }
    start
}

/// Returns the largest index `i` in `pos..=line_end` such that `src[pos..i]`
/// is at most `max_width` columns wide. `i` is a character boundary.
fn crop_end(src: &str, pos: usize, line_end: usize, max_width: usize) -> usize {
    let mut width = 0;
    let mut end = pos;
    for (i, c) in src[pos..line_end].char_indices() {
        width += char_width(c);
        if width > max_width {
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
                ranges.sort_unstable();
                Some(ranges)
            })
            .as_deref()
    }
}

/// Returns `true` if no padding before a single-line label on the line
/// `src[start..end]` of a snippet is wider than [MAX_LINE_WIDTH].
///
/// `is_last` is `true` for the last line of the span. The snippet includes the
/// `\n` after every other line of the span. `labels` are the byte ranges of all
/// labels of the diagnostic, sorted by their start.
///
/// This follows `render_context` and `render_single_line_highlights` of
/// miette 7. miette includes the `\n` in a line when the snippet goes on after
/// it, and draws a label as a single-line label of the line if the label
/// starts before the end of the line and ends at or before it. It draws these
/// labels in the order of their start, and pads each label from the end of the
/// farthest label before it (or from the start of the line).
///
/// Whether the snippet goes on after the last line depends on the number of
/// context lines. The result must not depend on it: miette reads the primary
/// label again without context to find the location for the header, and fails
/// the whole report if that read fails. So for the last line, this checks the
/// padding of each label that miette can draw (also with the `\n`), but moves
/// the start of the next padding only past a label that miette surely draws
/// (also without the `\n`). This can only make the result stricter.
fn paddings_fit(
    src: &str,
    start: usize,
    end: usize,
    is_last: bool,
    labels: &[(usize, usize)],
) -> bool {
    let (drawn_limit, surely_drawn_limit) = if is_last {
        ((end + 1).min(src.len()), end)
    } else {
        (end + 1, end + 1)
    };

    let mut highest = start;
    for &(lo, hi) in labels {
        if lo >= drawn_limit {
            break;
        }
        if lo < start || hi > drawn_limit {
            continue;
        }
        if lo > highest && is_too_wide(&src[highest..lo]) {
            return false;
        }
        if hi <= surely_drawn_limit {
            highest = highest.max(hi);
        }
    }
    true
}

/// Returns the byte range of `src` that the snippet of `src[lo..hi]` shows.
///
/// The range starts at the start of a line and ends at the end of a line
/// (without the `\n`), with up to `context_lines_before` and
/// `context_lines_after` more lines, unless a line is cropped as the
/// [module documentation](self) describes. Returns `None` if a line of the
/// span itself cannot be shown.
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
        start = crop_start(src, first_line_start, lo, CROPPED_CONTEXT_WIDTH);
    }
    if is_too_wide(&src[last_line_start..last_line_end]) {
        end = crop_end(src, hi, last_line_end, CROPPED_CONTEXT_WIDTH);
    }

    // Check the lines of the span, which can still be too wide because the
    // span covers a wide part of them. The bounds of these lines do not depend
    // on the number of context lines.
    let mut labels = LazyLabels {
        init: Some(labels),
        ranges: None,
    };
    let mut line = start;
    loop {
        let text_end = line_end(src, line).min(end);
        let is_last = text_end == end;
        if is_too_wide(&src[line..text_end]) {
            let fits = labels
                .get()
                .is_some_and(|labels| paddings_fit(src, line, text_end, is_last, labels));
            if !fits {
                return None;
            }
        }

        if is_last {
            break;
        }
        line = text_end + 1;
    }

    // Context lines can be shown only next to an uncropped line. A context
    // line that is too wide is not shown, so it never needs a check of its
    // labels.
    if start == first_line_start {
        for _ in 0..context_lines_before {
            if start == 0 {
                break;
            }
            // `src[start - 1]` is the `\n` that ends the previous line.
            let prev_start = line_start(src, start - 1);
            if is_too_wide(&src[prev_start..start - 1]) {
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
                break;
            }
            end = next_end;
        }
    }

    Some((start, end))
}
