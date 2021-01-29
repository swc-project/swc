use super::Optimizer;
use crate::compress::optimize::is_pure_undefined;
use crate::util::make_bool;
use swc_atoms::js_word;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Type;
use swc_ecma_utils::Value::Known;
use swc_ecma_utils::Value::Unknown;

impl Optimizer {
    /// Disabled because it can change semantics.
    ///
    /// - `!foo || bar();` => `foo && bar();`
    /// - `!foo && bar();` => `foo || bar();`
    pub(super) fn compress_logical_exprs_with_negated_lhs(&mut self, e: &mut Expr) {
        if !self.options.bools || true {
            return;
        }

        match e {
            Expr::Bin(BinExpr {
                span,
                op: op @ op!("||"),
                left,
                right,
                ..
            })
            | Expr::Bin(BinExpr {
                span,
                op: op @ op!("&&"),
                left,
                right,
                ..
            }) => match &mut **left {
                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) => {
                    if *op == op!("&&") {
                        log::trace!("booleans: Compressing `!foo && bar` as `foo || bar`");
                    } else {
                        log::trace!("booleans: Compressing `!foo || bar` as `foo && bar`");
                    }
                    self.changed = true;
                    *e = Expr::Bin(BinExpr {
                        span: *span,
                        left: arg.take(),
                        op: if *op == op!("&&") {
                            op!("||")
                        } else {
                            op!("&&")
                        },
                        right: right.take(),
                    });
                    return;
                }
                _ => {}
            },

            _ => {}
        }
    }

    ///
    /// - `!condition() || !-3.5` => `!condition()`
    ///
    /// In this case, if lhs is false, rhs is also false so it's removable.
    pub(super) fn remove_useless_pipes(&mut self, e: &mut Expr) {
        if !self.options.bools {
            return;
        }

        match e {
            Expr::Bin(BinExpr {
                left,
                op: op @ op!("&&"),
                right,
                ..
            })
            | Expr::Bin(BinExpr {
                left,
                op: op @ op!("||"),
                right,
                ..
            }) => {
                let lt = left.get_type();
                let rt = right.get_type();

                match (lt, rt) {
                    (Known(Type::Bool), Known(Type::Bool)) => {
                        let rb = right.as_pure_bool();
                        let rb = match rb {
                            Known(v) => v,
                            Unknown => return,
                        };

                        //
                        let can_remove = if *op == op!("&&") { rb } else { !rb };

                        if can_remove {
                            if *op == op!("&&") {
                                log::trace!("booleans: Compressing `!foo && true` as `!foo`");
                            } else {
                                log::trace!("booleans: Compressing `!foo || false` as `!foo`");
                            }
                            self.changed = true;
                            *e = *left.take();
                            return;
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    /// `!(a && b)` => `!a || !b`
    pub(super) fn optimize_bools(&mut self, e: &mut Expr) {
        if !self.options.bools {
            return;
        }

        match e {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("!"),
                arg,
                ..
            }) => match &mut **arg {
                Expr::Bin(BinExpr {
                    op: op!("&&"),
                    left,
                    right,
                    ..
                }) => {
                    log::trace!("Optimizing ``!(a && b)` as `!a || !b`");
                    self.changed = true;
                    *e = Expr::Bin(BinExpr {
                        span: *span,
                        op: op!("||"),
                        left: Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("!"),
                            arg: left.take(),
                        })),
                        right: Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("!"),
                            arg: right.take(),
                        })),
                    });
                    return;
                }
                _ => {}
            },
            _ => {}
        }
    }

    pub(super) fn compress_useless_deletes(&mut self, e: &mut Expr) {
        if !self.options.bools {
            return;
        }

        let delete = match e {
            Expr::Unary(
                u @ UnaryExpr {
                    op: op!("delete"), ..
                },
            ) => u,
            _ => return,
        };

        if delete.arg.may_have_side_effects() {
            return;
        }

        let convert_to_true = match &*delete.arg {
            e if is_pure_undefined(&e) => true,
            Expr::Ident(Ident {
                sym: js_word!("NaN"),
                ..
            }) => true,

            // NaN
            Expr::Bin(bin) => bin.right.as_number() == Known(0.0),
            _ => false,
        };

        if convert_to_true {
            self.changed = true;
            let span = delete.arg.span();
            *e = make_bool(span, true);
            return;
        }
    }
}
