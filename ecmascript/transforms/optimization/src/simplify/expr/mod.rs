use std::{borrow::Cow, iter, iter::once};
use swc_atoms::{js_word, JsWord};
use swc_common::{
    pass::{CompilerPass, Repeated},
    Span, Spanned,
};
use swc_ecma_ast::{Ident, Lit, *};
use swc_ecma_transforms_base::ext::ExprRefExt;
use swc_ecma_transforms_base::pass::RepeatedJsPass;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::is_literal;
use swc_ecma_utils::preserve_effects;
use swc_ecma_utils::prop_name_eq;
use swc_ecma_utils::to_int32;
use swc_ecma_utils::undefined;
use swc_ecma_utils::BoolType;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::NullType;
use swc_ecma_utils::NumberType;
use swc_ecma_utils::ObjectType;
use swc_ecma_utils::StringType;
use swc_ecma_utils::SymbolType;
use swc_ecma_utils::UndefinedType;
use swc_ecma_utils::Value;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};
use Value::Known;
use Value::Unknown;

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

/// Not intended for general use. Use [simplifier] instead.
///
/// Ported from `PeepholeFoldConstants` of google closure compiler.
pub fn expr_simplifier() -> impl RepeatedJsPass + 'static {
    SimplifyExpr::default()
}

