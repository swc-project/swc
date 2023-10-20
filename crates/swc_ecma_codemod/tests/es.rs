use std::path::PathBuf;

use swc_common::FileName;
use swc_ecma_ast::EsVersion;
use swc_ecma_codemod::{Modification, Operator};
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_visit::{Visit, VisitWith};
use testing::{run_test2, NormalizedOutput};

pub struct TestVisitor {
    pub mods: Vec<Modification>,
}

impl Visit for TestVisitor {}

#[test]
fn test_1() {
    run_test2(false, |cm, _| {
        let mut visitor = TestVisitor { mods: vec![] };

        let fm = cm.new_source_file(
            FileName::Real(PathBuf::from("test.js")),
            "const foo = 1;".to_string(),
        );
        let module = parse_file_as_module(
            &fm,
            Default::default(),
            EsVersion::latest(),
            None,
            &mut vec![],
        )
        .unwrap();

        module.visit_with(&mut visitor);

        let result = Operator {
            modifications: visitor.mods,
        }
        .apply(&fm.src)
        .unwrap();

        NormalizedOutput::from(result)
            .compare_to_file("test.js.exp")
            .unwrap();

        Ok(())
    })
    .unwrap();
}
