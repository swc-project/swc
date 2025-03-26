use handler::ThreadSafetyDiagnostics;
pub use miette::{GraphicalReportHandler, GraphicalTheme};
use swc_common::errors::{DiagnosticBuilder, Emitter};

pub mod handler;

pub struct ErrorEmitter {
    pub diagnostics: ThreadSafetyDiagnostics,
}

impl Emitter for ErrorEmitter {
    fn emit(&mut self, db: &mut DiagnosticBuilder<'_>) {
        let d = db.take();
        self.diagnostics.push(d);
    }
}
