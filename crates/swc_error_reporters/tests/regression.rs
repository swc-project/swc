use anyhow::bail;
use swc_common::{errors::ColorConfig, sync::Lrc, BytePos, FileName, SourceMap, Span};
use swc_error_reporters::handler::{try_with_handler, HandlerOpts};

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

/// Renders the diagnostics that `op` emits for a source file named
/// `input.js` with the text `src`, and fails the test if rendering panics.
///
/// `op` gets a function that converts a byte range of `src` to a [Span].
fn render(
    src: &str,
    op: impl FnOnce(&swc_common::errors::Handler, &dyn Fn(usize, usize) -> Span),
) -> String {
    let cm = Lrc::new(SourceMap::default());

    let result = try_with_handler(
        cm.clone(),
        HandlerOpts {
            // The assertions match the plain output, also in a color terminal.
            color: ColorConfig::Never,
            ..Default::default()
        },
        |handler| -> Result<(), _> {
            let fm = cm.new_source_file(FileName::Real("input.js".into()).into(), src.to_string());
            let start = fm.start_pos.0 as usize;

            op(handler, &|lo, hi| span(start + lo, start + hi));

            bail!("should fail");
        },
    )
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

/// Asserts that `pretty` shows a snippet, and not the note that miette prints
/// when it cannot read one.
fn assert_has_snippet(pretty: &str) {
    assert!(!pretty.contains("Failed to read contents"), "{pretty}");
    assert!(pretty.contains("[input.js:"), "{pretty}");
}

/// The source of https://github.com/swc-project/swc/issues/12828: one line
/// of `prefix_len` columns of valid code, then a syntax error at the `;`.
fn issue_12828_src(prefix_len: usize) -> (String, usize) {
    let mut src = "var a=1;".repeat(prefix_len / 8);
    let error = src.len() + "var b = 1 +".len();
    src.push_str("var b = 1 +;\n");
    (src, error)
}

#[test]
fn issue_12828_error_past_column_65536() {
    let (src, error) = issue_12828_src(70000);

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(error, error + 1), "Expression expected")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("Expression expected"), "{pretty}");
    assert!(pretty.contains("var b = 1 +;"), "{pretty}");
    // The snippet, and so the column in its header, starts 128 columns
    // before the error.
    assert!(
        pretty.contains(&format!("[input.js:1:{}]", error - 128 + 1)),
        "{pretty}"
    );
    // The line is cropped around the error.
    assert!(widest_line(&pretty) < 1000, "{pretty}");
}

#[test]
fn issue_12828_error_before_column_65536_is_not_cropped() {
    let (src, error) = issue_12828_src(64000);

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(error, error + 1), "Expression expected")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("[input.js:1:1]"), "{pretty}");
    assert!(widest_line(&pretty) > 64000, "{pretty}");
}

#[test]
fn issue_12828_error_after_tabs() {
    // 16384 tabs are 65536 columns wide with a tab width of 4.
    let src = format!("{}+;\n", "\t".repeat(16384));

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(16385, 16386), "Expression expected")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("Expression expected"), "{pretty}");
}

#[test]
fn issue_12828_error_after_wide_characters() {
    // 32768 CJK characters are 65536 columns wide.
    let src = format!("var a = '{}' +;\n", "가".repeat(32768));
    let error = src.len() - 2;

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(error, error + 1), "Expression expected")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("' +;"), "{pretty}");
}

#[test]
fn issue_12828_error_after_three_column_characters() {
    // miette renders U+17D8 (KHMER SIGN BEYYAL) as 3 columns. With 65512
    // columns of ASCII before them, the error is at column 65536.
    let src = format!(
        "{}var b = '{}' +;\n",
        "var a=1;".repeat(8189),
        "\u{17D8}".repeat(4)
    );
    let error = src.len() - 2;

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(error, error + 1), "Expression expected")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("' +;"), "{pretty}");
}

