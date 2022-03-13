use std::{path::Path, sync::Arc};

use anyhow::Context;
use swc::{self, config::Options, try_with_handler};
use swc_common::SourceMap;

fn main() {
    let cm = Arc::<SourceMap>::default();

    let c = swc::Compiler::new(cm.clone());

    let output = try_with_handler(cm.clone(), false, |handler| {
        let fm = cm
            .load_file(Path::new("examples/transform-input.js"))
            .expect("failed to load file");

        c.process_js_file(
            fm,
            handler,
            &Options {
                ..Default::default()
            },
        )
        .context("failed to process file")
    })
    .unwrap();

    println!("{}", output.code);
}
