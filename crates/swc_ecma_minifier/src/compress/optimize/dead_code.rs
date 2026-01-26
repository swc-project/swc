use swc_common::util::take::Take;
use swc_ecma_ast::*;

use super::{BitCtx, Optimizer};
use crate::program_data::{ScopeData, VarUsageInfoFlags};

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
        if self.ctx.bit_ctx.contains(BitCtx::InTryBlock) {
            return false;
        }

        if let Expr::Assign(assign @ AssignExpr { op: op!("="), .. }) = e {
            self.optimize_last_expr_before_termination(&mut assign.right);

            // We only handle identifiers on lhs for now.
            if let Some(lhs) = assign.left.as_ident() {
                let used_arguments = self
                    .data
                    .get_scope(self.ctx.scope)
                    .map(|s| s.contains(ScopeData::USED_ARGUMENTS))
                    .unwrap_or(false);

                if self
                    .data
                    .vars
                    .get(&lhs.to_id())
                    .map(|var| {
                        var.flags.contains(
                            VarUsageInfoFlags::DECLARED.union(VarUsageInfoFlags::IS_FN_LOCAL),
                        ) && !(used_arguments
                            && var.flags.contains(VarUsageInfoFlags::DECLARED_AS_FN_PARAM))
                            && !var.flags.intersects(VarUsageInfoFlags::EXPORTED)
                    })
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
                    let used_arguments = self
                        .data
                        .get_scope(self.ctx.scope)
                        .map(|s| s.contains(ScopeData::USED_ARGUMENTS))
                        .unwrap_or(false);

                    if self
                        .data
                        .vars
                        .get(&lhs.to_id())
                        .map(|var| {
                            var.flags.contains(
                                VarUsageInfoFlags::DECLARED.union(VarUsageInfoFlags::IS_FN_LOCAL),
                            ) && !(used_arguments
                                && var.flags.contains(VarUsageInfoFlags::DECLARED_AS_FN_PARAM))
                                && !var.flags.contains(VarUsageInfoFlags::EXPORTED)
                        })
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
