#![allow(clippy::needless_update)]

use std::path::{Path, PathBuf};

use swc_es_parser::{EsSyntax, Syntax};
use testing::NormalizedOutput;

mod common;

use common::ecma_reuse::{
    build_program_json_snapshot, parse_loaded_file_with_syntax_mode, read_es_syntax_config,
    snapshot_path_for, ParseMode,
};

#[testing::fixture("../swc_ecma_parser/tests/js/**/*.js")]
#[testing::fixture("../swc_ecma_parser/tests/js/**/*.cjs")]
fn spec(file: PathBuf) {
    let output = snapshot_path_for(&file, ".json");
    let config_path = file
        .parent()
        .unwrap_or_else(|| panic!("fixture {} should have parent", file.display()))
        .join("config.json");
    run_spec(&file, &output, &config_path);
}

fn run_spec(file: &Path, output_json: &Path, config_path: &Path) {
    let is_commonjs = file.extension().and_then(|ext| ext.to_str()) == Some("cjs");

    let syntax = read_es_syntax_config(config_path)
        .map(|mut syntax| {
            syntax.allow_return_outside_function |= is_commonjs;
            syntax
        })
        .map(Syntax::Es)
        .unwrap_or_else(|| {
            Syntax::Es(EsSyntax {
                explicit_resource_management: true,
                import_attributes: true,
                decorators: true,
                allow_return_outside_function: is_commonjs,
                ..Default::default()
            })
        });

    let mode = if is_commonjs {
        ParseMode::Script
    } else {
        ParseMode::Program
    };

    testing::run_test(false, |cm, handler| {
        let fm = cm
            .load_file(file)
            .unwrap_or_else(|err| panic!("failed to load {}: {err}", file.display()));

        let output = parse_loaded_file_with_syntax_mode(&fm, syntax, mode);

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

        NormalizedOutput::from(build_program_json_snapshot(&parsed))
            .compare_to_file(output_json)
            .unwrap_or_else(|_| panic!("snapshot mismatch: {}", file.display()));

        Ok(())
    })
    .map_err(|_| ())
    .unwrap();
}
