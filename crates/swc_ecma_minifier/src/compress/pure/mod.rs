#![allow(clippy::needless_update)]

use swc_common::{pass::Repeated, util::take::Take, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_optimization::{debug_assert_valid, simplify};
use swc_ecma_usage_analyzer::marks::Marks;
use swc_ecma_utils::{
    parallel::{cpu_count, Parallel, ParallelExt},
    ExprCtx,
};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith, VisitWith};
#[cfg(feature = "debug")]
use tracing::Level;

use self::{ctx::Ctx, misc::DropOpts};
use crate::{debug::AssertValid, maybe_par, option::CompressOptions, util::ModuleItemExt};

mod arrows;
mod bools;
mod conds;
mod ctx;
mod dead_code;
mod evaluate;
mod if_return;
mod loops;
mod member_expr;
mod misc;
mod numbers;
mod properties;
mod sequences;
mod strings;
mod switches;
mod vars;

#[derive(Debug, Clone, Copy)]
pub(crate) struct PureOptimizerConfig {
    /// pass > 1
    pub enable_join_vars: bool,

    pub force_str_for_tpl: bool,
}

#[allow(clippy::needless_lifetimes)]
pub(crate) fn pure_optimizer<'a>(
    options: &'a CompressOptions,
    marks: Marks,
    config: PureOptimizerConfig,
) -> impl 'a + VisitMut + Repeated {
    Pure {
        options,
        config,
        marks,
        expr_ctx: ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(marks.unresolved_mark),
            is_unresolved_ref_safe: false,
            in_strict: options.module,
            remaining_depth: 6,
        },
        ctx: Default::default(),
        changed: Default::default(),
    }
}

struct Pure<'a> {
    options: &'a CompressOptions,
    config: PureOptimizerConfig,
    marks: Marks,
    expr_ctx: ExprCtx,

    ctx: Ctx,
    changed: bool,
}

impl Parallel for Pure<'_> {
    fn create(&self) -> Self {
        Self { ..*self }
    }

    fn merge(&mut self, other: Self) {
        if other.changed {
            self.changed = true;
        }
    }
}

impl Repeated for Pure<'_> {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.ctx = Default::default();
        self.changed = false;
    }
}

impl Pure<'_> {
    fn handle_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: ModuleItemExt + Take,
        Vec<T>: VisitWith<self::vars::VarWithOutInitCounter>
            + VisitMutWith<self::vars::VarPrepender>
            + VisitMutWith<self::vars::VarMover>
            + VisitWith<AssertValid>,
    {
        self.optimize_const_if(stmts);

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }

        self.drop_unreachable_stmts(stmts);

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }

        self.drop_useless_blocks(stmts);

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }

        self.collapse_vars_without_init(stmts, VarDeclKind::Let);

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }

        self.collapse_vars_without_init(stmts, VarDeclKind::Var);

        #[cfg(debug_assertions)]
        {
            stmts.visit_with(&mut AssertValid);
        }

        if self.config.enable_join_vars {
            self.join_vars(stmts);

            debug_assert_valid(stmts);
        }

        self.break_assignments_in_seqs(stmts);

        debug_assert_valid(stmts);

        stmts.retain(|s| !matches!(s.as_stmt(), Some(Stmt::Empty(..))));
    }

    fn optimize_fn_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        if !stmts.is_empty() {
            if let Stmt::Expr(ExprStmt { expr, .. }) = &stmts[0] {
                if let Expr::Lit(Lit::Str(v)) = &**expr {
                    if v.value == *"use asm" {
                        return;
                    }
                }
            }
        }

        self.remove_useless_return(stmts);

        self.negate_if_terminate(stmts, true, false);

        if let Some(last) = stmts.last_mut() {
            self.drop_unused_stmt_at_end_of_fn(last);
        }
    }

    /// Visit `nodes`, maybe in parallel.
    fn visit_par<N>(&mut self, threshold_multiplier: usize, nodes: &mut Vec<N>)
    where
        N: for<'aa> VisitMutWith<Pure<'aa>> + Send + Sync,
    {
        self.maybe_par(cpu_count() * threshold_multiplier, nodes, |v, node| {
            node.visit_mut_with(v);
        });
    }

    fn visit_par_ref<N>(&mut self, nodes: &mut [&mut N])
    where
        N: for<'aa> VisitMutWith<Pure<'aa>> + Send + Sync,
    {
        self.maybe_par(0, nodes, |v, node| {
            node.visit_mut_with(v);
        });
    }
}

