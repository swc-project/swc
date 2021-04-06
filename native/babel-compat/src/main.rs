// fn main() {
// }

mod ast;
mod convert;

use convert::{Context, Babelify};
use ast::module::File;
use swc::Compiler;
use swc_common::{
    FilePathMapping, SourceMap, FileName, SourceFile,
    errors::{ColorConfig, Handler},
};
use swc_ecma_ast::{Program, Module};
use anyhow::{anyhow, Result};
use serde_json::{json, Value};
use std::sync::Arc;
use std::fs;

fn main() {
    // let src = read_fixture_file("simple/input.js".to_owned()).unwrap();
    let src = fs::read_to_string("x.js").unwrap();

    let cm = get_source_map();
    let handler = get_handler(&cm);
    let compiler = Compiler::new(cm.clone(), handler);
    let fm = compiler.cm.new_source_file(FileName::Anon, src);
    // let comments = Arc::new(compiler.comments().clone());

    let program = compile(&compiler, fm.clone()).unwrap();

    // println!("{:#?}", program);

    let ctx = Context {
        fm: fm,
        cm: cm,
        comments: Arc::new(compiler.comments().clone()),
    };
    let babel = program.babelify(&ctx);
    // println!("{:#?}", babel);

    let json = serde_json::to_string_pretty(&babel).unwrap();
    println!("{}", json);

    // let output = read_fixture_file("simple/output.json".to_owned()).unwrap();
    // let expected: File = serde_json::from_str(&output).unwrap();
    // println!("{:#?}", expected);
}

fn read_fixture_file(path: String) -> std::io::Result<String> {
    fs::read_to_string("tests/fixture/".to_owned() + &path)
}

fn get_source_map() -> Arc<SourceMap> {
    Arc::new(SourceMap::new(FilePathMapping::empty()))
}

fn get_handler(cm: &Arc<SourceMap>) -> Arc<Handler> {
    Arc::new(Handler::with_tty_emitter(
        ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ))
}

fn compile(compiler: &Compiler, fm: Arc<SourceFile>) -> Result<Program> {
    compiler.parse_js(
        fm,
        Default::default(),
        Default::default(),
        false,
        Default::default(),
    )
    // match program {
    //     Program::Module(module) => Ok(module),
    //     _ => Err(anyhow!("Unexpected program: {:?}", program)),
    // }
}

