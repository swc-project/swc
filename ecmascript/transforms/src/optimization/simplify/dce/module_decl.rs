use super::Dce;
use swc_common::{Fold, FoldWith};
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;

impl Fold<ImportDecl> for Dce<'_> {
    fn fold(&mut self, import: ImportDecl) -> ImportDecl {
        if self.is_marked(import.span) {
            return import;
        }

        let mut import: ImportDecl = import.fold_children(self);

        // Side effect import
        if import.specifiers.is_empty() {
            import.span = import.span.apply_mark(self.config.used_mark);
            return import;
        }

        // First run.
        if self.included.is_empty() {
            return import;
        }

        // Drop unused imports.
        import.specifiers.retain(|s| self.should_include(&s));

        if !import.specifiers.is_empty() {
            import.span = import.span.apply_mark(self.config.used_mark);
        }

        import
    }
}

impl Fold<ExportDecl> for Dce<'_> {
    fn fold(&mut self, mut node: ExportDecl) -> ExportDecl {
        if self.is_marked(node.span) {
            return node;
        }

        let i = match node.decl {
            Decl::Class(ClassDecl { ref ident, .. }) | Decl::Fn(FnDecl { ref ident, .. }) => ident,

            // Preserve types
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {
                node.span = node.span.apply_mark(self.config.used_mark);
                return node;
            }

            // Preserve only exported variables
            Decl::Var(ref mut v) => {
                // If config.used is None, all exports are preserved
                if let Some(..) = self.config.used {
                    v.decls.retain(|d| self.should_include(d));
                }

                if !v.decls.is_empty() {
                    node.span = node.span.apply_mark(self.config.used_mark);
                    node.decl = self.fold_in_marking_phase(node.decl);
                }
                return node;
            }
        };

        if self.is_exported(&i.sym) {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.decl = self.fold_in_marking_phase(node.decl);
        }

        node
    }
}

impl Fold<ExportDefaultExpr> for Dce<'_> {
    fn fold(&mut self, mut node: ExportDefaultExpr) -> ExportDefaultExpr {
        if self.is_marked(node.span) {
            return node;
        }

        if self.is_exported(&js_word!("default")) {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.expr = self.fold_in_marking_phase(node.expr);
        }

        node
    }
}

impl Fold<NamedExport> for Dce<'_> {
    fn fold(&mut self, mut node: NamedExport) -> NamedExport {
        if self.is_marked(node.span) {
            return node;
        }

        // Export only when it's required.
        node.specifiers.retain(|s| match s {
            ExportSpecifier::Namespace(s) => self.is_exported(&s.name.sym),
            ExportSpecifier::Default(..) => self.is_exported(&js_word!("default")),
            ExportSpecifier::Named(s) => {
                self.is_exported(&s.exported.as_ref().unwrap_or_else(|| &s.orig).sym)
            }
        });

        if !node.specifiers.is_empty() {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.specifiers = self.fold_in_marking_phase(node.specifiers);
        }

        node
    }
}

impl Fold<ExportDefaultDecl> for Dce<'_> {
    fn fold(&mut self, mut node: ExportDefaultDecl) -> ExportDefaultDecl {
        if self.is_marked(node.span) {
            return node;
        }

        // TODO: Export only when it's required. (i.e. check self.used_exports)

        node.span = node.span.apply_mark(self.config.used_mark);
        node.decl = self.fold_in_marking_phase(node.decl);

        node
    }
}

impl Fold<ExportAll> for Dce<'_> {
    fn fold(&mut self, node: ExportAll) -> ExportAll {
        if self.is_marked(node.span) {
            return node;
        }

        unimplemented!("dce: `export * from 'foo'`")
    }
}

preserve!(TsImportEqualsDecl);
preserve!(TsExportAssignment);
preserve!(TsNamespaceExportDecl);
