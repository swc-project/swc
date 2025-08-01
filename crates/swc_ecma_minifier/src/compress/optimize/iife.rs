use std::{collections::HashMap, mem::swap};

use rustc_hash::FxHashMap;
use swc_common::{pass::Either, util::take::Take, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_arguments, contains_this_expr, find_pat_ids, ExprFactory};
use swc_ecma_visit::{noop_visit_type, Visit, VisitMutWith, VisitWith};

use super::{util::NormalMultiReplacer, BitCtx, Optimizer};
#[cfg(feature = "debug")]
use crate::debug::dump;
use crate::{
    program_data::{ProgramData, ScopeData, VarUsageInfoFlags},
    util::{idents_captured_by, make_number},
};

/// Methods related to the option `negate_iife`.
impl Optimizer<'_> {
    /// Negates iife, while ignore return value.
    pub(super) fn negate_iife_ignoring_ret(&mut self, e: &mut Expr) {
        if !self.options.negate_iife
            || self
                .ctx
                .bit_ctx
                .intersects(BitCtx::InBangArg | BitCtx::DontUseNegatedIife)
        {
            return;
        }

        let expr = match e {
            Expr::Call(e) => e,
            _ => return,
        };

        let callee = match &mut expr.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(e) => &mut **e,
        };

        if let Expr::Fn(..) = callee {
            report_change!("negate_iife: Negating iife");
            *e = UnaryExpr {
                span: DUMMY_SP,
                op: op!("!"),
                arg: Box::new(e.take()),
            }
            .into();
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
            Callee::Super(_) | Callee::Import(_) => return false,
            Callee::Expr(e) => &mut **e,
        };

        match callee {
            Expr::Fn(..) => {
                report_change!("negate_iife: Swapping cons and alt");
                cond.test = UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: cond.test.take(),
                }
                .into();
                swap(&mut cond.cons, &mut cond.alt);
                true
            }
            _ => false,
        }
    }

    pub(super) fn restore_negated_iife(&mut self, cond: &mut CondExpr) {
        if !self.ctx.bit_ctx.contains(BitCtx::DontUseNegatedIife) {
            return;
        }

        if let Expr::Unary(UnaryExpr {
            op: op!("!"), arg, ..
        }) = &mut *cond.test
        {
            if let Expr::Call(CallExpr {
                span: call_span,
                callee: Callee::Expr(callee),
                args,
                ..
            }) = &mut **arg
            {
                if let Expr::Fn(..) = &**callee {
                    cond.test = CallExpr {
                        span: *call_span,
                        callee: callee.take().as_callee(),
                        args: args.take(),
                        ..Default::default()
                    }
                    .into();
                    swap(&mut cond.cons, &mut cond.alt);
                }
            }
        };
    }
}

