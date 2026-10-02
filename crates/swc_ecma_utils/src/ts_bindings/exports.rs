//! Namespace export specifiers contribute public names without changing the
//! source declaration's private identity.

use super::*;

/// An empty or purely declarative type namespace has no value-space binding.
pub(super) fn has_value(body: &TsNamespaceBody) -> bool {
    match body {
        TsNamespaceBody::TsModuleBlock(block) => block.body.iter().any(|item| {
            match item {
            ModuleItem::Stmt(Stmt::Decl(declaration))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: declaration,
                ..
            })) => match declaration {
                Decl::TsInterface(_) | Decl::TsTypeAlias(_) => false,
                Decl::TsModule(namespace) => namespace.body.as_ref().is_some_and(has_value),
                _ => true,
            },
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(alias)) => !alias.is_type_only,
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                !export.type_only && export.specifiers.iter().any(|specifier| {
                    matches!(specifier, ExportSpecifier::Named(named) if !named.is_type_only)
                })
            }
            ModuleItem::Stmt(Stmt::Empty(_))
            | ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExport(_)) => false,
            _ => true,
        }
        }),
        TsNamespaceBody::TsNamespaceDecl(declaration) => has_value(&declaration.body),
        #[cfg(swc_ast_unknown)]
        _ => false,
    }
}

pub(super) fn has_export_specifiers(body: &TsNamespaceBody) -> bool {
    match body {
        TsNamespaceBody::TsModuleBlock(block) => block.body.iter().any(|item| {
            matches!(
                item,
                ModuleItem::ModuleDecl(
                    ModuleDecl::ExportNamed(_)
                        | ModuleDecl::ExportAll(_)
                        | ModuleDecl::ExportDefaultExpr(_)
                        | ModuleDecl::TsExportAssignment(_)
                )
            )
        }),
        TsNamespaceBody::TsNamespaceDecl(declaration) => has_export_specifiers(&declaration.body),
        #[cfg(swc_ast_unknown)]
        _ => false,
    }
}

impl TsBindings {
    pub(super) fn add_namespace_export(&mut self, export: NamespaceExport) {
        let Some(source) = self.declaration_id(&export.source) else {
            return;
        };
        let source_facts = &self.declarations[source.0];
        // Namespace export specifiers refer to that body's declarations. A
        // malformed outer export must not steal an unrelated lexical ID.
        if source_facts.owner != Some(export.body) {
            return;
        }
        let value = source_facts.value_space && !export.type_only;
        let ty = source_facts.type_space || export.type_only;
        let ambient = source_facts.ambient;
        let id = (export.name.clone(), export.source.1);
        let renamed = id != export.source;
        if renamed && self.declaration_id(&id).is_some() {
            return;
        }
        let carrier = if renamed {
            self.register(id, Some(export.body))
        } else {
            source
        };
        let owner = self.bodies[export.body.0].container;
        let member = self.add_member(owner, export.name.into());
        let facts = &mut self.members[member.0];
        if value && facts.value.is_none() {
            facts.value = Some(carrier);
        }
        if ty && facts.ty.is_none() {
            facts.ty = Some(carrier);
        }
        let facts = &mut self.declarations[carrier.0];
        facts.ambient = ambient;
        facts.member = Some(member);
        facts.value_space |= value;
        facts.type_space |= ty;
        if renamed {
            facts.export_target = Some(source);
        }
    }
}
