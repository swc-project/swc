//! AST builder utilities for creating common AST patterns.
//!
//! This module provides helper functions for constructing frequently used AST
//! nodes and patterns in a concise way.
//!
//! # Note
//!
//! This is a stub implementation to replace the oxc-based version. In SWC,
//! AST construction is done directly using the types from `swc_ecma_ast`,
//! and these utilities may not be needed in the same form.
//!
//! TODO: Implement these utilities using SWC's AST types if they are needed,
//! or remove this module if the functionality can be achieved through other
//! means in SWC's architecture.

use swc_common::Span;
use swc_ecma_ast::*;

use crate::context::TraverseCtx;

/// `object` -> `object.call`.
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn create_member_callee<'a>(
    _object: Expr,
    _property: &'static str,
    _ctx: &TraverseCtx<'a>,
) -> Expr {
    todo!("create_member_callee: needs SWC implementation")
}

/// `object` -> `object.bind(this)`.
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn create_bind_call<'a>(
    _callee: Expr,
    _this: Expr,
    _span: Span,
    _ctx: &TraverseCtx<'a>,
) -> Expr {
    todo!("create_bind_call: needs SWC implementation")
}

/// `object` -> `object.call(...arguments)`.
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn create_call_call<'a>(
    _callee: Expr,
    _this: Expr,
    _span: Span,
    _ctx: &TraverseCtx<'a>,
) -> Expr {
    todo!("create_call_call: needs SWC implementation")
}

/// Wrap an `Expression` in an arrow function IIFE (immediately invoked function
/// expression) with a body block.
///
/// `expr` -> `(() => { return expr; })()`
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn wrap_expression_in_arrow_function_iife<'a>(_expr: Expr, _ctx: &mut TraverseCtx<'a>) -> Expr {
    todo!("wrap_expression_in_arrow_function_iife: needs SWC implementation")
}

/// Wrap statements in an IIFE (immediately invoked function expression).
///
/// `x; y; z;` -> `(() => { x; y; z; })()`
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn wrap_statements_in_arrow_function_iife<'a>(
    _stmts: Vec<Stmt>,
    _span: Span,
    _ctx: &TraverseCtx<'a>,
) -> Expr {
    todo!("wrap_statements_in_arrow_function_iife: needs SWC implementation")
}

/// `object` -> `object.prototype`.
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn create_prototype_member<'a>(_object: Expr, _ctx: &TraverseCtx<'a>) -> Expr {
    todo!("create_prototype_member: needs SWC implementation")
}

/// `object` -> `object.a`.
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn create_property_access<'a>(
    _span: Span,
    _object: Expr,
    _property: &str,
    _ctx: &TraverseCtx<'a>,
) -> Expr {
    todo!("create_property_access: needs SWC implementation")
}

/// `this.property`
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn create_this_property_access<'a>(
    _span: Span,
    _property: Ident,
    _ctx: &TraverseCtx<'a>,
) -> MemberExpr {
    todo!("create_this_property_access: needs SWC implementation")
}

/// `this.property`
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn create_this_property_assignment<'a>(
    _span: Span,
    _property: Ident,
    _ctx: &TraverseCtx<'a>,
) -> AssignTarget {
    todo!("create_this_property_assignment: needs SWC implementation")
}

/// Create assignment to a binding.
///
/// TODO: Implement using SWC AST. Note that SWC doesn't have a direct
/// equivalent to oxc's `BoundIdentifier` - bindings are handled differently.
#[allow(unused)]
pub fn create_assignment<'a>(_binding: &Ident, _value: Expr, _ctx: &mut TraverseCtx<'a>) -> Expr {
    todo!("create_assignment: needs SWC implementation")
}

/// `super(...args);`
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn create_super_call<'a>(_args_binding: &Ident, _ctx: &mut TraverseCtx<'a>) -> Expr {
    todo!("create_super_call: needs SWC implementation")
}

/// * With super class: `constructor(..._args) { super(..._args); statements }`
/// * Without super class: `constructor() { statements }`
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn create_class_constructor<'a, 'c>(
    _stmts_iter: impl IntoIterator<Item = Stmt> + 'c,
    _has_super_class: bool,
    _ctx: &mut TraverseCtx<'a>,
) -> ClassMember {
    todo!("create_class_constructor: needs SWC implementation")
}

/// `constructor(params) { statements }`
///
/// TODO: Implement using SWC AST
#[allow(unused)]
pub fn create_class_constructor_with_params<'a>(
    _stmts: Vec<Stmt>,
    _params: Vec<Param>,
    _ctx: &TraverseCtx<'a>,
) -> ClassMember {
    todo!("create_class_constructor_with_params: needs SWC implementation")
}
