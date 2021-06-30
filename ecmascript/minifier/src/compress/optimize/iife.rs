use super::Optimizer;
use crate::compress::optimize::Ctx;
use crate::util::idents_used_by;
use crate::util::make_number;
use crate::util::IdentUsageCollector;
use fxhash::FxHashMap;
use std::collections::HashMap;
use std::mem::replace;
use std::mem::swap;
use swc_atoms::js_word;
use swc_common::pass::Either;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::undefined;
use swc_ecma_utils::DestructuringFinder;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Id;
use swc_ecma_utils::{find_ids, ExprFactory};
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;

/// Methods related to the option `negate_iife`.
impl Optimizer<'_> {
    /// Negates iife, while ignore return value.
    pub(super) fn negate_iife_ignoring_ret(&mut self, e: &mut Expr) {
        if !self.options.negate_iife || self.ctx.in_bang_arg || self.ctx.dont_use_negated_iife {
            return;
        }

        let expr = match e {
            Expr::Call(e) => e,
            _ => return,
        };

        let callee = match &mut expr.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(e) => &mut **e,
        };

        match callee {
            Expr::Fn(..) => {
                log::trace!("negate_iife: Negating iife");
                *e = Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: Box::new(e.take()),
                });
                return;
            }
            _ => {}
        }
    }

    /// Returns true if it did any work.
    ///
    ///
    /// - `iife ? foo : bar` => `!iife ? bar : foo`
    pub(super) fn negate_iife_in_cond(&mut self, e: &mut Expr) -> bool {
        let cond = match e {
            Expr::Cond(v) => v,
            _ => return false,
        };

        let test_call = match &mut *cond.test {
            Expr::Call(e) => e,
            _ => return false,
        };

        let callee = match &mut test_call.callee {
            ExprOrSuper::Super(_) => return false,
            ExprOrSuper::Expr(e) => &mut **e,
        };

        match callee {
            Expr::Fn(..) => {
                log::trace!("negate_iife: Swapping cons and alt");
                cond.test = Box::new(Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: cond.test.take(),
                }));
                swap(&mut cond.cons, &mut cond.alt);
                return true;
            }
            _ => false,
        }
    }

    pub(super) fn restore_negated_iife(&mut self, cond: &mut CondExpr) {
        if !self.ctx.dont_use_negated_iife {
            return;
        }

        match &mut *cond.test {
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => match &mut **arg {
                Expr::Call(CallExpr {
                    span: call_span,
                    callee: ExprOrSuper::Expr(callee),
                    args,
                    ..
                }) => match &**callee {
                    Expr::Fn(..) => {
                        cond.test = Box::new(Expr::Call(CallExpr {
                            span: *call_span,
                            callee: callee.take().as_callee(),
                            args: args.take(),
                            type_args: Default::default(),
                        }));
                        swap(&mut cond.cons, &mut cond.alt);
                    }
                    _ => {}
                },
                _ => {}
            },
            _ => {}
        };
    }
}

