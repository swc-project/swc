use crate::debug::dump;
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ExprExt;

/// Creates `!e` where e is the expression passed as an argument.
///
/// # Note
///
/// This method returns `!e` if `!!e` is given as a argument.
///
/// TODO: Handle special cases like !1 or !0
pub(super) fn negate(e: &mut Expr, in_bool_ctx: bool) {
    let start_str = dump(&*e);

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
            log::debug!("negate: binary");
            return;
        }

        Expr::Bin(BinExpr {
            left,
            right,
            op: op @ op!("&&"),
            ..
        }) if is_ok_to_negate_rhs(&right) => {
            log::debug!("negate: a && b => !a || !b");

            negate(&mut **left, in_bool_ctx);
            negate(&mut **right, in_bool_ctx);
            *op = op!("||");
            return;
        }

        Expr::Bin(BinExpr {
            left,
            right,
            op: op @ op!("||"),
            ..
        }) if is_ok_to_negate_rhs(&right) => {
            log::debug!("negate: a || b => !a && !b");

            negate(&mut **left, in_bool_ctx);
            negate(&mut **right, in_bool_ctx);
            *op = op!("&&");
            return;
        }

        Expr::Cond(CondExpr { cons, alt, .. })
            if is_ok_to_negate_for_cond(&cons) && is_ok_to_negate_for_cond(&alt) =>
        {
            log::debug!("negate: cond");

            negate(&mut **cons, in_bool_ctx);
            negate(&mut **alt, in_bool_ctx);
            return;
        }

        Expr::Seq(SeqExpr { exprs, .. }) => {
            if let Some(last) = exprs.last_mut() {
                log::debug!("negate: seq");

                negate(&mut **last, in_bool_ctx);
                return;
            }
        }

        _ => {}
    }

    let mut arg = Box::new(e.take());

    match &mut *arg {
        Expr::Unary(UnaryExpr {
            op: op!("!"), arg, ..
        }) => match &mut **arg {
            Expr::Unary(UnaryExpr { op: op!("!"), .. }) => {
                log::debug!("negate: !!bool => !bool");
                *e = *arg.take();
                return;
            }
            Expr::Bin(BinExpr { op: op!("in"), .. })
            | Expr::Bin(BinExpr {
                op: op!("instanceof"),
                ..
            }) => {
                log::debug!("negate: !bool => bool");
                *e = *arg.take();
                return;
            }
            _ => {
                if in_bool_ctx {
                    log::debug!("negate: !expr => expr (in bool context)");
                    *e = *arg.take();
                    return;
                }
            }
        },

        _ => {}
    }

    log::debug!("negate: e => !e");

    *e = Expr::Unary(UnaryExpr {
        span: DUMMY_SP,
        op: op!("!"),
        arg,
    });

    if cfg!(feature = "debug") {
        log::trace!("[Change] Negated `{}` as `{}`", start_str, dump(&*e));
    }
}

pub(crate) fn is_ok_to_negate_for_cond(e: &Expr) -> bool {
    match e {
        Expr::Update(..) => false,
        _ => true,
    }
}

pub(crate) fn is_ok_to_negate_rhs(rhs: &Expr) -> bool {
    match rhs {
        Expr::Member(..) => true,
        Expr::Bin(BinExpr {
            op: op!("===") | op!("!==") | op!("==") | op!("!="),
            ..
        }) => true,

        Expr::Call(..) | Expr::New(..) => false,

        Expr::Update(..) => false,

        Expr::Bin(BinExpr {
            op: op!("&&") | op!("||"),
            left,
            right,
            ..
        }) => is_ok_to_negate_rhs(&left) && is_ok_to_negate_rhs(&right),

        Expr::Bin(BinExpr { left, right, .. }) => {
            is_ok_to_negate_rhs(&left) && is_ok_to_negate_rhs(&right)
        }

        Expr::Assign(e) => is_ok_to_negate_rhs(&e.right),

        Expr::Unary(UnaryExpr {
            op: op!("!") | op!("delete"),
            ..
        }) => true,

        Expr::Seq(e) => {
            if let Some(last) = e.exprs.last() {
                is_ok_to_negate_rhs(&last)
            } else {
                true
            }
        }

        Expr::Cond(e) => is_ok_to_negate_rhs(&e.cons) && is_ok_to_negate_rhs(&e.alt),

        _ => {
            if !rhs.may_have_side_effects() {
                return true;
            }

            if cfg!(feature = "debug") {
                log::warn!("unimplemented: is_ok_to_negate_rhs: `{}`", dump(&*rhs));
            }

            false
        }
    }
}

