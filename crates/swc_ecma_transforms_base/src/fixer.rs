use std::{hash::BuildHasherDefault, ops::RangeFull};

use indexmap::IndexMap;
use rustc_hash::FxHasher;
use swc_common::{comments::Comments, util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_visit::visit_mut_pass;

/// Fixes ast nodes before printing so semantics are preserved.
///
/// You don't have to bother to create appropriate parenthesis.
/// The pass will insert parenthesis as needed. In other words, it's
/// okay to store `a * (b + c)` as `Bin { a * Bin { b + c } }`.
pub fn fixer(comments: Option<&dyn Comments>) -> impl '_ + Pass {
    visit_mut_pass(VisitMutWithHook {
        hook: FixerHook {
            comments,
            remove_only: false,
        },
        context: FixerContext::default(),
    })
}

pub fn paren_remover(comments: Option<&dyn Comments>) -> impl '_ + Pass {
    visit_mut_pass(VisitMutWithHook {
        hook: FixerHook {
            comments,
            remove_only: true,
        },
        context: FixerContext::default(),
    })
}

/// Returns a hook for the fixer pass that can be composed with other hooks.
pub fn hook(comments: Option<&dyn Comments>) -> FixerHook<'_> {
    FixerHook {
        comments,
        remove_only: false,
    }
}

/// Returns a hook for the paren_remover pass that can be composed with other
/// hooks.
pub fn paren_remover_hook(comments: Option<&dyn Comments>) -> FixerHook<'_> {
    FixerHook {
        comments,
        remove_only: true,
    }
}

pub struct FixerHook<'a> {
    comments: Option<&'a dyn Comments>,
    remove_only: bool,
}

#[derive(Default)]
pub struct FixerContext {
    ctx_stack: Vec<Context>,
    /// A hash map to preserve original span.
    ///
    /// Key is span of inner expression, and value is span of the paren
    /// expression.
    span_map: IndexMap<Span, Span, BuildHasherDefault<FxHasher>>,
    in_for_stmt_head_stack: Vec<bool>,
    in_opt_chain_stack: Vec<bool>,
    /// Stack of saved contexts for each expression. When entering an expr,
    /// we save the context to restore (which may be modified by this expr).
    /// When exiting, we restore to this saved value.
    expr_saved_ctx_stack: Vec<Context>,
}

impl FixerContext {
    fn ctx(&self) -> Context {
        self.ctx_stack.last().copied().unwrap_or_default()
    }

    fn push_ctx(&mut self, ctx: Context) {
        self.ctx_stack.push(ctx);
    }

    fn pop_ctx(&mut self) {
        self.ctx_stack.pop();
    }

    fn set_ctx(&mut self, ctx: Context) {
        if let Some(last) = self.ctx_stack.last_mut() {
            *last = ctx;
        } else {
            self.ctx_stack.push(ctx);
        }
    }

    fn in_for_stmt_head(&self) -> bool {
        self.in_for_stmt_head_stack.last().copied().unwrap_or(false)
    }

    fn push_in_for_stmt_head(&mut self, v: bool) {
        self.in_for_stmt_head_stack.push(v);
    }

    fn pop_in_for_stmt_head(&mut self) {
        self.in_for_stmt_head_stack.pop();
    }

    fn in_opt_chain(&self) -> bool {
        self.in_opt_chain_stack.last().copied().unwrap_or(false)
    }

    fn push_in_opt_chain(&mut self, v: bool) {
        self.in_opt_chain_stack.push(v);
    }

    fn pop_in_opt_chain(&mut self) {
        self.in_opt_chain_stack.pop();
    }
}

#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
enum Context {
    #[default]
    Default,

    Callee {
        is_new: bool,
    },
    /// Always treated as expr. (But number of comma-separated expression
    /// matters)
    ///
    ///  - `foo((bar, x))` != `foo(bar, x)`
    ///  - `var foo = (bar, x)` != `var foo = bar, x`
    ///  - `[(foo, bar)]` != `[foo, bar]`
    ForcedExpr,

    /// Always treated as expr and comma does not matter.
    FreeExpr,
}

