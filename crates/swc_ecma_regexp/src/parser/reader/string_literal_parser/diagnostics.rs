use swc_common::Span;

use crate::diagnostics::RegexpDiagnostic;

#[cold]
pub fn invalid_input(span: Span) -> RegexpDiagnostic {
    RegexpDiagnostic::error(
        "String literal should be wrapped with ' or \", or escaped properly".to_string(),
    )
    .with_label(span)
}

#[cold]
pub fn legacy_in_strict_mode(kind: &str, span: Span) -> RegexpDiagnostic {
    RegexpDiagnostic::error(format!("Not allowed {kind} in strict mode")).with_label(span)
}

#[cold]
pub fn too_large_unicode_escape_sequence(span: Span) -> RegexpDiagnostic {
    RegexpDiagnostic::error("Too large unicode escape sequence".to_string()).with_label(span)
}
