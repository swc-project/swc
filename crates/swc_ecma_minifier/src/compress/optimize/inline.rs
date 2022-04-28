use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike, ExprExt, UsageFinder};

use super::Optimizer;
use crate::{
    compress::optimize::util::{class_has_side_effect, is_valid_for_lhs},
    debug::dump,
    mode::Mode,
    util::{idents_captured_by, idents_used_by},
};

/// Methods related to option `inline`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// Stores the value of a variable to inline it.
    ///
    /// This method may remove value of initializer. It mean that the value will
    /// be inlined and should be removed from [Vec<VarDeclarator>].
    pub(super) fn store_var_for_inlining(&mut self, var: &mut VarDeclarator) {
        let init = match &mut var.init {
            Some(v) => v,
            None => return,
        };

        let should_preserve = !var.span.has_mark(self.marks.non_top_level)
            && (!self.options.top_level() && self.options.top_retain.is_empty())
            && self.ctx.in_top_level();

        trace_op!(
            "inline: store_var_for_inlining({}, should_preserve = {:?})",
            dump(&var.name, false),
            should_preserve
        );

        if self.data.top.has_eval_call {
            return;
        }

        self.vars.inline_with_multi_replacer(init);

        // TODO: Check for side effect between original decl position and inlined
        // position

        // We will inline if possible.
        if let Pat::Ident(i) = &var.name {
            if i.id.sym == js_word!("arguments") {
                return;
            }
            if self.options.top_retain.contains(&i.id.sym) {
                return;
            }

            // Store variables if it's used only once
            if let Some(usage) = self.data.vars.get(&i.to_id()) {
                if usage.declared_as_catch_param {
                    return;
                }
                if usage.inline_prevented {
                    return;
                }

                if should_preserve && usage.var_kind != Some(VarDeclKind::Const) {
                    log_abort!(
                        "inline: [x] Preserving non-const variable `{}` because it's top-level",
                        dump(&var.name, false)
                    );
                    return;
                }

                if usage.cond_init || usage.used_above_decl {
                    log_abort!("inline: [x] It's cond init or used before decl",);
                    return;
                }

                if !usage.is_fn_local {
                    match &**init {
                        Expr::Lit(..) => {}

                        Expr::Unary(UnaryExpr {
                            op: op!("!"), arg, ..
                        }) if matches!(&**arg, Expr::Lit(..)) => {}

                        Expr::Fn(FnExpr {
                            function:
                                Function {
                                    body: Some(body), ..
                                },
                            ..
                        }) => {
                            if body.stmts.len() == 1 && matches!(&body.stmts[0], Stmt::Return(..)) {
                            } else {
                                log_abort!("inline: [x] It's not fn-local");
                                return;
                            }
                        }
                        _ => {
                            log_abort!("inline: [x] It's not fn-local");
                            return;
                        }
                    }
                }

                if !usage.reassigned_with_assignment && !usage.reassigned_with_var_decl {
                    match &**init {
                        Expr::Fn(..) | Expr::Arrow(..) => {
                            self.typeofs.insert(i.to_id(), js_word!("function"));
                        }
                        Expr::Array(..) | Expr::Object(..) => {
                            self.typeofs.insert(i.to_id(), js_word!("object"));
                        }
                        _ => {}
                    }
                }

                if !usage.mutated {
                    self.mode.store(i.to_id(), &*init);
                }

                // No use => dropped
                if usage.ref_count == 0 {
                    if init.may_have_side_effects() {
                        // TODO: Inline partially
                        return;
                    }

                    // TODO: Remove
                    return;
                }

                let is_inline_enabled = self.options.reduce_vars
                    || self.options.collapse_vars
                    || self.options.inline != 0;

                // Mutation of properties are ok
                if is_inline_enabled
                    && (!usage.mutated
                        || (usage.assign_count == 0
                            && !usage.reassigned()
                            && !usage.has_property_mutation))
                    && match &**init {
                        Expr::Lit(lit) => match lit {
                            Lit::Str(s) => usage.ref_count == 1 || s.value.len() <= 3,
                            Lit::Bool(_) | Lit::Null(_) | Lit::Num(_) | Lit::BigInt(_) => true,
                            Lit::Regex(_) => self.options.unsafe_regexp,
                            _ => false,
                        },
                        Expr::Unary(UnaryExpr {
                            op: op!("!"), arg, ..
                        }) => arg.is_lit(),
                        Expr::This(..) => usage.is_fn_local,
                        Expr::Arrow(arr) => is_arrow_simple_enough_for_copy(arr),
                        _ => false,
                    }
                {
                    self.mode.store(i.to_id(), &*init);

                    if self.options.inline != 0
                        && !should_preserve
                        && match &**init {
                            Expr::Arrow(..) => self.options.unused,
                            _ => true,
                        }
                    {
                        self.changed = true;

                        report_change!(
                            "inline: Decided to inline '{}{:?}' because it's simple",
                            i.id.sym,
                            i.id.span.ctxt
                        );

                        if self.ctx.var_kind == Some(VarDeclKind::Const) {
                            var.span = var.span.apply_mark(self.marks.non_top_level);
                        }

                        self.vars.lits.insert(i.to_id(), init.take());

                        var.name.take();
                    } else if self.options.inline != 0 || self.options.reduce_vars {
                        trace_op!(
                            "inline: Decided to copy '{}{:?}' because it's simple",
                            i.id.sym,
                            i.id.span.ctxt
                        );

                        self.mode.store(i.to_id(), &*init);

                        self.vars.lits.insert(i.to_id(), init.clone());
                    }
                    return;
                }

                // Single use => inlined
                if is_inline_enabled
                    && !should_preserve
                    && !usage.reassigned()
                    && (!usage.mutated || usage.is_mutated_only_by_one_call())
                    && usage.ref_count == 1
                {
                    match &**init {
                        Expr::Fn(FnExpr {
                            function: Function { is_async: true, .. },
                            ..
                        })
                        | Expr::Fn(FnExpr {
                            function:
                                Function {
                                    is_generator: true, ..
                                },
                            ..
                        })
                        | Expr::Arrow(ArrowExpr { is_async: true, .. })
                        | Expr::Arrow(ArrowExpr {
                            is_generator: true, ..
                        }) => return,
                        _ => {}
                    }

                    match &**init {
                        Expr::Lit(Lit::Regex(..)) => {
                            if !usage.is_fn_local || usage.executed_multiple_time {
                                return;
                            }
                        }

                        Expr::This(..) => {
                            // Don't inline this if it passes function boundaries.
                            if !usage.is_fn_local {
                                return;
                            }
                        }

                        _ => {}
                    }

                    if let Expr::Ident(v) = &**init {
                        if let Some(v_usage) = self.data.vars.get(&v.to_id()) {
                            if v_usage.reassigned() {
                                return;
                            }
                        }
                    }

                    if usage.used_as_arg && !usage.is_fn_local {
                        if let Expr::Fn(..) = &**init {
                            return;
                        }
                    }

                    if usage.executed_multiple_time {
                        match &**init {
                            Expr::Lit(..) => {}
                            Expr::Fn(f) => {
                                // Similar to `_loop` generation of the
                                // block_scoping pass.
                                // If the function captures the environment, we
                                // can't inline it.
                                let params: Vec<Id> = find_ids(&f.function.params);

                                if !params.is_empty() {
                                    let captured = idents_captured_by(&f.function.body);

                                    for param in params {
                                        if captured.contains(&param) {
                                            return;
                                        }
                                    }
                                }
                            }
                            _ => {
                                return;
                            }
                        }
                    }

                    if init.may_have_side_effects() {
                        return;
                    }

                    report_change!(
                        "inline: Decided to inline var '{}' because it's used only once",
                        i.id
                    );
                    self.changed = true;
                    self.vars.vars_for_inlining.insert(i.to_id(), init.take());
                }
            }
        }
    }

    /// Check if the body of a function is simple enough to inline.
    fn is_fn_body_simple_enough_to_inline(&self, body: &BlockStmt, param_count: usize) -> bool {
        fn expr_cost(e: &Expr) -> Option<usize> {
            match e {
                // TODO?
                Expr::Lit(..) => Some(1),
                Expr::Ident(..) => Some(1),

                Expr::Bin(BinExpr {
                    op: op @ op!("instanceof") | op @ op!("in"),
                    left,
                    right,
                    ..
                }) => Some(2 + op.as_str().len() + expr_cost(left)? + expr_cost(right)?),

                Expr::Unary(UnaryExpr {
                    op: op @ op!("typeof") | op @ op!("void") | op @ op!("delete"),
                    arg,
                    ..
                }) => Some(2 + op.as_str().len() + expr_cost(arg)?),

                Expr::Unary(UnaryExpr { op, arg, .. }) => Some(1 + expr_cost(arg)?),

                Expr::Call(CallExpr {
                    callee: Callee::Expr(callee),
                    args,
                    ..
                }) => {
                    let mut c = expr_cost(callee)? + 2;

                    for arg in args {
                        if arg.spread.is_some() {
                            c += 3;
                        }

                        c += expr_cost(&arg.expr)?;
                    }

                    Some(c)
                }

                Expr::Bin(e) => Some(expr_cost(&e.left)? + expr_cost(&e.right)? + 2),

                Expr::Update(e) => Some(expr_cost(&e.arg)? + 2),

                Expr::Assign(e) => {
                    e.left.as_ident()?;
                    Some(2 + expr_cost(&e.right)?)
                }

                Expr::Seq(e) => e
                    .exprs
                    .iter()
                    .map(|v| expr_cost(v))
                    .fold(Some(0), |a, b| Some(a? + b?)),

                _ => None,
            }
        }

        if body.stmts.len() == 1 {
            match &body.stmts[0] {
                Stmt::Expr(ExprStmt { expr, .. }) => {
                    if is_expr_simple_enough(expr, Default::default()) {
                        return true;
                    }
                }

                Stmt::Return(ReturnStmt { arg, .. }) => {
                    if let Some(e) = arg.as_deref() {
                        if is_expr_simple_enough(e, Default::default()) {
                            return true;
                        }
                    }
                }

                _ => {}
            }
        }

        false
    }

    /// Stores `typeof` of [ClassDecl] and [FnDecl].
    pub(super) fn store_typeofs(&mut self, decl: &mut Decl) {
        let i = match &*decl {
            Decl::Class(v) => v.ident.clone(),
            Decl::Fn(f) => f.ident.clone(),
            _ => return,
        };
        if i.sym == *"arguments" {
            return;
        }

        if let Some(usage) = self.data.vars.get(&i.to_id()) {
            if !usage.reassigned() {
                trace_op!("typeofs: Storing typeof `{}{:?}`", i.sym, i.span.ctxt);
                match &*decl {
                    Decl::Fn(..) => {
                        self.typeofs.insert(i.to_id(), js_word!("function"));
                    }
                    Decl::Class(..) => {
                        self.typeofs.insert(i.to_id(), js_word!("object"));
                    }
                    _ => {}
                }
            }
        }
    }

    /// This method handles only [ClassDecl] and [FnDecl]. [VarDecl] should be
    /// handled specially.
    pub(super) fn store_decl_for_inlining(&mut self, decl: &mut Decl) {
        let i = match &*decl {
            Decl::Class(v) => v.ident.clone(),
            Decl::Fn(f) => {
                if f.function.is_async {
                    return;
                }

                f.ident.clone()
            }
            _ => return,
        };

        trace_op!("inline: Trying to inline decl ({}{:?})", i.sym, i.span.ctxt);

        if self.options.inline == 0 && !self.options.reduce_vars {
            log_abort!("inline: [x] Inline disabled");
            return;
        }

        if (!self.options.top_level() && self.options.top_retain.is_empty())
            && self.ctx.in_top_level()
        {
            log_abort!("inline: [x] Top level");
            return;
        }

        if self.has_noinline(decl.span()) {
            log_abort!("inline: [x] Has noinline");
            return;
        }

        // Respect `top_retain`
        if self.ctx.in_top_level() && self.options.top_retain.contains(&i.sym) {
            log_abort!("inline: [x] top_retain");
            return;
        }

        if self.ctx.is_exported {
            log_abort!("inline: [x] exported");
            return;
        }

        if self.data.top.has_eval_call || self.data.top.has_with_stmt {
            return;
        }

        if let Some(usage) = self.data.vars.get(&i.to_id()) {
            if usage.declared_as_catch_param {
                log_abort!("inline: [x] Declared as a catch parameter");
                return;
            }

            if usage.reassigned() || usage.inline_prevented {
                log_abort!(
                    "inline: [x] reassigned = {}, inline_prevented = {}",
                    usage.reassigned(),
                    usage.inline_prevented
                );
                return;
            }

            // Inline very simple functions.
            match decl {
                Decl::Fn(f) if self.options.inline >= 2 && f.ident.sym != *"arguments" => {
                    self.vars.inline_with_multi_replacer(&mut f.function.body);

                    match &f.function.body {
                        Some(body) => {
                            if !UsageFinder::find(&i, body)
                                && self.is_fn_body_simple_enough_to_inline(
                                    body,
                                    f.function.params.len(),
                                )
                            {
                                trace_op!(
                                    "inline: Decided to inline function '{}{:?}' as it's very \
                                     simple",
                                    f.ident.sym,
                                    f.ident.span.ctxt
                                );

                                if f.function.params.iter().any(|param| {
                                    matches!(param.pat, Pat::Rest(..) | Pat::Assign(..))
                                }) {
                                    return;
                                }

                                self.vars.simple_functions.insert(
                                    i.to_id(),
                                    match decl {
                                        Decl::Fn(f) => Box::new(Expr::Fn(FnExpr {
                                            ident: None,
                                            function: f.function.clone(),
                                        })),
                                        _ => {
                                            unreachable!()
                                        }
                                    },
                                );
                                return;
                            }
                        }
                        None => {}
                    }
                }
                _ => {}
            }

            // Single use => inlined

            // TODO(kdy1):
            //
            // (usage.is_fn_local || self.options.inline == 3)
            //
            // seems like a correct check, but it's way to aggressive.
            // It does not break the code, but everything like _asyncToGenerator is inlined.
            //
            if (self.options.reduce_vars || self.options.collapse_vars || self.options.inline != 0)
                && usage.ref_count == 1
                && (usage.is_fn_local || (usage.used_as_callee && !usage.used_above_decl))
                && !usage.executed_multiple_time
                && !usage.inline_prevented
                && (match decl {
                    Decl::Class(..) => !usage.used_above_decl,
                    Decl::Fn(..) => true,
                    _ => false,
                })
            {
                if let Decl::Class(ClassDecl { class, .. }) = decl {
                    if class_has_side_effect(class) {
                        return;
                    }
                }

                self.changed = true;
                match &decl {
                    Decl::Class(c) => {
                        report_change!(
                            "inline: Decided to inline class `{}{:?}` as it's used only once",
                            c.ident.sym,
                            c.ident.span.ctxt
                        );
                    }
                    Decl::Fn(f) => {
                        report_change!(
                            "inline: Decided to inline function `{}{:?}` as it's used only once",
                            f.ident.sym,
                            f.ident.span.ctxt
                        );
                    }
                    _ => {}
                }

                let e = match decl.take() {
                    Decl::Class(c) => Box::new(Expr::Class(ClassExpr {
                        ident: Some(c.ident),
                        class: c.class,
                    })),
                    Decl::Fn(f) => Box::new(Expr::Fn(FnExpr {
                        ident: Some(f.ident),
                        function: f.function,
                    })),
                    _ => {
                        unreachable!()
                    }
                };

                self.vars.vars_for_inlining.insert(i.to_id(), e);
            } else {
                log_abort!("inline: [x] Usage: {:?}", usage);
            }
        }
    }

    /// Actually inlines variables.
    pub(super) fn inline(&mut self, e: &mut Expr) {
        if let Expr::Ident(i) = e {
            //
            if let Some(value) = self
                .vars
                .lits
                .get(&i.to_id())
                .or_else(|| {
                    if self.ctx.is_callee {
                        self.vars.simple_functions.get(&i.to_id())
                    } else {
                        None
                    }
                })
                .and_then(|v| {
                    // Prevent infinite recursion.
                    let ids = idents_used_by(&**v);
                    if ids.contains(&i.to_id()) {
                        None
                    } else {
                        Some(v)
                    }
                })
                .cloned()
            {
                match &*value {
                    Expr::Lit(Lit::Num(..)) => {
                        if self.ctx.is_lhs_of_assign {
                            return;
                        }
                    }
                    Expr::Member(..) => {
                        if self.ctx.executed_multiple_time {
                            return;
                        }
                    }
                    _ => {}
                }

                self.changed = true;
                report_change!("inline: Replacing a variable with cheap expression");

                *e = *value;
                return;
            }

            // Check without cloning
            if let Some(value) = self.vars.vars_for_inlining.get(&i.to_id()) {
                if self.ctx.is_exact_lhs_of_assign && !is_valid_for_lhs(value) {
                    return;
                }

                if let Expr::Member(..) = &**value {
                    if self.ctx.executed_multiple_time {
                        return;
                    }
                }
            }

            if let Some(value) = self.vars.vars_for_inlining.remove(&i.to_id()) {
                self.changed = true;
                report_change!("inline: Replacing '{}' with an expression", i);

                *e = *value;

                log_abort!("inline: [Change] {}", dump(&*e, false))
            }
        }
    }
}

