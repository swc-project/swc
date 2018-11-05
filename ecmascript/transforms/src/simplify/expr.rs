use crate::util::*;
use std::iter;
use swc_common::{FoldWith, Folder, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::{Ident, Lit, *};

pub(super) struct SimplifyExpr;

impl Folder<Expr> for SimplifyExpr {
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
    #[derive(Copy, Clone, PartialEq, Eq)]
    enum KnownOp {
        /// Length
        Len,
        Index(u32),
    }
    let op = match *e.prop {
        Expr::Ident(Ident {
            sym: js_word!("length"),
            ..
        }) => KnownOp::Len,
        // Lit(Lit::Num(Number(f)))=>{
        //     if f==0{

        //     }else{

        //     }
        //     // TODO: Report error
        //     KnownOp::Index(f)},
        _ => return Expr::Member(e),
    };

    let o = match e.obj {
        ExprOrSuper::Super(_) => return Expr::Member(e),
        ExprOrSuper::Expr(box o) => o,
    };

    match o {
        Expr::Lit(Lit::Str(Str {
            ref value, span, ..
        }))
            if op == KnownOp::Len =>
        {
            Expr::Lit(Lit::Num(Number {
                value: value.len() as _,
                span,
            }))
        }

        Expr::Array(ArrayLit { ref elems, span })
            if op == KnownOp::Len && !o.may_have_side_effects() =>
        {
            Expr::Lit(Lit::Num(Number {
                value: elems.len() as _,
                span,
            }))
        }
        _ => {
            return Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(box o),
                ..e
            })
        }
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
                        Expr::Lit(Lit::Num(Number {
                            value: v,
                            span: DUMMY_SP,
                        })),
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
                    Expr::Seq(SeqExpr {
                        span,
                        exprs: vec![left, node],
                    })
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

        // These needs one more check.
        //
        // (a * 1) * 2 --> a * (1 * 2) --> a * 2
        op!("*") | op!("&") | op!("|") | op!("^") => {
            let (left, right) = try_replace!(number, perform_arithmetic_op(op, &left, &right));
            // TODO: Try left.rhs * right
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

fn fold_unary(UnaryExpr { span, op, arg }: UnaryExpr) -> Expr {
    let may_have_side_effects = arg.may_have_side_effects();

    match op {
        op!("typeof") if !may_have_side_effects => {
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
                    })
                }
            };

            return Expr::Lit(Lit::Str(Str {
                span,
                value: val.into(),
                has_escape: false,
            }));
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
                )
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
                return Expr::Lit(Lit::Num(Number { value: -f, span }))
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
            })
        }
        _ => {}
    }

    Expr::Unary(UnaryExpr { op, arg, span })
}

/// Try to fold arithmetic binary operators
fn perform_arithmetic_op(op: BinaryOp, left: &Expr, right: &Expr) -> Value<f64> {
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
                return Known(lv + rv);
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
                return Known(lv - rv);
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
        _ => {}
    }

    return Unknown;
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
            return Known(false)
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
        )
            if li == ri =>
        {
            return Known(false)
        }
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
        )
            if li == ri =>
        {
            return Known(true)
        }
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
                return
            }

            // In most case, we can do nothing for this.
            Expr::Update(_) | Expr::Assign(_) | Expr::Yield(_) | Expr::Await(_) => v.push(box expr),

            // TODO
            Expr::MetaProp(_) => v.push(box expr),

            Expr::Call(_) => v.push(box expr),
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
