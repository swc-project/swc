use swc_common::{errors::DiagnosticBuilder, Span};

/// Create a diagnostic for import assignment in ESM context.
///
/// TypeScript error TS1202: Import assignment cannot be used when targeting
/// ECMAScript modules.
pub fn import_equals_cannot_be_used_in_esm(span: Span) -> DiagnosticBuilder<'static> {
    DiagnosticBuilder::new(
        "Import assignment cannot be used when targeting ECMAScript modules. Consider using \
         'import * as ns from \"mod\"', 'import {a} from \"mod\"', 'import d from \"mod\"', or \
         another module format instead.",
    )
    .with_span_label(span, "import assignment")
}

/// Create a diagnostic for export assignment in ESM context.
///
/// TypeScript error TS1203: Export assignment cannot be used when targeting
/// ECMAScript modules.
pub fn export_assignment_cannot_bed_used_in_esm(span: Span) -> DiagnosticBuilder<'static> {
    DiagnosticBuilder::new(
        "Export assignment cannot be used when targeting ECMAScript modules. Consider using \
         'export default' or another module format instead.",
    )
    .with_span_label(span, "export assignment")
}

/// Create a diagnostic for nested ambient modules.
///
/// Ambient modules cannot be nested in other modules or namespaces.
pub fn ambient_module_nested(span: Span) -> DiagnosticBuilder<'static> {
    DiagnosticBuilder::new("Ambient modules cannot be nested in other modules or namespaces.")
        .with_span_label(span, "ambient module")
}

/// Create a diagnostic for namespaces exporting non-const enums.
///
/// Babel does not support namespaces exporting non-const enums.
pub fn namespace_exporting_non_const(span: Span) -> DiagnosticBuilder<'static> {
    DiagnosticBuilder::new(
        "Namespaces exporting non-const are not supported by Babel. \
         Change to const or see: https://babeljs.io/docs/en/babel-plugin-transform-typescript",
    )
    .with_span_label(span, "non-const enum export")
}

/// Create a diagnostic for non-declarative namespaces.
///
/// Non-declarative namespaces are only supported experimentally in Babel.
pub fn namespace_not_supported(span: Span) -> DiagnosticBuilder<'static> {
    DiagnosticBuilder::new(
        "Namespace not marked type-only declare. Non-declarative namespaces are only \
         supported experimentally in Babel. To enable and review caveats see: \
         https://babeljs.io/docs/en/babel-plugin-transform-typescript",
    )
    .with_span_label(span, "namespace")
}
