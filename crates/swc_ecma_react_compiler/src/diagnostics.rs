// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

use react_compiler::entrypoint::compile_result::{
    CompileResult, CompilerErrorDetailInfo, CompilerErrorInfo, LoggerEvent,
};

#[derive(Debug, Clone)]
pub enum Severity {
    Error,
    Warning,
}

#[derive(Debug, Clone)]
pub struct DiagnosticMessage {
    pub severity: Severity,
    pub message: String,
    pub span: Option<(u32, u32)>,
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
    }
}

fn error_detail_to_diagnostic(
    detail: &CompilerErrorDetailInfo,
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
        span: None,
    })
}

fn event_to_diagnostic(
    event: &LoggerEvent,
    suppress_error_diagnostics: bool,
) -> Option<DiagnosticMessage> {
    match event {
        LoggerEvent::CompileSuccess { .. } | LoggerEvent::CompileSkip { .. } => None,
        LoggerEvent::CompileError { detail, .. }
        | LoggerEvent::CompileErrorWithLoc { detail, .. } => {
            error_detail_to_diagnostic(detail, suppress_error_diagnostics)
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
        }),
        LoggerEvent::PipelineError { data, .. } => Some(DiagnosticMessage {
            severity: Severity::Error,
            message: format!("[ReactCompiler] Pipeline error: {data}"),
            span: None,
        }),
    }
}
