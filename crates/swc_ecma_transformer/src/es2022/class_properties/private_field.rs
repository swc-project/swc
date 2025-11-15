//! ES2022: Class Properties
//! Transform of private property uses e.g. `this.#prop`.

use std::mem;

use oxc_allocator::{Box as ArenaBox, TakeIn};
use oxc_ast::{NONE, ast::*};
use oxc_span::SPAN;
use oxc_syntax::{reference::ReferenceId, symbol::SymbolId};
use oxc_traverse::{Ancestor, BoundIdentifier, ast_operations::get_var_name_from_node};

use crate::{
    common::helper_loader::Helper,
    context::{TransformCtx, TraverseCtx},
    utils::ast_builder::{
        create_assignment, create_bind_call, create_call_call, create_member_callee,
    },
};

use super::{
    ClassProperties, ResolvedPrivateProp,
    class_details::ResolvedGetSetPrivateProp,
    utils::{
        create_underscore_ident_name, debug_assert_expr_is_not_parenthesis_or_typescript_syntax,
    },
};

impl<'a> ClassProperties<'a, '_> {
    /// Transform private field expression.
    ///
    /// Not loose:
    /// * Instance prop: `object.#prop` -> `_classPrivateFieldGet2(_prop, object)`
    /// * Static prop: `object.#prop` -> `_assertClassBrand(Class, object, _prop)._`
    /// * Instance method: `object.#method` -> `_assertClassBrand(_Class_brand, object, _prop)`
    /// * Static method: `object.#method` -> `_assertClassBrand(Class, object, _prop)`
    /// * Instance getter: `object.#getter` -> `get_getter.call(_assertClassBrand(_Class_brand, object))`
    /// * Static getter: `object.#getter` -> `get_getter.call(_assertClassBrand(Class, object))`
    /// * Instance setter: `object.#setter` -> `set_setter.bind(_assertClassBrand(_Class_brand, object))`
    /// * Static setter: `object.#setter` -> `set_setter.bind(_assertClassBrand(Class, object))`
    ///
    /// Loose: `object.#prop` -> `_classPrivateFieldLooseBase(object, _prop)[_prop]`
    //
    // `#[inline]` so that compiler sees that `expr` is an `Expression::PrivateFieldExpression`.
    #[inline]
    pub(super) fn transform_private_field_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::PrivateFieldExpression(field_expr) = expr else { unreachable!() };
        *expr = self.transform_private_field_expression_impl(field_expr, false, ctx);
    }

    fn transform_private_field_expression_impl(
        &mut self,
        field_expr: &mut PrivateFieldExpression<'a>,
        is_assignment: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let span = field_expr.span;
        let object = field_expr.object.take_in(ctx.ast);
        let resolved = if is_assignment {
            match self.classes_stack.find_writeable_private_prop(&field_expr.field) {
                Some(prop) => prop,
                _ => {
                    // Early return for read-only error
                    return self.create_sequence_with_read_only_error(
                        &field_expr.field.name,
                        object,
                        None,
                        span,
                        ctx,
                    );
                }
            }
        } else {
            match self.classes_stack.find_readable_private_prop(&field_expr.field) {
                Some(prop) => prop,
                _ => {
                    // Early return for write-only error
                    return self.create_sequence_with_write_only_error(
                        &field_expr.field.name,
                        object,
                        span,
                        ctx,
                    );
                }
            }
        };

        let ResolvedPrivateProp {
            prop_binding,
            class_bindings,
            is_static,
            is_method,
            is_accessor,
            is_declaration,
        } = resolved;

        if self.private_fields_as_properties {
            // `_classPrivateFieldLooseBase(object, _prop)[_prop]`
            return Expression::from(Self::create_private_field_member_expr_loose(
                object,
                prop_binding,
                span,
                self.ctx,
                ctx,
            ));
        }

        let prop_ident = prop_binding.create_read_expression(ctx);

        if is_static {
            // TODO: Ensure there are tests for nested classes with references to private static props
            // of outer class inside inner class, to make sure we're getting the right `class_bindings`.

            // If `object` is reference to class name, there's no need for the class brand assertion
            if let Some((class_symbol_id, object_reference_id)) = Self::shortcut_static_class(
                is_declaration,
                class_bindings.name_symbol_id(),
                &object,
                ctx,
            ) {
                if is_method {
                    if is_assignment {
                        // `toSetter(_prop.bind(object), [])._`
                        self.create_to_setter_for_bind_call(prop_ident, object, span, ctx)
                    } else if is_accessor {
                        // `_prop.call(object)`
                        create_call_call(prop_ident, object, span, ctx)
                    } else {
                        ctx.scoping_mut()
                            .delete_resolved_reference(class_symbol_id, object_reference_id);
                        // `_prop`
                        prop_ident
                    }
                } else {
                    ctx.scoping_mut()
                        .delete_resolved_reference(class_symbol_id, object_reference_id);
                    // `_prop._`
                    Self::create_underscore_member_expression(prop_ident, span, ctx)
                }
            } else {
                // `_assertClassBrand(Class, object, _prop)._`
                let class_binding = class_bindings.get_or_init_static_binding(ctx);
                let class_ident = class_binding.create_read_expression(ctx);
                if is_method {
                    if is_assignment {
                        // `toSetter(_prop.bind(object), [])._`
                        let object =
                            self.create_assert_class_brand_without_value(class_ident, object, ctx);
                        self.create_to_setter_for_bind_call(prop_ident, object, span, ctx)
                    } else if is_accessor {
                        // `_prop.bind(_assertClassBrand(Class, object))`
                        let object =
                            self.create_assert_class_brand_without_value(class_ident, object, ctx);
                        create_call_call(prop_ident, object, span, ctx)
                    } else {
                        self.create_assert_class_brand(class_ident, object, prop_ident, span, ctx)
                    }
                } else {
                    self.create_assert_class_brand_underscore(
                        class_ident,
                        object,
                        prop_ident,
                        span,
                        ctx,
                    )
                }
            }
        } else if is_method {
            let brand_ident = class_bindings.brand().create_read_expression(ctx);
            if is_assignment {
                // `_toSetter(_prop.call(_assertClassBrand(_Class_brand, object)))._`
                let object = self.create_assert_class_brand_without_value(brand_ident, object, ctx);
                self.create_to_setter_for_bind_call(prop_ident, object, span, ctx)
            } else if is_accessor {
                // `_prop.bind(_assertClassBrand(_Class_brand, object))`
                let object = self.create_assert_class_brand_without_value(brand_ident, object, ctx);
                create_call_call(prop_ident, object, span, ctx)
            } else {
                self.create_assert_class_brand(brand_ident, object, prop_ident, span, ctx)
            }
        } else if is_assignment {
            // `_toSetter(_classPrivateFieldSet2, [_prop, object])._`
            self.create_to_setter_for_private_field_set(prop_ident, object, span, ctx)
        } else {
            // `_classPrivateFieldGet2(_prop, object)`
            self.create_private_field_get(prop_ident, object, span, ctx)
        }
    }

    /// Check if can use shorter version of static private prop transform.
    ///
    /// Can if all of:
    /// 1. Class is a declaration, not an expression.
    /// 2. Class has a name.
    /// 3. `object` is an `IdentifierReference` referring to class name binding.
    ///
    /// If can use shorter version, returns `SymbolId` and `ReferenceId` of the `IdentifierReference`.
    //
    // TODO(improve-on-babel): No reason not to use the short version for class expressions too.
    // TODO: Take `&ClassBindings` instead of `Option<SymbolId>`.
    fn shortcut_static_class(
        is_declaration: bool,
        class_symbol_id: Option<SymbolId>,
        object: &Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Option<(SymbolId, ReferenceId)> {
        if is_declaration
            && let Some(class_symbol_id) = class_symbol_id
            && let Expression::Identifier(ident) = object
        {
            let reference_id = ident.reference_id();
            if let Some(symbol_id) = ctx.scoping().get_reference(reference_id).symbol_id()
                && symbol_id == class_symbol_id
            {
                return Some((class_symbol_id, reference_id));
            }
        }

        None
    }

    /// Transform call expression where callee is private field.
    ///
    /// Not loose:
    /// * Instance prop: `object.#prop(arg)` -> `_classPrivateFieldGet2(_prop, object).call(object, arg)`
    /// * Static prop: `object.#prop(arg)` -> `_assertClassBrand(Class, object, _prop)._.call(object, arg)`
    /// * Instance method: `object.#method(arg)` -> `_assertClassBrand(_Class_brand, object, _prop).call(object, arg)`
    /// * Static method: `object.#method(arg)` -> `_assertClassBrand(Class, object, _prop).call(object, arg)`
    ///
    /// Loose: `object.#prop(arg)` -> `_classPrivateFieldLooseBase(object, _prop)[_prop](arg)`
    ///
    /// Output in all cases contains a `CallExpression`, so mutate existing `CallExpression`
    /// rather than creating a new one.
    //
    // `#[inline]` so that compiler sees that `expr` is an `Expression::CallExpression`
    #[inline]
    pub(super) fn transform_call_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::CallExpression(call_expr) = expr else { unreachable!() };
        if matches!(&call_expr.callee, Expression::PrivateFieldExpression(_)) {
            self.transform_call_expression_impl(call_expr, ctx);
        }
    }

    fn transform_call_expression_impl(
        &mut self,
        call_expr: &mut CallExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        // Unfortunately no way to make compiler see that this branch is provably unreachable.
        // This function is much too large to inline.
        let Expression::PrivateFieldExpression(field_expr) = &mut call_expr.callee else {
            unreachable!()
        };

        if self.private_fields_as_properties {
            // `object.#prop(arg)` -> `_classPrivateFieldLooseBase(object, _prop)[_prop](arg)`
            let prop_binding = self.classes_stack.find_private_prop(&field_expr.field).prop_binding;

            let object = field_expr.object.take_in(ctx.ast);
            call_expr.callee = Expression::from(Self::create_private_field_member_expr_loose(
                object,
                prop_binding,
                field_expr.span,
                self.ctx,
                ctx,
            ));
            return;
        }

        let (callee, object) = self.transform_private_field_callee(field_expr, ctx);
        Self::substitute_callee_and_insert_context(call_expr, callee, object, ctx);
    }

    /// Substitute callee and add object as first argument to call expression.
    ///
    /// Non-Optional:
    ///  * `callee(...arguments)` -> `callee.call(object, ...arguments)`
    ///
    /// Optional:
    ///  * `callee?.(...arguments)` -> `callee?.call(object, ...arguments)`
    fn substitute_callee_and_insert_context(
        call_expr: &mut CallExpression<'a>,
        callee: Expression<'a>,
        context: Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) {
        // Substitute `<callee>.call` as callee of call expression
        call_expr.callee = Expression::from(ctx.ast.member_expression_static(
            SPAN,
            callee,
            ctx.ast.identifier_name(SPAN, Atom::from("call")),
            // Make sure the `callee` can access `call` safely. i.e `callee?.()` -> `callee?.call()`
            mem::replace(&mut call_expr.optional, false),
        ));
        // Insert `context` to call arguments
        call_expr.arguments.insert(0, Argument::from(context));
    }

    /// Transform [`CallExpression::callee`] or [`TaggedTemplateExpression::tag`] that is a private field.
    ///
    /// Returns two expressions for `callee` and `object`:
    ///
    /// Instance prop:
    /// * `this.#prop` ->
    ///   callee: `_classPrivateFieldGet(_prop, this)`
    ///   object: `this`
    /// * `this.obj.#prop` ->
    ///   callee: `_classPrivateFieldGet(_prop, _this$obj = this.obj);`
    ///   object: `_this$obj`
    ///
    /// Static prop:
    /// * `this.#prop` ->
    ///   callee: `_assertClassBrand(Class, this, _prop)._`
    ///   object: `this`
    /// * `this.obj.#prop` ->
    ///   callee: `_assertClassBrand(Class, (_this$obj = this.obj), _prop)._`
    ///   object: `_this$obj`
    fn transform_private_field_callee(
        &mut self,
        field_expr: &mut PrivateFieldExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> (Expression<'a>, Expression<'a>) {
        let span = field_expr.span;
        // `(object.#method)()`
        //  ^^^^^^^^^^^^^^^^ is a parenthesized expression
        let object = field_expr.object.get_inner_expression_mut().take_in(ctx.ast);

        let Some(ResolvedPrivateProp {
            prop_binding,
            class_bindings,
            is_static,
            is_method,
            is_accessor,
            is_declaration,
        }) = self.classes_stack.find_readable_private_prop(&field_expr.field)
        else {
            let (object1, object2) = self.duplicate_object(object, ctx);
            return (
                self.create_sequence_with_write_only_error(
                    &field_expr.field.name,
                    object1,
                    span,
                    ctx,
                ),
                object2,
            );
        };

        let prop_ident = prop_binding.create_read_expression(ctx);

        // Get replacement for callee

        if is_static {
            // `object.#prop(arg)` -> `_assertClassBrand(Class, object, _prop)._.call(object, arg)`
            // or shortcut `_prop._.call(object, arg)`

            // TODO: Ensure there are tests for nested classes with references to private static props
            // of outer class inside inner class, to make sure we're getting the right `class_bindings`.

            // If `object` is reference to class name, there's no need for the class brand assertion
            // TODO: Combine this check with `duplicate_object`. Both check if `object` is an identifier,
            // and look up the `SymbolId`
            if Self::shortcut_static_class(
                is_declaration,
                class_bindings.name_symbol_id(),
                &object,
                ctx,
            )
            .is_some()
            {
                if is_method {
                    // (`_prop`, object)
                    (prop_ident, object)
                } else if is_accessor {
                    // `(_prop.call(object), object)`
                    let (object1, object2) = self.duplicate_object(object, ctx);
                    let callee = create_call_call(prop_ident, object1, span, ctx);
                    (callee, object2)
                } else {
                    // (`_prop._`, object)
                    (Self::create_underscore_member_expression(prop_ident, span, ctx), object)
                }
            } else {
                let class_binding = class_bindings.get_or_init_static_binding(ctx);
                let class_ident = class_binding.create_read_expression(ctx);

                // Make 2 copies of `object`
                let (object1, object2) = self.duplicate_object(object, ctx);

                let assert_obj = if is_method {
                    if is_accessor {
                        // `_prop.call(_assertClassBrand(Class, object))`
                        let object =
                            self.create_assert_class_brand_without_value(class_ident, object1, ctx);
                        create_call_call(prop_ident, object, span, ctx)
                    } else {
                        // `_assertClassBrand(Class, object, _prop)`
                        self.create_assert_class_brand(class_ident, object1, prop_ident, span, ctx)
                    }
                } else {
                    // `_assertClassBrand(Class, object, _prop)._`
                    self.create_assert_class_brand_underscore(
                        class_ident,
                        object1,
                        prop_ident,
                        span,
                        ctx,
                    )
                };

                (assert_obj, object2)
            }
        } else if is_method {
            let brand_binding = class_bindings.brand();
            let brand_ident = brand_binding.create_read_expression(ctx);
            // `object.#method(arg)` -> `_assetClassBrand(_Class_brand, _prop, object).call(object, arg)`
            // Make 2 copies of `object`
            let (object1, object2) = self.duplicate_object(object, ctx);

            // `(_Class_brand, this)`
            let callee = if is_accessor {
                // `_prop.call(_assertClassBrand(_Class_brand, object))`
                let object =
                    self.create_assert_class_brand_without_value(brand_ident, object1, ctx);
                create_call_call(prop_ident, object, span, ctx)
            } else {
                // `_assertClassBrand(_Class_brand, object, _prop)`
                self.create_assert_class_brand(brand_ident, object1, prop_ident, span, ctx)
            };
            (callee, object2)
        } else {
            // `object.#prop(arg)` -> `_classPrivateFieldGet2(_prop, object).call(object, arg)`
            // Make 2 copies of `object`
            let (object1, object2) = self.duplicate_object(object, ctx);

            // `_classPrivateFieldGet2(_prop, object)`
            (self.create_private_field_get(prop_ident, object1, span, ctx), object2)
        }
    }

    /// Transform assignment to private field.
    ///
    /// Not loose:
    /// * Instance: See [`ClassProperties::transform_instance_assignment_expression`].
    /// * Static: See [`ClassProperties::transform_static_assignment_expression`].
    ///
    /// Loose: `object.#prop = value` -> `_classPrivateFieldLooseBase(object, _prop)[_prop] = value`.
    //
    // `#[inline]` so that compiler sees that `expr` is an `Expression::AssignmentExpression`
    #[inline]
    pub(super) fn transform_assignment_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::AssignmentExpression(assign_expr) = expr else { unreachable!() };
        if matches!(&assign_expr.left, AssignmentTarget::PrivateFieldExpression(_)) {
            self.transform_assignment_expression_impl(expr, ctx);
        }
    }

    fn transform_assignment_expression_impl(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        // Unfortunately no way to make compiler see that these branches are provably unreachable.
        // This function is much too large to inline, because `transform_static_assignment_expression`
        // and `transform_instance_assignment_expression` are inlined into it.
        let Expression::AssignmentExpression(assign_expr) = expr else { unreachable!() };
        let AssignmentTarget::PrivateFieldExpression(field_expr) = &mut assign_expr.left else {
            unreachable!()
        };

        let ResolvedGetSetPrivateProp {
            get_binding,
            set_binding,
            class_bindings,
            is_static,
            is_declaration,
            is_method,
            ..
        } = self.classes_stack.find_get_set_private_prop(&field_expr.field);

        if self.private_fields_as_properties {
            // `object.#prop = value` -> `_classPrivateFieldLooseBase(object, _prop)[_prop] = value`
            // Same for all other assignment operators e.g. `+=`, `&&=`, `??=`.
            let object = field_expr.object.take_in(ctx.ast);
            let replacement = Self::create_private_field_member_expr_loose(
                object,
                // At least one of `get_binding` or `set_binding` is always present
                get_binding.unwrap_or_else(|| set_binding.as_ref().unwrap()),
                field_expr.span,
                self.ctx,
                ctx,
            );
            assign_expr.left = AssignmentTarget::from(replacement);
            return;
        }

        // Note: `transform_static_assignment_expression` and `transform_instance_assignment_expression`
        // are marked `#[inline]`, so hopefully compiler will see that clones of `BoundIdentifier`s
        // can be elided.
        // Can't break this up into separate functions otherwise, as `&BoundIdentifier`s keep `&self` ref
        // taken by `lookup_private_property` alive.
        // TODO: Try to find a way around this.
        if is_static && !is_method {
            // TODO: No temp var is required if able to use shortcut version, so want to skip calling
            // `class_bindings.get_or_init_temp_binding(ctx)` if shortcut can be used.
            // But can't pass `class_bindings` as a `&mut ClassBinding` into
            // `transform_static_assignment_expression` due to borrow-checker restrictions.
            // If clone it, then any update to `temp` field is not stored globally, so that doesn't work.
            // Solution will have to be to break up `transform_static_assignment_expression` into 2 methods
            // for shortcut/no shortcut and do the "can we shortcut?" check here.
            // Then only create temp var for the "no shortcut" branch, and clone the resulting binding
            // before passing it to the "no shortcut" method. What a palaver!
            let class_binding = class_bindings.get_or_init_static_binding(ctx);
            let class_binding = class_binding.clone();
            let class_symbol_id = class_bindings.name_symbol_id();
            // Unwrap is safe because `is_method` is false, then static private prop is always have a `get_binding`
            // and `set_binding` and they are always are the same.
            let prop_binding = get_binding.cloned().unwrap();

            self.transform_static_assignment_expression(
                expr,
                &prop_binding,
                &class_binding,
                class_symbol_id,
                is_declaration,
                ctx,
            );
        } else if !is_method || !assign_expr.operator.is_assign() || set_binding.is_none() {
            let class_binding = is_method.then(|| {
                if is_static {
                    class_bindings.get_or_init_static_binding(ctx).clone()
                } else {
                    class_bindings.brand().clone()
                }
            });
            let get_binding = get_binding.cloned();
            let set_binding = set_binding.cloned();

            self.transform_instance_assignment_expression(
                expr,
                get_binding.as_ref(),
                set_binding.as_ref(),
                class_binding.as_ref(),
                ctx,
            );
        } else {
            // `object.#setter = object.#setter2 = value`
            // Leave this to `transform_assignment_target` to handle
            // TODO: After we have alternative to `classPrivateSetter` helper,
            // we can handle this here.
        }
    }

    /// Transform assignment expression with static private prop as assignee.
    ///
    /// * `object.#prop = value`
    ///   -> `_prop._ = _assertClassBrand(Class, object, value)`
    /// * `object.#prop += value`
    ///   -> `_prop._ = _assertClassBrand(Class, object, _assertClassBrand(Class, object, _prop)._ + value)`
    /// * `object.#prop &&= value`
    ///   -> `_assertClassBrand(Class, object, _prop)._ && (_prop._ = _assertClassBrand(Class, object, value))`
    ///
    /// Output in some cases contains an `AssignmentExpression`, so mutate existing `AssignmentExpression`
    /// rather than creating a new one when possible.
    //
    // `#[inline]` so that compiler sees `expr` is an `Expression::AssignmentExpression` with
    // `AssignmentTarget::PrivateFieldExpression` on left, and that clones in
    // `transform_assignment_expression` can be elided.
    #[inline]
    fn transform_static_assignment_expression(
        &self,
        expr: &mut Expression<'a>,
        prop_binding: &BoundIdentifier<'a>,
        class_binding: &BoundIdentifier<'a>,
        class_symbol_id: Option<SymbolId>,
        is_declaration: bool,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::AssignmentExpression(assign_expr) = expr else { unreachable!() };
        let operator = assign_expr.operator;
        let AssignmentTarget::PrivateFieldExpression(field_expr) = &mut assign_expr.left else {
            unreachable!()
        };

        // Check if object (`object` in `object.#prop`) is a reference to class name
        // TODO: Combine this check with `duplicate_object`. Both check if `object` is an identifier,
        // and look up the `SymbolId`.
        let object_reference =
            Self::shortcut_static_class(is_declaration, class_symbol_id, &field_expr.object, ctx);

        // If `object` is reference to class name, there's no need for the class brand assertion.
        // `Class.#prop = value` -> `_prop._ = value`
        // `Class.#prop += value` -> `_prop._ = _prop._ + value`
        // `Class.#prop &&= value` -> `_prop._ && (_prop._ = 1)`
        // TODO(improve-on-babel): These shortcuts could be shorter - just swap `Class.#prop` for `_prop._`.
        // Or does that behave slightly differently if `Class.#prop` is an object with `valueOf` method?
        if let Some((class_symbol_id, object_reference_id)) = object_reference {
            // Replace left side of assignment with `_prop._`
            let field_expr_span = field_expr.span;
            assign_expr.left = Self::create_underscore_member_expr_target(
                prop_binding.create_read_expression(ctx),
                field_expr_span,
                ctx,
            );

            // Delete reference for `object` as `object.#prop` has been removed
            ctx.scoping_mut().delete_resolved_reference(class_symbol_id, object_reference_id);

            if operator == AssignmentOperator::Assign {
                // `Class.#prop = value` -> `_prop._ = value`
                // Left side already replaced with `_prop._`. Nothing further to do.
            } else {
                let prop_obj = Self::create_underscore_member_expression(
                    prop_binding.create_read_expression(ctx),
                    field_expr_span,
                    ctx,
                );

                if let Some(operator) = operator.to_binary_operator() {
                    // `Class.#prop += value` -> `_prop._ = _prop._ + value`
                    let value = assign_expr.right.take_in(ctx.ast);
                    assign_expr.operator = AssignmentOperator::Assign;
                    assign_expr.right = ctx.ast.expression_binary(SPAN, prop_obj, operator, value);
                } else if let Some(operator) = operator.to_logical_operator() {
                    // `Class.#prop &&= value` -> `_prop._ && (_prop._ = value)`
                    let span = assign_expr.span;
                    assign_expr.span = SPAN;
                    assign_expr.operator = AssignmentOperator::Assign;
                    let right = expr.take_in(ctx.ast);
                    *expr = ctx.ast.expression_logical(span, prop_obj, operator, right);
                } else {
                    // The above covers all types of `AssignmentOperator`
                    unreachable!();
                }
            }
        } else {
            // Substitute left side of assignment with `_prop._`, and get owned `object` from old left side
            let assignee = Self::create_underscore_member_expr_target(
                prop_binding.create_read_expression(ctx),
                SPAN,
                ctx,
            );
            let old_assignee = mem::replace(&mut assign_expr.left, assignee);
            let field_expr = match old_assignee {
                AssignmentTarget::PrivateFieldExpression(field_expr) => field_expr.unbox(),
                _ => unreachable!(),
            };
            let object = field_expr.object.into_inner_expression();

            let class_ident = class_binding.create_read_expression(ctx);
            let value = assign_expr.right.take_in(ctx.ast);

            if operator == AssignmentOperator::Assign {
                // Replace right side of assignment with `_assertClassBrand(Class, object, _prop)`
                // TODO: Ensure there are tests for nested classes with references to private static props
                // of outer class inside inner class, to make sure we're getting the right `class_binding`.
                assign_expr.right =
                    self.create_assert_class_brand(class_ident, object, value, SPAN, ctx);
            } else {
                let class_ident = class_binding.create_read_expression(ctx);
                let value = assign_expr.right.take_in(ctx.ast);

                // Make 2 copies of `object`
                let (object1, object2) = self.duplicate_object(object, ctx);

                let prop_ident = prop_binding.create_read_expression(ctx);
                let class_ident2 = class_binding.create_read_expression(ctx);

                if let Some(operator) = operator.to_binary_operator() {
                    // `object.#prop += value`
                    // -> `_prop._ = _assertClassBrand(Class, object, _assertClassBrand(Class, object, _prop)._ + value)`

                    // TODO(improve-on-babel): Are 2 x `_assertClassBrand` calls required?
                    // Wouldn't `_prop._ = _assertClassBrand(Class, object, _prop)._ + value` do the same?

                    // `_assertClassBrand(Class, object, _prop)._`
                    let get_expr = self.create_assert_class_brand_underscore(
                        class_ident,
                        object2,
                        prop_ident,
                        SPAN,
                        ctx,
                    );
                    // `_assertClassBrand(Class, object, _prop)._ + value`
                    let value = ctx.ast.expression_binary(SPAN, get_expr, operator, value);
                    // `_assertClassBrand(Class, object, _assertClassBrand(Class, object, _prop)._ + value)`
                    assign_expr.right =
                        self.create_assert_class_brand(class_ident2, object1, value, SPAN, ctx);
                } else if let Some(operator) = operator.to_logical_operator() {
                    // `object.#prop &&= value`
                    // -> `_assertClassBrand(Class, object, _prop)._ && (_prop._ = _assertClassBrand(Class, object, value))`

                    // TODO(improve-on-babel): Are 2 x `_assertClassBrand` calls required?
                    // Wouldn't `_assertClassBrand(Class, object, _prop)._ && _prop._ = value` do the same?

                    // `_assertClassBrand(Class, object, _prop)._`
                    let left = self.create_assert_class_brand_underscore(
                        class_ident,
                        object1,
                        prop_ident,
                        SPAN,
                        ctx,
                    );
                    // Mutate existing assignment expression to `_prop._ = _assertClassBrand(Class, object, value)`
                    // and take ownership of it
                    let span = assign_expr.span;
                    assign_expr.span = SPAN;
                    assign_expr.operator = AssignmentOperator::Assign;
                    assign_expr.right =
                        self.create_assert_class_brand(class_ident2, object2, value, SPAN, ctx);
                    let right = expr.take_in(ctx.ast);
                    // `_assertClassBrand(Class, object, _prop)._ && (_prop._ = _assertClassBrand(Class, object, value))`
                    *expr = ctx.ast.expression_logical(span, left, operator, right);
                } else {
                    // The above covers all types of `AssignmentOperator`
                    unreachable!();
                }
            }
        }
    }

    /// Transform assignment expression with instance private prop as assignee.
    ///
    /// * `object.#prop = value`
    ///   -> `_classPrivateFieldSet2(_prop, object, value)`
    /// * `object.#prop += value`
    ///   -> `_classPrivateFieldSet2(_prop, object, _classPrivateFieldGet2(_prop, object) + value)`
    /// * `object.#prop &&= value`
    ///   -> `_classPrivateFieldGet2(_prop, object) && _classPrivateFieldSet2(_prop, object, value)`
    //
    // `#[inline]` so that compiler sees `expr` is an `Expression::AssignmentExpression` with
    // `AssignmentTarget::PrivateFieldExpression` on left, and that clones in
    // `transform_assignment_expression` can be elided.
    #[inline]
    fn transform_instance_assignment_expression(
        &self,
        expr: &mut Expression<'a>,
        get_binding: Option<&BoundIdentifier<'a>>,
        set_binding: Option<&BoundIdentifier<'a>>,
        class_binding: Option<&BoundIdentifier<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let assign_expr = match expr.take_in(ctx.ast) {
            Expression::AssignmentExpression(assign_expr) => assign_expr.unbox(),
            _ => unreachable!(),
        };
        let AssignmentExpression { span, operator, right: value, left } = assign_expr;
        let AssignmentTarget::PrivateFieldExpression(field_expr) = left else { unreachable!() };
        let PrivateFieldExpression { field, object, .. } = field_expr.unbox();

        if operator == AssignmentOperator::Assign {
            // `object.#prop = value` -> `_classPrivateFieldSet2(_prop, object, value)`
            *expr = self.create_private_setter(
                &field.name,
                class_binding,
                set_binding,
                object,
                value,
                span,
                ctx,
            );
        } else {
            // Make 2 copies of `object`
            let (object1, object2) = self.duplicate_object(object.into_inner_expression(), ctx);

            if let Some(operator) = operator.to_binary_operator() {
                // `object.#prop += value`
                // -> `_classPrivateFieldSet2(_prop, object, _classPrivateFieldGet2(_prop, object) + value)`

                // `_classPrivateFieldGet2(_prop, object)`
                let get_call = self.create_private_getter(
                    &field.name,
                    class_binding,
                    get_binding,
                    object2,
                    SPAN,
                    ctx,
                );

                // `_classPrivateFieldGet2(_prop, object) + value`
                let value = ctx.ast.expression_binary(SPAN, get_call, operator, value);

                // `_classPrivateFieldSet2(_prop, object, _classPrivateFieldGet2(_prop, object) + value)`
                *expr = self.create_private_setter(
                    &field.name,
                    class_binding,
                    set_binding,
                    object1,
                    value,
                    span,
                    ctx,
                );
            } else if let Some(operator) = operator.to_logical_operator() {
                // `object.#prop &&= value`
                // -> `_classPrivateFieldGet2(_prop, object) && _classPrivateFieldSet2(_prop, object, value)`

                // `_classPrivateFieldGet2(_prop, object)`
                let get_call = self.create_private_getter(
                    &field.name,
                    class_binding,
                    get_binding,
                    object1,
                    SPAN,
                    ctx,
                );

                // `_classPrivateFieldSet2(_prop, object, value)`
                let set_call = self.create_private_setter(
                    &field.name,
                    class_binding,
                    set_binding,
                    object2,
                    value,
                    SPAN,
                    ctx,
                );
                // `_classPrivateFieldGet2(_prop, object) && _classPrivateFieldSet2(_prop, object, value)`
                *expr = ctx.ast.expression_logical(span, get_call, operator, set_call);
            } else {
                // The above covers all types of `AssignmentOperator`
                unreachable!();
            }
        }
    }

    /// Transform update expression (`++` or `--`) where argument is private field.
    ///
    /// Instance prop (not loose):
    ///
    /// * `++object.#prop` ->
    /// ```js
    /// _classPrivateFieldSet(
    ///   _prop, object,
    ///   (_object$prop = _classPrivateFieldGet(_prop, object), ++_object$prop)
    /// ),
    /// ```
    ///
    /// * `object.#prop++` ->
    /// ```js
    /// (
    ///   _classPrivateFieldSet(
    ///     _prop, object,
    ///     (
    ///       _object$prop = _classPrivateFieldGet(_prop, object),
    ///       _object$prop2 = _object$prop++,
    ///       _object$prop
    ///     )
    ///   ),
    ///   _object$prop2
    /// )
    /// ```
    ///
    /// Static prop (not loose):
    ///
    /// * `++object.#prop` ->
    /// ```js
    /// _prop._ = _assertClassBrand(
    ///   Class, object,
    ///   (_object$prop = _assertClassBrand(Class, object, _prop)._, ++_object$prop)
    /// )
    /// ```
    ///
    /// * `object.#prop++` ->
    /// ```js
    /// (
    ///   _prop._ = _assertClassBrand(
    ///     Class, object,
    ///     (
    ///       _object$prop = _assertClassBrand(Class, object, _prop)._,
    ///       _object$prop2 = _object$prop++,
    ///       _object$prop
    ///     )
    ///   ),
    ///   _object$prop2
    /// )
    /// ```
    ///
    /// Loose:
    /// `++object.#prop` -> `++_classPrivateFieldLooseBase(object, _prop)[_prop]`
    /// `object.#prop++` -> `_classPrivateFieldLooseBase(object, _prop)[_prop]++`
    ///
    /// Output in all cases contains an `UpdateExpression`, so mutate existing `UpdateExpression`
    /// rather than creating a new one.
    //
    // `#[inline]` so that compiler sees that `expr` is an `Expression::UpdateExpression`
    #[inline]
    pub(super) fn transform_update_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::UpdateExpression(update_expr) = expr else { unreachable!() };
        if matches!(&update_expr.argument, SimpleAssignmentTarget::PrivateFieldExpression(_)) {
            self.transform_update_expression_impl(expr, ctx);
        }
    }

    // TODO: Split up this function into 2 halves for static and instance props
    fn transform_update_expression_impl(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        // Unfortunately no way to make compiler see that these branches are provably unreachable.
        // This function is much too large to inline.
        let Expression::UpdateExpression(update_expr) = expr else { unreachable!() };
        let field_expr = match &mut update_expr.argument {
            SimpleAssignmentTarget::PrivateFieldExpression(field_expr) => field_expr.as_mut(),
            _ => unreachable!(),
        };

        if self.private_fields_as_properties {
            let prop_binding = self.classes_stack.find_private_prop(&field_expr.field).prop_binding;
            // `object.#prop++` -> `_classPrivateFieldLooseBase(object, _prop)[_prop]++`
            let object = field_expr.object.take_in(ctx.ast);
            let replacement = Self::create_private_field_member_expr_loose(
                object,
                prop_binding,
                field_expr.span,
                self.ctx,
                ctx,
            );
            update_expr.argument = SimpleAssignmentTarget::from(replacement);
            return;
        }

        let ResolvedGetSetPrivateProp {
            get_binding,
            set_binding,
            class_bindings,
            is_static,
            is_method,
            is_declaration,
            ..
        } = self.classes_stack.find_get_set_private_prop(&field_expr.field);

        let temp_var_name_base = get_var_name_from_node(field_expr);

        // TODO(improve-on-babel): Could avoid `move_expression` here and replace `update_expr.argument` instead.
        // Only doing this first to match the order Babel creates temp vars.
        let object = field_expr.object.get_inner_expression_mut().take_in(ctx.ast);

        if is_static && !is_method {
            // Unwrap is safe because `is_method` is false, then private prop is always have a `get_binding`
            // and `set_binding` and they are always are the same.
            let prop_binding = get_binding.unwrap();
            let prop_ident = prop_binding.create_read_expression(ctx);
            let prop_ident2 = prop_binding.create_read_expression(ctx);
            // If `object` is reference to class name, and class is declaration, use shortcuts:
            // `++Class.#prop` -> `_prop._ = ((_Class$prop = _prop._), ++_Class$prop)`
            // `Class.#prop++` -> `_prop._ = (_Class$prop = _prop._, _Class$prop2 = _Class$prop++, _Class$prop), _Class$prop2`

            // TODO(improve-on-babel): These shortcuts could be shorter - just `_prop._++` / `++_prop._`.
            // Or does that behave slightly differently if `Class.#prop` is an object with `valueOf` method?
            // TODO(improve-on-babel): No reason not to apply these shortcuts for class expressions too.

            // ```
            // _prop._ = _assertClassBrand(
            //   Class, object,
            //   (_object$prop = _assertClassBrand(Class, object, _prop)._, ++_object$prop)
            // )
            // ```

            // TODO(improve-on-babel): Are 2 x `_assertClassBrand` calls required?
            // Wouldn't `++_assertClassBrand(C, object, _prop)._` do the same?

            // Check if object (`object` in `object.#prop`) is a reference to class name
            // TODO: Combine this check with `duplicate_object`. Both check if `object` is an identifier,
            // and look up the `SymbolId`.
            let object_reference = Self::shortcut_static_class(
                is_declaration,
                class_bindings.name_symbol_id(),
                &object,
                ctx,
            );

            // `_assertClassBrand(Class, object, _prop)._` or `_prop._`
            let (get_expr, object, class_ident) = if let Some(object_reference) = object_reference {
                // Delete reference for `object` as `object.#prop` is being removed
                let (class_symbol_id, object_reference_id) = object_reference;
                ctx.scoping_mut().delete_resolved_reference(class_symbol_id, object_reference_id);

                // `_prop._`
                let get_expr = Self::create_underscore_member_expression(prop_ident, SPAN, ctx);
                (get_expr, object, None)
            } else {
                let class_binding = class_bindings.get_or_init_static_binding(ctx);
                let class_ident = class_binding.create_read_expression(ctx);
                let class_ident2 = class_binding.create_read_expression(ctx);

                // Make 2 copies of `object`
                let (object1, object2) = self.duplicate_object(object, ctx);

                // `_assertClassBrand(Class, object, _prop)._`
                let get_call = self.create_assert_class_brand_underscore(
                    class_ident,
                    object2,
                    prop_ident,
                    SPAN,
                    ctx,
                );
                (get_call, object1, Some(class_ident2))
            };

            // `_object$prop = _assertClassBrand(Class, object, _prop)._`
            let temp_binding = self.ctx.var_declarations.create_uid_var(&temp_var_name_base, ctx);
            let assignment = create_assignment(&temp_binding, get_expr, ctx);

            // `++_object$prop` / `_object$prop++` (reusing existing `UpdateExpression`)
            let UpdateExpression { span, prefix, .. } = **update_expr;
            update_expr.span = SPAN;
            update_expr.argument = temp_binding.create_read_write_simple_target(ctx);
            let update_expr = expr.take_in(ctx.ast);

            if prefix {
                // Source = `++object.#prop` (prefix `++`)

                // `(_object$prop = _assertClassBrand(Class, object, _prop)._, ++_object$prop)`
                let mut value = ctx
                    .ast
                    .expression_sequence(SPAN, ctx.ast.vec_from_array([assignment, update_expr]));

                // If no shortcut, wrap in `_assertClassBrand(Class, object, <value>)`
                if let Some(class_ident) = class_ident {
                    value = self.create_assert_class_brand(class_ident, object, value, SPAN, ctx);
                }

                // `_prop._ = <value>`
                *expr = ctx.ast.expression_assignment(
                    span,
                    AssignmentOperator::Assign,
                    Self::create_underscore_member_expr_target(prop_ident2, SPAN, ctx),
                    value,
                );
            } else {
                // Source = `object.#prop++` (postfix `++`)

                // `_object$prop2 = _object$prop++`
                let temp_binding2 =
                    self.ctx.var_declarations.create_uid_var(&temp_var_name_base, ctx);
                let assignment2 = create_assignment(&temp_binding2, update_expr, ctx);

                // `(_object$prop = _assertClassBrand(Class, object, _prop)._, _object$prop2 = _object$prop++, _object$prop)`
                let mut value = ctx.ast.expression_sequence(
                    SPAN,
                    ctx.ast.vec_from_array([
                        assignment,
                        assignment2,
                        temp_binding.create_read_expression(ctx),
                    ]),
                );

                // If no shortcut, wrap in `_assertClassBrand(Class, object, <value>)`
                if let Some(class_ident) = class_ident {
                    value = self.create_assert_class_brand(class_ident, object, value, SPAN, ctx);
                }

                // `_prop._ = <value>`
                let assignment3 = ctx.ast.expression_assignment(
                    SPAN,
                    AssignmentOperator::Assign,
                    Self::create_underscore_member_expr_target(prop_ident2, SPAN, ctx),
                    value,
                );

                // `(_prop._ = <value>, _object$prop2)`
                // TODO(improve-on-babel): Final `_object$prop2` is only needed if this expression
                // is consumed (i.e. not in an `ExpressionStatement`)
                *expr = ctx.ast.expression_sequence(
                    span,
                    ctx.ast
                        .vec_from_array([assignment3, temp_binding2.create_read_expression(ctx)]),
                );
            }
        } else {
            // Clone as borrow restrictions.
            // TODO: Try to find a way to avoid this.
            let class_binding = is_method.then(|| {
                if is_static {
                    class_bindings.get_or_init_static_binding(ctx).clone()
                } else {
                    class_bindings.brand().clone()
                }
            });
            let get_binding = get_binding.cloned();
            let set_binding = set_binding.cloned();
            let private_name = field_expr.field.name;

            // Make 2 copies of `object`
            let (object1, object2) = self.duplicate_object(object, ctx);

            // `_classPrivateFieldGet(_prop, object)`
            let get_call = self.create_private_getter(
                &private_name,
                class_binding.as_ref(),
                get_binding.as_ref(),
                object2,
                SPAN,
                ctx,
            );

            // `_object$prop = _classPrivateFieldGet(_prop, object)`
            let temp_binding = self.ctx.var_declarations.create_uid_var(&temp_var_name_base, ctx);
            let assignment = create_assignment(&temp_binding, get_call, ctx);

            // `++_object$prop` / `_object$prop++` (reusing existing `UpdateExpression`)
            let UpdateExpression { span, prefix, .. } = **update_expr;
            update_expr.span = SPAN;
            update_expr.argument = temp_binding.create_read_write_simple_target(ctx);
            let update_expr = expr.take_in(ctx.ast);

            if prefix {
                // Source = `++object.#prop` (prefix `++`)
                // `(_object$prop = _classPrivateFieldGet(_prop, object), ++_object$prop)`
                let value = ctx
                    .ast
                    .expression_sequence(SPAN, ctx.ast.vec_from_array([assignment, update_expr]));
                // `_classPrivateFieldSet(_prop, object, <value>)`
                *expr = self.create_private_setter(
                    &private_name,
                    class_binding.as_ref(),
                    set_binding.as_ref(),
                    object1,
                    value,
                    span,
                    ctx,
                );
            } else {
                // Source = `object.#prop++` (postfix `++`)
                // `_object$prop2 = _object$prop++`
                let temp_binding2 =
                    self.ctx.var_declarations.create_uid_var(&temp_var_name_base, ctx);
                let assignment2 = create_assignment(&temp_binding2, update_expr, ctx);

                // `(_object$prop = _classPrivateFieldGet(_prop, object), _object$prop2 = _object$prop++, _object$prop)`
                let value = ctx.ast.expression_sequence(
                    SPAN,
                    ctx.ast.vec_from_array([
                        assignment,
                        assignment2,
                        temp_binding.create_read_expression(ctx),
                    ]),
                );

                // `_classPrivateFieldSet(_prop, object, <value>)`
                let set_call = self.create_private_setter(
                    &private_name,
                    class_binding.as_ref(),
                    set_binding.as_ref(),
                    object1,
                    value,
                    span,
                    ctx,
                );
                // `(_classPrivateFieldSet(_prop, object, <value>), _object$prop2)`
                // TODO(improve-on-babel): Final `_object$prop2` is only needed if this expression
                // is consumed (i.e. not in an `ExpressionStatement`)
                *expr = ctx.ast.expression_sequence(
                    span,
                    ctx.ast.vec_from_array([set_call, temp_binding2.create_read_expression(ctx)]),
                );
            }
        }
    }

    /// Transform chain expression where includes a private field.
    //
    // `#[inline]` so that compiler sees that `expr` is an `Expression::ChainExpression`
    #[inline]
    pub(super) fn transform_chain_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some((result, chain_expr)) = self.transform_chain_expression_impl(expr, ctx) {
            *expr = Self::wrap_conditional_check(result, chain_expr, ctx);
        }
    }

    fn transform_chain_expression_impl(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<(Expression<'a>, Expression<'a>)> {
        let Expression::ChainExpression(chain_expr) = expr else { unreachable!() };

        let element = &mut chain_expr.expression;
        if matches!(element, ChainElement::PrivateFieldExpression(_)) {
            // The PrivateFieldExpression must be transformed, so we can convert it to a normal expression here.
            let mut chain_expr = Self::convert_chain_expression_to_expression(expr, ctx);
            let result = self
                .transform_private_field_expression_of_chain_expression(&mut chain_expr, ctx)
                .expect("The ChainExpression must contain at least one optional expression, so it can never be `None` here.");
            Some((result, chain_expr))
        } else if let Some(result) = self.transform_chain_expression_element(element, ctx) {
            let chain_expr = Self::convert_chain_expression_to_expression(expr, ctx);
            Some((result, chain_expr))
        } else {
            // "Entering this branch indicates that the chain element has been changed and updated directly in
            // `element` or do nothing because haven't found any private field."
            None
        }
    }

    /// Transform non-private field expression of chain element.
    ///
    /// [`ChainElement::PrivateFieldExpression`] is handled in [`Self::transform_chain_expression`].
    fn transform_chain_expression_element(
        &mut self,
        element: &mut ChainElement<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        match element {
            expression @ match_member_expression!(ChainElement) => self
                .transform_member_expression_of_chain_expression(
                    expression.to_member_expression_mut(),
                    ctx,
                ),
            ChainElement::CallExpression(call) => {
                self.transform_call_expression_of_chain_expression(call, ctx)
            }
            ChainElement::TSNonNullExpression(non_null) => {
                self.transform_chain_element_recursively(&mut non_null.expression, ctx)
            }
        }
    }

    /// Recursively find the first private field expression in the chain element and transform it.
    fn transform_chain_element_recursively(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        match expr {
            Expression::PrivateFieldExpression(_) => {
                self.transform_private_field_expression_of_chain_expression(expr, ctx)
            }
            match_member_expression!(Expression) => self
                .transform_member_expression_of_chain_expression(
                    expr.to_member_expression_mut(),
                    ctx,
                ),
            Expression::CallExpression(call) => {
                self.transform_call_expression_of_chain_expression(call, ctx)
            }
            _ => {
                debug_assert_expr_is_not_parenthesis_or_typescript_syntax(
                    expr,
                    &self.ctx.source_path,
                );
                None
            }
        }
    }

    /// Go through the part of chain element and transform the object/callee of first encountered optional member/call.
    ///
    /// Ident:
    ///  * `Foo?.bar`:
    ///      - Passed-in `expr` will be mutated to `Foo.bar`
    ///      - Returns `Foo === null || Foo === void 0 ? void 0`
    ///
    /// MemberExpression:
    ///  * `Foo?.bar?.baz`:
    ///     - Passed-in `expr` will be mutated to `_Foo$bar.baz`
    ///     - Returns `Foo === null || Foo === void 0 ? void 0`
    ///
    /// CallExpression:
    ///  See [`Self::transform_call_expression_to_bind_proper_context`]
    ///
    fn transform_first_optional_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        let object = match expr {
            Expression::CallExpression(call) => {
                if call.optional {
                    call.optional = false;
                    if call.callee.is_member_expression() {
                        // Special case for call expression because we need to make sure it has a proper context
                        return Some(
                            self.transform_call_expression_to_bind_proper_context(expr, ctx),
                        );
                    }
                    &mut call.callee
                } else {
                    return self.transform_first_optional_expression(&mut call.callee, ctx);
                }
            }
            Expression::StaticMemberExpression(member) => {
                if member.optional {
                    member.optional = false;
                    &mut member.object
                } else {
                    return self.transform_first_optional_expression(&mut member.object, ctx);
                }
            }
            Expression::ComputedMemberExpression(member) => {
                if member.optional {
                    member.optional = false;
                    &mut member.object
                } else {
                    return self.transform_first_optional_expression(&mut member.object, ctx);
                }
            }
            Expression::PrivateFieldExpression(member) => {
                if member.optional {
                    member.optional = false;
                    &mut member.object
                } else {
                    return self.transform_first_optional_expression(&mut member.object, ctx);
                }
            }
            _ => return None,
        };

        let result = self.transform_expression_to_wrap_nullish_check(object, ctx);
        Some(result)
    }

    /// Transform private field expression of chain expression.
    ///
    /// Returns `None` if the `expr` doesn't contain any optional expression.
    fn transform_private_field_expression_of_chain_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        let Expression::PrivateFieldExpression(field_expr) = expr else { unreachable!() };

        let is_optional = field_expr.optional;
        let object = &mut field_expr.object;

        let result = if is_optional {
            Some(self.transform_expression_to_wrap_nullish_check(object, ctx))
        } else {
            self.transform_first_optional_expression(object, ctx)
        };

        if matches!(ctx.ancestor(1), Ancestor::CallExpressionCallee(_)) {
            // `(Foo?.#m)();` -> `(Foo === null || Foo === void 0 ? void 0 : _m._.bind(Foo))();`
            // ^^^^^^^^^^^^ is a call expression, we need to bind the proper context
            *expr = self.transform_bindable_private_field(field_expr, ctx);
        } else {
            self.transform_private_field_expression(expr, ctx);
        }

        result
    }

    fn transform_member_expression_of_chain_expression(
        &mut self,
        member: &mut MemberExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        let is_optional = member.optional();
        let object = member.object_mut().get_inner_expression_mut();
        let result = self.transform_chain_element_recursively(object, ctx)?;
        if is_optional && !object.is_identifier_reference() {
            // `o?.Foo.#self.self?.self.unicorn;` -> `(result ? void 0 : object)?.self.unicorn`
            //  ^^^^^^^^^^^^^^^^^ the object has transformed, if the current member is optional,
            //                    then we need to wrap it to a conditional expression
            let owned_object = object.take_in(ctx.ast);
            *object = Self::wrap_conditional_check(result, owned_object, ctx);
            None
        } else {
            Some(result)
        }
    }

    fn transform_call_expression_of_chain_expression(
        &mut self,
        call_expr: &mut CallExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        let is_optional = call_expr.optional;

        let callee = call_expr.callee.get_inner_expression_mut();
        if matches!(callee, Expression::PrivateFieldExpression(_)) {
            let result = self.transform_first_optional_expression(callee, ctx);
            // If the `callee` has no optional expression, we need to transform it using `transform_call_expression_impl` directly.
            // `Foo.bar.#m?.();` -> `_assertClassBrand(Foo, _Foo$bar = Foo.bar, _m)._?.call(_Foo$bar);`
            //          ^^^^ only the private field is optional
            // Move out parenthesis and typescript syntax
            call_expr.callee = callee.take_in(ctx.ast);
            self.transform_call_expression_impl(call_expr, ctx);
            return result;
        }

        let result = self.transform_chain_element_recursively(callee, ctx);
        if !is_optional {
            return result;
        }

        // `o?.Foo.#self.getSelf?.()?.self.#m();`
        //               ^^^^^^^^^^^  this is a optional function call, to make sure it has a proper context,
        //                            we also need to assign `o?.Foo.#self` to a temp variable, and
        //                            then use it as a first argument of `getSelf` call.
        //
        // TODO(improve-on-babel): Consider remove this logic, because it seems no runtime behavior change.
        let result = result?;
        let object = callee.to_member_expression_mut().object_mut();
        let (assignment, context) = self.duplicate_object(object.take_in(ctx.ast), ctx);
        *object = assignment;
        let callee = call_expr.callee.take_in(ctx.ast);
        let callee = Self::wrap_conditional_check(result, callee, ctx);
        Self::substitute_callee_and_insert_context(call_expr, callee, context, ctx);

        None
    }

    /// Transform expression to wrap nullish check.
    ///
    /// Returns:
    ///   * Bound Identifier: `A` -> `A === null || A === void 0`
    ///   * `this`: `this` -> `this === null || this === void 0`
    ///   * Unbound Identifier or anything else: `A.B` -> `(_A$B = A.B) === null || _A$B === void 0`
    ///
    /// NOTE: This method will mutate the passed-in `object` to a second copy of
    /// [`Self::duplicate_object_twice`]'s return.
    fn transform_expression_to_wrap_nullish_check(
        &mut self,
        object: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let mut owned_object = object.get_inner_expression_mut().take_in(ctx.ast);

        let owned_object = if let Some(result) =
            self.transform_chain_element_recursively(&mut owned_object, ctx)
        {
            // If the `object` contains PrivateFieldExpression, we need to transform it first.
            Self::wrap_conditional_check(result, owned_object, ctx)
        } else {
            Self::ensure_optional_expression_wrapped_by_chain_expression(owned_object, ctx)
        };

        let (assignment, reference1, reference2) = self.duplicate_object_twice(owned_object, ctx);
        *object = reference1;
        self.wrap_nullish_check(assignment, reference2, ctx)
    }

    /// Converts chain expression to expression
    ///
    /// - [ChainElement::CallExpression] -> [Expression::CallExpression]
    /// - [ChainElement::StaticMemberExpression] -> [Expression::StaticMemberExpression]
    /// - [ChainElement::ComputedMemberExpression] -> [Expression::ComputedMemberExpression]
    /// - [ChainElement::PrivateFieldExpression] -> [Expression::PrivateFieldExpression]
    /// - [ChainElement::TSNonNullExpression] -> [TSNonNullExpression::expression]
    //
    // `#[inline]` so that compiler sees that `expr` is an [`Expression::ChainExpression`].
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

    /// Ensure that the expression is wrapped by a chain expression.
    ///
    /// If the given expression contains optional expression, it will be wrapped by
    /// a chain expression, this way we can ensure the remain optional expression can
    /// be handled by optional-chaining plugin correctly.
    fn ensure_optional_expression_wrapped_by_chain_expression(
        expr: Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        if Self::has_optional_expression(&expr) {
            let chain_element = match expr {
                Expression::CallExpression(call) => ChainElement::CallExpression(call),
                expr @ match_member_expression!(Expression) => {
                    ChainElement::from(expr.into_member_expression())
                }
                _ => unreachable!(),
            };
            ctx.ast.expression_chain(SPAN, chain_element)
        } else {
            expr
        }
    }

    /// Recursively check if the expression has optional expression.
    #[inline]
    fn has_optional_expression(expr: &Expression<'a>) -> bool {
        let mut expr = expr;
        loop {
            match expr {
                Expression::CallExpression(call) => {
                    if call.optional {
                        return true;
                    }
                    expr = call.callee.get_inner_expression();
                }
                Expression::StaticMemberExpression(member) => {
                    if member.optional {
                        return true;
                    }
                    expr = &member.object;
                }
                Expression::ComputedMemberExpression(member) => {
                    if member.optional {
                        return true;
                    }
                    expr = &member.object;
                }
                Expression::PrivateFieldExpression(member) => {
                    if member.optional {
                        return true;
                    }
                    expr = &member.object;
                }
                _ => return false,
            }
        }
    }

    /// Transform call expression to bind a proper context.
    ///
    /// * Callee without a private field:
    ///   `Foo?.bar()?.zoo?.().#x;`
    ///   ->
    ///   `(_Foo$bar$zoo = (_Foo$bar = Foo?.bar())?.zoo) === null || _Foo$bar$zoo === void 0 ? void 0
    ///   : babelHelpers.assertClassBrand(Foo, _Foo$bar$zoo.call(_Foo$bar), _x)._;`
    ///
    /// * Callee has a private field:
    ///   `o?.Foo.#self.getSelf?.().#m?.();`
    ///   ->
    ///   `(_ref = o === null || o === void 0 ? void 0 : (_babelHelpers$assertC =
    ///   babelHelpers.assertClassBrand(Foo, o.Foo, _self)._).getSelf) === null ||
    ///   _ref === void 0 ? void 0 : babelHelpers.assertClassBrand(Foo, _ref$call
    ///   = _ref.call(_babelHelpers$assertC), _m)._?.call(_ref$call);`
    fn transform_call_expression_to_bind_proper_context(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let Expression::CallExpression(call) = expr else { unreachable!() };

        // `Foo?.bar()?.zoo?.()`
        // ^^^^^^^^^^^ object
        // ^^^^^^^^^^^^^^^^^ callee is a member expression
        let callee = &mut call.callee;
        let callee_member = callee.to_member_expression_mut();
        let is_optional_callee = callee_member.optional();
        let object = callee_member.object_mut().get_inner_expression_mut();

        let context = if let Some(result) = self.transform_chain_element_recursively(object, ctx) {
            if is_optional_callee {
                // `o?.Foo.#self?.getSelf?.().#x;` -> `(_ref$getSelf = (_ref2 = _ref = o === null || o === void 0 ?
                //              ^^ is optional         void 0 : babelHelpers.assertClassBrand(Foo, o.Foo, _self)._)`
                *object = Self::wrap_conditional_check(result, object.take_in(ctx.ast), ctx);
                let (assignment, context) = self.duplicate_object(object.take_in(ctx.ast), ctx);
                *object = assignment;
                context
            } else {
                // `o?.Foo.#self.getSelf?.().#m?.();` -> `(_ref = o === null || o === void 0 ? void 0 : (_babelHelpers$assertC =
                //                                        babelHelpers.assertClassBrand(Foo, o.Foo, _self)._).getSelf)`
                // ^^^^^^^^^^^^^^^^^^^^^^ to make sure get `getSelf` call has a proper context, we need to assign
                //                        the parent of callee (i.e `o?.Foo.#self`) to a temp variable,
                //                        and then use it as a first argument of `_ref.call`.
                let (assignment, context) = self.duplicate_object(object.take_in(ctx.ast), ctx);
                *object = assignment;
                *callee = Self::wrap_conditional_check(result, callee.take_in(ctx.ast), ctx);
                context
            }
        } else {
            // `Foo?.bar()?.zoo?.().#x;` -> `(_Foo$bar$zoo = (_Foo$bar = Foo?.bar())?.zoo)`
            // ^^^^^^^^^^^^^^^^ this is a optional function call, to make sure it has a proper context,
            //                  we also need to assign `Foo?.bar()` to a temp variable, and then use
            //                  it as a first argument of `_Foo$bar$zoo`.
            let (assignment, context) = self.duplicate_object(object.take_in(ctx.ast), ctx);
            *object = assignment;
            context
        };

        // After the below transformation, the `callee` will be a temp variable.
        let result = self.transform_expression_to_wrap_nullish_check(callee, ctx);
        let owned_callee = callee.take_in(ctx.ast);
        Self::substitute_callee_and_insert_context(call, owned_callee, context, ctx);
        result
    }

    /// Returns `left === null`
    fn wrap_null_check(&self, left: Expression<'a>, ctx: &TraverseCtx<'a>) -> Expression<'a> {
        let operator = if self.ctx.assumptions.no_document_all {
            BinaryOperator::Equality
        } else {
            BinaryOperator::StrictEquality
        };
        ctx.ast.expression_binary(SPAN, left, operator, ctx.ast.expression_null_literal(SPAN))
    }

    /// Returns `left === void 0`
    fn wrap_void0_check(left: Expression<'a>, ctx: &TraverseCtx<'a>) -> Expression<'a> {
        let operator = BinaryOperator::StrictEquality;
        ctx.ast.expression_binary(SPAN, left, operator, ctx.ast.void_0(SPAN))
    }

    /// Returns `left1 === null || left2 === void 0`
    fn wrap_nullish_check(
        &self,
        left1: Expression<'a>,
        left2: Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        let null_check = self.wrap_null_check(left1, ctx);
        if self.ctx.assumptions.no_document_all {
            null_check
        } else {
            let void0_check = Self::wrap_void0_check(left2, ctx);
            ctx.ast.expression_logical(SPAN, null_check, LogicalOperator::Or, void0_check)
        }
    }

    /// Returns `test ? void 0 : alternative`
    fn wrap_conditional_check(
        test: Expression<'a>,
        alternative: Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        ctx.ast.expression_conditional(SPAN, test, ctx.ast.void_0(SPAN), alternative)
    }

    /// Transform chain expression inside unary expression.
    ///
    /// Instance prop:
    /// * `delete object?.#prop.xyz`
    ///   -> `object === null || object === void 0 ? true : delete _classPrivateFieldGet(_prop, object).xyz;`
    /// * `delete object?.#prop?.xyz;`
    ///   -> `delete (object === null || object === void 0 ? void 0 : _classPrivateFieldGet(_prop, object))?.xyz;`
    ///
    /// Static prop:
    /// * `delete object?.#prop.xyz`
    ///   -> `object === null || object === void 0 ? true : delete _assertClassBrand(Foo, object, _prop)._.xyz;`
    /// * `delete object?.#prop?.xyz;`
    ///   -> `delete (object === null || object === void 0 ? void 0 : _assertClassBrand(Foo, object, _prop)._)?.xyz;`
    //
    // `#[inline]` so that compiler sees that `expr` is an `Expression::UnaryExpression`,
    // and make bailing out if is not `delete <chain expression>` (it rarely will be) a fast path without
    // cost of a function call.
    #[inline]
    pub(super) fn transform_unary_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::UnaryExpression(unary_expr) = expr else { unreachable!() };

        if unary_expr.operator == UnaryOperator::Delete
            && matches!(unary_expr.argument, Expression::ChainExpression(_))
        {
            self.transform_unary_expression_impl(expr, ctx);
        }
    }

    fn transform_unary_expression_impl(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::UnaryExpression(unary_expr) = expr else { unreachable!() };
        debug_assert!(unary_expr.operator == UnaryOperator::Delete);
        debug_assert!(matches!(unary_expr.argument, Expression::ChainExpression(_)));

        if let Some((result, chain_expr)) =
            self.transform_chain_expression_impl(&mut unary_expr.argument, ctx)
        {
            *expr = ctx.ast.expression_conditional(
                unary_expr.span,
                result,
                ctx.ast.expression_boolean_literal(SPAN, true),
                {
                    // We still need this unary expr, but it needs to be used as the alternative of the conditional
                    unary_expr.argument = chain_expr;
                    expr.take_in(ctx.ast)
                },
            );
        }
    }

    /// Transform tagged template expression where tag is a private field.
    ///
    /// Instance prop (not loose):
    /// * "object.#prop`xyz`"
    ///   -> "_classPrivateFieldGet(_prop, object).bind(object)`xyz`"
    /// * "object.obj.#prop`xyz`"
    ///   -> "_classPrivateFieldGet(_prop, _object$obj = object.obj).bind(_object$obj)`xyz`"
    ///
    /// Static prop (not loose):
    /// * "object.#prop`xyz`"
    ///   -> "_assertClassBrand(Class, object, _prop)._.bind(object)`xyz`"
    /// * "object.obj.#prop`xyz`"
    ///   -> "_assertClassBrand(Class, (_object$obj = object.obj), _prop)._.bind(_object$obj)`xyz`"
    ///
    /// Loose:
    /// ```js
    /// object.#prop`xyz`
    /// ```
    /// ->
    /// ```js
    /// _classPrivateFieldLooseBase(object, _prop)[_prop]`xyz`
    /// ```
    //
    // `#[inline]` so that compiler sees that `expr` is an `Expression::TaggedTemplateExpression`
    #[inline]
    pub(super) fn transform_tagged_template_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::TaggedTemplateExpression(tagged_temp_expr) = expr else { unreachable!() };
        let Expression::PrivateFieldExpression(field_expr) = &mut tagged_temp_expr.tag else {
            return;
        };

        tagged_temp_expr.tag = self.transform_tagged_template_expression_impl(field_expr, ctx);
    }

    fn transform_tagged_template_expression_impl(
        &mut self,
        field_expr: &mut PrivateFieldExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        if self.private_fields_as_properties {
            // "object.#prop`xyz`" -> "_classPrivateFieldLooseBase(object, _prop)[_prop]`xyz`"
            //
            // Babel adds an additional `.bind(object)`:
            // ```js
            // _classPrivateFieldLooseBase(object, _prop)[_prop].bind(object)`xyz`"
            // //                                               ^^^^^^^^^^^^^
            // ```
            // But this is not needed, so we omit it.
            let prop_binding = self.classes_stack.find_private_prop(&field_expr.field).prop_binding;

            let object = field_expr.object.take_in(ctx.ast);
            let replacement = Self::create_private_field_member_expr_loose(
                object,
                prop_binding,
                field_expr.span,
                self.ctx,
                ctx,
            );
            Expression::from(replacement)
        } else {
            self.transform_bindable_private_field(field_expr, ctx)
        }
    }

    fn transform_bindable_private_field(
        &mut self,
        field_expr: &mut PrivateFieldExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let (callee, context) = self.transform_private_field_callee(field_expr, ctx);

        // Return `<callee>.bind(object)`, to be substituted as tag of tagged template expression
        let callee = Expression::from(ctx.ast.member_expression_static(
            SPAN,
            callee,
            ctx.ast.identifier_name(SPAN, Atom::from("bind")),
            false,
        ));
        let arguments = ctx.ast.vec1(Argument::from(context));
        ctx.ast.expression_call(field_expr.span, callee, NONE, arguments, false)
    }

    /// Transform private field in assignment pattern.
    ///
    /// Instance prop:
    /// * `[object.#prop] = arr` -> `[_toSetter(_classPrivateFieldSet, [_prop, object])._] = arr`
    /// * `({x: object.#prop} = obj)` -> `({ x: _toSetter(_classPrivateFieldSet, [_prop, object])._ } = obj)`
    ///
    /// Static prop:
    /// (same as `Expression::PrivateFieldExpression` is transformed to)
    /// * `[object.#prop] = arr` -> `[_assertClassBrand(Class, object, _prop)._] = arr`
    /// * `({x: object.#prop} = obj)` -> `({ x: _assertClassBrand(Class, object, _prop)._ } = obj)`
    //
    // `#[inline]` because most `AssignmentTarget`s are not `PrivateFieldExpression`s.
    // So we want to bail out in that common case without the cost of a function call.
    // Transform of `PrivateFieldExpression`s in broken out into `transform_assignment_target_impl` to
    // keep this function as small as possible.
    #[inline]
    pub(super) fn transform_assignment_target(
        &mut self,
        target: &mut AssignmentTarget<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        // `object.#prop` in assignment pattern.
        // Must be in assignment pattern, as `enter_expression` already transformed `AssignmentExpression`s.
        if matches!(target, AssignmentTarget::PrivateFieldExpression(_)) {
            self.transform_assignment_target_impl(target, ctx);
        }
    }

    fn transform_assignment_target_impl(
        &mut self,
        target: &mut AssignmentTarget<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let AssignmentTarget::PrivateFieldExpression(private_field) = target else {
            unreachable!()
        };
        let replacement = self.transform_private_field_expression_impl(private_field, true, ctx);
        *target = AssignmentTarget::from(replacement.into_member_expression());
    }

    /// Transform private field in expression.
    ///
    /// * Static
    ///   `#prop in object` -> `_checkInRHS(object) === Class`
    ///
    /// * Instance prop
    ///   `#prop in object` -> `_prop.has(_checkInRHS(object))`
    ///
    /// * Instance method
    ///   `#method in object` -> `_Class_brand.has(_checkInRHS(object))`
    ///
    // `#[inline]` so that compiler sees that `expr` is an `Expression::PrivateFieldExpression`
    #[inline]
    pub(super) fn transform_private_in_expression(
        &mut self,
        expr: &mut Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Expression::PrivateInExpression(private_in) = expr.take_in(ctx.ast) else {
            unreachable!();
        };

        *expr = self.transform_private_in_expression_impl(private_in, ctx);
    }

    fn transform_private_in_expression_impl(
        &mut self,
        private_field: ArenaBox<'a, PrivateInExpression<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let PrivateInExpression { left, right, span } = private_field.unbox();

        let ResolvedPrivateProp { class_bindings, prop_binding, is_method, is_static, .. } =
            self.classes_stack.find_private_prop(&left);

        if is_static {
            let class_binding = class_bindings.get_or_init_static_binding(ctx);
            let class_ident = class_binding.create_read_expression(ctx);
            let left = self.create_check_in_rhs(right, SPAN, ctx);
            return ctx.ast.expression_binary(
                span,
                left,
                BinaryOperator::StrictEquality,
                class_ident,
            );
        }

        let callee = if is_method {
            class_bindings.brand().create_read_expression(ctx)
        } else {
            prop_binding.create_read_expression(ctx)
        };
        let callee = create_member_callee(callee, "has", ctx);
        let argument = self.create_check_in_rhs(right, SPAN, ctx);
        ctx.ast.expression_call(span, callee, NONE, ctx.ast.vec1(Argument::from(argument)), false)
    }

    /// Duplicate object to be used in get/set pair.
    ///
    /// If `object` may have side effects, create a temp var `_object` and assign to it.
    ///
    /// * `this` -> `this`, `this`
    /// * Bound identifier `object` -> `object`, `object`
    /// * Unbound identifier `object` -> `_object = object`, `_object`
    /// * Anything else `foo()` -> `_foo = foo()`, `_foo`
    ///
    /// Returns 2 `Expression`s. The first must be inserted into output first.
    pub(super) fn duplicate_object(
        &self,
        object: Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> (Expression<'a>, Expression<'a>) {
        debug_assert_expr_is_not_parenthesis_or_typescript_syntax(&object, &self.ctx.source_path);
        self.ctx.duplicate_expression(object, false, ctx)
    }

    /// Duplicate object to be used in triple.
    ///
    /// If `object` may have side effects, create a temp var `_object` and assign to it.
    ///
    /// * `this` -> `this`, `this`, `this`
    /// * Bound identifier `object` -> `object`, `object`, `object`
    /// * Unbound identifier `object` -> `_object = object`, `_object`, `_object`
    /// * Anything else `foo()` -> `_foo = foo()`, `_foo`, `_foo`
    ///
    /// Returns 3 `Expression`s. The first must be inserted into output first.
    fn duplicate_object_twice(
        &self,
        object: Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> (Expression<'a>, Expression<'a>, Expression<'a>) {
        debug_assert_expr_is_not_parenthesis_or_typescript_syntax(&object, &self.ctx.source_path);
        self.ctx.duplicate_expression_twice(object, false, ctx)
    }

    /// `_classPrivateFieldLooseBase(object, _prop)[_prop]`.
    ///
    /// Takes `&TransformCtx` instead of `&self` to allow passing a `&BoundIdentifier<'a>` returned by
    /// `self.private_props_stack.find()`, which takes a partial mut borrow of `self`.
    fn create_private_field_member_expr_loose(
        object: Expression<'a>,
        prop_binding: &BoundIdentifier<'a>,
        span: Span,
        transform_ctx: &TransformCtx<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> MemberExpression<'a> {
        let call_expr = transform_ctx.helper_call_expr(
            Helper::ClassPrivateFieldLooseBase,
            SPAN,
            ctx.ast.vec_from_array([
                Argument::from(object),
                Argument::from(prop_binding.create_read_expression(ctx)),
            ]),
            ctx,
        );
        ctx.ast.member_expression_computed(
            span,
            call_expr,
            prop_binding.create_read_expression(ctx),
            false,
        )
    }

    /// `_classPrivateFieldGet2(_prop, object)`
    fn create_private_field_get(
        &self,
        prop_ident: Expression<'a>,
        object: Expression<'a>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        self.ctx.helper_call_expr(
            Helper::ClassPrivateFieldGet2,
            span,
            ctx.ast.vec_from_array([Argument::from(prop_ident), Argument::from(object)]),
            ctx,
        )
    }

    /// `_classPrivateFieldSet2(_prop, object, value)`
    fn create_private_field_set(
        &self,
        prop_ident: Expression<'a>,
        object: Expression<'a>,
        value: Expression<'a>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        self.ctx.helper_call_expr(
            Helper::ClassPrivateFieldSet2,
            span,
            ctx.ast.vec_from_array([
                Argument::from(prop_ident),
                Argument::from(object),
                Argument::from(value),
            ]),
            ctx,
        )
    }

    /// `_toSetter(_classPrivateFieldSet2, [_prop, object])._`
    fn create_to_setter_for_private_field_set(
        &self,
        prop_ident: Expression<'a>,
        object: Expression<'a>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let arguments = ctx.ast.expression_array(
            SPAN,
            ctx.ast.vec_from_array([
                ArrayExpressionElement::from(prop_ident),
                ArrayExpressionElement::from(object),
            ]),
        );
        let arguments = ctx.ast.vec_from_array([
            Argument::from(self.ctx.helper_load(Helper::ClassPrivateFieldSet2, ctx)),
            Argument::from(arguments),
        ]);
        let call = self.ctx.helper_call_expr(Helper::ToSetter, span, arguments, ctx);
        Self::create_underscore_member_expression(call, span, ctx)
    }

    /// `_toSetter(_prop.bind(object))._`
    fn create_to_setter_for_bind_call(
        &self,
        prop_ident: Expression<'a>,
        object: Expression<'a>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let prop_call = create_bind_call(prop_ident, object, span, ctx);
        let arguments = ctx.ast.vec_from_array([Argument::from(prop_call)]);
        let call = self.ctx.helper_call_expr(Helper::ToSetter, span, arguments, ctx);
        Self::create_underscore_member_expression(call, span, ctx)
    }

    /// `_assertClassBrand(Class, object, value)` or `_assertClassBrand(Class, object, _prop)`
    fn create_assert_class_brand(
        &self,
        class_ident: Expression<'a>,
        object: Expression<'a>,
        value_or_prop_ident: Expression<'a>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        self.ctx.helper_call_expr(
            Helper::AssertClassBrand,
            span,
            ctx.ast.vec_from_array([
                Argument::from(class_ident),
                Argument::from(object),
                Argument::from(value_or_prop_ident),
            ]),
            ctx,
        )
    }

    /// `_assertClassBrand(Class, object)`
    fn create_assert_class_brand_without_value(
        &self,
        class_ident: Expression<'a>,
        object: Expression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let arguments =
            ctx.ast.vec_from_array([Argument::from(class_ident), Argument::from(object)]);
        self.ctx.helper_call_expr(Helper::AssertClassBrand, SPAN, arguments, ctx)
    }

    /// `_assertClassBrand(Class, object, _prop)._`
    fn create_assert_class_brand_underscore(
        &self,
        class_ident: Expression<'a>,
        object: Expression<'a>,
        prop_ident: Expression<'a>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let func_call = self.create_assert_class_brand(class_ident, object, prop_ident, SPAN, ctx);
        Self::create_underscore_member_expression(func_call, span, ctx)
    }

    /// Create `<object>._` assignment target.
    fn create_underscore_member_expr_target(
        object: Expression<'a>,
        span: Span,
        ctx: &TraverseCtx<'a>,
    ) -> AssignmentTarget<'a> {
        AssignmentTarget::from(Self::create_underscore_member_expr(object, span, ctx))
    }

    /// Create `<object>._` expression.
    fn create_underscore_member_expression(
        object: Expression<'a>,
        span: Span,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        Expression::from(Self::create_underscore_member_expr(object, span, ctx))
    }

    /// Create `<object>._` member expression.
    fn create_underscore_member_expr(
        object: Expression<'a>,
        span: Span,
        ctx: &TraverseCtx<'a>,
    ) -> MemberExpression<'a> {
        ctx.ast.member_expression_static(span, object, create_underscore_ident_name(ctx), false)
    }

    /// * Getter: `_prop.call(_assertClassBrand(Class, object))`
    /// * Prop: `_privateFieldGet(_prop, object)`
    /// * Prop binding is `None`: `_readOnlyError("#method")`
    fn create_private_getter(
        &self,
        private_name: &str,
        class_binding: Option<&BoundIdentifier<'a>>,
        prop_binding: Option<&BoundIdentifier<'a>>,
        object: Expression<'a>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let Some(prop_binding) = prop_binding else {
            // `_readOnlyError("#method")`
            return self.create_sequence_with_write_only_error(private_name, object, span, ctx);
        };
        let prop_ident = prop_binding.create_read_expression(ctx);
        if let Some(class_binding) = class_binding {
            let class_ident = class_binding.create_read_expression(ctx);
            let object = self.create_assert_class_brand_without_value(class_ident, object, ctx);
            // `_prop.call(_assertClassBrand(Class, object))`
            create_call_call(prop_ident, object, span, ctx)
        } else {
            // `_privateFieldGet(_prop, object)`
            self.create_private_field_get(prop_ident, object, span, ctx)
        }
    }

    /// * Setter: `_prop.call(_assertClassBrand(Class, object), value)`
    /// * Prop: `_privateFieldSet(_prop, object, value)`
    /// * Prop binding is `None`: `_writeOnlyError("#method")`
    fn create_private_setter(
        &self,
        private_name: &str,
        class_binding: Option<&BoundIdentifier<'a>>,
        prop_binding: Option<&BoundIdentifier<'a>>,
        object: Expression<'a>,
        value: Expression<'a>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let Some(prop_binding) = prop_binding else {
            // `_writeOnlyError("#method")`
            return self.create_sequence_with_read_only_error(
                private_name,
                object,
                Some(value),
                span,
                ctx,
            );
        };
        let prop_ident = prop_binding.create_read_expression(ctx);
        if let Some(class_binding) = class_binding {
            let class_ident = class_binding.create_read_expression(ctx);
            let object = self.create_assert_class_brand_without_value(class_ident, object, ctx);
            let arguments = ctx.ast.vec_from_array([Argument::from(object), Argument::from(value)]);
            let callee = create_member_callee(prop_ident, "call", ctx);
            // `_prop.call(_assertClassBrand(Class, object), value)`
            ctx.ast.expression_call(span, callee, NONE, arguments, false)
        } else {
            // `_privateFieldSet(_prop, object, value)`
            self.create_private_field_set(prop_ident, object, value, span, ctx)
        }
    }

    /// * [`Helper::ReadOnlyError`][]: `_readOnlyError("#method")`
    /// * [`Helper::WriteOnlyError`][]: `_writeOnlyError("#method")`
    fn create_throw_error(
        &self,
        helper: Helper,
        private_name: &str,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let message = ctx.ast.atom_from_strs_array(["#", private_name]);
        let message = ctx.ast.expression_string_literal(SPAN, message, None);
        self.ctx.helper_call_expr(helper, SPAN, ctx.ast.vec1(Argument::from(message)), ctx)
    }

    /// `object, value, _readOnlyError("#method")`
    fn create_sequence_with_read_only_error(
        &self,
        private_name: &str,
        object: Expression<'a>,
        value: Option<Expression<'a>>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let has_value = value.is_some();
        let error = self.create_throw_error(Helper::ReadOnlyError, private_name, ctx);
        let expressions = if let Some(value) = value {
            ctx.ast.vec_from_array([object, value, error])
        } else {
            ctx.ast.vec_from_array([object, error])
        };
        let expr = ctx.ast.expression_sequence(span, expressions);
        if has_value {
            expr
        } else {
            Expression::from(Self::create_underscore_member_expr(expr, span, ctx))
        }
    }

    /// `object, _writeOnlyError("#method")`
    fn create_sequence_with_write_only_error(
        &self,
        private_name: &str,
        object: Expression<'a>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let error = self.create_throw_error(Helper::WriteOnlyError, private_name, ctx);
        let expressions = ctx.ast.vec_from_array([object, error]);
        ctx.ast.expression_sequence(span, expressions)
    }

    /// _checkInRHS(object)
    fn create_check_in_rhs(
        &self,
        object: Expression<'a>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        self.ctx.helper_call_expr(
            Helper::CheckInRHS,
            span,
            ctx.ast.vec1(Argument::from(object)),
            ctx,
        )
    }
}
