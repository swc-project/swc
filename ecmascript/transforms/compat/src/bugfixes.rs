pub use self::async_arrows_in_class::async_arrows_in_class;
pub use self::edge_default_param::edge_default_param;
pub use self::template_literal_caching::template_literal_caching;
use swc_common::chain;
use swc_ecma_visit::Fold;

mod async_arrows_in_class;
mod edge_default_param;
mod template_literal_caching;

pub fn bugfixes() -> impl Fold {
    chain!(
        async_arrows_in_class(),
        edge_default_param(),
        template_literal_caching()
    )
}
