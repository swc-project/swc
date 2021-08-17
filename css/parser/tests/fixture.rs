use std::path::PathBuf;
use swc_common::input::SourceFileInput;
use swc_css_parser::{
    lexer::Lexer,
    parser::{Parser, ParserConfig},
};
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/input.css")]
fn pass(input: PathBuf) {
    eprintln!("Input: {}", input.display());

    testing::run_test2(false, |cm, handler| {
        let ref_json_path = input.parent().unwrap().join("output.json");

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm));
        let mut parser = Parser::new(lexer, ParserConfig { parse_values: true });

        let stylesheet = parser.parse_all();

        match stylesheet {
            Ok(stylesheet) => {
                let actual_json = serde_json::to_string_pretty(&stylesheet)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize stylesheet");

                actual_json.compare_to_file(&ref_json_path).unwrap();

                Ok(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);
                d.note(&format!("current token = {}", parser.dump_cur()));

                d.emit();

                Err(())
            }
        }
    })
    .unwrap();
}

#[testing::fixture("tests/identity/**/input.css")]
fn identity(input: PathBuf) {
    eprintln!("Input: {}", input.display());

    let explicit_input = input.parent().unwrap().join("input.explicit.css");

    testing::run_test2(false, |cm, handler| {
        let input_fm = cm.load_file(&input).unwrap();
        let expected_fm = cm.load_file(&explicit_input).unwrap();

        eprintln!("===== ===== Input ===== =====\n{}", input_fm.src);
        eprintln!("===== ===== Expected ===== =====\n{}", expected_fm.src);

        let actual = {
            let lexer = Lexer::new(SourceFileInput::from(&*input_fm));
            let mut parser = Parser::new(lexer, ParserConfig { parse_values: true });

            parser.parse_all().map_err(|err| {
                let mut d = err.to_diagnostics(&handler);
                d.note(&format!("current token = {}", parser.dump_cur()));

                d.emit();
            })?
        };

        let expected = {
            let lexer = Lexer::new(SourceFileInput::from(&*expected_fm));
            let mut parser = Parser::new(lexer, ParserConfig { parse_values: true });

            parser.parse_all().map_err(|err| {
                let mut d = err.to_diagnostics(&handler);
                d.note(&format!("current token = {}", parser.dump_cur()));

                d.emit();
            })?
        };

        // TODO: Use visitor to normalize, after creating swc_css_visit
        if false {
            assert_eq!(actual, expected);
        }

        Ok(())
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
        let mut parser = Parser::new(lexer, ParserConfig { parse_values: true });

        let stylesheet = parser.parse_all();

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
