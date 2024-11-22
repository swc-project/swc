use std::collections::HashSet;

use swc_common::{BytePos, Spanned};
use swc_ecma_ast::{
    Class, Decl, ExportDecl, ExportDefaultExpr, Function, Id, ModuleExportName, ModuleItem,
    NamedExport, Program, Script, TsEntityName, TsExprWithTypeArgs,
};
use swc_ecma_visit::{Visit, VisitWith};

pub struct TypeUsageAnalyzer<'a> {
    used_ids: HashSet<Id>,
    internal_annotations: Option<&'a HashSet<BytePos>>,
}

impl TypeUsageAnalyzer<'_> {
    pub fn analyze(
        program: &Program,
        internal_annotations: Option<&HashSet<BytePos>>,
    ) -> HashSet<Id> {
        let mut analyzer = TypeUsageAnalyzer {
            used_ids: HashSet::new(),
            internal_annotations,
        };
        program.visit_with(&mut analyzer);
        analyzer.used_ids
    }
}

impl Visit for TypeUsageAnalyzer<'_> {
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
        node.visit_children_with(self);
    }

    fn visit_named_export(&mut self, node: &NamedExport) {
        for specifier in &node.specifiers {
            if let Some(name) = specifier.as_named() {
                if let ModuleExportName::Ident(ident) = &name.orig {
                    self.used_ids.insert(ident.to_id());
                }
            }
        }
        node.visit_children_with(self);
    }

    fn visit_export_decl(&mut self, node: &ExportDecl) {
        match &node.decl {
            Decl::Class(class_decl) => {
                self.used_ids.insert(class_decl.ident.to_id());
            }
            Decl::Fn(fn_decl) => {
                self.used_ids.insert(fn_decl.ident.to_id());
            }
            Decl::Var(var_decl) => {
                for decl in &var_decl.decls {
                    if let Some(name) = decl.name.as_ident() {
                        self.used_ids.insert(name.to_id());
                    }
                }
            }
            Decl::Using(using_decl) => {
                for decl in &using_decl.decls {
                    if let Some(name) = decl.name.as_ident() {
                        self.used_ids.insert(name.to_id());
                    }
                }
            }
            Decl::TsInterface(ts_interface_decl) => {
                self.used_ids.insert(ts_interface_decl.id.to_id());
            }
            Decl::TsTypeAlias(ts_type_alias_decl) => {
                self.used_ids.insert(ts_type_alias_decl.id.to_id());
            }
            Decl::TsEnum(ts_enum_decl) => {
                self.used_ids.insert(ts_enum_decl.id.to_id());
            }
            Decl::TsModule(ts_module_decl) => {
                if let Some(name) = ts_module_decl.id.as_ident() {
                    self.used_ids.insert(name.to_id());
                }
            }
        };
        node.visit_children_with(self);
    }

    fn visit_export_default_expr(&mut self, node: &ExportDefaultExpr) {
        if let Some(ident) = node.expr.as_ident() {
            self.used_ids.insert(ident.to_id());
        }
        node.visit_children_with(self);
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
            if item.as_stmt().map_or(false, |stmt| {
                !stmt.is_decl()
                    || self
                        .internal_annotations
                        .map_or(false, |internal_annotations| {
                            internal_annotations.contains(&stmt.span_lo())
                        })
            }) {
                continue;
            }
            item.visit_children_with(self);
        }
    }

    fn visit_script(&mut self, node: &Script) {
        for stmt in &node.body {
            // Skip statements
            if !stmt.is_decl()
                || self
                    .internal_annotations
                    .map_or(false, |internal_annotations| {
                        internal_annotations.contains(&stmt.span_lo())
                    })
            {
                continue;
            }
            stmt.visit_children_with(self);
        }
    }
}
