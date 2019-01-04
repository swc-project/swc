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
use swc_ecma_parser::{PResult, Parser, Session, SourceFileInput, Syntax};
use test::{test_main, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestFn, TestName};
use testing::StdErr;
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

fn reference_tests(tests: &mut Vec<TestDescAndFn>, errors: bool) -> Result<(), io::Error> {
    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push(if errors {
            "typescript-errors"
        } else {
            "typescript"
        });
        root
    };

    eprintln!("Loading tests from {}", root.display());

    let dir = root;

    for entry in WalkDir::new(&dir).into_iter() {
        let entry = entry?;
        if entry.file_type().is_dir() || !entry.file_name().to_string_lossy().ends_with(".ts") {
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
        let name = format!(
            "typescript::{}::{}",
            if errors { "error" } else { "reference" },
            file_name
        );
        add_test(tests, name, ignore, move || {
            eprintln!(
                "\n\n========== Running reference test {}\nSource:\n{}\n",
                file_name, input
            );

            let path = dir.join(&file_name);
            if errors {
                let module = with_parser(&path, |p| p.parse_module());
                let err = module.expect_err("should fail, but parsed as");
                if err
                    .compare_to_file(format!("{}.stderr", path.display()))
                    .is_err()
                {
                    panic!()
                }
            } else {
                with_parser(&path, |p| {
                    let module = p.parse_module()?;

                    if StdErr::from(format!("{:#?}", module))
                        .compare_to_file(format!("{}.stdout", path.display()))
                        .is_err()
                    {
                        panic!()
                    }

                    Ok(())
                })
                .unwrap();
            }
        });
    }

    Ok(())
}

fn with_parser<F, Ret>(file_name: &Path, f: F) -> Result<Ret, StdErr>
where
    F: for<'a> FnOnce(&mut Parser<'a, SourceFileInput>) -> PResult<'a, Ret>,
{
    let fname = file_name.display().to_string();
    let output = ::testing::run_test(|cm, handler| {
        let fm = cm
            .load_file(file_name)
            .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

        let res = f(&mut Parser::new(
            Session { handler: &handler },
            if fname.contains("tsx") {
                Syntax::Tsx
            } else {
                Syntax::Typescript
            },
            (&*fm).into(),
        ));

        res
    });

    output
}

#[test]
fn references() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    reference_tests(&mut tests, false).unwrap();
    test_main(&args, tests, Options::new());
}

#[test]
fn errors() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    reference_tests(&mut tests, true).unwrap();
    test_main(&args, tests, Options::new());
}
