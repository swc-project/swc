use oxc_diagnostics::OxcDiagnostic;
use oxc_span::Span;

pub fn pragma_and_pragma_frag_cannot_be_set() -> OxcDiagnostic {
    OxcDiagnostic::warn("pragma and pragmaFrag cannot be set when runtime is automatic.")
        .with_help("Remove `pragma` and `pragmaFrag` options.")
}

pub fn invalid_pragma() -> OxcDiagnostic {
    OxcDiagnostic::warn("pragma and pragmaFrag must be of the form `foo` or `foo.bar`.")
        .with_help("Fix `pragma` and `pragmaFrag` options.")
}

pub fn import_source_cannot_be_set() -> OxcDiagnostic {
    OxcDiagnostic::warn("importSource cannot be set when runtime is classic.")
        .with_help("Remove `importSource` option.")
}

pub fn invalid_import_source() -> OxcDiagnostic {
    OxcDiagnostic::warn("importSource cannot be an empty string or longer than u32::MAX bytes")
        .with_help("Fix `importSource` option.")
}

pub fn namespace_does_not_support(span: Span) -> OxcDiagnostic {
    OxcDiagnostic::warn("Namespace tags are not supported by default. React's JSX doesn't support namespace tags. You can set `throwIfNamespace: false` to bypass this warning.")
        .with_label(span)
}

pub fn valueless_key(span: Span) -> OxcDiagnostic {
    OxcDiagnostic::warn("Please provide an explicit key value. Using \"key\" as a shorthand for \"key={true}\" is not allowed.")
        .with_label(span)
}
