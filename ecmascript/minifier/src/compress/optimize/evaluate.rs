use super::Optimizer;
use std::num::FpCategory;
use swc_atoms::js_word;
use swc_common::Spanned;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::undefined;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Value::Known;

/// Methods related to the option `evaludate`.
impl Optimizer<'_> {
    /// Evaludate expression if possible.
    ///
    /// This method call apppropriate methods for each ast types.
    pub(super) fn evaluate(&mut self, e: &mut Expr) {
        self.eval_global_vars(e);

        self.eval_numbers(e);
        self.eval_str_method_call(e);
        self.eval_array_method_call(e);
    }

    fn eval_global_vars(&mut self, e: &mut Expr) {
        if self.options.ie8 {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
            return;
        }

        // We should not convert used-defined `undefined` to `void 0`.
        match e {
            Expr::Ident(i) => {
                if self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&i.to_id()))
                    .map(|var| var.declared)
                    .unwrap_or(false)
                {
                    return;
                }
            }
            _ => {}
        }

        match e {
            Expr::Ident(Ident {
                span,
                sym: js_word!("undefined"),
                ..
            }) => {
                log::trace!("evaluate: `undefined` -> `void 0`");
                self.changed = true;
                *e = *undefined(*span);
                return;
            }

            Expr::Ident(Ident {
                span,
                sym: js_word!("Infinity"),
                ..
            }) => {
                log::trace!("evaluate: `Infinity` -> `1 / 0`");
                self.changed = true;
                *e = Expr::Bin(BinExpr {
                    span: span.with_ctxt(self.done_ctxt),
                    op: op!("/"),
                    left: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 1.0,
                    }))),
                    right: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 0.0,
                    }))),
                });
                return;
            }

            _ => {}
        }
    }

    fn eval_str_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        let call = match e {
            Expr::Call(v) => v,
            _ => return,
        };

        let (s, method) = match &call.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(callee) => match &**callee {
                Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Expr(obj),
                    prop,
                    computed: false,
                    ..
                }) => match (&**obj, &**prop) {
                    (Expr::Lit(Lit::Str(s)), Expr::Ident(prop)) => (s.clone(), prop.sym.clone()),
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
                            log::trace!(
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
                            log::trace!(
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
        log::trace!("evaluate: Evaluated `{}` of a string literal", method);
        *e = Expr::Lit(Lit::Str(Str {
            value: new_val.into(),
            ..s
        }));
    }

    fn eval_numbers(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
            return;
        }

        match e {
            Expr::Bin(bin @ BinExpr { op: op!("**"), .. }) => {
                let l = bin.left.as_number();
                let r = bin.right.as_number();

                if let Known(l) = l {
                    if let Known(r) = r {
                        self.changed = true;
                        log::trace!("evaluate: Evaulated `{:?} ** {:?}`", l, r);

                        let value = l.powf(r);
                        *e = Expr::Lit(Lit::Num(Number {
                            span: bin.span,
                            value,
                        }));
                        return;
                    }
                }
            }

            Expr::Bin(bin @ BinExpr { op: op!("/"), .. }) => {
                let ln = bin.left.as_number();

                let rn = bin.right.as_number();
                match (ln, rn) {
                    (Known(ln), Known(rn)) => {
                        // Prefer `0/0` over NaN.
                        if ln == 0.0 && rn == 0.0 {
                            return;
                        }
                        // Prefer `1/0` over Infinity.
                        if ln == 1.0 && rn == 0.0 {
                            return;
                        }

                        // It's NaN
                        match (ln.classify(), rn.classify()) {
                            (FpCategory::Zero, FpCategory::Zero) => {
                                // If a variable named `NaN` is in scope, don't convert e into NaN.
                                if self
                                    .data
                                    .as_ref()
                                    .map(|data| {
                                        data.vars.iter().any(|(name, v)| {
                                            v.declared && name.0 == js_word!("NaN")
                                        })
                                    })
                                    .unwrap_or(false)
                                {
                                    return;
                                }

                                self.changed = true;
                                log::trace!("evaluate: `0 / 0` => `NaN`");

                                // Sign does not matter for NaN
                                *e = Expr::Ident(Ident::new(
                                    js_word!("NaN"),
                                    bin.span.with_ctxt(SyntaxContext::empty()),
                                ));
                                return;
                            }
                            (FpCategory::Normal, FpCategory::Zero) => {
                                self.changed = true;
                                log::trace!("evaluate: `constant / 0` => `Infinity`");

                                // Sign does not matter for NaN
                                *e = if ln.is_sign_positive() == rn.is_sign_positive() {
                                    Expr::Ident(Ident::new(
                                        js_word!("Infinity"),
                                        bin.span.with_ctxt(SyntaxContext::empty()),
                                    ))
                                } else {
                                    Expr::Unary(UnaryExpr {
                                        span: bin.span,
                                        op: op!(unary, "-"),
                                        arg: Box::new(Expr::Ident(Ident::new(
                                            js_word!("NaN"),
                                            bin.span.with_ctxt(SyntaxContext::empty()),
                                        ))),
                                    })
                                };
                                return;
                            }
                            _ => {}
                        }
                        return;
                    }
                    _ => {}
                }
            }

            _ => {}
        }
    }

    fn eval_array_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
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
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(e) => &mut **e,
        };

        match callee {
            Expr::Member(MemberExpr {
                span,
                obj: ExprOrSuper::Expr(obj),
                prop,
                computed: false,
            }) => {
                if obj.may_have_side_effects() {
                    return;
                }

                let arr = match &mut **obj {
                    Expr::Array(arr) => arr,
                    _ => return,
                };

                let has_spread_elem = arr.elems.iter().any(|s| match s {
                    Some(ExprOrSpread {
                        spread: Some(..), ..
                    }) => true,
                    _ => false,
                });

                // Ignore array

                let method_name = match &**prop {
                    Expr::Ident(i) => i,
                    _ => return,
                };

                match &*method_name.sym {
                    "slice" => {
                        if has_spread || has_spread_elem {
                            return;
                        }

                        match call.args.len() {
                            0 => {
                                self.changed = true;
                                log::trace!("evaluate: Dropping array.slice call");
                                *e = *obj.take();
                                return;
                            }
                            1 => {
                                if let Known(start) = call.args[0].expr.as_number() {
                                    let start = start.floor() as usize;

                                    self.changed = true;
                                    log::trace!("evaluate: Reducing array.slice({}) call", start);

                                    if start >= arr.elems.len() {
                                        *e = Expr::Array(ArrayLit {
                                            span: *span,
                                            elems: Default::default(),
                                        });
                                        return;
                                    }

                                    let elems = arr.elems.drain(start..).collect();

                                    *e = Expr::Array(ArrayLit { span: *span, elems });
                                    return;
                                }
                            }
                            _ => {
                                let start = call.args[0].expr.as_number();
                                let end = call.args[1].expr.as_number();
                                if let Known(start) = start {
                                    let start = start.floor() as usize;

                                    if let Known(end) = end {
                                        let end = end.floor() as usize;
                                        self.changed = true;
                                        log::trace!(
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
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    ///
    /// - `Object(1) && 1 && 2` => `Object(1) && 2`.
    pub(super) fn optimize_bin_and_or(&mut self, e: &mut BinExpr) {
        if !self.options.evaluate {
            return;
        }
        if e.left.is_invalid() || e.right.is_invalid() {
            return;
        }

        match e.op {
            op!("&&") | op!("||") => {}
            _ => return,
        }

        match &mut *e.left {
            Expr::Bin(left) => {
                if left.op != e.op {
                    return;
                }
                // Remove rhs of lhs if possible.

                let v = left.right.as_pure_bool();
                if let Known(v) = v {
                    // As we used as_pure_bool, we can drop it.
                    if v && e.op == op!("&&") {
                        self.changed = true;
                        log::trace!("Removing `b` from `a && b && c` because b is always truthy");

                        left.right.take();
                        return;
                    }

                    if !v && e.op == op!("||") {
                        self.changed = true;
                        log::trace!("Removing `b` from `a || b || c` because b is always falsy");

                        left.right.take();
                        return;
                    }
                }
            }
            _ => return,
        }
    }
}
