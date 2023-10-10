#![allow(clippy::needless_update)]

use std::{fs, path::PathBuf};

use swc_common::{errors::HANDLER, input::SourceFileInput};
use swc_css_lints::{get_rules, LintConfig, LintParams, LintRule};
use swc_css_parser::{lexer::Lexer, parser::Parser};

#[testing::fixture("tests/rules/pass/**/input.css")]
fn pass(input: PathBuf) {
    let config_path = input.parent().unwrap().join("config.json");
    let lint_config =
        serde_json::from_str::<LintConfig>(&fs::read_to_string(config_path).unwrap()).unwrap();

    testing::run_test2(false, |cm, handler| -> Result<(), _> {
        let config = Default::default();

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), None, config);
        let mut parser = Parser::new(lexer, config);

        let stylesheet = match parser.parse_all() {
            Ok(stylesheet) => stylesheet,
            Err(err) => {
                err.to_diagnostics(&handler).emit();
                panic!();
            }
        };

        let mut rules = get_rules(&LintParams {
            lint_config: &lint_config,
        })
        .unwrap();

        HANDLER.set(&handler, || {
            rules.lint_stylesheet(&stylesheet);
        });

        if handler.has_errors() {
            return Err(());
        }

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/rules/fail/**/input.css")]
fn fail(input: PathBuf) {
    let stderr_path = input.parent().unwrap().join("output.swc-stderr");
    let config_path = input.parent().unwrap().join("config.json");
    let lint_config =
        serde_json::from_str::<LintConfig>(&fs::read_to_string(config_path).unwrap()).unwrap();

    let stderr = testing::run_test2(false, |cm, handler| -> Result<(), _> {
        let config = Default::default();

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), None, config);
        let mut parser = Parser::new(lexer, config);

        let stylesheet = match parser.parse_all() {
            Ok(stylesheet) => stylesheet,
            Err(err) => {
                err.to_diagnostics(&handler).emit();
                panic!();
            }
        };

        let mut rules = get_rules(&LintParams {
            lint_config: &lint_config,
        })
        .unwrap();

        HANDLER.set(&handler, || {
            rules.lint_stylesheet(&stylesheet);
        });

        if !handler.has_errors() {
            panic!("should error");
        }

        Err(())
    })
    .unwrap_err();

    stderr.compare_to_file(stderr_path).unwrap();
}