impl FixerHook<'_> {
    fn wrap_callee(&self, e: &mut Expr, ctx: &mut FixerContext) {
        match e {
            Expr::Lit(Lit::Num(..) | Lit::Str(..)) => (),
            Expr::Cond(..)
            | Expr::Class(..)
            | Expr::Bin(..)
            | Expr::Lit(..)
            | Expr::Unary(..)
            | Expr::Object(..)
            | Expr::Await(..)
            | Expr::Yield(..) => self.wrap(e, ctx),
            _ => (),
        }
    }

    fn wrap_with_paren_if_required(&self, e: &mut Expr, ctx: &mut FixerContext) {
        let mut has_padding_value = false;
        let current_ctx = ctx.ctx();

        match e {
            Expr::Bin(BinExpr { op: op!("in"), .. }) if ctx.in_for_stmt_head() => {
                self.wrap(e, ctx);
            }

            Expr::Bin(BinExpr { left, .. })
                if current_ctx == Context::Default
                    && matches!(&**left, Expr::Object(..) | Expr::Fn(..) | Expr::Class(..)) =>
            {
                self.wrap(left, ctx);
            }

            // Object literal as tag of tagged template needs wrapping when at statement level
            Expr::TaggedTpl(TaggedTpl { tag, .. })
                if current_ctx == Context::Default && matches!(&**tag, Expr::Object(..)) =>
            {
                self.wrap(tag, ctx);
            }

            // Flatten seq expr
            Expr::Seq(SeqExpr { span, exprs }) => {
                let len = exprs
                    .iter()
                    .map(|expr| match **expr {
                        Expr::Paren(ParenExpr { ref expr, .. }) => {
                            if let Expr::Seq(SeqExpr { exprs, .. }) = expr.as_ref() {
                                exprs.len()
                            } else {
                                1
                            }
                        }
                        Expr::Seq(SeqExpr { ref exprs, .. }) => exprs.len(),
                        _ => 1,
                    })
                    .sum();

                let exprs_len = exprs.len();
                // don't has child seq
                let mut exprs = if len == exprs_len {
                    let mut exprs = exprs
                        .iter_mut()
                        .enumerate()
                        .filter_map(|(i, e)| {
                            let is_last = i + 1 == exprs_len;
                            if is_last {
                                Some(e.take())
                            } else {
                                ignore_return_value(e.take(), &mut has_padding_value)
                            }
                        })
                        .collect::<Vec<_>>();
                    if exprs.len() == 1 {
                        *e = *exprs.pop().unwrap();
                        return;
                    }
                    ignore_padding_value(exprs)
                } else {
                    let mut buf = Vec::with_capacity(len);
                    for (i, expr) in exprs.iter_mut().enumerate() {
                        let is_last = i + 1 == exprs_len;

                        match &mut **expr {
                            Expr::Seq(SeqExpr { exprs, .. }) => {
                                let exprs = exprs.take();
                                if !is_last {
                                    buf.extend(exprs.into_iter().filter_map(|expr| {
                                        ignore_return_value(expr, &mut has_padding_value)
                                    }));
                                } else {
                                    let exprs_len = exprs.len();
                                    for (i, expr) in exprs.into_iter().enumerate() {
                                        let is_last = i + 1 == exprs_len;
                                        if is_last {
                                            buf.push(expr);
                                        } else {
                                            buf.extend(ignore_return_value(
                                                expr,
                                                &mut has_padding_value,
                                            ));
                                        }
                                    }
                                }
                            }
                            _ => {
                                if is_last {
                                    buf.push(expr.take());
                                } else {
                                    buf.extend(ignore_return_value(
                                        expr.take(),
                                        &mut has_padding_value,
                                    ));
                                }
                            }
                        }
                    }

                    if buf.len() == 1 {
                        *e = *buf.pop().unwrap();
                        return;
                    }

                    ignore_padding_value(buf)
                };

                if current_ctx == Context::Default {
                    if let Some(expr) = exprs.first_mut() {
                        match &mut **expr {
                            Expr::Call(CallExpr {
                                callee: Callee::Expr(callee_expr),
                                ..
                            }) if callee_expr.is_fn_expr() => self.wrap(callee_expr, ctx),
                            // Also handle when the call is inside a binary expression
                            Expr::Bin(BinExpr { left, .. }) => {
                                if let Expr::Call(CallExpr {
                                    callee: Callee::Expr(callee_expr),
                                    ..
                                }) = &mut **left
                                {
                                    if callee_expr.is_fn_expr() {
                                        self.wrap(callee_expr, ctx)
                                    }
                                }
                            }
                            _ => (),
                        }
                    }
                }

                let mut expr = SeqExpr { span: *span, exprs }.into();

                if let Context::ForcedExpr = current_ctx {
                    self.wrap(&mut expr, ctx);
                };

                *e = expr;
            }

            Expr::Cond(expr) => {
                match &mut *expr.test {
                    Expr::Seq(..)
                    | Expr::Assign(..)
                    | Expr::Cond(..)
                    | Expr::Arrow(..)
                    | Expr::Yield(..) => self.wrap(&mut expr.test, ctx),

                    Expr::Object(..) | Expr::Fn(..) | Expr::Class(..) => {
                        if current_ctx == Context::Default {
                            self.wrap(&mut expr.test, ctx)
                        }
                    }
                    _ => {}
                };

                if let Expr::Seq(..) = *expr.cons {
                    self.wrap(&mut expr.cons, ctx)
                };

                if let Expr::Seq(..) = *expr.alt {
                    self.wrap(&mut expr.alt, ctx)
                };

                if let Context::Callee { is_new: true } = current_ctx {
                    self.wrap(e, ctx)
                }
            }

            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                ..
            }) if callee.is_seq()
                || callee.is_arrow()
                || callee.is_await_expr()
                || callee.is_assign() =>
            {
                self.wrap(callee, ctx);
            }
            Expr::OptChain(OptChainExpr { base, .. }) => match &mut **base {
                OptChainBase::Call(OptCall { callee, .. })
                    if callee.is_seq()
                        || callee.is_arrow()
                        || callee.is_await_expr()
                        || callee.is_assign() =>
                {
                    self.wrap(callee, ctx);
                }

                OptChainBase::Call(OptCall { callee, .. }) if callee.is_fn_expr() => {
                    match current_ctx {
                        Context::ForcedExpr | Context::FreeExpr => {}

                        Context::Callee { is_new: true } => self.wrap(e, ctx),

                        _ => self.wrap(callee, ctx),
                    }
                }

                _ => {}
            },

            // Function expression cannot start with `function`
            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                ..
            }) if callee.is_fn_expr() => match current_ctx {
                Context::ForcedExpr | Context::FreeExpr => {}

                Context::Callee { is_new: true } => self.wrap(e, ctx),

                _ => self.wrap(callee, ctx),
            },

            Expr::Member(MemberExpr { obj, .. }) => match &**obj {
                Expr::Lit(Lit::Num(num)) if num.value.signum() == -1. => {
                    self.wrap(obj, ctx);
                }
                _ => {}
            },
            _ => {}
        }
    }

    /// Wrap with a paren.
    fn wrap(&self, e: &mut Expr, ctx: &mut FixerContext) {
        if self.remove_only {
            return;
        }

        let mut span = e.span();

        if let Some(new_span) = ctx.span_map.shift_remove(&span) {
            span = new_span;
        }

        if span.is_pure() {
            span = DUMMY_SP;
        }

        let expr = Box::new(e.take());
        *e = ParenExpr { expr, span }.into();
    }

    /// Removes paren
    fn unwrap_expr(&self, e: &mut Expr, ctx: &mut FixerContext) {
        loop {
            match e {
                Expr::Seq(SeqExpr { exprs, .. }) if exprs.len() == 1 => {
                    *e = *exprs[0].take();
                }

                Expr::Paren(ParenExpr {
                    span: paren_span,
                    expr,
                    ..
                }) => {
                    let expr_span = expr.span();
                    let paren_span = *paren_span;
                    *e = *expr.take();

                    ctx.span_map.insert(expr_span, paren_span);
                }

                _ => return,
            }
        }
    }

    fn handle_expr_stmt(&self, expr: &mut Expr, ctx: &mut FixerContext) {
        match expr {
            // It's important for arrow pass to work properly.
            Expr::Object(..) | Expr::Class(..) | Expr::Fn(..) => self.wrap(expr, ctx),

            // ({ a } = foo)
            Expr::Assign(AssignExpr {
                left: AssignTarget::Pat(left),
                ..
            }) if left.is_object() => self.wrap(expr, ctx),

            Expr::Seq(SeqExpr { exprs, .. }) => {
                debug_assert!(
                    exprs.len() != 1,
                    "SeqExpr should be unwrapped if exprs.len() == 1, but length is 1"
                );

                let len = exprs.len();
                exprs.iter_mut().enumerate().for_each(|(i, expr)| {
                    let is_last = len == i + 1;

                    if !is_last {
                        self.handle_expr_stmt(expr, ctx);
                    }
                });
            }

            _ => {}
        }
    }
}

impl<'a> VisitMutHook<FixerContext> for FixerHook<'a> {
    fn enter_module(&mut self, _n: &mut Module, ctx: &mut FixerContext) {
        debug_assert!(ctx.span_map.is_empty());
        ctx.span_map.clear();
    }

    fn exit_module(&mut self, _n: &mut Module, ctx: &mut FixerContext) {
        if let Some(c) = self.comments {
            for (to, from) in ctx.span_map.drain(RangeFull).rev() {
                c.move_leading(from.lo, to.lo);
                c.move_trailing(from.hi, to.hi);
            }
        }
    }

    fn enter_script(&mut self, _n: &mut Script, ctx: &mut FixerContext) {
        debug_assert!(ctx.span_map.is_empty());
        ctx.span_map.clear();
    }

    fn exit_script(&mut self, _n: &mut Script, ctx: &mut FixerContext) {
        if let Some(c) = self.comments {
            for (to, from) in ctx.span_map.drain(RangeFull).rev() {
                c.move_leading(from.lo, to.lo);
                c.move_trailing(from.hi, to.hi);
            }
        }
    }

