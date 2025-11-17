//! ES2019 transformations.
//!
//! This module provides transformations for ES2019 features to make them
//! compatible with older JavaScript environments.
//!
//! ## Features
//!
//! - **Optional catch binding**: Transforms catch clauses without parameters
//! - **JSON superset**: Handles U+2028 and U+2029 in string literals (handled
//!   by parser)
//!
//! ## Example
//!
//! ```ignore
//! use swc_ecma_transformer::es2019::{ES2019, ES2019Options};
//! use swc_ecma_visit::VisitMutWith;
//!
//! let options = ES2019Options::new();
//! let ctx = /* create TransformCtx */;
//! let mut transform = ES2019::new(options, ctx);
//! program.visit_mut_with(&mut transform);
//! ```

mod json_superset;
mod optional_catch_binding;
mod options;

pub use json_superset::JsonSuperset;
pub use optional_catch_binding::OptionalCatchBinding;
pub use options::ES2019Options;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::{VisitMut, VisitMutWith};

use crate::TransformCtx;

/// ES2019 transformer.
///
/// This struct orchestrates all ES2019 transformations based on the provided
/// options.
pub struct ES2019 {
    options: ES2019Options,
    optional_catch_binding: Option<OptionalCatchBinding>,
    #[allow(dead_code)]
    json_superset: Option<JsonSuperset>,
}

impl ES2019 {
    /// Creates a new ES2019 transformer with the given options.
    pub fn new(options: ES2019Options) -> Self {
        let optional_catch_binding = if options.optional_catch_binding {
            Some(OptionalCatchBinding::new())
        } else {
            None
        };

        let json_superset = if options.json_superset {
            Some(JsonSuperset::new())
        } else {
            None
        };

        Self {
            options,
            optional_catch_binding,
            json_superset,
        }
    }

    /// Returns the options used by this transformer.
    pub fn options(&self) -> &ES2019Options {
        &self.options
    }
}

impl Default for ES2019 {
    fn default() -> Self {
        Self::new(ES2019Options::default())
    }
}

impl VisitMutHook<TransformCtx> for ES2019 {
    // Hook methods if needed in the future
}

impl VisitMut for ES2019 {
    fn visit_mut_program(&mut self, n: &mut Program) {
        // Visit children with enabled transformations
        n.visit_mut_children_with(self);
    }

    fn visit_mut_catch_clause(&mut self, clause: &mut CatchClause) {
        // Apply optional catch binding transformation if enabled
        if let Some(transform) = &mut self.optional_catch_binding {
            transform.visit_mut_catch_clause(clause);
        } else {
            // Still need to visit children
            clause.visit_mut_children_with(self);
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_visit::VisitMutWith;

    use super::*;

    #[test]
    fn test_es2019_creation() {
        let options = ES2019Options::new();
        let _transform = ES2019::new(options);
    }

    #[test]
    fn test_es2019_default() {
        let _transform = ES2019::default();
    }

    #[test]
    fn test_es2019_disabled() {
        let options = ES2019Options::disabled();
        let transform = ES2019::new(options);
        assert!(!transform.options().optional_catch_binding);
        assert!(!transform.options().json_superset);
    }

    #[test]
    fn test_es2019_optional_catch_binding() {
        let options = ES2019Options {
            optional_catch_binding: true,
            json_superset: false,
        };
        let mut transform = ES2019::new(options);

        let mut clause = CatchClause {
            span: Default::default(),
            param: None,
            body: BlockStmt {
                span: Default::default(),
                ctxt: Default::default(),
                stmts: vec![],
            },
        };

        clause.visit_mut_with(&mut transform);

        assert!(clause.param.is_some());
    }
}
