use handler::{HandlerOpts, ThreadSafetyDiagnostics};
pub use miette::{GraphicalReportHandler, GraphicalTheme};
use swc_common::{
    errors::{DiagnosticBuilder, Emitter},
    sync::Lrc,
};

pub mod handler;

pub struct ErrorEmitter {
    pub diagnostics: ThreadSafetyDiagnostics,
    pub cm: Lrc<swc_common::SourceMap>,
    pub opts: HandlerOpts,
}

impl Emitter for ErrorEmitter {
    fn emit(&mut self, db: &mut DiagnosticBuilder<'_>) {
        let d = db.take();
        self.diagnostics.push(d);
    }

    fn take_diagnostics(&mut self) -> Vec<String> {
        let HandlerOpts {
            color,
            skip_filename,
        } = self.opts;

        self.diagnostics
            .to_pretty_string(&self.cm, skip_filename, color)
    }
}
