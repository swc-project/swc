use super::Optimizer;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;

/// Methods related to option `dead_code`.
impl Optimizer {
    /// Optimize return value or argument of throw.
    ///
    /// This methods removes some useless assignments.
    ///
    /// # Example
    ///
    /// Note: `a` being declared in the function is important in the example
    /// below.
    ///
    /// ```ts
    /// function foo(){
    ///     var a;
    ///     throw a = x();
    /// }
    /// ```
    ///
    /// can be optimized as
    ///
    /// ```ts
    /// function foo(){
    ///     var a; // Will be dropped in next pass.
    ///     throw x();
    /// }
    /// ```
    pub(super) fn optimize_in_fn_termiation(&mut self, e: &mut Expr) {
        if !self.options.dead_code {
            return;
        }

        match e {
            Expr::Assign(assign) => {
                self.optimize_in_fn_termiation(&mut assign.right);

                // We only handle identifiers on lhs for now.
                match &assign.left {
                    PatOrExpr::Pat(lhs) => match &**lhs {
                        Pat::Ident(lhs) => {
                            //
                            if self
                                .data
                                .as_ref()
                                .and_then(|data| data.vars.get(&lhs.to_id()))
                                .map(|var| var.is_fn_local)
                                .unwrap_or(false)
                            {
                                log::trace!(
                                    "dead_code: Dropping an assigment to a varaible declared in \
                                     function because function is being terminated"
                                );
                                self.changed = true;
                                *e = *assign.right.take();
                                return;
                            }
                        }
                        _ => {}
                    },
                    _ => {}
                }
            }
            _ => {}
        }
    }
}
