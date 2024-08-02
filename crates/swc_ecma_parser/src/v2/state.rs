use rustc_hash::FxHashSet;
use swc_ecma_ast::Decorator;

#[derive(Default)]
pub struct ParserState {
    pub not_parenthesized_arrow: FxHashSet<u32>,

    pub decorators: Vec<Decorator>,
}
