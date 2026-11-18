use serde::Deserialize;
use swc_ecma_ast::Pass;
use swc_ecma_transforms_base::assumptions::Assumptions;

// TODO: currently swc behaves like babel with
// `ignoreFunctionLength` on

/// `@babel/plugin-proposal-object-rest-spread`
pub fn object_rest_spread(config: Config) -> impl Pass {
    let mut assumptions = Assumptions::default();
    assumptions.object_rest_no_symbols = config.no_symbol;
    assumptions.set_spread_properties = config.set_property;
    assumptions.pure_getters = config.pure_getters;

    swc_ecma_transformer::es2018_object_rest_spread(assumptions)
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
