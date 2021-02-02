use self::ctx::Ctx;
use fxhash::FxHashMap;
use fxhash::FxHashSet;
use std::collections::hash_map::Entry;
use swc_atoms::JsWord;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Id;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

mod ctx;

pub(crate) fn analyze<N>(n: &N) -> ProgramData
where
    N: VisitWith<UsageAnalyzer>,
{
    let mut v = UsageAnalyzer {
        data: Default::default(),
        scope: Default::default(),
        ctx: Default::default(),
    };
    n.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
    let top_scope = v.scope;
    v.data.top = top_scope;

    v.data
}

#[derive(Debug, Default)]
pub(crate) struct VarUsageInfo {
    /// # of reference to this identifier.
    pub ref_count: usize,

    /// `true` if a varaible is conditionally initialized.
    pub cond_init: bool,

    /// `false` if it's only used.
    pub declared: bool,

    /// `true` if the enclosing function defines this variable as a parameter.
    pub declared_as_fn_param: bool,

    pub assign_count: usize,
    pub usage_count: usize,

    pub reassigned: bool,

    pub has_property_access: bool,
    pub accessed_props: FxHashSet<JsWord>,

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

#[derive(Debug, Default, Clone)]
pub(crate) struct ScopeData {
    pub has_with_stmt: bool,
    pub has_eval_call: bool,
}

/// Analyzed info of a whole program we are working on.
#[derive(Debug, Default)]
pub(crate) struct ProgramData {
    pub vars: FxHashMap<Id, VarUsageInfo>,

    pub top: ScopeData,

    pub scopes: FxHashMap<SyntaxContext, ScopeData>,
}

impl ProgramData {
    fn merge(&mut self, kind: ScopeKind, child: ProgramData) {
        for (ctxt, scope) in child.scopes {
            let to = self.scopes.entry(ctxt).or_default();
            to.has_with_stmt |= scope.has_with_stmt;
            to.has_eval_call |= scope.has_eval_call;

            self.top.has_with_stmt |= scope.has_with_stmt;
            self.top.has_eval_call |= scope.has_eval_call;
        }

        for (id, var_info) in child.vars {
            match self.vars.entry(id) {
                Entry::Occupied(mut e) => {
                    e.get_mut().ref_count += var_info.ref_count;
                    e.get_mut().cond_init |= var_info.cond_init;
                    e.get_mut().reassigned |= var_info.reassigned;
                    e.get_mut().has_property_access |= var_info.has_property_access;
                    e.get_mut().exported |= var_info.exported;

                    e.get_mut().declared |= var_info.declared;
                    e.get_mut().declared_as_fn_param |= var_info.declared_as_fn_param;

                    // If a var is registered at a parent scope, it means that it's delcared before
                    // usages.
                    //
                    // e.get_mut().used_above_decl |= var_info.used_above_decl;
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
#[derive(Debug)]
pub(crate) struct UsageAnalyzer {
    data: ProgramData,
    scope: ScopeData,
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
            scope: Default::default(),
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

    fn declare_decl(&mut self, i: &Ident, has_init: bool) -> &mut VarUsageInfo {
        let v = self
            .data
            .vars
            .entry(i.to_id())
            .or_insert_with(|| VarUsageInfo {
                is_fn_local: true,
                ..Default::default()
            });

        v.declared = true;
        if self.ctx.in_cond && has_init {
            v.cond_init = true;
        }

        v
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
            in_pat_of_var_decl_with_init: e.init.is_some(),
            ..self.ctx
        };
        e.name.visit_with(e, &mut *self.with_ctx(ctx));

        e.init.visit_with(e, self);
    }

    fn visit_class_decl(&mut self, n: &ClassDecl, _: &dyn Node) {
        self.declare_decl(&n.ident, true);

        n.visit_children_with(self);
    }

    fn visit_fn_decl(&mut self, n: &FnDecl, _: &dyn Node) {
        self.declare_decl(&n.ident, true);

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

        let Ctx {
            in_left_of_for_loop,
            in_pat_of_param,
            ..
        } = self.ctx;

        match n {
            Pat::Ident(i) => {
                if self.ctx.in_pat_of_var_decl || self.ctx.in_pat_of_param {
                    let v = self.declare_decl(i, self.ctx.in_pat_of_var_decl_with_init);

                    if in_pat_of_param {
                        v.declared_as_fn_param = true;
                    }

                    if in_left_of_for_loop {
                        v.reassigned = true;
                    }
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
                self.report_usage(i, self.ctx.in_update_arg || self.ctx.in_assign_lhs);
            }
            _ => {}
        }
    }

    fn visit_stmt(&mut self, n: &Stmt, _: &dyn Node) {
        let ctx = Ctx {
            in_update_arg: false,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_prop(&mut self, n: &Prop, _: &dyn Node) {
        let ctx = Ctx {
            in_update_arg: false,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));

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
            let ctx = Ctx {
                in_left_of_for_loop: true,
                ..child.ctx
            };
            n.left.visit_with(n, &mut *child.with_ctx(ctx));

            let ctx = Ctx {
                in_loop: true,
                ..child.ctx
            };
            n.body.visit_with(n, &mut *child.with_ctx(ctx))
        });
    }

    fn visit_for_of_stmt(&mut self, n: &ForOfStmt, _: &dyn Node) {
        n.right.visit_with(n, self);

        self.with_child(ScopeKind::Block, |child| {
            let ctx = Ctx {
                in_left_of_for_loop: true,
                ..child.ctx
            };
            n.left.visit_with(n, &mut *child.with_ctx(ctx));

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
                    let v = self.data.vars.entry(obj.to_id()).or_default();
                    v.has_property_access = true;
                    if !e.computed {
                        match &*e.prop {
                            Expr::Ident(prop) => {
                                v.accessed_props.insert(prop.sym.clone());
                            }
                            _ => {}
                        }
                    }
                }
                _ => {}
            },
        }
    }

    fn visit_if_stmt(&mut self, n: &IfStmt, _: &dyn Node) {
        let ctx = Ctx {
            in_cond: true,
            ..self.ctx
        };
        n.test.visit_with(n, self);
        n.cons.visit_with(n, &mut *self.with_ctx(ctx));
        n.alt.visit_with(n, &mut *self.with_ctx(ctx));
    }

    fn visit_assign_expr(&mut self, n: &AssignExpr, _: &dyn Node) {
        let ctx = Ctx {
            in_assign_lhs: true,
            ..self.ctx
        };
        n.left.visit_with(n, &mut *self.with_ctx(ctx));

        n.right.visit_with(n, self);
    }

    fn visit_update_expr(&mut self, n: &UpdateExpr, _: &dyn Node) {
        let ctx = Ctx {
            in_update_arg: true,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_try_stmt(&mut self, n: &TryStmt, _: &dyn Node) {
        let ctx = Ctx {
            in_cond: true,
            ..self.ctx
        };

        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_catch_clause(&mut self, n: &CatchClause, _: &dyn Node) {
        let ctx = Ctx {
            in_cond: true,
            ..self.ctx
        };

        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_call_expr(&mut self, n: &CallExpr, _: &dyn Node) {
        n.visit_children_with(self);

        match &n.callee {
            ExprOrSuper::Expr(callee) => match &**callee {
                Expr::Ident(Ident { sym, .. }) if *sym == *"eval" => {
                    self.scope.has_eval_call = true;
                }
                _ => {}
            },
            _ => {}
        }
    }

    fn visit_with_stmt(&mut self, n: &WithStmt, _: &dyn Node) {
        self.scope.has_with_stmt = true;
        n.visit_children_with(self);
    }
}
