use swc_atoms::{js_word, JsWord};
use swc_common::{
    collections::{AHashMap, AHashSet},
    SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike, Id, IsEmpty};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};
use swc_timer::timer;

use self::{
    alias::{AliasAnalyzer, AliasData},
    ctx::Ctx,
    storage::{Storage, *},
};
use crate::{marks::Marks, util::can_end_conditionally};

pub(crate) mod alias;
mod ctx;
pub(crate) mod storage;
#[cfg(test)]
mod tests;

pub(crate) fn analyze<N>(n: &N, marks: Option<Marks>) -> ProgramData
where
    N: VisitWith<UsageAnalyzer>,
    N: for<'a> VisitWith<AliasAnalyzer<'a>>,
{
    analyze_with_storage::<ProgramData, _>(n, marks)
}

/// TODO: Track assignments to variables via `arguments`.
/// TODO: Scope-local. (Including block)
///
/// If `marks` is [None], markers are ignored.
pub(crate) fn analyze_with_storage<S, N>(n: &N, marks: Option<Marks>) -> S
where
    S: Storage,
    N: VisitWith<UsageAnalyzer<S>>,
    N: for<'a> VisitWith<AliasAnalyzer<'a>>,
{
    let _timer = timer!("analyze");

    let mut data = S::default();

    n.visit_with(&mut AliasAnalyzer {
        data: &mut data.alias_data(),
    });

    let mut v = UsageAnalyzer {
        data,
        marks,
        scope: Default::default(),
        ctx: Default::default(),
    };
    n.visit_with(&mut v);
    let top_scope = v.scope;
    v.data.top_scope().merge(top_scope.clone(), false);

    v.data.scope(SyntaxContext::empty()).merge(top_scope, false);

    v.data
}

#[derive(Debug, Default, Clone)]
pub(crate) struct VarUsageInfo {
    pub inline_prevented: bool,

    /// The number of reference to this identifier.
    pub ref_count: usize,

    /// `true` if a variable is conditionally initialized.
    pub cond_init: bool,

    /// `false` if it's only used.
    pub declared: bool,
    pub declared_count: usize,

    /// `true` if the enclosing function defines this variable as a parameter.
    pub declared_as_fn_param: bool,

    pub declared_as_fn_expr: bool,

    pub assign_count: usize,
    pub mutation_by_call_count: usize,
    /// ## Things to note
    ///
    /// - Update is counted as usage
    pub usage_count: usize,

    /// The variable itself is modified.
    pub reassigned_with_assignment: bool,
    pub reassigned_with_var_decl: bool,
    /// The variable itself or a property of it is modified.
    pub mutated: bool,

    pub has_property_access: bool,
    pub has_property_mutation: bool,
    pub accessed_props: AHashSet<JsWord>,

    pub exported: bool,
    /// True if used **above** the declaration. (Not eval order).
    pub used_above_decl: bool,
    /// `true` if it's declared by function parameters or variables declared in
    /// a closest function and used only within it and not used by child
    /// functions.
    pub is_fn_local: bool,

    used_by_nested_fn: bool,

    pub executed_multiple_time: bool,
    pub used_in_cond: bool,

    pub var_kind: Option<VarDeclKind>,
    pub var_initialized: bool,

    pub declared_as_catch_param: bool,

    pub no_side_effect_for_member_access: bool,

    pub used_as_callee: bool,

    pub used_as_arg: bool,

    pub pure_fn: bool,
}

impl VarUsageInfo {
    pub fn is_mutated_only_by_one_call(&self) -> bool {
        self.assign_count == 0 && self.mutation_by_call_count == 1
    }

