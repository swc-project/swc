use std::path::PathBuf;

use swc_common::{chain, Mark};
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_proposal::decorator_2022_03::decorator_2022_03;
use swc_ecma_transforms_testing::test_fixture;

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
        |_t| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            chain!(
                resolver(unresolved_mark, top_level_mark, true),
                decorator_2022_03()
            )
        },
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
        &|_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            chain!(
                resolver(unresolved_mark, top_level_mark, false),
                decorator_2022_03()
            )
        },
        &input,
        &output,
        Default::default(),
    );
}