/// Methods related to iife.
impl Optimizer<'_> {
    /// # Exmaple
    ///
    /// ## Input
    ///
    /// ```ts
    /// (function(x) {
    ///     (function(y) {
    ///         console.log(7);
    ///     })(7);
    /// })(7);
    /// ```
    ///
    ///
    /// ## Output
    ///
    /// ```ts
    /// (function(x) {
    ///     (function(y) {
    ///         console.log(y);
    ///     })(x);
    /// })(7);
    /// ```
    pub(super) fn inline_args_of_iife(&mut self, e: &mut CallExpr) {
        if self.options.inline == 0 {
            return;
        }

        let has_spread_arg = e.args.iter().any(|v| v.spread.is_some());
        if has_spread_arg {
            return;
        }

        let callee = match &mut e.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(e) => &mut **e,
        };

        fn find_params(callee: &Expr) -> Option<Vec<&Pat>> {
            match callee {
                Expr::Arrow(callee) => Some(callee.params.iter().collect()),
                Expr::Fn(callee) => Some(
                    callee
                        .function
                        .params
                        .iter()
                        .map(|param| &param.pat)
                        .collect(),
                ),
                _ => return None,
            }
        }

        fn find_body(callee: &mut Expr) -> Option<Either<&mut BlockStmt, &mut Expr>> {
            match callee {
                Expr::Arrow(e) => match &mut e.body {
                    BlockStmtOrExpr::BlockStmt(b) => Some(Either::Left(b)),
                    BlockStmtOrExpr::Expr(b) => Some(Either::Right(&mut **b)),
                },
                Expr::Fn(e) => Some(Either::Left(e.function.body.as_mut().unwrap())),
                _ => None,
            }
        }

        let params = find_params(&callee);
        if let Some(params) = params {
            let mut vars = HashMap::default();
            // We check for parameter and argument
            for (idx, param) in params.iter().enumerate() {
                let arg = e.args.get(idx).map(|v| &v.expr);
                if let Pat::Ident(param) = &param {
                    if let Some(usage) = self
                        .data
                        .as_ref()
                        .and_then(|data| data.vars.get(&param.to_id()))
                    {
                        if usage.reassigned {
                            continue;
                        }
                    }

                    if let Some(arg) = arg {
                        let should_be_inlined = self.can_be_inlined_for_iife(arg);
                        if should_be_inlined {
                            log::trace!(
                                "iife: Trying to inline {}{:?}",
                                param.id.sym,
                                param.id.span.ctxt
                            );
                            vars.insert(param.to_id(), arg.clone());
                        }
                    } else {
                        log::trace!(
                            "iife: Trying to inline {}{:?} (undefined)",
                            param.id.sym,
                            param.id.span.ctxt
                        );

                        vars.insert(param.to_id(), undefined(param.span()));
                    }
                }
            }

            match find_body(callee) {
                Some(Either::Left(body)) => {
                    log::debug!("inline: Inlining arguments");
                    self.inline_vars_in_node(body, vars);
                }
                Some(Either::Right(body)) => {
                    log::debug!("inline: Inlining arguments");
                    self.inline_vars_in_node(body, vars);
                }
                _ => {}
            }
        }
    }

    fn inline_vars_in_node<N>(&mut self, n: &mut N, vars: FxHashMap<Id, Box<Expr>>)
    where
        N: VisitMutWith<Self>,
    {
        let ctx = Ctx {
            inline_prevented: false,
            ..self.ctx
        };
        let orig_vars = replace(&mut self.vars_for_inlining, vars);
        n.visit_mut_with(&mut *self.with_ctx(ctx));
        self.vars_for_inlining = orig_vars;
    }

    /// Fully inlines iife.
    ///
    /// # Example
    ///
    /// ## Input
    ///
    /// ```ts
    /// (function () {
    ///     return {};
    /// })().x = 10;
    /// ```
    ///
    /// ## Oupuy
    ///
    /// ```ts
    /// ({
    /// }).x = 10;
    /// ```
    pub(super) fn invoke_iife(&mut self, e: &mut Expr) {
        if self.options.inline == 0 {
            let skip = match e {
                Expr::Call(v) => !v.callee.span().is_dummy(),
                _ => true,
            };

            if skip {
                return;
            }
        }

        if self.ctx.inline_prevented {
            return;
        }

        let call = match e {
            Expr::Call(v) => v,
            _ => return,
        };

        if self.has_noinline(call.span) {
            return;
        }

        let callee = match &mut call.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(e) => &mut **e,
        };

        if call.args.iter().any(|arg| match &*arg.expr {
            Expr::Member(MemberExpr {
                computed: false, ..
            }) => false,
            _ => arg.expr.may_have_side_effects(),
        }) {
            return;
        }

        match callee {
            Expr::Arrow(f) => {
                if f.params.iter().any(|param| !param.is_ident()) {
                    return;
                }

                if is_param_used_by_body(&f.params, &f.body) {
                    return;
                }

                match &mut f.body {
                    BlockStmtOrExpr::BlockStmt(body) => {
                        let new = self.inline_fn_like(body);
                        if let Some(new) = new {
                            self.changed = true;
                            log::trace!("inline: Inlining a function call (arrow)");

                            *e = new;
                        }
                        return;
                    }
                    BlockStmtOrExpr::Expr(body) => match &**body {
                        Expr::Lit(Lit::Num(..)) => {
                            if self.ctx.in_obj_of_non_computed_member {
                                return;
                            }
                        }
                        _ => {}
                    },
                }
                let mut inline_map = HashMap::default();
                for (idx, param) in f.params.iter().enumerate() {
                    let arg_val = if let Some(arg) = call.args.get(idx) {
                        arg.expr.clone()
                    } else {
                        undefined(DUMMY_SP)
                    };

                    match param {
                        Pat::Ident(param) => {
                            inline_map.insert(param.id.to_id(), arg_val);
                        }
                        _ => {}
                    }
                }

                self.inline_vars_in_node(&mut f.body, inline_map);

                match &mut f.body {
                    BlockStmtOrExpr::BlockStmt(_) => {
                        // TODO
                    }
                    BlockStmtOrExpr::Expr(body) => {
                        self.changed = true;
                        log::trace!("inline: Inlining a call to an arrow function");
                        *e = Expr::Seq(SeqExpr {
                            span: DUMMY_SP,
                            exprs: vec![Box::new(make_number(DUMMY_SP, 0.0)), body.take()],
                        });
                        return;
                    }
                }
            }
            Expr::Fn(f) => {
                if f.function.is_generator {
                    return;
                }

                // Abort if a parameter is complex
                if f.function.params.iter().any(|param| match param.pat {
                    Pat::Object(..) | Pat::Array(..) | Pat::Assign(..) | Pat::Rest(..) => true,
                    _ => false,
                }) {
                    return;
                }

                if let Some(i) = &f.ident {
                    if idents_used_by(&f.function.body).contains(&i.to_id()) {
                        return;
                    }
                }

                if is_param_used_by_body(&f.function.params, &f.function.body) {
                    return;
                }

                let body = f.function.body.as_mut().unwrap();
                if body.stmts.is_empty() {
                    *e = *undefined(f.function.span);
                    return;
                }

                let new = self.inline_fn_like(body);
                if let Some(new) = new {
                    self.changed = true;
                    log::trace!("inline: Inlining a function call");

                    *e = new;
                }

                //
            }
            _ => {}
        }
    }

    fn inline_fn_like(&mut self, body: &mut BlockStmt) -> Option<Expr> {
        if !body.stmts.iter().all(|stmt| match stmt {
            Stmt::Expr(e) if e.expr.is_await_expr() => false,

            Stmt::Expr(..) => true,
            Stmt::Return(ReturnStmt { arg, .. }) => match arg.as_deref() {
                Some(Expr::Await(..)) => false,

                Some(Expr::Lit(Lit::Num(..))) => {
                    if self.ctx.in_obj_of_non_computed_member {
                        false
                    } else {
                        true
                    }
                }
                _ => true,
            },
            _ => false,
        }) {
            return None;
        }

        let mut exprs = vec![];
        for stmt in body.stmts.take() {
            match stmt {
                Stmt::Expr(stmt) => {
                    exprs.push(stmt.expr);
                }

                Stmt::Return(stmt) => {
                    let span = stmt.span;
                    let val = *stmt.arg.unwrap_or_else(|| undefined(span));
                    exprs.push(Box::new(val));

                    return Some(Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    }));
                }
                _ => {}
            }
        }

        if let Some(last) = exprs.last_mut() {
            *last = Box::new(Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("void"),
                arg: last.take(),
            }));
        } else {
            return Some(*undefined(body.span));
        }

        Some(Expr::Seq(SeqExpr {
            span: DUMMY_SP,
            exprs,
        }))
    }

    fn can_be_inlined_for_iife(&self, arg: &Expr) -> bool {
        match arg {
            Expr::Lit(..) => true,

            Expr::Unary(UnaryExpr {
                op: op!("void"),
                arg,
                ..
            })
            | Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => self.can_be_inlined_for_iife(&arg),

            Expr::Ident(..) => true,

            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(obj),
                computed: false,
                ..
            }) => self.can_be_inlined_for_iife(&obj),

            Expr::Bin(BinExpr {
                op, left, right, ..
            }) => match op {
                op!(bin, "+") | op!("*") => {
                    self.can_be_inlined_for_iife(&left) && self.can_be_inlined_for_iife(&right)
                }
                _ => false,
            },

            Expr::Object(ObjectLit { props, .. }) => {
                for prop in props {
                    match prop {
                        PropOrSpread::Spread(_) => return false,
                        PropOrSpread::Prop(p) => match &**p {
                            Prop::Shorthand(_) => {}
                            Prop::KeyValue(kv) => {
                                if let PropName::Computed(key) = &kv.key {
                                    if !self.can_be_inlined_for_iife(&key.expr) {
                                        return false;
                                    }
                                }

                                if !self.can_be_inlined_for_iife(&kv.value) {
                                    return false;
                                }
                            }
                            Prop::Assign(p) => {
                                if !self.can_be_inlined_for_iife(&p.value) {
                                    return false;
                                }
                            }
                            _ => return false,
                        },
                    }
                }

                true
            }

            Expr::Arrow(ArrowExpr {
                params,
                body: BlockStmtOrExpr::Expr(body),
                is_async: false,
                is_generator: false,
                ..
            }) => params.iter().all(|p| p.is_ident()) && self.can_be_inlined_for_iife(&body),

            _ => false,
        }
    }
}

// We can't remove a function call if a parameter is declared by function and
// the body of the function uses it.
fn is_param_used_by_body<P, B>(params: &P, body: &B) -> bool
where
    P: for<'any> VisitWith<DestructuringFinder<'any, Id>>,
    B: VisitWith<IdentUsageCollector>,
{
    let declared: Vec<Id> = find_ids(params);

    let used = idents_used_by(body);

    for id in declared {
        if used.contains(&id) {
            return true;
        }
    }

    for (sym, _) in used {
        if sym == js_word!("arguments") {
            return true;
        }
    }

    false
}
