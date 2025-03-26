use std::{
    env,
    mem::take,
    sync::{Arc, Mutex},
};

use anyhow::Error;
use miette::{GraphicalReportHandler, GraphicalTheme};
use once_cell::sync::Lazy;
use swc_common::{
    errors::{ColorConfig, Diagnostic, Emitter, Handler, Message, Style, HANDLER},
    sync::Lrc,
    SourceMap,
};

use crate::ErrorEmitter;

#[derive(Default, Clone)]
/// A thread-safe container for managing a collection of diagnostics.
pub struct ThreadSafetyDiagnostics(Arc<Mutex<Vec<Diagnostic>>>);

impl ThreadSafetyDiagnostics {
    /// Adds a new diagnostic to the collection.
    pub fn push(&mut self, d: Diagnostic) {
        self.0
            .lock()
            .expect("Failed to access the diagnostics lock")
            .push(d);
    }

    /// Removes and returns all diagnostics from the collection.
    pub fn take(&mut self) -> Vec<Diagnostic> {
        take(
            &mut *self
                .0
                .lock()
                .expect("Failed to access the diagnostics lock"),
        )
    }

    /// Returns a vector of diagnostics in the collection.
    ///
    /// # Panics
    /// This method locks the mutex to ensure thread safety and returns a vector
    /// of diagnostics. If the lock cannot be acquired, it will panic with the
    /// message "Failed to access the diagnostics lock".
    ///
    /// # Arguments
    ///
    /// * `cm` - The source map.
    /// * `skip_filename` - Whether to skip the filename in the output.
    /// * `color` - The color configuration for the output.
    pub fn to_pretty_string(
        &self,
        cm: &SourceMap,
        skip_filename: bool,
        color: ColorConfig,
    ) -> Vec<String> {
        let handler = to_pretty_handler(color);
        self.0
            .lock()
            .expect("Failed to access the diagnostics lock")
            .iter()
            .map(|d| d.to_pretty_string(cm, skip_filename, &handler))
            .collect::<Vec<String>>()
    }

    /// Determines if the diagnostics collection includes any errors.
    ///
    /// Iterates through the diagnostics to find any with a level of `Error`,
    /// returning `true` if found.
    pub fn contains_error(&self) -> bool {
        self.0
            .lock()
            .expect("Failed to access the diagnostics lock")
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

pub fn to_pretty_handler(color: ColorConfig) -> GraphicalReportHandler {
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

fn to_pretty_error(diagnostics: &[Diagnostic], cm: &SourceMap, config: &HandlerOpts) -> Error {
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
    try_with_handler_inner(cm.clone(), config.clone(), op)
        .map_err(|d| to_pretty_error(&d, &cm, &config))
}

pub fn try_with_handler_diagnostic<F, Ret>(
    cm: Lrc<SourceMap>,
    config: HandlerOpts,
    op: F,
) -> Result<Ret, Vec<Diagnostic>>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    try_with_handler_inner(cm, config, op)
}

// Try operation with a [Handler] and prints the errors as a [String] wrapped
// by [Err].
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

fn try_with_handler_inner<F, Ret>(
    cm: Lrc<SourceMap>,
    config: HandlerOpts,
    op: F,
) -> Result<Ret, Vec<Diagnostic>>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    let mut diagnostics = ThreadSafetyDiagnostics::default();

    let emitter: Box<dyn Emitter> = Box::new(ErrorEmitter {
        diagnostics: diagnostics.clone(),
        cm: cm.clone(),
        opts: config,
    });

    let handler = Handler::with_emitter(true, false, emitter);

    let ret = HANDLER.set(&handler, || op(&handler));

    match ret {
        Ok(ret) => {
            if diagnostics.contains_error() {
                return Err(diagnostics.take());
            }

            Ok(ret)
        }
        Err(err) => {
            diagnostics.push(err.to_diagnostic());

            Err(diagnostics.take())
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
