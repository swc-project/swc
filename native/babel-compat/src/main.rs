use swc::Compiler;
use swc_common::{
    FilePathMapping, SourceMap, FileName,
    errors::{ColorConfig, Handler},
};
use swc_ecma_ast::{Program};
use std::sync::Arc;

fn main() {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ));
    let compiler = Compiler::new(cm.clone(), handler);

    const SRC: &str = r#"#!/usr/bin/env node

console.log("hello world");"#;

    let program = {
        let fm = compiler.cm.new_source_file(FileName::Anon, SRC.to_string());
        compiler.parse_js(
            fm,
            Default::default(),
            Default::default(),
            true,
            Default::default(),
        )
    }.unwrap();

    // println!("{:#?}", program);
    match program {
        Program::Module(module) => {
            let span = cm.span_take_while(module.span, |ch| {
                *ch != '\n'
            });
            let s = cm.span_to_snippet(span).unwrap();
            println!("{:?}", s);
        },
        _ => panic!("got script"),
    }
}

