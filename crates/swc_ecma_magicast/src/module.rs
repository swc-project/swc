use swc_ecma_ast::Module;

use crate::data::Data;

pub struct ModuleNode(Data<Module>);

impl ModuleNode {
    pub fn imports(&self) -> ModuleImports {}

    pub fn exports(&self) -> ModuleExports {}
}

pub struct ModuleImports {}

pub struct ModuleExports {
    pub default: OptionalNode<ExportItemNode>,
}

impl Index<String> for ModuleExports {
    type Output = ExportItemNode;
}

impl IndexMut<String> for ModuleExports {}
