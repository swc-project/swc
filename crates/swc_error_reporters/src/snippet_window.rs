//! Selection of the source text that a snippet shows.
//!
//! `miette`'s `GraphicalReportHandler` pads the underline of a single-line
//! label with `format!("{:width$}", ..)`, where `width` is the rendered column
//! of the label (or the distance from the previous label). Since Rust 1.87, a
//! runtime width above `u16::MAX` panics with `Formatting argument out of
//! range`, and the panic aborts the process when the binary uses
//! `panic = "abort"` (for example the Node.js bindings). See
//! <https://github.com/swc-project/swc/issues/12828>.
//!
//! The padding is never wider than the line that the label is on, so this
//! module makes sure that no line of a snippet is wider than
//! [MAX_LINE_WIDTH]:
//!
//! - When the first or the last line of the span is too wide, the part of that
//!   line outside the span is cropped to [CROPPED_CONTEXT_WIDTH] columns, and
//!   the context lines on that side are not shown (a snippet must be one
//!   contiguous range of the source).
//! - A context line that is too wide is not shown, together with the context
//!   lines farther from the span.
//! - When a line is still too wide because of the span itself, no snippet is
//!   returned. For a single label, miette then prints a short "Failed to read
//!   contents for label" note in place of the snippet. When miette tries to
//!   merge the snippets of two labels, it renders them separately.
//!
//! Known limitation: widths are estimated with a tab width of at most
//! [MAX_TAB_WIDTH] columns. A handler that is configured with a larger tab
//! width can still render a line that is too wide.

/// The largest estimated width of a line in a snippet.
///
/// miette renders a label that extends past the end of a line one column past
/// the end, so the widest padding is `MAX_LINE_WIDTH + 1`, which must not be
/// above `u16::MAX`.
pub(crate) const MAX_LINE_WIDTH: usize = u16::MAX as usize - 1;

/// The width of the text that is kept before and after the span when a line
/// of the span is cropped.
pub(crate) const CROPPED_CONTEXT_WIDTH: usize = 128;

/// The largest tab width that the width estimate supports. miette uses 4 by
/// default.
pub(crate) const MAX_TAB_WIDTH: usize = 8;

/// Returns an upper bound of the number of columns that miette uses to render
/// `c`.
///
/// miette uses the Unicode width of a character, which is at most 1 for an
/// ASCII character and at most 2 for any other character. A tab moves to the
/// next tab stop, which is at most [MAX_TAB_WIDTH] columns away.
#[inline]
fn char_width(c: char) -> usize {
    if c == '\t' {
        MAX_TAB_WIDTH
    } else if c.is_ascii() {
        1
    } else {
        2
    }
}

/// Returns `true` if the estimated width of `line` is above
/// [MAX_LINE_WIDTH].
///
/// This stops at the first character past the limit, so its cost is bounded
/// by the limit and not by the length of the line.
fn is_too_wide(line: &str) -> bool {
    // Every character is at least one byte wide and at most `MAX_TAB_WIDTH`
    // columns wide, so short lines need no scan.
    if line.len() <= MAX_LINE_WIDTH / MAX_TAB_WIDTH {
        return false;
    }

    let mut width = 0;
    for c in line.chars() {
        width += char_width(c);
        if width > MAX_LINE_WIDTH {
            return true;
        }
    }
    false
}

/// Returns the largest index `i` in `line_start..=pos` such that
/// `src[i..pos]` is at most [CROPPED_CONTEXT_WIDTH] columns wide. `i` is a
/// character boundary.
fn crop_start(src: &str, line_start: usize, pos: usize) -> usize {
    let mut width = 0;
    let mut start = pos;
    for (i, c) in src[line_start..pos].char_indices().rev() {
        width += char_width(c);
        if width > CROPPED_CONTEXT_WIDTH {
            break;
        }
        start = line_start + i;
    }
    start
}

/// Returns the smallest index `i` in `pos..=line_end` such that
/// `src[pos..i]` is at most [CROPPED_CONTEXT_WIDTH] columns wide. `i` is a
/// character boundary.
fn crop_end(src: &str, pos: usize, line_end: usize) -> usize {
    let mut width = 0;
    let mut end = pos;
    for (i, c) in src[pos..line_end].char_indices() {
        width += char_width(c);
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

/// Returns the byte range of `src` that the snippet of `src[lo..hi]` shows.
///
/// The range starts at the start of a line and ends at the end of a line
/// (without the `\n`), with up to `context_lines_before` and
/// `context_lines_after` more lines, unless a line is cropped as the
/// [module documentation](self) describes. Returns `None` if a line of the
/// span itself is too wide to show.
///
/// `lo` and `hi` must be character boundaries of `src`, and `lo <= hi`.
pub(crate) fn snippet_window(
    src: &str,
    lo: usize,
    hi: usize,
    context_lines_before: usize,
    context_lines_after: usize,
) -> Option<(usize, usize)> {
    let first_line_start = line_start(src, lo);
    let last_line_end = line_end(src, hi);

    let mut start = first_line_start;
    let mut end = last_line_end;

    match src[lo..hi].find('\n') {
        // The span is on one line.
        None => {
            if is_too_wide(&src[start..end]) {
                start = crop_start(src, first_line_start, lo);
                end = crop_end(src, hi, last_line_end);

                if is_too_wide(&src[start..end]) {
                    return None;
                }
            }
        }
        Some(first_newline) => {
            let first_line_end = lo + first_newline;
            // `hi > first_line_end`, so `src[..hi]` contains a `\n`.
            let last_line_start = line_start(src, hi);

            if is_too_wide(&src[first_line_start..first_line_end]) {
                start = crop_start(src, first_line_start, lo);
                if is_too_wide(&src[start..first_line_end]) {
                    return None;
                }
            }

            if is_too_wide(&src[last_line_start..last_line_end]) {
                end = crop_end(src, hi, last_line_end);
                if is_too_wide(&src[last_line_start..end]) {
                    return None;
                }
            }

            // The lines between the first line and the last line.
            if first_line_end + 1 < last_line_start
                && src[first_line_end + 1..last_line_start - 1]
                    .split('\n')
                    .any(is_too_wide)
            {
                return None;
            }
        }
    }

    // Context lines can be shown only next to an uncropped line.
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
