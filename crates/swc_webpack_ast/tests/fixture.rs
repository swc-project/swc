use std::path::PathBuf;
use swc_common::{chain, Mark};
use swc_ecma_parser::{EsConfig, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::resolver::resolver_with_mark;
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_visit::as_folder;
use swc_webpack_ast::reducer::ast_reducer;

#[testing::fixture("tests/fixture/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.parent().unwrap().join("output.js");

    test_fixture(
        Syntax::Es(EsConfig {
            jsx: true,
            ..Default::default()
        }),
        &|_| {
            let top_level_mark = Mark::fresh(Mark::root());

            chain!(
                resolver_with_mark(top_level_mark),
                as_folder(ast_reducer(top_level_mark))
            )
        },
        &input,
        &output,
    );
}

#[testing::fixture("tests/fixture/**/input.js")]
fn test_babelify(input: PathBuf) {
    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        let module = {
            let mut p = Parser::new(
                Syntax::Es(EsConfig {
                    jsx: true,
                    ..Default::default()
                }),
                StringInput::from(&*fm),
                None,
            );
            let res = p
                .parse_module()
                .map_err(|e| e.into_diagnostic(&handler).emit());

            for e in p.take_errors() {
                e.into_diagnostic(&handler).emit()
            }

            res?
        };

        swc_webpack_ast::webpack_ast(cm.clone(), fm.clone(), module).unwrap();

        Ok(())
    })
    .unwrap();
}
