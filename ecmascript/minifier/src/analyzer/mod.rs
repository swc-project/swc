use self::ctx::Ctx;
use crate::util::can_end_conditionally;
use crate::util::idents_used_by;
use fxhash::FxHashMap;
use fxhash::FxHashSet;
use std::collections::hash_map::Entry;
use swc_atoms::JsWord;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::find_ids;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Id;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

mod ctx;

/// TODO: Track assignments to variables via `arguments`.
/// TODO: Scope-local. (Including block)
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
    v.data.top.merge(top_scope, false);

    v.data
}

#[derive(Debug, Default)]
pub(crate) struct VarUsageInfo {
    /// The number of reference to this identifier.
    pub ref_count: usize,

    /// `true` if a varaible is conditionally initialized.
    pub cond_init: bool,

    /// `false` if it's only used.
    pub declared: bool,
    pub declared_count: usize,

    /// `true` if the enclosing function defines this variable as a parameter.
    pub declared_as_fn_param: bool,

    pub assign_count: usize,
    pub mutation_by_call_count: usize,
    pub usage_count: usize,

    /// The variable itself is modified.
    pub reassigned: bool,
    /// The variable itself or a property of it is modified.
    pub mutated: bool,

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

    pub var_kind: Option<VarDeclKind>,
    pub var_initialized: bool,

    pub declared_as_catch_param: bool,

    /// TODO: Implement this.
    ///
    /// Indicates a variable or function is overrided without using it.
    pub overriden_without_used: bool,

    pub no_side_effect_for_member_access: bool,

    /// In `c = b`, `b` inffects `c`.
    infects: Vec<Id>,
}

impl VarUsageInfo {
    pub fn is_mutated_only_by_one_call(&self) -> bool {
        self.assign_count == 0 && self.mutation_by_call_count == 1
    }
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

    /// Variables declared in the scope.
    pub declared_symbols: FxHashMap<JsWord, FxHashSet<SyntaxContext>>,
}

impl ScopeData {
    fn merge(&mut self, other: ScopeData, is_child: bool) {
        self.has_with_stmt |= other.has_with_stmt;
        self.has_eval_call |= other.has_eval_call;

        if !is_child {
            for (k, v) in other.declared_symbols {
                self.declared_symbols.entry(k).or_default().extend(v);
            }
        }
    }
}

/// Analyzed info of a whole program we are working on.
#[derive(Debug, Default)]
pub(crate) struct ProgramData {
    pub vars: FxHashMap<Id, VarUsageInfo>,

    pub top: ScopeData,

    pub scopes: FxHashMap<SyntaxContext, ScopeData>,

    /// { dependant: [dependendcies] }
    var_deps: FxHashMap<Id, FxHashSet<Id>>,
}

