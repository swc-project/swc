use crate::util::*;
use ast::{Ident, Lit, *};
use std::iter;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Span, Spanned};

#[cfg(test)]
mod tests;

pub(super) struct SimplifyExpr;

impl Fold<Expr> for SimplifyExpr {
    /// Ported from [optimizeSubtree](https://github.com/google/closure-compiler/blob/9203e01b/src/com/google/javascript/jscomp/PeepholeFoldConstants.java#L74-L98)
    fn fold(&mut self, expr: Expr) -> Expr {
        // fold children before doing something more.
        let expr = expr.fold_children(self);

        match expr {
            // Do nothing.
            Expr::Lit(_) | Expr::This(..) => expr,

            // Remove parenthesis. This may break ast, but it will be fixed up later.
            Expr::Paren(ParenExpr { expr, .. }) => *expr,

            Expr::Unary(expr) => fold_unary(expr),
            Expr::Bin(expr) => fold_bin(expr),

            Expr::Member(e) => fold_member_expr(e),

            Expr::Cond(CondExpr {
                span,
                test,
                cons,
                alt,
            }) => match test.as_bool() {
                (p, Known(val)) => {
                    let expr_value = if val { cons } else { alt };
                    if p.is_pure() {
                        *expr_value
                    } else {
                        Expr::Seq(SeqExpr {
                            span,
                            exprs: vec![test, expr_value],
                        })
                    }
                }
                _ => Expr::Cond(CondExpr {
                    span,
                    test,
                    cons,
                    alt,
                }),
            },

            // Simplify sequence expression.
            Expr::Seq(SeqExpr { span, exprs }) => {
                if exprs.len() == 1 {
                    //TODO: Respan
                    *exprs.into_iter().next().unwrap()
                } else {
                    assert!(!exprs.is_empty(), "sequence expression should not be empty");
                    //TODO: remove unused
                    return Expr::Seq(SeqExpr { span, exprs });
                }
            }

            // be conservative.
            _ => expr,
        }
    }
}

fn fold_member_expr(e: MemberExpr) -> Expr {
    #[derive(Clone, PartialEq, Eq)]
    enum KnownOp {
        /// [a, b].length
        Len,

        Index(u32),

        /// ({}).foo
        IndexStr(JsWord),
    }
    let op = match *e.prop {
        Expr::Ident(Ident {
            sym: js_word!("length"),
            ..
        }) => KnownOp::Len,
        Expr::Ident(Ident { ref sym, .. }) => KnownOp::IndexStr(sym.clone()),
        // Lit(Lit::Num(Number(f)))=>{
        //     if f==0{

        //     }else{

        //     }
        //     // TODO: Report error
        //     KnownOp::Index(f)},
        _ => return Expr::Member(e),
    };

    let obj = match e.obj {
        ExprOrSuper::Super(_) => return Expr::Member(e),
        ExprOrSuper::Expr(box o) => o,
    };

    match obj {
        Expr::Lit(Lit::Str(Str {
            ref value, span, ..
        })) => match op {
            // 'foo'.length
            KnownOp::Len => Expr::Lit(Lit::Num(Number {
                value: value.chars().count() as f64,
                span,
            })),

            // 'foo'[1]
            KnownOp::Index(idx) if (idx as usize) < value.len() => Expr::Lit(Lit::Str(Str {
                value: value
                    .chars()
                    .nth(idx as _)
                    .unwrap_or_else(|| panic!("failed to index char?"))
                    .to_string()
                    .into(),
                span,
                has_escape: false,
            })),

            _ => Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(box obj),
                ..e
            }),
        },

        // [1, 2, 3].length
        Expr::Array(ArrayLit { ref elems, span })
            if op == KnownOp::Len && !obj.may_have_side_effects() =>
        {
            // do nothing if spread exists
            let has_spread = elems.iter().any(|elem| {
                elem.as_ref()
                    .map(|elem| elem.spread.is_some())
                    .unwrap_or(false)
            });

            if has_spread {
                return Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Expr(box obj),
                    ..e
                });
            }

            return Expr::Lit(Lit::Num(Number {
                value: elems.len() as _,
                span,
            }));
        }

        // { foo: true }['foo']
        Expr::Object(ObjectLit { props, span }) => match op {
            // TODO
            // KnownOp::IndexStr(key) => {
            // }
            _ => Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(box Expr::Object(ObjectLit { props, span })),
                ..e
            }),
        },

        _ => Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(box obj),
            ..e
        }),
    }
}

