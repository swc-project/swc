use std::ops::Deref;

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::atom;
use swc_common::{util::take::Take, EqIgnoreSpan, Mark};
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::alias::{collect_infects_from, AliasConfig};
use swc_ecma_utils::{
    class_has_side_effect, collect_decls, contains_this_expr, find_pat_ids, ExprExt, Remapper,
};
use swc_ecma_visit::VisitMutWith;

use super::Optimizer;
use crate::{
    compress::{
        optimize::{util::is_valid_for_lhs, BitCtx},
        util::contains_super,
    },
    program_data::{ScopeData, VarUsageInfo, VarUsageInfoFlags},
    util::{
        idents_captured_by, idents_used_by, idents_used_by_ignoring_nested, size::SizeWithCtxt,
    },
};

/// Methods related to option `inline`.
impl Optimizer<'_> {
    /// Stores the value of a variable to inline it.
    ///
    /// This method may remove value of initializer. It mean that the value will
    /// be inlined and should be removed from [Vec<VarDeclarator>].
    pub(super) fn store_var_for_inlining(
        &mut self,
        ident: &mut Ident,
        init: &mut Expr,
        can_drop: bool,
    ) {
        trace_op!(
            "inline: store_var_for_inlining({}, may_remove = {:?})",
            crate::debug::dump(ident, false),
            self.may_remove_ident(ident)
        );

        if self.data.top.contains(ScopeData::HAS_EVAL_CALL) {
            return;
        }

        // We will inline if possible.
        if ident.sym == "arguments" {
            return;
        }

        if let Expr::Arrow(ArrowExpr { body, .. }) = init {
            if contains_super(body) {
                return;
            }
            if contains_this_expr(body) {
                return;
            }
        }

        if let Some(usage) = self.data.vars.get(&ident.to_id()) {
            let ref_count = usage.ref_count - u32::from(can_drop && usage.ref_count > 1);
            if !usage.flags.contains(VarUsageInfoFlags::VAR_INITIALIZED) {
                return;
            }

            if self.data.top.contains(ScopeData::USED_ARGUMENTS)
                && usage
                    .flags
                    .contains(VarUsageInfoFlags::DECLARED_AS_FN_PARAM)
            {
                return;
            }
            if usage
                .flags
                .contains(VarUsageInfoFlags::DECLARED_AS_CATCH_PARAM)
            {
                return;
            }
            if usage.flags.contains(VarUsageInfoFlags::INLINE_PREVENTED) {
                return;
            }

            let may_remove = self.may_remove_ident(ident);

            if !may_remove && usage.var_kind != Some(VarDeclKind::Const) {
                log_abort!(
                    "inline: [x] Preserving non-const variable `{}` because it's top-level",
                    crate::debug::dump(ident, false)
                );
                return;
            }

            if usage.flags.contains(VarUsageInfoFlags::USED_ABOVE_DECL) {
                log_abort!("inline: [x] It's cond init or used before decl",);
                return;
            }

            // No use => dropped
            if ref_count == 0 {
                self.mode.store(ident.to_id(), &*init);

                if init.may_have_side_effects(self.ctx.expr_ctx) {
                    // TODO: Inline partially
                    return;
                }

                // TODO: Remove
                return;
            }

            let is_inline_enabled =
                self.options.reduce_vars || self.options.collapse_vars || self.options.inline != 0;

            let mut inlined_into_init = false;

            let id = ident.to_id();

            // We inline arrays partially if it's pure (all elements are literal), and not
            // modified.
            // We don't drop definition, but we just inline array accesses with numeric
            // literal key.
            //
            // TODO: Allow `length` in usage.accessed_props
            if usage.flags.contains(VarUsageInfoFlags::DECLARED)
                && !usage.mutated()
                && usage.accessed_props.is_empty()
                && !usage.flags.intersects(
                    VarUsageInfoFlags::INDEXED_WITH_DYNAMIC_KEY
                        .union(VarUsageInfoFlags::USED_AS_REF),
                )
                && !usage.is_infected()
                && is_inline_enabled
            {
                if let Expr::Array(arr) = init {
                    if arr.elems.len() < 32
                        && arr.elems.iter().all(|e| match e {
                            Some(ExprOrSpread { spread: None, expr }) => match &**expr {
                                Expr::Lit(..) => true,
                                _ => false,
                            },
                            _ => false,
                        })
                    {
                        inlined_into_init = true;
                        self.vars.inline_with_multi_replacer(arr);
                        report_change!(
                            "inline: Decided to store '{}{:?}' for array access",
                            ident.sym,
                            ident.ctxt
                        );
                        self.vars
                            .lits_for_array_access
                            .insert(ident.to_id(), Box::new(init.clone()));
                    }
                }
            }

            if !usage.flags.contains(VarUsageInfoFlags::IS_FN_LOCAL) {
                match init {
                    Expr::Lit(..) | Expr::Ident(..) | Expr::Arrow(..) => {}

                    Expr::Unary(UnaryExpr {
                        op: op!("!"), arg, ..
                    }) if matches!(&**arg, Expr::Lit(..)) => {}

                    Expr::Fn(FnExpr { function, .. })
                        if matches!(&**function, Function { body: Some(..), .. }) =>
                    {
                        if function.body.as_ref().unwrap().stmts.len() == 1
                            && matches!(&function.body.as_ref().unwrap().stmts[0], Stmt::Return(..))
                        {
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

            if !usage.flags.contains(VarUsageInfoFlags::REASSIGNED) {
                match init {
                    Expr::Fn(..) | Expr::Arrow(..) | Expr::Class(..) => {
                        self.typeofs.insert(ident.to_id(), atom!("function"));
                    }
                    Expr::Array(..) | Expr::Object(..) => {
                        self.typeofs.insert(ident.to_id(), atom!("object"));
                    }
                    _ => {}
                }
            }

            if !usage.mutated() {
                self.mode.store(ident.to_id(), &*init);
            }

            if usage.flags.contains(VarUsageInfoFlags::USED_RECURSIVELY) {
                return;
            }

            // Caution: for most case mutation of properties are ok, however if
            // new variant is added for multi inline, think carefully
            if is_inline_enabled
                && usage.declared_count == 1
                && usage.assign_count == 1
                && !usage.flags.contains(VarUsageInfoFlags::REASSIGNED)
                && (usage.property_mutation_count == 0
                    || !usage.flags.contains(VarUsageInfoFlags::REASSIGNED))
                && match init {
                    Expr::Ident(Ident { sym, .. }) if &**sym == "eval" => false,

                    Expr::Ident(id) if !id.eq_ignore_span(ident) => {
                        if !usage.flags.contains(VarUsageInfoFlags::ASSIGNED_FN_LOCAL) {
                            false
                        } else if let Some(u) = self.data.vars.get(&id.to_id()) {
                            let mut should_inline =
                                !u.flags.contains(VarUsageInfoFlags::REASSIGNED)
                                    && u.flags.contains(VarUsageInfoFlags::DECLARED);

                            should_inline &=
                                // Function declarations are hoisted
                                //
                                // As we copy expressions, this can cause a problem.
                                // See https://github.com/swc-project/swc/issues/6463
                                //
                                // We check callee_count of `usage` because we copy simple functions
                                !u.flags.contains(VarUsageInfoFlags::USED_ABOVE_DECL)
                                    || !u.flags.contains(VarUsageInfoFlags::DECLARED_AS_FN_DECL)
                                    || usage.callee_count == 0;

                            if u.flags.contains(VarUsageInfoFlags::DECLARED_AS_FOR_INIT)
                                && !usage.flags.contains(VarUsageInfoFlags::IS_FN_LOCAL)
                            {
                                should_inline &= !matches!(
                                    u.var_kind,
                                    Some(VarDeclKind::Let | VarDeclKind::Const)
                                )
                            }

                            if u.flags.intersects(
                                VarUsageInfoFlags::DECLARED_AS_FN_DECL
                                    .union(VarUsageInfoFlags::DECLARED_AS_FN_EXPR),
                            ) {
                                if self.options.keep_fnames
                                    || self.mangle_options.is_some_and(|v| v.keep_fn_names)
                                {
                                    should_inline = false
                                }
                            }

                            if u.flags.contains(VarUsageInfoFlags::DECLARED_AS_FN_EXPR) {
                                if self.options.inline != 3 {
                                    return;
                                }
                            }

                            should_inline
                        } else {
                            false
                        }
                    }

                    Expr::Lit(lit) => match lit {
                        Lit::Str(s) => {
                            // If the string literal is declared without initializer and assigned
                            // once, we can inline it.
                            if (ref_count == 1
                                || (ref_count == 2
                                    && usage.assign_count == 1
                                    && usage.flags.intersects(VarUsageInfoFlags::LAZY_INIT)))
                                || s.value.len() <= 3
                            {
                                true
                            } else {
                                self.vars
                                    .lits_for_cmp
                                    .insert(ident.to_id(), init.clone().into());
                                false
                            }
                        }
                        Lit::Bool(_) | Lit::Null(_) | Lit::Num(_) | Lit::BigInt(_) => true,
                        Lit::Regex(_) => self.options.unsafe_regexp,
                        _ => false,
                    },
                    Expr::Unary(UnaryExpr {
                        op: op!("!"), arg, ..
                    }) => arg.is_lit(),
                    Expr::This(..) => usage.flags.contains(VarUsageInfoFlags::IS_FN_LOCAL),
                    Expr::Arrow(arr) => {
                        !(usage.property_mutation_count > 0
                            || usage
                                .flags
                                .contains(VarUsageInfoFlags::EXECUTED_MULTIPLE_TIME)
                            || usage.flags.contains(VarUsageInfoFlags::USED_AS_ARG)
                                && ref_count > 1
                            || ref_count > usage.callee_count
                            || !is_arrow_simple_enough_for_copy(arr).is_some_and(|cost| cost <= 8))
                    }
                    _ => false,
                }
            {
                if !inlined_into_init {
                    inlined_into_init = true;
                    self.vars.inline_with_multi_replacer(init);
                }

                self.mode.store(id.clone(), &*init);

                let VarUsageInfo {
                    usage_count,
                    property_mutation_count,
                    flags,
                    ..
                } = **usage;
                let mut inc_usage = || {
                    for (i, _) in collect_infects_from(
                        &*init,
                        AliasConfig::default()
                            .marks(Some(self.marks))
                            .need_all(true),
                    ) {
                        if let Some(u) = self.data.vars.get_mut(&i) {
                            u.flags |= flags & VarUsageInfoFlags::USED_AS_ARG;
                            u.flags |= flags & VarUsageInfoFlags::USED_AS_REF;
                            u.flags |= flags & VarUsageInfoFlags::INDEXED_WITH_DYNAMIC_KEY;
                            u.flags |= flags & VarUsageInfoFlags::HAS_PROPERTY_ACCESS;
                            u.flags |= flags & VarUsageInfoFlags::USED_ABOVE_DECL;
                            u.flags |= flags & VarUsageInfoFlags::EXECUTED_MULTIPLE_TIME;
                            u.flags |= flags & VarUsageInfoFlags::USED_IN_COND;
                            u.flags |= flags & VarUsageInfoFlags::USED_RECURSIVELY;

                            if !flags.contains(VarUsageInfoFlags::NO_SIDE_EFFECT_FOR_MEMBER_ACCESS)
                            {
                                u.flags
                                    .remove(VarUsageInfoFlags::NO_SIDE_EFFECT_FOR_MEMBER_ACCESS)
                            }

                            u.ref_count += ref_count;
                            u.usage_count += usage_count;
                            u.property_mutation_count += property_mutation_count;
                        }
                    }
                };

                if self.options.inline != 0
                    && may_remove
                    && match init {
                        Expr::Arrow(..) => self.options.unused,
                        _ => true,
                    }
                {
                    self.changed = true;

                    report_change!(
                        "inline: Decided to inline '{}{:?}' because it's simple",
                        ident.sym,
                        ident.ctxt
                    );

                    inc_usage();

                    self.vars.lits.insert(id.clone(), init.take().into());

                    ident.take();
                } else if self.options.inline != 0 || self.options.reduce_vars {
                    report_change!(
                        "inline: Decided to inline '{}{:?}' because it's simple",
                        ident.sym,
                        ident.ctxt
                    );

                    self.mode.store(id.clone(), &*init);

                    inc_usage();

                    self.vars.lits.insert(id.clone(), init.clone().into());
                }
            }

            let usage = self.data.vars.get(&id).unwrap();

            // Single use => inlined
            if !self.ctx.bit_ctx.contains(BitCtx::IsExported)
                && is_inline_enabled
                && usage.flags.contains(VarUsageInfoFlags::DECLARED)
                && may_remove
                && !usage.flags.contains(VarUsageInfoFlags::REASSIGNED)
                && !usage
                    .flags
                    .contains(VarUsageInfoFlags::DECLARED_AS_FOR_INIT)
                && usage.assign_count == 1
                && ref_count == 1
            {
                match init {
                    Expr::Fn(FnExpr { function: f, .. })
                        if matches!(
                            &**f,
                            Function { is_async: true, .. }
                                | Function {
                                    is_generator: true,
                                    ..
                                }
                        ) =>
                    {
                        return
                    }
                    Expr::Arrow(ArrowExpr { is_async: true, .. })
                    | Expr::Arrow(ArrowExpr {
                        is_generator: true, ..
                    }) => return,

                    Expr::Lit(Lit::Regex(..)) => {
                        if !usage.flags.contains(VarUsageInfoFlags::IS_FN_LOCAL)
                            || usage
                                .flags
                                .contains(VarUsageInfoFlags::EXECUTED_MULTIPLE_TIME)
                        {
                            return;
                        }
                    }

                    Expr::This(..) => {
                        // Don't inline this if it passes function boundaries.
                        if !usage.flags.contains(VarUsageInfoFlags::IS_FN_LOCAL) {
                            return;
                        }
                    }

                    Expr::Lit(..) => {}

                    Expr::Fn(_) | Expr::Arrow(..) if !usage.can_inline_fn_once() => {
                        return;
                    }

                    Expr::Fn(f) => {
                        let excluded: Vec<Id> = find_pat_ids(&f.function.params);

                        for id in idents_used_by(&f.function.params) {
                            if excluded.contains(&id) {
                                continue;
                            }
                            if let Some(v_usage) = self.data.vars.get(&id) {
                                if v_usage.flags.contains(VarUsageInfoFlags::REASSIGNED) {
                                    return;
                                }
                            } else {
                                return;
                            }
                        }
                    }

                    Expr::Arrow(f) => {
                        let excluded: Vec<Id> = find_pat_ids(&f.params);

                        for id in idents_used_by(&f.params) {
                            if excluded.contains(&id) {
                                continue;
                            }
                            if let Some(v_usage) = self.data.vars.get(&id) {
                                if v_usage.flags.contains(VarUsageInfoFlags::REASSIGNED) {
                                    return;
                                }
                            } else {
                                return;
                            }
                        }
                    }

                    Expr::Object(..) if self.options.pristine_globals => {
                        for id in idents_used_by_ignoring_nested(init) {
                            if let Some(v_usage) = self.data.vars.get(&id) {
                                if v_usage.flags.contains(VarUsageInfoFlags::REASSIGNED) {
                                    return;
                                }
                            }
                        }
                    }

                    Expr::Ident(id) if !id.eq_ignore_span(ident) => {
                        if !usage.flags.contains(VarUsageInfoFlags::ASSIGNED_FN_LOCAL) {
                            return;
                        }

                        if let Some(init_usage) = self.data.vars.get(&id.to_id()) {
                            if init_usage.flags.contains(VarUsageInfoFlags::REASSIGNED)
                                || !init_usage.flags.contains(VarUsageInfoFlags::DECLARED)
                            {
                                return;
                            }

                            if init_usage
                                .flags
                                .contains(VarUsageInfoFlags::DECLARED_AS_FN_DECL)
                                || init_usage
                                    .flags
                                    .contains(VarUsageInfoFlags::DECLARED_AS_FN_EXPR)
                            {
                                if self.options.keep_fnames
                                    || self.mangle_options.is_some_and(|v| v.keep_fn_names)
                                {
                                    return;
                                }
                            }
                            if init_usage
                                .flags
                                .contains(VarUsageInfoFlags::DECLARED_AS_FN_EXPR)
                            {
                                if self.options.inline != 3 {
                                    return;
                                }
                            }
                        }
                    }

                    _ => {
                        for id in idents_used_by(init) {
                            if let Some(v_usage) = self.data.vars.get(&id) {
                                if v_usage.property_mutation_count > usage.property_mutation_count
                                    || v_usage.flags.intersects(
                                        VarUsageInfoFlags::HAS_PROPERTY_ACCESS
                                            .union(VarUsageInfoFlags::REASSIGNED),
                                    )
                                {
                                    return;
                                }
                            }
                        }
                    }
                }

                if usage.flags.contains(VarUsageInfoFlags::USED_AS_ARG)
                    && !usage.flags.contains(VarUsageInfoFlags::IS_FN_LOCAL)
                {
                    if let Expr::Fn(..) | Expr::Arrow(..) = init {
                        return;
                    }
                }

                if usage
                    .flags
                    .contains(VarUsageInfoFlags::EXECUTED_MULTIPLE_TIME)
                {
                    match init {
                        Expr::Lit(..) => {}
                        Expr::Fn(f) => {
                            // Similar to `_loop` generation of the
                            // block_scoping pass.
                            // If the function captures the environment, we
                            // can't inline it.
                            let params: Vec<Id> = find_pat_ids(&f.function.params);

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

                if init.may_have_side_effects(self.ctx.expr_ctx) {
                    return;
                }

                if !inlined_into_init {
                    self.vars.inline_with_multi_replacer(init);
                }

                report_change!(
                    "inline: Decided to inline var '{}' because it's used only once",
                    ident
                );
                self.changed = true;

                self.vars
                    .vars_for_inlining
                    .insert(ident.take().to_id(), init.take().into());
            }
        }
    }

    /// Check if the body of a function is simple enough to inline.
    fn is_fn_body_simple_enough_to_inline(
        &self,
        body: &BlockStmt,
        param_count: usize,
        usage: &VarUsageInfo,
    ) -> bool {
        let param_cost = param_count * 2;
        // if it's passed as value but not called, the function expr cannot be removed
        let func_body_cost = if usage.ref_count == usage.callee_count {
            // length of "function c(){}"
            14 / usage.usage_count
        } else {
            0
        } as usize;
        let cost_limit = 3 + param_cost + func_body_cost;

        if body.stmts.len() == 1 {
            match &body.stmts[0] {
                Stmt::Expr(ExprStmt { expr, .. })
                    if expr.size(self.ctx.expr_ctx.unresolved_ctxt) < cost_limit =>
                {
                    return true
                }

                Stmt::Return(ReturnStmt { arg: Some(arg), .. })
                    if arg.size(self.ctx.expr_ctx.unresolved_ctxt) < cost_limit =>
                {
                    return true
                }

                Stmt::Return(ReturnStmt { arg: None, .. }) => {
                    // size of void 0
                    return 6 < cost_limit;
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
            if !usage.flags.contains(VarUsageInfoFlags::REASSIGNED) {
                trace_op!("typeofs: Storing typeof `{}{:?}`", i.sym, i.ctxt);
                match &*decl {
                    Decl::Fn(..) | Decl::Class(..) => {
                        self.typeofs.insert(i.to_id(), atom!("function"));
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
            Decl::Class(v) => &v.ident,
            Decl::Fn(f) => {
                if f.function.is_async {
                    return;
                }
                &f.ident
            }
            _ => return,
        };

        trace_op!("inline: Trying to inline decl ({}{:?})", i.sym, i.ctxt);

        if self.options.inline == 0 && !self.options.reduce_vars {
            log_abort!("inline: [x] Inline disabled");
            return;
        }

        if !self.may_remove_ident(i) {
            log_abort!("inline: [x] Top level");
            return;
        }

        if let Some(f) = decl.as_fn_decl() {
            if self.has_noinline(f.function.ctxt) {
                log_abort!("inline: [x] Has noinline");
                return;
            }
        }

        if self.ctx.bit_ctx.contains(BitCtx::IsExported) {
            log_abort!("inline: [x] exported");
            return;
        }

        if self
            .data
            .top
            .intersects(ScopeData::HAS_EVAL_CALL.union(ScopeData::HAS_WITH_STMT))
        {
            return;
        }

        let id = i.to_id();

        if let Some(usage) = self.data.vars.get(&id) {
            if usage
                .flags
                .contains(VarUsageInfoFlags::DECLARED_AS_CATCH_PARAM)
            {
                log_abort!("inline: Declared as a catch parameter");
                return;
            }

            if usage.flags.contains(VarUsageInfoFlags::USED_AS_ARG) && usage.ref_count > 1 {
                log_abort!("inline: Used as an arugment");
                return;
            }

            if usage.flags.intersects(
                VarUsageInfoFlags::REASSIGNED.union(VarUsageInfoFlags::INLINE_PREVENTED),
            ) {
                log_abort!(
                    "inline: [x] reassigned = {}, inline_prevented = {}",
                    usage.flags.contains(VarUsageInfoFlags::REASSIGNED),
                    usage.flags.contains(VarUsageInfoFlags::INLINE_PREVENTED)
                );
                return;
            }

            // Inline very simple functions.
            self.vars.inline_with_multi_replacer(decl);
            match decl {
                Decl::Fn(f) if self.options.inline >= 2 && f.ident.sym != *"arguments" => {
                    if let Some(body) = &f.function.body {
                        if !usage.flags.contains(VarUsageInfoFlags::USED_RECURSIVELY)
                            // only callees can be inlined multiple times
                            && usage.callee_count > 0
                            // prefer single inline
                            && usage.ref_count > 1
                            && self.is_fn_body_simple_enough_to_inline(
                                body,
                                f.function.params.len(),
                                usage,
                            )
                        {
                            if f.function
                                .params
                                .iter()
                                .any(|param| matches!(param.pat, Pat::Rest(..) | Pat::Assign(..)))
                            {
                                return;
                            }
                            report_change!(
                                "inline: Decided to inline function `{}{:?}` as it's very simple",
                                id.0,
                                id.1
                            );

                            for i in collect_infects_from(
                                &f.function,
                                AliasConfig::default()
                                    .marks(Some(self.marks))
                                    .need_all(true),
                            ) {
                                if let Some(usage) = self.data.vars.get_mut(&i.0) {
                                    usage.ref_count += 1;
                                }
                            }

                            self.vars.simple_functions.insert(
                                id,
                                FnExpr {
                                    ident: None,
                                    function: f.function.clone(),
                                }
                                .into(),
                            );

                            return;
                        }
                    }
                }
                _ => {}
            }

            // Single use => inlined

            // TODO(kdy1):
            //
            // (usage.flags.contains(VarUsageInfoFlags::IS_FN_LOCAL) || self.options.inline
            // == 3)
            //
            // seems like a correct check, but it's way to aggressive.
            // It does not break the code, but everything like _asyncToGenerator is inlined.
            //
            if (self.options.reduce_vars || self.options.collapse_vars || self.options.inline != 0)
                && usage.ref_count == 1
                && usage.can_inline_fn_once()
                && (match decl {
                    Decl::Class(..) => !usage.flags.contains(VarUsageInfoFlags::USED_ABOVE_DECL),
                    Decl::Fn(..) => true,
                    _ => false,
                })
            {
                if let Decl::Class(ClassDecl { class, .. }) = decl {
                    if class_has_side_effect(self.ctx.expr_ctx, class) {
                        return;
                    }
                }

                match &decl {
                    Decl::Class(_c) => {
                        if self.options.inline != 3
                            || self.options.keep_classnames
                            || self.mangle_options.is_some_and(|v| v.keep_class_names)
                        {
                            log_abort!("inline: [x] Keep class names");
                            return;
                        }

                        self.changed = true;
                        report_change!(
                            "inline: Decided to inline class `{}{:?}` as it's used only once",
                            _c.ident.sym,
                            _c.ident.ctxt
                        );
                    }
                    Decl::Fn(_f) => {
                        if self.options.keep_fnames
                            || self.mangle_options.is_some_and(|v| v.keep_fn_names)
                        {
                            log_abort!("inline: [x] Keep fn names");
                            return;
                        }

                        self.changed = true;
                        report_change!(
                            "inline: Decided to inline function `{}{:?}` as it's used only once",
                            _f.ident.sym,
                            _f.ident.ctxt
                        );
                    }
                    _ => {}
                }

                let e = match decl.take() {
                    Decl::Class(c) => ClassExpr {
                        ident: Some(c.ident),
                        class: c.class,
                    }
                    .into(),
                    Decl::Fn(f) => FnExpr {
                        ident: if usage.flags.contains(VarUsageInfoFlags::USED_RECURSIVELY) {
                            Some(f.ident)
                        } else {
                            None
                        },
                        function: f.function,
                    }
                    .into(),
                    _ => {
                        unreachable!()
                    }
                };

                self.vars.vars_for_inlining.insert(id, e);
            } else {
                log_abort!("inline: [x] Usage: {:?}", usage);
            }
        }
    }

    /// Actually inlines variables.
    pub(super) fn inline(&mut self, e: &mut Expr) {
        if self.ctx.bit_ctx.contains(BitCtx::IsExactLhsOfAssign) {
            return;
        }

        match e {
            Expr::Member(me) => {
                if let MemberProp::Computed(prop) = &mut me.prop {
                    if let Expr::Lit(Lit::Num(..)) = &*prop.expr {
                        if let Expr::Ident(obj) = &*me.obj {
                            let new = self.vars.lits_for_array_access.get(&obj.to_id());

                            if let Some(new) = new {
                                report_change!("inline: Inlined array access");
                                self.changed = true;

                                me.obj.clone_from(new);
                            }
                        }
                    }
                }
            }
            Expr::Ident(i) => {
                let id = i.to_id();
                if let Some(value) = self.vars.lits.get(&id).or_else(|| {
                    if self.ctx.bit_ctx.contains(BitCtx::IsCallee) {
                        self.vars.simple_functions.get(&id)
                    } else {
                        None
                    }
                }) {
                    if !matches!(**value, Expr::Ident(..) | Expr::Member(..))
                        && self.ctx.bit_ctx.contains(BitCtx::IsUpdateArg)
                    {
                        return;
                    }

                    // currently renamer relies on the fact no distinct var has same ctxt, we need
                    // to remap all new bindings.
                    let bindings: FxHashSet<Id> = collect_decls(value);
                    let new_mark = Mark::new();
                    let mut cache = FxHashMap::default();
                    let mut remap = FxHashMap::default();

                    for id in bindings {
                        let new_ctxt = cache
                            .entry(id.1)
                            .or_insert_with(|| id.1.apply_mark(new_mark));

                        let new_ctxt = *new_ctxt;

                        if let Some(usage) = self.data.vars.get(&id).cloned() {
                            let new_id = (id.0.clone(), new_ctxt);
                            self.data.vars.insert(new_id, usage);
                        }

                        remap.insert(id, new_ctxt);
                    }

                    let mut value = value.clone();
                    if !remap.is_empty() {
                        let mut remapper = Remapper::new(&remap);
                        value.visit_mut_with(&mut remapper);
                    }

                    self.changed = true;
                    report_change!("inline: Replacing a variable `{}` with cheap expression", i);

                    *e = *value;
                    return;
                }

                // Check without cloning
                if let Some(value) = self.vars.vars_for_inlining.get(&id) {
                    if self.ctx.bit_ctx.contains(BitCtx::IsExactLhsOfAssign)
                        && !is_valid_for_lhs(value)
                    {
                        return;
                    }

                    if let Expr::Member(..) = &**value {
                        if self.ctx.bit_ctx.contains(BitCtx::ExecutedMultipleTime) {
                            return;
                        }
                    }
                }

                if let Some(value) = self.vars.vars_for_inlining.remove(&id) {
                    self.changed = true;
                    report_change!("inline: Replacing '{}' with an expression", i);

                    *e = *value;

                    log_abort!("inline: [Change] {}", crate::debug::dump(&*e, false))
                }
            }
            _ => (),
        }
    }
}

fn is_arrow_simple_enough_for_copy(e: &ArrowExpr) -> Option<u8> {
    if e.is_async {
        return None;
    }

    match &*e.body {
        BlockStmtOrExpr::BlockStmt(s) => is_block_stmt_of_fn_simple_enough_for_copy(s),
        BlockStmtOrExpr::Expr(e) => is_arrow_body_simple_enough_for_copy(e),
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

fn is_arrow_body_simple_enough_for_copy(e: &Expr) -> Option<u8> {
    match e {
        Expr::Ident(..) | Expr::Lit(..) => return Some(1),
        Expr::Member(MemberExpr { obj, prop, .. }) if !prop.is_computed() => {
            return Some(is_arrow_body_simple_enough_for_copy(obj)? + 2)
        }
        Expr::Call(c) => {
            let mut cost = is_arrow_body_simple_enough_for_copy(c.callee.as_expr()?.deref())?;
            for arg in &c.args {
                let arg_cost = is_arrow_body_simple_enough_for_copy(&arg.expr)?;
                cost += arg_cost;
                cost += if arg.spread.is_some() { 3 } else { 0 };
            }

            return Some(cost + 2);
        }
        Expr::Unary(u) => return Some(is_arrow_body_simple_enough_for_copy(&u.arg)? + 1),

        Expr::Bin(b) => {
            return Some(
                is_arrow_body_simple_enough_for_copy(&b.left)?
                    + is_arrow_body_simple_enough_for_copy(&b.right)?
                    + 2,
            )
        }
        _ => {}
    }

    None
}

fn is_block_stmt_of_fn_simple_enough_for_copy(b: &BlockStmt) -> Option<u8> {
    if b.stmts.len() == 1 {
        if let Stmt::Return(ret) = &b.stmts[0] {
            return ret
                .arg
                .as_deref()
                .map_or(Some(0), is_arrow_body_simple_enough_for_copy);
        }
    }

    None
}
