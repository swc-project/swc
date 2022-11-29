use std::path::PathBuf;

use common::{document_dom_visualizer, document_span_visualizer};
use swc_common::input::SourceFileInput;
use swc_html_ast::Document;
use swc_html_parser::{
    lexer::Lexer,
    parser::{PResult, Parser, ParserConfig},
};
use testing::NormalizedOutput;

#[path = "common/mod.rs"]
mod common;

fn document_recovery_test(input: PathBuf, config: ParserConfig) {
    let stderr_path = input.parent().unwrap().join("output.stderr");
    let mut recovered = false;

    let stderr = testing::run_test2(false, |cm, handler| {
        // Type annotation
        if false {
            return Ok(());
        }

        let json_path = input.parent().unwrap().join("output.json");
        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm));
        let mut parser = Parser::new(lexer, config);
        let document: PResult<Document> = parser.parse_document();
        let errors = parser.take_errors();

        for err in &errors {
            err.to_diagnostics(&handler).emit();
        }

        if !errors.is_empty() {
            recovered = true;
        }

        match document {
            Ok(document) => {
                let actual_json = serde_json::to_string_pretty(&document)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize document");

                actual_json.compare_to_file(&json_path).unwrap();

                Err(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);

                d.note(&format!("current token = {}", parser.dump_cur()));
                d.emit();

                Err(())
            }
        }
    })
    .unwrap_err();

    if !recovered {
        panic!(
            "Parser should emit errors (recover mode), but parser parsed everything successfully \
             {}",
            stderr
        );
    }

    stderr.compare_to_file(&stderr_path).unwrap();
}

#[testing::fixture("tests/recovery/**/*.html")]
fn recovery(input: PathBuf) {
    document_recovery_test(
        input,
        ParserConfig {
            ..Default::default()
        },
    )
}

#[testing::fixture("tests/recovery/**/*.html")]
fn span_visualizer(input: PathBuf) {
    document_span_visualizer(
        input,
        ParserConfig {
            ..Default::default()
        },
        false,
    )
}

#[testing::fixture("tests/recovery/**/*.html")]
fn dom_visualizer(input: PathBuf) {
    document_dom_visualizer(
        input,
        ParserConfig {
            ..Default::default()
        },
    )
}
