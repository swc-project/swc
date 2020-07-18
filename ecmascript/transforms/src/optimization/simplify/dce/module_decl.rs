use super::Dce;
use swc_common::{util::move_map::MoveMap, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, Id};
use swc_ecma_visit::Fold;

impl Fold for Dce<'_> {
    fn fold_import_decl(&mut self, mut import: ImportDecl) -> ImportDecl {
        // Do not mark import as used while ignoring imports
        if !self.decl_dropping_phase {
            return import;
        }

        if self.is_marked(import.span) {
            return import;
        }

        // Side effect import
        if import.specifiers.is_empty() {
            import.span = import.span.apply_mark(self.config.used_mark);
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

impl Fold for Dce<'_> {
    fn fold_export_decl(&mut self, mut node: ExportDecl) -> ExportDecl {
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
            Decl::Var(mut v) => {
                v.decls = v.decls.move_flat_map(|mut d| {
                    if self.is_marked(d.span()) {
                        return Some(d);
                    }

                    let names: Vec<Id> = find_ids(&d.name);
                    for name in names {
                        if self.included.iter().any(|included| *included == name)
                            || self.should_preserve_export(&name.0)
                        {
                            d.span = d.span.apply_mark(self.config.used_mark);
                            d.init = self.fold_in_marking_phase(d.init);
                            return Some(d);
                        }
                    }

                    if self.decl_dropping_phase {
                        return None;
                    }
                    Some(d)
                });

                if self.decl_dropping_phase && !v.decls.is_empty() {
                    node.span = node.span.apply_mark(self.config.used_mark);
                }

                node.decl = Decl::Var(v);

                return node;
            }
        };

        if self.should_preserve_export(&i.sym) {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.decl = self.fold_in_marking_phase(node.decl);
        }

        node
    }
}

impl Fold for Dce<'_> {
    fn fold_export_default_expr(&mut self, mut node: ExportDefaultExpr) -> ExportDefaultExpr {
        if self.is_marked(node.span) {
            return node;
        }

        if self.should_preserve_export(&js_word!("default")) {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.expr = self.fold_in_marking_phase(node.expr);
        }

        node
    }
}

impl Fold for Dce<'_> {
    fn fold_named_export(&mut self, mut node: NamedExport) -> NamedExport {
        if self.is_marked(node.span) {
            return node;
        }

        // Export only when it's required.
        node.specifiers.retain(|s| match s {
            ExportSpecifier::Namespace(s) => self.should_preserve_export(&s.name.sym),
            ExportSpecifier::Default(..) => self.should_preserve_export(&js_word!("default")),
            ExportSpecifier::Named(s) => {
                self.should_preserve_export(&s.exported.as_ref().unwrap_or_else(|| &s.orig).sym)
            }
        });

        if !node.specifiers.is_empty() {
            node.span = node.span.apply_mark(self.config.used_mark);
            node.specifiers = self.fold_in_marking_phase(node.specifiers);
        }

        node
    }
}

impl Fold for Dce<'_> {
    fn fold_export_default_decl(&mut self, mut node: ExportDefaultDecl) -> ExportDefaultDecl {
        if self.is_marked(node.span) {
            return node;
        }

        // TODO: Export only when it's required. (i.e. check self.used_exports)

        node.span = node.span.apply_mark(self.config.used_mark);
        node.decl = self.fold_in_marking_phase(node.decl);

        node
    }
}

impl Fold for Dce<'_> {
    fn fold_export_all(&mut self, node: ExportAll) -> ExportAll {
        if self.is_marked(node.span) {
            return node;
        }

        unimplemented!("dce: `export * from 'foo'`")
    }

    preserve!(fold_ts_import_equals_decl, TsImportEqualsDecl);
    preserve!(fold_ts_export_assignment, TsExportAssignment);
    preserve!(fold_ts_namespace_export_decl, TsNamespaceExportDecl);
}
