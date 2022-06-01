#![deny(warnings)]

use std::panic::{catch_unwind, AssertUnwindSafe};

use anyhow::{anyhow, Error};
use napi::Env;
use swc::{config::ErrorFormat, try_with_handler};
use swc_common::{
    errors::Handler,
    sync::{Lrc, OnceCell},
    SourceMap,
};
use tracing::instrument;
use tracing_chrome::ChromeLayerBuilder;
use tracing_subscriber::{
    filter, prelude::__tracing_subscriber_SubscriberExt, util::SubscriberInitExt, Layer,
};

static TARGET_TRIPLE: &str = include_str!(concat!(env!("OUT_DIR"), "/triple.txt"));
static CUSTOM_TRACE_SUBSCRIBER: OnceCell<bool> = OnceCell::new();

#[napi]
pub fn get_target_triple() -> napi::Result<String> {
    Ok(TARGET_TRIPLE.to_string())
}

#[napi]
pub fn init_custom_trace_subscriber(
    mut env: Env,
    trace_out_file_path: Option<String>,
) -> napi::Result<()> {
    CUSTOM_TRACE_SUBSCRIBER.get_or_init(|| {
        let mut layer = ChromeLayerBuilder::new().include_args(true);
        if let Some(trace_out_file) = trace_out_file_path {
            layer = layer.file(trace_out_file);
        }

        let (chrome_layer, guard) = layer.build();
        tracing_subscriber::registry()
            .with(chrome_layer.with_filter(filter::filter_fn(|metadata| {
                !metadata.target().contains("cranelift") && !metadata.name().contains("log ")
            })))
            .try_init()
            .expect("Failed to register tracing subscriber");

        env.add_env_cleanup_hook(guard, |flush_guard| {
            flush_guard.flush();
            drop(flush_guard);
        })
        .expect("Should able to initialize cleanup for custom trace subscriber");

        true
    });

    Ok(())
}

#[instrument(level = "trace", skip_all)]
pub fn try_with<F, Ret>(
    cm: Lrc<SourceMap>,
    skip_filename: bool,
    _error_format: ErrorFormat,
    op: F,
) -> Result<Ret, Error>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    try_with_handler(
        cm,
        swc::HandlerOpts {
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
                Err(anyhow!("failed to handle: {}", s))
            } else if let Some(s) = p.downcast_ref::<&str>() {
                Err(anyhow!("failed to handle: {}", s))
            } else {
                Err(anyhow!("failed to handle with unknown panic message"))
            }
        },
    )
}
