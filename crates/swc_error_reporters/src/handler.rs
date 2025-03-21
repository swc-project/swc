use std::{collections, env, fmt, io::Write, mem::take, sync::Arc};

use anyhow::Error;
use miette::{GraphicalReportHandler, GraphicalTheme};
use once_cell::sync::Lazy;
use parking_lot::Mutex;
use swc_common::{
    errors::{ColorConfig, Diagnostic, Emitter, Handler, Message, Style, HANDLER},
    sync::Lrc,
    SourceMap,
};

use crate::{
    json_emitter::{JsonEmitter, JsonEmitterConfig},
    ErrorEmitter, PrettyEmitter, PrettyEmitterConfig,
};

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

#[derive(Default)]
/// Represents a collection of diagnostics.
pub struct DiagnosticCollection(Arc<Mutex<Vec<Diagnostic>>>);

impl DiagnosticCollection {
    /// Adds a new diagnostic to the collection.
    pub fn push(&self, d: Diagnostic) {
        self.0.lock().push(d);
    }

    /// Removes and returns all diagnostics from the collection.
    pub fn take(&self) -> Vec<Diagnostic> {
        take(&mut *self.0.lock())
    }

    /// Creates a clone of the diagnostics collection.
    pub fn clone(&self) -> Self {
        Self(Arc::clone(&self.0))
    }

    /// Checks if the diagnostics collection contains any errors.
    ///
    /// This method iterates over the diagnostics in the collection and returns
    /// `true` if any of them have a level of `Error`.
    pub fn contains_error(&self) -> bool {
        self.0
            .lock()
            .iter()
            .any(|d| d.level == swc_common::errors::Level::Error)
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

// fn to_miette_reporter(color: ColorConfig) -> GraphicalReportHandler {
//     match color {
//         ColorConfig::Auto => {
//             if cfg!(target_arch = "wasm32") {
//                 return
// to_miette_reporter(ColorConfig::Always).with_context_lines(3);             }

//             static ENABLE: Lazy<bool> =
//                 Lazy::new(|| !env::var("NO_COLOR").map(|s| s ==
// "1").unwrap_or(false));

            if *ENABLE {
                to_miette_reporter(ColorConfig::Always)
            } else {
                to_miette_reporter(ColorConfig::Never)
            }
        }
        ColorConfig::Always => GraphicalReportHandler::default(),
        ColorConfig::Never => GraphicalReportHandler::default().with_theme(GraphicalTheme::none()),
    }
    .with_context_lines(3)
}
//             if *ENABLE {
//                 to_miette_reporter(ColorConfig::Always)
//             } else {
//                 to_miette_reporter(ColorConfig::Never)
//             }
//         }
//         ColorConfig::Always => GraphicalReportHandler::default(),
//         ColorConfig::Never =>
// GraphicalReportHandler::default().with_theme(GraphicalTheme::none()),     }
//     .with_context_lines(3)
// }

/// Try operation with a [Handler] and prints the errors as a [String] wrapped
/// by [Err].
pub fn try_with_handler<F, Ret>(
    cm: Lrc<SourceMap>,
    config: HandlerOpts,
    op: F,
) -> Result<Ret, Vec<Diagnostic>>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    try_with_handler_inner(cm, config, op, false)
}

/// Try operation with a [Handler] and prints the errors as a [String] wrapped
/// by [Err].
pub fn try_with_json_handler<F, Ret>(
    cm: Lrc<SourceMap>,
    config: HandlerOpts,
    op: F,
) -> Result<Ret, Vec<Diagnostic>>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    try_with_handler_inner(cm, config, op, true)
}

fn try_with_handler_inner<F, Ret>(
    cm: Lrc<SourceMap>,
    config: HandlerOpts,
    op: F,
    json: bool,
) -> Result<Ret, Vec<Diagnostic>>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    let wr = Box::<LockedWriter>::default();
    let diagnostic_collection = DiagnosticCollection::default();
    config.color;

    let emitter: Box<dyn Emitter> = if json {
        Box::new(JsonEmitter::new(
            cm,
            wr.clone(),
            JsonEmitterConfig {
                skip_filename: config.skip_filename,
            },
        ))
    } else {
        Box::new(PrettyEmitter::new(
            cm,
            wr.clone(),
            to_miette_reporter(config.color),
            PrettyEmitterConfig {
                skip_filename: config.skip_filename,
            },
        ))
    };
    let emitter: Box<dyn Emitter> = Box::new(ErrorEmitter {
        diagnostics: diagnostic_collection.clone(),
    });
    // let emitter: Box<dyn Emitter> = if json {
    //     Box::new(JsonEmitter::new(
    //         cm,
    //         wr.clone(),
    //         JsonEmitterConfig {
    //             skip_filename: config.skip_filename,
    //         },
    //     ))
    // } else {
    //     Box::new(PrettyEmitter::new(
    //         cm,
    //         wr.clone(),
    //         to_miette_reporter(config.color),
    //         PrettyEmitterConfig {
    //             skip_filename: config.skip_filename,
    //         },
    //     ))
    // };
    // let e_wr = EmitterWriter::new(wr.clone(), Some(cm), false,
    // true).skip_filename(skip_filename);
    let handler = Handler::with_emitter(true, false, emitter);

    let ret = HANDLER.set(&handler, || op(&handler));

    match ret {
        Ok(ret) => {
            if diagnostic_collection.contains_error() {
                return Err(diagnostic_collection.take());
            }

            Ok(ret)
        }
        Err(err) => {
            diagnostic_collection.push(err.to_diagnostic());

            Err(diagnostic_collection.take())
        }
    }

    // if handler.has_errors() {
    //     let mut lock = wr.0.lock();
    //     let error = take(&mut *lock);

    //     let msg = String::from_utf8(error).expect("error string should be
    // utf8");

    //     match ret {
    //         Ok(_) => Err(anyhow::anyhow!(msg)),
    //         Err(err) => Err(err.context(msg)),
    //     }
    // } else {
    //     ret
    // }
}

trait ToDiagnostic {
    fn to_diagnostic(&self) -> Diagnostic;
}

impl ToDiagnostic for anyhow::Error {
    fn to_diagnostic(&self) -> Diagnostic {
        Diagnostic {
            message: vec![Message(self.to_string(), Style::NoStyle)],
            code: None,
            level: swc_common::errors::Level::Error,
            children: vec![],
            span: Default::default(),
            suggestions: vec![],
        }
    }
}
