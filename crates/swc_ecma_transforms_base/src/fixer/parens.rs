use std::collections::hash_map::Entry;

use rustc_hash::FxHashMap;
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    BytePos, Span,
};

/// Removed parentheses, indexed independently of their comment migration order.
#[derive(Default)]
pub(super) struct ParenSpans {
    indices: FxHashMap<Span, usize>,
    spans: Vec<ParenSpan>,
}

struct ParenSpan {
    inner: Span,
    paren: Option<Span>,
    /// Keep annotation comments such as `/* @__PURE__ */` before the removed
    /// `(` instead of moving them onto the inner expression. See
    /// [ParenSpans::keep_leading_annotations].
    keep_leading_annotations: bool,
}

impl ParenSpans {
    pub(super) fn is_empty(&self) -> bool {
        self.indices.is_empty()
    }

    pub(super) fn clear(&mut self) {
        self.indices.clear();
        self.spans.clear();
    }

    pub(super) fn insert(&mut self, inner: Span, paren: Span) {
        match self.indices.entry(inner) {
            Entry::Occupied(entry) => {
                let span = &mut self.spans[*entry.get()];
                span.paren = Some(paren);
                span.keep_leading_annotations = false;
            }
            Entry::Vacant(entry) => {
                entry.insert(self.spans.len());
                self.spans.push(ParenSpan {
                    inner,
                    paren: Some(paren),
                    keep_leading_annotations: false,
                });
            }
        }
    }

    pub(super) fn remove(&mut self, span: Span) -> Option<Span> {
        let index = self.indices.remove(&span)?;
        let paren = self.spans[index].paren.take();
        if index + 1 == self.spans.len() {
            self.spans.pop();
        }
        // Leave consumed middle entries in place. Shifting them is quadratic
        // for nested assertions with redundant parentheses around their input.
        paren
    }

    /// Marks the removed paren around `inner` so that [Self::move_comments]
    /// keeps the annotation comments before its `(` in place, and moves only
    /// the other comments onto `inner`.
    ///
    /// The fixer uses this when it wraps an annotated expression in
    /// span-less parentheses. An annotation before the removed `(` applies to
    /// the outer expression, which starts at the same position, so it must not
    /// move inside the new parentheses.
    pub(super) fn keep_leading_annotations(&mut self, inner: Span) {
        if let Some(&index) = self.indices.get(&inner) {
            self.spans[index].keep_leading_annotations = true;
        }
    }

    pub(super) fn move_comments(&mut self, comments: Option<&dyn Comments>) {
        if let Some(comments) = comments {
            // Active keys keep their insertion position when overwritten.
            // Once consumed, reinserting a key appends a new record instead.
            for span in self.spans.drain(..).rev() {
                if let Some(paren) = span.paren {
                    if span.keep_leading_annotations {
                        move_leading_except_annotations(comments, paren.lo, span.inner.lo);
                    } else {
                        comments.move_leading(paren.lo, span.inner.lo);
                    }
                    comments.move_trailing(paren.hi, span.inner.hi);
                }
            }
            self.indices.clear();
        }
    }
}

/// Moves the leading comments at `from` to `to` like
/// [Comments::move_leading], but keeps annotation comments at `from`.
fn move_leading_except_annotations(comments: &dyn Comments, from: BytePos, to: BytePos) {
    let Some(leading) = comments.take_leading(from) else {
        return;
    };

    let (kept, mut moved): (Vec<_>, Vec<_>) = leading.into_iter().partition(is_annotation);
    if !kept.is_empty() {
        comments.add_leading_comments(from, kept);
    }
    if moved.is_empty() {
        return;
    }

    // Keep the source order, as `move_leading` does.
    if from < to {
        if let Some(existing) = comments.take_leading(to) {
            moved.extend(existing);
        }
    }
    comments.add_leading_comments(to, moved);
}

/// Returns whether `comment` is a `/* @__PURE__ */` or
/// `/* @__NO_SIDE_EFFECTS__ */` annotation, with the same rules as
/// [Comments::has_flag].
fn is_annotation(comment: &Comment) -> bool {
    comment.kind == CommentKind::Block
        && comment.text.lines().any(|line| {
            let line = line.trim_start_matches(['*', ' ']).trim();
            let Some(flag) = line
                .strip_prefix("#__")
                .or_else(|| line.strip_prefix("@__"))
                .and_then(|line| line.strip_suffix("__"))
            else {
                return false;
            };
            flag == "PURE" || flag == "NO_SIDE_EFFECTS"
        })
}
