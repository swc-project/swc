use swc_common::Mark;
use swc_ecma_ast::Pass;

pub use self::{
    async_arrows_in_class::async_arrows_in_class, edge_default_param::edge_default_param,
    safari_id_destructuring_collision_in_function_expression::safari_id_destructuring_collision_in_function_expression,
    template_literal_caching::template_literal_caching,
};

mod async_arrows_in_class;
mod edge_default_param;
mod safari_id_destructuring_collision_in_function_expression;
mod template_literal_caching;

pub fn bugfixes(unresolved_mark: Mark) -> impl Pass {
    (
        async_arrows_in_class(unresolved_mark),
        edge_default_param(),
        template_literal_caching(),
        safari_id_destructuring_collision_in_function_expression(),
    )
}
