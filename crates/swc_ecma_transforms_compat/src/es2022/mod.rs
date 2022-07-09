use swc_common::{chain, comments::Comments};
use swc_ecma_visit::Fold;

pub use self::{
    class_properties::class_properties, private_in_object::private_in_object,
    static_blocks::static_blocks,
};
use crate::regexp::{self, regexp};

pub mod class_properties;
pub mod private_in_object;
pub mod static_blocks;

#[tracing::instrument(level = "info", skip_all)]
pub fn es2022<C: Comments>(cm: Option<C>, config: Config) -> impl Fold {
    chain!(
        regexp(regexp::Config {
            dot_all_regex: true,
            has_indices: true,
            lookbehind_assertion: true,
            named_capturing_groups_regex: true,
            sticky_regex: false,
            unicode_property_regex: true,
            unicode_regex: false,
        }),
        static_blocks(),
        class_properties(cm, config.class_properties),
        private_in_object(),
    )
}

#[derive(Debug, Clone, Default)]
pub struct Config {
    pub class_properties: class_properties::Config,
}
