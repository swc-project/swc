use rustc_hash::FxHashSet;
use swc_ecma_ast::Id;

pub(crate) struct AliasCollector {
    aliases: FxHashSet<Id>,
}

impl AliasCollector {}
