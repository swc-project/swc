use crate::bundler::modules::Modules;
use crate::bundler::tests::suite;
use crate::debug::print_hygiene;
use swc_ecma_ast::Module;
use swc_ecma_utils::drop_span;

fn assert_sorted(src: &[&str], res: &str) {
    suite().run(|t| {
        let mut modules = Modules::empty(t.bundler.injected_ctxt);

        for src in src {
            let actual: Module = drop_span(t.parse(src));
            modules.push_all(Modules::from(actual, t.bundler.injected_ctxt));
        }

        modules.sort();
        let actual: Module = modules.into();

        let expected = drop_span(t.parse(res));

        if actual == expected {
            return Ok(());
        }

        print_hygiene("actual", &t.cm, &actual);
        print_hygiene("expected", &t.cm, &expected);
        panic!()
    });
}

#[test]
fn sort_001() {
    assert_sorted(
        &["_9[0] = 133;", "const _9 = new ByteArray(32);"],
        "
        const _9 = new ByteArray(32);
        _9[0] = 133; 
        ",
    )
}

#[test]
fn sort_002() {
    assert_sorted(
        &[
            "
            const mod = (function(){
                const A = v;
            }());
            ",
            "const v = 5;",
        ],
        "
        const v = 5;
        const mod = (function(){
            const A = v;
        }());
        ",
    )
}

#[test]
fn sort_003() {
    assert_sorted(
        &[
            "class Constraint extends serialization.Serializable {}",
            "const serialization = {};",
        ],
        "
        const serialization = {};
        class Constraint extends serialization.Serializable {
        }
        ",
    );
}

#[test]
fn sort_004() {
    assert_sorted(
        &["use(global);", "const global = getGlobal();"],
        "
        const global = getGlobal();
        use(global);
        ",
    );
}