#[test]
fn issue_12828_labels_far_apart_on_one_line() {
    // Two labels on one line, with more than 65536 columns between them.
    let src = format!("let a = 1;{}let a = 2;\n", " ".repeat(70000));
    let second = src.len() - "a = 2;\n".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(second, second + 1), "duplicate declaration")
            .span_label(span(4, 5), "first declared here")
            .span_label(span(second, second + 1), "declared again here")
            .emit();
    });

    assert_has_snippet(&pretty);
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

    let pretty = render(&src, |h, span| {
        h.struct_span_err(
            span(second_label, second_label + 1),
            "duplicate declaration",
        )
        .span_label(span(first_label, first_label + 1), "first declared here")
        .span_label(span(second_label, second_label + 1), "declared again here")
        .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("first declared here"), "{pretty}");
    assert!(pretty.contains("declared again here"), "{pretty}");
    assert!(widest_line(&pretty) < 1000, "{pretty}");
}

#[test]
fn issue_12828_wide_context_lines_are_cropped() {
    let wide = " ".repeat(70000);
    let src = format!("{wide}\nlet a = 1 +;\n{wide}\n");
    let error = wide.len() + 1 + "let a = 1 +".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(error, error + 1), "Expression expected")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("let a = 1 +;"), "{pretty}");
    assert!(widest_line(&pretty) < 1000, "{pretty}");
}

#[test]
fn issue_12828_wide_label_is_shown() {
    // A label that covers more than 65536 columns of one line, as for an
    // unterminated string in minified code, and a label inside it. miette
    // renders both without a wide padding, so the snippet is shown.
    let src = format!("let a = [{}1];\n", "0,".repeat(35000));
    let array = (8, src.len() - 2);
    let inner = src.len() - "1];\n".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(array.0, array.1), "array is too long")
            .span_label(span(array.0, array.1), "this array")
            .span_label(span(inner, inner + 1), "last element")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("this array"), "{pretty}");
    assert!(pretty.contains("last element"), "{pretty}");
}

#[test]
fn issue_12828_wide_label_of_wide_characters_is_shown() {
    // An unterminated string of 33000 one-column non-ASCII characters.
    let src = format!("const data = \"{}\n", "é".repeat(33000));
    let string = ("const data = ".len(), src.len() - 1);

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(string.0, string.1), "Unterminated string constant")
            .emit();
    });

    assert_has_snippet(&pretty);
}

#[test]
fn issue_12828_wide_label_with_trailing_text_is_shown() {
    // A label that is just narrow enough, followed by more text on its line.
    let src = format!("'{}' = 0; // {}\n", "a".repeat(65460), "b".repeat(200));
    let lhs = (0, 65462);

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(lhs.0, lhs.1), "Invalid assignment target")
            .emit();
    });

    assert_has_snippet(&pretty);
}

#[test]
fn issue_12828_wide_label_keeps_other_labels() {
    // An unterminated regular expression on a wide line, and a note on the
    // line before it.
    let src = format!("if (\n/{}\n", "a".repeat(70000));
    let regexp = (5, src.len() - 1);

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(regexp.0, regexp.1), "Unterminated regexp literal")
            .span_label(
                span(0, 2),
                "Tried to parse the condition for an if statement",
            )
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(
        pretty.contains("Tried to parse the condition for an if statement"),
        "{pretty}"
    );
}

#[test]
fn issue_12828_multi_line_span_with_wide_middle_line() {
    let src = format!("let a = [\n{}\n1];\n", "0,".repeat(35000));
    let array = (8, src.len() - 2);
    let inner = src.len() - "1];\n".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(array.0, array.1), "array is too long")
            .span_label(span(array.0, array.1), "this array")
            .span_label(span(inner, inner + 1), "last element")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("this array"), "{pretty}");
    assert!(pretty.contains("last element"), "{pretty}");
}

#[test]
fn issue_12828_label_far_inside_wide_line_of_multi_line_span() {
    // A label far inside a wide line that a multi-line span covers. miette
    // would pad it by more than 65536 columns, so the snippet is not shown,
    // and only the message is rendered.
    let src = format!("let a = [\n{}1,\n];\n", "0,".repeat(35000));
    let array = (8, src.len() - 2);
    let inner = src.len() - "1,\n];\n".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(inner, inner + 1), "array is too long")
            .span_label(span(array.0, array.1), "this array")
            .span_label(span(inner, inner + 1), "last element")
            .emit();
    });

    assert!(pretty.contains("array is too long"), "{pretty}");
}

