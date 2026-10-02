use std::path::PathBuf;

use swc_common::{sync::Lrc, util::take::Take, Mark, SourceMap};
use swc_ecma_ast::{Pass, Program};
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MinifyOptions},
};
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_testing::{exec_tr, test_fixture};
use swc_ecma_transforms_typescript::{typescript, Config};

#[testing::fixture("tests/fixture/namespace-bindings/**/exec.ts")]
#[testing::fixture("tests/fixture/enum-semantics/**/exec.ts")]
fn runtime(input: PathBuf) {
    execute(input, true);
}

#[testing::fixture("tests/fixture/namespace-bindings/**/exec.ts")]
#[testing::fixture("tests/fixture/enum-semantics/**/exec.ts")]
fn runtime_without_type_resolution(input: PathBuf) {
    execute(input, false);
}

#[testing::fixture("tests/fixture/namespace-bindings/**/exec.ts")]
#[testing::fixture("tests/fixture/enum-semantics/**/exec.ts")]
fn runtime_minified(input: PathBuf) {
    let code = std::fs::read_to_string(input).expect("semantic execution fixture must be readable");
    exec_tr(
        "typescript_semantics_minified",
        Syntax::Typescript(TsSyntax::default()),
        |tester| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            (
                resolver(unresolved, top_level, true),
                typescript(
                    Config {
                        no_empty_export: true,
                        ..Default::default()
                    },
                    unresolved,
                    top_level,
                ),
                Minifier {
                    cm: tester.cm.clone(),
                    unresolved,
                    top_level,
                },
            )
        },
        &code,
    );
}

struct Minifier {
    cm: Lrc<SourceMap>,
    unresolved: Mark,
    top_level: Mark,
}

impl Pass for Minifier {
    fn process(&mut self, program: &mut Program) {
        *program = optimize(
            program.take(),
            self.cm.clone(),
            None,
            None,
            &MinifyOptions {
                compress: Some(Default::default()),
                mangle: Some(Default::default()),
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark: self.unresolved,
                top_level_mark: self.top_level,
                mangle_name_cache: None,
            },
        );
    }
}

fn execute(input: PathBuf, handle_types: bool) {
    execute_config(
        input,
        handle_types,
        Config {
            no_empty_export: true,
            ..Default::default()
        },
    );
}

fn pipeline(handle_types: bool, config: Config) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    (
        resolver(unresolved_mark, top_level_mark, handle_types),
        typescript(config, unresolved_mark, top_level_mark),
    )
}

fn execute_config(input: PathBuf, handle_types: bool, config: Config) {
    let code = std::fs::read_to_string(input).expect("semantic execution fixture must be readable");
    exec_tr(
        "typescript_semantics",
        Syntax::Typescript(TsSyntax::default()),
        |_| pipeline(handle_types, config),
        &code,
    );
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

#[testing::fixture("tests/semantic-config/**/exec.ts")]
fn configured_runtime(input: PathBuf) {
    let config = fixture_config(&input);
    execute_config(input, true, config);
}
