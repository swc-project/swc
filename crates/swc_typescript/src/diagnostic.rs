//! References
//! * <https://github.com/oxc-project/oxc/blob/main/crates/oxc_isolated_declarations/src/diagnostics.rs>

use std::{borrow::Cow, sync::Arc};

use swc_common::{FileName, Span};

use crate::fast_dts::FastDts;

#[derive(Debug, Clone)]
pub struct SourceRange {
    pub filename: Arc<FileName>,
    pub span: Span,
}

#[derive(Debug, Clone)]
pub struct DtsIssue {
    pub range: SourceRange,
    pub message: Cow<'static, str>,
}

impl FastDts {
    pub fn function_must_have_explicit_return_type(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9007: Function must have an explicit return type annotation with \
             --isolatedDeclarations.",
            span,
        );
    }

    pub fn method_must_have_explicit_return_type(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9008: Method must have an explicit return type annotation with \
             --isolatedDeclarations.",
            span,
        );
    }

    pub fn accessor_must_have_explicit_return_type(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9009: At least one accessor must have an explicit return type annotation with \
             --isolatedDeclarations.",
            span,
        );
    }

    pub fn variable_must_have_explicit_type(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9010: Variable must have an explicit type annotation with --isolatedDeclarations.",
            span,
        );
    }

    pub fn parameter_must_have_explicit_type(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9011: Parameter must have an explicit type annotation with --isolatedDeclarations.",
            span,
        );
    }

    pub fn property_must_have_explicit_type(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9012: Property must have an explicit type annotation with --isolatedDeclarations.",
            span,
        );
    }

    pub fn inferred_type_of_expression(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9013: Expression type can't be inferred with --isolatedDeclarations.",
            span,
        );
    }

    pub fn signature_computed_property_name(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9014: Computed properties must be number or string literals, variables or dotted \
             expressions with --isolatedDeclarations.",
            span,
        );
    }

    pub fn object_with_spread_assignments(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9015: Objects that contain spread assignments can't be inferred with \
             --isolatedDeclarations.",
            span,
        );
    }

    pub fn shorthand_property(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9016: Objects that contain shorthand properties can't be inferred with \
             --isolatedDeclarations.",
            span,
        );
    }

    pub fn array_inferred(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9017: Only const arrays can be inferred with --isolatedDeclarations.",
            span,
        );
    }

    pub fn arrays_with_spread_elements(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9018: Arrays with spread elements can't inferred with --isolatedDeclarations.",
            span,
        );
    }

    pub fn binding_element_export(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9019: Binding elements can't be exported directly with --isolatedDeclarations.",
            span,
        );
    }

    pub fn enum_member_initializers(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9020: Enum member initializers must be computable without references to external \
             symbols with --isolatedDeclarations.",
            span,
        );
    }

    pub fn extends_clause_expression(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9021: Extends clause can't contain an expression with --isolatedDeclarations.",
            span,
        );
    }

    pub fn inferred_type_of_class_expression(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9022: Inference from class expressions is not supported with \
             --isolatedDeclarations.",
            span,
        );
    }

    pub fn implicitly_adding_undefined_to_type(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9025: Declaration emit for this parameter requires implicitly adding undefined to \
             it's type. This is not supported with --isolatedDeclarations.",
            span,
        );
    }

    pub fn function_with_assigning_properties(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9023: Assigning properties to functions without declaring them is not supported \
             with --isolatedDeclarations. Add an explicit declaration for the properties assigned \
             to this function.",
            span,
        );
    }

    pub fn default_export_inferred(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9037: Default exports can't be inferred with --isolatedDeclarations.",
            span,
        );
    }

    pub fn computed_property_name(&mut self, span: Span) {
        self.mark_diagnostic(
            "TS9038: Computed property names on class or object literals cannot be inferred with \
             --isolatedDeclarations.",
            span,
        );
    }

    pub fn type_containing_private_name(&mut self, name: &str, span: Span) {
        self.mark_diagnostic(
            format!(
                "TS9039: Type containing private name '{name}' can't be used with \
                 --isolatedDeclarations."
            ),
            span,
        );
    }
}
