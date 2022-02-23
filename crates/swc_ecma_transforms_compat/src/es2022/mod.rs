use swc_common::chain;
use swc_ecma_visit::Fold;

pub use self::{
    class_properties::class_properties, private_in_object::private_in_object,
    static_blocks::static_blocks,
};

pub mod class_properties;
pub mod private_in_object;
pub mod static_blocks;

pub fn es2022(config: Config) -> impl Fold {
    chain!(
        static_blocks(),
        private_in_object(),
        class_properties(class_properties::Config {
            loose: config.loose,
        }),
    )
}

#[derive(Debug, Clone, Default)]
pub struct Config {
    pub loose: bool,
}