fn is_arrow_simple_enough_for_copy(e: &ArrowExpr) -> bool {
    if e.is_async {
        return false;
    }

    match &e.body {
        BlockStmtOrExpr::BlockStmt(s) => is_block_stmt_of_fn_simple_enough_for_copy(s),
        BlockStmtOrExpr::Expr(e) => is_arrow_body_simple_enough_for_copy(e),
    }
}

fn is_arrow_body_simple_enough_for_copy(e: &Expr) -> bool {
    match e {
        Expr::Ident(..) | Expr::Lit(..) => return true,
        Expr::Member(MemberExpr { prop, .. }) if !prop.is_computed() => return true,
        Expr::Unary(u) => return is_arrow_body_simple_enough_for_copy(&u.arg),

        Expr::Bin(b) => {
            return is_arrow_body_simple_enough_for_copy(&b.left)
                && is_arrow_body_simple_enough_for_copy(&b.right)
        }
        _ => {}
    }

    false
}

fn is_block_stmt_of_fn_simple_enough_for_copy(b: &BlockStmt) -> bool {
    if b.stmts.len() == 1 {
        if let Stmt::Return(ret) = &b.stmts[0] {
            return ret
                .arg
                .as_deref()
                .map(is_arrow_body_simple_enough_for_copy)
                .unwrap_or(true);
        }
    }

    false
}
