use swc_common::{
    errors::{DiagnosticBuilder, Emitter},
    sync::Lrc,
    SourceMap,
};
use swc_error_reporters::GraphicalReportHandler;
use tracing::{info, metadata::LevelFilter, Level};

/// This emitter is controlled by the env var `RUST_LOG`.
///
/// This emitter will print to stderr if the logging level is higher than or
/// equal to `debug`
pub(crate) fn stderr_emitter(cm: Lrc<SourceMap>) -> Box<dyn Emitter> {
    if LevelFilter::current() > Level::INFO {
        info!("Diagnostics will be printed to stderr as logging level is trace or debug");

        let reporter = GraphicalReportHandler::default();

        let emitter = TestEmitter {
            cm: cm.clone(),
            reporter,
        };

        Box::new(emitter)
    } else {
        Box::new(NoopEmitter)
    }
}

struct TestEmitter {
    cm: Lrc<SourceMap>,
    reporter: GraphicalReportHandler,
}

impl Emitter for TestEmitter {
    fn emit(&mut self, db: &mut DiagnosticBuilder<'_>) {
        let d = db.take();
        let pretty_dignostic = d.to_pretty_diagnostic(&self.cm, false);

        eprint!("{}", pretty_dignostic.to_pretty_string(&self.reporter));
    }
}

struct NoopEmitter;

impl Emitter for NoopEmitter {
    fn emit(&mut self, _: &mut DiagnosticBuilder<'_>) {}
}