/// A negative value means that it's efficient to negate the expression.
pub(crate) fn negate_cost(e: &Expr, in_bool_ctx: bool, is_ret_val_ignored: bool) -> Option<isize> {
    fn cost(
        e: &Expr,
        in_bool_ctx: bool,
        bin_op: Option<BinaryOp>,
        is_ret_val_ignored: bool,
    ) -> isize {
        match e {
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => {
                // TODO: Check if this argument is actually start of line.
                match &**arg {
                    Expr::Call(CallExpr {
                        callee: ExprOrSuper::Expr(callee),
                        ..
                    }) => match &**callee {
                        Expr::Fn(..) => return 0,
                        _ => {}
                    },
                    _ => {}
                }

                if in_bool_ctx {
                    let c = -cost(arg, true, None, is_ret_val_ignored);
                    return c.min(-1);
                }

                match &**arg {
                    Expr::Unary(UnaryExpr { op: op!("!"), .. }) => -1,

                    _ => 1,
                }
            }
            Expr::Bin(BinExpr {
                op: op!("===") | op!("!==") | op!("==") | op!("!="),
                ..
            }) => 0,

            Expr::Bin(BinExpr {
                op: op @ op!("||") | op @ op!("&&"),
                left,
                right,
                ..
            }) => {
                let l_cost = cost(&left, in_bool_ctx, Some(*op), false);

                if !is_ret_val_ignored && !is_ok_to_negate_rhs(&right) {
                    return l_cost + 3;
                }
                l_cost + cost(&right, in_bool_ctx, Some(*op), is_ret_val_ignored)
            }

            Expr::Cond(CondExpr { cons, alt, .. })
                if is_ok_to_negate_for_cond(&cons) && is_ok_to_negate_for_cond(&alt) =>
            {
                cost(&cons, in_bool_ctx, bin_op, is_ret_val_ignored)
                    + cost(&alt, in_bool_ctx, bin_op, is_ret_val_ignored)
            }

            Expr::Cond(..)
            | Expr::Update(..)
            | Expr::Bin(BinExpr {
                op: op!("in") | op!("instanceof"),
                ..
            }) => 3,

            Expr::Assign(..) => {
                if is_ret_val_ignored {
                    0
                } else {
                    3
                }
            }

            Expr::Seq(e) => {
                if let Some(last) = e.exprs.last() {
                    return cost(&last, in_bool_ctx, bin_op, is_ret_val_ignored);
                }

                if is_ret_val_ignored {
                    0
                } else {
                    1
                }
            }

            _ => {
                if is_ret_val_ignored {
                    0
                } else {
                    1
                }
            }
        }
    }

    let cost = cost(e, in_bool_ctx, None, is_ret_val_ignored);

    if cfg!(feature = "debug") {
        log::trace!("negation cost of `{}` = {}", dump(&*e), cost);
    }

    Some(cost)
}

pub(crate) fn is_pure_undefined(e: &Expr) -> bool {
    match e {
        Expr::Ident(Ident {
            sym: js_word!("undefined"),
            ..
        }) => true,

        Expr::Unary(UnaryExpr {
            op: UnaryOp::Void,
            arg,
            ..
        }) if !arg.may_have_side_effects() => true,

        _ => false,
    }
}
