use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_transformer::es2018::ObjectRestSpreadConfig;
use swc_ecma_transforms_base::helpers::inject_helpers;

// TODO: currently swc behaves like babel with
// `ignoreFunctionLength` on

/// `@babel/plugin-proposal-object-rest-spread`
///
/// This now uses the new hook-based transformer.
pub fn object_rest_spread(config: Config) -> impl Pass {
    (
        swc_ecma_transformer::hook_pass(swc_ecma_transformer::es2018::hook(
            swc_ecma_transformer::es2018::Es2018Options {
                object_rest_spread: Some(ObjectRestSpreadConfig {
                    no_symbol: config.no_symbol,
                    set_property: config.set_property,
                    pure_getters: config.pure_getters,
                }),
            },
        )),
        inject_helpers(Mark::new()),
    )
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
