use swc_common::{collections::AHashMap, errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::rule::{visitor_rule, Rule};

pub fn const_assign() -> Box<dyn Rule> {
    visitor_rule(ConstAssign::default())
}

#[derive(Debug, Default)]
struct ConstAssign {
    const_vars: AHashMap<Id, Span>,

    is_pat_decl: bool,
}

impl ConstAssign {
    fn check(&mut self, id: &Ident) {
        if self.is_pat_decl {
            return;
        }

        if let Some(&decl_span) = self.const_vars.get(&id.to_id()) {
            HANDLER.with(|handler| {
                handler
                    .struct_span_err(
                        id.span,
                        "cannot reassign to a variable declared with `const`",
                    )
                    .span_label(decl_span, "const variable was declared here")
                    .span_suggestion(
                        decl_span,
                        "consider making this variable mutable",
                        format!("let {}", id.sym),
                    )
                    .span_label(id.span, "cannot reassign")
                    .emit();
            });
        }
    }
}

impl Visit for ConstAssign {
    noop_visit_type!();

    fn visit_assign_pat_prop(&mut self, p: &AssignPatProp) {
        p.visit_children_with(self);

        self.check(&p.key);
    }

    fn visit_module(&mut self, program: &Module) {
        program.visit_children_with(&mut Collector {
            const_vars: &mut self.const_vars,
            var_decl_kind: None,
        });

        program.visit_children_with(self);
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if let Pat::Ident(p) = p {
            self.check(&p.id);
        }
    }

    fn visit_script(&mut self, program: &Script) {
        program.visit_children_with(&mut Collector {
            const_vars: &mut self.const_vars,
            var_decl_kind: None,
        });

        program.visit_children_with(self);
    }

    fn visit_var_decl(&mut self, var_decl: &VarDecl) {
        let old_is_pat_decl = self.is_pat_decl;
        self.is_pat_decl = true;
        var_decl.visit_children_with(self);
        self.is_pat_decl = old_is_pat_decl;
    }
}

struct Collector<'a> {
    const_vars: &'a mut AHashMap<Id, Span>,

    var_decl_kind: Option<VarDeclKind>,
}

impl Visit for Collector<'_> {
    noop_visit_type!();

    fn visit_assign_pat_prop(&mut self, p: &AssignPatProp) {
        p.visit_children_with(self);

        if let Some(VarDeclKind::Const) = self.var_decl_kind {
            *self.const_vars.entry(p.key.to_id()).or_default() = p.span;
        }
    }

    fn visit_expr(&mut self, e: &Expr) {
        let old_var_decl_kind = self.var_decl_kind;
        self.var_decl_kind = None;

        e.visit_children_with(self);

        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if let Some(VarDeclKind::Const) = self.var_decl_kind {
            if let Pat::Ident(i) = p {
                *self.const_vars.entry(i.to_id()).or_default() = i.id.span;
            }
        }
    }

    fn visit_var_decl(&mut self, var_decl: &VarDecl) {
        let old_var_decl_kind = self.var_decl_kind;
        self.var_decl_kind = Some(var_decl.kind);

        var_decl.visit_children_with(self);

        self.var_decl_kind = old_var_decl_kind;
    }
}
