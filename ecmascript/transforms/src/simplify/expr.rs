use super::Simplify;
use ast::*;
use ast::{Ident, Lit};
use ast::ExprKind::*;
use std::iter;
use swc_common::{FoldWith, Folder, Span};
use util::*;

impl Folder<ExprKind> for Simplify {
    fn fold(&mut self, expr: ExprKind) -> ExprKind {
        // fold children nodes.
        let expr = expr.fold_children(self);

        match expr {
            // Do nothing.
            ExprKind::Lit(_) | This => expr,

            // Remove parenthesis. This may break ast, but it will be fixed up later.
            Paren(expr) => expr.node,

            Unary(UnaryExpr { op, arg }) => fold_unary(op, arg),
            Bin(BinExpr { left, op, right }) => fold_bin(left, op, right),

            Member(e) => fold_member_expr(e),

            Cond(CondExpr { test, cons, alt }) => match test.as_bool() {
                (p, Known(val)) => {
                    let expr_value = if val { cons } else { alt };
                    if p.is_pure() {
                        expr_value.node
                    } else {
                        Seq(SeqExpr {
                            exprs: vec![test, expr_value],
                        })
                    }
                }
                _ => Cond(CondExpr { test, cons, alt }),
            },

            // Simplify sequence expression.
            Seq(SeqExpr { exprs }) => if exprs.len() == 1 {
                exprs.into_iter().next().unwrap().node
            } else {
                assert!(!exprs.is_empty(), "sequence expression should not be empty");
                //TODO: remove unused
                return Seq(SeqExpr { exprs });
            },

            // be conservative.
            _ => expr,
        }
    }
}

fn fold_member_expr(e: MemberExpr) -> ExprKind {
    #[derive(Copy, Clone, PartialEq, Eq)]
    enum KnownOp {
        /// Length
        Len,
        Index(u32),
    }
    let op = match e.prop.node {
        Ident(Ident {
            sym: js_word!("length"),
            ..
        }) => KnownOp::Len,
        // Lit(Lit::Num(Number(f)))=>{
        //     if f==0{

        //     }else{

        //     }
        //     // TODO: Report error
        //     KnownOp::Index(f)},
        _ => return Member(e),
    };

    let o = match e.obj {
        ExprOrSuper::Super(_) => return Member(e),
        ExprOrSuper::Expr(box o) => o,
    };

    match o.node {
        Lit(Lit::Str(ref s)) if op == KnownOp::Len => Lit(Lit::Num(Number(s.len() as _))),
        Array(ArrayLit { ref elems }) if op == KnownOp::Len && !o.may_have_side_effects() => {
            Lit(Lit::Num(Number(elems.len() as _)))
        }
        _ => {
            return Member(MemberExpr {
                obj: ExprOrSuper::Expr(box o),
                ..e
            })
        }
    }
}

