pub mod async_to_generator;

use swc_ecma_hooks::VisitMutHook;

use crate::{hook_utils::OptionalHook, TraverseCtx};

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2017Options {
    pub async_to_generator: Option<async_to_generator::Config>,
}

pub fn hook(options: Es2017Options) -> impl VisitMutHook<TraverseCtx> {
    Es2017Pass { options }
}

struct Es2017Pass {
    options: Es2017Options,
}

impl VisitMutHook<TraverseCtx> for Es2017Pass {
    fn enter_function(&mut self, function: &mut swc_ecma_ast::Function, ctx: &mut TraverseCtx) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .enter_function(function, ctx);
    }

    fn exit_function(&mut self, function: &mut swc_ecma_ast::Function, ctx: &mut TraverseCtx) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .exit_function(function, ctx);
    }

    fn enter_arrow_expr(
        &mut self,
        arrow_expr: &mut swc_ecma_ast::ArrowExpr,
        ctx: &mut TraverseCtx,
    ) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .enter_arrow_expr(arrow_expr, ctx);
    }

    fn exit_arrow_expr(&mut self, arrow_expr: &mut swc_ecma_ast::ArrowExpr, ctx: &mut TraverseCtx) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .exit_arrow_expr(arrow_expr, ctx);
    }

    fn enter_class(&mut self, class: &mut swc_ecma_ast::Class, ctx: &mut TraverseCtx) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .enter_class(class, ctx);
    }

    fn exit_class(&mut self, class: &mut swc_ecma_ast::Class, ctx: &mut TraverseCtx) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .exit_class(class, ctx);
    }

    fn enter_constructor(
        &mut self,
        constructor: &mut swc_ecma_ast::Constructor,
        ctx: &mut TraverseCtx,
    ) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .enter_constructor(constructor, ctx);
    }

    fn enter_getter_prop(&mut self, f: &mut swc_ecma_ast::GetterProp, ctx: &mut TraverseCtx) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .enter_getter_prop(f, ctx);
    }

    fn enter_setter_prop(&mut self, f: &mut swc_ecma_ast::SetterProp, ctx: &mut TraverseCtx) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .enter_setter_prop(f, ctx);
    }

    fn enter_expr(&mut self, expr: &mut swc_ecma_ast::Expr, ctx: &mut TraverseCtx) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .enter_expr(expr, ctx);
    }

    fn enter_super(&mut self, s: &mut swc_ecma_ast::Super, ctx: &mut TraverseCtx) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .enter_super(s, ctx);
    }

    fn enter_stmt(&mut self, stmt: &mut swc_ecma_ast::Stmt, ctx: &mut TraverseCtx) {
        OptionalHook(
            self.options
                .async_to_generator
                .map(async_to_generator::hook),
        )
        .enter_stmt(stmt, ctx);
    }
}
