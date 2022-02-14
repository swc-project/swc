use std::path::PathBuf;

use swc_common::{comments::SingleThreadedComments, input::SourceFileInput, Mark};
use swc_ecma_ast::Id;
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, Syntax};
use swc_ecma_transforms::resolver_with_mark;
use swc_ecma_visit::FoldWith;
use testing::NormalizedOutput;

use super::VarUsageInfo;
use crate::marks::Marks;

#[testing::fixture("tests/compress/fixture/**/input.js")]
#[testing::fixture("tests/single-pass/**/input.js")]
#[testing::fixture("tests/terser/compress/**/input.js")]
fn snapshot(input: PathBuf) {
    let dir = input.parent().unwrap();

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).expect("failed to load input.js");
        let comments = SingleThreadedComments::default();

        let top_level_mark = Mark::fresh(Mark::root());

        let lexer = Lexer::new(
            Syntax::Es(EsConfig {
                jsx: true,
                ..Default::default()
            }),
            Default::default(),
            SourceFileInput::from(&*fm),
            Some(&comments),
        );

        let marks = Marks::new();

        let mut parser = Parser::new_from(lexer);
        let program = parser
            .parse_module()
            .map_err(|err| {
                err.into_diagnostic(&handler).emit();
            })
            .map(|module| module.fold_with(&mut resolver_with_mark(top_level_mark)));

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
                    v.infects = Default::default();
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
