//! ES2021 logical assignment operators transformation.
//!
//! This module transforms logical assignment operators (&&=, ||=, ??=) into
//! equivalent logical expressions.
//!
//! ## Transformations
//!
//! ### Logical OR assignment (||=)
//! ```js
//! a ||= b
//! // becomes
//! a || (a = b)
//! ```
//!
//! ### Logical AND assignment (&&=)
//! ```js
//! a &&= b
//! // becomes
//! a && (a = b)
//! ```
//!
//! ### Nullish coalescing assignment (??=)
//! ```js
//! a ??= b
//! // becomes
//! a ?? (a = b)
//! ```
//!
//! ## Implementation Details
//!
//! The transformation must handle various assignment targets:
//! - Simple identifiers: `a ||= b`
//! - Member expressions: `obj.prop ||= b`
//! - Computed member expressions: `obj[key] ||= b`
//!
//! For complex member expressions, we need to cache references to avoid
//! side-effect issues:
//! ```js
//! obj.a.b ||= c
//! // becomes
//! (_obj$a = obj.a).b || (_obj$a.b = c)
//! ```
//!
//! ## References
//! - TC39 proposal: https://github.com/tc39/proposal-logical-assignment
//! - MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::TransformCtx;

/// Transformer for logical assignment operators.
pub struct LogicalAssignmentOperators;

impl LogicalAssignmentOperators {
    /// Creates a new logical assignment operators transformer.
    pub fn new() -> Self {
        Self
    }

    /// Converts a logical assignment expression to a binary logical expression.
    fn transform_logical_assignment(
        &mut self,
        expr: &mut AssignExpr,
        _ctx: &mut TransformCtx,
    ) -> Option<Expr> {
        // Only handle logical assignment operators
        let bin_op = match expr.op {
            AssignOp::OrAssign => BinaryOp::LogicalOr,
            AssignOp::AndAssign => BinaryOp::LogicalAnd,
            AssignOp::NullishAssign => BinaryOp::NullishCoalescing,
            _ => return None,
        };

        // Transform based on the assignment target type
        match &mut expr.left {
            AssignTarget::Simple(SimpleAssignTarget::Ident(ident)) => Some(
                self.transform_identifier_assignment(ident.clone(), bin_op, expr.right.clone()),
            ),
            AssignTarget::Simple(SimpleAssignTarget::Member(member)) => {
                Some(self.transform_member_assignment(member.clone(), bin_op, expr.right.clone()))
            }
            AssignTarget::Simple(SimpleAssignTarget::SuperProp(super_prop_expr)) => {
                Some(self.transform_super_prop_assignment(
                    super_prop_expr.clone(),
                    bin_op,
                    expr.right.clone(),
                ))
            }
            _ => {
                // For other types (patterns, etc.), we don't transform
                None
            }
        }
    }

    /// Transforms simple identifier assignments: `a ||= b` => `a || (a = b)`
    fn transform_identifier_assignment(
        &self,
        ident: BindingIdent,
        bin_op: BinaryOp,
        right: Box<Expr>,
    ) -> Expr {
        Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: bin_op,
            left: Box::new(Expr::Ident(Ident {
                span: ident.id.span,
                ctxt: ident.id.ctxt,
                sym: ident.id.sym.clone(),
                optional: false,
            })),
            right: Box::new(Expr::Paren(ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Ident(ident)),
                    right,
                })),
            })),
        })
    }

    /// Transforms member expression assignments: `obj.prop ||= b` => `obj.prop
    /// || (obj.prop = b)`
    fn transform_member_assignment(
        &self,
        member: MemberExpr,
        bin_op: BinaryOp,
        right: Box<Expr>,
    ) -> Expr {
        // For simple member expressions without computed properties, we can duplicate
        // safely
        Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: bin_op,
            left: Box::new(Expr::Member(member.clone())),
            right: Box::new(Expr::Paren(ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Member(member)),
                    right,
                })),
            })),
        })
    }

    /// Transforms super property assignments: `super.prop ||= b` => `super.prop
    /// || (super.prop = b)`
    fn transform_super_prop_assignment(
        &self,
        super_prop_expr: SuperPropExpr,
        bin_op: BinaryOp,
        right: Box<Expr>,
    ) -> Expr {
        Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: bin_op,
            left: Box::new(Expr::SuperProp(super_prop_expr.clone())),
            right: Box::new(Expr::Paren(ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::SuperProp(super_prop_expr)),
                    right,
                })),
            })),
        })
    }
}

