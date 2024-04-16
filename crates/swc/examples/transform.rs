use std::{path::Path, sync::Arc};

use anyhow::Context;
use swc::try_with_handler;
use swc_common::{SourceMap, GLOBALS};

fn main() {
    let cm = Arc::<SourceMap>::default();

    let c = swc::Compiler::new(cm.clone());
    let output = GLOBALS
        .set(&Default::default(), || {
            try_with_handler(cm.clone(), Default::default(), |handler| {
                let fm = cm
                    .load_file(Path::new("examples/transform-input.js"))
                    .expect("failed to load file");

                c.process_js_file(fm, handler, &Default::default())
                    .context("failed to process file")
            })
        })
        .unwrap();

    println!("{}", output.code);
}
