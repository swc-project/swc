use swc_atoms::js_word;
use swc_common::{collections::AHashMap, Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, ExprCtx, IsEmpty, StmtExt};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};
use swc_timer::timer;

pub use self::ctx::{CalleeKind, Ctx};
use self::storage::{Storage, *};
use crate::{
    alias::{collect_infects_from, AliasConfig},
    marks::Marks,
    util::can_end_conditionally,
};

mod ctx;
pub mod storage;

/// TODO: Track assignments to variables via `arguments`.
/// TODO: Scope-local. (Including block)
///
/// If `marks` is [None], markers are ignored.
pub fn analyze_with_storage<S, N>(n: &N, marks: Option<Marks>) -> S
where
    S: Storage,
    N: VisitWith<UsageAnalyzer<S>>,
{
    let _timer = timer!("analyze");

    let mut v = UsageAnalyzer {
        data: Default::default(),
        marks,
        scope: Default::default(),
        ctx: Default::default(),
        expr_ctx: ExprCtx {
            unresolved_ctxt: SyntaxContext::empty()
                .apply_mark(marks.map(|m| m.unresolved_mark).unwrap_or_else(Mark::new)),
            is_unresolved_ref_safe: false,
        },
        used_recursively: AHashMap::default(),
    };
    n.visit_with(&mut v);
    let top_scope = v.scope;
    v.data.top_scope().merge(top_scope.clone(), false);

    v.data.scope(SyntaxContext::empty()).merge(top_scope, false);

    v.data
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    Fn,
    Block,
}

#[derive(Debug, Clone)]
enum RecursiveUsage {
    FnOrClass,
    Var { can_ignore: bool },
}

