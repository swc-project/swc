use std::collections::hash_map::Entry;
use swc_atoms::{js_word, JsWord};
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
}

impl DuplicateExports {
    /// Add an export.
    fn add(&mut self, id: &Ident) {
        match self.exports.entry(id.sym.clone()) {
            Entry::Occupied(mut prev) => {
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(id.span, "Duplicate export")
                        .span_note(*prev.get(), &format!("{} was exported at here", id.sym))
                        .emit();
                });

                // Next span.
                *prev.get_mut() = id.span;
            }
            Entry::Vacant(e) => {
                e.insert(id.span);
            }
        }
    }
}

impl Visit for DuplicateExports {
    noop_visit_type!();

    fn visit_export_default_decl(&mut self, d: &ExportDefaultDecl) {
        d.visit_children_with(self);

        self.add(&Ident::new(js_word!("default"), d.span));
    }

    fn visit_export_default_expr(&mut self, d: &ExportDefaultExpr) {
        d.visit_children_with(self);

        self.add(&Ident::new(js_word!("default"), d.span));
    }

    fn visit_export_default_specifier(&mut self, s: &ExportDefaultSpecifier) {
        self.add(&s.exported);
    }

    fn visit_export_named_specifier(&mut self, s: &ExportNamedSpecifier) {
        self.add(&s.exported.as_ref().unwrap_or(&s.orig));
    }

    fn visit_export_namespace_specifier(&mut self, s: &ExportNamespaceSpecifier) {
        self.add(&s.name);
    }
}
