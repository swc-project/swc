#![allow(clippy::vec_box)]
#![allow(clippy::boxed_local)]

use serde::Deserialize;
use swc_ecma_ast::Pass;
use swc_ecma_transforms_base::assumptions::Assumptions;

pub use self::object_rest_spread::object_rest_spread;

pub mod object_rest_spread;

pub fn es2018(config: Config) -> impl Pass {
    let mut regexp_options = swc_ecma_transformer::RegExpOptions::default();
    regexp_options.dot_all_regex = true;
    regexp_options.lookbehind_assertion = true;
    regexp_options.named_capturing_groups_regex = true;
    regexp_options.unicode_property_regex = true;

    let mut assumptions = Assumptions::default();
    assumptions.object_rest_no_symbols = config.object_rest_spread.no_symbol;
    assumptions.set_spread_properties = config.object_rest_spread.set_property;
    assumptions.pure_getters = config.object_rest_spread.pure_getters;

    swc_ecma_transformer::es2018_runtime_transforms(assumptions, regexp_options)
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub object_rest_spread: object_rest_spread::Config,
}
