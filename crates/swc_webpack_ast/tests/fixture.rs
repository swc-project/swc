use std::{fs, path::PathBuf};

use swc_common::{chain, Mark, Span};
use swc_ecma_ast::*;
use swc_ecma_parser::{EsConfig, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_visit::{as_folder, VisitMut, VisitMutWith};
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
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            chain!(
                resolver(unresolved_mark, top_level_mark, false),
                as_folder(ast_reducer(unresolved_mark)),
                as_folder(AssertValid)
            )
        },
        &input,
        &output,
    );
}

struct AssertValid;

impl VisitMut for AssertValid {
    fn visit_mut_array_pat(&mut self, a: &mut ArrayPat) {
        if a.optional {
            panic!("found an optional pattern: {:?}", a)
        }

        a.visit_mut_children_with(self);
    }

    fn visit_mut_empty_stmt(&mut self, i: &mut EmptyStmt) {
        panic!("found empty: {:?}", i)
    }

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if i.optional {
            panic!("found an optional pattern: {:?}", i)
        }

        i.visit_mut_children_with(self);
    }

    fn visit_mut_if_stmt(&mut self, s: &mut IfStmt) {
        s.test.visit_mut_with(self);
        if !s.cons.is_empty() {
            s.cons.visit_mut_with(self);
        }

        s.alt.visit_mut_with(self);
    }

    fn visit_mut_invalid(&mut self, i: &mut Invalid) {
        panic!("found invalid: {:?}", i)
    }

    fn visit_mut_module(&mut self, m: &mut Module) {
        dbg!(&*m);

        m.body.visit_mut_with(self);
    }

    fn visit_mut_object_pat(&mut self, pat: &mut ObjectPat) {
        if pat.optional {
            panic!("found a optional pattern: {:?}", pat)
        }

        pat.visit_mut_children_with(self);
    }

    fn visit_mut_span(&mut self, sp: &mut Span) {
        assert!(!sp.is_dummy());
    }

    fn visit_mut_ts_type(&mut self, ty: &mut TsType) {
        panic!("found a typescript type: {:?}", ty)
    }
}

#[testing::fixture("../swc_ecma_parser/tests/tsc/**/*.ts")]
#[testing::fixture("../swc_ecma_parser/tests/typescript/**/*.ts")]
#[testing::fixture("../swc/tests/tsc-references/**/*.js")]
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
            if !p.take_errors().is_empty() {
                return Ok(());
            }

            res.unwrap()
        };

        let mut pass = {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            chain!(
                resolver(unresolved_mark, top_level_mark, false),
                as_folder(ast_reducer(top_level_mark))
            )
        };

        module.visit_mut_with(&mut pass);
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
                .map_err(|e| e.into_diagnostic(handler).emit());

            for e in p.take_errors() {
                e.into_diagnostic(handler).emit()
            }

            res?
        };

        let s = swc_webpack_ast::webpack_ast(cm, fm, module).unwrap();
        println!("{} bytes", s.len());

        fs::write(&output_path, s.as_bytes()).unwrap();

        Ok(())
    })
    .unwrap();
}
