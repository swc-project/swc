use std::path::{Path, PathBuf};

use serde::Deserialize;
use swc_common::{chain, Mark};
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_proposal::decorator_2022_03::decorator_2022_03;
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_visit::Fold;

fn syntax_default() -> Syntax {
    Syntax::Es(EsConfig {
        decorators: true,
        ..Default::default()
    })
}

#[testing::fixture("tests/decorators/**/exec.js")]
fn exec(input: PathBuf) {
    exec_inner(input)
}

fn exec_inner(input: PathBuf) {
    let code = std::fs::read_to_string(&input).unwrap();

    swc_ecma_transforms_testing::exec_tr(
        "decorator",
        Syntax::Typescript(TsConfig {
            decorators: true,
            ..Default::default()
        }),
        |_t| create_pass(&input),
        &code,
    );
}

#[testing::fixture("tests/decorators/**/input.js")]
fn fixture(input: PathBuf) {
    fixture_inner(input)
}

fn fixture_inner(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        syntax_default(),
        &|_| create_pass(&input),
        &input,
        &output,
        Default::default(),
    );
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Options {}

fn read_options_json(input: &Path) -> Options {
    let mut options_path = input.to_path_buf();
    options_path.set_file_name("options.json");

    if !options_path.exists() {
        // Look for parent directory

        if !options_path.is_absolute() {
            return read_options_json(&options_path.parent().unwrap());
        }
    }

    serde_json::from_str(&std::fs::read_to_string(&options_path).unwrap()).unwrap()
}

fn create_pass(input: &PathBuf) -> Box<dyn Fold> {
    let options_json = read_options_json(&input);

    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    Box::new(chain!(
        resolver(unresolved_mark, top_level_mark, false),
        decorator_2022_03()
    ))
}
