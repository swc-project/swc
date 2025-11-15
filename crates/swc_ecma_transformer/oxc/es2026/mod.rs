use oxc_ast::ast::*;
use oxc_traverse::Traverse;

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

mod explicit_resource_management;
mod options;

use explicit_resource_management::ExplicitResourceManagement;
pub use options::ES2026Options;

pub struct ES2026<'a, 'ctx> {
    explicit_resource_management: Option<ExplicitResourceManagement<'a, 'ctx>>,
}

impl<'a, 'ctx> ES2026<'a, 'ctx> {
    pub fn new(options: ES2026Options, ctx: &'ctx TransformCtx<'a>) -> Self {
        let explicit_resource_management = if options.explicit_resource_management {
            Some(ExplicitResourceManagement::new(ctx))
        } else {
            None
        };
        Self { explicit_resource_management }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ES2026<'a, '_> {
    fn enter_program(&mut self, program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(explicit_resource_management) = &mut self.explicit_resource_management {
            explicit_resource_management.enter_program(program, ctx);
        }
    }

    fn enter_for_of_statement(
        &mut self,
        for_of_stmt: &mut ForOfStatement<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(explicit_resource_management) = &mut self.explicit_resource_management {
            explicit_resource_management.enter_for_of_statement(for_of_stmt, ctx);
        }
    }

    fn exit_static_block(&mut self, block: &mut StaticBlock<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(explicit_resource_management) = &mut self.explicit_resource_management {
            explicit_resource_management.exit_static_block(block, ctx);
        }
    }

    fn enter_function_body(&mut self, body: &mut FunctionBody<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(explicit_resource_management) = &mut self.explicit_resource_management {
            explicit_resource_management.enter_function_body(body, ctx);
        }
    }

    fn enter_statement(&mut self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(explicit_resource_management) = &mut self.explicit_resource_management {
            explicit_resource_management.enter_statement(stmt, ctx);
        }
    }

    fn enter_try_statement(&mut self, node: &mut TryStatement<'a>, ctx: &mut TraverseCtx<'a>) {
        if let Some(explicit_resource_management) = &mut self.explicit_resource_management {
            explicit_resource_management.enter_try_statement(node, ctx);
        }
    }
}
