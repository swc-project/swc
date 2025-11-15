//! ES2021: Logical Assignment Operators
//!
//! This plugin transforms logical assignment operators (`&&=`, `||=`, `??=`)
//! to a series of logical expressions.
//!
//! > This plugin is included in `preset-env`, in ES2021
//!
//! ## Example
//!
//! Input:
//! ```js
//! a ||= b;
//! obj.a.b ||= c;
//!
//! a &&= b;
//! obj.a.b &&= c;
//! ```
//!
//! Output:
//! ```js
//! var _obj$a, _obj$a2;
//!
//! a || (a = b);
//! (_obj$a = obj.a).b || (_obj$a.b = c);
//!
//! a && (a = b);
//! (_obj$a2 = obj.a).b && (_obj$a2.b = c);
//! ```
//!
//! ### With Nullish Coalescing
//!
//! > While using the [nullish-coalescing-operator](https://github.com/oxc-project/oxc/blob/main/crates/oxc_transformer/src/es2020/nullish_coalescing_operator.rs) plugin (included in `preset-env``)
//!
//! Input:
//! ```js
//! a ??= b;
//! obj.a.b ??= c;
//! ```
//!
//! Output:
//! ```js
//! var _a, _obj$a, _obj$a$b;
//!
//! (_a = a) !== null && _a !== void 0 ? _a : (a = b);
//! (_obj$a$b = (_obj$a = obj.a).b) !== null && _obj$a$b !== void 0
//! ? _obj$a$b
//! : (_obj$a.b = c);
//! ```
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-logical-assignment-operators](https://babel.dev/docs/babel-plugin-transform-logical-assignment-operators).
//!
//! ## References:
//! * Babel plugin implementation: <https://github.com/babel/babel/tree/v7.26.2/packages/babel-plugin-transform-logical-assignment-operators>
//! * Logical Assignment TC39 proposal: <https://github.com/tc39/proposal-logical-assignment>

use oxc_allocator::TakeIn;
use oxc_ast::ast::*;
use oxc_semantic::ReferenceFlags;
use oxc_span::SPAN;
use oxc_traverse::Traverse;

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

pub struct LogicalAssignmentOperators<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> LogicalAssignmentOperators<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { ctx }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for LogicalAssignmentOperators<'a, '_> {
    // `#[inline]` because this is a hot path, and most `Expression`s are not `AssignmentExpression`s
    // with a logical operator. So we want to bail out as fast as possible for everything else,
    // without the cost of a function call.
    #[inline]
    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        let Expression::AssignmentExpression(assignment_expr) = expr else { return };

        // `&&=` `||=` `??=`
        let Some(operator) = assignment_expr.operator.to_logical_operator() else { return };

        self.transform_logical_assignment(expr, operator, ctx);
    }
}

impl<'a> LogicalAssignmentOperators<'a, '_> {
    fn transform_logical_assignment(
        &self,
        expr: &mut Expression<'a>,
        operator: LogicalOperator,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::AssignmentExpression(assignment_expr) = expr else { unreachable!() };

        // `a &&= c` -> `a && (a = c);`
        //               ^     ^ assign_target
        //               ^ left_expr

        // TODO: Add tests, cover private identifier
        let (left_expr, assign_target) = match &mut assignment_expr.left {
            // `a &&= c` -> `a && (a = c)`
            AssignmentTarget::AssignmentTargetIdentifier(ident) => {
                Self::convert_identifier(ident, ctx)
            }
            // `a.b &&= c` -> `var _a; (_a = a).b && (_a.b = c)`
            AssignmentTarget::StaticMemberExpression(static_expr) => {
                self.convert_static_member_expression(static_expr, ctx)
            }
            // `a[b.y] &&= c;` ->
            // `var _a, _b$y; (_a = a)[_b$y = b.y] && (_a[_b$y] = c);`
            AssignmentTarget::ComputedMemberExpression(computed_expr) => {
                self.convert_computed_member_expression(computed_expr, ctx)
            }
            // TODO
            #[expect(clippy::match_same_arms)]
            AssignmentTarget::PrivateFieldExpression(_) => return,
            // All other are TypeScript syntax.

            // It is a Syntax Error if AssignmentTargetType of LeftHandSideExpression is not simple.
            // So safe to return here.
            _ => return,
        };

        let assign_op = AssignmentOperator::Assign;
        let right = assignment_expr.right.take_in(ctx.ast);
        let right = ctx.ast.expression_assignment(SPAN, assign_op, assign_target, right);

        let logical_expr = ctx.ast.expression_logical(SPAN, left_expr, operator, right);

        *expr = logical_expr;
    }

    fn convert_identifier(
        ident: &IdentifierReference<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> (Expression<'a>, AssignmentTarget<'a>) {
        let reference = ctx.scoping_mut().get_reference_mut(ident.reference_id());
        *reference.flags_mut() = ReferenceFlags::Read;
        let symbol_id = reference.symbol_id();
        let left_expr = Expression::Identifier(ctx.alloc(ident.clone()));

        let ident = ctx.create_ident_reference(SPAN, ident.name, symbol_id, ReferenceFlags::Write);
        let assign_target = AssignmentTarget::AssignmentTargetIdentifier(ctx.alloc(ident));
        (left_expr, assign_target)
    }

    fn convert_static_member_expression(
        &self,
        static_expr: &mut StaticMemberExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> (Expression<'a>, AssignmentTarget<'a>) {
        let object = static_expr.object.take_in(ctx.ast);
        let (object, object_ref) = self.ctx.duplicate_expression(object, true, ctx);

        let left_expr = Expression::from(ctx.ast.member_expression_static(
            static_expr.span,
            object,
            static_expr.property.clone(),
            false,
        ));

        let assign_expr = ctx.ast.member_expression_static(
            static_expr.span,
            object_ref,
            static_expr.property.clone(),
            false,
        );
        let assign_target = AssignmentTarget::from(assign_expr);

        (left_expr, assign_target)
    }

    fn convert_computed_member_expression(
        &self,
        computed_expr: &mut ComputedMemberExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> (Expression<'a>, AssignmentTarget<'a>) {
        let object = computed_expr.object.take_in(ctx.ast);
        let (object, object_ref) = self.ctx.duplicate_expression(object, true, ctx);

        let expression = computed_expr.expression.take_in(ctx.ast);
        let (expression, expression_ref) = self.ctx.duplicate_expression(expression, true, ctx);

        let left_expr = Expression::from(ctx.ast.member_expression_computed(
            computed_expr.span,
            object,
            expression,
            false,
        ));

        let assign_target = AssignmentTarget::from(ctx.ast.member_expression_computed(
            computed_expr.span,
            object_ref,
            expression_ref,
            false,
        ));

        (left_expr, assign_target)
    }
}
