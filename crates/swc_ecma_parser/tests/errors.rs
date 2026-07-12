#![allow(unused)]

use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
};

use pretty_assertions::assert_eq;
use swc_common::{errors::Handler, sync::Lrc, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::{ModuleKind, Parser, SourceType};
use swc_ecma_visit::{Fold, FoldWith};
use testing::{run_test, StdErr};

fn parse_module(cm: Lrc<SourceMap>, handler: &Handler, file_name: &Path) -> Result<Module, ()> {
    let Program::Module(module) = parse_program(cm, handler, file_name, ModuleKind::Module)? else {
        unreachable!("module source type must produce a module")
    };
    Ok(module)
}

fn parse_script(cm: Lrc<SourceMap>, handler: &Handler, file_name: &Path) -> Result<Script, ()> {
    let Program::Script(script) = parse_program(cm, handler, file_name, ModuleKind::Script)? else {
        unreachable!("script source type must produce a script")
    };
    Ok(script)
}

fn parse_program(
    cm: Lrc<SourceMap>,
    handler: &Handler,
    file_name: &Path,
    module_kind: ModuleKind,
) -> Result<Program, ()> {
    let fm = cm
        .load_file(file_name)
        .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

    let is_ts = file_name
        .extension()
        .map(|ext| ext == "ts" || ext == "tsx")
        .unwrap_or_default();

    let is_jsx = file_name
        .extension()
        .map(|ext| ext == "jsx" || ext == "tsx")
        .unwrap_or_default();

    let syntax = if is_ts {
        ::swc_ecma_parser::Syntax::Typescript(::swc_ecma_parser::TsSyntax {
            tsx: is_jsx,
            ..Default::default()
        })
    } else {
        ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsSyntax {
            jsx: is_jsx,
            explicit_resource_management: true,
            ..Default::default()
        })
    };

    let (source_type, options) = SourceType::from_legacy(syntax, module_kind, EsVersion::Es2015);
    let result = Parser::new(&fm.src, source_type)
        .with_options(options)
        .with_start_pos(fm.start_pos)
        .parse();
    let failed = result.panicked || !result.diagnostics.is_empty();
    for error in result.diagnostics {
        error.into_diagnostic(handler).emit();
    }

    if failed || handler.has_errors() {
        return Err(());
    }

    Ok(result.program)
}

#[cfg(feature = "verify")]
#[testing::fixture("tests/errors/**/*.cjs")]
#[testing::fixture("tests/errors/**/*.js")]
#[testing::fixture("tests/errors/**/*.mjs")]
#[testing::fixture("tests/errors/**/*.ts")]
#[testing::fixture("tests/errors/**/*.tsx")]
fn error(entry: PathBuf) {
    let input = read_to_string(&entry).unwrap();

    let is_module = entry
        .extension()
        .map(|ext| ext != "cjs")
        .unwrap_or_default();

    eprintln!(
        "\n\n========== Running error reporting test \nSource:\n{}\n",
        input
    );

    let err = run_test(false, |cm, handler| {
        if false {
            // Type annotation
            return Ok(());
        }

        // Parse source
        if is_module {
            parse_module(cm.clone(), handler, &entry);
        } else {
            parse_script(cm.clone(), handler, &entry);
        }

        if !handler.has_errors() {
            panic!("should emit error, but parsed without error")
        }

        Err(())
    })
    .expect_err("should fail, but parsed as");

    if err
        .compare_to_file(format!("{}.swc-stderr", entry.display()))
        .is_err()
    {
        panic!()
    }
}