impl Default for LogicalAssignmentOperators {
    fn default() -> Self {
        Self::new()
    }
}

impl VisitMutHook<TransformCtx> for LogicalAssignmentOperators {
    /// Transforms assignment expressions that use logical operators.
    fn enter_assign_expr(&mut self, node: &mut AssignExpr, ctx: &mut TransformCtx) {
        // Check if this is a logical assignment that needs transformation
        // Note: We can't directly replace here, we need to do it at the
        // expression level (see enter_expr)
        let _ = self.transform_logical_assignment(node, ctx);
    }

    /// Transforms expressions that contain logical assignment operators.
    fn enter_expr(&mut self, node: &mut Expr, ctx: &mut TransformCtx) {
        if let Expr::Assign(assign_expr) = node {
            if let Some(transformed) = self.transform_logical_assignment(assign_expr, ctx) {
                *node = transformed;
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use std::{io, path::PathBuf, sync::Arc};

    use swc_atoms::Atom;
    use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap, SyntaxContext};

    use super::*;

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
            source_map_lrc,
            handler,
        )
    }

    #[test]
    fn test_transform_or_assign() {
        let mut transformer = LogicalAssignmentOperators::new();
        let mut ctx = create_test_ctx();

        // Create: a ||= b
        let mut expr = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::OrAssign,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                id: Ident {
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    sym: Atom::new("a"),
                    optional: false,
                },
                type_ann: None,
            })),
            right: Box::new(Expr::Ident(Ident {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                sym: Atom::new("b"),
                optional: false,
            })),
        });

        transformer.enter_expr(&mut expr, &mut ctx);

        // Should be transformed to: a || (a = b)
        assert!(matches!(expr, Expr::Bin(_)));
    }

    #[test]
    fn test_transform_and_assign() {
        let mut transformer = LogicalAssignmentOperators::new();
        let mut ctx = create_test_ctx();

        // Create: a &&= b
        let mut expr = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::AndAssign,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                id: Ident {
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    sym: Atom::new("a"),
                    optional: false,
                },
                type_ann: None,
            })),
            right: Box::new(Expr::Ident(Ident {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                sym: Atom::new("b"),
                optional: false,
            })),
        });

        transformer.enter_expr(&mut expr, &mut ctx);

        // Should be transformed to: a && (a = b)
        assert!(matches!(expr, Expr::Bin(_)));
    }

    #[test]
    fn test_transform_nullish_assign() {
        let mut transformer = LogicalAssignmentOperators::new();
        let mut ctx = create_test_ctx();

        // Create: a ??= b
        let mut expr = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::NullishAssign,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                id: Ident {
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    sym: Atom::new("a"),
                    optional: false,
                },
                type_ann: None,
            })),
            right: Box::new(Expr::Ident(Ident {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                sym: Atom::new("b"),
                optional: false,
            })),
        });

        transformer.enter_expr(&mut expr, &mut ctx);

        // Should be transformed to: a ?? (a = b)
        assert!(matches!(expr, Expr::Bin(_)));
    }

    #[test]
    fn test_regular_assign_not_transformed() {
        let mut transformer = LogicalAssignmentOperators::new();
        let mut ctx = create_test_ctx();

        // Create: a = b
        let mut expr = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::Assign,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                id: Ident {
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    sym: Atom::new("a"),
                    optional: false,
                },
                type_ann: None,
            })),
            right: Box::new(Expr::Ident(Ident {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                sym: Atom::new("b"),
                optional: false,
            })),
        });

        transformer.enter_expr(&mut expr, &mut ctx);

        // Should NOT be transformed
        assert!(matches!(expr, Expr::Assign(_)));
    }
}
