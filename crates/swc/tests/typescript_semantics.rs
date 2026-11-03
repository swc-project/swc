//! Runtime checks for TypeScript `namespace` and `enum` lowering followed by
//! the minifier.
//!
//! Each fixture directory has a `.swcrc` that selects the TypeScript parser and
//! enables compression and mangling. The test compiles `exec.ts` with
//! [`Compiler`] and runs the output with Node.js. The fixtures use the `expect`
//! package for assertions.
//!
//! These tests live in `swc` instead of `swc_ecma_transforms_typescript`. If
//! `swc_ecma_transforms_typescript` has a dev-dependency on
//! `swc_ecma_minifier`, the dependency graph has a cycle through
//! `swc_ecma_transforms_optimization`, and crate publishing fails.

use std::{path::PathBuf, sync::Arc};

use anyhow::Context;
use swc::{config::Options, try_with_handler, Compiler, HandlerOpts};
use swc_common::{errors::ColorConfig, SourceMap, GLOBALS};
use swc_ecma_testing::{exec_node_js, JsExecOptions};

#[testing::fixture("tests/typescript-semantics/**/exec.ts")]
fn runtime_minified(input: PathBuf) {
    let _guard = testing::init();

    let cm = Arc::new(SourceMap::default());
    let c = Compiler::new(cm.clone());

    let code = GLOBALS
        .set(&Default::default(), || {
            try_with_handler(
                cm.clone(),
                HandlerOpts {
                    color: ColorConfig::Always,
                    skip_filename: true,
                },
                |handler| {
                    let fm = cm.load_file(&input).context("failed to load file")?;

                    c.process_js_file(
                        fm,
                        handler,
                        &Options {
                            swcrc: true,
                            ..Default::default()
                        },
                    )
                    .context("failed to process file")
                },
            )
        })
        .map_err(|err| err.to_pretty_error())
        .expect("failed to compile semantic execution fixture")
        .code;

    println!("---- Code ----\n{code}");

    // `node -e` resolves `require` from the working directory, so this finds
    // `expect` in the `node_modules` directory of the repository root.
    exec_node_js(
        &format!("const expect = require(\"expect\");\n{code}"),
        JsExecOptions {
            cache: true,
            ..Default::default()
        },
    )
    .expect("semantic execution fixture failed");
}
