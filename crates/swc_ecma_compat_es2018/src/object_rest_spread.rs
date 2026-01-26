use serde::Deserialize;
use swc_ecma_ast::Pass;

// TODO: currently swc behaves like babel with
// `ignoreFunctionLength` on

/// `@babel/plugin-proposal-object-rest-spread`
pub fn object_rest_spread(config: Config) -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();

    options.assumptions.object_rest_no_symbols = config.no_symbol;
    options.assumptions.set_spread_properties = config.set_property;
    options.assumptions.pure_getters = config.pure_getters;
    options.env.es2018.object_rest_spread = true;

    options.into_pass()
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
