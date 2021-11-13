pub use self::object_rest_spread::object_rest_spread;
use serde::Deserialize;
use swc_ecma_visit::Fold;

pub mod object_rest_spread;

pub fn es2018(c: Config) -> impl Fold {
    object_rest_spread(c.object_rest_spread)
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub object_rest_spread: object_rest_spread::Config,
}
