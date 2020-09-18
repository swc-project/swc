#![feature(test)]

extern crate test;

use std::{env, path::PathBuf};
use swc_css_parser::parse;
use test::{
    test_main, DynTestFn, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType,
};
use testing::NormalizedOutput;
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

fn load_fixtures(tests: &mut Vec<TestDescAndFn>) {
    let root =
        PathBuf::from(env::var("CARGO_MANIFEST_DIR").expect("CARGO_MANIFEST_DIR not specified"))
            .join("tests")
            .join("fixture");

    for entry in WalkDir::new(&root) {
        let entry = entry.unwrap();
        if entry.file_type().is_dir() || !entry.file_name().to_string_lossy().ends_with(".css") {
            continue;
        }

        add_test(
            tests,
            entry.file_name().to_string_lossy().replace("/", "::"),
            false,
            || {
                testing::run_test2(false, move |cm, _handler| {
                    let fm = cm.load_file(entry.path()).unwrap();

                    let stylesheet = parse(fm.start_pos, &fm.src).unwrap();
                    let json = serde_json::to_string_pretty(&stylesheet).unwrap();

                    let output = NormalizedOutput::from(json);

                    output
                        .compare_to_file(entry.path().with_extension("json"))
                        .unwrap();

                    Ok(())
                })
                .unwrap()
            },
        );
    }
}

#[test]
fn fixture() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    load_fixtures(&mut tests);
    test_main(&args, tests, Some(Options::new()));
}
