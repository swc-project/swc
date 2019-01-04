#![feature(box_syntax)]
#![feature(specialization)]
#![feature(test)]

extern crate swc_common;
extern crate swc_ecma_ast;
extern crate swc_ecma_parser;
extern crate test;
extern crate testing;
extern crate walkdir;

use std::{
    env,
    fs::File,
    io::{self, Read},
    path::Path,
};
use swc_ecma_ast::*;
use swc_ecma_parser::{PResult, Parser, Session, SourceFileInput, Syntax};
use test::{test_main, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestFn, TestName};
use testing::{NormalizedOutput, StdErr};
use walkdir::WalkDir;

fn add_test<F: FnOnce() + Send + 'static>(
    tests: &mut Vec<TestDescAndFn>,
    name: String,
    ignore: bool,
    f: F,
) {
    tests.push(TestDescAndFn {
        desc: TestDesc {
            name: TestName::DynTestName(name),
            ignore,
            should_panic: No,
            allow_fail: false,
        },
        testfn: TestFn::DynTestFn(box f),
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
            // Parse source
            let err = parse_module(&path).expect_err("should fail, but parsed as");

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
            eprintln!(
                "\n\n========== Running reference test {}\nSource:\n{}\n",
                file_name, input
            );

            let path = dir.join(&file_name);
            // Parse source
            let module = parse_module(&path).expect("should be parsed");

            if StdErr::from(format!("{:#?}", module))
                .compare_to_file(format!("{}.stdout", path.display()))
                .is_err()
            {
                panic!()
            }
        });
    }

    Ok(())
}

fn parse_module<'a>(file_name: &Path) -> Result<Module, NormalizedOutput> {
    with_parser(file_name, |p| p.parse_module())
}

fn with_parser<F, Ret>(file_name: &Path, f: F) -> Result<Ret, StdErr>
where
    F: for<'a> FnOnce(&mut Parser<'a, SourceFileInput>) -> PResult<'a, Ret>,
{
    let output = ::testing::run_test(false, |cm, handler| {
        let fm = cm
            .load_file(file_name)
            .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

        let res = f(&mut Parser::new(
            Session { handler: &handler },
            Syntax::Jsx,
            (&*fm).into(),
        ))
        .map_err(|e| {
            e.emit();
            ()
        });

        res
    });

    output
}

#[test]
fn references() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    reference_tests(&mut tests).unwrap();
    test_main(&args, tests, Options::new());
}

#[test]
fn error() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    error_tests(&mut tests).unwrap();
    test_main(&args, tests, Options::new());
}
