use serde::Deserialize;
use swc_ecma_ast::Pass;
use swc_ecma_visit::visit_mut_pass;

use crate::{object_rest::ObjectRest, object_spread::ObjectSpread};

// TODO: currently swc behaves like babel with
// `ignoreFunctionLength` on

/// `@babel/plugin-proposal-object-rest-spread`
pub fn object_rest_spread(config: Config) -> impl Pass {
    (
        visit_mut_pass(ObjectRest {
            config,
            ..Default::default()
        }),
        visit_mut_pass(ObjectSpread { config }),
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
