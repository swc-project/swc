use std::path::PathBuf;

use swc_common::{
    comments::SingleThreadedComments, errors::Handler, sync::Lrc, FileName, SourceMap,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{
    lexer::Lexer, unstable::Capturing, EsSyntax, Parser, StringInput, Syntax, TsSyntax,
};
use swc_ts_fast_strip::{operate, ErrorCode, Mode, Options, TransformConfig};
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/*.ts")]
#[testing::fixture("tests/fixture/**/*.tsx")]
fn test(input: PathBuf) {
    let input_code = std::fs::read_to_string(&input).unwrap();
    let output_stderr = input.with_extension("swc-stderr");
    let output_file = input.with_extension("js");
    let transform_output_file = input.with_extension("transform.js");

    let err = testing::run_test(false, |cm, handler| {
        let mut options = opts(Mode::StripOnly);
        options.parser.tsx = input
            .extension()
            .is_some_and(|extension| extension == "tsx");
        if let Ok(code) = operate(&cm, handler, input_code.clone(), options) {
            let code = code.code;

            assert_utf16_layout_preserved(&input_code, &code);
            reparse(&cm, handler, &input, code.clone());
            assert!(
                !handler.has_errors(),
                "type stripping must produce valid JavaScript"
            );

            NormalizedOutput::new_raw(code)
                .compare_to_file(output_file)
                .unwrap();
        }

        if handler.has_errors() {
            return Err(());
        }
        Ok(())
    });
    if let Err(err) = err {
        err.compare_to_file(output_stderr).unwrap();
    }

    testing::run_test(false, |cm, handler| {
        let mut options = opts(Mode::Transform);
        options.parser.tsx = input
            .extension()
            .is_some_and(|extension| extension == "tsx");
        let code = operate(&cm, handler, input_code, options)
            .expect("should not return Err()")
            .code;

        NormalizedOutput::new_raw(code)
            .compare_to_file(transform_output_file)
            .unwrap();

        Ok(())
    })
    .expect("should not fail");
}

#[testing::fixture("../swc_ecma_parser/tests/tsc/**/*.ts")]
fn verify(input: PathBuf) {
    let input_code = std::fs::read_to_string(&input).unwrap();

    let output = PathBuf::from(
        input
            .to_string_lossy()
            .replace("swc_ecma_parser", "swc_ts_fast_strip"),
    );

    let output_file = output.with_extension("strip.js");
    let output_stderr = output.with_extension("strip.broken");

    let err = testing::run_test(false, |cm, handler| {
        let code = match operate(&cm, handler, input_code.clone(), opts(Mode::StripOnly)) {
            Ok(v) => v.code,
            Err(..) => {
                // Skip if the input is invalid
                return Ok(());
            }
        };

        if handler.has_errors() {
            // Skip if the input is invalid

            return Ok(());
        }

        reparse(&cm, handler, &output_file, code.clone());

        if handler.has_errors() {
            NormalizedOutput::new_raw(code)
                .compare_to_file(&output_file)
                .unwrap();

            return Err(());
        }

        Ok(())
    });

    if let Err(err) = err {
        err.compare_to_file(output_stderr).unwrap();
    } else {
        let _ = std::fs::remove_file(&output_file);
        let _ = std::fs::remove_file(&output_stderr);
    }
}

#[testing::fixture("tests/errors/**/*.ts")]
fn error(input: PathBuf) {
    let input_code = std::fs::read_to_string(&input).unwrap();
    let output_file = input.with_extension("swc-stderr");

    testing::run_test(false, |cm, handler| {
        operate(&cm, handler, input_code, opts(Mode::StripOnly)).expect_err("should return Err()");

        Err::<(), _>(())
    })
    .expect_err("should fail")
    .compare_to_file(output_file)
    .unwrap();
}

#[testing::fixture("tests/fixture/declarations/test-1.ts")]
fn transform_without_deprecated_ts_module_as_error(input: PathBuf) {
    let input_code = std::fs::read_to_string(&input).unwrap();
    let output_file = input.with_extension("transform.js");

    testing::run_test(false, |cm, handler| {
        let mut options = opts(Mode::Transform);
        options.deprecated_ts_module_as_error = None;

        let code = operate(&cm, handler, input_code, options)
            .expect("should not return Err()")
            .code;

        NormalizedOutput::new_raw(code)
            .compare_to_file(output_file)
            .unwrap();

        Ok(())
    })
    .expect("should not fail");
}

#[testing::fixture("tests/errors/modules/modules.ts")]
fn strip_without_deprecated_ts_module_as_error(input: PathBuf) {
    let source = std::fs::read_to_string(&input).unwrap();
    for setting in [None, Some(false)] {
        testing::run_test(false, |cm, handler| {
            let mut options = opts(Mode::StripOnly);
            options.deprecated_ts_module_as_error = setting;
            let output = operate(&cm, handler, source.clone(), options).unwrap();
            assert_utf16_layout_preserved(&source, &output.code);
            NormalizedOutput::new_raw(output.code)
                .compare_to_file(input.with_extension("js"))
                .unwrap();
            Ok(())
        })
        .unwrap();
    }
}

#[testing::fixture("tests/fixture/layout/utf16-width.ts")]
fn strip_with_reused_source_map(input: PathBuf) {
    let source = std::fs::read_to_string(&input).unwrap();
    testing::run_test(false, |cm, handler| {
        for _ in 0..2 {
            let output = operate(&cm, handler, source.clone(), opts(Mode::StripOnly)).unwrap();
            assert_utf16_layout_preserved(&source, &output.code);
            NormalizedOutput::new_raw(output.code)
                .compare_to_file(input.with_extension("js"))
                .unwrap();
        }
        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/errors/expressions/assertion-*.ts")]
fn assertion_error_in_strip_mode(input: PathBuf) {
    let input_code = std::fs::read_to_string(&input).unwrap();

    testing::run_test(false, |cm, handler| {
        let error = operate(&cm, handler, input_code, opts(Mode::StripOnly))
            .expect_err("strip-only must reject assertions that change expression grouping");
        assert!(matches!(error.code, ErrorCode::InvalidSyntax));

        Err::<(), _>(())
    })
    .expect_err("should fail")
    .compare_to_file(input.with_extension("swc-stderr"))
    .unwrap();
}

#[testing::fixture("tests/errors/expressions/assertion-*.ts")]
fn assertion_error_in_transform_mode(input: PathBuf) {
    let input_code = std::fs::read_to_string(&input).unwrap();

    testing::run_test(false, |cm, handler| {
        let mut options = opts(Mode::Transform);
        options.deprecated_ts_module_as_error = Some(false);
        let error = operate(&cm, handler, input_code, options)
            .expect_err("transform mode must reject assertions that change expression grouping");
        assert!(matches!(error.code, ErrorCode::InvalidSyntax));

        Err::<(), _>(())
    })
    .expect_err("should fail")
    .compare_to_file(input.with_extension("swc-stderr"))
    .unwrap();
}

fn assert_utf16_layout_preserved(input: &str, output: &str) {
    assert_eq!(
        input.encode_utf16().count(),
        output.encode_utf16().count(),
        "strip-only output must preserve the source UTF-16 length"
    );
    assert_eq!(
        line_terminators(input),
        line_terminators(output),
        "strip-only output must preserve line terminators at their UTF-16 positions"
    );
}

fn line_terminators(input: &str) -> Vec<(usize, char)> {
    let mut utf16_pos = 0;
    let mut line_terminators = Vec::new();

    for c in input.chars() {
        if matches!(c, '\n' | '\r' | '\u{2028}' | '\u{2029}') {
            line_terminators.push((utf16_pos, c));
        }
        utf16_pos += c.len_utf16();
    }

    line_terminators
}

fn opts(mode: Mode) -> Options {
    Options {
        module: None,
        filename: None,
        parser: TsSyntax {
            decorators: true,
            ..Default::default()
        },
        mode,
        transform: Some(TransformConfig {
            typescript: swc_ecma_transforms_typescript::Config {
                native_class_properties: true,
                ..Default::default()
            },
            #[cfg(feature = "nightly")]
            jsx: Default::default(),
        }),
        deprecated_ts_module_as_error: true.into(),
        ..Default::default()
    }
}

fn reparse(cm: &Lrc<SourceMap>, handler: &Handler, filename: &PathBuf, input: String) {
    let jsx = filename
        .extension()
        .is_some_and(|extension| extension == "tsx");
    let filename = FileName::Real(filename.into());

    let fm = cm.new_source_file(filename.into(), input);

    let syntax = Syntax::Es(EsSyntax {
        jsx,
        allow_super_outside_method: true,
        auto_accessors: true,
        decorators: true,
        decorators_before_export: true,
        explicit_resource_management: true,
        import_attributes: true,
        ..Default::default()
    });
    let target = EsVersion::latest();

    let comments = SingleThreadedComments::default();

    let lexer = Capturing::new(Lexer::new(
        syntax,
        target,
        StringInput::from(&*fm),
        Some(&comments),
    ));

    let mut parser = Parser::new_from(lexer);

    let program = parser.parse_program();
    let errors = parser.take_errors();

    match program {
        Ok(program) => program,
        Err(err) => {
            err.into_diagnostic(handler).emit();

            for e in errors {
                e.into_diagnostic(handler).emit();
            }

            return;
        }
    };

    if !errors.is_empty() {
        for e in errors {
            e.into_diagnostic(handler).emit();
        }
    }
}
