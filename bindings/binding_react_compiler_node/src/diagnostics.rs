use swc_ecma_react_compiler::diagnostics::{
    DiagnosticDetail as CoreDiagnosticDetail, DiagnosticLocation as CoreDiagnosticLocation,
    DiagnosticMessage, DiagnosticPosition as CoreDiagnosticPosition, Severity,
};

// `#[napi]` resolves via the crate-wide `#[macro_use] extern crate
// napi_derive;` in `lib.rs` — matches the convention already used in
// `support.rs`.
#[napi(object)]
#[derive(Debug, Clone)]
pub struct Diagnostic {
    pub severity: String,
    pub message: String,
    #[napi(js_name = "ruleId")]
    pub rule_id: Option<String>,
    pub category: Option<String>,
    pub reason: Option<String>,
    pub description: Option<String>,
    pub loc: Option<DiagnosticLocation>,
    pub details: Vec<DiagnosticDetail>,
}

#[napi(object)]
#[derive(Debug, Clone)]
pub struct DiagnosticLocation {
    pub start: DiagnosticPosition,
    pub end: DiagnosticPosition,
    pub filename: Option<String>,
    #[napi(js_name = "identifierName")]
    pub identifier_name: Option<String>,
}

#[napi(object)]
#[derive(Debug, Clone)]
pub struct DiagnosticPosition {
    pub line: u32,
    pub column: u32,
    pub index: Option<u32>,
}

#[napi(object)]
#[derive(Debug, Clone)]
pub struct DiagnosticDetail {
    pub kind: String,
    pub loc: Option<DiagnosticLocation>,
    pub message: Option<String>,
}

/// Converts a lint result's diagnostics into their napi-facing shape.
///
/// `source_text` is the same source that was linted — needed to convert
/// `CoreDiagnosticPosition`'s byte-based `column`/`index` into the UTF-16
/// code-unit-based positions JS/ESLint consumers expect. See
/// [`diagnostic_position_from`] for why this conversion can't happen
/// upstream in `swc_ecma_react_compiler` itself.
pub fn diagnostic_from_message(source_text: &str, value: &DiagnosticMessage) -> Diagnostic {
    Diagnostic {
        severity: match value.severity {
            Severity::Error => "error".to_string(),
            Severity::Warning => "warning".to_string(),
        },
        message: value.message.clone(),
        rule_id: value.rule_id.clone(),
        category: value.category.clone(),
        reason: value.reason.clone(),
        description: value.description.clone(),
        loc: value
            .loc
            .as_ref()
            .map(|loc| diagnostic_location_from(source_text, loc)),
        details: value
            .details
            .iter()
            .map(|detail| diagnostic_detail_from(source_text, detail))
            .collect(),
    }
}

fn diagnostic_location_from(
    source_text: &str,
    value: &CoreDiagnosticLocation,
) -> DiagnosticLocation {
    DiagnosticLocation {
        start: diagnostic_position_from(source_text, &value.start),
        end: diagnostic_position_from(source_text, &value.end),
        filename: value.filename.clone(),
        identifier_name: value.identifier_name.clone(),
    }
}

/// Converts a byte-offset-based position into a UTF-16 code-unit-based one.
///
/// `swc_ecma_react_compiler`'s `DiagnosticPosition` (and the upstream
/// `Position` it's built from) is deliberately byte-based: it also feeds
/// `DiagnosticMessage.span`, which `@swc/core`'s existing react-compiler
/// transform-error path turns into a real `swc_common::Span`/`BytePos` for
/// terminal error rendering — that consumer genuinely needs byte offsets.
/// This napi package's `lint`/`lintSync` are a different consumer exposing
/// positions to JS/ESLint, whose string indexing is UTF-16-based. Rather
/// than changing the shared byte-based representation (and breaking the
/// unrelated transform-error consumer for any non-ASCII source), the
/// conversion happens here, at this package's own boundary.
///
/// For ASCII-only source text this is a no-op (byte count == UTF-16 code
/// unit count for ASCII); they diverge for any non-ASCII character
/// appearing before the position being converted.
fn diagnostic_position_from(
    source_text: &str,
    value: &CoreDiagnosticPosition,
) -> DiagnosticPosition {
    let line_text = source_text
        .split('\n')
        .nth(value.line.saturating_sub(1) as usize)
        .unwrap_or_default();
    let byte_column = value.column as usize;
    let column = line_text
        .get(..byte_column)
        .unwrap_or(line_text)
        .encode_utf16()
        .count() as u32;

    let index = value.index.map(|byte_index| {
        source_text
            .get(..byte_index as usize)
            .unwrap_or(source_text)
            .encode_utf16()
            .count() as u32
    });

    DiagnosticPosition {
        line: value.line,
        column,
        index,
    }
}