fn fold_bin(left: Box<Expr>, op: BinaryOp, right: Box<Expr>) -> ExprKind {
    let span = left.span.to(right.span);
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
                    return preserve_effects(span, Lit(Lit::Num(Number(v))), {
                        iter::once(left).chain(iter::once(right))
                    });
                }
                _ => (left, right),
            }
        }};
    }

    let (left, right) = match op {
        op!(bin, "+") => {
            // It's string concatenation if either left or right is string.

            let mut bin = Bin(BinExpr {
                left,
                op: op!(bin, "+"),
                right,
            });

            match bin.get_type() {
                Known(BoolType) | Known(NullType) | Known(NumberType) | Known(UndefinedType) => {
                    bin = match bin {
                        Bin(BinExpr { left, right, .. }) => {
                            println!("performing arithmetic op: {:?}, {:?}", left, right);
                            match perform_arithmetic_op(op!(bin, "+"), &left.node, &right.node) {
                                Known(v) => {
                                    return preserve_effects(span, Lit(Lit::Num(Number(v))), {
                                        iter::once(left).chain(iter::once(right))
                                    });
                                }
                                _ => Bin(BinExpr {
                                    left,
                                    op: op!(bin, "+"),
                                    right,
                                }),
                            }
                        }
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
                        right.node
                    } else {
                        // 0 && $right
                        return left.node;
                    }
                } else {
                    if val {
                        // 1 || $right
                        return left.node;
                    } else {
                        // 0 || $right
                        right.node
                    }
                };

                return if !left.may_have_side_effects() {
                    node
                } else {
                    Seq(SeqExpr {
                        exprs: vec![left, box Expr { span, node }],
                    })
                };
            }
            _ => (left, right),
        },
        op!("instanceof") => {
            fn is_non_obj(e: &ExprKind) -> bool {
                match *e {
                    // Non-object types are never instances.
                    Lit(Lit::Str(..))
                    | Lit(Lit::Num(..))
                    | Lit(Lit::Null)
                    | Lit(Lit::Bool(..))
                    | Ident(Ident {
                        sym: js_word!("undefined"),
                        ..
                    })
                    | Ident(Ident {
                        sym: js_word!("Infinity"),
                        ..
                    })
                    | Ident(Ident {
                        sym: js_word!("NaN"),
                        ..
                    }) => true,

                    Unary(UnaryExpr {
                        op: op!("!"),
                        ref arg,
                    })
                    | Unary(UnaryExpr {
                        op: op!(unary, "-"),
                        ref arg,
                    })
                    | Unary(UnaryExpr {
                        op: op!("void"),
                        ref arg,
                    }) => is_non_obj(&arg.node),
                    _ => false,
                }
            }

            // Non-object types are never instances.
            if is_non_obj(&left.node) {
                return make_bool_expr(span, false, iter::once(right));
            }

            if right.is_ident_ref_to(js_word!("Object")) {
                return make_bool_expr(span, true, iter::once(left));
            }

            (left, right)
        }

        // Arithmetic operations
        op!(bin, "-") | op!("/") | op!("%") => {
            try_replace!(number, perform_arithmetic_op(op, &left.node, &right.node))
        }

        // These needs one more check.
        //
        // (a * 1) * 2 --> a * (1 * 2) --> a * 2
        op!("*") | op!("&") | op!("|") | op!("^") => {
            let (left, right) =
                try_replace!(number, perform_arithmetic_op(op, &left.node, &right.node));
            // TODO: Try left.rhs * right
            (left, right)
        }

        // Comparisons
        op!("<") => try_replace!(perform_abstract_rel_cmp(&left.node, &right.node, false)),
        op!(">") => try_replace!(perform_abstract_rel_cmp(&right.node, &left.node, false)),
        op!("<=") => try_replace!(!perform_abstract_rel_cmp(&right.node, &left.node, true)),
        op!(">=") => try_replace!(!perform_abstract_rel_cmp(&left.node, &right.node, true)),

        op!("==") => try_replace!(perform_abstract_eq_cmp(&left.node, &right.node)),
        op!("!=") => try_replace!(!perform_abstract_eq_cmp(&left.node, &right.node)),
        op!("===") => try_replace!(perform_strict_eq_cmp(&left.node, &right.node)),
        op!("!==") => try_replace!(!perform_strict_eq_cmp(&left.node, &right.node)),
        _ => (left, right),
    };

    Bin(BinExpr { left, op, right })
}

