use std::path::PathBuf;

use swc_common::{comments::SingleThreadedComments, Mark};
use swc_ecma_ast::Id;
use swc_ecma_parser::{parse_file_as_module, EsConfig, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_visit::FoldWith;
use testing::NormalizedOutput;

use super::VarUsageInfo;
use crate::marks::Marks;

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

        let marks = Marks::new();

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

        let data = super::analyze(&program, Some(marks));

        // Iteration order of hashmap is not deterministic
        let mut snapshot = TestSnapshot {
            vars: data
                .vars
                .into_iter()
                .map(|(id, mut v)| {
                    v.accessed_props = Default::default();

                    (id, v)
                })
                .collect(),
        };

        snapshot.vars.sort_by(|a, b| a.0.cmp(&b.0));

        NormalizedOutput::from(format!("{:#?}", snapshot))
            .compare_to_file(dir.join("analysis-snapshot.rust-debug"))
            .unwrap();

        Ok(())
    })
    .unwrap()
}

#[derive(Debug)]
struct TestSnapshot {
    vars: Vec<(Id, VarUsageInfo)>,
}
