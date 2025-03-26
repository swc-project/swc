//! This is actual code used by swc.

use std::sync::{Arc, Mutex};

use swc_common::{
    errors::{Diagnostic, Emitter, Handler},
    sync::Lrc,
    BytePos, FileName, SourceFile, SourceMap, Span,
};
use swc_error_reporters::GraphicalReportHandler;

fn main() {
    let cm = Lrc::<SourceMap>::default();

    let mut diagnostics = ThreadSafetyDiagnostic::default();

    let emitter = ErrorEmitter {
        diagnostics: diagnostics.clone(),
    };

    let handler = Handler::with_emitter(true, false, Box::new(emitter));

    let fm1 = cm.new_source_file(
        Lrc::new(FileName::Custom("foo.js".into())),
        "13579\n12345\n13579".into(),
    );
    let fm2 = cm.new_source_file(
        Lrc::new(FileName::Custom("bar.js".into())),
        "02468\n12345\n02468".into(),
    );

    // This is a simple example.
    handler
        .struct_span_err(span(&fm1, 0, 3), "simple message")
        .emit();

    // We can show other file.
    // This can be used to show configurable error with the config.

    handler
        .struct_span_err(span(&fm1, 6, 9), "constraint violation")
        .span_note(span(&fm2, 0, 1), "this is your config")
        .emit();

    let report_handler = GraphicalReportHandler::default();
    let diagnostics = diagnostics.take();
    let diagnostics_pretty_message = diagnostics
        .iter()
        .map(|d| d.to_pretty_diagnostic(&cm, false))
        .map(|d| d.to_pretty_string(&report_handler))
        .collect::<Vec<String>>()
        .join("");

    println!("{}", diagnostics_pretty_message);
}

/// Don't do this in your real app. You should use [Span] created by parser
fn span(base: &SourceFile, lo: u32, hi: u32) -> Span {
    let lo = base.start_pos.0 + lo;
    let hi = base.start_pos.0 + hi;

    Span::new(BytePos(lo), BytePos(hi))
}

#[derive(Default, Clone)]
struct ThreadSafetyDiagnostic(Arc<Mutex<Vec<Diagnostic>>>);

impl ThreadSafetyDiagnostic {
    pub fn push(&self, d: Diagnostic) {
        self.0
            .lock()
            .expect("Should get Diagnostics Vec key")
            .push(d);
    }

    pub fn take(&mut self) -> Vec<Diagnostic> {
        std::mem::take(
            &mut *self
                .0
                .lock()
                .expect("Failed to access the diagnostics lock"),
        )
    }
}

struct ErrorEmitter {
    diagnostics: ThreadSafetyDiagnostic,
}

impl Emitter for ErrorEmitter {
    fn emit(&mut self, db: &mut swc_common::errors::DiagnosticBuilder<'_>) {
        let d = db.take();
        self.diagnostics.push(d);
    }
}
