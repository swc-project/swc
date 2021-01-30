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

        // TODO: Check for side effect between original decl position and inlined
        // position

        // We will inline if possible.
        match &var.name {
            Pat::Ident(i) => {
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

    pub(super) fn store_decl_for_inlining(&mut self, decl: &mut Decl) {
        if !self.options.inline {
            return;
        }
    }
}