impl VisitMut for Pure<'_> {
    noop_visit_mut_type!(fail);

    fn visit_mut_assign_expr(&mut self, e: &mut AssignExpr) {
        self.do_inside_of_context(Ctx::IS_LHS_OF_ASSIGN, |this| {
            e.left.visit_mut_children_with(this);
        });

        e.right.visit_mut_with(self);

        self.compress_bin_assignment_to_left(e);
        self.compress_bin_assignment_to_right(e);

        if matches!(
            e.op,
            op!("-=")
                | op!("*=")
                | op!("/=")
                | op!("%=")
                | op!("**=")
                | op!("&=")
                | op!("|=")
                | op!("^=")
                | op!("<<=")
                | op!(">>=")
                | op!(">>>=")
        ) {
            self.optimize_expr_in_num_ctx(&mut e.right);
        }
    }

    fn visit_mut_bin_expr(&mut self, e: &mut BinExpr) {
        self.visit_mut_expr(&mut e.left);
        self.visit_mut_expr(&mut e.right);

        self.compress_cmp_with_long_op(e);

        if e.op == op!(bin, "+") {
            self.concat_tpl(&mut e.left, &mut e.right);
        }

        if matches!(
            e.op,
            op!(bin, "-")
                | op!("*")
                | op!("/")
                | op!("%")
                | op!("**")
                | op!("&")
                | op!("|")
                | op!("^")
                | op!("<<")
                | op!(">>")
                | op!(">>>")
        ) {
            self.optimize_expr_in_num_ctx(&mut e.left);
            self.optimize_expr_in_num_ctx(&mut e.right);
        }
    }

    fn visit_mut_block_stmt_or_expr(&mut self, body: &mut BlockStmtOrExpr) {
        body.visit_mut_children_with(self);

        match body {
            BlockStmtOrExpr::BlockStmt(b) => self.optimize_fn_stmts(&mut b.stmts),
            BlockStmtOrExpr::Expr(_) => {}
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }

        self.optimize_arrow_body(body);

        if let BlockStmtOrExpr::Expr(e) = body {
            self.make_bool_short(e, false, false);
        }
    }

    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        self.do_inside_of_context(Ctx::IS_CALLEE, |this| {
            e.callee.visit_mut_with(this);
        });

        self.do_outside_of_context(Ctx::IS_CALLEE, |this| {
            e.args.visit_mut_with(this);
        });

        self.eval_spread_array_in_args(&mut e.args);
    }

    fn visit_mut_class_member(&mut self, m: &mut ClassMember) {
        m.visit_mut_children_with(self);

        if let ClassMember::StaticBlock(sb) = m {
            if sb.body.stmts.is_empty() {
                *m = ClassMember::Empty(EmptyStmt { span: DUMMY_SP });
            }
        }
    }

    fn visit_mut_class_members(&mut self, m: &mut Vec<ClassMember>) {
        self.visit_par(2, m);

        m.retain(|m| {
            if let ClassMember::Empty(..) = m {
                return false;
            }

            true
        });
    }

    fn visit_mut_cond_expr(&mut self, e: &mut CondExpr) {
        e.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut e.test, false);
    }

    fn visit_mut_do_while_stmt(&mut self, s: &mut DoWhileStmt) {
        s.test.visit_mut_with(self);

        self.do_inside_of_context(Ctx::PRESERVE_BLOCK, |this| {
            s.body.visit_mut_with(this);
        });

        self.make_bool_short(&mut s.test, true, false);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        self.handle_known_delete(e);

        e.visit_mut_children_with(self);

        // Expression simplifier
        match e {
            Expr::Member(..) => {
                if !self.ctx.intersects(
                    Ctx::IN_DELETE
                        .union(Ctx::IS_UPDATE_ARG)
                        .union(Ctx::IS_LHS_OF_ASSIGN)
                        .union(Ctx::IN_OPT_CHAIN),
                ) {
                    let mut changed = false;
                    simplify::expr::optimize_member_expr(
                        self.expr_ctx,
                        e,
                        self.ctx.contains(Ctx::IS_CALLEE),
                        &mut changed,
                    );

                    if changed {
                        report_change!("expression simplifier simplified a member expression");
                    }
                }
            }

            Expr::Unary(..) => {
                let mut changed = false;
                simplify::expr::optimize_unary_expr(self.expr_ctx, e, &mut changed);

                if changed {
                    report_change!("expression simplifier simplified a unary expression");
                    self.changed = true;
                }
            }

            Expr::Bin(..) => {
                let mut changed = false;
                simplify::expr::optimize_bin_expr(self.expr_ctx, e, &mut changed);

                if changed {
                    report_change!("expression simplifier simplified a binary expression");
                    self.changed = true;
                }
            }

            _ => {}
        }

        match e {
            Expr::Seq(seq) => {
                if seq.exprs.len() == 1 {
                    *e = *seq.exprs.pop().unwrap();
                }
            }
            Expr::Invalid(..) | Expr::Lit(..) => return,

            _ => {}
        }

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.simplify_assign_expr(e);

        if self.options.unused {
            if let Expr::Unary(UnaryExpr {
                span,
                op: op!("void"),
                arg,
            }) = e
            {
                if !arg.is_lit() {
                    self.ignore_return_value(
                        arg,
                        DropOpts::DROP_GLOBAL_REFS_IF_UNUSED
                            .union(DropOpts::DROP_NUMBER)
                            .union(DropOpts::DROP_STR_LIT),
                    );
                    if arg.is_invalid() {
                        *e = *Expr::undefined(*span);
                        return;
                    }
                }
            }
        }

        if let Expr::Bin(bin) = e {
            let expr = self.optimize_lit_cmp(bin);
            if let Some(expr) = expr {
                report_change!("Optimizing: Literal comparison");
                self.changed = true;
                *e = expr;
            }
        }

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.eval_nested_tpl(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.eval_tpl_as_str(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.eval_str_addition(e);

        if self.changed {
            self.remove_invalid(e);
        }

        if let Expr::Seq(seq) = e {
            if seq.exprs.is_empty() {
                *e = Invalid { span: DUMMY_SP }.into();
                return;
            }
            if seq.exprs.len() == 1 {
                self.changed = true;
                *e = *seq.exprs.take().into_iter().next().unwrap();
            }
        }

        self.eval_array_spread(e);

        self.compress_array_join(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.unsafe_optimize_fn_as_arrow(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.eval_opt_chain(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.eval_number_call(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.eval_arguments_member_access(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.eval_number_method_call(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.swap_bin_operands(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.drop_logical_operands(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.optimize_negate_eq(e);

        self.lift_minus(e);
        self.optimize_to_number(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }
        self.convert_tpl_to_str(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.drop_useless_addition_of_str(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.compress_useless_deletes(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.remove_useless_logical_rhs(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.handle_negated_seq(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.concat_str(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.eval_array_method_call(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }
        self.eval_fn_method_call(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.eval_str_method_call(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.optimize_const_cond(e);

        self.compress_conds_as_logical(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.compress_cond_with_logical_as_logical(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.compress_conds_as_arithmetic(e);

        self.eval_logical_expr(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.lift_seqs_of_bin(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.lift_seqs_of_cond_assign(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.optimize_nullish_coalescing(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.compress_negated_bin_eq(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.compress_useless_cond_expr(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.optimize_builtin_object(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.optimize_opt_chain(e);

        if e.is_seq() {
            debug_assert_valid(e);
        }

        self.eval_member_expr(e);

        self.optimize_to_int(e);
    }

    fn visit_mut_expr_or_spreads(&mut self, nodes: &mut Vec<ExprOrSpread>) {
        self.visit_par(8, nodes);
    }

    fn visit_mut_expr_stmt(&mut self, s: &mut ExprStmt) {
        s.visit_mut_children_with(self);

        if s.expr.is_seq() {
            debug_assert_valid(&s.expr);
        }

        self.ignore_return_value(
            &mut s.expr,
            DropOpts::DROP_NUMBER.union(DropOpts::DROP_GLOBAL_REFS_IF_UNUSED),
        );

        if s.expr.is_invalid() {
            return;
        }

        debug_assert_valid(&s.expr);

        self.make_bool_short(&mut s.expr, false, true);
    }

    fn visit_mut_exprs(&mut self, nodes: &mut Vec<Box<Expr>>) {
        self.visit_par(16, nodes);
    }

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        #[cfg(feature = "debug")]
        let _tracing = tracing::span!(
            Level::ERROR,
            "visit_mut_fn_decl",
            id = tracing::field::display(&n.ident)
        )
        .entered();

        n.visit_mut_children_with(self);
    }

    fn visit_mut_for_head(&mut self, head: &mut ForHead) {
        self.do_inside_of_context(Ctx::IS_UPDATE_ARG, |this| {
            head.visit_mut_children_with(this)
        });
    }

    fn visit_mut_for_in_stmt(&mut self, n: &mut ForInStmt) {
        n.right.visit_mut_with(self);

        n.left.visit_mut_with(self);

        n.body.visit_mut_with(self);

        if let Stmt::Block(body) = &mut *n.body {
            self.negate_if_terminate(&mut body.stmts, false, true);
        }

        self.make_bool_short(&mut n.right, false, false);
    }

    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        n.right.visit_mut_with(self);

        n.left.visit_mut_with(self);

        n.body.visit_mut_with(self);

        if let Stmt::Block(body) = &mut *n.body {
            self.negate_if_terminate(&mut body.stmts, false, true);
        }

        self.make_bool_short(&mut n.right, false, false);
    }

    fn visit_mut_for_stmt(&mut self, s: &mut ForStmt) {
        s.visit_mut_children_with(self);

        self.optimize_for_init(&mut s.init);

        self.optimize_for_update(&mut s.update);

        self.optimize_for_if_break(s);

        self.merge_for_if_break(s);

        if let Some(test) = &mut s.test {
            self.optimize_expr_in_bool_ctx(test, false);
        }

        if let Stmt::Block(body) = &mut *s.body {
            self.negate_if_terminate(&mut body.stmts, false, true);
        }
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        self.do_outside_of_context(Ctx::IN_TRY_BLOCK, |this| f.visit_mut_children_with(this));

        if let Some(body) = &mut f.body {
            self.optimize_fn_stmts(&mut body.stmts)
        }
    }

    fn visit_mut_if_stmt(&mut self, s: &mut IfStmt) {
        s.test.visit_mut_with(self);

        match &mut s.alt {
            Some(alt) => {
                self.do_outside_of_context(Ctx::PRESERVE_BLOCK, |this| {
                    this.visit_par_ref(&mut [&mut *s.cons, &mut **alt]);
                });
            }
            None => {
                self.do_outside_of_context(Ctx::PRESERVE_BLOCK, |this| {
                    s.cons.visit_mut_with(this);
                });
            }
        }

        self.optimize_expr_in_bool_ctx(&mut s.test, false);

        self.merge_nested_if(s);

        self.merge_else_if(s);

        self.make_bool_short(&mut s.test, true, false);
    }

    fn visit_mut_key_value_prop(&mut self, p: &mut KeyValueProp) {
        p.visit_mut_children_with(self);

        self.make_bool_short(&mut p.value, false, false);
    }

    fn visit_mut_labeled_stmt(&mut self, s: &mut LabeledStmt) {
        self.do_inside_of_context(Ctx::IS_LABEL_BODY, |this| {
            s.body.visit_mut_with(this);
        });
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        self.do_outside_of_context(Ctx::IS_CALLEE.union(Ctx::IS_UPDATE_ARG), |this| {
            e.obj.visit_mut_with(this);
        });

        if let MemberProp::Computed(c) = &mut e.prop {
            self.do_outside_of_context(
                Ctx::IS_CALLEE
                    .union(Ctx::IS_UPDATE_ARG)
                    .union(Ctx::IS_LHS_OF_ASSIGN),
                |this| {
                    c.visit_mut_with(this);
                },
            );

            // TODO: unify these two
            if let Some(ident) = self.optimize_property_of_member_expr(Some(&e.obj), c) {
                e.prop = MemberProp::Ident(ident);
                return;
            };

            if let Some(ident) = self.handle_known_computed_member_expr(c) {
                e.prop = MemberProp::Ident(ident)
            };
        }
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        self.visit_par(1, items);

        self.handle_stmt_likes(items);
    }

    fn visit_mut_new_expr(&mut self, e: &mut NewExpr) {
        self.do_inside_of_context(Ctx::IS_CALLEE, |this| {
            e.callee.visit_mut_with(this);
        });

        self.do_outside_of_context(Ctx::IS_CALLEE, |this| {
            e.args.visit_mut_with(this);
        });
    }

    fn visit_mut_object_lit(&mut self, e: &mut ObjectLit) {
        e.visit_mut_children_with(self);

        self.eval_spread_object(e);
    }

    fn visit_mut_object_pat(&mut self, p: &mut ObjectPat) {
        p.visit_mut_children_with(self);
    }

    fn visit_mut_opt_call(&mut self, opt_call: &mut OptCall) {
        self.do_inside_of_context(Ctx::IS_CALLEE, |this| {
            opt_call.callee.visit_mut_with(this);
        });

        opt_call.args.visit_mut_with(self);

        self.eval_spread_array_in_args(&mut opt_call.args);
    }

    fn visit_mut_opt_chain_expr(&mut self, e: &mut OptChainExpr) {
        self.do_inside_of_context(Ctx::IN_OPT_CHAIN, |this| {
            e.visit_mut_children_with(this);
        });
    }

    fn visit_mut_opt_var_decl_or_expr(&mut self, n: &mut Option<VarDeclOrExpr>) {
        n.visit_mut_children_with(self);

        if self.options.side_effects {
            if let Some(VarDeclOrExpr::Expr(e)) = n {
                self.ignore_return_value(
                    e,
                    DropOpts::DROP_GLOBAL_REFS_IF_UNUSED
                        .union(DropOpts::DROP_NUMBER)
                        .union(DropOpts::DROP_STR_LIT),
                );
                if e.is_invalid() {
                    *n = None;
                }
            }
        }

        if let Some(VarDeclOrExpr::Expr(e)) = n {
            if e.is_invalid() {
                *n = None;
            }
        }
    }

    fn visit_mut_opt_vec_expr_or_spreads(&mut self, nodes: &mut Vec<Option<ExprOrSpread>>) {
        self.visit_par(4, nodes);

        self.eval_spread_array_in_array(nodes);
    }

    fn visit_mut_pat(&mut self, p: &mut Pat) {
        p.visit_mut_children_with(self);

        self.drop_neeedless_pat(p);
    }

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        self.optimize_arrow_method_prop(p);

        #[cfg(debug_assertions)]
        {
            p.visit_with(&mut AssertValid);
        }
    }

    fn visit_mut_prop_name(&mut self, p: &mut PropName) {
        p.visit_mut_children_with(self);

        self.optimize_computed_prop_name_as_normal(p);
        self.optimize_prop_name(p);
    }

    fn visit_mut_prop_or_spreads(&mut self, exprs: &mut Vec<PropOrSpread>) {
        // Many bundlers use this pattern
        self.visit_par(2, exprs);
    }

    fn visit_mut_return_stmt(&mut self, s: &mut ReturnStmt) {
        s.visit_mut_children_with(self);

        self.drop_undefined_from_return_arg(s);

        if let Some(e) = &mut s.arg {
            self.make_bool_short(e, false, false);
        }
    }

    fn visit_mut_seq_expr(&mut self, e: &mut SeqExpr) {
        e.exprs.visit_mut_with(self);

        self.shift_void(e);

        self.shift_assignment(e);

        let exprs = &e.exprs;
        if maybe_par!(
            exprs.iter().any(|e| e.is_seq()),
            *crate::LIGHT_TASK_PARALLELS
        ) {
            let mut exprs = Vec::new();

            for e in e.exprs.take() {
                if let Expr::Seq(seq) = *e {
                    exprs.extend(seq.exprs);
                } else {
                    exprs.push(e);
                }
            }

            e.exprs = exprs;
        }

        e.exprs.retain(|e| {
            if e.is_invalid() {
                self.changed = true;
                report_change!("Removing invalid expr in seq");
                return false;
            }

            true
        });

        if e.exprs.is_empty() {
            return;
        }

        self.eval_trivial_values_in_expr(e);

        self.merge_seq_call(e);

        let can_change_this =
            !self.ctx.contains(Ctx::IS_CALLEE) || !e.exprs.last().unwrap().directness_matters();

        let len = e.exprs.len();
        for (idx, e) in e.exprs.iter_mut().enumerate() {
            let is_last = idx == len - 1;

            if !is_last {
                self.ignore_return_value(e, DropOpts::DROP_NUMBER.union(DropOpts::DROP_STR_LIT));
            }
        }

        e.exprs.retain(|e| !e.is_invalid());

        if !can_change_this && e.exprs.len() == 1 {
            e.exprs.insert(0, 0.into());
        }

        #[cfg(debug_assertions)]
        {
            e.exprs.visit_with(&mut AssertValid);
        }
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        self.do_outside_of_context(
            Ctx::IS_UPDATE_ARG
                .union(Ctx::IS_CALLEE)
                .union(Ctx::IN_DELETE)
                .union(Ctx::PRESERVE_BLOCK)
                .union(Ctx::IS_LABEL_BODY),
            |this| {
                s.visit_mut_children_with(this);
            },
        );

        match s {
            Stmt::Expr(ExprStmt { expr, .. }) => {
                if expr.is_invalid() {
                    *s = Stmt::dummy();
                    return;
                }

                self.ignore_return_value(expr, DropOpts::DROP_NUMBER);

                if expr.is_invalid() {
                    *s = Stmt::dummy();
                    self.changed = true;
                    report_change!("Dropping an invalid expression statement");
                    return;
                }
            }

            Stmt::Block(bs) => {
                if bs.stmts.is_empty() {
                    *s = Stmt::dummy();
                    self.changed = true;
                    report_change!("Dropping an empty block statement");
                    return;
                }
            }
            _ => {}
        }

        debug_assert_valid(s);

        if self.options.drop_debugger {
            if let Stmt::Debugger(..) = s {
                self.changed = true;
                *s = EmptyStmt { span: DUMMY_SP }.into();
                report_change!("drop_debugger: Dropped a debugger statement");
                return;
            }
        }

        if !self.ctx.contains(Ctx::PRESERVE_BLOCK) {
            self.drop_needless_block(s);

            debug_assert_valid(s);
        }

        self.optimize_empty_try_stmt(s);

        debug_assert_valid(s);

        self.optimize_meaningless_try(s);

        debug_assert_valid(s);

        self.optimize_loops_with_constant_condition(s);

        debug_assert_valid(s);

        self.loop_to_for_stmt(s);

        debug_assert_valid(s);

        self.handle_instant_break(s);

        debug_assert_valid(s);

        self.optimize_labeled_stmt(s);

        debug_assert_valid(s);

        self.drop_useless_continue(s);

        debug_assert_valid(s);

        self.optimize_body_of_loop_stmt(s);

        debug_assert_valid(s);

        self.optimize_switch_stmt(s);

        debug_assert_valid(s);

        self.compress_if_stmt_as_expr(s);

        debug_assert_valid(s);

        if let Stmt::Expr(es) = s {
            if es.expr.is_invalid() {
                *s = EmptyStmt { span: DUMMY_SP }.into();
                return;
            }
        }

        if let Stmt::Block(block) = s {
            let span = block.span;
            if let [Stmt::Expr(e), Stmt::Return(ReturnStmt { arg: None, .. })] =
                &mut block.stmts[..]
            {
                // binary expression would need an extra paren
                if !(e.expr.is_bin() || e.expr.is_assign() || e.expr.is_seq()) {
                    self.changed = true;
                    report_change!("sequences: Merge expression with return");

                    let e = e.expr.take();

                    *s = Stmt::Return(ReturnStmt {
                        span,
                        arg: Some(Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("void"),
                            arg: e,
                        }))),
                    })
                }
            }
        }

        debug_assert_valid(s);
    }

    fn visit_mut_stmts(&mut self, items: &mut Vec<Stmt>) {
        if !items.is_empty() {
            if let Stmt::Expr(ExprStmt { expr, .. }) = &items[0] {
                if let Expr::Lit(Lit::Str(v)) = &**expr {
                    if v.value == *"use asm" {
                        return;
                    }
                }
            }
        }

        self.visit_par(1, items);

        self.handle_stmt_likes(items);

        #[cfg(debug_assertions)]
        {
            items.visit_with(&mut AssertValid);
        }
    }

    fn visit_mut_super_prop_expr(&mut self, e: &mut SuperPropExpr) {
        if let SuperProp::Computed(c) = &mut e.prop {
            c.visit_mut_with(self);

            if let Some(ident) = self.optimize_property_of_member_expr(None, c) {
                e.prop = SuperProp::Ident(ident);
                return;
            };

            if let Some(ident) = self.handle_known_computed_member_expr(c) {
                e.prop = SuperProp::Ident(ident)
            };
        }
    }

    fn visit_mut_switch_cases(&mut self, n: &mut Vec<SwitchCase>) {
        self.visit_par(4, n);

        self.optimize_switch_cases(n);
    }

    fn visit_mut_tagged_tpl(&mut self, n: &mut TaggedTpl) {
        self.do_inside_of_context(Ctx::IS_CALLEE, |this| {
            n.tag.visit_mut_with(this);
        });

        self.do_outside_of_context(Ctx::IS_CALLEE, |this| {
            n.tpl.exprs.visit_mut_with(this);
        });
    }

    fn visit_mut_throw_stmt(&mut self, s: &mut ThrowStmt) {
        s.visit_mut_children_with(self);

        self.make_bool_short(&mut s.arg, false, false);
    }

    fn visit_mut_tpl(&mut self, n: &mut Tpl) {
        self.do_outside_of_context(Ctx::IS_CALLEE, |this| {
            n.visit_mut_children_with(this);
        });

        debug_assert_eq!(n.exprs.len() + 1, n.quasis.len());

        self.compress_tpl(n);

        debug_assert_eq!(
            n.exprs.len() + 1,
            n.quasis.len(),
            "tagged template literal compressor created an invalid template literal"
        );
    }

    fn visit_mut_try_stmt(&mut self, n: &mut TryStmt) {
        self.do_inside_of_context(Ctx::IN_TRY_BLOCK, |this| {
            n.block.visit_mut_with(this);
        });

        n.handler.visit_mut_with(self);

        n.finalizer.visit_mut_with(self);
    }

    fn visit_mut_unary_expr(&mut self, e: &mut UnaryExpr) {
        if e.op == op!("delete") {
            self.do_inside_of_context(Ctx::IN_DELETE, |this| {
                e.visit_mut_children_with(this);
            })
        } else {
            self.do_outside_of_context(Ctx::IN_DELETE, |this| {
                e.visit_mut_children_with(this);
            })
        }

        match e.op {
            op!("!") => {
                self.optimize_expr_in_bool_ctx(&mut e.arg, false);
            }

            op!(unary, "+") | op!(unary, "-") | op!("~") => {
                self.optimize_expr_in_num_ctx(&mut e.arg);
            }
            _ => {}
        }
    }

    fn visit_mut_update_expr(&mut self, e: &mut UpdateExpr) {
        self.do_inside_of_context(Ctx::IS_UPDATE_ARG, |this| {
            e.visit_mut_children_with(this);
        });
    }

    fn visit_mut_var_decl(&mut self, v: &mut VarDecl) {
        v.visit_mut_children_with(self);

        if v.kind == VarDeclKind::Var {
            self.remove_duplicate_vars(&mut v.decls);
        }
    }

    fn visit_mut_var_declarator(&mut self, v: &mut VarDeclarator) {
        v.visit_mut_children_with(self);

        if let Some(init) = &mut v.init {
            self.make_bool_short(init, false, false);
        }
    }

    fn visit_mut_var_declarators(&mut self, nodes: &mut Vec<VarDeclarator>) {
        self.visit_par(8, nodes);
    }

    fn visit_mut_while_stmt(&mut self, s: &mut WhileStmt) {
        s.visit_mut_children_with(self);

        self.optimize_expr_in_bool_ctx(&mut s.test, false);

        self.make_bool_short(&mut s.test, true, false);
    }

    /// Noop.
    fn visit_mut_with_stmt(&mut self, _: &mut WithStmt) {}
}
