//! Transformer / Transpiler
//!
//! References:
//! * <https://www.typescriptlang.org/tsconfig#target>
//! * <https://babel.dev/docs/presets>
//! * <https://github.com/microsoft/TypeScript/blob/v5.6.3/src/compiler/transformer.ts>

use std::path::Path;

use oxc_allocator::{Allocator, TakeIn, Vec as ArenaVec};
use oxc_ast::{AstBuilder, ast::*};
use oxc_diagnostics::OxcDiagnostic;
use oxc_semantic::Scoping;
use oxc_span::SPAN;
use oxc_traverse::{Traverse, traverse_mut};

// Core
mod common;
mod compiler_assumptions;
mod context;
mod options;
mod state;
mod utils;

// Presets: <https://babel.dev/docs/presets>
mod es2015;
mod es2016;
mod es2017;
mod es2018;
mod es2019;
mod es2020;
mod es2021;
mod es2022;
mod es2026;
mod jsx;
mod proposals;
mod regexp;
mod typescript;

mod decorator;
mod plugins;

use common::Common;
use context::{TransformCtx, TraverseCtx};
use decorator::Decorator;
use es2015::ES2015;
use es2016::ES2016;
use es2017::ES2017;
use es2018::ES2018;
use es2019::ES2019;
use es2020::ES2020;
use es2021::ES2021;
use es2022::ES2022;
use es2026::ES2026;
use jsx::Jsx;
use regexp::RegExp;
use rustc_hash::FxHashMap;
use state::TransformState;
use typescript::TypeScript;

use crate::plugins::Plugins;
pub use crate::{
    common::helper_loader::{Helper, HelperLoaderMode, HelperLoaderOptions},
    compiler_assumptions::CompilerAssumptions,
    decorator::DecoratorOptions,
    es2015::{ArrowFunctionsOptions, ES2015Options},
    es2016::ES2016Options,
    es2017::ES2017Options,
    es2018::ES2018Options,
    es2019::ES2019Options,
    es2020::ES2020Options,
    es2021::ES2021Options,
    es2022::{ClassPropertiesOptions, ES2022Options},
    es2026::ES2026Options,
    jsx::{JsxOptions, JsxRuntime, ReactRefreshOptions},
    options::{
        ESTarget, Engine, EngineTargets, EnvOptions, Module, TransformOptions,
        babel::{BabelEnvOptions, BabelOptions},
    },
    plugins::{PluginsOptions, StyledComponentsOptions},
    proposals::ProposalOptions,
    typescript::{RewriteExtensionsMode, TypeScriptOptions},
};

#[non_exhaustive]
pub struct TransformerReturn {
    pub errors: std::vec::Vec<OxcDiagnostic>,
    pub scoping: Scoping,
    /// Helpers used by this transform.
    #[deprecated = "Internal usage only"]
    pub helpers_used: FxHashMap<Helper, String>,
}

pub struct Transformer<'a> {
    ctx: TransformCtx<'a>,
    allocator: &'a Allocator,

    typescript: TypeScriptOptions,
    decorator: DecoratorOptions,
    plugins: PluginsOptions,
    jsx: JsxOptions,
    env: EnvOptions,
    #[expect(dead_code)]
    proposals: ProposalOptions,
}

impl<'a> Transformer<'a> {
    pub fn new(allocator: &'a Allocator, source_path: &Path, options: &TransformOptions) -> Self {
        let ctx = TransformCtx::new(source_path, options);
        Self {
            ctx,
            allocator,
            typescript: options.typescript.clone(),
            decorator: options.decorator,
            plugins: options.plugins.clone(),
            jsx: options.jsx.clone(),
            env: options.env,
            proposals: options.proposals,
        }
    }

