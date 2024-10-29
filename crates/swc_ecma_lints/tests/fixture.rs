use std::path::PathBuf;

use swc_common::{errors::HANDLER, input::SourceFileInput, Mark, SyntaxContext};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_lints::{
    config::LintConfig,
    rule::Rule,
    rules::{all, LintParams},
};
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax};
use swc_ecma_transforms_base::resolver;

#[testing::fixture("tests/pass/**/input.js")]
#[testing::fixture("tests/pass/**/input.ts")]
fn pass(input: PathBuf) {
    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();
        let es_version = EsVersion::latest();

        let lexer = Lexer::new(
            if input.extension().unwrap() == "ts" {
                Syntax::Typescript(Default::default())
            } else if input.extension().unwrap() == "tsx" {
                Syntax::Typescript(swc_ecma_parser::TsSyntax {
                    tsx: true,
                    ..Default::default()
                })
            } else {
                Syntax::Es(Default::default())
            },
            es_version,
            SourceFileInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        let mut program = parser.parse_program().unwrap();
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let need_ts = input.extension().unwrap() == "ts" || input.extension().unwrap() == "tsx";

        program.mutate(resolver(unresolved_mark, top_level_mark, need_ts));

        let unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);
        let top_level_ctxt = SyntaxContext::empty().apply_mark(top_level_mark);

        let config = LintConfig::default();

        let mut rules = all(LintParams {
            program: &program,
            lint_config: &config,
            unresolved_ctxt,
            top_level_ctxt,
            es_version,
            source_map: cm,
        });

        HANDLER.set(handler, || match &program {
            Program::Module(m) => {
                rules.lint_module(m);
            }
            Program::Script(s) => {
                rules.lint_script(s);
            }
            // TODO: reenable once experimental_metadata breaking change is merged
            //_ => unreachable!(),
        });

        if handler.has_errors() {
            return Err(());
        }

        Ok(())
    })
    .unwrap();
}
