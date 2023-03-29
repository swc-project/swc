use serde::Deserialize;
use swc_common::chain;
use swc_ecma_visit::Fold;

pub use self::object_rest_spread::object_rest_spread;
use crate::regexp::{self, regexp};

pub mod object_rest_spread;

#[tracing::instrument(level = "info", skip_all)]
pub fn es2018(c: Config) -> impl Fold {
    chain!(
        regexp(regexp::Config {
            dot_all_regex: true,
            has_indices: false,
            lookbehind_assertion: true,
            named_capturing_groups_regex: true,
            sticky_regex: false,
            unicode_property_regex: true,
            unicode_regex: false,
        }),
        object_rest_spread(c.object_rest_spread)
    )
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub object_rest_spread: object_rest_spread::Config,
}
