use std::{borrow::Cow, iter, iter::once};

use swc_atoms::{Atom, JsWord};
use swc_common::{
    pass::{CompilerPass, Repeated},
    util::take::Take,
    Mark, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{
    ext::ExprRefExt,
    perf::{cpu_count, Parallel, ParallelExt},
};
use swc_ecma_utils::{
    is_literal, number::JsNumber, prop_name_eq, to_int32, BoolType, ExprCtx, ExprExt, NullType,
    NumberType, ObjectType, StringType, SymbolType, UndefinedType, Value,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
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
) -> impl Repeated + Pass + CompilerPass + VisitMut + 'static {
    visit_mut_pass(SimplifyExpr {
        expr_ctx: ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
            is_unresolved_ref_safe: false,
            in_strict: false,
        },
        config,
        changed: false,
        is_arg_of_update: false,
        is_modifying: false,
        in_callee: false,
    })
}

impl Parallel for SimplifyExpr {
    fn create(&self) -> Self {
        Self {
            expr_ctx: self.expr_ctx.clone(),
            ..*self
        }
    }

    fn merge(&mut self, other: Self) {
        self.changed |= other.changed;
    }
}

#[derive(Debug)]
struct SimplifyExpr {
    expr_ctx: ExprCtx,
    config: Config,

    changed: bool,
    is_arg_of_update: bool,
    is_modifying: bool,
    in_callee: bool,
}

