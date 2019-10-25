extern crate swc;

use std::{path::Path, sync::Arc};
use swc::{
    common::{
        errors::{ColorConfig, Handler},
        SourceMap,
    },
    config::Options,
};

fn main() {
    let cm = Arc::<SourceMap>::default();
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));
    let c = swc::Compiler::new(cm.clone(), handler);

    let fm = cm
        .load_file(Path::new("foo.js"))
        .expect("failed to load file");

    c.process_js_file(
        fm,
        Options {
            ..Default::default()
        },
    );
}
