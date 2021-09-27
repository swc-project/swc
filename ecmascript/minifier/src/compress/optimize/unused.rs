use super::Optimizer;
use crate::{
    compress::optimize::util::class_has_side_effect, debug::dump, mode::Mode,
    option::PureGetterOption,
};
use swc_atoms::js_word;
use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_ident_ref, ident::IdentLike};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

/// Methods related to the option `unused`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    pub(super) fn drop_unused_var_declarator(&mut self, var: &mut VarDeclarator, prepend: bool) {
        if var.name.is_invalid() {
            return;
        }

        match &mut var.init {
            Some(init) => match &**init {
                Expr::Invalid(..) => {
                    var.init = None;
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
                        let side_effects = self.ignore_return_value(init);
                        if let Some(e) = side_effects {
                            if prepend {
                                self.prepend_stmts.push(Stmt::Expr(ExprStmt {
                                    span: var.span,
                                    expr: Box::new(e),
                                }))
                            } else {
                                self.append_stmts.insert(
                                    0,
                                    Stmt::Expr(ExprStmt {
                                        span: var.span,
                                        expr: Box::new(e),
                                    }),
                                )
                            }
                        }
                    }
                }
            },
            None => {
                self.drop_unused_vars(var.span, &mut var.name, var.init.as_deref_mut());
            }
        }
    }

    pub(super) fn drop_unused_param(&mut self, pat: &mut Pat) {
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

        // Preserve `length` of function.
        if pat.is_ident() {
            return;
        }

        self.take_pat_if_unused(DUMMY_SP, pat, None)
    }

    pub(super) fn drop_unused_vars(
        &mut self,
        var_declarator_span: Span,
        name: &mut Pat,
        init: Option<&mut Expr>,
    ) {
        let has_mark = var_declarator_span.has_mark(self.marks.non_top_level);

        if !has_mark {
            if !self.options.unused
                || self.ctx.in_var_decl_of_for_in_or_of_loop
                || self.ctx.is_exported
            {
                return;
            }
        }

        if cfg!(feature = "debug") {
            tracing::trace!("unused: drop_unused_vars({})", dump(&*name));
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
                                    dump(&*name)
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
                                dump(&*name)
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
                        dump(&*name)
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

    pub(super) fn drop_unused_params(&mut self, params: &mut Vec<Param>) {
        for param in params.iter_mut().rev() {
            self.take_pat_if_unused(DUMMY_SP, &mut param.pat, None);

            if !param.pat.is_invalid() {
                return;
            }
        }
    }

    /// `parent_span` should be [Span] of [VarDeclarator] or [AssignExpr]
    pub(super) fn take_pat_if_unused(
        &mut self,
        parent_span: Span,
        name: &mut Pat,
        mut init: Option<&mut Expr>,
    ) {
        let had_value = init.is_some();
        let can_drop_children = had_value;

        if !name.is_ident() {
            // TODO: Use smart logic
            if self.options.pure_getters != PureGetterOption::Bool(true) {
                return;
            }
        }

        match name {
            Pat::Ident(i) => {
                if !parent_span.has_mark(self.marks.non_top_level)
                    && self.options.top_retain.contains(&i.id.sym)
                {
                    if cfg!(feature = "debug") {
                        tracing::trace!("unused: [X] Top-retain")
                    }
                    return;
                }

                if self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&i.to_id()))
                    .map(|v| v.ref_count == 0)
                    .unwrap_or(false)
                {
                    self.changed = true;
                    tracing::debug!(
                        "unused: Dropping a variable '{}{:?}' because it is not used",
                        i.id.sym,
                        i.id.span.ctxt
                    );
                    // This will remove variable.
                    name.take();
                    return;
                } else {
                    if cfg!(feature = "debug") {
                        tracing::trace!("unused: Cannot drop ({}) becaue it's used", dump(&*i));
                    }
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

                arr.elems.retain(|elem| match elem {
                    Some(Pat::Invalid(..)) => false,
                    _ => true,
                })
            }

            Pat::Object(obj) => {
                // If a rest pattern exists, we can't remove anything at current level.
                if obj.props.iter().any(|p| match p {
                    ObjectPatProp::Rest(_) => true,
                    _ => false,
                }) {
                    return;
                }

                for prop in &mut obj.props {
                    match prop {
                        ObjectPatProp::KeyValue(p) => {
                            if p.key.is_computed() {
                                continue;
                            }

                            let prop = init.as_mut().and_then(|value| {
                                self.access_property_with_prop_name(value, &p.key)
                            });

                            if can_drop_children && prop.is_none() {
                                continue;
                            }

                            self.take_pat_if_unused(parent_span, &mut p.value, prop);
                        }
                        ObjectPatProp::Assign(_) => {}
                        ObjectPatProp::Rest(_) => {}
                    }
                }

                obj.props.retain(|p| {
                    match p {
                        ObjectPatProp::KeyValue(p) => {
                            if p.value.is_invalid() {
                                return false;
                            }
                        }
                        ObjectPatProp::Assign(_) => {}
                        ObjectPatProp::Rest(_) => {}
                    }

                    true
                })
            }

            Pat::Rest(_) => {}
            Pat::Assign(_) => {
                // TODO
            }
            _ => {}
        }
    }

    /// Creates an empty [VarDecl] if `decl` should be removed.
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

        match decl {
            Decl::Class(c) => {
                if class_has_side_effect(&c.class) {
                    return;
                }
            }
            _ => {}
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
                    .map(|v| v.ref_count == 0)
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
                    return;
                }
            }

            Decl::Var(_) => {
                // Variable declarations are handled by other functions.
                return;
            }

            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {
                // Nothing to do. We might change this to unreachable!()
                return;
            }
        }
    }

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

        if cfg!(feature = "debug") {
            tracing::trace!(
                "unused: drop_unused_assignments: Target: `{}`",
                dump(&assign.left)
            )
        }

        if !has_mark
            && (!self.options.top_level() && self.options.top_retain.is_empty())
            && self.ctx.in_top_level()
        {
            if cfg!(feature = "debug") {
                tracing::trace!(
                    "unused: Preserving assignment to `{}` because it's top-level",
                    dump(&assign.left)
                )
            }
            return;
        }

        match &mut assign.left {
            PatOrExpr::Expr(_) => {
                if cfg!(feature = "debug") {
                    tracing::trace!(
                        "unused: Preserving assignment to `{}` because it's an expression",
                        dump(&assign.left)
                    )
                }
                return;
            }
            PatOrExpr::Pat(left) => match &**left {
                Pat::Ident(i) => {
                    if self.options.top_retain.contains(&i.id.sym) {
                        return;
                    }

                    if let Some(var) = self
                        .data
                        .as_ref()
                        .and_then(|data| data.vars.get(&i.to_id()))
                    {
                        if var.is_fn_local && var.usage_count == 0 && var.declared {
                            tracing::debug!(
                                "unused: Dropping assignment to var '{}{:?}', which is never used",
                                i.id.sym,
                                i.id.span.ctxt
                            );
                            self.changed = true;
                            *e = *assign.right.take();
                            return;
                        } else {
                            if cfg!(feature = "debug") {
                                tracing::trace!(
                                    "unused: Preserving assignment to `{}` because of usage: {:?}",
                                    dump(&assign.left),
                                    var
                                )
                            }
                        }
                    }
                }
                _ => return,
            },
        }
    }

    /// Make `name` [None] if the name is not used.
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
                    .map(|v| v.ref_count == 0 || v.var_kind.is_some())
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

        match v.init.as_deref_mut() {
            Some(Expr::Fn(f)) => {
                if f.ident.is_none() {
                    return;
                }

                if contains_ident_ref(&f.function.body, f.ident.as_ref().unwrap()) {
                    return;
                }

                self.changed = true;
                tracing::debug!(
                    "unused: Removing the name of a function expression because it's not used by \
                     it'"
                );
                f.ident = None;
            }

            _ => {}
        }
    }
}

