use oxc_ast::ast::{Expression, Function, Statement};
use oxc_traverse::Traverse;

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

mod async_to_generator;
mod options;
pub use async_to_generator::{AsyncGeneratorExecutor, AsyncToGenerator};
pub use options::ES2017Options;

pub struct ES2017<'a, 'ctx> {
    options: ES2017Options,

    // Plugins
    async_to_generator: AsyncToGenerator<'a, 'ctx>,
}

impl<'a, 'ctx> ES2017<'a, 'ctx> {
    pub fn new(options: ES2017Options, ctx: &'ctx TransformCtx<'a>) -> ES2017<'a, 'ctx> {
        ES2017 { async_to_generator: AsyncToGenerator::new(ctx), options }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ES2017<'a, '_> {
    fn exit_expression(&mut self, node: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.async_to_generator {
            self.async_to_generator.exit_expression(node, ctx);
        }
    }

    fn exit_function(&mut self, node: &mut Function<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.async_to_generator {
            self.async_to_generator.exit_function(node, ctx);
        }
    }

    fn exit_statement(&mut self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.async_to_generator {
            self.async_to_generator.exit_statement(stmt, ctx);
        }
    }
}
