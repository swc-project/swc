#![feature(test)]

extern crate test;

use std::{
    env,
    fs::{read_dir, File},
    io::{self, Read},
    path::Path,
};

use common::Normalizer;
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, PResult, Parser, Syntax};
use swc_ecma_visit::FoldWith;
use test::{
    test_main, DynTestFn, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType,
};
use testing::{NormalizedOutput, StdErr};

#[path = "common/mod.rs"]
mod common;

const IGNORED_PASS_TESTS: &[&str] = &[
    // Temporalily ignored
    "431ecef8c85d4d24.js",
    "8386fbff927a9e0e.js",
    "5654d4106d7025c2.js",
    // Stack size (Stupid parens)
    "6b5e7e125097d439.js",
    "714be6d28082eaa7.js",
    "882910de7dd1aef9.js",
    "dd3c63403db5c06e.js",
    // Static constructor
    "dcc5609dcc043200.js",
    "88d42455ac933ef5.js",
    // Wrong tests (variable name or value is different)
    "0339fa95c78c11bd.js",
    "0426f15dac46e92d.js",
    "0b4d61559ccce0f9.js",
    "0f88c334715d2489.js",
    "1093d98f5fc0758d.js",
    "15d9592709b947a0.js",
    "2179895ec5cc6276.js",
    "247a3a57e8176ebd.js",
    "441a92357939904a.js",
    "47f974d6fc52e3e4.js",
    "4e1a0da46ca45afe.js",
    "5829d742ab805866.js",
    "589dc8ad3b9aa28f.js",
    "598a5cedba92154d.js",
    "72d79750e81ef03d.js",
    "7788d3c1e1247da9.js",
    "7b72d7b43bedc895.js",
    "7dab6e55461806c9.js",
    "82c827ccaecbe22b.js",
    "87a9b0d1d80812cc.js",
    "8c80f7ee04352eba.js",
    "96f5d93be9a54573.js",
    "988e362ed9ddcac5.js",
    "9bcae7c7f00b4e3c.js",
    "a8a03a88237c4e8f.js",
    "ad06370e34811a6a.js",
    "b0fdc038ee292aba.js",
    "b62c6dd890bef675.js",
    "cb211fadccb029c7.js",
    "ce968fcdf3a1987c.js",
    "db3c01738aaf0b92.js",
    "e1387fe892984e2b.js",
    "e71c1d5f0b6b833c.js",
    "e8ea384458526db0.js",
    // We don't implement Annex B fully.
    "1c1e2a43fe5515b6.js",
    "3dabeca76119d501.js",
    "52aeec7b8da212a2.js",
    "59ae0289778b80cd.js",
    "a4d62a651f69d815.js",
    "c06df922631aeabc.js",
    // Wrong test - strict mode
    "8f8bfb27569ac008.js",
    "ce569e89a005c02a.js",
    // Unicode 14 vs 15
    "046a0bb70d03d0cc.js",
    "08a39e4289b0c3f3.js",
    "300a638d978d0f2c.js",
    "44f31660bd715f05.js",
];

fn add_test<F: FnOnce() -> Result<(), String> + Send + 'static>(
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
            compile_fail: false,
            no_run: false,
            ignore_message: Default::default(),
            source_file: Default::default(),
            start_line: 0,
            start_col: 0,
            end_line: 0,
            end_col: 0,
        },
        testfn: DynTestFn(Box::new(f)),
    });
}

#[cfg(feature = "verify")]
fn error_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
    const IGNORED_ERROR_TESTS: &[&str] = &[
        // pass in script. error in module.
        "e3fbcf63d7e43ead.js",
        // Old (wrong) tests
        "569a2c1bad3beeb2.js",
        "3b6f737a4ac948a8.js",
        "829d9261aa6cd22c.js",
        "b03ee881dce1a367.js",
        "cb92787da5075fd1.js",
        "f0f498d6ae70038f.js",
        // Wrong tests
        "0d5e450f1da8a92a.js",
        "346316bef54d805a.js",
        "976b6247ca78ab51.js",
        "ae0a7ac275bc9f5c.js",
        "748656edbfb2d0bb.js",
        "79f882da06f88c9f.js",
        "d28e80d99f819136.js",
        "92b6af54adef3624.js",
        "ef2d369cccc5386c.js",
        // Temporarily ignore tests for using octal escape before use strict
        "147fa078a7436e0e.js",
        "15a6123f6b825c38.js",
        "3bc2b27a7430f818.js",
        // Tmporarily ignored
        "2fa321f0374c7017.js",
        "3dbb6e166b14a6c0.js",
        "66e383bfd18e66ab.js",
        "78c215fabdf13bae.js",
        "bf49ec8d96884562.js",
        "e4a43066905a597b.js",
        "98204d734f8c72b3.js",
        "ef81b93cf9bdb4ec.js",
    ];

    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push("test262-parser");
        root
    };

    eprintln!("Loading tests from {}", root.display());

    const TYPES: &[&str] = &[
        "fail", /* TODO
                * "early" */
    ];

    for err_type in TYPES {
        let dir = root.join(err_type);
        let error_reference_dir = {
            let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
            root.push("tests");
            root.push("test262-error-references");
            root.push(err_type);
            root
        };

        for entry in read_dir(&dir)? {
            let entry = entry?;
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

            let ignore = IGNORED_ERROR_TESTS.contains(&&*file_name);

            let module = file_name.contains("module");

            let dir = dir.clone();
            let error_reference_dir = error_reference_dir.clone();
            let name = format!("test262::error_reporting::{}::{}", err_type, file_name);
            add_test(tests, name, ignore, move || {
                eprintln!(
                    "\n\n========== Running error reporting test {}\nSource:\n{}\n",
                    file_name, input
                );

                let path = dir.join(&file_name);
                // Parse source
                let err = if module {
                    parse_module(&path).expect_err("should fail, but parsed as")
                } else {
                    parse_script(&path).expect_err("should fail, but parsed as")
                };

                if err
                    .compare_to_file(format!(
                        "{}.swc-stderr",
                        error_reference_dir.join(file_name).display()
                    ))
                    .is_err()
                {
                    panic!()
                }

                Ok(())
            });
        }
    }

    Ok(())
}

