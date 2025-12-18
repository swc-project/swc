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

use crate::{utils, TraverseCtx};

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    ExponentiationOperatorPass
}

struct ExponentiationOperatorPass;

impl VisitMutHook<TraverseCtx> for ExponentiationOperatorPass {
    fn enter_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
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

                self.transform_exp_assign(expr, ctx);
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
    fn transform_exp_assign(&self, expr: &mut Expr, ctx: &mut TraverseCtx) {
        let Expr::Assign(assign_expr) = expr else {
            return;
        };

        match &mut assign_expr.left {
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
                let obj = member_expr.obj.take();
                let prop = member_expr.prop.take();
                let right = assign_expr.right.take();

                self.transform_member_exp_assign_impl(expr, ctx, obj, prop, right);
            }
            _ => {}
        }
    }

    /// Transform member expression exponentiation assignment implementation
    ///
    /// Uses temporary variables to avoid side effects:
    /// - `obj.prop **= 2` -> `(_obj = obj, _obj.prop = Math.pow(_obj.prop, 2))`
    /// - `obj[prop] **= 2` -> `(_obj = obj, _prop = prop, _obj[_prop] =
    ///   Math.pow(_obj[_prop], 2))`
    fn transform_member_exp_assign_impl(
        &self,
        expr: &mut Expr,
        ctx: &mut TraverseCtx,
        obj: Box<Expr>,
        prop: MemberProp,
        right: Box<Expr>,
    ) {
        // Check if we need a temp variable for the object
        let needs_obj_temp = !matches!(*obj, Expr::Ident(_));

        let mut sequence_exprs = Vec::new();

        // Create temp variable for object if needed
        let (final_obj, obj_for_pow) = if needs_obj_temp {
            let temp_name = utils::generate_temp_var_name(&obj);
            let temp_ident = utils::create_private_ident(&temp_name);

            // Add variable declaration
            ctx.var_declarations
                .insert_var(temp_ident.clone().into(), None);

            // Add assignment to sequence: _obj = obj
            sequence_exprs.push(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: AssignOp::Assign,
                left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                    id: temp_ident.clone(),
                    type_ann: None,
                })),
                right: obj,
            }));

            let obj_expr = Box::new(Expr::Ident(temp_ident.clone()));
            (obj_expr.clone(), obj_expr)
        } else {
            (obj.clone(), obj)
        };

        match prop {
            // obj.prop **= right -> (_obj = obj, _obj.prop = Math.pow(_obj.prop, right))
            MemberProp::Ident(prop_name) => {
                // Create Math.pow(obj.prop, right)
                let pow_left = Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: obj_for_pow,
                    prop: MemberProp::Ident(prop_name.clone()),
                }));
                let pow_call = create_math_pow(pow_left, right);

                // obj.prop = Math.pow(obj.prop, right)
                let assignment = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: final_obj,
                        prop: MemberProp::Ident(prop_name),
                    })),
                    right: Box::new(pow_call),
                });

                if needs_obj_temp {
                    sequence_exprs.push(assignment);
                    *expr = Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs: sequence_exprs.into_iter().map(Box::new).collect(),
                    });
                } else {
                    *expr = assignment;
                }
            }
            // obj[computed] **= right -> (_obj = obj, _prop = prop, _obj[_prop] =
            // Math.pow(_obj[_prop], right))
            MemberProp::Computed(computed) => {
                let computed_prop = computed.expr;

                // Check if we need a temp variable for the computed property
                let needs_prop_temp = !is_literal_expr(&computed_prop);

                let (final_prop, prop_for_pow) = if needs_prop_temp {
                    let temp_name = match &*computed_prop {
                        Expr::Ident(ident) => format!("_{}", ident.sym),
                        _ => "_prop".to_string(),
                    };
                    let temp_ident = utils::create_private_ident(&temp_name);

                    // Add variable declaration
                    ctx.var_declarations
                        .insert_var(temp_ident.clone().into(), None);

                    // Add assignment to sequence: _prop = prop
                    sequence_exprs.push(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: AssignOp::Assign,
                        left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                            id: temp_ident.clone(),
                            type_ann: None,
                        })),
                        right: computed_prop,
                    }));

                    let prop_expr = Box::new(Expr::Ident(temp_ident.clone()));
                    (prop_expr.clone(), prop_expr)
                } else {
                    (computed_prop.clone(), computed_prop)
                };

                // Create Math.pow(obj[computed], right)
                let pow_left = Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: obj_for_pow,
                    prop: MemberProp::Computed(ComputedPropName {
                        span: DUMMY_SP,
                        expr: prop_for_pow,
                    }),
                }));
                let pow_call = create_math_pow(pow_left, right);

                // obj[computed] = Math.pow(obj[computed], right)
                let assignment = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: final_obj,
                        prop: MemberProp::Computed(ComputedPropName {
                            span: DUMMY_SP,
                            expr: final_prop,
                        }),
                    })),
                    right: Box::new(pow_call),
                });

                if needs_obj_temp || needs_prop_temp {
                    sequence_exprs.push(assignment);
                    *expr = Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs: sequence_exprs.into_iter().map(Box::new).collect(),
                    });
                } else {
                    *expr = assignment;
                }
            }
            _ => {}
        }
    }
}

/// Check if an expression is a literal (and safe to evaluate multiple times)
fn is_literal_expr(expr: &Expr) -> bool {
    matches!(
        expr,
        Expr::Lit(_) | Expr::Ident(_) | Expr::This(_) | Expr::PrivateName(_)
    )
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