#[test]
fn issue_12828_insertion_label_after_wide_line() {
    // A zero-length label at the start of the line after a wide line. miette
    // draws it on its own line, so the wide line is not padded.
    let src = format!("let a = [\n{}\n];\n", "0,".repeat(35000));
    let array = (8, src.len() - 2);
    let insert = src.len() - "];\n".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(array.0, array.1), "missing element")
            .span_label(span(array.0, array.1), "this array")
            .span_label(span(insert, insert), "insert here")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("insert here"), "{pretty}");
}

#[test]
fn issue_12828_label_through_crlf_of_wide_line() {
    // A wide label that ends after the CRLF of its line, and a label inside
    // it. miette pads the inner label from the end of the wide label.
    let src = format!("{}\r\nnext\n", "x".repeat(70000));

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(0, 70002), "wide")
            .span_label(span(0, 70002), "whole line")
            .span_label(span(69999, 70000), "last character")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("whole line"), "{pretty}");
    assert!(pretty.contains("last character"), "{pretty}");
}

#[test]
fn issue_12828_tab_line_in_multi_line_span() {
    // 9000 tabs are 36000 columns wide with miette's tab width of 4, so the
    // label after them is padded by less than 65536 columns.
    let src = format!("let a = [\n{}1,\n];\n", "\t".repeat(9000));
    let array = (8, src.len() - 2);
    let inner = src.len() - "1,\n];\n".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(inner, inner + 1), "array is too long")
            .span_label(span(array.0, array.1), "this array")
            .span_label(span(inner, inner + 1), "last element")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("this array"), "{pretty}");
    assert!(pretty.contains("last element"), "{pretty}");
}

#[test]
fn issue_12828_padding_of_u16_max_columns() {
    // The label after the string is padded by exactly 65535 columns, which
    // miette can render.
    let src = format!("[\n'{}'] bad\n", "a".repeat(65531));
    let array = (0, src.len() - " bad\n".len());
    let bad = src.len() - "bad\n".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(bad, bad + 3), "Expected ';'")
            .span_label(span(array.0, array.1), "this array")
            .span_label(span(bad, bad + 3), "here")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("here"), "{pretty}");
}

#[test]
fn issue_12828_header_read_of_label_ending_on_wide_line() {
    // The primary span ends at the `\n` of a wide line. A label through that
    // `\n` moves the padding of the label after it, so the snippet with
    // context renders. miette reads the primary span again without context
    // for the header, and that read must not fail.
    let src = format!("(\n{}\nnext\n", "a".repeat(70000));
    let newline = 2 + 70000;

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(0, newline), "unclosed parenthesis")
            .span_label(span(7, newline + 1), "this line")
            .span_label(span(69002, 69003), "here")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("here"), "{pretty}");
}

#[test]
fn issue_12828_ansi_escape_sequences_have_no_width() {
    // miette renders ANSI escape sequences with no width, so the label after
    // this colored text is padded by less than 65536 columns. The array spans
    // several lines, so its label does not cover the padding.
    let colored = "\x1b[31mred\x1b[0m".repeat(10000);
    let src = format!("let a = [\n`{colored}`, 1\n];\n");
    let array = (8, src.len() - 2);
    let one = src.len() - "1\n];\n".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(one, one + 1), "expected a string")
            .span_label(span(array.0, array.1), "this array")
            .span_label(span(one, one + 1), "expected a string here")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("expected a string here"), "{pretty}");
}

#[test]
fn issue_12828_header_column_of_empty_span_at_eof() {
    // The header shows the column of an empty span at the end of the file
    // after a newline, as before. Many parser fixtures depend on it.
    let src = "let f = 1 +\n";

    let pretty = render(src, |h, span| {
        h.struct_span_err(span(src.len(), src.len()), "Unexpected eof")
            .emit();
    });

    assert!(pretty.contains("[input.js:1:13]"), "{pretty}");
}

#[test]
fn issue_12828_crlf_line_before_wide_context_line() {
    // The next line is too wide to show as context. The snippet keeps the
    // `\r\n` of the error line, so miette numbers the line correctly.
    let src = format!("let x = +;\r\n{}\r\n", "x".repeat(70000));
    let error = "let x = +".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(error, error + 1), "Expression expected")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains(" 1 | let x = +;"), "{pretty}");
}