fn fold_bin(
    BinExpr {
        left,
        op,
        right,
        span,
    }: BinExpr,
) -> Expr {
    macro_rules! try_replace {
        ($v:expr) => {{
            match $v {
                Known(v) => {
                    // TODO: Optimize

                    return make_bool_expr(span, v, { iter::once(left).chain(iter::once(right)) });
                }
                _ => (left, right),
            }
        }};
        (number, $v:expr) => {{
            match $v {
                Known(v) => {
                    return preserve_effects(
                        span,
                        Expr::Lit(Lit::Num(Number { value: v, span })),
                        { iter::once(left).chain(iter::once(right)) },
                    );
                }
                _ => (left, right),
            }
        }};
    }

    let (left, right) = match op {
        op!(bin, "+") => {
            // It's string concatenation if either left or right is string.

            let mut bin = Expr::Bin(BinExpr {
                span,
                left,
                op: op!(bin, "+"),
                right,
            });

            match bin.get_type() {
                // String concatenation
                Known(StringType) => match bin {
                    Expr::Bin(BinExpr {
                        left,
                        op,
                        right,
                        span,
                    }) => {
                        if !left.may_have_side_effects() && !right.may_have_side_effects() {
                            match (left.as_string(), right.as_string()) {
                                (Known(l), Known(r)) => {
                                    return Expr::Lit(Lit::Str(Str {
                                        value: format!("{}{}", l, r).into(),
                                        span,
                                        // TODO
                                        has_escape: false,
                                    }));
                                }
                                _ => {}
                            }
                        }

                        return Expr::Bin(BinExpr {
                            left,
                            op,
                            right,
                            span,
                        });
                    }
                    _ => unreachable!(),
                },
                // Numerical calculation
                Known(BoolType) | Known(NullType) | Known(NumberType) | Known(UndefinedType) => {
                    bin = match bin {
                        Expr::Bin(BinExpr {
                            left,
                            op: _,
                            right,
                            span,
                        }) => match perform_arithmetic_op(op!(bin, "+"), &left, &right) {
                            Known(v) => {
                                return preserve_effects(
                                    span,
                                    Expr::Lit(Lit::Num(Number { value: v, span })),
                                    { iter::once(left).chain(iter::once(right)) },
                                );
                            }
                            _ => Expr::Bin(BinExpr {
                                span,
                                left,
                                op: op!(bin, "+"),
                                right,
                            }),
                        },
                        _ => unreachable!(),
                    };
                }
                _ => {}
            }

            //TODO: try string concat
            return bin;
        }

        op!("&&") | op!("||") => match left.as_bool() {
            (_, Known(val)) => {
                let node = if op == op!("&&") {
                    if val {
                        // 1 && $right
                        right
                    } else {
                        // 0 && $right
                        return *left;
                    }
                } else {
                    if val {
                        // 1 || $right
                        return *left;
                    } else {
                        // 0 || $right
                        right
                    }
                };

                return if !left.may_have_side_effects() {
                    *node
                } else {
                    let seq = SimplifyExpr.fold(SeqExpr {
                        span,
                        exprs: vec![left, node],
                    });

                    Expr::Seq(seq)
                };
            }
            _ => (left, right),
        },
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
                    }) => is_non_obj(&arg),
                    _ => false,
                }
            }

            // Non-object types are never instances.
            if is_non_obj(&left) {
                return make_bool_expr(span, false, iter::once(right));
            }

            if right.is_ident_ref_to(js_word!("Object")) {
                return make_bool_expr(span, true, iter::once(left));
            }

            (left, right)
        }

        // Arithmetic operations
        op!(bin, "-") | op!("/") | op!("%") => {
            try_replace!(number, perform_arithmetic_op(op, &left, &right))
        }

        // Bit shift operations
        op!("<<") | op!(">>") | op!(">>>") => {
            /// Uses a method for treating a double as 32bits that is equivalent
            /// to how JavaScript would convert a number before applying a bit
            /// operation.
            fn js_convert_double_to_bits(d: f64) -> i32 {
                return ((d.floor() as i64) & 0xffffffff) as i32;
            }

            fn try_fold_shift(op: BinaryOp, left: &Expr, right: &Expr) -> Value<f64> {
                if !left.is_number() || !right.is_number() {
                    return Unknown;
                }

                let (lv, rv) = match (left.as_number(), right.as_number()) {
                    (Known(lv), Known(rv)) => (lv, rv),
                    _ => unreachable!(),
                };

                // only the lower 5 bits are used when shifting, so don't do anything
                // if the shift amount is outside [0,32)
                if !(rv >= 0.0 && rv < 32.0) {
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
                        (0xffffffffu32 & res) as f64
                    }

                    _ => unreachable!("Unknown bit operator {:?}", op),
                })
            }
            try_replace!(number, try_fold_shift(op, &left, &right))
        }

        // These needs one more check.
        //
        // (a * 1) * 2 --> a * (1 * 2) --> a * 2
        op!("*") | op!("&") | op!("|") | op!("^") => {
            let (mut left, right) = try_replace!(number, perform_arithmetic_op(op, &left, &right));

            // Try left.rhs * right
            match *left {
                Expr::Bin(BinExpr {
                    span: left_span,
                    left: left_lhs,
                    op: left_op,
                    right: left_rhs,
                }) => {
                    let v = perform_arithmetic_op(op, &left_rhs, &right);
                    match v {
                        Known(value) => {
                            return Expr::Bin(BinExpr {
                                span,
                                left: left_lhs,
                                op: left_op,
                                right: box Expr::Lit(Lit::Num(Number { value, span })),
                            });
                        }
                        _ => {
                            left = box Expr::Bin(BinExpr {
                                left: left_lhs,
                                op: left_op,
                                span: left_span,
                                right: left_rhs,
                            })
                        }
                    }
                }
                _ => {}
            }

            (left, right)
        }

        // Comparisons
        op!("<") => try_replace!(perform_abstract_rel_cmp(span, &left, &right, false)),
        op!(">") => try_replace!(perform_abstract_rel_cmp(span, &right, &left, false)),
        op!("<=") => try_replace!(!perform_abstract_rel_cmp(span, &right, &left, true)),
        op!(">=") => try_replace!(!perform_abstract_rel_cmp(span, &left, &right, true)),

        op!("==") => try_replace!(perform_abstract_eq_cmp(span, &left, &right)),
        op!("!=") => try_replace!(!perform_abstract_eq_cmp(span, &left, &right)),
        op!("===") => try_replace!(perform_strict_eq_cmp(span, &left, &right)),
        op!("!==") => try_replace!(!perform_strict_eq_cmp(span, &left, &right)),
        _ => (left, right),
    };

    Expr::Bin(BinExpr {
        left,
        op,
        right,
        span,
    })
}

