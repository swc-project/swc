#![allow(clippy::vec_box)]
#![allow(clippy::boxed_local)]

use serde::Deserialize;
use swc_ecma_ast::Pass;

pub use self::object_rest_spread::object_rest_spread;

pub mod object_rest_spread;

pub fn es2018(config: Config) -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();

    {
        options.env.regexp.dot_all_regex = true;
        options.env.regexp.lookbehind_assertion = true;
        options.env.regexp.named_capturing_groups_regex = true;
        options.env.regexp.unicode_property_regex = true;
    }

    {
        options.env.es2018.object_rest_spread = true;
        options.assumptions.object_rest_no_symbols = config.object_rest_spread.no_symbol;
        options.assumptions.set_spread_properties = config.object_rest_spread.set_property;
        options.assumptions.pure_getters = config.object_rest_spread.pure_getters;
    }

    options.into_pass()
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub object_rest_spread: object_rest_spread::Config,
}
