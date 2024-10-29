use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::Pass;

pub use self::async_to_generator::async_to_generator;

pub mod async_to_generator;

pub fn es2017(c: Config, unresolved_mark: Mark) -> impl Pass {
    async_to_generator(c.async_to_generator, unresolved_mark)
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub async_to_generator: async_to_generator::Config,
}