#[derive(Debug, Default)]
struct SimplifyExpr {
    changed: bool,
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
    fn fold_member_expr(&mut self, e: MemberExpr) -> Expr {
        #[derive(Clone, PartialEq, Eq)]
        enum KnownOp {
            /// [a, b].length
            Len,

            Index(i64),

            /// ({}).foo
            IndexStr(JsWord),
        }
        let op = match *e.prop {
            Expr::Ident(Ident {
                sym: js_word!("length"),
                ..
            }) => KnownOp::Len,
            Expr::Ident(Ident { ref sym, .. }) => KnownOp::IndexStr(sym.clone()),
            Expr::Lit(Lit::Num(Number { value, .. })) if value.fract() == 0.0 => {
                KnownOp::Index(value as _)
            }
            _ => return Expr::Member(e),
        };

        let obj = match e.obj {
            ExprOrSuper::Super(_) => return Expr::Member(e),
            ExprOrSuper::Expr(o) => *o,
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
                KnownOp::Index(idx) if (idx as usize) < value.len() => {
                    return if idx < 0 {
                        *undefined(span)
                    } else {
                        Expr::Lit(Lit::Str(Str {
                            value: value
                                .chars()
                                .nth(idx as _)
                                .unwrap_or_else(|| panic!("failed to index char?"))
                                .to_string()
                                .into(),
                            span,
                            has_escape: false,
                            kind: Default::default(),
                        }))
                    }
                }
                _ => Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Expr(Box::new(obj)),
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
                        obj: ExprOrSuper::Expr(Box::new(obj)),
                        ..e
                    });
                }

                Expr::Lit(Lit::Num(Number {
                    value: elems.len() as _,
                    span,
                }))
            }

            Expr::Array(ArrayLit { span, mut elems })
                if match op {
                    KnownOp::Index(..) => true,
                    _ => false,
                } =>
            {
                // do nothing if spread exists
                let has_spread = elems.iter().any(|elem| {
                    elem.as_ref()
                        .map(|elem| elem.spread.is_some())
                        .unwrap_or(false)
                });

                if has_spread {
                    return Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Expr(Box::new(Expr::Array(ArrayLit { span, elems }))),
                        ..e
                    });
                }

                let idx = match op {
                    KnownOp::Index(i) => i,
                    _ => unreachable!(),
                };

                let e = if elems.len() > idx as _ && idx >= 0 {
                    elems.remove(idx as _)
                } else {
                    None
                };
                let v = match e {
                    None => *undefined(span),
                    Some(e) => *e.expr,
                };

                preserve_effects(
                    span,
                    v,
                    once(Box::new(Expr::Array(ArrayLit { span, elems }))),
                )
            }

            // { foo: true }['foo']
            Expr::Object(ObjectLit { mut props, span }) => match op {
                KnownOp::IndexStr(key) if is_literal(&props) => {
                    // do nothing if spread exists
                    let has_spread = props.iter().any(|prop| match prop {
                        PropOrSpread::Spread(..) => true,
                        _ => false,
                    });

                    if has_spread {
                        return Expr::Member(MemberExpr {
                            obj: ExprOrSuper::Expr(Box::new(Expr::Object(ObjectLit {
                                props,
                                span,
                            }))),
                            ..e
                        });
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
                    //

                    match idx {
                        Some(i) => {
                            let v = props.remove(i);

                            preserve_effects(
                                span,
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
                                once(Box::new(Expr::Object(ObjectLit { props, span }))),
                            )
                        }
                        None => Expr::Member(MemberExpr {
                            obj: ExprOrSuper::Expr(Box::new(Expr::Object(ObjectLit {
                                props,
                                span,
                            }))),
                            ..e
                        }),
                    }
                }
                _ => Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Expr(Box::new(Expr::Object(ObjectLit { props, span }))),
                    ..e
                }),
            },

            _ => Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(Box::new(obj)),
                ..e
            }),
        }
    }

    fn fold_bin(
        &mut self,
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

                        return make_bool_expr(span, v, {
                            iter::once(left).chain(iter::once(right))
                        });
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

                if left.is_str() || left.is_array_lit() || right.is_str() || right.is_array_lit() {
                    if let (Known(l), Known(r)) = (left.as_string(), right.as_string()) {
                        let mut l = l.into_owned();
                        l.push_str(&r);
                        return Expr::Lit(Lit::Str(Str {
                            value: l.into(),
                            span,
                            // TODO
                            has_escape: false,
                            kind: Default::default(),
                        }));
                    }
                }

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
                                if let (Known(l), Known(r)) = (left.as_string(), right.as_string())
                                {
                                    return Expr::Lit(Lit::Str(Str {
                                        value: format!("{}{}", l, r).into(),
                                        span,
                                        // TODO
                                        has_escape: false,
                                        kind: Default::default(),
                                    }));
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
                    Known(BoolType) | Known(NullType) | Known(NumberType)
                    | Known(UndefinedType) => {
                        bin = match bin {
                            Expr::Bin(BinExpr {
                                left, right, span, ..
                            }) => match self.perform_arithmetic_op(op!(bin, "+"), &left, &right) {
                                Known(v) => {
                                    return preserve_effects(
                                        span,
                                        Expr::Lit(Lit::Num(Number { value: v, span })),
                                        iter::once(left).chain(iter::once(right)),
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
                    } else if val {
                        // 1 || $right
                        return *left;
                    } else {
                        // 0 || $right
                        right
                    };

                    return if !left.may_have_side_effects() {
                        *node
                    } else {
                        let seq = SeqExpr {
                            span,
                            exprs: vec![left, node],
                        }
                        .fold_with(self);

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
            op!(bin, "-") | op!("/") | op!("%") | op!("**") => {
                try_replace!(number, self.perform_arithmetic_op(op, &left, &right))
            }

            // Bit shift operations
            op!("<<") | op!(">>") | op!(">>>") => {
                /// Uses a method for treating a double as 32bits that is
                /// equivalent to how JavaScript would convert a
                /// number before applying a bit operation.
                fn js_convert_double_to_bits(d: f64) -> i32 {
                    ((d.floor() as i64) & 0xffff_ffff) as i32
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
                            res as f64
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
                let (mut left, right) =
                    try_replace!(number, self.perform_arithmetic_op(op, &left, &right));

                // Try left.rhs * right
                if let Expr::Bin(BinExpr {
                    span: left_span,
                    left: left_lhs,
                    op: left_op,
                    right: left_rhs,
                }) = *left
                {
                    if left_op == op {
                        if let Known(value) = self.perform_arithmetic_op(op, &left_rhs, &right) {
                            return Expr::Bin(BinExpr {
                                span,
                                left: left_lhs,
                                op: left_op,
                                right: Box::new(Expr::Lit(Lit::Num(Number { value, span }))),
                            });
                        }
                    }
                    left = Box::new(Expr::Bin(BinExpr {
                        left: left_lhs,
                        op: left_op,
                        span: left_span,
                        right: left_rhs,
                    }))
                }

                (left, right)
            }

            // Comparisons
            op!("<") => try_replace!(self.perform_abstract_rel_cmp(span, &left, &right, false)),
            op!(">") => try_replace!(self.perform_abstract_rel_cmp(span, &right, &left, false)),
            op!("<=") => try_replace!(!self.perform_abstract_rel_cmp(span, &right, &left, true)),
            op!(">=") => try_replace!(!self.perform_abstract_rel_cmp(span, &left, &right, true)),

            op!("==") => try_replace!(self.perform_abstract_eq_cmp(span, &left, &right)),
            op!("!=") => try_replace!(!self.perform_abstract_eq_cmp(span, &left, &right)),
            op!("===") => try_replace!(self.perform_strict_eq_cmp(span, &left, &right)),
            op!("!==") => try_replace!(!self.perform_strict_eq_cmp(span, &left, &right)),
            _ => (left, right),
        };

        Expr::Bin(BinExpr {
            left,
            op,
            right,
            span,
        })
    }

    /// Folds 'typeof(foo)' if foo is a literal, e.g.
    ///
    /// typeof("bar") --> "string"
    ///
    /// typeof(6) --> "number"
    fn try_fold_typeof(&mut self, UnaryExpr { span, op, arg }: UnaryExpr) -> Expr {
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
            kind: Default::default(),
        }))
    }

    fn fold_unary(&mut self, UnaryExpr { span, op, arg }: UnaryExpr) -> Expr {
        let may_have_side_effects = arg.may_have_side_effects();

        match op {
            op!("typeof") if !may_have_side_effects => {
                return self.try_fold_typeof(UnaryExpr { span, op, arg });
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
                    ..
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

                    // TODO: Report that user is something bad (negating
                    // non-number value)
                }
            },
            op!("void") if !may_have_side_effects => {
                return Expr::Unary(UnaryExpr {
                    op: op!("void"),
                    arg: Box::new(Expr::Lit(Lit::Num(Number {
                        value: 0.0,
                        span: arg.span(),
                    }))),
                    span,
                });
            }

            op!("~") => {
                if let Known(value) = arg.as_number() {
                    if value.fract() == 0.0 {
                        return Expr::Lit(Lit::Num(Number {
                            span,
                            value: if value < 0.0 {
                                !(value as i32 as u32) as i32 as f64
                            } else {
                                !(value as u32) as i32 as f64
                            },
                        }));
                    }
                    // TODO: Report error
                }

                return Expr::Unary(UnaryExpr {
                    span,
                    op: op!("~"),
                    arg,
                });
            }
            _ => {}
        }

        Expr::Unary(UnaryExpr { op, arg, span })
    }

    /// Try to fold arithmetic binary operators
    fn perform_arithmetic_op(&mut self, op: BinaryOp, left: &Expr, right: &Expr) -> Value<f64> {
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
        _span: Span,
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
            if let (Known(lv), Known(rv)) = (left.as_string(), right.as_string()) {
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
        let (lv, rv) = (try_val!(left.as_number()), try_val!(right.as_number()));
        if lv.is_nan() || rv.is_nan() {
            return Known(will_negate);
        }

        Known(lv < rv)
    }

    /// https://tc39.github.io/ecma262/#sec-abstract-equality-comparison
    fn perform_abstract_eq_cmp(&mut self, span: Span, left: &Expr, right: &Expr) -> Value<bool> {
        let (lt, rt) = (try_val!(left.get_type()), try_val!(right.get_type()));

        if lt == rt {
            return self.perform_strict_eq_cmp(span, left, right);
        }

        match (lt, rt) {
            (NullType, UndefinedType) | (UndefinedType, NullType) => Known(true),
            (NumberType, StringType) | (_, BoolType) => {
                let rv = try_val!(right.as_number());
                self.perform_abstract_eq_cmp(
                    span,
                    left,
                    &Expr::Lit(Lit::Num(Number { value: rv, span })),
                )
            }

            (StringType, NumberType) | (BoolType, _) => {
                let lv = try_val!(left.as_number());
                self.perform_abstract_eq_cmp(
                    span,
                    &Expr::Lit(Lit::Num(Number { value: lv, span })),
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
    fn perform_strict_eq_cmp(&mut self, _span: Span, left: &Expr, right: &Expr) -> Value<bool> {
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
            NumberType => Known(try_val!(left.as_number()) == try_val!(right.as_number())),
            StringType => {
                let (lv, rv) = (try_val!(left.as_string()), try_val!(right.as_string()));
                // In JS, browsers parse \v differently. So do not consider strings
                // equal if one contains \v.
                if lv.contains('\u{000B}') || rv.contains('\u{000B}') {
                    return Unknown;
                }
                Known(lv == rv)
            }
            BoolType => {
                let (lv, rv) = (left.as_pure_bool(), right.as_pure_bool());

                // lv && rv || !lv && !rv

                lv.and(rv).or((!lv).and(!rv))
            }
            ObjectType | SymbolType => Unknown,
        }
    }
}

impl Fold for SimplifyExpr {
    noop_fold_type!();

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        // fold children before doing something more.
        let expr = expr.fold_children_with(self);

        match expr {
            // Do nothing.
            Expr::Lit(_) | Expr::This(..) => expr,

            // Remove parenthesis. This may break ast, but it will be fixed up later.
            Expr::Paren(ParenExpr { expr, .. }) => *expr,

            Expr::Unary(expr) => self.fold_unary(expr),
            Expr::Bin(expr) => self.fold_bin(expr),

            Expr::Member(e) => self.fold_member_expr(e),

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
                    Expr::Seq(SeqExpr { span, exprs })
                }
            }

            Expr::Array(ArrayLit { span, elems, .. }) => {
                let mut e = Vec::with_capacity(elems.len());

                for elem in elems {
                    match elem {
                        Some(ExprOrSpread {
                            spread: Some(..),
                            expr,
                        }) if expr.is_array() => e.extend(expr.array().unwrap().elems),

                        _ => e.push(elem),
                    }
                }

                ArrayLit { span, elems: e }.into()
            }

            Expr::Object(ObjectLit { span, props, .. }) => {
                let should_work = props.iter().any(|p| match &*p {
                    PropOrSpread::Spread(..) => true,
                    _ => false,
                });
                if !should_work {
                    return ObjectLit { span, props }.into();
                }

                let mut ps = Vec::with_capacity(props.len());

                for p in props {
                    match p {
                        PropOrSpread::Spread(SpreadElement { expr, .. }) if expr.is_object() => {
                            let props = expr.object().unwrap().props;
                            ps.extend(props)
                        }

                        _ => ps.push(p),
                    }
                }

                ObjectLit { span, props: ps }.into()
            }

            Expr::New(e) => {
                if e.callee.is_ident_ref_to(js_word!("String"))
                    && e.args.is_some()
                    && e.args.as_ref().unwrap().len() == 1
                    && e.args.as_ref().unwrap()[0].spread.is_none()
                    && is_literal(&e.args.as_ref().unwrap()[0].expr)
                {
                    let e = &*e.args.into_iter().next().unwrap().pop().unwrap().expr;
                    if let Known(value) = e.as_string() {
                        return Expr::Lit(Lit::Str(Str {
                            span: e.span(),
                            value: value.into(),
                            has_escape: false,
                            kind: Default::default(),
                        }));
                    }
                    unreachable!()
                }

                return NewExpr { ..e }.into();
            }

            // be conservative.
            _ => expr,
        }
    }

    fn fold_pat(&mut self, p: Pat) -> Pat {
        match p {
            Pat::Assign(a) => AssignPat {
                right: {
                    let default = a.right.fold_with(self);
                    if default.is_undefined()
                        || match *default {
                            Expr::Unary(UnaryExpr {
                                op: op!("void"),
                                ref arg,
                                ..
                            }) => !arg.may_have_side_effects(),
                            _ => false,
                        }
                    {
                        return *a.left;
                    }

                    default
                },
                ..a
            }
            .into(),
            _ => p,
        }
    }

    /// Drops unused values
    fn fold_seq_expr(&mut self, e: SeqExpr) -> SeqExpr {
        let mut e = e.fold_children_with(self);

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
                        exprs.push(Box::new(ArrayLit { span, elems }.into()));
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

/// make a new boolean expression preserving side effects, if any.
fn make_bool_expr<I>(span: Span, value: bool, orig: I) -> Expr
where
    I: IntoIterator<Item = Box<Expr>>,
{
    preserve_effects(span, Expr::Lit(Lit::Bool(Bool { value, span })), orig)
}
