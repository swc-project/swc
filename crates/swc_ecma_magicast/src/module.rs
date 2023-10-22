use std::ops::{Deref, Index, IndexMut};

use swc_ecma_ast::Module;

use crate::{data::Data, OptionalNode};

pub struct ModuleNode(Data<Module>);

impl ModuleNode {
    pub fn imports(&self) -> ModuleImports {}

    pub fn exports(&self) -> ModuleExports {}
}

pub struct ModuleImports {}

impl ModuleImports {
    pub fn named(&self, name: &str) -> ImportNamed {}
}

pub struct ImportNamed {}

impl Deref for ImportNamed {
    type Target = BindingRef;
}

pub struct ImportFrom {}

impl Ensurable for ImportFrom {}

pub struct ModuleExports {
    pub default: OptionalNode<ExportItemNode>,
}

impl Index<String> for ModuleExports {
    type Output = ExportItemNode;
}

impl IndexMut<String> for ModuleExports {}

pub struct ExportItemNode {}
