use std::{fmt, fmt::Write, fs, path::Path};

use swc_common::{
    errors::Handler,
    sync::{Lock, Lrc},
    BytePos, FileName, SourceMap, Span,
};
use swc_reporter::PrettyEmitter;

#[derive(Clone, Default)]
struct Writer(Lrc<Lock<String>>);

impl Write for Writer {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.0.lock().write_str(s)
    }
}

fn output<F>(file: &str, op: F)
where
    F: FnOnce(Lrc<SourceMap>, &Handler),
{
    let cm = Lrc::new(SourceMap::default());

    let mut wr = Writer::default();

    let emitter = PrettyEmitter::new(cm.clone(), Box::new(wr.clone()));
    let handler = Handler::with_emitter(true, false, Box::new(emitter));

    op(cm.clone(), &handler);

    let output = Path::new("tests").join("fixture").join(file);

    fs::write(&output, wr.0.lock().as_str()).expect("failed to write");
}

fn span(start: usize, end: usize) -> Span {
    Span::new(BytePos(start as _), BytePos(end as _), Default::default())
}

#[test]
fn test_1() {
    output("1.swc-stderr", |cm, h| {
        let fm = cm.new_source_file(FileName::Anon, "123456789".into());

        h.struct_span_err(span(1, 3), "test")
            .span_label(span(1, 4), "label")
            .emit();
    });
}
