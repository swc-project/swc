// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

use react_compiler::entrypoint::compile_result::{
    CompileResult, CompilerErrorDetailInfo, CompilerErrorInfo, CompilerErrorItemInfo, LoggerEvent,
    LoggerPosition, LoggerSourceLocation,
};
use serde::Serialize;

#[derive(Debug, Clone)]
pub enum Severity {
    Error,
    Warning,
}
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum DiagnosticSeverity {
    Error,
    Warning,
}

impl From<&Severity> for DiagnosticSeverity {
    fn from(value: &Severity) -> Self {
        match value {
            Severity::Error => Self::Error,
            Severity::Warning => Self::Warning,
        }
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnosticPosition {
    pub line: u32,
    pub column: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub index: Option<u32>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnosticLocation {
    pub start: DiagnosticPosition,
    pub end: DiagnosticPosition,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub filename: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub identifier_name: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnosticDetail {
    pub kind: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub loc: Option<DiagnosticLocation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
}

#[derive(Debug, Clone)]
pub struct DiagnosticMessage {
    pub severity: Severity,
    pub message: String,
    pub span: Option<(u32, u32)>,
    pub rule_id: Option<String>,
    pub category: Option<String>,
    pub reason: Option<String>,
    pub description: Option<String>,
    pub loc: Option<DiagnosticLocation>,
    pub details: Vec<DiagnosticDetail>,
}

/// Convert a [`CompileResult`] into SWC-facing diagnostics.
#[must_use]
pub fn compile_result_to_diagnostics(
    result: &CompileResult,
    emit_success_error_diagnostics: bool,
) -> Vec<DiagnosticMessage> {
    let mut diagnostics = Vec::new();

    match result {
        CompileResult::Success { events, .. } => {
            for event in events {
                if let Some(diag) = event_to_diagnostic(event, !emit_success_error_diagnostics) {
                    diagnostics.push(diag);
                }
            }
        }
        CompileResult::Error { error, events, .. } => {
            // Add the main error
            diagnostics.push(error_info_to_diagnostic(error));

            // Process logger events from failed compilation
            for event in events {
                if let Some(diag) = event_to_diagnostic(event, false) {
                    diagnostics.push(diag);
                }
            }
        }
    }

    diagnostics
}

fn error_info_to_diagnostic(error: &CompilerErrorInfo) -> DiagnosticMessage {
    let mut message = format!("[ReactCompiler] {}", error.reason);
    if let Some(description) = &error.description {
        message.push_str(": ");
        message.push_str(description);
    }

    DiagnosticMessage {
        severity: Severity::Error,
        message,
        span: None,
        rule_id: None,
        category: None,
        reason: Some(error.reason.clone()),
        description: error.description.clone(),
        loc: None,
        details: Vec::new(),
    }
}

fn error_detail_to_diagnostic(
    detail: &CompilerErrorDetailInfo,
    fn_loc: Option<&LoggerSourceLocation>,
    suppress_error_diagnostics: bool,
) -> Option<DiagnosticMessage> {
    let message = if let Some(description) = &detail.description {
        format!(
            "[ReactCompiler] {}: {}. {}",
            detail.category, detail.reason, description
        )
    } else {
        format!("[ReactCompiler] {}: {}", detail.category, detail.reason)
    };

    // This is React Compiler's display severity for the diagnostic detail. Fatal
    // transform errors are represented separately by `CompileResult::Error`.
    let severity = match detail.severity.as_str() {
        "Off" => return None,
        "Error" if suppress_error_diagnostics => return None,
        "Error" => Severity::Error,
        // `Warning`, `Hint`, and any unknown future value surface as warnings.
        _ => Severity::Warning,
    };

    Some(DiagnosticMessage {
        severity,
        message,
        span: primary_location(detail, fn_loc)
            .and_then(|loc| Some((loc.start.index?, loc.end.index?))),
        rule_id: rule_id_for_category(&detail.category).map(str::to_string),
        category: Some(detail.category.clone()),
        reason: Some(detail.reason.clone()),
        description: detail.description.clone(),
        loc: primary_location(detail, fn_loc).map(Into::into),
        details: detail
            .details
            .as_deref()
            .unwrap_or_default()
            .iter()
            .map(Into::into)
            .collect(),
    })
}

fn event_to_diagnostic(
    event: &LoggerEvent,
    suppress_error_diagnostics: bool,
) -> Option<DiagnosticMessage> {
    match event {
        LoggerEvent::CompileSuccess { .. } | LoggerEvent::CompileSkip { .. } => None,
        LoggerEvent::CompileError { detail, fn_loc } => {
            error_detail_to_diagnostic(detail, fn_loc.as_ref(), suppress_error_diagnostics)
        }
        LoggerEvent::CompileErrorWithLoc { detail, fn_loc } => {
            error_detail_to_diagnostic(detail, Some(fn_loc), suppress_error_diagnostics)
        }
        LoggerEvent::CompileUnexpectedThrow { .. } | LoggerEvent::PipelineError { .. }
            if suppress_error_diagnostics =>
        {
            None
        }
        LoggerEvent::CompileUnexpectedThrow { data, .. } => Some(DiagnosticMessage {
            severity: Severity::Error,
            message: format!("[ReactCompiler] Unexpected error: {data}"),
            span: None,
            rule_id: None,
            category: None,
            reason: Some("Unexpected error".into()),
            description: Some(data.clone()),
            loc: None,
            details: Vec::new(),
        }),
        LoggerEvent::PipelineError { data, .. } => Some(DiagnosticMessage {
            severity: Severity::Error,
            message: format!("[ReactCompiler] Pipeline error: {data}"),
            span: None,
            rule_id: None,
            category: None,
            reason: Some("Pipeline error".into()),
            description: Some(data.clone()),
            loc: None,
            details: Vec::new(),
        }),
    }
}

fn primary_location<'a>(
    detail: &'a CompilerErrorDetailInfo,
    fn_loc: Option<&'a LoggerSourceLocation>,
) -> Option<&'a LoggerSourceLocation> {
    detail
        .details
        .as_deref()
        .and_then(|details| {
            details
                .iter()
                .find(|detail| detail.kind == "error")
                .and_then(|detail| detail.loc.as_ref())
        })
        .or(detail.loc.as_ref())
        .or(fn_loc)
}

fn rule_id_for_category(category: &str) -> Option<&'static str> {
    Some(match category {
        "CapitalizedCalls" => "capitalized-calls",
        "Config" => "config",
        "EffectDependencies" => "memoized-effect-dependencies",
        "EffectExhaustiveDependencies" => "exhaustive-effect-dependencies",
        "EffectDerivationsOfState" => "no-deriving-state-in-effects",
        "EffectSetState" => "set-state-in-effect",
        "ErrorBoundaries" => "error-boundaries",
        "FBT" => "fbt",
        "Gating" => "gating",
        "Globals" => "globals",
        "Hooks" => "hooks",
        "Immutability" => "immutability",
        "Invariant" => "invariant",
        "PreserveManualMemo" => "preserve-manual-memoization",
        "Purity" => "purity",
        "Refs" => "refs",
        "RenderSetState" => "set-state-in-render",
        "StaticComponents" => "static-components",
        "Suppression" => "rule-suppression",
        "Syntax" => "syntax",
        "Todo" => "todo",
        "UnsupportedSyntax" => "unsupported-syntax",
        "UseMemo" => "use-memo",
        "VoidUseMemo" => "void-use-memo",
        "MemoDependencies" => "memo-dependencies",
        "IncompatibleLibrary" => "incompatible-library",
        _ => return None,
    })
}

impl From<&LoggerPosition> for DiagnosticPosition {
    fn from(value: &LoggerPosition) -> Self {
        Self {
            line: value.line,
            column: value.column,
            index: value.index,
        }
    }
}

impl From<&LoggerSourceLocation> for DiagnosticLocation {
    fn from(value: &LoggerSourceLocation) -> Self {
        Self {
            start: (&value.start).into(),
            end: (&value.end).into(),
            filename: value.filename.clone(),
            identifier_name: value.identifier_name.clone(),
        }
    }
}

impl From<&CompilerErrorItemInfo> for DiagnosticDetail {
    fn from(value: &CompilerErrorItemInfo) -> Self {
        Self {
            kind: value.kind.clone(),
            loc: value.loc.as_ref().map(Into::into),
            message: value.message.clone(),
        }
    }
}

#[cfg(test)]
mod tests {
    use react_compiler::entrypoint::compile_result::{
        CompileResult, CompilerErrorDetailInfo, LoggerEvent, LoggerPosition, LoggerSourceLocation,
    };

