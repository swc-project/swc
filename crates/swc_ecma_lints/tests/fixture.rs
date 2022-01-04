use std::path::PathBuf;

use swc_common::input::SourceFileInput;
use swc_ecma_ast::EsVersion;
use swc_ecma_lints::rules::all;
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax};
use swc_ecma_utils::HANDLER;

#[testing::fixture("tests/pass/**/input.js")]
#[testing::fixture("tests/pass/**/input.ts")]
fn pass(input: PathBuf) {
    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

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
            EsVersion::latest(),
            SourceFileInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        let m = parser.parse_module().unwrap();

        let rules = all();

        HANDLER.set(&handler, || {
            for mut rule in rules {
                rule.lint_module(&m);
            }
        });

        if handler.has_errors() {
            return Err(());
        }

        Ok(())
    })
    .unwrap();
}
