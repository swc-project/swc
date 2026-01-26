use std::{
    env,
    fmt::Debug,
    mem::take,
    sync::{Arc, Mutex},
};

use miette::{GraphicalReportHandler, GraphicalTheme};
use once_cell::sync::Lazy;
use swc_common::{
    errors::{ColorConfig, Diagnostic, Emitter, Handler, HANDLER},
    sync::Lrc,
    SourceMap,
};

use crate::{diagnostic::ToPrettyDiagnostic, ErrorEmitter, TWithDiagnosticArray};

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

    pub fn as_array(
        mut self,
        cm: Lrc<SourceMap>,
        opts: HandlerOpts,
    ) -> TWithDiagnosticArray<anyhow::Error> {
        let diagnostics = self.take();

        TWithDiagnosticArray {
            inner: None,
            diagnostics,
            cm,
            report_opts: opts,
        }
    }

    pub fn as_array_with_anyhow(
        mut self,
        inner: anyhow::Error,
        cm: Lrc<SourceMap>,
        opts: HandlerOpts,
    ) -> TWithDiagnosticArray<anyhow::Error> {
        let diagnostics = self.take();

        TWithDiagnosticArray {
            inner: Some(inner),
            diagnostics,
            cm,
            report_opts: opts,
        }
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
        let diagnostics = self
            .0
            .lock()
            .expect("Failed to access the diagnostics lock");

        // If there are no diagnostics, return empty vector without initializing handler
        if diagnostics.is_empty() {
            return Vec::new();
        }

        let handler = to_pretty_handler(color);
        diagnostics
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

#[derive(Debug, Clone, Copy)]
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
                to_pretty_handler(ColorConfig::Always)
            } else {
                to_pretty_handler(ColorConfig::Never)
            }
        }
        ColorConfig::Always => GraphicalReportHandler::default(),
        ColorConfig::Never => GraphicalReportHandler::default().with_theme(GraphicalTheme::none()),
    }
    .with_context_lines(3)
    .with_wrap_lines(false)
    .with_break_words(false)
}

/// Try operation with a [Handler] and prints the errors as a [String] wrapped
/// by [Err].
pub fn try_with_handler<F, Ret>(
    cm: Lrc<SourceMap>,
    config: HandlerOpts,
    op: F,
) -> Result<Ret, TWithDiagnosticArray<anyhow::Error>>
where
    F: FnOnce(&Handler) -> Result<Ret, anyhow::Error>,
{
    try_with_handler_inner(cm, config, op)
}

fn try_with_handler_inner<F, Ret>(
    cm: Lrc<SourceMap>,
    config: HandlerOpts,
    op: F,
) -> Result<Ret, TWithDiagnosticArray<anyhow::Error>>
where
    F: FnOnce(&Handler) -> Result<Ret, anyhow::Error>,
{
    let diagnostics = ThreadSafetyDiagnostics::default();

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
                Err(diagnostics.as_array(cm.clone(), config))
            } else {
                Ok(ret)
            }
        }
        Err(err) => Err(diagnostics.as_array_with_anyhow(err, cm.clone(), config)),
    }
}
