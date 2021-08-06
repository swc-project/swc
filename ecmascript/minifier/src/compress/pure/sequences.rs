use crate::compress::util::get_lhs_ident;

use super::Pure;
use swc_common::{DUMMY_SP, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{ExprExt, ExprFactory};

impl Pure<'_> {
    /// `(a = foo, a.apply())` => `(a = foo).apply()`
    ///
    /// This is useful for outputs of swc/babel
    pub(super) fn merge_seq_call(&mut self, e: &mut SeqExpr) {
        if !self.options.sequences() {
            return;
        }

        for idx in 0..e.exprs.len() {
            let (e1, e2) = e.exprs.split_at_mut(idx);

            let a = match e1.last_mut() {
                Some(v) => &mut **v,
                None => continue,
            };

            let b = match e2.first_mut() {
                Some(v) => &mut **v,
                None => continue,
            };

            match (&mut *a, &mut *b) {
                (
                    Expr::Assign(a_assign),
                    Expr::Call(CallExpr {
                        callee: ExprOrSuper::Expr(b_callee),
                        args,
                        ..
                    }),
                ) => {
                    let var_name = get_lhs_ident(&a_assign.left);
                    let var_name = match var_name {
                        Some(v) => v,
                        None => continue,
                    };

                    match &mut **b_callee {
                        Expr::Member(MemberExpr {
                            obj: ExprOrSuper::Expr(b_callee_obj),
                            computed: false,
                            prop,
                            ..
                        }) => {
                            //
                            if !b_callee_obj.is_ident_ref_to(var_name.sym.clone()) {
                                continue;
                            }

                            match &**prop {
                                Expr::Ident(Ident { sym, .. }) => match &**sym {
                                    "apply" | "call" => {}
                                    _ => continue,
                                },
                                _ => {}
                            }

                            let span = a_assign.span.with_ctxt(SyntaxContext::empty());

                            let obj = a.take();

                            let new = Expr::Call(CallExpr {
                                span,
                                callee: MemberExpr {
                                    span: DUMMY_SP,
                                    obj: obj.as_obj(),
                                    prop: prop.take(),
                                    computed: false,
                                }
                                .as_callee(),
                                args: args.take(),
                                type_args: Default::default(),
                            });
                            b.take();
                            self.changed = true;
                            log::debug!(
                                "sequences: Reducing `(a = foo, a.call())` to `((a = foo).call())`"
                            );

                            *a = new;
                        }
                        _ => {}
                    };
                }

                _ => {}
            }
        }
    }
}