/// Methods related to iife.
impl Optimizer<'_> {
    /// # Example
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
    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip(self, e)))]
    pub(super) fn inline_args_of_iife(&mut self, e: &mut CallExpr) {
        if self.options.inline == 0 && !self.options.reduce_vars && !self.options.reduce_fns {
            return;
        }

        let has_spread_arg = e.args.iter().any(|v| v.spread.is_some());
        if has_spread_arg {
            return;
        }

        let callee = match &mut e.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(e) => &mut **e,
        };

        if let Some(scope) = find_scope(self.data, callee) {
            if scope.contains(ScopeData::USED_ARGUMENTS) {
                log_abort!("iife: [x] Found usage of arguments");
                return;
            }
        }

        fn clean_params(callee: &mut Expr) {
            match callee {
                Expr::Arrow(callee) => {
                    // Drop invalid nodes
                    callee.params.retain(|p| !p.is_invalid())
                }
                Expr::Fn(callee) => {
                    // Drop invalid nodes
                    callee.function.params.retain(|p| !p.pat.is_invalid())
                }
                _ => {}
            }
        }

        if let Expr::Fn(FnExpr {
            ident: Some(ident), ..
        }) = callee
        {
            if self
                .data
                .vars
                .get(&ident.to_id())
                .filter(|usage| usage.flags.contains(VarUsageInfoFlags::USED_RECURSIVELY))
                .is_some()
            {
                log_abort!("iife: [x] Recursive?");
                return;
            }
        }

        let params = find_params(callee);
        if let Some(mut params) = params {
            let mut vars = HashMap::default();
            // We check for parameter and argument
            for (idx, param) in params.iter_mut().enumerate() {
                match &mut **param {
                    Pat::Ident(param) => {
                        if param.sym == "arguments" {
                            continue;
                        }
                        if let Some(usage) = self.data.vars.get(&param.to_id()) {
                            if usage.flags.contains(VarUsageInfoFlags::REASSIGNED) {
                                continue;
                            }
                        }

                        let arg = e.args.get(idx).map(|v| &v.expr);

                        if let Some(arg) = arg {
                            match &**arg {
                                Expr::Lit(Lit::Regex(..)) => continue,
                                Expr::Lit(Lit::Str(s)) if s.value.len() > 3 => continue,
                                Expr::Lit(..) => {}
                                _ => continue,
                            }

                            let should_be_inlined = self.can_be_inlined_for_iife(arg);
                            if should_be_inlined {
                                trace_op!(
                                    "iife: Trying to inline argument ({}{:?})",
                                    param.id.sym,
                                    param.id.ctxt
                                );
                                vars.insert(param.to_id(), arg.clone());
                            } else {
                                trace_op!(
                                    "iife: Trying to inline argument ({}{:?}) (not inlinable)",
                                    param.id.sym,
                                    param.id.ctxt
                                );
                            }
                        } else {
                            trace_op!(
                                "iife: Trying to inline argument ({}{:?}) (undefined)",
                                param.id.sym,
                                param.id.ctxt
                            );

                            vars.insert(param.to_id(), Expr::undefined(param.span()));
                        }
                    }

                    Pat::Rest(rest_pat) => {
                        if let Pat::Ident(param_id) = &*rest_pat.arg {
                            if let Some(usage) = self.data.vars.get(&param_id.to_id()) {
                                if usage.flags.contains(VarUsageInfoFlags::REASSIGNED)
                                    || usage.ref_count != 1
                                    || !usage.flags.contains(VarUsageInfoFlags::HAS_PROPERTY_ACCESS)
                                {
                                    continue;
                                }

                                if e.args.iter().skip(idx).any(|arg| {
                                    if arg.spread.is_some() {
                                        return true;
                                    }

                                    match &*arg.expr {
                                        Expr::Lit(Lit::Str(s)) if s.value.len() > 3 => true,
                                        Expr::Lit(..) => false,
                                        _ => true,
                                    }
                                }) {
                                    continue;
                                }

                                vars.insert(
                                    param_id.to_id(),
                                    ArrayLit {
                                        span: param_id.span,
                                        elems: e
                                            .args
                                            .iter()
                                            .skip(idx)
                                            .map(|arg| Some(arg.clone()))
                                            .collect(),
                                    }
                                    .into(),
                                );
                                param.take();
                            }
                        }
                    }
                    _ => (),
                }
            }

            if vars.is_empty() {
                log_abort!("vars is empty");
                return;
            }

            let ctx = self
                .ctx
                .clone()
                .with(BitCtx::InFnLike, true)
                .with(BitCtx::TopLevel, false);
            let mut optimizer = self.with_ctx(ctx);
            match find_body(callee) {
                Some(Either::Left(body)) => {
                    trace_op!("inline: Inlining arguments");
                    optimizer.inline_vars_in_node(body, vars);
                }
                Some(Either::Right(body)) => {
                    trace_op!("inline: Inlining arguments");
                    optimizer.inline_vars_in_node(body, vars);
                }
                _ => {
                    unreachable!("find_body and find_params should match")
                }
            }

            clean_params(callee);
        }
    }

    /// If a parameter is not used, we can ignore return value of the
    /// corresponding argument.
    pub(super) fn ignore_unused_args_of_iife(&mut self, e: &mut CallExpr) {
        if !self.options.unused && !self.options.reduce_vars {
            return;
        }

        let callee = match &mut e.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(e) => &mut **e,
        };

        match find_body(callee) {
            Some(body) => match body {
                Either::Left(body) => {
                    if contains_arguments(body) {
                        return;
                    }
                }
                Either::Right(body) => {
                    if contains_arguments(body) {
                        return;
                    }
                }
            },
            None => return,
        }

        if let Expr::Fn(FnExpr {
            ident: Some(ident), ..
        }) = callee
        {
            if self
                .data
                .vars
                .get(&ident.to_id())
                .filter(|usage| usage.flags.contains(VarUsageInfoFlags::USED_RECURSIVELY))
                .is_some()
            {
                return;
            }
        }

        let mut removed = Vec::new();
        let params = find_params(callee);
        if let Some(mut params) = params {
            // We check for parameter and argument
            for (idx, param) in params.iter_mut().enumerate() {
                if let Pat::Ident(param) = &mut **param {
                    if let Some(usage) = self.data.vars.get(&param.to_id()) {
                        if usage.ref_count == 0 {
                            removed.push(idx);
                        }
                    }
                }
            }

            if removed.is_empty() {
                log_abort!("`removed` is empty");
                return;
            }
        } else {
            unreachable!("find_body and find_params should match")
        }

        for idx in removed {
            if let Some(arg) = e.args.get_mut(idx) {
                if arg.spread.is_some() {
                    break;
                }

                // Optimize
                let new = self.ignore_return_value(&mut arg.expr);

                if let Some(new) = new {
                    arg.expr = Box::new(new);
                } else {
                    // Use `0` if it's removed.
                    arg.expr = Number {
                        span: arg.expr.span(),
                        value: 0.0,
                        raw: None,
                    }
                    .into();
                }
            } else {
                break;
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn inline_vars_in_node<N>(&mut self, n: &mut N, mut vars: FxHashMap<Id, Box<Expr>>)
    where
        N: for<'aa> VisitMutWith<NormalMultiReplacer<'aa>>,
    {
        trace_op!("inline: inline_vars_in_node");

        let mut v = NormalMultiReplacer::new(&mut vars);
        n.visit_mut_with(&mut v);
        self.changed |= v.changed;
    }

    fn may_invoke_iife(&self, call: &mut CallExpr) -> bool {
        if self.options.inline == 0
            && !(self.options.reduce_vars && self.options.reduce_fns && self.options.evaluate)
        {
            if !call.callee.span().is_dummy() {
                log_abort!("skip");
                return false;
            }
        }

        trace_op!("iife: Checking noinline");

        if self.has_noinline(call.ctxt) {
            log_abort!("iife: Has no inline mark");
            return false;
        }

        let callee = match &call.callee {
            Callee::Super(_) | Callee::Import(_) => return false,
            Callee::Expr(e) => &**e,
        };

        if self.ctx.bit_ctx.contains(BitCtx::DontInvokeIife) {
            log_abort!("iife: Inline is prevented");
            return false;
        }

        for arg in &call.args {
            if arg.spread.is_some() {
                log_abort!("iife: Found spread argument");
                return false;
            }
        }

        trace_op!("iife: Checking callee");

        match callee {
            Expr::Arrow(f) => {
                if f.is_async {
                    log_abort!("iife: Cannot inline async fn");
                    return false;
                }

                if f.is_generator {
                    log_abort!("iife: Cannot inline generator");
                    return false;
                }

                if self.ctx.bit_ctx.contains(BitCtx::InParam) && !f.params.is_empty() {
                    log_abort!("iife: We don't invoke IIFE with params in function params");
                    return false;
                }

                if f.params.iter().any(|param| !param.is_ident()) {
                    return false;
                }
            }

            Expr::Fn(f) => {
                if f.function.is_async {
                    log_abort!("iife: [x] Cannot inline async fn");
                    return false;
                }

                if f.function.is_generator {
                    log_abort!("iife: [x] Cannot inline generator");
                    return false;
                }

                if self.ctx.bit_ctx.contains(BitCtx::InParam) && !f.function.params.is_empty() {
                    log_abort!("iife: We don't invoke IIFE with params in function params");
                    return false;
                }

                // Abort if a parameter is complex
                if f.function.params.iter().any(|param| !param.pat.is_ident()) {
                    return false;
                }

                trace_op!("iife: Checking recursiveness");

                if let Some(i) = &f.ident {
                    if self
                        .data
                        .vars
                        .get(&i.to_id())
                        .filter(|usage| usage.flags.contains(VarUsageInfoFlags::USED_RECURSIVELY))
                        .is_some()
                    {
                        log_abort!("iife: [x] Recursive?");
                        return false;
                    }
                }

                let body = f.function.body.as_ref().unwrap();
                if contains_this_expr(body) || contains_arguments(body) {
                    return false;
                }
            }

            _ => return false,
        };

        true
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
    /// ## Output
    ///
    /// ```ts
    /// ({
    /// }).x = 10;
    /// ```
    pub(super) fn invoke_iife(&mut self, e: &mut Expr) {
        trace_op!("iife: invoke_iife");

        let call = match e {
            Expr::Call(v) => v,
            _ => return,
        };

        if !self.may_invoke_iife(call) {
            return;
        }

        let callee = match &mut call.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(e) => &mut **e,
        };

        match callee {
            Expr::Arrow(f) => {
                let param_ids = f.params.iter().map(|p| &p.as_ident().unwrap().id);

                match &mut *f.body {
                    BlockStmtOrExpr::BlockStmt(body) => {
                        let new =
                            self.inline_fn_like(param_ids, f.params.len(), body, &mut call.args);
                        if let Some(new) = new {
                            self.changed = true;
                            report_change!("inline: Inlining a function call (arrow)");

                            *e = new;
                        }
                    }
                    BlockStmtOrExpr::Expr(body) => {
                        if !self.can_extract_param(param_ids.clone()) {
                            return;
                        }

                        if let Expr::Lit(Lit::Num(..)) = &**body {
                            if self.ctx.bit_ctx.contains(BitCtx::InObjOfNonComputedMember) {
                                return;
                            }
                        }

                        self.changed = true;
                        report_change!("inline: Inlining a function call (arrow)");

                        let mut exprs = vec![Box::new(make_number(DUMMY_SP, 0.0))];

                        let vars = self.inline_fn_param(
                            param_ids,
                            f.params.len(),
                            &mut call.args,
                            &mut exprs,
                        );

                        if !vars.is_empty() {
                            self.prepend_stmts.push(
                                VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Let,
                                    declare: Default::default(),
                                    decls: vars,
                                    ..Default::default()
                                }
                                .into(),
                            )
                        }

                        if call.args.len() > f.params.len() {
                            for arg in &mut call.args[f.params.len()..] {
                                exprs.push(arg.expr.take());
                            }
                        }
                        if self.vars.inline_with_multi_replacer(body) {
                            self.changed = true;
                        }
                        exprs.push(body.take());

                        report_change!("inline: Inlining a call to an arrow function");
                        *e = *Expr::from_exprs(exprs);
                        e.visit_mut_with(self);
                    }
                }
            }
            Expr::Fn(f) => {
                trace_op!("iife: Empty function");

                let body = f.function.body.as_mut().unwrap();
                if body.stmts.is_empty() && call.args.is_empty() {
                    self.changed = true;
                    report_change!("iife: Inlining an empty function call as `undefined`");
                    *e = *Expr::undefined(f.function.span);
                    return;
                }

                let param_ids = f
                    .function
                    .params
                    .iter()
                    .map(|p| &p.pat.as_ident().unwrap().id);

                let new =
                    self.inline_fn_like(param_ids, f.function.params.len(), body, &mut call.args);
                if let Some(new) = new {
                    self.changed = true;
                    report_change!("inline: Inlining a function call (params = {param_ids:?})");

                    dump_change_detail!("{}", dump(&new, false));

                    *e = new;
                }

                //
            }
            _ => {}
        }
    }

    pub(super) fn invoke_iife_stmt(&mut self, e: &mut Expr, is_return: bool) -> Option<BlockStmt> {
        trace_op!("iife: invoke_iife");

        let call = match e {
            Expr::Call(v) => v,
            Expr::Unary(UnaryExpr { arg, .. }) if !is_return => {
                if let Expr::Call(v) = &mut **arg {
                    v
                } else {
                    return None;
                }
            }
            _ => return None,
        };

        if !self.may_invoke_iife(call) {
            return None;
        }

        let callee = match &mut call.callee {
            Callee::Super(_) | Callee::Import(_) => return None,
            Callee::Expr(e) => &mut **e,
        };

        match callee {
            Expr::Arrow(f) => {
                match &mut *f.body {
                    // it's very likely to be processed in invoke_iife
                    BlockStmtOrExpr::Expr(_) => None,
                    BlockStmtOrExpr::BlockStmt(block_stmt) => {
                        let param_ids = f.params.iter().map(|p| &p.as_ident().unwrap().id);
                        self.inline_fn_like_stmt(
                            param_ids,
                            f.params.len(),
                            block_stmt,
                            &mut call.args,
                            is_return,
                            call.span,
                        )
                    }
                }
            }
            Expr::Fn(f) => {
                let body = f.function.body.as_mut().unwrap();
                let param_ids = f
                    .function
                    .params
                    .iter()
                    .map(|p| &p.pat.as_ident().unwrap().id);
                self.inline_fn_like_stmt(
                    param_ids,
                    f.function.params.len(),
                    body,
                    &mut call.args,
                    is_return,
                    call.span,
                )
            }
            _ => None,
        }
    }

    fn is_return_arg_simple_enough_for_iife_eval(&self, e: &Expr) -> bool {
        match e {
            Expr::Lit(..) | Expr::Ident(..) => true,

            Expr::Bin(BinExpr { op, .. }) if op.may_short_circuit() => false,

            Expr::Bin(e) => {
                self.is_return_arg_simple_enough_for_iife_eval(&e.left)
                    && self.is_return_arg_simple_enough_for_iife_eval(&e.right)
            }

            Expr::Cond(e) => {
                self.is_return_arg_simple_enough_for_iife_eval(&e.test)
                    && self.is_return_arg_simple_enough_for_iife_eval(&e.cons)
                    && self.is_return_arg_simple_enough_for_iife_eval(&e.alt)
            }

            _ => false,
        }
    }

    fn can_extract_param<'a>(&self, param_ids: impl Iterator<Item = &'a Ident> + Clone) -> bool {
        // Don't create top-level variables.
        if !self.may_add_ident() {
            for pid in param_ids.clone() {
                if let Some(usage) = self.data.vars.get(&pid.to_id()) {
                    if usage.ref_count > 1
                        || usage.assign_count > 0
                        || usage.flags.contains(VarUsageInfoFlags::INLINE_PREVENTED)
                    {
                        log_abort!("iife: [x] Cannot inline because of usage of `{}`", pid);
                        return false;
                    }
                }
            }
        }

        for pid in param_ids {
            if self.ident_reserved(&pid.sym) {
                log_abort!(
                    "iife: [x] Cannot inline because of reservation of `{}`",
                    pid
                );
                return false;
            }
        }

        true
    }

    fn can_inline_fn_stmt(&self, stmt: &Stmt, for_stmt: bool) -> bool {
        match stmt {
            Stmt::Decl(Decl::Var(var)) => {
                for decl in &var.decls {
                    for id in find_pat_ids::<_, Id>(&decl.name) {
                        if self.ident_reserved(&id.0) {
                            log_abort!("iife: [x] Cannot inline because reservation of `{}`", id.0);
                            return false;
                        }
                    }
                }

                if matches!(
                    &**var,
                    VarDecl {
                        kind: VarDeclKind::Var | VarDeclKind::Let,
                        ..
                    }
                ) {
                    for decl in &var.decls {
                        match &decl.name {
                            Pat::Ident(id) if id.sym == "arguments" => return false,
                            Pat::Ident(id) => {
                                if self.vars.has_pending_inline_for(&id.to_id()) {
                                    log_abort!(
                                        "iife: [x] Cannot inline because pending inline of `{}`",
                                        id.id
                                    );
                                    return false;
                                }
                            }

                            _ => return false,
                        }
                    }

                    if self.ctx.bit_ctx.contains(BitCtx::ExecutedMultipleTime) {
                        return false;
                    }

                    true
                } else {
                    for_stmt
                }
            }

            Stmt::Expr(_) => true,

            Stmt::Return(ReturnStmt { arg, .. }) => match arg.as_deref() {
                Some(Expr::Lit(Lit::Num(..))) => {
                    for_stmt || !self.ctx.bit_ctx.contains(BitCtx::InObjOfNonComputedMember)
                }
                _ => true,
            },
            Stmt::Block(b) => b
                .stmts
                .iter()
                .all(|stmt| self.can_inline_fn_stmt(stmt, for_stmt)),
            Stmt::If(i) if for_stmt => {
                self.can_inline_fn_stmt(&i.cons, for_stmt)
                    && i.alt
                        .as_ref()
                        .map(|a| self.can_inline_fn_stmt(a, for_stmt))
                        .unwrap_or(true)
            }
            Stmt::Switch(s) if for_stmt => s
                .cases
                .iter()
                .flat_map(|case| case.cons.iter())
                .all(|stmt| self.can_inline_fn_stmt(stmt, for_stmt)),
            _ => for_stmt,
        }
    }

    fn can_inline_fn_like<'a>(
        &self,
        param_ids: impl Iterator<Item = &'a Ident> + Clone,
        params_len: usize,
        body: &BlockStmt,
        for_stmt: bool,
    ) -> bool {
        trace_op!("can_inline_fn_like");

        if body.stmts.len() == 1 {
            if let Stmt::Return(ReturnStmt { arg: Some(arg), .. }) = &body.stmts[0] {
                if self.is_return_arg_simple_enough_for_iife_eval(arg) {
                    return true;
                }
            }
        }

        if !self.can_extract_param(param_ids.clone()) {
            return false;
        }

        // Abort on eval.
        // See https://github.com/swc-project/swc/pull/6478
        //
        // We completely abort on eval, because we cannot know whether a variable in
        // upper scope will be afftected by eval.
        // https://github.com/swc-project/swc/issues/6628
        if self.data.top.contains(ScopeData::HAS_EVAL_CALL) {
            log_abort!("iife: [x] Aborting because of eval");
            return false;
        }

        if !self.may_add_ident() || self.at_class_field() {
            let has_decl = if for_stmt {
                // we check it later
                false
            } else {
                body.stmts.iter().any(|stmt| matches!(stmt, Stmt::Decl(..)))
            };
            if has_decl {
                log_abort!("iife: [x] Found decl");
                return false;
            }
        }

        if self.ctx.bit_ctx.contains(BitCtx::ExecutedMultipleTime) {
            if params_len != 0 {
                let captured = idents_captured_by(body);

                for param in param_ids {
                    if captured.contains(&param.to_id()) {
                        log_abort!(
                            "iife: [x] Cannot inline because of the capture of `{}`",
                            param
                        );
                        return false;
                    }
                }
            }
        }

        if let Some(stmt) = body.stmts.first() {
            if stmt.is_use_strict() {
                return false;
            }
        }

        if !body
            .stmts
            .iter()
            .all(|stmt| self.can_inline_fn_stmt(stmt, for_stmt))
        {
            return false;
        }

        true
    }

    fn inline_fn_param<'a>(
        &mut self,
        params: impl Iterator<Item = &'a Ident>,
        params_len: usize,
        args: &mut [ExprOrSpread],
        exprs: &mut Vec<Box<Expr>>,
    ) -> Vec<VarDeclarator> {
        let mut vars = Vec::with_capacity(params_len);

        for (idx, param) in params.enumerate() {
            let arg = args.get_mut(idx).map(|arg| arg.expr.take());

            let no_arg = arg.is_none();

            if let Some(arg) = arg {
                if let Some(usage) = self.data.vars.get_mut(&param.to_id()) {
                    if usage.ref_count == 1
                        && !usage.flags.contains(VarUsageInfoFlags::REASSIGNED)
                        && usage.property_mutation_count == 0
                        && matches!(
                            &*arg,
                            Expr::Lit(
                                Lit::Num(..) | Lit::Str(..) | Lit::Bool(..) | Lit::BigInt(..)
                            )
                        )
                    {
                        // We don't need to create a variable in this case
                        self.vars.vars_for_inlining.insert(param.to_id(), arg);
                        continue;
                    }

                    usage.ref_count += 1;
                }

                exprs.push(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: (*param).clone().into(),
                        right: arg,
                    }
                    .into(),
                )
            };

            vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: (*param).clone().into(),
                init: if self.ctx.bit_ctx.contains(BitCtx::ExecutedMultipleTime) && no_arg {
                    Some(Expr::undefined(DUMMY_SP))
                } else {
                    None
                },
                definite: Default::default(),
            });
        }

        vars
    }

    fn inline_fn_param_stmt<'a>(
        &mut self,
        params: impl Iterator<Item = &'a Ident>,
        params_len: usize,
        args: &mut [ExprOrSpread],
    ) -> Vec<VarDeclarator> {
        let mut vars = Vec::with_capacity(params_len);

        for (idx, param) in params.enumerate() {
            let mut arg = args.get_mut(idx).map(|arg| arg.expr.take());

            if let Some(arg) = &mut arg {
                if let Some(usage) = self.data.vars.get_mut(&param.to_id()) {
                    if usage.ref_count == 1
                        && !usage.flags.contains(VarUsageInfoFlags::REASSIGNED)
                        && usage.property_mutation_count == 0
                        && matches!(
                            &**arg,
                            Expr::Lit(
                                Lit::Num(..) | Lit::Str(..) | Lit::Bool(..) | Lit::BigInt(..)
                            )
                        )
                    {
                        // We don't need to create a variable in this case
                        self.vars
                            .vars_for_inlining
                            .insert(param.to_id(), arg.take());
                        continue;
                    }

                    usage.ref_count += 1;
                }
            };

            vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: param.clone().into(),
                init: if self.ctx.bit_ctx.contains(BitCtx::ExecutedMultipleTime) && arg.is_none() {
                    Some(Expr::undefined(DUMMY_SP))
                } else {
                    arg
                },
                definite: Default::default(),
            });
        }

        vars
    }

    fn inline_fn_like<'a>(
        &mut self,
        params: impl Iterator<Item = &'a Ident> + Clone,
        params_len: usize,
        body: &mut BlockStmt,
        args: &mut [ExprOrSpread],
    ) -> Option<Expr> {
        if !self.can_inline_fn_like(params.clone(), params_len, &*body, false) {
            return None;
        }

        if self.vars.inline_with_multi_replacer(body) {
            self.changed = true;
        }

        let mut exprs = Vec::new();
        let vars = self.inline_fn_param(params, params_len, args, &mut exprs);

        if args.len() > params_len {
            for arg in &mut args[params_len..] {
                exprs.push(arg.expr.take());
            }
        }

        if !vars.is_empty() {
            trace_op!("iife: Creating variables: {:?}", vars);

            self.prepend_stmts.push(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: Default::default(),
                    decls: vars,
                    ..Default::default()
                }
                .into(),
            );
        }

        for mut stmt in body.stmts.take() {
            match stmt {
                Stmt::Decl(Decl::Var(ref mut var)) => {
                    for decl in &mut var.decls {
                        if decl.init.is_some() {
                            let ids = find_pat_ids(decl);

                            for id in ids {
                                if let Some(usage) = self.data.vars.get_mut(&id) {
                                    // as we turn var declaration into assignment
                                    // we need to maintain correct var usage
                                    usage.ref_count += 1;
                                }
                            }

                            exprs.push(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    op: op!("="),
                                    left: decl.name.clone().try_into().unwrap(),
                                    right: decl.init.take().unwrap(),
                                }
                                .into(),
                            )
                        }
                    }

                    self.prepend_stmts.push(stmt);
                }

                Stmt::Expr(stmt) => {
                    exprs.push(stmt.expr);
                }

                Stmt::Return(stmt) => {
                    let span = stmt.span;
                    let val = *stmt.arg.unwrap_or_else(|| Expr::undefined(span));
                    exprs.push(Box::new(val));

                    let mut e = SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    };
                    self.merge_sequences_in_seq_expr(&mut e);

                    let mut e = e.into();
                    self.normalize_expr(&mut e);
                    return Some(e);
                }
                _ => {}
            }
        }

        if let Some(last) = exprs.last_mut() {
            *last = UnaryExpr {
                span: DUMMY_SP,
                op: op!("void"),
                arg: last.take(),
            }
            .into();
        } else {
            return Some(*Expr::undefined(body.span));
        }

        let mut e = SeqExpr {
            span: DUMMY_SP,
            exprs,
        };
        self.merge_sequences_in_seq_expr(&mut e);

        let mut e = e.into();
        self.normalize_expr(&mut e);
        Some(e)
    }

    fn inline_fn_like_stmt<'a>(
        &mut self,
        params: impl Iterator<Item = &'a Ident> + Clone,
        params_len: usize,
        body: &mut BlockStmt,
        args: &mut [ExprOrSpread],
        is_return: bool,
        span: Span,
    ) -> Option<BlockStmt> {
        if !self.can_inline_fn_like(params.clone(), params_len, body, true) {
            return None;
        }

        let mut decl = DeclVisitor { count: 0 };

        body.visit_with(&mut decl);

        if !self.may_add_ident() && decl.count > 0 {
            return None;
        }

        if decl.count
            + (params_len.saturating_sub(
                args.iter()
                    .filter(|a| {
                        a.expr.is_ident() || a.expr.as_lit().map(|l| !l.is_regex()).unwrap_or(false)
                    })
                    .count(),
            )) * 2
            > 4
        {
            return None;
        }

        let mut has_return = ReturnVisitor { found: false };

        if !is_return {
            body.visit_with(&mut has_return);

            if has_return.found {
                return None;
            }
        }

        self.changed = true;
        report_change!("inline: Inlining a function call (params = {params:?})");

        let mut stmts = Vec::with_capacity(body.stmts.len() + 2);

        let param_decl = self.inline_fn_param_stmt(params, params_len, args);

        if !param_decl.is_empty() {
            let param_decl = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                kind: VarDeclKind::Var,
                declare: false,
                decls: param_decl,
            })));

            stmts.push(param_decl);
        }

        if args.len() > params_len {
            let mut exprs = Vec::new();
            for arg in args[params_len..].iter_mut() {
                exprs.push(arg.expr.take())
            }

            let expr = Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                })),
            });

            stmts.push(expr);
        }

        stmts.extend(body.stmts.take());

        Some(BlockStmt {
            span,
            ctxt: SyntaxContext::empty().apply_mark(self.marks.fake_block),
            stmts,
        })
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
            }) => self.can_be_inlined_for_iife(arg),

            Expr::Ident(..) => true,

            Expr::Member(MemberExpr { obj, prop, .. }) if !prop.is_computed() => {
                self.can_be_inlined_for_iife(obj)
            }

            Expr::Bin(BinExpr {
                op, left, right, ..
            }) => match op {
                op!(bin, "+") | op!("*") => {
                    self.can_be_inlined_for_iife(left) && self.can_be_inlined_for_iife(right)
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
                body,
                is_async: false,
                is_generator: false,
                ..
            }) if body.is_expr() => {
                params.iter().all(|p| p.is_ident())
                    && self.can_be_inlined_for_iife(body.as_expr().unwrap())
            }

            _ => false,
        }
    }
}

