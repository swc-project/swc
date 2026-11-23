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

/// Renders the diagnostics that `op` emits for a source file with the text
/// `src`, and fails the test if rendering panics.
fn render(src: &str, op: impl FnOnce(&swc_common::errors::Handler)) -> String {
    let cm = Lrc::new(SourceMap::default());

    let result = try_with_handler(cm.clone(), Default::default(), |handler| -> Result<(), _> {
        let _fm = cm.new_source_file(FileName::Anon.into(), src.to_string());

        op(handler);

        bail!("should fail");
    })
    .expect_err("should fail");

    let pretty =
        std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| result.to_pretty_string()))
            .expect("rendering diagnostics should not panic");
    println!("{pretty}");
    pretty
}

/// Returns the width of the widest line of `s`, in characters.
fn widest_line(s: &str) -> usize {
    s.lines().map(|l| l.chars().count()).max().unwrap_or(0)
}

/// The source of https://github.com/swc-project/swc/issues/12828: one line
/// of `prefix_len` columns of valid code, then a syntax error.
fn issue_12828_src(prefix_len: usize) -> (String, Span) {
    let mut src = "var a=1;".repeat(prefix_len / 8);
    let error = src.len() + "var b = 1 +".len();
    src.push_str("var b = 1 +;\n");
    (src, span(error, error + 1))
}

#[test]
fn issue_12828_error_past_column_65536() {
    let (src, error) = issue_12828_src(70000);

    let pretty = render(&src, |h| {
        h.struct_span_err(error, "Expression expected").emit();
    });

    assert!(pretty.contains("Expression expected"), "{pretty}");
    assert!(pretty.contains("var b = 1 +;"), "{pretty}");
    // The line is cropped around the error.
    assert!(widest_line(&pretty) < 1000, "{pretty}");
}

#[test]
fn issue_12828_error_before_column_65536_is_not_cropped() {
    let (src, error) = issue_12828_src(64000);

    let pretty = render(&src, |h| {
        h.struct_span_err(error, "Expression expected").emit();
    });

    assert!(pretty.contains("Expression expected"), "{pretty}");
    assert!(widest_line(&pretty) > 64000, "{pretty}");
}

#[test]
fn issue_12828_error_after_tabs() {
    // 16384 tabs are 65536 columns wide with a tab width of 4.
    let src = format!("{}+;\n", "\t".repeat(16384));
    let error = span(16385, 16386);

    let pretty = render(&src, |h| {
        h.struct_span_err(error, "Expression expected").emit();
    });

    assert!(pretty.contains("Expression expected"), "{pretty}");
}

#[test]
fn issue_12828_error_after_wide_characters() {
    // 32768 CJK characters are 65536 columns wide.
    let src = format!("var a = '{}' +;\n", "가".repeat(32768));
    let error = src.len() - 2;
    let error = span(error, error + 1);

    let pretty = render(&src, |h| {
        h.struct_span_err(error, "Expression expected").emit();
    });

    assert!(pretty.contains("Expression expected"), "{pretty}");
    assert!(pretty.contains("' +;"), "{pretty}");
}

#[test]
fn issue_12828_labels_far_apart_on_one_line() {
    // Two labels on one line, with more than 65536 columns between them.
    let src = format!("let a = 1;{}let a = 2;\n", " ".repeat(70000));
    let second = src.len() - "a = 2;\n".len();

    let pretty = render(&src, |h| {
        h.struct_span_err(span(second, second + 1), "duplicate declaration")
            .span_label(span(4, 5), "first declared here")
            .span_label(span(second, second + 1), "declared again here")
            .emit();
    });

    assert!(pretty.contains("first declared here"), "{pretty}");
    assert!(pretty.contains("declared again here"), "{pretty}");
    assert!(widest_line(&pretty) < 1000, "{pretty}");
}

#[test]
fn issue_12828_label_on_wide_context_line() {
    // The first line is too wide and has a label near its end, and the label
    // of the error is on the next line.
    let first = format!("{}let a = 1;", " ".repeat(70000));
    let src = format!("{first}\nlet a = 2;\n");
    let first_label = first.len() - "a = 1;".len();
    let second_label = first.len() + 1 + "let ".len();

    let pretty = render(&src, |h| {
        h.struct_span_err(
            span(second_label, second_label + 1),
            "duplicate declaration",
        )
        .span_label(span(first_label, first_label + 1), "first declared here")
        .span_label(span(second_label, second_label + 1), "declared again here")
        .emit();
    });

    assert!(pretty.contains("first declared here"), "{pretty}");
    assert!(pretty.contains("declared again here"), "{pretty}");
    assert!(widest_line(&pretty) < 1000, "{pretty}");
}

#[test]
fn issue_12828_wide_context_lines_are_not_shown() {
    let wide = " ".repeat(70000);
    let src = format!("{wide}\nlet a = 1 +;\n{wide}\n");
    let error = wide.len() + 1 + "let a = 1 +".len();

    let pretty = render(&src, |h| {
        h.struct_span_err(span(error, error + 1), "Expression expected")
            .emit();
    });

    assert!(pretty.contains("Expression expected"), "{pretty}");
    assert!(pretty.contains("let a = 1 +;"), "{pretty}");
    assert!(widest_line(&pretty) < 1000, "{pretty}");
}

#[test]
fn issue_12828_span_too_wide_to_show() {
    // A label that covers more than 65536 columns of one line, and a label
    // inside it, far from its start.
    let src = format!("let a = [{}1];\n", "0,".repeat(35000));
    let inner = src.len() - "1];\n".len();

    let pretty = render(&src, |h| {
        h.struct_span_err(span(8, src.len() - 2), "array is too long")
            .span_label(span(8, src.len() - 2), "this array")
            .span_label(span(inner, inner + 1), "last element")
            .emit();
    });

    assert!(pretty.contains("array is too long"), "{pretty}");
}

#[test]
fn issue_12828_multi_line_span_with_wide_middle_line() {
    let src = format!("let a = [\n{}\n1];\n", "0,".repeat(35000));
    let inner = src.len() - "1];\n".len();

    let pretty = render(&src, |h| {
        h.struct_span_err(span(8, src.len() - 2), "array is too long")
            .span_label(span(8, src.len() - 2), "this array")
            .span_label(span(inner, inner + 1), "last element")
            .emit();
    });

    assert!(pretty.contains("array is too long"), "{pretty}");
}
