//! ES2022: Class Properties
//! Transform of `super` expressions.

use oxc_allocator::{Box as ArenaBox, TakeIn, Vec as ArenaVec};
use oxc_ast::ast::*;
use oxc_span::SPAN;
use oxc_traverse::ast_operations::get_var_name_from_node;

use crate::{
    Helper,
    context::TraverseCtx,
    utils::ast_builder::{create_assignment, create_prototype_member},
};

use super::ClassProperties;

#[derive(Debug)]
pub(super) enum ClassPropertiesSuperConverterMode {
    // `static prop` or `static {}`
    Static,
    // `#method() {}`
    PrivateMethod,
    // `static #method() {}`
    StaticPrivateMethod,
}

/// Convert `super` expressions.
pub(super) struct ClassPropertiesSuperConverter<'a, 'ctx, 'v> {
    mode: ClassPropertiesSuperConverterMode,
    pub(super) class_properties: &'v mut ClassProperties<'a, 'ctx>,
}

impl<'a, 'ctx, 'v> ClassPropertiesSuperConverter<'a, 'ctx, 'v> {
    pub(super) fn new(
        mode: ClassPropertiesSuperConverterMode,
        class_properties: &'v mut ClassProperties<'a, 'ctx>,
    ) -> Self {
        Self { mode, class_properties }
    }
}

