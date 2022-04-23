use anyhow::{anyhow, Error};
use napi::Status;
use swc_common::{errors::Handler, sync::Lrc, SourceMap};
use tracing_subscriber::EnvFilter;

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

pub trait MapErr<T>: Into<Result<T, anyhow::Error>> {
    fn convert_err(self) -> napi::Result<T> {
        self.into()
            .map_err(|err| napi::Error::new(Status::GenericFailure, format!("{:?}", err)))
    }
}

impl<T> MapErr<T> for Result<T, anyhow::Error> {}
