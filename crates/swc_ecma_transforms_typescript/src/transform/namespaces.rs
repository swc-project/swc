//! Namespace instantiation is determined before erasing its declarations.
//! Ambient value declarations instantiate their enclosing namespace even though
//! they do not emit statements themselves.

use swc_ecma_ast::*;

use super::Transform;
use crate::retain::should_retain_module_item;

/// The contribution of one declaration body, before applying its own `declare`
/// modifier. Const-enum-only bodies additionally depend on runtime references;
/// pure type bodies stay erased even when another declaration shares their
/// name.
pub(super) enum NamespaceInstantiation {
    NonInstantiated,
    ConstEnumOnly,
    Instantiated,
}

impl NamespaceInstantiation {
    pub(super) fn is_instantiated(&self) -> bool {
        matches!(self, Self::Instantiated)
    }
}

impl Transform<'_> {
    pub(super) fn namespace_instantiation(
        &self,
        declaration: &TsModuleDecl,
    ) -> NamespaceInstantiation {
        if declaration.global {
            return NamespaceInstantiation::NonInstantiated;
        }
        let Some(body) = &declaration.body else {
            return NamespaceInstantiation::Instantiated;
        };
        let state = self.namespace_body_instantiation(body);
        match &declaration.id {
            TsModuleName::Ident(id) => self.namespace_instantiation_with_usage(id, state),
            _ => state,
        }
    }

    fn namespace_instantiation_with_usage(
        &self,
        id: &Ident,
        state: NamespaceInstantiation,
    ) -> NamespaceInstantiation {
        if matches!(state, NamespaceInstantiation::ConstEnumOnly) {
            let required = self
                .semantic
                .bindings
                .container(&id.to_id())
                .is_some_and(|container| self.semantic.runtime_containers.contains(&container));
            if required {
                return NamespaceInstantiation::Instantiated;
            }
        }
        state
    }

    fn namespace_body_instantiation(&self, body: &TsNamespaceBody) -> NamespaceInstantiation {
        match body {
            TsNamespaceBody::TsNamespaceDecl(declaration) => {
                let state = self.namespace_body_instantiation(&declaration.body);
                self.namespace_instantiation_with_usage(&declaration.id, state)
            }
            TsNamespaceBody::TsModuleBlock(block) => {
                let mut state = NamespaceInstantiation::NonInstantiated;
                for item in &block.body {
                    match self.namespace_item_instantiation(item) {
                        NamespaceInstantiation::Instantiated => {
                            return NamespaceInstantiation::Instantiated;
                        }
                        NamespaceInstantiation::ConstEnumOnly => {
                            state = NamespaceInstantiation::ConstEnumOnly;
                        }
                        NamespaceInstantiation::NonInstantiated => {}
                    }
                }
                state
            }
            #[cfg(swc_ast_unknown)]
            _ => NamespaceInstantiation::NonInstantiated,
        }
    }

    fn namespace_item_instantiation(&self, item: &ModuleItem) -> NamespaceInstantiation {
        match item {
            ModuleItem::Stmt(Stmt::Decl(declaration))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: declaration,
                ..
            })) => match declaration {
                Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {
                    NamespaceInstantiation::NonInstantiated
                }
                Decl::TsModule(declaration) => self.namespace_instantiation(declaration),
                Decl::TsEnum(declaration) => {
                    let ambient_const =
                        declaration.declare && declaration.is_const && !self.verbatim_module_syntax;
                    if ambient_const || self.can_erase_enum(declaration) {
                        NamespaceInstantiation::ConstEnumOnly
                    } else {
                        NamespaceInstantiation::Instantiated
                    }
                }
                // A value declaration contributes even if it is ambient or a
                // function signature with no body. Its own erasure is separate.
                _ => NamespaceInstantiation::Instantiated,
            },
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(declaration)) => {
                let live = !declaration.is_type_only
                    && self
                        .semantic
                        .has_import_equals_usage(&declaration.id.to_id());
                if live {
                    NamespaceInstantiation::Instantiated
                } else {
                    NamespaceInstantiation::NonInstantiated
                }
            }
            _ if should_retain_module_item(item) => NamespaceInstantiation::Instantiated,
            _ => NamespaceInstantiation::NonInstantiated,
        }
    }

    pub(super) fn can_erase_enum(&self, declaration: &TsEnumDecl) -> bool {
        self.semantic
            .enums
            .declaration(&declaration.id.to_id(), declaration.span)
            .is_some_and(|facts| {
                self.semantic
                    .enums
                    .can_erase(facts.container, self.verbatim_module_syntax)
            })
    }
}
