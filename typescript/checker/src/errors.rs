use swc_common::Span;
use swc_ecma_ast::TsType;

#[derive(Debug, Clone, PartialEq)]
pub enum Error {
    ShouldIncludeUndefinedType {
        /// Span of the variable
        span: Span,
    },

    AssignFailed {
        left: TsType,
        right: TsType,
        cause: Option<Box<Error>>,
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