fn find_scope<'a>(data: &'a ProgramData, callee: &Expr) -> Option<&'a ScopeData> {
    match callee {
        Expr::Arrow(callee) => data.scopes.get(&callee.ctxt),
        Expr::Fn(callee) => data.scopes.get(&callee.function.ctxt),
        _ => None,
    }
}

fn find_params(callee: &mut Expr) -> Option<Vec<&mut Pat>> {
    match callee {
        Expr::Arrow(callee) => Some(callee.params.iter_mut().collect()),
        Expr::Fn(callee) => Some(
            callee
                .function
                .params
                .iter_mut()
                .map(|param| &mut param.pat)
                .collect(),
        ),
        _ => None,
    }
}
fn find_body(callee: &mut Expr) -> Option<Either<&mut BlockStmt, &mut Expr>> {
    match callee {
        Expr::Arrow(e) => match &mut *e.body {
            BlockStmtOrExpr::BlockStmt(b) => Some(Either::Left(b)),
            BlockStmtOrExpr::Expr(b) => Some(Either::Right(&mut **b)),
        },
        Expr::Fn(e) => Some(Either::Left(e.function.body.as_mut().unwrap())),
        _ => None,
    }
}

pub struct ReturnVisitor {
    found: bool,
}

impl Visit for ReturnVisitor {
    noop_visit_type!(fail);

