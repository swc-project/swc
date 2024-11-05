use std::path::PathBuf;

use swc_common::Mark;
use swc_ecma_codegen::to_code_with_comments;
use swc_ecma_parser::{parse_file_as_program, Syntax};
use swc_ecma_transforms_base::{fixer::paren_remover, resolver};
use swc_typescript::fast_dts::FastDts;
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/*.ts")]
fn fixture(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).expect("failed to load test case");
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let mut program = parse_file_as_program(
            &fm,
            Syntax::Typescript(Default::default()),
            Default::default(),
            None,
            &mut Vec::new(),
        )
        .map_err(|err| err.into_diagnostic(&handler).emit())
        .map(|program| program.apply(resolver(unresolved_mark, top_level_mark, false)))
        .map(|program| program.apply(paren_remover(None)))
        .unwrap();

        let mut checker = FastDts::new(fm.name.clone());
        let issues = checker.transform(&mut program);
        let dts_code = to_code_with_comments(None, &program);

        let mut output =
            format!("```==================== .D.TS ====================\n\n{dts_code}\n\n");

        if !issues.is_empty() {
            let mut error_messages = String::new();
            for issue in issues {
                error_messages += format!(
                    "[{}][{:?}] {}\n",
                    issue.range().filename,
                    issue.range().span,
                    issue
                )
                .as_str();
            }

            output.push_str(&format!(
                "==================== Errors ====================\n{error_messages}\n\n```"
            ));
        }

        let output_path = input.with_extension("snap");
        let output_path = PathBuf::from("tests")
            .join("snapshot")
            .join(output_path.file_name().unwrap());

        NormalizedOutput::from(output)
            .compare_to_file(output_path)
            .unwrap();

        Ok(())
    })
    .unwrap();
}
