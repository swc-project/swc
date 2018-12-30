#![feature(box_syntax)]
#![feature(test)]

extern crate swc_common;
extern crate swc_ecma_lints as lints;
extern crate swc_ecma_parser as parser;
extern crate test;
extern crate testing;
extern crate walkdir;

use self::{
    parser::{SourceFileInput, Syntax},
    test::{test_main, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestFn, TestName},
};
use std::{
    env,
    fs::File,
    io::{self, Read},
    path::{Path, PathBuf},
};
use swc_common::FileName;
use walkdir::{DirEntry, WalkDir};

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

fn is_js_or_dir(entry: &DirEntry) -> bool {
    if entry.file_type().is_dir() {
        return true;
    }

    entry
        .file_name()
        .to_str()
        .map(|s| s.ends_with(".js"))
        .unwrap_or(false)
}

fn add_golden_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push("references");
        root
    };

    eprintln!("Loading tests from {}", root.display());

    for entry in WalkDir::new(&root).into_iter().filter_entry(is_js_or_dir) {
        let entry = entry?;
        if entry.file_type().is_dir() {
            continue;
        }

        let path: PathBuf = entry.path().into();
        let file_name = path
            .strip_prefix(&root)
            .expect("failed to strip prefix")
            .to_str()
            .unwrap()
            .to_string();

        let input = {
            let mut buf = String::new();
            File::open(&path)?.read_to_string(&mut buf)?;
            buf
        };

        let name = format!("lints::golden::{}", file_name);
        add_test(tests, name, false, move || {
            eprintln!(
                "\n\n\n========== Running test {}\nSource:\n{}",
                file_name, input
            );

            let stderr = ::testing::run_test(|cm, handler| {
                let fm = cm.new_source_file(FileName::Real(path.clone()), input);

                let module = {
                    let session = parser::Session {
                        cfg: Default::default(),
                        handler: &handler,
                    };
                    parser::Parser::new(session, Syntax::Es2019, SourceFileInput::from(&*fm))
                        .parse_module()?
                };

                lints::lint_all(&handler, &module);

                Ok(())
            })
            .expect_err("expected to be linted");
            stderr
                .compare_to_file(format!("{}.stderr", path.display()))
                .unwrap();
        });
    }

    Ok(())
}

#[test]
fn golden() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    add_golden_tests(&mut tests).unwrap();
    test_main(&args, tests, Options::new());
}
