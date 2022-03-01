use swc_common::chain;
use swc_ecma_visit::Fold;

pub use self::{
    class_properties::class_properties, private_in_object::private_in_object,
    static_blocks::static_blocks,
};

pub mod class_properties;
pub mod private_in_object;
pub mod static_blocks;

#[tracing::instrument(level = "trace", skip_all)]
pub fn es2022(config: Config) -> impl Fold {
    chain!(
        static_blocks(),
        class_properties(config.class_properties),
        private_in_object(),
    )
}

#[derive(Debug, Clone, Default)]
pub struct Config {
    pub class_properties: class_properties::Config,
}
