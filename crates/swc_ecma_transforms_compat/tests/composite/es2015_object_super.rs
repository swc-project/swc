use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::{function_name, object_super, shorthand};

fn syntax() -> Syntax {
    ::swc_ecma_parser::Syntax::default()
}

fn tr() -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, false),
        object_super(),
        shorthand(),
        function_name(),
    )
}

/// Named transform pipelines for the composite output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "resolver-object-super-shorthand-function-name")]
    ResolverObjectSuperShorthandFunctionName,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture(
    "tests/composite/object-super/resolver-object-super-shorthand-function-name/**/input.js"
)]
fn composite_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = crate::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::ResolverObjectSuperShorthandFunctionName => Box::new(tr()),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
