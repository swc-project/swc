use std::cell::Cell;

use rustc_hash::FxHashMap;

use oxc_allocator::{StringBuilder, TakeIn, Vec as ArenaVec};
use oxc_ast::{NONE, ast::*};
use oxc_ast_visit::{VisitMut, walk_mut};
use oxc_data_structures::stack::NonEmptyStack;
use oxc_ecmascript::{ToInt32, ToUint32};
use oxc_semantic::{ScopeFlags, ScopeId};
use oxc_span::{Atom, SPAN, Span};
use oxc_syntax::{
    number::{NumberBase, ToJsString},
    operator::{AssignmentOperator, BinaryOperator, LogicalOperator, UnaryOperator},
    reference::ReferenceFlags,
    symbol::SymbolFlags,
};
use oxc_traverse::{BoundIdentifier, Traverse};

use crate::{context::TraverseCtx, state::TransformState};

/// enum member values (or None if it can't be evaluated at build time) keyed by names
type PrevMembers<'a> = FxHashMap<Atom<'a>, Option<ConstantValue<'a>>>;

pub struct TypeScriptEnum<'a> {
    enums: FxHashMap<Atom<'a>, PrevMembers<'a>>,
}

impl TypeScriptEnum<'_> {
    pub fn new() -> Self {
        Self { enums: FxHashMap::default() }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for TypeScriptEnum<'a> {
    fn enter_statement(&mut self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        let new_stmt = match stmt {
            Statement::TSEnumDeclaration(ts_enum_decl) => {
                self.transform_ts_enum(ts_enum_decl, None, ctx)
            }
            Statement::ExportNamedDeclaration(decl) => {
                let span = decl.span;
                if let Some(Declaration::TSEnumDeclaration(ts_enum_decl)) = &mut decl.declaration {
                    self.transform_ts_enum(ts_enum_decl, Some(span), ctx)
                } else {
                    None
                }
            }
            _ => None,
        };

        if let Some(new_stmt) = new_stmt {
            *stmt = new_stmt;
        }
    }
}

impl<'a> TypeScriptEnum<'a> {
    /// ```TypeScript
    /// enum Foo {
    ///   X = 1,
    ///   Y
    /// }
    /// ```
    /// ```JavaScript
    /// var Foo = ((Foo) => {
    ///   Foo[Foo["X"] = 1] = "X";
    ///   Foo[Foo["Y"] = 2] = "Y";
    ///   return Foo;
    /// })(Foo || {});
    /// ```
    fn transform_ts_enum(
        &mut self,
        decl: &mut TSEnumDeclaration<'a>,
        export_span: Option<Span>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Statement<'a>> {
        if decl.declare {
            return None;
        }

        let ast = ctx.ast;

        let is_export = export_span.is_some();
        let is_not_top_scope = !ctx.scoping().scope_flags(ctx.current_scope_id()).is_top();

        let enum_name = decl.id.name;
        let func_scope_id = decl.scope_id();
        let param_binding =
            ctx.generate_binding(enum_name, func_scope_id, SymbolFlags::FunctionScopedVariable);

        let id = param_binding.create_binding_pattern(ctx);

        // ((Foo) => {
        let params = ast.formal_parameter(SPAN, ast.vec(), id, None, false, false);
        let params = ast.vec1(params);
        let params = ast.alloc_formal_parameters(
            SPAN,
            FormalParameterKind::ArrowFormalParameters,
            params,
            NONE,
        );

        let has_potential_side_effect = decl.body.members.iter().any(|member| {
            matches!(
                member.initializer,
                Some(Expression::NewExpression(_) | Expression::CallExpression(_))
            )
        });

        let statements = self.transform_ts_enum_members(
            decl.scope_id(),
            &mut decl.body.members,
            &param_binding,
            ctx,
        );
        let body = ast.alloc_function_body(decl.span, ast.vec(), statements);
        let callee = ctx.ast.expression_function_with_scope_id_and_pure_and_pife(
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
            Some(body),
            func_scope_id,
            false,
            false,
        );

        let enum_symbol_id = decl.id.symbol_id();

        // Foo[Foo["X"] = 0] = "X";
        let redeclarations = ctx.scoping().symbol_redeclarations(enum_symbol_id);
        let is_already_declared =
            redeclarations.first().map_or_else(|| false, |rd| rd.span != decl.id.span);

        let arguments = if (is_export || is_not_top_scope) && !is_already_declared {
            // }({});
            let object_expr = ast.expression_object(SPAN, ast.vec());
            ast.vec1(Argument::from(object_expr))
        } else {
            // }(Foo || {});
            let op = LogicalOperator::Or;
            let left = ctx.create_bound_ident_expr(
                decl.id.span,
                enum_name,
                enum_symbol_id,
                ReferenceFlags::Read,
            );
            let right = ast.expression_object(SPAN, ast.vec());
            let expression = ast.expression_logical(SPAN, left, op, right);
            ast.vec1(Argument::from(expression))
        };

        let call_expression = ast.expression_call_with_pure(
            SPAN,
            callee,
            NONE,
            arguments,
            false,
            !has_potential_side_effect,
        );

        if is_already_declared {
            let op = AssignmentOperator::Assign;
            let left = ctx.create_bound_ident_reference(
                decl.id.span,
                enum_name,
                enum_symbol_id,
                ReferenceFlags::Write,
            );
            let left = AssignmentTarget::AssignmentTargetIdentifier(ctx.alloc(left));
            let expr = ast.expression_assignment(SPAN, op, left, call_expression);
            return Some(ast.statement_expression(decl.span, expr));
        }

        let kind = if is_export || is_not_top_scope {
            VariableDeclarationKind::Let
        } else {
            VariableDeclarationKind::Var
        };
        let decls = {
            let binding_identifier = decl.id.clone();
            let binding_pattern_kind =
                BindingPatternKind::BindingIdentifier(ctx.alloc(binding_identifier));
            let binding = ast.binding_pattern(binding_pattern_kind, NONE, false);
            let decl = ast.variable_declarator(SPAN, kind, binding, Some(call_expression), false);
            ast.vec1(decl)
        };
        let variable_declaration = ast.declaration_variable(decl.span, kind, decls, false);

        let stmt = if let Some(export_span) = export_span {
            let declaration = ctx
                .ast
                .plain_export_named_declaration_declaration(export_span, variable_declaration);
            Statement::ExportNamedDeclaration(declaration)
        } else {
            Statement::from(variable_declaration)
        };
        Some(stmt)
    }

