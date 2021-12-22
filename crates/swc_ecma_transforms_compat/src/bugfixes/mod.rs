pub use self::{
    async_arrows_in_class::async_arrows_in_class, edge_default_param::edge_default_param,
    template_literal_caching::template_literal_caching, safari_id_destructuring_collision_in_function_expression::safari_id_destructuring_collision_in_function_expression
};
use swc_common::chain;
use swc_ecma_visit::Fold;

mod async_arrows_in_class;
mod edge_default_param;
mod template_literal_caching;
mod safari_id_destructuring_collision_in_function_expression;

pub fn bugfixes() -> impl Fold {
    chain!(
        async_arrows_in_class(),
        edge_default_param(),
        template_literal_caching()
    )
}
