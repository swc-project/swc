use std::sync::Arc;

use anyhow::Context;
use swc::try_with_handler;
use swc_common::{errors::ColorConfig, FileName, SourceMap, GLOBALS};

fn main() {
    let cm = Arc::<SourceMap>::default();

    let c = swc::Compiler::new(cm.clone());
    let output = GLOBALS
        .set(&Default::default(), || {
            try_with_handler(
                cm.clone(),
                swc::HandlerOpts {
                    // Auto is default, but for it's an example.
                    // You can use the env var named `NO_COLOR` to control this.
                    color: ColorConfig::Auto,
                    skip_filename: false,
                },
                |handler| {
                    let fm = cm.new_source_file(
                        FileName::Custom("foo.js".into()).into(),
                        "this ?= foo".into(),
                    );

                    c.process_js_file(fm, handler, &Default::default())
                        .context("failed to process file")
                },
            )
        })
        .expect("anyhow will give you good error message");

    println!("{}", output.code);
}
