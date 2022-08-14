use serde::Deserialize;
use swc_common::{comments::Comments, Mark};
use swc_ecma_visit::Fold;

pub use self::async_to_generator::async_to_generator;

pub mod async_to_generator;

#[tracing::instrument(level = "info", skip_all)]
pub fn es2017<C: Comments + Clone>(
    c: Config,
    comments: Option<C>,
    unresolved_mark: Mark,
) -> impl Fold {
    async_to_generator(c.async_to_generator, comments, unresolved_mark)
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub async_to_generator: async_to_generator::Config,
}
