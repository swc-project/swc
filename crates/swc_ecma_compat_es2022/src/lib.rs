#![allow(clippy::vec_box)]

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_compat_common::regexp::{self, regexp};

pub use self::{
    class_properties::class_properties, private_in_object::private_in_object,
    static_blocks::static_blocks,
};

pub mod class_properties;
pub mod optional_chaining_impl;
pub mod private_in_object;
pub mod static_blocks;

pub fn es2022(config: Config, unresolved_mark: Mark) -> impl Pass {
    (
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
        static_blocks(),
        class_properties(config.class_properties, unresolved_mark),
        private_in_object(),
    )
}

#[derive(Debug, Clone, Default)]
pub struct Config {
    pub class_properties: class_properties::Config,
}
