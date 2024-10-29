#![allow(clippy::vec_box)]
#![allow(clippy::boxed_local)]

use serde::Deserialize;
use swc_ecma_ast::Pass;
use swc_ecma_compat_common::regexp::{self, regexp};

pub use self::object_rest_spread::object_rest_spread;

mod object_rest;
pub mod object_rest_spread;
mod object_spread;

pub fn es2018(c: Config) -> impl Pass {
    (
        regexp(regexp::Config {
            dot_all_regex: true,
            has_indices: false,
            lookbehind_assertion: true,
            named_capturing_groups_regex: true,
            sticky_regex: false,
            unicode_property_regex: true,
            unicode_regex: false,
            unicode_sets_regex: false,
        }),
        object_rest_spread(c.object_rest_spread),
    )
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub object_rest_spread: object_rest_spread::Config,
}
