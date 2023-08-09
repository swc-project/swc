use rustc_hash::FxHashSet;
use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::util::is_global_var_with_pure_property_access;
use swc_ecma_utils::{contains_ident_ref, ExprExt};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::Optimizer;
#[cfg(feature = "debug")]
use crate::debug::dump;
use crate::{compress::optimize::util::extract_class_side_effect, option::PureGetterOption};

#[derive(Debug, Default, Clone, Copy)]
pub(crate) struct PropertyAccessOpts {
    pub allow_getter: bool,

    pub only_ident: bool,
}

/// Methods related to the option `unused`.
impl Optimizer<'_> {
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_var_declarator(
        &mut self,
        var: &mut VarDeclarator,
        storage_for_side_effects: &mut Option<Box<Expr>>,
    ) {
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

        self.take_pat_if_unused(pat, None, false)
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_vars(&mut self, name: &mut Pat, init: Option<&mut Expr>) {
        if self.ctx.is_exported || self.ctx.in_asm {
            return;
        }

        trace_op!("unused: drop_unused_vars({})", dump(&*name, false));

        if !self.options.unused && !self.options.side_effects {
            return;
        }

        if self.ctx.in_var_decl_of_for_in_or_of_loop {
            return;
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

        self.take_pat_if_unused(name, init, true);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_params(&mut self, params: &mut Vec<Param>) {
        for param in params.iter_mut().rev() {
            self.take_pat_if_unused(&mut param.pat, None, false);

            if !param.pat.is_invalid() {
                return;
            }
        }
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn take_ident_of_pat_if_unused(&mut self, i: &mut Ident, init: Option<&mut Expr>) {
        trace_op!("unused: Checking identifier `{}`", i);

        if !self.may_remove_ident(i) {
            log_abort!("unused: Preserving var `{:#?}` because it's top-level", i);
            return;
        }

        if let Some(v) = self.data.vars.get(&i.to_id()).cloned() {
            if v.ref_count == 0
                && v.usage_count == 0
                && !v.reassigned()
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
                    if is_global_var_with_pure_property_access(&e.sym) {
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
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn take_pat_if_unused(
        &mut self,
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
                self.take_ident_of_pat_if_unused(&mut i.id, init);

                // Removed
                if i.id.is_dummy() {
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

                            self.take_pat_if_unused(p, elem, is_var_decl);
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

                            self.take_pat_if_unused(&mut p.value, None, is_var_decl);
                        }
                        ObjectPatProp::Assign(AssignPatProp {
                            key, value: None, ..
                        }) => {
                            self.take_ident_of_pat_if_unused(key, None);
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

        match decl {
            Decl::Class(ClassDecl { ident, class, .. }) => {
                if ident.sym == js_word!("arguments") {
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
                    let class = decl.take().class().unwrap();
                    let mut side_effects = extract_class_side_effect(&self.expr_ctx, *class.class);

                    if !side_effects.is_empty() {
                        self.prepend_stmts.push(Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: if side_effects.len() > 1 {
                                Expr::Seq(SeqExpr {
                                    span: DUMMY_SP,
                                    exprs: side_effects,
                                })
                                .into()
                            } else {
                                side_effects.remove(0)
                            },
                        }))
                    }
                }
            }
            Decl::Fn(FnDecl { ident, .. }) => {
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

            Decl::Using(..) => {
                // TODO: Optimize
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
            Expr::Assign(AssignExpr { op, .. }) if op.may_short_circuit() => return,
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

        if !self.options.unused {
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
                    if !self.may_remove_ident(&i.id) {
                        return;
                    }

                    if let Some(var) = self.data.vars.get(&i.to_id()) {
                        // technically this is inline
                        if !var.inline_prevented
                            && !var.exported
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
                .map(|v| {
                    (!v.used_recursively && v.ref_count == 0 && v.usage_count == 0)
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
                        if usage.is_fn_local
                            && usage.declared_as_fn_param
                            && usage.declared_count >= 2
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
        if !self.options.unused {
            return;
        }

        if let Some(Expr::Fn(f)) = v.init.as_deref_mut() {
            if f.ident.is_none() {
                return;
            }

            if contains_ident_ref(&f.function.body, &f.ident.as_ref().unwrap().to_id()) {
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
        if !self.options.hoist_props || self.ctx.is_exported {
            return None;
        }

        if self.ctx.top_level && !self.options.top_level() {
            return None;
        }

        let name = v.name.as_ident()?;
        let obj = v.init.as_mut()?.as_mut_object()?;

        let usage = self.data.vars.get(&name.to_id())?;

        if usage.indexed_with_dynamic_key || usage.used_as_ref {
            return None;
        }

        if obj.props.iter().any(|p| match p {
            PropOrSpread::Spread(_) => true,
            PropOrSpread::Prop(p) => match &**p {
                Prop::Shorthand(_) => false,
                Prop::KeyValue(p) => {
                    p.key.is_computed() || p.value.may_have_side_effects(&self.expr_ctx)
                }
                Prop::Assign(_) => true,
                Prop::Getter(p) => p.key.is_computed(),
                Prop::Setter(p) => p.key.is_computed(),
                Prop::Method(p) => p.key.is_computed(),
            },
        }) {
            return None;
        }

        let properties_used_via_this = {
            let mut v = ThisPropertyVisitor::default();
            obj.visit_with(&mut v);
            v.properties
        };

        let should_preserve_property = |sym: &JsWord| {
            if let "toString" = &**sym {
                return true;
            }
            !usage.accessed_props.contains_key(sym) && !properties_used_via_this.contains(sym)
        };
        let should_preserve = |key: &PropName| match key {
            PropName::Ident(k) => should_preserve_property(&k.sym),
            PropName::Str(k) => should_preserve_property(&k.value),
            PropName::Num(..) => true,
            PropName::Computed(..) => true,
            PropName::BigInt(..) => true,
        };

        let len = obj.props.len();
        obj.props.retain(|prop| match prop {
            PropOrSpread::Spread(_) => {
                unreachable!()
            }
            PropOrSpread::Prop(p) => match &**p {
                Prop::Shorthand(p) => !should_preserve_property(&p.sym),
                Prop::KeyValue(p) => !should_preserve(&p.key),
                Prop::Assign(..) => {
                    unreachable!()
                }
                Prop::Getter(p) => !should_preserve(&p.key),
                Prop::Setter(p) => !should_preserve(&p.key),
                Prop::Method(p) => !should_preserve(&p.key),
            },
        });

        if obj.props.len() != len {
            self.changed = true;
            report_change!("unused: Removing unused properties");
        }

        None
    }
}

#[derive(Default)]
struct ThisPropertyVisitor {
    properties: FxHashSet<JsWord>,

    should_abort: bool,
}

impl Visit for ThisPropertyVisitor {
    noop_visit_type!();

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        if self.should_abort {
            return;
        }

        e.visit_children_with(self);

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
