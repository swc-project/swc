use std::num::FpCategory;

use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, undefined, ExprExt, Value::Known};

use super::Optimizer;
use crate::{compress::util::eval_as_number, mode::Mode, DISABLE_BUGGY_PASSES};

/// Methods related to the option `evaluate`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// Evaluate expression if possible.
    ///
    /// This method call appropriate methods for each ast types.
    pub(super) fn evaluate(&mut self, e: &mut Expr) {
        self.eval_global_vars(e);

        self.eval_fn_props(e);

        self.eval_numbers(e);

        self.eval_known_static_method_call(e);
    }

    fn eval_fn_props(&mut self, e: &mut Expr) -> Option<()> {
        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
            return None;
        }

        if let Expr::Member(MemberExpr {
            span,
            obj,
            prop: MemberProp::Ident(prop),
            ..
        }) = e
        {
            if let Expr::Ident(obj) = &**obj {
                let metadata = *self.functions.get(&obj.to_id())?;

                let usage = self.data.vars.get(&obj.to_id())?;

                if usage.reassigned() {
                    return None;
                }

                if self.options.unsafe_passes {
                    match &*prop.sym {
                        "length" => {
                            report_change!("evaluate: function.length");

                            *e = Expr::Lit(Lit::Num(Number {
                                span: *span,
                                value: metadata.len as _,
                                raw: None,
                            }));
                            self.changed = true;
                        }

                        "name" => {
                            report_change!("evaluate: function.name");

                            *e = Expr::Lit(Lit::Str(Str {
                                span: *span,
                                value: obj.sym.clone(),
                                raw: None,
                            }));
                            self.changed = true;
                        }

                        _ => {}
                    }
                }
            }
        }

        None
    }

    fn eval_global_vars(&mut self, e: &mut Expr) {
        if self.options.ie8 {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
            return;
        }

        // We should not convert used-defined `undefined` to `void 0`.
        if let Expr::Ident(i) = e {
            if self
                .data
                .vars
                .get(&i.to_id())
                .map(|var| var.declared)
                .unwrap_or(false)
            {
                return;
            }
        }

        match e {
            Expr::Ident(Ident {
                span,
                sym: js_word!("undefined"),
                ..
            }) => {
                report_change!("evaluate: `undefined` -> `void 0`");
                self.changed = true;
                *e = *undefined(*span);
            }

            Expr::Ident(Ident {
                span,
                sym: js_word!("Infinity"),
                ..
            }) => {
                report_change!("evaluate: `Infinity` -> `1 / 0`");
                self.changed = true;
                *e = Expr::Bin(BinExpr {
                    span: *span,
                    op: op!("/"),
                    left: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 1.0,
                        raw: None,
                    }))),
                    right: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 0.0,
                        raw: None,
                    }))),
                });
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
                callee: Callee::Expr(callee),
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
                if !args.is_empty() {
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
                    0 => {}
                    1 => {
                        if let Expr::Lit(Lit::Str(exp)) = &*args[0].expr {
                            self.changed = true;
                            report_change!(
                                "evaluate: Converting RegExpr call into a regexp literal `/{}/`",
                                exp.value
                            );

                            *e = Expr::Lit(Lit::Regex(Regex {
                                span,
                                exp: exp.value.clone(),
                                flags: js_word!(""),
                            }));
                        }
                    }
                    _ => {
                        if let (Expr::Lit(Lit::Str(exp)), Expr::Lit(Lit::Str(flags))) =
                            (&*args[0].expr, &*args[1].expr)
                        {
                            self.changed = true;
                            report_change!(
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
                    }
                }
            }

            Expr::Member(MemberExpr {
                obj,
                prop: MemberProp::Ident(prop),
                ..
            }) => match &**obj {
                Expr::Ident(Ident {
                    sym: js_word!("String"),
                    ..
                }) => {
                    if &*prop.sym == "fromCharCode" {
                        if args.len() != 1 {
                            return;
                        }

                        if let Known(char_code) = args[0].expr.as_number() {
                            let v = char_code.floor() as u32;

                            if let Some(v) = char::from_u32(v) {
                                self.changed = true;
                                report_change!(
                                    "evaluate: Evaluated `String.charCodeAt({})` as `{}`",
                                    char_code,
                                    v
                                );

                                let value = v.to_string();

                                *e = Expr::Lit(Lit::Str(Str {
                                    span: e.span(),
                                    raw: None,
                                    value: value.into(),
                                }));
                            }
                        }
                    }
                }

                Expr::Ident(Ident {
                    sym: js_word!("Object"),
                    ..
                }) => {
                    if &*prop.sym == "keys" {
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
                                                raw: None,
                                                value: p.sym.clone(),
                                            }))),
                                        }));
                                    }
                                    Prop::KeyValue(p) => match &p.key {
                                        PropName::Ident(key) => {
                                            keys.push(Some(ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(Expr::Lit(Lit::Str(Str {
                                                    span: key.span,
                                                    raw: None,
                                                    value: key.sym.clone(),
                                                }))),
                                            }));
                                        }
                                        PropName::Str(key) => {
                                            keys.push(Some(ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(Expr::Lit(Lit::Str(key.clone()))),
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
                }

                Expr::Ident(Ident { sym, .. }) => {
                    if &**sym == "console" && &*prop.sym == "log" {
                        for arg in args {
                            self.optimize_expr_in_str_ctx_unsafely(&mut arg.expr);
                        }
                    }
                }

                _ => {}
            },
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

        if let Expr::Call(..) = e {
            if let Some(value) = eval_as_number(e) {
                self.changed = true;
                report_change!("evaluate: Evaluated an expression as `{}`", value);

                *e = Expr::Lit(Lit::Num(Number {
                    span: e.span(),
                    value,
                    raw: None,
                }));
                return;
            }
        }

        match e {
            Expr::Bin(bin @ BinExpr { op: op!("**"), .. }) => {
                let l = bin.left.as_number();
                let r = bin.right.as_number();

                if let Known(l) = l {
                    if let Known(r) = r {
                        self.changed = true;
                        report_change!("evaluate: Evaluated `{:?} ** {:?}`", l, r);

                        let value = l.powf(r);
                        *e = Expr::Lit(Lit::Num(Number {
                            span: bin.span,
                            value,
                            raw: None,
                        }));
                    }
                }
            }

            Expr::Bin(bin @ BinExpr { op: op!("/"), .. }) => {
                let ln = bin.left.as_number();

                let rn = bin.right.as_number();
                if let (Known(ln), Known(rn)) = (ln, rn) {
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
                                .vars
                                .iter()
                                .any(|(name, v)| v.declared && name.0 == js_word!("NaN"))
                            {
                                return;
                            }

                            self.changed = true;
                            report_change!("evaluate: `0 / 0` => `NaN`");

                            // Sign does not matter for NaN
                            *e = Expr::Ident(Ident::new(
                                js_word!("NaN"),
                                bin.span.with_ctxt(
                                    SyntaxContext::empty().apply_mark(self.marks.unresolved_mark),
                                ),
                            ));
                        }
                        (FpCategory::Normal, FpCategory::Zero) => {
                            self.changed = true;
                            report_change!("evaluate: `{} / 0` => `Infinity`", ln);

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
                                        js_word!("Infinity"),
                                        bin.span.with_ctxt(SyntaxContext::empty()),
                                    ))),
                                })
                            };
                        }
                        _ => {}
                    }
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

        if let Expr::Bin(left) = &mut *e.left {
            if left.op != e.op {
                return;
            }
            // Remove rhs of lhs if possible.

            let v = left.right.as_pure_bool();
            if let Known(v) = v {
                // As we used as_pure_bool, we can drop it.
                if v && e.op == op!("&&") {
                    self.changed = true;
                    report_change!("Removing `b` from `a && b && c` because b is always truthy");

                    left.right.take();
                    return;
                }

                if !v && e.op == op!("||") {
                    self.changed = true;
                    report_change!("Removing `b` from `a || b || c` because b is always falsy");

                    left.right.take();
                }
            }
        }
    }
}
