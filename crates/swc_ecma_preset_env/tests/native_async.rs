use std::{fs::read_to_string, path::PathBuf};

use swc_common::{comments::SingleThreadedComments, Mark};
use swc_ecma_preset_env::{transform_from_env, Config, Targets, Versions};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_testing::compare_stdout;

/// Compare native async iteration with lowering for a browser that supports
/// async functions but requires async iteration to be transformed.
#[testing::fixture("tests/fixtures/transform/native-async/**/exec.js")]
fn native_async(input: PathBuf) {
    compare_stdout(
        Default::default(),
        |_| {
            let unresolved_mark = Mark::new();
            (
                resolver(unresolved_mark, Mark::new(), false),
                transform_from_env(
                    unresolved_mark,
                    None::<SingleThreadedComments>,
                    Config {
                        targets: Some(Targets::Versions(Versions {
                            chrome: Some("60".parse().unwrap()),
                            ..Default::default()
                        })),
                        ..Default::default()
                    }
                    .into(),
                    Default::default(),
                ),
            )
        },
        &read_to_string(input).unwrap(),
    );
}
