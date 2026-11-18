#![deny(warnings)]

use std::panic::{catch_unwind, AssertUnwindSafe};

use anyhow::{anyhow, Error};
use napi::Env;
use swc_core::{
    base::{config::ErrorFormat, try_with_handler},
    common::{errors::Handler, sync::Lrc, SourceMap, GLOBALS},
};

static TARGET_TRIPLE: &str = include_str!(concat!(env!("OUT_DIR"), "/triple.txt"));

#[napi]
pub fn get_target_triple() -> napi::Result<String> {
    Ok(TARGET_TRIPLE.to_string())
}

#[napi]
pub fn init_custom_trace_subscriber(
    _env: Env,
    _trace_out_file_path: Option<String>,
) -> napi::Result<()> {
    Ok(())
}

#[cfg_attr(debug_assertions, tracing::instrument(level = "trace", skip_all))]
pub fn try_with<F, Ret>(
    cm: Lrc<SourceMap>,
    skip_filename: bool,
    _error_format: ErrorFormat,
    op: F,
) -> Result<Ret, Error>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    GLOBALS
        .set(&Default::default(), || {
            try_with_handler(
                cm,
                swc_core::base::HandlerOpts {
                    skip_filename,
                    ..Default::default()
                },
                |handler| {
                    //
                    let result = catch_unwind(AssertUnwindSafe(|| op(handler)));

                    let p = match result {
                        Ok(v) => return v,
                        Err(v) => v,
                    };

                    if let Some(s) = p.downcast_ref::<String>() {
                        Err(anyhow!("failed to handle: {s}"))
                    } else if let Some(s) = p.downcast_ref::<&str>() {
                        Err(anyhow!("failed to handle: {s}"))
                    } else {
                        Err(anyhow!("failed to handle with unknown panic message"))
                    }
                },
            )
        })
        .map_err(|e| e.to_pretty_error())
}

// This was originally under swc_nodejs_common, but this is not a public
// interface for the custom binary - they should choose own trace initialization
// instead. Will keep as hidden for now until there's proper usecase.

/// Deprecated no-op kept for compatibility with existing binding entrypoints.
pub fn init_default_trace_subscriber() {}
