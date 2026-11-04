#![allow(clippy::unit_arg)]

use swc_common::{comments::NoopComments, Mark};
use swc_ecma_ast::Pass;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::generator::generator;

fn syntax() -> Syntax {
    Syntax::default()
}

fn tr(_: ()) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    (
        resolver(unresolved_mark, top_level_mark, false),
        generator(unresolved_mark, NoopComments),
    )
}

/// Named transform pipelines for the composite output fixtures.
#[derive(Clone, Copy, serde::Deserialize)]
enum CasePipeline {
    #[serde(rename = "resolver-generator-noop-comments")]
    ResolverGeneratorNoopComments,
}

/// Compares each input with its original output using its configured pipeline.
#[testing::fixture(
    "tests/composite/generator/sparse-array/resolver-generator-noop-comments/**/input.js"
)]
fn composite_fixture(input: std::path::PathBuf) {
    let pipeline: CasePipeline = crate::case_pipeline(&input);
    swc_ecma_transforms_testing::test_fixture(
        syntax(),
        &|t| -> Box<dyn swc_ecma_ast::Pass> {
            let _ = &t;
            match pipeline {
                CasePipeline::ResolverGeneratorNoopComments => Box::new(tr(Default::default())),
            }
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