impl<'a> ClassPropertiesSuperConverter<'a, '_, '_> {
    /// Transform static member expression where object is `super`.
    ///
    /// `super.prop` -> `_superPropGet(_Class, "prop", _Class)`
    //
    // `#[inline]` so that compiler sees that `expr` is an `Expression::StaticMemberExpression`.
    #[inline]
    pub(super) fn transform_static_member_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::StaticMemberExpression(member) = expr else { unreachable!() };
        if member.object.is_super() {
            *expr = self.transform_static_member_expression_impl(member, false, ctx);
        }
    }

    fn transform_static_member_expression_impl(
        &mut self,
        member: &StaticMemberExpression<'a>,
        is_callee: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let property = &member.property;
        let property = ctx.ast.expression_string_literal(property.span, property.name, None);
        self.create_super_prop_get(member.span, property, is_callee, ctx)
    }

    /// Transform computed member expression where object is `super`.
    ///
    /// `super[prop]` -> `_superPropGet(_Class, prop, _Class)`
    //
    // `#[inline]` so that compiler sees that `expr` is an `Expression::ComputedMemberExpression`.
    #[inline]
    pub(super) fn transform_computed_member_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::ComputedMemberExpression(member) = expr else { unreachable!() };
        if member.object.is_super() {
            *expr = self.transform_computed_member_expression_impl(member, false, ctx);
        }
    }

    fn transform_computed_member_expression_impl(
        &mut self,
        member: &mut ComputedMemberExpression<'a>,
        is_callee: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let property = member.expression.take_in(ctx.ast);
        self.create_super_prop_get(member.span, property, is_callee, ctx)
    }

    /// Transform call expression where callee contains `super`.
    ///
    /// `super.method()` -> `_superPropGet(_Class, "method", _Class, 2)([])`
    /// `super.method(1)` -> `_superPropGet(_Class, "method", _Class, 2)([1])`
    //
    // `#[inline]` so can bail out fast without a function call if `callee` is not a member expression
    // with `super` as member expression object (fairly rare).
    // Actual transform is broken out into separate functions.
    #[inline]
    pub(super) fn transform_call_expression_for_super_member_expr(
        &mut self,
        call_expr: &mut CallExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        match &call_expr.callee {
            Expression::StaticMemberExpression(member) if member.object.is_super() => {
                self.transform_call_expression_for_super_static_member_expr(call_expr, ctx);
            }
            Expression::ComputedMemberExpression(member) if member.object.is_super() => {
                self.transform_call_expression_for_super_computed_member_expr(call_expr, ctx);
            }
            _ => {}
        }
    }

    fn transform_call_expression_for_super_static_member_expr(
        &mut self,
        call_expr: &mut CallExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let callee = &mut call_expr.callee;
        let Expression::StaticMemberExpression(member) = callee else { unreachable!() };
        *callee = self.transform_static_member_expression_impl(member, true, ctx);
        Self::transform_super_call_expression_arguments(&mut call_expr.arguments, ctx);
    }

    fn transform_call_expression_for_super_computed_member_expr(
        &mut self,
        call_expr: &mut CallExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let callee = &mut call_expr.callee;
        let Expression::ComputedMemberExpression(member) = callee else { unreachable!() };
        *callee = self.transform_computed_member_expression_impl(member, true, ctx);
        Self::transform_super_call_expression_arguments(&mut call_expr.arguments, ctx);
    }

    /// [A, B, C] -> [[A, B, C]]
    fn transform_super_call_expression_arguments(
        arguments: &mut ArenaVec<'a, Argument<'a>>,
        ctx: &TraverseCtx<'a>,
    ) {
        let elements = arguments.drain(..).map(ArrayExpressionElement::from);
        let elements = ctx.ast.vec_from_iter(elements);
        let array = ctx.ast.expression_array(SPAN, elements);
        arguments.push(Argument::from(array));
    }

    /// Transform assignment expression where the left-hand side is a member expression with `super`.
    ///
    /// * `super.prop = value`
    ///   -> `_superPropSet(_Class, "prop", value, _Class, 1)`
    /// * `super.prop += value`
    ///   -> `_superPropSet(_Class, "prop", _superPropGet(_Class, "prop", _Class) + value, _Class, 1)`
    /// * `super.prop &&= value`
    ///   -> `_superPropGet(_Class, "prop", _Class) && _superPropSet(_Class, "prop", value, _Class, 1)`
    ///
    /// * `super[prop] = value`
    ///   -> `_superPropSet(_Class, prop, value, _Class, 1)`
    /// * `super[prop] += value`
    ///   -> `_superPropSet(_Class, prop, _superPropGet(_Class, prop, _Class) + value, _Class, 1)`
    /// * `super[prop] &&= value`
    ///   -> `_superPropGet(_Class, prop, _Class) && _superPropSet(_Class, prop, value, _Class, 1)`
    //
    // `#[inline]` so can bail out fast without a function call if `left` is not a member expression
    // with `super` as member expression object (fairly rare).
    // Actual transform is broken out into separate functions.
    pub(super) fn transform_assignment_expression_for_super_assignment_target(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::AssignmentExpression(assign_expr) = expr else { unreachable!() };
        match &assign_expr.left {
            AssignmentTarget::StaticMemberExpression(member) if member.object.is_super() => {
                self.transform_assignment_expression_for_super_static_member_expr(expr, ctx);
            }
            AssignmentTarget::ComputedMemberExpression(member) if member.object.is_super() => {
                self.transform_assignment_expression_for_super_computed_member_expr(expr, ctx);
            }
            _ => {}
        }
    }

    /// Transform assignment expression where the left-hand side is a static member expression
    /// with `super`.
    ///
    /// * `super.prop = value`
    ///   -> `_superPropSet(_Class, "prop", value, _Class, 1)`
    /// * `super.prop += value`
    ///   -> `_superPropSet(_Class, "prop", _superPropGet(_Class, "prop", _Class) + value, _Class, 1)`
    /// * `super.prop &&= value`
    ///   -> `_superPropGet(_Class, "prop", _Class) && _superPropSet(_Class, "prop", value, _Class, 1)`
    //
    // `#[inline]` so that compiler sees that `expr` is an `Expression::AssignmentExpression`.
    #[inline]
    fn transform_assignment_expression_for_super_static_member_expr(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::AssignmentExpression(assign_expr) = expr.take_in(ctx.ast) else {
            unreachable!()
        };
        let AssignmentExpression { span, operator, right: value, left } = assign_expr.unbox();
        let AssignmentTarget::StaticMemberExpression(member) = left else { unreachable!() };
        let property =
            ctx.ast.expression_string_literal(member.property.span, member.property.name, None);
        *expr =
            self.transform_super_assignment_expression_impl(span, operator, property, value, ctx);
    }

    /// Transform assignment expression where the left-hand side is a computed member expression
    /// with `super` as member expr object.
    ///
    /// * `super[prop] = value`
    ///   -> `_superPropSet(_Class, prop, value, _Class, 1)`
    /// * `super[prop] += value`
    ///   -> `_superPropSet(_Class, prop, _superPropGet(_Class, prop, _Class) + value, _Class, 1)`
    /// * `super[prop] &&= value`
    ///   -> `_superPropGet(_Class, prop, _Class) && _superPropSet(_Class, prop, value, _Class, 1)`
    ///
    // `#[inline]` so that compiler sees that `expr` is an `Expression::AssignmentExpression`.
    #[inline]
    fn transform_assignment_expression_for_super_computed_member_expr(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::AssignmentExpression(assign_expr) = expr.take_in(ctx.ast) else {
            unreachable!()
        };
        let AssignmentExpression { span, operator, right: value, left } = assign_expr.unbox();
        let AssignmentTarget::ComputedMemberExpression(member) = left else { unreachable!() };
        let property = member.unbox().expression.into_inner_expression();
        *expr =
            self.transform_super_assignment_expression_impl(span, operator, property, value, ctx);
    }

    /// Transform assignment expression where the left-hand side is a member expression with `super`
    /// as member expr object.
    ///
    /// * `=` -> `_superPropSet(_Class, <prop>, <value>, _Class, 1)`
    /// * `+=` -> `_superPropSet(_Class, <prop>, _superPropGet(_Class, <prop>, _Class) + <value>, 1)`
    /// * `&&=` -> `_superPropGet(_Class, <prop>, _Class) && _superPropSet(_Class, <prop>, <value>, _Class, 1)`
    fn transform_super_assignment_expression_impl(
        &mut self,
        span: Span,
        operator: AssignmentOperator,
        property: Expression<'a>,
        value: Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        if operator == AssignmentOperator::Assign {
            // `super[prop] = value` -> `_superPropSet(_Class, prop, value, _Class, 1)`
            self.create_super_prop_set(span, property, value, ctx)
        } else {
            // Make 2 copies of `object`
            let (property1, property2) = self.class_properties.duplicate_object(property, ctx);

            if let Some(operator) = operator.to_binary_operator() {
                // `super[prop] += value`
                // -> `_superPropSet(_Class, prop, _superPropGet(_Class, prop, _Class) + value, _Class, 1)`

                // `_superPropGet(_Class, prop, _Class)`
                let get_call = self.create_super_prop_get(SPAN, property2, false, ctx);

                // `_superPropGet(_Class, prop, _Class) + value`
                let value = ctx.ast.expression_binary(SPAN, get_call, operator, value);

                // `_superPropSet(_Class, prop, _superPropGet(_Class, prop, _Class) + value, 1)`
                self.create_super_prop_set(span, property1, value, ctx)
            } else if let Some(operator) = operator.to_logical_operator() {
                // `super[prop] &&= value`
                // -> `_superPropGet(_Class, prop, _Class) && _superPropSet(_Class, prop, value, _Class, 1)`

                // `_superPropGet(_Class, prop, _Class)`
                let get_call = self.create_super_prop_get(SPAN, property1, false, ctx);

                // `_superPropSet(_Class, prop, value, _Class, 1)`
                let set_call = self.create_super_prop_set(span, property2, value, ctx);

                // `_superPropGet(_Class, prop, _Class) && _superPropSet(_Class, prop, value, _Class, 1)`
                ctx.ast.expression_logical(span, get_call, operator, set_call)
            } else {
                // The above covers all types of `AssignmentOperator`
                unreachable!();
            }
        }
    }

    /// Transform update expression where the argument is a member expression with `super`.
    ///
    /// * `++super.prop` or `super.prop--`
    ///   See [`Self::transform_update_expression_for_super_static_member_expr`]
    ///
    /// * `++super[prop]` or `super[prop]--`
    ///   See [`Self::transform_update_expression_for_super_computed_member_expr`]
    //
    // `#[inline]` so can bail out fast without a function call if `argument` is not a member expression
    // with `super` as member expression object (fairly rare).
    // Actual transform is broken out into separate functions.
    pub(super) fn transform_update_expression_for_super_assignment_target(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::UpdateExpression(update_expr) = expr else { unreachable!() };

        match &update_expr.argument {
            SimpleAssignmentTarget::StaticMemberExpression(member) if member.object.is_super() => {
                self.transform_update_expression_for_super_static_member_expr(expr, ctx);
            }
            SimpleAssignmentTarget::ComputedMemberExpression(member)
                if member.object.is_super() =>
            {
                self.transform_update_expression_for_super_computed_member_expr(expr, ctx);
            }
            _ => {}
        }
    }

    /// Transform update expression (`++` or `--`) where argument is a static member expression
    /// with `super`.
    ///
    /// * `++super.prop` ->
    /// ```js
    /// _superPropSet(
    ///   _Outer,
    ///   "prop",
    ///   (
    ///     _super$prop = _superPropGet(_Outer, "prop", _Outer),
    ///     ++_super$prop
    ///   ),
    ///   _Outer,
    ///   1
    /// )
    /// ```
    ///
    /// * `super.prop--` ->
    /// ```js
    /// (
    ///   _superPropSet(
    ///     _Outer,
    ///     "prop",
    ///     (
    ///       _super$prop = _superPropGet(_Outer, "prop", _Outer),
    ///       _super$prop2 = _super$prop--,
    ///       _super$prop
    ///     ),
    ///     _Outer,
    ///     1
    ///   ),
    ///   _super$prop2
    /// )
    /// ```
    ///
    // `#[inline]` so that compiler sees that `expr` is an `Expression::UpdateExpression`.
    #[inline]
    fn transform_update_expression_for_super_static_member_expr(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::UpdateExpression(mut update_expr) = expr.take_in(ctx.ast) else {
            unreachable!()
        };
        let SimpleAssignmentTarget::StaticMemberExpression(member) = &mut update_expr.argument
        else {
            unreachable!()
        };

        let temp_var_name_base = get_var_name_from_node(member.as_ref());

        let property =
            ctx.ast.expression_string_literal(member.property.span, member.property.name, None);

        *expr = self.transform_super_update_expression_impl(
            &temp_var_name_base,
            update_expr,
            property,
            ctx,
        );
    }

    /// Transform update expression (`++` or `--`) where argument is a computed member expression
    /// with `super`.
    ///
    /// * `++super[prop]` ->
    /// ```js
    /// _superPropSet(
    ///   _Outer,
    ///   prop,
    ///   (
    ///     _super$prop = _superPropGet(_Outer, prop, _Outer),
    ///     ++_super$prop
    ///   ),
    ///   _Outer,
    ///   1
    /// )
    /// ```
    ///
    /// * `super[prop]--` ->
    /// ```js
    /// (
    ///   _superPropSet(
    ///     _Outer,
    ///     prop,
    ///     (
    ///       _super$prop = _superPropGet(_Outer, prop, _Outer),
    ///       _super$prop2 = _super$prop--,
    ///       _super$prop
    ///     ),
    ///     _Outer,
    ///     1
    ///   ),
    ///   _super$prop2
    /// )
    /// ```
    //
    // `#[inline]` so that compiler sees that `expr` is an `Expression::UpdateExpression`.
    #[inline]
    fn transform_update_expression_for_super_computed_member_expr(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::UpdateExpression(mut update_expr) = expr.take_in(ctx.ast) else {
            unreachable!()
        };
        let SimpleAssignmentTarget::ComputedMemberExpression(member) = &mut update_expr.argument
        else {
            unreachable!()
        };

        let temp_var_name_base = get_var_name_from_node(member.as_ref());

        let property = member.expression.get_inner_expression_mut().take_in(ctx.ast);

        *expr = self.transform_super_update_expression_impl(
            &temp_var_name_base,
            update_expr,
            property,
            ctx,
        );
    }

    /// Transform update expression (`++` or `--`) where argument is a member expression with `super`.
    ///
    /// * `++super[prop]` ->
    /// ```js
    /// _superPropSet(
    ///   _Outer,
    ///   prop,
    ///   (
    ///     _super$prop = _superPropGet(_Outer, prop, _Outer),
    ///     ++_super$prop
    ///   ),
    ///   _Outer,
    ///   1
    /// )
    /// ```
    ///
    /// * `super[prop]--` ->
    /// ```js
    /// (
    ///   _superPropSet(
    ///     _Outer,
    ///     prop,
    ///     (
    ///       _super$prop = _superPropGet(_Outer, prop, _Outer),
    ///       _super$prop2 = _super$prop--,
    ///       _super$prop
    ///     ),
    ///     _Outer,
    ///     1
    ///   ),
    ///   _super$prop2
    /// )
    /// ```
    fn transform_super_update_expression_impl(
        &mut self,
        temp_var_name_base: &str,
        mut update_expr: ArenaBox<'a, UpdateExpression<'a>>,
        property: Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        // Make 2 copies of `property`
        let (property1, property2) = self.class_properties.duplicate_object(property, ctx);

        // `_superPropGet(_Class, prop, _Class)`
        let get_call = self.create_super_prop_get(SPAN, property2, false, ctx);

        // `_super$prop = _superPropGet(_Class, prop, _Class)`
        let temp_binding =
            self.class_properties.ctx.var_declarations.create_uid_var(temp_var_name_base, ctx);
        let assignment = create_assignment(&temp_binding, get_call, ctx);

        // `++_super$prop` / `_super$prop++` (reusing existing `UpdateExpression`)
        let span = update_expr.span;
        let prefix = update_expr.prefix;
        update_expr.span = SPAN;
        update_expr.argument = temp_binding.create_read_write_simple_target(ctx);
        let update_expr = Expression::UpdateExpression(update_expr);

        if prefix {
            // Source = `++super$prop` (prefix `++`)
            // `(_super$prop = _superPropGet(_Class, prop, _Class), ++_super$prop)`
            let value = ctx
                .ast
                .expression_sequence(SPAN, ctx.ast.vec_from_array([assignment, update_expr]));
            // `_superPropSet(_Class, prop, value, _Class, 1)`
            self.create_super_prop_set(span, property1, value, ctx)
        } else {
            // Source = `super.prop++` (postfix `++`)
            // `_super$prop2 = _super$prop++`
            let temp_binding2 =
                self.class_properties.ctx.var_declarations.create_uid_var(temp_var_name_base, ctx);
            let assignment2 = create_assignment(&temp_binding2, update_expr, ctx);

            // `(_super$prop = _superPropGet(_Class, prop, _Class), _super$prop2 = _super$prop++, _super$prop)`
            let value = ctx.ast.expression_sequence(
                SPAN,
                ctx.ast.vec_from_array([
                    assignment,
                    assignment2,
                    temp_binding.create_read_expression(ctx),
                ]),
            );

            // `_superPropSet(_Class, prop, value, _Class, 1)`
            let set_call = self.create_super_prop_set(span, property1, value, ctx);
            // `(_superPropSet(_Class, prop, value, _Class, 1), _super$prop2)`
            ctx.ast.expression_sequence(
                span,
                ctx.ast.vec_from_array([set_call, temp_binding2.create_read_expression(ctx)]),
            )
        }
    }

    /// Member:
    ///  `_superPropGet(_Class, prop, _Class)`
    ///
    /// Callee:
    ///  `_superPropGet(_Class, prop, _Class, 2)`
    fn create_super_prop_get(
        &mut self,
        span: Span,
        property: Expression<'a>,
        is_callee: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let (class, receiver) = self.get_class_binding_arguments(ctx);
        let property = Argument::from(property);

        let arguments = if is_callee {
            // `(_Class, prop, _Class, 2)`
            let two = ctx.ast.expression_numeric_literal(SPAN, 2.0, None, NumberBase::Decimal);
            ctx.ast.vec_from_array([class, property, receiver, Argument::from(two)])
        } else {
            // `(_Class, prop, _Class)`
            ctx.ast.vec_from_array([class, property, receiver])
        };

        // `_superPropGet(_Class, prop, _Class)` or `_superPropGet(_Class, prop, _Class, 2)`
        self.class_properties.ctx.helper_call_expr(Helper::SuperPropGet, span, arguments, ctx)
    }

    /// `_superPropSet(_Class, prop, value, _Class, 1)`
    fn create_super_prop_set(
        &mut self,
        span: Span,
        property: Expression<'a>,
        value: Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let (class, receiver) = self.get_class_binding_arguments(ctx);
        let arguments = ctx.ast.vec_from_array([
            class,
            Argument::from(property),
            Argument::from(value),
            receiver,
            Argument::from(ctx.ast.expression_numeric_literal(
                SPAN,
                1.0,
                None,
                NumberBase::Decimal,
            )),
        ]);
        self.class_properties.ctx.helper_call_expr(Helper::SuperPropSet, span, arguments, ctx)
    }

    /// * [`ClassPropertiesSuperConverterMode::Static`]
    ///   (_Class, _Class)
    ///
    /// * [`ClassPropertiesSuperConverterMode::PrivateMethod`]
    ///   (_Class.prototype, this)
    ///
    /// * [`ClassPropertiesSuperConverterMode::StaticPrivateMethod`]
    ///   (_Class, this)
    fn get_class_binding_arguments(
        &mut self,
        ctx: &mut TraverseCtx<'a>,
    ) -> (Argument<'a>, Argument<'a>) {
        let temp_binding =
            self.class_properties.current_class_mut().bindings.get_or_init_static_binding(ctx);
        let mut class = temp_binding.create_read_expression(ctx);
        let receiver = match self.mode {
            ClassPropertiesSuperConverterMode::Static => temp_binding.create_read_expression(ctx),
            ClassPropertiesSuperConverterMode::PrivateMethod => {
                // TODO(improve-on-babel): `superPropGet` and `superPropSet` helper function has a flag
                // to use `class.prototype` rather than `class`. We should consider using that flag here.
                // <https://github.com/babel/babel/blob/1fbdb64a7fcc3488797e312506dbacff746d4e41/packages/babel-helpers/src/helpers/superPropGet.ts>
                class = create_prototype_member(class, ctx);
                ctx.ast.expression_this(SPAN)
            }
            ClassPropertiesSuperConverterMode::StaticPrivateMethod => ctx.ast.expression_this(SPAN),
        };

        (Argument::from(class), Argument::from(receiver))
    }
}
