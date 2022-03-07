//! Usage: cargo run --example transform_react_app
//!
//! This program will emit output to stdout.

use std::{path::Path, sync::Arc};

use swc::config::{IsModule, Options};
use swc_common::{
    comments::SingleThreadedComments,
    errors::{ColorConfig, Handler},
    Globals, Mark, SourceMap, GLOBALS,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_react::{react, Options as ReactOptions};

fn main() {
    let cm = Arc::<SourceMap>::default();

    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Auto,
        true,
        false,
        Some(cm.clone()),
    ));

    let compiler = swc::Compiler::new(cm.clone());

    let fm = cm
        .load_file(Path::new(
            "crates/swc_ecma_transforms_react/examples/app.jsx",
        ))
        .expect("Failed to load the js file");

    let parse_result = compiler.parse_js(
        fm,
        &handler,
        EsVersion::Es2015,
        Syntax::Es(EsConfig {
            jsx: true,
            ..Default::default()
        }),
        IsModule::Bool(true),
        None,
    );

    let parsed = parse_result.expect("Failed to parse the js module");

    let comments = SingleThreadedComments::default();
    let globals = Globals::default();

    GLOBALS.set(&globals, || {
        let top_level_mark = Mark::fresh(Mark::root());

        // applies the react transformer
        let program = compiler.transform(
            &handler,
            parsed,
            false,
            react(
                cm.clone(),
                Some(&comments),
                ReactOptions {
                    ..Default::default()
                },
                top_level_mark,
            ),
        );

        // generates the final JS code
        let output = compiler
            .process_js(
                &handler,
                program,
                &Options {
                    is_module: IsModule::Bool(true),
                    ..Default::default()
                },
            )
            .expect("failed to process file");

        print!("{}", output.code);
    });
}
