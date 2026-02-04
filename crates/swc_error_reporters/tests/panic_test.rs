use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    BytePos, FileName, SourceMap, Span,
};
use swc_error_reporters::{
    handler::{HandlerOpts, ThreadSafetyDiagnostics},
    ErrorEmitter,
};

#[test]
fn test_parse_error_formatting() {
    // This test simulates parsing code that would cause a syntax error
    // and ensures the error formatting doesn't panic

    let cm: Lrc<SourceMap> = Default::default();
    // Create a source file with a syntax error
    let code = "var x = {";
    let _fm = cm.new_source_file(FileName::Anon.into(), code.to_string());

    let diagnostics = ThreadSafetyDiagnostics::default();
    let emitter = Box::new(ErrorEmitter {
        diagnostics: diagnostics.clone(),
        cm: cm.clone(),
        opts: HandlerOpts::default(),
    });

    let handler = Handler::with_emitter(true, false, emitter);

    // Emit a test error using a span from the source file
    let span = Span::new(BytePos(0), BytePos(code.len() as u32));
    handler.struct_span_err(span, "Test error message").emit();

    // This should not panic
    let strings = diagnostics.to_pretty_string(&cm, false, ColorConfig::Never);
    assert!(!strings.is_empty());
}

/// Regression test for https://github.com/swc-project/swc/issues/10518
///
/// miette's GraphicalReportHandler panics when rendering errors on very long
/// lines (>65535 characters) due to Rust's format! width parameter limit.
/// The fix catches this panic and falls back to a simple display format.
#[test]
fn test_very_long_line_error_formatting_issue_10518() {
    let cm: Lrc<SourceMap> = Default::default();

    // Create a source file with a very long line (>65535 characters)
    // that would trigger the miette panic
    let long_line = "x".repeat(100_000);
    let code = format!("var x = {}", long_line);
    let _fm = cm.new_source_file(FileName::Anon.into(), code.clone());

    let diagnostics = ThreadSafetyDiagnostics::default();
    let emitter = Box::new(ErrorEmitter {
        diagnostics: diagnostics.clone(),
        cm: cm.clone(),
        opts: HandlerOpts::default(),
    });

    let handler = Handler::with_emitter(true, false, emitter);

    // Emit an error pointing to a position far into the long line
    // This would trigger the miette panic if not handled
    let span = Span::new(BytePos(90_000), BytePos(90_010));
    handler
        .struct_span_err(span, "Test error on long line")
        .emit();

    // This should not panic, but gracefully fall back to simple format
    let strings = diagnostics.to_pretty_string(&cm, false, ColorConfig::Never);
    assert!(!strings.is_empty());

    // Verify that the error message is present in some form
    let combined = strings.join("\n");
    assert!(
        combined.contains("error") || combined.contains("Test error on long line"),
        "Error output should contain the error message"
    );
}
