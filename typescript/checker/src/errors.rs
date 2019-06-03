use swc_common::Span;
use swc_ecma_ast::TsType;

#[derive(Debug, Clone)]
pub enum Error {
    ShouldIncludeUndefinedType {
        /// Span of the variable
        span: Span,
    },

    AssignFailed {
        left: TsType,
        right: TsType,
    },

    /// a or b or c
    UnionError {
        errors: Vec<Error>,
    },

    CannotAssingToThis {
        span: Span,
    },

    MayBeUndefined {
        /// Span of the variable
        span: Span,
    },
}