/// This assumes there are no two variable with same name and same span hygiene.
#[derive(Debug)]
pub struct UsageAnalyzer<S>
where
    S: Storage,
{
    data: S,
    marks: Option<Marks>,
    scope: S::ScopeData,
    ctx: Ctx,
    expr_ctx: ExprCtx,
    used_recursively: AHashMap<Id, RecursiveUsage>,
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
            ctx: Ctx {
                is_top_level: false,
                ..self.ctx
            },
            expr_ctx: self.expr_ctx.clone(),
            scope: Default::default(),
            used_recursively: self.used_recursively.clone(),
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
            in_pat_of_var_decl,
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

            if in_pat_of_var_decl && in_left_of_for_loop {
                v.mark_declared_as_for_init();
            }
        } else {
            self.report_usage(i, true);
        }
    }

    fn report_usage(&mut self, i: &Ident, is_assign: bool) {
        if i.sym == js_word!("arguments") {
            self.scope.mark_used_arguments();
        }

        if !is_assign {
            if let Some(recr) = self.used_recursively.get(&i.to_id()) {
                if let RecursiveUsage::Var { can_ignore: false } = recr {
                    self.data.report_usage(self.ctx, i, is_assign);
                    self.data.var_or_default(i.to_id()).mark_used_above_decl()
                }
                self.data.var_or_default(i.to_id()).mark_used_recursively();
                return;
            }
        }

        self.data.report_usage(self.ctx, i, is_assign)
    }

    fn declare_decl(
        &mut self,
        i: &Ident,
        has_init: bool,
        kind: Option<VarDeclKind>,
        is_fn_decl: bool,
    ) -> &mut S::VarData {
        self.scope.add_declared_symbol(i);

        let v = self.data.declare_decl(self.ctx, i, has_init, kind);

        if is_fn_decl {
            v.mark_declared_as_fn_decl();
        }

        v
    }

    fn visit_in_cond<T: VisitWith<Self>>(&mut self, t: &T) {
        let cnt = self.data.get_initialized_cnt();
        t.visit_with(self);
        self.data.truncate_initialized_cnt(cnt)
    }

    fn visit_children_in_cond<T: VisitWith<Self>>(&mut self, t: &T) {
        let cnt = self.data.get_initialized_cnt();
        t.visit_children_with(self);
        self.data.truncate_initialized_cnt(cnt)
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
                    is_delete_arg: false,
                    inline_prevented: true,
                    ..child.ctx
                };
                n.params.visit_with(&mut *child.with_ctx(ctx));
            }

            match &*n.body {
                BlockStmtOrExpr::BlockStmt(body) => {
                    body.visit_with(child);
                }
                BlockStmtOrExpr::Expr(body) => {
                    body.visit_with(child);
                }
            }
        })
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_constructor(&mut self, n: &Constructor) {
        self.with_child(n.span.ctxt, ScopeKind::Fn, |child| {
            {
                let ctx = Ctx {
                    in_pat_of_param: true,
                    is_delete_arg: false,
                    ..child.ctx
                };
                n.params.visit_with(&mut *child.with_ctx(ctx));
            }

            // Bypass visit_block_stmt
            if let Some(body) = &n.body {
                body.visit_with(child);
            }
        })
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        let ctx = Ctx {
            in_assign_lhs: true,
            is_exact_reassignment: true,
            is_op_assign: n.op != op!("="),
            is_delete_arg: false,
            ..self.ctx
        };
        n.left.visit_with(&mut *self.with_ctx(ctx));

        let ctx = Ctx {
            in_assign_lhs: false,
            is_exact_reassignment: false,
            is_delete_arg: false,
            ..self.ctx
        };
        n.right.visit_with(&mut *self.with_ctx(ctx));

        if n.op == op!("=") {
            let left = match &n.left {
                PatOrExpr::Expr(left) => leftmost(left),
                PatOrExpr::Pat(left) => match &**left {
                    Pat::Ident(p) => Some(p.to_id()),
                    Pat::Expr(p) => leftmost(p),
                    _ => None,
                },
            };

            if let Some(left) = left {
                for id in collect_infects_from(
                    &n.right,
                    AliasConfig {
                        marks: self.marks,
                        ..Default::default()
                    },
                ) {
                    self.data
                        .var_or_default(left.clone())
                        .add_infects_to(id.clone());
                }
            }
        }
    }

    fn visit_assign_pat(&mut self, p: &AssignPat) {
        p.left.visit_with(self);

        {
            let ctx = Ctx {
                in_pat_of_param: false,
                is_delete_arg: false,
                var_decl_kind_of_pat: None,
                ..self.ctx
            };
            p.right.visit_with(&mut *self.with_ctx(ctx))
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_await_expr(&mut self, n: &AwaitExpr) {
        let ctx = Ctx {
            in_await_arg: true,
            is_delete_arg: false,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_block_stmt(&mut self, n: &BlockStmt) {
        self.with_child(n.span.ctxt, ScopeKind::Block, |child| {
            n.visit_children_with(child);
        });
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
                is_callee: true,
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
                in_call_arg_of: match &n.callee {
                    Callee::Expr(e) => Some(CalleeKind::from_expr(e, &self.expr_ctx)),
                    _ => Some(CalleeKind::Unknown),
                },
                is_delete_arg: false,
                is_exact_arg: true,
                is_exact_reassignment: false,
                is_callee: false,
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
                is_delete_arg: false,
                in_catch_param: true,
                ..self.ctx
            };
            n.param.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = Ctx {
                in_cond: true,
                is_delete_arg: false,
                ..self.ctx
            };
            self.with_ctx(ctx).visit_in_cond(&n.body);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_class(&mut self, n: &Class) {
        n.decorators.visit_with(self);

        {
            let ctx = Ctx {
                inline_prevented: true,
                is_delete_arg: false,
                ..self.ctx
            };
            n.super_class.visit_with(&mut *self.with_ctx(ctx));
        }

        self.with_child(n.span.ctxt, ScopeKind::Fn, |child| n.body.visit_with(child))
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
            self.with_ctx(ctx).visit_in_cond(&n.cons);
            self.with_ctx(ctx).visit_in_cond(&n.alt);
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
        n.body.visit_with(&mut *self.with_ctx(Ctx {
            is_delete_arg: false,
            executed_multiple_time: true,
            ..self.ctx
        }));
        n.test.visit_with(&mut *self.with_ctx(Ctx {
            is_delete_arg: false,
            executed_multiple_time: true,
            ..self.ctx
        }));
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
                let ids = find_pat_ids(v);

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
        let ctx = Ctx {
            in_pat_of_var_decl: false,
            in_pat_of_param: false,
            in_catch_param: false,
            var_decl_kind_of_pat: None,
            in_pat_of_var_decl_with_init: false,
            ..self.ctx
        };

        e.visit_children_with(&mut *self.with_ctx(ctx));

        if let Expr::Ident(i) = e {
            #[cfg(feature = "debug")]
            {
                // debug!(
                //     "Usage: `{}``; update = {:?}, assign_lhs = {:?} ",
                //     i,
                //     self.ctx.in_update_arg,
                //     self.ctx.in_assign_lhs
                // );
            }

            if self.ctx.in_update_arg {
                self.with_ctx(ctx).report_usage(i, true);
                self.with_ctx(ctx).report_usage(i, false);
            } else {
                let is_assign = self.ctx.in_update_arg || self.ctx.in_assign_lhs;
                self.with_ctx(ctx).report_usage(i, is_assign);
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_expr_or_spread(&mut self, e: &ExprOrSpread) {
        e.visit_children_with(self);

        if e.spread.is_some() {
            if let Expr::Ident(i) = &*e.expr {
                self.data
                    .var_or_default(i.to_id())
                    .mark_indexed_with_dynamic_key();
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_spread_element(&mut self, e: &SpreadElement) {
        e.visit_children_with(self);

        if let Expr::Ident(i) = &*e.expr {
            self.data
                .var_or_default(i.to_id())
                .mark_indexed_with_dynamic_key();
        }
    }

    fn visit_bin_expr(&mut self, e: &BinExpr) {
        if e.op.may_short_circuit() {
            e.left.visit_with(self);
            let ctx = Ctx {
                in_cond: true,
                is_delete_arg: false,
                ..self.ctx
            };
            self.with_ctx(ctx).visit_in_cond(&e.right);
        } else {
            if e.op == op!("in") {
                if let Expr::Ident(obj) = &*e.right {
                    let var = self.data.var_or_default(obj.to_id());

                    match &*e.left {
                        Expr::Lit(Lit::Str(prop)) => {
                            var.add_accessed_property(prop.value.clone());
                        }

                        _ => {
                            var.mark_indexed_with_dynamic_key();
                        }
                    }
                }
            }

            e.visit_children_with(self);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_fn_decl(&mut self, n: &FnDecl) {
        let ctx = Ctx {
            in_decl_with_no_side_effect_for_member_access: true,
            is_delete_arg: false,
            ..self.ctx
        };
        self.with_ctx(ctx).declare_decl(&n.ident, true, None, true);

        if n.function.body.is_empty() {
            self.data.var_or_default(n.ident.to_id()).mark_as_pure_fn();
        }

        let id = n.ident.to_id();
        self.used_recursively
            .insert(id.clone(), RecursiveUsage::FnOrClass);
        n.visit_children_with(self);
        self.used_recursively.remove(&id);

        {
            for id in collect_infects_from(
                &n.function,
                AliasConfig {
                    marks: self.marks,
                    ..Default::default()
                },
            ) {
                self.data
                    .var_or_default(n.ident.to_id())
                    .add_infects_to(id.clone());
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_fn_expr(&mut self, n: &FnExpr) {
        if let Some(n_id) = &n.ident {
            self.data
                .var_or_default(n_id.to_id())
                .mark_declared_as_fn_expr();

            self.used_recursively
                .insert(n_id.to_id(), RecursiveUsage::FnOrClass);

            n.visit_children_with(self);

            {
                for id in collect_infects_from(
                    &n.function,
                    AliasConfig {
                        marks: self.marks,
                        ..Default::default()
                    },
                ) {
                    self.data.var_or_default(n_id.to_id()).add_infects_to(id);
                }
            }
            self.used_recursively.remove(&n_id.to_id());
        } else {
            n.visit_children_with(self);
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_for_in_stmt(&mut self, n: &ForInStmt) {
        n.right.visit_with(self);

        self.with_child(n.span.ctxt, ScopeKind::Block, |child| {
            let ctx = Ctx {
                is_exact_reassignment: true,
                is_delete_arg: false,
                in_left_of_for_loop: true,
                ..child.ctx
            };
            n.left.visit_with(&mut *child.with_ctx(ctx));

            n.right.visit_with(child);

            let ctx = Ctx {
                is_delete_arg: false,
                executed_multiple_time: true,
                in_cond: true,
                ..child.ctx
            };

            child.with_ctx(ctx).visit_in_cond(&n.body);
        });
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_for_of_stmt(&mut self, n: &ForOfStmt) {
        n.right.visit_with(self);

        self.with_child(n.span.ctxt, ScopeKind::Block, |child| {
            let ctx = Ctx {
                in_left_of_for_loop: true,
                is_exact_reassignment: true,
                is_delete_arg: false,
                ..child.ctx
            };
            n.left.visit_with(&mut *child.with_ctx(ctx));

            let ctx = Ctx {
                executed_multiple_time: true,
                in_cond: true,
                is_delete_arg: false,
                ..child.ctx
            };
            child.with_ctx(ctx).visit_in_cond(&n.body);
        });
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_for_stmt(&mut self, n: &ForStmt) {
        n.init.visit_with(self);

        let ctx = Ctx {
            executed_multiple_time: true,
            in_cond: true,
            is_delete_arg: false,
            ..self.ctx
        };

        self.with_ctx(ctx).visit_in_cond(&n.test);
        self.with_ctx(ctx).visit_in_cond(&n.update);
        self.with_ctx(ctx).visit_in_cond(&n.body);
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
            is_delete_arg: false,
            ..self.ctx
        };
        n.test.visit_with(self);

        self.with_ctx(ctx).visit_in_cond(&n.cons);
        self.with_ctx(ctx).visit_in_cond(&n.alt);
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
                is_callee: false,
                ..self.ctx
            };
            e.obj.visit_with(&mut *self.with_ctx(ctx));
        }

        if let MemberProp::Computed(c) = &e.prop {
            let ctx = Ctx {
                is_exact_arg: false,
                is_exact_reassignment: false,
                is_callee: false,
                is_delete_arg: false,
                ..self.ctx
            };
            c.visit_with(&mut *self.with_ctx(ctx));
        }
        if let Expr::Ident(obj) = &*e.obj {
            let v = self.data.var_or_default(obj.to_id());
            v.mark_has_property_access();

            if self.ctx.is_callee {
                v.mark_indexed_with_dynamic_key();
            }

            if let MemberProp::Computed(..) = e.prop {
                v.mark_indexed_with_dynamic_key();
            }

            if let MemberProp::Ident(prop) = &e.prop {
                v.add_accessed_property(prop.sym.clone());
            }

            if self.ctx.in_assign_lhs || self.ctx.is_delete_arg {
                self.data.mark_property_mutattion(obj.to_id(), self.ctx)
            }
        }
    }

    fn visit_module(&mut self, n: &Module) {
        let ctx = Ctx {
            skip_standalone: true,
            is_top_level: true,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx))
    }

    fn visit_script(&mut self, n: &Script) {
        let ctx = Ctx {
            skip_standalone: true,
            is_top_level: true,
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
                in_call_arg_of: Some(CalleeKind::from_expr(&n.callee, &self.expr_ctx)),
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
                    in_decl_with_no_side_effect_for_member_access: false,
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
    fn visit_method_prop(&mut self, n: &MethodProp) {
        n.function.decorators.visit_with(self);

        self.with_child(n.function.span.ctxt, ScopeKind::Fn, |a| {
            n.key.visit_with(a);
            {
                let ctx = Ctx {
                    in_pat_of_param: true,
                    ..a.ctx
                };
                n.function.params.visit_with(&mut *a.with_ctx(ctx));
            }

            n.function.visit_with(a);
        });
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_getter_prop(&mut self, n: &GetterProp) {
        self.with_child(n.span.ctxt, ScopeKind::Fn, |a| {
            n.key.visit_with(a);

            n.body.visit_with(a);
        });
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_class_method(&mut self, n: &ClassMethod) {
        n.function.decorators.visit_with(self);

        self.with_child(n.function.span.ctxt, ScopeKind::Fn, |a| {
            n.key.visit_with(a);
            {
                let ctx = Ctx {
                    in_pat_of_param: true,
                    ..a.ctx
                };
                n.function.params.visit_with(&mut *a.with_ctx(ctx));
            }

            n.function.visit_with(a);
        });
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_private_method(&mut self, n: &PrivateMethod) {
        n.function.decorators.visit_with(self);

        self.with_child(n.function.span.ctxt, ScopeKind::Fn, |a| {
            n.key.visit_with(a);
            {
                let ctx = Ctx {
                    in_pat_of_param: true,
                    ..a.ctx
                };
                n.function.params.visit_with(&mut *a.with_ctx(ctx));
            }

            n.function.visit_with(a);
        });
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_stmt(&mut self, n: &Stmt) {
        let ctx = Ctx {
            in_update_arg: false,
            is_callee: false,
            in_call_arg_of: None,
            in_assign_lhs: false,
            in_await_arg: false,
            is_delete_arg: false,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_stmts(&mut self, stmts: &[Stmt]) {
        let mut had_cond = false;

        for stmt in stmts {
            let ctx = Ctx {
                in_cond: self.ctx.in_cond || had_cond,
                is_delete_arg: false,
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
                is_delete_arg: false,
                ..self.ctx
            };
            c.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_switch_stmt(&mut self, n: &SwitchStmt) {
        n.discriminant.visit_with(self);

        let mut fallthrough = false;

        for case in n.cases.iter() {
            let ctx = Ctx {
                is_delete_arg: false,
                in_cond: true,
                ..self.ctx
            };
            if fallthrough {
                self.with_ctx(ctx).visit_in_cond(&case.test);
                self.with_ctx(ctx).visit_in_cond(&case.cons);
            } else {
                self.with_ctx(ctx).visit_in_cond(case);
            }
            fallthrough = !case.cons.terminates()
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_try_stmt(&mut self, n: &TryStmt) {
        let ctx = Ctx {
            in_cond: true,
            is_delete_arg: false,
            ..self.ctx
        };

        self.with_ctx(ctx).visit_children_in_cond(n);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_update_expr(&mut self, n: &UpdateExpr) {
        let ctx = Ctx {
            in_update_arg: true,
            is_exact_reassignment: true,
            is_delete_arg: false,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_unary_expr(&mut self, n: &UnaryExpr) {
        let ctx = Ctx {
            in_update_arg: false,
            is_exact_reassignment: false,
            is_delete_arg: n.op == op!("delete"),
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_var_decl(&mut self, n: &VarDecl) {
        let ctx = Ctx {
            var_decl_kind_of_pat: Some(n.kind),
            is_callee: false,
            in_call_arg_of: None,
            in_assign_lhs: false,
            in_await_arg: false,
            is_delete_arg: false,
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));

        for decl in &n.decls {
            if let (Pat::Ident(var), Some(init)) = (&decl.name, decl.init.as_deref()) {
                for id in collect_infects_from(
                    init,
                    AliasConfig {
                        marks: self.marks,
                        ..Default::default()
                    },
                ) {
                    self.data
                        .var_or_default(var.to_id())
                        .add_infects_to(id.clone());
                }
            }
        }
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
                in_decl_with_no_side_effect_for_member_access: e
                    .init
                    .as_deref()
                    .map(is_safe_to_access_prop)
                    .unwrap_or(false),
                is_delete_arg: false,
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

            if let Some(..) = &self.marks {
                if let VarDeclarator {
                    name: Pat::Ident(id),
                    init: Some(..),
                    definite: false,
                    ..
                } = e
                {
                    let id = id.to_id();
                    self.used_recursively
                        .insert(id.clone(), RecursiveUsage::Var { can_ignore: false });
                    e.init.visit_with(&mut *self.with_ctx(ctx));
                    self.used_recursively.remove(&id);
                    return;
                }
            }

            e.init.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_while_stmt(&mut self, n: &WhileStmt) {
        n.test.visit_with(&mut *self.with_ctx(Ctx {
            executed_multiple_time: true,
            is_delete_arg: false,
            ..self.ctx
        }));
        let ctx = Ctx {
            executed_multiple_time: true,
            in_cond: true,
            is_delete_arg: false,
            ..self.ctx
        };

        self.with_ctx(ctx).visit_in_cond(&n.body);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, n)))]
    fn visit_with_stmt(&mut self, n: &WithStmt) {
        self.scope.mark_with_stmt();
        n.visit_children_with(self);
    }
}

fn leftmost(p: &Expr) -> Option<Id> {
    match p {
        Expr::Ident(i) => Some(i.to_id()),
        Expr::Member(MemberExpr { obj, .. }) => leftmost(obj),
        _ => None,
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
