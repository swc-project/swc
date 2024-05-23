use std::process::Command;

use swc_common::Mark;
use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::to_code;
use swc_ecma_parser::parse_file_as_program;
use swc_ecma_transforms_base::{
    fixer::fixer,
    helpers::{inject_helpers, Helpers, HELPERS},
    hygiene::hygiene,
    resolver,
};
use swc_ecma_transforms_proposal::decorator_2022_03::decorator_2022_03;
use swc_ecma_visit::VisitMutWith;
use testing::find_executable;

#[test]
fn execute() {
    testing::run_test(false, |cm, handler| {
        let node = find_executable("node").expect("node not found");

        let fm = cm
            .load_file("tests/decorator-tests/decorator-tests.js".as_ref())
            .expect("failed to load file");

        let code = {
            // Transpile with swc
            let mut errors = vec![];

            let program = parse_file_as_program(
                &fm,
                swc_ecma_parser::Syntax::Es(swc_ecma_parser::EsConfig {
                    decorators: true,
                    auto_accessors: true,
                    ..Default::default()
                }),
                EsVersion::EsNext,
                None,
                &mut errors,
            );

            let mut program = match program {
                Ok(v) => v,
                Err(e) => {
                    e.into_diagnostic(handler).emit();
                    return Err(());
                }
            };

            for e in errors {
                e.into_diagnostic(handler).emit();
            }
            HELPERS.set(&Helpers::new(false), || {
                let unresolved_mark = Mark::new();
                let top_level_mark = Mark::new();
                program.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

                program.visit_mut_with(&mut decorator_2022_03());

                program.visit_mut_with(&mut inject_helpers(unresolved_mark));
                program.visit_mut_with(&mut hygiene());
                program.visit_mut_with(&mut fixer(None));
            });

            to_code(&program)
        };

        let status = Command::new(node)
            .arg("-e")
            .arg(&code)
            .status()
            .expect("failed to execute process");

        assert!(status.success());

        Ok(())
    })
    .unwrap()
}
