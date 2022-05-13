//! https://embed.cs.utah.edu/creduce/using/
//!
//! This binary is used to check if `input.js` is interesting,
//! i.e. if terser or esbuild generates smaller output for input.js,
//! it's interesting (in creduce terms) and this script returns 0
#![feature(box_syntax)]

use std::sync::Arc;

use anyhow::{bail, Result};
use swc_common::{
    errors::{ColorConfig, HANDLER},
    Globals, SourceMap, GLOBALS,
};
use swc_ecma_minifier::option::MinifyOptions;
use swc_error_reporters::handler::{try_with_handler, HandlerOpts};

use self::util::{parse_js, print_js};

#[allow(unused)]
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

                    let fm = cm.load_file("input.js".as_ref())?;

                    let m = parse_js(fm)?;

                    let minified_mangled = {
                        swc_ecma_minifier::optimize(
                            m.module,
                            cm.clone(),
                            None,
                            None,
                            &MinifyOptions {
                                compress: Some(Default::default()),
                                mangle: Some(Default::default()),
                                ..Default::default()
                            },
                            &swc_ecma_minifier::option::ExtraOptions {
                                unresolved_mark: m.unresolved_mark,
                                top_level_mark: m.top_level_mark,
                            },
                        )
                    };
                    let swc_output = print_js(cm.clone(), &minified_mangled, true)?;

                    let esbuild_output =
                        self::util::minifier::get_esbuild_output("input.js".as_ref(), true)?;

                    if swc_output.len() > esbuild_output.len() {
                        return Ok(());
                    }

                    bail!("We don't care about this file")
                })
            })
        },
    )
}
