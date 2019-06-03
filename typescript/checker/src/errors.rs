use swc_common::Span;

#[derive(Debug, Clone)]
pub enum Error {
    ShouldIncludeUndefinedType {
        /// Span of the variable
        span: Span,
    },

    CannotAssingToThis {
        span: Span,
    },

    MayBeUndefined {
        /// Span of the variable
        span: Span,
    },
}
