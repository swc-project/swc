use std::{collections::HashMap, mem::swap};

use rustc_hash::FxHashMap;
use swc_atoms::js_word;
use swc_common::{pass::Either, util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_arguments, ident::IdentLike, undefined, ExprFactory, Id};
use swc_ecma_visit::VisitMutWith;

use super::{util::MultiReplacer, Optimizer};
use crate::{
    compress::optimize::Ctx,
    mode::Mode,
    util::{idents_captured_by, idents_used_by, make_number},
};

/// Methods related to the option `negate_iife`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
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
            tracing::debug!("negate_iife: Negating iife");
            *e = Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("!"),
                arg: Box::new(e.take()),
            });
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
                tracing::debug!("negate_iife: Swapping cons and alt");
                cond.test = Box::new(Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: cond.test.take(),
                }));
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
                    cond.test = Box::new(Expr::Call(CallExpr {
                        span: *call_span,
                        callee: callee.take().as_callee(),
                        args: args.take(),
                        type_args: Default::default(),
                    }));
                    swap(&mut cond.cons, &mut cond.alt);
                }
            }
        };
    }
}

/// Methods related to iife.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
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
        if self.options.inline == 0 {
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
                _ => None,
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

        let params = find_params(callee);
        if let Some(params) = params {
            let mut vars = HashMap::default();
            // We check for parameter and argument
            for (idx, param) in params.iter().enumerate() {
                let arg = e.args.get(idx).map(|v| &v.expr);
                if let Pat::Ident(param) = &param {
                    if let Some(usage) = self.data.vars.get(&param.to_id()) {
                        if usage.reassigned() {
                            continue;
                        }
                        if usage.ref_count != 1 {
                            continue;
                        }
                    }

                    if let Some(arg) = arg {
                        // NOTE
                        //
                        // This function is misdesigned and should be removed.
                        // This is wrong because the order of execution is not guaranteed.
                        match &**arg {
                            Expr::Lit(Lit::Str(s)) if s.value.len() > 3 => continue,
                            Expr::Lit(..) => {}
                            _ => continue,
                        }

                        let should_be_inlined = self.can_be_inlined_for_iife(arg);
                        if should_be_inlined {
                            tracing::trace!(
                                "iife: Trying to inline argument ({}{:?})",
                                param.id.sym,
                                param.id.span.ctxt
                            );
                            vars.insert(param.to_id(), arg.clone());
                        }
                    } else {
                        tracing::trace!(
                            "iife: Trying to inline argument ({}{:?}) (undefined)",
                            param.id.sym,
                            param.id.span.ctxt
                        );

                        vars.insert(param.to_id(), undefined(param.span()));
                    }
                }
            }

            let ctx = Ctx {
                in_fn_like: true,
                top_level: false,
                ..self.ctx
            };
            let mut optimizer = self.with_ctx(ctx);
            match find_body(callee) {
                Some(Either::Left(body)) => {
                    tracing::trace!("inline: Inlining arguments");
                    optimizer.inline_vars_in_node(body, vars);
                }
                Some(Either::Right(body)) => {
                    tracing::trace!("inline: Inlining arguments");
                    optimizer.inline_vars_in_node(body, vars);
                }
                _ => {}
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn inline_vars_in_node<N>(&mut self, n: &mut N, vars: FxHashMap<Id, Box<Expr>>)
    where
        N: VisitMutWith<MultiReplacer>,
    {
        if cfg!(feature = "debug") {
            tracing::trace!("inline: inline_vars_in_node");
        }

        n.visit_mut_with(&mut MultiReplacer {
            vars,
            changed: false,
        });
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
        if self.options.inline == 0 {
            let skip = match e {
                Expr::Call(v) => !v.callee.span().is_dummy(),
                _ => true,
            };

            if skip {
                return;
            }
        }

        let call = match e {
            Expr::Call(v) => v,
            _ => return,
        };

        if self.has_noinline(call.span) {
            return;
        }

        let callee = match &mut call.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(e) => &mut **e,
        };

        if self.ctx.dont_invoke_iife {
            tracing::trace!("iife: [x] Inline is prevented");
            return;
        }

        match callee {
            Expr::Arrow(f) => {
                if f.is_async {
                    tracing::trace!("iife: [x] Cannot inline async fn");
                    return;
                }

                if f.is_generator {
                    tracing::trace!("iife: [x] Cannot inline generator");
                    return;
                }

                if self.ctx.in_top_level() && !self.ctx.in_call_arg && self.options.negate_iife {
                    match &f.body {
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

                match &mut f.body {
                    BlockStmtOrExpr::BlockStmt(body) => {
                        let new = self.inline_fn_like(&param_ids, body, &mut call.args);
                        if let Some(new) = new {
                            self.changed = true;
                            tracing::debug!("inline: Inlining a function call (arrow)");

                            *e = new;
                        }
                        return;
                    }
                    BlockStmtOrExpr::Expr(body) => {
                        if let Expr::Lit(Lit::Num(..)) = &**body {
                            if self.ctx.in_obj_of_non_computed_member {
                                return;
                            }
                        }
                    }
                }

                match &mut f.body {
                    BlockStmtOrExpr::BlockStmt(_) => {
                        // TODO
                    }
                    BlockStmtOrExpr::Expr(body) => {
                        self.changed = true;

                        {
                            let vars = f
                                .params
                                .iter()
                                .cloned()
                                .map(|name| VarDeclarator {
                                    span: DUMMY_SP.apply_mark(self.marks.non_top_level),
                                    name,
                                    init: Default::default(),
                                    definite: Default::default(),
                                })
                                .collect::<Vec<_>>();

                            if !vars.is_empty() {
                                self.prepend_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                                    span: DUMMY_SP.apply_mark(self.marks.non_top_level),
                                    kind: VarDeclKind::Var,
                                    declare: Default::default(),
                                    decls: vars,
                                })));
                            }
                        }

                        let mut exprs = vec![Box::new(make_number(DUMMY_SP, 0.0))];
                        for (idx, param) in f.params.iter().enumerate() {
                            if let Some(arg) = call.args.get_mut(idx) {
                                exprs.push(Box::new(Expr::Assign(AssignExpr {
                                    span: DUMMY_SP.apply_mark(self.marks.non_top_level),
                                    op: op!("="),
                                    left: PatOrExpr::Pat(Box::new(param.clone())),
                                    right: arg.expr.take(),
                                })));
                            }
                        }

                        if call.args.len() > f.params.len() {
                            for arg in &mut call.args[f.params.len()..] {
                                exprs.push(arg.expr.take());
                            }
                        }
                        exprs.push(body.take());

                        tracing::debug!("inline: Inlining a call to an arrow function");
                        *e = Expr::Seq(SeqExpr {
                            span: DUMMY_SP,
                            exprs,
                        });
                    }
                }
            }
            Expr::Fn(f) => {
                if self.ctx.in_top_level() && !self.ctx.in_call_arg && self.options.negate_iife {
                    let body = f.function.body.as_ref().unwrap();
                    let has_decl = body.stmts.iter().any(|stmt| matches!(stmt, Stmt::Decl(..)));
                    if has_decl {
                        tracing::trace!("iife: [x] Found decl");
                        return;
                    }
                }

                if f.function.is_async {
                    tracing::trace!("iife: [x] Cannot inline async fn");
                    return;
                }

                if f.function.is_generator {
                    tracing::trace!("iife: [x] Cannot inline generator");
                    return;
                }

                // Abort if a parameter is complex
                if f.function.params.iter().any(|param| {
                    matches!(
                        param.pat,
                        Pat::Object(..) | Pat::Array(..) | Pat::Assign(..) | Pat::Rest(..)
                    )
                }) {
                    tracing::trace!("iife: [x] Found complex pattern");
                    return;
                }

                if let Some(i) = &f.ident {
                    if idents_used_by(&f.function.body).contains(&i.to_id()) {
                        tracing::trace!("iife: [x] Recursive?");
                        return;
                    }
                }

                for arg in &call.args {
                    if arg.spread.is_some() {
                        tracing::trace!("iife: [x] Found spread argument");
                        return;
                    }
                    match &*arg.expr {
                        Expr::Fn(..) | Expr::Arrow(..) => {
                            tracing::trace!("iife: [x] Found callable argument");
                            return;
                        }
                        _ => {}
                    }
                }

                let body = f.function.body.as_mut().unwrap();
                if body.stmts.is_empty() {
                    *e = *undefined(f.function.span);
                    return;
                }

                let param_ids = f
                    .function
                    .params
                    .iter()
                    .map(|p| p.pat.clone().ident().unwrap().id)
                    .collect::<Vec<_>>();

                if !self.can_inline_fn_like(&param_ids, body) {
                    tracing::trace!("iife: [x] Body is not inlinable");
                    return;
                }

                let new = self.inline_fn_like(&param_ids, body, &mut call.args);
                if let Some(new) = new {
                    self.changed = true;
                    tracing::debug!("inline: Inlining a function call");

                    *e = new;
                }

                //
            }
            _ => {}
        }
    }

    fn can_inline_fn_like(&self, param_ids: &[Ident], body: &BlockStmt) -> bool {
        // Don't create top-level variables.
        if !param_ids.is_empty() && self.ctx.in_top_level() {
            for pid in param_ids {
                if let Some(usage) = self.data.vars.get(&pid.to_id()) {
                    if usage.ref_count > 1 || usage.assign_count > 0 || usage.inline_prevented {
                        return false;
                    }
                }
            }
        }

        if self.ctx.executed_multiple_time {
            if !param_ids.is_empty() {
                let captured = idents_captured_by(body);

                for param in param_ids {
                    if captured.contains(&param.to_id()) {
                        return false;
                    }
                }
            }
        }

        if !body.stmts.iter().all(|stmt| match stmt {
            Stmt::Decl(Decl::Var(VarDecl {
                kind: VarDeclKind::Var | VarDeclKind::Let,
                decls,
                ..
            })) => {
                if decls.iter().any(|decl| match decl.name {
                    Pat::Ident(BindingIdent {
                        id:
                            Ident {
                                sym: js_word!("arguments"),
                                ..
                            },
                        ..
                    }) => true,
                    Pat::Ident(..) => false,
                    _ => true,
                }) {
                    return false;
                }

                if self.ctx.executed_multiple_time {
                    return false;
                }

                if self.ctx.in_top_level() && !self.options.module {
                    return false;
                }

                true
            }

            Stmt::Expr(e) => match &*e.expr {
                Expr::Await(..) => false,

                // TODO: Check if parameter is used and inline if call is not related to parameters.
                Expr::Call(e) => {
                    let used = idents_used_by(&e.callee);
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
        }) {
            return false;
        }

        if contains_arguments(body) {
            return false;
        }

        true
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

        self.changed = true;
        tracing::debug!("inline: Inlining an iife");

        let mut exprs = vec![];

        {
            let vars = params
                .iter()
                .cloned()
                .map(BindingIdent::from)
                .map(Pat::Ident)
                .map(|name| VarDeclarator {
                    span: DUMMY_SP.apply_mark(self.marks.non_top_level),
                    name,
                    init: Default::default(),
                    definite: Default::default(),
                })
                .collect::<Vec<_>>();

            if !vars.is_empty() {
                if cfg!(feature = "debug") {
                    tracing::debug!("iife: Creating variables: {:?}", vars);
                }
                self.prepend_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP.apply_mark(self.marks.non_top_level),
                    kind: VarDeclKind::Var,
                    declare: Default::default(),
                    decls: vars,
                })));
            }
        }

        for (idx, param) in params.iter().enumerate() {
            if let Some(arg) = args.get_mut(idx) {
                exprs.push(Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP.apply_mark(self.marks.non_top_level),
                    op: op!("="),
                    left: PatOrExpr::Pat(Box::new(Pat::Ident(param.clone().into()))),
                    right: arg.expr.take(),
                })));
            }
        }

        if args.len() > params.len() {
            for arg in &mut args[params.len()..] {
                exprs.push(arg.expr.take());
            }
        }

        for mut stmt in body.stmts.take() {
            match stmt {
                Stmt::Decl(Decl::Var(ref mut var)) => {
                    for decl in &mut var.decls {
                        if decl.init.is_some() {
                            exprs.push(Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP.apply_mark(self.marks.non_top_level),
                                op: op!("="),
                                left: PatOrExpr::Pat(Box::new(decl.name.clone())),
                                right: decl.init.take().unwrap(),
                            })))
                        }
                        decl.span = decl.span.apply_mark(self.marks.non_top_level);
                    }

                    self.prepend_stmts.push(stmt);
                }

                Stmt::Expr(stmt) => {
                    exprs.push(stmt.expr);
                }

                Stmt::Return(stmt) => {
                    let span = stmt.span;
                    let val = *stmt.arg.unwrap_or_else(|| undefined(span));
                    exprs.push(Box::new(val));

                    return Some(Expr::Seq(SeqExpr {
                        span: DUMMY_SP.apply_mark(self.marks.synthesized_seq),
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
            span: DUMMY_SP.apply_mark(self.marks.synthesized_seq),
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
                body: BlockStmtOrExpr::Expr(body),
                is_async: false,
                is_generator: false,
                ..
            }) => params.iter().all(|p| p.is_ident()) && self.can_be_inlined_for_iife(body),

            _ => false,
        }
    }
}
