use swc_common::{util::take::Take, EqIgnoreSpan, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};

use super::Optimizer;
use crate::program_data::VarUsageInfoFlags;

/// Methods related to the options `bools` and `bool_as_ints`.
impl Optimizer<'_> {
    ///
    /// - `"undefined" == typeof value;` => `void 0 === value`
    pub(super) fn compress_typeof_undefined(&mut self, e: &mut BinExpr) {
        fn opt(o: &mut Optimizer, l: &mut Expr, r: &mut Expr) -> bool {
            match (&mut *l, &mut *r) {
                (
                    Expr::Lit(Lit::Str(Str { value: l_v, .. })),
                    Expr::Unary(UnaryExpr {
                        op: op!("typeof"),
                        arg,
                        ..
                    }),
                ) if &**l_v == "undefined" => {
                    // TODO?
                    if let Expr::Ident(arg) = &**arg {
                        if let Some(usage) = o.data.vars.get(arg.ctxt, &arg.sym) {
                            if !usage.flags.contains(VarUsageInfoFlags::DECLARED) {
                                return false;
                            }
                        }
                    }

                    *l = *Expr::undefined(l.span());
                    *r = *arg.take();
                    true
                }
                _ => false,
            }
        }

        match e.op {
            op!("==") | op!("!=") | op!("===") | op!("!==") => {}
            _ => return,
        }

        if opt(self, &mut e.left, &mut e.right) || opt(self, &mut e.right, &mut e.left) {
            e.op = match e.op {
                op!("==") => {
                    op!("===")
                }
                op!("!=") => {
                    op!("!==")
                }
                _ => e.op,
            };
        }
    }

    ///
    /// - `a === undefined || a === null` => `a == null`
    pub(super) fn optimize_optional_chain_generated(&mut self, e: &mut BinExpr) {
        if e.op == op!("||") || e.op == op!("&&") {
            {
                let res = self.optimize_optional_chain_generated_inner(
                    e.span,
                    e.op,
                    &mut e.left,
                    &mut e.right,
                );
                if let Some(res) = res {
                    self.changed = true;
                    report_change!("bools: Optimizing `=== null || === undefined` to `== null`");
                    *e = res;
                    return;
                }
            }

            if let (Expr::Bin(left), right) = (&mut *e.left, &mut *e.right) {
                if e.op == left.op {
                    let res = self.optimize_optional_chain_generated_inner(
                        right.span(),
                        e.op,
                        &mut left.right,
                        &mut *right,
                    );
                    if let Some(res) = res {
                        self.changed = true;
                        report_change!(
                            "bools: Optimizing `=== null || === undefined` to `== null`"
                        );
                        *e = BinExpr {
                            span: e.span,
                            op: e.op,
                            left: left.left.take(),
                            right: res.into(),
                        };
                    }
                }
            }
        }
    }

    fn optimize_optional_chain_generated_inner(
        &mut self,
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

                match &*left_bin.right {
                    Expr::Ident(..) | Expr::Lit(..) => {}
                    Expr::Assign(AssignExpr {
                        left: AssignTarget::Simple(SimpleAssignTarget::Ident(_)),
                        ..
                    }) => (),
                    Expr::Member(MemberExpr {
                        obj,
                        prop: MemberProp::Ident(..),
                        ..
                    }) => {
                        if self.should_preserve_property_access(
                            obj,
                            super::unused::PropertyAccessOpts {
                                allow_getter: false,
                                only_ident: false,
                            },
                        ) {
                            return None;
                        }
                    }
                    _ => {
                        return None;
                    }
                }

                let right = match &mut *e_right {
                    Expr::Bin(right_bin) => {
                        if right_bin.op != left_bin.op {
                            return None;
                        }

                        let same_assign = if let (
                            Expr::Assign(AssignExpr {
                                left: AssignTarget::Simple(SimpleAssignTarget::Ident(l_id)),
                                ..
                            }),
                            Expr::Ident(r_id),
                        ) = (&*left_bin.right, &*right_bin.right)
                        {
                            l_id.id.eq_ignore_span(r_id)
                        } else {
                            false
                        };

                        if !(same_assign || right_bin.right.eq_ignore_span(&left_bin.right)) {
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

        let lt = left.get_type(self.ctx.expr_ctx);
        let rt = right.get_type(self.ctx.expr_ctx);
        if let (Value::Known(Type::Undefined), Value::Known(Type::Null))
        | (Value::Known(Type::Null), Value::Known(Type::Undefined)) = (lt, rt)
        {
            if op == op!("===") {
                report_change!("Reducing `!== null || !== undefined` check to `!= null`");
                return Some(BinExpr {
                    span,
                    op: op!("=="),
                    left: cmp.take(),
                    right: Lit::Null(Null { span: DUMMY_SP }).into(),
                });
            } else {
                report_change!("Reducing `=== null || === undefined` check to `== null`");
                return Some(BinExpr {
                    span,
                    op: op!("!="),
                    left: cmp.take(),
                    right: Lit::Null(Null { span: DUMMY_SP }).into(),
                });
            }
        }

        None
    }
}
