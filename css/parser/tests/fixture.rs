use std::path::PathBuf;
use swc_common::input::SourceFileInput;
use swc_css_parser::{lexer::Lexer, parser::Parser};
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/input.css")]
fn pass(input: PathBuf) {
    eprintln!("Input: {}", input.display());

    testing::run_test2(false, |cm, handler| {
        let ref_json_path = input.parent().unwrap().join("output.json");

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm));
        let mut parser = Parser::new(lexer);

        let stylesheet = parser.parse();

        match stylesheet {
            Ok(stylesheet) => {
                let actual_json = serde_json::to_string_pretty(&stylesheet)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize stylesheet");

                actual_json.compare_to_file(&ref_json_path).unwrap();

                Ok(())
            }
            Err(err) => {
                err.to_diagnostics(&handler).emit();

                Err(())
            }
        }
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/**/input.css")]
fn fail(input: PathBuf) {
    eprintln!("Input: {}", input.display());
    let stderr_path = input.parent().unwrap().join("output.stderr");

    let stderr = testing::run_test2(false, |cm, handler| -> Result<(), _> {
        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm));
        let mut parser = Parser::new(lexer);

        let stylesheet = parser.parse();

        match stylesheet {
            Ok(..) => {}
            Err(err) => {
                err.to_diagnostics(&handler).emit();
            }
        }

        for err in parser.take_errors() {
            err.to_diagnostics(&handler).emit();
        }

        if !handler.has_errors() {
            panic!("should error")
        }

        Err(())
    })
    .unwrap_err();

    stderr.compare_to_file(&stderr_path).unwrap();
}
