use std::ops::Deref;

use swc_atoms::Atom;
use swc_ecma_ast::{ImportDecl, ImportSpecifier, Module, ModuleDecl, ModuleItem};

use crate::{data::Data, option::WithDefault, BindingRef, OptionalNode, Proxy};

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
    pub fn named(&self, name: &str) -> OptionalNode<NamedImportNode> {
        let name = Atom::from(name);

        let index = self.0.with(|module| {
            module.body.iter().position(|item| match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl { specifiers, .. })) => {
                    for s in specifiers {
                        match s {
                            ImportSpecifier::Named(n) => {
                                if n.local.sym == name {
                                    return true;
                                }
                            }

                            _ => {}
                        }
                    }

                    false
                }
                _ => false,
            })
        });

        OptionalNode::new(index.map(|index| NamedImportNode {
            import: BaseImportNode {
                data: self.0.map(
                    |module| {
                        module
                            .body
                            .iter()
                            .nth(index)
                            .unwrap()
                            .as_mut_module_decl()
                            .unwrap()
                            .as_mut_import()
                            .unwrap()
                    },
                    |module| {
                        module
                            .body
                            .iter_mut()
                            .nth(index)
                            .unwrap()
                            .as_mut_module_decl()
                            .unwrap()
                            .as_mut_import()
                            .unwrap()
                    },
                ),
            },
            name,
        }))
    }

    pub fn from(&self, module_specifier: &str) -> WithDefault<ImportFromNode> {}
}

pub struct BaseImportNode {
    data: Data<ImportDecl>,
}

impl Proxy for BaseImportNode {}

pub struct NamedImportNode {
    import: BaseImportNode,
    name: BindingRef,
}

impl Proxy for NamedImportNode {}

impl Deref for NamedImportNode {
    type Target = BindingRef;
}

pub struct ImportFromNode {
    import: BaseImportNode,
    module_specifier: Atom,
}

impl Proxy for ImportFromNode {}

pub struct ModuleExportsNode(Data<Module>);

impl ModuleExportsNode {
    pub fn default(&self) -> ExportDefaultItemNode {}

    pub fn from_exported(&self, symbol: &str) -> ExportItemNode {}
}

pub struct ExportItemNode {}

impl Proxy for ExportItemNode {}

pub struct ExportDefaultItemNode {}

impl Proxy for ExportDefaultItemNode {}
