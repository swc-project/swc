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
    let mut options = swc_ecma_transformer::Options::default();

    {
        let t = &mut options.env.regexp;
        t.dot_all_regex = true;
        t.has_indices = true;
        t.lookbehind_assertion = true;
        t.named_capturing_groups_regex = true;
        t.unicode_property_regex = true;
    }

    options.env.es2022.class_static_block = true;
    options.env.es2022.private_property_in_object = true;

    (
        options.into_pass(),
        class_properties(config.class_properties, unresolved_mark),
    )
}

#[derive(Debug, Clone, Default)]
pub struct Config {
    pub class_properties: class_properties::Config,
}