    pub fn reassigned(&self) -> bool {
        self.reassigned_with_assignment || self.reassigned_with_var_decl
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum ScopeKind {
    Fn,
    Block,
}

#[derive(Debug, Default, Clone)]
pub(crate) struct ScopeData {
    pub has_with_stmt: bool,
    pub has_eval_call: bool,
    pub used_arguments: bool,
}

/// Analyzed info of a whole program we are working on.
#[derive(Debug, Default)]
pub(crate) struct ProgramData {
    pub alias: AliasData,

    pub vars: AHashMap<Id, VarUsageInfo>,

    pub top: ScopeData,

    pub scopes: AHashMap<SyntaxContext, ScopeData>,
}

impl ProgramData {
    pub(crate) fn contains_unresolved(&self, e: &Expr) -> bool {
        match e {
            Expr::Ident(i) => {
                if let Some(v) = self.vars.get(&i.to_id()) {
                    return !v.declared;
                }

                true
            }

            Expr::Member(MemberExpr { obj, prop, .. }) => {
                if self.contains_unresolved(obj) {
                    return true;
                }

                if let MemberProp::Computed(prop) = prop {
                    if self.contains_unresolved(&prop.expr) {
                        return true;
                    }
                }

                false
            }

            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                args,
                ..
            }) => {
                if self.contains_unresolved(callee) {
                    return true;
                }

                if args.iter().any(|arg| self.contains_unresolved(&arg.expr)) {
                    return true;
                }

                false
            }

            _ => false,
        }
    }
}

/// This assumes there are no two variable with same name and same span hygiene.
#[derive(Debug)]
pub(crate) struct UsageAnalyzer<S = ProgramData>
where
    S: Storage,
{
    data: S,
    marks: Option<Marks>,
    scope: S::ScopeData,
    ctx: Ctx,
}

impl<S> UsageAnalyzer<S>
where
    S: Storage,
{
    fn with_child<F, Ret>(&mut self, child_ctxt: SyntaxContext, kind: ScopeKind, op: F) -> Ret
    where
        F: FnOnce(&mut UsageAnalyzer<S>) -> Ret,
    {
        let mut child = UsageAnalyzer {
            data: Default::default(),
            marks: self.marks,
            ctx: self.ctx,
            scope: Default::default(),
        };

        let ret = op(&mut child);
        {
            let child_scope = child.data.scope(child_ctxt);

            child_scope.merge(child.scope.clone(), false);
        }

        self.scope.merge(child.scope, true);
        self.data.merge(kind, child.data);

        ret
    }

    fn visit_pat_id(&mut self, i: &Ident) {
        let Ctx {
            in_left_of_for_loop,
            in_pat_of_param,
            ..
        } = self.ctx;

        if self.ctx.in_pat_of_var_decl || self.ctx.in_pat_of_param || self.ctx.in_catch_param {
            let v = self.declare_decl(
                i,
                self.ctx.in_pat_of_var_decl_with_init,
                self.ctx.var_decl_kind_of_pat,
                false,
            );

            if in_pat_of_param {
                v.mark_declared_as_fn_param();
            }

            if in_left_of_for_loop {
                v.mark_reassigned_with_assign();
                v.mark_mutated();
            }
        } else {
            self.report_usage(i, true);
        }
    }

    fn report_usage(&mut self, i: &Ident, is_assign: bool) {
        if i.sym == js_word!("arguments") {
            self.scope.mark_used_arguments();
        }

        self.data.report_usage(self.ctx, i, is_assign)
    }

    fn declare_decl(
        &mut self,
        i: &Ident,
        has_init: bool,
        kind: Option<VarDeclKind>,
        _is_fn_decl: bool,
    ) -> &mut S::VarData {
        self.scope.add_declared_symbol(i);

        self.data.declare_decl(self.ctx, i, has_init, kind)
    }
}

