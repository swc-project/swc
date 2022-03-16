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
    }
}

impl Visit for DuplicateExports {
    noop_visit_type!();

    fn visit_export_default_decl(&mut self, d: &ExportDefaultDecl) {
        if matches!(
            d.decl,
            DefaultDecl::Fn(FnExpr {
                function: Function { body: None, .. },
                ..
            }) | DefaultDecl::TsInterfaceDecl(..)
        ) {
            return;
        }

        d.visit_children_with(self);

        self.add(&Ident::new(js_word!("default"), d.span));
    }

    fn visit_export_default_expr(&mut self, d: &ExportDefaultExpr) {
        d.visit_children_with(self);

        if matches!(
            &*d.expr,
            Expr::Fn(FnExpr {
                function: Function { body: None, .. },
                ..
            })
        ) {
            return;
        }

        self.add(&Ident::new(js_word!("default"), d.span));
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
}
