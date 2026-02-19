use anyhow::bail;
use swc_common::{sync::Lrc, BytePos, FileName, SourceMap, Span};
use swc_error_reporters::handler::try_with_handler;

fn span(start: usize, end: usize) -> Span {
    Span::new(BytePos(start as _), BytePos(end as _))
}

#[test]
fn issue_10518_no_panic_for_invalid_label_span() {
    let cm = Lrc::new(SourceMap::default());

    let result = try_with_handler(cm.clone(), Default::default(), |handler| -> Result<(), _> {
        let _fm = cm.new_source_file(FileName::Anon.into(), "123456789");

        handler
            .struct_span_err(span(1, 3), "test")
            .span_label(span(1024, 2048), "invalid label")
            .emit();

        bail!("should fail");
    })
    .expect_err("should fail");

    let pretty =
        std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| result.to_pretty_string()))
            .expect("rendering diagnostics should not panic");

    assert!(pretty.contains("test"));
}
