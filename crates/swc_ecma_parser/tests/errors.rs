#![allow(unused)]

use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
};

use pretty_assertions::assert_eq;
use swc_common::{errors::Handler, sync::Lrc, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, PResult, Parser, StringInput};
use swc_ecma_visit::{Fold, FoldWith};
use testing::{run_test, StdErr};

fn parse_module(cm: Lrc<SourceMap>, handler: &Handler, file_name: &Path) -> Result<Module, ()> {
    with_parser(cm, handler, file_name, |p| p.parse_module())
}

fn with_parser<F, Ret>(
    cm: Lrc<SourceMap>,
    handler: &Handler,
    file_name: &Path,
    f: F,
) -> Result<Ret, ()>
where
    F: FnOnce(&mut Parser<Lexer>) -> PResult<Ret>,
{
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

    let mut p = Parser::new(syntax, (&*fm).into(), None);

    let res = f(&mut p).map_err(|e| e.into_diagnostic(handler).emit());

    for e in p.take_errors() {
        e.into_diagnostic(handler).emit();
    }

    res
}

#[cfg(feature = "verify")]
#[testing::fixture("tests/errors/**/*.js")]
#[testing::fixture("tests/errors/**/*.mjs")]
#[testing::fixture("tests/errors/**/*.ts")]
#[testing::fixture("tests/errors/**/*.tsx")]
fn error(entry: PathBuf) {
    let input = read_to_string(&entry).unwrap();

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
        let _ = parse_module(cm, handler, &entry);
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
