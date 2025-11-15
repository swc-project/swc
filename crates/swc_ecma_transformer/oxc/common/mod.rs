//! Utility transforms which are in common between other transforms.

use arrow_function_converter::ArrowFunctionConverter;
use oxc_allocator::Vec as ArenaVec;
use oxc_ast::ast::*;
use oxc_traverse::Traverse;

use crate::{
    EnvOptions,
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

pub mod arrow_function_converter;
mod computed_key;
mod duplicate;
pub mod helper_loader;
pub mod module_imports;
pub mod statement_injector;
pub mod top_level_statements;
pub mod var_declarations;

use module_imports::ModuleImports;
use statement_injector::StatementInjector;
use top_level_statements::TopLevelStatements;
use var_declarations::VarDeclarations;

pub struct Common<'a, 'ctx> {
    module_imports: ModuleImports<'a, 'ctx>,
    var_declarations: VarDeclarations<'a, 'ctx>,
    statement_injector: StatementInjector<'a, 'ctx>,
    top_level_statements: TopLevelStatements<'a, 'ctx>,
    arrow_function_converter: ArrowFunctionConverter<'a>,
}

impl<'a, 'ctx> Common<'a, 'ctx> {
    pub fn new(options: &EnvOptions, ctx: &'ctx TransformCtx<'a>) -> Self {
        Self {
            module_imports: ModuleImports::new(ctx),
            var_declarations: VarDeclarations::new(ctx),
            statement_injector: StatementInjector::new(ctx),
            top_level_statements: TopLevelStatements::new(ctx),
            arrow_function_converter: ArrowFunctionConverter::new(options),
        }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for Common<'a, '_> {
    fn exit_program(&mut self, program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        self.module_imports.exit_program(program, ctx);
        self.var_declarations.exit_program(program, ctx);
        self.top_level_statements.exit_program(program, ctx);
        self.arrow_function_converter.exit_program(program, ctx);
        self.statement_injector.exit_program(program, ctx);
    }

    fn enter_statements(
        &mut self,
        stmts: &mut ArenaVec<'a, Statement<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.var_declarations.enter_statements(stmts, ctx);
    }

    fn exit_statements(
        &mut self,
        stmts: &mut ArenaVec<'a, Statement<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.var_declarations.exit_statements(stmts, ctx);
        self.statement_injector.exit_statements(stmts, ctx);
    }

    fn enter_function(&mut self, func: &mut Function<'a>, ctx: &mut TraverseCtx<'a>) {
        self.arrow_function_converter.enter_function(func, ctx);
    }

    fn exit_function(&mut self, func: &mut Function<'a>, ctx: &mut TraverseCtx<'a>) {
        self.arrow_function_converter.exit_function(func, ctx);
    }

    fn enter_arrow_function_expression(
        &mut self,
        arrow: &mut ArrowFunctionExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.arrow_function_converter.enter_arrow_function_expression(arrow, ctx);
    }

    fn exit_arrow_function_expression(
        &mut self,
        arrow: &mut ArrowFunctionExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.arrow_function_converter.exit_arrow_function_expression(arrow, ctx);
    }

    fn enter_function_body(&mut self, body: &mut FunctionBody<'a>, ctx: &mut TraverseCtx<'a>) {
        self.arrow_function_converter.enter_function_body(body, ctx);
    }

    fn exit_function_body(&mut self, body: &mut FunctionBody<'a>, ctx: &mut TraverseCtx<'a>) {
        self.arrow_function_converter.exit_function_body(body, ctx);
    }

    fn enter_static_block(&mut self, block: &mut StaticBlock<'a>, ctx: &mut TraverseCtx<'a>) {
        self.arrow_function_converter.enter_static_block(block, ctx);
    }

    fn exit_static_block(&mut self, block: &mut StaticBlock<'a>, ctx: &mut TraverseCtx<'a>) {
        self.arrow_function_converter.exit_static_block(block, ctx);
    }

    fn enter_jsx_element_name(
        &mut self,
        element_name: &mut JSXElementName<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.arrow_function_converter.enter_jsx_element_name(element_name, ctx);
    }

    fn enter_jsx_member_expression_object(
        &mut self,
        object: &mut JSXMemberExpressionObject<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.arrow_function_converter.enter_jsx_member_expression_object(object, ctx);
    }

    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        self.arrow_function_converter.enter_expression(expr, ctx);
    }

    fn exit_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        self.arrow_function_converter.exit_expression(expr, ctx);
    }

    fn enter_binding_identifier(
        &mut self,
        node: &mut BindingIdentifier<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.arrow_function_converter.enter_binding_identifier(node, ctx);
    }

    fn enter_identifier_reference(
        &mut self,
        node: &mut IdentifierReference<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        self.arrow_function_converter.enter_identifier_reference(node, ctx);
    }
}
