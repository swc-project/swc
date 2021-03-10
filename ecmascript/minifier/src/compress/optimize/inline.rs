use super::Optimizer;
use swc_atoms::js_word;
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::ExprExt;

/// Methods related to option `inline`.
impl Optimizer<'_> {
    pub(super) fn store_var_for_inining(&mut self, var: &mut VarDeclarator) {
        let init = match &mut var.init {
            Some(v) => v,
            None => return,
        };

        let should_preserve = (!self.options.top_level() && self.options.top_retain.is_empty())
            && self.ctx.in_top_level();

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
                        return;
                    }

                    if usage.cond_init || usage.used_above_decl {
                        return;
                    }

                    if self.options.reduce_vars && self.options.typeofs && !usage.reassigned {
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

                    if is_inline_enabled
                        && !usage.reassigned
                        && match &**init {
                            Expr::Lit(lit) => match lit {
                                Lit::Str(_)
                                | Lit::Bool(_)
                                | Lit::Null(_)
                                | Lit::Num(_)
                                | Lit::BigInt(_) => true,
                                Lit::Regex(_) => self.options.unsafe_regexp,
                                _ => false,
                            },
                            _ => false,
                        }
                    {
                        log::trace!(
                            "inline: Decided to inline '{}{:?}' because it's simple",
                            i.id.sym,
                            i.id.span.ctxt
                        );
                        if self.options.inline != 0 && !should_preserve {
                            self.lits.insert(i.to_id(), init.take());
                        } else {
                            self.lits.insert(i.to_id(), init.clone());
                        }
                        return;
                    }

                    // Single use => inlined
                    if is_inline_enabled
                        && !should_preserve
                        && !usage.reassigned
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
                            Expr::Lit(Lit::Regex(..)) => return,
                            _ => {}
                        }
                        if init.may_have_side_effects() {
                            // TODO: Inline partially
                            return;
                        }

                        log::trace!(
                            "inline: Decided to inline '{}{:?}' because it's used only once",
                            i.id.sym,
                            i.id.span.ctxt
                        );
                        self.changed = true;
                        self.vars_for_inlining.insert(i.to_id(), init.take());
                        return;
                    }
                }
            }
            // TODO
            _ => {}
        }
    }

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

                _ => {}
            }
        }

        false
    }

    pub(super) fn store_typeofs(&mut self, decl: &mut Decl) {
        if !self.options.reduce_vars || !self.options.typeofs {
            return;
        }

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

    /// This method handles only class decl and fn decl. Var decl should be
    /// handled specially.
    pub(super) fn store_decl_for_inlining(&mut self, decl: &mut Decl) {
        if self.options.inline == 0 && !self.options.reduce_vars {
            return;
        }

        if (!self.options.top_level() && self.options.top_retain.is_empty())
            && self.ctx.in_top_level()
        {
            return;
        }

        if self.has_noinline(decl.span()) {
            return;
        }

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
        if i.sym == *"arguments" {
            return;
        }

        // Respect `top_retain`
        if self.ctx.in_top_level() && self.options.top_retain.contains(&i.sym) {
            return;
        }

        if let Some(usage) = self
            .data
            .as_ref()
            .and_then(|data| data.vars.get(&i.to_id()))
        {
            if usage.declared_as_catch_param {
                return;
            }

            // Inline very simple functions.
            match decl {
                Decl::Fn(f) if self.options.inline >= 2 => match &f.function.body {
                    Some(body) => {
                        if self.is_fn_body_simple_enough_to_inline(body) {
                            log::trace!(
                                "inline: Decided to inline function '{}{:?}' as it's very simple",
                                f.ident.sym,
                                f.ident.span.ctxt
                            );
                            self.lits.insert(
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
                },
                _ => {}
            }

            // Single use => inlined
            if (self.options.reduce_vars || self.options.collapse_vars || self.options.inline != 0)
                && usage.ref_count == 1
                && usage.is_fn_local
                && !usage.used_in_loop
            {
                match decl {
                    Decl::Class(ClassDecl {
                        class:
                            Class {
                                super_class: Some(super_class),
                                ..
                            },
                        ..
                    }) => {
                        if super_class.may_have_side_effects() {
                            return;
                        }
                    }
                    _ => {}
                }

                self.changed = true;
                match &decl {
                    Decl::Class(c) => {
                        log::trace!(
                            "inline: Decided to inline class '{}{:?}' as it's used only once",
                            c.ident.sym,
                            c.ident.span.ctxt
                        );
                    }
                    Decl::Fn(f) => {
                        log::trace!(
                            "inline: Decided to inline function '{}{:?}' as it's used only once",
                            f.ident.sym,
                            f.ident.span.ctxt
                        );
                    }
                    _ => {}
                }
                self.vars_for_inlining.insert(
                    i.to_id(),
                    match decl.take() {
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
                    },
                );
                return;
            }
        }
    }

    pub(super) fn inline(&mut self, e: &mut Expr) {
        if self.ctx.inline_prevented {
            return;
        }

        match e {
            Expr::Ident(i) => {
                if self.has_noinline(i.span) {
                    return;
                }
                //
                if let Some(value) = self.lits.get(&i.to_id()).cloned() {
                    self.changed = true;
                    log::trace!("inline: Replacing a variable with cheap expression");

                    *e = *value;
                } else if let Some(value) = self.vars_for_inlining.remove(&i.to_id()) {
                    self.changed = true;
                    log::trace!(
                        "inline: Replacing '{}{:?}' with an expression",
                        i.sym,
                        i.span.ctxt
                    );

                    *e = *value;
                }
            }
            _ => {}
        }
    }
}
