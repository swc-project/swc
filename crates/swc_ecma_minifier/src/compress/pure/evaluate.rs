use radix_fmt::Radix;
use swc_common::{util::take::Take, Spanned, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{number::ToJsString, ExprExt, IsEmpty, Value};

use super::Pure;
use crate::compress::util::{eval_as_number, is_pure_undefined_or_null};
#[cfg(feature = "debug")]
use crate::debug::dump;

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
            if arg.expr.may_have_side_effects(&self.expr_ctx) {
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
            if obj.may_have_side_effects(&self.expr_ctx) {
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
                        report_change!("evaluate: Dropping array.slice call");
                        *e = *obj.take();
                    }
                    1 => {
                        if let Value::Known(start) =
                            call.args[0].expr.as_pure_number(&self.expr_ctx)
                        {
                            if start.is_sign_negative() {
                                return;
                            }

                            let start = start.floor() as usize;

                            self.changed = true;
                            report_change!("evaluate: Reducing array.slice({}) call", start);

                            if start >= arr.elems.len() {
                                *e = ArrayLit {
                                    span: *span,
                                    elems: Default::default(),
                                }
                                .into();
                                return;
                            }

                            let elems = arr.elems.drain(start..).collect();

                            *e = ArrayLit { span: *span, elems }.into();
                        }
                    }
                    _ => {
                        let start = call.args[0].expr.as_pure_number(&self.expr_ctx);
                        let end = call.args[1].expr.as_pure_number(&self.expr_ctx);
                        if let Value::Known(start) = start {
                            if start.is_sign_negative() {
                                return;
                            }

                            let start = start.floor() as usize;

                            if let Value::Known(end) = end {
                                if end.is_sign_negative() {
                                    return;
                                }

                                let end = end.floor() as usize;
                                let end = end.min(arr.elems.len());

                                if start >= end {
                                    return;
                                }

                                self.changed = true;
                                report_change!(
                                    "evaluate: Reducing array.slice({}, {}) call",
                                    start,
                                    end
                                );
                                if start >= arr.elems.len() {
                                    *e = ArrayLit {
                                        span: *span,
                                        elems: Default::default(),
                                    }
                                    .into();
                                    return;
                                }

                                let elems = arr.elems.drain(start..end).collect();

                                *e = ArrayLit { span: *span, elems }.into();
                            }
                        }
                    }
                }
                return;
            }

            if self.options.unsafe_passes
                && &*method_name.sym == "toString"
                && arr.elems.len() == 1
                && arr.elems[0].is_some()
            {
                report_change!("evaluate: Reducing array.toString() call");
                self.changed = true;
                *obj = arr.elems[0]
                    .take()
                    .map(|elem| elem.expr)
                    .unwrap_or_else(|| Expr::undefined(*span));
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
            if arg.expr.may_have_side_effects(&self.expr_ctx) {
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
            if obj.may_have_side_effects(&self.expr_ctx) {
                return;
            }

            let f = match &mut **obj {
                Expr::Fn(v) => v,
                _ => return,
            };

            if &*method_name.sym == "valueOf" {
                if has_spread {
                    return;
                }

                self.changed = true;
                report_change!("evaluate: Reduced `function.valueOf()` into a function expression");

                *e = *obj.take();
                return;
            }

            if self.options.unsafe_passes
                && &*method_name.sym == "toString"
                && f.function.params.is_empty()
                && f.function.body.is_empty()
            {
                if has_spread {
                    return;
                }

                self.changed = true;
                report_change!("evaluate: Reduced `function.toString()` into a string");

                *e = Str {
                    span: call.span,
                    value: "function(){}".into(),
                    raw: None,
                }
                .into();
            }
        }
    }

    pub(super) fn eval_arguments_member_access(&mut self, e: &mut Expr) {
        let member = match e {
            Expr::Member(e) => e,
            _ => return,
        };

        if !member.obj.is_ident_ref_to("arguments") {
            return;
        }

        match &mut member.prop {
            MemberProp::Ident(_) => {}
            MemberProp::PrivateName(_) => {}
            MemberProp::Computed(p) => {
                if let Expr::Lit(Lit::Str(s)) = &*p.expr {
                    if let Ok(value) = s.value.parse::<u32>() {
                        p.expr = Lit::Num(Number {
                            span: s.span,
                            value: value as f64,
                            raw: None,
                        })
                        .into();
                    }
                }
            }
        }
    }

    /// unsafely evaluate call to `Number`.
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
                    if callee.is_ident_ref_to("Number") {
                        self.changed = true;
                        report_change!(
                            "evaluate: Reducing a call to `Number` into an unary operation"
                        );

                        *e = UnaryExpr {
                            span: *span,
                            op: op!(unary, "+"),
                            arg: args.take().into_iter().next().unwrap().expr,
                        }
                        .into();
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

        if args
            .iter()
            .any(|arg| arg.expr.may_have_side_effects(&self.expr_ctx))
        {
            return;
        }

        if &*method.sym == "toFixed" {
            // https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.prototype.tofixed
            //
            // Note 1: This method returns a String containing this Number value represented
            // in decimal fixed-point notation with fractionDigits digits after the decimal
            // point. If fractionDigits is undefined, 0 is assumed.

            // Note 2: The output of toFixed may be more precise than toString for some
            // values because toString only prints enough significant digits to distinguish
            // the number from adjacent Number values. For example,
            //
            // (1000000000000000128).toString() returns "1000000000000000100", while
            // (1000000000000000128).toFixed(0) returns "1000000000000000128".

            // 1. Let x be ? thisNumberValue(this value).
            // 2. Let f be ? ToIntegerOrInfinity(fractionDigits).
            if let Some(precision) = args
                .first()
                // 3. Assert: If fractionDigits is undefined, then f is 0.
                .map_or(Some(0f64), |arg| eval_as_number(&self.expr_ctx, &arg.expr))
            {
                let f = precision.trunc() as u8;

                // 4. If f is not finite, throw a RangeError exception.
                // 5. If f < 0 or f > 100, throw a RangeError exception.

                // Note: ES2018 increased the maximum number of fraction digits from 20 to 100.
                // It relies on runtime behavior.
                if !(0..=20).contains(&f) {
                    return;
                }

                let mut buffer = ryu_js::Buffer::new();
                let value = buffer.format_to_fixed(num.value, f);

                self.changed = true;
                report_change!(
                    "evaluate: Evaluating `{}.toFixed({})` as `{}`",
                    num,
                    precision,
                    value
                );

                *e = Lit::Str(Str {
                    span: e.span(),
                    raw: None,
                    value: value.into(),
                })
                .into();
            }

            return;
        }

        if &*method.sym == "toPrecision" {
            // TODO: handle num.toPrecision(undefined)
            if args.is_empty() {
                // https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-number.prototype.toprecision
                // 2. If precision is undefined, return ! ToString(x).
                let value = num.value.to_js_string().into();

                self.changed = true;
                report_change!(
                    "evaluate: Evaluating `{}.toPrecision()` as `{}`",
                    num,
                    value
                );

                *e = Lit::Str(Str {
                    span: e.span(),
                    raw: None,
                    value,
                })
                .into();
                return;
            }

            if let Some(precision) = args
                .first()
                .and_then(|arg| eval_as_number(&self.expr_ctx, &arg.expr))
            {
                let p = precision.trunc() as usize;
                // 5. If p < 1 or p > 100, throw a RangeError exception.
                if !(1..=21).contains(&p) {
                    return;
                }

                let value = f64_to_precision(num.value, p);
                self.changed = true;
                report_change!(
                    "evaluate: Evaluating `{}.toPrecision()` as `{}`",
                    num,
                    value
                );
                *e = Lit::Str(Str {
                    span: e.span(),
                    raw: None,
                    value: value.into(),
                })
                .into();
                return;
            }
        }

        if &*method.sym == "toExponential" {
            // TODO: handle num.toExponential(undefined)
            if args.is_empty() {
                let value = f64_to_exponential(num.value).into();

                self.changed = true;
                report_change!(
                    "evaluate: Evaluating `{}.toExponential()` as `{}`",
                    num,
                    value
                );

                *e = Lit::Str(Str {
                    span: e.span(),
                    raw: None,
                    value,
                })
                .into();
                return;
            } else if let Some(precision) = args
                .first()
                .and_then(|arg| eval_as_number(&self.expr_ctx, &arg.expr))
            {
                let p = precision.trunc() as usize;
                // 5. If p < 1 or p > 100, throw a RangeError exception.
                if !(0..=20).contains(&p) {
                    return;
                }

                let value = f64_to_exponential_with_precision(num.value, p).into();

                self.changed = true;
                report_change!(
                    "evaluate: Evaluating `{}.toPrecision({})` as `{}`",
                    num,
                    precision,
                    value
                );

                *e = Lit::Str(Str {
                    span: e.span(),
                    raw: None,
                    value,
                })
                .into();
                return;
            }
        }

        if &*method.sym == "toString" {
            if let Some(base) = args
                .first()
                .map_or(Some(10f64), |arg| eval_as_number(&self.expr_ctx, &arg.expr))
            {
                if base.trunc() == 10. {
                    let value = num.value.to_js_string().into();
                    *e = Lit::Str(Str {
                        span: e.span(),
                        raw: None,
                        value,
                    })
                    .into();
                    return;
                }

                if num.value.fract() == 0.0 && (2.0..=36.0).contains(&base) && base.fract() == 0.0 {
                    let base = base.floor() as u8;

                    self.changed = true;

                    let value = {
                        let x = num.value;
                        if x < 0. {
                            // I don't know if u128 is really needed, but it works.
                            format!("-{}", Radix::new(-x as u128, base))
                        } else {
                            Radix::new(x as u128, base).to_string()
                        }
                    }
                    .into();

                    *e = Lit::Str(Str {
                        span: e.span(),
                        raw: None,
                        value,
                    })
                    .into()
                }
            }
        }
    }

    pub(super) fn eval_opt_chain(&mut self, e: &mut Expr) {
        let opt = match e {
            Expr::OptChain(e) => e,
            _ => return,
        };

        match &mut *opt.base {
            OptChainBase::Member(MemberExpr { span, obj, .. }) => {
                //
                if is_pure_undefined_or_null(&self.expr_ctx, obj) {
                    self.changed = true;
                    report_change!(
                        "evaluate: Reduced an optional chaining operation because object is \
                         always null or undefined"
                    );

                    *e = *Expr::undefined(*span);
                }
            }

            OptChainBase::Call(OptCall { span, callee, .. }) => {
                if is_pure_undefined_or_null(&self.expr_ctx, callee) {
                    self.changed = true;
                    report_change!(
                        "evaluate: Reduced a call expression with optional chaining operation \
                         because object is always null or undefined"
                    );

                    *e = *Expr::undefined(*span);
                }
            }
        }
    }

    /// Note: this method requires boolean context.
    ///
    /// - `foo || 1` => `foo, 1`
    pub(super) fn optmize_known_logical_expr(&mut self, e: &mut Expr) {
        let bin_expr = match e {
            Expr::Bin(
                e @ BinExpr {
                    op: op!("||") | op!("&&"),
                    ..
                },
            ) => e,
            _ => return,
        };

        if bin_expr.op == op!("||") {
            if let Value::Known(v) = bin_expr.right.as_pure_bool(&self.expr_ctx) {
                // foo || 1 => foo, 1
                if v {
                    self.changed = true;
                    report_change!("evaluate: `foo || true` => `foo, 1`");

                    *e = SeqExpr {
                        span: bin_expr.span,
                        exprs: vec![bin_expr.left.clone(), bin_expr.right.clone()],
                    }
                    .into();
                } else {
                    self.changed = true;
                    report_change!("evaluate: `foo || false` => `foo` (bool ctx)");

                    *e = *bin_expr.left.take();
                }
                return;
            }

            // 1 || foo => foo
            if let Value::Known(true) = bin_expr.left.as_pure_bool(&self.expr_ctx) {
                self.changed = true;
                report_change!("evaluate: `true || foo` => `foo`");

                *e = *bin_expr.right.take();
            }
        } else {
            debug_assert_eq!(bin_expr.op, op!("&&"));

            if let Value::Known(v) = bin_expr.right.as_pure_bool(&self.expr_ctx) {
                if v {
                    self.changed = true;
                    report_change!("evaluate: `foo && true` => `foo` (bool ctx)");

                    *e = *bin_expr.left.take();
                } else {
                    self.changed = true;
                    report_change!("evaluate: `foo && false` => `foo, false`");

                    *e = SeqExpr {
                        span: bin_expr.span,
                        exprs: vec![bin_expr.left.clone(), bin_expr.right.clone()],
                    }
                    .into();
                }
                return;
            }

            if let Value::Known(true) = bin_expr.left.as_pure_bool(&self.expr_ctx) {
                self.changed = true;
                report_change!("evaluate: `true && foo` => `foo`");

                *e = *bin_expr.right.take();
            }
        }
    }

    pub(super) fn eval_trivial_values_in_expr(&mut self, seq: &mut SeqExpr) {
        if seq.exprs.len() < 2 {
            return;
        }

        'outer: for idx in 0..seq.exprs.len() {
            let (a, b) = seq.exprs.split_at_mut(idx);

            for a in a.iter().rev() {
                if let Some(b) = b.first_mut() {
                    self.eval_trivial_two(a, b);

                    match &**b {
                        Expr::Ident(..) | Expr::Lit(..) => {}
                        _ => break 'outer,
                    }
                }
            }
        }
    }

    pub(super) fn eval_member_expr(&mut self, e: &mut Expr) {
        let member_expr = match e {
            Expr::Member(x) => x,
            _ => return,
        };

        if let Some(replacement) =
            self.optimize_member_expr(&mut member_expr.obj, &member_expr.prop)
        {
            *e = replacement;
            self.changed = true;
            report_change!(
                "member_expr: Optimized member expression as {}",
                dump(&*e, false)
            );
        }
    }

    fn eval_trivial_two(&mut self, a: &Expr, b: &mut Expr) {
        if let Expr::Assign(AssignExpr {
            left: a_left,
            op: op!("="),
            right: a_right,
            ..
        }) = a
        {
            match &**a_right {
                Expr::Lit(..) => {}
                _ => return,
            }

            if let AssignTarget::Simple(SimpleAssignTarget::Ident(a_left)) = a_left {
                if let Expr::Ident(b_id) = b {
                    if b_id.to_id() == a_left.id.to_id() {
                        report_change!("evaluate: Trivial: `{}`", a_left.id);
                        *b = *a_right.clone();
                        self.changed = true;
                    }
                }
            }
        }
    }
}

