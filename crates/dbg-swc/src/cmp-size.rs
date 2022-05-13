//! https://embed.cs.utah.edu/creduce/using/
//!
//! This binary is used to check if `input.js` is interesting,
//! i.e. if terser or esbuild generates smaller output for input.js,
//! it's interesting (in creduce terms) and this script returns 0

use std::sync::Arc;

use anyhow::Result;
use swc_common::{
    errors::{ColorConfig, HANDLER},
    Globals, SourceMap, GLOBALS,
};
use swc_error_reporters::handler::{try_with_handler, HandlerOpts};

use self::util::parse_js;

mod util;

fn main() -> Result<()> {
    let cm = Arc::new(SourceMap::default());

    try_with_handler(
        cm.clone(),
        HandlerOpts {
            color: ColorConfig::Always,
            skip_filename: false,
        },
        |handler| {
            GLOBALS.set(&Globals::default(), || {
                HANDLER.set(handler, || {
                    //

                    let fm = cm.load_file("input.js")?;

                    let m = parse_js(fm)?;
                })
            })
        },
    )
}
