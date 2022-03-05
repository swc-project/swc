use std::collections::hash_map::Entry;

use ahash::AHashSet;
use swc_common::{collections::AHashMap, errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::rule::{visitor_rule, Rule};

pub fn duplicate_bindings() -> Box<dyn Rule> {
    visitor_rule(DuplicateBindings::default())
}

#[derive(Debug, Default)]
struct DuplicateBindings {
    bindings: AHashMap<Id, Span>,
    type_bindings: AHashSet<Id>,

    var_decl_kind: Option<VarDeclKind>,
    is_pat_decl: bool,
}

impl DuplicateBindings {
    /// Add a binding.
    fn add(&mut self, id: &Ident, check_for_var_kind: bool) {
        if self.type_bindings.contains(&id.to_id()) {
            return;
        }

        if check_for_var_kind {
            if let Some(VarDeclKind::Var) = self.var_decl_kind {
                return;
            }
        }

        match self.bindings.entry(id.to_id()) {
            Entry::Occupied(mut prev) => {
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(id.span, "Duplicate binding")
                        .span_note(*prev.get(), &format!("{} was declared at here", id.sym))
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

impl Visit for DuplicateBindings {
    noop_visit_type!();

    fn visit_module(&mut self, m: &Module) {
        m.visit_with(&mut TypeCollector {
            type_bindings: &mut self.type_bindings,
        });

        m.visit_children_with(self);
    }

    fn visit_script(&mut self, s: &Script) {
        s.visit_with(&mut TypeCollector {
            type_bindings: &mut self.type_bindings,
        });

        s.visit_children_with(self);
    }

    fn visit_assign_pat_prop(&mut self, p: &AssignPatProp) {
        p.visit_children_with(self);

        if self.is_pat_decl {
            self.add(&p.key, true);
        }
    }

    fn visit_class_decl(&mut self, d: &ClassDecl) {
        self.add(&d.ident, false);

        d.visit_children_with(self);
    }

    fn visit_expr(&mut self, e: &Expr) {
        let old_var_decl_kind = self.var_decl_kind.take();
        let old_is_pat_decl = self.is_pat_decl;

        self.var_decl_kind = None;
        self.is_pat_decl = false;

        e.visit_children_with(self);

        self.is_pat_decl = old_is_pat_decl;
        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_fn_decl(&mut self, d: &FnDecl) {
        if d.function.body.is_some() {
            self.add(&d.ident, false);
        }

        d.visit_children_with(self);
    }

    fn visit_import_default_specifier(&mut self, s: &ImportDefaultSpecifier) {
        s.visit_children_with(self);

        self.add(&s.local, false);
    }

    fn visit_import_named_specifier(&mut self, s: &ImportNamedSpecifier) {
        s.visit_children_with(self);

        if !s.is_type_only {
            self.add(&s.local, false);
        }
    }

    fn visit_import_star_as_specifier(&mut self, s: &ImportStarAsSpecifier) {
        s.visit_children_with(self);

        self.add(&s.local, false);
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if let Pat::Ident(p) = p {
            if self.is_pat_decl {
                self.add(&p.id, true);
            }
        }
    }

    fn visit_var_decl(&mut self, d: &VarDecl) {
        let old_var_decl_kind = self.var_decl_kind.take();
        let old_is_pat_decl = self.is_pat_decl;

        self.var_decl_kind = Some(d.kind);
        self.is_pat_decl = true;

        d.visit_children_with(self);

        self.is_pat_decl = old_is_pat_decl;
        self.var_decl_kind = old_var_decl_kind;
    }
}

struct TypeCollector<'a> {
    type_bindings: &'a mut AHashSet<Id>,
}

impl Visit for TypeCollector<'_> {
    fn visit_ts_entity_name(&mut self, n: &TsEntityName) {
        n.visit_children_with(self);

        if let TsEntityName::Ident(ident) = n {
            self.type_bindings.insert(ident.to_id());
        }
    }
}
