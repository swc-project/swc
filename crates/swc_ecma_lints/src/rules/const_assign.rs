use swc_common::{collections::AHashMap, errors::HANDLER, Span};
use swc_ecma_ast::*;
use swc_ecma_utils::parallel::{cpu_count, Parallel, ParallelExt};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::rule::Rule;

pub fn const_assign() -> Box<dyn Rule> {
    Box::new(ConstAssignRule)
}

#[derive(Debug)]
struct ConstAssignRule;

impl Rule for ConstAssignRule {
    fn lint_module(&mut self, program: &Module) {
        let mut const_vars = AHashMap::default();
        let mut import_binding = AHashMap::default();

        program.visit_children_with(&mut Collector {
            const_vars: &mut const_vars,
            import_binding: &mut import_binding,
            var_decl_kind: None,
        });

        program.visit_children_with(&mut ConstAssign {
            const_vars: &const_vars,
            import_binding: &import_binding,
            is_pat_decl: false,
        });
    }

    fn lint_script(&mut self, program: &Script) {
        let mut const_vars = AHashMap::default();
        let mut import_binding = AHashMap::default();

        program.visit_children_with(&mut Collector {
            const_vars: &mut const_vars,
            // I don't believe that import stmt exists in Script
            // But it's ok. Let's pass it in.
            import_binding: &mut import_binding,
            var_decl_kind: None,
        });

        program.visit_children_with(&mut ConstAssign {
            const_vars: &const_vars,
            import_binding: &import_binding,
            is_pat_decl: false,
        });
    }
}

#[derive(Clone, Copy)]
struct ConstAssign<'a> {
    const_vars: &'a AHashMap<Id, Span>,
    import_binding: &'a AHashMap<Id, Span>,

    is_pat_decl: bool,
}

impl Parallel for ConstAssign<'_> {
    fn create(&self) -> Self {
        *self
    }

    fn merge(&mut self, _: Self) {}
}

impl ConstAssign<'_> {
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

        if let Some(&binding_span) = self.import_binding.get(&id.to_id()) {
            HANDLER.with(|handler| {
                handler
                    .struct_span_err(id.span, "cannot reassign to an imported binding")
                    .span_label(binding_span, "imported binding")
                    .emit();
            });
        }
    }
}

impl Visit for ConstAssign<'_> {
    noop_visit_type!();

    fn visit_binding_ident(&mut self, n: &BindingIdent) {
        self.check(&Ident::from(n));
    }

    fn visit_class_members(&mut self, members: &[ClassMember]) {
        self.maybe_par(cpu_count(), members, |v, member| {
            member.visit_with(v);
        });
    }

    fn visit_expr_or_spreads(&mut self, n: &[ExprOrSpread]) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_with(v);
        });
    }

    fn visit_exprs(&mut self, exprs: &[Box<Expr>]) {
        self.maybe_par(cpu_count(), exprs, |v, expr| {
            expr.visit_with(v);
        });
    }

    fn visit_module_items(&mut self, items: &[ModuleItem]) {
        self.maybe_par(cpu_count(), items, |v, item| {
            item.visit_with(v);
        });
    }

    fn visit_opt_vec_expr_or_spreads(&mut self, n: &[Option<ExprOrSpread>]) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_with(v);
        });
    }

    fn visit_prop_or_spreads(&mut self, n: &[PropOrSpread]) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_with(v);
        });
    }

    fn visit_stmts(&mut self, stmts: &[Stmt]) {
        self.maybe_par(cpu_count(), stmts, |v, stmt| {
            stmt.visit_with(v);
        });
    }

    fn visit_update_expr(&mut self, n: &UpdateExpr) {
        n.visit_children_with(self);

        if let Expr::Ident(ident) = &*n.arg {
            self.check(ident);
        }
    }

    fn visit_var_declarator(&mut self, var_declarator: &VarDeclarator) {
        let old_is_pat_decl = self.is_pat_decl;
        self.is_pat_decl = true;
        var_declarator.name.visit_with(self);
        self.is_pat_decl = old_is_pat_decl;

        var_declarator.init.visit_with(self);
    }
}

struct Collector<'a> {
    const_vars: &'a mut AHashMap<Id, Span>,
    import_binding: &'a mut AHashMap<Id, Span>,

    var_decl_kind: Option<VarDeclKind>,
}

impl Visit for Collector<'_> {
    noop_visit_type!();

    fn visit_import_specifier(&mut self, n: &ImportSpecifier) {
        match n {
            ImportSpecifier::Named(ImportNamedSpecifier { local, .. })
            | ImportSpecifier::Default(ImportDefaultSpecifier { local, .. })
            | ImportSpecifier::Namespace(ImportStarAsSpecifier { local, .. }) => {
                self.import_binding.insert(local.to_id(), local.span);
            }
        }
    }

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
                *self.const_vars.entry(i.to_id()).or_default() = i.span;
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
