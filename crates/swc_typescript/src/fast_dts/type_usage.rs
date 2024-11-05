use std::collections::HashSet;

use swc_ecma_ast::{
    Decl, ExportDefaultExpr, Id, ImportSpecifier, ModuleDecl, ModuleExportName, ModuleItem,
    NamedExport, Stmt, TsEntityName,
};
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

#[derive(Default)]
pub struct TypeUsageAnalyzer {
    used_ids: HashSet<Id>,
}

impl Visit for TypeUsageAnalyzer {
    fn visit_ts_entity_name(&mut self, node: &TsEntityName) {
        match node {
            TsEntityName::TsQualifiedName(ts_qualified_name) => {
                ts_qualified_name.left.visit_with(self);
            }
            TsEntityName::Ident(ident) => {
                self.used_ids.insert(ident.to_id());
            }
        };
    }

    fn visit_named_export(&mut self, node: &NamedExport) {
        for specifier in &node.specifiers {
            if let Some(name) = specifier.as_named() {
                if let ModuleExportName::Ident(ident) = &name.orig {
                    self.used_ids.insert(ident.to_id());
                }
            }
        }
    }

    fn visit_export_default_expr(&mut self, node: &ExportDefaultExpr) {
        if let Some(ident) = node.expr.as_ident() {
            self.used_ids.insert(ident.to_id());
        }
    }
}

pub struct TypeRemover<'a>(&'a TypeUsageAnalyzer);

impl<'a> TypeRemover<'a> {
    pub fn new(type_usage_analyzer: &'a TypeUsageAnalyzer) -> Self {
        Self(type_usage_analyzer)
    }
}

impl VisitMut for TypeRemover<'_> {
    fn visit_mut_module_items(&mut self, node: &mut Vec<ModuleItem>) {
        node.visit_mut_children_with(self);
        node.retain_mut(|node| match node {
            ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl))) => {
                var_decl.decls.retain_mut(|decl| {
                    if let Some(ident) = decl.name.as_ident() {
                        self.0.used_ids.contains(&ident.to_id())
                    } else {
                        true
                    }
                });

                !var_decl.decls.is_empty()
            }
            ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) => {
                if import_decl.specifiers.is_empty() {
                    return true;
                }

                import_decl.specifiers.retain(|specifier| match specifier {
                    ImportSpecifier::Named(specifier) => {
                        self.0.used_ids.contains(&specifier.local.to_id())
                    }
                    ImportSpecifier::Default(specifier) => {
                        self.0.used_ids.contains(&specifier.local.to_id())
                    }
                    ImportSpecifier::Namespace(specifier) => {
                        self.0.used_ids.contains(&specifier.local.to_id())
                    }
                });

                !import_decl.specifiers.is_empty()
            }
            _ => true,
        });
    }
}
