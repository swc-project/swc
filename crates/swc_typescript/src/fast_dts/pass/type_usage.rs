use std::collections::HashSet;

use swc_ecma_ast::{
    Class, ExportDefaultExpr, Function, Id, ModuleExportName, ModuleItem, NamedExport, Script,
    TsEntityName, TsExprWithTypeArgs,
};
use swc_ecma_visit::{Visit, VisitWith};

#[derive(Default)]
pub struct TypeUsageAnalyzer {
    used_ids: HashSet<Id>,
}

impl TypeUsageAnalyzer {
    pub fn used_ids(&self) -> &HashSet<Id> {
        &self.used_ids
    }

    pub fn add_generated_id(&mut self, id: Id) {
        self.used_ids.insert(id);
    }
}

impl Visit for TypeUsageAnalyzer {
    fn visit_class(&mut self, node: &Class) {
        if let Some(super_class) = &node.super_class {
            if let Some(ident) = super_class.as_ident() {
                self.used_ids.insert(ident.to_id());
            }
        }
        node.visit_children_with(self);
    }

    fn visit_ts_expr_with_type_args(&mut self, node: &TsExprWithTypeArgs) {
        if let Some(ident) = node.expr.as_ident() {
            self.used_ids.insert(ident.to_id());
        }
        node.visit_children_with(self);
    }

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

    fn visit_function(&mut self, node: &Function) {
        // Skip body
        node.params.visit_with(self);
        node.decorators.visit_with(self);
        node.span.visit_with(self);
        node.ctxt.visit_with(self);
        node.type_params.visit_with(self);
        node.return_type.visit_with(self);
    }

    fn visit_module_items(&mut self, node: &[ModuleItem]) {
        for item in node {
            // Skip statements
            if item.as_stmt().map_or(false, |stmt| !stmt.is_decl()) {
                continue;
            }
            item.visit_children_with(self);
        }
    }

    fn visit_script(&mut self, node: &Script) {
        for stmt in &node.body {
            // Skip statements
            if !stmt.is_decl() {
                continue;
            }
            stmt.visit_children_with(self);
        }
    }
}
