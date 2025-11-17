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
//! ```
//!
//! Output:
//! ```js
//! let x = Math.pow(10, 2);
//! x = Math.pow(x, 3);
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-exponentiation-operator](https://babel.dev/docs/babel-plugin-transform-exponentiation-operator).
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/blob/v7.26.2/packages/babel-plugin-transform-exponentiation-operator>
//! * Exponentiation operator TC39 proposal: <https://github.com/tc39/proposal-exponentiation-operator>
//! * Exponentiation operator specification: <https://tc39.es/ecma262/#sec-exp-operator>

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TransformCtx;

/// Hook for transforming exponentiation operators to Math.pow calls.
pub struct ExponentiationOperator;

impl ExponentiationOperator {
    /// Creates a new exponentiation operator transform hook.
    pub fn new() -> Self {
        Self
    }
}

impl Default for ExponentiationOperator {
    fn default() -> Self {
        Self::new()
    }
}

impl VisitMutHook<TransformCtx> for ExponentiationOperator {
    // Note: Do not transform to `Math.pow` with BigInt arguments - that's a runtime
    // error
    fn enter_expr(&mut self, expr: &mut Expr, _ctx: &mut TransformCtx) {
        match expr {
            // `left ** right`
            Expr::Bin(bin_expr) if bin_expr.op == BinaryOp::Exp => {
                // Don't transform if either operand is a BigInt literal
                if is_big_int_literal(&bin_expr.left) || is_big_int_literal(&bin_expr.right) {
                    return;
                }

                let left = bin_expr.left.take();
                let right = bin_expr.right.take();
                *expr = math_pow(left, right);
            }
            // `left **= right`
            Expr::Assign(assign_expr) if assign_expr.op == AssignOp::ExpAssign => {
                // Don't transform if right operand is a BigInt literal
                if is_big_int_literal(&assign_expr.right) {
                    return;
                }

                // For simplicity, we'll only handle simple identifier assignments
                // More complex cases (member expressions) would require careful
                // handling of side effects which is complex in SWC's AST
                if matches!(
                    assign_expr.left,
                    AssignTarget::Simple(SimpleAssignTarget::Ident(_))
                ) {
                    convert_identifier_assignment(assign_expr);
                }
            }
            _ => {}
        }
    }
}

/// Checks if an expression is a BigInt literal.
fn is_big_int_literal(expr: &Expr) -> bool {
    matches!(expr, Expr::Lit(Lit::BigInt(_)))
}

/// Creates a `Math.pow(left, right)` call expression.
fn math_pow(left: Box<Expr>, right: Box<Expr>) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        ctxt: Default::default(),
        callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(Expr::Ident(Ident::new(
                "Math".into(),
                DUMMY_SP,
                Default::default(),
            ))),
            prop: MemberProp::Ident(IdentName::new("pow".into(), DUMMY_SP)),
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

/// Convert `AssignmentExpression` where assignee is an identifier.
///
/// `left **= right` transformed to:
/// - `left = Math.pow(left, right)`
fn convert_identifier_assignment(assign_expr: &mut AssignExpr) {
    let AssignTarget::Simple(SimpleAssignTarget::Ident(ident)) = &assign_expr.left else {
        unreachable!()
    };

    // Create `Math.pow(left, right)` where left is a clone of the identifier
    let pow_left = Box::new(Expr::Ident(ident.id.clone()));
    let pow_right = assign_expr.right.take();

    assign_expr.right = Box::new(math_pow(pow_left, pow_right));
    assign_expr.op = AssignOp::Assign;
}

#[cfg(test)]
mod tests {
    use swc_ecma_visit::{VisitMut, VisitMutWith};

    use super::*;

    struct TestVisitor {
        hook: ExponentiationOperator,
        ctx: TransformCtx,
    }

    impl VisitMut for TestVisitor {
        fn visit_mut_expr(&mut self, n: &mut Expr) {
            self.hook.enter_expr(n, &mut self.ctx);
            n.visit_mut_children_with(self);
        }
    }

    fn create_test_ctx() -> TransformCtx {
        use std::{io, path::PathBuf, sync::Arc};

        use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap};

        let source_map_lrc = Lrc::new(SourceMap::default());
        let source_file =
            source_map_lrc.new_source_file(Lrc::new(FileName::Anon), "test".to_string());

        let handler = Lrc::new(Handler::with_emitter_writer(
            Box::new(io::sink()),
            Some(source_map_lrc.clone()),
        ));

        TransformCtx::new(
            PathBuf::from("test.js"),
            Arc::new(source_file.src.to_string()),
            source_map_lrc,
            handler,
        )
    }

    #[test]
    fn test_binary_exponentiation() {
        let mut expr = Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::Exp,
            left: Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 2.0,
                raw: None,
            }))),
            right: Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 3.0,
                raw: None,
            }))),
        });

        let mut visitor = TestVisitor {
            hook: ExponentiationOperator::new(),
            ctx: create_test_ctx(),
        };

        visitor.visit_mut_expr(&mut expr);

        // Should be transformed to Math.pow(2, 3)
        assert!(matches!(expr, Expr::Call(_)));
    }

    #[test]
    fn test_assign_exponentiation_ident() {
        let mut expr = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::ExpAssign,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(
                Ident::new("x".into(), DUMMY_SP, Default::default()).into(),
            )),
            right: Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 2.0,
                raw: None,
            }))),
        });

        let mut visitor = TestVisitor {
            hook: ExponentiationOperator::new(),
            ctx: create_test_ctx(),
        };

        visitor.visit_mut_expr(&mut expr);

        // Should be transformed to x = Math.pow(x, 2)
        if let Expr::Assign(assign) = expr {
            assert_eq!(assign.op, AssignOp::Assign);
            assert!(matches!(*assign.right, Expr::Call(_)));
        } else {
            panic!("Expected assignment expression");
        }
    }

    // Note: BigInt test omitted to avoid adding num_bigint dependency.
    // The BigInt check is still present in the implementation.
}