/// Evaluation of strings.
impl Pure<'_> {
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
                            let mut b = [0; 2];
                            v.encode_utf16(&mut b);
                            let v = b[0];

                            self.changed = true;
                            report_change!(
                                "evaluate: Evaluated `charCodeAt` of a string literal as `{}`",
                                v
                            );
                            *e = Lit::Num(Number {
                                span: call.span,
                                value: v as usize as f64,
                                raw: None,
                            })
                            .into()
                        }
                        None => {
                            self.changed = true;
                            report_change!(
                                "evaluate: Evaluated `charCodeAt` of a string literal as `NaN`",
                            );
                            *e = Ident::new("NaN".into(), e.span(), SyntaxContext::empty()).into()
                        }
                    }
                }
                return;
            }
            "codePointAt" => {
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
                            report_change!(
                                "evaluate: Evaluated `codePointAt` of a string literal as `{}`",
                                v
                            );
                            *e = Lit::Num(Number {
                                span: call.span,
                                value: v as usize as f64,
                                raw: None,
                            })
                            .into()
                        }
                        None => {
                            self.changed = true;
                            report_change!(
                                "evaluate: Evaluated `codePointAt` of a string literal as `NaN`",
                            );
                            *e = Ident::new(
                                "NaN".into(),
                                e.span(),
                                SyntaxContext::empty().apply_mark(self.marks.unresolved_mark),
                            )
                            .into()
                        }
                    }
                }
                return;
            }
            _ => return,
        };

        self.changed = true;
        report_change!("evaluate: Evaluated `{method}` of a string literal");
        *e = Lit::Str(Str {
            value: new_val.into(),
            raw: None,
            ..s
        })
        .into();
    }
}