#[derive(Debug, Default)]
pub(super) struct UnreachableHandler {
    vars: Vec<Ident>,
    in_var_name: bool,
    in_hoisted_var: bool,
}

impl UnreachableHandler {
    /// Asssumes `s` is not reachable, and preserves variable declarations and
    /// function declarations in `s`.
    ///
    /// Returns true if statement is chnged.
    pub fn preserve_vars(s: &mut Stmt) -> bool {
        if s.is_empty() {
            return false;
        }
        match s {
            Stmt::Decl(Decl::Var(v)) => {
                let mut changed = false;
                for decl in &mut v.decls {
                    if decl.init.is_some() {
                        decl.init = None;
                        changed = true;
                    }
                }

                return changed;
            }
            _ => {}
        }

        let mut v = Self::default();
        s.visit_mut_with(&mut v);
        if v.vars.is_empty() {
            *s = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
        } else {
            *s = Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: v
                    .vars
                    .into_iter()
                    .map(BindingIdent::from)
                    .map(Pat::Ident)
                    .map(|name| VarDeclarator {
                        span: DUMMY_SP,
                        name,
                        init: None,
                        definite: false,
                    })
                    .collect(),
            }))
        }

        true
    }
}

impl VisitMut for UnreachableHandler {
    noop_visit_mut_type!();

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        n.visit_mut_children_with(self);

        if self.in_var_name && self.in_hoisted_var {
            match n {
                Pat::Ident(i) => {
                    self.vars.push(i.id.clone());
                }
                _ => {}
            }
        }
    }

    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        self.in_hoisted_var = n.kind == VarDeclKind::Var;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        self.in_var_name = true;
        n.name.visit_mut_with(self);
        self.in_var_name = false;
        n.init.visit_mut_with(self);
    }

    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    fn visit_mut_function(&mut self, _: &mut Function) {}
}
