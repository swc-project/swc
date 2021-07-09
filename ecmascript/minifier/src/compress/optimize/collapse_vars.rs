use super::Optimizer;
use fxhash::FxHashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::prepend;
use swc_ecma_utils::Id;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;

/// Methods related to the option `collapse_vars`.
impl Optimizer<'_> {
    pub(super) fn collapse_seq_exprs(&mut self, e: &mut Expr) {
        if !self.options.collapse_vars {
            return;
        }

        let seq = match e {
            Expr::Seq(seq) => seq,
            _ => return,
        };

        if seq.exprs.len() < 2 {
            return;
        }

        match (
            &*seq.exprs[seq.exprs.len() - 2],
            &*seq.exprs[seq.exprs.len() - 1],
        ) {
            (Expr::Assign(assign), Expr::Ident(ident)) => {
                // Check if lhs is same as `ident`.
                match &assign.left {
                    PatOrExpr::Expr(_) => {}
                    PatOrExpr::Pat(left) => match &**left {
                        Pat::Ident(left) => {
                            if left.id.sym == ident.sym && left.id.span.ctxt == ident.span.ctxt {
                                seq.exprs.pop();
                            }
                        }
                        _ => {}
                    },
                }
            }
            _ => {}
        }
    }

    pub(super) fn collapse_assignment_to_vars(&mut self, e: &mut Expr) {
        if !self.options.collapse_vars {
            return;
        }

        if self.ctx.in_try_block || self.ctx.executed_multiple_time {
            return;
        }

        match &*e {
            Expr::Assign(assign) => {
                //
                let left = match &assign.left {
                    PatOrExpr::Expr(_) => return,
                    PatOrExpr::Pat(left) => match &**left {
                        Pat::Ident(i) => i,
                        _ => return,
                    },
                };

                if let Some(usage) = self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&left.to_id()))
                {
                    if !usage.declared
                        || !usage.is_fn_local
                        || usage.assign_count != 1
                        || usage.var_kind == Some(VarDeclKind::Const)
                    {
                        return;
                    }
                }

                let value = match &*assign.right {
                    Expr::Lit(..)
                    | Expr::Member(MemberExpr {
                        computed: false, ..
                    }) => assign.right.clone(),
                    _ => return,
                };

                self.lits.insert(left.to_id(), value);
            }
            _ => {}
        }
    }

    /// Collapse single-use non-constant variables, side effects permitting.
    pub(super) fn collapse_consequtive_vars<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        if !self.options.collapse_vars {
            return;
        }

        let indexes = stmts
            .windows(2)
            .enumerate()
            .filter_map(|(i, stmts)| {
                match (stmts[0].as_stmt(), stmts[1].as_stmt()) {
                    (Some(Stmt::Decl(Decl::Var(v))), Some(r)) => {
                        // Should be handled by other passes.
                        if v.kind == VarDeclKind::Const {
                            return None;
                        }

                        // We only inline for some subset of statements.
                        match r {
                            Stmt::Expr(..) | Stmt::Return(..) => {}
                            _ => return None,
                        }

                        // We only touch last variable delcarator.
                        if let Some(last) = v.decls.last() {
                            match last.init.as_deref()? {
                                Expr::Object(..) => {
                                    // Objects are handled by other passes.
                                    return None;
                                }
                                Expr::Arrow(..) | Expr::Fn(..) => {
                                    // Handled by other passes
                                    return None;
                                }

                                _ => {
                                    let mut chekcer = InlinabiltyChecker { can_inline: true };
                                    last.init
                                        .visit_with(&Invalid { span: DUMMY_SP }, &mut chekcer);
                                    if !chekcer.can_inline {
                                        return None;
                                    }
                                }
                            }

                            match &last.name {
                                Pat::Ident(name) => {
                                    //
                                    if let Some(var) = self
                                        .data
                                        .as_ref()
                                        .and_then(|data| data.vars.get(&name.to_id()))
                                    {
                                        if var.usage_count != 1
                                            || var.mutated
                                            || !SimpleUsageFinder::find(&name.id, r)
                                        {
                                            return None;
                                        }

                                        return Some(i);
                                    }

                                    None
                                }
                                _ => None,
                            }
                        } else {
                            None
                        }
                    }
                    _ => None,
                }
            })
            .collect::<Vec<_>>();

        if indexes.is_empty() {
            return;
        }

        self.changed = true;
        log::trace!("collapse_vars: Collapsing {:?}", indexes);

        let mut new = Vec::with_capacity(stmts.len());
        let mut values = FxHashMap::default();
        for (idx, stmt) in stmts.take().into_iter().enumerate() {
            match stmt.try_into_stmt() {
                Ok(mut stmt) => match stmt {
                    Stmt::Decl(Decl::Var(mut v)) if indexes.contains(&idx) => {
                        if let Some(last) = v.decls.pop() {
                            match last.name {
                                Pat::Ident(name) => {
                                    values.insert(name.to_id(), last.init);
                                }
                                _ => unreachable!(),
                            }
                        } else {
                            unreachable!()
                        }
                    }
                    _ => {
                        stmt.visit_mut_with(&mut Inliner {
                            values: &mut values,
                        });

                        new.push(T::from_stmt(stmt));
                    }
                },
                Err(item) => {
                    new.push(item);
                }
            }
        }

        *stmts = new;

        //
    }

    /// Collapse single-use non-constant variables, side effects permitting.
    pub(super) fn collapse_vars_without_init<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        if !self.options.collapse_vars {
            return;
        }

        let mut found_other = false;
        let mut need_work = false;

        for stmt in &*stmts {
            match stmt.as_stmt() {
                Some(Stmt::Decl(Decl::Var(
                    v
                    @
                    VarDecl {
                        kind: VarDeclKind::Var,
                        ..
                    },
                ))) => {
                    if v.decls.iter().any(|v| v.init.is_none()) {
                        if found_other {
                            need_work = true;
                        }
                    } else {
                        found_other = true;
                    }
                }

                _ => {
                    found_other = true;
                }
            }
        }

        if !need_work {
            return;
        }

        self.changed = true;
        log::trace!("collapse_vars: Collapsing variables without an initializer");

        let mut vars = vec![];
        let mut new = Vec::with_capacity(stmts.len() + 1);

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => match stmt {
                    Stmt::Decl(Decl::Var(
                        v
                        @
                        VarDecl {
                            kind: VarDeclKind::Var,
                            ..
                        },
                    )) => {
                        let mut new_decls = vec![];

                        for decl in v.decls {
                            if decl.init.is_some() {
                                new_decls.push(decl);
                            } else {
                                vars.push(decl);
                            }
                        }

                        if !new_decls.is_empty() {
                            new.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                                decls: new_decls,
                                ..v
                            }))))
                        }
                    }
                    _ => new.push(T::from_stmt(stmt)),
                },
                Err(item) => new.push(item),
            }
        }

        prepend(
            &mut new,
            T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: Default::default(),
                decls: vars,
            }))),
        );

        *stmts = new;

        //
    }
}

