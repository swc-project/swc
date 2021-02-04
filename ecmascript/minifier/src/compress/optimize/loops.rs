use crate::compress::optimize::unused::UnreachableHandler;
use crate::compress::optimize::Optimizer;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
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
                let (purity, val) = w.test.as_bool();
                if let Known(false) = val {
                    if purity.is_pure() {
                        let changed = UnreachableHandler::preserve_vars(stmt);
                        self.changed |= changed;
                        if changed {
                            log::trace!(
                                "loops: Removing unreachable while statement without side effects"
                            );
                        }
                    } else {
                        let changed = UnreachableHandler::preserve_vars(&mut w.body);
                        self.changed |= changed;
                        if changed {
                            log::trace!("loops: Removing unreachable body of a while statement");
                        }
                    }
                }
            }
            Stmt::For(f) => {
                if let Some(test) = &mut f.test {
                    let (_purity, val) = test.as_bool();
                    if let Known(false) = val {
                        let changed = UnreachableHandler::preserve_vars(&mut f.body);
                        self.changed |= changed;
                        if changed {
                            log::trace!("loops: Removing unreachable body of a for statement");
                        }
                        self.changed |= f.init.is_some() | f.update.is_some();

                        self.prepend_stmts
                            .extend(f.init.take().map(|init| match init {
                                VarDeclOrExpr::VarDecl(var) => Stmt::Decl(Decl::Var(var)),
                                VarDeclOrExpr::Expr(expr) => Stmt::Expr(ExprStmt {
                                    span: DUMMY_SP,
                                    expr,
                                }),
                            }));
                        self.prepend_stmts.push(Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: f.test.take().unwrap(),
                        }));
                        f.update = None;
                        *stmt = *f.body.take();
                        return;
                    }
                }
            }
            _ => {}
        }
    }

    pub(super) fn drop_if_break(&mut self, s: &ForStmt) {
        if !self.options.loops {
            return;
        }
    }
}
