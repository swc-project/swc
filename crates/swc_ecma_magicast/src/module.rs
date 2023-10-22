use std::ops::Deref;

use swc_atoms::Atom;
use swc_ecma_ast::Module;

use crate::{data::Data, BindingRef, Ensurable, OptionalNode, Proxy};

pub struct ModuleNode(Data<Module>);

impl ModuleNode {
    pub fn imports(&self) -> ModuleImportsNode {
        ModuleImportsNode(self.0.clone())
    }

    pub fn exports(&self) -> ModuleExportsNode {
        ModuleExportsNode(self.0.clone())
    }
}

pub struct ModuleImportsNode(Data<Module>);

impl ModuleImportsNode {
    pub fn named(&self, name: &str) -> NamedImportNode {}

    pub fn from(&self, module_specifier: &str) -> ImportFromNode {}
}

pub struct BaseImportNode {}

pub struct NamedImportNode {
    import: OptionalNode<BaseImportNode>,
    name: BindingRef,
}

impl Deref for NamedImportNode {
    type Target = BindingRef;
}

pub struct ImportFromNode {
    import: OptionalNode<BaseImportNode>,
    module_specifier: Atom,
}

impl Proxy for ImportFromNode {}

impl Ensurable for ImportFromNode {}

pub struct ModuleExportsNode(Data<Module>);

impl ModuleExportsNode {
    pub fn default(&self) -> ExportDefaultItemNode {}

    pub fn from_exported(&self, symbol: &str) -> ExportItemNode {}
}

pub struct ExportItemNode {}

pub struct ExportDefaultItemNode {}
