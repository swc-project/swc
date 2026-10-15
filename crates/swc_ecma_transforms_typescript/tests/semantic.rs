use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_transforms_typescript::{typescript, Config};

fn pipeline(handle_types: bool, config: Config) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    (
        resolver(unresolved_mark, top_level_mark, handle_types),
        typescript(config, unresolved_mark, top_level_mark),
    )
}

fn fixture_config(input: &std::path::Path) -> Config {
    let config = std::fs::read(input.with_file_name("config.json"))
        .expect("semantic configuration fixture must be readable");
    serde_json::from_slice(&config).expect("semantic fixture configuration must be valid")
}

#[testing::fixture("tests/semantic-config/**/input.ts")]
fn configured_snapshot(input: PathBuf) {
    let config = fixture_config(&input);
    test_fixture(
        Syntax::Typescript(TsSyntax::default()),
        &|_| pipeline(true, config),
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
