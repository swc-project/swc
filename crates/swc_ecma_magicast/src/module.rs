use std::ops::Deref;

use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{ImportDecl, ImportSpecifier, Module, ModuleDecl, ModuleItem, Str};
use swc_ecma_utils::prepend_stmt;

use crate::{data::Data, option::WithDefault, BindingRef, ExprNode, OptionalNode, Proxy};

#[derive(Clone)]
pub struct ModuleNode<'a>(pub(crate) Data<'a, Module>);

impl Proxy for ModuleNode<'_> {
    type AstNode = Module;

    fn data<'a>(&'a self) -> &Data<'a, Self::AstNode> {
        &self.0
    }
}

impl<'a> ModuleNode<'a> {
    pub fn imports(&self) -> ModuleImports {
        ModuleImports(self.0.clone())
    }

    pub fn exports(&self) -> ModuleExports {
        ModuleExports(self.0.clone())
    }
}

pub struct ModuleImports<'a>(Data<'a, Module>);

impl<'a> ModuleImports<'a> {
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

                            ImportSpecifier::Default(n) => {
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
            import: BaseImportNode::from_index(&self.0, index),
            name: BindingRef { sym: name.clone() },
        }))
    }

    pub fn from(&self, module_specifier: &str) -> WithDefault<ImportFromModule> {
        let module_specifier = Atom::from(module_specifier);

        let index = self.0.with(|module| {
            module.body.iter().position(|item| match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl { src, .. })) => {
                    src.value == module_specifier
                }
                _ => false,
            })
        });

        OptionalNode::new_with_default(
            index.map(|index| ImportFromModule {
                import: BaseImportNode::from_index(&self.0, index),
                module_specifier: module_specifier.clone(),
            }),
            move || {
                let new_import = ImportDecl {
                    span: DUMMY_SP,
                    specifiers: Default::default(),
                    src: Box::new(Str {
                        value: module_specifier.clone(),
                        span: DUMMY_SP,
                        raw: None,
                    }),
                    type_only: false,
                    with: None,
                };

                self.0.with_mut(|module| {
                    prepend_stmt(
                        &mut module.body,
                        ModuleItem::ModuleDecl(ModuleDecl::Import(new_import)),
                    );
                });

                let index = self
                    .0
                    .with(|module| {
                        module.body.iter().position(|item| match item {
                            ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                                src, ..
                            })) => src.value == module_specifier,
                            _ => false,
                        })
                    })
                    .expect("Failed to find newly added import");

                ImportFromModule {
                    import: BaseImportNode::from_index(&self.0, index),
                    module_specifier: module_specifier.clone(),
                }
            },
        )
    }
}

#[derive(Clone)]
pub struct BaseImportNode<'a> {
    data: Data<'a, ImportDecl>,
}

impl<'a> BaseImportNode<'a> {
    pub(crate) fn from_index(data: &'a Data<'a, Module>, index: usize) -> Self {
        BaseImportNode {
            data: data.map(
                move |module| {
                    module
                        .body
                        .get(index)
                        .unwrap()
                        .as_module_decl()
                        .unwrap()
                        .as_import()
                        .unwrap()
                },
                move |module| {
                    module
                        .body
                        .get_mut(index)
                        .unwrap()
                        .as_mut_module_decl()
                        .unwrap()
                        .as_mut_import()
                        .unwrap()
                },
            ),
        }
    }
}

impl Proxy for BaseImportNode<'_> {}

#[derive(Clone)]
pub struct NamedImportNode<'a> {
    import: BaseImportNode<'a>,
    name: BindingRef,
}

impl Proxy for NamedImportNode<'_> {}

impl<'a> Deref for NamedImportNode<'a> {
    type Target = BindingRef;

    fn deref(&self) -> &Self::Target {
        &self.name
    }
}

#[derive(Clone)]
pub struct ImportFromModule<'a> {
    import: BaseImportNode<'a>,
    module_specifier: Atom,
}

impl Proxy for ImportFromModule<'_> {}

pub struct ModuleExports<'a>(Data<'a, Module>);

impl<'a> ModuleExports<'a> {
    pub fn default(&self) -> ExportDefaultItemNode {
        let data = self.0.map_opt(
            |module| {
                module.body.iter().find_map(|v| match v.as_module_decl()? {
                    export @ ModuleDecl::ExportDefaultDecl(..)
                    | export @ ModuleDecl::ExportDefaultExpr(..) => Some(export),
                    _ => None,
                })
            },
            |module: &mut Module| {
                module
                    .body
                    .iter_mut()
                    .find_map(|v| match v.as_mut_module_decl()? {
                        export @ ModuleDecl::ExportDefaultDecl(..)
                        | export @ ModuleDecl::ExportDefaultExpr(..) => Some(export),
                        _ => None,
                    })
            },
        );

        ExportDefaultItemNode { data }
    }

    pub fn from_exported(&self, symbol: &str) -> ExportItemNode {
        todo!()
    }
}

#[derive(Clone)]
pub struct ExportItemNode {}

impl Proxy for ExportItemNode {}

#[derive(Clone)]
pub struct ExportDefaultItemNode<'a> {
    data: Option<Data<'a, ModuleDecl>>,
}

impl<'a> ExportDefaultItemNode<'a> {
    /// Optional because we can export declarations as `default`.`
    pub fn expr(&self) -> OptionalNode<ExprNode> {
        match &self.data {
            Some(data) => OptionalNode::new(
                data.map_opt(
                    |decl| Some(&decl.as_export_default_expr()?.expr),
                    |decl| Some(&mut decl.as_mut_export_default_expr()?.expr),
                )
                .map(ExprNode),
            ),
            None => OptionalNode::new(None),
        }
    }
}

impl Proxy for ExportDefaultItemNode<'_> {}
