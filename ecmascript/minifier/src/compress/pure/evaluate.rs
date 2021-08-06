use super::Pure;
use crate::compress::util::{eval_as_number, is_pure_undefined_or_null};
use swc_atoms::js_word;
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{undefined, ExprExt};

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

    /// Evaluates method calls of a numeric constant.

    pub(super) fn eval_number_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        let (num, method, args) = match e {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(callee),
                args,
                ..
            }) => match &mut **callee {
                Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Expr(obj),
                    prop,
                    computed: false,
                    ..
                }) => match &mut **obj {
                    Expr::Lit(Lit::Num(obj)) => match &mut **prop {
                        Expr::Ident(prop) => (obj, prop, args),
                        _ => return,
                    },
                    _ => return,
                },
                _ => return,
            },
            _ => return,
        };

        if args.iter().any(|arg| arg.expr.may_have_side_effects()) {
            return;
        }

        match &*method.sym {
            "toFixed" => {
                if let Some(precision) = eval_as_number(&args[0].expr) {
                    let precision = precision.floor() as usize;
                    let value = num_to_fixed(num.value, precision + 1);

                    self.changed = true;
                    log::debug!(
                        "evaluate: Evaluating `{}.toFixed({})` as `{}`",
                        num,
                        precision,
                        value
                    );

                    *e = Expr::Lit(Lit::Str(Str {
                        span: e.span(),
                        value: value.into(),
                        has_escape: false,
                        kind: Default::default(),
                    }))
                }
            }
            _ => {}
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

/// https://stackoverflow.com/questions/60497397/how-do-you-format-a-float-to-the-first-significant-decimal-and-with-specified-pr
fn num_to_fixed(float: f64, precision: usize) -> String {
    // compute absolute value
    let a = float.abs();

    // if abs value is greater than 1, then precision becomes less than "standard"
    let precision = if a >= 1. {
        // reduce by number of digits, minimum 0
        let n = (1. + a.log10().floor()) as usize;
        if n <= precision {
            precision - n
        } else {
            0
        }
    // if precision is less than 1 (but non-zero), then precision becomes
    // greater than "standard"
    } else if a > 0. {
        // increase number of digits
        let n = -(1. + a.log10().floor()) as usize;
        precision + n
    // special case for 0
    } else {
        0
    };

    // format with the given computed precision
    format!("{0:.1$}", float, precision)
}
