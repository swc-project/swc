use std::{path::Path, sync::Arc};

use anyhow::Context;
use swc::{self, config::JsMinifyOptions, try_with_handler, BoolOrDataConfig, HandlerOpts};
use swc_common::SourceMap;

fn main() {
    let cm = Arc::<SourceMap>::default();

    let c = swc::Compiler::new(cm.clone());

    let output = try_with_handler(
        cm.clone(),
        HandlerOpts {
            ..Default::default()
        },
        |handler| {
            let fm = cm
                .load_file(Path::new("examples/minify-input.js"))
                .expect("failed to load file");

            c.minify(
                fm,
                handler,
                &JsMinifyOptions {
                    compress: BoolOrDataConfig::from_bool(true),
                    mangle: BoolOrDataConfig::from_bool(true),
                    format: Default::default(),
                    ecma: Default::default(),
                    keep_classnames: Default::default(),
                    keep_fnames: Default::default(),
                    module: Default::default(),
                    safari10: Default::default(),
                    toplevel: Default::default(),
                    source_map: Default::default(),
                    output_path: Default::default(),
                    inline_sources_content: Default::default(),
                    emit_source_map_columns: Default::default(),
                },
            )
            .context("failed to minify")
        },
    )
    .unwrap();

    println!("{}", output.code);
}