    fn enter_array_lit(&mut self, _e: &mut ArrayLit, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::ForcedExpr);
        ctx.push_in_for_stmt_head(false);
    }

    fn exit_array_lit(&mut self, _e: &mut ArrayLit, ctx: &mut FixerContext) {
        ctx.pop_in_for_stmt_head();
        ctx.pop_ctx();
    }

    fn enter_arrow_expr(&mut self, _node: &mut ArrowExpr, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::Default);
    }

    fn enter_function(&mut self, _node: &mut Function, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::Default);
    }

    fn exit_function(&mut self, _node: &mut Function, ctx: &mut FixerContext) {
        ctx.pop_ctx();
    }

    fn exit_arrow_expr(&mut self, node: &mut ArrowExpr, ctx: &mut FixerContext) {
        match &mut *node.body {
            BlockStmtOrExpr::Expr(e) if e.is_seq() => {
                self.wrap(e, ctx);
            }

            BlockStmtOrExpr::Expr(e) if e.is_assign() => {
                if let Expr::Assign(assign) = &**e {
                    if let AssignTarget::Pat(..) = &assign.left {
                        self.wrap(e, ctx);
                    }
                }
            }

            _ => {}
        };
        ctx.pop_ctx();
    }

    // Note: Unlike other handlers, we don't push FreeExpr in enter_assign_expr
    // because the left side should be visited with the parent context (Default),
    // and only the right side should use FreeExpr. Since we can't differentiate
    // between left and right in hooks, we handle this in enter_expr for Assign.

    fn exit_assign_expr(&mut self, expr: &mut AssignExpr, ctx: &mut FixerContext) {
        fn rhs_need_paren(e: &Expr) -> bool {
            match e {
                Expr::Assign(e) => rhs_need_paren(&e.right),
                Expr::Seq(..) => true,
                _ => false,
            }
        }

        if rhs_need_paren(&expr.right) {
            self.wrap(&mut expr.right, ctx);
        }

        fn find_nearest_opt_chain_as_obj(e: &mut Expr) -> Option<&mut Expr> {
            match e {
                Expr::Member(MemberExpr { obj, .. }) => {
                    if obj.is_opt_chain() {
                        Some(obj)
                    } else {
                        find_nearest_opt_chain_as_obj(obj)
                    }
                }
                _ => None,
            }
        }

        let lhs_expr = match &mut expr.left {
            AssignTarget::Simple(e) => Some(e),
            AssignTarget::Pat(..) => None,
            #[cfg(swc_ast_unknown)]
            _ => None,
        };

        if let Some(e) = lhs_expr
            .and_then(|e| e.as_mut_member())
            .and_then(|me| find_nearest_opt_chain_as_obj(&mut me.obj))
        {
            self.wrap(e, ctx)
        };
    }

    fn enter_assign_pat(&mut self, _node: &mut AssignPat, ctx: &mut FixerContext) {
        ctx.push_in_for_stmt_head(false);
    }

    fn exit_assign_pat(&mut self, node: &mut AssignPat, ctx: &mut FixerContext) {
        ctx.pop_in_for_stmt_head();

        if let Expr::Seq(..) = &*node.right {
            self.wrap(&mut node.right, ctx);
        }
    }

    fn enter_assign_pat_prop(&mut self, _node: &mut AssignPatProp, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::ForcedExpr);
        ctx.push_in_for_stmt_head(false);
    }

    fn exit_assign_pat_prop(&mut self, _node: &mut AssignPatProp, ctx: &mut FixerContext) {
        ctx.pop_in_for_stmt_head();
        ctx.pop_ctx();
    }

    fn exit_assign_target(&mut self, n: &mut AssignTarget, _ctx: &mut FixerContext) {
        match n {
            AssignTarget::Simple(a) => {
                if let SimpleAssignTarget::Paren(s) = a {
                    *n = AssignTarget::try_from(s.expr.take()).unwrap();
                }
            }
            AssignTarget::Pat(b) => {
                if let AssignTargetPat::Invalid(_) = b {
                    *n = AssignTarget::Simple(SimpleAssignTarget::Invalid(Invalid {
                        span: DUMMY_SP,
                    }));
                }
            }
            #[cfg(swc_ast_unknown)]
            _ => (),
        }
    }

    fn enter_await_expr(&mut self, _expr: &mut AwaitExpr, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::ForcedExpr);
    }

    fn exit_await_expr(&mut self, expr: &mut AwaitExpr, ctx: &mut FixerContext) {
        ctx.pop_ctx();

        match &*expr.arg {
            Expr::Cond(..)
            | Expr::Assign(..)
            | Expr::Bin(..)
            | Expr::Yield(..)
            | Expr::Arrow(..) => self.wrap(&mut expr.arg, ctx),
            _ => {}
        }
    }

    fn exit_bin_expr(&mut self, expr: &mut BinExpr, ctx: &mut FixerContext) {
        match expr.op {
            op!("||") | op!("&&") => match (&*expr.left, &*expr.right) {
                (Expr::Update(..), Expr::Call(..)) => {
                    return;
                }

                (Expr::Update(..), Expr::Assign(..)) => {
                    self.wrap(&mut expr.right, ctx);
                    return;
                }

                _ => {}
            },

            op!(">") | op!(">=") | op!("<") | op!("<=") => {
                if let (Expr::Update(..) | Expr::Lit(..), Expr::Update(..) | Expr::Lit(..)) =
                    (&*expr.left, &*expr.right)
                {
                    return;
                }
            }

            op!("**") => match &*expr.left {
                Expr::Unary(..) => {
                    self.wrap(&mut expr.left, ctx);
                }
                Expr::Lit(Lit::Num(v)) if v.value.is_sign_negative() => {
                    self.wrap(&mut expr.left, ctx);
                }
                _ => {}
            },

            _ => {}
        }

        match &mut *expr.right {
            Expr::Assign(..)
            | Expr::Seq(..)
            | Expr::Yield(..)
            | Expr::Cond(..)
            | Expr::Arrow(..) => {
                self.wrap(&mut expr.right, ctx);
            }
            Expr::Bin(BinExpr { op: op_of_rhs, .. }) => {
                if *op_of_rhs == expr.op {
                    if !(expr.op.may_short_circuit() || expr.op == op!("**")) {
                        self.wrap(&mut expr.right, ctx);
                    }
                } else if op_of_rhs.precedence() <= expr.op.precedence()
                    || (*op_of_rhs == op!("&&") && expr.op == op!("??"))
                {
                    self.wrap(&mut expr.right, ctx);
                }
            }
            _ => {}
        };

        match &mut *expr.left {
            Expr::Bin(BinExpr { op: op!("??"), .. }) if expr.op != op!("??") => {
                self.wrap(&mut expr.left, ctx);
            }

            Expr::Bin(BinExpr { op: op_of_lhs, .. }) => {
                if op_of_lhs.precedence() < expr.op.precedence()
                    || (op_of_lhs.precedence() == expr.op.precedence() && expr.op == op!("**"))
                {
                    self.wrap(&mut expr.left, ctx);
                }
            }

            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) if expr.op == op!("==")
                || expr.op == op!("===")
                || expr.op == op!("!=")
                || expr.op == op!("!==") => {}

            Expr::Seq(..)
            | Expr::Unary(UnaryExpr {
                op: op!("delete"), ..
            })
            | Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            })
            | Expr::Yield(..)
            | Expr::Cond(..)
            | Expr::Assign(..)
            | Expr::Arrow(..) => {
                self.wrap(&mut expr.left, ctx);
            }
            Expr::Object(..)
                if expr.op == op!("instanceof")
                    || expr.op == op!("==")
                    || expr.op == op!("===")
                    || expr.op == op!("!=")
                    || expr.op == op!("!==") =>
            {
                self.wrap(&mut expr.left, ctx)
            }
            _ => {}
        }

        if let op!("??") = expr.op {
            match &*expr.left {
                Expr::Bin(BinExpr { op, .. }) if *op != op!("??") => {
                    self.wrap(&mut expr.left, ctx);
                }
                _ => (),
            }
        }
    }

    fn enter_block_stmt(&mut self, _n: &mut BlockStmt, ctx: &mut FixerContext) {
        ctx.push_in_for_stmt_head(false);
    }

    fn exit_block_stmt(&mut self, _n: &mut BlockStmt, ctx: &mut FixerContext) {
        ctx.pop_in_for_stmt_head();
    }

    fn exit_block_stmt_or_expr(&mut self, body: &mut BlockStmtOrExpr, ctx: &mut FixerContext) {
        match body {
            BlockStmtOrExpr::Expr(expr) if expr.is_object() => {
                self.wrap(expr, ctx);
            }

            _ => {}
        }
    }

    fn enter_call_expr(&mut self, _node: &mut CallExpr, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::Callee { is_new: false });
    }

    fn exit_call_expr(&mut self, node: &mut CallExpr, ctx: &mut FixerContext) {
        if let Callee::Expr(e) = &mut node.callee {
            match &**e {
                Expr::OptChain(_) if !ctx.in_opt_chain() => self.wrap(e, ctx),
                _ => self.wrap_callee(e, ctx),
            }
        }
        ctx.pop_ctx();
    }

    fn enter_class(&mut self, _node: &mut Class, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::Default);
        ctx.push_in_for_stmt_head(false);
    }

    fn exit_class(&mut self, node: &mut Class, ctx: &mut FixerContext) {
        ctx.pop_in_for_stmt_head();

        match &mut node.super_class {
            Some(e)
                if e.is_seq()
                    || e.is_await_expr()
                    || e.is_yield_expr()
                    || e.is_bin()
                    || e.is_assign()
                    || e.is_cond()
                    || e.is_unary() =>
            {
                self.wrap(e, ctx)
            }
            _ => {}
        };
        ctx.pop_ctx();

        node.body.retain(|m| !matches!(m, ClassMember::Empty(..)));
    }

    fn enter_computed_prop_name(&mut self, _name: &mut ComputedPropName, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::FreeExpr);
    }

    fn exit_computed_prop_name(&mut self, _name: &mut ComputedPropName, ctx: &mut FixerContext) {
        ctx.pop_ctx();
    }

    fn enter_cond_expr(&mut self, _expr: &mut CondExpr, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::FreeExpr);
    }

    fn exit_cond_expr(&mut self, _expr: &mut CondExpr, ctx: &mut FixerContext) {
        ctx.pop_ctx();
    }

    fn enter_export_default_expr(&mut self, _node: &mut ExportDefaultExpr, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::Default);
    }

    fn exit_export_default_expr(&mut self, node: &mut ExportDefaultExpr, ctx: &mut FixerContext) {
        match &mut *node.expr {
            Expr::Arrow(..) | Expr::Seq(..) => self.wrap(&mut node.expr, ctx),
            Expr::Fn(FnExpr { ident: Some(_), .. })
            | Expr::Class(ClassExpr { ident: Some(_), .. }) => self.wrap(&mut node.expr, ctx),
            _ => {}
        };
        ctx.pop_ctx();
    }

    fn enter_expr(&mut self, e: &mut Expr, ctx: &mut FixerContext) {
        let current_ctx = ctx.ctx();

        // IMPORTANT: Unwrap first, because the expression type may change
        // (e.g., ParenExpr -> BinExpr), and context decision depends on type.
        self.unwrap_expr(e, ctx);

        // Save the ORIGINAL context (before any modification).
        // This matches the original code's pattern of save-modify-restore.
        ctx.expr_saved_ctx_stack.push(current_ctx);

        // Modify context for certain expr types (only if current is Default)
        if current_ctx == Context::Default {
            match e {
                // These types keep Default context (can have expr children at start of stmt)
                // Note: Call is NOT in this list - it changes to FreeExpr
                Expr::OptChain(_)
                | Expr::Member(_)
                | Expr::Bin(_)
                | Expr::Assign(_)
                | Expr::Seq(_)
                | Expr::Cond(_)
                | Expr::TaggedTpl(_)
                | Expr::Update(UpdateExpr { prefix: false, .. }) => {}
                // Others change to FreeExpr
                _ => {
                    ctx.set_ctx(Context::FreeExpr);
                }
            }
        }
    }

    fn exit_expr(&mut self, e: &mut Expr, ctx: &mut FixerContext) {
        // Restore context to saved value
        if let Some(saved_ctx) = ctx.expr_saved_ctx_stack.pop() {
            ctx.set_ctx(saved_ctx);
        }

        self.wrap_with_paren_if_required(e, ctx);
    }

    fn enter_expr_or_spread(&mut self, _e: &mut ExprOrSpread, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::ForcedExpr);
    }

    fn exit_expr_or_spread(&mut self, e: &mut ExprOrSpread, ctx: &mut FixerContext) {
        ctx.pop_ctx();

        if e.spread.is_none() {
            if let Expr::Yield(..) = *e.expr {
                self.wrap(&mut e.expr, ctx);
            }
        }
    }

    fn enter_expr_stmt(&mut self, _s: &mut ExprStmt, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::Default);
    }

    fn exit_expr_stmt(&mut self, s: &mut ExprStmt, ctx: &mut FixerContext) {
        ctx.pop_ctx();
        self.handle_expr_stmt(&mut s.expr, ctx);
    }

    fn enter_for_head(&mut self, _n: &mut ForHead, ctx: &mut FixerContext) {
        ctx.push_in_for_stmt_head(true);
    }

    fn exit_for_head(&mut self, _n: &mut ForHead, ctx: &mut FixerContext) {
        ctx.pop_in_for_stmt_head();
    }

    fn exit_for_of_stmt(&mut self, s: &mut ForOfStmt, ctx: &mut FixerContext) {
        if !s.is_await {
            match &s.left {
                ForHead::Pat(p)
                    if match &**p {
                        Pat::Ident(BindingIdent {
                            id: Ident { sym, .. },
                            ..
                        }) => &**sym == "async",
                        _ => false,
                    } =>
                {
                    let expr: Pat = p.clone().expect_ident().into();
                    s.left = ForHead::Pat(expr.into());
                }
                _ => (),
            }

            if let ForHead::Pat(e) = &mut s.left {
                if let Pat::Expr(expr) = &mut **e {
                    if expr.is_ident_ref_to("async") {
                        self.wrap(&mut *expr, ctx);
                    }
                }
            }
        }

        if let Expr::Seq(..) | Expr::Await(..) = &*s.right {
            self.wrap(&mut s.right, ctx)
        }
    }

    fn enter_var_decl_or_expr(&mut self, _n: &mut VarDeclOrExpr, ctx: &mut FixerContext) {
        // VarDeclOrExpr is only used in ForStmt.init, so this correctly sets
        // in_for_stmt_head=true only for the init part of for statements.
        ctx.push_in_for_stmt_head(true);
    }

    fn exit_var_decl_or_expr(&mut self, _n: &mut VarDeclOrExpr, ctx: &mut FixerContext) {
        ctx.pop_in_for_stmt_head();
    }

    fn exit_if_stmt(&mut self, node: &mut IfStmt, _ctx: &mut FixerContext) {
        if will_eat_else_token(&node.cons) {
            node.cons = Box::new(
                BlockStmt {
                    span: node.cons.span(),
                    stmts: vec![*node.cons.take()],
                    ..Default::default()
                }
                .into(),
            );
        }
    }

    fn enter_key_value_pat_prop(&mut self, _node: &mut KeyValuePatProp, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::ForcedExpr);
    }

    fn exit_key_value_pat_prop(&mut self, _node: &mut KeyValuePatProp, ctx: &mut FixerContext) {
        ctx.pop_ctx();
    }

    fn exit_key_value_prop(&mut self, prop: &mut KeyValueProp, ctx: &mut FixerContext) {
        if let Expr::Seq(..) = *prop.value {
            self.wrap(&mut prop.value, ctx)
        }
    }

    fn exit_member_expr(&mut self, n: &mut MemberExpr, ctx: &mut FixerContext) {
        let current_ctx = ctx.ctx();

        match *n.obj {
            Expr::Object(..) if current_ctx == Context::ForcedExpr => {}
            Expr::Fn(..)
            | Expr::Cond(..)
            | Expr::Unary(..)
            | Expr::Seq(..)
            | Expr::Update(..)
            | Expr::Bin(..)
            | Expr::Object(..)
            | Expr::Assign(..)
            | Expr::Arrow(..)
            | Expr::Class(..)
            | Expr::Yield(..)
            | Expr::Await(..)
            | Expr::New(NewExpr { args: None, .. }) => {
                self.wrap(&mut n.obj, ctx);
            }
            Expr::Call(..) if current_ctx == Context::Callee { is_new: true } => {
                self.wrap(&mut n.obj, ctx);
            }
            Expr::OptChain(..) if !ctx.in_opt_chain() => {
                self.wrap(&mut n.obj, ctx);
            }
            _ => {}
        }
    }

    fn enter_new_expr(&mut self, _node: &mut NewExpr, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::Callee { is_new: true });
    }

    fn exit_new_expr(&mut self, node: &mut NewExpr, ctx: &mut FixerContext) {
        ctx.pop_ctx();

        match *node.callee {
            Expr::Call(..)
            | Expr::Cond(..)
            | Expr::Await(..)
            | Expr::Yield(..)
            | Expr::Bin(..)
            | Expr::Assign(..)
            | Expr::Seq(..)
            | Expr::Unary(..)
            | Expr::Lit(..) => self.wrap(&mut node.callee, ctx),
            Expr::Member(MemberExpr { ref obj, .. }) if obj.is_call() => {
                self.wrap(&mut node.callee, ctx);
            }
            _ => {}
        }
    }

    fn enter_opt_call(&mut self, _node: &mut OptCall, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::Callee { is_new: false });
        ctx.push_in_opt_chain(true);
    }

    fn exit_opt_call(&mut self, node: &mut OptCall, ctx: &mut FixerContext) {
        self.wrap_callee(&mut node.callee, ctx);
        ctx.pop_in_opt_chain();
        ctx.pop_ctx();
    }

    fn enter_opt_chain_base(&mut self, n: &mut OptChainBase, ctx: &mut FixerContext) {
        if n.is_member() {
            ctx.push_in_opt_chain(true);
        }
    }

    fn exit_opt_chain_base(&mut self, n: &mut OptChainBase, ctx: &mut FixerContext) {
        if n.is_member() {
            ctx.pop_in_opt_chain();
        }
    }

    fn enter_param(&mut self, _node: &mut Param, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::ForcedExpr);
    }

    fn exit_param(&mut self, _node: &mut Param, ctx: &mut FixerContext) {
        ctx.pop_ctx();
    }

    fn exit_prop_name(&mut self, name: &mut PropName, ctx: &mut FixerContext) {
        match name {
            PropName::Computed(c) if c.expr.is_seq() => {
                self.wrap(&mut c.expr, ctx);
            }
            _ => {}
        }
    }

    fn enter_seq_expr(&mut self, _seq: &mut SeqExpr, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::FreeExpr);
    }

    fn exit_seq_expr(&mut self, _seq: &mut SeqExpr, ctx: &mut FixerContext) {
        ctx.pop_ctx();
    }

    fn enter_spread_element(&mut self, _e: &mut SpreadElement, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::ForcedExpr);
    }

    fn exit_spread_element(&mut self, _e: &mut SpreadElement, ctx: &mut FixerContext) {
        ctx.pop_ctx();
    }

    fn exit_tagged_tpl(&mut self, e: &mut TaggedTpl, ctx: &mut FixerContext) {
        // Note: Object case with Context::Default is handled in
        // wrap_with_paren_if_required because it needs the restored context
        // (after exit_expr), not the current context.
        match &*e.tag {
            Expr::OptChain(..)
            | Expr::Arrow(..)
            | Expr::Cond(..)
            | Expr::Bin(..)
            | Expr::Seq(..)
            | Expr::Fn(..)
            | Expr::Assign(..)
            | Expr::Unary(..) => {
                self.wrap(&mut e.tag, ctx);
            }
            _ => {}
        }
    }

    fn enter_unary_expr(&mut self, _n: &mut UnaryExpr, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::FreeExpr);
    }

    fn exit_unary_expr(&mut self, n: &mut UnaryExpr, ctx: &mut FixerContext) {
        ctx.pop_ctx();

        match &*n.arg {
            Expr::Bin(BinExpr {
                op: op!("/") | op!("*"),
                left,
                right,
                ..
            }) if n.op == op!(unary, "-")
                && match (&**left, &**right) {
                    (Expr::Lit(Lit::Num(l)), Expr::Lit(Lit::Num(..))) => {
                        !l.value.is_sign_negative()
                    }
                    _ => false,
                } => {}

            Expr::Assign(..)
            | Expr::Bin(..)
            | Expr::Seq(..)
            | Expr::Cond(..)
            | Expr::Arrow(..)
            | Expr::Yield(..) => self.wrap(&mut n.arg, ctx),

            _ => {}
        }
    }

    fn enter_var_declarator(&mut self, _node: &mut VarDeclarator, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::ForcedExpr);
    }

    fn exit_var_declarator(&mut self, _node: &mut VarDeclarator, ctx: &mut FixerContext) {
        ctx.pop_ctx();
    }

    fn enter_yield_expr(&mut self, _expr: &mut YieldExpr, ctx: &mut FixerContext) {
        ctx.push_ctx(Context::ForcedExpr);
    }

    fn exit_yield_expr(&mut self, _expr: &mut YieldExpr, ctx: &mut FixerContext) {
        ctx.pop_ctx();
    }

    fn enter_object_lit(&mut self, _n: &mut ObjectLit, ctx: &mut FixerContext) {
        ctx.push_in_for_stmt_head(false);
    }

    fn exit_object_lit(&mut self, _n: &mut ObjectLit, ctx: &mut FixerContext) {
        ctx.pop_in_for_stmt_head();
    }

    fn enter_params(&mut self, _n: &mut Vec<Param>, ctx: &mut FixerContext) {
        ctx.push_in_for_stmt_head(false);
    }

    fn exit_params(&mut self, _n: &mut Vec<Param>, ctx: &mut FixerContext) {
        ctx.pop_in_for_stmt_head();
    }

    fn enter_pats(&mut self, _n: &mut Vec<Pat>, ctx: &mut FixerContext) {
        ctx.push_in_for_stmt_head(false);
    }

    fn exit_pats(&mut self, _n: &mut Vec<Pat>, ctx: &mut FixerContext) {
        ctx.pop_in_for_stmt_head();
    }

    fn enter_expr_or_spreads(&mut self, _n: &mut Vec<ExprOrSpread>, ctx: &mut FixerContext) {
        ctx.push_in_for_stmt_head(false);
    }

    fn exit_expr_or_spreads(&mut self, _n: &mut Vec<ExprOrSpread>, ctx: &mut FixerContext) {
        ctx.pop_in_for_stmt_head();
    }
}

