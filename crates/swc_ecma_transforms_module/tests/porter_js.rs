#![deny(warnings)]

use std::{path::PathBuf, rc::Rc};

use swc_common::{chain, comments::SingleThreadedComments, Mark};
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_base::{feature::FeatureFlag, resolver};
use swc_ecma_transforms_module::porter_js::{porter_js, Config};
use swc_ecma_transforms_testing::{test_fixture, Tester};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        ..Default::default()
    })
}

fn tr(_tester: &mut Tester<'_>, config: Config, comments: Rc<SingleThreadedComments>) -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    let available_features = FeatureFlag::all();
    chain!(
        resolver(unresolved_mark, top_level_mark, false),
        porter_js(unresolved_mark, config, available_features, Some(comments))
    )
}

#[testing::fixture("tests/fixture/porterjs/**/input.mjs")]
fn fixture(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.mjs");

    test_fixture(
        syntax(),
        &|tester| {
            tr(
                tester,
                Config {
                    ..Default::default()
                },
                tester.comments.clone(),
            )
        },
        &input,
        &output,
        Default::default(),
    );
}
