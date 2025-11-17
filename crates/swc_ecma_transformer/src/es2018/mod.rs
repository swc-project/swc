//! ES2018 syntax transformations.
//!
//! This module implements transformations for ECMAScript 2018 features:
//! - Object rest/spread properties
//! - Async iteration (for-await-of loops)
//! - Async generator functions
//! - RegExp features (named capture groups, lookbehind assertions)
//!
//! # References
//! - ES2018 specification: https://262.ecma-international.org/9.0/
//! - oxc_transformer ES2018: https://github.com/oxc-project/oxc/tree/main/crates/oxc_transformer/src/es2018

mod async_iteration;
mod object_rest_spread;
pub mod options;
mod regexp;

use async_iteration::AsyncIteration;
use object_rest_spread::ObjectRestSpread;
pub use options::ES2018Options;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TransformCtx;

/// ES2018 transformer.
///
/// This transformer implements all ES2018 syntax transformations using the
/// VisitMutHook pattern. It coordinates multiple sub-transformers for
/// different ES2018 features.
#[derive(Debug)]
pub struct ES2018 {
    options: ES2018Options,
    object_rest_spread: ObjectRestSpread,
    async_iteration: AsyncIteration,
}

impl ES2018 {
    /// Creates a new ES2018 transformer with the given options.
    pub fn new(options: ES2018Options) -> Self {
        Self {
            options,
            object_rest_spread: ObjectRestSpread::new(options.object_rest_spread),
            async_iteration: AsyncIteration::new(
                options.async_iteration,
                options.async_generator_functions,
            ),
        }
    }
}

impl VisitMutHook<TransformCtx> for ES2018 {
    /// Transform at program exit to handle object rest/spread at top level.
    fn exit_program(&mut self, node: &mut Program, ctx: &mut TransformCtx) {
        if self.options.object_rest_spread {
            self.object_rest_spread.exit_program(node, ctx);
        }
    }

    /// Transform expressions for object spread and async iteration.
    fn enter_expr(&mut self, node: &mut Expr, ctx: &mut TransformCtx) {
        if self.options.object_rest_spread {
            self.object_rest_spread.enter_expr(node, ctx);
        }
        if self.options.async_iteration || self.options.async_generator_functions {
            self.async_iteration.enter_expr(node, ctx);
        }
    }

    fn exit_expr(&mut self, node: &mut Expr, ctx: &mut TransformCtx) {
        if self.options.object_rest_spread {
            self.object_rest_spread.exit_expr(node, ctx);
        }
        if self.options.async_iteration || self.options.async_generator_functions {
            self.async_iteration.exit_expr(node, ctx);
        }
    }

    /// Transform variable declarations for rest pattern handling.
    fn exit_var_declarator(&mut self, node: &mut VarDeclarator, ctx: &mut TransformCtx) {
        if self.options.object_rest_spread {
            self.object_rest_spread.exit_var_declarator(node, ctx);
        }
    }

    /// Transform assignment expressions for rest patterns.
    fn exit_assign_expr(&mut self, node: &mut AssignExpr, ctx: &mut TransformCtx) {
        if self.options.object_rest_spread {
            self.object_rest_spread.exit_assign_expr(node, ctx);
        }
    }

    /// Transform function parameters for rest patterns.
    fn exit_function(&mut self, node: &mut Function, ctx: &mut TransformCtx) {
        if self.options.object_rest_spread {
            self.object_rest_spread.exit_function(node, ctx);
        }
        if self.options.async_generator_functions {
            self.async_iteration.exit_function(node, ctx);
        }
    }

    /// Transform arrow function parameters for rest patterns.
    fn exit_arrow_expr(&mut self, node: &mut ArrowExpr, ctx: &mut TransformCtx) {
        if self.options.object_rest_spread {
            self.object_rest_spread.exit_arrow_expr(node, ctx);
        }
    }

    /// Transform for-await-of statements.
    fn exit_for_of_stmt(&mut self, node: &mut ForOfStmt, ctx: &mut TransformCtx) {
        if self.options.async_iteration {
            self.async_iteration.exit_for_of_stmt(node, ctx);
        }
    }

    /// Transform catch clauses for rest patterns.
    fn exit_catch_clause(&mut self, node: &mut CatchClause, ctx: &mut TransformCtx) {
        if self.options.object_rest_spread {
            self.object_rest_spread.exit_catch_clause(node, ctx);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_options_default() {
        let options = ES2018Options::default();
        assert!(!options.is_enabled());
        assert!(!options.object_rest_spread);
        assert!(!options.async_generator_functions);
        assert!(!options.async_iteration);
    }

    #[test]
    fn test_options_all() {
        let options = ES2018Options::all();
        assert!(options.is_enabled());
        assert!(options.object_rest_spread);
        assert!(options.async_generator_functions);
        assert!(options.async_iteration);
    }

    #[test]
    fn test_transformer_creation() {
        let options = ES2018Options::all();
        let transformer = ES2018::new(options);
        assert!(transformer.options.is_enabled());
    }
}
