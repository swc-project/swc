use super::Optimizer;
use crate::util::ValueExt;
use std::mem::swap;
use swc_atoms::js_word;
use swc_common::EqIgnoreSpan;
use swc_common::Span;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Type;
use swc_ecma_utils::Value;
use Value::Known;

impl Optimizer<'_> {
    ///
    /// - `a === undefined || a === null` => `a == null`
    pub(super) fn optimize_null_or_undefined_cmp(&mut self, e: &mut BinExpr) {
        fn opt(
            span: Span,
            top_op: BinaryOp,
            e_left: &mut Expr,
            e_right: &mut Expr,
        ) -> Option<BinExpr> {
            let (cmp, op, left, right) = match &mut *e_left {
                Expr::Bin(left_bin) => {
                    if left_bin.op != op!("===") && left_bin.op != op!("!==") {
                        return None;
                    }

                    if top_op == op!("&&") && left_bin.op == op!("===") {
                        return None;
                    }
                    if top_op == op!("||") && left_bin.op == op!("!==") {
                        return None;
                    }

                    if !left_bin.right.is_ident() {
                        return None;
                    }

                    let right = match &mut *e_right {
                        Expr::Bin(right_bin) => {
                            if right_bin.op != left_bin.op {
                                return None;
                            }

                            if !right_bin.right.eq_ignore_span(&left_bin.right) {
                                return None;
                            }

                            &mut *right_bin.left
                        }
                        _ => return None,
                    };

                    (
                        &mut left_bin.right,
                        left_bin.op,
                        &mut *left_bin.left,
                        &mut *right,
                    )
                }
                _ => return None,
            };

            let lt = left.get_type();
            let rt = right.get_type();
            if let Known(lt) = lt {
                if let Known(rt) = rt {
                    match (lt, rt) {
                        (Type::Undefined, Type::Null) | (Type::Null, Type::Undefined) => {
                            if op == op!("===") {
                                log::trace!(
                                    "Reducing `!== null || !== undefined` check to `!= null`"
                                );
                                return Some(BinExpr {
                                    span,
                                    op: op!("=="),
                                    left: cmp.take(),
                                    right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                                });
                            } else {
                                log::trace!(
                                    "Reducing `=== null || === undefined` check to `== null`"
                                );
                                return Some(BinExpr {
                                    span,
                                    op: op!("!="),
                                    left: cmp.take(),
                                    right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                                });
                            }
                        }
                        _ => {}
                    }
                }
            }

            None
        }

        if e.op == op!("||") || e.op == op!("&&") {
            {
                let res = opt(e.span, e.op, &mut e.left, &mut e.right);
                if let Some(res) = res {
                    self.changed = true;
                    *e = res;
                    return;
                }
            }

            match (&mut *e.left, &mut *e.right) {
                (Expr::Bin(left), right) => {
                    if e.op == left.op {
                        let res = opt(right.span(), e.op, &mut left.right, &mut *right);
                        if let Some(res) = res {
                            self.changed = true;
                            *e = BinExpr {
                                span: e.span,
                                op: e.op,
                                left: left.left.take(),
                                right: Box::new(Expr::Bin(res)),
                            };
                            return;
                        }
                    }
                }
                _ => {}
            }
        }
    }

    ///
    /// - `'12' === `foo` => '12' == 'foo'`
    pub(super) fn optimize_bin_operator(&mut self, e: &mut BinExpr) {
        if !self.options.comparisons {
            return;
        }

        if e.op == op!("===") || e.op == op!("==") || e.op == op!("!=") || e.op == op!("!==") {
            if e.left.is_ident() && e.left.eq_ignore_span(&e.right) {
                self.changed = true;
                log::trace!("Reducing comparison of same variable ({})", e.op);

                // TODO(kdy1): Create another method and assign to `Expr` instead of using a
                // hack based on take.
                e.left = Box::new(Expr::Lit(Lit::Bool(Bool {
                    span: e.span,
                    value: e.op == op!("===") || e.op == op!("==="),
                })));
                e.right.take();
                return;
            }
        }

        let lt = e.left.get_type();
        let rt = e.right.get_type();

        if e.op == op!("===") {
            if let Known(lt) = lt {
                if let Known(rt) = rt {
                    if lt == rt {
                        e.op = op!("==");
                        self.changed = true;
                        log::trace!("Reduced `===` to `==` because types of operands are identical")
                    }
                }
            }
        }
    }

    ///
    /// - `1 == 1` => `true`
    pub(super) fn optimize_lit_cmp(&mut self, n: &mut BinExpr) -> Option<Expr> {
        match n.op {
            op!("==") | op!("!=") => {
                // Abort if types differ, or one of them is unknown.
                if n.left.get_type().opt()? != n.right.get_type().opt()? {
                    return None;
                }

                let l = n.left.as_pure_bool().opt()?;
                let r = n.right.as_pure_bool().opt()?;

                let value = if n.op == op!("==") { l == r } else { l != r };

                log::trace!("Optimizing: literal comparison => bool");
                self.changed = true;
                return Some(Expr::Lit(Lit::Bool(Bool {
                    span: n.span,
                    value,
                })));
            }
            _ => {}
        }

        None
    }

    ///
    /// - `!!(a in b)` => `a in b`
    /// - `!!(function() {})()` => `!(function() {})()`
    pub(super) fn optimize_bangbang(&mut self, e: &mut Expr) {
        match e {
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => match &mut **arg {
                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) => match &**arg {
                    Expr::Unary(UnaryExpr { op: op!("!"), .. })
                    | Expr::Bin(BinExpr { op: op!("in"), .. })
                    | Expr::Bin(BinExpr {
                        op: op!("instanceof"),
                        ..
                    })
                    | Expr::Bin(BinExpr { op: op!("=="), .. })
                    | Expr::Bin(BinExpr { op: op!("!="), .. })
                    | Expr::Bin(BinExpr { op: op!("==="), .. })
                    | Expr::Bin(BinExpr { op: op!("!=="), .. })
                    | Expr::Bin(BinExpr { op: op!("<="), .. })
                    | Expr::Bin(BinExpr { op: op!("<"), .. })
                    | Expr::Bin(BinExpr { op: op!(">="), .. })
                    | Expr::Bin(BinExpr { op: op!(">"), .. }) => {
                        log::trace!("Optimizing: `!!expr` => `expr`");
                        *e = *arg.take();
                        return;
                    }

                    _ => {}
                },
                _ => {}
            },
            _ => {}
        }
    }

    /// TODO: Optimize based on the type.
    pub(super) fn negate_twice(&mut self, e: &mut Expr) {
        self.negate(e);
        self.negate(e);
    }

    /// Creates `!e` where e is the expression passed as an argument.
    ///
    /// # Note
    ///
    /// This method returns `!e` if `!!e` is given as a argument.
    ///
    /// TODO: Handle special cases like !1 or !0
    pub(super) fn negate(&mut self, e: &mut Expr) {
        self.changed = true;
        let arg = Box::new(e.take());

        match e {
            Expr::Bin(bin @ BinExpr { op: op!("=="), .. })
            | Expr::Bin(bin @ BinExpr { op: op!("!="), .. })
            | Expr::Bin(bin @ BinExpr { op: op!("==="), .. })
            | Expr::Bin(bin @ BinExpr { op: op!("!=="), .. }) => {
                bin.op = match bin.op {
                    op!("==") => {
                        op!("!=")
                    }
                    op!("!=") => {
                        op!("==")
                    }
                    op!("===") => {
                        op!("!==")
                    }
                    op!("!==") => {
                        op!("===")
                    }
                    _ => {
                        unreachable!()
                    }
                };
                self.changed = true;
                log::trace!("negate: binary");
                return;
            }

            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => match &mut **arg {
                Expr::Unary(UnaryExpr { op: op!("!"), .. }) => {
                    log::trace!("negate: !!bool => !bool");
                    *e = *arg.take();
                    return;
                }
                Expr::Bin(BinExpr { op: op!("in"), .. })
                | Expr::Bin(BinExpr {
                    op: op!("instanceof"),
                    ..
                }) => {
                    log::trace!("negate: !bool => bool");
                    *e = *arg.take();
                    return;
                }
                _ => {}
            },
            _ => {}
        }

        log::trace!("negate: e => !e");

        *e = Expr::Unary(UnaryExpr {
            span: DUMMY_SP,
            op: op!("!"),
            arg,
        });
    }

    pub(super) fn handle_negated_seq(&mut self, n: &mut Expr) {
        match &mut *n {
            Expr::Unary(e @ UnaryExpr { op: op!("!"), .. })
            | Expr::Unary(
                e @ UnaryExpr {
                    op: op!("delete"), ..
                },
            ) => {
                match &mut *e.arg {
                    Expr::Seq(SeqExpr { exprs, .. }) => {
                        if exprs.is_empty() {
                            return;
                        }
                        log::trace!("optimizing negated sequences");

                        {
                            let last = exprs.last_mut().unwrap();
                            self.optimize_expr_in_bool_ctx(last);
                            // Negate last element.
                            self.negate(last);
                        }

                        *n = *e.arg.take();
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    /// This method does
    ///
    /// - `x *= 3` => `x = 3 * x`
    /// - `x = 3 | x` `x |= 3`
    /// - `x = 3 & x` => `x &= 3;`
    /// - `x ^= 3` => `x = 3 ^ x`
    pub(super) fn compress_bin_assignment_to_right(&mut self, e: &mut AssignExpr) {
        // TODO: Handle pure properties.
        let lhs = match &e.left {
            PatOrExpr::Expr(e) => match &**e {
                Expr::Ident(i) => i,
                _ => return,
            },
            PatOrExpr::Pat(p) => match &**p {
                Pat::Ident(i) => &i.id,
                _ => return,
            },
        };

        let (op, left) = match &mut *e.right {
            Expr::Bin(BinExpr {
                left, op, right, ..
            }) => match &**right {
                Expr::Ident(r) if lhs.sym == r.sym && lhs.span.ctxt == r.span.ctxt => {
                    // We need this check because a function call like below can change value of
                    // operand.
                    //
                    // x = g() * x;

                    match &**left {
                        Expr::This(..) | Expr::Ident(..) | Expr::Lit(..) => {}
                        _ => return,
                    }

                    (op, left)
                }
                _ => return,
            },
            _ => return,
        };

        let op = match op {
            BinaryOp::Mul => {
                op!("*=")
            }
            BinaryOp::BitOr => {
                op!("|=")
            }
            BinaryOp::BitXor => {
                op!("^=")
            }
            BinaryOp::BitAnd => {
                op!("&=")
            }
            _ => return,
        };

        log::trace!("Compressing: `e = 3 & e` => `e &= 3`");

        self.changed = true;
        e.op = op;
        e.right = left.take();
    }

    /// Swap lhs and rhs in certain conditions.
    pub(super) fn swap_bin_operands(&mut self, expr: &mut Expr) {
        fn is_supported(op: BinaryOp) -> bool {
            match op {
                op!("===")
                | op!("!==")
                | op!("==")
                | op!("!=")
                | op!("&")
                | op!("^")
                | op!("|")
                | op!("*") => true,
                _ => false,
            }
        }

        fn optimize(op: BinaryOp, left: &mut Expr, right: &mut Expr) -> bool {
            if !is_supported(op) {
                return false;
            }

            match (&*left, &*right) {
                (Expr::Ident(..), Expr::Lit(..))
                | (
                    Expr::Ident(..),
                    Expr::Unary(UnaryExpr {
                        op: op!("void"), ..
                    }),
                )
                | (
                    Expr::This(..),
                    Expr::Unary(UnaryExpr {
                        op: op!("void"), ..
                    }),
                )
                | (Expr::Unary(..), Expr::Lit(..))
                | (Expr::Tpl(..), Expr::Lit(..)) => {
                    log::trace!("Swapping operands of binary exprssion");
                    swap(left, right);
                    return true;
                }
                _ => {}
            }

            false
        }

        match expr {
            Expr::Bin(bin) => {
                if optimize(bin.op, &mut bin.left, &mut bin.right) {
                    self.changed = true;
                }
            }
            _ => {}
        }
    }

    /// Remove meaningless literals in a binary expressions.
    ///
    ///
    /// # Examples
    ///
    /// - `x() && true` => `!!x()`
    pub(super) fn compress_logical_exprs_as_bang_bang(&mut self, e: &mut Expr) {
        if !self.options.conditionals && !self.options.reduce_vars {
            return;
        }

        let bin = match e {
            Expr::Bin(bin) => bin,
            _ => return,
        };

        match bin.op {
            op!("&&") => {
                let rt = bin.right.get_type();
                match rt {
                    Known(Type::Bool) => {}
                    _ => return,
                }

                let rb = bin.right.as_pure_bool();
                let rb = match rb {
                    Value::Known(v) => v,
                    _ => return,
                };

                log::trace!("Optimizing: e && true => !!e");

                if rb {
                    self.negate_twice(&mut bin.left);
                    *e = *bin.left.take();
                }
            }
            op!("||") => {}
            _ => {}
        }
    }

    ///
    /// - `!(x == y)` => `x != y`
    /// - `!(x === y)` => `x !== y`
    pub(super) fn compress_negated_bin_eq(&self, e: &mut Expr) {
        let unary = match e {
            Expr::Unary(e @ UnaryExpr { op: op!("!"), .. }) => e,
            _ => return,
        };

        match &mut *unary.arg {
            Expr::Bin(BinExpr {
                op: op @ op!("=="),
                left,
                right,
                ..
            })
            | Expr::Bin(BinExpr {
                op: op @ op!("==="),
                left,
                right,
                ..
            }) => {
                *e = Expr::Bin(BinExpr {
                    span: unary.span,
                    op: if *op == op!("==") {
                        op!("!=")
                    } else {
                        op!("!==")
                    },
                    left: left.take(),
                    right: right.take(),
                })
            }
            _ => {}
        }
    }

    pub(super) fn optimize_nullish_coalescing(&mut self, e: &mut Expr) {
        let (l, r) = match e {
            Expr::Bin(BinExpr {
                op: op!("??"),
                left,
                right,
                ..
            }) => (&mut **left, &mut **right),
            _ => return,
        };

        match l {
            Expr::Lit(Lit::Null(..)) => {
                log::trace!("Removing null from lhs of ??");
                self.changed = true;
                *e = r.take();
                return;
            }
            Expr::Lit(Lit::Num(..))
            | Expr::Lit(Lit::Str(..))
            | Expr::Lit(Lit::BigInt(..))
            | Expr::Lit(Lit::Bool(..))
            | Expr::Lit(Lit::Regex(..)) => {
                log::trace!("Removing rhs of ?? as lhs cannot be null nor undefined");
                self.changed = true;
                *e = l.take();
                return;
            }
            _ => {}
        }
    }

    /// `typeof b !== 'undefined'` => `b != void 0`
    pub(super) fn compress_typeofs(&mut self, e: &mut Expr) {
        if !self.options.typeofs {
            return;
        }

        match e {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
                ..
            }) => match &**arg {
                Expr::Ident(arg) => {
                    if let Some(value) = self.typeofs.get(&arg.to_id()).cloned() {
                        log::trace!(
                            "Converting typeof of variable to literal as we know the value"
                        );
                        self.changed = true;
                        *e = Expr::Lit(Lit::Str(Str {
                            span: *span,
                            value,
                            has_escape: false,
                            kind: Default::default(),
                        }));
                        return;
                    }
                }

                Expr::Arrow(..) | Expr::Fn(..) => {
                    log::trace!("Converting typeof to 'function' as we know the value");
                    self.changed = true;
                    *e = Expr::Lit(Lit::Str(Str {
                        span: *span,
                        value: js_word!("function"),
                        has_escape: false,
                        kind: Default::default(),
                    }));
                    return;
                }

                Expr::Array(..) | Expr::Object(..) => {
                    log::trace!("Converting typeof to 'object' as we know the value");
                    self.changed = true;
                    *e = Expr::Lit(Lit::Str(Str {
                        span: *span,
                        value: js_word!("object"),
                        has_escape: false,
                        kind: Default::default(),
                    }));
                    return;
                }
                _ => {}
            },
            _ => {}
        }
    }
}