#[test]
fn issue_12828_insertion_label_at_newline_before_wide_context_line() {
    let src = format!("let x = 1\n{}\n", "x".repeat(70000));
    let newline = "let x = 1".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(newline, newline), "Expected ';'")
            .span_label(span(newline, newline), "insert here")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("insert here"), "{pretty}");
}

#[test]
fn issue_12828_labels_with_the_same_start() {
    // miette draws labels that start at the same position in the order of the
    // diagnostic, here the longer one first, so the padding of the last label
    // is exactly 65535 columns.
    let src = format!("[\nfoo{}x\n]\n", " ".repeat(65535));
    let array = (0, src.len() - 1);
    let foo = 2;
    let x = src.len() - "x\n]\n".len();

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(x, x + 1), "unexpected")
            .span_label(span(array.0, array.1), "this array")
            .span_label(span(foo, foo + 2), "fo")
            .span_label(span(foo, foo + 1), "f")
            .span_label(span(x, x + 1), "here")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("here"), "{pretty}");
}

#[test]
fn issue_12828_error_at_eof_after_wide_line() {
    // A minified file that ends in the middle of an expression. The error is
    // after the last newline, so the wide line is a context line, and its end
    // is shown.
    let (mut src, _) = issue_12828_src(70000);
    src.truncate(src.len() - ";\n".len());
    src.push('\n');

    let pretty = render(&src, |h, span| {
        h.struct_span_err(span(src.len(), src.len()), "Expression expected")
            .emit();
    });

    assert_has_snippet(&pretty);
    assert!(pretty.contains("var b = 1 +"), "{pretty}");
    assert!(widest_line(&pretty) < 1000, "{pretty}");
}

#[test]
fn issue_12828_label_order_with_labels_in_another_file() {
    // miette sorts all labels of a diagnostic by their start with an unstable
    // sort, so the order of two labels with the same start can depend on the
    // labels in other files. The padding of `last element` is exactly 65535
    // columns when `fo` is drawn before `f`, and 65536 columns otherwise. The
    // padding check must use miette's order: no order may panic, and the
    // snippet must be shown for the orders that miette can render.
    let cm = Lrc::new(SourceMap::default());
    let input = cm.new_source_file(
        FileName::Real("input.js".into()).into(),
        format!("[\nfoo{}x\n]\n", " ".repeat(65535)),
    );
    let other = cm.new_source_file(FileName::Real("other.js".into()).into(), "0;\n".repeat(40));
    let foo = input.start_pos.0 + 2;
    let x = foo + 3 + 65535;
    let mut labels = vec![
        (input.start_pos.0, input.end_pos.0 - 1, "array"),
        (foo, foo + 1, "f"),
        (foo, foo + 2, "fo"),
        (x, x + 1, "last element"),
    ];
    labels.extend((0..30).map(|i| {
        let pos = other.start_pos.0 + 3 * i;
        (pos, pos + 1, "other")
    }));

    let mut seed = 1u64;
    let mut shown = 0;
    for _ in 0..40 {
        // Shuffle the labels.
        for i in (1..labels.len()).rev() {
            seed = seed
                .wrapping_mul(6364136223846793005)
                .wrapping_add(1442695040888963407);
            labels.swap(i, (seed >> 33) as usize % (i + 1));
        }

        let result = try_with_handler(
            cm.clone(),
            HandlerOpts {
                color: ColorConfig::Never,
                ..Default::default()
            },
            |h| -> Result<(), _> {
                let mut d = h.struct_span_err(span(x as usize, x as usize + 1), "unexpected");
                for &(lo, hi, label) in &labels {
                    d.span_label(span(lo as usize, hi as usize), label);
                }
                d.emit();
                bail!("should fail");
            },
        )
        .expect_err("should fail");

        let pretty =
            std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| result.to_pretty_string()))
                .expect("rendering diagnostics should not panic");
        if pretty.contains("last element") {
            shown += 1;
        }
    }
    assert!(shown > 0);
}