    use super::{compile_result_to_diagnostics, Severity};

    fn loc() -> LoggerSourceLocation {
        LoggerSourceLocation {
            start: LoggerPosition {
                line: 3,
                column: 10,
                index: Some(42),
            },
            end: LoggerPosition {
                line: 3,
                column: 21,
                index: Some(53),
            },
            filename: Some("input.tsx".into()),
            identifier_name: Some("value".into()),
        }
    }

    fn detail(category: &str, severity: &str) -> CompilerErrorDetailInfo {
        CompilerErrorDetailInfo {
            category: category.into(),
            reason: format!("{category} reason"),
            description: Some(format!("{category} description")),
            severity: severity.into(),
            suggestions: None,
            details: None,
            loc: Some(loc()),
        }
    }

    fn diagnostic_for(category: &str, severity: &str) -> super::DiagnosticMessage {
        let result = CompileResult::Success {
            ast: None,
            events: vec![LoggerEvent::CompileErrorWithLoc {
                fn_loc: loc(),
                detail: detail(category, severity),
            }],
            ordered_log: Vec::new(),
            renames: Vec::new(),
            timing: Vec::new(),
        };

        compile_result_to_diagnostics(&result, true)
            .into_iter()
            .next()
            .unwrap()
    }

    #[test]
    fn maps_documented_react_compiler_rule_ids() {
        let cases = [
            ("Config", "config"),
            ("ErrorBoundaries", "error-boundaries"),
            ("Gating", "gating"),
            ("Globals", "globals"),
            ("Immutability", "immutability"),
            ("IncompatibleLibrary", "incompatible-library"),
            ("PreserveManualMemo", "preserve-manual-memoization"),
            ("Purity", "purity"),
            ("Refs", "refs"),
            ("EffectSetState", "set-state-in-effect"),
            ("RenderSetState", "set-state-in-render"),
            ("StaticComponents", "static-components"),
            ("UnsupportedSyntax", "unsupported-syntax"),
            ("UseMemo", "use-memo"),
        ];

        for (category, rule_id) in cases {
            let diagnostic = diagnostic_for(category, "Error");
            assert_eq!(diagnostic.category.as_deref(), Some(category));
            assert_eq!(diagnostic.rule_id.as_deref(), Some(rule_id));
        }
    }

