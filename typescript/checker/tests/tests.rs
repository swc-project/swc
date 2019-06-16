#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(specialization)]
#![feature(test)]

extern crate swc_common;
extern crate swc_ecma_parser;
extern crate swc_ts_checker;
extern crate test;
extern crate testing;
extern crate walkdir;

use std::{
    env,
    fs::File,
    io::{self, Read},
    path::Path,
};
use swc_common::CM;
use swc_ecma_parser::TsConfig;
use test::{test_main, DynTestFn, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestName};
use testing::StdErr;
use walkdir::WalkDir;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Mode {
    Error,
    Pass,
    Conformance,
}

#[test]
fn conformance() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    add_tests(&mut tests, Mode::Conformance).unwrap();
    test_main(&args, tests, Options::new());
}

#[test]
fn passes() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    add_tests(&mut tests, Mode::Pass).unwrap();
    test_main(&args, tests, Options::new());
}

#[test]
fn errors() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    add_tests(&mut tests, Mode::Error).unwrap();
    test_main(&args, tests, Options::new());
}

fn add_tests(tests: &mut Vec<TestDescAndFn>, mode: Mode) -> Result<(), io::Error> {
    let test_kind = match mode {
        Mode::Error => "errors",
        Mode::Conformance => "conformance",
        Mode::Pass => "pass",
    };

    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push(test_kind);

        root
    };

    eprintln!("Loading tests from {}", root.display());

    let dir = root;

    for entry in WalkDir::new(&dir).into_iter() {
        let entry = entry?;
        println!("{}", entry.file_name().to_string_lossy());
        let is_ts = entry.file_name().to_string_lossy().ends_with(".ts")
            || entry.file_name().to_string_lossy().ends_with(".tsx");
        if entry.file_type().is_dir() || !is_ts {
            continue;
        }

        let is_not_index = !entry.file_name().to_string_lossy().ends_with("index.d.ts")
            && !entry.file_name().to_string_lossy().ends_with("index.ts")
            && !entry.file_name().to_string_lossy().ends_with("index.tsx");
        if is_not_index && mode != Mode::Conformance {
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

        let ignore = file_name.contains("circular")
            || (mode == Mode::Conformance && !file_name.contains("types"));

        let dir = dir.clone();
        let name = format!("tsc::{}::{}", test_kind, file_name);
        add_test(tests, name, ignore, move || {
            if mode == Mode::Error || mode == Mode::Conformance {
                eprintln!(
                    "\n\n========== Running error reporting test {}\nSource:\n{}\n",
                    file_name, input
                );
            } else {
                eprintln!(
                    "\n\n========== Running test {}\nSource:\n{}\n",
                    file_name, input
                );
            }

            let path = dir.join(&file_name);
            do_test(false, &path, mode).unwrap();
        });
    }

    Ok(())
}

fn do_test(treat_error_as_bug: bool, file_name: &Path, mode: Mode) -> Result<(), StdErr> {
    let fname = file_name.display().to_string();
    let error_cmt_count = match mode {
        Mode::Conformance => {
            let mut buf = String::new();
            File::open(file_name)
                .expect("failed to open file for testing")
                .read_to_string(&mut buf)
                .expect("failed to read file's content");

            Some(buf.lines().filter(|s| s.contains("// error")).count())
        }
        _ => None,
    };

    let res = ::testing::run_test(treat_error_as_bug, |cm, handler| {
        CM.set(&cm.clone(), || {
            let checker = swc_ts_checker::Checker::new(
                cm.clone(),
                handler,
                TsConfig {
                    tsx: fname.contains("tsx"),
                    ..Default::default()
                },
            );

            let errors = checker.check(file_name.into());
            if let Some(count) = error_cmt_count {
                if count != errors.len() {
                    checker.run(|| {
                        for e in errors {
                            e.emit(&handler);
                        }
                    });
                    return Err(());
                }
            }

            let res = if errors.is_empty() { Ok(()) } else { Err(()) };

            checker.run(|| {
                for e in errors {
                    e.emit(&handler);
                }
            });

            res
        })
    });

    match mode {
        Mode::Error => {
            let err = res.expect_err("should fail, but parsed as");
            if err
                .compare_to_file(format!("{}.stderr", file_name.display()))
                .is_err()
            {
                panic!()
            }
        }
        Mode::Pass => {
            res.expect("should be parsed and validated");
        }
        Mode::Conformance => {
            let err = match res {
                Ok(_) => StdErr::from(String::from("")),
                Err(err) => err,
            };

            let err_count = err.lines().filter(|l| l.contains("$DIR")).count();

            if err_count != error_cmt_count.unwrap() {
                panic!(
                    "{:?}\nExpected {} errors, got {}",
                    err,
                    error_cmt_count.unwrap(),
                    err_count,
                );
            }

            if err
                .compare_to_file(format!("{}.stderr", file_name.display()))
                .is_err()
            {
                panic!()
            }
        }
    }

    Ok(())
}

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
        testfn: DynTestFn(box f),
    });
}
