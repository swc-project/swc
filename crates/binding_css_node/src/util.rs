use std::any::type_name;

use anyhow::{anyhow, Context, Error};
use napi::Status;
use serde::de::DeserializeOwned;
use swc_common::{errors::Handler, sync::Lrc, SourceMap};
use tracing_subscriber::EnvFilter;

pub fn try_with<F, Ret>(op: F) -> Result<Ret, Error>
where
    F: FnOnce(&Lrc<SourceMap>, &Handler) -> Result<Ret, Error>,
{
    try_with_handler(
        cm,
        swc::HandlerOpts {
            skip_filename,
            ..Default::default()
        },
        |handler| {
            //
            let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| op(handler)));

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
