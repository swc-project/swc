//! ES2021: Logical Assignment Operators
//!
//! This plugin transforms logical assignment operators (`&&=`, `||=`, `??=`)
//! to a series of logical expressions.
//!
//! > This plugin is included in `preset-env`, in ES2021
//!
//! ## Example
//!
//! Input:
//! ```js
//! a ||= b;
//! obj.a.b ||= c;
//!
//! a &&= b;
//! obj.a.b &&= c;
//! ```
//!
//! Output:
//! ```js
//! var _obj$a, _obj$a2;
//!
//! a || (a = b);
//! (_obj$a = obj.a).b || (_obj$a.b = c);
//!
//! a && (a = b);
//! (_obj$a2 = obj.a).b && (_obj$a2.b = c);
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-logical-assignment-operators](https://babel.dev/docs/babel-plugin-transform-logical-assignment-operators).
//!
//! ## References:
//! * Babel plugin implementation: <https://github.com/babel/babel/tree/v7.26.2/packages/babel-plugin-transform-logical-assignment-operators>
//! * Logical Assignment TC39 proposal: <https://github.com/tc39/proposal-logical-assignment>

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::alias_ident_for;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    LogicalAssignmentOperatorsPass
}

struct LogicalAssignmentOperatorsPass;

impl VisitMutHook<TraverseCtx> for LogicalAssignmentOperatorsPass {
    fn enter_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
        let Expr::Assign(assign_expr) = expr else {
            return;
        };

        // Check if this is a logical assignment operator
        let op = match assign_expr.op {
            AssignOp::AndAssign => BinaryOp::LogicalAnd,
            AssignOp::OrAssign => BinaryOp::LogicalOr,
            AssignOp::NullishAssign => BinaryOp::NullishCoalescing,
            _ => return,
        };

        // Only handle simple assignment targets
        let AssignTarget::Simple(left) = &mut assign_expr.left else {
            return;
        };

        let span = assign_expr.span;

        // Generate left expression and assignment target
        let (left_expr, assign_target) = match left {
            // `a &&= c` -> `a && (a = c)`
            SimpleAssignTarget::Ident(ident) => {
                let left_expr = Box::new(Expr::Ident(ident.id.clone()));
                let assign_target = left.clone();
                (left_expr, assign_target)
            }

            // `a.b &&= c` -> `var _a; (_a = a).b && (_a.b = c)`
            SimpleAssignTarget::Member(member_expr) => {
                self.transform_member_expression(member_expr, ctx)
            }

            // `super.prop &&= c` -> handle super property
            SimpleAssignTarget::SuperProp(super_prop_expr) => {
                self.transform_super_prop(super_prop_expr, ctx)
            }

            // Other cases like optional member expressions
            _ => {
                let left_expr: Box<Expr> = left.clone().into();
                (left_expr.clone(), left.clone())
            }
        };

        // Create assignment: `assign_target = right`
        let assignment = Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::Assign,
            left: AssignTarget::Simple(assign_target),
            right: assign_expr.right.take(),
        }));

        // Create binary expression: `left_expr op assignment`
        *expr = Expr::Bin(BinExpr {
            span,
            op,
            left: left_expr,
            right: assignment,
        });
    }
}

impl LogicalAssignmentOperatorsPass {
    fn transform_member_expression(
        &mut self,
        member_expr: &mut MemberExpr,
        ctx: &mut TraverseCtx,
    ) -> (Box<Expr>, SimpleAssignTarget) {
        // Handle object: create temp var unless it's `this`
        let (left_obj, right_obj) = match &*member_expr.obj {
            // `this` doesn't need a temp var
            Expr::This(_) => (member_expr.obj.clone(), member_expr.obj.clone()),
            // For other expressions, create a temp var
            obj => {
                let alias = alias_ident_for(obj, "_ref");

                // Inject variable declaration
                self.inject_var_decl(&alias, ctx);

                let left_obj = Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                        id: alias.clone(),
                        type_ann: None,
                    })),
                    right: member_expr.obj.clone(),
                }));

                let right_obj = Box::new(Expr::Ident(alias));

                (left_obj, right_obj)
            }
        };

        // Handle property: create temp var for computed properties
        let (left_prop, right_prop) = match &member_expr.prop {
            MemberProp::Computed(computed) => {
                let alias = alias_ident_for(&computed.expr, "_ref");

                // Inject variable declaration
                self.inject_var_decl(&alias, ctx);

                let left_prop = MemberProp::Computed(ComputedPropName {
                    span: computed.span,
                    expr: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: AssignOp::Assign,
                        left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                            id: alias.clone(),
                            type_ann: None,
                        })),
                        right: computed.expr.clone(),
                    })),
                });

                let right_prop = MemberProp::Computed(ComputedPropName {
                    span: computed.span,
                    expr: Box::new(Expr::Ident(alias)),
                });

                (left_prop, right_prop)
            }
            // Static properties don't need temp vars
            prop => (prop.clone(), prop.clone()),
        };

        // Build left expression: `(_a = a).b` or `(_a = a)[_b = b]`
        let left_expr = Box::new(Expr::Member(MemberExpr {
            span: member_expr.span,
            obj: left_obj,
            prop: left_prop,
        }));

        // Build assignment target: `_a.b` or `_a[_b]`
        let assign_target = SimpleAssignTarget::Member(MemberExpr {
            span: member_expr.span,
            obj: right_obj,
            prop: right_prop,
        });

        (left_expr, assign_target)
    }

    fn transform_super_prop(
        &mut self,
        super_prop_expr: &mut SuperPropExpr,
        ctx: &mut TraverseCtx,
    ) -> (Box<Expr>, SimpleAssignTarget) {
        let (left_prop, right_prop) = match &super_prop_expr.prop {
            SuperProp::Computed(computed) => {
                let alias = alias_ident_for(&computed.expr, "_ref");

                // Inject variable declaration
                self.inject_var_decl(&alias, ctx);

                let left_prop = SuperProp::Computed(ComputedPropName {
                    span: computed.span,
                    expr: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: AssignOp::Assign,
                        left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                            id: alias.clone(),
                            type_ann: None,
                        })),
                        right: computed.expr.clone(),
                    })),
                });

                let right_prop = SuperProp::Computed(ComputedPropName {
                    span: computed.span,
                    expr: Box::new(Expr::Ident(alias)),
                });

                (left_prop, right_prop)
            }
            prop => (prop.clone(), prop.clone()),
        };

        let left_expr = Box::new(Expr::SuperProp(SuperPropExpr {
            span: super_prop_expr.span,
            obj: super_prop_expr.obj,
            prop: left_prop,
        }));

        let assign_target = SimpleAssignTarget::SuperProp(SuperPropExpr {
            span: super_prop_expr.span,
            obj: super_prop_expr.obj,
            prop: right_prop,
        });

        (left_expr, assign_target)
    }

    fn inject_var_decl(&mut self, ident: &Ident, ctx: &mut TraverseCtx) {
        ctx.var_declarations.insert_var(
            BindingIdent {
                id: ident.clone(),
                type_ann: None,
            },
            None,
        );
    }
}
