use oxc_allocator::{Box as ArenaBox, TakeIn, Vec as ArenaVec};
use oxc_ast::{NONE, ast::*};
use oxc_ecmascript::BoundNames;
use oxc_span::SPAN;
use oxc_syntax::{
    operator::{AssignmentOperator, LogicalOperator},
    scope::{ScopeFlags, ScopeId},
    symbol::SymbolFlags,
};
use oxc_traverse::{BoundIdentifier, Traverse};

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

use super::{
    TypeScriptOptions,
    diagnostics::{ambient_module_nested, namespace_exporting_non_const, namespace_not_supported},
};

pub struct TypeScriptNamespace<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,

    // Options
    allow_namespaces: bool,
}

impl<'a, 'ctx> TypeScriptNamespace<'a, 'ctx> {
    pub fn new(options: &TypeScriptOptions, ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { ctx, allow_namespaces: options.allow_namespaces }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for TypeScriptNamespace<'a, '_> {
    // `namespace Foo { }` -> `let Foo; (function (_Foo) { })(Foo || (Foo = {}));`
    fn enter_program(&mut self, program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        // namespace declaration is only allowed at the top level
        if !has_namespace(program.body.as_slice()) {
            return;
        }

        // Recreate the statements vec for memory efficiency.
        // Inserting the `let` declaration multiple times will reallocate the whole statements vec
        // every time a namespace declaration is encountered.
        let mut new_stmts = ctx.ast.vec();

        for stmt in program.body.take_in(ctx.ast) {
            match stmt {
                Statement::TSModuleDeclaration(decl) => {
                    if !self.allow_namespaces {
                        self.ctx.error(namespace_not_supported(decl.span));
                    }

                    self.handle_nested(decl, /* is_export */ false, &mut new_stmts, None, ctx);
                    continue;
                }
                Statement::ExportNamedDeclaration(export_decl)
                    if export_decl.declaration.as_ref().is_some_and(|declaration| {
                        !declaration.declare()
                            && matches!(declaration, Declaration::TSModuleDeclaration(_))
                    }) =>
                {
                    let Some(Declaration::TSModuleDeclaration(decl)) =
                        export_decl.unbox().declaration
                    else {
                        unreachable!()
                    };

                    if !self.allow_namespaces {
                        self.ctx.error(namespace_not_supported(decl.span));
                    }

                    self.handle_nested(decl, /* is_export */ true, &mut new_stmts, None, ctx);
                    continue;
                }
                _ => {}
            }

            new_stmts.push(stmt);
        }

        program.body = new_stmts;
    }
}

impl<'a> TypeScriptNamespace<'a, '_> {
    fn handle_nested(
        &self,
        decl: ArenaBox<'a, TSModuleDeclaration<'a>>,
        is_export: bool,
        parent_stmts: &mut ArenaVec<'a, Statement<'a>>,
        parent_binding: Option<&BoundIdentifier<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if decl.declare {
            return;
        }

        // Skip empty declaration e.g. `namespace x;`
        let TSModuleDeclaration { span, id, body, scope_id, .. } = decl.unbox();

        let TSModuleDeclarationName::Identifier(ident) = id else {
            self.ctx.error(ambient_module_nested(span));
            return;
        };

        // Check if this is an empty namespace or only contains type declarations
        let symbol_id = ident.symbol_id();
        let flags = ctx.scoping().symbol_flags(symbol_id);

        // If it's a namespace, we need additional checks to determine if it can return early.
        if flags.is_namespace_module() {
            // Don't need further check because NO `ValueModule` namespace redeclaration
            if !flags.is_value_module() {
                return;
            }

            // Input:
            // ```ts
            // // SymbolFlags: NameSpaceModule
            // export namespace Foo {
            // 	 export type T = 0;
            // }
            // // SymbolFlags: ValueModule
            // export namespace Foo {
            // 	 export const Bar = 1;
            // }
            // ```
            //
            // Output:
            // ```js
            // // SymbolFlags: ValueModule
            // export let Foo;
            // (function(_Foo) {
            //   const Bar = _Foo.Bar = 1;
            // })(Foo || (Foo = {}));
            // ```
            //
            // When both `NameSpaceModule` and `ValueModule` are present, we need to check the current
            // declaration flags. If the current declaration is `NameSpaceModule`, we can return early
            // because it's a type-only namespace and doesn't emit any JS code, otherwise we need to
            // continue transforming it.

            // Find the current declaration flag
            let current_declaration_flags = ctx
                .scoping()
                .symbol_redeclarations(symbol_id)
                .iter()
                .find(|rd| rd.span == ident.span)
                .unwrap()
                .flags;

            // Return if the current declaration is a namespace
            if current_declaration_flags.is_namespace_module() {
                return;
            }
        }

        let Some(body) = body else {
            return;
        };

        let binding = BoundIdentifier::from_binding_ident(&ident);

        // Reuse `TSModuleDeclaration`'s scope in transformed function
        let scope_id = scope_id.get().unwrap();
        let uid_binding =
            ctx.generate_uid(&binding.name, scope_id, SymbolFlags::FunctionScopedVariable);

        let directives;
        let namespace_top_level;

        match body {
            TSModuleDeclarationBody::TSModuleBlock(block) => {
                let block = block.unbox();
                directives = block.directives;
                namespace_top_level = block.body;
            }
            // We handle `namespace X.Y {}` as if it was
            //   namespace X {
            //     export namespace Y {}
            //   }
            TSModuleDeclarationBody::TSModuleDeclaration(declaration) => {
                let declaration = Declaration::TSModuleDeclaration(declaration);
                let export_named_decl =
                    ctx.ast.plain_export_named_declaration_declaration(SPAN, declaration);
                let stmt = Statement::ExportNamedDeclaration(export_named_decl);
                directives = ctx.ast.vec();
                namespace_top_level = ctx.ast.vec1(stmt);
            }
        }

        let mut new_stmts = ctx.ast.vec();

        for stmt in namespace_top_level {
            match stmt {
                Statement::TSModuleDeclaration(decl) => {
                    self.handle_nested(decl, /* is_export */ false, &mut new_stmts, None, ctx);
                }
                Statement::ExportNamedDeclaration(export_decl) => {
                    // NB: `ExportNamedDeclaration` with no declaration (e.g. `export {x}`) is not
                    // legal syntax in TS namespaces
                    let export_decl = export_decl.unbox();
                    if let Some(decl) = export_decl.declaration {
                        if decl.declare() {
                            continue;
                        }
                        match decl {
                            Declaration::TSImportEqualsDeclaration(ref import_equals) => {
                                let binding =
                                    BoundIdentifier::from_binding_ident(&import_equals.id);
                                new_stmts.push(Statement::from(decl));
                                Self::add_declaration(&uid_binding, &binding, &mut new_stmts, ctx);
                            }
                            Declaration::TSEnumDeclaration(ref enum_decl) => {
                                let binding = BoundIdentifier::from_binding_ident(&enum_decl.id);
                                new_stmts.push(Statement::from(decl));
                                Self::add_declaration(&uid_binding, &binding, &mut new_stmts, ctx);
                            }
                            Declaration::ClassDeclaration(ref class_decl) => {
                                // Class declaration always has a binding
                                let binding = BoundIdentifier::from_binding_ident(
                                    class_decl.id.as_ref().unwrap(),
                                );
                                new_stmts.push(Statement::from(decl));
                                Self::add_declaration(&uid_binding, &binding, &mut new_stmts, ctx);
                            }
                            Declaration::FunctionDeclaration(ref func_decl)
                                if !func_decl.is_typescript_syntax() =>
                            {
                                // Function declaration always has a binding
                                let binding = BoundIdentifier::from_binding_ident(
                                    func_decl.id.as_ref().unwrap(),
                                );
                                new_stmts.push(Statement::from(decl));
                                Self::add_declaration(&uid_binding, &binding, &mut new_stmts, ctx);
                            }
                            Declaration::VariableDeclaration(var_decl) => {
                                var_decl.declarations.iter().for_each(|decl| {
                                    if !decl.kind.is_const() {
                                        self.ctx.error(namespace_exporting_non_const(decl.span));
                                    }
                                });
                                let stmts =
                                    Self::handle_variable_declaration(var_decl, &uid_binding, ctx);
                                new_stmts.extend(stmts);
                            }
                            Declaration::TSModuleDeclaration(module_decl) => {
                                self.handle_nested(
                                    module_decl,
                                    /* is_export */
                                    false,
                                    &mut new_stmts,
                                    Some(&uid_binding),
                                    ctx,
                                );
                            }
                            _ => {}
                        }
                    }
                }
                _ => new_stmts.push(stmt),
            }
        }

        if !Self::is_redeclaration_namespace(&ident, ctx) {
            let declaration = Self::create_variable_declaration(&binding, ctx);
            if is_export {
                let export_named_decl =
                    ctx.ast.plain_export_named_declaration_declaration(SPAN, declaration);
                let stmt = Statement::ExportNamedDeclaration(export_named_decl);
                parent_stmts.push(stmt);
            } else {
                parent_stmts.push(Statement::from(declaration));
            }
        }
        let func_body = ctx.ast.function_body(SPAN, directives, new_stmts);

        parent_stmts.push(Self::transform_namespace(
            span,
            &uid_binding,
            &binding,
            parent_binding,
            func_body,
            scope_id,
            ctx,
        ));
    }

    // `namespace Foo { }` -> `let Foo; (function (_Foo) { })(Foo || (Foo = {}));`
    //                         ^^^^^^^
    fn create_variable_declaration(
        binding: &BoundIdentifier<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Declaration<'a> {
        let kind = VariableDeclarationKind::Let;
        let declarations = {
            let pattern = binding.create_binding_pattern(ctx);
            let decl = ctx.ast.variable_declarator(SPAN, kind, pattern, None, false);
            ctx.ast.vec1(decl)
        };
        ctx.ast.declaration_variable(SPAN, kind, declarations, false)
    }

    // `namespace Foo { }` -> `let Foo; (function (_Foo) { })(Foo || (Foo = {}));`
    fn transform_namespace(
        span: Span,
        param_binding: &BoundIdentifier<'a>,
        binding: &BoundIdentifier<'a>,
        parent_binding: Option<&BoundIdentifier<'a>>,
        func_body: FunctionBody<'a>,
        scope_id: ScopeId,
        ctx: &mut TraverseCtx<'a>,
    ) -> Statement<'a> {
        // `(function (_N) { var x; })(N || (N = {}))`;
        //  ^^^^^^^^^^^^^^^^^^^^^^^^^^
        let callee = {
            let params = {
                let pattern = param_binding.create_binding_pattern(ctx);
                let items = ctx.ast.vec1(ctx.ast.plain_formal_parameter(SPAN, pattern));
                ctx.ast.formal_parameters(SPAN, FormalParameterKind::FormalParameter, items, NONE)
            };
            let function_expr =
                Expression::FunctionExpression(ctx.ast.alloc_plain_function_with_scope_id(
                    FunctionType::FunctionExpression,
                    SPAN,
                    None,
                    params,
                    func_body,
                    scope_id,
                ));
            *ctx.scoping_mut().scope_flags_mut(scope_id) =
                ScopeFlags::Function | ScopeFlags::StrictMode;
            ctx.ast.expression_parenthesized(SPAN, function_expr)
        };

        // (function (_N) { var M; (function (_M) { var x; })(M || (M = _N.M || (_N.M = {})));})(N || (N = {}));
        //                                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^    ^^^^^^^^^^^^^^
        //                                                   Nested namespace arguments         Normal namespace arguments
        let arguments = {
            // M
            let logical_left = binding.create_read_expression(ctx);

            // (_N.M = {}) or (N = {})
            let mut logical_right = {
                // _N.M
                let assign_left = if let Some(parent_binding) = parent_binding {
                    AssignmentTarget::from(ctx.ast.member_expression_static(
                        SPAN,
                        parent_binding.create_read_expression(ctx),
                        ctx.ast.identifier_name(SPAN, binding.name),
                        false,
                    ))
                } else {
                    // _N
                    binding.create_write_target(ctx)
                };

                let assign_right = ctx.ast.expression_object(SPAN, ctx.ast.vec());
                let op = AssignmentOperator::Assign;
                let assign_expr =
                    ctx.ast.expression_assignment(SPAN, op, assign_left, assign_right);
                ctx.ast.expression_parenthesized(SPAN, assign_expr)
            };

            // (M = _N.M || (_N.M = {}))
            if let Some(parent_binding) = parent_binding {
                let assign_left = binding.create_write_target(ctx);
                let assign_right = {
                    let property = ctx.ast.identifier_name(SPAN, binding.name);
                    let logical_left = ctx.ast.member_expression_static(
                        SPAN,
                        parent_binding.create_read_expression(ctx),
                        property,
                        false,
                    );
                    let op = LogicalOperator::Or;
                    ctx.ast.expression_logical(SPAN, logical_left.into(), op, logical_right)
                };
                let op = AssignmentOperator::Assign;
                logical_right = ctx.ast.expression_assignment(SPAN, op, assign_left, assign_right);
                logical_right = ctx.ast.expression_parenthesized(SPAN, logical_right);
            }

            let expr =
                ctx.ast.expression_logical(SPAN, logical_left, LogicalOperator::Or, logical_right);
            ctx.ast.vec1(Argument::from(expr))
        };

        let expr = ctx.ast.expression_call(SPAN, callee, NONE, arguments, false);
        ctx.ast.statement_expression(span, expr)
    }

