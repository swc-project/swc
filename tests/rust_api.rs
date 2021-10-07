use swc::{
    config::{Config, JscConfig, Options},
    Compiler,
};
use swc_common::FileName;
use swc_ecma_ast::*;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::pass::noop;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut};

struct NoopType;

impl VisitMut for NoopType {
    noop_visit_mut_type!();

    fn visit_mut_number(&mut self, n: &mut Number) {
        panic!("Expected {:?}", n.value)
    }
}

#[test]
#[should_panic(expected = "Expected 5.0")]
fn test_visit_mut() {
    testing::run_test2(false, |cm, handler| {
        let c = Compiler::new(cm.clone());

        let fm = cm.new_source_file(
            FileName::Anon,
            "
                console.log(5 as const)
            "
            .into(),
        );

        let res = c.process_js_with_custom_pass(
            fm,
            &handler,
            &Options {
                config: Config {
                    jsc: JscConfig {
                        syntax: Some(Syntax::Typescript(Default::default())),
                        ..Default::default()
                    },
                    ..Default::default()
                },

                ..Default::default()
            },
            as_folder(NoopType),
            noop(),
        );

        assert_ne!(res.unwrap().code, "console.log(5 as const)");

        Ok(())
    })
    .unwrap()
}
