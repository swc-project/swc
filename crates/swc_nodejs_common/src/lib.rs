#![deny(warnings)]

/// Explicit extern crate to use allocator.
extern crate swc_node_base;

use std::any::type_name;

use anyhow::Context;
use napi::Status;
use serde::de::DeserializeOwned;
use tracing_subscriber::EnvFilter;

/// Trying to initialize default subscriber if global dispatch is not set.
/// This can be called multiple time, however subsequent calls will be ignored
/// as tracing_subscriber only allows single global dispatch.
pub fn init_default_trace_subscriber() {
    let _unused = tracing_subscriber::FmtSubscriber::builder()
        .without_time()
        .with_target(false)
        .with_writer(std::io::stderr)
        .with_ansi(true)
        .with_env_filter(EnvFilter::from_env("SWC_LOG"))
        .pretty()
        .try_init();
}

pub trait MapErr<T>: Into<Result<T, anyhow::Error>> {
    fn convert_err(self) -> napi::Result<T> {
        self.into()
            .map_err(|err| napi::Error::new(Status::GenericFailure, format!("{:?}", err)))
    }
}

impl<T> MapErr<T> for Result<T, anyhow::Error> {}

pub fn get_deserialized<T, B>(buffer: B) -> napi::Result<T>
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

pub fn deserialize_json<T>(json: &str) -> Result<T, serde_json::Error>
where
    T: DeserializeOwned,
{
    let mut deserializer = serde_json::Deserializer::from_str(json);
    deserializer.disable_recursion_limit();

    T::deserialize(&mut deserializer)
}
