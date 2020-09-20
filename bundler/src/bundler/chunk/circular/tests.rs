use super::*;
use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_parser::{lexer::Lexer, JscTarget, Parser, StringInput, Syntax};
use swc_ecma_utils::drop_span;
use testing::assert_eq;

fn parse(cm: Lrc<SourceMap>, name: &str, src: &str) -> Module {
    let fm = cm.new_source_file(FileName::Custom(name.into()), src.into());
    let lexer = Lexer::new(
        Syntax::default(),
        JscTarget::Es2020,
        StringInput::from(&*fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);

    let module = parser.parse_module().unwrap();

    drop_span(module)
}

#[track_caller]
fn assert_merge_respecting_order(modules: &[&str], output: &str) {
    for i in 0..modules.len() {
        log::info!("[{}] Testing", i);
        ::testing::run_test2(false, |cm, _handler| {
            let mut entry = parse(cm.clone(), &format!("entry-{}", i), modules[i]).body;

            for j in 0..modules.len() {
                if i == j {
                    continue;
                }

                let dep = parse(cm.clone(), &format!("deps-{}-{}", i, j), modules[j]);
                entry = merge_respecting_order(entry, dep.body);
            }

            let output = parse(cm.clone(), "output", output);
            assert_eq!(entry, output.body, "[{}]", i);

            log::info!("[{}] Success", i);

            Ok(())
        })
        .unwrap()
    }
}

#[test]
fn simple_two() {
    assert_merge_respecting_order(
        &["export class A {}", "export class B extends A {}"],
        "
        export class A {}
        export class B extends A {}
        ",
    );
}

#[track_caller]
fn assert_dependency_index(entry: &str, dep: &str, expected: usize) {
    ::testing::run_test2(false, |cm, _handler| {
        let entry = parse(cm.clone(), "entry", entry);
        let dep = parse(cm.clone(), "dep", dep);

        let calculated = dependency_index(&entry.body[0], &dep.body);

        assert_eq!(calculated, Some(expected));

        Ok(())
    })
    .unwrap();
}

#[test]
fn dep_index_class() {
    assert_dependency_index("class A extends B {}", "class B {}", 0);
}

#[test]
fn dep_index_export_class() {
    assert_dependency_index("class A extends B {}", "export class B {}", 0);
}
