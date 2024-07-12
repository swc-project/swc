use swc_common::util::take::Take;
use swc_ecma_ast::*;

use super::Optimizer;

/// Methods related to option `dead_code`.
impl Optimizer<'_> {
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
    /// # Returns
    ///
    /// returns true if `e` is changed.
    pub(super) fn optimize_last_expr_before_termination(&mut self, e: &mut Expr) -> bool {
        if !self.options.dead_code {
            return false;
        }

        // A return statement in a try block may not terminate function.
        if self.ctx.in_try_block {
            return false;
        }

        if let Expr::Assign(assign @ AssignExpr { op: op!("="), .. }) = e {
            self.optimize_last_expr_before_termination(&mut assign.right);

            // We only handle identifiers on lhs for now.
            if let Some(lhs) = assign.left.as_ident() {
                if self
                    .data
                    .vars
                    .get(&lhs.to_id())
                    .map(|var| var.declared && var.is_fn_local && !var.declared_as_fn_param)
                    .unwrap_or(false)
                {
                    report_change!(
                        "dead_code: Dropping an assignment to a variable declared in function \
                         because function is being terminated"
                    );
                    self.changed = true;
                    *e = *assign.right.take();
                    return true;
                }
            }
        }

        if let Expr::Assign(assign) = e {
            // x += 1 => x + 1
            if let Some(op) = assign.op.to_update() {
                if op == op!("**") {
                    return false;
                }

                if let Some(lhs) = assign.left.as_ident() {
                    //
                    if self
                        .data
                        .vars
                        .get(&lhs.to_id())
                        .map(|var| var.declared && var.is_fn_local)
                        .unwrap_or(false)
                    {
                        report_change!(
                            "dead_code: Converting an assignment into a binary expression in \
                             function termination"
                        );

                        self.changed = true;
                        *e = BinExpr {
                            span: assign.span,
                            op,
                            left: lhs.clone().into(),
                            right: assign.right.take(),
                        }
                        .into();
                        return true;
                    }
                }
            }
        }

        false
    }
}
