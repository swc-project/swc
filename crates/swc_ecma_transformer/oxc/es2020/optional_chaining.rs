//! ES2020: Optional Chaining
//!
//! This plugin transforms [`ChainExpression`] into a series of `null` and `void 0` checks,
//! resulting in a conditional expression.
//!
//! > This plugin is included in `preset-env`, in ES2020.
//!
//! ## Example
//!
//! Input:
//! ```js
//! const foo = {};
//! // Read
//! foo?.bar?.bar;
//! // Call
//! foo?.bar?.baz?.();
//! // Delete
//! delete foo?.bar?.baz;
//! ```
//!
//! Output:
//! ```js
//! var _foo$bar, _foo$bar2, _foo$bar2$baz, _foo$bar3;
//! const foo = {};
//! // Read
//! foo === null || foo === void 0 || (_foo$bar = foo.bar) === null ||
//!   _foo$bar === void 0 ? void 0 : _foo$bar.bar;
//! // Call
//! foo === null || foo === void 0 || (_foo$bar2 = foo.bar) === null ||
//!   _foo$bar2 === void 0 || (_foo$bar2$baz = _foo$bar2.baz) === null ||
//!   _foo$bar2$baz === void 0 ? void 0 : _foo$bar2$baz.call(_foo$bar2);
//! // Delete
//! foo === null || foo === void 0 || (_foo$bar3 = foo.bar) === null ||
//!   _foo$bar3 === void 0 ? true : delete _foo$bar3.baz;
//! ```
//!
//! ## Implementation
//!
//! Due to the different architecture, we found it hard to port the implementation from Babel directly;
//! however, our implementation is written based on Babel’s transformed output.
//!
//! Nevertheless, our outputs still have some differences from Babel’s output.
//!
//! ## References
//!
//! * Babel docs: <https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining>
//! * Babel implementation: <https://github.com/babel/babel/tree/v7.26.2/packages/babel-plugin-transform-optional-chaining>
//! * Optional chaining TC39 proposal: <https://github.com/tc39/proposal-optional-chaining>

use std::mem;

use oxc_allocator::{CloneIn, TakeIn};
use oxc_ast::{NONE, ast::*};
use oxc_span::SPAN;
use oxc_traverse::{Ancestor, BoundIdentifier, MaybeBoundIdentifier, Traverse};

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
    utils::ast_builder::wrap_expression_in_arrow_function_iife,
};

#[derive(Debug)]
enum CallContext<'a> {
    /// `new.target?.()`
    None,
    /// `super.method?.()`
    This,
    /// All other cases
    Binding(MaybeBoundIdentifier<'a>),
}

pub struct OptionalChaining<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,

    // states
    is_inside_function_parameter: bool,
    temp_binding: Option<BoundIdentifier<'a>>,
    /// .call(context)
    ///       ^^^^^^^
    call_context: CallContext<'a>,
}

impl<'a, 'ctx> OptionalChaining<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self {
            ctx,
            is_inside_function_parameter: false,
            temp_binding: None,
            call_context: CallContext::None,
        }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for OptionalChaining<'a, '_> {
    // `#[inline]` because this is a hot path
    #[inline]
    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        match expr {
            Expression::ChainExpression(_) => self.transform_chain_expression(expr, ctx),
            Expression::UnaryExpression(unary_expr)
                if unary_expr.operator == UnaryOperator::Delete
                    && matches!(unary_expr.argument, Expression::ChainExpression(_)) =>
            {
                self.transform_update_expression(expr, ctx);
            }
            _ => {}
        }
    }

    // `#[inline]` because this is a hot path
    #[inline]
    fn enter_formal_parameters(&mut self, _: &mut FormalParameters<'a>, _: &mut TraverseCtx<'a>) {
        self.is_inside_function_parameter = true;
    }

    // `#[inline]` because this is a hot path
    #[inline]
    fn exit_formal_parameters(
        &mut self,
        _node: &mut FormalParameters<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        self.is_inside_function_parameter = false;
    }
}

