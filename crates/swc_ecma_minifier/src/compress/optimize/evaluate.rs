use super::Optimizer;
use crate::{compress::util::eval_as_number, mode::Mode, DISABLE_BUGGY_PASSES};
use std::num::FpCategory;
use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, undefined, ExprExt, Value::Known};

/// Methods related to the option `evaludate`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// Evaludate expression if possible.
    ///
    /// This method call apppropriate methods for each ast types.
    pub(super) fn evaluate(&mut self, e: &mut Expr) {
        self.eval_global_vars(e);

        self.eval_numbers(e);

        self.eval_known_static_method_call(e);
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
                tracing::debug!("evaluate: `undefined` -> `void 0`");
                self.changed = true;
                *e = *undefined(*span);
                return;
            }

            Expr::Ident(Ident {
                span,
                sym: js_word!("Infinity"),
                ..
            }) => {
                tracing::debug!("evaluate: `Infinity` -> `1 / 0`");
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

    /// Handle calls on some static classes.
    /// e.g. `String.fromCharCode`, `Object.keys()`
    fn eval_known_static_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
            return;
        }

        let (span, callee, args) = match e {
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee),
                args,
                ..
            }) => (span, callee, args),
            _ => return,
        };
        let span = *span;

        //

        for arg in &*args {
            if arg.spread.is_some() || arg.expr.may_have_side_effects() {
                return;
            }
        }

        match &**callee {
            Expr::Ident(Ident {
                sym: js_word!("RegExp"),
                ..
            }) if self.options.unsafe_regexp => {
                if args.len() >= 1 {
                    self.optimize_expr_in_str_ctx(&mut args[0].expr);
                }
                if args.len() >= 2 {
                    self.optimize_expr_in_str_ctx(&mut args[1].expr);
                }

                // Disable
                if DISABLE_BUGGY_PASSES {
                    return;
                }

                match args.len() {
                    0 => return,
                    1 => match &*args[0].expr {
                        Expr::Lit(Lit::Str(exp)) => {
                            self.changed = true;
                            tracing::debug!(
                                "evaluate: Converting RegExpr call into a regexp literal `/{}/`",
                                exp.value
                            );

                            *e = Expr::Lit(Lit::Regex(Regex {
                                span,
                                exp: exp.value.clone(),
                                flags: js_word!(""),
                            }));
                        }
                        _ => {}
                    },
                    _ => match (&*args[0].expr, &*args[1].expr) {
                        (Expr::Lit(Lit::Str(exp)), Expr::Lit(Lit::Str(flags))) => {
                            self.changed = true;
                            tracing::debug!(
                                "evaluate: Converting RegExpr call into a regexp literal `/{}/{}`",
                                exp.value,
                                flags.value
                            );

                            *e = Expr::Lit(Lit::Regex(Regex {
                                span,
                                exp: exp.value.clone(),
                                flags: flags.value.clone(),
                            }));
                        }
                        _ => {}
                    },
                }
            }

            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(obj),
                prop,
                computed: false,
                ..
            }) => {
                let prop = match &**prop {
                    Expr::Ident(i) => i,
                    _ => return,
                };

                match &**obj {
                    Expr::Ident(Ident {
                        sym: js_word!("String"),
                        ..
                    }) => match &*prop.sym {
                        "fromCharCode" => {
                            if args.len() != 1 {
                                return;
                            }

                            if let Known(char_code) = args[0].expr.as_number() {
                                let v = char_code.floor() as u32;

                                match char::from_u32(v) {
                                    Some(v) => {
                                        self.changed = true;
                                        tracing::debug!(
                                            "evanluate: Evaluated `String.charCodeAt({})` as `{}`",
                                            char_code,
                                            v
                                        );
                                        *e = Expr::Lit(Lit::Str(Str {
                                            span: e.span(),
                                            value: v.to_string().into(),
                                            has_escape: false,
                                            kind: Default::default(),
                                        }));
                                        return;
                                    }
                                    None => {}
                                }
                            }
                        }
                        _ => {}
                    },

                    Expr::Ident(Ident {
                        sym: js_word!("Object"),
                        ..
                    }) => match &*prop.sym {
                        "keys" => {
                            if args.len() != 1 {
                                return;
                            }

                            let obj = match &*args[0].expr {
                                Expr::Object(obj) => obj,
                                _ => return,
                            };

                            let mut keys = vec![];

                            for prop in &obj.props {
                                match prop {
                                    PropOrSpread::Spread(_) => return,
                                    PropOrSpread::Prop(p) => match &**p {
                                        Prop::Shorthand(p) => {
                                            keys.push(Some(ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(Expr::Lit(Lit::Str(Str {
                                                    span: p.span,
                                                    value: p.sym.clone(),
                                                    has_escape: false,
                                                    kind: Default::default(),
                                                }))),
                                            }));
                                        }
                                        Prop::KeyValue(p) => match &p.key {
                                            PropName::Ident(key) => {
                                                keys.push(Some(ExprOrSpread {
                                                    spread: None,
                                                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                                                        span: key.span,
                                                        value: key.sym.clone(),
                                                        has_escape: false,
                                                        kind: Default::default(),
                                                    }))),
                                                }));
                                            }
                                            PropName::Str(key) => {
                                                keys.push(Some(ExprOrSpread {
                                                    spread: None,
                                                    expr: Box::new(Expr::Lit(Lit::Str(
                                                        key.clone(),
                                                    ))),
                                                }));
                                            }
                                            _ => return,
                                        },
                                        _ => return,
                                    },
                                }
                            }

                            *e = Expr::Array(ArrayLit { span, elems: keys })
                        }

                        _ => {}
                    },

                    Expr::Ident(Ident { sym, .. }) => match &**sym {
                        "console" => match &*prop.sym {
                            "log" => {
                                for arg in args {
                                    self.optimize_expr_in_str_ctx_unsafely(&mut arg.expr);
                                }
                            }

                            _ => {}
                        },

                        _ => {}
                    },

                    _ => {}
                }
            }
            _ => {}
        }
    }

    fn eval_numbers(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
            return;
        }

        match e {
            Expr::Call(..) => {
                if let Some(value) = eval_as_number(&e) {
                    self.changed = true;
                    tracing::debug!("evaluate: Evaluated an expression as `{}`", value);

                    *e = Expr::Lit(Lit::Num(Number {
                        span: e.span(),
                        value,
                    }));
                    return;
                }
            }
            _ => {}
        }

        match e {
            Expr::Bin(bin @ BinExpr { op: op!("**"), .. }) => {
                let l = bin.left.as_number();
                let r = bin.right.as_number();

                if let Known(l) = l {
                    if let Known(r) = r {
                        self.changed = true;
                        tracing::debug!("evaluate: Evaulated `{:?} ** {:?}`", l, r);

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
                                tracing::debug!("evaluate: `0 / 0` => `NaN`");

                                // Sign does not matter for NaN
                                *e = Expr::Ident(Ident::new(
                                    js_word!("NaN"),
                                    bin.span.with_ctxt(SyntaxContext::empty()),
                                ));
                                return;
                            }
                            (FpCategory::Normal, FpCategory::Zero) => {
                                self.changed = true;
                                tracing::debug!("evaluate: `constant / 0` => `Infinity`");

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
                        tracing::debug!(
                            "Removing `b` from `a && b && c` because b is always truthy"
                        );

                        left.right.take();
                        return;
                    }

                    if !v && e.op == op!("||") {
                        self.changed = true;
                        tracing::debug!(
                            "Removing `b` from `a || b || c` because b is always falsy"
                        );

                        left.right.take();
                        return;
                    }
                }
            }
            _ => return,
        }
    }
}