impl ProgramData {
    fn merge(&mut self, kind: ScopeKind, child: ProgramData) {
        for (ctxt, scope) in child.scopes {
            let to = self.scopes.entry(ctxt).or_default();
            self.top.merge(scope.clone(), true);

            to.merge(scope, false);
        }

        for (id, var_info) in child.vars {
            match self.vars.entry(id) {
                Entry::Occupied(mut e) => {
                    e.get_mut().ref_count += var_info.ref_count;
                    e.get_mut().cond_init |= var_info.cond_init;

                    e.get_mut().reassigned |= var_info.reassigned;
                    e.get_mut().mutated |= var_info.mutated;

                    e.get_mut().has_property_access |= var_info.has_property_access;
                    e.get_mut().exported |= var_info.exported;

                    e.get_mut().declared |= var_info.declared;
                    e.get_mut().declared_count += var_info.declared_count;
                    e.get_mut().declared_as_fn_param |= var_info.declared_as_fn_param;

                    // If a var is registered at a parent scope, it means that it's delcared before
                    // usages.
                    //
                    // e.get_mut().used_above_decl |= var_info.used_above_decl;
                    e.get_mut().used_in_loop |= var_info.used_in_loop;
                    e.get_mut().assign_count += var_info.assign_count;
                    e.get_mut().mutation_by_call_count += var_info.mutation_by_call_count;
                    e.get_mut().usage_count += var_info.usage_count;

                    e.get_mut().declared_as_catch_param |= var_info.declared_as_catch_param;

                    e.get_mut().infects.extend(var_info.infects);

                    e.get_mut().no_side_effect_for_member_access =
                        e.get_mut().no_side_effect_for_member_access
                            && var_info.no_side_effect_for_member_access;

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

    /// TODO: Make this recursive
    #[allow(unused)]
    pub fn deps(&self, id: &Id) -> FxHashSet<Id> {
        self.var_deps.get(id).cloned().unwrap_or_default()
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
    fn with_child<F, Ret>(&mut self, child_ctxt: SyntaxContext, kind: ScopeKind, op: F) -> Ret
    where
        F: FnOnce(&mut UsageAnalyzer) -> Ret,
    {
        let mut child = UsageAnalyzer {
            data: Default::default(),
            ctx: self.ctx,
            scope: Default::default(),
        };

        let ret = op(&mut child);
        {
            let child_scope = child.data.scopes.entry(child_ctxt).or_default();

            child_scope.merge(child.scope, false);
        }

        self.data.merge(kind, child.data);

        ret
    }

    fn report(&mut self, i: Id, is_modify: bool, dejavu: &mut FxHashSet<Id>) {
        let is_first = dejavu.is_empty();

        if !dejavu.insert(i.clone()) {
            return;
        }

        let e = self.data.vars.entry(i).or_insert_with(|| VarUsageInfo {
            used_above_decl: true,
            ..Default::default()
        });

        e.ref_count += 1;
        e.reassigned |= is_first && is_modify && self.ctx.is_exact_reassignment;
        // Passing object as a argument is possibly modification.
        e.mutated |= is_modify || (self.ctx.in_call_arg && self.ctx.is_exact_arg);
        e.used_in_loop |= self.ctx.in_loop;

        if is_modify && self.ctx.is_exact_reassignment {
            e.assign_count += 1;

            for other in e.infects.clone() {
                self.report(other, true, dejavu)
            }
        } else {
            if self.ctx.in_call_arg && self.ctx.is_exact_arg {
                e.mutation_by_call_count += 1;
            }

            e.usage_count += 1;
        }
    }

    fn report_usage(&mut self, i: &Ident, is_assign: bool) {
        self.report(i.to_id(), is_assign, &mut Default::default());
    }

    fn declare_decl(
        &mut self,
        i: &Ident,
        has_init: bool,
        kind: Option<VarDeclKind>,
    ) -> &mut VarUsageInfo {
        let ctx = self.ctx;

        let v = self
            .data
            .vars
            .entry(i.to_id())
            .and_modify(|v| {
                if has_init {
                    v.mutated = true;
                    v.reassigned = true;
                    v.assign_count += 1;
                }
            })
            .or_insert_with(|| VarUsageInfo {
                is_fn_local: true,
                var_kind: kind,
                var_initialized: has_init,
                no_side_effect_for_member_access: ctx
                    .in_var_decl_with_no_side_effect_for_member_access,

                ..Default::default()
            });
        self.scope
            .declared_symbols
            .entry(i.sym.clone())
            .or_default()
            .insert(i.span.ctxt);

        v.declared_count += 1;
        v.declared = true;
        if self.ctx.in_cond && has_init {
            v.cond_init = true;
        }
        v.declared_as_catch_param |= self.ctx.in_catch_param;

        v
    }
}

impl Visit for UsageAnalyzer {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, n: &ArrowExpr, _: &dyn Node) {
        self.with_child(n.span.ctxt, ScopeKind::Fn, |child| {
            {
                let ctx = Ctx {
                    in_pat_of_param: true,
                    ..child.ctx
                };
                n.params.visit_with(n, &mut *child.with_ctx(ctx));
            }

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

    fn visit_assign_expr(&mut self, n: &AssignExpr, _: &dyn Node) {
        let ctx = Ctx {
            in_assign_lhs: true,
            is_exact_reassignment: true,
            ..self.ctx
        };
        n.left.visit_with(n, &mut *self.with_ctx(ctx));

        n.right.visit_with(n, self);
    }

    fn visit_block_stmt(&mut self, n: &BlockStmt, _: &dyn Node) {
        self.with_child(n.span.ctxt, ScopeKind::Block, |child| {
            n.visit_children_with(child);
        })
    }

    fn visit_call_expr(&mut self, n: &CallExpr, _: &dyn Node) {
        {
            n.callee.visit_with(n, self);
            let ctx = Ctx {
                in_call_arg: true,
                is_exact_arg: true,
                ..self.ctx
            };
            n.args.visit_with(n, &mut *self.with_ctx(ctx));
        }

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

    fn visit_catch_clause(&mut self, n: &CatchClause, _: &dyn Node) {
        {
            let ctx = Ctx {
                in_cond: true,
                in_catch_param: true,
                ..self.ctx
            };
            n.param.visit_with(n, &mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                in_cond: true,
                ..self.ctx
            };
            n.body.visit_with(n, &mut *self.with_ctx(ctx));
        }
    }

    fn visit_class_decl(&mut self, n: &ClassDecl, _: &dyn Node) {
        self.declare_decl(&n.ident, true, None);

        n.visit_children_with(self);
    }

    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt, _: &dyn Node) {
        let ctx = Ctx {
            in_loop: true,
            in_cond: true,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _: &dyn Node) {
        self.report_usage(&n.orig, false)
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

    fn visit_fn_decl(&mut self, n: &FnDecl, _: &dyn Node) {
        self.declare_decl(&n.ident, true, None);

        n.visit_children_with(self);
    }

    fn visit_for_in_stmt(&mut self, n: &ForInStmt, _: &dyn Node) {
        n.right.visit_with(n, self);

        self.with_child(n.span.ctxt, ScopeKind::Block, |child| {
            let ctx = Ctx {
                in_left_of_for_loop: true,
                is_exact_reassignment: true,
                ..child.ctx
            };
            n.left.visit_with(n, &mut *child.with_ctx(ctx));

            let ctx = Ctx {
                in_loop: true,
                in_cond: true,
                ..child.ctx
            };
            n.body.visit_with(n, &mut *child.with_ctx(ctx))
        });
    }

    fn visit_for_of_stmt(&mut self, n: &ForOfStmt, _: &dyn Node) {
        n.right.visit_with(n, self);

        self.with_child(n.span.ctxt, ScopeKind::Block, |child| {
            let ctx = Ctx {
                in_left_of_for_loop: true,
                is_exact_reassignment: true,
                ..child.ctx
            };
            n.left.visit_with(n, &mut *child.with_ctx(ctx));

            let ctx = Ctx {
                in_loop: true,
                in_cond: true,
                ..child.ctx
            };
            n.body.visit_with(n, &mut *child.with_ctx(ctx))
        });
    }

    fn visit_for_stmt(&mut self, n: &ForStmt, _: &dyn Node) {
        n.init.visit_with(n, self);

        let ctx = Ctx {
            in_loop: true,
            in_cond: true,
            ..self.ctx
        };

        n.test.visit_with(n, &mut *self.with_ctx(ctx));
        n.update.visit_with(n, &mut *self.with_ctx(ctx));

        n.body.visit_with(n, &mut *self.with_ctx(ctx));
    }

    fn visit_function(&mut self, n: &Function, _: &dyn Node) {
        n.decorators.visit_with(n, self);

        self.with_child(n.span.ctxt, ScopeKind::Fn, |child| {
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

    fn visit_if_stmt(&mut self, n: &IfStmt, _: &dyn Node) {
        let ctx = Ctx {
            in_cond: true,
            ..self.ctx
        };
        n.test.visit_with(n, self);
        n.cons.visit_with(n, &mut *self.with_ctx(ctx));
        n.alt.visit_with(n, &mut *self.with_ctx(ctx));
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        {
            let ctx = Ctx {
                is_exact_arg: false,
                is_exact_reassignment: false,
                ..self.ctx
            };
            e.obj
                .visit_with(&Invalid { span: DUMMY_SP }, &mut *self.with_ctx(ctx));
        }

        if e.computed {
            let ctx = Ctx {
                is_exact_arg: false,
                is_exact_reassignment: false,
                ..self.ctx
            };
            e.prop
                .visit_with(&Invalid { span: DUMMY_SP }, &mut *self.with_ctx(ctx));
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

    fn visit_named_export(&mut self, n: &NamedExport, _: &dyn Node) {
        if n.src.is_some() {
            return;
        }
        n.visit_children_with(self);
    }

    fn visit_new_expr(&mut self, n: &NewExpr, _: &dyn Node) {
        {
            n.callee.visit_with(n, self);
            let ctx = Ctx {
                in_call_arg: true,
                is_exact_arg: true,
                ..self.ctx
            };
            n.args.visit_with(n, &mut *self.with_ctx(ctx));
        }
    }

    fn visit_param(&mut self, n: &Param, _: &dyn Node) {
        let ctx = Ctx {
            in_pat_of_param: false,
            ..self.ctx
        };
        n.decorators.visit_with(n, &mut *self.with_ctx(ctx));

        let ctx = Ctx {
            in_pat_of_param: true,
            var_decl_kind_of_pat: None,
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
                if self.ctx.in_pat_of_var_decl
                    || self.ctx.in_pat_of_param
                    || self.ctx.in_catch_param
                {
                    let v = self.declare_decl(
                        &i.id,
                        self.ctx.in_pat_of_var_decl_with_init,
                        self.ctx.var_decl_kind_of_pat,
                    );

                    if in_pat_of_param {
                        v.declared_as_fn_param = true;
                    }

                    if in_left_of_for_loop {
                        v.reassigned = true;
                        v.mutated = true;
                    }
                } else {
                    self.report_usage(&i.id, true);
                }
            }
            _ => {}
        }
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

    fn visit_setter_prop(&mut self, n: &SetterProp, _: &dyn Node) {
        self.with_child(n.span.ctxt, ScopeKind::Fn, |a| {
            n.key.visit_with(n, a);
            {
                let ctx = Ctx {
                    in_pat_of_param: true,
                    ..a.ctx
                };
                n.param.visit_with(n, &mut *a.with_ctx(ctx));
            }

            n.body.visit_with(n, a);
        });
    }

    fn visit_stmt(&mut self, n: &Stmt, _: &dyn Node) {
        let ctx = Ctx {
            in_update_arg: false,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_stmts(&mut self, stmts: &[Stmt], _: &dyn Node) {
        let mut had_cond = false;

        for n in stmts {
            let ctx = Ctx {
                in_cond: self.ctx.in_cond || had_cond,
                ..self.ctx
            };

            n.visit_with(&Invalid { span: DUMMY_SP }, &mut *self.with_ctx(ctx));

            had_cond |= can_end_conditionally(n);
        }
    }

    fn visit_switch_case(&mut self, n: &SwitchCase, _: &dyn Node) {
        n.test.visit_with(n, self);

        {
            let ctx = Ctx {
                in_cond: true,
                ..self.ctx
            };
            n.cons.visit_with(n, &mut *self.with_ctx(ctx));
        }
    }

    fn visit_try_stmt(&mut self, n: &TryStmt, _: &dyn Node) {
        let ctx = Ctx {
            in_cond: true,
            ..self.ctx
        };

        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_update_expr(&mut self, n: &UpdateExpr, _: &dyn Node) {
        let ctx = Ctx {
            in_update_arg: true,
            is_exact_reassignment: true,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_var_decl(&mut self, n: &VarDecl, _: &dyn Node) {
        let ctx = Ctx {
            var_decl_kind_of_pat: Some(n.kind),
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));

        for decl in &n.decls {
            match (&decl.name, decl.init.as_deref()) {
                (Pat::Ident(var), Some(init)) => {
                    let used_idents = idents_used_by(init);

                    for id in used_idents {
                        self.data
                            .vars
                            .entry(id.clone())
                            .or_default()
                            .infects
                            .push(var.to_id());

                        self.data
                            .vars
                            .entry(var.to_id())
                            .or_default()
                            .infects
                            .push(id);
                    }
                }
                _ => {}
            }
        }
    }

    fn visit_var_declarator(&mut self, e: &VarDeclarator, _: &dyn Node) {
        let ctx = Ctx {
            in_pat_of_var_decl: true,
            in_pat_of_var_decl_with_init: e.init.is_some(),
            in_var_decl_with_no_side_effect_for_member_access: match e.init.as_deref() {
                Some(Expr::Array(..) | Expr::Lit(..)) => true,
                _ => false,
            },
            ..self.ctx
        };
        e.name.visit_with(e, &mut *self.with_ctx(ctx));

        let declared_names: Vec<Id> = find_ids(&e.name);
        let used_names = idents_used_by(&e.init);

        for name in declared_names {
            self.data
                .var_deps
                .entry(name)
                .or_default()
                .extend(used_names.clone());
        }

        e.init.visit_with(e, self);
    }

    fn visit_while_stmt(&mut self, n: &WhileStmt, _: &dyn Node) {
        let ctx = Ctx {
            in_loop: true,
            in_cond: true,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_with_stmt(&mut self, n: &WithStmt, _: &dyn Node) {
        self.scope.has_with_stmt = true;
        n.visit_children_with(self);
    }
}
