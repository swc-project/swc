use swc_atoms::atom;
use swc_common::{util::take::Take, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    number::{minify_number, JsNumber},
    ExprExt,
    Value::Known,
};

use super::{BitCtx, Optimizer};
use crate::{
    compress::util::{eval_as_number, is_valid_regexp_literal},
    program_data::VarUsageInfoFlags,
    util::make_number,
    DISABLE_BUGGY_PASSES,
};

/// Methods related to the option `evaluate`.
impl Optimizer<'_> {
    /// Evaluate expression if possible.
    ///
    /// This method call appropriate methods for each ast types.
    pub(super) fn evaluate(&mut self, e: &mut Expr) {
        self.eval_global_vars(e);

        self.eval_fn_props(e);

        self.eval_numbers(e);

        self.eval_known_static_method_call(e);
    }

    pub(super) fn evaluate_ident(&mut self, e: &mut Expr) {
        self.eval_global_vars(e);
    }

    #[inline]
    fn is_declared_ident(&self, i: &Ident) -> bool {
        self.data
            .vars
            .get(&i.to_id())
            .map(|var| var.flags.contains(VarUsageInfoFlags::DECLARED))
            .unwrap_or(false)
    }

    fn eval_fn_props(&mut self, e: &mut Expr) -> Option<()> {
        if self
            .ctx
            .bit_ctx
            .intersects(BitCtx::IsDeleteArg | BitCtx::IsUpdateArg | BitCtx::IsLhsOfAssign)
        {
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

                if usage.flags.contains(VarUsageInfoFlags::REASSIGNED) {
                    return None;
                }

                if self.options.unsafe_passes {
                    match &*prop.sym {
                        "length" => {
                            report_change!("evaluate: function.length");

                            *e = Lit::Num(Number {
                                span: *span,
                                value: metadata.len as _,
                                raw: None,
                            })
                            .into();
                            self.changed = true;
                        }

                        "name" => {
                            report_change!("evaluate: function.name");

                            *e = Lit::Str(Str {
                                span: *span,
                                value: obj.sym.clone().into(),
                                raw: None,
                            })
                            .into();
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

        if self.ctx.bit_ctx.intersects(
            BitCtx::IsDeleteArg | BitCtx::IsUpdateArg | BitCtx::IsLhsOfAssign | BitCtx::InWithStmt,
        ) {
            return;
        }

        enum IdentGlobal {
            Undefined,
            Number(f64),
        }

        let ident_global = match e {
            // We should not convert used-defined `undefined` to `void 0`.
            Expr::Ident(i) if &*i.sym == "undefined" && !self.is_declared_ident(i) => {
                Some((i.span, IdentGlobal::Undefined))
            }
            Expr::Ident(i) if &*i.sym == "NaN" && !self.is_declared_ident(i) => {
                Some((i.span, IdentGlobal::Number(f64::NAN)))
            }
            Expr::Ident(i) if &*i.sym == "Infinity" && !self.is_declared_ident(i) => {
                Some((i.span, IdentGlobal::Number(f64::INFINITY)))
            }
            _ => None,
        };

        if let Some((span, kind)) = ident_global {
            match kind {
                IdentGlobal::Undefined => {
                    report_change!("evaluate: `undefined` -> `void 0`");
                    self.changed = true;
                    *e = *Expr::undefined(span);
                }
                IdentGlobal::Number(value) => {
                    report_change!("evaluate: Global numeric constant -> numeric literal");
                    self.changed = true;
                    *e = make_number(span, value);
                }
            }
            return;
        }

        match e {
            Expr::Member(MemberExpr {
                obj,
                prop: MemberProp::Ident(prop),
                span,
                ..
            }) if matches!(obj.as_ref(), Expr::Ident(ident) if &*ident.sym == "Number") => {
                if let Expr::Ident(number_ident) = &**obj {
                    if number_ident.ctxt != self.ctx.expr_ctx.unresolved_ctxt {
                        return;
                    }
                }

                match &*prop.sym {
                    "MIN_VALUE" => {
                        report_change!("evaluate: `Number.MIN_VALUE` -> `5e-324`");
                        self.changed = true;
                        *e = Lit::Num(Number {
                            span: *span,
                            value: 5e-324,
                            raw: None,
                        })
                        .into();
                    }
                    "NaN" => {
                        report_change!("evaluate: `Number.NaN` -> numeric literal");
                        self.changed = true;
                        *e = make_number(*span, f64::NAN);
                    }
                    "POSITIVE_INFINITY" => {
                        report_change!("evaluate: `Number.POSITIVE_INFINITY` -> numeric literal");
                        self.changed = true;
                        *e = make_number(*span, f64::INFINITY);
                    }
                    "NEGATIVE_INFINITY" => {
                        report_change!("evaluate: `Number.NEGATIVE_INFINITY` -> numeric literal");
                        self.changed = true;
                        *e = make_number(*span, f64::NEG_INFINITY);
                    }
                    _ => {}
                }
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

        if self
            .ctx
            .bit_ctx
            .intersects(BitCtx::IsDeleteArg | BitCtx::IsUpdateArg | BitCtx::IsLhsOfAssign)
        {
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
            if arg.spread.is_some() || arg.expr.may_have_side_effects(self.ctx.expr_ctx) {
                return;
            }
        }

        match &**callee {
            Expr::Ident(Ident { sym, .. }) if &**sym == "RegExp" && self.options.unsafe_regexp => {
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
                            let Some(value) = exp.value.as_str() else {
                                return;
                            };
                            if !is_valid_regexp_literal(value, "", self.options.ecma) {
                                return;
                            }
                            self.changed = true;
                            report_change!(
                                "evaluate: Converting RegExpr call into a regexp literal `/{}/`",
                                value
                            );

                            *e = Lit::Regex(Regex {
                                span,
                                exp: value.into(),
                                flags: atom!(""),
                            })
                            .into();
                        }
                    }
                    _ => {
                        if let (Expr::Lit(Lit::Str(exp)), Expr::Lit(Lit::Str(flags))) =
                            (&*args[0].expr, &*args[1].expr)
                        {
                            let Some(value) = exp.value.as_str() else {
                                return;
                            };
                            let Some(flags) = flags.value.as_str() else {
                                return;
                            };
                            if !is_valid_regexp_literal(value, flags, self.options.ecma) {
                                return;
                            }

                            self.changed = true;
                            report_change!(
                                "evaluate: Converting RegExpr call into a regexp literal `/{}/{}`",
                                value,
                                flags
                            );

                            *e = Lit::Regex(Regex {
                                span,
                                exp: value.into(),
                                flags: flags.into(),
                            })
                            .into();
                        }
                    }
                }
            }

            Expr::Member(MemberExpr {
                obj,
                prop: MemberProp::Ident(prop),
                ..
            }) => match &**obj {
                Expr::Ident(Ident { sym, ctxt, .. }) if &**sym == "String" => {
                    if *ctxt != self.ctx.expr_ctx.unresolved_ctxt {
                        return;
                    }

                    if &*prop.sym == "fromCharCode" {
                        if args.len() != 1 {
                            return;
                        }

                        if let Known(char_code) = args[0].expr.as_pure_number(self.ctx.expr_ctx) {
                            let v = u32::from(JsNumber::from(char_code).to_uint16());

                            if let Some(v) = char::from_u32(v) {
                                if !v.is_ascii() {
                                    return;
                                }
                                self.changed = true;
                                report_change!(
                                    "evaluate: Evaluated `String.fromCharCode({})` as `{}`",
                                    char_code,
                                    v
                                );

                                let value = v.to_string();

                                *e = Lit::Str(Str {
                                    span: e.span(),
                                    raw: None,
                                    value: value.into(),
                                })
                                .into();
                            }
                        }
                    }
                }

                Expr::Ident(Ident { sym, ctxt, .. }) if &**sym == "Object" => {
                    if *ctxt != self.ctx.expr_ctx.unresolved_ctxt {
                        return;
                    }

                    if &*prop.sym == "keys" {
                        if args.len() != 1 {
                            return;
                        }

                        let obj = match &*args[0].expr {
                            Expr::Object(obj) => obj,
                            _ => return,
                        };

                        let mut keys = Vec::new();

                        for prop in &obj.props {
                            match prop {
                                PropOrSpread::Spread(_) => return,
                                PropOrSpread::Prop(p) => match &**p {
                                    Prop::Shorthand(p) => {
                                        keys.push(Some(ExprOrSpread {
                                            spread: None,
                                            expr: Lit::Str(Str {
                                                span: p.span,
                                                raw: None,
                                                value: p.sym.clone().into(),
                                            })
                                            .into(),
                                        }));
                                    }
                                    Prop::KeyValue(p) => match &p.key {
                                        PropName::Ident(key) => {
                                            // A non-computed `__proto__` key-value property sets
                                            // the object's prototype instead of defining an own
                                            // property, so it is not returned by `Object.keys`.
                                            if key.sym == "__proto__" {
                                                continue;
                                            }

                                            keys.push(Some(ExprOrSpread {
                                                spread: None,
                                                expr: Lit::Str(Str {
                                                    span: key.span,
                                                    raw: None,
                                                    value: key.sym.clone().into(),
                                                })
                                                .into(),
                                            }));
                                        }
                                        PropName::Str(key) => {
                                            // String-literal `__proto__` key-value properties have
                                            // the same prototype-setter semantics as identifier
                                            // keys. Computed keys remain ineligible for folding.
                                            if key.value.as_str() == Some("__proto__") {
                                                continue;
                                            }

                                            keys.push(Some(ExprOrSpread {
                                                spread: None,
                                                expr: Lit::Str(key.clone()).into(),
                                            }));
                                        }
                                        _ => return,
                                    },
                                    _ => return,
                                },
                                #[cfg(swc_ast_unknown)]
                                _ => panic!("unable to access unknown nodes"),
                            }
                        }

                        *e = ArrayLit { span, elems: keys }.into()
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

        if self
            .ctx
            .bit_ctx
            .intersects(BitCtx::IsDeleteArg | BitCtx::IsUpdateArg | BitCtx::IsLhsOfAssign)
        {
            return;
        }

        if let Expr::Call(..) = e {
            if let Some(value) = eval_as_number(self.ctx.expr_ctx, e) {
                if !math_fold_grows(e, value) {
                    self.changed = true;
                    report_change!("evaluate: Evaluated an expression as `{}`", value);
                    *e = make_number(e.span(), value);
                    return;
                }
            }
        }

        match e {
            Expr::Bin(bin @ BinExpr { op: op!("**"), .. }) => {
                let l = bin.left.as_pure_number(self.ctx.expr_ctx);
                let r = bin.right.as_pure_number(self.ctx.expr_ctx);

                if let Known(l) = l {
                    if let Known(r) = r {
                        self.changed = true;
                        report_change!("evaluate: Evaluated `{:?} ** {:?}`", l, r);

                        if l.is_nan() || r.is_nan() {
                            *e = make_number(bin.span, f64::NAN);
                        } else {
                            *e = make_number(bin.span, l.powf(r));
                        };
                    }
                }
            }

            Expr::Bin(bin @ BinExpr { op: op!("/"), .. }) => {
                let ln = bin.left.as_pure_number(self.ctx.expr_ctx);

                let rn = bin.right.as_pure_number(self.ctx.expr_ctx);
                if let (Known(ln), Known(rn)) = (ln, rn) {
                    let value = ln / rn;
                    if !value.is_finite() {
                        self.changed = true;
                        report_change!("evaluate: Evaluated `{} / {}`", ln, rn);
                        *e = make_number(bin.span, value);
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

            let v = left.right.as_pure_bool(self.ctx.expr_ctx);
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

/// `Math` methods whose folded value can be longer than the call it replaces.
///
/// `Math.cos` and friends are deliberately excluded so their existing output is
/// left untouched.
const SIZE_SENSITIVE_MATH_METHODS: &[&str] = &["ceil", "floor", "round", "sqrt"];

/// Number of characters `e` occupies once printed, when that can be determined
/// exactly.
///
/// `None` means the printed form is not cheaply known, which makes
/// [`math_fold_grows`] decline the fold rather than guess at it.
fn measured_len(e: &Expr) -> Option<usize> {
    match e {
        Expr::Lit(Lit::Num(n)) => {
            let mut detect_dot = false;

            Some(minify_number(n.value, &mut detect_dot).len())
        }

        // `eval_as_number` reaches these through `cast_to_number`, so
        // `Math.sqrt("2")` is foldable and has to be measured. Quotes are
        // counted but escapes are not, which can only underestimate the
        // original and therefore only makes the guard stricter.
        Expr::Lit(Lit::Str(s)) => Some(s.value.len() + "\"\"".len()),
        Expr::Lit(Lit::Bool(b)) => Some(if b.value { "true".len() } else { "false".len() }),
        Expr::Lit(Lit::Null(..)) => Some("null".len()),

        // `Math.PI` and friends survive until this pass, so they have to be
        // measured too: `Math.sqrt(Math.E)` grows from 17 to 18 characters.
        Expr::Member(MemberExpr {
            obj,
            prop: MemberProp::Ident(prop),
            ..
        }) if matches!(&**obj, Expr::Ident(obj) if &*obj.sym == "Math") => {
            Some("Math.".len() + prop.sym.len())
        }

        // Single character prefixes. `true` and `false` reach this pass as `!0`
        // and `!1`, so skipping `!` would decline folds that do shrink.
        Expr::Unary(UnaryExpr {
            op: op!(unary, "-") | op!(unary, "+") | op!("!") | op!("~"),
            arg,
            ..
        }) => Some("!".len() + measured_len(arg)?),

        // A nested call that this guard declined to fold, such as the inner
        // `Math.sqrt(2)` of `Math.ceil(Math.sqrt(2))`. Measuring it recursively
        // is what keeps the outer fold available.
        Expr::Call(..) => math_call_len(e),

        _ => None,
    }
}

/// Number of characters a `Math.<method>(..)` call occupies once printed.
fn math_call_len(call: &Expr) -> Option<usize> {
    let Expr::Call(CallExpr {
        callee: Callee::Expr(callee),
        args,
        ..
    }) = call
    else {
        return None;
    };

    let Expr::Member(MemberExpr {
        obj,
        prop: MemberProp::Ident(prop),
        ..
    }) = &**callee
    else {
        return None;
    };

    if !matches!(&**obj, Expr::Ident(obj) if &*obj.sym == "Math") {
        return None;
    }

    // `Math.` + method + `(` + arguments + `)`
    let mut len = "Math.".len() + prop.sym.len() + "()".len();

    for (i, arg) in args.iter().enumerate() {
        if i > 0 {
            len += ",".len();
        }

        if arg.spread.is_some() {
            return None;
        }

        len += measured_len(&arg.expr)?;
    }

    Some(len)
}

/// Returns `true` when replacing `call` with `value` would emit at least as
/// many characters as the original call expression, e.g. `Math.sqrt(2)` (12
/// characters) folding to `1.4142135623730951` (18 characters).
///
/// Only the methods in [`SIZE_SENSITIVE_MATH_METHODS`] are considered, so
/// `Math.cos` and friends keep emitting what they emit today. A call whose
/// length cannot be measured is declined, because the fold cannot then be shown
/// to save anything.
fn math_fold_grows(call: &Expr, value: f64) -> bool {
    let Expr::Call(CallExpr {
        callee: Callee::Expr(callee),
        ..
    }) = call
    else {
        return false;
    };

    let Expr::Member(MemberExpr {
        obj,
        prop: MemberProp::Ident(prop),
        ..
    }) = &**callee
    else {
        return false;
    };

    if !matches!(&**obj, Expr::Ident(obj) if &*obj.sym == "Math") {
        return false;
    }

    if !SIZE_SENSITIVE_MATH_METHODS.contains(&&*prop.sym) {
        return false;
    }

    let Some(original) = math_call_len(call) else {
        return true;
    };

    let mut detect_dot = false;

    // Rejected on ties as well: an equally long literal saves nothing by itself,
    // and later passes may inline it into several places. `Math.sqrt(Math.PI)`
    // and `1.7724538509055159` are both 18 characters, but folding the former
    // lets the inliner replace a 2 character binding with 18 characters twice,
    // which grew three.js by 8 bytes.
    minify_number(value, &mut detect_dot).len() >= original
}
