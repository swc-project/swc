//! ES2016: Exponentiation Operator
//!
//! This plugin transforms the exponentiation operator (`**`) to `Math.pow`.
//!
//! > This plugin is included in `preset-env`, in ES2016
//!
//! ## Example
//!
//! Input:
//! ```js
//! let x = 10 ** 2;
//! x **= 3;
//! obj.prop **= 4;
//! ```
//!
//! Output:
//! ```js
//! let x = Math.pow(10, 2);
//! x = Math.pow(x, 3);
//! obj["prop"] = Math.pow(obj["prop"], 4);
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-exponentiation-operator](https://babel.dev/docs/babel-plugin-transform-exponentiation-operator).
//!
//! ## References:
//!
//! * Babel plugin implementation:
//!   <https://github.com/babel/babel/blob/v7.26.2/packages/babel-plugin-transform-exponentiation-operator>
//!   <https://github.com/babel/babel/tree/v7.26.2/packages/babel-helper-builder-binary-assignment-operator-visitor>
//! * Exponentiation operator TC39 proposal: <https://github.com/tc39/proposal-exponentiation-operator>
//! * Exponentiation operator specification: <https://tc39.es/ecma262/#sec-exp-operator>

use oxc_allocator::{CloneIn, TakeIn, Vec as ArenaVec};
use oxc_ast::{NONE, ast::*};
use oxc_semantic::ReferenceFlags;
use oxc_span::SPAN;
use oxc_syntax::operator::{AssignmentOperator, BinaryOperator};
use oxc_traverse::{BoundIdentifier, Traverse};

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

pub struct ExponentiationOperator<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> ExponentiationOperator<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { ctx }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ExponentiationOperator<'a, '_> {
    // Note: Do not transform to `Math.pow` with BigInt arguments - that's a runtime error
    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        match expr {
            // `left ** right`
            Expression::BinaryExpression(binary_expr) => {
                if binary_expr.operator != BinaryOperator::Exponential
                    || binary_expr.left.is_big_int_literal()
                    || binary_expr.right.is_big_int_literal()
                {
                    return;
                }

                Self::convert_binary_expression(expr, ctx);
            }
            // `left **= right`
            Expression::AssignmentExpression(assign_expr) => {
                if assign_expr.operator != AssignmentOperator::Exponential
                    || assign_expr.right.is_big_int_literal()
                {
                    return;
                }

                match &assign_expr.left {
                    AssignmentTarget::AssignmentTargetIdentifier(_) => {
                        self.convert_identifier_assignment(expr, ctx);
                    }
                    AssignmentTarget::StaticMemberExpression(_) => {
                        self.convert_static_member_expression_assignment(expr, ctx);
                    }
                    AssignmentTarget::ComputedMemberExpression(_) => {
                        self.convert_computed_member_expression_assignment(expr, ctx);
                    }
                    // Babel refuses to transform this: "We can't generate property ref for private name,
                    // please install `@babel/plugin-transform-class-properties`".
                    // But there's no reason not to.
                    AssignmentTarget::PrivateFieldExpression(_) => {
                        self.convert_private_field_assignment(expr, ctx);
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }
}

impl<'a> ExponentiationOperator<'a, '_> {
    /// Convert `BinaryExpression`.
    ///
    /// `left ** right` -> `Math.pow(left, right)`
    //
    // `#[inline]` so compiler knows `expr` is a `BinaryExpression`
    #[inline]
    fn convert_binary_expression(expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        let binary_expr = match expr.take_in(ctx.ast) {
            Expression::BinaryExpression(binary_expr) => binary_expr.unbox(),
            _ => unreachable!(),
        };
        *expr = Self::math_pow(binary_expr.left, binary_expr.right, ctx);
    }

    /// Convert `AssignmentExpression` where assignee is an identifier.
    ///
    /// `left **= right` transformed to:
    /// * If `left` is a bound symbol:
    ///   -> `left = Math.pow(left, right)`
    /// * If `left` is unbound:
    ///   -> `var _left; _left = left, left = Math.pow(_left, right)`
    ///
    /// Temporary variable `_left` is to avoid side-effects of getting `left` from running twice.
    //
    // `#[inline]` so compiler knows `expr` is an `AssignmentExpression` with `IdentifierReference` on left
    #[inline]
    fn convert_identifier_assignment(&self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        let Expression::AssignmentExpression(assign_expr) = expr else { unreachable!() };
        let AssignmentTarget::AssignmentTargetIdentifier(ident) = &mut assign_expr.left else {
            unreachable!()
        };

        let (pow_left, temp_var_inits) = self.get_pow_left_identifier(ident, ctx);
        Self::convert_assignment(assign_expr, pow_left, ctx);
        Self::revise_expression(expr, temp_var_inits, ctx);
    }

    /// Get left side of `Math.pow(pow_left, ...)` for identifier
    fn get_pow_left_identifier(
        &self,
        ident: &IdentifierReference<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> (
        // Left side of `Math.pow(pow_left, ...)`
        Expression<'a>,
        // Temporary var initializations
        ArenaVec<'a, Expression<'a>>,
    ) {
        let mut temp_var_inits = ctx.ast.vec();

        // Make sure side-effects of evaluating `left` only happen once
        let reference = ctx.scoping.scoping_mut().get_reference_mut(ident.reference_id());

        // `left **= right` is being transformed to `left = Math.pow(left, right)`,
        // so `left` in `left =` is no longer being read from
        *reference.flags_mut() = ReferenceFlags::Write;

        let pow_left = if let Some(symbol_id) = reference.symbol_id() {
            // This variable is declared in scope so evaluating it multiple times can't trigger a getter.
            // No need for a temp var.
            ctx.create_bound_ident_expr(SPAN, ident.name, symbol_id, ReferenceFlags::Read)
        } else {
            // Unbound reference. Could possibly trigger a getter so we need to only evaluate it once.
            // Assign to a temp var.
            let reference = ctx.create_unbound_ident_expr(SPAN, ident.name, ReferenceFlags::Read);
            let binding = self.create_temp_var(reference, &mut temp_var_inits, ctx);
            binding.create_read_expression(ctx)
        };

        (pow_left, temp_var_inits)
    }

    /// Convert `AssignmentExpression` where assignee is a static member expression.
    ///
    /// `obj.prop **= right` transformed to:
    /// * If `obj` is a bound symbol:
    ///   -> `obj["prop"] = Math.pow(obj["prop"], right)`
    /// * If `obj` is unbound:
    ///   -> `var _obj; _obj = obj, _obj["prop"] = Math.pow(_obj["prop"], right)`
    ///
    /// `obj.foo.bar.qux **= right` transformed to:
    /// ```js
    /// var _obj$foo$bar;
    /// _obj$foo$bar = obj.foo.bar, _obj$foo$bar["qux"] = Math.pow(_obj$foo$bar["qux"], right)
    /// ```
    ///
    /// Temporary variables are to avoid side-effects of getting `obj` / `obj.foo.bar` being run twice.
    ///
    /// TODO(improve-on-babel): `obj.prop` does not need to be transformed to `obj["prop"]`.
    //
    // `#[inline]` so compiler knows `expr` is an `AssignmentExpression` with `StaticMemberExpression` on left
    #[inline]
    fn convert_static_member_expression_assignment(
        &self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::AssignmentExpression(assign_expr) = expr else { unreachable!() };
        let AssignmentTarget::StaticMemberExpression(member_expr) = &mut assign_expr.left else {
            unreachable!()
        };

        let (replacement_left, pow_left, temp_var_inits) =
            self.get_pow_left_static_member(member_expr, ctx);
        assign_expr.left = replacement_left;
        Self::convert_assignment(assign_expr, pow_left, ctx);
        Self::revise_expression(expr, temp_var_inits, ctx);
    }

    /// Get left side of `Math.pow(pow_left, ...)` for static member expression
    /// and replacement for left side of assignment.
    fn get_pow_left_static_member(
        &self,
        member_expr: &mut StaticMemberExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> (
        // Replacement left of assignment
        AssignmentTarget<'a>,
        // Left side of `Math.pow(pow_left, ...)`
        Expression<'a>,
        // Temporary var initializations
        ArenaVec<'a, Expression<'a>>,
    ) {
        // Object part of 2nd member expression
        // ```
        // obj["prop"] = Math.pow(obj["prop"], right)
        //                        ^^^
        // ```
        let mut temp_var_inits = ctx.ast.vec();
        let obj = self.get_second_member_expression_object(
            &mut member_expr.object,
            &mut temp_var_inits,
            ctx,
        );

        // Property part of 2nd member expression
        // ```
        // obj["prop"] = Math.pow(obj["prop"], right)
        //                            ^^^^^^
        // ```
        let prop_span = member_expr.property.span;
        let prop_name = member_expr.property.name;
        let prop = ctx.ast.expression_string_literal(prop_span, prop_name, None);

        // Complete 2nd member expression
        // ```
        // obj["prop"] = Math.pow(obj["prop"], right)
        //                        ^^^^^^^^^^^
        // ```
        let pow_left = Expression::from(ctx.ast.member_expression_computed(SPAN, obj, prop, false));

        // Replacement for original member expression
        // ```
        // obj["prop"] = Math.pow(obj["prop"], right)
        // ^^^^^^^^^^^
        // ```
        let replacement_left =
            AssignmentTarget::ComputedMemberExpression(ctx.ast.alloc_computed_member_expression(
                member_expr.span,
                member_expr.object.take_in(ctx.ast),
                ctx.ast.expression_string_literal(prop_span, prop_name, None),
                false,
            ));

        (replacement_left, pow_left, temp_var_inits)
    }

    /// Convert `AssignmentExpression` where assignee is a computed member expression.
    ///
    /// `obj[prop] **= right` transformed to:
    /// * If `obj` is a bound symbol:
    ///   -> `var _prop; _prop = prop, obj[_prop] = Math.pow(obj[_prop], 2)`
    /// * If `obj` is unbound:
    ///   -> `var _obj, _prop; _obj = obj, _prop = prop, _obj[_prop] = Math.pow(_obj[_prop], 2)`
    ///
    /// `obj.foo.bar[qux] **= right` transformed to:
    /// ```js
    /// var _obj$foo$bar, _qux;
    /// _obj$foo$bar = obj.foo.bar, _qux = qux, _obj$foo$bar[_qux] = Math.pow(_obj$foo$bar[_qux], right)
    /// ```
    ///
    /// Temporary variables are to avoid side-effects of getting `obj` / `obj.foo.bar` or `prop` being run twice.
    ///
    /// TODO(improve-on-babel):
    /// 1. If `prop` is bound, it doesn't need a temp variable `_prop`.
    /// 2. Temp var initializations could be inlined:
    ///    * Current: `(_obj = obj, _prop = prop, _obj[_prop] = Math.pow(_obj[_prop], 2))`
    ///    * Could be: `(_obj = obj)[_prop = prop] = Math.pow(_obj[_prop], 2)`
    //
    // `#[inline]` so compiler knows `expr` is an `AssignmentExpression` with `ComputedMemberExpression` on left
    #[inline]
    fn convert_computed_member_expression_assignment(
        &self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::AssignmentExpression(assign_expr) = expr else { unreachable!() };
        let AssignmentTarget::ComputedMemberExpression(member_expr) = &mut assign_expr.left else {
            unreachable!()
        };

        let (pow_left, temp_var_inits) = self.get_pow_left_computed_member(member_expr, ctx);
        Self::convert_assignment(assign_expr, pow_left, ctx);
        Self::revise_expression(expr, temp_var_inits, ctx);
    }

    /// Get left side of `Math.pow(pow_left, ...)` for computed member expression
    fn get_pow_left_computed_member(
        &self,
        member_expr: &mut ComputedMemberExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> (
        // Left side of `Math.pow(pow_left, ...)`
        Expression<'a>,
        // Temporary var initializations
        ArenaVec<'a, Expression<'a>>,
    ) {
        // Object part of 2nd member expression
        // ```
        // obj[_prop] = Math.pow(obj[_prop], right)
        //                       ^^^
        // ```
        let mut temp_var_inits = ctx.ast.vec();
        let obj = self.get_second_member_expression_object(
            &mut member_expr.object,
            &mut temp_var_inits,
            ctx,
        );

        // Property part of 2nd member expression
        // ```
        // obj[_prop] = Math.pow(obj[_prop], right)
        //     ^^^^^ replaced        ^^^^^ prop
        // ```
        let prop = &mut member_expr.expression;
        let prop = if prop.is_literal() {
            prop.clone_in(ctx.ast.allocator)
        } else {
            let owned_prop = prop.take_in(ctx.ast);
            let binding = self.create_temp_var(owned_prop, &mut temp_var_inits, ctx);
            *prop = binding.create_read_expression(ctx);
            binding.create_read_expression(ctx)
        };

        // Complete 2nd member expression
        // ```
        // obj[_prop] = Math.pow(obj[_prop], right)
        //                       ^^^^^^^^^^
        // ```
        let pow_left = Expression::from(ctx.ast.member_expression_computed(SPAN, obj, prop, false));

        (pow_left, temp_var_inits)
    }

    /// Convert `AssignmentExpression` where assignee is a private field member expression.
    ///
    /// `obj.#prop **= right` transformed to:
    /// * If `obj` is a bound symbol:
    ///   -> `obj.#prop = Math.pow(obj.#prop, right)`
    /// * If `obj` is unbound:
    ///   -> `var _obj; _obj = obj, _obj.#prop = Math.pow(_obj.#prop, right)`
    ///
    /// `obj.foo.bar.#qux **= right` transformed to:
    /// ```js
    /// var _obj$foo$bar;
    /// _obj$foo$bar = obj.foo.bar, _obj$foo$bar.#qux = Math.pow(_obj$foo$bar.#qux, right)
    /// ```
    ///
    /// Temporary variable is to avoid side-effects of getting `obj` / `obj.foo.bar` being run twice.
    //
    // `#[inline]` so compiler knows `expr` is an `AssignmentExpression` with `PrivateFieldExpression` on left
    #[inline]
    fn convert_private_field_assignment(
        &self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::AssignmentExpression(assign_expr) = expr else { unreachable!() };
        let AssignmentTarget::PrivateFieldExpression(member_expr) = &mut assign_expr.left else {
            unreachable!()
        };

        let (pow_left, temp_var_inits) = self.get_pow_left_private_field(member_expr, ctx);
        Self::convert_assignment(assign_expr, pow_left, ctx);
        Self::revise_expression(expr, temp_var_inits, ctx);
    }

    /// Get left side of `Math.pow(pow_left, ...)` for static member expression
    /// and replacement for left side of assignment.
    fn get_pow_left_private_field(
        &self,
        field_expr: &mut PrivateFieldExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> (
        // Left side of `Math.pow(pow_left, ...)`
        Expression<'a>,
        // Temporary var initializations
        ArenaVec<'a, Expression<'a>>,
    ) {
        // Object part of 2nd member expression
        // ```
        // obj.#prop = Math.pow(obj.#prop, right)
        //                      ^^^
        // ```
        let mut temp_var_inits = ctx.ast.vec();
        let obj = self.get_second_member_expression_object(
            &mut field_expr.object,
            &mut temp_var_inits,
            ctx,
        );

        // Property part of 2nd member expression
        // ```
        // obj.#prop = Math.pow(obj.#prop, right)
        //                          ^^^^^
        // ```
        let field = field_expr.field.clone();

        // Complete 2nd member expression
        // ```
        // obj.#prop = Math.pow(obj.#prop, right)
        //                      ^^^^^^^^^
        // ```
        let pow_left = Expression::from(
            ctx.ast.member_expression_private_field_expression(SPAN, obj, field, false),
        );

        (pow_left, temp_var_inits)
    }

    /// Get object part of 2nd member expression to be used as `left` in `Math.pow(left, right)`.
    ///
    /// Also update the original `obj` passed in to function, and add a temp var initializer, if necessary.
    ///
    /// Original:
    /// ```js
    /// obj.prop **= 2`
    /// ^^^ original `obj` passed in to this function
    /// ```
    ///
    /// is transformed to:
    ///
    /// If `obj` is a bound symbol:
    /// ```js
    /// obj["prop"] = Math.pow(obj["prop"], 2)
    /// ^^^ not updated        ^^^ returned
    /// ```
    ///
    /// If `obj` is unbound:
    /// ```js
    /// var _obj;
    /// _obj = obj, _obj["prop"] = Math.pow(_obj["prop"], 2)
    ///             ^^^^ updated            ^^^^ returned
    /// ^^^^^^^^^^ added to `temp_var_inits`
    /// ```
    ///
    /// Original:
    /// ```js
    /// obj.foo.bar.qux **= 2
    /// ^^^^^^^^^^^ original `obj` passed in to this function
    /// ```
    /// is transformed to:
    /// ```js
    /// var _obj$foo$bar;
    /// _obj$foo$bar = obj.foo.bar, _obj$foo$bar["qux"] = Math.pow(_obj$foo$bar["qux"], 2)
    ///                             ^^^^^^^^^^^^ updated           ^^^^^^^^^^^^ returned
    /// ^^^^^^^^^^^^^^^^^^^^^^^^^^ added to `temp_var_inits`
    /// ```
    fn get_second_member_expression_object(
        &self,
        obj: &mut Expression<'a>,
        temp_var_inits: &mut ArenaVec<'a, Expression<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        // If the object reference that we need to save is locally declared, evaluating it multiple times
        // will not trigger getters or setters. `super` cannot be directly assigned, so use it directly too.
        // TODO(improve-on-babel): We could also skip creating a temp var for `this.x **= 2`.
        match obj {
            Expression::Super(super_) => return ctx.ast.expression_super(super_.span),
            Expression::Identifier(ident) => {
                let symbol_id = ctx.scoping().get_reference(ident.reference_id()).symbol_id();
                if let Some(symbol_id) = symbol_id {
                    // This variable is declared in scope so evaluating it multiple times can't trigger a getter.
                    // No need for a temp var.
                    return ctx.create_bound_ident_expr(
                        SPAN,
                        ident.name,
                        symbol_id,
                        ReferenceFlags::Read,
                    );
                }
                // Unbound reference. Could possibly trigger a getter so we need to only evaluate it once.
                // Assign to a temp var.
            }
            _ => {
                // Other expression. Assign to a temp var.
            }
        }

        let binding = self.create_temp_var(obj.take_in(ctx.ast), temp_var_inits, ctx);
        *obj = binding.create_read_expression(ctx);
        binding.create_read_expression(ctx)
    }

    /// `x **= right` -> `x = Math.pow(pow_left, right)` (with provided `pow_left`)
    fn convert_assignment(
        assign_expr: &mut AssignmentExpression<'a>,
        pow_left: Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let pow_right = assign_expr.right.take_in(ctx.ast);
        assign_expr.right = Self::math_pow(pow_left, pow_right, ctx);
        assign_expr.operator = AssignmentOperator::Assign;
    }

    /// If needs temp var initializers, replace expression `expr` with `(temp1, temp2, expr)`.
    fn revise_expression(
        expr: &mut Expression<'a>,
        mut temp_var_inits: ArenaVec<'a, Expression<'a>>,
        ctx: &TraverseCtx<'a>,
    ) {
        if !temp_var_inits.is_empty() {
            temp_var_inits.reserve_exact(1);
            temp_var_inits.push(expr.take_in(ctx.ast));
            *expr = ctx.ast.expression_sequence(SPAN, temp_var_inits);
        }
    }

    /// `Math.pow(left, right)`
    fn math_pow(
        left: Expression<'a>,
        right: Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let math_symbol_id = ctx.scoping().find_binding(ctx.current_scope_id(), "Math");
        let object =
            ctx.create_ident_expr(SPAN, Atom::from("Math"), math_symbol_id, ReferenceFlags::Read);
        let property = ctx.ast.identifier_name(SPAN, "pow");
        let callee =
            Expression::from(ctx.ast.member_expression_static(SPAN, object, property, false));
        let arguments = ctx.ast.vec_from_array([Argument::from(left), Argument::from(right)]);
        ctx.ast.expression_call(SPAN, callee, NONE, arguments, false)
    }

    /// Create a temporary variable.
    /// Add a `var _name;` statement to enclosing scope.
    /// Add initialization expression `_name = expr` to `temp_var_inits`.
    /// Return `BoundIdentifier` for the temp var.
    fn create_temp_var(
        &self,
        expr: Expression<'a>,
        temp_var_inits: &mut ArenaVec<'a, Expression<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> BoundIdentifier<'a> {
        // var _name;
        let binding = self.ctx.var_declarations.create_uid_var_based_on_node(&expr, ctx);

        // Add new reference `_name = name` to `temp_var_inits`
        temp_var_inits.push(ctx.ast.expression_assignment(
            SPAN,
            AssignmentOperator::Assign,
            binding.create_write_target(ctx),
            expr,
        ));

        binding
    }
}
