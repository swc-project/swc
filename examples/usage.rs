use std::{path::Path, sync::Arc};
use swc::{self, config::Options};
use swc_common::{
    errors::{ColorConfig, Handler},
    SourceMap,
};

fn main() {
    let cm = Arc::<SourceMap>::default();
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Auto,
        true,
        false,
        Some(cm.clone()),
    ));
    let c = swc::Compiler::new(cm.clone(), handler.clone());

    let fm = cm
        .load_file(Path::new("foo.js"))
        .expect("failed to load file");

    c.process_js_file(
        fm,
        &Options {
            ..Default::default()
        },
    )
    .expect("failed to process file");
}