    pub fn build_with_scoping(
        mut self,
        scoping: Scoping,
        program: &mut Program<'a>,
    ) -> TransformerReturn {
        let allocator = self.allocator;
        let ast_builder = AstBuilder::new(allocator);

        self.ctx.source_type = program.source_type;
        self.ctx.source_text = program.source_text;

        if program.source_type.is_jsx() {
            jsx::update_options_with_comments(
                &program.comments,
                &mut self.typescript,
                &mut self.jsx,
                &self.ctx,
            );
        }

        let mut transformer = TransformerImpl {
            common: Common::new(&self.env, &self.ctx),
            decorator: Decorator::new(self.decorator, &self.ctx),
            plugins: Plugins::new(self.plugins, &self.ctx),
            x0_typescript: program
                .source_type
                .is_typescript()
                .then(|| TypeScript::new(&self.typescript, &self.ctx)),
            x1_jsx: Jsx::new(self.jsx, self.env.es2018.object_rest_spread, ast_builder, &self.ctx),
            x2_es2026: ES2026::new(self.env.es2026, &self.ctx),
            x2_es2022: ES2022::new(
                self.env.es2022,
                !self.typescript.allow_declare_fields
                    || self.typescript.remove_class_fields_without_initializer,
                &self.ctx,
            ),
            x2_es2021: ES2021::new(self.env.es2021, &self.ctx),
            x2_es2020: ES2020::new(self.env.es2020, &self.ctx),
            x2_es2019: ES2019::new(self.env.es2019),
            x2_es2018: ES2018::new(self.env.es2018, &self.ctx),
            x2_es2016: ES2016::new(self.env.es2016, &self.ctx),
            x2_es2017: ES2017::new(self.env.es2017, &self.ctx),
            x3_es2015: ES2015::new(self.env.es2015, &self.ctx),
            x4_regexp: RegExp::new(self.env.regexp, &self.ctx),
        };

        let state = TransformState::default();
        let scoping = traverse_mut(&mut transformer, allocator, program, scoping, state);
        let helpers_used = self.ctx.helper_loader.used_helpers.borrow_mut().drain().collect();
        #[expect(deprecated)]
        TransformerReturn { errors: self.ctx.take_errors(), scoping, helpers_used }
    }
}

struct TransformerImpl<'a, 'ctx> {
    // NOTE: all callbacks must run in order.
    x0_typescript: Option<TypeScript<'a, 'ctx>>,
    decorator: Decorator<'a, 'ctx>,
    plugins: Plugins<'a, 'ctx>,
    x1_jsx: Jsx<'a, 'ctx>,
    x2_es2026: ES2026<'a, 'ctx>,
    x2_es2022: ES2022<'a, 'ctx>,
    x2_es2021: ES2021<'a, 'ctx>,
    x2_es2020: ES2020<'a, 'ctx>,
    x2_es2019: ES2019,
    x2_es2018: ES2018<'a, 'ctx>,
    x2_es2017: ES2017<'a, 'ctx>,
    x2_es2016: ES2016<'a, 'ctx>,
    #[expect(unused)]
    x3_es2015: ES2015<'a, 'ctx>,
    x4_regexp: RegExp<'a, 'ctx>,
    common: Common<'a, 'ctx>,
}