fn diagnostic_detail_from(source_text: &str, value: &CoreDiagnosticDetail) -> DiagnosticDetail {
    DiagnosticDetail {
        kind: value.kind.clone(),
        loc: value
            .loc
            .as_ref()
            .map(|loc| diagnostic_location_from(source_text, loc)),
        message: value.message.clone(),
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_react_compiler::diagnostics::{
        DiagnosticDetail as CoreDiagnosticDetail, DiagnosticLocation as CoreDiagnosticLocation,
        DiagnosticMessage, DiagnosticPosition as CoreDiagnosticPosition, Severity,
    };

    use super::diagnostic_from_message;

    // Line 3 (1-indexed) is `👋 const value = 1;` — a 4-byte emoji followed
    // by a space, so byte offsets and UTF-16 offsets diverge from column 0
    // onward on this line, and `index` (absolute, from file start) diverges
    // for every position after it.
    const SOURCE: &str = "line one\nline two\n👋 const value = 1;\n";

    fn sample_message() -> DiagnosticMessage {
        DiagnosticMessage {
            severity: Severity::Error,
            message: "[ReactCompiler] Refs: invalid ref access".into(),
            span: Some((1, 2)),
            rule_id: Some("refs".into()),
            category: Some("Refs".into()),
            reason: Some("invalid ref access".into()),
            description: Some("description".into()),
            // All of these are the BYTE-based values `swc_ecma_react_compiler`
            // would actually produce (what `diagnostic_from_message` takes as
            // input) — `value` on line 3 starts after "👋 const ", which is
            // 4 (the emoji, a 4-byte UTF-8 sequence) + 1 (space) + 6
            // ("const ") = 11 bytes. Lines 1-2 ("line one"/"line two") plus
            // their newlines are 8 + 1 + 8 + 1 = 18 bytes, so `value`'s
            // absolute byte index is 18 + 11 = 29.
            loc: Some(CoreDiagnosticLocation {
                start: CoreDiagnosticPosition {
                    line: 3,
                    column: 11,
                    index: Some(29),
                },
                end: CoreDiagnosticPosition {
                    line: 3,
                    column: 16, // 11 + "value".len()
                    index: Some(34),
                },
                filename: Some("input.tsx".into()),
                identifier_name: Some("value".into()),
            }),
            details: vec![CoreDiagnosticDetail {
                kind: "error".into(),
                loc: None,
                message: Some("detail".into()),
            }],
        }
    }

    #[test]
    fn converts_diagnostic_message_to_napi_shape() {
        let diagnostic = diagnostic_from_message(SOURCE, &sample_message());

        assert_eq!(diagnostic.severity, "error");
        assert_eq!(
            diagnostic.message,
            "[ReactCompiler] Refs: invalid ref access"
        );
        assert_eq!(diagnostic.rule_id.as_deref(), Some("refs"));
        assert_eq!(diagnostic.category.as_deref(), Some("Refs"));

        let loc = diagnostic.loc.expect("expected loc");
        assert_eq!(loc.start.line, 3);
        assert_eq!(loc.identifier_name.as_deref(), Some("value"));

        assert_eq!(diagnostic.details.len(), 1);
        assert_eq!(diagnostic.details[0].kind, "error");
    }

    #[test]
    fn converts_warning_severity() {
        let mut message = sample_message();
        message.severity = Severity::Warning;

        let diagnostic = diagnostic_from_message(SOURCE, &message);

        assert_eq!(diagnostic.severity, "warning");
    }

    #[test]
    fn converts_byte_offsets_to_utf16_code_units_across_non_ascii_text() {
        let diagnostic = diagnostic_from_message(SOURCE, &sample_message());
        let loc = diagnostic.loc.expect("expected loc");

        // Byte column (11) counts the 4-byte emoji as 4 bytes; UTF-16 column
        // counts it as 2 code units ('👋' is outside the BMP, so it's a
        // surrogate pair): "👋"(2) + " "(1) + "const "(6) = 9.
        assert_eq!(loc.start.column, 9);
        assert_eq!(loc.end.column, 9 + 5); // + "value".len()

        // Same divergence propagated into the absolute `index`. Lines 1-2
        // and their newlines are ASCII, so their UTF-16 length equals their
        // byte length (18); only line 3's emoji prefix diverges (9 UTF-16
        // units vs. 11 bytes), giving 18 + 9 = 27 instead of the byte-based
        // 29.
        assert_eq!(loc.start.index, Some(18 + 9));
        assert_eq!(loc.end.index, Some(18 + 9 + 5));
    }

    #[test]
    fn ascii_only_source_leaves_positions_unchanged() {
        let source = "line one\nfunction App() {\n    const value = 1;\n}\n";
        let message = DiagnosticMessage {
            loc: Some(CoreDiagnosticLocation {
                start: CoreDiagnosticPosition {
                    line: 3,
                    column: 10,
                    index: Some(9 + 17 + 10),
                },
                end: CoreDiagnosticPosition {
                    line: 3,
                    column: 15,
                    index: Some(9 + 17 + 15),
                },
                filename: None,
                identifier_name: None,
            }),
            ..sample_message()
        };

        let diagnostic = diagnostic_from_message(source, &message);
        let loc = diagnostic.loc.expect("expected loc");

        // For ASCII-only source, byte offsets and UTF-16 offsets coincide.
        assert_eq!(loc.start.column, 10);
        assert_eq!(loc.start.index, Some(9 + 17 + 10));
        assert_eq!(loc.end.column, 15);
        assert_eq!(loc.end.index, Some(9 + 17 + 15));
    }
}
