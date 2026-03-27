use swc_ecma_ast::*;

use super::Optimizer;
use crate::program_data::VarUsageInfoFlags;

impl Optimizer<'_> {
    /// Drop trailing call arguments that are guaranteed to be unused by a
    /// known function binding.
    pub(super) fn drop_unused_args_of_known_fn_call(&mut self, e: &mut CallExpr) {
        if !self.options.unused && !self.options.reduce_vars {
            return;
        }

        let callee = match &e.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(callee) => match &**callee {
                Expr::Ident(callee) => callee,
                _ => return,
            },
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        };

        let Some(usage) = self.data.vars.get(&callee.to_id()) else {
            return;
        };
        if usage.flags.contains(VarUsageInfoFlags::REASSIGNED) {
            return;
        }

        let Some(metadata) = self.functions.get(&callee.to_id()) else {
            return;
        };

        if metadata.has_rest || metadata.uses_arguments {
            return;
        }

        if e.args.len() <= metadata.param_count {
            return;
        }

        if e.args.iter().any(|arg| arg.spread.is_some()) {
            return;
        }

        let mut removed = false;

        for idx in (metadata.param_count..e.args.len()).rev() {
            if let Some(arg) = e.args.get_mut(idx) {
                let new = self.ignore_return_value(&mut arg.expr);

                if let Some(new) = new {
                    arg.expr = Box::new(new);
                } else {
                    e.args.remove(idx);
                    removed = true;
                }
            }
        }

        if removed {
            self.changed = true;
            report_change!("unused: Dropped trailing unused call arguments");
        }
    }
}
