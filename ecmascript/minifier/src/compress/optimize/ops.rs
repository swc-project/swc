use super::Optimizer;
use crate::compress::optimize::is_pure_undefined;
use crate::util::make_bool;
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

        match e.op {
            op!("===") | op!("==") | op!("!==") | op!("!=") => {
                if e.left.is_ident() && e.left.eq_ignore_span(&e.right) {
                    let id: Ident = e.left.clone().ident().unwrap();
                    if let Some(t) = self.typeofs.get(&id.to_id()) {
                        match *t {
                            js_word!("object") | js_word!("function") => {
                                e.left = Box::new(make_bool(
                                    e.span,
                                    e.op == op!("===") || e.op == op!("=="),
                                ));
                                e.right.take();
                                return;
                            }
                            _ => {}
                        }
                    }
                }
            }

            _ => {}
        }

        if e.op == op!("===") || e.op == op!("!==") {
            if (e.left.is_ident() || e.left.is_member()) && e.left.eq_ignore_span(&e.right) {
                self.changed = true;
                log::trace!("Reducing comparison of same variable ({})", e.op);

                e.op = if e.op == op!("===") {
                    op!("==")
                } else {
                    op!("!=")
                };
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
                        if let Known(Type::Bool) = arg.get_type() {
                            self.changed = true;
                            log::trace!("Optimizing: `!!expr` => `expr`");
                            *e = *arg.take();
                        }

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
        let mut arg = Box::new(e.take());

        match &mut *arg {
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
                *e = *arg;
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
                _ => {
                    if self.ctx.in_bool_ctx {
                        log::trace!("negate: !expr => expr (in bool context)");
                        *e = *arg.take();
                        return;
                    }
                }
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

    /// Rules:
    ///  - `l > i` => `i < l`
    fn can_swap_bin_operands(&mut self, l: &Expr, r: &Expr, is_for_rel: bool) -> bool {
        match (l, r) {
            (Expr::Member(..) | Expr::Call(..) | Expr::Assign(..), Expr::Lit(..)) => true,

            (Expr::Member(..) | Expr::Call(..) | Expr::Assign(..), r) if is_pure_undefined(r) => {
                true
            }

            (Expr::Ident(..), Expr::Lit(..)) if is_for_rel => false,

            (Expr::Ident(l), Expr::Ident(r)) => self.options.comparisons && l.sym > r.sym,

            (Expr::Ident(..), Expr::Lit(..))
            | (
                Expr::Ident(..),
                Expr::Unary(UnaryExpr {
                    op: op!("void") | op!("!"),
                    ..
                }),
            )
            | (
                Expr::This(..),
                Expr::Unary(UnaryExpr {
                    op: op!("void"), ..
                }),
            )
            | (Expr::Unary(..), Expr::Lit(..))
            | (Expr::Tpl(..), Expr::Lit(..)) => true,
            _ => false,
        }
    }

    fn try_swap_bin(&mut self, op: BinaryOp, left: &mut Expr, right: &mut Expr) -> bool {
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

        if !is_supported(op) {
            return false;
        }

        if self.can_swap_bin_operands(&left, &right, false) {
            log::trace!("Swapping operands of binary exprssion");
            swap(left, right);
            return true;
        }

        false
    }

    /// Swap lhs and rhs in certain conditions.
    pub(super) fn swap_bin_operands(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Bin(e @ BinExpr { op: op!("<="), .. })
            | Expr::Bin(e @ BinExpr { op: op!("<"), .. }) => {
                if self.options.comparisons && self.can_swap_bin_operands(&e.left, &e.right, true) {
                    self.changed = true;
                    log::trace!("comparisons: Swapping operands of {}", e.op);

                    e.op = if e.op == op!("<=") {
                        op!(">=")
                    } else {
                        op!(">")
                    };

                    swap(&mut e.left, &mut e.right);
                }
            }

            Expr::Bin(bin) => {
                if self.try_swap_bin(bin.op, &mut bin.left, &mut bin.right) {
                    self.changed = true;
                }
            }
            _ => {}
        }
    }

    /// Remove meaningless literals in a binary expressions.
    ///
    /// # Parameters
    ///
    ///  - `in_bool_ctx`: True for expressions casted to bool.
    ///
    /// # Examples
    ///
    /// - `x() && true` => `!!x()`
    pub(super) fn compress_logical_exprs_as_bang_bang(&mut self, e: &mut Expr, in_bool_ctx: bool) {
        if !self.options.conditionals && !self.options.reduce_vars {
            return;
        }

        let bin = match e {
            Expr::Bin(bin) => bin,
            _ => return,
        };

        match bin.op {
            op!("&&") | op!("||") => {
                self.compress_logical_exprs_as_bang_bang(&mut bin.left, true);
                self.compress_logical_exprs_as_bang_bang(&mut bin.right, true);
            }

            _ => {}
        }

        let lt = bin.left.get_type();
        if !in_bool_ctx {
            match lt {
                // Don't change type
                Known(Type::Bool) => {}
                _ => return,
            }
        }

        let rt = bin.right.get_type();
        match rt {
            Known(Type::Bool) => {}
            _ => return,
        }

        match bin.op {
            op!("&&") => {
                let rb = bin.right.as_pure_bool();
                let rb = match rb {
                    Value::Known(v) => v,
                    _ => return,
                };

                if rb {
                    self.changed = true;
                    log::trace!("Optimizing: e && true => !!e");

                    self.negate_twice(&mut bin.left);
                    *e = *bin.left.take();
                } else {
                    self.changed = true;
                    log::trace!("Optimizing: e && false => e");

                    *e = *bin.left.take();
                }
            }
            op!("||") => {
                let rb = bin.right.as_pure_bool();
                let rb = match rb {
                    Value::Known(v) => v,
                    _ => return,
                };

                if !rb {
                    self.changed = true;
                    log::trace!("Optimizing: e || false => !!e");

                    self.negate_twice(&mut bin.left);
                    *e = *bin.left.take();
                }
            }
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