    /// Don't recurse into constructor
    fn visit_constructor(&mut self, _: &Constructor) {}

    /// Don't recurse into fn
    fn visit_fn_decl(&mut self, _: &FnDecl) {}

    /// Don't recurse into fn
    fn visit_fn_expr(&mut self, _: &FnExpr) {}

    /// Don't recurse into fn
    fn visit_function(&mut self, _: &Function) {}

    /// Don't recurse into fn
    fn visit_getter_prop(&mut self, n: &GetterProp) {
        n.key.visit_with(self);
    }

    /// Don't recurse into fn
    fn visit_method_prop(&mut self, n: &MethodProp) {
        n.key.visit_with(self);
        n.function.visit_with(self);
    }

    /// Don't recurse into fn
    fn visit_setter_prop(&mut self, n: &SetterProp) {
        n.key.visit_with(self);
        n.param.visit_with(self);
    }

    fn visit_expr(&mut self, _: &Expr) {}

    fn visit_return_stmt(&mut self, _: &ReturnStmt) {
        self.found = true;
    }
}

pub struct DeclVisitor {
    count: usize,
}

impl Visit for DeclVisitor {
    noop_visit_type!(fail);

    /// Don't recurse into constructor
    fn visit_constructor(&mut self, _: &Constructor) {}

