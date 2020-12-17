use crate::bundler::modules::Modules;
use crate::bundler::tests::suite;
use swc_ecma_ast::Module;
use swc_ecma_utils::drop_span;

fn assert_sorted(src: &str, res: &str) {
    suite().run(|t| {
        let actual: Module = drop_span(t.parse(src));
        let mut module = Modules::from(actual);
        module.sort();
        let actual: Module = module.into();

        let expected = drop_span(t.parse(res));

        assert_eq!(actual, expected);

        Ok(())
    });
}

#[test]
fn sort_001() {
    assert_sorted(
        "
        _9[0] = 133; 
        const _9 = new ByteArray(32);
        ",
        "
        const _9 = new ByteArray(32);
        _9[0] = 133; 
        ",
    )
}
