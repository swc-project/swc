use std::{
    any::type_name,
    panic::{catch_unwind, AssertUnwindSafe},
};

use anyhow::{anyhow, Context, Error};
use napi::{Env, Status};
use serde::de::DeserializeOwned;
use swc::try_with_handler;
use swc_common::{
    errors::Handler,
    sync::{Lrc, OnceCell},
    SourceMap,
};
use tracing::instrument;
use tracing_chrome::ChromeLayerBuilder;
use tracing_subscriber::{
    filter, prelude::__tracing_subscriber_SubscriberExt, util::SubscriberInitExt, EnvFilter, Layer,
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

/// Trying to initialize default subscriber if global dispatch is not set.
/// This can be called multiple time, however subsequent calls will be ignored
/// as tracing_subscriber only allows single global dispatch.
pub fn init_default_trace_subscriber() {
    let _unused = tracing_subscriber::FmtSubscriber::builder()
        .without_time()
        .with_target(false)
        .with_ansi(true)
        .with_env_filter(EnvFilter::from_env("SWC_LOG"))
        .with_env_filter(EnvFilter::from_default_env().add_directive(tracing::Level::ERROR.into()))
        .try_init();
}

#[instrument(level = "trace", skip_all)]
pub fn try_with<F, Ret>(cm: Lrc<SourceMap>, skip_filename: bool, op: F) -> Result<Ret, Error>
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

pub trait MapErr<T>: Into<Result<T, anyhow::Error>> {
    fn convert_err(self) -> napi::Result<T> {
        self.into()
            .map_err(|err| napi::Error::new(Status::GenericFailure, format!("{:?}", err)))
    }
}

impl<T> MapErr<T> for Result<T, anyhow::Error> {}

pub(crate) fn get_deserialized<T, B>(buffer: B) -> napi::Result<T>
where
    T: DeserializeOwned,
    B: AsRef<[u8]>,
{
    let mut deserializer = serde_json::Deserializer::from_slice(buffer.as_ref());
    deserializer.disable_recursion_limit();

    let v = T::deserialize(&mut deserializer)
        .with_context(|| {
            format!(
                "Failed to deserialize buffer as {}\nJSON: {}",
                type_name::<T>(),
                String::from_utf8_lossy(buffer.as_ref())
            )
        })
        .convert_err()?;

    Ok(v)
}

pub(crate) fn deserialize_json<T>(json: &str) -> Result<T, serde_json::Error>
where
    T: DeserializeOwned,
{
    let mut deserializer = serde_json::Deserializer::from_str(json);
    deserializer.disable_recursion_limit();

    T::deserialize(&mut deserializer)
}
