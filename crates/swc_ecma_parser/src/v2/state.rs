use oxc_ast::ast::Decorator;
use rustc_hash::FxHashSet;

#[derive(Default)]
pub struct ParserState<'a> {
    pub not_parenthesized_arrow: FxHashSet<u32>,

    pub decorators: Vec<Decorator<'a>>,
}
