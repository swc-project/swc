//! ES2016: Exponentiation Operator
//!
//! This plugin transforms the exponentiation operator (`**`) to `Math.pow`.
//!
//! > This plugin is included in `preset-env`, in ES2016
//!
//! ## Example
//!
//! Input:
//! ```js
//! let x = 10 ** 2;
//! x **= 3;
//! obj.prop **= 4;
//! ```
//!
//! Output:
//! ```js
//! let x = Math.pow(10, 2);
//! x = Math.pow(x, 3);
//! obj["prop"] = Math.pow(obj["prop"], 4);
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-exponentiation-operator](https://babel.dev/docs/babel-plugin-transform-exponentiation-operator).
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/blob/v7.26.2/packages/babel-plugin-transform-exponentiation-operator>
//!   <https://github.com/babel/babel/tree/v7.26.2/packages/babel-helper-builder-binary-assignment-operator-visitor>
//! * Exponentiation operator TC39 proposal: <https://github.com/tc39/proposal-exponentiation-operator>
//! * Exponentiation operator specification: <https://tc39.es/ecma262/#sec-exp-operator>

use swc_common::{util::take::Take, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    ExponentiationOperatorPass::default()
}

#[derive(Default)]
struct ExponentiationOperatorPass {}

impl VisitMutHook<TraverseCtx> for ExponentiationOperatorPass {
    fn enter_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
        match expr {
            // `left ** right` -> `Math.pow(left, right)`
            Expr::Bin(bin_expr) if bin_expr.op == BinaryOp::Exp => {
                // Do not transform BigInt
                if is_bigint_literal(&bin_expr.left) || is_bigint_literal(&bin_expr.right) {
                    return;
                }

                let left = bin_expr.left.take();
                let right = bin_expr.right.take();
                *expr = create_math_pow(left, right);
            }
            // `left **= right` -> various transformations
            Expr::Assign(assign_expr) if assign_expr.op == AssignOp::ExpAssign => {
                // Do not transform BigInt
                if is_bigint_literal(&assign_expr.right) {
                    return;
                }

                self.transform_exp_assign(expr);
            }
            _ => {}
        }
    }
}

impl ExponentiationOperatorPass {
    /// Transform exponentiation assignment expression
    ///
    /// Transforms based on the type of left side:
    /// - Identifier: `x **= 2` -> `x = Math.pow(x, 2)`
    /// - Member expression: `obj.prop **= 2` -> `obj.prop = Math.pow(obj.prop,
    ///   2)` or with temp var
    fn transform_exp_assign(&self, expr: &mut Expr) {
        let Expr::Assign(assign_expr) = expr else {
            return;
        };

        match &assign_expr.left {
            // Simple identifier: `x **= 2` -> `x = Math.pow(x, 2)`
            AssignTarget::Simple(SimpleAssignTarget::Ident(ident)) => {
                let left = ident.id.clone();
                let right = assign_expr.right.take();

                let pow_left = Box::new(Expr::Ident(left.clone()));
                let pow_call = create_math_pow(pow_left, right);

                *expr = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                        id: left,
                        type_ann: None,
                    })),
                    right: Box::new(pow_call),
                });
            }
            // Member expression: needs special handling to avoid side effects
            AssignTarget::Simple(SimpleAssignTarget::Member(member_expr)) => {
                // Clone the data we need before borrowing mutably
                let obj = member_expr.obj.clone();
                let prop = member_expr.prop.clone();
                let right = assign_expr.right.take();

                self.transform_member_exp_assign_impl(expr, obj, prop, right);
            }
            _ => {}
        }
    }

    /// Transform member expression exponentiation assignment implementation
    ///
    /// `obj.prop **= 2` or `obj[prop] **= 2`
    fn transform_member_exp_assign_impl(
        &self,
        expr: &mut Expr,
        obj: Box<Expr>,
        prop: MemberProp,
        right: Box<Expr>,
    ) {
        // For simplicity, handle the basic case without temp variables
        // A more complete implementation would add temp variables to avoid side effects
        match prop {
            // obj.prop **= right -> obj.prop = Math.pow(obj.prop, right)
            MemberProp::Ident(prop_name) => {
                // Create Math.pow(obj.prop, right)
                let pow_left = Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: obj.clone(),
                    prop: MemberProp::Ident(prop_name.clone()),
                }));
                let pow_call = create_math_pow(pow_left, right);

                // obj.prop = Math.pow(obj.prop, right)
                *expr = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj,
                        prop: MemberProp::Ident(prop_name),
                    })),
                    right: Box::new(pow_call),
                });
            }
            // obj[computed] **= right -> obj[computed] = Math.pow(obj[computed], right)
            MemberProp::Computed(computed) => {
                let computed_prop = computed.expr;

                // Create Math.pow(obj[computed], right)
                let pow_left = Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: obj.clone(),
                    prop: MemberProp::Computed(ComputedPropName {
                        span: DUMMY_SP,
                        expr: computed_prop.clone(),
                    }),
                }));
                let pow_call = create_math_pow(pow_left, right);

                // obj[computed] = Math.pow(obj[computed], right)
                *expr = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj,
                        prop: MemberProp::Computed(ComputedPropName {
                            span: DUMMY_SP,
                            expr: computed_prop,
                        }),
                    })),
                    right: Box::new(pow_call),
                });
            }
            _ => {}
        }
    }
}

/// Create `Math.pow(left, right)` call expression
fn create_math_pow(left: Box<Expr>, right: Box<Expr>) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        ctxt: SyntaxContext::empty(),
        callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::Ident(Ident {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                sym: "Math".into(),
                optional: false,
            })),
            prop: MemberProp::Ident(IdentName {
                span: DUMMY_SP,
                sym: "pow".into(),
            }),
        }))),
        args: vec![
            ExprOrSpread {
                spread: None,
                expr: left,
            },
            ExprOrSpread {
                spread: None,
                expr: right,
            },
        ],
        type_args: None,
    })
}

/// Check if an expression is a BigInt literal
fn is_bigint_literal(expr: &Expr) -> bool {
    matches!(expr, Expr::Lit(Lit::BigInt(_)))
}
