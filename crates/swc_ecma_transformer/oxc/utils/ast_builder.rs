use std::iter;

use oxc_allocator::{Box as ArenaBox, Vec as ArenaVec};
use oxc_ast::{NONE, ast::*};
use oxc_semantic::{ReferenceFlags, ScopeFlags, ScopeId, SymbolFlags};
use oxc_span::{GetSpan, SPAN};
use oxc_traverse::BoundIdentifier;

use crate::context::TraverseCtx;

/// `object` -> `object.call`.
pub fn create_member_callee<'a>(
    object: Expression<'a>,
    property: &'static str,
    ctx: &TraverseCtx<'a>,
) -> Expression<'a> {
    let property = ctx.ast.identifier_name(SPAN, Atom::from(property));
    Expression::from(ctx.ast.member_expression_static(SPAN, object, property, false))
}

/// `object` -> `object.bind(this)`.
pub fn create_bind_call<'a>(
    callee: Expression<'a>,
    this: Expression<'a>,
    span: Span,
    ctx: &TraverseCtx<'a>,
) -> Expression<'a> {
    let callee = create_member_callee(callee, "bind", ctx);
    let arguments = ctx.ast.vec1(Argument::from(this));
    ctx.ast.expression_call(span, callee, NONE, arguments, false)
}

/// `object` -> `object.call(...arguments)`.
pub fn create_call_call<'a>(
    callee: Expression<'a>,
    this: Expression<'a>,
    span: Span,
    ctx: &TraverseCtx<'a>,
) -> Expression<'a> {
    let callee = create_member_callee(callee, "call", ctx);
    let arguments = ctx.ast.vec1(Argument::from(this));
    ctx.ast.expression_call(span, callee, NONE, arguments, false)
}

/// Wrap an `Expression` in an arrow function IIFE (immediately invoked function expression)
/// with a body block.
///
/// `expr` -> `(() => { return expr; })()`
pub fn wrap_expression_in_arrow_function_iife<'a>(
    expr: Expression<'a>,
    ctx: &mut TraverseCtx<'a>,
) -> Expression<'a> {
    let scope_id =
        ctx.insert_scope_below_expression(&expr, ScopeFlags::Arrow | ScopeFlags::Function);
    let span = expr.span();
    let stmts = ctx.ast.vec1(ctx.ast.statement_return(SPAN, Some(expr)));
    wrap_statements_in_arrow_function_iife(stmts, scope_id, span, ctx)
}

/// Wrap statements in an IIFE (immediately invoked function expression).
///
/// `x; y; z;` -> `(() => { x; y; z; })()`
pub fn wrap_statements_in_arrow_function_iife<'a>(
    stmts: ArenaVec<'a, Statement<'a>>,
    scope_id: ScopeId,
    span: Span,
    ctx: &TraverseCtx<'a>,
) -> Expression<'a> {
    let kind = FormalParameterKind::ArrowFormalParameters;
    let params = ctx.ast.alloc_formal_parameters(SPAN, kind, ctx.ast.vec(), NONE);
    let body = ctx.ast.alloc_function_body(SPAN, ctx.ast.vec(), stmts);
    let arrow = ctx.ast.expression_arrow_function_with_scope_id_and_pure_and_pife(
        SPAN, false, false, NONE, params, NONE, body, scope_id, false, false,
    );
    ctx.ast.expression_call(span, arrow, NONE, ctx.ast.vec(), false)
}

/// `object` -> `object.prototype`.
pub fn create_prototype_member<'a>(
    object: Expression<'a>,
    ctx: &TraverseCtx<'a>,
) -> Expression<'a> {
    let property = ctx.ast.identifier_name(SPAN, Atom::from("prototype"));
    let static_member = ctx.ast.member_expression_static(SPAN, object, property, false);
    Expression::from(static_member)
}

/// `object` -> `object.a`.
pub fn create_property_access<'a>(
    span: Span,
    object: Expression<'a>,
    property: &str,
    ctx: &TraverseCtx<'a>,
) -> Expression<'a> {
    let property = ctx.ast.identifier_name(SPAN, ctx.ast.atom(property));
    Expression::from(ctx.ast.member_expression_static(span, object, property, false))
}

