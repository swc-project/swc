use rustc_hash::FxHashMap;
use swc_common::{collections::AHashSet, util::take::Take, EqIgnoreSpan, Mark};
use swc_ecma_ast::*;
use swc_ecma_transforms_optimization::simplify::expr_simplifier;
use swc_ecma_usage_analyzer::alias::{collect_infects_from, AliasConfig};
use swc_ecma_utils::{class_has_side_effect, collect_decls, find_pat_ids, ExprExt, Remapper};
use swc_ecma_visit::VisitMutWith;

use super::Optimizer;
use crate::{
    compress::optimize::util::is_valid_for_lhs,
    program_data::VarUsageInfo,
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
        let may_remove = self.may_remove_ident(ident);

        trace_op!(
            "inline: store_var_for_inlining({}, may_remove = {:?})",
            crate::debug::dump(ident, false),
            may_remove
        );

        if self.data.top.has_eval_call {
            return;
        }

        // We will inline if possible.
        if ident.sym == "arguments" {
            return;
        }

        if let Some(usage) = self.data.vars.get(&ident.to_id()) {
            let ref_count = usage.ref_count - u32::from(can_drop && usage.ref_count > 1);
            if !usage.var_initialized {
                return;
            }

            if self.data.top.used_arguments && usage.declared_as_fn_param {
                return;
            }
            if usage.declared_as_catch_param {
                return;
            }
            if usage.inline_prevented {
                return;
            }

            if !may_remove && usage.var_kind != Some(VarDeclKind::Const) {
                log_abort!(
                    "inline: [x] Preserving non-const variable `{}` because it's top-level",
                    crate::debug::dump(ident, false)
                );
                return;
            }

            if usage.used_above_decl {
                log_abort!("inline: [x] It's cond init or used before decl",);
                return;
            }

            // No use => dropped
            if ref_count == 0 {
                self.mode.store(ident.to_id(), &*init);

                if init.may_have_side_effects(&self.ctx.expr_ctx) {
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
            if usage.declared
                && !usage.mutated()
                && usage.accessed_props.is_empty()
                && !usage.is_infected()
                && is_inline_enabled
                && !usage.used_as_ref
            {
                if let Expr::Array(arr) = init {
                    self.vars.inline_with_multi_replacer(arr);
                    inlined_into_init = true;

                    if arr.elems.len() < 32
                        && arr.elems.iter().all(|e| match e {
                            Some(ExprOrSpread { spread: None, expr }) => match &**expr {
                                Expr::Lit(..) => true,
                                _ => false,
                            },
                            _ => false,
                        })
                    {
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

            if !usage.is_fn_local {
                match init {
                    Expr::Lit(..) | Expr::Ident(..) => {}

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

            if !usage.reassigned {
                match init {
                    Expr::Fn(..) | Expr::Arrow(..) | Expr::Class(..) => {
                        self.typeofs.insert(ident.to_id(), "function".into());
                    }
                    Expr::Array(..) | Expr::Object(..) => {
                        self.typeofs.insert(ident.to_id(), "object".into());
                    }
                    _ => {}
                }
            }

            if !usage.mutated() {
                self.mode.store(ident.to_id(), &*init);
            }

            if usage.used_recursively {
                return;
            }

            // Caution: for most case mutation of properties are ok, however if
            // new variant is added for multi inline, think carefully
            if is_inline_enabled
                && usage.declared_count == 1
                && usage.assign_count == 1
                && !usage.reassigned
                && (usage.property_mutation_count == 0 || !usage.reassigned)
                && match init {
                    Expr::Ident(Ident { sym, .. }) if &**sym == "eval" => false,

                    Expr::Ident(id) if !id.eq_ignore_span(ident) => {
                        if !usage.assigned_fn_local {
                            false
                        } else if let Some(u) = self.data.vars.get(&id.to_id()) {
                            let mut should_inline = !u.reassigned && u.declared;

                            should_inline &=
                                // Function declarations are hoisted
                                //
                                // As we copy expressions, this can cause a problem.
                                // See https://github.com/swc-project/swc/issues/6463
                                //
                                // We check callee_count of `usage` because we copy simple functions
                                !u.used_above_decl
                                    || !u.declared_as_fn_decl
                                    || usage.callee_count == 0;

                            if u.declared_as_for_init && !usage.is_fn_local {
                                should_inline &= !matches!(
                                    u.var_kind,
                                    Some(VarDeclKind::Let | VarDeclKind::Const)
                                )
                            }

                            if u.declared_as_fn_decl || u.declared_as_fn_expr {
                                if self.options.keep_fnames
                                    || self.mangle_options.map_or(false, |v| v.keep_fn_names)
                                {
                                    should_inline = false
                                }
                            }

                            if u.declared_as_fn_expr {
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
                            if ref_count == 1 || s.value.len() <= 3 {
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
                    Expr::This(..) => usage.is_fn_local,
                    Expr::Arrow(arr) => {
                        is_arrow_simple_enough_for_copy(arr)
                            && !(usage.property_mutation_count > 0
                                || usage.executed_multiple_time
                                || usage.used_as_arg && ref_count > 1)
                            && ref_count - 1 <= usage.callee_count
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
                    used_as_arg,
                    used_as_ref,
                    indexed_with_dynamic_key,
                    usage_count,
                    has_property_access,
                    property_mutation_count,
                    used_above_decl,
                    executed_multiple_time,
                    used_in_cond,
                    used_recursively,
                    no_side_effect_for_member_access,
                    ..
                } = **usage;
                let mut inc_usage = || {
                    if let Expr::Ident(i) = &*init {
                        if let Some(u) = self.data.vars.get_mut(&i.to_id()) {
                            u.used_as_arg |= used_as_arg;
                            u.used_as_ref |= used_as_ref;
                            u.indexed_with_dynamic_key |= indexed_with_dynamic_key;
                            u.has_property_access |= has_property_access;
                            u.property_mutation_count += property_mutation_count;
                            u.used_above_decl |= used_above_decl;
                            u.executed_multiple_time |= executed_multiple_time;
                            u.used_in_cond |= used_in_cond;
                            u.used_recursively |= used_recursively;

                            u.no_side_effect_for_member_access &= no_side_effect_for_member_access;

                            u.ref_count += ref_count;
                            u.usage_count += usage_count;
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
                    trace_op!(
                        "inline: Decided to copy '{}{:?}' because it's simple",
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
            if !self.ctx.is_exported
                && is_inline_enabled
                && usage.declared
                && may_remove
                && !usage.reassigned
                && !usage.declared_as_for_init
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

                    Expr::Lit(..) => {}

                    Expr::Fn(_) if !usage.can_inline_fn_once() => {
                        return;
                    }

                    Expr::Fn(f) => {
                        let excluded: Vec<Id> = find_pat_ids(&f.function.params);

                        for id in idents_used_by(&f.function.params) {
                            if excluded.contains(&id) {
                                continue;
                            }
                            if let Some(v_usage) = self.data.vars.get(&id) {
                                if v_usage.reassigned {
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
                                if v_usage.reassigned {
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
                                if v_usage.reassigned {
                                    return;
                                }
                            }
                        }
                    }

                    Expr::Ident(id) if !id.eq_ignore_span(ident) => {
                        if !usage.assigned_fn_local {
                            return;
                        }

                        if let Some(init_usage) = self.data.vars.get(&id.to_id()) {
                            if init_usage.reassigned || !init_usage.declared {
                                return;
                            }

                            if init_usage.declared_as_fn_decl || init_usage.declared_as_fn_expr {
                                if self.options.keep_fnames
                                    || self.mangle_options.map_or(false, |v| v.keep_fn_names)
                                {
                                    return;
                                }
                            }
                            if init_usage.declared_as_fn_expr {
                                if self.options.inline != 3 {
                                    return;
                                }
                            }
                        }
                    }

                    _ => {
                        for id in idents_used_by(init) {
                            if let Some(v_usage) = self.data.vars.get(&id) {
                                if v_usage.reassigned
                                    || v_usage.property_mutation_count
                                        > usage.property_mutation_count
                                    || v_usage.has_property_access
                                {
                                    return;
                                }
                            }
                        }
                    }
                }

                if usage.used_as_arg && !usage.is_fn_local {
                    if let Expr::Fn(..) | Expr::Arrow(..) = init {
                        return;
                    }
                }

                if usage.executed_multiple_time {
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

                if init.may_have_side_effects(&self.ctx.expr_ctx) {
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
            if !usage.reassigned {
                trace_op!("typeofs: Storing typeof `{}{:?}`", i.sym, i.ctxt);
                match &*decl {
                    Decl::Fn(..) | Decl::Class(..) => {
                        self.typeofs.insert(i.to_id(), "function".into());
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

        trace_op!("inline: Trying to inline decl ({}{:?})", i.sym, i.ctxt);

        if self.options.inline == 0 && !self.options.reduce_vars {
            log_abort!("inline: [x] Inline disabled");
            return;
        }

        if !self.may_remove_ident(&i) {
            log_abort!("inline: [x] Top level");
            return;
        }

        if let Decl::Fn(f) = decl {
            if self.has_noinline(f.function.ctxt) {
                log_abort!("inline: [x] Has noinline");
                return;
            }
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
                log_abort!("inline: Declared as a catch parameter");
                return;
            }

            if usage.used_as_arg && usage.ref_count > 1 {
                log_abort!("inline: Used as an arugment");
                return;
            }

            if usage.reassigned || usage.inline_prevented {
                log_abort!(
                    "inline: [x] reassigned = {}, inline_prevented = {}",
                    usage.reassigned,
                    usage.inline_prevented
                );
                return;
            }

            // Inline very simple functions.
            match decl {
                Decl::Fn(f) if self.options.inline >= 2 && f.ident.sym != *"arguments" => {
                    self.vars.inline_with_multi_replacer(&mut f.function.body);

                    if let Some(body) = &f.function.body {
                        if !usage.used_recursively
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
                            trace_op!(
                                "inline: Decided to inline function '{}{:?}' as it's very simple",
                                f.ident.sym,
                                f.ident.ctxt
                            );

                            for i in collect_infects_from(
                                &f.function,
                                AliasConfig {
                                    marks: Some(self.marks),
                                    ignore_nested: false,
                                    need_all: true,
                                },
                            ) {
                                if let Some(usage) = self.data.vars.get_mut(&i.0) {
                                    usage.ref_count += 1;
                                }
                            }

                            self.vars.simple_functions.insert(
                                i.to_id(),
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
            // (usage.is_fn_local || self.options.inline == 3)
            //
            // seems like a correct check, but it's way to aggressive.
            // It does not break the code, but everything like _asyncToGenerator is inlined.
            //
            if (self.options.reduce_vars || self.options.collapse_vars || self.options.inline != 0)
                && usage.ref_count == 1
                && usage.can_inline_fn_once()
                && (match decl {
                    Decl::Class(..) => !usage.used_above_decl,
                    Decl::Fn(..) => true,
                    _ => false,
                })
            {
                if let Decl::Class(ClassDecl { class, .. }) = decl {
                    if class_has_side_effect(&self.ctx.expr_ctx, class) {
                        return;
                    }
                }

                #[allow(unused)]
                match &decl {
                    Decl::Class(c) => {
                        if self.options.inline != 3
                            || self.options.keep_classnames
                            || self.mangle_options.map_or(false, |v| v.keep_class_names)
                        {
                            log_abort!("inline: [x] Keep class names");
                            return;
                        }

                        self.changed = true;
                        report_change!(
                            "inline: Decided to inline class `{}{:?}` as it's used only once",
                            c.ident.sym,
                            c.ident.ctxt
                        );
                    }
                    Decl::Fn(f) => {
                        if self.options.keep_fnames
                            || self.mangle_options.map_or(false, |v| v.keep_fn_names)
                        {
                            log_abort!("inline: [x] Keep fn names");
                            return;
                        }

                        self.changed = true;
                        report_change!(
                            "inline: Decided to inline function `{}{:?}` as it's used only once",
                            f.ident.sym,
                            f.ident.ctxt
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
                        ident: if usage.used_recursively {
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

                self.vars.vars_for_inlining.insert(i.to_id(), e);
            } else {
                log_abort!("inline: [x] Usage: {:?}", usage);
            }
        }
    }

    /// Actually inlines variables.
    pub(super) fn inline(&mut self, e: &mut Expr) {
        if self.ctx.is_exact_lhs_of_assign {
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
                                // TODO(kdy1): Optimize performance by skipping visiting of children
                                // nodes.
                                e.visit_mut_with(&mut expr_simplifier(
                                    self.marks.unresolved_mark,
                                    Default::default(),
                                ));
                            }
                        }
                    }
                }
            }
            Expr::Ident(i) => {
                let id = i.to_id();
                if let Some(mut value) = self
                    .vars
                    .lits
                    .get(&id)
                    .or_else(|| {
                        if self.ctx.is_callee {
                            self.vars.simple_functions.get(&i.to_id())
                        } else {
                            None
                        }
                    })
                    .cloned()
                {
                    if !matches!(&*value, Expr::Ident(..) | Expr::Member(..))
                        && self.ctx.is_update_arg
                    {
                        return;
                    }

                    // currently renamer relies on the fact no distinct var has same ctxt, we need
                    // to remap all new bindings.
                    let bindings: AHashSet<Id> = collect_decls(&*value);
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

                    log_abort!("inline: [Change] {}", crate::debug::dump(&*e, false))
                }
            }
            _ => (),
        }
    }
}

fn is_arrow_simple_enough_for_copy(e: &ArrowExpr) -> bool {
    if e.is_async {
        return false;
    }

    match &*e.body {
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
