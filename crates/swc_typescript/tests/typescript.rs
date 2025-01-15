use std::path::PathBuf;

use swc_common::{comments::SingleThreadedComments, Mark};
use swc_ecma_codegen::to_code_with_comments;
use swc_ecma_parser::{parse_file_as_program, Syntax, TsSyntax};
use swc_ecma_transforms_base::{fixer::paren_remover, resolver};
use swc_typescript::fast_dts::{FastDts, FastDtsOptions};
use testing::NormalizedOutput;

#[testing::fixture("tests/**/*.ts")]
#[testing::fixture("tests/**/*.tsx")]
fn fixture(input: PathBuf) {
    let mut dts_code = String::new();
    let res = testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).expect("failed to load test case");
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let comments = SingleThreadedComments::default();
        let mut program = parse_file_as_program(
            &fm,
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            Default::default(),
            Some(&comments),
            &mut Vec::new(),
        )
        .map_err(|err| err.into_diagnostic(&handler).emit())
        .map(|program| program.apply(resolver(unresolved_mark, top_level_mark, true)))
        .map(|program| program.apply(paren_remover(None)))
        .unwrap();

        let internal_annotations = FastDts::get_internal_annotations(&comments);
        let mut checker = FastDts::new(
            fm.name.clone(),
            FastDtsOptions {
                internal_annotations: Some(internal_annotations),
            },
        );
        let issues = checker.transform(&mut program);
        dts_code = to_code_with_comments(Some(&comments), &program);

        for issue in issues {
            handler
                .struct_span_err(issue.range.span, &issue.message)
                .emit();
        }

        if handler.has_errors() {
            Err(())
        } else {
            Ok(())
        }
    });

    let mut output =
        format!("```==================== .D.TS ====================\n\n{dts_code}\n\n");

    if let Err(issues) = res {
        output.push_str(&format!(
            "==================== Errors ====================\n{issues}\n\n```"
        ));
    }

    let output_path = input.with_extension("snap");
    NormalizedOutput::from(output)
        .compare_to_file(output_path)
        .unwrap();
}
