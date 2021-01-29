use super::Optimizer;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
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
                        "unused: Dropping a variable '{}{:?}' because it is not used",
                        i.sym,
                        i.span.ctxt
                    );
                    // This will remove variable.
                    name.take();
                    return;
                }
            }
            _ => {}
        }
    }

    /// Creates an empty [VarDecl] if `decl` should be removed.
    pub(super) fn drop_unused_decl(&mut self, decl: &mut Decl) {
        if !self.options.unused || self.ctx.is_exported_decl {
            return;
        }

        match decl {
            Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                if self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&ident.to_id()))
                    .map(|v| v.ref_count == 0)
                    .unwrap_or(false)
                {
                    self.changed = true;
                    log::trace!(
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
}
