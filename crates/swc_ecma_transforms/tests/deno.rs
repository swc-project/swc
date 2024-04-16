use std::path::PathBuf;

use swc_ecma_transforms_testing::test_fixture;

#[testing::fixture("tests/deno/**/input.ts")]
fn stack_overflow(input: PathBuf) {
    run_test(input);
}

fn run_test(input: PathBuf) {
    let output = input.with_extension("output.js");

    test_fixture(
        Default::default(),
        |tester| {
            let mut passes = chain!(
                resolver(unresolved_mark, top_level_mark, true),
                proposal::decorator_2022_03::decorator_2022_03(),
                proposal::explicit_resource_management::explicit_resource_management(),
                helpers::inject_helpers(top_level_mark),
                typescript::typescript(
                    typescript::Config {
                        verbatim_module_syntax: false,
                        import_not_used_as_values: typescript::ImportsNotUsedAsValues::Remove,
                        no_empty_export: true,
                        import_export_assign_config:
                            typescript::TsImportExportAssignConfig::Preserve,
                        ts_enum_is_mutable: true,
                    },
                    top_level_mark
                ),
                fixer(Some(comments)),
                hygiene(),
            );
        },
        &input,
        &output,
        Default::default(),
    )
}