/// Drops unused values
impl Fold<SeqExpr> for SimplifyExpr {
    fn fold(&mut self, e: SeqExpr) -> SeqExpr {
        let mut e = e.fold_children(self);

        let last_expr = e.exprs.pop().expect("SeqExpr.exprs must not be empty");

        // Expressions except last one
        let mut exprs = Vec::with_capacity(e.exprs.len() + 1);

        for expr in e.exprs {
            match *expr {
                // Drop side-effect free nodes.
                Expr::Lit(_) => {}

                // Flatten array
                Expr::Array(ArrayLit { span, elems }) => {
                    let is_simple = elems.iter().all(|elem| match elem {
                        None | Some(ExprOrSpread { spread: None, .. }) => true,
                        _ => false,
                    });

                    if is_simple {
                        exprs.extend(elems.into_iter().filter_map(|e| e).map(|e| e.expr));
                    } else {
                        exprs.push(box ArrayLit { span, elems }.into());
                    }
                }

                // Default case: preserve it
                _ => exprs.push(expr),
            }
        }

        exprs.push(last_expr);
        exprs.shrink_to_fit();

        SeqExpr {
            exprs,
            span: e.span,
        }
    }
}

/// Folds 'typeof(foo)' if foo is a literal, e.g.
///
/// typeof("bar") --> "string"
///
/// typeof(6) --> "number"
fn try_fold_typeof(UnaryExpr { span, op, arg }: UnaryExpr) -> Expr {
    assert_eq!(op, op!("typeof"));

    let val = match *arg {
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
            return Expr::Unary(UnaryExpr {
                op: op!("typeof"),
                arg,
                span,
            });
        }
    };

    Expr::Lit(Lit::Str(Str {
        span,
        value: val.into(),
        has_escape: false,
    }))
}

