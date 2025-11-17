//! Nullish coalescing operator transformation.
//!
//! Transforms the nullish coalescing operator (`??`) into conditional
//! expressions.
//!
//! # Examples
//!
//! ## Basic Usage
//!
//! Input:
//! ```js
//! x ?? "default"
//! ```
//!
//! Output:
//! ```js
//! x !== null && x !== void 0 ? x : "default"
//! ```
//!
//! ## Complex Expression
//!
//! Input:
//! ```js
//! foo.bar() ?? "default"
//! ```
//!
//! Output:
//! ```js
//! (_foo$bar = foo.bar()) !== null && _foo$bar !== void 0 ? _foo$bar : "default"
//! ```

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{VisitMut, VisitMutWith};

use crate::TransformCtx;

/// Nullish coalescing operator transformer.
pub struct NullishCoalescing {
    /// Counter for generating unique temporary variable names.
    temp_var_counter: usize,
}

impl NullishCoalescing {
    /// Creates a new nullish coalescing transformer.
    pub fn new() -> Self {
        Self {
            temp_var_counter: 0,
        }
    }

    /// Transforms a program, converting all nullish coalescing operators.
    pub fn transform_program(&mut self, program: &mut Program, _ctx: &mut TransformCtx) {
        program.visit_mut_with(self);
    }

    /// Generates a unique temporary variable name.
    fn generate_temp_var(&mut self) -> Ident {
        let name = format!("_ref{}", self.temp_var_counter);
        self.temp_var_counter += 1;
        Ident {
            span: DUMMY_SP,
            ctxt: Default::default(),
            sym: name.into(),
            optional: false,
        }
    }

    /// Creates a not-null check expression: `expr !== null && expr !== void 0`
    fn create_not_null_check(&self, expr: Box<Expr>) -> Box<Expr> {
        Box::new(Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::LogicalAnd,
            left: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::NotEqEq,
                left: expr.clone(),
                right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
            })),
            right: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::NotEqEq,
                left: expr,
                right: Box::new(Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: UnaryOp::Void,
                    arg: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 0.0,
                        raw: None,
                    }))),
                })),
            })),
        }))
    }

    /// Transforms a nullish coalescing expression.
    fn transform_nullish_coalescing(&mut self, left: Box<Expr>, right: Box<Expr>) -> Box<Expr> {
        // Check if we need a temporary variable for the left side
        let (test_expr, cons_expr) = if self.needs_temp_var(&left) {
            let temp_var = self.generate_temp_var();
            let temp_ident = Box::new(Expr::Ident(temp_var.clone()));

            // Create assignment: (_ref = left)
            let assign_expr = Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: AssignOp::Assign,
                left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent::from(temp_var))),
                right: left,
            }));

            (assign_expr, temp_ident)
        } else {
            (left.clone(), left)
        };

        // Create: (test) !== null && (test) !== void 0 ? cons : right
        Box::new(Expr::Cond(CondExpr {
            span: DUMMY_SP,
            test: self.create_not_null_check(test_expr),
            cons: cons_expr,
            alt: right,
        }))
    }

    /// Checks if an expression needs a temporary variable to avoid
    /// re-evaluation.
    fn needs_temp_var(&self, expr: &Expr) -> bool {
        !matches!(expr, Expr::Ident(_) | Expr::This(_) | Expr::Lit(_))
    }
}

impl Default for NullishCoalescing {
    fn default() -> Self {
        Self::new()
    }
}

impl VisitMut for NullishCoalescing {
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        // Visit children first
        expr.visit_mut_children_with(self);

        // Transform nullish coalescing expressions
        if let Expr::Bin(bin_expr) = expr {
            if bin_expr.op == BinaryOp::NullishCoalescing {
                *expr = *self
                    .transform_nullish_coalescing(bin_expr.left.clone(), bin_expr.right.clone());
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use std::{io, path::PathBuf, sync::Arc};

    use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap};

    use super::*;
    use crate::TransformCtx;

    fn create_test_ctx() -> TransformCtx {
        let source_map_lrc = Lrc::new(SourceMap::default());
        let source_file =
            source_map_lrc.new_source_file(Lrc::new(FileName::Anon), "const x = 1;".to_string());

        let handler = Lrc::new(Handler::with_emitter_writer(
            Box::new(io::sink()),
            Some(source_map_lrc.clone()),
        ));

        TransformCtx::new(
            PathBuf::from("test.js"),
            Arc::new(source_file.src.to_string()),
            source_map_lrc.clone(),
            handler,
        )
    }

    #[test]
    fn test_nullish_coalescing_creation() {
        let transformer = NullishCoalescing::new();
        assert_eq!(transformer.temp_var_counter, 0);
    }

    #[test]
    fn test_needs_temp_var() {
        let transformer = NullishCoalescing::new();

        // Identifiers don't need temp vars
        let ident = Expr::Ident(Ident {
            span: DUMMY_SP,
            ctxt: Default::default(),
            sym: "foo".into(),
            optional: false,
        });
        assert!(!transformer.needs_temp_var(&ident));

        // This doesn't need temp var
        let this_expr = Expr::This(ThisExpr { span: DUMMY_SP });
        assert!(!transformer.needs_temp_var(&this_expr));

        // Member expressions need temp vars
        let member = Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(ident.clone()),
            prop: MemberProp::Ident(IdentName {
                span: DUMMY_SP,
                sym: "bar".into(),
            }),
        });
        assert!(transformer.needs_temp_var(&member));
    }

    #[test]
    fn test_create_not_null_check() {
        let transformer = NullishCoalescing::new();
        let ident = Box::new(Expr::Ident(Ident {
            span: DUMMY_SP,
            ctxt: Default::default(),
            sym: "foo".into(),
            optional: false,
        }));

        let check = transformer.create_not_null_check(ident);

        // Should be a binary AND expression
        if let Expr::Bin(bin_expr) = *check {
            assert_eq!(bin_expr.op, BinaryOp::LogicalAnd);
        } else {
            panic!("Expected binary expression");
        }
    }

    #[test]
    fn test_transform_program() {
        let mut transformer = NullishCoalescing::new();
        let mut ctx = create_test_ctx();

        let mut program = Program::Module(Module {
            span: DUMMY_SP,
            body: vec![],
            shebang: None,
        });

        transformer.transform_program(&mut program, &mut ctx);
        // Should not panic
    }

    #[test]
    fn test_transform_simple_nullish_coalescing() {
        let mut transformer = NullishCoalescing::new();

        // Create: x ?? "default"
        let left = Box::new(Expr::Ident(Ident {
            span: DUMMY_SP,
            ctxt: Default::default(),
            sym: "x".into(),
            optional: false,
        }));

        let right = Box::new(Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: "default".into(),
            raw: None,
        })));

        let result = transformer.transform_nullish_coalescing(left, right);

        // Should be a conditional expression
        if let Expr::Cond(_) = *result {
            // Success
        } else {
            panic!("Expected conditional expression");
        }
    }
}
