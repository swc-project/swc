//! Namespace export specifiers contribute public names without changing the
//! source declaration's private identity.

use super::*;

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
        let source_facts = &self.declarations[source.index()];
        // Namespace export specifiers refer to that body's declarations. A
        // malformed outer export must not steal an unrelated lexical ID.
        if source_facts.owner != Some(export.body) {
            return;
        }
        let value = source_facts.value_space && !export.type_only;
        let ty = source_facts.type_space;
        let type_candidate = ty
            || export.type_only
            || source_facts.container.is_some()
            || self.declaration_alias(source).is_some();
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
        let owner = self.bodies[export.body.index()].container;
        let member = self.add_member(owner, export.name.into());
        let facts = &mut self.members[member.index()];
        if value && facts.value.is_none() {
            facts.value = Some(carrier);
        }
        if type_candidate && facts.erased.is_none() {
            facts.erased = Some(carrier);
        }
        let facts = &mut self.declarations[carrier.index()];
        facts.ambient = ambient;
        facts.member = Some(member);
        facts.value_space |= value;
        facts.type_space |= ty;
        if renamed {
            facts.export_target = Some(source);
        }
    }
}
