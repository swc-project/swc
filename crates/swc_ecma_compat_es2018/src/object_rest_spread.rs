use serde::Deserialize;
use swc_ecma_ast::Pass;
use swc_ecma_transformer::{Es2018ObjectRestSpreadConfig, Es2018Options};

// TODO: currently swc behaves like babel with
// `ignoreFunctionLength` on

/// `@babel/plugin-proposal-object-rest-spread`
///
/// This is now a compatibility wrapper that delegates to the new hook-based
/// implementation in swc_ecma_transformer.
pub fn object_rest_spread(config: Config) -> impl Pass {
    let rest_spread_config = Es2018ObjectRestSpreadConfig {
        no_symbol: config.no_symbol,
        set_property: config.set_property,
        pure_getters: config.pure_getters,
    };

    let options = Es2018Options {
        object_rest_spread: Some(rest_spread_config),
        ..Default::default()
    };

    swc_ecma_transformer::hook_pass(swc_ecma_transformer::es2018::hook(options))
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub no_symbol: bool,
    #[serde(default)]
    pub set_property: bool,
    #[serde(default)]
    pub pure_getters: bool,
}