fn fold_unary(op: UnaryOp, arg: Box<Expr>) -> ExprKind {
    let span = arg.span;
    let may_have_side_effects = arg.may_have_side_effects();

    match op {
        op!("typeof") if !may_have_side_effects => {
            let val = match arg.node {
                Fn(..) => "function",
                Lit(Lit::Str(..)) => "string",
                Lit(Lit::Num(..)) => "number",
                Lit(Lit::Bool(..)) => "boolean",
                Lit(Lit::Null) | Object { .. } | Array { .. } => "object",
                Unary(UnaryExpr {
                    op: op!("void"), ..
                })
                | Ident(Ident {
                    sym: js_word!("undefined"),
                    ..
                }) => {
                    // We can assume `undefined` is `undefined`,
                    // because overriding `undefined` is always hard error in swc.
                    "undefined"
                }

                _ => {
                    return Unary(UnaryExpr {
                        op: op!("typeof"),
                        arg,
                    })
                }
            };

            return Lit(Lit::Str(val.into()));
        }
        op!("!") => match arg.as_bool() {
            (_, Known(val)) => return make_bool_expr(span, !val, iter::once(arg)),
            _ => return Unary(UnaryExpr { op, arg }),
        },
        op!(unary, "+") => match arg.as_number() {
            Known(v) => return preserve_effects(span, Lit(Lit::Num(Number(v))), iter::once(arg)),
            _ => return Unary(UnaryExpr { op, arg }),
        },
        op!(unary, "-") => match arg.node {
            Ident(Ident {
                sym: js_word!("Infinity"),
                ..
            }) => return Unary(UnaryExpr { op, arg }),
            // "-NaN" is "NaN"
            Ident(Ident {
                sym: js_word!("NaN"),
                ..
            }) => return arg.node,
            Lit(Lit::Num(Number(f))) => return Lit(Lit::Num(Number(-f))),
            _ => {

                // TODO: Report that user is something bad (negating non-number value)
            }
        },
        op!("void") if !may_have_side_effects => {
            return Unary(UnaryExpr {
                op: op!("void"),
                arg: box Expr {
                    span: arg.span,
                    node: Lit(Lit::Num(Number(0.0))),
                },
            })
        }
        _ => {}
    }

    Unary(UnaryExpr { op, arg })
}

