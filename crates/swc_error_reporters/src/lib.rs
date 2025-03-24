use handler::DiagnosticWriter;
pub use miette::{GraphicalReportHandler, GraphicalTheme};
use swc_common::errors::{DiagnosticBuilder, Emitter};

pub mod handler;

pub struct ErrorEmitter {
    diagnostics: DiagnosticWriter,
}

impl Emitter for ErrorEmitter {
    fn emit(&mut self, db: &mut DiagnosticBuilder<'_>) {
        let d = db.take();
        self.diagnostics.push(d);
    }
}
