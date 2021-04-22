#![feature(type_name_of_val)]

use swc_common::{ast_node, Span, Spanned};
use serde::{Serialize, Deserialize};

// #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
// #[ast_node]
// #[serde(tag = "type")]
struct A {
    value: usize,
}

fn main() {}

/*
// #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[ast_node]
// #[serde(tag = "type")]
struct B {
    value: usize,
}

// #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
// #[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
#[ast_node]
// #[serde(tag = "type")]
enum AB {
    #[tag("A")]
    A(A),
    #[tag("B")]
    B(B),
}

// pub use swc_babel_compat_macros::SerializeUnion;
// pub trait SerializeUnion {}

// #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[ast_node]
// #[serde(tag = "type")]
struct C {
    value: usize,
}

// #[derive(Debug, Clone, SerializeUnion, Deserialize, PartialEq)]
// #[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[ast_node]
// #[serde(tag = "type")]
// #[serde(untagged)]
enum ABC {
    #[tag("C")]
    C(C),
    #[tag("A")]
    #[tag("B")]
    AB(AB),
}

fn main() {
    let json = r#"{"type": "A", "value": 1}"#;
    // let a: A = serde_json::from_str(&json).unwrap();
    // println!("{:#?}", a);

    // let a: AB = serde_json::from_str(&json).unwrap();
    // println!("{:?}", a);

    let a: ABC = serde_json::from_str(&json).unwrap();
    println!("{:#?}", a);

    // println!("{}", serde_json::to_string_pretty(&a).unwrap());
}
*/

/*
use swc_babel_compat::{Context, Babelify};
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
use swc_babel_visit::{Visit, VisitMut, Node, VisitWith, VisitMutWith};
use swc_babel_ast::Identifier;

struct IdCollector {
    ids: Vec<Identifier>,
}

impl Visit for IdCollector {
    fn visit_identifier(&mut self, id: &Identifier, _parent: &dyn Node) {
        self.ids.push(id.clone());
    }
}

struct IdChanger;

impl VisitMut for IdChanger {
    fn visit_mut_identifier(&mut self, id: &mut Identifier) {
        id.name += "_gecko";
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
    let mut ast = program.babelify(&ctx);
    // println!("{:#?}", ast);

    // let mut idcoll = IdCollector { ids: vec![] };
    // ast.visit_with(&swc_ecma_ast::Invalid { span: swc_common::DUMMY_SP }, &mut idcoll);
    // println!("{:#?}", idcoll.ids);

    // let mut idchanger = IdChanger {};
    // ast.visit_mut_with(&mut idchanger);
    // println!("{:#?}", ast);

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
*/


// fn main() {}
