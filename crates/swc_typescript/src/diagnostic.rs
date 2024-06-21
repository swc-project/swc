use std::sync::Arc;

use swc_common::{FileName, Span};

#[derive(Debug, Clone)]
pub struct SourceRange {
    pub filename: Arc<FileName>,
    pub range: Span,
}

#[derive(Debug, Clone, thiserror::Error)]
pub enum DtsIssue {
    #[error("unable to infer type from expression or declaration")]
    UnableToInferType { range: SourceRange },
    #[error("unable to infer type, falling back to any type")]
    UnableToInferTypeFallbackAny { range: SourceRange },
    #[error("unable to infer type from object property, skipping")]
    UnableToInferTypeFromProp { range: SourceRange },
    #[error("unable to infer type from spread, skipping")]
    UnableToInferTypeFromSpread { range: SourceRange },
    #[error("cannot infer type from using, skipping")]
    UnsupportedUsing { range: SourceRange },
}

impl DtsIssue {
    pub fn range(&self) -> Option<&SourceRange> {
        match self {
            DtsIssue::UnableToInferType { range } => Some(range),
            DtsIssue::UnableToInferTypeFallbackAny { range } => Some(range),
            DtsIssue::UnableToInferTypeFromProp { range } => Some(range),
            DtsIssue::UnableToInferTypeFromSpread { range } => Some(range),
            DtsIssue::UnsupportedUsing { range } => Some(range),
        }
    }
}
