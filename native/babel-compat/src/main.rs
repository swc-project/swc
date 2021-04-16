
#![feature(type_name_of_val)]

mod ast;
mod convert;
mod ser_union;
mod defaults;
mod visit;

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


// ----------------------------------------------------------------------------
// Visitor
use visit::{Visit, Node, VisitWith};
use ast::common::Identifier;

struct IdCollector {
    ids: Vec<Identifier>,
}

impl Visit for IdCollector {
    fn visit_identifier(&mut self, id: &Identifier, _parent: &dyn Node) {
        self.ids.push(id.clone());
    }
}
// ----------------------------------------------------------------------------

fn main() {
    let src = fs::read_to_string("tests/fixtures/simple/input.js").unwrap();
    let (cm, compiler, fm) = init(src);

    let program = compile(&compiler, fm.clone()).unwrap();

    // println!("{:#?}", program);

    // println!("{}", serde_json::to_string_pretty(&program).unwrap());

    let ctx = Context {
        fm: fm,
        cm: cm,
        comments: Arc::new(compiler.comments().clone()),
    };
    let ast = program.babelify(&ctx);
    println!("{:#?}", ast);

    let mut idcoll = IdCollector { ids: vec![] };
    idcoll.visit_with(&mut ast);
    println!("{:#?}", idcoll.ids);

    // let json = serde_json::to_string_pretty(&ast).unwrap();
    // println!("{}", json);

    // let output = read_fixture_file("simple/output.json".to_owned()).unwrap();
    // let expected: File = serde_json::from_str(&output).unwrap();
    // println!("{:#?}", expected);
}

fn init(src: String) -> (Arc<SourceMap>, Compiler, Arc<SourceFile>) {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ));
    let compiler = Compiler::new(cm.clone(), handler);
    let fm = compiler.cm.new_source_file(FileName::Anon, src);

    (cm, compiler, fm)
}

fn compile(compiler: &Compiler, fm: Arc<SourceFile>) -> Result<Program> {
    compiler.parse_js(
        fm,
        Default::default(),
        Default::default(),
        false,
        Default::default(),
    )
}


// fn main() {}