    fn assert_category_maps_to_rule_id(category: &str, rule_id: &str) {
        let diagnostic = diagnostic_for(category, "Error");
        assert_eq!(diagnostic.category.as_deref(), Some(category));
        assert_eq!(diagnostic.rule_id.as_deref(), Some(rule_id));
    }

    #[test]
    fn react_docs_rule_id_config() {
        assert_category_maps_to_rule_id("Config", "config");
    }

    #[test]
    fn react_docs_rule_id_error_boundaries() {
        assert_category_maps_to_rule_id("ErrorBoundaries", "error-boundaries");
    }

    #[test]
    fn react_docs_rule_id_gating() {
        assert_category_maps_to_rule_id("Gating", "gating");
    }

    #[test]
    fn react_docs_rule_id_globals() {
        assert_category_maps_to_rule_id("Globals", "globals");
    }

    #[test]
    fn react_docs_rule_id_immutability() {
        assert_category_maps_to_rule_id("Immutability", "immutability");
    }

    #[test]
    fn react_docs_rule_id_incompatible_library() {
        assert_category_maps_to_rule_id("IncompatibleLibrary", "incompatible-library");
    }

    #[test]
    fn react_docs_rule_id_preserve_manual_memoization() {
        assert_category_maps_to_rule_id("PreserveManualMemo", "preserve-manual-memoization");
    }

    #[test]
    fn react_docs_rule_id_purity() {
        assert_category_maps_to_rule_id("Purity", "purity");
    }

    #[test]
    fn react_docs_rule_id_refs() {
        assert_category_maps_to_rule_id("Refs", "refs");
    }

    #[test]
    fn react_docs_rule_id_set_state_in_effect() {
        assert_category_maps_to_rule_id("EffectSetState", "set-state-in-effect");
    }

    #[test]
    fn react_docs_rule_id_set_state_in_render() {
        assert_category_maps_to_rule_id("RenderSetState", "set-state-in-render");
    }

    #[test]
    fn react_docs_rule_id_static_components() {
        assert_category_maps_to_rule_id("StaticComponents", "static-components");
    }

    #[test]
    fn react_docs_rule_id_unsupported_syntax() {
        assert_category_maps_to_rule_id("UnsupportedSyntax", "unsupported-syntax");
    }

