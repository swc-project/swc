use rustc_hash::FxHashSet;
use swc_common::Span;

/// Tracks finished nodes.
#[derive(Debug, Default)]
pub(crate) struct Tracker {
    all: FxHashSet<Span>,

    pure_done: FxHashSet<Span>,
    full_done: FxHashSet<Span>,
}

impl Tracker {
    /// Adds `span` to the list of known spans.
    pub(crate) fn add_to_known_list_of_spans(&mut self, span: Span) {}

    /// Ensure that the span is unique among the input.
    ///
    /// This **may** modify the syntax context of the span if there was an
    /// identical span.
    pub(crate) fn ensure_unique(&mut self, span: &mut Span) {}
}
