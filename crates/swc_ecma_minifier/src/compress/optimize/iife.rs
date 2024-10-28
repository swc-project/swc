use std::{collections::HashMap, mem::swap};

use rustc_hash::FxHashMap;
use swc_common::{pass::Either, util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_arguments, contains_this_expr, find_pat_ids, ExprFactory};
use swc_ecma_visit::VisitMutWith;

use super::{util::NormalMultiReplacer, Optimizer};
#[cfg(feature = "debug")]
use crate::debug::dump;
use crate::{
    compress::optimize::Ctx,
    program_data::{ProgramData, ScopeData},
    util::{idents_captured_by, idents_used_by, make_number},
};

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
        if !self.ctx.dont_use_negated_iife {
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
    #[cfg_attr(feature = "debug", tracing::instrument(skip(self, e)))]
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
            if scope.used_arguments {
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
                .filter(|usage| usage.used_recursively)
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
                            if usage.reassigned {
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
                                if usage.reassigned
                                    || usage.ref_count != 1
                                    || !usage.has_property_access
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

            let ctx = Ctx {
                in_fn_like: true,
                top_level: false,
                ..self.ctx.clone()
            };
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
                .filter(|usage| usage.used_recursively)
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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn inline_vars_in_node<N>(&mut self, n: &mut N, mut vars: FxHashMap<Id, Box<Expr>>)
    where
        N: for<'aa> VisitMutWith<NormalMultiReplacer<'aa>>,
    {
        trace_op!("inline: inline_vars_in_node");

        let mut v = NormalMultiReplacer::new(&mut vars);
        n.visit_mut_with(&mut v);
        self.changed |= v.changed;
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

        if self.options.inline == 0
            && !(self.options.reduce_vars && self.options.reduce_fns && self.options.evaluate)
        {
            let skip = match e {
                Expr::Call(v) => !v.callee.span().is_dummy(),
                _ => true,
            };

            if skip {
                log_abort!("skip");
                return;
            }
        }

        let call = match e {
            Expr::Call(v) => v,
            _ => return,
        };

        trace_op!("iife: Checking noinline");

        if self.has_noinline(call.ctxt) {
            log_abort!("iife: Has no inline mark");
            return;
        }

        let callee = match &mut call.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(e) => &mut **e,
        };

        if self.ctx.dont_invoke_iife {
            log_abort!("iife: Inline is prevented");
            return;
        }

        trace_op!("iife: Checking callee");

        match callee {
            Expr::Arrow(f) => {
                if f.is_async {
                    log_abort!("iife: Cannot inline async fn");
                    return;
                }

                if f.is_generator {
                    log_abort!("iife: Cannot inline generator");
                    return;
                }

                if self.ctx.in_param && !f.params.is_empty() {
                    log_abort!("iife: We don't invoke IIFE with params in function params");
                    return;
                }

                if !self.may_add_ident() {
                    match &*f.body {
                        BlockStmtOrExpr::BlockStmt(body) => {
                            let has_decl =
                                body.stmts.iter().any(|stmt| matches!(stmt, Stmt::Decl(..)));
                            if has_decl {
                                return;
                            }
                        }
                        BlockStmtOrExpr::Expr(_) => {}
                    }
                }

                if f.params.iter().any(|param| !param.is_ident()) {
                    return;
                }

                let param_ids = f
                    .params
                    .iter()
                    .map(|p| p.clone().ident().unwrap().id)
                    .collect::<Vec<_>>();

                match &mut *f.body {
                    BlockStmtOrExpr::BlockStmt(body) => {
                        let new = self.inline_fn_like(&param_ids, body, &mut call.args);
                        if let Some(new) = new {
                            self.changed = true;
                            report_change!("inline: Inlining a function call (arrow)");

                            *e = new;
                        }
                    }
                    BlockStmtOrExpr::Expr(body) => {
                        if !self.can_extract_param(&param_ids) {
                            return;
                        }

                        if let Expr::Lit(Lit::Num(..)) = &**body {
                            if self.ctx.in_obj_of_non_computed_member {
                                return;
                            }
                        }

                        self.changed = true;
                        report_change!("inline: Inlining a function call (arrow)");

                        let mut exprs = vec![Box::new(make_number(DUMMY_SP, 0.0))];

                        let vars = self.inline_fn_param(&param_ids, &mut call.args, &mut exprs);

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
                trace_op!("iife: Expr::Fn(..)");

                if !self.may_add_ident() {
                    let body = f.function.body.as_ref().unwrap();
                    let has_decl = body.stmts.iter().any(|stmt| matches!(stmt, Stmt::Decl(..)));
                    if has_decl {
                        log_abort!("iife: [x] Found decl");
                        return;
                    }
                }

                if f.function.is_async {
                    log_abort!("iife: [x] Cannot inline async fn");
                    return;
                }

                if f.function.is_generator {
                    log_abort!("iife: [x] Cannot inline generator");
                    return;
                }

                if self.ctx.in_param && !f.function.params.is_empty() {
                    log_abort!("iife: We don't invoke IIFE with params in function params");
                    return;
                }

                // Abort if a parameter is complex
                if f.function.params.iter().any(|param| {
                    matches!(
                        param.pat,
                        Pat::Object(..) | Pat::Array(..) | Pat::Assign(..) | Pat::Rest(..)
                    )
                }) {
                    log_abort!("iife: [x] Found complex pattern");
                    return;
                }

                trace_op!("iife: Checking recursiveness");

                if let Some(i) = &f.ident {
                    if self
                        .data
                        .vars
                        .get(&i.to_id())
                        .filter(|usage| usage.used_recursively)
                        .is_some()
                    {
                        log_abort!("iife: [x] Recursive?");
                        return;
                    }
                }

                for arg in &call.args {
                    if arg.spread.is_some() {
                        log_abort!("iife: Found spread argument");
                        return;
                    }
                }

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
                    .map(|p| p.pat.clone().ident().unwrap().id)
                    .collect::<Vec<_>>();

                if !self.can_inline_fn_like(&param_ids, body) {
                    log_abort!("iife: [x] Body is not inlinable");
                    return;
                }

                let new = self.inline_fn_like(&param_ids, body, &mut call.args);
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

    fn can_extract_param(&self, param_ids: &[Ident]) -> bool {
        // Don't create top-level variables.
        if !param_ids.is_empty() && !self.may_add_ident() {
            for pid in param_ids {
                if let Some(usage) = self.data.vars.get(&pid.to_id()) {
                    if usage.ref_count > 1 || usage.assign_count > 0 || usage.inline_prevented {
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

    fn can_inline_fn_like(&self, param_ids: &[Ident], body: &BlockStmt) -> bool {
        trace_op!("can_inline_fn_like");

        if contains_this_expr(body) || contains_arguments(body) {
            return false;
        }

        if body.stmts.len() == 1 {
            if let Stmt::Return(ReturnStmt { arg: Some(arg), .. }) = &body.stmts[0] {
                if self.is_return_arg_simple_enough_for_iife_eval(arg) {
                    return true;
                }
            }
        }

        if !self.can_extract_param(param_ids) {
            return false;
        }

        // Abort on eval.
        // See https://github.com/swc-project/swc/pull/6478
        //
        // We completely abort on eval, because we cannot know whether a variable in
        // upper scope will be afftected by eval.
        // https://github.com/swc-project/swc/issues/6628
        if self.data.top.has_eval_call {
            log_abort!("iife: [x] Aborting because of eval");
            return false;
        }

        if self.ctx.executed_multiple_time {
            if !param_ids.is_empty() {
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

        if !body.stmts.iter().all(|stmt| {
            if let Stmt::Decl(Decl::Var(var)) = stmt {
                for decl in &var.decls {
                    for id in find_pat_ids::<_, Id>(&decl.name) {
                        if self.ident_reserved(&id.0) {
                            log_abort!("iife: [x] Cannot inline because reservation of `{}`", id.0);
                            return false;
                        }
                    }
                }
            }

            match stmt {
                Stmt::Decl(Decl::Var(var))
                    if matches!(
                        &**var,
                        VarDecl {
                            kind: VarDeclKind::Var | VarDeclKind::Let,
                            ..
                        }
                    ) =>
                {
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

                    if self.ctx.executed_multiple_time {
                        return false;
                    }

                    if !self.may_add_ident() {
                        return false;
                    }

                    true
                }

                Stmt::Expr(e) => match &*e.expr {
                    Expr::Await(..) => false,

                    // TODO: Check if parameter is used and inline if call is not related to
                    // parameters.
                    Expr::Call(e) => {
                        if e.callee.as_expr().and_then(|e| e.as_ident()).is_some() {
                            return true;
                        }

                        let used = idents_used_by(&e.callee);

                        if used.iter().all(|id| {
                            self.data
                                .vars
                                .get(id)
                                .map(|usage| usage.ref_count == 1 && usage.callee_count > 0)
                                .unwrap_or(false)
                        }) {
                            return true;
                        }

                        param_ids.iter().all(|param| !used.contains(&param.to_id()))
                    }

                    _ => true,
                },

                Stmt::Return(ReturnStmt { arg, .. }) => match arg.as_deref() {
                    Some(Expr::Await(..)) => false,

                    Some(Expr::Lit(Lit::Num(..))) => !self.ctx.in_obj_of_non_computed_member,
                    _ => true,
                },
                _ => false,
            }
        }) {
            return false;
        }

        true
    }

    fn inline_fn_param(
        &mut self,
        params: &[Ident],
        args: &mut [ExprOrSpread],
        exprs: &mut Vec<Box<Expr>>,
    ) -> Vec<VarDeclarator> {
        let mut vars = Vec::with_capacity(params.len());

        for (idx, param) in params.iter().enumerate() {
            let arg = args.get_mut(idx).map(|arg| arg.expr.take());

            let no_arg = arg.is_none();

            if let Some(arg) = arg {
                if let Some(usage) = self.data.vars.get_mut(&params[idx].to_id()) {
                    if usage.ref_count == 1
                        && !usage.reassigned
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
                        left: param.clone().into(),
                        right: arg,
                    }
                    .into(),
                )
            };

            vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: param.clone().into(),
                init: if self.ctx.executed_multiple_time && no_arg {
                    Some(Expr::undefined(DUMMY_SP))
                } else {
                    None
                },
                definite: Default::default(),
            });
        }

        vars
    }

    fn inline_fn_like(
        &mut self,
        params: &[Ident],
        body: &mut BlockStmt,
        args: &mut [ExprOrSpread],
    ) -> Option<Expr> {
        if !self.can_inline_fn_like(params, &*body) {
            return None;
        }

        if args.iter().any(|arg| arg.spread.is_some()) {
            return None;
        }

        if self.vars.inline_with_multi_replacer(body) {
            self.changed = true;
        }

        let param_len = params.len();
        let mut exprs = Vec::new();
        let vars = self.inline_fn_param(params, args, &mut exprs);

        if args.len() > param_len {
            for arg in &mut args[param_len..] {
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
