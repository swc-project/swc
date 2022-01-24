use super::Pure;
use crate::{compress::util::last_var_decl, mode::Mode, util::ModuleItemExt};
use std::intrinsics::transmute;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, prepend, StmtLike, UsageFinder};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

impl<M> Pure<'_, M>
where
    M: Mode,
{
    /// Handle variable declaration followed by initialization in next
    /// statement.
    pub(super) fn collapse_init_into_var_decls<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: ModuleItemExt,
    {
        if !(self.options.collapse_vars && self.options.unused) {
            return;
        }

        fn extract_init(e: &mut Expr) -> Option<&mut Expr> {
            match e {
                Expr::Assign(AssignExpr { op: op!("="), .. }) => Some(e),
                Expr::Call(e) => {
                    match &mut e.callee {
                        Callee::Super(_) => {}
                        Callee::Import(_) => {}
                        Callee::Expr(callee) => {
                            if let Some(e) = extract_init(&mut **callee) {
                                // transmute is used because polonius is not implemented yet
                                return Some(unsafe { transmute(e) });
                            }

                            if !callee.is_ident() {
                                return None;
                            }
                        }
                    }

                    if let Some(e) = e.args.first_mut() {
                        if e.spread.is_some() {
                            return None;
                        }
                        return extract_init(&mut *e.expr);
                    }

                    None
                }
                Expr::Seq(e) => {
                    return e.exprs.first_mut().and_then(|e| extract_init(&mut **e));
                }
                _ => None,
            }
        }

        for idx in 0..stmts.len() {
            let (s1, s2) = stmts.split_at_mut(idx);
            let first = s1.last_mut();
            let first = match first {
                Some(v) => v,
                None => continue,
            };

            let second = s2.get_mut(0);

            let second = match second {
                Some(v) => v,
                None => continue,
            };

            // TODO: last_var_decls, while skipping variable declarators without init
            let first = last_var_decl(first);
            let first = match first {
                Some(v) => v,
                None => continue,
            };
            if first.init.is_some() {
                continue;
            }

            let name = match first.name.as_ident() {
                Some(v) => v.id.to_id(),
                None => todo!(),
            };
            let second = match second.as_stmt_mut() {
                Some(Stmt::Expr(second)) => &mut *second.expr,
                Some(Stmt::Return(ReturnStmt {
                    arg: Some(second), ..
                })) => &mut **second,
                _ => continue,
            };

            let second = match extract_init(second) {
                Some(v) => v,
                _ => continue,
            };

            if let Expr::Assign(AssignExpr {
                op: op!("="),
                left,
                right,
                ..
            }) = second
            {
                // This is because `(0, f.g)()` is longer than `a=f.g, a()`.
                if right.is_member() {
                    return;
                }

                //

                if let Some(left_id) = left.as_ident_mut() {
                    if left_id.to_id() != name {
                        continue;
                    }

                    if UsageFinder::find(left_id, &**right) {
                        continue;
                    }

                    tracing::debug!(
                        "collapse_vars: Collapsing var(`{}`) without init followed by init",
                        left_id
                    );
                    first.init = Some(right.take());
                    self.changed = true;

                    *second = Expr::Ident(left_id.clone());
                }
            }
        }
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
            stmts.visit_with(&mut v);
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

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_var_decl(&mut self, v: &VarDecl) {
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

    fn visit_mut_module_item(&mut self, s: &mut ModuleItem) {
        s.visit_mut_children_with(self);

        match s {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::Var(d),
                ..
            })) if d.decls.is_empty() => {
                s.take();
            }

            _ => {}
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
