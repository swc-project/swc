#![allow(clippy::vec_box)]

use swc_common::Mark;
use swc_ecma_ast::Pass;

pub use self::{
    class_properties::class_properties, private_in_object::private_in_object,
    static_blocks::static_blocks,
};

pub mod class_properties;
pub mod optional_chaining_impl;
pub mod private_in_object;
pub mod static_blocks;

pub fn es2022(config: Config, unresolved_mark: Mark) -> impl Pass {
    let mut regexp_options = swc_ecma_transformer::RegExpOptions::default();
    regexp_options.dot_all_regex = true;
    regexp_options.has_indices = true;
    regexp_options.lookbehind_assertion = true;
    regexp_options.named_capturing_groups_regex = true;
    regexp_options.unicode_property_regex = true;

    (
        swc_ecma_transformer::es2022_runtime_transforms(regexp_options),
        class_properties(config.class_properties, unresolved_mark),
    )
}

#[derive(Debug, Clone, Default)]
pub struct Config {
    pub class_properties: class_properties::Config,
}