    #[test]
    fn react_docs_rule_id_use_memo() {
        assert_category_maps_to_rule_id("UseMemo", "use-memo");
    }

    #[test]
    fn react_docs_rule_id_exhaustive_deps_is_not_react_compiler_backed() {
        assert!(![
            "Config",
            "ErrorBoundaries",
            "Gating",
            "Globals",
            "Immutability",
            "IncompatibleLibrary",
            "PreserveManualMemo",
            "Purity",
            "Refs",
            "EffectSetState",
            "RenderSetState",
            "StaticComponents",
            "UnsupportedSyntax",
            "UseMemo",
        ]
        .into_iter()
        .any(|category| {
            diagnostic_for(category, "Error").rule_id.as_deref() == Some("exhaustive-deps")
        }));
    }

    #[test]
    fn react_docs_rule_id_rules_of_hooks_is_not_the_compiler_hooks_id() {
        let diagnostic = diagnostic_for("Hooks", "Error");
        assert_eq!(diagnostic.rule_id.as_deref(), Some("hooks"));
        assert_ne!(diagnostic.rule_id.as_deref(), Some("rules-of-hooks"));
    }

    #[test]
    fn react_docs_rule_id_component_hook_factories_is_deprecated_not_compiler_backed() {
        assert!(![
            "Config",
            "ErrorBoundaries",
            "Gating",
            "Globals",
            "Immutability",
            "IncompatibleLibrary",
            "PreserveManualMemo",
            "Purity",
            "Refs",
            "EffectSetState",
            "RenderSetState",
            "StaticComponents",
            "UnsupportedSyntax",
            "UseMemo",
        ]
        .into_iter()
        .any(|category| {
            diagnostic_for(category, "Error").rule_id.as_deref() == Some("component-hook-factories")
        }));
    }

    #[test]
    fn preserves_structured_diagnostic_location() {
        let diagnostic = diagnostic_for("Refs", "Error");
        let loc = diagnostic.loc.expect("expected loc");

        assert_eq!(loc.start.line, 3);
        assert_eq!(loc.start.column, 10);
        assert_eq!(loc.start.index, Some(42));
        assert_eq!(loc.end.line, 3);
        assert_eq!(loc.end.column, 21);
        assert_eq!(loc.end.index, Some(53));
        assert_eq!(loc.filename.as_deref(), Some("input.tsx"));
        assert_eq!(loc.identifier_name.as_deref(), Some("value"));
    }

    #[test]
    fn maps_warning_severity_without_suppressing_lint_output() {
        let diagnostic = diagnostic_for("UnsupportedSyntax", "Warning");

        assert!(matches!(diagnostic.severity, Severity::Warning));
        assert_eq!(diagnostic.rule_id.as_deref(), Some("unsupported-syntax"));
    }

    #[test]
    fn maps_compiler_hooks_category_to_hooks_not_rules_of_hooks() {
        let diagnostic = diagnostic_for("Hooks", "Error");

        assert_eq!(diagnostic.category.as_deref(), Some("Hooks"));
        assert_eq!(diagnostic.rule_id.as_deref(), Some("hooks"));
    }

    #[test]
    fn documents_all_react_docs_recommended_rule_ids() {
        let compiler_backed = [
            "config",
            "error-boundaries",
            "gating",
            "globals",
            "immutability",
            "incompatible-library",
            "preserve-manual-memoization",
            "purity",
            "refs",
            "set-state-in-effect",
            "set-state-in-render",
            "static-components",
            "unsupported-syntax",
            "use-memo",
        ];
        let non_compiler_backed_in_this_path = [
            // Standalone eslint-plugin-react-hooks rules.
            "exhaustive-deps",
            "rules-of-hooks",
            // Deprecated wrapper rule in the local React plugin index, not a
            // React Compiler diagnostic category.
            "component-hook-factories",
        ];

        let mut documented_recommended = compiler_backed
            .into_iter()
            .chain(non_compiler_backed_in_this_path)
            .collect::<Vec<_>>();
        documented_recommended.sort_unstable();

        assert_eq!(
            documented_recommended,
            vec![
                "component-hook-factories",
                "config",
                "error-boundaries",
                "exhaustive-deps",
                "gating",
                "globals",
                "immutability",
                "incompatible-library",
                "preserve-manual-memoization",
                "purity",
                "refs",
                "rules-of-hooks",
                "set-state-in-effect",
                "set-state-in-render",
                "static-components",
                "unsupported-syntax",
                "use-memo",
            ]
        );
    }
}