    fn transform_ts_enum_members(
        &mut self,
        enum_scope_id: ScopeId,
        members: &mut ArenaVec<'a, TSEnumMember<'a>>,
        param_binding: &BoundIdentifier<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> ArenaVec<'a, Statement<'a>> {
        let ast = ctx.ast;

        let mut statements = ast.vec();

        // If enum number has no initializer, its value will be the previous member value + 1,
        // if it's the first member, it will be `0`.
        // It used to keep track of the previous constant number.
        let mut prev_constant_number = Some(-1.0);
        let mut previous_enum_members = self.enums.entry(param_binding.name).or_default().clone();

        let mut prev_member_name = None;

        for member in members.take_in(ctx.ast) {
            let member_name = member.id.static_name();

            let init = if let Some(mut initializer) = member.initializer {
                let constant_value =
                    self.computed_constant_value(&initializer, &previous_enum_members, ctx);

                previous_enum_members.insert(member_name, constant_value);

                match constant_value {
                    None => {
                        prev_constant_number = None;

                        IdentifierReferenceRename::new(
                            param_binding.name,
                            enum_scope_id,
                            previous_enum_members.clone(),
                            ctx,
                        )
                        .visit_expression(&mut initializer);

                        initializer
                    }
                    Some(constant_value) => match constant_value {
                        ConstantValue::Number(v) => {
                            prev_constant_number = Some(v);
                            Self::get_initializer_expr(v, ctx)
                        }
                        ConstantValue::String(str) => {
                            prev_constant_number = None;
                            ast.expression_string_literal(SPAN, str, None)
                        }
                    },
                }
                // No initializer, try to infer the value from the previous member.
            } else if let Some(value) = &prev_constant_number {
                let value = value + 1.0;
                prev_constant_number = Some(value);
                previous_enum_members.insert(member_name, Some(ConstantValue::Number(value)));
                Self::get_initializer_expr(value, ctx)
            } else if let Some(prev_member_name) = prev_member_name {
                previous_enum_members.insert(member_name, None);
                let self_ref = {
                    let obj = param_binding.create_read_expression(ctx);
                    let expr = ctx.ast.expression_string_literal(SPAN, prev_member_name, None);
                    ast.member_expression_computed(SPAN, obj, expr, false).into()
                };

                // 1 + Foo["x"]
                let one = Self::get_number_literal_expression(1.0, ctx);
                ast.expression_binary(SPAN, one, BinaryOperator::Addition, self_ref)
            } else {
                previous_enum_members.insert(member_name, Some(ConstantValue::Number(0.0)));
                Self::get_number_literal_expression(0.0, ctx)
            };

            let is_str = init.is_string_literal();

            // Foo["x"] = init
            let member_expr = {
                let obj = param_binding.create_read_expression(ctx);
                let expr = ast.expression_string_literal(SPAN, member_name, None);

                ast.member_expression_computed(SPAN, obj, expr, false)
            };
            let left = SimpleAssignmentTarget::from(member_expr);
            let mut expr =
                ast.expression_assignment(SPAN, AssignmentOperator::Assign, left.into(), init);

            // Foo[Foo["x"] = init] = "x"
            if !is_str {
                let member_expr = {
                    let obj = param_binding.create_read_expression(ctx);
                    ast.member_expression_computed(SPAN, obj, expr, false)
                };
                let left = SimpleAssignmentTarget::from(member_expr);
                let right = ast.expression_string_literal(SPAN, member_name, None);
                expr =
                    ast.expression_assignment(SPAN, AssignmentOperator::Assign, left.into(), right);
            }

            prev_member_name = Some(member_name);
            statements.push(ast.statement_expression(member.span, expr));
        }

        self.enums.insert(param_binding.name, previous_enum_members.clone());

        let enum_ref = param_binding.create_read_expression(ctx);
        // return Foo;
        let return_stmt = ast.statement_return(SPAN, Some(enum_ref));
        statements.push(return_stmt);

        statements
    }

    fn get_number_literal_expression(value: f64, ctx: &TraverseCtx<'a>) -> Expression<'a> {
        ctx.ast.expression_numeric_literal(SPAN, value, None, NumberBase::Decimal)
    }

    fn get_initializer_expr(value: f64, ctx: &mut TraverseCtx<'a>) -> Expression<'a> {
        let is_negative = value < 0.0;

        // Infinity
        let expr = if value.is_infinite() {
            let infinity_symbol_id = ctx.scoping().find_binding(ctx.current_scope_id(), "Infinity");
            ctx.create_ident_expr(
                SPAN,
                Atom::from("Infinity"),
                infinity_symbol_id,
                ReferenceFlags::Read,
            )
        } else {
            let value = if is_negative { -value } else { value };
            Self::get_number_literal_expression(value, ctx)
        };

        if is_negative {
            ctx.ast.expression_unary(SPAN, UnaryOperator::UnaryNegation, expr)
        } else {
            expr
        }
    }
}

#[derive(Debug, Clone, Copy)]
enum ConstantValue<'a> {
    Number(f64),
    String(Atom<'a>),
}

impl<'a> TypeScriptEnum<'a> {
    /// Evaluate the expression to a constant value.
    /// Refer to [babel](https://github.com/babel/babel/blob/610897a9a96c5e344e77ca9665df7613d2f88358/packages/babel-plugin-transform-typescript/src/enum.ts#L241C1-L394C2)
    fn computed_constant_value(
        &self,
        expr: &Expression<'a>,
        prev_members: &PrevMembers<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Option<ConstantValue<'a>> {
        self.evaluate(expr, prev_members, ctx)
    }

    fn evaluate_ref(
        &self,
        expr: &Expression<'a>,
        prev_members: &PrevMembers<'a>,
    ) -> Option<ConstantValue<'a>> {
        match expr {
            match_member_expression!(Expression) => {
                let expr = expr.to_member_expression();
                let Expression::Identifier(ident) = expr.object() else { return None };
                let members = self.enums.get(&ident.name)?;
                let property = expr.static_property_name()?;
                *members.get(property)?
            }
            Expression::Identifier(ident) => {
                if ident.name == "Infinity" {
                    return Some(ConstantValue::Number(f64::INFINITY));
                } else if ident.name == "NaN" {
                    return Some(ConstantValue::Number(f64::NAN));
                }

                if let Some(value) = prev_members.get(&ident.name) {
                    return *value;
                }

                // TODO:
                // This is a bit tricky because we need to find the BindingIdentifier that corresponds to the identifier reference.
                // and then we may to evaluate the initializer of the BindingIdentifier.
                // finally, we can get the value of the identifier and call the `computed_constant_value` function.
                // See https://github.com/babel/babel/blob/610897a9a96c5e344e77ca9665df7613d2f88358/packages/babel-plugin-transform-typescript/src/enum.ts#L327-L329
                None
            }
            _ => None,
        }
    }

    fn evaluate(
        &self,
        expr: &Expression<'a>,
        prev_members: &PrevMembers<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Option<ConstantValue<'a>> {
        match expr {
            Expression::Identifier(_)
            | Expression::ComputedMemberExpression(_)
            | Expression::StaticMemberExpression(_)
            | Expression::PrivateFieldExpression(_) => self.evaluate_ref(expr, prev_members),
            Expression::BinaryExpression(expr) => {
                self.eval_binary_expression(expr, prev_members, ctx)
            }
            Expression::UnaryExpression(expr) => {
                self.eval_unary_expression(expr, prev_members, ctx)
            }
            Expression::NumericLiteral(lit) => Some(ConstantValue::Number(lit.value)),
            Expression::StringLiteral(lit) => Some(ConstantValue::String(lit.value)),
            Expression::TemplateLiteral(lit) => {
                let value = if let Some(quasi) = lit.single_quasi() {
                    quasi
                } else {
                    let mut value = StringBuilder::new_in(ctx.ast.allocator);
                    for (i, quasi) in lit.quasis.iter().enumerate() {
                        value.push_str(&quasi.value.cooked.unwrap_or(quasi.value.raw));
                        if i < lit.expressions.len() {
                            match self.evaluate(&lit.expressions[i], prev_members, ctx)? {
                                ConstantValue::String(str) => value.push_str(&str),
                                ConstantValue::Number(num) => value.push_str(&num.to_js_string()),
                            }
                        }
                    }
                    Atom::from(value.into_str())
                };
                Some(ConstantValue::String(value))
            }
            Expression::ParenthesizedExpression(expr) => {
                self.evaluate(&expr.expression, prev_members, ctx)
            }
            _ => None,
        }
    }

    fn eval_binary_expression(
        &self,
        expr: &BinaryExpression<'a>,
        prev_members: &PrevMembers<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Option<ConstantValue<'a>> {
        let left = self.evaluate(&expr.left, prev_members, ctx)?;
        let right = self.evaluate(&expr.right, prev_members, ctx)?;

        if matches!(expr.operator, BinaryOperator::Addition)
            && (matches!(left, ConstantValue::String(_))
                || matches!(right, ConstantValue::String(_)))
        {
            let left_string = match left {
                ConstantValue::String(str) => str,
                ConstantValue::Number(v) => ctx.ast.atom(&v.to_js_string()),
            };

            let right_string = match right {
                ConstantValue::String(str) => str,
                ConstantValue::Number(v) => ctx.ast.atom(&v.to_js_string()),
            };

            return Some(ConstantValue::String(
                ctx.ast.atom_from_strs_array([&left_string, &right_string]),
            ));
        }

        let left = match left {
            ConstantValue::Number(v) => v,
            ConstantValue::String(_) => return None,
        };

        let right = match right {
            ConstantValue::Number(v) => v,
            ConstantValue::String(_) => return None,
        };

        match expr.operator {
            BinaryOperator::ShiftRight => Some(ConstantValue::Number(f64::from(
                left.to_int_32().wrapping_shr(right.to_uint_32()),
            ))),
            BinaryOperator::ShiftRightZeroFill => Some(ConstantValue::Number(f64::from(
                (left.to_uint_32()).wrapping_shr(right.to_uint_32()),
            ))),
            BinaryOperator::ShiftLeft => Some(ConstantValue::Number(f64::from(
                left.to_int_32().wrapping_shl(right.to_uint_32()),
            ))),
            BinaryOperator::BitwiseXOR => {
                Some(ConstantValue::Number(f64::from(left.to_int_32() ^ right.to_int_32())))
            }
            BinaryOperator::BitwiseOR => {
                Some(ConstantValue::Number(f64::from(left.to_int_32() | right.to_int_32())))
            }
            BinaryOperator::BitwiseAnd => {
                Some(ConstantValue::Number(f64::from(left.to_int_32() & right.to_int_32())))
            }
            BinaryOperator::Multiplication => Some(ConstantValue::Number(left * right)),
            BinaryOperator::Division => Some(ConstantValue::Number(left / right)),
            BinaryOperator::Addition => Some(ConstantValue::Number(left + right)),
            BinaryOperator::Subtraction => Some(ConstantValue::Number(left - right)),
            BinaryOperator::Remainder => Some(ConstantValue::Number(left % right)),
            BinaryOperator::Exponential => Some(ConstantValue::Number(left.powf(right))),
            _ => None,
        }
    }

    fn eval_unary_expression(
        &self,
        expr: &UnaryExpression<'a>,
        prev_members: &PrevMembers<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Option<ConstantValue<'a>> {
        let value = self.evaluate(&expr.argument, prev_members, ctx)?;

        let value = match value {
            ConstantValue::Number(value) => value,
            ConstantValue::String(_) => {
                let value = if expr.operator == UnaryOperator::UnaryNegation {
                    ConstantValue::Number(f64::NAN)
                } else if expr.operator == UnaryOperator::BitwiseNot {
                    ConstantValue::Number(-1.0)
                } else {
                    value
                };
                return Some(value);
            }
        };

        match expr.operator {
            UnaryOperator::UnaryPlus => Some(ConstantValue::Number(value)),
            UnaryOperator::UnaryNegation => Some(ConstantValue::Number(-value)),
            UnaryOperator::BitwiseNot => Some(ConstantValue::Number(f64::from(!value.to_int_32()))),
            _ => None,
        }
    }
}

/// Rename the identifier references in the enum members to `enum_name.identifier`
/// ```ts
/// enum A {
///    a = 1,
///    b = a.toString(),
///    d = c,
/// }
/// ```
/// will be transformed to
/// ```ts
/// enum A {
///   a = 1,
///   b = A.a.toString(),
///   d = A.c,
/// }
/// ```
struct IdentifierReferenceRename<'a, 'ctx> {
    enum_name: Atom<'a>,
    previous_enum_members: PrevMembers<'a>,
    scope_stack: NonEmptyStack<ScopeId>,
    ctx: &'ctx TraverseCtx<'a>,
}

impl<'a, 'ctx> IdentifierReferenceRename<'a, 'ctx> {
    fn new(
        enum_name: Atom<'a>,
        enum_scope_id: ScopeId,
        previous_enum_members: PrevMembers<'a>,
        ctx: &'ctx TraverseCtx<'a>,
    ) -> Self {
        IdentifierReferenceRename {
            enum_name,
            previous_enum_members,
            scope_stack: NonEmptyStack::new(enum_scope_id),
            ctx,
        }
    }
}

impl IdentifierReferenceRename<'_, '_> {
    fn should_reference_enum_member(&self, ident: &IdentifierReference<'_>) -> bool {
        // Don't need to rename the identifier if it's not a member of the enum,
        if !self.previous_enum_members.contains_key(&ident.name) {
            return false;
        }

        let scoping = self.ctx.scoping.scoping();
        let Some(symbol_id) = scoping.get_reference(ident.reference_id()).symbol_id() else {
            // No symbol found, yet the name is found in previous_enum_members.
            // It must be referencing a member declared in a previous enum block: `enum Foo { A }; enum Foo { B = A }`
            return true;
        };

        let symbol_scope_id = scoping.symbol_scope_id(symbol_id);
        // Don't need to rename the identifier when it references a nested enum member:
        //
        // ```ts
        // enum OuterEnum {
        //   A = 0,
        //   B = () => {
        //     enum InnerEnum {
        //       A = 0,
        //       B = A,
        //           ^ This references to `InnerEnum.A` should not be renamed
        //     }
        //     return InnerEnum.B;
        //   }
        // }
        // ```
        *self.scope_stack.first() == symbol_scope_id
            // The resolved symbol is declared outside the enum,
            // and we have checked that the name exists in previous_enum_members:
            //
            // ```ts
            // const A = 0;
            // enum Foo { A }
            // enum Foo { B = A }
            //                ^ This should be renamed to Foo.A
            // ```
            || !self.scope_stack.contains(&symbol_scope_id)
    }
}

impl<'a> VisitMut<'a> for IdentifierReferenceRename<'a, '_> {
    fn enter_scope(&mut self, _flags: ScopeFlags, scope_id: &Cell<Option<ScopeId>>) {
        self.scope_stack.push(scope_id.get().unwrap());
    }

    fn leave_scope(&mut self) {
        self.scope_stack.pop();
    }

    fn visit_expression(&mut self, expr: &mut Expression<'a>) {
        match expr {
            Expression::Identifier(ident) if self.should_reference_enum_member(ident) => {
                let object = self.ctx.ast.expression_identifier(SPAN, self.enum_name);
                let property = self.ctx.ast.identifier_name(SPAN, ident.name);
                *expr = self.ctx.ast.member_expression_static(SPAN, object, property, false).into();
            }
            _ => {
                walk_mut::walk_expression(self, expr);
            }
        }
    }
}
