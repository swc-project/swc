//! ES2021 (ES12) syntax transformations.
//!
//! This module implements transformations for ECMAScript 2021 features,
//! including:
//!
//! - **Logical assignment operators** (`&&=`, `||=`, `??=`)
//! - **Numeric separators** (removing underscores from numeric literals)
//!
//! # Usage
//!
//! ```ignore
//! use swc_ecma_transformer::es2021::{ES2021, ES2021Options};
//! use swc_ecma_hooks::VisitMutHook;
//!
//! let options = ES2021Options::all();
//! let mut transformer = ES2021::new(options, &ctx);
//!
//! // Apply transformations
//! transformer.enter_expr(&mut expr, &mut ctx);
//! ```
//!
//! # ES2021 Features
//!
//! ## Logical Assignment Operators
//!
//! Transforms logical assignment operators into equivalent logical expressions:
//!
//! ```js
//! a ||= b   // a || (a = b)
//! a &&= b   // a && (a = b)
//! a ??= b   // a ?? (a = b)
//! ```
//!
//! ## Numeric Separators
//!
//! Removes underscores from numeric literals:
//!
//! ```js
//! 1_000_000        // 1000000
//! 0b1010_0001      // 0b10100001
//! 0xDEAD_BEEF      // 0xDEADBEEF
//! ```
//!
//! # References
//!
//! - [ES2021 Specification](https://262.ecma-international.org/12.0/)
//! - [Logical Assignment Proposal](https://github.com/tc39/proposal-logical-assignment)
//! - [Numeric Separators Proposal](https://github.com/tc39/proposal-numeric-separator)

mod logical_assignment_operators;
mod numeric_separators;
mod options;

pub use logical_assignment_operators::LogicalAssignmentOperators;
pub use numeric_separators::NumericSeparators;
pub use options::ES2021Options;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::TransformCtx;

/// ES2021 transformer.
///
/// This struct orchestrates all ES2021 transformations based on the provided
/// options. It implements the [`VisitMutHook`] trait to integrate with the
/// SWC transformer architecture.
pub struct ES2021 {
    options: ES2021Options,
    logical_assignment_operators: LogicalAssignmentOperators,
    numeric_separators: NumericSeparators,
}

impl ES2021 {
    /// Creates a new ES2021 transformer with the given options.
    ///
    /// # Arguments
    ///
    /// * `options` - Configuration controlling which ES2021 transforms are
    ///   enabled
    ///
    /// # Example
    ///
    /// ```ignore
    /// use swc_ecma_transformer::es2021::{ES2021, ES2021Options};
    ///
    /// let options = ES2021Options::all();
    /// let transformer = ES2021::new(options);
    /// ```
    pub fn new(options: ES2021Options) -> Self {
        Self {
            options,
            logical_assignment_operators: LogicalAssignmentOperators::new(),
            numeric_separators: NumericSeparators::new(),
        }
    }
}

impl VisitMutHook<TransformCtx> for ES2021 {
    /// Transforms expressions, applying logical assignment operator
    /// transformation if enabled.
    fn enter_expr(&mut self, node: &mut Expr, ctx: &mut TransformCtx) {
        if self.options.logical_assignment_operators {
            self.logical_assignment_operators.enter_expr(node, ctx);
        }
    }

    /// Transforms assignment expressions, applying logical assignment operator
    /// transformation if enabled.
    fn enter_assign_expr(&mut self, node: &mut AssignExpr, ctx: &mut TransformCtx) {
        if self.options.logical_assignment_operators {
            self.logical_assignment_operators
                .enter_assign_expr(node, ctx);
        }
    }

    /// Transforms numeric literals, removing separators if enabled.
    fn enter_number(&mut self, node: &mut Number, ctx: &mut TransformCtx) {
        if self.options.numeric_separators {
            self.numeric_separators.enter_number(node, ctx);
        }
    }

    /// Transforms BigInt literals, removing separators if enabled.
    fn enter_big_int(&mut self, node: &mut BigInt, ctx: &mut TransformCtx) {
        if self.options.numeric_separators {
            self.numeric_separators.enter_big_int(node, ctx);
        }
    }
}

#[cfg(test)]
mod tests {
    use std::{io, path::PathBuf, sync::Arc};

    use swc_atoms::Atom;
    use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap, DUMMY_SP};

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
    fn test_es2021_options_all() {
        let options = ES2021Options::all();
        assert!(options.logical_assignment_operators);
        assert!(options.numeric_separators);
    }

    #[test]
    fn test_es2021_options_none() {
        let options = ES2021Options::none();
        assert!(!options.logical_assignment_operators);
        assert!(!options.numeric_separators);
    }

    #[test]
    fn test_es2021_transformer_creation() {
        let options = ES2021Options::all();
        let _transformer = ES2021::new(options);
    }

    #[test]
    fn test_logical_assignment_transform() {
        let mut transformer = ES2021::new(ES2021Options::all());
        let mut ctx = create_test_ctx();

        // Create: a ||= b
        let mut expr = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::OrAssign,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                id: Ident {
                    span: DUMMY_SP,
                    ctxt: swc_common::SyntaxContext::empty(),
                    sym: Atom::new("a"),
                    optional: false,
                },
                type_ann: None,
            })),
            right: Box::new(Expr::Ident(Ident {
                span: DUMMY_SP,
                ctxt: swc_common::SyntaxContext::empty(),
                sym: Atom::new("b"),
                optional: false,
            })),
        });

        transformer.enter_expr(&mut expr, &mut ctx);

        // Should be transformed to a binary expression
        assert!(matches!(expr, Expr::Bin(_)));
    }

    #[test]
    fn test_numeric_separator_transform() {
        let mut transformer = ES2021::new(ES2021Options::all());
        let mut ctx = create_test_ctx();

        let mut number = Number {
            span: DUMMY_SP,
            value: 1000000.0,
            raw: Some(Atom::new("1_000_000")),
        };

        transformer.enter_number(&mut number, &mut ctx);

        assert_eq!(number.raw, Some(Atom::new("1000000")));
    }

    #[test]
    fn test_selective_transforms() {
        let options = ES2021Options {
            logical_assignment_operators: true,
            numeric_separators: false,
        };
        let mut transformer = ES2021::new(options);
        let mut ctx = create_test_ctx();

        // Logical assignment should be transformed
        let mut expr = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::OrAssign,
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                id: Ident {
                    span: DUMMY_SP,
                    ctxt: swc_common::SyntaxContext::empty(),
                    sym: Atom::new("a"),
                    optional: false,
                },
                type_ann: None,
            })),
            right: Box::new(Expr::Ident(Ident {
                span: DUMMY_SP,
                ctxt: swc_common::SyntaxContext::empty(),
                sym: Atom::new("b"),
                optional: false,
            })),
        });

        transformer.enter_expr(&mut expr, &mut ctx);
        assert!(matches!(expr, Expr::Bin(_)));

        // Numeric separator should NOT be transformed
        let mut number = Number {
            span: DUMMY_SP,
            value: 1000000.0,
            raw: Some(Atom::new("1_000_000")),
        };

        transformer.enter_number(&mut number, &mut ctx);
        assert_eq!(number.raw, Some(Atom::new("1_000_000"))); // Unchanged
    }
}
