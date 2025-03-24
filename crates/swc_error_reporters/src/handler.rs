use std::{env, mem::take, sync::Arc};

use anyhow::Error;
use miette::{GraphicalReportHandler, GraphicalTheme};
use once_cell::sync::Lazy;
use parking_lot::Mutex;
use swc_common::{
    errors::{ColorConfig, Diagnostic, Emitter, Handler, Message, Style, HANDLER},
    sync::Lrc,
    SourceMap,
};

use crate::ErrorEmitter;

#[derive(Default)]
/// Represents a collection of diagnostics.
pub struct DiagnosticWriter(Arc<Mutex<Vec<Diagnostic>>>);

impl DiagnosticWriter {
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

fn to_pretty_handler(color: ColorConfig) -> GraphicalReportHandler {
    match color {
        ColorConfig::Auto => {
            if cfg!(target_arch = "wasm32") {
                return to_pretty_handler(ColorConfig::Always).with_context_lines(3);
            }

            static ENABLE: Lazy<bool> =
                Lazy::new(|| !env::var("NO_COLOR").map(|s| s == "1").unwrap_or(false));

            if *ENABLE {
                to_miette_reporter(ColorConfig::Always)
            } else {
                to_miette_reporter(ColorConfig::Never)
                to_pretty_handler(ColorConfig::Always)
            } else {
                to_pretty_handler(ColorConfig::Never)
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
}

fn to_pretty_error(diagnostics: &Vec<Diagnostic>, cm: &SourceMap, config: &HandlerOpts) -> Error {
    let handler = to_pretty_handler(config.color);
    let error_msg = diagnostics
        .iter()
        .map(|d| d.to_pretty_diagnostic(cm, config.skip_filename))
        .map(|d| d.to_pretty_string(&handler))
        .collect::<String>();
    anyhow::anyhow!(error_msg)
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
    try_with_handler_inner(op).map_err(|d| to_pretty_error(&d, &cm, &config))
}

pub fn try_with_handler_diagnostic<F, Ret>(op: F) -> Result<Ret, Vec<Diagnostic>>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    try_with_handler_inner(op)
}

/// Try operation with a [Handler] and prints the errors as a [String] wrapped
/// by [Err].
// pub fn try_with_json_handler<F, Ret>(
//     cm: Lrc<SourceMap>,
//     config: HandlerOpts,
//     op: F,
// ) -> Result<Ret, Vec<Diagnostic>>
// where
//     F: FnOnce(&Handler) -> Result<Ret, Error>,
// {
//     try_with_handler_inner(op)
// }

fn try_with_handler_inner<F, Ret>(op: F) -> Result<Ret, Vec<Diagnostic>>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    let writer = DiagnosticWriter::default();

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
        diagnostics: writer.clone(),
    });

    let handler = Handler::with_emitter(true, false, emitter);

    let ret = HANDLER.set(&handler, || op(&handler));

    match ret {
        Ok(ret) => {
            if writer.contains_error() {
                return Err(writer.take());
            }

            Ok(ret)
        }
        Err(err) => {
            writer.push(err.to_diagnostic());

            Err(writer.take())
        }
    }
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
