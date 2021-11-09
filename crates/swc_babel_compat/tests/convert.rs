#![feature(test)]
extern crate test;

use anyhow::{Context as AnyhowContext, Error};
use copyless::BoxHelper;
use pretty_assertions::assert_eq;
use std::{
    env, fs,
    path::{Path, PathBuf},
    sync::Arc,
};
use swc::Compiler;
use swc_babel_ast::File;
use swc_babel_compat::babelify::{normalize::normalize, Babelify, Context};
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName, FilePathMapping, SourceMap,
};
use swc_ecma_parser::{EsConfig, Syntax};
use test::{test_main, DynTestFn, ShouldPanic, TestDesc, TestDescAndFn, TestName, TestType};
use walkdir::WalkDir;

#[test]
fn fixtures() -> Result<(), Error> {
    let mut tests = vec![];

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
                allow_fail: false,
                compile_fail: false,
                no_run: false,
            },
            testfn: DynTestFn(Box::alloc().init(move || {
                let syntax = if is_typescript {
                    Syntax::Typescript(Default::default())
                } else if is_jsx {
                    Syntax::Es(EsConfig {
                        jsx: true,
                        ..Default::default()
                    })
                } else {
                    Syntax::Es(EsConfig {
                        static_blocks: true,
                        ..Default::default()
                    })
                };
                run_test(input, output, syntax, is_module);
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
    let fm = compiler.cm.new_source_file(FileName::Anon, src);

    let swc_ast = compiler
        .parse_js(
            fm.clone(),
            &handler,
            Default::default(), // EsVersion (ES version)
            syntax,
            is_module,
            true, // parse_conmments
        )
        .unwrap();

    let ctx = Context {
        fm,
        cm,
        comments: compiler.comments().clone(),
    };
    let mut ast = swc_ast.babelify(&ctx);
    normalize(&mut ast);
    println!("Actaul: {:?}", ast);

    let mut expected_ast: File = serde_json::from_str(&expected).unwrap();
    normalize(&mut expected_ast);

    assert_eq!(expected_ast, ast);
}

fn get_test_name(path: &Path, fixture_path: &Path) -> Result<String, Error> {
    let s: String = path.strip_prefix(fixture_path)?.to_string_lossy().into();
    Ok(s)
}

/*
#[test]
pub fn t1() -> Result<()> {
    // let src = fs::read_to_string("x.js")?;
    let src = fs::read_to_string("tests/fixture/simple/input.js")?;

    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ));
    let compiler = Compiler::new(cm.clone(), handler);
    let fm = compiler.cm.new_source_file(FileName::Anon, src);

    let swc_ast = compiler.parse_js(
        fm.clone(),
        Default::default(),
        Default::default(),
        false,
        true, // parse conmments
    )?;

    let ctx = Context {
        fm: fm,
        cm: cm,
        comments: Arc::new(compiler.comments().clone()),
    };
    let ast = swc_ast.babelify(&ctx);

    // let output = fs::read_to_string("x.json")?;
    let output = fs::read_to_string("tests/fixture/simple/output.json")?;
    let expected_ast: File = serde_json::from_str(&output)?;

    assert_eq!(expected_ast, ast);
    // println!("FROM SWC\n\n{:#?}\n\nFROM BABEL\n\n{:#?}", ast, expected_ast);

    Ok(())
}
*/
