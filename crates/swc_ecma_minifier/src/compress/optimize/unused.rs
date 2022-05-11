use swc_atoms::js_word;
use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::contains_ident_ref;

use super::Optimizer;
use crate::{
    compress::{optimize::util::class_has_side_effect, util::is_global_var},
    debug::dump,
    mode::Mode,
    option::PureGetterOption,
};

#[derive(Debug, Default, Clone, Copy)]
pub(crate) struct PropertyAccessOpts {
    pub allow_getter: bool,

    pub only_ident: bool,
}

/// Methods related to the option `unused`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_var_declarator(
        &mut self,
        var: &mut VarDeclarator,
        storage_for_side_effects: &mut Option<Box<Expr>>,
    ) {
        if var.name.is_invalid() {
            return;
        }

        if !self.options.top_level()
            && (self.ctx.is_top_level_for_block_level_vars() || self.ctx.in_top_level())
            && !var.span.has_mark(self.marks.non_top_level)
        {
            match self.ctx.var_kind {
                Some(VarDeclKind::Const) | Some(VarDeclKind::Let) => {
                    if self.ctx.is_top_level_for_block_level_vars() {
                        log_abort!("unused: Top-level (block level)");
                        return;
                    }
                }
                _ => {
                    if self.ctx.in_top_level() {
                        log_abort!("unused: Top-level");
                        return;
                    }
                }
            }
        }

        let had_init = var.init.is_some();

        match &mut var.init {
            Some(init) => match &**init {
                Expr::Invalid(..) => {
                    self.drop_unused_vars(var.span, &mut var.name, None);
                }
                // I don't know why, but terser preserves this
                Expr::Fn(FnExpr {
                    function: Function { is_async: true, .. },
                    ..
                }) => {}
                _ => {
                    self.drop_unused_vars(var.span, &mut var.name, Some(init));

                    if var.name.is_invalid() {
                        report_change!("unused: Removing an unused variable declarator");
                        let side_effects = self.ignore_return_value(init).map(Box::new);
                        if let Some(e) = side_effects {
                            *storage_for_side_effects = Some(e);
                        }
                    }
                }
            },
            None => {
                self.drop_unused_vars(var.span, &mut var.name, var.init.as_deref_mut());
            }
        }

        if var.name.is_invalid() {
            return;
        }

        if cfg!(debug_assertions) {
            if let Some(VarDeclKind::Const | VarDeclKind::Let) = self.ctx.var_kind {
                if had_init && var.init.is_none() {
                    unreachable!("const/let variable without initializer: {:#?}", var);
                }
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_param(&mut self, pat: &mut Pat, ignore_fn_length: bool) {
        if !self.options.unused && !self.options.reduce_fns {
            return;
        }

        if let Some(scope) = self.data.scopes.get(&self.ctx.scope) {
            if scope.has_eval_call || scope.has_with_stmt {
                return;
            }
        }

        if !ignore_fn_length {
            // Preserve `length` of function.
            if pat.is_ident() {
                return;
            }
        }

        self.take_pat_if_unused(DUMMY_SP, pat, None, false)
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_vars(
        &mut self,
        var_declarator_span: Span,
        name: &mut Pat,
        init: Option<&mut Expr>,
    ) {
        if self.ctx.is_exported || self.ctx.in_asm {
            return;
        }

        let has_mark = var_declarator_span.has_mark(self.marks.non_top_level);

        if !has_mark {
            if (!self.options.unused && !self.options.side_effects)
                || self.ctx.in_var_decl_of_for_in_or_of_loop
            {
                return;
            }
        }

        trace_op!("unused: drop_unused_vars({})", dump(&*name, false));

        // Top-level
        if !has_mark {
            match self.ctx.var_kind {
                Some(VarDeclKind::Var) => {
                    if !self.options.top_level() && self.options.top_retain.is_empty() {
                        if self.ctx.in_top_level() {
                            log_abort!(
                                "unused: [X] Preserving `var` `{}` because it's top-level",
                                dump(&*name, false)
                            );

                            return;
                        }
                    }
                }
                Some(VarDeclKind::Let) | Some(VarDeclKind::Const) => {
                    if !self.options.top_level() && self.ctx.is_top_level_for_block_level_vars() {
                        log_abort!(
                            "unused: Preserving block scoped var `{}` because it's top-level",
                            dump(&*name, false)
                        );

                        return;
                    }
                }
                None => {}
            }
        }

        if let Some(scope) = self.data.scopes.get(&self.ctx.scope) {
            if scope.has_eval_call || scope.has_with_stmt {
                log_abort!(
                    "unused: Preserving `{}` because of usages",
                    dump(&*name, false)
                );
                return;
            }
        }

        if !name.is_ident() && init.is_none() {
            return;
        }

        self.take_pat_if_unused(var_declarator_span, name, init, true);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_params(&mut self, params: &mut Vec<Param>) {
        for param in params.iter_mut().rev() {
            self.take_pat_if_unused(DUMMY_SP, &mut param.pat, None, false);

            if !param.pat.is_invalid() {
                return;
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn take_ident_of_pat_if_unused(
        &mut self,
        parent_span: Span,
        i: &mut Ident,
        init: Option<&mut Expr>,
    ) {
        trace_op!("unused: Checking identifier `{}`", i);

        if !parent_span.has_mark(self.marks.non_top_level)
            && self.options.top_retain.contains(&i.sym)
        {
            log_abort!("unused: [X] Top-retain");
            return;
        }

        if let Some(v) = self.data.vars.get(&i.to_id()).cloned() {
            if v.ref_count == 0
                && v.usage_count == 0
                && !v.reassigned_with_assignment
                && !v.has_property_mutation
                && !v.declared_as_catch_param
            {
                self.changed = true;
                report_change!(
                    "unused: Dropping a variable '{}{:?}' because it is not used",
                    i.sym,
                    i.span.ctxt
                );
                // This will remove variable.
                i.take();
                return;
            }

            if v.ref_count == 0 && v.usage_count == 0 {
                if let Some(e) = init {
                    if let Some(VarDeclKind::Const | VarDeclKind::Let) = self.ctx.var_kind {
                        if let Expr::Lit(Lit::Null(..)) = e {
                            return;
                        }
                    }

                    let ret = self.ignore_return_value(e);
                    if let Some(ret) = ret {
                        *e = ret;
                    } else {
                        if let Some(VarDeclKind::Const | VarDeclKind::Let) = self.ctx.var_kind {
                            *e = Null { span: DUMMY_SP }.into();
                        } else {
                            *e = Expr::Invalid(Invalid { span: DUMMY_SP });
                        }
                    }
                }
            }

            log_abort!(
                "unused: Cannot drop ({}) because it's used",
                dump(&*i, false)
            );
        }
    }

    pub(crate) fn should_preserve_property_access(
        &self,
        e: &Expr,
        opts: PropertyAccessOpts,
    ) -> bool {
        if opts.only_ident && !e.is_ident() {
            return true;
        }

        match e {
            Expr::Ident(e) => {
                if e.span.ctxt.outer() == self.marks.unresolved_mark {
                    if is_global_var(&e.sym) {
                        return false;
                    }
                }

                if let Some(usage) = self.data.vars.get(&e.to_id()) {
                    if !usage.declared {
                        return true;
                    }

                    if !usage.mutated
                        && !usage.reassigned()
                        && usage.no_side_effect_for_member_access
                    {
                        return false;
                    }
                }
            }

            Expr::Object(o) => {
                // We should check properties
                return o.props.iter().any(|p| match p {
                    PropOrSpread::Spread(p) => self.should_preserve_property_access(&p.expr, opts),
                    PropOrSpread::Prop(p) => match &**p {
                        Prop::Assign(_) => true,
                        Prop::Getter(_) => !opts.allow_getter,
                        Prop::Shorthand(_) => false,
                        Prop::KeyValue(..) => false,

                        Prop::Setter(_) => false,
                        Prop::Method(_) => false,
                    },
                });
            }

            Expr::Paren(p) => return self.should_preserve_property_access(&p.expr, opts),

            Expr::Fn(..) | Expr::Arrow(..) | Expr::Array(..) => {
                return false;
            }

            Expr::Seq(e) => {
                if let Some(last) = e.exprs.last() {
                    return self.should_preserve_property_access(last, opts);
                }
                return true;
            }

            _ => {}
        }

        true
    }

    /// `parent_span` should be [Span] of [VarDeclarator] or [AssignExpr]
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn take_pat_if_unused(
        &mut self,
        parent_span: Span,
        name: &mut Pat,
        mut init: Option<&mut Expr>,
        is_var_decl: bool,
    ) {
        if self.ctx.is_exported {
            return;
        }

        trace_op!("unused: take_pat_if_unused({})", dump(&*name, false));

        if !name.is_ident() {
            // TODO: Use smart logic
            if self.options.pure_getters != PureGetterOption::Bool(true) {
                return;
            }

            if let Some(init) = init.as_mut() {
                if self.should_preserve_property_access(
                    init,
                    PropertyAccessOpts {
                        allow_getter: false,
                        only_ident: false,
                    },
                ) {
                    return;
                }
            }
        }

        match name {
            Pat::Ident(i) => {
                self.take_ident_of_pat_if_unused(parent_span, &mut i.id, init);

                // Removed
                if i.id.sym == js_word!("") {
                    name.take();
                }
            }

            Pat::Array(arr) => {
                for (idx, elem) in arr.elems.iter_mut().enumerate() {
                    match elem {
                        Some(p) => {
                            if p.is_ident() {
                                continue;
                            }

                            let elem = init
                                .as_mut()
                                .and_then(|expr| self.access_numeric_property(expr, idx));

                            self.take_pat_if_unused(parent_span, p, elem, is_var_decl);
                        }
                        None => {}
                    }
                }

                arr.elems
                    .retain(|elem| !matches!(elem, Some(Pat::Invalid(..))))
            }

            Pat::Object(obj) => {
                // If a rest pattern exists, we can't remove anything at current level.
                if obj
                    .props
                    .iter()
                    .any(|p| matches!(p, ObjectPatProp::Rest(_)))
                {
                    return;
                }

                for prop in &mut obj.props {
                    match prop {
                        ObjectPatProp::KeyValue(p) => {
                            if p.key.is_computed() {
                                continue;
                            }

                            self.take_pat_if_unused(parent_span, &mut p.value, None, is_var_decl);
                        }
                        ObjectPatProp::Assign(AssignPatProp {
                            key, value: None, ..
                        }) => {
                            self.take_ident_of_pat_if_unused(parent_span, key, None);
                        }
                        _ => {}
                    }
                }

                obj.props.retain(|p| {
                    match p {
                        ObjectPatProp::KeyValue(p) => {
                            if p.value.is_invalid() {
                                return false;
                            }
                        }
                        ObjectPatProp::Assign(p) => {
                            if p.key.sym == js_word!("") {
                                return false;
                            }
                        }
                        ObjectPatProp::Rest(_) => {}
                    }

                    true
                });

                if obj.props.is_empty() {
                    name.take();
                }
            }

            Pat::Rest(_) => {}
            Pat::Assign(_) => {
                // TODO
            }
            _ => {}
        }
    }

    /// Creates an empty [VarDecl] if `decl` should be removed.
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_decl(&mut self, decl: &mut Decl) {
        if self.ctx.is_exported {
            return;
        }

        if !self.options.top_level() && self.ctx.is_top_level_for_block_level_vars() {
            return;
        }

        if !self.options.unused {
            return;
        }

        if let Some(scope) = self.data.scopes.get(&self.ctx.scope) {
            if scope.has_eval_call || scope.has_with_stmt {
                return;
            }
        }

        if let Decl::Class(c) = decl {
            if class_has_side_effect(&c.class) {
                return;
            }
        }

        match decl {
            Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                // We should skip if the name of decl is arguments.
                if ident.sym == js_word!("arguments") {
                    return;
                }

                // If it is not used, drop it.
                if self
                    .data
                    .vars
                    .get(&ident.to_id())
                    .map(|v| v.usage_count == 0 && !v.has_property_mutation)
                    .unwrap_or(false)
                {
                    self.changed = true;
                    report_change!(
                        "unused: Dropping a decl '{}{:?}' because it is not used",
                        ident.sym,
                        ident.span.ctxt
                    );
                    // This will remove the declaration.
                    decl.take();
                }
            }

            Decl::Var(_) => {
                // Variable declarations are handled by other functions.
            }

            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {
                // Nothing to do. We might change this to unreachable!()
            }
        }
    }

    /// This should be only called from ignore_return_value
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_update(&mut self, e: &mut Expr) {
        if !self.options.unused {
            return;
        }

        let update = match e {
            Expr::Update(u) => u,
            _ => return,
        };

        if let Expr::Ident(arg) = &*update.arg {
            if let Some(var) = self.data.vars.get(&arg.to_id()) {
                // Update is counted as usage
                if var.declared && var.is_fn_local && var.usage_count == 1 {
                    self.changed = true;
                    report_change!(
                        "unused: Dropping an update '{}{:?}' because it is not used",
                        arg.sym,
                        arg.span.ctxt
                    );
                    // This will remove the update.
                    e.take();
                }
            }
        }
    }

    /// This should be only called from ignore_return_value
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_op_assign(&mut self, e: &mut Expr) {
        if !self.options.unused {
            return;
        }

        if self.ctx.is_delete_arg {
            return;
        }

        if self.data.top.has_eval_call || self.data.top.has_with_stmt {
            return;
        }

        let assign = match e {
            Expr::Assign(AssignExpr { op: op!("="), .. }) => return,
            // RHS may not be evaluated
            Expr::Assign(AssignExpr {
                op: op!("&&=") | op!("||=") | op!("&&="),
                ..
            }) => return,
            Expr::Assign(e) => e,
            _ => return,
        };
        assign.left.map_with_mut(|left| left.normalize_ident());

        if let PatOrExpr::Pat(p) = &assign.left {
            if let Pat::Ident(left) = &**p {
                if let Some(var) = self.data.vars.get(&left.to_id()) {
                    // TODO: We don't need fn_local check
                    if var.declared && var.is_fn_local && var.usage_count == 1 {
                        self.changed = true;
                        report_change!(
                            "unused: Dropping an op-assign '{}{:?}' because it is not used",
                            left.id.sym,
                            left.id.span.ctxt
                        );
                        // This will remove the op-assign.
                        *e = *assign.right.take();
                    }
                }
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_assignments(&mut self, e: &mut Expr) {
        if self.ctx.is_delete_arg {
            return;
        }

        if self.data.top.has_eval_call || self.data.top.has_with_stmt {
            return;
        }

        let assign = match e {
            Expr::Assign(e) => e,
            _ => return,
        };

        let has_mark = assign.span.has_mark(self.marks.non_top_level);

        if !has_mark && !self.options.unused {
            return;
        }

        let used_arguments = self
            .data
            .scopes
            .get(&self.ctx.scope)
            .unwrap_or_else(|| {
                unreachable!(
                    "scope should exist\nScopes: {:?};\nCtxt: {:?}",
                    self.data.scopes, self.ctx.scope
                )
            })
            .used_arguments;

        trace_op!(
            "unused: drop_unused_assignments: Target: `{}`",
            dump(&assign.left, false)
        );

        if !has_mark
            && (!self.options.top_level() && self.options.top_retain.is_empty())
            && self.ctx.in_top_level()
        {
            log_abort!(
                "unused: Preserving assignment to `{}` because it's top-level",
                dump(&assign.left, false)
            );
            return;
        }

        assign.left.map_with_mut(|v| v.normalize_ident());

        match &mut assign.left {
            PatOrExpr::Expr(_) => {
                log_abort!(
                    "unused: Preserving assignment to `{}` because it's an expression",
                    dump(&assign.left, false)
                );
            }
            PatOrExpr::Pat(left) => {
                if let Pat::Ident(i) = &**left {
                    if self.options.top_retain.contains(&i.id.sym) {
                        return;
                    }

                    if let Some(var) = self.data.vars.get(&i.to_id()) {
                        if var.is_fn_local
                            && var.usage_count == 0
                            && var.declared
                            && (!var.declared_as_fn_param || !used_arguments || self.ctx.in_strict)
                        {
                            report_change!(
                                "unused: Dropping assignment to var '{}{:?}', which is never used",
                                i.id.sym,
                                i.id.span.ctxt
                            );
                            self.changed = true;
                            if self.ctx.is_this_aware_callee {
                                *e = Expr::Seq(SeqExpr {
                                    span: DUMMY_SP,
                                    exprs: vec![0.into(), assign.right.take()],
                                })
                            } else {
                                *e = *assign.right.take();
                            }
                        } else {
                            log_abort!(
                                "unused: Preserving assignment to `{}` because of usage: {:?}",
                                dump(&assign.left, false),
                                var
                            )
                        }
                    }
                }
            }
        }
    }

    /// Make `name` [None] if the name is not used.
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn remove_name_if_not_used(&mut self, name: &mut Option<Ident>) {
        if !self.options.unused {
            return;
        }

        if self.ctx.is_exported {
            return;
        }

        if let Some(i) = &name {
            let can_remove_ident = self
                .data
                .vars
                .get(&i.to_id())
                .map(|v| (v.ref_count == 0 && v.usage_count == 0) || v.var_kind.is_some())
                .unwrap_or(false);

            if can_remove_ident {
                self.changed = true;
                report_change!("Removing ident of an class / function expression");
                *name = None;
            }
        }
    }

    pub(super) fn remove_duplicate_var_decls(&mut self, s: &mut Stmt) -> Option<()> {
        if !self.options.unused {
            return None;
        }

        let var = match s {
            Stmt::Decl(Decl::Var(v)) => v,
            _ => return None,
        };

        for d in var.decls.iter_mut() {
            if d.init.is_none() {
                if let Pat::Ident(name) = &d.name {
                    if let Some(usage) = self.data.vars.get(&name.to_id()) {
                        if usage.is_fn_local && usage.declared_as_fn_param {
                            d.name.take();
                            report_change!(
                                "Removing a variable statement because it's a function parameter"
                            );
                            self.changed = true;
                        }
                    }
                }
            }
        }

        var.decls.retain(|v| !v.name.is_invalid());

        None
    }

    /// `var Parser = function Parser() {};` => `var Parser = function () {}`
    pub(super) fn remove_duplicate_name_of_function(&mut self, v: &mut VarDeclarator) {
        if !self.options.unused {
            return;
        }

        if let Some(Expr::Fn(f)) = v.init.as_deref_mut() {
            if f.ident.is_none() {
                return;
            }

            if contains_ident_ref(&f.function.body, f.ident.as_ref().unwrap()) {
                return;
            }

            self.changed = true;
            report_change!(
                "unused: Removing the name of a function expression because it's not used by it'"
            );
            f.ident = None;
        }
    }
}
