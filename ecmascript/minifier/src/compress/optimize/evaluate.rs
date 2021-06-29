use super::Optimizer;
use super::DISABLE_BUGGY_PASSES;
use crate::compress::optimize::is_pure_undefined_or_null;
use std::f64;
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
        self.eval_number_method_call(e);

        self.eval_known_static_method_call(e);
        self.eval_str_method_call(e);

        self.eval_array_method_call(e);
        self.eval_fn_method_call(e);

        self.eval_opt_chain(e);
    }

    fn eval_global_vars(&mut self, e: &mut Expr) {
        if self.options.ie8 {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.in_lhs_of_assign {
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

    /// Handle calls on some static classes.
    /// e.g. `String.fromCharCode`, `Object.keys()`
    fn eval_known_static_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.in_lhs_of_assign {
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
                            log::trace!(
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
                            log::trace!(
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
                                        log::trace!(
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

    /// Handle calls on string literals, like `'foo'.toUpperCase()`.
    fn eval_str_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.in_lhs_of_assign {
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
                                log::trace!(
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

        if !self.options.evaluate {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.in_lhs_of_assign {
            return;
        }

        match e {
            Expr::Call(..) => {
                if let Some(value) = self.eval_as_number(&e) {
                    self.changed = true;
                    log::trace!("evaluate: Evaluated an expression as `{}`", value);

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

    /// Evaluates method calls of a numeric constant.
    fn eval_number_method_call(&mut self, e: &mut Expr) {
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
                if let Some(precision) = self.eval_as_number(&args[0].expr) {
                    let precision = precision.floor() as usize;
                    let value = num_to_fixed(num.value, precision + 1);

                    self.changed = true;
                    log::trace!(
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

    /// This method does **not** modifies `e`.
    ///
    /// This method is used to test if a whole call can be replaced, while
    /// preserving standalone constants.
    fn eval_as_number(&mut self, e: &Expr) -> Option<f64> {
        match e {
            Expr::Bin(BinExpr {
                op: op!(bin, "-"),
                left,
                right,
                ..
            }) => {
                let l = self.eval_as_number(&left)?;
                let r = self.eval_as_number(&right)?;

                return Some(l - r);
            }

            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(callee),
                args,
                ..
            }) => {
                for arg in &*args {
                    if arg.spread.is_some() || arg.expr.may_have_side_effects() {
                        return None;
                    }
                }

                match &**callee {
                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Expr(obj),
                        prop,
                        computed: false,
                        ..
                    }) => {
                        let prop = match &**prop {
                            Expr::Ident(i) => i,
                            _ => return None,
                        };

                        match &**obj {
                            Expr::Ident(obj) if &*obj.sym == "Math" => match &*prop.sym {
                                "cos" => {
                                    let v = self.eval_as_number(&args.first()?.expr)?;

                                    return Some(v.cos());
                                }
                                "sin" => {
                                    let v = self.eval_as_number(&args.first()?.expr)?;

                                    return Some(v.sin());
                                }

                                "max" => {
                                    let mut numbers = vec![];
                                    for arg in args {
                                        let v = self.eval_as_number(&arg.expr)?;
                                        if v.is_infinite() || v.is_nan() {
                                            return None;
                                        }
                                        numbers.push(v);
                                    }

                                    return Some(
                                        numbers
                                            .into_iter()
                                            .max_by(|a, b| a.partial_cmp(b).unwrap())
                                            .unwrap_or(f64::NEG_INFINITY),
                                    );
                                }

                                "min" => {
                                    let mut numbers = vec![];
                                    for arg in args {
                                        let v = self.eval_as_number(&arg.expr)?;
                                        if v.is_infinite() || v.is_nan() {
                                            return None;
                                        }
                                        numbers.push(v);
                                    }

                                    return Some(
                                        numbers
                                            .into_iter()
                                            .min_by(|a, b| a.partial_cmp(b).unwrap())
                                            .unwrap_or(f64::INFINITY),
                                    );
                                }

                                "pow" => {
                                    if args.len() != 2 {
                                        return None;
                                    }
                                    let first = self.eval_as_number(&args[0].expr)?;
                                    let second = self.eval_as_number(&args[1].expr)?;

                                    return Some(first.powf(second));
                                }

                                _ => {}
                            },
                            _ => {}
                        }
                    }
                    _ => {}
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
                    _ => return None,
                };

                match &**obj {
                    Expr::Ident(obj) if &*obj.sym == "Math" => match &*prop.sym {
                        "PI" => return Some(f64::consts::PI),
                        "E" => return Some(f64::consts::E),
                        "LN10" => return Some(f64::consts::LN_10),
                        _ => {}
                    },
                    _ => {}
                }
            }

            _ => {
                if let Known(v) = e.as_number() {
                    return Some(v);
                }
            }
        }

        None
    }

    fn eval_array_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.in_lhs_of_assign {
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

    fn eval_fn_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.in_lhs_of_assign {
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
                obj: ExprOrSuper::Expr(obj),
                prop,
                computed: false,
                ..
            }) => {
                if obj.may_have_side_effects() {
                    return;
                }

                let _f = match &mut **obj {
                    Expr::Fn(v) => v,
                    _ => return,
                };

                let method_name = match &**prop {
                    Expr::Ident(i) => i,
                    _ => return,
                };

                match &*method_name.sym {
                    "valueOf" => {
                        if has_spread {
                            return;
                        }

                        self.changed = true;
                        log::trace!(
                            "evaludate: Reduced `funtion.valueOf()` into a function expression"
                        );

                        *e = *obj.take();
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

    fn eval_opt_chain(&mut self, e: &mut Expr) {
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
                    log::trace!(
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
                    log::trace!(
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
