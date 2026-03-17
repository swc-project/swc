use std::{error::Error, fmt};

use swc_common::Span;

/// Error severity compatible with React Compiler diagnostics.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ErrorSeverity {
    Error,
    Warning,
    Info,
}

/// Error categories used by the compiler.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ErrorCategory {
    CapitalizedCalls,
    Config,
    EffectDependencies,
    EffectExhaustiveDependencies,
    EffectDerivationsOfState,
    EffectSetState,
    ErrorBoundaries,
    Fbt,
    Gating,
    Globals,
    Hooks,
    Immutability,
    IncompatibleLibrary,
    Invariant,
    MemoDependencies,
    PreserveManualMemo,
    Purity,
    Refs,
    RenderSetState,
    StaticComponents,
    Todo,
    Syntax,
    UnsupportedSyntax,
    Suppression,
    Pipeline,
    UseMemo,
    Validation,
    VoidUseMemo,
}

/// A diagnostic detail emitted by the compiler.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CompilerErrorDetail {
    pub severity: ErrorSeverity,
    pub category: ErrorCategory,
    pub reason: String,
    pub description: Option<String>,
    pub loc: Option<Span>,
    pub suggestions: Option<Vec<String>>,
}

impl CompilerErrorDetail {
    pub fn error(category: ErrorCategory, reason: impl Into<String>) -> Self {
        Self {
            severity: ErrorSeverity::Error,
            category,
            reason: reason.into(),
            description: None,
            loc: None,
            suggestions: None,
        }
    }
}

/// Compiler diagnostic wrapper.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CompilerDiagnostic {
    pub severity: ErrorSeverity,
    pub detail: CompilerErrorDetail,
}

/// Aggregated compiler error.
#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub struct CompilerError {
    pub details: Vec<CompilerErrorDetail>,
}

impl CompilerError {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_detail(detail: CompilerErrorDetail) -> Self {
        Self {
            details: vec![detail],
        }
    }

    pub fn invalid_config(reason: impl Into<String>, description: impl Into<String>) -> Self {
        let mut detail = CompilerErrorDetail::error(ErrorCategory::Config, reason);
        detail.description = Some(description.into());
        Self::with_detail(detail)
    }

    pub fn invariant(reason: impl Into<String>) -> Self {
        Self::with_detail(CompilerErrorDetail::error(ErrorCategory::Invariant, reason))
    }

    pub fn push(&mut self, detail: CompilerErrorDetail) {
        self.details.push(detail);
    }

    pub fn extend(&mut self, other: Self) {
        self.details.extend(other.details);
    }

    pub fn has_any_errors(&self) -> bool {
        self.details
            .iter()
            .any(|detail| detail.severity == ErrorSeverity::Error)
    }

    pub fn has_critical_errors(&self) -> bool {
        self.details.iter().any(|detail| {
            detail.severity == ErrorSeverity::Error
                && matches!(
                    detail.category,
                    ErrorCategory::Config | ErrorCategory::Invariant
                )
        })
    }
}

impl fmt::Display for CompilerError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        if self.details.is_empty() {
            return write!(f, "React Compiler failed without diagnostics");
        }

        writeln!(f, "Found {} errors:", self.details.len())?;
        for detail in &self.details {
            writeln!(f)?;
            writeln!(f, "{:?}: {}", detail.severity, detail.reason)?;
            if let Some(description) = &detail.description {
                writeln!(f, "{description}")?;
            }
            writeln!(f, "Category: {:?}", detail.category)?;
        }
        Ok(())
    }
}

impl Error for CompilerError {}
