pub struct SrcRange {}

#[derive(Debug, Clone, thiserror::Error)]
pub enum DtsIssue {
    #[error("unable to infer type from expression or declaration")]
    UnableToInferType { range: FastCheckDiagnosticRange },
    #[error("unable to infer type, falling back to any type")]
    UnableToInferTypeFallbackAny { range: FastCheckDiagnosticRange },
    #[error("unable to infer type from object property, skipping")]
    UnableToInferTypeFromProp { range: FastCheckDiagnosticRange },
    #[error("unable to infer type from spread, skipping")]
    UnableToInferTypeFromSpread { range: FastCheckDiagnosticRange },
    #[error("cannot infer type from using, skipping")]
    UnsupportedUsing { range: FastCheckDiagnosticRange },
}
