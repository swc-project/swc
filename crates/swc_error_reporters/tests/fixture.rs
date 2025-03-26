#![deny(warnings)]

use std::{fmt, fmt::Write, fs, path::Path};
use std::{fs, path::Path};

use swc_common::{
    errors::{Handler, Level},
    sync::{Lock, Lrc},
    BytePos, FileName, SourceMap, Span,
};
use swc_error_reporters::PrettyEmitter;

#[derive(Clone, Default)]
struct Writer(Lrc<Lock<String>>);

impl Write for Writer {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.0.lock().write_str(s)
    }
}
use swc_error_reporters::handler::try_with_handler;
use swc_error_reporters::{
    handler::{to_pretty_handler, ThreadSafetyDiagnostics},
    ErrorEmitter, GraphicalReportHandler,
};

fn output<F>(file: &str, op: F)
where
    F: FnOnce(Lrc<SourceMap>, &Handler),
{
    let cm = Lrc::new(SourceMap::default());
    let mut diagnostics = ThreadSafetyDiagnostics::default();
    let emitter = ErrorEmitter {
        diagnostics: diagnostics.clone(),
    };

    let wr = Writer::default();

    let emitter = PrettyEmitter::new(
        cm.clone(),
        Box::new(wr.clone()),
        Default::default(),
        Default::default(),
    );
    let handler = Handler::with_emitter(true, false, Box::new(emitter));

    op(cm, &handler);

    let output = Path::new("tests").join("fixture").join(file);

    let s = wr.0.lock().as_str().to_string();
    println!("{}", s);
    fs::write(output, &s).expect("failed to write");
    let handler = Handler::with_emitter(true, false, Box::new(emitter));

    op(cm.clone(), &handler);

    let output = Path::new("tests").join("fixture").join(file);

    let report_handler = GraphicalReportHandler::default();
    let pretty_message = diagnostics
        .take()
        .iter()
        .map(|d| d.to_pretty_diagnostic(&cm, false))
        .map(|d| d.to_pretty_string(&report_handler))
        .collect::<Vec<String>>()
        .join("");

    println!("{}", pretty_message);
    fs::write(output, &pretty_message).expect("failed to write");
}

fn span(start: usize, end: usize) -> Span {
    Span::new(BytePos(start as _), BytePos(end as _))
}

#[test]
fn test_1() {
    output("1.ans", |cm, h| {
        let _fm = cm.new_source_file(FileName::Anon.into(), "123456789".into());

        h.struct_span_err(span(1, 3), "test")
            .span_label(span(1, 4), "label")
            .emit();
    });
}

#[test]
fn test_2() {
    output("2.ans", |cm, h| {
        let _fm = cm.new_source_file(FileName::Anon.into(), "123456789".into());

        let mut d = h.struct_span_err(span(1, 3), "test");

        d.span_label(span(1, 4), "label")
            .span_help(span(1, 5), "help")
            // This does not work.
            .span_suggestion(span(2, 3), "suggesting message", "132".into());

        d.sub(Level::Warning, "sub1", Some(span(7, 8)));
        d.sub(Level::Warning, "sub2", Some(span(6, 8)));

        d.emit();
    });
}
