use std::path::PathBuf;

use swc_common::{comments::SingleThreadedComments, Mark};
use swc_ecma_minifier::dump_snapshot;
use swc_ecma_parser::{parse_file_as_module, EsConfig, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_visit::FoldWith;
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/input.js")]
#[testing::fixture("tests/single-pass/**/input.js")]
#[testing::fixture("tests/terser/compress/**/input.js")]
fn snapshot(input: PathBuf) {
    let dir = input.parent().unwrap();

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).expect("failed to load input.js");
        let comments = SingleThreadedComments::default();

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let program = parse_file_as_module(
            &fm,
            Syntax::Es(EsConfig {
                jsx: true,
                ..Default::default()
            }),
            Default::default(),
            Some(&comments),
            &mut vec![],
        )
        .map_err(|err| {
            err.into_diagnostic(&handler).emit();
        })
        .map(|module| module.fold_with(&mut resolver(unresolved_mark, top_level_mark, false)));

        let program = match program {
            Ok(program) => program,
            Err(..) => {
                return Ok(());
            }
        };

        let dump = dump_snapshot(&program);

        NormalizedOutput::from(dump)
            .compare_to_file(dir.join("analysis-snapshot.rust-debug"))
            .unwrap();

        Ok(())
    })
    .unwrap()
}