/// `this.property`
#[inline]
pub fn create_this_property_access<'a>(
    span: Span,
    property: Atom<'a>,
    ctx: &TraverseCtx<'a>,
) -> MemberExpression<'a> {
    let object = ctx.ast.expression_this(span);
    let property = ctx.ast.identifier_name(SPAN, property);
    ctx.ast.member_expression_static(span, object, property, false)
}

/// `this.property`
#[inline]
pub fn create_this_property_assignment<'a>(
    span: Span,
    property: Atom<'a>,
    ctx: &TraverseCtx<'a>,
) -> AssignmentTarget<'a> {
    AssignmentTarget::from(create_this_property_access(span, property, ctx))
}

/// Create assignment to a binding.
pub fn create_assignment<'a>(
    binding: &BoundIdentifier<'a>,
    value: Expression<'a>,
    ctx: &mut TraverseCtx<'a>,
) -> Expression<'a> {
    ctx.ast.expression_assignment(
        SPAN,
        AssignmentOperator::Assign,
        binding.create_target(ReferenceFlags::Write, ctx),
        value,
    )
}

/// `super(...args);`
pub fn create_super_call<'a>(
    args_binding: &BoundIdentifier<'a>,
    ctx: &mut TraverseCtx<'a>,
) -> Expression<'a> {
    ctx.ast.expression_call(
        SPAN,
        ctx.ast.expression_super(SPAN),
        NONE,
        ctx.ast
            .vec1(ctx.ast.argument_spread_element(SPAN, args_binding.create_read_expression(ctx))),
        false,
    )
}

/// * With super class:
///   `constructor(..._args) { super(..._args); statements }`
/// * Without super class:
//    `constructor() { statements }`
pub fn create_class_constructor<'a, 'c>(
    stmts_iter: impl IntoIterator<Item = Statement<'a>> + 'c,
    has_super_class: bool,
    scope_id: ScopeId,
    ctx: &mut TraverseCtx<'a>,
) -> ClassElement<'a> {
    // Add `super(..._args);` statement and `..._args` param if class has a super class.
    // `constructor(..._args) { super(..._args); /* prop initialization */ }`
    // TODO(improve-on-babel): We can use `arguments` instead of creating `_args`.
    let mut params_rest = None;
    let stmts = if has_super_class {
        let args_binding = ctx.generate_uid("args", scope_id, SymbolFlags::FunctionScopedVariable);
        params_rest = Some(
            ctx.ast.alloc_binding_rest_element(SPAN, args_binding.create_binding_pattern(ctx)),
        );
        ctx.ast.vec_from_iter(
            iter::once(ctx.ast.statement_expression(SPAN, create_super_call(&args_binding, ctx)))
                .chain(stmts_iter),
        )
    } else {
        ctx.ast.vec_from_iter(stmts_iter)
    };

    let params = ctx.ast.alloc_formal_parameters(
        SPAN,
        FormalParameterKind::FormalParameter,
        ctx.ast.vec(),
        params_rest,
    );

    create_class_constructor_with_params(stmts, params, scope_id, ctx)
}

//  `constructor(params) { statements }`
pub fn create_class_constructor_with_params<'a>(
    stmts: ArenaVec<'a, Statement<'a>>,
    params: ArenaBox<'a, FormalParameters<'a>>,
    scope_id: ScopeId,
    ctx: &TraverseCtx<'a>,
) -> ClassElement<'a> {
    ClassElement::MethodDefinition(ctx.ast.alloc_method_definition(
        SPAN,
        MethodDefinitionType::MethodDefinition,
        ctx.ast.vec(),
        PropertyKey::StaticIdentifier(
            ctx.ast.alloc_identifier_name(SPAN, Atom::from("constructor")),
        ),
        ctx.ast.alloc_function_with_scope_id(
            SPAN,
            FunctionType::FunctionExpression,
            None,
            false,
            false,
            false,
            NONE,
            NONE,
            params,
            NONE,
            Some(ctx.ast.alloc_function_body(SPAN, ctx.ast.vec(), stmts)),
            scope_id,
        ),
        MethodDefinitionKind::Constructor,
        false,
        false,
        false,
        false,
        None,
    ))
}
