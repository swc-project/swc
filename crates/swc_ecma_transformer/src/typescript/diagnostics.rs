use oxc_diagnostics::OxcDiagnostic;
use oxc_span::Span;

pub fn import_equals_cannot_be_used_in_esm(span: Span) -> OxcDiagnostic {
    OxcDiagnostic::warn("Import assignment cannot be used when targeting ECMAScript modules.")
        .with_help(
            "Consider using 'import * as ns from \"mod\"',
         'import {a} from \"mod\"', 'import d from \"mod\"', or another module format instead.",
        )
        .with_label(span)
        .with_error_code("TS", "1202")
}

pub fn export_assignment_cannot_bed_used_in_esm(span: Span) -> OxcDiagnostic {
    OxcDiagnostic::warn("Export assignment cannot be used when targeting ECMAScript modules.")
        .with_help("Consider using 'export default' or another module format instead.")
        .with_label(span)
        .with_error_code("TS", "1203")
}

pub fn ambient_module_nested(span: Span) -> OxcDiagnostic {
    OxcDiagnostic::warn("Ambient modules cannot be nested in other modules or namespaces.")
        .with_label(span)
}

pub fn namespace_exporting_non_const(span: Span) -> OxcDiagnostic {
    OxcDiagnostic::warn("Namespaces exporting non-const are not supported by Babel. Change to const or see: https://babeljs.io/docs/en/babel-plugin-transform-typescript")
        .with_label(span)
}

pub fn namespace_not_supported(span: Span) -> OxcDiagnostic {
    OxcDiagnostic::warn("Namespace not marked type-only declare. Non-declarative namespaces are only supported experimentally in Babel. To enable and review caveats see: https://babeljs.io/docs/en/babel-plugin-transform-typescript")
        .with_label(span)
}
