use std::{borrow::Cow, iter, iter::once};

use swc_atoms::{js_word, JsWord};
use swc_common::{
    pass::{CompilerPass, Repeated},
    util::take::Take,
    Mark, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::{Ident, Lit, *};
use swc_ecma_transforms_base::{ext::ExprRefExt, pass::RepeatedJsPass};
use swc_ecma_utils::{
    alias_ident_for, is_literal, prepend_stmt, prop_name_eq, to_int32, undefined, BoolType,
    ExprCtx, ExprExt, NullType, NumberType, ObjectType, StringType, SymbolType, UndefinedType,
    Value,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut, VisitMutWith};
use Value::{Known, Unknown};

use crate::debug::debug_assert_valid;

#[cfg(test)]
mod tests;

macro_rules! try_val {
    ($v:expr) => {{
        match $v {
            Value::Known(v) => v,
            Value::Unknown => return Value::Unknown,
        }
    }};
}

/// All [bool] fields defaults to [false].
#[derive(Debug, Clone, Copy, Default, Hash)]
pub struct Config {}

/// Not intended for general use. Use [simplifier] instead.
///
/// Ported from `PeepholeFoldConstants` of google closure compiler.
pub fn expr_simplifier(
    unresolved_mark: Mark,
    config: Config,
) -> impl RepeatedJsPass + VisitMut + 'static {
    as_folder(SimplifyExpr {
        expr_ctx: ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
            is_unresolved_ref_safe: false,
        },
        config,
        changed: false,
        vars: Default::default(),
        is_arg_of_update: false,
        is_modifying: false,
        in_callee: false,
    })
}

#[derive(Debug)]
struct SimplifyExpr {
    expr_ctx: ExprCtx,
    config: Config,

    changed: bool,
    /// Uninitialized variables.
    vars: Vec<VarDeclarator>,
    is_arg_of_update: bool,
    is_modifying: bool,
    in_callee: bool,
}

impl CompilerPass for SimplifyExpr {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("simplify-expr")
    }
}

impl Repeated for SimplifyExpr {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.changed = false;
    }
}

impl SimplifyExpr {
    fn fold_member_expr(&mut self, expr: &mut Expr) {
        let MemberExpr { obj, prop, .. } = match expr {
            Expr::Member(member) => member,
            _ => return,
        };
        if self.is_modifying {
            return;
        }

        #[derive(Clone, PartialEq, Eq)]
        enum KnownOp {
            /// [a, b].length
            Len,

            Index(i64),

            /// ({}).foo
            IndexStr(JsWord),
        }
        let op = match prop {
            MemberProp::Ident(Ident {
                sym: js_word!("length"),
                ..
            }) => KnownOp::Len,
            MemberProp::Ident(Ident { sym, .. }) => {
                if !self.in_callee {
                    KnownOp::IndexStr(sym.clone())
                } else {
                    return;
                }
            }
            MemberProp::Computed(ComputedPropName { expr, .. }) => {
                if !self.in_callee {
                    if let Expr::Lit(Lit::Num(Number { value, .. })) = &**expr {
                        if value.fract() == 0.0 {
                            KnownOp::Index(*value as _)
                        } else {
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    return;
                }
            }
            _ => return,
        };

        match &mut **obj {
            Expr::Lit(Lit::Str(Str { value, span, .. })) => match op {
                // 'foo'.length
                KnownOp::Len => {
                    self.changed = true;

                    *expr = Expr::Lit(Lit::Num(Number {
                        value: value.chars().count() as f64,
                        span: *span,
                        raw: None,
                    }));
                }

                // 'foo'[1]
                KnownOp::Index(idx) if (idx as usize) < value.len() => {
                    self.changed = true;

                    if idx < 0 {
                        *expr = *undefined(*span)
                    } else {
                        let value = nth_char(value, idx as _);

                        *expr = Expr::Lit(Lit::Str(Str {
                            raw: None,
                            value: value.into(),
                            span: *span,
                        }))
                    };
                }
                _ => {}
            },

            // [1, 2, 3].length
            Expr::Array(ArrayLit { elems, span }) => {
                // do nothing if spread exists
                let has_spread = elems.iter().any(|elem| {
                    elem.as_ref()
                        .map(|elem| elem.spread.is_some())
                        .unwrap_or(false)
                });

                if has_spread {
                    return;
                }
                if op == KnownOp::Len
                    && !elems
                        .iter()
                        .filter_map(|e| e.as_ref())
                        .any(|e| e.expr.may_have_side_effects(&self.expr_ctx))
                {
                    self.changed = true;

                    *expr = Expr::Lit(Lit::Num(Number {
                        value: elems.len() as _,
                        span: *span,
                        raw: None,
                    }));
                } else if matches!(op, KnownOp::Index(..)) {
                    self.changed = true;

                    let idx = match op {
                        KnownOp::Index(i) => i,
                        _ => unreachable!(),
                    };
                    let len = elems.len();

                    let (before, e, after) = if elems.len() > idx as _ && idx >= 0 {
                        let before = elems.drain(..(idx as usize)).collect();
                        let mut iter = elems.take().into_iter();
                        let e = iter.next().flatten();
                        let after = iter.collect();

                        (before, e, after)
                    } else {
                        let before = elems.take();

                        (before, None, vec![])
                    };

                    let v = match e {
                        None => undefined(*span),
                        Some(e) => e.expr,
                    };

                    let mut exprs = vec![];
                    for elem in before.into_iter().flatten() {
                        self.expr_ctx
                            .extract_side_effects_to(&mut exprs, *elem.expr);
                    }

                    let after_does_not_have_side_effect = after.iter().all(|elem| match elem {
                        Some(elem) => !elem.expr.may_have_side_effects(&self.expr_ctx),
                        None => true,
                    });

                    let val = if (!v.may_have_side_effects(&self.expr_ctx)
                        && after_does_not_have_side_effect)
                        || ((idx as usize) == len - 1)
                        || v.is_lit()
                    {
                        v
                    } else {
                        let var_name = alias_ident_for(&v, "_v");
                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: var_name.clone().into(),
                            init: None,
                            definite: false,
                        });

                        exprs.push(Box::new(Expr::Assign(AssignExpr {
                            span: v.span(),
                            left: PatOrExpr::Pat(var_name.clone().into()),
                            op: op!("="),
                            right: v,
                        })));

                        Box::new(Expr::Ident(var_name))
                    };

                    for elem in after.into_iter().flatten() {
                        self.expr_ctx
                            .extract_side_effects_to(&mut exprs, *elem.expr);
                    }

                    if exprs.is_empty() {
                        *expr = *val;
                        return;
                    }

                    exprs.push(val);

                    *expr = Expr::Seq(SeqExpr { span: *span, exprs });
                }
            }

            // { foo: true }['foo']
            Expr::Object(ObjectLit { props, span }) => match op {
                KnownOp::IndexStr(key) if is_literal(props) && key != *"yield" => {
                    // do nothing if spread exists
                    let has_spread = props
                        .iter()
                        .any(|prop| matches!(prop, PropOrSpread::Spread(..)));

                    if has_spread {
                        return;
                    }

                    let idx = props.iter().rev().position(|p| match &*p {
                        PropOrSpread::Prop(p) => match &**p {
                            Prop::Shorthand(i) => i.sym == key,
                            Prop::KeyValue(k) => prop_name_eq(&k.key, &key),
                            Prop::Assign(p) => p.key.sym == key,
                            Prop::Getter(..) => false,
                            Prop::Setter(..) => false,
                            // TODO
                            Prop::Method(..) => false,
                        },
                        _ => unreachable!(),
                    });
                    let idx = idx.map(|idx| props.len() - 1 - idx);
                    //

                    if let Some(i) = idx {
                        let v = props.remove(i);
                        self.changed = true;

                        *expr = self.expr_ctx.preserve_effects(
                            *span,
                            match v {
                                PropOrSpread::Prop(p) => match *p {
                                    Prop::Shorthand(i) => Expr::Ident(i),
                                    Prop::KeyValue(p) => *p.value,
                                    Prop::Assign(p) => *p.value,
                                    Prop::Getter(..) => unreachable!(),
                                    Prop::Setter(..) => unreachable!(),
                                    // TODO
                                    Prop::Method(..) => unreachable!(),
                                },
                                _ => unreachable!(),
                            },
                            once(Box::new(Expr::Object(ObjectLit {
                                props: props.take(),
                                span: *span,
                            }))),
                        );
                    }
                }
                _ => {}
            },

            _ => {}
        }
    }

