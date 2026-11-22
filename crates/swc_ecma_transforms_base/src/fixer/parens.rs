use std::collections::hash_map::Entry;

use rustc_hash::FxHashMap;
use swc_common::{comments::Comments, Span};

/// Removed parentheses, indexed independently of their comment migration order.
#[derive(Default)]
pub(super) struct ParenSpans {
    indices: FxHashMap<Span, usize>,
    spans: Vec<ParenSpan>,
}

struct ParenSpan {
    inner: Span,
    paren: Option<Span>,
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
            Entry::Occupied(entry) => self.spans[*entry.get()].paren = Some(paren),
            Entry::Vacant(entry) => {
                entry.insert(self.spans.len());
                self.spans.push(ParenSpan {
                    inner,
                    paren: Some(paren),
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

    pub(super) fn move_comments(&mut self, comments: Option<&dyn Comments>) {
        if let Some(comments) = comments {
            // Active keys keep their insertion position when overwritten.
            // Once consumed, reinserting a key appends a new record instead.
            for span in self.spans.drain(..).rev() {
                if let Some(paren) = span.paren {
                    comments.move_leading(paren.lo, span.inner.lo);
                    comments.move_trailing(paren.hi, span.inner.hi);
                }
            }
            self.indices.clear();
        }
    }
}
