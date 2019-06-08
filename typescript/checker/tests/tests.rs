#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(specialization)]
#![feature(test)]

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

#[test]
fn passes() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    add_tests(&mut tests, false).unwrap();
    test_main(&args, tests, Options::new());
}

#[test]
fn errors() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    add_tests(&mut tests, true).unwrap();
    test_main(&args, tests, Options::new());
}

fn add_tests(tests: &mut Vec<TestDescAndFn>, error: bool) -> Result<(), io::Error> {
    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        if error {
            root.push("errors");
        } else {
            root.push("pass");
        }
        root
    };

    eprintln!("Loading tests from {}", root.display());

    let dir = root;

    for entry in WalkDir::new(&dir).into_iter() {
        let entry = entry?;
        println!("{}", entry.file_name().to_string_lossy());
        if entry.file_type().is_dir()
            || (!entry.file_name().to_string_lossy().ends_with("index.ts")
                && !entry.file_name().to_string_lossy().ends_with("index.tsx"))
        {
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

        let ignore = file_name.contains("circular");

        let dir = dir.clone();
        let name = format!(
            "tsc::{}::{}",
            if error { "error" } else { "passes" },
            file_name
        );
        add_test(tests, name, ignore, move || {
            if error {
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
            // Parse source
            let module = do_test(false, &path);

            if error {
                let err = module.expect_err("should fail, but parsed as");
                if err
                    .compare_to_file(format!("{}.stderr", path.display()))
                    .is_err()
                {
                    panic!()
                }
            } else {
                module.expect("should be parsed and validated");
            }
        });
    }

    Ok(())
}

fn do_test(treat_error_as_bug: bool, file_name: &Path) -> Result<(), StdErr> {
    let fname = file_name.display().to_string();
    let output = ::testing::run_test(treat_error_as_bug, |cm, handler| {
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

            let res = if errors.is_empty() { Ok(()) } else { Err(()) };

            for e in errors {
                e.emit(&handler);
            }

            res
        })
    });

    output
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
