use super::Optimizer;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;

impl Optimizer {
    ///
    pub(super) fn drop_unused_vars(&mut self, name: &mut Pat) {
        if !self.options.unused
            || self.ctx.in_var_decl_of_for_in_or_of_loop
            || self.ctx.is_exported_decl
        {
            return;
        }

        match name {
            Pat::Ident(i) => {
                if self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&i.to_id()))
                    .map(|v| v.ref_count == 0)
                    .unwrap_or(false)
                {
                    self.changed = true;
                    log::trace!(
                        "unused: Dropping a variable '{}{:?}' because it is never used",
                        i.sym,
                        i.span.ctxt
                    );
                    *name = Pat::Invalid(Invalid { span: DUMMY_SP });
                    return;
                }
            }
            _ => {}
        }
    }

    /// Creates an empty [VarDecl] if `decl` should be removed.
    pub(super) fn drop_unused_decl(&mut self, decl: &mut Decl) {
        if !self.options.unused {
            return;
        }
    }
}
