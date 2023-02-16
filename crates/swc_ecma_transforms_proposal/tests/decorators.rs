use std::path::PathBuf;

use swc_common::chain;
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_transforms_compat::es2020::export_namespace_from;
use swc_ecma_transforms_proposal::export_default_from;
use swc_ecma_transforms_testing::test;
use swc_ecma_visit::Fold;

fn syntax_default() -> Syntax {
    Syntax::Es(EsConfig {
        export_default_from: true,
        ..Default::default()
    })
}

#[testing::fixture("tests/fixture/decorator/**/exec.ts")]
fn exec(input: PathBuf) {
    exec_inner(input)
}

fn exec_inner(input: PathBuf) {
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
                decorators(Config {
                    legacy: true,
                    emit_metadata: true,
                    use_define_for_class_fields: false,
                }),
                strip(top_level_mark),
            )
        },
        &code,
    );
}

#[testing::fixture("tests/fixture/decorator/**/exec.ts")]
fn fixture(input: PathBuf) {
    fixture_inner(input)
}

fn fixture_inner(input: PathBuf) {
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
                decorators(Config {
                    legacy: true,
                    emit_metadata: true,
                    use_define_for_class_fields: false,
                }),
                strip(top_level_mark),
            )
        },
        &code,
    );
}
