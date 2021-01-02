use fxhash::FxHashMap;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;

#[derive(Debug, Default)]
pub(crate) struct Mutations {
    pub(crate) module_items: FxHashMap<SyntaxContext, ModuleItemMut>,
}

impl Mutations {
    pub fn apply(self, to: &mut Module) {}
}

#[derive(Debug, Default)]
pub(crate) struct ModuleItemMut {
    pub drop: bool,
}