fn fold_unary(UnaryExpr { span, op, arg }: UnaryExpr) -> Expr {
    let may_have_side_effects = arg.may_have_side_effects();

    match op {
        op!("typeof") if !may_have_side_effects => {
            return try_fold_typeof(UnaryExpr { span, op, arg });
        }
        op!("!") => match arg.as_bool() {
            (_, Known(val)) => return make_bool_expr(span, !val, iter::once(arg)),
            _ => return Expr::Unary(UnaryExpr { op, arg, span }),
        },
        op!(unary, "+") => match arg.as_number() {
            Known(v) => {
                return preserve_effects(
                    span,
                    Expr::Lit(Lit::Num(Number { value: v, span })),
                    iter::once(arg),
                );
            }
            _ => return Expr::Unary(UnaryExpr { op, arg, span }),
        },
        op!(unary, "-") => match *arg {
            Expr::Ident(Ident {
                sym: js_word!("Infinity"),
                span,
            }) => return Expr::Unary(UnaryExpr { op, arg, span }),
            // "-NaN" is "NaN"
            Expr::Ident(Ident {
                sym: js_word!("NaN"),
                ..
            }) => return *arg,
            Expr::Lit(Lit::Num(Number { value: f, .. })) => {
                return Expr::Lit(Lit::Num(Number { value: -f, span }));
            }
            _ => {

                // TODO: Report that user is something bad (negating non-number value)
            }
        },
        op!("void") if !may_have_side_effects => {
            return Expr::Unary(UnaryExpr {
                op: op!("void"),
                arg: box Expr::Lit(Lit::Num(Number {
                    value: 0.0,
                    span: arg.span(),
                })),
                span,
            });
        }
        _ => {}
    }

    Expr::Unary(UnaryExpr { op, arg, span })
}

/// Try to fold arithmetic binary operators
fn perform_arithmetic_op(op: BinaryOp, left: &Expr, right: &Expr) -> Value<f64> {
    /// Replace only if it becomes shorter
    macro_rules! try_replace {
        ($value:expr) => {{
            let (ls, rs) = (left.span(), right.span());
            if ls.is_dummy() || rs.is_dummy() {
                Known($value)
            } else {
                let new_len = format!("{}", $value).len();
                let orig_len = right.span().hi() - left.span().lo();
                if new_len <= orig_len.0 as usize {
                    Known($value)
                } else {
                    Unknown
                }
            }
        }};
        (i32, $value:expr) => {
            try_replace!($value as f64)
        };
    }

    let (lv, rv) = (left.as_number(), right.as_number());

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
                // TODO: cloneTree()
                return rv;
            }
            if Known(1.0) == rv {
                // TODO: cloneTree()
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
    _span: Span,
    left: &Expr,
    right: &Expr,
    will_negate: bool,
) -> Value<bool> {
    match (left, right) {
        // Special case: `x < x` is always false.
        (&Expr::Ident(Ident { sym: ref li, .. }, ..), &Expr::Ident(Ident { sym: ref ri, .. }))
            if !will_negate && li == ri =>
        {
            return Known(false);
        }
        // Special case: `typeof a < typeof a` is always false.
        (
            &Expr::Unary(UnaryExpr {
                op: op!("typeof"),
                arg: box Expr::Ident(Ident { sym: ref li, .. }),
                ..
            }),
            &Expr::Unary(UnaryExpr {
                op: op!("typeof"),
                arg: box Expr::Ident(Ident { sym: ref ri, .. }),
                ..
            }),
        ) if li == ri => return Known(false),
        _ => {}
    }

    // Try to evaluate based on the general type.
    let (lt, rt) = (left.get_type(), right.get_type());

    match (lt, rt) {
        (Known(StringType), Known(StringType)) => {
            match (left.as_string(), right.as_string()) {
                (Known(lv), Known(rv)) => {
                    // In JS, browsers parse \v differently. So do not compare strings if one
                    // contains \v.
                    if lv.contains('\u{000B}') || rv.contains('\u{000B}') {
                        return Unknown;
                    } else {
                        return Known(lv < rv);
                    }
                }
                _ => {}
            }
        }
        _ => {}
    }

    // Then, try to evaluate based on the value of the node. Try comparing as
    // numbers.
    let (lv, rv) = (left.as_number()?, right.as_number()?);
    if lv.is_nan() || rv.is_nan() {
        return Known(will_negate);
    }

    return Known(lv < rv);
}

