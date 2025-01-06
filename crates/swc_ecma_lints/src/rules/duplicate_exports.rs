use std::{collections::hash_map::Entry, mem};

use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::rule::{visitor_rule, Rule};

pub fn duplicate_exports() -> Box<dyn Rule> {
    visitor_rule(DuplicateExports::default())
}

#[derive(Debug, Default)]
struct DuplicateExports {
    exports: AHashMap<JsWord, Span>,
    export_assign: Option<Span>,
}

impl DuplicateExports {
    /// Add an export.
    fn add(&mut self, id: &Ident) {
        match self.exports.entry(id.sym.clone()) {
            Entry::Occupied(mut prev) => {
                let name = &id.sym;

                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(
                            id.span,
                            &format!("the name `{}` is exported multiple times", name),
                        )
                        .span_label(*prev.get(), "previous exported here")
                        .span_label(id.span, "exported more than once")
                        .note("Exported identifiers must be unique")
                        .emit();
                });

                // Next span.
                *prev.get_mut() = id.span;
            }
            Entry::Vacant(e) => {
                e.insert(id.span);
            }
        }

        self.check_no_coexist();
    }

    fn add_export_assign(&mut self, span: Span) {
        if let Some(prev_span) = self.export_assign {
            // TS2300
            HANDLER.with(|handler| {
                handler
                    .struct_span_err(span, "multiple `export =` found")
                    .span_label(prev_span, "previous `export =` declared here")
                    .emit()
            });
        }

        self.export_assign = Some(span);

        self.check_no_coexist();
    }

    fn check_no_coexist(&self) {
        if let Some(span) = self.export_assign {
            if !self.exports.is_empty() {
                // TS2309
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(span, r#"An export assignment cannot be used in a module with other exported elements."#)
                        .emit()
                });
            }
        }
    }
}

impl Visit for DuplicateExports {
    noop_visit_type!();

    fn visit_export_default_decl(&mut self, d: &ExportDefaultDecl) {
        if match &d.decl {
            DefaultDecl::Fn(FnExpr { function: f, .. }) if f.body.is_none() => true,
            DefaultDecl::TsInterfaceDecl(..) => true,
            _ => false,
        } {
            return;
        }

        d.visit_children_with(self);

        self.add(&Ident::new_no_ctxt("default".into(), d.span));
    }

    fn visit_export_default_expr(&mut self, d: &ExportDefaultExpr) {
        d.visit_children_with(self);

        match &*d.expr {
            Expr::Fn(FnExpr { function: f, .. }) if f.body.is_none() => return,
            _ => {}
        }

        self.add(&Ident::new_no_ctxt("default".into(), d.span));
    }

    fn visit_export_default_specifier(&mut self, s: &ExportDefaultSpecifier) {
        self.add(&s.exported);
    }

    fn visit_export_named_specifier(&mut self, s: &ExportNamedSpecifier) {
        let exported = match &s.exported {
            Some(ModuleExportName::Ident(ident)) => Some(ident),
            Some(ModuleExportName::Str(..)) => return,
            _ => None,
        };
        let orig = match &s.orig {
            ModuleExportName::Ident(ident) => ident,
            ModuleExportName::Str(..) => return,
        };
        self.add(exported.as_ref().unwrap_or(&orig));
    }

    fn visit_export_namespace_specifier(&mut self, s: &ExportNamespaceSpecifier) {
        match &s.name {
            ModuleExportName::Ident(name) => self.add(name),
            ModuleExportName::Str(..) => {}
        };
    }

    /// Noop. Just to ensure that the visitor do not recurse into stmt.
    fn visit_stmt(&mut self, _: &Stmt) {}

    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment) {
        self.add_export_assign(n.span);
    }

    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) {
        if n.is_export && !n.is_type_only {
            self.add(&n.id)
        }
    }

    fn visit_ts_module_decl(&mut self, d: &TsModuleDecl) {
        if !d.declare {
            let old = mem::take(self);
            d.visit_children_with(self);
            *self = old;
        }
    }
}
