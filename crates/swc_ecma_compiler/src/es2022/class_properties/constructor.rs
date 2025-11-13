//! ES2022: Class Properties
//! Insertion of instance property initializers into constructor.
//!
//! Stub implementation for SWC - provides minimal structure for compilation.

use swc_atoms::Atom;
use swc_ecma_ast::*;

use super::ClassProperties;
use crate::context::TraverseCtx;

/// Location to insert instance property initializers
pub(super) enum InstanceInitsInsertLocation {
    /// Create new constructor, containing initializers
    NewConstructor,
    /// Insert initializers into existing constructor at this statement index
    ExistingConstructor(usize),
    /// Create a `_super` function inside class constructor, containing
    /// initializers
    SuperFnInsideConstructor(Atom),
    /// Create a `_super` function outside class, containing initializers
    SuperFnOutsideClass(Atom),
}

/// Scopes related to inserting and transforming instance property initializers
pub(super) struct InstanceInitScopes {
    /// Placeholder - SWC doesn't use oxc's scope system
    pub _placeholder: (),
}

impl<'a> ClassProperties<'a, '_> {
    /// Replace `super()` call(s) in constructor, if required.
    ///
    /// Stub implementation - returns basic insert location.
    pub(super) fn replace_super_in_constructor(
        _constructor: &mut Function,
        _ctx: &mut TraverseCtx<'a>,
    ) -> (InstanceInitScopes, InstanceInitsInsertLocation) {
        // Stub implementation
        (
            InstanceInitScopes { _placeholder: () },
            InstanceInitsInsertLocation::ExistingConstructor(0),
        )
    }

    /// Insert a new constructor into class.
    ///
    /// Stub implementation.
    pub(super) fn insert_constructor(
        _body: &mut Vec<ClassMember>,
        _instance_inits: Vec<Box<Expr>>,
        _has_super_class: bool,
        _scope_id: (),
        _ctx: &mut TraverseCtx<'a>,
    ) {
        // Stub implementation
        // TODO: Implement constructor creation
    }

    /// Insert property initializers into existing constructor as statements.
    ///
    /// Stub implementation.
    pub(super) fn insert_inits_into_constructor_as_statements(
        &mut self,
        _constructor: &mut Function,
        _inits: Vec<Box<Expr>>,
        _stmt_index: usize,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        // Stub implementation
        // TODO: Implement init insertion
    }

    /// Create `_super` function inside constructor.
    ///
    /// Stub implementation.
    pub(super) fn create_super_function_inside_constructor(
        &mut self,
        _constructor: &mut Function,
        _instance_inits: Vec<Box<Expr>>,
        _super_binding: &Atom,
        _super_func_scope_id: (),
        _ctx: &mut TraverseCtx<'a>,
    ) {
        // Stub implementation
        // TODO: Implement super function creation
    }

    /// Create `_super` function outside constructor.
    ///
    /// Stub implementation.
    pub(super) fn create_super_function_outside_constructor(
        &mut self,
        _instance_inits: Vec<Box<Expr>>,
        _super_binding: &Atom,
        _super_func_scope_id: (),
        _ctx: &mut TraverseCtx<'a>,
    ) {
        // Stub implementation
        // TODO: Implement super function creation
    }
}