fn ignore_return_value(expr: Box<Expr>, has_padding_value: &mut bool) -> Option<Box<Expr>> {
    match *expr {
        Expr::Fn(..) | Expr::Arrow(..) | Expr::Lit(..) => {
            if *has_padding_value {
                None
            } else {
                *has_padding_value = true;
                Some(expr)
            }
        }
        Expr::Seq(SeqExpr { span, exprs }) => {
            let len = exprs.len();
            let mut exprs: Vec<_> = exprs
                .into_iter()
                .enumerate()
                .filter_map(|(i, expr)| {
                    if i + 1 == len {
                        Some(expr)
                    } else {
                        ignore_return_value(expr, has_padding_value)
                    }
                })
                .collect();

            match exprs.len() {
                0 | 1 => exprs.pop(),
                _ => Some(SeqExpr { span, exprs }.into()),
            }
        }
        Expr::Unary(UnaryExpr {
            op: op!("void"),
            arg,
            ..
        }) => ignore_return_value(arg, has_padding_value),
        _ => Some(expr),
    }
}

// at least 3 element in seq, which means we can safely
// remove that padding, if not at last position
#[allow(clippy::vec_box)]
fn ignore_padding_value(exprs: Vec<Box<Expr>>) -> Vec<Box<Expr>> {
    let len = exprs.len();

    if len > 2 {
        exprs
            .into_iter()
            .enumerate()
            .filter_map(|(i, e)| match e.as_ref() {
                Expr::Fn(..) | Expr::Arrow(..) | Expr::Lit(..) if i + 1 != len => None,
                _ => Some(e),
            })
            .collect()
    } else {
        exprs
    }
}

