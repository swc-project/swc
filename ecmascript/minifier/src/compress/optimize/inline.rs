use super::Optimizer;
use crate::{
    compress::optimize::util::{class_has_side_effect, is_valid_for_lhs},
    debug::dump,
    mode::Mode,
    util::idents_used_by,
};
use swc_atoms::js_word;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{ident::IdentLike, ExprExt, UsageFinder};

/// Methods related to option `inline`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// Stores the value of a variable to inline it.
    ///
    /// This method may remove value of initializer. It mean that the value will
    /// be inlined and should be removed from [Vec<VarDeclarator>].
    pub(super) fn store_var_for_inining(&mut self, var: &mut VarDeclarator) {
        let init = match &mut var.init {
            Some(v) => v,
            None => return,
        };

        let should_preserve = !var.span.has_mark(self.marks.non_top_level)
            && (!self.options.top_level() && self.options.top_retain.is_empty())
            && self.ctx.in_top_level();

        if cfg!(feature = "debug") {
            log::trace!(
                "inline: store_var_for_inining({}, should_preserve = {:?})",
                dump(&var.name),
                should_preserve
            );
        }

        if self
            .data
            .as_ref()
            .map(|v| v.top.has_eval_call)
            .unwrap_or(false)
        {
            return;
        }

        // TODO: Check for side effect between original decl position and inlined
        // position

        // We will inline if possible.
        match &var.name {
            Pat::Ident(i) => {
                if i.id.sym == *"arguments" {
                    return;
                }
                if self.options.top_retain.contains(&i.id.sym) {
                    return;
                }

                // Store variables if it's used only once
                if let Some(usage) = self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&i.to_id()))
                {
                    if usage.declared_as_catch_param {
                        return;
                    }

                    if should_preserve && usage.var_kind != Some(VarDeclKind::Const) {
                        if cfg!(feature = "debug") {
                            log::trace!(
                                "inline: [x] Preserving non-const variable `{}` because it's \
                                 top-level",
                                dump(&var.name)
                            );
                        }
                        return;
                    }

                    if usage.cond_init || usage.used_above_decl {
                        if cfg!(feature = "debug") {
                            log::trace!("inline: [x] It's cond init or used before decl",);
                        }
                        return;
                    }

                    if !usage.is_fn_local {
                        match &**init {
                            Expr::Lit(..) => {}

                            Expr::Unary(UnaryExpr {
                                op: op!("!"), arg, ..
                            }) if match &**arg {
                                Expr::Lit(..) => true,
                                _ => false,
                            } => {}

                            Expr::Fn(FnExpr {
                                function:
                                    Function {
                                        body: Some(body), ..
                                    },
                                ..
                            }) => {
                                if body.stmts.len() == 1
                                    && match &body.stmts[0] {
                                        Stmt::Return(..) => true,
                                        _ => false,
                                    }
                                {
                                } else {
                                    if cfg!(feature = "debug") {
                                        log::trace!("inline: [x] It's not fn-local");
                                    }
                                    return;
                                }
                            }
                            _ => {
                                if cfg!(feature = "debug") {
                                    log::trace!("inline: [x] It's not fn-local");
                                }
                                return;
                            }
                        }
                    }

                    if !usage.reassigned {
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

                    // No use => doppred
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
                        && (!usage.mutated || (usage.assign_count == 0 && !usage.reassigned))
                        && match &**init {
                            Expr::Lit(lit) => match lit {
                                Lit::Str(_) => true,
                                Lit::Bool(_) | Lit::Null(_) | Lit::Num(_) | Lit::BigInt(_) => true,
                                Lit::Regex(_) => self.options.unsafe_regexp,
                                _ => false,
                            },
                            Expr::This(..) => usage.is_fn_local,
                            Expr::Arrow(arr) => is_arrow_simple_enough(arr),
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
                            log::debug!(
                                "inline: Decided to inline '{}{:?}' because it's simple",
                                i.id.sym,
                                i.id.span.ctxt
                            );

                            self.lits.insert(i.to_id(), init.take());
                        } else {
                            log::debug!(
                                "inline: Decided to copy '{}{:?}' because it's simple",
                                i.id.sym,
                                i.id.span.ctxt
                            );

                            self.lits.insert(i.to_id(), init.clone());
                        }
                        return;
                    }

                    if self.ctx.inline_as_assignment {
                        if cfg!(feature = "debug") {
                            log::trace!("inline: [x] inline_as_assignment is true");
                        }
                        return;
                    }

                    // Single use => inlined
                    if is_inline_enabled
                        && !should_preserve
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
                                if !usage.is_fn_local || usage.used_in_loop {
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

                        if usage.used_in_loop {
                            match &**init {
                                Expr::Lit(..) | Expr::Fn(..) => {}
                                _ => {
                                    return;
                                }
                            }
                        }

                        if init.may_have_side_effects() {
                            return;
                        }

                        log::debug!(
                            "inline: Decided to inline '{}{:?}' because it's used only once",
                            i.id.sym,
                            i.id.span.ctxt
                        );
                        self.changed = true;
                        self.state.vars_for_inlining.insert(i.to_id(), init.take());
                        return;
                    }
                }
            }
            // TODO
            _ => {}
        }
    }

    /// Check if the body of a function is simple enough to inline.
    fn is_fn_body_simple_enough_to_inline(&self, body: &BlockStmt) -> bool {
        if body.stmts.len() == 1 {
            match &body.stmts[0] {
                Stmt::Expr(ExprStmt { expr, .. }) => match &**expr {
                    Expr::Lit(..) => return true,
                    _ => {}
                },

                Stmt::Return(ReturnStmt { arg, .. }) => match arg.as_deref() {
                    Some(Expr::Lit(Lit::Num(..))) => return true,
                    _ => {}
                },

                Stmt::Try(TryStmt { block, .. }) => {
                    return self.is_fn_body_simple_enough_to_inline(block)
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

        if let Some(usage) = self
            .data
            .as_ref()
            .and_then(|data| data.vars.get(&i.to_id()))
        {
            if !usage.reassigned {
                log::trace!("typeofs: Storing typeof `{}{:?}`", i.sym, i.span.ctxt);
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

        if cfg!(feature = "debug") {
            log::trace!("inline: Trying to inline decl ({}{:?})", i.sym, i.span.ctxt);
        }

        if self.options.inline == 0 && !self.options.reduce_vars {
            if cfg!(feature = "debug") {
                log::trace!("inline: [x] Inline disabled");
            }
            return;
        }

        if (!self.options.top_level() && self.options.top_retain.is_empty())
            && self.ctx.in_top_level()
        {
            if cfg!(feature = "debug") {
                log::trace!("inline: [x] Top level");
            }
            return;
        }

        if self.has_noinline(decl.span()) {
            if cfg!(feature = "debug") {
                log::trace!("inline: [x] Has noinline");
            }
            return;
        }

        // Respect `top_retain`
        if self.ctx.in_top_level() && self.options.top_retain.contains(&i.sym) {
            if cfg!(feature = "debug") {
                log::trace!("inline: [x] top_retain");
            }
            return;
        }

        if self.ctx.is_exported {
            if cfg!(feature = "debug") {
                log::trace!("inline: [x] exported");
            }
            return;
        }

        if self.ctx.inline_as_assignment {
            if cfg!(feature = "debug") {
                log::trace!("inline: [x] inline_as_assignment=true");
            }
            return;
        }

        if self
            .data
            .as_ref()
            .map(|data| data.top.has_eval_call || data.top.has_with_stmt)
            .unwrap_or_default()
        {
            return;
        }

        if let Some(usage) = self
            .data
            .as_ref()
            .and_then(|data| data.vars.get(&i.to_id()))
        {
            if usage.declared_as_catch_param {
                if cfg!(feature = "debug") {
                    log::trace!("inline: [x] Declared as a catch paramter");
                }
                return;
            }

            if usage.reassigned || usage.inline_prevented {
                if cfg!(feature = "debug") {
                    log::trace!(
                        "inline: [x] reassigned = {}, inline_prevented = {}",
                        usage.reassigned,
                        usage.inline_prevented
                    );
                }
                return;
            }

            // Inline very simple functions.
            match decl {
                Decl::Fn(f) if self.options.inline >= 2 && f.ident.sym != *"arguments" => {
                    match &f.function.body {
                        Some(body) => {
                            if !UsageFinder::find(&i, body)
                                && self.is_fn_body_simple_enough_to_inline(body)
                            {
                                log::debug!(
                                    "inline: Decided to inline function '{}{:?}' as it's very \
                                     simple",
                                    f.ident.sym,
                                    f.ident.span.ctxt
                                );

                                self.state.vars_for_inlining.insert(
                                    i.to_id(),
                                    match decl {
                                        Decl::Fn(f) => Box::new(Expr::Fn(FnExpr {
                                            ident: Some(f.ident.clone()),
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
                && usage.is_fn_local
                && !usage.used_in_loop
                && (match decl {
                    Decl::Class(..) => !usage.used_above_decl,
                    Decl::Fn(..) => true,
                    _ => false,
                })
            {
                match decl {
                    Decl::Class(ClassDecl { class, .. }) => {
                        if class_has_side_effect(&class) {
                            return;
                        }
                    }
                    _ => {}
                }

                self.changed = true;
                match &decl {
                    Decl::Class(c) => {
                        log::debug!(
                            "inline: Decided to inline class '{}{:?}' as it's used only once",
                            c.ident.sym,
                            c.ident.span.ctxt
                        );
                    }
                    Decl::Fn(f) => {
                        log::debug!(
                            "inline: Decided to inline function '{}{:?}' as it's used only once",
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
                if usage.used_above_decl {
                    self.state.inlined_vars.insert(i.to_id(), e);
                } else {
                    self.state.vars_for_inlining.insert(i.to_id(), e);
                }

                return;
            } else {
                if cfg!(feature = "debug") {
                    log::trace!("inline: [x] Usage: {:?}", usage);
                }
            }
        }
    }

    /// Actually inlines variables.
    pub(super) fn inline(&mut self, e: &mut Expr) {
        if self.ctx.inline_prevented {
            return;
        }

        match e {
            Expr::Ident(i) => {
                //
                if let Some(value) = self
                    .lits
                    .get(&i.to_id())
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
                            if self.ctx.in_lhs_of_assign {
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
                    log::debug!("inline: Replacing a variable with cheap expression");

                    *e = *value;
                    return;
                }

                if let Some(value) = self.state.vars_for_inlining.get(&i.to_id()) {
                    if self.ctx.is_exact_lhs_of_assign && !is_valid_for_lhs(&value) {
                        return;
                    }

                    match &**value {
                        Expr::Member(..) => {
                            if self.ctx.executed_multiple_time {
                                return;
                            }
                        }
                        _ => {}
                    }
                }

                if self.ctx.inline_as_assignment {
                    if let Some(value) = self.state.vars_for_inlining.remove(&i.to_id()) {
                        self.changed = true;
                        log::debug!(
                            "inline: Inlining '{}{:?}' using assignment",
                            i.sym,
                            i.span.ctxt
                        );

                        *e = Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: PatOrExpr::Pat(Box::new(Pat::Ident(i.clone().into()))),
                            right: value,
                        });

                        if cfg!(feature = "debug") {
                            log::trace!("inline: [Change] {}", dump(&*e))
                        }
                        return;
                    }
                }

                if let Some(value) = self.state.vars_for_inlining.get(&i.to_id()) {
                    self.changed = true;
                    log::debug!(
                        "inline: Replacing '{}{:?}' with an expression",
                        i.sym,
                        i.span.ctxt
                    );

                    *e = *value.clone();

                    if cfg!(feature = "debug") {
                        log::trace!("inline: [Change] {}", dump(&*e))
                    }
                }
            }
            _ => {}
        }
    }
}

fn is_arrow_simple_enough(e: &ArrowExpr) -> bool {
    if e.is_async {
        return false;
    }

    fn is_arrow_body_simple_enough(e: &Expr) -> bool {
        match e {
            Expr::Ident(..) | Expr::Lit(..) => return true,
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(..),
                computed: false,
                ..
            }) => return true,
            Expr::Unary(u) => return is_arrow_body_simple_enough(&u.arg),

            Expr::Bin(b) => {
                return is_arrow_body_simple_enough(&b.left)
                    && is_arrow_body_simple_enough(&b.right)
            }
            _ => {}
        }

        false
    }
    match &e.body {
        BlockStmtOrExpr::Expr(e) => return is_arrow_body_simple_enough(&e),
        _ => {}
    }

    false
}
