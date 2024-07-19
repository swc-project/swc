#![feature(test)]
extern crate test;

use std::{
    env, fs,
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{Context as AnyhowContext, Error};
use copyless::BoxHelper;
use pretty_assertions::assert_eq;
use serde_json::{Number, Value};
use swc::{config::IsModule, Compiler};
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName, FilePathMapping, SourceMap, GLOBALS,
};
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_estree_compat::babelify::{Babelify, Context};
use test::{test_main, DynTestFn, ShouldPanic, TestDesc, TestDescAndFn, TestName, TestType};
use testing::{json::diff_json_value, DebugUsingDisplay};
use walkdir::WalkDir;

#[test]
fn fixtures() -> Result<(), Error> {
    let mut tests = Vec::new();

    let fixtures_path = PathBuf::from("tests").join("fixtures");
    for entry in WalkDir::new(&fixtures_path).into_iter() {
        let entry = entry.with_context(|| "Failed to walk dir")?;
        if !entry.file_type().is_dir() {
            continue;
        }

        let js_path: PathBuf = entry.path().join("input.js");
        let ts_path: PathBuf = entry.path().join("input.ts");
        let mjs_path: PathBuf = entry.path().join("input.mjs");
        let jsx_path: PathBuf = entry.path().join("input.jsx");
        let output_path: PathBuf = entry.path().join("output.json");

        let is_javascript = js_path.is_file();
        let is_typescript = ts_path.is_file();
        let is_module = mjs_path.is_file();
        let is_jsx = jsx_path.is_file();

        if (!is_javascript && !is_typescript && !is_module && !is_jsx) || !output_path.is_file() {
            continue;
        }

        let input_path = if is_typescript {
            &ts_path
        } else if is_module {
            &mjs_path
        } else if is_jsx {
            &jsx_path
        } else {
            &js_path
        };
        let input = fs::read_to_string(input_path)
            .with_context(|| format!("Failed to open file: {}", &js_path.to_string_lossy()))?;
        let output = fs::read_to_string(&output_path)
            .with_context(|| format!("Failed to open file: {}", &output_path.to_string_lossy()))?;

        tests.push(TestDescAndFn {
            desc: TestDesc {
                test_type: TestType::IntegrationTest,
                name: TestName::DynTestName(format!(
                    "babel_compat::convert::{}",
                    get_test_name(entry.path(), &fixtures_path)?
                )),
                ignore: false,
                should_panic: ShouldPanic::No,
                compile_fail: false,
                no_run: false,
                ignore_message: Default::default(),
                source_file: Default::default(),
                start_line: 0,
                start_col: 0,
                end_line: 0,
                end_col: 0,
            },
            testfn: DynTestFn(Box::alloc().init(move || {
                GLOBALS.set(&Default::default(), || {
                    let syntax = if is_typescript {
                        Syntax::Typescript(Default::default())
                    } else if is_jsx {
                        Syntax::Es(EsSyntax {
                            jsx: true,
                            ..Default::default()
                        })
                    } else {
                        Syntax::Es(Default::default())
                    };
                    run_test(input, output, syntax, is_module);

                    Ok(())
                })
            })),
        })
    }

    test_main(
        &env::args().collect::<Vec<_>>(),
        tests,
        Some(test::Options::new()),
    );

    Ok(())
}

// #[test]
// fn single_fixture() -> Result<(), Error> {
//     let input_file = "tests/fixtures/ts-function/input.ts";
//     let output_file = "tests/fixtures/ts-function/output.json";
//     let input = fs::read_to_string(&input_file)
//         .with_context(|| format!("Failed to open file: {}", &input_file))?;
//     let output = fs::read_to_string(&output_file)
//         .with_context(|| format!("Failed to open file: {}", &output_file))?;
//     // run_test(input, output, Syntax::default(), false);
//     // let syntax = Syntax::Es(EsConfig {
//     //     jsx: false,
//     //     ..Default::default()
//     // });
//     let syntax = Syntax::Typescript(Default::default());
//     run_test(input, output, syntax, false);
//     Ok(())
// }

fn run_test(src: String, expected: String, syntax: Syntax, is_module: bool) {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ));
    let compiler = Compiler::new(cm.clone());
    let fm = compiler.cm.new_source_file(FileName::Anon.into(), src);

    let comments = compiler.comments().clone();

    let swc_ast = compiler
        .parse_js(
            fm.clone(),
            &handler,
            Default::default(), // EsVersion (ES version)
            syntax,
            IsModule::Bool(is_module),
            Some(&comments),
        )
        .unwrap();

    let ctx = Context {
        fm,
        cm,
        comments: compiler.comments().clone(),
    };
    let ast = swc_ast.babelify(&ctx);

    let mut actual = serde_json::to_value(&ast).unwrap();

    println!(
        "Actual: \n{}",
        serde_json::to_string_pretty(&actual).unwrap()
    );

    let mut expected: Value = serde_json::from_str(&expected).unwrap();

    diff_json_value(&mut actual, &mut expected, &mut |k, v| match k {
        "identifierName" | "extra" | "errors" => {
            // Remove
            *v = Value::Null;
        }

        "optional" | "computed" | "static" | "abstract" | "declare" | "definite" | "generator"
        | "readonly" | "expression" => {
            // TODO(kdy1): Remove this
            if let Value::Bool(false) = v {
                *v = Value::Null;
            }
        }

        "decorators" | "implements" => {
            // TODO(kdy1): Remove this
            if let Value::Array(arr) = v {
                if arr.is_empty() {
                    *v = Value::Null;
                }
            }
        }

        "sourceFile" => {
            // TODO(kdy1): Remove this
            if let Value::String(s) = v {
                if s.is_empty() {
                    *v = Value::Null;
                }
            }
        }

        "value" => {
            // Normalize numbers
            match v {
                Value::Number(n) => {
                    *n = Number::from_f64(n.as_f64().unwrap()).unwrap();
                }

                Value::String(s) => {
                    // TODO(kdy1): Remove this
                    // This is wrong, but we are not babel ast at the moment
                    *s = s.replace('\n', "");
                }

                _ => {}
            }
        }

        "raw" => {
            // TODO fix me
            // Remove
            *v = Value::Null;
        }

        _ => {}
    });

    let actual = serde_json::to_string_pretty(&actual).unwrap();
    let expected = serde_json::to_string_pretty(&expected).unwrap();

    assert_eq!(DebugUsingDisplay(&actual), DebugUsingDisplay(&expected));
}

fn get_test_name(path: &Path, fixture_path: &Path) -> Result<String, Error> {
    let s: String = path.strip_prefix(fixture_path)?.to_string_lossy().into();
    Ok(s)
}
