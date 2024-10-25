#![cfg(all(
    feature = "swc_ecma_transforms_proposal",
    feature = "swc_ecma_transforms_typescript",
))]
use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::{fixer, helpers::inject_helpers, hygiene, resolver};
use swc_ecma_transforms_proposal::{
    decorator_2022_03::decorator_2022_03,
    explicit_resource_management::explicit_resource_management,
};
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_transforms_typescript::typescript;

#[testing::fixture("tests/fixture/deno/**/input.ts")]
fn stack_overflow(input: PathBuf) {
    run_test(input);
}

fn run_test(input: PathBuf) {
    let output = input.with_file_name("output.js");

    test_fixture(
        Syntax::Typescript(Default::default()),
        &|_tester| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, true),
                decorator_2022_03(),
                explicit_resource_management(),
                inject_helpers(top_level_mark),
                typescript(
                    typescript::Config {
                        verbatim_module_syntax: false,
                        native_class_properties: false,
                        import_not_used_as_values: typescript::ImportsNotUsedAsValues::Remove,
                        no_empty_export: true,
                        import_export_assign_config:
                            typescript::TsImportExportAssignConfig::Preserve,
                        ts_enum_is_mutable: true,
                    },
                    unresolved_mark,
                    top_level_mark,
                ),
                fixer(None),
                hygiene(),
            )
        },
        &input,
        &output,
        Default::default(),
    )
}