fn will_eat_else_token(s: &Stmt) -> bool {
    match s {
        Stmt::If(s) => match &s.alt {
            Some(alt) => will_eat_else_token(alt),
            None => true,
        },
        // Ends with `}`.
        Stmt::Block(..) => false,

        Stmt::Labeled(s) => will_eat_else_token(&s.body),

        Stmt::While(s) => will_eat_else_token(&s.body),

        Stmt::For(s) => will_eat_else_token(&s.body),

        Stmt::ForIn(s) => will_eat_else_token(&s.body),

        Stmt::ForOf(s) => will_eat_else_token(&s.body),

        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_ast::noop_pass;

    fn run_test(from: &str, to: &str) {
        crate::tests::test_transform(
            Default::default(),
            // test_transform has alreay included fixer
            |_| noop_pass(),
            from,
            to,
            true,
            Default::default,
        );
    }

    macro_rules! test_fixer {
        ($name:ident, $from:literal, $to:literal) => {
            #[test]
            fn $name() {
                run_test($from, $to);
            }
        };
    }

    macro_rules! identical {
        ($name:ident, $src:literal) => {
            test_fixer!($name, $src, $src);
        };
    }

    identical!(fn_expr_position, r#"foo(function(){}())"#);

    identical!(fn_decl, r#"function foo(){}"#);

    identical!(iife, r#"(function(){})()"#);

    identical!(paren_seq_arg, "foo(( _temp = _this = init(), _temp));");

    identical!(
        regression_01,
        "_set(_get_prototype_of(Obj.prototype), _ref = proper.prop, (_superRef = \
         +_get(_get_prototype_of(Obj.prototype), _ref, this)) + 1, this, true), _superRef;"
    );

    identical!(
        regression_02,
        "var obj = (_obj = {}, _define_property(_obj, 'first', 'first'), _define_property(_obj, \
         'second', 'second'), _obj);"
    );

    identical!(
        regression_03,
        "_iteratorNormalCompletion = (_step = _iterator.next()).done"
    );

    identical!(
        regression_04,
        "var _tmp;
const _ref = {}, { c =( _tmp = {}, d = _extends({}, _tmp), _tmp)  } = _ref;"
    );

    identical!(
        regression_05,
        "for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step \
         = _iterator.next()).done); _iteratorNormalCompletion = true) {
    i = _step.value;
}"
    );

    identical!(
        regression_06,
        "
        var _tmp;
        const { [( _tmp = {}, d = _extends({}, _tmp), _tmp)]: c  } = _ref;
        "
    );

    identical!(
        regression_07,
        "( _temp = super(), _initialize(this), _temp).method();"
    );

    identical!(regression_08, "exports.bar = exports.default = void 0;");

    identical!(regression_09, "({x} = { x: 1 });");

    identical!(regression_10, "({x} = { x: 1 }), exports.x = x;");

    identical!(regression_11, "(void 0).foo();");

    identical!(regression_12, "(function(){})()");

    identical!(regression_13, "a || (a = 1);");

    // IIFE in assignment context - fn expr must be wrapped
    identical!(iife_in_assign, "result = (function() {})();");

    // IIFE with body in assignment context
    test_fixer!(
        iife_in_assign_with_body,
        "result = function() { if (a) { return 1; } }();",
        "result = (function() { if (a) { return 1; } })();"
    );

    // IIFE inside switch case inside function
    test_fixer!(
        iife_in_switch_case,
        "function f() { switch(x) { case 0: res = function() { return 1; }(); } }",
        "function f() { switch(x) { case 0: res = (function() { return 1; })(); } }"
    );

    // Nested IIFE pattern matching generator output
    test_fixer!(
        iife_nested_generator,
        r#"(function() {
            return foo(function() {
                return bar(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            res = function() {
                                return foo(function() {
                                    return 1;
                                })();
                            }();
                    }
                });
            })();
        })();"#,
        r#"(function() {
            return foo(function() {
                return bar(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            res = (function() {
                                return foo(function() {
                                    return 1;
                                })();
                            })();
                    }
                });
            })();
        })();"#
    );

    // Simple IIFE inside function body
    test_fixer!(
        iife_inside_fn_body,
        "function outer() { res = function() { return 1; }(); }",
        "function outer() { res = (function() { return 1; })(); }"
    );

    identical!(issue_192, "a === true && (a = true)");

    // FnExpr on left of BinExpr in assignment
    test_fixer!(
        fn_expr_in_bin_left_assign,
        "x = function(a) { return a; } && function(b) { return b; };",
        "x = (function(a) { return a; }) && function(b) { return b; };"
    );

    identical!(issue_199, "(i - 1).toString()");

    identical!(
        issue_201_01,
        "outer = {
    inner: (_obj = {}, _define_property(_obj, ns.EXPORT1, true), _define_property(_obj, \
         ns.EXPORT2, true), _obj)
};"
    );

    identical!(issue_207, "a => ({x: 'xxx', y: {a}});");

    test_fixer!(
        fixer_01,
        "var a, b, c, d, e, f;
((a, b), (c())) + ((d, e), (f()));
",
        "var a, b, c, d, e, f;
(a, b, c()) + (d, e, f())"
    );

    test_fixer!(fixer_02, "(b, c), d;", "b, c, d;");

    test_fixer!(fixer_03, "((a, b), (c && d)) && e;", "(a, b, c && d) && e;");

    test_fixer!(fixer_04, "for ((a, b), c;;) ;", "for(a, b, c;;);");

    test_fixer!(
        fixer_05,
        "var a, b, c = (1), d, e, f = (2);
((a, b), c) + ((d, e), f);",
        "var a, b, c = 1, d, e, f = 2;
(a, b, c) + (d, e, f);"
    );

    test_fixer!(
        fixer_06,
        "var a, b, c, d;
a = ((b, c), d);",
        "var a, b, c, d;
a = (b, c, d);"
    );

    test_fixer!(
        fixer_07,
        "a => ((b, c) => ((a, b), c));",
        "(a)=>(b, c)=>(a, b, c);"
    );

    test_fixer!(fixer_08, "typeof (((1), a), (2));", "typeof (a, 2)");

    test_fixer!(
        fixer_09,
        "(((a, b), c), d) ? e : f;",
        "(a, b, c, d) ? e : f;"
    );

    test_fixer!(
        fixer_10,
        "
function a() {
  return (((void (1)), (void (2))), a), (void (3));
}
",
        "
function a() {
  return a, void 3;
}
"
    );

    test_fixer!(fixer_11, "c && ((((2), (3)), d), b);", "c && (d, b)");

    test_fixer!(fixer_12, "(((a, b), c), d) + e;", "(a, b, c, d) + e;");

    test_fixer!(fixer_13, "delete (((1), a), (2));", "delete (a, 2)");

    test_fixer!(fixer_14, "(1, 2, a)", "1, a");

    identical!(issue_231, "'' + (truthy && '?') + truthy;");

    identical!(issue_252, "!!(a && b);");

    identical!(issue_255, "b < 0 ? (t = b, b = 1) : (t = -b, b = 0);");

    identical!(
        issue_266_1,
        "'Q' + +x1 + ',' + +y1 + ',' + (this._x1 = +x) + ',' + (this._y1 = +y);"
    );

    test_fixer!(
        issue_266_2,
        "'Q' + (+x1) + ',' + (+y1) + ',' + (this._x1 = +x) + ',' + (this._y1 = +y);",
        "'Q' + +x1 + ',' + +y1 + ',' + (this._x1 = +x) + ',' + (this._y1 = +y);"
    );

    identical!(
        issue_280,
        "e.hasOwnProperty(a) && (t = e[a] ? this[a] = t(n) : 'target' === a ? this.target = r : \
         this[a] = n[a]);"
    );

    identical!(
        issue_282,
        "!(A = [], B = (function () { return classNames; }).apply(exports, A), B !== undefined && \
         (module.exports = B));"
    );

    identical!(
        issue_286,
        "var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(39) ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});"
    );

    identical!(
        issue_293_1,
        "for (var e in a) a.hasOwnProperty(e) && ((b = a[e]) ? this[e] = b(c) : 'target' === e ? \
         this.target = d : this[e] = c[e]);"
    );

    identical!(
        issue_293_2,
        "(a = rb ? zb(a, c) : Ab(a, c)) ? (b = nb.getPooled(ub.beforeInput, b, c, d), b.data = a, \
         Ra(b)) : b = null;"
    );

    identical!(member_object_lit, "({}).foo");

    identical!(member_cond_expr, "(foo ? 1 : 2).foo");

    identical!(member_new_exp_1, "(new Foo).foo");

    identical!(member_new_exp_2, "new ctor().property");

    identical!(member_tagged_tpl, "tag``.foo");

    identical!(member_arrow_expr_1, "(a => a).foo");

    identical!(member_arrow_expr_2, "((a) => a).foo");

    identical!(member_class, "(class Foo{}).foo");

    identical!(member_yield, "function* foo(){ (yield bar).baz }");

    identical!(member_await, "async function foo(){ (await bar).baz }");

    identical!(bin_yield_expr_1, "function* foo(){ (yield foo) && bar }");

    identical!(bin_yield_expr_2, "function* foo(){ bar && (yield foo) }");

    identical!(bin_seq_expr_1, "(foo(), op) || (seq(), foo)");

    identical!(bin_seq_expr_2, "(foo, op) || (seq, foo)");

    identical!(cond_object_1, "let foo = {} ? 1 : 2;");

    identical!(cond_object_2, "({}) ? 1 : 2;");

    identical!(cond_in_cond, "(foo ? 1 : 2) ? 3 : 4");

    identical!(arrow_in_cond, "(() => {}) ? 3 : 4");

    identical!(unary_cond_arg, "void (foo ? 1 : 2)");

    identical!(unary_arrow_arg, "void ((foo) => foo)");

    identical!(unary_yield_arg, "(function* foo() { void (yield foo); })()");

    identical!(
        issue_365,
        "const foo = (() => {
  return 1
})();"
    );

    identical!(
        issue_382_1,
        "const myFilter = (arr, filter) => arr.filter(((x) => x) || filter);"
    );

    identical!(
        issue_382_2,
        "const myFilter = (arr, filter) => arr.filter(filter || ((x) => x));"
    );

    identical!(issue_418, "const a = 1 - (1 - 1)");

    test_fixer!(
        issue_439,
        "() => {
  return (
    Promise.resolve('foo')
      // Interfering comment
      .then(() => {})
  );
};",
        "() => {
  return Promise.resolve('foo')
      // Interfering comment
      .then(() => {})
  ;
};"
    );

    test_fixer!(
        issue_451,
        "const instance = new (
  function() {
    function klass(opts) {
      this.options = opts;
    }
    return (Object.assign(klass.prototype, {
      method() {}
    }), klass);
  }()
)({ foo: 1 });",
        "const instance = new (function() {
    function klass(opts) {
        this.options = opts;
    }
    return Object.assign(klass.prototype, {
        method () {
        }
    }), klass;
}())({
    foo: 1
});"
    );

    test_fixer!(void_and_bin, "(void 0) * 2", "(void 0) * 2");

    test_fixer!(new_cond, "new (a ? B : C)()", "new (a ? B : C)()");

    identical!(issue_931, "new (eval('Date'))();");

    identical!(issue_1002, "new (P || (P = Promise))");

    identical!(
        issue_1050,
        "
        (a) => (set) => (elemE(a, set) ? removeE : insertE)(a)(set)
        "
    );

    identical!(
        deno_001,
        "
    var Status;
    (function init(Status1) {
    })(Status || (Status = {
    }));
"
    );

    identical!(issue_1093, "const x = (fnA || fnB)();");

    identical!(
        issue_1133,
        "async function foo() {
            const item = await (data === null || data === void 0 ? void 0 : data.foo());
        }"
    );

    identical!(deno_8722, "console.log((true || false) ?? true);");

    identical!(
        deno_8597,
        "
        biasInitializer = new (_a = class CustomInit extends Initializer {})();
        "
    );

    test_fixer!(
        minifier_001,
        "var bitsLength = 3, bitsOffset = 3, what = (len = 0)",
        "var bitsLength = 3, bitsOffset = 3, what = len = 0"
    );

    test_fixer!(minifier_002, "!(function(){})()", "!function(){}()");

    identical!(
        issue_1397,
        "const main = async () => await (await server)()"
    );

    identical!(deno_9810, "await (bar = Promise.resolve(2));");

    identical!(issue_1493, "('a' ?? 'b') || ''");
    identical!(call_seq, "let x = ({}, () => 2)();");

    test_fixer!(
        call_seq_with_padding,
        "let x = ({}, (1, 2), () => 2)();",
        "let x = ({}, () => 2)();"
    );

    identical!(
        param_seq,
        "function t(x = ({}, 2)) {
            return x;
        }"
    );

    identical!(
        yield_expr_cond,
        "function *test1(foo) {
            return (yield foo) ? 'bar' : 'baz';
        }"
    );

    identical!(
        deno_10487_1,
        "var generator = class MultiVector extends (options.baseType||Float32Array) {}"
    );

    identical!(
        deno_10487_2,
        "class MultiVector extends (options.baseType||Float32Array) {}"
    );

    identical!(
        extends_nullish_coalescing,
        "class Foo extends (Bar ?? class{}) {}"
    );

    identical!(extends_assign, "class Foo extends (Bar = class{}) {}");

    identical!(
        extends_logical_or_assin,
        "class Foo extends (Bar ||= class{}) {}"
    );

    identical!(
        extends_logical_and_assin,
        "class Foo extends (Bar &&= class{}) {}"
    );

    identical!(
        extends_logical_nullish_assin,
        "class Foo extends (Bar ??= class{}) {}"
    );

    identical!(extends_cond, "class Foo extends (true ? Bar : Baz) {}");

    identical!(
        extends_await_yield,
        "
        async function* func() {
            class A extends (await p) {}
            class B extends (yield p) {}
        }
        "
    );

    identical!(deno_10668_1, "console.log(null ?? (undefined && true))");

    identical!(deno_10668_2, "console.log(null && (undefined ?? true))");

    identical!(minifier_003, "(four ** one) ** two");

    identical!(minifier_004, "(void 0)(0)");

    identical!(issue_1781, "const n = ~~(Math.PI * 10)");

    identical!(issue_1789, "+(+1 / 4)");

    identical!(new_member_call_1, "new (getObj()).ctor()");
    test_fixer!(
        new_member_call_2,
        "new (getObj().ctor)()",
        "new (getObj()).ctor()"
    );
    test_fixer!(
        new_member_call_3,
        "new (x.getObj().ctor)()",
        "new (x.getObj()).ctor()"
    );
    identical!(new_call, "new (getCtor())");
    test_fixer!(new_member_1, "new obj.ctor()", "new obj.ctor()");
    test_fixer!(new_member_2, "new (obj.ctor)", "new obj.ctor");

    identical!(
        new_await_1,
        "async function foo() { new (await getServerImpl())(options) }"
    );
    test_fixer!(minifier_005, "-(1/0)", "-1/0");

    test_fixer!(minifier_006, "-('s'/'b')", "-('s'/'b')");

    test_fixer!(minifier_007, "(void 0) === value", "void 0 === value");
    test_fixer!(minifier_008, "(size--) && (b = (c))", "size-- && (b = c)");

    test_fixer!(
        minifier_009,
        "(--remaining) || deferred.resolveWith()",
        "--remaining || deferred.resolveWith()"
    );

    test_fixer!(minifier_010, "(--remaining) + ''", "--remaining + ''");

    identical!(
        if_stmt_001,
        "
        export const obj = {
            each: function (obj, callback, args) {
                var i = 0, length = obj.length, isArray = isArraylike(obj);
                if (args) {
                    if (isArray)
                        for (; i < length && !1 !== callback.apply(obj[i], args); i++);
                    else
                        for (i in obj)
                            if (!1 === callback.apply(obj[i], args))
                                break
                } else if (isArray)
                    for (; i < length && !1 !== callback.call(obj[i], i, obj[i]); i++);
                else
                    for (i in obj)
                        if (!1 === callback.call(obj[i], i, obj[i]))
                            break;
                return obj
            }
        };
        "
    );

    identical!(
        issue_2155,
        "
        async function main() {
            let promise;
            await (promise || (promise = Promise.resolve('this is a string')));
        }
        "
    );

    identical!(issue_2163_1, "() => ({foo} = bar());");

    identical!(issue_2163_2, "() => ([foo] = bar());");

    identical!(issue_2191, "(-1) ** h");

    identical!(
        minifier_011,
        "
        function ItemsList() {
            var _ref;

            var _temp, _this, _ret;

            _class_call_check(this, ItemsList);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possible_constructor_return(this, (_ref = \
         ItemsList.__proto__ || Object.getPrototypeOf(ItemsList)).call.apply(_ref, \
         [this].concat(args))), _this), _this.storeHighlightedItemReference = function \
         (highlightedItem) {
              _this.props.onHighlightedItemChange(highlightedItem === null ? null : \
         highlightedItem.item);
            }, _temp), _possible_constructor_return(_this, _ret);
          }
        "
    );

    identical!(
        minifier_012,
        "
        function ItemsList() {
            for(var _ref, _temp, _this, _len = arguments.length, args = Array(_len), _key = 0; \
         _key < _len; _key++)args[_key] = arguments[_key];
            return _possible_constructor_return(_this, (_temp = (_this = \
         _possible_constructor_return(this, (_ref = ItemsList.__proto__ || \
         Object.getPrototypeOf(ItemsList)).call.apply(_ref, [
                this
            ].concat(args))), _this), _this.storeHighlightedItemReference = \
         function(highlightedItem) {
                _this.props.onHighlightedItemChange(null === highlightedItem ? null : \
         highlightedItem.item);
            }, _temp));
        }
        "
    );

    test_fixer!(issue_2550_1, "(1 && { a: 1 })", "1 && { a:1 }");

    identical!(issue_2550_2, "({ isNewPrefsActive }) && { a: 1 }");

    test_fixer!(paren_of_bin_left_1, "({} && 1)", "({}) && 1");
    identical!(paren_of_bin_left_2, "({}) && 1");
    test_fixer!(
        paren_of_bin_left_3,
        "(function () {} || 2)",
        "(function () {}) || 2"
    );
    identical!(paren_of_bin_left_4, "(function () {}) || 2");

    test_fixer!(paren_of_bin_left_5, "(class{} ?? 3)", "(class{}) ?? 3");
    identical!(paren_of_bin_left_6, "(class{}) ?? 3");

    identical!(issue_4761, "x = { ...(0, foo) }");

    identical!(issue_4914, "(a ?? b)?.()");

    identical!(issue_5109_1, "(0, b)?.()");
    identical!(issue_5109_2, "1 + (0, b)?.()");
    identical!(issue_5109_3, "(0, a)() ? undefined : (0, b)?.()");

    identical!(
        issue_5313,
        "
        async function* foo() {
            (await a)();
            (yield b)();
        }
        "
    );

    identical!(issue_5417, "console.log(a ?? b ?? c)");

    identical!(bin_and_unary, "console.log(a++ && b--)");

    test_fixer!(
        issue_11322,
        "((function () { })() && a, b)",
        "(function () { })() && a, b"
    );

    test_fixer!(
        issue_11322_simple,
        "(function () { })() && a",
        "(function () { })() && a"
    );

    test_fixer!(
        issue_11322_stmt,
        "(function () { })() && a;",
        "(function () { })() && a;"
    );
}