    /// Add assignment statement for decl id
    /// function id() {} -> function id() {}; Name.id = id;
    fn add_declaration(
        namespace_binding: &BoundIdentifier<'a>,
        value_binding: &BoundIdentifier<'a>,
        new_stmts: &mut ArenaVec<'a, Statement<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let assignment_statement =
            Self::create_assignment_statement(namespace_binding, value_binding, ctx);
        let assignment_statement = ctx.ast.statement_expression(SPAN, assignment_statement);
        new_stmts.push(assignment_statement);
    }

    // parent_binding.binding = binding
    fn create_assignment_statement(
        object_binding: &BoundIdentifier<'a>,
        value_binding: &BoundIdentifier<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let object = object_binding.create_read_expression(ctx);
        let property = ctx.ast.identifier_name(SPAN, value_binding.name);
        let left = ctx.ast.member_expression_static(SPAN, object, property, false);
        let left = AssignmentTarget::from(left);
        let right = value_binding.create_read_expression(ctx);
        let op = AssignmentOperator::Assign;
        ctx.ast.expression_assignment(SPAN, op, left, right)
    }

    /// Convert `export const foo = 1` to `Namespace.foo = 1`;
    fn handle_variable_declaration(
        mut var_decl: ArenaBox<'a, VariableDeclaration<'a>>,
        binding: &BoundIdentifier<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> ArenaVec<'a, Statement<'a>> {
        let is_all_binding_identifier = var_decl
            .declarations
            .iter()
            .all(|declaration| declaration.id.kind.is_binding_identifier());

        // `export const a = 1` transforms to `const a = N.a = 1`, the output
        // is smaller than `const a = 1; N.a = a`;
        if is_all_binding_identifier {
            var_decl.declarations.iter_mut().for_each(|declarator| {
                let Some(property_name) = declarator.id.get_identifier_name() else {
                    return;
                };
                if let Some(init) = &mut declarator.init {
                    declarator.init = Some(
                        ctx.ast.expression_assignment(
                            SPAN,
                            AssignmentOperator::Assign,
                            SimpleAssignmentTarget::from(ctx.ast.member_expression_static(
                                SPAN,
                                binding.create_read_expression(ctx),
                                ctx.ast.identifier_name(SPAN, property_name),
                                false,
                            ))
                            .into(),
                            init.take_in(ctx.ast),
                        ),
                    );
                }
            });
            return ctx.ast.vec1(Statement::VariableDeclaration(var_decl));
        }

        // Now we have pattern in declarators
        // `export const [a] = 1` transforms to `const [a] = 1; N.a = a`
        let mut assignments = ctx.ast.vec();
        var_decl.bound_names(&mut |id| {
            assignments.push(Self::create_assignment_statement(
                binding,
                &BoundIdentifier::from_binding_ident(id),
                ctx,
            ));
        });

        ctx.ast.vec_from_array([
            Statement::VariableDeclaration(var_decl),
            ctx.ast.statement_expression(SPAN, ctx.ast.expression_sequence(SPAN, assignments)),
        ])
    }

    /// Check the namespace binding identifier if it is a redeclaration
    fn is_redeclaration_namespace(id: &BindingIdentifier<'a>, ctx: &TraverseCtx<'a>) -> bool {
        let symbol_id = id.symbol_id();
        let redeclarations = ctx.scoping().symbol_redeclarations(symbol_id);
        // Find first value declaration because only value declaration will emit JS code.
        redeclarations.iter().find(|rd| rd.flags.is_value()).is_some_and(|rd| rd.span != id.span)
    }
}

/// Check if the statements contain a namespace declaration
fn has_namespace(stmts: &[Statement]) -> bool {
    stmts.iter().any(|stmt| match stmt {
        Statement::TSModuleDeclaration(_) => true,
        Statement::ExportNamedDeclaration(decl) => {
            matches!(decl.declaration, Some(Declaration::TSModuleDeclaration(_)))
        }
        _ => false,
    })
}
