use std::path::PathBuf;

use swc_common::{
    comments::SingleThreadedComments, errors::Handler, sync::Lrc, FileName, SourceMap,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{lexer::Lexer, Capturing, EsSyntax, Parser, StringInput, Syntax, TsSyntax};
use swc_fast_ts_strip::{operate, Mode, Options};
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/*.ts")]
fn test(input: PathBuf) {
    let input_code = std::fs::read_to_string(&input).unwrap();
    let output_stderr = input.with_extension("swc-stderr");
    let output_file = input.with_extension("js");
    let transform_output_file = input.with_extension("transform.js");

    let err = testing::run_test(false, |cm, handler| {
        if let Ok(code) = operate(&cm, handler, input_code.clone(), opts(Mode::StripOnly)) {
            let code = code.code;

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
        let code = operate(&cm, handler, input_code, opts(Mode::Transform))
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
            .replace("swc_ecma_parser", "swc_fast_ts_strip"),
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

fn opts(mode: Mode) -> Options {
    Options {
        module: None,
        filename: None,
        parser: TsSyntax {
            decorators: true,
            ..Default::default()
        },
        mode,
        transform: Some(swc_ecma_transforms_typescript::Config {
            native_class_properties: true,
            ..Default::default()
        }),
        ..Default::default()
    }
}

fn reparse(cm: &Lrc<SourceMap>, handler: &Handler, filename: &PathBuf, input: String) {
    let filename = FileName::Real(filename.into());

    let fm = cm.new_source_file(filename.into(), input);

    let syntax = Syntax::Es(EsSyntax {
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
