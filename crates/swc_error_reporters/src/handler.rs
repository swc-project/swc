use std::{env, fmt, io::Write, mem::take, sync::Arc};

use anyhow::Error;
use miette::{GraphicalReportHandler, GraphicalTheme};
use once_cell::sync::Lazy;
use parking_lot::Mutex;
use swc_common::{
    errors::{ColorConfig, Handler, HANDLER},
    sync::Lrc,
    SourceMap,
};

use crate::{PrettyEmitter, PrettyEmitterConfig};

#[derive(Clone, Default)]
struct LockedWriter(Arc<Mutex<Vec<u8>>>);

impl Write for LockedWriter {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        let mut lock = self.0.lock();

        lock.extend_from_slice(buf);

        Ok(buf.len())
    }

    fn flush(&mut self) -> std::io::Result<()> {
        Ok(())
    }
}

impl fmt::Write for LockedWriter {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.write(s.as_bytes()).map_err(|_| fmt::Error)?;

        Ok(())
    }
}

#[derive(Debug, Clone)]
pub struct HandlerOpts {
    /// [ColorConfig::Auto] is the default, and it will print colors unless the
    /// environment variable `NO_COLOR` is not 1.
    pub color: ColorConfig,

    /// Defaults to `false`.
    pub skip_filename: bool,
}

impl Default for HandlerOpts {
    fn default() -> Self {
        Self {
            color: ColorConfig::Auto,
            skip_filename: false,
        }
    }
}

fn to_miette_reporter(color: ColorConfig) -> GraphicalReportHandler {
    match color {
        ColorConfig::Auto => {
            if cfg!(target_arch = "wasm32") {
                return to_miette_reporter(ColorConfig::Always);
            }

            static ENABLE: Lazy<bool> =
                Lazy::new(|| !env::var("NO_COLOR").map(|s| s == "1").unwrap_or(false));

            if *ENABLE {
                to_miette_reporter(ColorConfig::Always)
            } else {
                to_miette_reporter(ColorConfig::Never)
            }
        }
        ColorConfig::Always => GraphicalReportHandler::default(),
        ColorConfig::Never => GraphicalReportHandler::default().with_theme(GraphicalTheme::none()),
    }
}

/// Try operation with a [Handler] and prints the errors as a [String] wrapped
/// by [Err].
pub fn try_with_handler<F, Ret>(
    cm: Lrc<SourceMap>,
    config: HandlerOpts,
    op: F,
) -> Result<Ret, Error>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    let wr = Box::new(LockedWriter::default());

    let emitter = PrettyEmitter::new(
        cm,
        wr.clone(),
        to_miette_reporter(config.color),
        PrettyEmitterConfig {
            skip_filename: config.skip_filename,
        },
    );
    // let e_wr = EmitterWriter::new(wr.clone(), Some(cm), false,
    // true).skip_filename(skip_filename);
    let handler = Handler::with_emitter(true, false, Box::new(emitter));

    let ret = HANDLER.set(&handler, || op(&handler));

    if handler.has_errors() {
        let mut lock = wr.0.lock();
        let error = take(&mut *lock);

        let msg = String::from_utf8(error).expect("error string should be utf8");

        match ret {
            Ok(_) => Err(anyhow::anyhow!(msg)),
            Err(err) => Err(err.context(msg)),
        }
    } else {
        ret
    }
}
