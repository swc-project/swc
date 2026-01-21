use ctx::BitContext;
use rustc_hash::FxHashMap;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::{
    find_pat_ids, ident::IdentLike, ExprCtx, ExprExt, IsEmpty, StmtExt, Type, Value,
};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};
use swc_timer::timer;

pub use self::ctx::Ctx;
use self::storage::*;
use crate::{
    alias::{collect_infects_from, AliasConfig},
    marks::Marks,
    util::{can_end_conditionally, get_object_define_property_name_arg},
};

mod ctx;
pub mod storage;

pub fn analyze_with_custom_storage<S, N>(data: S, n: &N, marks: Option<Marks>) -> S
where
    S: Storage,
    N: VisitWith<UsageAnalyzer<S>>,
{
    let _timer = timer!("analyze");

    let mut v = UsageAnalyzer {
        data,
        marks,
        scope: Default::default(),
        ctx: Default::default(),
        expr_ctx: ExprCtx {
            unresolved_ctxt: SyntaxContext::empty()
                .apply_mark(marks.map(|m| m.unresolved_mark).unwrap_or_default()),
            is_unresolved_ref_safe: false,
            in_strict: false,
            remaining_depth: 3,
            pure_getters: false,
        },
        used_recursively: FxHashMap::default(),
    };
    n.visit_with(&mut v);

    let mut top_scope = v.scope;
    for scope in v.data.scopes() {
        top_scope.merge(scope.clone(), true);
    }

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
    used_recursively: FxHashMap<Id, RecursiveUsage>,
}

