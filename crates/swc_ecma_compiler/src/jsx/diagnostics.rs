use swc_common::{
    errors::{Diagnostic, Level},
    Span,
};

pub fn pragma_and_pragma_frag_cannot_be_set() -> Diagnostic {
    Diagnostic::new(
        Level::Error,
        "pragma and pragmaFrag cannot be set when runtime is automatic.\nRemove `pragma` and \
         `pragmaFrag` options.",
    )
}

pub fn invalid_pragma() -> Diagnostic {
    Diagnostic::new(
        Level::Error,
        "pragma and pragmaFrag must be of the form `foo` or `foo.bar`.\nFix `pragma` and \
         `pragmaFrag` options.",
    )
}

pub fn import_source_cannot_be_set() -> Diagnostic {
    Diagnostic::new(
        Level::Error,
        "importSource cannot be set when runtime is classic.\nRemove `importSource` option.",
    )
}

pub fn invalid_import_source() -> Diagnostic {
    Diagnostic::new(
        Level::Error,
        "importSource cannot be an empty string or longer than u32::MAX bytes.\nFix \
         `importSource` option.",
    )
}

pub fn namespace_does_not_support(span: Span) -> Diagnostic {
    let mut diagnostic = Diagnostic::new(
        Level::Error,
        "Namespace tags are not supported by default. React's JSX doesn't support namespace tags. \
         You can set `throwIfNamespace: false` to bypass this warning.",
    );
    diagnostic.span_label(span, "namespace tag not supported");
    diagnostic
}

pub fn valueless_key(span: Span) -> Diagnostic {
    let mut diagnostic = Diagnostic::new(
        Level::Error,
        "Please provide an explicit key value. Using \"key\" as a shorthand for \"key={true}\" is \
         not allowed.",
    );
    diagnostic.span_label(span, "valueless key attribute");
    diagnostic
}