impl<S> Visit for UsageAnalyzer<S>
where
    S: Storage,
{
    noop_visit_type!();

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        self.with_child(n.span.ctxt, ScopeKind::Fn, |child| {
            {
                let ctx = Ctx {
                    in_pat_of_param: true,
                    ..child.ctx
                };
                n.params.visit_with(&mut *child.with_ctx(ctx));
            }

            match &n.body {
                BlockStmtOrExpr::BlockStmt(body) => {
                    body.visit_with(child);
                }
                BlockStmtOrExpr::Expr(body) => {
                    body.visit_with(child);
                }
            }
        })
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        let ctx = Ctx {
            in_assign_lhs: true,
            is_exact_reassignment: true,
            is_op_assign: n.op != op!("="),
            ..self.ctx
        };
        n.left.visit_with(&mut *self.with_ctx(ctx));

        let ctx = Ctx {
            in_assign_lhs: false,
            is_exact_reassignment: false,
            ..self.ctx
        };
        n.right.visit_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_await_expr(&mut self, n: &AwaitExpr) {
        let ctx = Ctx {
            in_await_arg: true,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_block_stmt(&mut self, n: &BlockStmt) {
        self.with_child(n.span.ctxt, ScopeKind::Block, |child| {
            n.visit_children_with(child);
        })
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_call_expr(&mut self, n: &CallExpr) {
        let inline_prevented = self.ctx.inline_prevented
            || self
                .marks
                .map(|marks| n.span.has_mark(marks.noinline))
                .unwrap_or_default();

        {
            let ctx = Ctx {
                inline_prevented,
                ..self.ctx
            };
            n.callee.visit_with(&mut *self.with_ctx(ctx));
        }

        if let Callee::Expr(callee) = &n.callee {
            if let Expr::Ident(callee) = &**callee {
                self.data
                    .var_or_default(callee.to_id())
                    .mark_used_as_callee();
            }

            match &**callee {
                Expr::Fn(callee) => {
                    for (idx, p) in callee.function.params.iter().enumerate() {
                        if let Some(arg) = n.args.get(idx) {
                            if arg.spread.is_some() {
                                break;
                            }

                            if is_safe_to_access_prop(&arg.expr) {
                                if let Pat::Ident(id) = &p.pat {
                                    self.data
                                        .var_or_default(id.to_id())
                                        .mark_initialized_with_safe_value();
                                }
                            }
                        }
                    }
                }

                Expr::Arrow(callee) => {
                    for (idx, p) in callee.params.iter().enumerate() {
                        if let Some(arg) = n.args.get(idx) {
                            if arg.spread.is_some() {
                                break;
                            }

                            if is_safe_to_access_prop(&arg.expr) {
                                if let Pat::Ident(id) = &p {
                                    self.data
                                        .var_or_default(id.to_id())
                                        .mark_initialized_with_safe_value();
                                }
                            }
                        }
                    }
                }

                _ => {}
            }
        }

        {
            let ctx = Ctx {
                inline_prevented,
                in_call_arg: true,
                is_exact_arg: true,
                is_exact_reassignment: false,
                ..self.ctx
            };
            n.args.visit_with(&mut *self.with_ctx(ctx));
        }

        for arg in &n.args {
            if let Expr::Ident(arg) = &*arg.expr {
                self.data.var_or_default(arg.to_id()).mark_used_as_arg();
            }
        }

        if let Callee::Expr(callee) = &n.callee {
            match &**callee {
                Expr::Ident(Ident { sym, .. }) if *sym == *"eval" => {
                    self.scope.mark_eval_called();
                }
                _ => {}
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_catch_clause(&mut self, n: &CatchClause) {
        {
            let ctx = Ctx {
                in_cond: true,
                in_catch_param: true,
                ..self.ctx
            };
            n.param.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                in_cond: true,
                ..self.ctx
            };
            n.body.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_class(&mut self, n: &Class) {
        n.decorators.visit_with(self);

        {
            let ctx = Ctx {
                inline_prevented: true,
                ..self.ctx
            };
            n.super_class.visit_with(&mut *self.with_ctx(ctx));
        }

        n.body.visit_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_class_decl(&mut self, n: &ClassDecl) {
        self.declare_decl(&n.ident, true, None, false);

        n.visit_children_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_class_expr(&mut self, n: &ClassExpr) {
        n.visit_children_with(self);

        if let Some(id) = &n.ident {
            self.declare_decl(id, true, None, false);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_cond_expr(&mut self, n: &CondExpr) {
        n.test.visit_with(self);

        {
            let ctx = Ctx {
                in_cond: true,
                ..self.ctx
            };
            n.cons.visit_with(&mut *self.with_ctx(ctx));
            n.alt.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_default_decl(&mut self, d: &DefaultDecl) {
        d.visit_children_with(self);

        match d {
            DefaultDecl::Class(c) => {
                if let Some(i) = &c.ident {
                    self.data.var_or_default(i.to_id()).prevent_inline();
                }
            }
            DefaultDecl::Fn(f) => {
                if let Some(i) = &f.ident {
                    self.data.var_or_default(i.to_id()).prevent_inline();
                }
            }
            _ => {}
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt) {
        let ctx = Ctx {
            executed_multiple_time: true,
            in_cond: true,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_export_decl(&mut self, n: &ExportDecl) {
        n.visit_children_with(self);

        match &n.decl {
            Decl::Class(c) => {
                self.data.var_or_default(c.ident.to_id()).prevent_inline();
            }
            Decl::Fn(f) => {
                self.data.var_or_default(f.ident.to_id()).prevent_inline();
            }
            Decl::Var(v) => {
                let ids = find_ids(v);

                for id in ids {
                    self.data.var_or_default(id).prevent_inline();
                }
            }
            _ => {}
        }
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        match &n.orig {
            ModuleExportName::Ident(orig) => {
                self.report_usage(orig, false);
                self.data.var_or_default(orig.to_id()).prevent_inline();
            }
            ModuleExportName::Str(..) => {}
        };
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, e)))]
    fn visit_expr(&mut self, e: &Expr) {
        e.visit_children_with(self);

        if let Expr::Ident(i) = e {
            if cfg!(feature = "debug") {
                // debug!(
                //     "Usage: `{}``; update = {:?}, assign_lhs = {:?} ",
                //     i,
                //     self.ctx.in_update_arg,
                //     self.ctx.in_assign_lhs
                // );
            }

            if self.ctx.in_update_arg {
                self.report_usage(i, true);
                self.report_usage(i, false);
            } else {
                self.report_usage(i, self.ctx.in_update_arg || self.ctx.in_assign_lhs);
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_fn_decl(&mut self, n: &FnDecl) {
        self.declare_decl(&n.ident, true, None, true);

        if n.function.body.is_empty() {
            self.data.var_or_default(n.ident.to_id()).mark_as_pure_fn();
        }

        n.visit_children_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_fn_expr(&mut self, n: &FnExpr) {
        n.visit_children_with(self);

        if let Some(id) = &n.ident {
            self.data
                .var_or_default(id.to_id())
                .mark_declared_as_fn_expr();
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_for_in_stmt(&mut self, n: &ForInStmt) {
        n.right.visit_with(self);

        self.with_child(n.span.ctxt, ScopeKind::Block, |child| {
            let ctx = Ctx {
                in_left_of_for_loop: true,
                is_exact_reassignment: true,
                ..child.ctx
            };
            n.left.visit_with(&mut *child.with_ctx(ctx));

            n.right.visit_with(child);

            let ctx = Ctx {
                executed_multiple_time: true,
                in_cond: true,
                ..child.ctx
            };
            n.body.visit_with(&mut *child.with_ctx(ctx));
        });
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_for_of_stmt(&mut self, n: &ForOfStmt) {
        n.right.visit_with(self);

        self.with_child(n.span.ctxt, ScopeKind::Block, |child| {
            let ctx = Ctx {
                in_left_of_for_loop: true,
                is_exact_reassignment: true,
                ..child.ctx
            };
            n.left.visit_with(&mut *child.with_ctx(ctx));

            let ctx = Ctx {
                executed_multiple_time: true,
                in_cond: true,
                ..child.ctx
            };
            n.body.visit_with(&mut *child.with_ctx(ctx))
        });
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_for_stmt(&mut self, n: &ForStmt) {
        n.init.visit_with(self);

        let ctx = Ctx {
            executed_multiple_time: true,
            in_cond: true,
            ..self.ctx
        };

        n.test.visit_with(&mut *self.with_ctx(ctx));
        n.update.visit_with(&mut *self.with_ctx(ctx));

        n.body.visit_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_function(&mut self, n: &Function) {
        n.decorators.visit_with(self);

        let is_standalone = self
            .marks
            .map(|marks| n.span.has_mark(marks.standalone))
            .unwrap_or_default();

        // We don't dig into standalone function, as it does not share any variable with
        // outer scope.
        if self.ctx.skip_standalone && is_standalone {
            return;
        }

        let ctx = Ctx {
            skip_standalone: self.ctx.skip_standalone || is_standalone,
            in_update_arg: false,
            ..self.ctx
        };

        self.with_ctx(ctx)
            .with_child(n.span.ctxt, ScopeKind::Fn, |child| {
                n.params.visit_with(child);

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

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_if_stmt(&mut self, n: &IfStmt) {
        let ctx = Ctx {
            in_cond: true,
            ..self.ctx
        };
        n.test.visit_with(self);
        n.cons.visit_with(&mut *self.with_ctx(ctx));
        n.alt.visit_with(&mut *self.with_ctx(ctx));
    }

    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier) {
        self.declare_decl(&n.local, true, None, false);
    }

    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier) {
        self.declare_decl(&n.local, true, None, false);
    }

    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier) {
        self.declare_decl(&n.local, true, None, false);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, e)))]
    fn visit_member_expr(&mut self, e: &MemberExpr) {
        {
            let ctx = Ctx {
                is_exact_arg: false,
                is_exact_reassignment: false,
                ..self.ctx
            };
            e.obj.visit_with(&mut *self.with_ctx(ctx));
        }

        if let MemberProp::Computed(c) = &e.prop {
            let ctx = Ctx {
                is_exact_arg: false,
                is_exact_reassignment: false,
                ..self.ctx
            };
            c.visit_with(&mut *self.with_ctx(ctx));
        }
        if let Expr::Ident(obj) = &*e.obj {
            let v = self.data.var_or_default(obj.to_id());
            v.mark_has_property_access();

            if self.ctx.in_assign_lhs {
                v.mark_has_property_mutation();
            }

            if let MemberProp::Ident(prop) = &e.prop {
                v.add_accessed_property(prop.sym.clone());
            }
        }
    }

    fn visit_module(&mut self, n: &Module) {
        let ctx = Ctx {
            skip_standalone: true,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx))
    }

    fn visit_named_export(&mut self, n: &NamedExport) {
        if n.src.is_some() {
            return;
        }
        n.visit_children_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_new_expr(&mut self, n: &NewExpr) {
        {
            n.callee.visit_with(self);
            let ctx = Ctx {
                in_call_arg: true,
                is_exact_arg: true,
                ..self.ctx
            };
            n.args.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_object_pat_prop(&mut self, n: &ObjectPatProp) {
        n.visit_children_with(self);

        if let ObjectPatProp::Assign(p) = n {
            self.visit_pat_id(&p.key);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_param(&mut self, n: &Param) {
        let ctx = Ctx {
            in_pat_of_param: false,
            ..self.ctx
        };
        n.decorators.visit_with(&mut *self.with_ctx(ctx));

        let ctx = Ctx {
            in_pat_of_param: true,
            var_decl_kind_of_pat: None,
            ..self.ctx
        };
        n.pat.visit_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_pat(&mut self, n: &Pat) {
        match n {
            Pat::Ident(..) => {
                n.visit_children_with(self);
            }
            _ => {
                let ctx = Ctx {
                    in_var_decl_with_no_side_effect_for_member_access: false,
                    ..self.ctx
                };
                n.visit_children_with(&mut *self.with_ctx(ctx));
            }
        }

        if let Pat::Ident(i) = n {
            self.visit_pat_id(&i.id)
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_pat_or_expr(&mut self, n: &PatOrExpr) {
        match n {
            PatOrExpr::Expr(e) => {
                if let Expr::Ident(i) = &**e {
                    self.visit_pat_id(i)
                } else {
                    e.visit_with(self);
                }
            }
            PatOrExpr::Pat(p) => {
                p.visit_with(self);
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_prop(&mut self, n: &Prop) {
        let ctx = Ctx {
            is_exact_arg: false,
            is_exact_reassignment: false,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));

        if let Prop::Shorthand(i) = n {
            self.report_usage(i, false);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_setter_prop(&mut self, n: &SetterProp) {
        self.with_child(n.span.ctxt, ScopeKind::Fn, |a| {
            n.key.visit_with(a);
            {
                let ctx = Ctx {
                    in_pat_of_param: true,
                    ..a.ctx
                };
                n.param.visit_with(&mut *a.with_ctx(ctx));
            }

            n.body.visit_with(a);
        });
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_stmt(&mut self, n: &Stmt) {
        let ctx = Ctx {
            in_update_arg: false,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_stmts(&mut self, stmts: &[Stmt]) {
        let mut had_cond = false;

        for stmt in stmts {
            let ctx = Ctx {
                in_cond: self.ctx.in_cond || had_cond,
                ..self.ctx
            };

            stmt.visit_with(&mut *self.with_ctx(ctx));

            had_cond |= can_end_conditionally(stmt);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, e)))]
    fn visit_super_prop_expr(&mut self, e: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &e.prop {
            let ctx = Ctx {
                is_exact_arg: false,
                is_exact_reassignment: false,
                ..self.ctx
            };
            c.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_switch_case(&mut self, n: &SwitchCase) {
        n.test.visit_with(self);

        {
            let ctx = Ctx {
                in_cond: true,
                ..self.ctx
            };
            n.cons.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_try_stmt(&mut self, n: &TryStmt) {
        let ctx = Ctx {
            in_cond: true,
            ..self.ctx
        };

        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_update_expr(&mut self, n: &UpdateExpr) {
        let ctx = Ctx {
            in_update_arg: true,
            is_exact_reassignment: true,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_var_decl(&mut self, n: &VarDecl) {
        let ctx = Ctx {
            var_decl_kind_of_pat: Some(n.kind),
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, e)))]
    fn visit_var_declarator(&mut self, e: &VarDeclarator) {
        let prevent_inline = matches!(
            &e.name,
            Pat::Ident(BindingIdent {
                id: Ident {
                    sym: js_word!("arguments"),
                    ..
                },
                ..
            })
        );
        {
            let ctx = Ctx {
                inline_prevented: self.ctx.inline_prevented || prevent_inline,
                in_pat_of_var_decl: true,
                in_pat_of_var_decl_with_init: e.init.is_some(),
                in_var_decl_with_no_side_effect_for_member_access: e
                    .init
                    .as_deref()
                    .map(is_safe_to_access_prop)
                    .unwrap_or(false),
                ..self.ctx
            };
            e.name.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                inline_prevented: self.ctx.inline_prevented || prevent_inline,
                in_pat_of_var_decl: false,
                ..self.ctx
            };

            e.init.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_while_stmt(&mut self, n: &WhileStmt) {
        let ctx = Ctx {
            executed_multiple_time: true,
            in_cond: true,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_with_stmt(&mut self, n: &WithStmt) {
        self.scope.mark_with_stmt();
        n.visit_children_with(self);
    }
}

// Support for pure_getters
fn is_safe_to_access_prop(e: &Expr) -> bool {
    match e {
        Expr::Lit(Lit::Null(..)) => false,
        Expr::Lit(..) | Expr::Array(..) | Expr::Fn(..) | Expr::Arrow(..) | Expr::Update(..) => true,
        _ => false,
    }
}
