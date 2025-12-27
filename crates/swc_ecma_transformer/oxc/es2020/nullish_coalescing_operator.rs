//! ES2020: Nullish Coalescing Operator
//!
//! This plugin transforms nullish coalescing operators (`??`) to a series of ternary expressions.
//!
//! > This plugin is included in `preset-env`, in ES2020
//!
//! ## Example
//!
//! Input:
//! ```js
//! var foo = object.foo ?? "default";
//! ```
//!
//! Output:
//! ```js
//! var _object$foo;
//! var foo =
//! (_object$foo = object.foo) !== null && _object$foo !== void 0
//!   ? _object$foo
//!   : "default";
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-nullish-coalescing-operator](https://babeljs.io/docs/babel-plugin-transform-nullish-coalescing-operator).
//!
//! ## References:
//! * Babel plugin implementation: <https://github.com/babel/babel/tree/v7.26.2/packages/babel-plugin-transform-nullish-coalescing-operator>
//! * Nullish coalescing TC39 proposal: <https://github.com/tc39-transfer/proposal-nullish-coalescing>

use oxc_allocator::{Box as ArenaBox, TakeIn};
use oxc_ast::{NONE, ast::*};
use oxc_semantic::{ScopeFlags, SymbolFlags};
use oxc_span::SPAN;
use oxc_syntax::operator::{AssignmentOperator, BinaryOperator, LogicalOperator};
use oxc_traverse::{Ancestor, BoundIdentifier, Traverse};

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

pub struct NullishCoalescingOperator<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> NullishCoalescingOperator<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { ctx }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for NullishCoalescingOperator<'a, '_> {
    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        // left ?? right
        if !matches!(expr, Expression::LogicalExpression(logical_expr) if logical_expr.operator == LogicalOperator::Coalesce)
        {
            return;
        }

        // Take ownership of the `LogicalExpression`
        let Expression::LogicalExpression(logical_expr) = expr.take_in(ctx.ast) else {
            unreachable!()
        };

        *expr = self.transform_logical_expression(logical_expr, ctx);
    }
}

impl<'a> NullishCoalescingOperator<'a, '_> {
    fn transform_logical_expression(
        &self,
        logical_expr: ArenaBox<'a, LogicalExpression<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let logical_expr = logical_expr.unbox();

        // Skip creating extra reference when `left` is static
        match &logical_expr.left {
            Expression::ThisExpression(this) => {
                let this_span = this.span;
                return Self::create_conditional_expression(
                    logical_expr.left,
                    ctx.ast.expression_this(this_span),
                    ctx.ast.expression_this(this_span),
                    logical_expr.right,
                    logical_expr.span,
                    ctx,
                );
            }
            Expression::Identifier(ident) => {
                let symbol_id = ctx.scoping().get_reference(ident.reference_id()).symbol_id();
                if let Some(symbol_id) = symbol_id {
                    // Check binding is not mutated.
                    // TODO(improve-on-babel): Remove this check. Whether binding is mutated or not is not relevant.
                    if ctx.scoping().get_resolved_references(symbol_id).all(|r| !r.is_write()) {
                        let binding = BoundIdentifier::new(ident.name, symbol_id);
                        let ident_span = ident.span;
                        return Self::create_conditional_expression(
                            logical_expr.left,
                            binding.create_spanned_read_expression(ident_span, ctx),
                            binding.create_spanned_read_expression(ident_span, ctx),
                            logical_expr.right,
                            logical_expr.span,
                            ctx,
                        );
                    }
                }
            }
            _ => {}
        }

        // ctx.ancestor(0) is AssignmentPattern
        // ctx.ancestor(1) is BindingPattern
        // ctx.ancestor(2) is FormalParameter
        let is_parent_formal_parameter =
            matches!(ctx.ancestor(2), Ancestor::FormalParameterPattern(_));

        let current_scope_id = if is_parent_formal_parameter {
            ctx.create_child_scope_of_current(ScopeFlags::Arrow | ScopeFlags::Function)
        } else {
            ctx.current_hoist_scope_id()
        };

        // Add `var _name` to scope
        let binding = ctx.generate_uid_based_on_node(
            &logical_expr.left,
            current_scope_id,
            SymbolFlags::FunctionScopedVariable,
        );

        let assignment = ctx.ast.expression_assignment(
            SPAN,
            AssignmentOperator::Assign,
            binding.create_write_target(ctx),
            logical_expr.left,
        );
        let mut new_expr = Self::create_conditional_expression(
            assignment,
            binding.create_read_expression(ctx),
            binding.create_read_expression(ctx),
            logical_expr.right,
            logical_expr.span,
            ctx,
        );

        if is_parent_formal_parameter {
            // Replace `function (a, x = a.b ?? c) {}` to `function (a, x = (() => a.b ?? c)() ){}`
            // so the temporary variable can be injected in correct scope
            let id = binding.create_binding_pattern(ctx);
            let param = ctx.ast.formal_parameter(SPAN, ctx.ast.vec(), id, None, false, false);
            let params = ctx.ast.formal_parameters(
                SPAN,
                FormalParameterKind::ArrowFormalParameters,
                ctx.ast.vec1(param),
                NONE,
            );
            let body = ctx.ast.function_body(
                SPAN,
                ctx.ast.vec(),
                ctx.ast.vec1(ctx.ast.statement_expression(SPAN, new_expr)),
            );
            let arrow_function = ctx.ast.expression_arrow_function_with_scope_id_and_pure_and_pife(
                SPAN,
                true,
                false,
                NONE,
                params,
                NONE,
                body,
                current_scope_id,
                false,
                false,
            );
            // `(x) => x;` -> `((x) => x)();`
            new_expr = ctx.ast.expression_call(SPAN, arrow_function, NONE, ctx.ast.vec(), false);
        } else {
            self.ctx.var_declarations.insert_var(&binding, ctx);
        }

        new_expr
    }

    /// Create a conditional expression.
    ///
    /// ```js
    /// // Input
    /// foo = bar ?? "qux"
    ///
    /// // Output
    /// foo = bar !== null && bar !== void 0 ? bar : "qux"
    /// //    ^^^ assignment  ^^^ reference1         ^^^^^ default
    /// //                                     ^^^ reference2
    /// ```
    ///
    /// ```js
    /// // Input
    /// foo = bar.x ?? "qux"
    ///
    /// // Output
    /// foo = (_bar$x = bar.x) !== null && _bar$x !== void 0 ? _bar$x : "qux"
    /// //    ^^^^^^^^^^^^^^^^ assignment  ^^^^^^ reference1            ^^^^^ default
    /// //                                                     ^^^^^^ reference2
    /// ```
    fn create_conditional_expression(
        assignment: Expression<'a>,
        reference1: Expression<'a>,
        reference2: Expression<'a>,
        default: Expression<'a>,
        span: Span,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        let op = BinaryOperator::StrictInequality;
        let null = ctx.ast.expression_null_literal(SPAN);
        let left = ctx.ast.expression_binary(SPAN, assignment, op, null);
        let right = ctx.ast.expression_binary(SPAN, reference1, op, ctx.ast.void_0(SPAN));
        let test = ctx.ast.expression_logical(SPAN, left, LogicalOperator::And, right);

        ctx.ast.expression_conditional(span, test, reference2, default)
    }
}