    /// Don't recurse into fn
    fn visit_fn_decl(&mut self, _: &FnDecl) {}

    /// Don't recurse into fn
    fn visit_fn_expr(&mut self, _: &FnExpr) {}

    /// Don't recurse into fn
    fn visit_function(&mut self, _: &Function) {}

    /// Don't recurse into fn
    fn visit_getter_prop(&mut self, n: &GetterProp) {
        n.key.visit_with(self);
    }

    /// Don't recurse into fn
    fn visit_method_prop(&mut self, n: &MethodProp) {
        n.key.visit_with(self);
        n.function.visit_with(self);
    }

    /// Don't recurse into fn
    fn visit_setter_prop(&mut self, n: &SetterProp) {
        n.key.visit_with(self);
        n.param.visit_with(self);
    }

    fn visit_expr(&mut self, _: &Expr) {}

    fn visit_decl(&mut self, d: &Decl) {
        self.count += match d {
            Decl::Class(_) | Decl::Fn(_) => 1,
            Decl::Var(var_decl) => var_decl.decls.len(),
            Decl::Using(using_decl) => using_decl.decls.len(),
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_) => 0,
        };
    }

    fn visit_var_decl_or_expr(&mut self, node: &VarDeclOrExpr) {
        if let VarDeclOrExpr::VarDecl(v) = node {
            self.count += v.decls.len()
        }
    }
}

