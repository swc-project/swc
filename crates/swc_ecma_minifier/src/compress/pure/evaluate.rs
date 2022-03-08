use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{undefined, ExprExt, Value};

use super::Pure;
use crate::{
    compress::util::{eval_as_number, is_pure_undefined_or_null},
    mode::Mode,
};

impl Pure<'_> {
    pub(super) fn eval_array_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.in_delete || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
            return;
        }

        let call = match e {
            Expr::Call(e) => e,
            _ => return,
        };

        let has_spread = call.args.iter().any(|arg| arg.spread.is_some());

        for arg in &call.args {
            if arg.expr.may_have_side_effects() {
                return;
            }
        }

        let callee = match &mut call.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(e) => &mut **e,
        };

        if let Expr::Member(MemberExpr {
            span,
            obj,
            prop: MemberProp::Ident(method_name),
        }) = callee
        {
            if obj.may_have_side_effects() {
                return;
            }

            let arr = match &mut **obj {
                Expr::Array(arr) => arr,
                _ => return,
            };

            let has_spread_elem = arr.elems.iter().any(|s| {
                matches!(
                    s,
                    Some(ExprOrSpread {
                        spread: Some(..),
                        ..
                    })
                )
            });

            // Ignore array

            if &*method_name.sym == "slice" {
                if has_spread || has_spread_elem {
                    return;
                }

                match call.args.len() {
                    0 => {
                        self.changed = true;
                        tracing::debug!("evaluate: Dropping array.slice call");
                        *e = *obj.take();
                    }
                    1 => {
                        if let Value::Known(start) = call.args[0].expr.as_number() {
                            let start = start.floor() as usize;

                            self.changed = true;
                            tracing::debug!("evaluate: Reducing array.slice({}) call", start);

                            if start >= arr.elems.len() {
                                *e = Expr::Array(ArrayLit {
                                    span: *span,
                                    elems: Default::default(),
                                });
                                return;
                            }

                            let elems = arr.elems.drain(start..).collect();

                            *e = Expr::Array(ArrayLit { span: *span, elems });
                        }
                    }
                    _ => {
                        let start = call.args[0].expr.as_number();
                        let end = call.args[1].expr.as_number();
                        if let Value::Known(start) = start {
                            let start = start.floor() as usize;

                            if let Value::Known(end) = end {
                                let end = end.floor() as usize;
                                self.changed = true;
                                tracing::debug!(
                                    "evaluate: Reducing array.slice({}, {}) call",
                                    start,
                                    end
                                );
                                let end = end.min(arr.elems.len());

                                if start >= arr.elems.len() {
                                    *e = Expr::Array(ArrayLit {
                                        span: *span,
                                        elems: Default::default(),
                                    });
                                    return;
                                }

                                let elems = arr.elems.drain(start..end).collect();

                                *e = Expr::Array(ArrayLit { span: *span, elems });
                            }
                        }
                    }
                }
            }
        }
    }

    pub(super) fn eval_fn_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.in_delete || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
            return;
        }

        let call = match e {
            Expr::Call(e) => e,
            _ => return,
        };

        let has_spread = call.args.iter().any(|arg| arg.spread.is_some());

        for arg in &call.args {
            if arg.expr.may_have_side_effects() {
                return;
            }
        }

        let callee = match &mut call.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(e) => &mut **e,
        };

        if let Expr::Member(MemberExpr {
            obj,
            prop: MemberProp::Ident(method_name),
            ..
        }) = callee
        {
            if obj.may_have_side_effects() {
                return;
            }

            let _f = match &mut **obj {
                Expr::Fn(v) => v,
                _ => return,
            };

            if &*method_name.sym == "valueOf" {
                if has_spread {
                    return;
                }

                self.changed = true;
                tracing::debug!(
                    "evaludate: Reduced `funtion.valueOf()` into a function expression"
                );

                *e = *obj.take();
            }
        }
    }

    /// unsafely evaulate call to `Number`.
    pub(super) fn eval_number_call(&mut self, e: &mut Expr) {
        if self.options.unsafe_passes && self.options.unsafe_math {
            if let Expr::Call(CallExpr {
                span,
                callee: Callee::Expr(callee),
                args,
                ..
            }) = e
            {
                if args.len() == 1 && args[0].spread.is_none() {
                    if let Expr::Ident(Ident {
                        sym: js_word!("Number"),
                        ..
                    }) = &**callee
                    {
                        self.changed = true;
                        tracing::debug!(
                            "evaluate: Reducing a call to `Number` into an unary operation"
                        );

                        *e = Expr::Unary(UnaryExpr {
                            span: *span,
                            op: op!(unary, "+"),
                            arg: args.take().into_iter().next().unwrap().expr,
                        });
                    }
                }
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
                callee: Callee::Expr(callee),
                args,
                ..
            }) => match &mut **callee {
                Expr::Member(MemberExpr {
                    obj,
                    prop: MemberProp::Ident(prop),
                    ..
                }) => match &mut **obj {
                    Expr::Lit(Lit::Num(obj)) => (obj, prop, args),
                    _ => return,
                },
                _ => return,
            },
            _ => return,
        };

        if args.iter().any(|arg| arg.expr.may_have_side_effects()) {
            return;
        }

        if &*method.sym == "toFixed" {
            if let Some(precision) = eval_as_number(&args[0].expr) {
                let precision = precision.floor() as usize;
                let value = num_to_fixed(num.value, precision + 1);

                self.changed = true;
                tracing::debug!(
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
    }

    pub(super) fn eval_opt_chain(&mut self, e: &mut Expr) {
        let opt = match e {
            Expr::OptChain(e) => e,
            _ => return,
        };

        match &mut opt.base {
            OptChainBase::Member(MemberExpr { span, obj, .. }) => {
                //
                if is_pure_undefined_or_null(obj) {
                    self.changed = true;
                    tracing::debug!(
                        "evaluate: Reduced an optional chaining operation because object is \
                         always null or undefined"
                    );

                    *e = *undefined(*span);
                }
            }

            OptChainBase::Call(OptCall { span, callee, .. }) => {
                if is_pure_undefined_or_null(callee) {
                    self.changed = true;
                    tracing::debug!(
                        "evaluate: Reduced a call expression with optional chaining operation \
                         because object is always null or undefined"
                    );

                    *e = *undefined(*span);
                }
            }
        }
    }
}

/// Evaluation of strings.
impl<M> Pure<'_, M>
where
    M: Mode,
{
    /// Handle calls on string literals, like `'foo'.toUpperCase()`.
    pub(super) fn eval_str_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.in_delete || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
            return;
        }

        let call = match e {
            Expr::Call(v) => v,
            _ => return,
        };

        let (s, method) = match &call.callee {
            Callee::Super(_) | Callee::Import(_) => return,
            Callee::Expr(callee) => match &**callee {
                Expr::Member(MemberExpr {
                    obj,
                    prop: MemberProp::Ident(prop),
                    ..
                }) => match &**obj {
                    Expr::Lit(Lit::Str(s)) => (s.clone(), prop.sym.clone()),
                    _ => return,
                },
                _ => return,
            },
        };

        let new_val = match &*method {
            "toLowerCase" => s.value.to_lowercase(),
            "toUpperCase" => s.value.to_uppercase(),
            "charCodeAt" => {
                if call.args.len() != 1 {
                    return;
                }
                if let Expr::Lit(Lit::Num(Number { value, .. })) = &*call.args[0].expr {
                    if value.fract() != 0.0 {
                        return;
                    }

                    let idx = value.round() as i64 as usize;
                    let c = s.value.chars().nth(idx);
                    match c {
                        Some(v) => {
                            self.changed = true;
                            tracing::debug!(
                                "evaluate: Evaluated `charCodeAt` of a string literal as `{}`",
                                v
                            );
                            *e = Expr::Lit(Lit::Num(Number {
                                span: call.span,
                                value: v as usize as f64,
                            }))
                        }
                        None => {
                            self.changed = true;
                            tracing::debug!(
                                "evaluate: Evaluated `charCodeAt` of a string literal as `NaN`",
                            );
                            *e = Expr::Ident(Ident::new(
                                js_word!("NaN"),
                                e.span().with_ctxt(SyntaxContext::empty()),
                            ))
                        }
                    }
                }
                return;
            }
            _ => return,
        };

        self.changed = true;
        tracing::debug!("evaluate: Evaluated `{}` of a string literal", method);
        *e = Expr::Lit(Lit::Str(Str {
            value: new_val.into(),
            ..s
        }));
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