fn identity_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push("test262-parser");
        root
    };

    eprintln!("Loading tests from {}", root.display());

    let pass_dir = root.join("pass");

    let files = read_dir(&pass_dir)?;

    for entry in files {
        let entry = entry?;
        let file_name = entry
            .path()
            .strip_prefix(&pass_dir)
            .expect("failed to strip prefix")
            .to_str()
            .unwrap()
            .to_string();

        let input = {
            let mut buf = String::new();
            File::open(entry.path())?.read_to_string(&mut buf)?;
            buf
        };
        let explicit = {
            let mut buf = String::new();
            File::open(root.join("pass-explicit").join(&file_name))?.read_to_string(&mut buf)?;
            buf
        };

        let ignore = IGNORED_PASS_TESTS.contains(&&*file_name);

        let module = file_name.contains("module");

        let root = root.clone();
        let name = format!("test262::identity::{}", file_name);
        add_test(tests, name, ignore, move || {
            eprintln!(
                "\n\n\n========== Running test {}\nSource:\n{}\nExplicit:\n{}",
                file_name, input, explicit
            );

            if module {
                let p = |explicit| {
                    parse_module(
                        &root
                            .join(if explicit { "pass-explicit" } else { "pass" })
                            .join(&file_name),
                    )
                    .map(normalize)
                    .unwrap()
                };
                let src = p(false);
                let expected = p(true);
                assert_eq!(src, expected);

                let json =
                    serde_json::to_string_pretty(&src).expect("failed to serialize module as json");

                let deser = serde_json::from_str::<Module>(&json)
                    .unwrap_or_else(|err| {
                        panic!(
                            "failed to deserialize json back to module: {}\n{}",
                            err, json
                        )
                    })
                    .fold_with(&mut Normalizer {
                        drop_span: true,
                        is_test262: true,
                    });
                assert_eq!(src, deser, "JSON:\n{}", json);
            } else {
                let p = |explicit| {
                    parse_script(
                        &root
                            .join(if explicit { "pass-explicit" } else { "pass" })
                            .join(&file_name),
                    )
                    .map(normalize)
                    .unwrap()
                };
                let src = p(false);
                let expected = p(true);
                assert_eq!(src, expected);
            }

            Ok(())
        });
    }

    Ok(())
}

fn parse_script(file_name: &Path) -> Result<Script, NormalizedOutput> {
    with_parser(file_name, |p| p.parse_script())
}
fn parse_module(file_name: &Path) -> Result<Module, NormalizedOutput> {
    with_parser(file_name, |p| p.parse_module())
}

fn with_parser<F, Ret>(file_name: &Path, f: F) -> Result<Ret, StdErr>
where
    F: FnOnce(&mut Parser<Lexer>) -> PResult<Ret>,
{
    ::testing::run_test(false, |cm, handler| {
        let fm = cm
            .load_file(file_name)
            .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

        let mut p = Parser::new(Syntax::default(), (&*fm).into(), None);

        let res = f(&mut p).map_err(|e| e.into_diagnostic(handler).emit());

        for e in p.take_errors() {
            e.into_diagnostic(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        res
    })
}

#[test]
fn identity() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    identity_tests(&mut tests).unwrap();
    test_main(&args, tests, Some(Options::new()));
}

#[test]
#[cfg(feature = "verify")]
fn error() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    error_tests(&mut tests).unwrap();
    test_main(&args, tests, Some(Options::new()));
}

pub fn normalize<T>(t: T) -> T
where
    T: FoldWith<Normalizer>,
{
    let mut n = Normalizer {
        drop_span: true,
        is_test262: true,
    };
    t.fold_with(&mut n)
}
