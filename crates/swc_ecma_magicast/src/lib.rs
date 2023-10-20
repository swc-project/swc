use std::ops::{Index, IndexMut};

pub struct ModuleNode<'a> {
    pub exports: ModuleExports<'a>,
}

pub struct ModuleExports<'a> {
    pub default: OptionalNode<ExportItemNode<'a>>,
}

impl<'a> Index<String> for ModuleExports<'a> {
    type Output = ExportItemNode<'a>;
}

impl<'a> IndexMut<String> for ModuleExports<'a> {}

pub struct OptionalNode<T> {
    node: Option<T>,
}

impl<N> OptionalNode<N> {
    pub fn ensure(&mut self) -> &mut N {
        self.node.get_or_insert_with(|| panic!("unreachable"))
    }
}

pub struct ExportItemNode<'a> {}

fn usage() {
    let m: ModuleNode;
}