/// https://tc39.github.io/ecma262/#sec-abstract-equality-comparison
fn perform_abstract_eq_cmp(span: Span, left: &Expr, right: &Expr) -> Value<bool> {
    let (lt, rt) = (left.get_type()?, right.get_type()?);

    if lt == rt {
        return perform_strict_eq_cmp(span, left, right);
    }

    match (lt, rt) {
        (NullType, UndefinedType) | (UndefinedType, NullType) => return Known(true),
        (NumberType, StringType) | (_, BoolType) => {
            let rv = right.as_number()?;
            return perform_abstract_eq_cmp(
                span,
                left,
                &Expr::Lit(Lit::Num(Number { value: rv, span })),
            );
        }

        (StringType, NumberType) | (BoolType, _) => {
            let lv = left.as_number()?;
            return perform_abstract_eq_cmp(
                span,
                &Expr::Lit(Lit::Num(Number { value: lv, span })),
                right,
            );
        }

        (StringType, ObjectType)
        | (NumberType, ObjectType)
        | (ObjectType, StringType)
        | (ObjectType, NumberType) => return Unknown,

        _ => return Known(false),
    }
}

/// https://tc39.github.io/ecma262/#sec-strict-equality-comparison
fn perform_strict_eq_cmp(_span: Span, left: &Expr, right: &Expr) -> Value<bool> {
    // Any strict equality comparison against NaN returns false.
    if left.is_nan() || right.is_nan() {
        return Known(false);
    }
    match (left, right) {
        // Special case, typeof a == typeof a is always true.
        (
            &Expr::Unary(UnaryExpr {
                op: op!("typeof"),
                arg: box Expr::Ident(Ident { sym: ref li, .. }),
                ..
            }),
            &Expr::Unary(UnaryExpr {
                op: op!("typeof"),
                arg: box Expr::Ident(Ident { sym: ref ri, .. }),
                ..
            }),
        ) if li == ri => return Known(true),
        _ => {}
    }

    let (lt, rt) = (left.get_type()?, right.get_type()?);
    // Strict equality can only be true for values of the same type.
    if lt != rt {
        return Known(false);
    }

    match lt {
        UndefinedType | NullType => return Known(true),
        NumberType => {
            return Known(left.as_number()? == right.as_number()?);
        }
        StringType => {
            let (lv, rv) = (left.as_string()?, right.as_string()?);
            // In JS, browsers parse \v differently. So do not consider strings
            // equal if one contains \v.
            if lv.contains('\u{000B}') || rv.contains('\u{000B}') {
                return Unknown;
            }
            return Known(lv == rv);
        }
        BoolType => {
            let (lv, rv) = (left.as_pure_bool(), right.as_pure_bool());

            // lv && rv || !lv && !rv

            return lv.and(rv).or((!lv).and(!rv));
        }
        ObjectType | SymbolType => return Unknown,
    }
}

