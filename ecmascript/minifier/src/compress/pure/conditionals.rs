use std::mem::swap;

use super::Pure;
use crate::{
    compress::util::{negate, negate_cost},
    debug::dump,
};
use swc_ecma_ast::*;

impl Pure<'_> {
    pub(super) fn negate_cond_expr(&mut self, cond: &mut CondExpr) {
        if negate_cost(&cond.test, true, false).unwrap_or(isize::MAX) >= 0 {
            return;
        }

        self.modified_node = true;
        log::debug!("conditionals: `a ? foo : bar` => `!a ? bar : foo` (considered cost)");
        let start_str = dump(&*cond);

        negate(&mut cond.test, true);
        swap(&mut cond.cons, &mut cond.alt);

        if cfg!(feature = "debug") {
            log::trace!(
                "[Change] Negated cond: `{}` => `{}`",
                start_str,
                dump(&*cond)
            )
        }
    }

    /// Negates the condition of a `if` statement to reduce body size.
    pub(super) fn negate_if_stmt(&mut self, stmt: &mut IfStmt) {
        let alt = match stmt.alt.as_deref_mut() {
            Some(v) => v,
            _ => return,
        };

        match &*stmt.cons {
            Stmt::Return(..) | Stmt::Continue(ContinueStmt { label: None, .. }) => return,
            _ => {}
        }

        if negate_cost(&stmt.test, true, false).unwrap_or(isize::MAX) < 0 {
            self.modified_node = true;
            log::debug!("if_return: Negating `cond` of an if statement which has cons and alt");
            negate(&mut stmt.test, true);
            swap(alt, &mut *stmt.cons);
            return;
        }

        match &*alt {
            Stmt::Return(..) | Stmt::Continue(ContinueStmt { label: None, .. }) => {
                self.modified_node = true;
                log::debug!(
                    "if_return: Negating an if statement because the alt is return / continue"
                );
                negate(&mut stmt.test, true);
                swap(alt, &mut *stmt.cons);
            }
            _ => return,
        }
    }
}