/// Checks inlinabilty of variable initializer.
struct InlinabiltyChecker {
    can_inline: bool,
}

impl Visit for InlinabiltyChecker {
    noop_visit_type!();

    fn visit_update_expr(&mut self, _: &UpdateExpr, _: &dyn Node) {
        self.can_inline = false;
    }
}

struct Inliner<'a> {
    values: &'a mut FxHashMap<Id, Option<Box<Expr>>>,
}

impl VisitMut for Inliner<'_> {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Ident(i) => {
                if let Some(value) = self.values.remove(&i.to_id()) {
                    *e = *value.expect("should be used only once");
                }
            }
            _ => {}
        }
    }
}

/// Finds usage of `ident`, but except assignment to it.
struct SimpleUsageFinder<'a> {
    ident: &'a Ident,
    found: bool,
}

impl<'a> Visit for SimpleUsageFinder<'a> {
    noop_visit_type!();

    fn visit_pat(&mut self, n: &Pat, _: &dyn Node) {
        match n {
            Pat::Ident(..) => {}
            _ => {
                n.visit_children_with(self);
            }
        }
    }

    fn visit_update_expr(&mut self, _: &UpdateExpr, _: &dyn Node) {}

    fn visit_expr_or_spread(&mut self, n: &ExprOrSpread, _: &dyn Node) {
        if n.spread.is_some() {
            return;
        }
        n.visit_children_with(self);
    }

    fn visit_assign_expr(&mut self, e: &AssignExpr, _: &dyn Node) {
        e.right.visit_with(e, self);
    }

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        if i.span.ctxt() == self.ident.span.ctxt() && i.sym == self.ident.sym {
            self.found = true;
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e as _, self);

        if e.computed {
            e.prop.visit_with(e as _, self);
        }
    }
}

impl<'a> SimpleUsageFinder<'a> {
    pub fn find<N>(ident: &'a Ident, node: &N) -> bool
    where
        N: VisitWith<Self>,
    {
        let mut v = SimpleUsageFinder {
            ident,
            found: false,
        };
        node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
        v.found
    }
}
