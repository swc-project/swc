//! This is actual code used by swc.

use std::{
    fmt,
    sync::{Arc, Mutex},
};

use swc_common::{errors::Handler, sync::Lrc, BytePos, FileName, SourceFile, SourceMap, Span};
use swc_error_reporters::{GraphicalReportHandler, PrettyEmitter, PrettyEmitterConfig};

fn main() {
    let cm = Lrc::<SourceMap>::default();

    let wr = Box::<LockedWriter>::default();

    let emitter = PrettyEmitter::new(
        cm.clone(),
        wr.clone(),
        GraphicalReportHandler::new().with_context_lines(3),
        PrettyEmitterConfig {
            skip_filename: false,
        },
    );
    // let e_wr = EmitterWriter::new(wr.clone(), Some(cm), false,
    // true).skip_filename(skip_filename);
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

    let s = &**wr.0.lock().unwrap();

    println!("{}", s);
}

/// Don't do this in your real app. You should use [Span] created by parser
fn span(base: &SourceFile, lo: u32, hi: u32) -> Span {
    let lo = base.start_pos.0 + lo;
    let hi = base.start_pos.0 + hi;

    Span::new(BytePos(lo), BytePos(hi))
}

#[derive(Clone, Default)]
struct LockedWriter(Arc<Mutex<String>>);

impl fmt::Write for LockedWriter {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.0.lock().unwrap().push_str(s);
        Ok(())
    }
}
