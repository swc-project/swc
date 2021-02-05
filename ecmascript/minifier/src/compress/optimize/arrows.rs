use super::Optimizer;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

/// Methods related to the option `arrows`.
impl Optimizer {
    pub(super) fn optimize_arrow_body(&mut self, b: &mut BlockStmtOrExpr) {
        if !self.options.arrows {
            return;
        }

        match b {
            BlockStmtOrExpr::BlockStmt(s) => {
                if s.stmts.len() == 1 {
                    if let Stmt::Return(s) = &mut s.stmts[0] {
                        if let Some(arg) = &mut s.arg {
                            log::trace!("arrows: Optimizing the body of an arrow");
                            *b = BlockStmtOrExpr::Expr(arg.take());
                            return;
                        }
                    }
                }
            }
            BlockStmtOrExpr::Expr(_) => {}
        }
    }

    pub(super) fn optimize_arrow_method_prop(&mut self, p: &mut Prop) {
        if !self.options.unsafe_methods || self.options.ecma < 2015 {
            return;
        }

        match p {
            Prop::KeyValue(kv) => {
                //
                {
                    let mut v = ThisVisitor { found: false };
                    kv.value.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
                    if v.found {
                        return;
                    }
                }

                match &mut *kv.value {
                    Expr::Arrow(
                        m
                        @
                        ArrowExpr {
                            body: BlockStmtOrExpr::BlockStmt(..),
                            ..
                        },
                    ) => {
                        *p = Prop::Method(MethodProp {
                            key: kv.key.take(),
                            function: Function {
                                params: m
                                    .params
                                    .take()
                                    .into_iter()
                                    .map(|pat| Param {
                                        span: pat.span(),
                                        decorators: Default::default(),
                                        pat,
                                    })
                                    .collect(),
                                decorators: Default::default(),
                                span: m.span,
                                body: m.body.take().block_stmt(),
                                is_generator: m.is_generator,
                                is_async: m.is_async,
                                type_params: Default::default(),
                                return_type: Default::default(),
                            },
                        });
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }
}

struct ThisVisitor {
    found: bool,
}

impl Visit for ThisVisitor {
    noop_visit_type!();

    fn visit_this_expr(&mut self, _: &ThisExpr, _: &dyn Node) {
        self.found = true;
    }
}
