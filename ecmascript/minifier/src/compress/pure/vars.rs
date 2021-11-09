use super::Pure;
use crate::mode::Mode;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend, StmtLike};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Node, Visit, VisitMut, VisitMutWith, VisitWith,
};

impl<M> Pure<'_, M>
where
    M: Mode,
{
    /// Collapse single-use non-constant variables, side effects permitting.
    ///
    /// This merges all variables to first variable declartion with an
    /// initializer. If such variable declaration is not found, variables are
    /// prepended to `stmts`.
    pub(super) fn collapse_vars_without_init<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>:
            VisitWith<VarWithOutInitCounter> + VisitMutWith<VarMover> + VisitMutWith<VarPrepender>,
    {
        if !self.options.collapse_vars {
            return;
        }

        {
            let mut found_other = false;
            let mut need_work = false;

            for stmt in &*stmts {
                match stmt.as_stmt() {
                    Some(Stmt::Decl(Decl::Var(
                        v @ VarDecl {
                            kind: VarDeclKind::Var,
                            ..
                        },
                    ))) => {
                        if v.decls.iter().all(|v| v.init.is_none()) {
                            if found_other {
                                need_work = true;
                            }
                        } else {
                            found_other = true;
                        }
                    }

                    // Directives
                    Some(Stmt::Expr(s)) => match &*s.expr {
                        Expr::Lit(Lit::Str(..)) => {}
                        _ => {
                            found_other = true;
                        }
                    },

                    _ => {
                        found_other = true;
                    }
                }
            }

            // Check for nested variable declartions.
            let mut v = VarWithOutInitCounter::default();
            stmts.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
            if !need_work && !v.need_work {
                return;
            }
        }

        self.changed = true;
        tracing::debug!("collapse_vars: Collapsing variables without an initializer");

        let vars = {
            let mut v = VarMover {
                vars: Default::default(),
                var_decl_kind: Default::default(),
            };
            stmts.visit_mut_with(&mut v);

            v.vars
        };

        // Prepend vars

        let mut prepender = VarPrepender { vars };
        stmts.visit_mut_with(&mut prepender);

        if !prepender.vars.is_empty() {
            prepend(
                stmts,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: Default::default(),
                    decls: prepender.vars,
                }))),
            );
        }
    }
}

/// See if there's two [VarDecl] which has [VarDeclarator] without the
/// initializer.
#[derive(Default)]
pub(super) struct VarWithOutInitCounter {
    need_work: bool,
    found_var_without_init: bool,
    found_var_with_init: bool,
}

impl Visit for VarWithOutInitCounter {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {}

    fn visit_constructor(&mut self, _: &Constructor, _: &dyn Node) {}

    fn visit_function(&mut self, _: &Function, _: &dyn Node) {}

    fn visit_var_decl(&mut self, v: &VarDecl, _: &dyn Node) {
        v.visit_children_with(self);

        if v.kind != VarDeclKind::Var {
            return;
        }

        let mut found_init = false;
        for d in &v.decls {
            if d.init.is_some() {
                found_init = true;
            } else {
                if found_init {
                    self.need_work = true;
                    return;
                }
            }
        }

        if v.decls.iter().all(|v| v.init.is_none()) {
            if self.found_var_without_init || self.found_var_with_init {
                self.need_work = true;
            }
            self.found_var_without_init = true;
        } else {
            self.found_var_with_init = true;
        }
    }

    fn visit_var_decl_or_pat(&mut self, _: &VarDeclOrPat, _: &dyn Node) {}
}

/// Moves all varaible without initializer.
pub(super) struct VarMover {
    vars: Vec<VarDeclarator>,
    var_decl_kind: Option<VarDeclKind>,
}

impl VisitMut for VarMover {
    noop_visit_mut_type!();

    /// Noop
    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    /// Noop
    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    /// Noop
    fn visit_mut_function(&mut self, _: &mut Function) {}

    fn visit_mut_module_item(&mut self, s: &mut ModuleItem) {
        s.visit_mut_children_with(self);

        match s {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::Var(d),
                ..
            })) if d.decls.is_empty() => {
                s.take();
                return;
            }

            _ => {}
        }
    }

    fn visit_mut_opt_var_decl_or_expr(&mut self, n: &mut Option<VarDeclOrExpr>) {
        n.visit_mut_children_with(self);

        match n {
            Some(VarDeclOrExpr::VarDecl(var)) => {
                if var.decls.is_empty() {
                    *n = None;
                }
            }
            _ => {}
        }
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        match s {
            Stmt::Decl(Decl::Var(v)) if v.decls.is_empty() => {
                s.take();
                return;
            }
            _ => {}
        }
    }

    fn visit_mut_var_decl(&mut self, v: &mut VarDecl) {
        let old = self.var_decl_kind.take();
        self.var_decl_kind = Some(v.kind);
        v.visit_mut_children_with(self);
        self.var_decl_kind = old;
    }

    fn visit_mut_var_decl_or_pat(&mut self, _: &mut VarDeclOrPat) {}

    fn visit_mut_var_declarators(&mut self, d: &mut Vec<VarDeclarator>) {
        d.visit_mut_children_with(self);

        if self.var_decl_kind.unwrap() != VarDeclKind::Var {
            return;
        }

        if d.iter().all(|v| v.init.is_some()) {
            return;
        }

        let has_init = d.iter().any(|v| v.init.is_some());

        if has_init {
            let mut new = vec![];

            for v in d.take() {
                if v.init.is_some() {
                    new.push(v)
                } else {
                    self.vars.push(v)
                }
            }

            *d = new;
        }

        let mut new = vec![];

        if has_init {
            new.extend(self.vars.drain(..));
        }

        for v in d.take() {
            if v.init.is_some() {
                new.push(v)
            } else {
                self.vars.push(v)
            }
        }

        *d = new;
    }
}

pub(super) struct VarPrepender {
    vars: Vec<VarDeclarator>,
}

impl VisitMut for VarPrepender {
    noop_visit_mut_type!();

    fn visit_mut_var_decl(&mut self, v: &mut VarDecl) {
        if self.vars.is_empty() {
            return;
        }

        if v.kind != VarDeclKind::Var {
            return;
        }

        if v.decls.iter().any(|d| d.init.is_some()) {
            let mut decls = self.vars.take();
            decls.extend(v.decls.take());

            v.decls = decls;
        }
    }

    /// Noop
    fn visit_mut_function(&mut self, _: &mut Function) {}

    /// Noop
    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    /// Noop
    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}
}
