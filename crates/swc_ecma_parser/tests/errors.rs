#![allow(unused)]

use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
};

use pretty_assertions::assert_eq;
use swc_common::{errors::Handler, sync::Lrc, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, JSXKind, PResult, Parser, StringInput};
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
    F: FnOnce(&mut Parser<Lexer<StringInput<'_>>>) -> PResult<Ret>,
{
    let fm = cm
        .load_file(file_name)
        .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

    let mut p = Parser::new(
        ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
            jsx: JSXKind::Bool(true),
            ..Default::default()
        }),
        (&*fm).into(),
        None,
    );

    let res = f(&mut p).map_err(|e| e.into_diagnostic(handler).emit());

    for e in p.take_errors() {
        e.into_diagnostic(handler).emit();
    }

    res
}

#[cfg(feature = "verify")]
#[testing::fixture("tests/errors/**/*.js")]
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
        .compare_to_file(format!("{}.stderr", entry.display()))
        .is_err()
    {
        panic!()
    }
}