/// Enhanced IIFE invocation for sequence expressions
impl Optimizer<'_> {
    /// Specifically handles IIFE invocation for arrow functions within sequence
    /// expressions. This addresses the issue where arrow function IIFEs in
    /// sequences aren't optimized as aggressively as standalone IIFEs.
    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn invoke_iife_in_seq_expr(&mut self, seq: &mut SeqExpr) {
        trace_op!("iife: invoke_iife_in_seq_expr");

        // Process each expression in the sequence to look for IIFE opportunities
        for expr in &mut seq.exprs {
            // Apply IIFE optimization to each expression in the sequence
            self.invoke_iife(expr);
        }

        // Additional optimization: look for specific patterns in sequences
        // where arrow function IIFEs can be further optimized
        self.optimize_arrow_iife_patterns_in_seq(seq);
    }

    /// Optimizes specific patterns of arrow function IIFEs in sequence
    /// expressions
    fn optimize_arrow_iife_patterns_in_seq(&mut self, seq: &mut SeqExpr) {
        let mut changed = false;

        for i in 0..seq.exprs.len() {
            // First, check if this expression can be optimized without borrowing conflicts
            let can_optimize = if let Expr::Call(call) = &*seq.exprs[i] {
                if let Callee::Expr(callee) = &call.callee {
                    if let Expr::Arrow(arrow) = &**callee {
                        // For expression-style arrow functions in sequences,
                        // we can be more aggressive with optimization
                        if let BlockStmtOrExpr::Expr(_body) = &*arrow.body {
                            self.can_optimize_arrow_iife_in_seq(arrow, call)
                        } else {
                            false
                        }
                    } else {
                        false
                    }
                } else {
                    false
                }
            } else {
                false
            };

            // If we can optimize, perform the mutation
            if can_optimize {
                // Extract a fresh mutable reference to avoid borrowing conflicts
                // This block ensures all previous borrows are dropped before we create new ones
                let expr = &mut seq.exprs[i];
                if let Expr::Call(call) = &mut **expr {
                    if let Callee::Expr(callee) = &call.callee {
                        if let Expr::Arrow(arrow) = &**callee {
                            if let BlockStmtOrExpr::Expr(_body) = &*arrow.body {
                                let new_expr = self.optimize_single_arrow_iife_in_seq(arrow, call);

                                if let Some(new_expr) = new_expr {
                                    **expr = new_expr;
                                    changed = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        if changed {
            self.changed = true;
            report_change!(
                "iife: Enhanced optimization of arrow functions in sequence expressions"
            );
        }
    }

    /// Checks if an arrow function IIFE in a sequence can be optimized
    fn can_optimize_arrow_iife_in_seq(&self, arrow: &ArrowExpr, call: &CallExpr) -> bool {
        // Only optimize simple arrow functions with expression bodies
        if arrow.is_async || arrow.is_generator {
            return false;
        }

        // Check if parameters are simple identifiers
        if !arrow.params.iter().all(|p| p.is_ident()) {
            return false;
        }

        // Ensure no spread arguments
        if call.args.iter().any(|arg| arg.spread.is_some()) {
            return false;
        }

        // Check if the arrow function body is simple enough for sequence optimization
        if let BlockStmtOrExpr::Expr(body) = &*arrow.body {
            self.is_simple_expr_for_seq_optimization(body)
        } else {
            false
        }
    }

    /// Checks if an expression is simple enough to be optimized in a sequence
    fn is_simple_expr_for_seq_optimization(&self, expr: &Expr) -> bool {
        match expr {
            Expr::Lit(..) | Expr::Ident(..) => true,
            Expr::Bin(bin) if !bin.op.may_short_circuit() => {
                self.is_simple_expr_for_seq_optimization(&bin.left)
                    && self.is_simple_expr_for_seq_optimization(&bin.right)
            }
            Expr::Unary(unary) => self.is_simple_expr_for_seq_optimization(&unary.arg),
            Expr::Member(member) if !member.prop.is_computed() => {
                self.is_simple_expr_for_seq_optimization(&member.obj)
            }
            _ => false,
        }
    }

    /// Optimizes a single arrow IIFE in a sequence expression
    fn optimize_single_arrow_iife_in_seq(
        &mut self,
        arrow: &ArrowExpr,
        call: &CallExpr,
    ) -> Option<Expr> {
        if let BlockStmtOrExpr::Expr(body) = &*arrow.body {
            // For simple arrow functions with no parameters in sequences,
            // we can directly replace the IIFE with its body
            if arrow.params.is_empty() && call.args.is_empty() {
                return Some((**body).clone());
            }

            // For arrow functions with simple parameters, inline them
            if arrow.params.len() == call.args.len() {
                let can_inline = arrow.params.iter().zip(&call.args).all(|(param, arg)| {
                    param.is_ident() && self.is_simple_expr_for_seq_optimization(&arg.expr)
                });

                if can_inline {
                    // Create a simple substitution for the parameters
                    let mut substitutions = FxHashMap::default();
                    for (param, arg) in arrow.params.iter().zip(&call.args) {
                        if let Pat::Ident(ident) = param {
                            substitutions.insert(ident.to_id(), arg.expr.clone());
                        }
                    }

                    // Apply substitutions to the body
                    let mut new_body = (**body).clone();
                    if !substitutions.is_empty() {
                        let mut replacer = NormalMultiReplacer::new(&mut substitutions);
                        new_body.visit_mut_with(&mut replacer);
                    }

                    return Some(new_body);
                }
            }
        }

        None
    }
}
