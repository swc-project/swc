use self::ctx::Ctx;
use fxhash::FxHashMap;
use std::collections::hash_map::Entry;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Id;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

mod ctx;

#[derive(Debug, Default)]
pub(crate) struct VarUsageInfo {
    /// # of reference to this identifier.
    pub ref_count: usize,

    pub assign_count: usize,
    pub usage_count: usize,

    pub reassigned: bool,
    pub has_property_access: bool,
    pub exported: bool,
    /// True if used **above** the declaration. (Not eval order).
    pub used_above_decl: bool,
    /// `true` if it's declared by function parameters or variables declared in
    /// a closest function and used only within it and not used by child
    /// functions.
    pub is_fn_local: bool,

    pub used_in_loop: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ScopeKind {
    Fn,
    Block,
}

#[derive(Debug, Default)]
pub(crate) struct ScopeData {
    pub vars: FxHashMap<Id, VarUsageInfo>,
}

impl ScopeData {
    fn merge(&mut self, kind: ScopeKind, child: ScopeData) {
        for (id, var_info) in child.vars {
            match self.vars.entry(id) {
                Entry::Occupied(mut e) => {
                    e.get_mut().ref_count += var_info.ref_count;
                    e.get_mut().reassigned |= var_info.reassigned;
                    e.get_mut().has_property_access |= var_info.has_property_access;
                    e.get_mut().exported |= var_info.exported;
                    e.get_mut().used_above_decl |= var_info.used_above_decl;
                    e.get_mut().used_in_loop |= var_info.used_in_loop;
                    e.get_mut().assign_count += var_info.assign_count;
                    e.get_mut().usage_count += var_info.usage_count;

                    match kind {
                        ScopeKind::Fn => {
                            e.get_mut().is_fn_local = false;
                        }
                        ScopeKind::Block => {}
                    }
                }
                Entry::Vacant(e) => {
                    e.insert(var_info);
                }
            }
        }
    }
}

/// This assumes there are no two variable with same name and same span hygiene.
#[derive(Debug, Default)]
pub(crate) struct UsageAnalyzer {
    pub data: ScopeData,
    ctx: Ctx,
}

impl UsageAnalyzer {
    fn with_child<F, Ret>(&mut self, kind: ScopeKind, op: F) -> Ret
    where
        F: FnOnce(&mut UsageAnalyzer) -> Ret,
    {
        let mut child = UsageAnalyzer {
            data: Default::default(),
            ctx: self.ctx,
        };

        let ret = op(&mut child);

        self.data.merge(kind, child.data);

        ret
    }

    fn report_usage(&mut self, i: &Ident, is_assign: bool) {
        let e = self
            .data
            .vars
            .entry(i.to_id())
            .or_insert_with(|| VarUsageInfo {
                used_above_decl: true,
                ..Default::default()
            });

        e.ref_count += 1;
        e.reassigned |= is_assign;
        e.used_in_loop |= self.ctx.in_loop;

        if is_assign {
            e.assign_count += 1;
        } else {
            e.usage_count += 1;
        }
    }

    fn declare_decl(&mut self, i: &Ident) -> &mut VarUsageInfo {
        self.data
            .vars
            .entry(i.to_id())
            .or_insert_with(|| VarUsageInfo {
                is_fn_local: true,
                ..Default::default()
            })
    }
}

impl Visit for UsageAnalyzer {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, n: &ArrowExpr, _: &dyn Node) {
        self.with_child(ScopeKind::Fn, |child| {
            n.params.visit_with(n, child);

            match &n.body {
                BlockStmtOrExpr::BlockStmt(body) => {
                    // We use visit_children_with instead of visit_with to bypass block scope
                    // handler.
                    body.visit_children_with(child);
                }
                BlockStmtOrExpr::Expr(body) => {
                    body.visit_with(n, child);
                }
            }
        })
    }

    fn visit_function(&mut self, n: &Function, _: &dyn Node) {
        n.decorators.visit_with(n, self);

        self.with_child(ScopeKind::Fn, |child| {
            n.params.visit_with(n, child);

            match &n.body {
                Some(body) => {
                    // We use visit_children_with instead of visit_with to bypass block scope
                    // handler.
                    body.visit_children_with(child);
                }
                None => {}
            }
        })
    }

    fn visit_block_stmt(&mut self, n: &BlockStmt, _: &dyn Node) {
        self.with_child(ScopeKind::Block, |child| {
            n.visit_children_with(child);
        })
    }

    fn visit_var_declarator(&mut self, e: &VarDeclarator, _: &dyn Node) {
        let ctx = Ctx {
            in_pat_of_var_decl: true,
            ..self.ctx
        };
        e.name.visit_with(e, &mut *self.with_ctx(ctx));

        e.init.visit_with(e, self);
    }

    fn visit_class_decl(&mut self, n: &ClassDecl, _: &dyn Node) {
        self.declare_decl(&n.ident);

        n.visit_children_with(self);
    }

    fn visit_fn_decl(&mut self, n: &FnDecl, _: &dyn Node) {
        self.declare_decl(&n.ident);

        n.visit_children_with(self);
    }

    fn visit_param(&mut self, n: &Param, _: &dyn Node) {
        let ctx = Ctx {
            in_pat_of_param: false,
            ..self.ctx
        };
        n.decorators.visit_with(n, &mut *self.with_ctx(ctx));

        let ctx = Ctx {
            in_pat_of_param: true,
            ..self.ctx
        };
        n.pat.visit_with(n, &mut *self.with_ctx(ctx));
    }

    fn visit_pat(&mut self, n: &Pat, _: &dyn Node) {
        n.visit_children_with(self);

        match n {
            Pat::Ident(i) => {
                if self.ctx.in_pat_of_var_decl || self.ctx.in_pat_of_param {
                    self.declare_decl(i);
                } else {
                    self.report_usage(i, true);
                }
            }
            _ => {}
        }
    }

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Ident(i) => {
                self.report_usage(i, false);
            }
            _ => {}
        }
    }

    fn visit_prop(&mut self, n: &Prop, _: &dyn Node) {
        n.visit_children_with(self);

        match n {
            Prop::Shorthand(i) => {
                self.report_usage(i, false);
            }
            _ => {}
        }
    }

    fn visit_for_in_stmt(&mut self, n: &ForInStmt, _: &dyn Node) {
        n.right.visit_with(n, self);

        self.with_child(ScopeKind::Block, |child| {
            n.left.visit_with(n, child);

            let ctx = Ctx {
                in_loop: true,
                ..child.ctx
            };
            n.body.visit_with(n, &mut *child.with_ctx(ctx))
        });
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(&Invalid { span: DUMMY_SP }, self);

        if e.computed {
            e.prop.visit_with(&Invalid { span: DUMMY_SP }, self);
        }

        match &e.obj {
            ExprOrSuper::Super(_) => {}
            ExprOrSuper::Expr(obj) => match &**obj {
                Expr::Ident(obj) => {
                    self.data
                        .vars
                        .entry(obj.to_id())
                        .or_default()
                        .has_property_access = true;
                }
                _ => {}
            },
        }
    }
}
