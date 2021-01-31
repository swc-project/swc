use crate::compress::optimize::Optimizer;
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Value::Known;

/// Methods related to option `loops`.
impl Optimizer {
    pub(super) fn optiimze_noop_loops(&mut self, stmt: &mut Stmt) {
        if !self.options.loops {
            return;
        }

        match stmt {
            Stmt::While(w) => {
                let (_, val) = w.test.as_bool();
                if let Known(false) = val {
                    w.body = Box::new(Stmt::Empty(EmptyStmt {
                        span: w.body.span(),
                    }));
                    self.changed = true;
                    log::trace!("loops: Removing unreachable body of a while statement");
                }
            }
            Stmt::For(f) => {
                if let Some(test) = &f.test {
                    let (_, val) = test.as_bool();
                    if let Known(false) = val {
                        f.body = Box::new(Stmt::Empty(EmptyStmt {
                            span: f.body.span(),
                        }));
                        self.changed = true;
                        log::trace!("loops: Removing unreachable body of a for statement");
                    }
                }
            }
            _ => {}
        }
    }
}
