use serde::Deserialize;
use swc_ecma_visit::Fold;

pub use self::async_to_generator::async_to_generator;

pub mod async_to_generator;

#[tracing::instrument(level = "trace", skip_all)]
pub fn es2017(c: Config) -> impl Fold {
    async_to_generator(c.async_to_generator)
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub async_to_generator: async_to_generator::Config,
}
