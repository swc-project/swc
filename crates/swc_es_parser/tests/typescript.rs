#![allow(clippy::needless_update)]

use std::path::{Path, PathBuf};

use swc_common::FileName;
use swc_es_parser::{Syntax, TsSyntax};
use testing::NormalizedOutput;

mod common;

use common::ecma_reuse::{
    parse_loaded_file_with_syntax_mode, should_skip_tsc_case, snapshot_path_for, ParseMode,
};

fn ts_syntax(file: &Path, no_early_errors: bool) -> Syntax {
    let file_name = file
        .display()
        .to_string()
        .replace("\\\\", "/")
        .replace('\\', "/");

    Syntax::Typescript(TsSyntax {
        dts: file_name.ends_with(".d.ts"),
        tsx: file_name.contains("tsx"),
        decorators: true,
        no_early_errors,
        disallow_ambiguous_jsx_like: file_name.contains("cts") || file_name.contains("mts"),
        ..Default::default()
    })
}

#[testing::fixture("../swc_ecma_parser/tests/shifted/**/*.ts")]
fn shifted(file: PathBuf) {
    testing::run_test(false, |cm, handler| {
        cm.new_source_file(FileName::Anon.into(), "");

        let fm = cm
            .load_file(&file)
            .unwrap_or_else(|err| panic!("failed to load {}: {err}", file.display()));

        let output =
            parse_loaded_file_with_syntax_mode(&fm, ts_syntax(&file, true), ParseMode::Program);

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
            .unwrap_or_else(|| panic!("parser returned no AST for {}", file.display()));

        NormalizedOutput::from(common::ecma_reuse::build_program_json_snapshot(&parsed))
            .compare_to_file(snapshot_path_for(&file, ".json"))
            .unwrap_or_else(|_| panic!("snapshot mismatch: {}", file.display()));

        NormalizedOutput::from(format!("{:#?}\n", output.comments))
            .compare_to_file(snapshot_path_for(&file, ".comments"))
            .unwrap_or_else(|_| panic!("comments snapshot mismatch: {}", file.display()));

        Ok(())
    })
    .map_err(|_| ())
    .unwrap();
}

#[testing::fixture("../swc_ecma_parser/tests/typescript/**/*.ts")]
#[testing::fixture("../swc_ecma_parser/tests/typescript/**/*.mts")]
#[testing::fixture("../swc_ecma_parser/tests/typescript/**/*.cts")]
#[testing::fixture("../swc_ecma_parser/tests/typescript/**/*.tsx")]
fn spec(file: PathBuf) {
    run_spec(&file, ParseMode::Program, true);
}

#[testing::fixture(
    "../swc_ecma_parser/tests/tsc/**/*.ts",
    exclude(
        "for-of51.ts",
        "parserArrowFunctionExpression11",
        "esDecorators-decoratorExpression.1"
    )
)]
fn tsc_spec(file: PathBuf) {
    if should_skip_tsc_case(&file) {
        return;
    }

    run_spec(&file, ParseMode::Program, true);
}

fn run_spec(file: &Path, mode: ParseMode, no_early_errors: bool) {
    testing::run_test(false, |cm, handler| {
        let fm = cm
            .load_file(file)
            .unwrap_or_else(|err| panic!("failed to load {}: {err}", file.display()));

        let output =
            parse_loaded_file_with_syntax_mode(&fm, ts_syntax(file, no_early_errors), mode);

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
            .unwrap_or_else(|| panic!("parser returned no AST for {}", file.display()));

        NormalizedOutput::from(common::ecma_reuse::build_program_json_snapshot(&parsed))
            .compare_to_file(snapshot_path_for(file, ".json"))
            .unwrap_or_else(|_| panic!("snapshot mismatch: {}", file.display()));

        Ok(())
    })
    .map_err(|_| ())
    .unwrap();
}

#[testing::fixture("../swc_ecma_parser/tests/typescript-errors/**/*.ts")]
#[testing::fixture("../swc_ecma_parser/tests/typescript-errors/**/*.mts")]
#[testing::fixture("../swc_ecma_parser/tests/typescript-errors/**/*.cts")]
#[testing::fixture("../swc_ecma_parser/tests/typescript-errors/**/*.tsx")]
fn errors(file: PathBuf) {
    let output = testing::run_test(false, |cm, handler| -> Result<(), ()> {
        let fm = cm
            .load_file(&file)
            .unwrap_or_else(|err| panic!("failed to load {}: {err}", file.display()));

        let parsed =
            parse_loaded_file_with_syntax_mode(&fm, ts_syntax(&file, false), ParseMode::Module);
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
        .compare_to_file(snapshot_path_for(&file, ".swc-stderr"))
        .unwrap_or_else(|_| panic!("stderr snapshot mismatch: {}", file.display()));
}
