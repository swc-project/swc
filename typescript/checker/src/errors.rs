use swc_common::{errors::Handler, Span};
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

    IntersectionError {
        error: Box<Error>,
    },

    CannotAssingToThis {
        span: Span,
    },

    MayBeUndefined {
        /// Span of the variable
        span: Span,
    },

    UndefinedSymbol {
        span: Span,
    },

    NoSuchExport {
        span: Span,
    },
}

impl Error {
    pub fn emit(self, h: &Handler) {
        h.struct_err(&format!("{:?}", self)).emit();
    }
}
