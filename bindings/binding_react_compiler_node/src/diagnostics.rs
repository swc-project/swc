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

impl From<&DiagnosticMessage> for Diagnostic {
    fn from(value: &DiagnosticMessage) -> Self {
        Self {
            severity: match value.severity {
                Severity::Error => "error".to_string(),
                Severity::Warning => "warning".to_string(),
            },
            message: value.message.clone(),
            rule_id: value.rule_id.clone(),
            category: value.category.clone(),
            reason: value.reason.clone(),
            description: value.description.clone(),
            loc: value.loc.as_ref().map(Into::into),
            details: value.details.iter().map(Into::into).collect(),
        }
    }
}

impl From<&CoreDiagnosticLocation> for DiagnosticLocation {
    fn from(value: &CoreDiagnosticLocation) -> Self {
        Self {
            start: (&value.start).into(),
            end: (&value.end).into(),
            filename: value.filename.clone(),
            identifier_name: value.identifier_name.clone(),
        }
    }
}

impl From<&CoreDiagnosticPosition> for DiagnosticPosition {
    fn from(value: &CoreDiagnosticPosition) -> Self {
        Self {
            line: value.line,
            column: value.column,
            index: value.index,
        }
    }
}

impl From<&CoreDiagnosticDetail> for DiagnosticDetail {
    fn from(value: &CoreDiagnosticDetail) -> Self {
        Self {
            kind: value.kind.clone(),
            loc: value.loc.as_ref().map(Into::into),
            message: value.message.clone(),
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_react_compiler::diagnostics::{
        DiagnosticDetail as CoreDiagnosticDetail, DiagnosticLocation as CoreDiagnosticLocation,
        DiagnosticMessage, DiagnosticPosition as CoreDiagnosticPosition, Severity,
    };

    use super::Diagnostic;

    fn sample_message() -> DiagnosticMessage {
        DiagnosticMessage {
            severity: Severity::Error,
            message: "[ReactCompiler] Refs: invalid ref access".into(),
            span: Some((1, 2)),
            rule_id: Some("refs".into()),
            category: Some("Refs".into()),
            reason: Some("invalid ref access".into()),
            description: Some("description".into()),
            loc: Some(CoreDiagnosticLocation {
                start: CoreDiagnosticPosition {
                    line: 3,
                    column: 10,
                    index: Some(42),
                },
                end: CoreDiagnosticPosition {
                    line: 3,
                    column: 21,
                    index: Some(53),
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
        let diagnostic: Diagnostic = (&sample_message()).into();

        assert_eq!(diagnostic.severity, "error");
        assert_eq!(
            diagnostic.message,
            "[ReactCompiler] Refs: invalid ref access"
        );
        assert_eq!(diagnostic.rule_id.as_deref(), Some("refs"));
        assert_eq!(diagnostic.category.as_deref(), Some("Refs"));

        let loc = diagnostic.loc.expect("expected loc");
        assert_eq!(loc.start.line, 3);
        assert_eq!(loc.start.index, Some(42));
        assert_eq!(loc.identifier_name.as_deref(), Some("value"));

        assert_eq!(diagnostic.details.len(), 1);
        assert_eq!(diagnostic.details[0].kind, "error");
    }

    #[test]
    fn converts_warning_severity() {
        let mut message = sample_message();
        message.severity = Severity::Warning;

        let diagnostic: Diagnostic = (&message).into();

        assert_eq!(diagnostic.severity, "warning");
    }
}
