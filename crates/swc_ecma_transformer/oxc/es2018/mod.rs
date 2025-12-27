use oxc_ast::ast::*;
use oxc_traverse::Traverse;

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

mod async_generator_functions;
mod object_rest_spread;
mod options;

pub use async_generator_functions::AsyncGeneratorFunctions;
pub use object_rest_spread::{ObjectRestSpread, ObjectRestSpreadOptions};
pub use options::ES2018Options;

pub struct ES2018<'a, 'ctx> {
    options: ES2018Options,

    // Plugins
    object_rest_spread: ObjectRestSpread<'a, 'ctx>,
    async_generator_functions: AsyncGeneratorFunctions<'a, 'ctx>,
}

impl<'a, 'ctx> ES2018<'a, 'ctx> {
    pub fn new(options: ES2018Options, ctx: &'ctx TransformCtx<'a>) -> Self {
        Self {
            object_rest_spread: ObjectRestSpread::new(
                options.object_rest_spread.unwrap_or_default(),
                ctx,
            ),
            async_generator_functions: AsyncGeneratorFunctions::new(ctx),
            options,
        }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ES2018<'a, '_> {
    fn exit_program(&mut self, program: &mut oxc_ast::ast::Program<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.object_rest_spread.is_some() {
            self.object_rest_spread.exit_program(program, ctx);
        }
    }

    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.object_rest_spread.is_some() {
            self.object_rest_spread.enter_expression(expr, ctx);
        }
    }

    fn exit_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.async_generator_functions {
            self.async_generator_functions.exit_expression(expr, ctx);
        }
    }

    fn enter_statement(&mut self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.async_generator_functions {
            self.async_generator_functions.enter_statement(stmt, ctx);
        }
    }

    fn exit_statement(&mut self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.async_generator_functions {
            self.async_generator_functions.exit_statement(stmt, ctx);
        }
    }

    fn enter_for_in_statement(&mut self, stmt: &mut ForInStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.object_rest_spread.is_some() {
            self.object_rest_spread.enter_for_in_statement(stmt, ctx);
        }
    }

    fn enter_for_of_statement(&mut self, stmt: &mut ForOfStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.async_generator_functions {
            self.async_generator_functions.enter_for_of_statement(stmt, ctx);
        }
        if self.options.object_rest_spread.is_some() {
            self.object_rest_spread.enter_for_of_statement(stmt, ctx);
        }
    }

    fn enter_arrow_function_expression(
        &mut self,
        arrow: &mut ArrowFunctionExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if self.options.object_rest_spread.is_some() {
            self.object_rest_spread.enter_arrow_function_expression(arrow, ctx);
        }
    }

    fn enter_function(&mut self, func: &mut Function<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.object_rest_spread.is_some() {
            self.object_rest_spread.enter_function(func, ctx);
        }
    }

    fn exit_function(&mut self, node: &mut Function<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.async_generator_functions {
            self.async_generator_functions.exit_function(node, ctx);
        }
    }

    fn enter_variable_declaration(
        &mut self,
        decl: &mut VariableDeclaration<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if self.options.object_rest_spread.is_some() {
            self.object_rest_spread.enter_variable_declaration(decl, ctx);
        }
    }

    fn enter_catch_clause(&mut self, clause: &mut CatchClause<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.object_rest_spread.is_some() {
            self.object_rest_spread.enter_catch_clause(clause, ctx);
        }
    }
}