impl CompilerPass for SimplifyExpr {
    fn name(&self) -> Cow<'static, str> {
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
    fn optimize_member_expr(&mut self, expr: &mut Expr) {
        let MemberExpr { obj, prop, .. } = match expr {
            Expr::Member(member) => member,
            _ => return,
        };
        if self.is_modifying {
            return;
        }

        #[derive(Clone, PartialEq)]
        enum KnownOp {
            /// [a, b].length
            Len,

            /// [a, b][0]
            ///
            /// {0.5: "bar"}[0.5]
            /// Note: callers need to check `v.fract() == 0.0` in some cases.
            /// ie non-integer indexes for arrays result in `undefined`
            /// but not for objects (because indexing an object
            /// returns the value of the key, ie `0.5` will not
            /// return `undefined` if a key `0.5` exists
            /// and its value is not `undefined`).
            Index(f64),

            /// ({}).foo
            IndexStr(JsWord),
        }
        let op = match prop {
            MemberProp::Ident(IdentName { sym, .. }) if &**sym == "length" && !obj.is_object() => {
                KnownOp::Len
            }
            MemberProp::Ident(IdentName { sym, .. }) => {
                if self.in_callee {
                    return;
                }

                KnownOp::IndexStr(sym.clone())
            }
            MemberProp::Computed(ComputedPropName { expr, .. }) => {
                if self.in_callee {
                    return;
                }

                if let Expr::Lit(Lit::Num(Number { value, .. })) = &**expr {
                    // x[5]
                    KnownOp::Index(*value)
                } else if let Known(s) = expr.as_pure_string(&self.expr_ctx) {
                    if s == "length" && !obj.is_object() {
                        // Length of non-object type
                        KnownOp::Len
                    } else if let Ok(n) = s.parse::<f64>() {
                        // x['0'] is treated as x[0]
                        KnownOp::Index(n)
                    } else {
                        // x[''] or x[...] where ... is an expression like [], ie x[[]]
                        KnownOp::IndexStr(s.into())
                    }
                } else {
                    return;
                }
            }
            _ => return,
        };

        // Note: pristine_globals refers to the compress config option pristine_globals.
        // Any potential cases where globals are not pristine are handled in compress,
        // e.g. x[-1] is not changed as the object's prototype may be modified.
        // For example, Array.prototype[-1] = "foo" will result in [][-1] returning
        // "foo".

        match &mut **obj {
            Expr::Lit(Lit::Str(Str { value, span, .. })) => match op {
                // 'foo'.length
                //
                // Prototype changes do not affect .length, so we don't need to worry
                // about pristine_globals here.
                KnownOp::Len => {
                    self.changed = true;

                    *expr = Lit::Num(Number {
                        value: value.chars().map(|c| c.len_utf16()).sum::<usize>() as _,
                        span: *span,
                        raw: None,
                    })
                    .into();
                }

                // 'foo'[1]
                KnownOp::Index(idx) => {
                    if idx.fract() != 0.0 || idx < 0.0 || idx as usize >= value.len() {
                        // Prototype changes affect indexing if the index is out of bounds, so we
                        // don't replace out-of-bound indexes.
                        return;
                    }

                    let Some(value) = nth_char(value, idx as _) else {
                        return;
                    };

                    self.changed = true;

                    *expr = Lit::Str(Str {
                        raw: None,
                        value: value.into(),
                        span: *span,
                    })
                    .into()
                }

                // 'foo'['']
                //
                // Handled in compress
                KnownOp::IndexStr(..) => {}
            },

            // [1, 2, 3].length
            //
            // [1, 2, 3][0]
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

                match op {
                    KnownOp::Len => {
                        // do nothing if replacement will have side effects
                        let may_have_side_effects = elems
                            .iter()
                            .filter_map(|e| e.as_ref())
                            .any(|e| e.expr.may_have_side_effects(&self.expr_ctx));

                        if may_have_side_effects {
                            return;
                        }

                        // Prototype changes do not affect .length
                        self.changed = true;

                        *expr = Lit::Num(Number {
                            value: elems.len() as _,
                            span: *span,
                            raw: None,
                        })
                        .into();
                    }

                    KnownOp::Index(idx) => {
                        // If the fraction part is non-zero, or if the index is out of bounds,
                        // then we handle this in compress as Array's prototype may be modified.
                        if idx.fract() != 0.0 || idx < 0.0 || idx as usize >= elems.len() {
                            return;
                        }

                        // Don't change if after has side effects.
                        let after_has_side_effect =
                            elems
                                .iter()
                                .skip((idx as usize + 1) as _)
                                .any(|elem| match elem {
                                    Some(elem) => elem.expr.may_have_side_effects(&self.expr_ctx),
                                    None => false,
                                });

                        if after_has_side_effect {
                            return;
                        }

                        self.changed = true;

                        // elements before target element
                        let before: Vec<Option<ExprOrSpread>> =
                            elems.drain(..(idx as usize)).collect();
                        let mut iter = elems.take().into_iter();
                        // element at idx
                        let e = iter.next().flatten();
                        // elements after target element
                        let after: Vec<Option<ExprOrSpread>> = iter.collect();

                        // element value
                        let v = match e {
                            None => Expr::undefined(*span),
                            Some(e) => e.expr,
                        };

                        // Replacement expressions.
                        let mut exprs = Vec::new();

                        // Add before side effects.
                        for elem in before.into_iter().flatten() {
                            self.expr_ctx
                                .extract_side_effects_to(&mut exprs, *elem.expr);
                        }

                        // Element value.
                        let val = v;

                        // Add after side effects.
                        for elem in after.into_iter().flatten() {
                            self.expr_ctx
                                .extract_side_effects_to(&mut exprs, *elem.expr);
                        }

                        // Note: we always replace with a SeqExpr so that
                        // `this` remains undefined in strict mode.

                        if exprs.is_empty() {
                            // No side effects exist, replace with:
                            // (0, val)
                            *expr = SeqExpr {
                                span: val.span(),
                                exprs: vec![0.into(), val],
                            }
                            .into();
                            return;
                        }

                        // Add value and replace with SeqExpr
                        exprs.push(val);
                        *expr = SeqExpr { span: *span, exprs }.into();
                    }

                    // Handled in compress
                    KnownOp::IndexStr(..) => {}
                }
            }

            // { foo: true }['foo']
            //
            // { 0.5: true }[0.5]
            Expr::Object(ObjectLit { props, span }) => {
                // get key
                let key = match op {
                    KnownOp::Index(i) => Atom::from(i.to_string()),
                    KnownOp::IndexStr(key) if key != *"yield" && is_literal(props) => key,
                    _ => return,
                };

                // Get `key`s value. Non-existent keys are handled in compress.
                // This also checks if spread exists.
                let Some(v) = get_key_value(&key, props) else {
                    return;
                };

                self.changed = true;

                *expr = *self.expr_ctx.preserve_effects(
                    *span,
                    v,
                    once(
                        ObjectLit {
                            props: props.take(),
                            span: *span,
                        }
                        .into(),
                    ),
                );
            }

            _ => {}
        }
    }

    fn optimize_bin_expr(&mut self, expr: &mut Expr) {
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

                        *expr = *make_bool_expr(&self.expr_ctx, *span, v, {
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
                                "NaN".into(),
                                *span,
                                self.expr_ctx.unresolved_ctxt,
                            ))
                        };

                        *expr = *self.expr_ctx.preserve_effects(*span, value_expr.into(), {
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

                        *expr = Lit::Str(Str {
                            raw: None,
                            value: l.into(),
                            span: *span,
                        })
                        .into();
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

                                    *expr = Lit::Str(Str {
                                        raw: None,
                                        value: value.into(),
                                        span: *span,
                                    })
                                    .into();
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
                                        Lit::Num(Number {
                                            value: v,
                                            span,
                                            raw: None,
                                        })
                                        .into()
                                    } else {
                                        Ident::new(
                                            "NaN".into(),
                                            span,
                                            self.expr_ctx.unresolved_ctxt,
                                        )
                                        .into()
                                    };

                                    *expr = *self.expr_ctx.preserve_effects(
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
                            *expr = *left.take();
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

                        if node.directness_maters() {
                            *expr = SeqExpr {
                                span: node.span(),
                                exprs: vec![0.into(), node.take()],
                            }
                            .into();
                        } else {
                            *expr = *node.take();
                        }
                    } else {
                        self.changed = true;

                        let mut seq = SeqExpr {
                            span: *span,
                            exprs: vec![left.take(), node.take()],
                        };

                        seq.visit_mut_with(self);

                        *expr = seq.into()
                    };
                }
            }
            op!("instanceof") => {
                fn is_non_obj(e: &Expr) -> bool {
                    match e {
                        // Non-object types are never instances.
                        Expr::Lit(Lit::Str { .. })
                        | Expr::Lit(Lit::Num(..))
                        | Expr::Lit(Lit::Null(..))
                        | Expr::Lit(Lit::Bool(..)) => true,
                        Expr::Ident(Ident { sym, .. }) if &**sym == "undefined" => true,
                        Expr::Ident(Ident { sym, .. }) if &**sym == "Infinity" => true,
                        Expr::Ident(Ident { sym, .. }) if &**sym == "NaN" => true,

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

                    *expr = *make_bool_expr(&self.expr_ctx, *span, false, iter::once(right.take()));
                    return;
                }

                if is_obj(left) && right.is_global_ref_to(&self.expr_ctx, "Object") {
                    self.changed = true;

                    *expr = *make_bool_expr(&self.expr_ctx, *span, true, iter::once(left.take()));
                }
            }

            // Arithmetic operations
            op!(bin, "-") | op!("/") | op!("%") | op!("**") => {
                try_replace!(number, self.perform_arithmetic_op(*op, left, right))
            }

            // Bit shift operations
            op!("<<") | op!(">>") | op!(">>>") => {
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
                    let (lv, rv) = (JsNumber::from(lv), JsNumber::from(rv));

                    Known(match op {
                        op!("<<") => *(lv << rv),
                        op!(">>") => *(lv >> rv),
                        op!(">>>") => *(lv.unsigned_shr(rv)),

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
                            let value_expr = if !value.is_nan() {
                                Lit::Num(Number {
                                    value,
                                    span: *span,
                                    raw: None,
                                })
                                .into()
                            } else {
                                Ident::new("NaN".into(), *span, self.expr_ctx.unresolved_ctxt)
                                    .into()
                            };

                            self.changed = true;
                            *left = left_lhs.take();
                            *right = Box::new(value_expr);
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
            }) => "undefined",

            Expr::Ident(Ident { sym, .. }) if &**sym == "undefined" => {
                // We can assume `undefined` is `undefined`,
                // because overriding `undefined` is always hard error in swc.
                "undefined"
            }

            _ => {
                return;
            }
        };

        self.changed = true;

        *expr = Lit::Str(Str {
            span: *span,
            raw: None,
            value: val.into(),
        })
        .into();
    }

    fn optimize_unary_expr(&mut self, expr: &mut Expr) {
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

                    *expr = *make_bool_expr(&self.expr_ctx, *span, !val, iter::once(arg.take()));
                }
            }
            op!(unary, "+") => {
                if let Known(v) = arg.as_pure_number(&self.expr_ctx) {
                    self.changed = true;

                    if v.is_nan() {
                        *expr = *self.expr_ctx.preserve_effects(
                            *span,
                            Ident::new("NaN".into(), *span, self.expr_ctx.unresolved_ctxt).into(),
                            iter::once(arg.take()),
                        );
                        return;
                    }

                    *expr = *self.expr_ctx.preserve_effects(
                        *span,
                        Lit::Num(Number {
                            value: v,
                            span: *span,
                            raw: None,
                        })
                        .into(),
                        iter::once(arg.take()),
                    );
                }
            }
            op!(unary, "-") => match &**arg {
                Expr::Ident(Ident { sym, .. }) if &**sym == "Infinity" => {}
                // "-NaN" is "NaN"
                Expr::Ident(Ident { sym, .. }) if &**sym == "NaN" => {
                    self.changed = true;
                    *expr = *(arg.take());
                }
                Expr::Lit(Lit::Num(Number { value: f, .. })) => {
                    self.changed = true;
                    *expr = Lit::Num(Number {
                        value: -f,
                        span: *span,
                        raw: None,
                    })
                    .into();
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

                *arg = Lit::Num(Number {
                    value: 0.0,
                    span: arg.span(),
                    raw: None,
                })
                .into();
            }

            op!("~") => {
                if let Known(value) = arg.as_pure_number(&self.expr_ctx) {
                    if value.fract() == 0.0 {
                        self.changed = true;
                        *expr = Lit::Num(Number {
                            span: *span,
                            value: if value < 0.0 {
                                !(value as i32 as u32) as i32 as f64
                            } else {
                                !(value as u32) as i32 as f64
                            },
                            raw: None,
                        })
                        .into();
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
                        let orig_len = right.span().hi() - right.span().lo() + left.span().hi()
                            - left.span().lo();
                        if new_len <= orig_len.0 as usize + 1 {
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
            || op == op!(bin, "+")
                && (!left.get_type().casted_to_number_on_add()
                    || !right.get_type().casted_to_number_on_add())
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
                    let lv: JsNumber = lv.into();
                    let rv: JsNumber = rv.into();
                    let result: f64 = lv.pow(rv).into();
                    return try_replace!(result);
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
            op!("&") => try_replace!(i32, to_int32(lv) & to_int32(rv)),
            op!("|") => try_replace!(i32, to_int32(lv) | to_int32(rv)),
            op!("^") => try_replace!(i32, to_int32(lv) ^ to_int32(rv)),
            op!("%") => {
                if rv == 0.0 {
                    return Unknown;
                }
                try_replace!(lv % rv)
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
                &Expr::Ident(
                    Ident {
                        sym: ref li,
                        ctxt: l_ctxt,
                        ..
                    },
                    ..,
                ),
                &Expr::Ident(Ident {
                    sym: ref ri,
                    ctxt: r_ctxt,
                    ..
                }),
            ) if !will_negate && li == ri && l_ctxt == r_ctxt => {
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
                    &Lit::Num(Number {
                        value: rv,
                        span,
                        raw: None,
                    })
                    .into(),
                )
            }

            (StringType, NumberType) | (BoolType, _) => {
                let lv = try_val!(left.as_pure_number(&self.expr_ctx));
                self.perform_abstract_eq_cmp(
                    span,
                    &Lit::Num(Number {
                        value: lv,
                        span,
                        raw: None,
                    })
                    .into(),
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
                        } else if seq
                            .exprs
                            .last()
                            .map(|v| &**v)
                            .map_or(false, Expr::directness_maters)
                        {
                            match seq.exprs.first().map(|v| &**v) {
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
                            **e = seq.into();
                        }
                    }
                }
            }
        }

        self.in_callee = false;
        n.args.visit_mut_with(self);

        self.in_callee = old_in_callee;
    }

    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
        self.maybe_par(cpu_count(), members, |v, member| {
            member.visit_mut_with(v);
        });
    }

    fn visit_mut_export_default_expr(&mut self, expr: &mut ExportDefaultExpr) {
        fn is_paren_wrap_fn_or_class(expr: &mut Expr, visitor: &mut SimplifyExpr) -> bool {
            match &mut *expr {
                Expr::Fn(..) | Expr::Class(..) => {
                    expr.visit_mut_children_with(visitor);
                    true
                }
                Expr::Paren(p) => is_paren_wrap_fn_or_class(&mut p.expr, visitor),
                _ => false,
            }
        }

        if !is_paren_wrap_fn_or_class(&mut expr.expr, self) {
            expr.visit_mut_children_with(self);
        }
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
            // Note: Paren should be handled in fixer
            Expr::Lit(_) | Expr::This(..) | Expr::Paren(..) => return,

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
                self.optimize_unary_expr(expr);
                debug_assert_valid(expr);
            }
            Expr::Bin(_) => {
                self.optimize_bin_expr(expr);

                debug_assert_valid(expr);
            }
            Expr::Member(_) => {
                self.optimize_member_expr(expr);

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
                        if expr_value.directness_maters() {
                            SeqExpr {
                                span: *span,
                                exprs: vec![0.into(), expr_value.take()],
                            }
                            .into()
                        } else {
                            *expr_value.take()
                        }
                    } else {
                        SeqExpr {
                            span: *span,
                            exprs: vec![test.take(), expr_value.take()],
                        }
                        .into()
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

                            e.extend(expr.array().unwrap().elems.into_iter().map(|elem| {
                                Some(elem.unwrap_or_else(|| ExprOrSpread {
                                    spread: None,
                                    expr: Expr::undefined(DUMMY_SP),
                                }))
                            }));
                        }

                        _ => e.push(elem),
                    }
                }
                *elems = e;
            }

            Expr::Object(ObjectLit { props, .. }) => {
                let should_work = props.iter().any(|p| matches!(p, PropOrSpread::Spread(..)));
                if !should_work {
                    return;
                }

                let mut ps = Vec::with_capacity(props.len());

                for p in props.take() {
                    match p {
                        PropOrSpread::Spread(SpreadElement {
                            dot3_token, expr, ..
                        }) if expr.is_object() => {
                            if let Expr::Object(obj) = &*expr {
                                if obj.props.iter().any(|p| match p {
                                    PropOrSpread::Spread(..) => true,
                                    PropOrSpread::Prop(p) => !matches!(
                                        &**p,
                                        Prop::Shorthand(_) | Prop::KeyValue(_) | Prop::Method(_)
                                    ),
                                }) {
                                    ps.push(PropOrSpread::Spread(SpreadElement {
                                        dot3_token,
                                        expr,
                                    }));
                                    continue;
                                }
                            }
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

    fn visit_mut_expr_or_spreads(&mut self, n: &mut Vec<ExprOrSpread>) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_exprs(&mut self, n: &mut Vec<Box<Expr>>) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
    }

    fn visit_mut_for_head(&mut self, n: &mut ForHead) {
        let old = self.is_modifying;
        self.is_modifying = true;
        n.visit_mut_children_with(self);
        self.is_modifying = old;
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut child = SimplifyExpr {
            expr_ctx: self.expr_ctx.clone(),
            config: self.config,
            changed: Default::default(),
            is_arg_of_update: Default::default(),
            is_modifying: Default::default(),
            in_callee: Default::default(),
        };

        child.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
        self.changed |= child.changed;
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

    fn visit_mut_opt_vec_expr_or_spreads(&mut self, n: &mut Vec<Option<ExprOrSpread>>) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
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

    fn visit_mut_prop_or_spreads(&mut self, n: &mut Vec<PropOrSpread>) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
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

                Expr::Lit(..) | Expr::Ident(..)
                    if self.in_callee && !expr.may_have_side_effects(&self.expr_ctx) =>
                {
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
            is_arg_of_update: Default::default(),
            is_modifying: Default::default(),
            in_callee: Default::default(),
        };

        child.maybe_par(cpu_count(), n, |v, n| {
            n.visit_mut_with(v);
        });
        self.changed |= child.changed;
    }

    fn visit_mut_tagged_tpl(&mut self, n: &mut TaggedTpl) {
        let old = self.in_callee;
        self.in_callee = true;

        n.tag.visit_mut_with(self);

        self.in_callee = false;
        n.tpl.visit_mut_with(self);

        self.in_callee = old;
    }

    fn visit_mut_update_expr(&mut self, n: &mut UpdateExpr) {
        let old = self.is_modifying;
        self.is_modifying = true;
        n.arg.visit_mut_with(self);
        self.is_modifying = old;
    }

    fn visit_mut_with_stmt(&mut self, n: &mut WithStmt) {
        n.obj.visit_mut_with(self);
    }
}

/// make a new boolean expression preserving side effects, if any.
fn make_bool_expr<I>(ctx: &ExprCtx, span: Span, value: bool, orig: I) -> Box<Expr>
where
    I: IntoIterator<Item = Box<Expr>>,
{
    ctx.preserve_effects(span, Lit::Bool(Bool { value, span }).into(), orig)
}

fn nth_char(s: &str, mut idx: usize) -> Option<Cow<str>> {
    if s.chars().any(|c| c.len_utf16() > 1) {
        return None;
    }

    if !s.contains("\\ud") && !s.contains("\\uD") {
        return Some(Cow::Owned(s.chars().nth(idx).unwrap().to_string()));
    }

    let mut iter = s.chars().peekable();

    while let Some(c) = iter.next() {
        if c == '\\' && iter.peek().copied() == Some('u') {
            if idx == 0 {
                let mut buf = String::new();
                buf.push('\\');
                buf.extend(iter.take(5));
                return Some(Cow::Owned(buf));
            } else {
                for _ in 0..5 {
                    iter.next();
                }
            }
        }

        if idx == 0 {
            return Some(Cow::Owned(c.to_string()));
        }

        idx -= 1;
    }

    unreachable!("string is too short")
}

fn need_zero_for_this(e: &Expr) -> bool {
    e.directness_maters() || e.is_seq()
}

/// Gets the value of the given key from the given object properties, if the key
/// exists. If the key does exist, `Some` is returned and the property is
/// removed from the given properties.
fn get_key_value(key: &str, props: &mut Vec<PropOrSpread>) -> Option<Box<Expr>> {
    // It's impossible to know the value for certain if a spread property exists.
    let has_spread = props.iter().any(|prop| prop.is_spread());

    if has_spread {
        return None;
    }

    for (i, prop) in props.iter_mut().enumerate().rev() {
        let prop = match prop {
            PropOrSpread::Prop(x) => &mut **x,
            PropOrSpread::Spread(_) => unreachable!(),
        };

        match prop {
            Prop::Shorthand(ident) if ident.sym == key => {
                let prop = match props.remove(i) {
                    PropOrSpread::Prop(x) => *x,
                    _ => unreachable!(),
                };
                let ident = match prop {
                    Prop::Shorthand(x) => x,
                    _ => unreachable!(),
                };
                return Some(ident.into());
            }

            Prop::KeyValue(prop) => {
                if key != "__proto__" && prop_name_eq(&prop.key, "__proto__") {
                    // If __proto__ is defined, we need to check the contents of it,
                    // as well as any nested __proto__ objects
                    let Expr::Object(ObjectLit { props, .. }) = &mut *prop.value else {
                        // __proto__ is not an ObjectLiteral. It's unsafe to keep trying to find
                        // a value for this key, since __proto__ might also contain the key.
                        return None;
                    };

                    // Get key value from __props__ object. Only return if
                    // the result is Some. If None, we keep searching in the
                    // parent object.
                    let v = get_key_value(key, props);
                    if v.is_some() {
                        return v;
                    }
                } else if prop_name_eq(&prop.key, key) {
                    let prop = match props.remove(i) {
                        PropOrSpread::Prop(x) => *x,
                        _ => unreachable!(),
                    };
                    let prop = match prop {
                        Prop::KeyValue(x) => x,
                        _ => unreachable!(),
                    };
                    return Some(prop.value);
                }
            }

            _ => {}
        }
    }

    None
}
