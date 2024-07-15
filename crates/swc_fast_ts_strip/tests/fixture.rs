use std::path::PathBuf;

use swc_ecma_parser::TsSyntax;
use swc_fast_ts_strip::{operate, Mode, Options};
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/*.ts")]
fn test(input: PathBuf) {
    let input_code = std::fs::read_to_string(&input).unwrap();
    let output_file = input.with_extension("js");
    let transform_output_file = input.with_file_name(".transform.js");

    testing::run_test(false, |cm, handler| {
        let code = operate(&cm, handler, input_code.clone(), opts(Mode::StripOnly))
            .expect("should not return Err()")
            .code;

        NormalizedOutput::new_raw(code)
            .compare_to_file(output_file)
            .unwrap();

        Ok(())
    })
    .expect("should not fail");

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

#[testing::fixture("tests/errors/**/*.ts")]
fn error(input: PathBuf) {
    let input_code = std::fs::read_to_string(&input).unwrap();
    let output_file = input.with_extension("swc-stderr");

    testing::run_test(false, |cm, handler| {
        operate(&cm, handler, input_code, opts(Mode::StripOnly)).expect("should not return Err()");

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
        ..Default::default()
    }
}
