//! Object rest/spread properties transformation.
//!
//! This module transforms ES2018 object rest and spread properties:
//!
//! ## Object Spread
//!
//! ```javascript
//! // Input
//! const obj = { ...foo, bar: 'baz' };
//!
//! // Output
//! const obj = _objectSpread({}, foo, { bar: 'baz' });
//! ```
//!
//! ## Object Rest
//!
//! ```javascript
//! // Input
//! const { x, ...rest } = obj;
//!
//! // Output
//! const { x } = obj;
//! const rest = _objectWithoutProperties(obj, ["x"]);
//! ```
//!
//! # References
//! - Specification: https://github.com/tc39/proposal-object-rest-spread
//! - MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TransformCtx;

/// Object rest/spread transformer.
///
/// Transforms object spread in object literals and rest patterns in
/// destructuring assignments.
#[derive(Debug)]
pub struct ObjectRestSpread {
    enabled: bool,
}

impl ObjectRestSpread {
    /// Creates a new object rest/spread transformer.
    pub fn new(enabled: bool) -> Self {
        Self { enabled }
    }
}

impl VisitMutHook<TransformCtx> for ObjectRestSpread {
    fn exit_program(&mut self, _node: &mut Program, _ctx: &mut TransformCtx) {
        if !self.enabled {
            // TODO: Implement program-level transformations
        }
    }

    fn enter_expr(&mut self, _node: &mut Expr, _ctx: &mut TransformCtx) {
        if !self.enabled {
            // TODO: Handle object spread in expressions
        }
    }

    fn exit_expr(&mut self, node: &mut Expr, _ctx: &mut TransformCtx) {
        if !self.enabled {
            return;
        }

        // Transform object spread expressions
        if let Expr::Object(obj_lit) = node {
            self.transform_object_spread(obj_lit);
        }
    }

    fn exit_var_declarator(&mut self, _node: &mut VarDeclarator, _ctx: &mut TransformCtx) {
        if !self.enabled {
            // TODO: Handle rest patterns in variable declarations
        }
    }

    fn exit_assign_expr(&mut self, _node: &mut AssignExpr, _ctx: &mut TransformCtx) {
        if !self.enabled {
            // TODO: Handle rest patterns in assignment expressions
        }
    }

    fn exit_function(&mut self, _node: &mut Function, _ctx: &mut TransformCtx) {
        if !self.enabled {
            // TODO: Handle rest patterns in function parameters
        }
    }

    fn exit_arrow_expr(&mut self, _node: &mut ArrowExpr, _ctx: &mut TransformCtx) {
        if !self.enabled {
            // TODO: Handle rest patterns in arrow function parameters
        }
    }

    fn exit_catch_clause(&mut self, _node: &mut CatchClause, _ctx: &mut TransformCtx) {
        if !self.enabled {
            // TODO: Handle rest patterns in catch clause parameters
        }
    }
}

impl ObjectRestSpread {
    /// Check if an object literal has any spread properties.
    #[allow(dead_code)]
    fn has_spread_properties(&self, obj: &ObjectLit) -> bool {
        obj.props
            .iter()
            .any(|prop| matches!(prop, PropOrSpread::Spread(_)))
    }

    /// Transform object spread in object literals.
    ///
    /// Converts `{...a, b: 1, ...c}` into `_objectSpread({}, a, {b: 1}, c)`
    fn transform_object_spread(&mut self, _obj: &mut ObjectLit) {
        // TODO: Implement object spread transformation
        // This is a placeholder for the actual implementation
        // The real implementation would:
        // 1. Check if there are any spread properties
        // 2. Group consecutive properties into objects
        // 3. Generate helper function call (_objectSpread or similar)
        // 4. Replace the object literal with the helper call
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_object_rest_spread_creation() {
        let transformer = ObjectRestSpread::new(true);
        assert!(transformer.enabled);
    }

    #[test]
    fn test_object_rest_spread_disabled() {
        let transformer = ObjectRestSpread::new(false);
        assert!(!transformer.enabled);
    }

    #[test]
    fn test_has_spread_properties() {
        let transformer = ObjectRestSpread::new(true);

        // Object without spread
        let obj_no_spread = ObjectLit {
            span: Default::default(),
            props: vec![],
        };
        assert!(!transformer.has_spread_properties(&obj_no_spread));

        // Object with spread
        let obj_with_spread = ObjectLit {
            span: Default::default(),
            props: vec![PropOrSpread::Spread(SpreadElement {
                dot3_token: Default::default(),
                expr: Box::new(Expr::Ident(Ident::new(
                    "foo".into(),
                    Default::default(),
                    Default::default(),
                ))),
            })],
        };
        assert!(transformer.has_spread_properties(&obj_with_spread));
    }
}
