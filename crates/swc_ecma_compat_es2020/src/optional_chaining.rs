use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_compiler::{Compiler, Features};
use swc_ecma_transforms_base::assumptions::Assumptions;

pub fn optional_chaining(c: Config, _unresolved_mark: Mark) -> impl Pass {
    let mut assumptions = Assumptions::default();
    assumptions.no_document_all = c.no_document_all;
    assumptions.pure_getters = c.pure_getter;

    Compiler::new(swc_ecma_compiler::Config {
        includes: Features::OPTIONAL_CHAINING,
        assumptions,
        ..Default::default()
    })
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub no_document_all: bool,
    #[serde(default)]
    pub pure_getter: bool,
}
