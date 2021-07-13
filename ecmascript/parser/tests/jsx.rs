#![feature(test)]

extern crate test;

use pretty_assertions::assert_eq;
use serde_json;
use std::{
    env,
    fs::File,
    io::{self, Read},
    path::Path,
};
use swc_common::{errors::Handler, sync::Lrc, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, PResult, Parser, StringInput};
use swc_ecma_visit::{Fold, FoldWith};
use test::{
    test_main, DynTestFn, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType,
};
use testing::{run_test, StdErr};
use walkdir::WalkDir;

fn add_test<F: FnOnce() + Send + 'static>(
    tests: &mut Vec<TestDescAndFn>,
    name: String,
    ignore: bool,
    f: F,
) {
    tests.push(TestDescAndFn {
        desc: TestDesc {
            test_type: TestType::UnitTest,
            name: TestName::DynTestName(name),
            ignore,
            should_panic: No,
            allow_fail: false,
        },
        testfn: DynTestFn(Box::new(f)),
    });
}

fn error_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push("jsx");
        root.push("errors");
        root
    };

    eprintln!("Loading tests from {}", root.display());

    let dir = root;

    for entry in WalkDir::new(&dir).into_iter() {
        let entry = entry?;
        if entry.file_type().is_dir() || !entry.file_name().to_string_lossy().ends_with(".js") {
            continue;
        }
        let file_name = entry
            .path()
            .strip_prefix(&dir)
            .expect("failed to strip prefix")
            .to_str()
            .unwrap()
            .to_string();

        let input = {
            let mut buf = String::new();
            File::open(entry.path())?.read_to_string(&mut buf)?;
            buf
        };

        let ignore = false;

        let dir = dir.clone();
        let name = format!("jsx::error::{}", file_name);
        add_test(tests, name, ignore, move || {
            eprintln!(
                "\n\n========== Running error reporting test {}\nSource:\n{}\n",
                file_name, input
            );

            let path = dir.join(&file_name);
            let err = run_test(false, |cm, handler| {
                if false {
                    // Type annotation
                    return Ok(());
                }

                // Parse source
                let _ = parse_module(cm, handler, &path);
                if !handler.has_errors() {
                    panic!("should emit error, but parsed without error")
                }

                Err(())
            })
            .expect_err("should fail, but parsed as");

            if err
                .compare_to_file(format!("{}.stderr", path.display()))
                .is_err()
            {
                panic!()
            }
        });
    }

    Ok(())
}

fn reference_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push("jsx");
        root.push("basic");
        root
    };

    eprintln!("Loading tests from {}", root.display());

    let dir = root;

    for entry in WalkDir::new(&dir).into_iter() {
        let entry = entry?;
        if entry.file_type().is_dir() || !entry.file_name().to_string_lossy().ends_with(".js") {
            continue;
        }
        let file_name = entry
            .path()
            .strip_prefix(&dir)
            .expect("failed to strip prefix")
            .to_str()
            .unwrap()
            .to_string();

        let input = {
            let mut buf = String::new();
            File::open(entry.path())?.read_to_string(&mut buf)?;
            buf
        };

        let ignore = false;

        let dir = dir.clone();
        let name = format!("jsx::reference::{}", file_name);
        add_test(tests, name, ignore, move || {
            run_test(false, |cm, handler| {
                eprintln!(
                    "\n\n========== Running reference test {}\nSource:\n{}\n",
                    file_name, input
                );

                let path = dir.join(&file_name);
                // Parse source
                let module = parse_module(cm.clone(), handler, &path)?.fold_with(&mut Normalizer);
                let json = serde_json::to_string_pretty(&module)
                    .expect("failed to serialize module as json");
                if StdErr::from(json.clone())
                    .compare_to_file(format!("{}.json", path.display()))
                    .is_err()
                {
                    panic!()
                }

                let deser = serde_json::from_str::<Module>(&json)
                    .unwrap_or_else(|err| {
                        panic!(
                            "failed to deserialize json back to module: {}\n{}",
                            err, json
                        )
                    })
                    .fold_with(&mut Normalizer);
                assert_eq!(module, deser, "JSON:\n{}", json);

                Ok(())
            })
            .unwrap();
        });
    }

    Ok(())
}

fn parse_module<'a>(cm: Lrc<SourceMap>, handler: &Handler, file_name: &Path) -> Result<Module, ()> {
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
            jsx: true,
            ..Default::default()
        }),
        (&*fm).into(),
        None,
    );

    let res = f(&mut p).map_err(|e| e.into_diagnostic(handler).emit());

    for e in p.take_errors() {
        e.into_diagnostic(&handler).emit();
    }

    res
}

#[test]
fn references() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    reference_tests(&mut tests).unwrap();
    test_main(&args, tests, Some(Options::new()));
}

#[test]
fn error() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    error_tests(&mut tests).unwrap();
    test_main(&args, tests, Some(Options::new()));
}

struct Normalizer;

impl Fold for Normalizer {
    fn fold_pat(&mut self, mut node: Pat) -> Pat {
        node = node.fold_children_with(self);

        if let Pat::Expr(expr) = node {
            match *expr {
                Expr::Ident(i) => return Pat::Ident(i.into()),
                _ => {
                    node = Pat::Expr(expr);
                }
            }
        }

        node
    }

    fn fold_pat_or_expr(&mut self, node: PatOrExpr) -> PatOrExpr {
        let node = node.fold_children_with(self);

        match node {
            PatOrExpr::Pat(pat) => match *pat {
                Pat::Expr(expr) => PatOrExpr::Expr(expr),
                _ => PatOrExpr::Pat(pat),
            },
            _ => node,
        }
    }
}
