use std::{env, path::Path};

use swc_common::{comments::SingleThreadedComments, Mark};
use swc_ecma_codegen::to_code_with_comments;
use swc_ecma_parser::{parse_file_as_program, Syntax};
use swc_ecma_transforms_base::{fixer::paren_remover, resolver};
use swc_typescript::fast_dts::{FastDts, FastDtsOptions};

pub fn main() {
    testing::run_test2(false, |cm, handler| {
        let name = env::args().nth(1).unwrap_or_else(|| "index.ts".to_string());
        let input = Path::new(&name);
        let fm = cm.load_file(input).expect("failed to load test case");
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let comments = SingleThreadedComments::default();
        let mut program = parse_file_as_program(
            &fm,
            Syntax::Typescript(Default::default()),
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
        let dts_code = to_code_with_comments(None, &program);

        let mut output =
            format!("```==================== .D.TS ====================\n\n{dts_code}\n\n");

        if !issues.is_empty() {
            let mut error_messages = String::new();
            for issue in issues {
                error_messages += format!(
                    "{}({:?}) {}\n",
                    input.file_name().and_then(|file| file.to_str()).unwrap(),
                    issue.range.span,
                    issue.message
                )
                .as_str();
            }

            output.push_str(&format!(
                "==================== Errors ====================\n{error_messages}\n\n```"
            ));
        }

        println!("{}", output);

        Ok(())
    })
    .unwrap();
}
