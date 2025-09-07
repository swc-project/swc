use std::{path::Path, sync::Arc};

use anyhow::Context;
use swc::{config::JsMinifyOptions, try_with_handler, BoolOrDataConfig, JsMinifyExtras};
use swc_common::{SourceMap, GLOBALS};
use swc_ecma_minifier::option::SimpleMangleCache;

fn main() {
    let cm = Arc::<SourceMap>::default();

    let c = swc::Compiler::new(cm.clone());
    let output = GLOBALS
        .set(&Default::default(), || {
            try_with_handler(cm.clone(), Default::default(), |handler| {
                let fm = cm
                    .load_file(Path::new("examples/transform-input.js"))
                    .expect("failed to load file");

                c.minify(
                    fm,
                    handler,
                    &JsMinifyOptions {
                        compress: BoolOrDataConfig::from_bool(true),
                        mangle: BoolOrDataConfig::from_bool(true),
                        ..Default::default()
                    },
                    // Mangle name cache example. You may not need this.
                    JsMinifyExtras::default()
                        .with_mangle_name_cache(Some(Arc::new(SimpleMangleCache::default()))),
                )
                .context("failed to minify")
            })
        })
        .unwrap();

    println!("{}", output.code);
}
