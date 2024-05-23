use std::{fs::read_to_string, process::Command};

use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::to_code;
use swc_ecma_parser::parse_file_as_program;
use testing::find_executable;

#[test]
fn execute() {
    testing::run_test(false, |cm, handler| {
        let node = find_executable("node").expect("node not found");

        let fm = cm
            .load_file("tests/decorator-tests/decorator-tests.js")
            .expect("failed to load file");

        let code = {
            // Transpile with swc

            let program = parse_file_as_program(
                &fm,
                swc_ecma_parser::Syntax::Es(swc_ecma_parser::EsConfig {
                    decorators: true,
                    ..Default::default()
                }),
                EsVersion::EsNext,
                None,
                &mut vec![],
            )
            .expect("failed to parse file");

            to_code(None, &program)
        };

        let status = Command::new(node)
            .arg("-e")
            .arg(&code)
            .status()
            .expect("failed to execute process");

        assert!(status.success());
    })
    .unwrap()
}
