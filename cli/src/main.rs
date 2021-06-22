use std::{env::args, os, path::Path, sync::Arc};
use swc::Compiler;
use swc_common::{
    errors::{ColorConfig, Handler},
    SourceMap,
};

fn main() {
    let cm = Arc::new(SourceMap::default());
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ));
    let compiler = Compiler::new(cm.clone(), handler);

    let path = args().nth(1).unwrap();
    let fm = cm.load_file(Path::new(&path)).expect("failed to load file");
    let output = compiler
        .process_js_file(fm, &Default::default())
        .expect("failed to process");

    println!("{}", output.code);
}
