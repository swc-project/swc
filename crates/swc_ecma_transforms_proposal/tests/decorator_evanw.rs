use std::{fs, path::PathBuf};

use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_proposal::decorator_2023_11::decorator_2023_11;
use swc_ecma_transforms_testing::exec_tr;
use swc_ecma_visit::as_folder;

#[testing::fixture("tests/decorator-evanw-split/*.js")]
fn fixture(input: PathBuf) {
    let input_code = fs::read_to_string(&input).unwrap();

    exec_tr(
        &input.file_name().unwrap().to_string_lossy(),
        Syntax::Es(EsSyntax {
            decorators: true,
            auto_accessors: true,
            ..Default::default()
        }),
        |_| as_folder(decorator_2023_11()),
        &input_code,
    );
}
