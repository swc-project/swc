use std::{fs, path::PathBuf};
use swc_common::{chain, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_parser::{EsConfig, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::resolver::resolver_with_mark;
use swc_ecma_transforms_testing::test_fixture;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut, VisitMutWith};
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

struct DropModuleItem;

impl VisitMut for DropModuleItem {
    noop_visit_mut_type!();

    fn visit_mut_invalid(&mut self, _: &mut Invalid) {
        panic!("found invaid")
    }

    fn visit_mut_module_item(&mut self, item: &mut ModuleItem) {
        if let ModuleItem::ModuleDecl(..) = item {
            *item = ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }));
            return;
        }

        item.visit_mut_children_with(self);
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        items.visit_mut_children_with(self);

        items.retain(|s| match s {
            ModuleItem::Stmt(Stmt::Empty(..)) => false,
            _ => true,
        });
    }
}

#[testing::fixture("../swc_bundler/tests/fixture/**/output/entry.js")]
#[testing::fixture("../swc_bundler/tests/fixture/**/output/entry.ts")]
fn fixture_bundler(input: PathBuf) {
    let output = input.parent().unwrap().join("output___truncated.js");

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
                as_folder(DropModuleItem)
            )
        },
        &input,
        &output,
    );
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
