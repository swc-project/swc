use swc_common::{util::take::Take, EqIgnoreSpan, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};

use super::Optimizer;
use crate::program_data::VarUsageInfoFlags;

/// Methods related to the options `bools` and `bool_as_ints`.
impl Optimizer<'_> {
    /// Optimizes `typeof` comparisons with `"undefined"`:
    ///
    /// - `typeof x == "undefined"` => `void 0 === x` (when x is declared)
    /// - `typeof x == "undefined"` => `typeof x > "u"` (when x is undeclared)
    /// - `typeof x != "undefined"` => `typeof x < "u"` (when x is undeclared)
    ///
    /// The `> "u"` optimization works because `"undefined"` is the only typeof
    /// result that is greater than `"u"` in lexicographic order.
    pub(super) fn compress_typeof_undefined(&mut self, e: &mut BinExpr) {
        let is_eq = match e.op {
            op!("==") | op!("===") => true,
            op!("!=") | op!("!==") => false,
            _ => return,
        };

        let (arg, undefined_expr, reverse) = match (&mut *e.left, &mut *e.right) {
            (
                Expr::Unary(UnaryExpr {
                    op: op!("typeof"),
                    arg,
                    ..
                }),
                Expr::Lit(Lit::Str(lit_str)),
            ) if lit_str.value == "undefined" => (arg, &mut e.right, false),
            (
                Expr::Lit(Lit::Str(lit_str)),
                Expr::Unary(UnaryExpr {
                    op: op!("typeof"),
                    arg,
                    ..
                }),
            ) if lit_str.value == "undefined" => (arg, &mut e.left, true),
            _ => {
                return;
            }
        };

        self.changed = true;
        if self.is_undeclared_ident(arg) {
            // typeof x == "undefined"  => typeof x > "u"
            // typeof x != "undefined"  => typeof x < "u"
            // "undefined" == typeof x  => "u" < typeof x
            // "undefined" != typeof x  => "u" > typeof x
            e.op = if is_eq ^ reverse { op!(">") } else { op!("<") };
            let span = undefined_expr.span();
            *undefined_expr = "u".into();
            undefined_expr.set_span(span);

            report_change!("bools: Optimizing `typeof x == \"undefined\"` into `typeof x > \"u\"`");
            return;
        }

        // "undefined" -> void 0
        *undefined_expr = Expr::undefined(undefined_expr.span());
        let arg = arg.take();
        let typeof_expr = if reverse { &mut e.right } else { &mut e.left };

        // typeof x -> x
        *typeof_expr = arg;
        e.op = if is_eq { op!("===") } else { op!("!==") };

        report_change!("bools: Optimizing `typeof x == \"undefined\"` into `x === void 0`");
    }

    fn is_undeclared_ident(&self, arg: &Expr) -> bool {
        arg.as_ident().is_some_and(|ident| {
            self.data
                .vars
                .get(&ident.to_id())
                .map(|u| !u.flags.contains(VarUsageInfoFlags::DECLARED))
                .unwrap_or(false)
        })
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
