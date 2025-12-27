//! ES2022: Class Properties
//! Transform of class property/method computed keys.

use oxc_allocator::TakeIn;
use oxc_ast::ast::*;

use crate::context::TraverseCtx;

use super::ClassProperties;

impl<'a> ClassProperties<'a, '_> {
    /// Substitute temp var for method computed key.
    /// `class C { [x()]() {} }` -> `let _x; _x = x(); class C { [_x]() {} }`
    /// This transform is only required if class has properties or a static block.
    pub(super) fn substitute_temp_var_for_method_computed_key(
        &mut self,
        method: &mut MethodDefinition<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        // Exit if key is not an `Expression`
        // (`PropertyKey::StaticIdentifier` or `PropertyKey::PrivateIdentifier`)
        let Some(key) = method.key.as_expression_mut() else {
            return;
        };

        // Exit if evaluating key cannot have side effects.
        // This check also results in exit for non-computed keys e.g. `class C { 'x'() {} 123() {} }`.
        if !self.ctx.key_needs_temp_var(key, ctx) {
            return;
        }

        // TODO(improve-on-babel): It's unnecessary to create temp vars for method keys unless:
        // 1. Properties also have computed keys.
        // 2. Some of those properties' computed keys have side effects and require temp vars.
        // 3. At least one property satisfying the above is after this method,
        //    or class contains a static block which is being transformed
        //    (static blocks are always evaluated after computed keys, regardless of order)
        let original_key = key.take_in(ctx.ast);
        let (assignment, temp_var) = self.ctx.create_computed_key_temp_var(original_key, ctx);
        self.insert_before.push(assignment);
        method.key = PropertyKey::from(temp_var);
    }

    /// Convert computed property/method key to a temp var, if a temp var is required.
    ///
    /// If no temp var is required, take ownership of key, and return it.
    ///
    /// Transformation is:
    /// * Class declaration:
    ///   `class C { [x()] = 1; }` -> `let _x; _x = x(); class C { constructor() { this[_x] = 1; } }`
    /// * Class expression:
    ///   `C = class { [x()] = 1; }` -> `let _x; C = (_x = x(), class C { constructor() { this[_x] = 1; } })`
    ///
    /// This function:
    /// * Creates the `let _x;` statement and inserts it.
    /// * Creates the `_x = x()` assignment.
    /// * If static prop, inserts assignment before class.
    /// * If instance prop, replaces existing key with assignment (it'll be moved to before class later).
    /// * Returns `_x`.
    pub(super) fn create_computed_key_temp_var_if_required(
        &mut self,
        key: &mut Expression<'a>,
        is_static: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let original_key = key.take_in(ctx.ast);
        if self.ctx.key_needs_temp_var(&original_key, ctx) {
            let (assignment, ident) = self.ctx.create_computed_key_temp_var(original_key, ctx);
            if is_static {
                self.insert_before.push(assignment);
            } else {
                *key = assignment;
            }
            ident
        } else {
            original_key
        }
    }

    /// Extract computed key when key needs a temp var, which may have side effect.
    ///
    /// When `set_public_class_fields` and `remove_class_fields_without_initializer` are both true,
    /// fields without initializers would be removed. However, if the key is a computed key and may
    /// have side effects, we need to extract the key and place it before the class to preserve the
    /// original behavior.
    ///
    /// Extract computed key:
    /// `class C { [foo()] }`
    /// -> `foo(); class C { }`
    ///
    /// Do not extract computed key:
    /// `class C { [123] }`
    /// -> `class C { }`
    ///
    pub(super) fn extract_computed_key(
        &mut self,
        prop: &mut PropertyDefinition<'a>,
        ctx: &TraverseCtx<'a>,
    ) {
        let Some(key) = prop.key.as_expression_mut() else {
            return;
        };

        if self.ctx.key_needs_temp_var(key, ctx) {
            self.insert_before.push(key.take_in(ctx.ast));
        }
    }

    /// Extract computed key if it's an assignment, and replace with identifier.
    ///
    /// In entry phase, computed keys for instance properties are converted to assignments to temp vars.
    /// `class C { [foo()] = 123 }`
    /// -> `class C { [_foo = foo()]; constructor() { this[_foo] = 123; } }`
    ///
    /// Now in exit phase, extract this assignment and move it to before class.
    ///
    /// `class C { [_foo = foo()]; constructor() { this[_foo] = 123; } }`
    /// -> `_foo = foo(); class C { [null]; constructor() { this[_foo] = 123; } }`
    /// (`[null]` property will be removed too by caller)
    ///
    /// We do this process in 2 passes so that the computed key is still present within the class during
    /// traversal of the class body, so any other transforms can run on it.
    /// Now that we're exiting the class, we can move the assignment `_foo = foo()` out of the class
    /// to where it needs to be.
    pub(super) fn extract_instance_prop_computed_key(
        &mut self,
        prop: &mut PropertyDefinition<'a>,
        ctx: &TraverseCtx<'a>,
    ) {
        // Exit if computed key is not an assignment (wasn't processed in 1st pass)
        if !matches!(&prop.key, PropertyKey::AssignmentExpression(_)) {
            // This field is going to be removed, but if the key is a computed key and may have
            // side effects, we need to extract the key and place it before the class to preserve
            // the original behavior.
            if prop.value.is_none()
                && self.set_public_class_fields
                && self.remove_class_fields_without_initializer
            {
                self.extract_computed_key(prop, ctx);
            }

            return;
        }

        // Debug checks that we're removing what we think we are
        #[cfg(debug_assertions)]
        {
            let PropertyKey::AssignmentExpression(assign_expr) = &prop.key else { unreachable!() };
            assert!(assign_expr.span.is_empty());
            let AssignmentTarget::AssignmentTargetIdentifier(ident) = &assign_expr.left else {
                unreachable!();
            };
            assert!(ident.name.starts_with('_'));
            assert!(ctx.scoping().get_reference(ident.reference_id()).symbol_id().is_some());
            assert!(ident.span.is_empty());
            assert!(prop.value.is_none());
        }

        // Extract assignment from computed key and insert before class
        let assignment = prop.key.take_in(ctx.ast).into_expression();
        self.insert_before.push(assignment);
    }
}
