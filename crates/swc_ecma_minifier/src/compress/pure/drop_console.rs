use super::Pure;
use std::mem::take;
use swc_ecma_ast::*;

impl<M> Pure<'_, M> {
    pub(super) fn drop_console(&mut self, e: &mut Expr) {
        if !self.options.drop_console {
            return;
        }

        if let Expr::Call(CallExpr {
            span, callee, args, ..
        }) = e
        {
            // Find console.log
            let callee = match callee {
                Callee::Expr(callee) => callee,
                _ => return,
            };

            if let Expr::Member(MemberExpr {
                obj: callee_obj,
                prop: MemberProp::Ident(_),
                ..
            }) = &**callee
            {
                let mut loop_co = &**callee_obj;
                loop {
                    match loop_co {
                        Expr::Ident(obj) => {
                            if obj.sym != *"console" {
                                return;
                            }
                            break;
                        }

                        Expr::Member(MemberExpr {
                            obj: loop_co_obj,
                            prop: MemberProp::Ident(_),
                            ..
                        }) => {
                            loop_co = loop_co_obj;
                        }
                        _ => return,
                    }
                }

                // Simplifier will remove side-effect-free items.
                *e = Expr::Seq(SeqExpr {
                    span: *span,
                    exprs: take(args).into_iter().map(|arg| arg.expr).collect(),
                })
            }
        }
    }
}
