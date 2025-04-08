// #![deny(warnings)]
use std::{fs, path::Path};

use swc_common::{
    errors::{Handler, Level},
    sync::Lrc,
    BytePos, FileName, SourceMap, Span,
};
use swc_error_reporters::{handler::ThreadSafetyDiagnostics, ErrorEmitter};

fn output<F>(file: &str, op: F)
where
    F: FnOnce(Lrc<SourceMap>, &Handler),
{
    let cm = Lrc::new(SourceMap::default());
    let diagnostics = ThreadSafetyDiagnostics::default();
    let emitter = ErrorEmitter {
        diagnostics: diagnostics.clone(),
        cm: cm.clone(),
        opts: Default::default(),
    };

    let handler = Handler::with_emitter(true, false, Box::new(emitter));

    op(cm.clone(), &handler);

    let output = Path::new("tests").join("fixture").join(file);

    let errors = diagnostics.as_array(cm.clone(), Default::default());
    let pretty_message = errors.to_pretty_string();
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
