use super::*;
use crate::debug::print_hygiene;
use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_parser::{lexer::Lexer, JscTarget, Parser, StringInput, Syntax};
use swc_ecma_utils::drop_span;

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
    ::testing::run_test2(false, |cm, _handler| {
        let mut entry = parse(cm.clone(), &format!("entry"), modules[0]);

        for i in 1..modules.len() {
            let dep = parse(cm.clone(), &format!("deps-{}", i), modules[i]);
            entry.body = merge_respecting_order(entry.body, dep.body);

            print_hygiene("merge", &cm, &entry);
        }

        let output = parse(cm.clone(), "output", output);
        if entry.body != output.body {
            panic!()
        }

        Ok(())
    })
    .unwrap()
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

#[test]
fn many_vars_1() {
    assert_merge_respecting_order(
        &[
            "
            const A6 = A5;
            class B6 extends A6 {
            }
            const B7 = B6;

            ",
            "
            const B4 = B7;
            class A4 {
                method() {
                    return new B4();
                }
            }
            const A5 = A4;
            ",
        ],
        "
        class A4 {
            method() {
                return new B4();
            }
        }
        const A5 = A4;
        const A6 = A5;
        class B6 extends A6 {
        }
        const B7 = B6;
        const B4 = B7;
        ",
    );
}

#[test]
fn no_dep_first_01() {
    assert_merge_respecting_order(
        &[
            "
            const b1 = b2;
            ",
            "
            const b2 = 2;
            const b3 = b1;
            ",
        ],
        "
        const b2 = 2;
        const b1 = b2;
        const b3 = b1;
",
    );
}