impl<'a> OptionalChaining<'a, '_> {
    fn set_temp_binding(&mut self, binding: BoundIdentifier<'a>) {
        self.temp_binding.replace(binding);
    }

    fn set_binding_context(&mut self, binding: MaybeBoundIdentifier<'a>) {
        self.call_context = CallContext::Binding(binding);
    }

    fn set_this_context(&mut self) {
        self.call_context = CallContext::This;
    }

    /// Get the call context from [`Self::call_context`]
    fn get_call_context(&self, ctx: &mut TraverseCtx<'a>) -> Argument<'a> {
        debug_assert!(!matches!(self.call_context, CallContext::None));
        Argument::from(if let CallContext::Binding(binding) = &self.call_context {
            binding.create_read_expression(ctx)
        } else {
            ctx.ast.expression_this(SPAN)
        })
    }

    /// Given an IdentifierReference which is [`CallExpression::callee`] to compare with the collected context
    fn should_specify_context(
        &self,
        ident: &IdentifierReference<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> bool {
        match &self.call_context {
            CallContext::None => false,
            CallContext::This => true,
            CallContext::Binding(binding) => {
                binding.name != ident.name
                    || binding.symbol_id.is_some_and(|symbol_id| {
                        ctx.scoping()
                            .get_reference(ident.reference_id())
                            .symbol_id()
                            .is_some_and(|id| id != symbol_id)
                    })
            }
        }
    }

    /// Check if we should create a temp variable for the identifier.
    ///
    /// Except for `eval`, we should create a temp variable for all global references.
    ///
    /// If no temp variable required, returns `MaybeBoundIdentifier` for existing variable/global.
    /// If temp variable is required, returns `None`.
    fn get_existing_binding_for_identifier(
        &self,
        ident: &IdentifierReference<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Option<MaybeBoundIdentifier<'a>> {
        let binding = MaybeBoundIdentifier::from_identifier_reference(ident, ctx);
        if self.ctx.assumptions.pure_getters
            || binding.to_bound_identifier().is_some()
            || ident.name == "eval"
        {
            Some(binding)
        } else {
            None
        }
    }

    /// Return `left === null`
    fn wrap_null_check(&self, left: Expression<'a>, ctx: &TraverseCtx<'a>) -> Expression<'a> {
        let operator = if self.ctx.assumptions.no_document_all {
            BinaryOperator::Equality
        } else {
            BinaryOperator::StrictEquality
        };
        ctx.ast.expression_binary(SPAN, left, operator, ctx.ast.expression_null_literal(SPAN))
    }

    /// Return `left === void 0`
    fn wrap_void0_check(left: Expression<'a>, ctx: &TraverseCtx<'a>) -> Expression<'a> {
        let operator = BinaryOperator::StrictEquality;
        ctx.ast.expression_binary(SPAN, left, operator, ctx.ast.void_0(SPAN))
    }

    /// Return `left1 === null || left2 === void 0`
    fn wrap_optional_check(
        &self,
        left1: Expression<'a>,
        left2: Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        let null_check = self.wrap_null_check(left1, ctx);
        let void0_check = Self::wrap_void0_check(left2, ctx);
        Self::create_logical_expression(null_check, void0_check, ctx)
    }

    /// Return `left || right`
    fn create_logical_expression(
        left: Expression<'a>,
        right: Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        ctx.ast.expression_logical(SPAN, left, LogicalOperator::Or, right)
    }

    /// Return `left ? void 0 : alternative`
    ///
    /// The [`ConditionalExpression::consequent`] depends on whether
    /// `is_delete` is true or false.
    fn create_conditional_expression(
        is_delete: bool,
        test: Expression<'a>,
        alternate: Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        let consequent = if is_delete {
            ctx.ast.expression_boolean_literal(SPAN, true)
        } else {
            ctx.ast.void_0(SPAN)
        };
        ctx.ast.expression_conditional(SPAN, test, consequent, alternate)
    }

    /// Convert chain expression to expression
    ///
    /// - [ChainElement::CallExpression] -> [Expression::CallExpression]
    /// - [ChainElement::StaticMemberExpression] -> [Expression::StaticMemberExpression]
    /// - [ChainElement::ComputedMemberExpression] -> [Expression::ComputedMemberExpression]
    /// - [ChainElement::PrivateFieldExpression] -> [Expression::PrivateFieldExpression]
    /// - [ChainElement::TSNonNullExpression] -> [TSNonNullExpression::expression]
    ///
    /// `#[inline]` so that compiler sees that `expr` is an [`Expression::ChainExpression`].
    #[inline]
    fn convert_chain_expression_to_expression(
        expr: &mut Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        let Expression::ChainExpression(chain_expr) = expr.take_in(ctx.ast) else { unreachable!() };
        match chain_expr.unbox().expression {
            element @ match_member_expression!(ChainElement) => {
                Expression::from(element.into_member_expression())
            }
            ChainElement::CallExpression(call) => Expression::CallExpression(call),
            ChainElement::TSNonNullExpression(non_null) => non_null.unbox().expression,
        }
    }

    /// Return `left = right`
    fn create_assignment_expression(
        left: AssignmentTarget<'a>,
        right: Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        ctx.ast.expression_assignment(SPAN, AssignmentOperator::Assign, left, right)
    }

    /// Transform chain expression
    fn transform_chain_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        *expr = if self.is_inside_function_parameter {
            // To insert the temp binding in the correct scope, we wrap the expression with
            // an arrow function. During the chain expression transformation, the temp binding
            // will be inserted into the arrow function's body.
            wrap_expression_in_arrow_function_iife(expr.take_in(ctx.ast), ctx)
        } else {
            self.transform_chain_expression_impl(false, expr, ctx)
        }
    }

    /// Transform update expression
    fn transform_update_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        *expr = if self.is_inside_function_parameter {
            // Same as the above `transform_chain_expression` explanation
            wrap_expression_in_arrow_function_iife(expr.take_in(ctx.ast), ctx)
        } else {
            // Unfortunately no way to get compiler to see that this branch is provably unreachable.
            // We don't want to inline this function, to keep `enter_expression` as small as possible.
            let Expression::UnaryExpression(unary_expr) = expr else { unreachable!() };
            self.transform_chain_expression_impl(true, &mut unary_expr.argument, ctx)
        }
    }

    /// Transform chain expression to conditional expression which contains a lot of checks
    ///
    /// This is the root transform function for chain expressions. It calls
    /// [`Self::transform_chain_element_recursion`] to transform the chain expression elements,
    /// and then joins the transformed elements with the conditional expression.
    fn transform_chain_expression_impl(
        &mut self,
        is_delete: bool,
        chain_expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let mut chain_expr = Self::convert_chain_expression_to_expression(chain_expr, ctx);
        //      ^^^^^^^^^^ After the recursive transformation, the chain_expr will be transformed into
        //                 a pure non-optional expression and it's the last part of the chain expression.

        let left =
            self.transform_chain_element_recursion(&mut chain_expr, ctx).unwrap_or_else(|| {
                unreachable!(
                    "Given chain expression certainly contains at least one optional expression,
                 so it must return a transformed expression"
                )
            });

        // If the chain expression is an argument of a UnaryExpression and its operator is `delete`,
        // we need to wrap the last part with a `delete` unary expression
        // `delete foo?.bar` -> `... || delete _Foo.bar;`
        //                              ^^^^^^ ^^^^^^^^ Here we will wrap the right part with a `delete` unary expression
        if is_delete {
            chain_expr = ctx.ast.expression_unary(SPAN, UnaryOperator::Delete, chain_expr);
        }

        // If this chain expression is a callee of a CallExpression, we need to transform it to accept a proper context
        // `(Foo?.["m"])();` -> `(...  _Foo["m"].bind(_Foo))();`
        //                                       ^^^^^^^^^^^ Here we will handle the `right` part to bind a proper context
        if ctx.parent().is_parenthesized_expression()
            && matches!(ctx.ancestor(1), Ancestor::CallExpressionCallee(_))
        {
            chain_expr = self.transform_expression_to_bind_context(chain_expr, ctx);
        }
        // Clear states
        self.temp_binding = None;
        self.call_context = CallContext::None;

        Self::create_conditional_expression(is_delete, left, chain_expr, ctx)
    }

    /// Transform an expression to bind a proper context
    ///
    /// `Foo.bar` -> `Foo.bar.bind(context)`
    fn transform_expression_to_bind_context(
        &self,
        mut expr: Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        // Find proper context
        let context = if let Some(member) = expr.as_member_expression_mut() {
            let object = member.object_mut().get_inner_expression_mut();
            let context = if self.ctx.assumptions.pure_getters {
                // TODO: `clone_in` causes reference loss of reference id
                object.clone_in(ctx.ast.allocator)
            } else if let Expression::Identifier(ident) = object {
                MaybeBoundIdentifier::from_identifier_reference(ident, ctx)
                    .create_read_expression(ctx)
            } else {
                // `foo.bar` -> `_foo$bar = foo.bar`
                let binding = self.ctx.var_declarations.create_uid_var_based_on_node(object, ctx);
                *object = Self::create_assignment_expression(
                    binding.create_write_target(ctx),
                    object.take_in(ctx.ast),
                    ctx,
                );
                binding.create_read_expression(ctx)
            };
            Argument::from(context)
        } else {
            self.get_call_context(ctx)
        };

        // `expr.bind(context)`
        let arguments = ctx.ast.vec1(context);
        let property = ctx.ast.identifier_name(SPAN, "bind");
        let callee = ctx.ast.member_expression_static(SPAN, expr, property, false);
        let callee = Expression::from(callee);
        ctx.ast.expression_call(SPAN, callee, NONE, arguments, false)
    }

    /// Recursively transform chain expression elements
    ///
    /// ## Depth-first transformation
    ///
    /// Start from the given [`Expression`] which is converted from [`ChainExpression::expression`]
    /// by [`Self::convert_chain_expression_to_expression`], and dive into the deepest
    /// expression, until it reaches the end of the chain expression and starts to transform.
    ///
    /// ### Demonstration
    ///
    /// For the given expression `foo?.bar?.baz?.()`
    ///
    /// > NOTE: Here assume that `foo` is defined somewhere.
    ///
    /// 1. Start from the root expression `foo?.bar?.baz?.()`
    ///
    /// 2. Recurse and go into the deepest optional expression `foo?.bar`
    ///
    /// 3. The `foo?.bar` is an optional [`StaticMemberExpression`], so transform `foo` to
    ///    `foo === null || foo === void 0` and return the transformed expression back to the parent
    ///
    /// 4. Got to here, we now have a left expression as the above transformed expression, and the current expression
    ///    is `foo.bar?.baz`, and it's also an optional [`StaticMemberExpression`], so transform `foo.bar` to
    ///    `(_foo$bar = foo.bar) === null || _foo$bar === void 0` and join it with the left expression, and return
    ///    the joined expression back to the parent.
    ///
    /// > NOTE: The callee(`foo.bar`) is assigned to a temp binding(`_foo$bar`), so the original callee is also replaced with
    /// > the temp binding(`_foo$bar`)
    ///
    /// 5. Repeat the above steps until back to the root expression, and the final expression will be
    ///
    /// ```js
    /// foo === null || foo === void 0 || (_foo$bar = foo.bar) === null || _foo$bar === void 0 ||
    /// (_foo$bar$baz = _foo$bar.baz) === null || _foo$bar$baz === void 0;
    /// ```
    ///
    /// After transformation, the passed-in expression will be replaced with `_foo$bar$baz.call(_foo$bar)`,
    /// and it will be used to construct the final conditional expression in [`Self::transform_chain_expression`]
    fn transform_chain_element_recursion(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        // Skip parenthesized expression or other TS-syntax expressions
        let expr = expr.get_inner_expression_mut();
        match expr {
            // `(foo?.bar)?.baz`
            //  ^^^^^^^^^^ The nested chain expression is always under the ParenthesizedExpression
            Expression::ChainExpression(_) => {
                *expr = Self::convert_chain_expression_to_expression(expr, ctx);
                self.transform_chain_element_recursion(expr, ctx)
            }
            // `foo?.bar?.baz`
            Expression::StaticMemberExpression(member) => {
                let left = self.transform_chain_element_recursion(&mut member.object, ctx);
                if member.optional {
                    member.optional = false;
                    Some(self.transform_optional_expression(false, left, &mut member.object, ctx))
                } else {
                    left
                }
            }
            // `foo?.[bar]?.[baz]`
            Expression::ComputedMemberExpression(member) => {
                let left = self.transform_chain_element_recursion(&mut member.object, ctx);
                if member.optional {
                    member.optional = false;
                    Some(self.transform_optional_expression(false, left, &mut member.object, ctx))
                } else {
                    left
                }
            }
            // `this?.#foo?.bar`
            Expression::PrivateFieldExpression(member) => {
                let left = self.transform_chain_element_recursion(&mut member.object, ctx);
                if member.optional {
                    member.optional = false;
                    Some(self.transform_optional_expression(false, left, &mut member.object, ctx))
                } else {
                    left
                }
            }
            // `foo?.bar?.bar?.()`
            Expression::CallExpression(call) => {
                let left = self.transform_chain_element_recursion(&mut call.callee, ctx);
                if call.optional {
                    call.optional = false;
                    let callee = call.callee.get_inner_expression_mut();
                    let left = Some(self.transform_optional_expression(true, left, callee, ctx));

                    if !self.ctx.assumptions.pure_getters {
                        // After transformation of the callee, this call expression may lose the original context,
                        // so we need to check if we need to specify the context.
                        if let Expression::Identifier(ident) = callee
                            && self.should_specify_context(ident, ctx)
                        {
                            // `foo$bar(...)` -> `foo$bar.call(context, ...)`
                            let callee = callee.take_in(ctx.ast);
                            let property = ctx.ast.identifier_name(SPAN, "call");
                            let member =
                                ctx.ast.member_expression_static(SPAN, callee, property, false);
                            call.callee = Expression::from(member);
                            call.arguments.insert(0, self.get_call_context(ctx));
                        }
                    }

                    left
                } else {
                    left
                }
            }
            _ => None,
        }
    }

    /// Transform optional expressions
    ///
    /// - `foo` -> `foo === null || foo === void 0`
    /// - `foo.bar` -> `(foo$bar = foo.bar) === null || foo$bar === void 0`
    ///
    /// NOTE: After transformation, the original expression will be replaced with the temp binding
    fn transform_optional_expression(
        &mut self,
        is_call: bool,
        left: Option<Expression<'a>>,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        if let Some(left) = left {
            return self.transform_and_join_expression(is_call, left, expr, ctx);
        }

        // Skip parenthesized expression or other TS-syntax expressions
        let expr = expr.get_inner_expression_mut();

        // If the expression is an identifier and it's not a global reference, we just wrap it with checks
        // `foo` -> `foo === null || foo === void 0`
        if let Expression::Identifier(ident) = expr
            && let Some(binding) = self.get_existing_binding_for_identifier(ident, ctx)
        {
            if ident.name == "eval" {
                // `eval?.()` is an indirect eval call transformed to `(0,eval)()`
                let zero = ctx.ast.number_0();
                let original_callee = expr.take_in(ctx.ast);
                let expressions = ctx.ast.vec_from_array([zero, original_callee]);
                *expr = ctx.ast.expression_sequence(SPAN, expressions);
            }

            let left1 = binding.create_read_expression(ctx);
            let replacement = if self.ctx.assumptions.no_document_all {
                // `foo === null`
                self.wrap_null_check(left1, ctx)
            } else {
                // `foo === null || foo === void 0`
                let left2 = binding.create_read_expression(ctx);
                self.wrap_optional_check(left1, left2, ctx)
            };
            self.set_binding_context(binding);
            return replacement;
        }

        // We should generate a temp binding for the expression first to avoid the next step changing the expression.
        let temp_binding = self.ctx.var_declarations.create_uid_var_based_on_node(expr, ctx);
        if is_call && !self.ctx.assumptions.pure_getters {
            self.set_chain_call_context(expr, ctx);
        }

        // Replace the expression with the temp binding and assign the original expression to the temp binding
        let expr = mem::replace(expr, temp_binding.create_read_expression(ctx));
        // `(binding = expr)`
        let assignment_expression =
            Self::create_assignment_expression(temp_binding.create_write_target(ctx), expr, ctx);
        let expr = if self.ctx.assumptions.no_document_all {
            // `(binding = expr) === null`
            self.wrap_null_check(assignment_expression, ctx)
        } else {
            // `(binding = expr) === null || binding === void 0`
            self.wrap_optional_check(
                assignment_expression,
                temp_binding.create_read_expression(ctx),
                ctx,
            )
        };

        self.set_temp_binding(temp_binding);
        expr
    }

    /// Transform the expression and join it with the `left` expression
    ///
    /// - `left || (binding = expr) === null || binding === void 0`
    ///
    /// NOTE: After transformation, the original expression will be replaced with the temp binding
    fn transform_and_join_expression(
        &mut self,
        is_call: bool,
        left: Expression<'a>,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        if is_call {
            // We cannot reuse the temp binding for calls because we need to
            // store both the method and the receiver.
            // And because we will create a new temp binding for the callee and the original temp binding
            // will become the call context, we take the current temp binding and set it
            // as the call context.
            if let Some(temp_binding) = self.temp_binding.take() {
                self.set_binding_context(temp_binding.to_maybe_bound_identifier());
            }
            self.set_chain_call_context(expr, ctx);
        }

        let temp_binding = {
            if self.temp_binding.is_none() {
                let binding = self.ctx.var_declarations.create_uid_var_based_on_node(expr, ctx);
                self.set_temp_binding(binding);
            }
            self.temp_binding.as_ref().unwrap()
        };

        // Replace the expression with the temp binding and assign the original expression to the temp binding
        let expr = mem::replace(expr, temp_binding.create_read_expression(ctx));
        // `(binding = expr)`
        let assignment_expression =
            Self::create_assignment_expression(temp_binding.create_write_target(ctx), expr, ctx);

        // `left || (binding = expr) === null`
        let left = Self::create_logical_expression(
            left,
            self.wrap_null_check(assignment_expression, ctx),
            ctx,
        );

        if self.ctx.assumptions.no_document_all {
            left
        } else {
            let reference = temp_binding.create_read_expression(ctx);
            // `left || (binding = expr) === null || binding === void 0`
            Self::create_logical_expression(left, Self::wrap_void0_check(reference, ctx), ctx)
        }
    }

    fn set_chain_call_context(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(member) = expr.as_member_expression_mut() {
            let object = member.object_mut();
            // If the [`MemberExpression::object`] is a global reference, we need to assign it to a temp binding.
            // i.e `foo` -> `(_foo = foo)`
            if matches!(object, Expression::Super(_) | Expression::ThisExpression(_)) {
                self.set_this_context();
            } else {
                let binding = object
                    .get_identifier_reference()
                    .and_then(|ident| self.get_existing_binding_for_identifier(ident, ctx))
                    .unwrap_or_else(|| {
                        let binding =
                            self.ctx.var_declarations.create_uid_var_based_on_node(object, ctx);
                        // `(_foo = foo)`
                        *object = Self::create_assignment_expression(
                            binding.create_write_target(ctx),
                            object.take_in(ctx.ast),
                            ctx,
                        );
                        binding.to_maybe_bound_identifier()
                    });
                self.set_binding_context(binding);
            }
        }
    }
}
