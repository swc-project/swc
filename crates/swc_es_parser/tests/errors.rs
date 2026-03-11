use std::path::{Path, PathBuf};

use swc_es_parser::{EsSyntax, Syntax, TsSyntax};

mod common;

use common::ecma_reuse::{
    load_ecma_fixture_file, parse_loaded_file_with_syntax_mode, snapshot_path_for, ParseMode,
};

fn syntax_for_error(file: &Path) -> Syntax {
    match file.extension().and_then(|ext| ext.to_str()) {
        Some("ts") => Syntax::Typescript(TsSyntax {
            decorators: true,
            no_early_errors: false,
            ..Default::default()
        }),
        Some("tsx") => Syntax::Typescript(TsSyntax {
            tsx: true,
            decorators: true,
            no_early_errors: false,
            ..Default::default()
        }),
        Some("mts") => Syntax::Typescript(TsSyntax {
            decorators: true,
            no_early_errors: false,
            disallow_ambiguous_jsx_like: true,
            ..Default::default()
        }),
        Some("cts") => Syntax::Typescript(TsSyntax {
            decorators: true,
            no_early_errors: false,
            disallow_ambiguous_jsx_like: true,
            ..Default::default()
        }),
        _ => Syntax::Es(EsSyntax {
            decorators: true,
            import_attributes: true,
            explicit_resource_management: true,
            allow_return_outside_function: file.extension().and_then(|ext| ext.to_str())
                == Some("cjs"),
            ..Default::default()
        }),
    }
}

fn mode_for_error(file: &Path) -> ParseMode {
    if file.extension().and_then(|ext| ext.to_str()) == Some("cjs") {
        ParseMode::Script
    } else {
        ParseMode::Module
    }
}

#[testing::fixture("../swc_ecma_parser/tests/errors/**/*.cjs")]
#[testing::fixture("../swc_ecma_parser/tests/errors/**/*.js")]
#[testing::fixture("../swc_ecma_parser/tests/errors/**/*.mjs")]
#[testing::fixture("../swc_ecma_parser/tests/errors/**/*.ts")]
#[testing::fixture("../swc_ecma_parser/tests/errors/**/*.tsx")]
fn error(entry: PathBuf) {
    let output = testing::run_test(false, |cm, handler| -> Result<(), ()> {
        let fm = load_ecma_fixture_file(&cm, &entry);

        let parsed = parse_loaded_file_with_syntax_mode(
            &fm,
            syntax_for_error(&entry),
            mode_for_error(&entry),
        );

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
