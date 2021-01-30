use super::Optimizer;
use swc_atoms::js_word;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::ExprExt;

/// Methods related to option `inline`.
impl Optimizer {
    pub(super) fn store_var_for_inining(&mut self, var: &mut VarDeclarator) {
        let init = match &mut var.init {
            Some(v) => v,
            None => return,
        };

        if (!self.options.top_level && self.options.top_retain.is_empty())
            && self.ctx.in_top_level()
        {
            return;
        }

        // TODO: Check for side effect between original decl position and inlined
        // position

        // We will inline if possible.
        match &var.name {
            Pat::Ident(i) => {
                if i.sym == *"arguments" {
                    return;
                }

                // Store variables if it's used only once
                if let Some(usage) = self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&i.to_id()))
                {
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

                    if self.options.inline
                        && !usage.reassigned
                        && match &**init {
                            Expr::Lit(..) => true,
                            _ => false,
                        }
                    {
                        self.vars.insert(i.to_id(), init.clone());
                        return;
                    }

                    // Single use => inlined
                    if (self.options.reduce_vars
                        || self.options.collapse_vars
                        || self.options.inline
                        || self.options.defaults)
                        && usage.ref_count == 1
                    {
                        if init.may_have_side_effects() {
                            // TODO: Inline partially
                            return;
                        }

                        self.vars.insert(i.to_id(), init.take());
                        return;
                    }
                }
            }
            // TODO
            _ => {}
        }
    }

    /// This method handles only class decl and fn decl. Var decl should be
    /// handled specially.
    pub(super) fn store_decl_for_inlining(&mut self, decl: &mut Decl) {
        if !self.options.inline && !self.options.reduce_vars {
            return;
        }

        if (!self.options.top_level && self.options.top_retain.is_empty())
            && self.ctx.in_top_level()
        {
            return;
        }

        let i = match &*decl {
            Decl::Class(v) => v.ident.clone(),
            Decl::Fn(f) => f.ident.clone(),
            _ => return,
        };

        // Respect `top_retain`
        if self.ctx.in_top_level() && self.options.top_retain.contains(&i.sym) {
            return;
        }

        if let Some(usage) = self
            .data
            .as_ref()
            .and_then(|data| data.vars.get(&i.to_id()))
        {
            if self.options.reduce_vars && self.options.typeofs && !usage.reassigned {
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

            // Single use => inlined
            if (self.options.reduce_vars
                || self.options.collapse_vars
                || self.options.inline
                || self.options.defaults)
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
                self.vars.insert(
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
}