// Code from boa
// https://github.com/boa-dev/boa/blob/f8b682085d7fe0bbfcd0333038e93cf2f5aee710/boa_engine/src/builtins/number/mod.rs#L408
fn f64_to_precision(value: f64, precision: usize) -> String {
    let mut x = value;
    let p_i32 = precision as i32;

    // 7. Let s be the empty String.
    let mut s = String::new();
    let mut m: String;
    let mut e: i32;

    // 8. If x < 0, then a. Set s to the code unit 0x002D (HYPHEN-MINUS). b. Set x
    //    to -x.
    if x < 0. {
        s.push('-');
        x = -x;
    }

    // 9. If x = 0, then a. Let m be the String value consisting of p occurrences of
    //    the code unit 0x0030 (DIGIT ZERO). b. Let e be 0.
    if x == 0.0 {
        m = "0".repeat(precision);
        e = 0;
    // 10
    } else {
        // Due to f64 limitations, this part differs a bit from the spec,
        // but has the same effect. It manipulates the string constructed
        // by `format`: digits with an optional dot between two of them.
        m = format!("{x:.100}");

        // a: getting an exponent
        e = flt_str_to_exp(&m);
        // b: getting relevant digits only
        if e < 0 {
            m = m.split_off((1 - e) as usize);
        } else if let Some(n) = m.find('.') {
            m.remove(n);
        }
        // impl: having exactly `precision` digits in `suffix`
        if round_to_precision(&mut m, precision) {
            e += 1;
        }

        // c: switching to scientific notation
        let great_exp = e >= p_i32;
        if e < -6 || great_exp {
            assert_ne!(e, 0);

            // ii
            if precision > 1 {
                m.insert(1, '.');
            }
            // vi
            m.push('e');
            // iii
            if great_exp {
                m.push('+');
            }
            // iv, v
            m.push_str(&e.to_string());

            return s + &*m;
        }
    }

    // 11
    let e_inc = e + 1;
    if e_inc == p_i32 {
        return s + &*m;
    }

    // 12
    if e >= 0 {
        m.insert(e_inc as usize, '.');
    // 13
    } else {
        s.push('0');
        s.push('.');
        s.push_str(&"0".repeat(-e_inc as usize));
    }

    // 14
    s + &*m
}

