use serde::Deserialize;
use swc_common::chain;
use swc_ecma_visit::{from_visit_mut, Fold, VisitMut};

use super::{object_rest::ObjectRest, object_spread::ObjectSpread};

// TODO: currently swc behaves like babel with
// `ignoreFunctionLength` on

/// `@babel/plugin-proposal-object-rest-spread`
pub fn object_rest_spread(config: Config) -> impl Fold + VisitMut {
    chain!(
        from_visit_mut(ObjectRest {
            config,
            ..Default::default()
        }),
        from_visit_mut(ObjectSpread { config })
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
