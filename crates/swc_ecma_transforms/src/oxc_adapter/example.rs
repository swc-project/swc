/// Example transformer demonstrating the VisitMutHook pattern.
///
/// This example shows how to create a simple transformer that works with
/// the OXC adapter infrastructure.
///
/// # Example: Constant Folding for Simple Binary Expressions
///
/// This transformer performs basic constant folding for numeric literals
/// in binary expressions:
///
/// ```js
/// // Before
/// const x = 1 + 2;
/// const y = 10 * 5;
///
/// // After
/// const x = 3;
/// const y = 50;
/// ```
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use super::TraverseCtx;

/// Example transformer that performs simple constant folding
pub struct ExampleConstantFolding;

impl VisitMutHook<TraverseCtx> for ExampleConstantFolding {
    fn enter_expr(&mut self, node: &mut Expr, _ctx: &mut TraverseCtx) {
        // Only transform binary expressions
        if let Expr::Bin(bin_expr) = node {
            // Check if both operands are numeric literals
            let left_num = match &*bin_expr.left {
                Expr::Lit(Lit::Num(n)) => Some(n.value),
                _ => None,
            };

            let right_num = match &*bin_expr.right {
                Expr::Lit(Lit::Num(n)) => Some(n.value),
                _ => None,
            };

            // If both are numbers, perform the operation
            if let (Some(left), Some(right)) = (left_num, right_num) {
                let result = match bin_expr.op {
                    BinaryOp::Add => Some(left + right),
                    BinaryOp::Sub => Some(left - right),
                    BinaryOp::Mul => Some(left * right),
                    BinaryOp::Div if right != 0.0 => Some(left / right),
                    _ => None,
                };

                // Replace the binary expression with the computed result
                if let Some(value) = result {
                    *node = Expr::Lit(Lit::Num(Number {
                        span: bin_expr.span,
                        value,
                        raw: None,
                    }));
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP;
    use swc_ecma_visit::VisitMut;

    use super::*;
    use crate::oxc_adapter::Transformer;

    fn num_lit(value: f64) -> Box<Expr> {
        Box::new(Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value,
            raw: None,
        })))
    }

    fn bin_expr(left: f64, op: BinaryOp, right: f64) -> Expr {
        Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op,
            left: num_lit(left),
            right: num_lit(right),
        })
    }

    #[test]
    fn test_constant_folding_addition() {
        let mut expr = bin_expr(1.0, BinaryOp::Add, 2.0);
        let mut transformer = Transformer::new(ExampleConstantFolding, TraverseCtx::new());

        transformer.visit_mut_expr(&mut expr);

        match expr {
            Expr::Lit(Lit::Num(n)) => assert_eq!(n.value, 3.0),
            _ => panic!("Expected numeric literal after constant folding"),
        }
    }

    #[test]
    fn test_constant_folding_multiplication() {
        let mut expr = bin_expr(10.0, BinaryOp::Mul, 5.0);
        let mut transformer = Transformer::new(ExampleConstantFolding, TraverseCtx::new());

        transformer.visit_mut_expr(&mut expr);

        match expr {
            Expr::Lit(Lit::Num(n)) => assert_eq!(n.value, 50.0),
            _ => panic!("Expected numeric literal after constant folding"),
        }
    }

    #[test]
    fn test_constant_folding_subtraction() {
        let mut expr = bin_expr(20.0, BinaryOp::Sub, 7.0);
        let mut transformer = Transformer::new(ExampleConstantFolding, TraverseCtx::new());

        transformer.visit_mut_expr(&mut expr);

        match expr {
            Expr::Lit(Lit::Num(n)) => assert_eq!(n.value, 13.0),
            _ => panic!("Expected numeric literal after constant folding"),
        }
    }

    #[test]
    fn test_constant_folding_division() {
        let mut expr = bin_expr(100.0, BinaryOp::Div, 4.0);
        let mut transformer = Transformer::new(ExampleConstantFolding, TraverseCtx::new());

        transformer.visit_mut_expr(&mut expr);

        match expr {
            Expr::Lit(Lit::Num(n)) => assert_eq!(n.value, 25.0),
            _ => panic!("Expected numeric literal after constant folding"),
        }
    }

    #[test]
    fn test_no_folding_for_non_literals() {
        // Create: x + 2
        let mut expr = Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::Add,
            left: Box::new(Expr::Ident(Ident::new(
                "x".into(),
                DUMMY_SP,
                Default::default(),
            ))),
            right: num_lit(2.0),
        });

        let mut transformer = Transformer::new(ExampleConstantFolding, TraverseCtx::new());
        transformer.visit_mut_expr(&mut expr);

        // Should remain as binary expression
        assert!(matches!(expr, Expr::Bin(_)));
    }
}
