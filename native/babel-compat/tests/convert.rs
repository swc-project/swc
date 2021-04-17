#![feature(test)]
extern crate test;

use anyhow::{Context as AnyhowContext, Error};
use pretty_assertions::assert_eq;
use std::{
    env, fs,
    path::{Path, PathBuf},
    sync::Arc,
};
use swc::Compiler;
use swc_babel_ast::File;
use swc_babel_compat::{Babelify, Context};
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName,
    // FilePathMapping, SourceMap, FileName, SourceFile,
    FilePathMapping,
    SourceMap,
};
use swc_ecma_parser::Syntax;
use test::{test_main, DynTestFn, ShouldPanic, TestDesc, TestDescAndFn, TestName, TestType};
use walkdir::WalkDir;

#[test]
fn fixtures() -> Result<(), Error> {
    let mut tests = vec![];

    let fixtures_path = PathBuf::from(env::var("CARGO_MANIFEST_DIR")?)
        .join("tests")
        .join("fixtures");
    for entry in WalkDir::new(&fixtures_path).into_iter() {
        let entry = entry.with_context(|| "Failed to walk dir")?;
        if !entry.file_type().is_dir() {
            continue;
        }

        let js_path: PathBuf = entry.path().join("input.js");
        let ts_path: PathBuf = entry.path().join("input.ts");
        let output_path: PathBuf = entry.path().join("output.json");

        let is_typescript = ts_path.is_file();

        if (!js_path.is_file() && !ts_path.is_file()) || !output_path.is_file() {
            continue;
        }

        let input = fs::read_to_string(if is_typescript { &ts_path } else { &js_path })
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
            },
            testfn: DynTestFn(Box::new(move || {
                let syntax = if is_typescript {
                    Syntax::Typescript(Default::default())
                } else {
                    Syntax::default()
                };
                run_test(input, output, syntax);
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
//
//     let input = fs::read_to_string(&input_file)
//         .with_context(|| format!("Failed to open file: {}", &input_file))?;
//     let output = fs::read_to_string(&output_file)
//         .with_context(|| format!("Failed to open file: {}", &output_file))?;
//     run_test(input, output, Syntax::Typescript(Default::default()));
//
//     Ok(())
// }

fn run_test(src: String, expected: String, syntax: Syntax) {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ));
    let compiler = Compiler::new(cm.clone(), handler);
    let fm = compiler.cm.new_source_file(FileName::Anon, src);

    let swc_ast = compiler
        .parse_js(
            fm.clone(),
            Default::default(),
            syntax,
            false,
            true, // parse conmments
        )
        .unwrap();

    let ctx = Context {
        fm,
        cm,
        comments: Arc::new(compiler.comments().clone()),
    };
    let ast = swc_ast.babelify(&ctx);

    let expected_ast: File = serde_json::from_str(&expected).unwrap();

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
