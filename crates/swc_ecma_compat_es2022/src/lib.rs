#![allow(clippy::vec_box)]

use swc_common::{chain, comments::Comments, Mark};
use swc_ecma_compat_common::regexp::{self, regexp};
use swc_ecma_visit::Fold;

pub use self::{
    class_properties::class_properties, private_in_object::private_in_object,
    static_blocks::static_blocks,
};

pub mod class_properties;
pub mod optional_chaining_impl;
pub mod private_in_object;
pub mod static_blocks;

pub fn es2022<C: Comments>(cm: Option<C>, config: Config, unresolved_mark: Mark) -> impl Fold {
    chain!(
        regexp(regexp::Config {
            dot_all_regex: true,
            has_indices: true,
            lookbehind_assertion: true,
            named_capturing_groups_regex: true,
            sticky_regex: false,
            unicode_property_regex: true,
            unicode_regex: false,
            unicode_sets_regex: false,
        }),
        static_blocks(config.class_properties.static_blocks_mark),
        class_properties(cm, config.class_properties, unresolved_mark),
        private_in_object(),
    )
}

#[derive(Debug, Clone, Default)]
pub struct Config {
    pub class_properties: class_properties::Config,
}
