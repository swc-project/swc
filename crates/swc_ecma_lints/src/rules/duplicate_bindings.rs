use std::collections::hash_map::Entry;

use swc_common::{
    collections::{AHashMap, AHashSet},
    errors::HANDLER,
    Span,
};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::rule::{visitor_rule, Rule};

pub fn duplicate_bindings() -> Box<dyn Rule> {
    visitor_rule(DuplicateBindings {
        top_level: true,
        ..Default::default()
    })
}

#[derive(Debug, Default, Clone, Copy)]
struct BindingInfo {
    span: Span,
    unique: bool,
}

#[derive(Debug, Default)]
struct DuplicateBindings {
    bindings: AHashMap<Id, BindingInfo>,
    type_bindings: AHashSet<Id>,

    var_decl_kind: Option<VarDeclKind>,
    is_pat_decl: bool,

    is_module: bool,

    top_level: bool,
}

impl DuplicateBindings {
    /// Add a binding.
    fn add(&mut self, id: &Ident, unique: bool) {
        match self.bindings.entry(id.to_id()) {
            Entry::Occupied(mut prev) => {
                if unique || prev.get().unique {
                    let name = &id.sym;

                    HANDLER.with(|handler| {
                        handler
                            .struct_span_err(
                                id.span,
                                &format!("the name `{}` is defined multiple times", name),
                            )
                            .span_label(
                                prev.get().span,
                                &format!("previous definition of `{}` here", name),
                            )
                            .span_label(id.span, &format!("`{}` redefined here", name))
                            .emit();
                    });
                }

                // Next span.
                if unique || !prev.get().unique {
                    *prev.get_mut() = BindingInfo {
                        span: id.span,
                        unique,
                    }
                }
            }
            Entry::Vacant(e) => {
                e.insert(BindingInfo {
                    span: id.span,
                    unique,
                });
            }
        }
    }

    /// `const` or `let`
    fn is_unique_var_kind(&self) -> bool {
        matches!(
            self.var_decl_kind,
            Some(VarDeclKind::Const) | Some(VarDeclKind::Let)
        )
    }

    fn visit_with_kind<V: VisitWith<Self>>(&mut self, e: &V, kind: Option<VarDeclKind>) {
        let old_var_decl_kind = self.var_decl_kind.take();
        let old_is_pat_decl = self.is_pat_decl;

        self.var_decl_kind = kind;
        self.is_pat_decl = true;

        e.visit_children_with(self);

        self.is_pat_decl = old_is_pat_decl;
        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_with_fn_scope<V: VisitWith<Self>>(&mut self, e: &V) {
        let top_level = self.top_level;
        self.top_level = false;
        e.visit_children_with(self);
        self.top_level = top_level;
    }
}

impl Visit for DuplicateBindings {
    noop_visit_type!();

    fn visit_assign_pat_prop(&mut self, p: &AssignPatProp) {
        p.visit_children_with(self);

        if self.is_pat_decl {
            self.add(&p.key, self.is_unique_var_kind());
        }
    }

    fn visit_function(&mut self, f: &Function) {
        self.visit_with_fn_scope(f)
    }

    fn visit_arrow_expr(&mut self, a: &ArrowExpr) {
        self.visit_with_fn_scope(a)
    }

    fn visit_class(&mut self, c: &Class) {
        self.visit_with_fn_scope(c)
    }

    fn visit_catch_clause(&mut self, c: &CatchClause) {
        self.visit_with_kind(c, Some(VarDeclKind::Var))
    }

    fn visit_class_decl(&mut self, d: &ClassDecl) {
        self.add(&d.ident, true);

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
            self.add(&d.ident, self.is_module && self.top_level);
        }

        d.visit_children_with(self);
    }

    fn visit_import_decl(&mut self, s: &ImportDecl) {
        if s.type_only {
            return;
        }

        s.visit_children_with(self);
    }

    fn visit_import_default_specifier(&mut self, s: &ImportDefaultSpecifier) {
        s.visit_children_with(self);

        if !self.type_bindings.contains(&s.local.to_id()) {
            self.add(&s.local, true);
        }
    }

    fn visit_import_named_specifier(&mut self, s: &ImportNamedSpecifier) {
        s.visit_children_with(self);

        if !s.is_type_only && !self.type_bindings.contains(&s.local.to_id()) {
            self.add(&s.local, true);
        }
    }

    fn visit_import_star_as_specifier(&mut self, s: &ImportStarAsSpecifier) {
        s.visit_children_with(self);

        if !self.type_bindings.contains(&s.local.to_id()) {
            self.add(&s.local, true);
        }
    }

    fn visit_module(&mut self, m: &Module) {
        m.visit_with(&mut TypeCollector {
            type_bindings: &mut self.type_bindings,
        });

        self.is_module = true;
        m.visit_children_with(self);
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if let Pat::Ident(p) = p {
            if self.is_pat_decl {
                self.add(&p.id, self.is_unique_var_kind());
            }
        }
    }

    fn visit_script(&mut self, s: &Script) {
        s.visit_with(&mut TypeCollector {
            type_bindings: &mut self.type_bindings,
        });

        s.visit_children_with(self);
    }

    fn visit_var_decl(&mut self, d: &VarDecl) {
        self.visit_with_kind(d, Some(d.kind))
    }

    fn visit_param(&mut self, p: &Param) {
        self.visit_with_kind(p, Some(VarDeclKind::Var))
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
