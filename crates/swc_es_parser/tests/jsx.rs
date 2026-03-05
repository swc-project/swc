use std::path::PathBuf;

use swc_es_parser::{EsSyntax, Syntax};
use testing::NormalizedOutput;

mod common;

use common::ecma_reuse::{
    build_program_json_snapshot, parse_loaded_file_with_syntax_mode, snapshot_path_for, ParseMode,
};

fn jsx_syntax() -> Syntax {
    Syntax::Es(EsSyntax {
        jsx: true,
        decorators: true,
        import_attributes: true,
        explicit_resource_management: true,
        ..Default::default()
    })
}

#[testing::fixture("../swc_ecma_parser/tests/jsx/basic/**/*.js")]
#[testing::fixture("../swc_ecma_parser/tests/jsx/basic/**/*.jsx")]
fn references(entry: PathBuf) {
    testing::run_test(false, |cm, handler| {
        let fm = cm
            .load_file(&entry)
            .unwrap_or_else(|err| panic!("failed to load {}: {err}", entry.display()));

        let output = parse_loaded_file_with_syntax_mode(&fm, jsx_syntax(), ParseMode::Module);

        for error in output.recovered {
            error.into_diagnostic(handler).emit();
        }
        if let Some(error) = output.fatal {
            error.into_diagnostic(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        let parsed = output
            .parsed
            .unwrap_or_else(|| panic!("parser returned no AST for {}", entry.display()));

        NormalizedOutput::from(build_program_json_snapshot(&parsed))
            .compare_to_file(snapshot_path_for(&entry, ".json"))
            .unwrap_or_else(|_| panic!("snapshot mismatch: {}", entry.display()));

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("../swc_ecma_parser/tests/jsx/errors/**/*.js")]
fn error(entry: PathBuf) {
    let output = testing::run_test(false, |cm, handler| -> Result<(), ()> {
        let fm = cm
            .load_file(&entry)
            .unwrap_or_else(|err| panic!("failed to load {}: {err}", entry.display()));

        let parsed = parse_loaded_file_with_syntax_mode(&fm, jsx_syntax(), ParseMode::Module);
        for error in parsed.recovered {
            error.into_diagnostic(handler).emit();
        }
        if let Some(error) = parsed.fatal {
            error.into_diagnostic(handler).emit();
        }

        if !handler.has_errors() {
            handler
                .struct_err("expected parser diagnostics; parser accepted input")
                .emit();
        }

        Err(())
    })
    .expect_err("should fail, but parsed as");

    output
        .compare_to_file(snapshot_path_for(&entry, ".swc-stderr"))
        .unwrap_or_else(|_| panic!("stderr snapshot mismatch: {}", entry.display()));
}