/// Try to fold arithmetic binary operators
fn perform_arithmetic_op(op: BinaryOp, left: &ExprKind, right: &ExprKind) -> Value<f64> {
    let (lv, rv) = (left.as_number(), right.as_number());

    if (lv.is_unknown() && rv.is_unknown()) || !left.get_type().casted_to_number_on_add()
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
fn perform_abstract_rel_cmp(left: &ExprKind, right: &ExprKind, will_negate: bool) -> Value<bool> {
    match (left, right) {
        // Special case: `x < x` is always false.
        (&Ident(Ident { sym: ref li, .. }, ..), &Ident(Ident { sym: ref ri, .. }))
            if !will_negate && li == ri =>
        {
            return Known(false)
        }
        // Special case: `typeof a < typeof a` is always false.
        (
            &Unary(UnaryExpr {
                op: op!("typeof"),
                arg:
                    box Expr {
                        node: Ident(Ident { sym: ref li, .. }),
                        ..
                    },
                ..
            }),
            &Unary(UnaryExpr {
                op: op!("typeof"),
                arg:
                    box Expr {
                        node: Ident(Ident { sym: ref ri, .. }),
                        ..
                    },
                ..
            }),
        ) if li == ri =>
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
fn perform_abstract_eq_cmp(left: &ExprKind, right: &ExprKind) -> Value<bool> {
    let (lt, rt) = (left.get_type()?, right.get_type()?);

    if lt == rt {
        return perform_strict_eq_cmp(left, right);
    }

    match (lt, rt) {
        (NullType, UndefinedType) | (UndefinedType, NullType) => return Known(true),
        (NumberType, StringType) | (_, BoolType) => {
            let rv = right.as_number()?;
            return perform_abstract_eq_cmp(left, &Lit(Lit::Num(Number(rv))));
        }

        (StringType, NumberType) | (BoolType, _) => {
            let lv = left.as_number()?;
            return perform_abstract_eq_cmp(&Lit(Lit::Num(Number(lv))), right);
        }

        (StringType, ObjectType)
        | (NumberType, ObjectType)
        | (ObjectType, StringType)
        | (ObjectType, NumberType) => return Unknown,

        _ => return Known(false),
    }
}

/// https://tc39.github.io/ecma262/#sec-strict-equality-comparison
fn perform_strict_eq_cmp(left: &ExprKind, right: &ExprKind) -> Value<bool> {
    // Any strict equality comparison against NaN returns false.
    if left.is_nan() || right.is_nan() {
        return Known(false);
    }
    match (left, right) {
        // Special case, typeof a == typeof a is always true.
        (
            &Unary(UnaryExpr {
                op: op!("typeof"),
                arg:
                    box Expr {
                        node: Ident(Ident { sym: ref li, .. }),
                        ..
                    },
                ..
            }),
            &Unary(UnaryExpr {
                op: op!("typeof"),
                arg:
                    box Expr {
                        node: ExprKind::Ident(Ident { sym: ref ri, .. }),
                        ..
                    },
                ..
            }),
        ) if li == ri =>
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
fn make_bool_expr<I>(span: Span, val: bool, orig: I) -> ExprKind
where
    I: IntoIterator<Item = Box<Expr>>,
{
    preserve_effects(span, Lit(Lit::Bool(val)), orig)
}

/// make a new expression which evaluates `val` preserving side effects, if any.
fn preserve_effects<I>(span: Span, val: ExprKind, exprs: I) -> ExprKind
where
    I: IntoIterator<Item = Box<Expr>>,
{
    /// Add side effects of `expr` to `v`
    /// preserving order and conditions. (think a() ? yield b() : c())
    fn add_effects(v: &mut Vec<Box<Expr>>, box expr: Box<Expr>) {
        match expr.node {
            ExprKind::Lit(..) | This | Fn(..) | Arrow { .. } | Ident(Ident { .. }) => return,

            // In most case, we can do nothing for this.
            Update(_) | Assign(_) | Yield(_) | Await(_) => v.push(box expr),

            // TODO
            MetaProp(_) => v.push(box expr),

            Call(_) => v.push(box expr),
            New(_) => v.push(box expr),
            Member(_) => v.push(box expr),

            // We are at here because we could not determine value of test.
            //TODO: Drop values if it does not have side effects.
            Cond(_) => v.push(box expr),

            Unary(UnaryExpr { arg, .. }) => add_effects(v, arg),
            Bin(BinExpr { left, right, .. }) => {
                add_effects(v, left);
                add_effects(v, right);
            }
            Seq(SeqExpr { exprs }) => exprs.into_iter().for_each(|e| add_effects(v, e)),

            ExprKind::Paren(e) => add_effects(v, e),

            ExprKind::Object(ObjectLit { props }) => {
                props.into_iter().for_each(|Prop { node, .. }| match node {
                    PropKind::Shorthand(..) => return,
                    PropKind::KeyValue { key, value } => {
                        match key {
                            PropName::Computed(e) => add_effects(v, e),
                            _ => {}
                        }

                        add_effects(v, value)
                    }
                    PropKind::Getter { key, .. }
                    | PropKind::Setter { key, .. }
                    | PropKind::Method { key, .. } => match key {
                        PropName::Computed(e) => add_effects(v, e),
                        _ => {}
                    },
                    PropKind::Assign { .. } => {
                        unreachable!("assign property in object literal is not a valid syntax")
                    }
                })
            }

            ExprKind::Array(ArrayLit { elems }) => {
                elems.into_iter().filter_map(|e| e).fold(v, |v, e| {
                    add_effects(
                        v,
                        match e {
                            ExprOrSpread::Expr(e) => e,
                            ExprOrSpread::Spread(e) => e,
                        },
                    );

                    v
                });
                return;
            }

            Tpl { .. } => unimplemented!("add_effects for template literal"),
            ExprKind::Class(ClassExpr { .. }) => unimplemented!("add_effects for class expression"),
        }
    }

    let mut exprs = exprs.into_iter().fold(vec![], |mut v, e| {
        add_effects(&mut v, e);
        v
    });

    if exprs.is_empty() {
        return val;
    } else {
        exprs.push(box Expr { span, node: val });

        Seq(SeqExpr { exprs })
    }
}
