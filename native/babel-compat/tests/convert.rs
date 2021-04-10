#![feature(test)]
extern crate test;

use swc_babel_compat::ast::module::File;
use swc_babel_compat::convert::{Context, Babelify};
use swc::Compiler;
use swc_common::{
    // FilePathMapping, SourceMap, FileName, SourceFile,
    FilePathMapping, SourceMap, FileName,
    errors::{ColorConfig, Handler},
};
use anyhow::{Context as AnyhowContext, Error};
use pretty_assertions::{assert_eq};
use walkdir::WalkDir;
use test::{test_main, TestDesc, TestDescAndFn, DynTestFn, ShouldPanic, TestName, TestType};
use std::{sync::Arc, fs, env, path::{PathBuf, Path}};

#[test]
fn fixtures() {
    let args: Vec<_> = env::args().collect();
    let mut tests: Vec<TestDescAndFn> = Vec::new();
    add_fixture_tests(&mut tests).unwrap();
    test_main(&args, tests, Some(test::Options::new()));
}

fn add_fixture_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), Error> {
    let cargo_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR")?).join("tests").join("fixtures");
    for entry in WalkDir::new(&cargo_dir) {
        let entry = entry
            .with_context(|| "Failed to walk dir")?;
        if !entry.file_type().is_dir() {
            continue;
        }
        let input_file: PathBuf = entry.path().join("input.js");
        if !input_file.is_file() {
            continue;
        }
        let output_file: PathBuf = entry.path().join("output.json");
        if !output_file.is_file() {
            continue;
        }

        let input = fs::read_to_string(&input_file)
            .with_context(|| format!("Failed to open file: {}", &input_file.to_string_lossy()))?;
        let output = fs::read_to_string(&output_file)
            .with_context(|| format!("Failed to open file: {}", &output_file.to_string_lossy()))?;

        add_test(
            tests,
            format!("babel_compat::convert::{}", get_test_name(entry.path(), &cargo_dir)?),
            false,
            move || {
                run_test(input, output);
            },
        );
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
            test_type: TestType::UnitTest,
            name: TestName::DynTestName(name),
            ignore,
            should_panic: ShouldPanic::No,
            allow_fail: false,
        },
        testfn: DynTestFn(Box::new(f)),
    });
}

fn run_test(src: String, expected: String) {
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
    ).unwrap();

    let ctx = Context {
        fm: fm,
        cm: cm,
        comments: Arc::new(compiler.comments().clone()),
    };
    let ast = swc_ast.babelify(&ctx);

    let expected_ast: File = serde_json::from_str(&expected).unwrap();

    assert_eq!(expected_ast, ast);
}

fn get_test_name(path: &Path, cargo_dir: &Path) -> Result<String, Error> {
    let s: String = path.strip_prefix(cargo_dir)?.to_string_lossy().into();
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


