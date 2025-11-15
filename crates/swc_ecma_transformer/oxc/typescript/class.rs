use oxc_allocator::{TakeIn, Vec as ArenaVec};
use oxc_ast::ast::*;
use oxc_semantic::ScopeFlags;
use oxc_span::SPAN;
use oxc_traverse::BoundIdentifier;

use crate::{
    context::TraverseCtx,
    utils::ast_builder::{
        create_class_constructor, create_this_property_access, create_this_property_assignment,
    },
};

use super::TypeScript;

impl<'a> TypeScript<'a, '_> {
    /// Transform class fields, and constructor parameters that includes modifiers into `this` assignments.
    ///
    /// This transformation is doing 2 things:
    ///
    /// 1. Convert constructor parameters that include modifier to `this` assignments and insert them
    ///    after the super call in the constructor body.
    ///
    /// Same as `Self::convert_constructor_params` does, the reason why we still need that method because
    /// this method only calls when `set_public_class_fields` is `true` and `class_properties` plugin is
    /// disabled, otherwise the `convert_constructor_params` method will be called. Merging them together
    /// will increase unnecessary check when only transform constructor parameters.
    ///
    /// 2. Convert class fields to `this` assignments in the constructor body.
    ///
    /// > This transformation only works when `set_public_class_fields` is `true`,
    /// > and the fields have initializers, which is to align with the behavior of TypeScript's
    /// > `useDefineForClassFields: false` option.
    ///
    /// Input:
    /// ```ts
    /// class C {
    ///   x = 1;
    ///   [y] = 2;
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// let _y;
    /// class C {
    ///   static {
    ///     _y = y;
    ///   }
    ///   constructor() {
    ///     this.x = 1;
    ///     this[_y] = 2;
    ///   }
    /// }
    /// ```
    ///
    /// The computed key transformation behavior is the same as `TypeScript`.
    /// Computed key assignments are inserted into a static block, unlike Babel which inserts them before class.
    /// We follow `TypeScript` just for simplicity, because `Babel` handles class expressions and class declarations
    /// differently, which is quite troublesome to implement.
    /// Anyway, `TypeScript` is the source of truth for the typescript transformation.
    ///
    /// For static properties, we convert them to static blocks.
    ///
    /// Input:
    /// ```ts
    /// class C {
    ///   static x = 1;
    ///   static [y] = 2;
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// let _y;
    /// class C {
    ///   static {
    ///     this.x = 1;
    ///   }
    ///   static {
    ///     this[_y] = 2;
    ///   }
    /// }
    /// ```
    ///
    /// The transformation way is also the same as `TypeScript`, the advantage from the implementation is that
    /// we don't need extra transformation for static properties, the output is the same as instance properties
    /// transformation, and the greatest advantage is we don't need to care about `this` usage in static block.
    pub(super) fn transform_class_fields(&self, class: &mut Class<'a>, ctx: &mut TraverseCtx<'a>) {
        let mut constructor = None;
        let mut property_assignments = Vec::new();
        let mut computed_key_assignments = Vec::new();
        for element in &mut class.body.body {
            match element {
                // `set_public_class_fields: true` only needs to transform non-private class fields.
                ClassElement::PropertyDefinition(prop) if !prop.key.is_private_identifier() => {
                    if let Some(value) = prop.value.take() {
                        let assignment = self.convert_property_definition(
                            &mut prop.key,
                            value,
                            &mut computed_key_assignments,
                            ctx,
                        );
                        if prop.r#static {
                            // Convert static property to static block
                            // `class C { static x = 1; }` -> `class C { static { this.x = 1; } }`
                            // `class C { static [x] = 1; }` -> `let _x; class C { static { this[_x] = 1; } }`
                            let body = ctx.ast.vec1(assignment);
                            *element = Self::create_class_static_block(body, ctx);
                        } else {
                            property_assignments.push(assignment);
                        }
                    } else if self.remove_class_fields_without_initializer
                        && let Some(key) = prop.key.as_expression_mut()
                    {
                        // `TypeScript` uses `isSimpleInlineableExpression` to check if the key needs to be kept.
                        // There is a little difference that we treat `BigIntLiteral` and `RegExpLiteral` can be kept, and
                        // `IdentifierReference` without symbol is not kept.
                        // https://github.com/microsoft/TypeScript/blob/8c62e08448e0ec76203bd519dd39608dbcb31705/src/compiler/transformers/classFields.ts#L2720
                        if self.ctx.key_needs_temp_var(key, ctx) {
                            // When `remove_class_fields_without_initializer` is true, the property without initializer
                            // would be removed in the `transform_class_on_exit`. We need to make sure the computed key
                            // keeps and is evaluated in the same order as the original class field in static block.
                            computed_key_assignments.push(key.take_in(ctx.ast));
                        }
                    }
                }
                ClassElement::MethodDefinition(method) => {
                    if method.kind == MethodDefinitionKind::Constructor {
                        constructor = Some(&mut method.value);
                    } else {
                        Self::convert_computed_key(
                            &mut method.key,
                            &mut computed_key_assignments,
                            ctx,
                        );
                    }
                }
                ClassElement::AccessorProperty(accessor) => {
                    Self::convert_computed_key(
                        &mut accessor.key,
                        &mut computed_key_assignments,
                        ctx,
                    );
                }
                _ => (),
            }
        }

        let computed_key_assignment_static_block =
            (!computed_key_assignments.is_empty()).then(|| {
                let sequence_expression = ctx
                    .ast
                    .expression_sequence(SPAN, ctx.ast.vec_from_iter(computed_key_assignments));
                let statement = ctx.ast.statement_expression(SPAN, sequence_expression);
                Self::create_class_static_block(ctx.ast.vec1(statement), ctx)
            });

        if let Some(constructor) = constructor {
            let params = &constructor.params.items;

            let params_assignment = Self::convert_constructor_params(params, ctx);
            property_assignments.splice(0..0, params_assignment);

            // Exit if there are no property and parameter assignments
            if property_assignments.is_empty() {
                return;
            }

            // `constructor {}` is guaranteed that it is `Some`.
            let constructor_body_statements = &mut constructor.body.as_mut().unwrap().statements;
            let super_call_position = Self::get_super_call_position(constructor_body_statements);

            // Insert the assignments after the `super()` call
            constructor_body_statements
                .splice(super_call_position..super_call_position, property_assignments);

            // Insert the static block after the constructor if there is a constructor
            if let Some(element) = computed_key_assignment_static_block {
                class.body.body.insert(0, element);
            }
        } else if !property_assignments.is_empty() {
            // If there is no constructor, we need to create a default constructor
            // that initializes the public fields
            // TODO: should use `ctx.insert_scope_below_statements`, but it only accept an `ArenaVec` rather than std `Vec`.
            let scope_id = ctx.create_child_scope_of_current(
                ScopeFlags::StrictMode | ScopeFlags::Function | ScopeFlags::Constructor,
            );
            let ctor = create_class_constructor(
                property_assignments,
                class.super_class.is_some(),
                scope_id,
                ctx,
            );

            // Insert the static block at the beginning of the class body if there is no constructor
            if let Some(element) = computed_key_assignment_static_block {
                class.body.body.splice(0..0, [ctor, element]);
            } else {
                // TODO(improve-on-babel): Could push constructor onto end of elements, instead of inserting as first
                class.body.body.insert(0, ctor);
            }
        } else if let Some(element) = computed_key_assignment_static_block {
            class.body.body.insert(0, element);
        }
    }

    pub(super) fn transform_class_on_exit(
        &self,
        class: &mut Class<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        if !self.remove_class_fields_without_initializer {
            return;
        }

        class.body.body.retain(|element| {
            if let ClassElement::PropertyDefinition(prop) = element
                && prop.value.is_none()
                && !prop.key.is_private_identifier()
            {
                return false;
            }
            true
        });
    }

    /// Transform constructor parameters that include modifier to `this` assignments and
    /// insert them after the super call in the constructor body.
    ///
    /// Input:
    /// ```ts
    /// class C {
    ///   constructor(public x, private y) {}
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// class C {
    ///  constructor(x, y) {
    ///   this.x = x;
    ///   this.y = y;
    /// }
    /// ```
    pub(super) fn transform_class_constructor(
        constructor: &mut MethodDefinition<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if !constructor.kind.is_constructor() || constructor.value.body.is_none() {
            return;
        }

        let params = &constructor.value.params.items;
        let assignments = Self::convert_constructor_params(params, ctx).collect::<Vec<_>>();

        let constructor_body_statements = &mut constructor.value.body.as_mut().unwrap().statements;
        let super_call_position = Self::get_super_call_position(constructor_body_statements);

        // Insert the assignments after the `super()` call
        constructor_body_statements.splice(super_call_position..super_call_position, assignments);
    }

    /// Convert property definition to `this` assignment in constructor.
    ///
    /// * Computed key:
    ///   `class C { [x()] = 1; }` -> `let _x; class C { static { _x = x(); } constructor() { this[_x] = 1; } }`
    /// * Static key:
    ///   `class C { x = 1; }` -> `class C { constructor() { this.x = 1; } }`
    ///
    /// Returns an assignment statement which would be inserted in the constructor body.
    fn convert_property_definition(
        &self,
        key: &mut PropertyKey<'a>,
        value: Expression<'a>,
        computed_key_assignments: &mut Vec<Expression<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Statement<'a> {
        let member = match key {
            PropertyKey::StaticIdentifier(ident) => {
                create_this_property_access(SPAN, ident.name, ctx)
            }
            PropertyKey::PrivateIdentifier(_) => {
                unreachable!("PrivateIdentifier is skipped in transform_class_fields");
            }
            key @ match_expression!(PropertyKey) => {
                let key = key.to_expression_mut();
                // Note: Key can also be static `StringLiteral` or `NumericLiteral`.
                // `class C { 'x' = true; 123 = false; }`
                // No temp var is created for these.
                let new_key = if self.ctx.key_needs_temp_var(key, ctx) {
                    let (assignment, ident) =
                        self.ctx.create_computed_key_temp_var(key.take_in(ctx.ast), ctx);
                    computed_key_assignments.push(assignment);
                    ident
                } else {
                    key.take_in(ctx.ast)
                };

                ctx.ast.member_expression_computed(
                    SPAN,
                    ctx.ast.expression_this(SPAN),
                    new_key,
                    false,
                )
            }
        };
        let target = AssignmentTarget::from(member);
        Self::create_assignment(target, value, ctx)
    }

    /// Find the position of the `super()` call in the constructor body, otherwise return 0.
    ///
    /// Don't need to handle nested `super()` call because `TypeScript` doesn't allow it.
    pub fn get_super_call_position(statements: &[Statement<'a>]) -> usize {
        // Find the position of the `super()` call in the constructor body.
        // Don't need to handle nested `super()` call because `TypeScript` doesn't allow it.
        statements
            .iter()
            .position(|stmt| {
                matches!(stmt, Statement::ExpressionStatement(stmt)
                        if stmt.expression.is_super_call_expression())
            })
            .map_or(0, |pos| pos + 1)
    }

    /// Convert computed key to sequence expression if there are assignments.
    ///
    /// Input:
    /// ```ts
    /// class C {
    ///   [x()] = 1;
    ///   [y()]() {}
    ///   [x()] = 2;
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// let _x, _x2;
    /// class C {
    ///   constructor() {
    ///     this[_x] = 1;
    ///     this[_x2] = 2;
    ///   }
    ///   static {
    ///     _x2 = x();
    ///   }
    ///   [(_x = x(), y())]() {}
    /// }
    /// ```
    ///
    /// So that computed key keeps running in the same order as the original class field.
    #[inline]
    fn convert_computed_key(
        key: &mut PropertyKey<'a>,
        assignments: &mut Vec<Expression<'a>>,
        ctx: &TraverseCtx<'a>,
    ) {
        if assignments.is_empty() {
            return;
        }
        if let Some(key) = key.as_expression_mut() {
            // If the key is already an expression, we need to create a new expression sequence
            // to insert the assignments into.
            let original_key = key.take_in(ctx.ast);
            let new_key = ctx.ast.expression_sequence(
                SPAN,
                ctx.ast.vec_from_iter(
                    assignments.split_off(0).into_iter().chain(std::iter::once(original_key)),
                ),
            );
            *key = new_key;
        }
    }

    /// Convert constructor parameters that include modifier to `this` assignments
    pub(super) fn convert_constructor_params(
        params: &ArenaVec<'a, FormalParameter<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> impl Iterator<Item = Statement<'a>> {
        params
            .iter()
            .filter(|param| param.has_modifier())
            .filter_map(|param| param.pattern.get_binding_identifier())
            .map(|id| {
                let target = create_this_property_assignment(id.span, id.name, ctx);
                let value = BoundIdentifier::from_binding_ident(id).create_read_expression(ctx);
                Self::create_assignment(target, value, ctx)
            })
    }

    /// Create `a.b = value`
    fn create_assignment(
        target: AssignmentTarget<'a>,
        value: Expression<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Statement<'a> {
        ctx.ast.statement_expression(
            SPAN,
            ctx.ast.expression_assignment(SPAN, AssignmentOperator::Assign, target, value),
        )
    }

    /// Create `static { body }`
    #[inline]
    fn create_class_static_block(
        body: ArenaVec<'a, Statement<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> ClassElement<'a> {
        let scope_id = ctx.insert_scope_below_statements(
            &body,
            ScopeFlags::StrictMode | ScopeFlags::ClassStaticBlock,
        );

        ctx.ast.class_element_static_block_with_scope_id(
            SPAN,
            ctx.ast.vec_from_iter(body),
            scope_id,
        )
    }
}
