use swc_common::{errors::DiagnosticBuilder, Span};

pub fn pragma_and_pragma_frag_cannot_be_set() -> DiagnosticBuilder<'static> {
    DiagnosticBuilder::new(
        "pragma and pragmaFrag cannot be set when runtime is automatic.\nRemove `pragma` and \
         `pragmaFrag` options.",
    )
}

pub fn invalid_pragma() -> DiagnosticBuilder<'static> {
    DiagnosticBuilder::new(
        "pragma and pragmaFrag must be of the form `foo` or `foo.bar`.\nFix `pragma` and \
         `pragmaFrag` options.",
    )
}

pub fn import_source_cannot_be_set() -> DiagnosticBuilder<'static> {
    DiagnosticBuilder::new(
        "importSource cannot be set when runtime is classic.\nRemove `importSource` option.",
    )
}

pub fn invalid_import_source() -> DiagnosticBuilder<'static> {
    DiagnosticBuilder::new(
        "importSource cannot be an empty string or longer than u32::MAX bytes.\nFix \
         `importSource` option.",
    )
}

pub fn namespace_does_not_support(span: Span) -> DiagnosticBuilder<'static> {
    DiagnosticBuilder::new(
        "Namespace tags are not supported by default. React's JSX doesn't support namespace tags. \
         You can set `throwIfNamespace: false` to bypass this warning.",
    )
    .with_span_label(span, "namespace tag not supported")
}

pub fn valueless_key(span: Span) -> DiagnosticBuilder<'static> {
    DiagnosticBuilder::new(
        "Please provide an explicit key value. Using \"key\" as a shorthand for \"key={true}\" is \
         not allowed.",
    )
    .with_span_label(span, "valueless key attribute")
}
