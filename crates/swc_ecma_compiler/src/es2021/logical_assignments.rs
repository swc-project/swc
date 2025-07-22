use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::alias_ident_for;

use crate::CompilerImpl;

impl<'a> CompilerImpl<'a> {
    /// Memorize computed property name for logical assignments
    pub(super) fn memorize_prop_for_logical_assignment(
        &mut self,
        c: ComputedPropName,
    ) -> (ComputedPropName, ComputedPropName) {
        let alias = alias_ident_for(&c.expr, "_ref");
        self.es2021_logical_assignment_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: alias.clone().into(),
            init: None,
            definite: false,
        });

        (
            ComputedPropName {
                span: c.span,
                expr: AssignExpr {
                    span: DUMMY_SP,
                    left: alias.clone().into(),
                    op: op!("="),
                    right: c.expr,
                }
                .into(),
            },
            ComputedPropName {
                span: c.span,
                expr: Box::new(alias.into()),
            },
        )
    }

    /// Transform logical assignment operators (&&=, ||=, ??=) to binary
    /// expressions
    pub(crate) fn transform_logical_assignment(&mut self, e: &mut Expr) -> bool {
        if let Expr::Assign(AssignExpr {
            span,
            op: op @ (op!("&&=") | op!("||=") | op!("??=")),
            left: AssignTarget::Simple(left),
            right,
        }) = e
        {
            let (left_expr, r_assign_target) = match &mut *left {
                SimpleAssignTarget::SuperProp(SuperPropExpr {
                    span,
                    obj,
                    prop: SuperProp::Computed(c),
                }) => {
                    let (left, right) = self.memorize_prop_for_logical_assignment(c.take());

                    (
                        Box::new(
                            SuperPropExpr {
                                span: *span,
                                obj: *obj,
                                prop: SuperProp::Computed(left),
                            }
                            .into(),
                        ),
                        Box::new(
                            SuperPropExpr {
                                span: *span,
                                obj: *obj,
                                prop: SuperProp::Computed(right),
                            }
                            .into(),
                        ),
                    )
                }
                SimpleAssignTarget::Member(m) => {
                    let (left_obj, right_obj) = match *m.obj.take() {
                        // TODO: local vars
                        obj @ Expr::This(_) => (obj.clone().into(), obj.into()),
                        obj => {
                            let alias = alias_ident_for(&obj, "_ref");
                            self.es2021_logical_assignment_vars.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: alias.clone().into(),
                                init: None,
                                definite: false,
                            });

                            (
                                AssignExpr {
                                    span: DUMMY_SP,
                                    op: op!("="),
                                    left: alias.clone().into(),
                                    right: obj.into(),
                                }
                                .into(),
                                alias.into(),
                            )
                        }
                    };

                    let (left_prop, right_prop) = match m.prop.take() {
                        MemberProp::Computed(c) => {
                            let (left, right) = self.memorize_prop_for_logical_assignment(c);
                            (left.into(), right.into())
                        }
                        prop => (prop.clone(), prop),
                    };

                    (
                        MemberExpr {
                            span: DUMMY_SP,
                            obj: left_obj,
                            prop: left_prop,
                        }
                        .into(),
                        MemberExpr {
                            span: DUMMY_SP,
                            obj: right_obj,
                            prop: right_prop,
                        }
                        .into(),
                    )
                }
                _ => {
                    let expr: Box<Expr> = left.take().into();
                    (expr.clone(), expr)
                }
            };

            let right = AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: r_assign_target.try_into().unwrap(),
                right: right.take(),
            }
            .into();

            let op = match *op {
                op!("??=") => op!("??"),
                op!("&&=") => op!("&&"),
                op!("||=") => op!("||"),
                _ => unreachable!(),
            };

            *e = BinExpr {
                span: *span,
                op,
                left: left_expr,
                right,
            }
            .into();

            return true;
        }
        false
    }
}