    fn fold_bin(&mut self, expr: &mut Expr) {
        let BinExpr {
            left,
            op,
            right,
            span,
        } = match expr {
            Expr::Bin(bin) => bin,
            _ => return,
        };

        macro_rules! try_replace {
            ($v:expr) => {{
                match $v {
                    Known(v) => {
                        // TODO: Optimize
                        self.changed = true;

                        *expr = make_bool_expr(&self.expr_ctx, *span, v, {
                            iter::once(left.take()).chain(iter::once(right.take()))
                        });
                        return;
                    }
                    _ => {}
                }
            }};
            (number, $v:expr) => {{
                match $v {
                    Known(v) => {
                        self.changed = true;

                        let value_expr = if !v.is_nan() {
                            Expr::Lit(Lit::Num(Number {
                                value: v,
                                span: *span,
                                raw: None,
                            }))
                        } else {
                            Expr::Ident(Ident::new(
                                js_word!("NaN"),
                                span.with_ctxt(self.expr_ctx.unresolved_ctxt),
                            ))
                        };

                        *expr = self.expr_ctx.preserve_effects(*span, value_expr, {
                            iter::once(left.take()).chain(iter::once(right.take()))
                        });
                        return;
                    }
                    _ => {}
                }
            }};
        }

        match op {
            op!(bin, "+") => {
                // It's string concatenation if either left or right is string.
                if left.is_str() || left.is_array_lit() || right.is_str() || right.is_array_lit() {
                    if let (Known(l), Known(r)) = (
                        left.as_pure_string(&self.expr_ctx),
                        right.as_pure_string(&self.expr_ctx),
                    ) {
                        let mut l = l.into_owned();

                        l.push_str(&r);

                        self.changed = true;

                        *expr = Expr::Lit(Lit::Str(Str {
                            raw: None,
                            value: l.into(),
                            span: *span,
                        }));
                        return;
                    }
                }

                match expr.get_type() {
                    // String concatenation
                    Known(StringType) => match expr {
                        Expr::Bin(BinExpr {
                            left, right, span, ..
                        }) => {
                            if !left.may_have_side_effects(&self.expr_ctx)
                                && !right.may_have_side_effects(&self.expr_ctx)
                            {
                                if let (Known(l), Known(r)) = (
                                    left.as_pure_string(&self.expr_ctx),
                                    right.as_pure_string(&self.expr_ctx),
                                ) {
                                    self.changed = true;

                                    let value = format!("{}{}", l, r);

                                    *expr = Expr::Lit(Lit::Str(Str {
                                        raw: None,
                                        value: value.into(),
                                        span: *span,
                                    }));
                                }
                            }
                        }
                        _ => unreachable!(),
                    },
                    // Numerical calculation
                    Known(BoolType) | Known(NullType) | Known(NumberType)
                    | Known(UndefinedType) => {
                        match expr {
                            Expr::Bin(BinExpr {
                                left, right, span, ..
                            }) => {
                                if let Known(v) =
                                    self.perform_arithmetic_op(op!(bin, "+"), left, right)
                                {
                                    self.changed = true;
                                    let span = *span;

                                    let value_expr = if !v.is_nan() {
                                        Expr::Lit(Lit::Num(Number {
                                            value: v,
                                            span,
                                            raw: None,
                                        }))
                                    } else {
                                        Expr::Ident(Ident::new(
                                            js_word!("NaN"),
                                            span.with_ctxt(self.expr_ctx.unresolved_ctxt),
                                        ))
                                    };

                                    *expr = self.expr_ctx.preserve_effects(
                                        span,
                                        value_expr,
                                        iter::once(left.take()).chain(iter::once(right.take())),
                                    );
                                }
                            }
                            _ => unreachable!(),
                        };
                    }
                    _ => {}
                }

                //TODO: try string concat
            }

            op!("&&") | op!("||") => {
                if let (_, Known(val)) = left.cast_to_bool(&self.expr_ctx) {
                    let node = if *op == op!("&&") {
                        if val {
                            // 1 && $right
                            right
                        } else {
                            self.changed = true;

                            // 0 && $right
                            *expr = *(left.take());
                            return;
                        }
                    } else if val {
                        self.changed = true;

                        // 1 || $right
                        *expr = *(left.take());
                        return;
                    } else {
                        // 0 || $right
                        right
                    };

                    if !left.may_have_side_effects(&self.expr_ctx) {
                        self.changed = true;

                        *expr = *node.take();
                    } else {
                        self.changed = true;

                        let mut seq = SeqExpr {
                            span: *span,
                            exprs: vec![left.take(), node.take()],
                        };

                        seq.visit_mut_with(self);

                        *expr = Expr::Seq(seq)
                    };
                }
            }
            op!("instanceof") => {
                fn is_non_obj(e: &Expr) -> bool {
                    match *e {
                        // Non-object types are never instances.
                        Expr::Lit(Lit::Str { .. })
                        | Expr::Lit(Lit::Num(..))
                        | Expr::Lit(Lit::Null(..))
                        | Expr::Lit(Lit::Bool(..))
                        | Expr::Ident(Ident {
                            sym: js_word!("undefined"),
                            ..
                        })
                        | Expr::Ident(Ident {
                            sym: js_word!("Infinity"),
                            ..
                        })
                        | Expr::Ident(Ident {
                            sym: js_word!("NaN"),
                            ..
                        }) => true,

                        Expr::Unary(UnaryExpr {
                            op: op!("!"),
                            ref arg,
                            ..
                        })
                        | Expr::Unary(UnaryExpr {
                            op: op!(unary, "-"),
                            ref arg,
                            ..
                        })
                        | Expr::Unary(UnaryExpr {
                            op: op!("void"),
                            ref arg,
                            ..
                        }) => is_non_obj(arg),
                        _ => false,
                    }
                }

                fn is_obj(e: &Expr) -> bool {
                    matches!(
                        *e,
                        Expr::Array { .. }
                            | Expr::Object { .. }
                            | Expr::Fn { .. }
                            | Expr::New { .. }
                    )
                }

                // Non-object types are never instances.
                if is_non_obj(left) {
                    self.changed = true;

                    *expr = make_bool_expr(&self.expr_ctx, *span, false, iter::once(right.take()));
                    return;
                }

                if is_obj(left) && right.is_global_ref_to(&self.expr_ctx, "Object") {
                    self.changed = true;

                    *expr = make_bool_expr(&self.expr_ctx, *span, true, iter::once(left.take()));
                }
            }

            // Arithmetic operations
            op!(bin, "-") | op!("/") | op!("%") | op!("**") => {
                try_replace!(number, self.perform_arithmetic_op(*op, left, right))
            }

            // Bit shift operations
            op!("<<") | op!(">>") | op!(">>>") => {
                /// Uses a method for treating a double as 32bits that is
                /// equivalent to how JavaScript would convert a
                /// number before applying a bit operation.
                fn js_convert_double_to_bits(d: f64) -> i32 {
                    ((d.floor() as i64) & 0xffff_ffff) as i32
                }

                fn try_fold_shift(
                    ctx: &ExprCtx,
                    op: BinaryOp,
                    left: &Expr,
                    right: &Expr,
                ) -> Value<f64> {
                    if !left.is_number() || !right.is_number() {
                        return Unknown;
                    }

                    let (lv, rv) = match (left.as_pure_number(ctx), right.as_pure_number(ctx)) {
                        (Known(lv), Known(rv)) => (lv, rv),
                        _ => unreachable!(),
                    };

                    // only the lower 5 bits are used when shifting, so don't do anything
                    // if the shift amount is outside [0,32)
                    if !(0.0..32.0).contains(&rv) {
                        return Unknown;
                    }

                    let rv_int = rv as i32;
                    if rv_int as f64 != rv {
                        unimplemented!("error reporting: FRACTIONAL_BITWISE_OPERAND")
                        // report(FRACTIONAL_BITWISE_OPERAND, right.span());
                        // return n;
                    }

                    if lv.floor() != lv {
                        unimplemented!("error reporting: FRACTIONAL_BITWISE_OPERAND")
                        // report(FRACTIONAL_BITWISE_OPERAND, left.span());
                        // return n;
                    }

                    let bits = js_convert_double_to_bits(lv);

                    Known(match op {
                        op!("<<") => (bits << rv_int) as f64,
                        op!(">>") => (bits >> rv_int) as f64,
                        op!(">>>") => {
                            let res = bits as u32 >> rv_int as u32;
                            // JavaScript always treats the result of >>> as unsigned.
                            // We must force Java to do the same here.
                            // unimplemented!(">>> (Zerofill rshift)")
                            res as f64
                        }

                        _ => unreachable!("Unknown bit operator {:?}", op),
                    })
                }
                try_replace!(number, try_fold_shift(&self.expr_ctx, *op, left, right))
            }

            // These needs one more check.
            //
            // (a * 1) * 2 --> a * (1 * 2) --> a * 2
            op!("*") | op!("&") | op!("|") | op!("^") => {
                try_replace!(number, self.perform_arithmetic_op(*op, left, right));

                // Try left.rhs * right
                if let Expr::Bin(BinExpr {
                    span: _,
                    left: left_lhs,
                    op: left_op,
                    right: left_rhs,
                }) = &mut **left
                {
                    if *left_op == *op {
                        if let Known(value) = self.perform_arithmetic_op(*op, left_rhs, right) {
                            self.changed = true;
                            *left = left_lhs.take();
                            *right = Box::new(Expr::Lit(Lit::Num(Number {
                                value,
                                span: *span,
                                raw: None,
                            })))
                        }
                    }
                }
            }

            // Comparisons
            op!("<") => {
                try_replace!(self.perform_abstract_rel_cmp(left, right, false))
            }
            op!(">") => {
                try_replace!(self.perform_abstract_rel_cmp(right, left, false))
            }
            op!("<=") => {
                try_replace!(!self.perform_abstract_rel_cmp(right, left, true))
            }
            op!(">=") => {
                try_replace!(!self.perform_abstract_rel_cmp(left, right, true))
            }

            op!("==") => try_replace!(self.perform_abstract_eq_cmp(*span, left, right)),
            op!("!=") => try_replace!(!self.perform_abstract_eq_cmp(*span, left, right)),
            op!("===") => try_replace!(self.perform_strict_eq_cmp(left, right)),
            op!("!==") => try_replace!(!self.perform_strict_eq_cmp(left, right)),
            _ => {}
        };
    }