fn flt_str_to_exp(flt: &str) -> i32 {
    let mut non_zero_encountered = false;
    let mut dot_encountered = false;
    for (i, c) in flt.chars().enumerate() {
        if c == '.' {
            if non_zero_encountered {
                return (i as i32) - 1;
            }
            dot_encountered = true;
        } else if c != '0' {
            if dot_encountered {
                return 1 - (i as i32);
            }
            non_zero_encountered = true;
        }
    }
    (flt.len() as i32) - 1
}

fn round_to_precision(digits: &mut String, precision: usize) -> bool {
    if digits.len() > precision {
        let to_round = digits.split_off(precision);
        let mut digit = digits
            .pop()
            .expect("already checked that length is bigger than precision")
            as u8;
        if let Some(first) = to_round.chars().next() {
            if first > '4' {
                digit += 1;
            }
        }

        if digit as char == ':' {
            // ':' is '9' + 1
            // need to propagate the increment backward
            let mut replacement = String::from("0");
            let mut propagated = false;
            for c in digits.chars().rev() {
                let d = match (c, propagated) {
                    ('0'..='8', false) => (c as u8 + 1) as char,
                    (_, false) => '0',
                    (_, true) => c,
                };
                replacement.push(d);
                if d != '0' {
                    propagated = true;
                }
            }
            digits.clear();
            let replacement = if propagated {
                replacement.as_str()
            } else {
                digits.push('1');
                &replacement.as_str()[1..]
            };
            for c in replacement.chars().rev() {
                digits.push(c);
            }
            !propagated
        } else {
            digits.push(digit as char);
            false
        }
    } else {
        digits.push_str(&"0".repeat(precision - digits.len()));
        false
    }
}

/// Helper function that formats a float as a ES6-style exponential number
/// string.
fn f64_to_exponential(n: f64) -> String {
    match n.abs() {
        x if x >= 1.0 || x == 0.0 => format!("{n:e}").replace('e', "e+"),
        _ => format!("{n:e}"),
    }
}

/// Helper function that formats a float as a ES6-style exponential number
/// string with a given precision.
// We can't use the same approach as in `f64_to_exponential`
// because in cases like (0.999).toExponential(0) the result will be 1e0.
// Instead we get the index of 'e', and if the next character is not '-'
// we insert the plus sign
fn f64_to_exponential_with_precision(n: f64, prec: usize) -> String {
    let mut res = format!("{n:.prec$e}");
    let idx = res.find('e').expect("'e' not found in exponential string");
    if res.as_bytes()[idx + 1] != b'-' {
        res.insert(idx + 1, '+');
    }
    res
}
