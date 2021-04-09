/*
mod ser_union;
use ser_union::SerializeUnion;

// use serde::{Serialize, Deserialize, Serializer};
// #[derive(Debug, Clone, Serialize, Deserialize)]
// struct A {}
// #[derive(Debug, Clone, Serialize, Deserialize)]
// struct B {}
// #[derive(SerializeUnion)]
// enum X {
//     A(A),
//     B(B),
// }
// fn main() {
// }


use serde::{Serialize, Deserialize, Serializer};
// use serde::{Serialize, Deserialize};
use serde_json::Result;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
struct ThingA {
    value: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
struct ThingB {
    value: usize,
}

// #[derive(Debug, Clone, Serialize, Deserialize)]
#[derive(Debug, Clone, SerializeUnion, Deserialize)]
// #[serde(untagged)]
#[serde(tag = "type")]
enum Thing {
    ThingA(ThingA),
    ThingB(ThingB),
}

// impl Serialize for Thing {
//     fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
//     where
//         S: Serializer,
//     {
//         match self {
//             Thing::ThingA(a) => serializer.serialize_some(&a),
//             Thing::ThingB(b) => serializer.serialize_some(&b),
//             // Thing::ThingA(a) => serializer.serialize_newtype_variant("", 0, "ThingA", &a),
//             // Thing::ThingB(b) => serializer.serialize_newtype_variant("", 1, "", &b),
//         }
//     }
// }

fn main() -> Result<()> {


    let a = ThingA { value: 0 };
    println!("{}", serde_json::to_string(&a)?);

    let json = r#"{"type": "ThingB", "value": 0}"#;
    let thing: Thing = serde_json::from_str(json)?;
    // println!("{:?}", thing);
    println!("{}", serde_json::to_string(&thing)?);

    // println!("{:-<80}", "");
    // let thing_b = ThingB { value: 10 };
    // println!("{}", serde_json::to_string(&thing_b)?);

    // let json = r#"
    // {
    //     "type": "ThingB",
    //     "value": 10
    // }
    // "#;
    // let thing: Thing = serde_json::from_str(json)?;
    // println!("{:?}", thing);
    // println!("{}", serde_json::to_string(&thing)?);

    Ok(())

}
*/

/*
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

// fn read_fixture_file(path: String) -> std::io::Result<String> {
//     fs::read_to_string("tests/fixture/".to_owned() + &path)
// }

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
*/

