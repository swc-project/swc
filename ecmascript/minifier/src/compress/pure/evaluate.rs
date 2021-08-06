use super::Pure;
use crate::compress::util::is_pure_undefined_or_null;
use swc_atoms::js_word;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::undefined;

impl Pure<'_> {
    /// unsafely evaulate call to `Number`.
    pub(super) fn eval_number_call(&mut self, e: &mut Expr) {
        if self.options.unsafe_passes && self.options.unsafe_math {
            match e {
                Expr::Call(CallExpr {
                    span,
                    callee: ExprOrSuper::Expr(callee),
                    args,
                    ..
                }) => {
                    if args.len() == 1 && args[0].spread.is_none() {
                        match &**callee {
                            Expr::Ident(Ident {
                                sym: js_word!("Number"),
                                ..
                            }) => {
                                self.changed = true;
                                log::debug!(
                                    "evaluate: Reducing a call to `Number` into an unary operation"
                                );

                                *e = Expr::Unary(UnaryExpr {
                                    span: *span,
                                    op: op!(unary, "+"),
                                    arg: args.take().into_iter().next().unwrap().expr,
                                });
                            }
                            _ => {}
                        }
                    }
                }
                _ => {}
            }
        }
    }

    pub(super) fn eval_opt_chain(&mut self, e: &mut Expr) {
        let opt = match e {
            Expr::OptChain(e) => e,
            _ => return,
        };

        match &mut *opt.expr {
            Expr::Member(MemberExpr {
                span,
                obj: ExprOrSuper::Expr(obj),
                ..
            }) => {
                //
                if is_pure_undefined_or_null(&obj) {
                    self.changed = true;
                    log::debug!(
                        "evaluate: Reduced an optioanl chaining operation because object is \
                         always null or undefined"
                    );

                    *e = *undefined(*span);
                    return;
                }
            }

            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee),
                ..
            }) => {
                if is_pure_undefined_or_null(&callee) {
                    self.changed = true;
                    log::debug!(
                        "evaluate: Reduced a call expression with optioanl chaining operation \
                         because object is always null or undefined"
                    );

                    *e = *undefined(*span);
                    return;
                }
            }

            _ => {}
        }
    }
}