    /// Folds 'typeof(foo)' if foo is a literal, e.g.
    ///
    /// typeof("bar") --> "string"
    ///
    /// typeof(6) --> "number"
    fn try_fold_typeof(&mut self, expr: &mut Expr) {
        let UnaryExpr { op, arg, span } = match expr {
            Expr::Unary(unary) => unary,
            _ => return,
        };
        assert_eq!(*op, op!("typeof"));

        let val = match &**arg {
            Expr::Fn(..) => "function",
            Expr::Lit(Lit::Str { .. }) => "string",
            Expr::Lit(Lit::Num(..)) => "number",
            Expr::Lit(Lit::Bool(..)) => "boolean",
            Expr::Lit(Lit::Null(..)) | Expr::Object { .. } | Expr::Array { .. } => "object",
            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            })
            | Expr::Ident(Ident {
                sym: js_word!("undefined"),
                ..
            }) => {
                // We can assume `undefined` is `undefined`,
                // because overriding `undefined` is always hard error in swc.
                "undefined"
            }

            _ => {
                return;
            }
        };

        self.changed = true;

        *expr = Expr::Lit(Lit::Str(Str {
            span: *span,
            raw: None,
            value: val.into(),
        }));
    }

    fn fold_unary(&mut self, expr: &mut Expr) {
        let UnaryExpr { op, arg, span } = match expr {
            Expr::Unary(unary) => unary,
            _ => return,
        };
        let may_have_side_effects = arg.may_have_side_effects(&self.expr_ctx);

        match op {
            op!("typeof") if !may_have_side_effects => {
                self.try_fold_typeof(expr);
            }
            op!("!") => {
                match &**arg {
                    // Don't expand booleans.
                    Expr::Lit(Lit::Num(..)) => return,

                    // Don't remove ! from negated iifes.
                    Expr::Call(call) => {
                        if let Callee::Expr(callee) = &call.callee {
                            if let Expr::Fn(..) = &**callee {
                                return;
                            }
                        }
                    }
                    _ => {}
                }

                if let (_, Known(val)) = arg.cast_to_bool(&self.expr_ctx) {
                    self.changed = true;

                    *expr = make_bool_expr(&self.expr_ctx, *span, !val, iter::once(arg.take()));
                }
            }
            op!(unary, "+") => {
                if let Known(v) = arg.as_pure_number(&self.expr_ctx) {
                    self.changed = true;

                    if v.is_nan() {
                        *expr = self.expr_ctx.preserve_effects(
                            *span,
                            Expr::Ident(Ident::new(
                                js_word!("NaN"),
                                span.with_ctxt(self.expr_ctx.unresolved_ctxt),
                            )),
                            iter::once(arg.take()),
                        );
                        return;
                    }

                    *expr = self.expr_ctx.preserve_effects(
                        *span,
                        Expr::Lit(Lit::Num(Number {
                            value: v,
                            span: *span,
                            raw: None,
                        })),
                        iter::once(arg.take()),
                    );
                }
            }
            op!(unary, "-") => match &**arg {
                Expr::Ident(Ident {
                    sym: js_word!("Infinity"),
                    ..
                }) => {}
                // "-NaN" is "NaN"
                Expr::Ident(Ident {
                    sym: js_word!("NaN"),
                    ..
                }) => {
                    self.changed = true;
                    *expr = *(arg.take());
                }
                Expr::Lit(Lit::Num(Number { value: f, .. })) => {
                    self.changed = true;
                    *expr = Expr::Lit(Lit::Num(Number {
                        value: -f,
                        span: *span,
                        raw: None,
                    }));
                }
                _ => {

                    // TODO: Report that user is something bad (negating
                    // non-number value)
                }
            },
            op!("void") if !may_have_side_effects => {
                match &**arg {
                    Expr::Lit(Lit::Num(Number { value, .. })) if *value == 0.0 => return,
                    _ => {}
                }
                self.changed = true;

                *arg = Box::new(Expr::Lit(Lit::Num(Number {
                    value: 0.0,
                    span: arg.span(),
                    raw: None,
                })));
            }

            op!("~") => {
                if let Known(value) = arg.as_pure_number(&self.expr_ctx) {
                    if value.fract() == 0.0 {
                        self.changed = true;
                        *expr = Expr::Lit(Lit::Num(Number {
                            span: *span,
                            value: if value < 0.0 {
                                !(value as i32 as u32) as i32 as f64
                            } else {
                                !(value as u32) as i32 as f64
                            },
                            raw: None,
                        }));
                    }
                    // TODO: Report error
                }
            }
            _ => {}
        }
    }

    /// Try to fold arithmetic binary operators
    fn perform_arithmetic_op(&self, op: BinaryOp, left: &Expr, right: &Expr) -> Value<f64> {
        /// Replace only if it becomes shorter
        macro_rules! try_replace {
            ($value:expr) => {{
                let (ls, rs) = (left.span(), right.span());
                if ls.is_dummy() || rs.is_dummy() {
                    Known($value)
                } else {
                    let new_len = format!("{}", $value).len();
                    if right.span().hi() > left.span().lo() {
                        let orig_len = right.span().hi() - left.span().lo();
                        if new_len <= orig_len.0 as usize {
                            Known($value)
                        } else {
                            Unknown
                        }
                    } else {
                        Known($value)
                    }
                }
            }};
            (i32, $value:expr) => {
                try_replace!($value as f64)
            };
        }

        let (lv, rv) = (
            left.as_pure_number(&self.expr_ctx),
            right.as_pure_number(&self.expr_ctx),
        );

        if (lv.is_unknown() && rv.is_unknown())
            || !left.get_type().casted_to_number_on_add()
            || !right.get_type().casted_to_number_on_add()
        {
            return Unknown;
        }

        match op {
            op!(bin, "+") => {
                if let (Known(lv), Known(rv)) = (lv, rv) {
                    return try_replace!(lv + rv);
                }

                if lv == Known(0.0) {
                    return rv;
                } else if rv == Known(0.0) {
                    return lv;
                }

                return Unknown;
            }
            op!(bin, "-") => {
                if let (Known(lv), Known(rv)) = (lv, rv) {
                    return try_replace!(lv - rv);
                }

                // 0 - x => -x
                if lv == Known(0.0) {
                    return rv;
                }

                // x - 0 => x
                if rv == Known(0.0) {
                    return lv;
                }

                return Unknown;
            }
            op!("*") => {
                if let (Known(lv), Known(rv)) = (lv, rv) {
                    return try_replace!(lv * rv);
                }
                // NOTE: 0*x != 0 for all x, if x==0, then it is NaN.  So we can't take
                // advantage of that without some kind of non-NaN proof.  So the special cases
                // here only deal with 1*x
                if Known(1.0) == lv {
                    return rv;
                }
                if Known(1.0) == rv {
                    return lv;
                }

                return Unknown;
            }

            op!("/") => {
                if let (Known(lv), Known(rv)) = (lv, rv) {
                    if rv == 0.0 {
                        return Unknown;
                    }
                    return try_replace!(lv / rv);
                }

                // NOTE: 0/x != 0 for all x, if x==0, then it is NaN

                if rv == Known(1.0) {
                    // TODO: cloneTree
                    // x/1->x
                    return lv;
                }
                return Unknown;
            }

            op!("**") => {
                if Known(0.0) == rv {
                    return Known(1.0);
                }

                if let (Known(lv), Known(rv)) = (lv, rv) {
                    return try_replace!(lv.powf(rv));
                }

                return Unknown;
            }
            _ => {}
        }
        let (lv, rv) = match (lv, rv) {
            (Known(lv), Known(rv)) => (lv, rv),
            _ => return Unknown,
        };

        match op {
            op!("&") => return try_replace!(i32, to_int32(lv) & to_int32(rv)),
            op!("|") => return try_replace!(i32, to_int32(lv) | to_int32(rv)),
            op!("^") => return try_replace!(i32, to_int32(lv) ^ to_int32(rv)),
            op!("%") => {
                if rv == 0.0 {
                    return Unknown;
                }
                return try_replace!(lv % rv);
            }
            _ => unreachable!("unknown binary operator: {:?}", op),
        }
    }

    /// This actually performs `<`.
    ///
    /// https://tc39.github.io/ecma262/#sec-abstract-relational-comparison
    fn perform_abstract_rel_cmp(
        &mut self,
        left: &Expr,
        right: &Expr,
        will_negate: bool,
    ) -> Value<bool> {
        match (left, right) {
            // Special case: `x < x` is always false.
            (
                &Expr::Ident(Ident { sym: ref li, .. }, ..),
                &Expr::Ident(Ident { sym: ref ri, .. }),
            ) if !will_negate && li == ri => {
                return Known(false);
            }
            // Special case: `typeof a < typeof a` is always false.
            (
                &Expr::Unary(UnaryExpr {
                    op: op!("typeof"),
                    arg: ref la,
                    ..
                }),
                &Expr::Unary(UnaryExpr {
                    op: op!("typeof"),
                    arg: ref ra,
                    ..
                }),
            ) if la.as_ident().is_some()
                && la.as_ident().map(|i| i.to_id()) == ra.as_ident().map(|i| i.to_id()) =>
            {
                return Known(false)
            }
            _ => {}
        }

        // Try to evaluate based on the general type.
        let (lt, rt) = (left.get_type(), right.get_type());

        if let (Known(StringType), Known(StringType)) = (lt, rt) {
            if let (Known(lv), Known(rv)) = (
                left.as_pure_string(&self.expr_ctx),
                right.as_pure_string(&self.expr_ctx),
            ) {
                // In JS, browsers parse \v differently. So do not compare strings if one
                // contains \v.
                if lv.contains('\u{000B}') || rv.contains('\u{000B}') {
                    return Unknown;
                } else {
                    return Known(lv < rv);
                }
            }
        }

        // Then, try to evaluate based on the value of the node. Try comparing as
        // numbers.
        let (lv, rv) = (
            try_val!(left.as_pure_number(&self.expr_ctx)),
            try_val!(right.as_pure_number(&self.expr_ctx)),
        );
        if lv.is_nan() || rv.is_nan() {
            return Known(will_negate);
        }

        Known(lv < rv)
    }

    /// https://tc39.github.io/ecma262/#sec-abstract-equality-comparison
    fn perform_abstract_eq_cmp(&mut self, span: Span, left: &Expr, right: &Expr) -> Value<bool> {
        let (lt, rt) = (try_val!(left.get_type()), try_val!(right.get_type()));

        if lt == rt {
            return self.perform_strict_eq_cmp(left, right);
        }

        match (lt, rt) {
            (NullType, UndefinedType) | (UndefinedType, NullType) => Known(true),
            (NumberType, StringType) | (_, BoolType) => {
                let rv = try_val!(right.as_pure_number(&self.expr_ctx));
                self.perform_abstract_eq_cmp(
                    span,
                    left,
                    &Expr::Lit(Lit::Num(Number {
                        value: rv,
                        span,
                        raw: None,
                    })),
                )
            }

            (StringType, NumberType) | (BoolType, _) => {
                let lv = try_val!(left.as_pure_number(&self.expr_ctx));
                self.perform_abstract_eq_cmp(
                    span,
                    &Expr::Lit(Lit::Num(Number {
                        value: lv,
                        span,
                        raw: None,
                    })),
                    right,
                )
            }

            (StringType, ObjectType)
            | (NumberType, ObjectType)
            | (ObjectType, StringType)
            | (ObjectType, NumberType) => Unknown,

            _ => Known(false),
        }
    }

    /// https://tc39.github.io/ecma262/#sec-strict-equality-comparison
    fn perform_strict_eq_cmp(&mut self, left: &Expr, right: &Expr) -> Value<bool> {
        // Any strict equality comparison against NaN returns false.
        if left.is_nan() || right.is_nan() {
            return Known(false);
        }
        match (left, right) {
            // Special case, typeof a == typeof a is always true.
            (
                &Expr::Unary(UnaryExpr {
                    op: op!("typeof"),
                    arg: ref la,
                    ..
                }),
                &Expr::Unary(UnaryExpr {
                    op: op!("typeof"),
                    arg: ref ra,
                    ..
                }),
            ) if la.as_ident().is_some()
                && la.as_ident().map(|i| i.to_id()) == ra.as_ident().map(|i| i.to_id()) =>
            {
                return Known(true)
            }
            _ => {}
        }

        let (lt, rt) = (try_val!(left.get_type()), try_val!(right.get_type()));
        // Strict equality can only be true for values of the same type.
        if lt != rt {
            return Known(false);
        }

        match lt {
            UndefinedType | NullType => Known(true),
            NumberType => Known(
                try_val!(left.as_pure_number(&self.expr_ctx))
                    == try_val!(right.as_pure_number(&self.expr_ctx)),
            ),
            StringType => {
                let (lv, rv) = (
                    try_val!(left.as_pure_string(&self.expr_ctx)),
                    try_val!(right.as_pure_string(&self.expr_ctx)),
                );
                // In JS, browsers parse \v differently. So do not consider strings
                // equal if one contains \v.
                if lv.contains('\u{000B}') || rv.contains('\u{000B}') {
                    return Unknown;
                }
                Known(lv == rv)
            }
            BoolType => {
                let (lv, rv) = (
                    left.as_pure_bool(&self.expr_ctx),
                    right.as_pure_bool(&self.expr_ctx),
                );

                // lv && rv || !lv && !rv

                lv.and(rv).or((!lv).and(!rv))
            }
            ObjectType | SymbolType => Unknown,
        }
    }
}

