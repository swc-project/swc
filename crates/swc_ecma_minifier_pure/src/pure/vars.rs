use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_minifier_base::report_change;
use swc_ecma_minifier_utils::{
    compress_util::{drop_invalid_stmts, is_directive},
    util::ModuleItemExt,
};
use swc_ecma_utils::{prepend_stmt, StmtLike};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use super::Pure;

impl Pure<'_> {
    /// Join variables.
    ///
    /// This method may move variables to head of for statements like
    ///
    /// `var a; for(var b;;);` => `for(var a, b;;);`
    pub(super) fn join_vars<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: ModuleItemExt,
    {
        if !self.options.join_vars {
            return;
        }

        {
            // Check if we can join variables.

            let can_work =
                stmts
                    .windows(2)
                    .any(|stmts| match (stmts[0].as_stmt(), stmts[1].as_stmt()) {
                        (Some(Stmt::Decl(Decl::Var(l))), Some(r)) => match r {
                            Stmt::Decl(Decl::Var(r)) => l.kind == r.kind,
                            Stmt::For(ForStmt { init: None, .. }) => l.kind == VarDeclKind::Var,
                            Stmt::For(ForStmt {
                                init:
                                    Some(VarDeclOrExpr::VarDecl(VarDecl {
                                        kind: VarDeclKind::Var,
                                        ..
                                    })),
                                ..
                            }) => l.kind == VarDeclKind::Var,
                            _ => false,
                        },
                        _ => false,
                    });

            if !can_work {
                return;
            }
        }

        report_change!("join_vars: Joining variables");
        self.changed = true;

        let mut cur: Option<VarDecl> = None;
        let mut new = vec![];

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => {
                    if is_directive(&stmt) {
                        new.push(T::from_stmt(stmt));
                        continue;
                    }

                    match stmt {
                        Stmt::Decl(Decl::Var(var)) => match &mut cur {
                            Some(v) if var.kind == v.kind => {
                                v.decls.extend(var.decls);
                            }
                            _ => {
                                new.extend(
                                    cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt),
                                );

                                cur = Some(var)
                            }
                        },
                        Stmt::For(mut stmt) => match &mut stmt.init {
                            Some(VarDeclOrExpr::VarDecl(
                                var @ VarDecl {
                                    kind: VarDeclKind::Var,
                                    ..
                                },
                            )) => match &mut cur {
                                Some(cur) if cur.kind == var.kind => {
                                    // Merge
                                    cur.decls.append(&mut var.decls);
                                    var.decls = cur.decls.take();

                                    new.push(T::from_stmt(Stmt::For(stmt)))
                                }
                                _ => {
                                    new.extend(
                                        cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt),
                                    );

                                    new.push(T::from_stmt(Stmt::For(stmt)))
                                }
                            },
                            None if cur
                                .as_ref()
                                .map(|v| v.kind == VarDeclKind::Var)
                                .unwrap_or(true) =>
                            {
                                stmt.init = cur
                                    .take()
                                    .and_then(|v| if v.decls.is_empty() { None } else { Some(v) })
                                    .map(VarDeclOrExpr::VarDecl);

                                new.push(T::from_stmt(Stmt::For(stmt)))
                            }
                            _ => {
                                new.extend(
                                    cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt),
                                );

                                new.push(T::from_stmt(Stmt::For(stmt)))
                            }
                        },
                        _ => {
                            new.extend(cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt));

                            new.push(T::from_stmt(stmt))
                        }
                    }
                }
                Err(item) => {
                    new.extend(cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt));

                    new.push(item);
                }
            }
        }

        new.extend(cur.take().map(Decl::Var).map(Stmt::Decl).map(T::from_stmt));

        drop_invalid_stmts(&mut new);

        *stmts = new;
    }

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
            let mut found_vars_without_init = false;
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

                            found_vars_without_init = true;
                        } else {
                            if found_vars_without_init && self.options.join_vars {
                                need_work = true;
                            }
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
            stmts.visit_with(&mut v);
            if !need_work && !v.need_work {
                return;
            }
        }

        self.changed = true;
        report_change!("collapse_vars: Collapsing variables without an initializer");

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
            prepend_stmt(
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

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_getter_prop(&mut self, _: &GetterProp) {}

    fn visit_module_item(&mut self, s: &ModuleItem) {
        if let ModuleItem::Stmt(_) = s {
            s.visit_children_with(self);
        }
    }

    fn visit_setter_prop(&mut self, _: &SetterProp) {}

    fn visit_var_decl(&mut self, v: &VarDecl) {
        v.visit_children_with(self);

        if v.kind != VarDeclKind::Var {
            return;
        }

        let mut found_init = false;
        for d in &v.decls {
            if d.init.is_some() {
                found_init = true;
            } else if found_init {
                self.need_work = true;
                return;
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

    fn visit_var_decl_or_pat(&mut self, _: &VarDeclOrPat) {}
}

/// Moves all variable without initializer.
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

    fn visit_mut_getter_prop(&mut self, _: &mut GetterProp) {}

    fn visit_mut_setter_prop(&mut self, _: &mut SetterProp) {}

    fn visit_mut_module_item(&mut self, s: &mut ModuleItem) {
        if let ModuleItem::Stmt(_) = s {
            s.visit_mut_children_with(self);
        }
    }

    fn visit_mut_opt_var_decl_or_expr(&mut self, n: &mut Option<VarDeclOrExpr>) {
        n.visit_mut_children_with(self);

        if let Some(VarDeclOrExpr::VarDecl(var)) = n {
            if var.decls.is_empty() {
                *n = None;
            }
        }
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        match s {
            Stmt::Decl(Decl::Var(v)) if v.decls.is_empty() => {
                s.take();
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
            new.append(&mut self.vars);
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

    /// Noop
    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    /// Noop
    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    /// Noop
    fn visit_mut_function(&mut self, _: &mut Function) {}

    fn visit_mut_getter_prop(&mut self, _: &mut GetterProp) {}

    fn visit_mut_setter_prop(&mut self, _: &mut SetterProp) {}

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
}