impl<S> UsageAnalyzer<S>
where
    S: Storage,
{
    fn with_child<F, Ret>(&mut self, child_ctxt: SyntaxContext, kind: ScopeKind, op: F) -> Ret
    where
        F: FnOnce(&mut UsageAnalyzer<S>) -> Ret,
    {
        let used_recursively = std::mem::take(&mut self.used_recursively);

        let child_data = self.data.new_child();
        let mut child = UsageAnalyzer {
            data: child_data,
            marks: self.marks,
            ctx: self.ctx.with(BitContext::IsTopLevel, false),
            expr_ctx: self.expr_ctx,
            scope: Default::default(),
            used_recursively,
        };

        let ret = op(&mut child);
        {
            let child_scope = child.data.scope(child_ctxt);
            child_scope.merge(child.scope.clone(), false);
        }

        self.scope.merge(child.scope, true);
        self.data.merge(kind, child.data);

        self.used_recursively = child.used_recursively;

        ret
    }

    fn visit_pat_id(&mut self, i: &Ident) {
        let in_left_of_for_loop = self.ctx.bit_ctx.contains(BitContext::InLeftOfForLoop);
        let in_pat_of_param = self.ctx.bit_ctx.contains(BitContext::InPatOfParam);
        let in_pat_of_var_decl = self.ctx.bit_ctx.contains(BitContext::InPatOfVarDecl);
        let in_catch_param = self.ctx.bit_ctx.contains(BitContext::InCatchParam);

        if in_pat_of_var_decl || in_pat_of_param || in_catch_param {
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
            self.report_usage(i);
        }
    }

    fn report_usage(&mut self, i: &Ident) {
        if i.sym == "arguments" {
            self.scope.mark_used_arguments();
        }

        let i = i.to_id();

        if let Some(recr) = self.used_recursively.get(&i) {
            if let RecursiveUsage::Var { can_ignore: false } = recr {
                self.data.report_usage(self.ctx, i.clone());
                self.data.var_or_default(i.clone()).mark_used_above_decl()
            }
            self.data.var_or_default(i.clone()).mark_used_recursively();
            return;
        }

        self.data.report_usage(self.ctx, i)
    }

    fn report_assign_pat(&mut self, p: &Pat, is_read_modify: bool) {
        for id in find_pat_ids(p) {
            // It's hard to determined the type of pat assignment
            self.data
                .report_assign(self.ctx, id, is_read_modify, Value::Unknown)
        }

        if let Pat::Expr(e) = p {
            self.mark_mutation_if_member(e.as_member());
        }
    }

    fn report_assign_expr_if_ident(&mut self, e: Option<&Ident>, is_op: bool, ty: Value<Type>) {
        if let Some(i) = e {
            self.data.report_assign(self.ctx, i.to_id(), is_op, ty)
        }
    }

    fn declare_decl(
        &mut self,
        i: &Ident,
        init_type: Option<Value<Type>>,
        kind: Option<VarDeclKind>,
        is_fn_decl: bool,
    ) -> &mut S::VarData {
        self.scope.add_declared_symbol(i);

        let v = self.data.declare_decl(self.ctx, i, init_type, kind);

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

    fn mark_mutation_if_member(&mut self, e: Option<&MemberExpr>) {
        if let Some(m) = e {
            for_each_id_ref_in_expr(&m.obj, &mut |id| {
                self.data.mark_property_mutation(id.to_id())
            });
        }
    }
}

impl<S> Visit for UsageAnalyzer<S>
where
    S: Storage,
{
    noop_visit_type!();

    fn visit_array_lit(&mut self, n: &ArrayLit) {
        let ctx = self.ctx.with(BitContext::IsIdRef, true);
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        self.with_child(n.ctxt, ScopeKind::Fn, |child| {
            {
                let ctx = child
                    .ctx
                    .with(BitContext::InPatOfParam, true)
                    .with(BitContext::InlinePrevented, true);
                n.params.visit_with(&mut *child.with_ctx(ctx));
            }

            match &*n.body {
                BlockStmtOrExpr::BlockStmt(body) => {
                    body.visit_with(child);
                }
                BlockStmtOrExpr::Expr(body) => {
                    body.visit_with(child);
                }
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            }
        })
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        let is_op_assign = n.op != op!("=");
        n.left.visit_with(self);

        // We mark bar in
        //
        // foo[i] = bar
        //
        // as `used_as_ref`.
        let ctx = self.ctx.with(
            BitContext::IsIdRef,
            matches!(n.op, op!("=") | op!("||=") | op!("&&=") | op!("??=")),
        );
        n.right.visit_with(&mut *self.with_ctx(ctx));

        match &n.left {
            AssignTarget::Pat(p) => {
                for id in find_pat_ids(p) {
                    self.data.report_assign(
                        self.ctx,
                        id,
                        is_op_assign,
                        n.right.get_type(self.expr_ctx),
                    )
                }
            }
            AssignTarget::Simple(e) => {
                self.report_assign_expr_if_ident(
                    e.as_ident().map(Ident::from).as_ref(),
                    is_op_assign,
                    n.right.get_type(self.expr_ctx),
                );
                self.mark_mutation_if_member(e.as_member())
            }
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        };

        if n.op == op!("=") {
            let left = match &n.left {
                AssignTarget::Simple(left) => left.leftmost().map(Ident::to_id),
                AssignTarget::Pat(..) => None,
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            };

            if let Some(left) = left {
                let mut v = None;
                for id in collect_infects_from(
                    &n.right,
                    AliasConfig {
                        marks: self.marks,
                        ignore_named_child_scope: true,
                        ..Default::default()
                    },
                ) {
                    if v.is_none() {
                        v = Some(self.data.var_or_default(left.to_id()));
                    }

                    v.as_mut().unwrap().add_infects_to(id.clone());
                }
            }
        }
    }

    fn visit_assign_pat(&mut self, p: &AssignPat) {
        p.left.visit_with(self);

        {
            let ctx = Ctx {
                bit_ctx: self.ctx.bit_ctx.with(BitContext::InPatOfParam, false),
                var_decl_kind_of_pat: None,
                ..self.ctx
            };
            p.right.visit_with(&mut *self.with_ctx(ctx))
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_await_expr(&mut self, n: &AwaitExpr) {
        let ctx = self.ctx.with(BitContext::InAwaitArg, true);
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_bin_expr(&mut self, e: &BinExpr) {
        if e.op.may_short_circuit() {
            let ctx = self.ctx.with(BitContext::IsIdRef, true);
            e.left.visit_with(&mut *self.with_ctx(ctx));
            let ctx = self
                .ctx
                .with(BitContext::InCond, true)
                .with(BitContext::IsIdRef, true);
            self.with_ctx(ctx).visit_in_cond(&e.right);
        } else {
            if e.op == op!("in") {
                for_each_id_ref_in_expr(&e.right, &mut |obj| {
                    let var = self.data.var_or_default(obj.to_id());
                    var.mark_used_as_ref();

                    match &*e.left {
                        Expr::Lit(Lit::Str(prop)) => {
                            if prop
                                .value
                                .as_str()
                                .map_or(true, |value| value.parse::<f64>().is_err())
                            {
                                var.add_accessed_property(prop.value.clone());
                            }
                        }

                        Expr::Lit(Lit::Num(_)) => {}
                        _ => {
                            var.mark_indexed_with_dynamic_key();
                        }
                    }
                })
            }

            let ctx = self.ctx.with(BitContext::IsIdRef, false);
            e.visit_children_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_binding_ident(&mut self, n: &BindingIdent) {
        self.visit_pat_id(&Ident::from(n));
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_block_stmt(&mut self, n: &BlockStmt) {
        self.with_child(n.ctxt, ScopeKind::Block, |child| {
            n.visit_children_with(child);
        });
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_call_expr(&mut self, n: &CallExpr) {
        if let Some(prop_name) = get_object_define_property_name_arg(n) {
            self.data.add_property_atom(prop_name.value.clone());
        }

        let inline_prevented = self.ctx.bit_ctx.contains(BitContext::InlinePrevented)
            || self
                .marks
                .map(|marks| n.ctxt.has_mark(marks.noinline))
                .unwrap_or_default();

        {
            let ctx = self.ctx.with(BitContext::InlinePrevented, inline_prevented);
            n.callee.visit_with(&mut *self.with_ctx(ctx));
        }

        if let Callee::Expr(callee) = &n.callee {
            for_each_id_ref_in_expr(callee, &mut |i| {
                self.data.var_or_default(i.to_id()).mark_used_as_callee();
            });

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
            let ctx = self
                .ctx
                .with(BitContext::InlinePrevented, inline_prevented)
                .with(BitContext::IsIdRef, true);
            n.args.visit_with(&mut *self.with_ctx(ctx));

            let call_may_mutate = match &n.callee {
                Callee::Expr(e) => call_may_mutate(e, self.expr_ctx),
                _ => true,
            };

            if call_may_mutate {
                for a in &n.args {
                    for_each_id_ref_in_expr(&a.expr, &mut |id| {
                        self.data.mark_property_mutation(id.to_id());
                    });
                }
            }
        }

        for arg in &n.args {
            for_each_id_ref_in_expr(&arg.expr, &mut |arg| {
                self.data.var_or_default(arg.to_id()).mark_used_as_arg();
            })
        }

        if let Callee::Expr(callee) = &n.callee {
            match &**callee {
                Expr::Ident(Ident { sym, .. }) if *sym == *"eval" => {
                    self.scope.mark_eval_called();
                }
                Expr::Member(m) if !m.obj.is_ident() => {
                    for_each_id_ref_in_expr(&m.obj, &mut |id| {
                        self.data.var_or_default(id.to_id()).mark_used_as_ref()
                    })
                }
                _ => {}
            }
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_catch_clause(&mut self, n: &CatchClause) {
        {
            let ctx = self
                .ctx
                .with(BitContext::InCond, true)
                .with(BitContext::InCatchParam, true);
            n.param.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = self.ctx.with(BitContext::InCond, true);
            self.with_ctx(ctx).visit_in_cond(&n.body);
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_class(&mut self, n: &Class) {
        n.decorators.visit_with(self);

        {
            let ctx = self.ctx.with(BitContext::InlinePrevented, true);
            n.super_class.visit_with(&mut *self.with_ctx(ctx));
        }

        self.with_child(n.ctxt, ScopeKind::Fn, |child| n.body.visit_with(child))
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_class_decl(&mut self, n: &ClassDecl) {
        self.declare_decl(&n.ident, Some(Value::Unknown), None, false);

        n.visit_children_with(self);
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_class_expr(&mut self, n: &ClassExpr) {
        n.visit_children_with(self);

        if let Some(id) = &n.ident {
            self.declare_decl(id, Some(Value::Unknown), None, false);
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_class_method(&mut self, n: &ClassMethod) {
        n.function.decorators.visit_with(self);

        self.with_child(n.function.ctxt, ScopeKind::Fn, |a| {
            n.key.visit_with(a);
            {
                let ctx = a.ctx.with(BitContext::InPatOfParam, true);
                n.function.params.visit_with(&mut *a.with_ctx(ctx));
            }

            n.function.visit_with(a);
        });
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_class_prop(&mut self, n: &ClassProp) {
        let ctx = self.ctx.with(BitContext::IsIdRef, true);

        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_computed_prop_name(&mut self, n: &ComputedPropName) {
        let ctx = self.ctx.with(BitContext::IsIdRef, true);

        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_cond_expr(&mut self, n: &CondExpr) {
        {
            let ctx = self.ctx.with(BitContext::IsIdRef, false);

            n.test.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = self
                .ctx
                .with(BitContext::InCond, true)
                .with(BitContext::IsIdRef, true);
            self.with_ctx(ctx).visit_in_cond(&n.cons);
            self.with_ctx(ctx).visit_in_cond(&n.alt);
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_constructor(&mut self, n: &Constructor) {
        self.with_child(n.ctxt, ScopeKind::Fn, |child| {
            {
                let ctx = child.ctx.with(BitContext::InPatOfParam, true);
                n.params.visit_with(&mut *child.with_ctx(ctx));
            }

            // Bypass visit_block_stmt
            if let Some(body) = &n.body {
                body.visit_with(child);
            }
        })
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

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt) {
        n.body
            .visit_with(&mut *self.with_ctx(self.ctx.with(BitContext::ExecutedMultipleTime, true)));
        n.test
            .visit_with(&mut *self.with_ctx(self.ctx.with(BitContext::ExecutedMultipleTime, true)));
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
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
                    self.data.var_or_default(id).mark_as_exported();
                }
            }
            _ => {}
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr) {
        let ctx = self.ctx.with(BitContext::IsIdRef, true);

        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        match &n.orig {
            ModuleExportName::Ident(orig) => {
                self.report_usage(orig);
                let v = self.data.var_or_default(orig.to_id());
                v.prevent_inline();
                v.mark_used_as_ref();
            }
            ModuleExportName::Str(..) => {}
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        };
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip(self, e))
    )]
    fn visit_expr(&mut self, e: &Expr) {
        let ctx = Ctx {
            bit_ctx: self
                .ctx
                .bit_ctx
                .with(BitContext::InPatOfVarDecl, false)
                .with(BitContext::InPatOfParam, false)
                .with(BitContext::InCatchParam, false),
            var_decl_kind_of_pat: None,
            in_pat_of_var_decl_with_init: None,
            ..self.ctx
        };

        e.visit_children_with(&mut *self.with_ctx(ctx));

        if let Expr::Ident(i) = e {
            #[cfg(feature = "tracing-spans")]
            {
                // debug!(
                //     "Usage: `{}``; update = {:?}, assign_lhs = {:?} ",
                //     i,
                //     self.ctx.in_update_arg,
                //     self.ctx.in_assign_lhs
                // );
            }

            self.with_ctx(ctx).report_usage(i);
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_expr_or_spread(&mut self, e: &ExprOrSpread) {
        e.visit_children_with(self);

        if e.spread.is_some() {
            for_each_id_ref_in_expr(&e.expr, &mut |i| {
                self.data
                    .var_or_default(i.to_id())
                    .mark_indexed_with_dynamic_key();
            });
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_fn_decl(&mut self, n: &FnDecl) {
        let ctx = self
            .ctx
            .with(BitContext::InDeclWithNoSideEffectForMemberAccess, true);
        self.with_ctx(ctx)
            .declare_decl(&n.ident, Some(Value::Known(Type::Obj)), None, true);

        if n.function.body.is_empty() {
            self.data.var_or_default(n.ident.to_id()).mark_as_pure_fn();
        }

        let id = n.ident.to_id();
        self.used_recursively
            .insert(id.clone(), RecursiveUsage::FnOrClass);
        n.visit_children_with(self);
        self.used_recursively.remove(&id);

        {
            let mut v = None;
            for id in collect_infects_from(
                &n.function,
                AliasConfig {
                    marks: self.marks,
                    ignore_named_child_scope: true,
                    ..Default::default()
                },
            ) {
                if v.is_none() {
                    v = Some(self.data.var_or_default(n.ident.to_id()));
                }

                v.as_mut().unwrap().add_infects_to(id.clone());
            }
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_fn_expr(&mut self, n: &FnExpr) {
        if let Some(n_id) = &n.ident {
            self.data
                .var_or_default(n_id.to_id())
                .mark_declared_as_fn_expr();

            self.used_recursively
                .insert(n_id.to_id(), RecursiveUsage::FnOrClass);

            n.visit_children_with(self);

            {
                let mut v = None;
                for id in collect_infects_from(
                    &n.function,
                    AliasConfig {
                        marks: self.marks,
                        ignore_named_child_scope: true,
                        ..Default::default()
                    },
                ) {
                    if v.is_none() {
                        v = Some(self.data.var_or_default(n_id.to_id()));
                    }

                    v.as_mut().unwrap().add_infects_to(id);
                }
            }
            self.used_recursively.remove(&n_id.to_id());
        } else {
            n.visit_children_with(self);
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_for_in_stmt(&mut self, n: &ForInStmt) {
        n.right.visit_with(self);

        self.with_child(SyntaxContext::empty(), ScopeKind::Block, |child| {
            let head_ctx = child
                .ctx
                .with(BitContext::InLeftOfForLoop, true)
                .with(BitContext::IsIdRef, true)
                .with(BitContext::ExecutedMultipleTime, true)
                .with(BitContext::InCond, true);
            n.left.visit_with(&mut *child.with_ctx(head_ctx));

            n.right.visit_with(child);

            if let ForHead::Pat(pat) = &n.left {
                child.with_ctx(head_ctx).report_assign_pat(pat, true)
            }

            let ctx = child
                .ctx
                .with(BitContext::ExecutedMultipleTime, true)
                .with(BitContext::InCond, true);

            child.with_ctx(ctx).visit_in_cond(&n.body);
        });
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_for_of_stmt(&mut self, n: &ForOfStmt) {
        n.right.visit_with(self);

        self.with_child(SyntaxContext::empty(), ScopeKind::Block, |child| {
            let head_ctx = child
                .ctx
                .with(BitContext::InLeftOfForLoop, true)
                .with(BitContext::IsIdRef, true)
                .with(BitContext::ExecutedMultipleTime, true)
                .with(BitContext::InCond, true);
            n.left.visit_with(&mut *child.with_ctx(head_ctx));

            if let ForHead::Pat(pat) = &n.left {
                child.with_ctx(head_ctx).report_assign_pat(pat, true)
            }

            let ctx = child
                .ctx
                .with(BitContext::ExecutedMultipleTime, true)
                .with(BitContext::InCond, true);
            child.with_ctx(ctx).visit_in_cond(&n.body);
        });
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_for_stmt(&mut self, n: &ForStmt) {
        n.init.visit_with(self);

        let ctx = self
            .ctx
            .with(BitContext::ExecutedMultipleTime, true)
            .with(BitContext::InCond, true);

        self.with_ctx(ctx).visit_in_cond(&n.test);
        self.with_ctx(ctx).visit_in_cond(&n.update);
        self.with_ctx(ctx).visit_in_cond(&n.body);
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_function(&mut self, n: &Function) {
        n.decorators.visit_with(self);

        let ctx = Ctx { ..self.ctx };

        self.with_ctx(ctx)
            .with_child(n.ctxt, ScopeKind::Fn, |child| {
                n.params.visit_with(child);

                if let Some(body) = &n.body {
                    // We use visit_children_with instead of visit_with to bypass block scope
                    // handler.
                    body.visit_children_with(child);
                }
            })
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_getter_prop(&mut self, n: &GetterProp) {
        self.with_child(SyntaxContext::empty(), ScopeKind::Fn, |a| {
            n.key.visit_with(a);

            n.body.visit_with(a);
        });
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_if_stmt(&mut self, n: &IfStmt) {
        let ctx = self.ctx.with(BitContext::InCond, true);
        n.test.visit_with(self);

        self.with_ctx(ctx).visit_in_cond(&n.cons);
        self.with_ctx(ctx).visit_in_cond(&n.alt);
    }

    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier) {
        self.declare_decl(&n.local, Some(Value::Unknown), None, false);
    }

    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier) {
        self.declare_decl(&n.local, Some(Value::Unknown), None, false);
    }

    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier) {
        self.declare_decl(&n.local, Some(Value::Unknown), None, false);
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_jsx_element_name(&mut self, n: &JSXElementName) {
        let ctx = Ctx {
            bit_ctx: self
                .ctx
                .bit_ctx
                .with(BitContext::InPatOfVarDecl, false)
                .with(BitContext::InPatOfParam, false)
                .with(BitContext::InCatchParam, false),
            var_decl_kind_of_pat: None,
            in_pat_of_var_decl_with_init: None,
            ..self.ctx
        };

        n.visit_children_with(&mut *self.with_ctx(ctx));

        if let JSXElementName::Ident(i) = n {
            self.with_ctx(ctx).report_usage(i);
            self.data
                .var_or_default(i.to_id())
                .mark_used_as_jsx_callee();
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip(self, e))
    )]
    fn visit_member_expr(&mut self, e: &MemberExpr) {
        {
            let ctx = self.ctx.with(BitContext::IsIdRef, false);
            e.obj.visit_with(&mut *self.with_ctx(ctx));
        }

        if let MemberProp::Computed(c) = &e.prop {
            c.visit_with(self);
        }

        for_each_id_ref_in_expr(&e.obj, &mut |obj| {
            let v = self.data.var_or_default(obj.to_id());
            v.mark_has_property_access();

            if let MemberProp::Computed(prop) = &e.prop {
                match &*prop.expr {
                    Expr::Lit(Lit::Str(s)) => {
                        if s.value
                            .as_str()
                            .map_or(true, |value| value.parse::<f64>().is_err())
                        {
                            v.add_accessed_property(s.value.clone());
                        }
                    }

                    Expr::Lit(Lit::Num(_)) => {}
                    _ => {
                        v.mark_indexed_with_dynamic_key();
                    }
                }
            }

            if let MemberProp::Ident(prop) = &e.prop {
                v.add_accessed_property(prop.sym.clone().into());
            }
        });

        fn is_root_of_member_expr_declared(member_expr: &MemberExpr, data: &impl Storage) -> bool {
            match &*member_expr.obj {
                Expr::Member(member_expr) => is_root_of_member_expr_declared(member_expr, data),
                Expr::Ident(ident) => data
                    .get_var_data(ident.to_id())
                    .map(|var| var.is_declared())
                    .unwrap_or(false),

                _ => false,
            }
        }

        if is_root_of_member_expr_declared(e, &self.data) {
            if let MemberProp::Ident(ident) = &e.prop {
                self.data.add_property_atom(ident.sym.clone().into());
            }
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_method_prop(&mut self, n: &MethodProp) {
        n.function.decorators.visit_with(self);

        self.with_child(n.function.ctxt, ScopeKind::Fn, |a| {
            n.key.visit_with(a);
            {
                let ctx = a.ctx.with(BitContext::InPatOfParam, true);
                n.function.params.visit_with(&mut *a.with_ctx(ctx));
            }

            n.function.visit_with(a);
        });
    }

    fn visit_module(&mut self, n: &Module) {
        let ctx = self.ctx.with(BitContext::IsTopLevel, true);
        n.visit_children_with(&mut *self.with_ctx(ctx))
    }

    fn visit_named_export(&mut self, n: &NamedExport) {
        if n.src.is_some() {
            return;
        }
        n.visit_children_with(self);
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_new_expr(&mut self, n: &NewExpr) {
        {
            n.callee.visit_with(self);
            let ctx = self.ctx.with(BitContext::IsIdRef, true);
            n.args.visit_with(&mut *self.with_ctx(ctx));

            if call_may_mutate(&n.callee, self.expr_ctx) {
                if let Some(args) = &n.args {
                    for a in args {
                        for_each_id_ref_in_expr(&a.expr, &mut |id| {
                            self.data.mark_property_mutation(id.to_id());
                        });
                    }
                }
            }
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_param(&mut self, n: &Param) {
        let ctx = self.ctx.with(BitContext::InPatOfParam, false);
        n.decorators.visit_with(&mut *self.with_ctx(ctx));

        let ctx = Ctx {
            bit_ctx: self
                .ctx
                .bit_ctx
                .with(BitContext::InPatOfParam, true)
                .with(BitContext::IsIdRef, true),
            var_decl_kind_of_pat: None,
            ..self.ctx
        };
        n.pat.visit_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_pat(&mut self, n: &Pat) {
        match n {
            Pat::Ident(i) => {
                i.visit_with(self);
            }
            _ => {
                let ctx = self
                    .ctx
                    .with(BitContext::InDeclWithNoSideEffectForMemberAccess, false);
                n.visit_children_with(&mut *self.with_ctx(ctx));
            }
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_private_method(&mut self, n: &PrivateMethod) {
        n.function.decorators.visit_with(self);

        self.with_child(n.function.ctxt, ScopeKind::Fn, |a| {
            n.key.visit_with(a);
            {
                let ctx = a.ctx.with(BitContext::InPatOfParam, true);
                n.function.params.visit_with(&mut *a.with_ctx(ctx));
            }

            n.function.visit_with(a);
        });
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_private_prop(&mut self, n: &PrivateProp) {
        let ctx = self.ctx.with(BitContext::IsIdRef, true);
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_prop(&mut self, n: &Prop) {
        if let Prop::Shorthand(i) = n {
            let ctx = self.ctx.with(BitContext::IsIdRef, true);
            self.with_ctx(ctx).report_usage(i);
            self.data.add_property_atom(i.sym.clone().into());
        } else {
            let ctx = self.ctx.with(BitContext::IsIdRef, true);
            n.visit_children_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_prop_name(&mut self, node: &PropName) {
        node.visit_children_with(self);

        match node {
            PropName::Ident(ident) => {
                self.data.add_property_atom(ident.sym.clone().into());
            }
            PropName::Str(s) => {
                self.data.add_property_atom(s.value.clone());
            }
            _ => {}
        };
    }

    fn visit_script(&mut self, n: &Script) {
        let ctx = self.ctx.with(BitContext::IsTopLevel, true);
        n.visit_children_with(&mut *self.with_ctx(ctx))
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_setter_prop(&mut self, n: &SetterProp) {
        self.with_child(SyntaxContext::empty(), ScopeKind::Fn, |a| {
            n.key.visit_with(a);
            {
                let ctx = a.ctx.with(BitContext::InPatOfParam, true);
                n.param.visit_with(&mut *a.with_ctx(ctx));
            }

            n.body.visit_with(a);
        });
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_spread_element(&mut self, e: &SpreadElement) {
        e.visit_children_with(self);

        for_each_id_ref_in_expr(&e.expr, &mut |i| {
            self.data
                .var_or_default(i.to_id())
                .mark_indexed_with_dynamic_key();
        });
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_stmt(&mut self, n: &Stmt) {
        let ctx = self
            .ctx
            .with(BitContext::InAwaitArg, false)
            .with(BitContext::IsIdRef, true);
        n.visit_children_with(&mut *self.with_ctx(ctx));
    }

    fn visit_stmts(&mut self, stmts: &[Stmt]) {
        let mut had_cond = false;

        for stmt in stmts {
            let ctx = self
                .ctx
                .with(
                    BitContext::InCond,
                    self.ctx.bit_ctx.contains(BitContext::InCond) || had_cond,
                )
                .with(BitContext::IsIdRef, true);

            stmt.visit_with(&mut *self.with_ctx(ctx));

            had_cond |= can_end_conditionally(stmt);
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip(self, e))
    )]
    fn visit_super_prop_expr(&mut self, e: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &e.prop {
            let ctx = self.ctx.with(BitContext::IsIdRef, false);
            c.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    fn visit_switch_case(&mut self, n: &SwitchCase) {
        let ctx = self.ctx.with(BitContext::IsIdRef, false);
        n.visit_children_with(&mut *self.with_ctx(ctx))
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_switch_stmt(&mut self, n: &SwitchStmt) {
        n.discriminant.visit_with(self);

        let mut fallthrough = false;

        for case in n.cases.iter() {
            let ctx = self.ctx.with(BitContext::InCond, true);
            if fallthrough {
                self.with_ctx(ctx).visit_in_cond(&case.test);
                self.with_ctx(ctx).visit_in_cond(&case.cons);
            } else {
                self.with_ctx(ctx).visit_in_cond(case);
            }
            fallthrough = !case.cons.iter().rev().any(|s| s.terminates())
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_tagged_tpl(&mut self, n: &TaggedTpl) {
        {
            let ctx = self.ctx.with(BitContext::IsIdRef, false);
            n.tag.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = self.ctx.with(BitContext::IsIdRef, true);
            // Bypass visit_tpl
            n.tpl.visit_children_with(&mut *self.with_ctx(ctx))
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_tpl(&mut self, n: &Tpl) {
        let ctx = self.ctx.with(BitContext::IsIdRef, false);
        n.visit_children_with(&mut *self.with_ctx(ctx))
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_try_stmt(&mut self, n: &TryStmt) {
        let ctx = self.ctx.with(BitContext::InCond, true);
        self.with_ctx(ctx).visit_children_in_cond(n);
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_unary_expr(&mut self, n: &UnaryExpr) {
        if n.op == op!("delete") {
            self.mark_mutation_if_member(n.arg.as_member());
        }
        n.visit_children_with(self);
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_update_expr(&mut self, n: &UpdateExpr) {
        n.visit_children_with(self);

        self.report_assign_expr_if_ident(n.arg.as_ident(), true, Value::Known(Type::Num));
        self.mark_mutation_if_member(n.arg.as_member());
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_var_decl(&mut self, n: &VarDecl) {
        let ctx = Ctx {
            var_decl_kind_of_pat: Some(n.kind),
            bit_ctx: self.ctx.bit_ctx.with(BitContext::InAwaitArg, false),
            ..self.ctx
        };
        n.visit_children_with(&mut *self.with_ctx(ctx));

        for decl in &n.decls {
            if let (Pat::Ident(var), Some(init)) = (&decl.name, decl.init.as_deref()) {
                let mut v = None;
                for id in collect_infects_from(
                    init,
                    AliasConfig {
                        marks: self.marks,
                        ignore_named_child_scope: true,
                        ..Default::default()
                    },
                ) {
                    if v.is_none() {
                        v = Some(self.data.var_or_default(var.to_id()));
                    }

                    v.as_mut().unwrap().add_infects_to(id.clone());
                }
            }
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip(self, e))
    )]
    fn visit_var_declarator(&mut self, e: &VarDeclarator) {
        let prevent_inline = matches!(&e.name, Pat::Ident(BindingIdent {
                id: Ident { sym: arguments, .. },
                ..
            }) if (&**arguments == "arguments"));
        {
            let ctx = Ctx {
                bit_ctx: self
                    .ctx
                    .bit_ctx
                    .with(
                        BitContext::InlinePrevented,
                        self.ctx.bit_ctx.contains(BitContext::InlinePrevented) || prevent_inline,
                    )
                    .with(BitContext::InPatOfVarDecl, true)
                    .with(
                        BitContext::InDeclWithNoSideEffectForMemberAccess,
                        e.init
                            .as_deref()
                            .map(is_safe_to_access_prop)
                            .unwrap_or(false),
                    ),
                in_pat_of_var_decl_with_init: e
                    .init
                    .as_ref()
                    .map(|init| init.get_type(self.expr_ctx)),
                ..self.ctx
            };
            e.name.visit_with(&mut *self.with_ctx(ctx));
        }

        {
            let ctx = self
                .ctx
                .with(
                    BitContext::InlinePrevented,
                    self.ctx.bit_ctx.contains(BitContext::InlinePrevented) || prevent_inline,
                )
                .with(BitContext::InPatOfVarDecl, false)
                .with(BitContext::IsIdRef, true);
            if self.marks.is_some() {
                match e {
                    VarDeclarator {
                        name: Pat::Ident(id),
                        init: Some(init),
                        definite: false,
                        ..
                    } => {
                        let id = id.to_id();
                        self.used_recursively.insert(
                            id.clone(),
                            RecursiveUsage::Var {
                                can_ignore: !init.may_have_side_effects(self.expr_ctx),
                            },
                        );
                        e.init.visit_with(&mut *self.with_ctx(ctx));
                        self.used_recursively.remove(&id);
                        return;
                    }

                    VarDeclarator {
                        name: Pat::Ident(id),
                        init: None,
                        ..
                    } => {
                        self.data.var_or_default(id.to_id()).mark_as_lazy_init();
                        return;
                    }
                    _ => (),
                }
            }

            e.init.visit_with(&mut *self.with_ctx(ctx));
        }
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_while_stmt(&mut self, n: &WhileStmt) {
        n.test
            .visit_with(&mut *self.with_ctx(self.ctx.with(BitContext::ExecutedMultipleTime, true)));
        let ctx = self
            .ctx
            .with(BitContext::ExecutedMultipleTime, true)
            .with(BitContext::InCond, true);
        self.with_ctx(ctx).visit_in_cond(&n.body);
    }

    #[cfg_attr(
        feature = "tracing-spans",
        tracing::instrument(level = "debug", skip_all)
    )]
    fn visit_with_stmt(&mut self, n: &WithStmt) {
        self.scope.mark_with_stmt();
        n.visit_children_with(self);
    }
}

/// - `a` => `a`
/// - `a ? b : c` => `b`, `c`
fn for_each_id_ref_in_expr(e: &Expr, op: &mut impl FnMut(&Ident)) {
    match e {
        Expr::Ident(i) => op(i),
        Expr::Paren(p) => {
            for_each_id_ref_in_expr(&p.expr, op);
        }
        Expr::Cond(c) => {
            for_each_id_ref_in_expr(&c.cons, op);
            for_each_id_ref_in_expr(&c.alt, op);
        }
        Expr::Bin(b @ BinExpr { op: bin_op, .. }) if bin_op.may_short_circuit() => {
            for_each_id_ref_in_expr(&b.left, op);
            for_each_id_ref_in_expr(&b.right, op);
        }

        Expr::Class(c) => {
            for_each_id_ref_in_class(&c.class, op);
        }

        Expr::Fn(f) => {
            for_each_id_ref_in_fn(&f.function, op);
        }

        Expr::Seq(s) => {
            for_each_id_ref_in_expr(s.exprs.last().unwrap(), op);
        }

        Expr::Array(arr) => {
            arr.elems.iter().flatten().for_each(|e| {
                for_each_id_ref_in_expr(&e.expr, op);
            });
        }

        Expr::Object(obj) => {
            obj.props.iter().for_each(|p| match p {
                PropOrSpread::Spread(p) => {
                    for_each_id_ref_in_expr(&p.expr, op);
                }
                PropOrSpread::Prop(p) => match &**p {
                    Prop::Shorthand(p) => {
                        op(p);
                    }
                    Prop::KeyValue(p) => {
                        for_each_id_ref_in_prop_name(&p.key, op);
                        for_each_id_ref_in_expr(&p.value, op);
                    }
                    Prop::Assign(p) => {
                        for_each_id_ref_in_expr(&p.value, op);
                    }
                    Prop::Getter(p) => {
                        for_each_id_ref_in_prop_name(&p.key, op);
                    }
                    Prop::Setter(p) => {
                        for_each_id_ref_in_prop_name(&p.key, op);

                        for_each_id_ref_in_pat(&p.param, op);
                    }
                    Prop::Method(p) => {
                        for_each_id_ref_in_fn(&p.function, op);
                    }
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                },
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            });
        }
        _ => {}
    }
}

fn for_each_id_ref_in_class(c: &Class, op: &mut impl FnMut(&Ident)) {
    c.body.iter().for_each(|m| match m {
        ClassMember::Constructor(m) => {
            for_each_id_ref_in_prop_name(&m.key, op);
            m.params.iter().for_each(|p| match p {
                ParamOrTsParamProp::TsParamProp(..) => {
                    unreachable!()
                }
                ParamOrTsParamProp::Param(p) => {
                    for_each_id_ref_in_pat(&p.pat, op);
                }
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            });
        }

        ClassMember::Method(m) => {
            for_each_id_ref_in_prop_name(&m.key, op);
            for_each_id_ref_in_fn(&m.function, op);
        }

        ClassMember::PrivateMethod(m) => {
            for_each_id_ref_in_fn(&m.function, op);
        }

        ClassMember::ClassProp(m) => {
            for_each_id_ref_in_prop_name(&m.key, op);
            if let Some(value) = &m.value {
                for_each_id_ref_in_expr(value, op);
            }
        }

        ClassMember::PrivateProp(m) => {
            if let Some(value) = &m.value {
                for_each_id_ref_in_expr(value, op);
            }
        }

        ClassMember::AutoAccessor(m) => {
            if let Key::Public(key) = &m.key {
                for_each_id_ref_in_prop_name(key, op);
            }

            if let Some(v) = &m.value {
                for_each_id_ref_in_expr(v, op);
            }
        }

        ClassMember::Empty(..)
        | ClassMember::StaticBlock(..)
        | ClassMember::TsIndexSignature(..) => {}
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    });
}
fn for_each_id_ref_in_prop_name(p: &PropName, op: &mut impl FnMut(&Ident)) {
    if let PropName::Computed(p) = p {
        for_each_id_ref_in_expr(&p.expr, op);
    }
}

fn for_each_id_ref_in_pat(p: &Pat, op: &mut impl FnMut(&Ident)) {
    match p {
        Pat::Ident(..) => {
            // IdentifierBinding is not IdentifierReference
        }
        Pat::Array(p) => {
            p.elems.iter().flatten().for_each(|e| {
                for_each_id_ref_in_pat(e, op);
            });
        }
        Pat::Rest(p) => {
            for_each_id_ref_in_pat(&p.arg, op);
        }
        Pat::Object(p) => {
            p.props.iter().for_each(|p| match p {
                ObjectPatProp::KeyValue(p) => {
                    for_each_id_ref_in_prop_name(&p.key, op);
                    for_each_id_ref_in_pat(&p.value, op);
                }
                ObjectPatProp::Assign(p) => {
                    // We skip key because it's IdentifierBinding

                    if let Some(value) = &p.value {
                        for_each_id_ref_in_expr(value, op);
                    }
                }
                ObjectPatProp::Rest(p) => {
                    for_each_id_ref_in_pat(&p.arg, op);
                }
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            });
        }
        Pat::Assign(p) => {
            for_each_id_ref_in_pat(&p.left, op);
            for_each_id_ref_in_expr(&p.right, op);
        }
        Pat::Invalid(..) => {}
        Pat::Expr(p) => {
            for_each_id_ref_in_expr(p, op);
        }
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

fn for_each_id_ref_in_fn(f: &Function, op: &mut impl FnMut(&Ident)) {
    for p in &f.params {
        for_each_id_ref_in_pat(&p.pat, op);
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

fn call_may_mutate(expr: &Expr, expr_ctx: ExprCtx) -> bool {
    fn is_global_fn_wont_mutate(s: &Ident, unresolved: SyntaxContext) -> bool {
        s.ctxt == unresolved
            && matches!(
                &*s.sym,
                "JSON"
                // | "Array"
                | "String"
                // | "Object"
                | "Number"
                | "Date"
                | "BigInt"
                | "Boolean"
                | "Math"
                | "Error"
                | "console"
                | "clearInterval"
                | "clearTimeout"
                | "setInterval"
                | "setTimeout"
                | "btoa"
                | "decodeURI"
                | "decodeURIComponent"
                | "encodeURI"
                | "encodeURIComponent"
                | "escape"
                | "eval"
                | "EvalError"
                | "Function"
                | "isFinite"
                | "isNaN"
                | "parseFloat"
                | "parseInt"
                | "RegExp"
                | "RangeError"
                | "ReferenceError"
                | "SyntaxError"
                | "TypeError"
                | "unescape"
                | "URIError"
                | "atob"
                | "globalThis"
                | "NaN"
                | "Symbol"
                | "Promise"
            )
    }

    if expr.is_pure_callee(expr_ctx) {
        false
    } else {
        match expr {
            Expr::Ident(i) if is_global_fn_wont_mutate(i, expr_ctx.unresolved_ctxt) => false,
            Expr::Member(MemberExpr { obj, .. }) => {
                !matches!(&**obj, Expr::Ident(i) if is_global_fn_wont_mutate(i, expr_ctx.unresolved_ctxt))
            }
            _ => true,
        }
    }
}