impl VisitMut for SimplifyExpr {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        let old = self.is_modifying;
        self.is_modifying = true;
        n.left.visit_mut_with(self);
        self.is_modifying = old;

        self.is_modifying = false;
        n.right.visit_mut_with(self);
        self.is_modifying = old;
    }

    /// This is overriden to preserve `this`.
    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        let old_in_callee = self.in_callee;

        self.in_callee = true;
        match &mut n.callee {
            Callee::Super(..) | Callee::Import(..) => {}
            Callee::Expr(e) => {
                let may_inject_zero = !need_zero_for_this(e);

                match &mut **e {
                    Expr::Seq(seq) => {
                        if seq.exprs.len() == 1 {
                            let mut expr = seq.exprs.take().into_iter().next().unwrap();
                            expr.visit_mut_with(self);
                            *e = expr;
                        } else if let Some(
                            Expr::Member(..)
                            | Expr::Ident(Ident {
                                sym: js_word!("eval"),
                                ..
                            }),
                        ) = seq.exprs.last().map(|v| &**v)
                        {
                            match seq.exprs.get(0).map(|v| &**v) {
                                Some(Expr::Lit(..) | Expr::Ident(..)) => {}
                                _ => {
                                    tracing::debug!("Injecting `0` to preserve `this = undefined`");
                                    seq.exprs.insert(0, 0.0.into());
                                }
                            }

                            seq.visit_mut_with(self);
                        }
                    }

                    _ => {
                        e.visit_mut_with(self);
                    }
                }

                if may_inject_zero && need_zero_for_this(e) {
                    match &mut **e {
                        Expr::Seq(seq) => {
                            seq.exprs.insert(0, 0.into());
                        }
                        _ => {
                            let seq = SeqExpr {
                                span: DUMMY_SP,
                                exprs: vec![0.0.into(), e.take()],
                            };
                            **e = Expr::Seq(seq);
                        }
                    }
                }
            }
        }

        self.in_callee = false;
        n.args.visit_mut_with(self);

        self.in_callee = old_in_callee;
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        if let Expr::Unary(UnaryExpr {
            op: op!("delete"), ..
        }) = expr
        {
            return;
        }
        // fold children before doing something more.
        expr.visit_mut_children_with(self);

        match expr {
            // Do nothing.
            Expr::Lit(_) | Expr::This(..) => return,

            // Remove parenthesis. This may break ast, but it will be fixed up later.
            Expr::Paren(ParenExpr { expr: e, .. }) => {
                self.changed = true;

                *expr = *e.take();
                return;
            }

            Expr::Seq(seq) if seq.exprs.is_empty() => return,

            Expr::Unary(..)
            | Expr::Bin(..)
            | Expr::Member(..)
            | Expr::Cond(..)
            | Expr::Seq(..)
            | Expr::Array(..)
            | Expr::Object(..)
            | Expr::New(..) => {}

            _ => return,
        }

        match expr {
            Expr::Unary(_) => {
                self.fold_unary(expr);
                debug_assert_valid(expr);
            }
            Expr::Bin(_) => {
                self.fold_bin(expr);

                debug_assert_valid(expr);
            }
            Expr::Member(_) => {
                self.fold_member_expr(expr);

                debug_assert_valid(expr);
            }

            Expr::Cond(CondExpr {
                span,
                test,
                cons,
                alt,
            }) => {
                if let (p, Known(val)) = test.cast_to_bool(&self.expr_ctx) {
                    self.changed = true;

                    let expr_value = if val { cons } else { alt };
                    *expr = if p.is_pure() {
                        *(expr_value.take())
                    } else {
                        Expr::Seq(SeqExpr {
                            span: *span,
                            exprs: vec![test.take(), expr_value.take()],
                        })
                    }
                }
            }

            // Simplify sequence expression.
            Expr::Seq(SeqExpr { exprs, .. }) => {
                if exprs.len() == 1 {
                    //TODO: Respan
                    *expr = *exprs.take().into_iter().next().unwrap()
                } else {
                    assert!(!exprs.is_empty(), "sequence expression should not be empty");
                    //TODO: remove unused
                }
            }

            Expr::Array(ArrayLit { elems, .. }) => {
                let mut e = Vec::with_capacity(elems.len());

                for elem in elems.take() {
                    match elem {
                        Some(ExprOrSpread {
                            spread: Some(..),
                            expr,
                        }) if expr.is_array() => {
                            self.changed = true;

                            e.extend(expr.array().unwrap().elems)
                        }

                        _ => e.push(elem),
                    }
                }
                *elems = e;
            }

            Expr::Object(ObjectLit { props, .. }) => {
                let should_work = props
                    .iter()
                    .any(|p| matches!(&*p, PropOrSpread::Spread(..)));
                if !should_work {
                    return;
                }

                let mut ps = Vec::with_capacity(props.len());

                for p in props.take() {
                    match p {
                        PropOrSpread::Spread(SpreadElement { expr, .. }) if expr.is_object() => {
                            let props = expr.object().unwrap().props;
                            ps.extend(props);
                            self.changed = true;
                        }

                        _ => ps.push(p),
                    }
                }
                *props = ps;
            }

            // be conservative.
            _ => {}
        };
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut child = SimplifyExpr {
            expr_ctx: self.expr_ctx.clone(),
            config: self.config,
            changed: Default::default(),
            vars: Default::default(),
            is_arg_of_update: Default::default(),
            is_modifying: Default::default(),
            in_callee: Default::default(),
        };

        n.visit_mut_children_with(&mut child);
        self.changed |= child.changed;

        if !child.vars.is_empty() {
            prepend_stmt(
                n,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: child.vars,
                }))),
            );
        }
    }

    /// Currently noop
    #[inline]
    fn visit_mut_opt_chain_expr(&mut self, _: &mut OptChainExpr) {}

    fn visit_mut_opt_var_decl_or_expr(&mut self, n: &mut Option<VarDeclOrExpr>) {
        if let Some(VarDeclOrExpr::Expr(e)) = n {
            match &mut **e {
                Expr::Seq(SeqExpr { exprs, .. }) if exprs.is_empty() => {
                    *n = None;
                    return;
                }
                _ => {}
            }
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_pat(&mut self, p: &mut Pat) {
        let old_in_callee = self.in_callee;
        self.in_callee = false;
        p.visit_mut_children_with(self);
        self.in_callee = old_in_callee;

        if let Pat::Assign(a) = p {
            if a.right.is_undefined(&self.expr_ctx)
                || match *a.right {
                    Expr::Unary(UnaryExpr {
                        op: op!("void"),
                        ref arg,
                        ..
                    }) => !arg.may_have_side_effects(&self.expr_ctx),
                    _ => false,
                }
            {
                self.changed = true;
                *p = *a.left.take();
            }
        }
    }

    /// Drops unused values
    fn visit_mut_seq_expr(&mut self, e: &mut SeqExpr) {
        if e.exprs.is_empty() {
            return;
        }

        let old_in_callee = self.in_callee;
        let len = e.exprs.len();
        for (idx, e) in e.exprs.iter_mut().enumerate() {
            if idx == len - 1 {
                self.in_callee = old_in_callee;
            } else {
                self.in_callee = false;
            }

            e.visit_mut_with(self);
        }
        self.in_callee = old_in_callee;

        let len = e.exprs.len();

        let last_expr = e.exprs.pop().expect("SeqExpr.exprs must not be empty");

        // Expressions except last one
        let mut exprs = Vec::with_capacity(e.exprs.len() + 1);

        for expr in e.exprs.take() {
            match *expr {
                Expr::Lit(Lit::Num(n)) if self.in_callee && n.value == 0.0 => {
                    if exprs.is_empty() {
                        exprs.push(0.0.into());

                        tracing::trace!("expr_simplifier: Preserving first zero");
                    }
                }

                Expr::Lit(..) | Expr::Ident(..) if self.in_callee => {
                    if exprs.is_empty() {
                        self.changed = true;

                        exprs.push(0.0.into());

                        tracing::debug!("expr_simplifier: Injected first zero");
                    }
                }

                // Drop side-effect free nodes.
                Expr::Lit(_) => {}

                // Flatten array
                Expr::Array(ArrayLit { span, elems }) => {
                    let is_simple = elems
                        .iter()
                        .all(|elem| matches!(elem, None | Some(ExprOrSpread { spread: None, .. })));

                    if is_simple {
                        exprs.extend(elems.into_iter().flatten().map(|e| e.expr));
                    } else {
                        exprs.push(Box::new(ArrayLit { span, elems }.into()));
                    }
                }

                // Default case: preserve it
                _ => exprs.push(expr),
            }
        }

        exprs.push(last_expr);

        self.changed |= len != exprs.len();

        e.exprs = exprs;
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        let old_is_modifying = self.is_modifying;
        self.is_modifying = false;
        let old_is_arg_of_update = self.is_arg_of_update;
        self.is_arg_of_update = false;
        s.visit_mut_children_with(self);
        self.is_arg_of_update = old_is_arg_of_update;
        self.is_modifying = old_is_modifying;

        debug_assert_valid(s);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        let mut child = SimplifyExpr {
            expr_ctx: self.expr_ctx.clone(),
            config: self.config,
            changed: Default::default(),
            vars: Default::default(),
            is_arg_of_update: Default::default(),
            is_modifying: Default::default(),
            in_callee: Default::default(),
        };

        n.visit_mut_children_with(&mut child);
        self.changed |= child.changed;

        if !child.vars.is_empty() {
            prepend_stmt(
                n,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: child.vars,
                })),
            );
        }
    }

    fn visit_mut_update_expr(&mut self, n: &mut UpdateExpr) {
        let old = self.is_modifying;
        self.is_modifying = true;
        n.arg.visit_mut_with(self);
        self.is_modifying = old;
    }

    fn visit_mut_var_decl_or_pat(&mut self, n: &mut VarDeclOrPat) {
        let old = self.is_modifying;
        self.is_modifying = true;
        n.visit_mut_children_with(self);
        self.is_modifying = old;
    }

    fn visit_mut_with_stmt(&mut self, n: &mut WithStmt) {
        n.obj.visit_mut_with(self);
    }
}

/// make a new boolean expression preserving side effects, if any.
fn make_bool_expr<I>(ctx: &ExprCtx, span: Span, value: bool, orig: I) -> Expr
where
    I: IntoIterator<Item = Box<Expr>>,
{
    ctx.preserve_effects(span, Expr::Lit(Lit::Bool(Bool { value, span })), orig)
}

fn nth_char(s: &str, mut idx: usize) -> Cow<str> {
    if !s.contains("\\ud") && !s.contains("\\uD") {
        return Cow::Owned(s.chars().nth(idx).unwrap().to_string());
    }

    let mut iter = s.chars().peekable();

    while let Some(c) = iter.next() {
        if c == '\\' && iter.peek().copied() == Some('u') {
            if idx == 0 {
                let mut buf = String::new();
                buf.push('\\');
                buf.extend(iter.take(5));
                return Cow::Owned(buf);
            } else {
                for _ in 0..5 {
                    iter.next();
                }
            }
        }

        if idx == 0 {
            return Cow::Owned(c.to_string());
        }

        idx -= 1;
    }

    unreachable!("string is too short")
}

fn need_zero_for_this(e: &Expr) -> bool {
    matches!(e, Expr::Member(..) | Expr::Seq(..))
}
