use std::{fs, path::PathBuf};
use swc_common::{chain, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_parser::{EsConfig, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms_base::resolver::resolver_with_mark;
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_visit::{as_folder, Node, VisitMut, VisitMutWith, VisitWith};
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
                as_folder(ast_reducer(top_level_mark)),
                as_folder(AssertValid)
            )
        },
        &input,
        &output,
    );
}

struct AssertValid;

impl VisitMut for AssertValid {
    fn visit_mut_invalid(&mut self, i: &mut Invalid) {
        panic!("found invalid: {:?}", i)
    }

    fn visit_mut_empty_stmt(&mut self, i: &mut EmptyStmt) {
        panic!("found empty: {:?}", i)
    }
}

#[testing::fixture("../swc_ecma_parser/tests/typescript/tsc/**/input.ts")]
#[testing::fixture("../swc/tests/tsc-references/**/output.js")]
fn assert_no_invalid(input: PathBuf) {
    testing::run_test(false, |cm, _handler| {
        let fm = cm.load_file(&input).unwrap();

        let mut module = {
            let mut p = Parser::new(
                Syntax::Typescript(TsConfig {
                    ..Default::default()
                }),
                StringInput::from(&*fm),
                None,
            );
            let res = p.parse_module();

            if res.is_err() {
                return Ok(());
            }
            for _ in p.take_errors() {
                return Ok(());
            }

            res.unwrap()
        };

        let mut pass = {
            let top_level_mark = Mark::fresh(Mark::root());

            chain!(
                resolver_with_mark(top_level_mark),
                as_folder(ast_reducer(top_level_mark))
            )
        };

        module.visit_mut_with(&mut pass);
        dbg!(&module);
        module.visit_mut_with(&mut AssertValid);

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/**/input.js")]
fn test_babelify(input: PathBuf) {
    let output_path = input.parent().unwrap().join("output.json");

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

        let s = swc_webpack_ast::webpack_ast(cm.clone(), fm.clone(), module).unwrap();
        println!("{} bytes", s.len());

        fs::write(&output_path, s.as_bytes()).unwrap();

        Ok(())
    })
    .unwrap();
}
