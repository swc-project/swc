use std::{env, path::Path};

use swc_common::{comments::SingleThreadedComments, Mark};
use swc_ecma_codegen::to_code_with_comments;
use swc_ecma_parser::{attach_comments, ModuleKind, Parser, SourceType, Syntax, TsSyntax};
use swc_ecma_transforms_base::{fixer::paren_remover, resolver};
use swc_typescript::fast_dts::{FastDts, FastDtsOptions};

pub fn main() {
    let mut dts_code = String::new();
    let res = testing::run_test2(false, |cm, handler| {
        let name = env::args().nth(1).unwrap_or_else(|| "index.ts".to_string());
        let input = Path::new(&name);
        let fm = cm.load_file(input).expect("failed to load test case");
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let comments = SingleThreadedComments::default();
        let syntax = Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        });
        let (source_type, options) =
            SourceType::from_legacy(syntax, ModuleKind::Unambiguous, Default::default());
        let mut result = Parser::new(&fm.src, source_type)
            .with_options(options)
            .with_start_pos(fm.start_pos)
            .with_tokens()
            .parse();
        attach_comments(
            &fm.src,
            fm.start_pos,
            &comments,
            std::mem::take(&mut result.comments),
            &result.tokens,
            &result.program,
        );
        for error in result.diagnostics {
            error.into_diagnostic(&handler).emit();
        }
        let mut program = result
            .program
            .apply(resolver(unresolved_mark, top_level_mark, true))
            .apply(paren_remover(None));

        let internal_annotations = FastDts::get_internal_annotations(&comments);
        let mut checker = FastDts::new(
            fm.name.clone(),
            unresolved_mark,
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
    println!("{output}");
}
