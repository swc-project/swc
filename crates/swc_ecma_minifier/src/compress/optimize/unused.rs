use std::borrow::Borrow;

use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::util::is_global_var_with_pure_property_access;
use swc_ecma_utils::{contains_ident_ref, contains_this_expr, ExprExt};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::Optimizer;
#[cfg(feature = "debug")]
use crate::debug::dump;
use crate::{
    compress::optimize::{util::extract_class_side_effect, BitCtx},
    option::PureGetterOption,
    program_data::{ScopeData, VarUsageInfoFlags},
};

#[derive(Debug, Default, Clone, Copy)]
pub(crate) struct PropertyAccessOpts {
    pub allow_getter: bool,

    pub only_ident: bool,
}

/// Methods related to the option `unused`.
impl Optimizer<'_> {
    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn drop_unused_var_declarator(
        &mut self,
        var: &mut VarDeclarator,
        storage_for_side_effects: &mut Option<Box<Expr>>,
    ) {
        if self.mode.preserve_vars() {
            return;
        }
        if var.name.is_invalid() {
            return;
        }

        #[cfg(debug_assertions)]
        let had_init = var.init.is_some();

        match &mut var.init {
            Some(init) => match &**init {
                Expr::Invalid(..) => {
                    self.drop_unused_vars(&mut var.name, None);
                }
                // I don't know why, but terser preserves this
                Expr::Fn(FnExpr { function, .. })
                    if matches!(&**function, Function { is_async: true, .. }) => {}
                _ => {
                    self.drop_unused_vars(&mut var.name, Some(init));

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
                self.drop_unused_vars(&mut var.name, var.init.as_deref_mut());
            }
        }

        if var.name.is_invalid() {
            return;
        }

        #[cfg(debug_assertions)]
        {
            if self
                .ctx
                .bit_ctx
                .intersects(BitCtx::IsConst.union(BitCtx::IsLet))
                && had_init
                && var.init.is_none()
            {
                unreachable!("const/let variable without initializer: {:#?}", var);
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn drop_unused_param(&mut self, pat: &mut Pat, ignore_fn_length: bool) {
        if !self.options.unused && !self.options.reduce_fns {
            return;
        }

        if let Some(scope) = self.data.get_scope(self.ctx.scope) {
            if scope.intersects(ScopeData::HAS_EVAL_CALL.union(ScopeData::HAS_WITH_STMT)) {
                return;
            }
        }

        if !ignore_fn_length {
            // Preserve `length` of function.
            if pat.is_ident() {
                return;
            }
        }

        self.take_pat_if_unused(pat, None, false)
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn drop_unused_vars(&mut self, name: &mut Pat, init: Option<&mut Expr>) {
        if self
            .ctx
            .bit_ctx
            .intersects(BitCtx::IsExported | BitCtx::InAsm)
        {
            return;
        }

        trace_op!("unused: drop_unused_vars({})", dump(&*name, false));

        if !self.options.unused && !self.options.side_effects {
            return;
        }

        if self.ctx.bit_ctx.contains(BitCtx::InVarDeclOfForInOrOfLoop) {
            return;
        }

        if let Some(scope) = self.data.get_scope(self.ctx.scope) {
            if scope.intersects(ScopeData::HAS_EVAL_CALL.union(ScopeData::HAS_WITH_STMT)) {
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

        self.take_pat_if_unused(name, init, true);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn drop_unused_params(&mut self, params: &mut Vec<Param>) {
        if self.options.keep_fargs || !self.options.unused {
            return;
        }

        for param in params.iter_mut().rev() {
            self.take_pat_if_unused(&mut param.pat, None, false);

            if !param.pat.is_invalid() {
                break;
            }
        }

        params.retain(|p| !p.pat.is_invalid());
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn drop_unused_arrow_params(&mut self, params: &mut Vec<Pat>) {
        if self.options.keep_fargs || !self.options.unused {
            return;
        }

        for param in params.iter_mut().rev() {
            self.take_pat_if_unused(param, None, false);

            if !param.is_invalid() {
                break;
            }
        }

        params.retain(|p| !p.is_invalid());
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn take_ident_of_pat_if_unused(&mut self, i: &mut Ident, init: Option<&mut Expr>) {
        trace_op!("unused: Checking identifier `{}`", i);

        if !self.may_remove_ident(i) {
            log_abort!("unused: Preserving var `{:#?}` because it's top-level", i);
            return;
        }

        if let Some(v) = self.data.vars.get(&i.to_id()) {
            let is_used_in_member =
                v.property_mutation_count > 0 || v.flags.contains(VarUsageInfoFlags::USED_AS_REF);
            if v.ref_count == 0
                && v.usage_count == 0
                && !v.flags.contains(VarUsageInfoFlags::REASSIGNED)
                && !is_used_in_member
            {
                self.changed = true;
                report_change!(
                    "unused: Dropping a variable '{}{:?}' because it is not used",
                    i.sym,
                    i.ctxt
                );
                // This will remove variable.
                i.take();
                return;
            }

            if v.ref_count == 0 && v.usage_count == 0 {
                if let Some(e) = init {
                    if self
                        .ctx
                        .bit_ctx
                        .intersects(BitCtx::IsConst.union(BitCtx::IsLet))
                    {
                        if let Expr::Lit(Lit::Null(..)) = e {
                            return;
                        }
                    }

                    let ret = self.ignore_return_value(e);
                    if let Some(ret) = ret {
                        *e = ret;
                    } else {
                        if self
                            .ctx
                            .bit_ctx
                            .intersects(BitCtx::IsConst.union(BitCtx::IsLet))
                        {
                            *e = Null { span: DUMMY_SP }.into();
                        } else {
                            *e = Invalid { span: DUMMY_SP }.into();
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
                if e.ctxt.outer() == self.marks.unresolved_mark {
                    if is_global_var_with_pure_property_access(&e.sym) {
                        return false;
                    }
                }

                if let Some(usage) = self.data.vars.get(&e.to_id()) {
                    if !usage.flags.contains(VarUsageInfoFlags::DECLARED) {
                        return true;
                    }

                    if !usage.mutated()
                        && usage
                            .flags
                            .contains(VarUsageInfoFlags::NO_SIDE_EFFECT_FOR_MEMBER_ACCESS)
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
                        Prop::Shorthand(p) => {
                            // Check if `p` is __proto__

                            if p.sym == "__proto__" {
                                return true;
                            }

                            false
                        }
                        Prop::KeyValue(k) => {
                            // Check if `k` is __proto__

                            if let PropName::Ident(i) = &k.key {
                                if i.sym == "__proto__" {
                                    return true;
                                }
                            }

                            false
                        }

                        Prop::Setter(_) => true,
                        Prop::Method(_) => false,
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    },
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                });
            }

            Expr::Paren(p) => return self.should_preserve_property_access(&p.expr, opts),

            Expr::Fn(..) | Expr::Arrow(..) | Expr::Array(..) | Expr::Class(..) => {
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
    #[allow(clippy::only_used_in_recursion)]
    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn take_pat_if_unused(
        &mut self,
        name: &mut Pat,
        mut init: Option<&mut Expr>,
        is_var_decl: bool,
    ) {
        if self.ctx.bit_ctx.contains(BitCtx::IsExported) {
            return;
        }

        trace_op!("unused: take_pat_if_unused({})", dump(&*name, false));

        let pure_mark = self.marks.pure;
        let has_pure_ann = match init {
            Some(Expr::Call(c)) => c.ctxt.has_mark(pure_mark),
            Some(Expr::New(n)) => n.ctxt.has_mark(pure_mark),
            Some(Expr::TaggedTpl(t)) => t.ctxt.has_mark(pure_mark),
            _ => false,
        };

        if !name.is_ident() {
            // TODO: Use smart logic
            if self.options.pure_getters != PureGetterOption::Bool(true) && !has_pure_ann {
                return;
            }

            if !has_pure_ann {
                if let Some(init) = init.as_mut() {
                    if !matches!(init, Expr::Ident(_))
                        && self.should_preserve_property_access(
                            init,
                            PropertyAccessOpts {
                                allow_getter: false,
                                only_ident: false,
                            },
                        )
                    {
                        return;
                    }
                }
            }
        }

        match name {
            Pat::Ident(i) => {
                self.take_ident_of_pat_if_unused(&mut i.id, init);

                // Removed
                if i.id.is_dummy() {
                    name.take();
                }
            }

            Pat::Array(arr) => {
                for (idx, arr_elem) in arr.elems.iter_mut().enumerate() {
                    if let Some(p) = arr_elem {
                        let elem = init
                            .as_mut()
                            .and_then(|expr| self.access_numeric_property(expr, idx));

                        self.take_pat_if_unused(p, elem, is_var_decl);

                        if p.is_invalid() {
                            *arr_elem = None;
                        }
                    }
                }

                if has_pure_ann && arr.elems.iter().all(|e| e.is_none()) {
                    name.take();
                }
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

                            self.take_pat_if_unused(&mut p.value, None, is_var_decl);
                        }
                        ObjectPatProp::Assign(AssignPatProp { key, value, .. }) => {
                            if has_pure_ann {
                                if let Some(e) = value {
                                    *value = self.ignore_return_value(e).map(Box::new);
                                }
                            }

                            if value.is_none() {
                                self.take_ident_of_pat_if_unused(key, None);
                            }
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
                            if p.key.is_dummy() {
                                return false;
                            }
                        }
                        ObjectPatProp::Rest(_) => {}
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
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
    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn drop_unused_decl(&mut self, decl: &mut Decl) {
        if self.ctx.bit_ctx.contains(BitCtx::IsExported) {
            return;
        }

        if !self.options.top_level() && self.ctx.is_top_level_for_block_level_vars() {
            return;
        }

        if !self.options.unused {
            return;
        }

        if let Some(scope) = self.data.get_scope(self.ctx.scope) {
            if scope.intersects(ScopeData::HAS_EVAL_CALL.union(ScopeData::HAS_WITH_STMT)) {
                return;
            }
        }

        match decl {
            Decl::Class(ClassDecl { ident, class, .. }) => {
                if ident.sym == "arguments" {
                    return;
                }

                // Fix https://github.com/swc-project/swc/issues/5588
                let may_have_side_effect = class.body.iter().any(|m| match m {
                    ClassMember::ClassProp(ClassProp {
                        is_static: true,
                        value: Some(_),
                        ..
                    })
                    | ClassMember::PrivateProp(PrivateProp {
                        is_static: true,
                        value: Some(_),
                        ..
                    }) => true,
                    ClassMember::StaticBlock(StaticBlock {
                        body: BlockStmt { stmts, .. },
                        ..
                    }) if !stmts.is_empty() => true,
                    _ => false,
                });
                if may_have_side_effect {
                    return;
                }

                // If it is not used, drop it.
                if self
                    .data
                    .vars
                    .get(&ident.to_id())
                    .map(|v| v.usage_count == 0 && v.property_mutation_count == 0)
                    .unwrap_or(false)
                {
                    let Some(side_effects) = extract_class_side_effect(self.ctx.expr_ctx, class)
                    else {
                        return;
                    };

                    self.changed = true;
                    report_change!(
                        "unused: Dropping a decl '{}{:?}' because it is not used",
                        ident.sym,
                        ident.ctxt
                    );

                    let mut side_effects: Vec<_> =
                        side_effects.into_iter().map(|expr| expr.take()).collect();
                    decl.take();

                    if side_effects.is_empty() {
                        return;
                    }

                    self.prepend_stmts.push(
                        ExprStmt {
                            span: DUMMY_SP,
                            expr: if side_effects.len() > 1 {
                                SeqExpr {
                                    span: DUMMY_SP,
                                    exprs: side_effects,
                                }
                                .into()
                            } else {
                                side_effects.remove(0)
                            },
                        }
                        .into(),
                    );
                }
            }
            Decl::Fn(FnDecl { ident, .. }) => {
                // We should skip if the name of decl is arguments.
                if ident.sym == "arguments" {
                    return;
                }

                if !self.may_remove_ident(ident) {
                    log_abort!(
                        "unused: Preserving function `{}` because it's top-level",
                        ident.sym
                    );
                    return;
                }

                // If it is not used, drop it.
                if self
                    .data
                    .vars
                    .get(&ident.to_id())
                    .map(|v| v.usage_count == 0 && v.property_mutation_count == 0)
                    .unwrap_or(false)
                {
                    self.changed = true;
                    report_change!(
                        "unused: Dropping a decl '{}{:?}' because it is not used",
                        ident.sym,
                        ident.ctxt
                    );
                    // This will remove the declaration.
                    decl.take();
                }
            }

            Decl::Var(_) => {
                // Variable declarations are handled by other functions.
            }

            Decl::Using(..) => {
                // TODO: Optimize
            }

            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {
                // Nothing to do. We might change this to unreachable!()
            }

            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    /// This should be only called from ignore_return_value
    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
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
                if var
                    .flags
                    .contains(VarUsageInfoFlags::DECLARED.union(VarUsageInfoFlags::IS_FN_LOCAL))
                    && var.usage_count == 1
                {
                    self.changed = true;
                    report_change!(
                        "unused: Dropping an update '{}{:?}' because it is not used",
                        arg.sym,
                        arg.ctxt
                    );
                    // This will remove the update.
                    e.take();
                }
            }
        }
    }

    /// This should be only called from ignore_return_value
    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn drop_unused_op_assign(&mut self, e: &mut Expr) {
        if !self.options.unused {
            return;
        }

        if self.ctx.bit_ctx.contains(BitCtx::IsDeleteArg) {
            return;
        }

        if self
            .data
            .top
            .intersects(ScopeData::HAS_EVAL_CALL.union(ScopeData::HAS_WITH_STMT))
        {
            return;
        }

        let assign = match e {
            Expr::Assign(AssignExpr { op: op!("="), .. }) => return,
            // RHS may not be evaluated
            Expr::Assign(AssignExpr { op, .. }) if op.may_short_circuit() => return,
            Expr::Assign(e) => e,
            _ => return,
        };

        if let AssignTarget::Simple(SimpleAssignTarget::Ident(left)) = &assign.left {
            if let Some(var) = self.data.vars.get(&left.to_id()) {
                // TODO: We don't need fn_local check
                if var
                    .flags
                    .contains(VarUsageInfoFlags::DECLARED.union(VarUsageInfoFlags::IS_FN_LOCAL))
                    && var.usage_count == 1
                {
                    self.changed = true;
                    report_change!(
                        "unused: Dropping an op-assign '{}{:?}' because it is not used",
                        left.id.sym,
                        left.id.ctxt
                    );
                    // This will remove the op-assign.
                    *e = *assign.right.take();
                }
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn drop_unused_assignments(&mut self, e: &mut Expr) {
        if self.ctx.bit_ctx.contains(BitCtx::IsDeleteArg) {
            return;
        }

        if self
            .data
            .top
            .intersects(ScopeData::HAS_EVAL_CALL.union(ScopeData::HAS_WITH_STMT))
        {
            return;
        }

        let assign = match e {
            Expr::Assign(e) => e,
            _ => return,
        };

        if !self.options.unused {
            return;
        }

        let used_arguments = self
            .data
            .get_scope(self.ctx.scope)
            .unwrap_or_else(|| unreachable!("scope should exist\nCtxt: {:?}", self.ctx.scope))
            .contains(ScopeData::USED_ARGUMENTS);

        trace_op!(
            "unused: drop_unused_assignments: Target: `{}`",
            dump(&assign.left, false)
        );

        if let AssignTarget::Simple(SimpleAssignTarget::Ident(i)) = &mut assign.left {
            if !self.may_remove_ident(&i.id) {
                return;
            }

            if let Some(var) = self.data.vars.get(&i.to_id()) {
                // technically this is inline
                if !var.flags.intersects(
                    VarUsageInfoFlags::INLINE_PREVENTED.union(VarUsageInfoFlags::EXPORTED),
                ) && var.usage_count == 0
                    && var.flags.contains(VarUsageInfoFlags::DECLARED)
                    && (!var.flags.contains(VarUsageInfoFlags::DECLARED_AS_FN_PARAM)
                        || !used_arguments
                        || self.ctx.expr_ctx.in_strict)
                {
                    report_change!(
                        "unused: Dropping assignment to var '{}{:?}', which is never used",
                        i.id.sym,
                        i.id.ctxt
                    );
                    self.changed = true;
                    if self.ctx.bit_ctx.contains(BitCtx::IsThisAwareCallee) {
                        *e = SeqExpr {
                            span: DUMMY_SP,
                            exprs: vec![0.into(), assign.right.take()],
                        }
                        .into()
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

    pub(super) fn drop_empty_constructors(&self, n: &mut Class) {
        let mut empty_constructor_indices = Vec::new();

        for (index, member) in n.body.iter().enumerate() {
            if let ClassMember::Constructor(constructor) = member {
                if self.is_constructor_empty(constructor) {
                    empty_constructor_indices.push(index);
                }
            }
        }

        if !empty_constructor_indices.is_empty() {
            report_change!("Removing an empty constructor");
            for index in empty_constructor_indices.into_iter().rev() {
                n.body.remove(index);
            }
        }
    }

    fn is_constructor_empty(&self, constructor: &Constructor) -> bool {
        if !constructor.params.is_empty() {
            return false;
        }

        match &constructor.body {
            None => true,
            Some(body) => match body.stmts.as_slice() {
                [] => true,
                [Stmt::Empty(_)] => true,
                _ => false,
            },
        }
    }

    /// Make `name` [None] if the name is not used.
    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    pub(super) fn remove_name_if_not_used(&mut self, name: &mut Option<Ident>) {
        if !self.options.unused {
            return;
        }

        if self.ctx.bit_ctx.contains(BitCtx::IsExported) {
            return;
        }

        if let Some(i) = &name {
            let can_remove_ident = self
                .data
                .vars
                .get(&i.to_id())
                .map(|v| {
                    (!v.flags.contains(VarUsageInfoFlags::USED_RECURSIVELY)
                        && v.ref_count == 0
                        && v.usage_count == 0)
                        || v.var_kind.is_some()
                })
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
                    if let Some(usage) = self.data.vars.get_mut(&name.to_id()) {
                        if usage.flags.contains(
                            VarUsageInfoFlags::IS_FN_LOCAL
                                .union(VarUsageInfoFlags::DECLARED_AS_FN_PARAM),
                        ) && usage.declared_count >= 2
                        {
                            d.name.take();
                            usage.declared_count -= 1;

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
        if !self.options.unused || self.options.hoist_props {
            return;
        }

        if let Some(Expr::Fn(f)) = v.init.as_deref_mut() {
            let Some(f_ident) = f.ident.as_ref() else {
                return;
            };

            if contains_ident_ref(&f.function.body, f_ident) {
                return;
            }

            self.changed = true;
            report_change!(
                "unused: Removing the name of a function expression because it's not used by it'"
            );
            f.ident = None;
        }
    }

    pub(super) fn drop_unused_properties(&mut self, v: &mut VarDeclarator) -> Option<()> {
        if !self.options.hoist_props || self.ctx.bit_ctx.contains(BitCtx::IsExported) {
            return None;
        }

        if self.ctx.bit_ctx.contains(BitCtx::TopLevel) && !self.options.top_level() {
            return None;
        }

        let name = v.name.as_ident()?;
        let obj = v.init.as_mut()?.as_mut_object()?;

        let usage = self.data.vars.get(&name.to_id())?;

        if usage.flags.intersects(
            VarUsageInfoFlags::INDEXED_WITH_DYNAMIC_KEY
                .union(VarUsageInfoFlags::USED_AS_REF)
                .union(VarUsageInfoFlags::USED_RECURSIVELY),
        ) {
            return None;
        }

        if obj.props.iter().any(|p| match p {
            PropOrSpread::Spread(_) => true,
            PropOrSpread::Prop(p) => match &**p {
                Prop::Shorthand(_) => false,
                Prop::KeyValue(p) => {
                    p.key.is_computed() || p.value.may_have_side_effects(self.ctx.expr_ctx)
                }
                Prop::Assign(_) => true,
                Prop::Getter(p) => p.key.is_computed(),
                Prop::Setter(p) => p.key.is_computed(),
                Prop::Method(p) => p.key.is_computed(),
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            },
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }) {
            return None;
        }

        let properties_used_via_this = {
            let mut v = ThisPropertyVisitor::default();
            obj.visit_with(&mut v);
            if v.should_abort {
                return None;
            }
            v.properties
        };

        let mut unknown_used_props = self
            .data
            .vars
            .get(&name.to_id())
            .map(|v| v.accessed_props.clone())
            .unwrap_or_default();

        // If there's an access to an unknown property, we should preserve all
        // properties.
        for prop in &obj.props {
            let prop = match prop {
                PropOrSpread::Spread(_) => return None,
                PropOrSpread::Prop(prop) => prop,
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            };

            match &**prop {
                Prop::Method(prop) => {
                    if contains_this_expr(&prop.function.body) {
                        return None;
                    }
                }
                Prop::Getter(prop) => {
                    if contains_this_expr(&prop.body) {
                        return None;
                    }
                }
                Prop::Setter(prop) => {
                    if contains_this_expr(&prop.body) {
                        return None;
                    }
                }
                Prop::KeyValue(prop) => match &*prop.value {
                    Expr::Fn(f) => {
                        if contains_this_expr(&f.function.body) {
                            return None;
                        }
                    }
                    Expr::Arrow(f) => {
                        if contains_this_expr(&f.body) {
                            return None;
                        }
                    }
                    _ => {}
                },
                _ => {}
            }

            if contains_this_expr(prop) {
                return None;
            }

            match &**prop {
                Prop::KeyValue(p) => match &p.key {
                    PropName::Str(s) => {
                        if !can_remove_property(&s.value) {
                            return None;
                        }

                        if let Some(v) = unknown_used_props.get_mut(&s.value) {
                            *v = 0;
                        }
                    }
                    PropName::Ident(i) => {
                        if !can_remove_property(i.sym.borrow()) {
                            return None;
                        }

                        if let Some(v) = unknown_used_props.get_mut(i.sym.borrow()) {
                            *v = 0;
                        }
                    }
                    _ => return None,
                },
                Prop::Shorthand(p) => {
                    if !can_remove_property(p.sym.borrow()) {
                        return None;
                    }

                    if let Some(v) = unknown_used_props.get_mut(p.sym.borrow()) {
                        *v = 0;
                    }
                }
                _ => return None,
            }
        }

        if !unknown_used_props.iter().all(|(_, v)| *v == 0) {
            log_abort!("[x] unknown used props: {:?}", unknown_used_props);
            return None;
        }

        let should_preserve_property = |sym: &swc_atoms::Wtf8Atom| {
            if let Some(s) = sym.as_str() {
                if s == "toString" {
                    return true;
                }

                if s.parse::<f64>().is_ok() || s.parse::<i32>().is_ok() {
                    return true;
                }
            }

            usage.accessed_props.contains_key(sym) || properties_used_via_this.contains(sym)
        };
        let should_preserve = |key: &PropName| match key {
            PropName::Ident(k) => should_preserve_property(k.sym.borrow()),
            PropName::Str(k) => should_preserve_property(&k.value),
            PropName::Num(..) => true,
            PropName::Computed(..) => true,
            PropName::BigInt(..) => true,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        };

        let len = obj.props.len();
        obj.props.retain(|prop| match prop {
            PropOrSpread::Spread(_) => {
                unreachable!()
            }
            PropOrSpread::Prop(p) => match &**p {
                Prop::Shorthand(p) => should_preserve_property(p.sym.borrow()),
                Prop::KeyValue(p) => should_preserve(&p.key),
                Prop::Assign(..) => {
                    unreachable!()
                }
                Prop::Getter(p) => should_preserve(&p.key),
                Prop::Setter(p) => should_preserve(&p.key),
                Prop::Method(p) => should_preserve(&p.key),
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            },
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        });

        if obj.props.len() != len {
            self.changed = true;
            report_change!("unused: Removing unused properties");
        }

        None
    }
}

fn can_remove_property(sym: &swc_atoms::Wtf8Atom) -> bool {
    sym.as_str()
        .map_or(true, |s| !matches!(s, "toString" | "valueOf"))
}

#[derive(Default)]
struct ThisPropertyVisitor {
    properties: FxHashSet<Atom>,

    should_abort: bool,
}

impl Visit for ThisPropertyVisitor {
    noop_visit_type!(fail);

    fn visit_assign_expr(&mut self, e: &AssignExpr) {
        if self.should_abort {
            return;
        }

        e.visit_children_with(self);

        if self.should_abort {
            return;
        }

        if let Expr::This(..) = &*e.right {
            if e.op == op!("=") || e.op.may_short_circuit() {
                self.should_abort = true;
            }
        }
    }

    fn visit_call_expr(&mut self, n: &CallExpr) {
        if self.should_abort {
            return;
        }

        n.visit_children_with(self);

        if self.should_abort {
            return;
        }

        for arg in &n.args {
            if arg.expr.is_this() {
                self.should_abort = true;
                return;
            }
        }
    }

    fn visit_callee(&mut self, c: &Callee) {
        if self.should_abort {
            return;
        }

        c.visit_children_with(self);

        if self.should_abort {
            return;
        }

        if let Callee::Expr(e) = c {
            match &**e {
                Expr::This(..) => {
                    self.should_abort = true;
                }

                Expr::Member(e) => {
                    if e.obj.is_this() {
                        self.should_abort = true;
                    }
                }

                _ => {}
            }
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        if self.should_abort {
            return;
        }

        e.visit_children_with(self);

        if self.should_abort {
            return;
        }

        if let Expr::This(..) = &*e.obj {
            match &e.prop {
                MemberProp::Ident(p) => {
                    self.properties.insert(p.sym.clone());
                }
                MemberProp::Computed(_) => {
                    self.should_abort = true;
                }
                _ => {}
            }
        }
    }
}
