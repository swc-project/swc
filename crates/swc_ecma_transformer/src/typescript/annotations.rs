use oxc_allocator::{TakeIn, Vec as ArenaVec};
use oxc_ast::ast::*;
use oxc_diagnostics::OxcDiagnostic;
use oxc_semantic::SymbolFlags;
use oxc_span::{Atom, GetSpan, SPAN, Span};
use oxc_syntax::{
    operator::AssignmentOperator,
    reference::ReferenceFlags,
    scope::{ScopeFlags, ScopeId},
    symbol::SymbolId,
};
use oxc_traverse::Traverse;

use crate::{
    TypeScriptOptions,
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

pub struct TypeScriptAnnotations<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,

    // Options
    only_remove_type_imports: bool,

    /// Assignments to be added to the constructor body
    assignments: Vec<Assignment<'a>>,
    has_super_call: bool,

    has_jsx_element: bool,
    has_jsx_fragment: bool,
    jsx_element_import_name: String,
    jsx_fragment_import_name: String,
}

impl<'a, 'ctx> TypeScriptAnnotations<'a, 'ctx> {
    pub fn new(options: &TypeScriptOptions, ctx: &'ctx TransformCtx<'a>) -> Self {
        let jsx_element_import_name = if options.jsx_pragma.contains('.') {
            options.jsx_pragma.split('.').next().map(String::from).unwrap()
        } else {
            options.jsx_pragma.to_string()
        };

        let jsx_fragment_import_name = if options.jsx_pragma_frag.contains('.') {
            options.jsx_pragma_frag.split('.').next().map(String::from).unwrap()
        } else {
            options.jsx_pragma_frag.to_string()
        };

        Self {
            ctx,
            only_remove_type_imports: options.only_remove_type_imports,
            has_super_call: false,
            assignments: vec![],
            has_jsx_element: false,
            has_jsx_fragment: false,
            jsx_element_import_name,
            jsx_fragment_import_name,
        }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for TypeScriptAnnotations<'a, '_> {
    fn exit_program(&mut self, program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        let mut no_modules_remaining = true;
        let mut some_modules_deleted = false;

        program.body.retain_mut(|stmt| {
            let need_retain = match stmt {
                Statement::ExportNamedDeclaration(decl) if decl.declaration.is_some() => {
                    decl.declaration.as_ref().is_some_and(|decl| !decl.is_typescript_syntax())
                }
                Statement::ExportNamedDeclaration(decl) => {
                    if decl.export_kind.is_type() {
                        false
                    } else if decl.specifiers.is_empty() {
                        // `export {}` or `export {} from 'mod'`
                        // Keep the export declaration if there are no export specifiers
                        true
                    } else {
                        decl.specifiers
                            .retain(|specifier| Self::can_retain_export_specifier(specifier, ctx));
                        // Keep the export declaration if there are still specifiers after removing type exports
                        !decl.specifiers.is_empty()
                    }
                }
                Statement::ExportAllDeclaration(decl) => !decl.export_kind.is_type(),
                Statement::ExportDefaultDeclaration(decl) => {
                    !decl.is_typescript_syntax()
                        && !matches!(
                            &decl.declaration,
                            ExportDefaultDeclarationKind::Identifier(ident) if Self::is_refers_to_type(ident, ctx)
                        )
                }
                Statement::ImportDeclaration(decl) => {
                    if decl.import_kind.is_type() {
                        false
                    } else if let Some(specifiers) = &mut decl.specifiers {
                        if specifiers.is_empty() {
                            // import {} from 'mod' -> import 'mod'
                            decl.specifiers = None;
                            true
                        } else {
                            specifiers.retain(|specifier| {
                                let id = match specifier {
                                    ImportDeclarationSpecifier::ImportSpecifier(s) => {
                                        if s.import_kind.is_type() {
                                            return false;
                                        }
                                        &s.local
                                    }
                                    ImportDeclarationSpecifier::ImportDefaultSpecifier(s) => {
                                        &s.local
                                    }
                                    ImportDeclarationSpecifier::ImportNamespaceSpecifier(s) => {
                                        &s.local
                                    }
                                };
                                // If `only_remove_type_imports` is true, then we can return `true` to keep it because
                                // it is not a type import, otherwise we need to check if the identifier is referenced
                                if self.only_remove_type_imports {
                                    true
                                } else {
                                    self.has_value_reference(id, ctx)
                                }
                            });

                            if specifiers.is_empty() {
                                // `import { type A } from 'mod'`
                                if self.only_remove_type_imports {
                                    // -> `import 'mod'`
                                    decl.specifiers = None;
                                    true
                                } else {
                                    // Remove the import declaration if all specifiers are removed
                                    false
                                }
                            } else {
                                true
                            }
                        }
                    } else {
                        true
                    }
                }
                // `import Binding = X.Y.Z`
                // `Binding` can be referenced as a value or a type, but here we already know it only as a type
                // See `TypeScriptModule::transform_ts_import_equals`
                Statement::TSTypeAliasDeclaration(_)
                | Statement::TSExportAssignment(_)
                | Statement::TSNamespaceExportDeclaration(_) => false,
                _ => return true,
            };

            if need_retain {
                no_modules_remaining = false;
            } else {
                some_modules_deleted = true;
            }

            need_retain
        });

        // Determine if we still have import/export statements, otherwise we
        // need to inject an empty statement (`export {}`) so that the file is
        // still considered a module
        if no_modules_remaining && some_modules_deleted && self.ctx.module_imports.is_empty() {
            let export_decl = Statement::ExportNamedDeclaration(
                ctx.ast.plain_export_named_declaration(SPAN, ctx.ast.vec(), None),
            );
            program.body.push(export_decl);
        }
    }

    fn enter_arrow_function_expression(
        &mut self,
        expr: &mut ArrowFunctionExpression<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        expr.type_parameters = None;
        expr.return_type = None;
    }

    fn enter_variable_declarator(
        &mut self,
        decl: &mut VariableDeclarator<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        decl.definite = false;
    }

    fn enter_binding_pattern(&mut self, pat: &mut BindingPattern<'a>, _ctx: &mut TraverseCtx<'a>) {
        pat.type_annotation = None;

        if pat.kind.is_binding_identifier() {
            pat.optional = false;
        }
    }

    fn enter_call_expression(&mut self, expr: &mut CallExpression<'a>, _ctx: &mut TraverseCtx<'a>) {
        expr.type_arguments = None;
    }

    fn enter_chain_element(&mut self, element: &mut ChainElement<'a>, ctx: &mut TraverseCtx<'a>) {
        if let ChainElement::TSNonNullExpression(e) = element {
            *element = match e.expression.get_inner_expression_mut().take_in(ctx.ast) {
                Expression::CallExpression(call_expr) => ChainElement::CallExpression(call_expr),
                expr @ match_member_expression!(Expression) => {
                    ChainElement::from(expr.into_member_expression())
                }
                _ => {
                    /* syntax error */
                    return;
                }
            }
        }
    }

    fn enter_class(&mut self, class: &mut Class<'a>, _ctx: &mut TraverseCtx<'a>) {
        class.type_parameters = None;
        class.super_type_arguments = None;
        class.implements.clear();
        class.r#abstract = false;

        // Remove type only members
        class.body.body.retain(|elem| match elem {
            ClassElement::MethodDefinition(method) => {
                matches!(method.r#type, MethodDefinitionType::MethodDefinition)
                    && !method.value.is_typescript_syntax()
            }
            ClassElement::PropertyDefinition(prop) => {
                matches!(prop.r#type, PropertyDefinitionType::PropertyDefinition)
            }
            ClassElement::AccessorProperty(prop) => {
                matches!(prop.r#type, AccessorPropertyType::AccessorProperty)
            }
            ClassElement::TSIndexSignature(_) => false,
            ClassElement::StaticBlock(_) => true,
        });
    }

    fn exit_class(&mut self, class: &mut Class<'a>, _: &mut TraverseCtx<'a>) {
        // Remove `declare` properties from the class body, other ts-only properties have been removed in `enter_class`.
        // The reason that removing `declare` properties here because the legacy-decorator plugin needs to transform
        // `declare` field in the `exit_class` phase, so we have to ensure this step is run after the legacy-decorator plugin.
        class
            .body
            .body
            .retain(|elem| !matches!(elem, ClassElement::PropertyDefinition(prop) if prop.declare));
    }

    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        if expr.is_typescript_syntax() {
            let inner_expr = expr.get_inner_expression_mut();
            *expr = inner_expr.take_in(ctx.ast);
        }
    }

    fn enter_simple_assignment_target(
        &mut self,
        target: &mut SimpleAssignmentTarget<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(expr) = target.get_expression_mut() {
            match expr.get_inner_expression_mut() {
                // `foo!++` to `foo++`
                inner_expr @ Expression::Identifier(_) => {
                    let inner_expr = inner_expr.take_in(ctx.ast);
                    let Expression::Identifier(ident) = inner_expr else {
                        unreachable!();
                    };
                    *target = SimpleAssignmentTarget::AssignmentTargetIdentifier(ident);
                }
                // `foo.bar!++` to `foo.bar++`
                inner_expr @ match_member_expression!(Expression) => {
                    let inner_expr = inner_expr.take_in(ctx.ast);
                    let member_expr = inner_expr.into_member_expression();
                    *target = SimpleAssignmentTarget::from(member_expr);
                }
                _ => {
                    // This should be never hit until more syntax is added to the JavaScript/TypeScrips
                    self.ctx.error(OxcDiagnostic::error("Cannot strip out typescript syntax if SimpleAssignmentTarget is not an IdentifierReference or MemberExpression"));
                }
            }
        }
    }

    fn enter_assignment_target(
        &mut self,
        target: &mut AssignmentTarget<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(expr) = target.get_expression_mut() {
            let inner_expr = expr.get_inner_expression_mut();
            if inner_expr.is_member_expression() {
                let inner_expr = inner_expr.take_in(ctx.ast);
                let member_expr = inner_expr.into_member_expression();
                *target = AssignmentTarget::from(member_expr);
            }
        }
    }

    fn enter_formal_parameter(
        &mut self,
        param: &mut FormalParameter<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        param.accessibility = None;
        param.readonly = false;
        param.r#override = false;
    }

    fn exit_function(&mut self, func: &mut Function<'a>, _ctx: &mut TraverseCtx<'a>) {
        func.this_param = None;
        func.type_parameters = None;
        func.return_type = None;
    }

    fn enter_jsx_opening_element(
        &mut self,
        elem: &mut JSXOpeningElement<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        elem.type_arguments = None;
    }

    fn enter_method_definition(
        &mut self,
        def: &mut MethodDefinition<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        def.accessibility = None;
        def.optional = false;
        def.r#override = false;
    }

    fn enter_new_expression(&mut self, expr: &mut NewExpression<'a>, _ctx: &mut TraverseCtx<'a>) {
        expr.type_arguments = None;
    }

    fn enter_property_definition(
        &mut self,
        def: &mut PropertyDefinition<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        def.accessibility = None;
        def.definite = false;
        def.r#override = false;
        def.optional = false;
        def.readonly = false;
        def.type_annotation = None;
    }

    fn enter_accessor_property(
        &mut self,
        def: &mut AccessorProperty<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        def.accessibility = None;
        def.definite = false;
        def.type_annotation = None;
    }

    fn enter_statements(
        &mut self,
        stmts: &mut ArenaVec<'a, Statement<'a>>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        // Remove declare declaration
        stmts.retain(
            |stmt| {
                if let Some(decl) = stmt.as_declaration() { !decl.declare() } else { true }
            },
        );
    }

    fn exit_statement(&mut self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        // Add assignments after super calls
        if self.assignments.is_empty() {
            return;
        }

        let has_super_call = matches!(stmt, Statement::ExpressionStatement(stmt) if stmt.expression.is_super_call_expression());
        if !has_super_call {
            return;
        }

        // Add assignments after super calls
        self.ctx.statement_injector.insert_many_after(
            stmt,
            self.assignments
                .iter()
                .map(|assignment| assignment.create_this_property_assignment(ctx)),
        );
        self.has_super_call = true;
    }

    fn exit_statements(
        &mut self,
        stmts: &mut ArenaVec<'a, Statement<'a>>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        // Remove TS specific statements
        stmts.retain(|stmt| match stmt {
            Statement::ExpressionStatement(s) => !s.expression.is_typescript_syntax(),
            match_declaration!(Statement) => !stmt.to_declaration().is_typescript_syntax(),
            // Ignore ModuleDeclaration as it's handled in the program
            _ => true,
        });
    }

    /// Transform if statement's consequent and alternate to block statements if they are super calls
    /// ```ts
    /// if (true) super() else super();
    /// // to
    /// if (true) { super() } else { super() }
    /// ```
    fn enter_if_statement(&mut self, stmt: &mut IfStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        if !self.assignments.is_empty() {
            let consequent_span = match &stmt.consequent {
                Statement::ExpressionStatement(expr)
                    if expr.expression.is_super_call_expression() =>
                {
                    Some(expr.span)
                }
                _ => None,
            };
            if let Some(span) = consequent_span {
                let consequent = stmt.consequent.take_in(ctx.ast);
                stmt.consequent = Self::create_block_with_statement(consequent, span, ctx);
            }

            let alternate_span = match &stmt.alternate {
                Some(Statement::ExpressionStatement(expr))
                    if expr.expression.is_super_call_expression() =>
                {
                    Some(expr.span)
                }
                _ => None,
            };
            if let Some(span) = alternate_span {
                let alternate = stmt.alternate.take().unwrap();
                stmt.alternate = Some(Self::create_block_with_statement(alternate, span, ctx));
            }
        }

        Self::replace_with_empty_block_if_ts(&mut stmt.consequent, ctx.current_scope_id(), ctx);

        if stmt.alternate.as_ref().is_some_and(Statement::is_typescript_syntax) {
            stmt.alternate = None;
        }
    }

    fn enter_for_statement(&mut self, stmt: &mut ForStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        let scope_id = stmt.scope_id();
        Self::replace_for_statement_body_with_empty_block_if_ts(&mut stmt.body, scope_id, ctx);
    }

    fn enter_for_in_statement(&mut self, stmt: &mut ForInStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        let scope_id = stmt.scope_id();
        Self::replace_for_statement_body_with_empty_block_if_ts(&mut stmt.body, scope_id, ctx);
    }

    fn enter_for_of_statement(&mut self, stmt: &mut ForOfStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        let scope_id = stmt.scope_id();
        Self::replace_for_statement_body_with_empty_block_if_ts(&mut stmt.body, scope_id, ctx);
    }

    fn enter_while_statement(&mut self, stmt: &mut WhileStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        Self::replace_with_empty_block_if_ts(&mut stmt.body, ctx.current_scope_id(), ctx);
    }

    fn enter_do_while_statement(
        &mut self,
        stmt: &mut DoWhileStatement<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        Self::replace_with_empty_block_if_ts(&mut stmt.body, ctx.current_scope_id(), ctx);
    }

    fn enter_tagged_template_expression(
        &mut self,
        expr: &mut TaggedTemplateExpression<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        expr.type_arguments = None;
    }

    fn enter_jsx_element(&mut self, _elem: &mut JSXElement<'a>, _ctx: &mut TraverseCtx<'a>) {
        self.has_jsx_element = true;
    }

    fn enter_jsx_fragment(&mut self, _elem: &mut JSXFragment<'a>, _ctx: &mut TraverseCtx<'a>) {
        self.has_jsx_fragment = true;
    }
}

impl<'a> TypeScriptAnnotations<'a, '_> {
    /// Check if the given name is a JSX pragma or fragment pragma import
    /// and if the file contains JSX elements or fragments
    fn is_jsx_imports(&self, name: &str) -> bool {
        self.has_jsx_element && name == self.jsx_element_import_name
            || self.has_jsx_fragment && name == self.jsx_fragment_import_name
    }

    fn create_block_with_statement(
        stmt: Statement<'a>,
        span: Span,
        ctx: &mut TraverseCtx<'a>,
    ) -> Statement<'a> {
        let scope_id = ctx.insert_scope_below_statement(&stmt, ScopeFlags::empty());
        ctx.ast.statement_block_with_scope_id(span, ctx.ast.vec1(stmt), scope_id)
    }

    fn replace_for_statement_body_with_empty_block_if_ts(
        body: &mut Statement<'a>,
        parent_scope_id: ScopeId,
        ctx: &mut TraverseCtx<'a>,
    ) {
        Self::replace_with_empty_block_if_ts(body, parent_scope_id, ctx);
    }

    fn replace_with_empty_block_if_ts(
        stmt: &mut Statement<'a>,
        parent_scope_id: ScopeId,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if stmt.is_typescript_syntax() {
            let scope_id = ctx.create_child_scope(parent_scope_id, ScopeFlags::empty());
            *stmt = ctx.ast.statement_block_with_scope_id(stmt.span(), ctx.ast.vec(), scope_id);
        }
    }

    fn has_value_reference(&self, id: &BindingIdentifier<'a>, ctx: &TraverseCtx<'a>) -> bool {
        let symbol_id = id.symbol_id();

        // `import T from 'mod'; const T = 1;` The T has a value redeclaration
        // `import T from 'mod'; type T = number;` The T has a type redeclaration
        // If the symbol is still a value symbol after `SymbolFlags::Import` is removed, then it's a value redeclaration.
        // That means the import is shadowed, and we can safely remove the import.
        if (ctx.scoping().symbol_flags(symbol_id) - SymbolFlags::Import).is_value() {
            return false;
        }

        if ctx.scoping().get_resolved_references(symbol_id).any(|reference| !reference.is_type()) {
            return true;
        }

        self.is_jsx_imports(&id.name)
    }

    fn can_retain_export_specifier(specifier: &ExportSpecifier<'a>, ctx: &TraverseCtx<'a>) -> bool {
        if specifier.export_kind.is_type() {
            return false;
        }
        !matches!(&specifier.local, ModuleExportName::IdentifierReference(ident) if Self::is_refers_to_type(ident, ctx))
    }

    fn is_refers_to_type(ident: &IdentifierReference<'a>, ctx: &TraverseCtx<'a>) -> bool {
        let scoping = ctx.scoping();
        let reference = scoping.get_reference(ident.reference_id());

        reference.symbol_id().is_some_and(|symbol_id| {
            reference.is_type()
                || scoping.symbol_flags(symbol_id).is_ambient()
                    && scoping.symbol_redeclarations(symbol_id).iter().all(|r| r.flags.is_ambient())
        })
    }
}

struct Assignment<'a> {
    span: Span,
    name: Atom<'a>,
    symbol_id: SymbolId,
}

impl<'a> Assignment<'a> {
    // Creates `this.name = name`
    fn create_this_property_assignment(&self, ctx: &mut TraverseCtx<'a>) -> Statement<'a> {
        let reference_id = ctx.create_bound_reference(self.symbol_id, ReferenceFlags::Read);
        let id = ctx.ast.identifier_reference_with_reference_id(self.span, self.name, reference_id);

        ctx.ast.statement_expression(
            SPAN,
            ctx.ast.expression_assignment(
                SPAN,
                AssignmentOperator::Assign,
                SimpleAssignmentTarget::from(ctx.ast.member_expression_static(
                    SPAN,
                    ctx.ast.expression_this(SPAN),
                    ctx.ast.identifier_name(self.span, self.name),
                    false,
                ))
                .into(),
                Expression::Identifier(ctx.alloc(id)),
            ),
        )
    }
}
