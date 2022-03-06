use std::path::PathBuf;

use swc_common::{input::SourceFileInput, Mark, SyntaxContext};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_lints::{
    config::LintConfig,
    rules::{all, LintParams},
};
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax};
use swc_ecma_transforms_base::resolver::{resolver_with_mark, ts_resolver};
use swc_ecma_utils::HANDLER;
use swc_ecma_visit::VisitMutWith;

#[testing::fixture("tests/pass/**/input.js")]
#[testing::fixture("tests/pass/**/input.ts")]
fn pass(input: PathBuf) {
    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();
        let es_version = EsVersion::latest();

        let lexer = Lexer::new(
            if input.extension().unwrap() == "ts" {
                Syntax::Typescript(swc_ecma_parser::TsConfig {
                    ..Default::default()
                })
            } else if input.extension().unwrap() == "tsx" {
                Syntax::Typescript(swc_ecma_parser::TsConfig {
                    tsx: true,
                    ..Default::default()
                })
            } else {
                Syntax::Es(swc_ecma_parser::EsConfig {
                    ..Default::default()
                })
            },
            es_version,
            SourceFileInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        let mut m = parser.parse_module().unwrap();
        let top_level_mark = Mark::fresh(Mark::root());

        if input.extension().unwrap() == "ts" || input.extension().unwrap() == "tsx" {
            m.visit_mut_with(&mut ts_resolver(top_level_mark));
        } else {
            m.visit_mut_with(&mut resolver_with_mark(top_level_mark));
        }

        let top_level_ctxt = SyntaxContext::empty().apply_mark(top_level_mark);

        let config = LintConfig::default();

        let program = Program::Module(m);

        let rules = all(LintParams {
            program: &program,
            lint_config: &config,
            top_level_ctxt,
            es_version,
            source_map: cm,
        });

        HANDLER.set(handler, || {
            if let Program::Module(m) = &program {
                for mut rule in rules {
                    rule.lint_module(m);
                }
            }
        });

        if handler.has_errors() {
            return Err(());
        }

        Ok(())
    })
    .unwrap();
}
