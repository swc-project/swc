use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{BytePos, Span};

#[derive(Clone, Default)]
pub struct State {
    pub labels: Vec<Atom>,
    /// Start position of an assignment expression.
    pub potential_arrow_start: Option<BytePos>,
    /// Start position of an AST node and the span of its trailing comma.
    pub trailing_commas: FxHashMap<BytePos, Span>,
}