/// make a new boolean expression preserving side effects, if any.
fn make_bool_expr<I>(span: Span, value: bool, orig: I) -> Expr
where
    I: IntoIterator<Item = Box<Expr>>,
{
    preserve_effects(span, Expr::Lit(Lit::Bool(Bool { value, span })), orig)
}

/// make a new expression which evaluates `val` preserving side effects, if any.
fn preserve_effects<I>(span: Span, val: Expr, exprs: I) -> Expr
where
    I: IntoIterator<Item = Box<Expr>>,
{
    /// Add side effects of `expr` to `v`
    /// preserving order and conditions. (think a() ? yield b() : c())
    fn add_effects(v: &mut Vec<Box<Expr>>, box expr: Box<Expr>) {
        match expr {
            Expr::Lit(..) | Expr::This(..) | Expr::Fn(..) | Expr::Arrow(..) | Expr::Ident(..) => {
                return;
            }

            // In most case, we can do nothing for this.
            Expr::Update(_) | Expr::Assign(_) | Expr::Yield(_) | Expr::Await(_) => v.push(box expr),

            // TODO
            Expr::MetaProp(_) => v.push(box expr),

            Expr::Call(_) => v.push(box expr),
            Expr::New(NewExpr {
                callee: box Expr::Ident(Ident { ref sym, .. }),
                ref args,
                ..
            }) if &*sym == "Date" && args.is_empty() => {}
            Expr::New(_) => v.push(box expr),
            Expr::Member(_) => v.push(box expr),

            // We are at here because we could not determine value of test.
            //TODO: Drop values if it does not have side effects.
            Expr::Cond(_) => v.push(box expr),

            Expr::Unary(UnaryExpr { arg, .. }) => add_effects(v, arg),
            Expr::Bin(BinExpr { left, right, .. }) => {
                add_effects(v, left);
                add_effects(v, right);
            }
            Expr::Seq(SeqExpr { exprs, .. }) => exprs.into_iter().for_each(|e| add_effects(v, e)),

            Expr::Paren(e) => add_effects(v, e.expr),

            Expr::Object(ObjectLit { props, .. }) => {
                props.into_iter().for_each(|node| match node {
                    PropOrSpread::Prop(box node) => match node {
                        Prop::Shorthand(..) => return,
                        Prop::KeyValue(KeyValueProp { key, value }) => {
                            match key {
                                PropName::Computed(e) => add_effects(v, e),
                                _ => {}
                            }

                            add_effects(v, value)
                        }
                        Prop::Getter(GetterProp { key, .. })
                        | Prop::Setter(SetterProp { key, .. })
                        | Prop::Method(MethodProp { key, .. }) => match key {
                            PropName::Computed(e) => add_effects(v, e),
                            _ => {}
                        },
                        Prop::Assign(..) => {
                            unreachable!("assign property in object literal is not a valid syntax")
                        }
                    },
                    PropOrSpread::Spread(SpreadElement { expr, .. }) => add_effects(v, expr),
                })
            }

            Expr::Array(ArrayLit { elems, .. }) => {
                elems.into_iter().filter_map(|e| e).fold(v, |v, e| {
                    add_effects(v, e.expr);

                    v
                });
                return;
            }

            Expr::Tpl { .. } => unimplemented!("add_effects for template literal"),
            Expr::Class(ClassExpr { .. }) => unimplemented!("add_effects for class expression"),

            Expr::JSXMebmer(..)
            | Expr::JSXNamespacedName(..)
            | Expr::JSXEmpty(..)
            | Expr::JSXElement(..)
            | Expr::JSXFragment(..) => unreachable!("simplyfing jsx"),
        }
    }

    let mut exprs = exprs.into_iter().fold(vec![], |mut v, e| {
        add_effects(&mut v, e);
        v
    });

    if exprs.is_empty() {
        return val;
    } else {
        exprs.push(box val);

        Expr::Seq(SeqExpr { exprs, span })
    }
}