impl<'a> Traverse<'a, TransformState<'a>> for TransformerImpl<'a, '_> {
    fn enter_program(&mut self, program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_program(program, ctx);
        }
        self.plugins.enter_program(program, ctx);
        self.x1_jsx.enter_program(program, ctx);
        self.x2_es2026.enter_program(program, ctx);
    }

    fn exit_program(&mut self, program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        self.decorator.exit_program(program, ctx);
        self.x1_jsx.exit_program(program, ctx);
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.exit_program(program, ctx);
        }
        self.x2_es2022.exit_program(program, ctx);
        self.x2_es2020.exit_program(program, ctx);
        self.x2_es2018.exit_program(program, ctx);
        self.common.exit_program(program, ctx);
    }

    // ALPHASORT
    fn enter_arrow_function_expression(
        &mut self,
        arrow: &mut ArrowFunctionExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.common.enter_arrow_function_expression(arrow, ctx);
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_arrow_function_expression(arrow, ctx);
        }
        self.x2_es2018.enter_arrow_function_expression(arrow, ctx);
    }

    fn enter_variable_declaration(
        &mut self,
        decl: &mut VariableDeclaration<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.x2_es2018.enter_variable_declaration(decl, ctx);
    }

    fn enter_variable_declarator(
        &mut self,
        decl: &mut VariableDeclarator<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_variable_declarator(decl, ctx);
        }
        self.plugins.enter_variable_declarator(decl, ctx);
    }

    fn enter_big_int_literal(&mut self, node: &mut BigIntLiteral<'a>, ctx: &mut TraverseCtx<'a>) {
        self.x2_es2020.enter_big_int_literal(node, ctx);
    }

    fn enter_await_expression(
        &mut self,
        node: &mut AwaitExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.x2_es2022.enter_await_expression(node, ctx);
    }

    fn enter_import_specifier(
        &mut self,
        node: &mut ImportSpecifier<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.x2_es2020.enter_import_specifier(node, ctx);
    }

    fn enter_export_specifier(
        &mut self,
        node: &mut ExportSpecifier<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.x2_es2020.enter_export_specifier(node, ctx);
    }

    fn enter_binding_identifier(
        &mut self,
        node: &mut BindingIdentifier<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.common.enter_binding_identifier(node, ctx);
    }

    fn enter_identifier_reference(
        &mut self,
        node: &mut IdentifierReference<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.common.enter_identifier_reference(node, ctx);
    }

    fn enter_binding_pattern(&mut self, pat: &mut BindingPattern<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_binding_pattern(pat, ctx);
        }
    }

    fn enter_call_expression(&mut self, expr: &mut CallExpression<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_call_expression(expr, ctx);
        }
        self.plugins.enter_call_expression(expr, ctx);
        self.x1_jsx.enter_call_expression(expr, ctx);
    }

    fn enter_chain_element(&mut self, element: &mut ChainElement<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_chain_element(element, ctx);
        }
    }

    fn enter_class(&mut self, class: &mut Class<'a>, ctx: &mut TraverseCtx<'a>) {
        self.decorator.enter_class(class, ctx);
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_class(class, ctx);
        }
    }

    fn exit_class(&mut self, class: &mut Class<'a>, ctx: &mut TraverseCtx<'a>) {
        self.decorator.exit_class(class, ctx);
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.exit_class(class, ctx);
        }
        self.x2_es2022.exit_class(class, ctx);
        // `decorator` has some statements should be inserted after `class-properties` plugin.
        self.decorator.exit_class_at_end(class, ctx);
    }

    fn enter_class_body(&mut self, body: &mut ClassBody<'a>, ctx: &mut TraverseCtx<'a>) {
        self.x2_es2022.enter_class_body(body, ctx);
    }

    fn enter_static_block(&mut self, block: &mut StaticBlock<'a>, ctx: &mut TraverseCtx<'a>) {
        self.common.enter_static_block(block, ctx);
        self.x2_es2022.enter_static_block(block, ctx);
    }

    fn exit_static_block(&mut self, block: &mut StaticBlock<'a>, ctx: &mut TraverseCtx<'a>) {
        self.common.exit_static_block(block, ctx);
        self.x2_es2026.exit_static_block(block, ctx);
        self.x2_es2022.exit_static_block(block, ctx);
    }

    #[inline]
    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        self.common.enter_expression(expr, ctx);
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_expression(expr, ctx);
        }
        self.plugins.enter_expression(expr, ctx);
        self.x2_es2022.enter_expression(expr, ctx);
        self.x2_es2021.enter_expression(expr, ctx);
        self.x2_es2020.enter_expression(expr, ctx);
        self.x2_es2018.enter_expression(expr, ctx);
        self.x2_es2016.enter_expression(expr, ctx);
        self.x4_regexp.enter_expression(expr, ctx);
    }

    fn exit_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        self.common.exit_expression(expr, ctx);
        self.x1_jsx.exit_expression(expr, ctx);
        self.x2_es2022.exit_expression(expr, ctx);
        self.x2_es2018.exit_expression(expr, ctx);
        self.x2_es2017.exit_expression(expr, ctx);
    }

    fn enter_simple_assignment_target(
        &mut self,
        node: &mut SimpleAssignmentTarget<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_simple_assignment_target(node, ctx);
        }
    }

    fn enter_assignment_target(
        &mut self,
        node: &mut AssignmentTarget<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_assignment_target(node, ctx);
        }
        self.x2_es2022.enter_assignment_target(node, ctx);
    }

    fn enter_formal_parameters(
        &mut self,
        node: &mut FormalParameters<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.x2_es2020.enter_formal_parameters(node, ctx);
    }

    fn exit_formal_parameters(
        &mut self,
        node: &mut FormalParameters<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.x2_es2020.exit_formal_parameters(node, ctx);
    }

    fn enter_formal_parameter(
        &mut self,
        param: &mut FormalParameter<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_formal_parameter(param, ctx);
        }
    }

    fn enter_function(&mut self, func: &mut Function<'a>, ctx: &mut TraverseCtx<'a>) {
        self.common.enter_function(func, ctx);
        self.x2_es2018.enter_function(func, ctx);
    }

    fn exit_function(&mut self, func: &mut Function<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.exit_function(func, ctx);
        }
        self.x1_jsx.exit_function(func, ctx);
        self.x2_es2018.exit_function(func, ctx);
        self.x2_es2017.exit_function(func, ctx);
        self.common.exit_function(func, ctx);
    }

    fn enter_function_body(&mut self, body: &mut FunctionBody<'a>, ctx: &mut TraverseCtx<'a>) {
        self.common.enter_function_body(body, ctx);
        self.x2_es2026.enter_function_body(body, ctx);
    }

    fn exit_function_body(&mut self, body: &mut FunctionBody<'a>, ctx: &mut TraverseCtx<'a>) {
        self.common.exit_function_body(body, ctx);
    }

    fn enter_jsx_element(&mut self, node: &mut JSXElement<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_jsx_element(node, ctx);
        }
    }

    fn enter_jsx_element_name(&mut self, node: &mut JSXElementName<'a>, ctx: &mut TraverseCtx<'a>) {
        self.common.enter_jsx_element_name(node, ctx);
    }

    fn enter_jsx_member_expression_object(
        &mut self,
        node: &mut JSXMemberExpressionObject<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.common.enter_jsx_member_expression_object(node, ctx);
    }

    fn enter_jsx_fragment(&mut self, node: &mut JSXFragment<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_jsx_fragment(node, ctx);
        }
    }

    fn enter_jsx_opening_element(
        &mut self,
        elem: &mut JSXOpeningElement<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_jsx_opening_element(elem, ctx);
        }
        self.x1_jsx.enter_jsx_opening_element(elem, ctx);
    }

    fn enter_method_definition(
        &mut self,
        def: &mut MethodDefinition<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.decorator.enter_method_definition(def, ctx);
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_method_definition(def, ctx);
        }
    }

    fn exit_method_definition(
        &mut self,
        def: &mut MethodDefinition<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.decorator.exit_method_definition(def, ctx);
    }

    fn enter_new_expression(&mut self, expr: &mut NewExpression<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_new_expression(expr, ctx);
        }
    }

    fn enter_property_definition(
        &mut self,
        def: &mut PropertyDefinition<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.decorator.enter_property_definition(def, ctx);
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_property_definition(def, ctx);
        }
        self.x2_es2022.enter_property_definition(def, ctx);
    }

    fn exit_property_definition(
        &mut self,
        def: &mut PropertyDefinition<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.decorator.exit_property_definition(def, ctx);
        self.x2_es2022.exit_property_definition(def, ctx);
    }

    fn enter_accessor_property(
        &mut self,
        node: &mut AccessorProperty<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.decorator.enter_accessor_property(node, ctx);
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_accessor_property(node, ctx);
        }
    }

    fn exit_accessor_property(
        &mut self,
        node: &mut AccessorProperty<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.decorator.exit_accessor_property(node, ctx);
    }

    fn enter_statements(
        &mut self,
        stmts: &mut ArenaVec<'a, Statement<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.common.enter_statements(stmts, ctx);
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_statements(stmts, ctx);
        }
    }

    fn exit_arrow_function_expression(
        &mut self,
        arrow: &mut ArrowFunctionExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.common.exit_arrow_function_expression(arrow, ctx);

        // Some plugins may add new statements to the ArrowFunctionExpression's body,
        // which can cause issues with the `() => x;` case, as it only allows a single statement.
        // To address this, we wrap the last statement in a return statement and set the expression to false.
        // This transforms the arrow function into the form `() => { return x; };`.
        let statements = &mut arrow.body.statements;
        if arrow.expression && statements.len() > 1 {
            arrow.expression = false;

            // Reverse looping to find the expression statement, because other plugins could
            // insert new statements after the expression statement.
            // `() => x;`
            // ->
            // ```
            // () => {
            //    var new_insert_variable;
            //    return x;
            //    function new_insert_function() {}
            // };
            // ```
            for stmt in statements.iter_mut().rev() {
                let Statement::ExpressionStatement(expr_stmt) = stmt else {
                    continue;
                };
                let expression = Some(expr_stmt.expression.take_in(ctx.ast));
                *stmt = ctx.ast.statement_return(SPAN, expression);
                return;
            }
            unreachable!("At least one statement should be expression statement")
        }
    }

    fn exit_statements(
        &mut self,
        stmts: &mut ArenaVec<'a, Statement<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.exit_statements(stmts, ctx);
        }
        self.common.exit_statements(stmts, ctx);
    }

    fn exit_statement(&mut self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.exit_statement(stmt, ctx);
        }
        self.decorator.exit_statement(stmt, ctx);
        self.x2_es2018.exit_statement(stmt, ctx);
        self.x2_es2017.exit_statement(stmt, ctx);
    }

    fn enter_tagged_template_expression(
        &mut self,
        expr: &mut TaggedTemplateExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_tagged_template_expression(expr, ctx);
        }
    }

    fn enter_statement(&mut self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        self.decorator.enter_statement(stmt, ctx);
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_statement(stmt, ctx);
        }
        self.x2_es2018.enter_statement(stmt, ctx);
        self.x2_es2026.enter_statement(stmt, ctx);
    }

    fn enter_declaration(&mut self, decl: &mut Declaration<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_declaration(decl, ctx);
        }
    }

    fn enter_if_statement(&mut self, stmt: &mut IfStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_if_statement(stmt, ctx);
        }
    }

    fn enter_while_statement(&mut self, stmt: &mut WhileStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_while_statement(stmt, ctx);
        }
    }

    fn enter_do_while_statement(
        &mut self,
        stmt: &mut DoWhileStatement<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_do_while_statement(stmt, ctx);
        }
    }

    fn enter_for_statement(&mut self, stmt: &mut ForStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_for_statement(stmt, ctx);
        }
    }

    fn enter_for_of_statement(&mut self, stmt: &mut ForOfStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_for_of_statement(stmt, ctx);
        }
        self.x2_es2026.enter_for_of_statement(stmt, ctx);
        self.x2_es2018.enter_for_of_statement(stmt, ctx);
    }

    fn enter_for_in_statement(&mut self, stmt: &mut ForInStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_for_in_statement(stmt, ctx);
        }
        self.x2_es2018.enter_for_in_statement(stmt, ctx);
    }

    fn enter_try_statement(&mut self, stmt: &mut TryStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        self.x2_es2026.enter_try_statement(stmt, ctx);
    }

    fn enter_catch_clause(&mut self, clause: &mut CatchClause<'a>, ctx: &mut TraverseCtx<'a>) {
        self.x2_es2019.enter_catch_clause(clause, ctx);
        self.x2_es2018.enter_catch_clause(clause, ctx);
    }

    fn enter_import_declaration(
        &mut self,
        node: &mut ImportDeclaration<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_import_declaration(node, ctx);
        }
    }

    fn enter_export_all_declaration(
        &mut self,
        node: &mut ExportAllDeclaration<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_export_all_declaration(node, ctx);
        }
        self.x2_es2020.enter_export_all_declaration(node, ctx);
    }

    fn enter_export_named_declaration(
        &mut self,
        node: &mut ExportNamedDeclaration<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_export_named_declaration(node, ctx);
        }
    }

    fn enter_ts_export_assignment(
        &mut self,
        export_assignment: &mut TSExportAssignment<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(typescript) = self.x0_typescript.as_mut() {
            typescript.enter_ts_export_assignment(export_assignment, ctx);
        }
    }

    fn enter_decorator(
        &mut self,
        node: &mut oxc_ast::ast::Decorator<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.decorator.enter_decorator(node, ctx);
    }
}
