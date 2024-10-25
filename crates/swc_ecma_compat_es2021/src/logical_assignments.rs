use std::mem;

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_utils::{alias_ident_for, prepend_stmt};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub fn logical_assignments() -> impl Pass {
    visit_mut_pass(Operators::default())
}

#[derive(Debug, Default)]
struct Operators {
    vars: Vec<VarDeclarator>,
}

impl Operators {
    fn memorize_prop(&mut self, c: ComputedPropName) -> (ComputedPropName, ComputedPropName) {
        let alias = alias_ident_for(&c.expr, "_ref");
        self.vars.push(VarDeclarator {
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
}

#[swc_trace]
impl Parallel for Operators {
    fn create(&self) -> Self {
        Default::default()
    }

    fn merge(&mut self, other: Self) {
        self.vars.extend(other.vars);
    }
}

#[swc_trace]
impl VisitMut for Operators {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

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
                    let (left, right) = self.memorize_prop(c.take());

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
                            self.vars.push(VarDeclarator {
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
                            let (left, right) = self.memorize_prop(c);
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
        }
    }

    /// [swc_ecma_ast::ModuleItem] is the top level Item in the current
    /// implementation of JavaScript until the proposal for
    /// [module-declarations] and [module-expressions] are officially added.
    ///
    /// [module declarations]: https://github.com/tc39/proposal-module-declarations.
    /// [module-expressions]: https://github.com/tc39/proposal-module-expressions
    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let vars = self.vars.take();
        n.visit_mut_children_with(self);

        let vars = mem::replace(&mut self.vars, vars);
        if !vars.is_empty() {
            prepend_stmt(
                n,
                VarDecl {
                    kind: VarDeclKind::Var,
                    decls: vars,
                    ..Default::default()
                }
                .into(),
            )
        }
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        let vars = self.vars.take();
        n.visit_mut_children_with(self);

        let vars = mem::replace(&mut self.vars, vars);
        if !vars.is_empty() {
            prepend_stmt(
                n,
                VarDecl {
                    kind: VarDeclKind::Var,
                    decls: vars,
                    ..Default::default()
                }
                .into(),
            )
        }
    }
}
