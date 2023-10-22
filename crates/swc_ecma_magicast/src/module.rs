use std::ops::{Deref, Index, IndexMut};

use swc_atoms::Atom;
use swc_ecma_ast::Module;

use crate::{data::Data, BindingRef, Ensurable, Proxy};

pub struct ModuleNode(Data<Module>);

impl ModuleNode {
    pub fn imports(&self) -> ModuleImports {
        ModuleImports(self.0.clone())
    }

    pub fn exports(&self) -> ModuleExports {
        ModuleExports(self.0.clone())
    }
}

pub struct ModuleImports(Data<Module>);

impl ModuleImports {
    pub fn named(&self, name: &str) -> ImportNamed {}

    pub fn from(&self, module_specifier: &str) -> ImportFrom {}
}

pub struct ImportNamed {
    import: Option<ImportFrom>,
    name: BindingRef,
}

impl Deref for ImportNamed {
    type Target = BindingRef;
}

pub struct ImportFrom {
    module_specifier: Atom,
}

impl Proxy for ImportFrom {}

impl Ensurable for ImportFrom {}

pub struct ModuleExports(Data<Module>);

impl ModuleExports {
    pub fn default(&self) -> ExportDefaultItemNode {}
}

impl Index<String> for ModuleExports {
    type Output = ExportItemNode;
}

impl IndexMut<String> for ModuleExports {}

pub struct ExportItemNode {}

pub struct ExportDefaultItemNode {}
