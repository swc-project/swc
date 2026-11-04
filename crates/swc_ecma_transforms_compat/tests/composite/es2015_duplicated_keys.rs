use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::duplicate_keys;

fn syntax() -> Syntax {
    Default::default()
}

// duplicate_keys_getter

// duplicate_keys_dupes

// duplicate_keys_both_quoted

// duplicate_keys_no_dupes

// duplicate_keys_getters_and_setters

// duplicate_keys_one_quoted

/// Named transform pipelines for the composite output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "duplicate-keys")]
    DuplicateKeys,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture("tests/composite/duplicate-keys/duplicate-keys/**/input.js")]
fn composite_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = crate::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::DuplicateKeys => Box::new(duplicate_keys()),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
