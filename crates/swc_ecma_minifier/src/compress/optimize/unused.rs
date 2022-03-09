use swc_atoms::js_word;
use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_ident_ref, ident::IdentLike};

use super::Optimizer;
use crate::{
    compress::optimize::util::class_has_side_effect, debug::dump, mode::Mode,
    option::PureGetterOption,
};

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
                        tracing::debug!("unused: Removing an unused variable declarator");
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

        if let Some(scope) = self
            .data
            .as_ref()
            .and_then(|data| data.scopes.get(&self.ctx.scope))
        {
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

        self.take_pat_if_unused(DUMMY_SP, pat, None)
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

        if cfg!(feature = "debug") {
            tracing::trace!("unused: drop_unused_vars({})", dump(&*name, false));
        }

        // Top-level
        if !has_mark {
            match self.ctx.var_kind {
                Some(VarDeclKind::Var) => {
                    if !self.options.top_level() && self.options.top_retain.is_empty() {
                        if self.ctx.in_top_level() {
                            if cfg!(feature = "debug") {
                                tracing::trace!(
                                    "unused: [X] Preserving `var` `{}` because it's top-level",
                                    dump(&*name, false)
                                );
                            }

                            return;
                        }
                    }
                }
                Some(VarDeclKind::Let) | Some(VarDeclKind::Const) => {
                    if !self.options.top_level() && self.ctx.is_top_level_for_block_level_vars() {
                        if cfg!(feature = "debug") {
                            tracing::trace!(
                                "unused: [X] Preserving block scoped var `{}` because it's \
                                 top-level",
                                dump(&*name, false)
                            );
                        }
                        return;
                    }
                }
                None => {}
            }
        }

        if let Some(scope) = self
            .data
            .as_ref()
            .and_then(|data| data.scopes.get(&self.ctx.scope))
        {
            if scope.has_eval_call || scope.has_with_stmt {
                if cfg!(feature = "debug") {
                    tracing::trace!(
                        "unused: [X] Preserving `{}` because of usages",
                        dump(&*name, false)
                    );
                }
                return;
            }
        }

        if !name.is_ident() && init.is_none() {
            return;
        }

        self.take_pat_if_unused(var_declarator_span, name, init);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_params(&mut self, params: &mut Vec<Param>) {
        for param in params.iter_mut().rev() {
            self.take_pat_if_unused(DUMMY_SP, &mut param.pat, None);

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
        if cfg!(debug_assertions) {
            tracing::trace!("unused: Checking identifier `{}`", i);
        }

        if !parent_span.has_mark(self.marks.non_top_level)
            && self.options.top_retain.contains(&i.sym)
        {
            if cfg!(feature = "debug") {
                tracing::trace!("unused: [X] Top-retain")
            }
            return;
        }

        if let Some(v) = self
            .data
            .as_ref()
            .and_then(|data| data.vars.get(&i.to_id()).cloned())
        {
            if v.ref_count == 0
                && v.usage_count == 0
                && !v.reassigned_with_assignment
                && !v.has_property_mutation
                && !v.declared_as_catch_param
            {
                self.changed = true;
                tracing::debug!(
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

            if cfg!(feature = "debug") {
                tracing::trace!(
                    "unused: Cannot drop ({}) because it's used",
                    dump(&*i, false)
                );
            }
        }
    }

    /// `parent_span` should be [Span] of [VarDeclarator] or [AssignExpr]
    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn take_pat_if_unused(
        &mut self,
        parent_span: Span,
        name: &mut Pat,
        mut init: Option<&mut Expr>,
    ) {
        if self.ctx.is_exported {
            return;
        }

        if !name.is_ident() {
            // TODO: Use smart logic
            if self.options.pure_getters != PureGetterOption::Bool(true) {
                return;
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

                            self.take_pat_if_unused(parent_span, p, elem);
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

                            self.take_pat_if_unused(parent_span, &mut p.value, None);
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

        if let Some(scope) = self
            .data
            .as_ref()
            .and_then(|data| data.scopes.get(&self.ctx.scope))
        {
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
                    .as_ref()
                    .and_then(|data| data.vars.get(&ident.to_id()))
                    .map(|v| v.usage_count == 0 && !v.has_property_mutation)
                    .unwrap_or(false)
                {
                    self.changed = true;
                    tracing::debug!(
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

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    pub(super) fn drop_unused_assignments(&mut self, e: &mut Expr) {
        let assign = match e {
            Expr::Assign(e) => e,
            _ => return,
        };

        let has_mark = assign.span.has_mark(self.marks.non_top_level);

        if !has_mark && !self.options.unused {
            return;
        }

        if self.ctx.is_delete_arg {
            return;
        }

        if self
            .data
            .as_ref()
            .map(|v| v.top.has_eval_call || v.top.has_with_stmt)
            .unwrap_or(false)
        {
            return;
        }

        let used_arguments = self
            .data
            .as_ref()
            .map(|data| {
                data.scopes.get(&self.ctx.scope).unwrap_or_else(|| {
                    unreachable!(
                        "scope should exist\nScopes: {:?};\nCtxt: {:?}",
                        data.scopes, self.ctx.scope
                    )
                })
            })
            .map(|scope| scope.used_arguments)
            .unwrap_or(false);

        if cfg!(feature = "debug") {
            tracing::trace!(
                "unused: drop_unused_assignments: Target: `{}`",
                dump(&assign.left, false)
            )
        }

        if !has_mark
            && (!self.options.top_level() && self.options.top_retain.is_empty())
            && self.ctx.in_top_level()
        {
            if cfg!(feature = "debug") {
                tracing::trace!(
                    "unused: Preserving assignment to `{}` because it's top-level",
                    dump(&assign.left, false)
                )
            }
            return;
        }

        match &mut assign.left {
            PatOrExpr::Expr(_) => {
                if cfg!(feature = "debug") {
                    tracing::trace!(
                        "unused: Preserving assignment to `{}` because it's an expression",
                        dump(&assign.left, false)
                    )
                }
            }
            PatOrExpr::Pat(left) => {
                if let Pat::Ident(i) = &**left {
                    if self.options.top_retain.contains(&i.id.sym) {
                        return;
                    }

                    if let Some(var) = self
                        .data
                        .as_ref()
                        .and_then(|data| data.vars.get(&i.to_id()))
                    {
                        if var.is_fn_local
                            && var.usage_count == 0
                            && var.declared
                            && (!var.declared_as_fn_param || !used_arguments || self.ctx.in_strict)
                        {
                            tracing::debug!(
                                "unused: Dropping assignment to var '{}{:?}', which is never used",
                                i.id.sym,
                                i.id.span.ctxt
                            );
                            self.changed = true;
                            *e = *assign.right.take();
                        } else {
                            if cfg!(feature = "debug") {
                                tracing::trace!(
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
            if let Some(data) = &self.data {
                let can_remove_ident = data
                    .vars
                    .get(&i.to_id())
                    .map(|v| (v.ref_count == 0 && v.usage_count == 0) || v.var_kind.is_some())
                    .unwrap_or(true);

                if can_remove_ident {
                    self.changed = true;
                    tracing::debug!("Removing ident of an class / function expression");
                    *name = None;
                }
            }
        }
    }

    /// `var Parser = function Parser() {};` => `var Parser = function () {}`
    pub(super) fn remove_duplicate_names(&mut self, v: &mut VarDeclarator) {
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
            tracing::debug!(
                "unused: Removing the name of a function expression because it's not used by it'"
            );
            f.ident = None;
        }
    }
}
