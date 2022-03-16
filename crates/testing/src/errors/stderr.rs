use std::fmt;

use swc_common::{
    errors::{DiagnosticBuilder, Emitter},
    sync::Lrc,
    SourceMap,
};
use swc_error_reporters::{GraphicalReportHandler, PrettyEmitter, PrettyEmitterConfig};
use tracing::{info, metadata::LevelFilter, Level};

/// This emitter is controlled by the env var `RUST_LOG`.
///
/// This emitter will print to stderr if the logging level is higher than or
/// equal to `debug`
pub(crate) fn stderr_emitter(cm: Lrc<SourceMap>) -> Box<dyn Emitter> {
    if LevelFilter::current() > Level::INFO {
        info!("Diagnostics will be printed to stderr as logging level is trace or debug");

        let reporter = GraphicalReportHandler::default();
        let emitter = PrettyEmitter::new(
            cm,
            Box::new(TestStderr),
            reporter,
            PrettyEmitterConfig {
                skip_filename: false,
            },
        );

        Box::new(emitter)
    } else {
        Box::new(NoopEmitter)
    }
}

struct TestStderr;

impl fmt::Write for TestStderr {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        eprint!("{}", s);

        Ok(())
    }
}

struct NoopEmitter;

impl Emitter for NoopEmitter {
    fn emit(&mut self, _: &DiagnosticBuilder<'_>) {}
}
